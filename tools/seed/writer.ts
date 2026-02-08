/**
 * DB insertion orchestrator.
 * Takes a SeedConfig and writes all data for a given session.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../src/lib/supabase/types";
import type { SeedConfig, ThreadTemplate, MessageTemplate } from "./types";

export interface WriteResult {
  sessionId: string;
  contacts: number;
  threads: number;
  emails: number;
  labels: number;
  attachments: number;
  snoozeEntries: number;
  signatures: number;
}

export interface ValidationError {
  threadId: string;
  field: string;
  message: string;
}

/**
 * Validate all cross-references in the config before writing.
 * Returns an array of errors (empty = valid).
 */
export function validateConfig(config: SeedConfig): ValidationError[] {
  const errors: ValidationError[] = [];
  const contactIds = new Set(config.contacts.map((c) => c.id));
  const labelNames = new Set(config.labels.map((l) => l.name));

  // Check for duplicate contact IDs
  const seenContactIds = new Set<string>();
  for (const contact of config.contacts) {
    if (seenContactIds.has(contact.id)) {
      errors.push({
        threadId: "",
        field: "contacts",
        message: `Duplicate contact ID: "${contact.id}"`,
      });
    }
    seenContactIds.add(contact.id);
  }

  // Check for duplicate thread IDs
  const seenThreadIds = new Set<string>();
  for (const thread of config.threads) {
    if (seenThreadIds.has(thread.id)) {
      errors.push({
        threadId: thread.id,
        field: "id",
        message: `Duplicate thread ID: "${thread.id}"`,
      });
    }
    seenThreadIds.add(thread.id);
  }

  for (const thread of config.threads) {
    // Validate primary contact reference
    if (!contactIds.has(thread.contactId)) {
      errors.push({
        threadId: thread.id,
        field: "contactId",
        message: `Unknown contact "${thread.contactId}"`,
      });
    }

    // Validate CC contacts
    if (thread.ccContactIds) {
      for (const ccId of thread.ccContactIds) {
        if (!contactIds.has(ccId)) {
          errors.push({
            threadId: thread.id,
            field: "ccContactIds",
            message: `Unknown CC contact "${ccId}"`,
          });
        }
      }
    }

    // Validate message senders
    for (let i = 0; i < thread.messages.length; i++) {
      const msg = thread.messages[i];
      if (msg.from !== "self" && !contactIds.has(msg.from)) {
        errors.push({
          threadId: thread.id,
          field: `messages[${i}].from`,
          message: `Unknown sender "${msg.from}"`,
        });
      }
    }

    // Validate label references
    if (thread.labels) {
      for (const label of thread.labels) {
        if (!labelNames.has(label)) {
          errors.push({
            threadId: thread.id,
            field: "labels",
            message: `Unknown label "${label}"`,
          });
        }
      }
    }

    // Validate messages exist
    if (thread.messages.length === 0) {
      errors.push({
        threadId: thread.id,
        field: "messages",
        message: "Thread has no messages",
      });
    }
  }

  return errors;
}

/**
 * Write the full seed dataset to the database for a session.
 */
export async function writeSeedData(
  supabase: SupabaseClient<Database>,
  sessionId: string,
  config: SeedConfig,
): Promise<WriteResult> {
  const now = new Date();
  const result: WriteResult = {
    sessionId,
    contacts: 0,
    threads: 0,
    emails: 0,
    labels: 0,
    attachments: 0,
    snoozeEntries: 0,
    signatures: 0,
  };

  // 1. Create "self" contact
  const { data: selfContact, error: selfError } = await supabase
    .from("gmail_contacts")
    .insert({
      session_id: sessionId,
      name: "Me",
      email: "guest@gmail-redesign.app",
      is_self: true,
    })
    .select("id")
    .single();

  if (selfError) throw new Error(`Failed to create self contact: ${selfError.message}`);

  // 2. Create all contacts (batch insert)
  const contactInserts = config.contacts.map((c) => ({
    session_id: sessionId,
    name: c.name,
    email: c.email,
    avatar_url: c.avatarUrl ?? null,
    is_self: false,
  }));

  const { data: contacts, error: contactsError } = await supabase
    .from("gmail_contacts")
    .insert(contactInserts)
    .select("id");

  if (contactsError) throw new Error(`Failed to create contacts: ${contactsError.message}`);

  // Build slug → UUID map
  const contactMap = new Map<string, string>();
  contactMap.set("self", selfContact.id);
  config.contacts.forEach((template, i) => {
    contactMap.set(template.id, contacts[i].id);
  });
  result.contacts = contacts.length;

  // 3. Create labels (batch insert)
  const systemLabelInserts = config.labels
    .filter((l) => l.type === "system")
    .map((l) => ({
      session_id: sessionId,
      name: l.name,
      type: "system" as const,
      position: l.position,
    }));

  const userLabelInserts = config.labels
    .filter((l) => l.type === "user")
    .map((l) => ({
      session_id: sessionId,
      name: l.name,
      color: l.color ?? null,
      type: "user" as const,
      position: l.position,
    }));

  const { data: systemLabels, error: sysErr } = await supabase
    .from("gmail_labels")
    .insert(systemLabelInserts)
    .select("id, name");

  if (sysErr) throw new Error(`Failed to create system labels: ${sysErr.message}`);

  const { data: userLabels, error: userErr } = await supabase
    .from("gmail_labels")
    .insert(userLabelInserts)
    .select("id, name");

  if (userErr) throw new Error(`Failed to create user labels: ${userErr.message}`);

  // Build label name → UUID map
  const labelMap = new Map<string, string>();
  systemLabels.forEach((l) => labelMap.set(l.name, l.id));
  userLabels.forEach((l) => labelMap.set(l.name, l.id));
  result.labels = systemLabels.length + userLabels.length;

  // 4. Create threads, emails, recipients, labels, attachments
  for (const thread of config.threads) {
    const lastMsg = thread.messages[thread.messages.length - 1];
    const lastMsgTime = new Date(now.getTime() - lastMsg.hoursAgo * 3600_000);
    const isDraft = thread.flags?.isDraft ?? false;
    const isSpam = thread.flags?.isSpam ?? false;
    const isTrash = thread.flags?.isTrash ?? false;

    // Create thread
    const { data: dbThread, error: threadErr } = await supabase
      .from("gmail_threads")
      .insert({
        session_id: sessionId,
        subject: thread.subject,
        last_message_at: lastMsgTime.toISOString(),
        message_count: thread.messages.length,
      })
      .select("id")
      .single();

    if (threadErr) throw new Error(`Failed to create thread "${thread.id}": ${threadErr.message}`);
    result.threads++;

    // Create emails in thread
    for (let msgIdx = 0; msgIdx < thread.messages.length; msgIdx++) {
      const msg = thread.messages[msgIdx];
      const isLastMessage = msgIdx === thread.messages.length - 1;
      const sentAt = new Date(now.getTime() - msg.hoursAgo * 3600_000);
      const fromContactId = contactMap.get(msg.from)!;

      const snippet =
        msg.bodyText.length > 140
          ? msg.bodyText.slice(0, 140).trimEnd() + "..."
          : msg.bodyText;

      // Compute snooze_until for snoozed threads (on last message only)
      let snoozeUntil: string | null = null;
      if (isLastMessage && thread.flags?.snoozeHours) {
        snoozeUntil = new Date(
          now.getTime() + thread.flags.snoozeHours * 3600_000,
        ).toISOString();
      }

      const { data: email, error: emailErr } = await supabase
        .from("gmail_emails")
        .insert({
          session_id: sessionId,
          thread_id: dbThread.id,
          from_contact_id: fromContactId,
          subject: thread.subject,
          body_html: msg.bodyHtml,
          body_text: msg.bodyText,
          snippet,
          sent_at: sentAt.toISOString(),
          is_draft: isDraft && isLastMessage,
          is_read: msg.isRead,
          is_starred: isLastMessage ? (thread.flags?.isStarred ?? false) : false,
          is_important: isLastMessage ? (thread.flags?.isImportant ?? false) : false,
          is_spam: isSpam,
          is_trash: isTrash,
          is_archived: thread.flags?.isArchived ?? false,
          category: thread.category,
          snooze_until: snoozeUntil,
        })
        .select("id")
        .single();

      if (emailErr) throw new Error(`Failed to create email in "${thread.id}": ${emailErr.message}`);
      result.emails++;

      // Create recipients
      if (msg.from === "self") {
        // Sent by self → to primary contact + CC contacts
        const toContactId = contactMap.get(thread.contactId);
        if (toContactId) {
          await supabase.from("gmail_email_recipients").insert({
            email_id: email.id,
            contact_id: toContactId,
            type: "to",
          });
        }
        if (thread.ccContactIds) {
          for (const ccId of thread.ccContactIds) {
            const ccUuid = contactMap.get(ccId);
            if (ccUuid) {
              await supabase.from("gmail_email_recipients").insert({
                email_id: email.id,
                contact_id: ccUuid,
                type: "cc",
              });
            }
          }
        }
      } else {
        // Sent by contact → to self (+ CC contacts as CC)
        await supabase.from("gmail_email_recipients").insert({
          email_id: email.id,
          contact_id: selfContact.id,
          type: "to",
        });
        if (thread.ccContactIds) {
          for (const ccId of thread.ccContactIds) {
            if (ccId === msg.from) continue; // don't CC the sender
            const ccUuid = contactMap.get(ccId);
            if (ccUuid) {
              await supabase.from("gmail_email_recipients").insert({
                email_id: email.id,
                contact_id: ccUuid,
                type: "cc",
              });
            }
          }
        }
      }

      // Apply labels (on last message only)
      if (isLastMessage && thread.labels) {
        const labelInserts = thread.labels
          .map((name) => {
            const labelId = labelMap.get(name);
            if (!labelId) return null;
            return { email_id: email.id, label_id: labelId };
          })
          .filter((x): x is { email_id: string; label_id: string } => x !== null);

        if (labelInserts.length > 0) {
          await supabase.from("gmail_email_labels").insert(labelInserts);
        }
      }

      // Create attachments
      if (msg.attachments) {
        for (const att of msg.attachments) {
          await supabase.from("gmail_attachments").insert({
            email_id: email.id,
            filename: att.filename,
            content_type: att.contentType,
            size_bytes: att.sizeBytes,
            storage_path: att.storagePath,
          });
          result.attachments++;
        }
      }

      // Create snooze queue entry
      if (isLastMessage && snoozeUntil) {
        await supabase.from("gmail_snooze_queue").insert({
          email_id: email.id,
          session_id: sessionId,
          snooze_until: snoozeUntil,
        });
        result.snoozeEntries++;
      }
    }
  }

  // 5. Create signatures
  for (const sig of config.signatures) {
    await supabase.from("gmail_signatures").insert({
      session_id: sessionId,
      name: sig.name,
      body_html: sig.bodyHtml,
      is_default: sig.isDefault,
    });
    result.signatures++;
  }

  // 6. Mark session as seeded
  await supabase
    .from("gmail_sessions")
    .update({ is_seeded: true })
    .eq("id", sessionId);

  return result;
}

/**
 * Delete all data for a session (contacts, threads, emails, etc.).
 * The session row itself is preserved but marked as not seeded.
 */
export async function wipeSeedData(
  supabase: SupabaseClient<Database>,
  sessionId: string,
): Promise<void> {
  // Delete in dependency order (children first)
  await supabase.from("gmail_snooze_queue").delete().eq("session_id", sessionId);
  await supabase.from("gmail_signatures").delete().eq("session_id", sessionId);

  // Email children: labels, recipients, attachments reference email_id
  // We need to find all email IDs for this session first
  const { data: emails } = await supabase
    .from("gmail_emails")
    .select("id")
    .eq("session_id", sessionId);

  if (emails && emails.length > 0) {
    const emailIds = emails.map((e) => e.id);

    // Delete in batches to avoid URL length limits
    const batchSize = 100;
    for (let i = 0; i < emailIds.length; i += batchSize) {
      const batch = emailIds.slice(i, i + batchSize);
      await supabase.from("gmail_email_labels").delete().in("email_id", batch);
      await supabase.from("gmail_email_recipients").delete().in("email_id", batch);
      await supabase.from("gmail_attachments").delete().in("email_id", batch);
    }
  }

  await supabase.from("gmail_emails").delete().eq("session_id", sessionId);
  await supabase.from("gmail_threads").delete().eq("session_id", sessionId);
  await supabase.from("gmail_labels").delete().eq("session_id", sessionId);
  await supabase.from("gmail_contacts").delete().eq("session_id", sessionId);
  await supabase.from("gmail_filters").delete().eq("session_id", sessionId);

  // Mark session as not seeded
  await supabase
    .from("gmail_sessions")
    .update({ is_seeded: false })
    .eq("id", sessionId);
}
