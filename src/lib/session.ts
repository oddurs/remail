import { cookies } from "next/headers";

const SESSION_COOKIE = "session_id";

/**
 * Get the current anonymous session ID from the cookie.
 * Returns null if no session exists (should not happen with middleware).
 */
export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

/**
 * Get the session ID or throw — use in server actions/components
 * where a session is required.
 */
export async function requireSessionId(): Promise<string> {
  const sessionId = await getSessionId();
  if (!sessionId) {
    throw new Error(
      "No session found. This should not happen with middleware.",
    );
  }
  return sessionId;
}
