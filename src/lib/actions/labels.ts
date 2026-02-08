"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";
import { revalidatePath } from "next/cache";
import {
  createLabelSchema,
  updateLabelSchema,
  deleteLabelSchema,
  assignLabelsSchema,
} from "@/lib/validations";

/* ─── Get Labels ────────────────────────────────────────────────────────────── */

export async function getLabels() {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { data: labels } = await supabase
    .from("gmail_labels")
    .select("id, name, color, icon, type, position")
    .eq("session_id", sessionId)
    .eq("type", "user")
    .order("position");

  return labels ?? [];
}

/* ─── Create Label ──────────────────────────────────────────────────────────── */

export async function createLabel(name: string, color: string, icon?: string) {
  createLabelSchema.parse({ name, color, icon });
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  // Get max position
  const { data: existing } = await supabase
    .from("gmail_labels")
    .select("position")
    .eq("session_id", sessionId)
    .eq("type", "user")
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

  const { data: label, error } = await supabase
    .from("gmail_labels")
    .insert({
      session_id: sessionId,
      name,
      color,
      icon: icon ?? null,
      type: "user",
      position: nextPosition,
      show_in_list: true,
      show_in_message: true,
    })
    .select("id, name, color, icon")
    .single();

  if (error) throw new Error(`Failed to create label: ${error.message}`);
  revalidatePath("/", "layout");
  return label;
}

/* ─── Update Label ──────────────────────────────────────────────────────────── */

export async function updateLabel(
  labelId: string,
  updates: { name?: string; color?: string; icon?: string },
) {
  updateLabelSchema.parse({ labelId, ...updates });
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_labels")
    .update(updates)
    .eq("id", labelId)
    .eq("session_id", sessionId)
    .eq("type", "user");

  if (error) throw new Error(`Failed to update label: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Delete Label ──────────────────────────────────────────────────────────── */

export async function deleteLabel(labelId: string) {
  deleteLabelSchema.parse({ labelId });
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  // Verify the label belongs to the current session before deleting anything
  const { data: label } = await supabase
    .from("gmail_labels")
    .select("id")
    .eq("id", labelId)
    .eq("session_id", sessionId)
    .eq("type", "user")
    .single();

  if (!label) throw new Error("Label not found");

  // Delete label assignments first, then the label itself
  await supabase.from("gmail_email_labels").delete().eq("label_id", labelId);

  const { error } = await supabase
    .from("gmail_labels")
    .delete()
    .eq("id", labelId)
    .eq("session_id", sessionId)
    .eq("type", "user");

  if (error) throw new Error(`Failed to delete label: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Assign Labels ─────────────────────────────────────────────────────────── */

export async function assignLabels(
  emailIds: string[],
  addLabelIds: string[],
  removeLabelIds: string[],
) {
  assignLabelsSchema.parse({ emailIds, addLabelIds, removeLabelIds });
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  // Verify all label IDs belong to the current session
  const allLabelIds = [...new Set([...addLabelIds, ...removeLabelIds])];
  if (allLabelIds.length > 0) {
    const { data: ownedLabels } = await supabase
      .from("gmail_labels")
      .select("id")
      .eq("session_id", sessionId)
      .in("id", allLabelIds);

    if ((ownedLabels?.length ?? 0) !== allLabelIds.length) {
      throw new Error("One or more labels not found");
    }
  }

  // Remove labels
  if (removeLabelIds.length > 0) {
    await supabase
      .from("gmail_email_labels")
      .delete()
      .in("email_id", emailIds)
      .in("label_id", removeLabelIds);
  }

  // Add labels — insert with upsert to avoid duplicates
  if (addLabelIds.length > 0) {
    const rows = emailIds.flatMap((emailId) =>
      addLabelIds.map((labelId) => ({
        email_id: emailId,
        label_id: labelId,
      })),
    );

    await supabase
      .from("gmail_email_labels")
      .upsert(rows, { onConflict: "email_id,label_id", ignoreDuplicates: true });
  }

  revalidatePath("/", "layout");
}
