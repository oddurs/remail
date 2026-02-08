"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";
import { seedSession } from "@/lib/seed/generator";

/**
 * Ensures a session row exists in the database for the current visitor.
 * If the session doesn't exist, creates it and seeds with starter data.
 * Called from the mail layout on every page load.
 */
export async function ensureSession() {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  // Check if session already exists
  const { data: existing } = await supabase
    .from("gmail_sessions")
    .select("id, is_seeded")
    .eq("id", sessionId)
    .single();

  if (existing) {
    // Update last_active_at
    await supabase
      .from("gmail_sessions")
      .update({ last_active_at: new Date().toISOString() })
      .eq("id", sessionId);

    // If session exists but wasn't seeded (edge case), seed it
    if (!existing.is_seeded) {
      await seedSession(sessionId);
    }

    return { sessionId, isNew: false };
  }

  // Create new session
  const { error: insertError } = await supabase
    .from("gmail_sessions")
    .insert({ id: sessionId });

  if (insertError) {
    throw new Error(`Failed to create session: ${insertError.message}`);
  }

  // Seed the session with starter data
  await seedSession(sessionId);

  return { sessionId, isNew: true };
}

/**
 * Get the current session's preferences.
 */
export async function getSessionPreferences() {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("gmail_sessions")
    .select(
      "theme_mode, accent_color, display_density, inbox_type, page_size, undo_send_sec, conversation_view, hover_actions, keyboard_shortcuts",
    )
    .eq("id", sessionId)
    .single();

  if (error) throw new Error(`Failed to get session: ${error.message}`);
  return data;
}

/**
 * Update session preferences.
 */
export async function updateSessionPreferences(
  preferences: Partial<{
    theme_mode: "light" | "dark" | "system";
    accent_color: string;
    display_density: "default" | "comfortable" | "compact";
    inbox_type: string;
    page_size: number;
    undo_send_sec: number;
    conversation_view: boolean;
    hover_actions: boolean;
    keyboard_shortcuts: boolean;
  }>,
) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_sessions")
    .update(preferences)
    .eq("id", sessionId);

  if (error) throw new Error(`Failed to update session: ${error.message}`);
}
