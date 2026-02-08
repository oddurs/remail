/**
 * Test data factories with sensible defaults and overrides.
 */

const TEST_SESSION_ID = "test-session-id-00000000";

let counter = 0;
function nextId() {
  counter++;
  return `00000000-0000-0000-0000-${String(counter).padStart(12, "0")}`;
}

export function resetIdCounter() {
  counter = 0;
}

/* ─── Session ────────────────────────────────────────────────────────────────── */

export function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    id: TEST_SESSION_ID,
    is_seeded: true,
    theme_mode: "system",
    accent_color: "#1a73e8",
    display_density: "default",
    inbox_type: "default",
    page_size: 50,
    undo_send_sec: 5,
    conversation_view: true,
    hover_actions: true,
    keyboard_shortcuts: true,
    last_active_at: new Date().toISOString(),
    ...overrides,
  };
}

/* ─── Contact ────────────────────────────────────────────────────────────────── */

export function makeContact(overrides: Record<string, unknown> = {}) {
  const id = nextId();
  return {
    id,
    session_id: TEST_SESSION_ID,
    name: `Test User ${id.slice(-3)}`,
    email: `user${id.slice(-3)}@example.com`,
    is_self: false,
    ...overrides,
  };
}

export function makeSelfContact(overrides: Record<string, unknown> = {}) {
  return makeContact({
    name: "Me",
    email: "me@example.com",
    is_self: true,
    ...overrides,
  });
}

/* ─── Thread ─────────────────────────────────────────────────────────────────── */

export function makeThread(overrides: Record<string, unknown> = {}) {
  const id = nextId();
  return {
    id,
    session_id: TEST_SESSION_ID,
    subject: `Test Thread ${id.slice(-3)}`,
    last_message_at: new Date().toISOString(),
    message_count: 1,
    ...overrides,
  };
}

/* ─── Email ──────────────────────────────────────────────────────────────────── */

export function makeEmail(overrides: Record<string, unknown> = {}) {
  const id = nextId();
  const threadId = nextId();
  return {
    id,
    session_id: TEST_SESSION_ID,
    thread_id: threadId,
    from_contact_id: nextId(),
    subject: `Test Email ${id.slice(-3)}`,
    body_html: "<p>Test email body</p>",
    body_text: "Test email body",
    snippet: "Test email body",
    sent_at: new Date().toISOString(),
    is_read: false,
    is_starred: false,
    is_important: false,
    is_draft: false,
    is_archived: false,
    is_trash: false,
    is_spam: false,
    category: "primary",
    snooze_until: null,
    ...overrides,
  };
}

/* ─── Label ──────────────────────────────────────────────────────────────────── */

export function makeLabel(overrides: Record<string, unknown> = {}) {
  const id = nextId();
  return {
    id,
    session_id: TEST_SESSION_ID,
    name: `Label ${id.slice(-3)}`,
    color: "#e8453c",
    type: "user",
    position: 0,
    show_in_list: true,
    show_in_message: true,
    ...overrides,
  };
}

/* ─── Recipient ──────────────────────────────────────────────────────────────── */

export function makeRecipient(overrides: Record<string, unknown> = {}) {
  return {
    email_id: nextId(),
    contact_id: nextId(),
    type: "to" as const,
    ...overrides,
  };
}

/* ─── Valid UUIDs for testing ─────────────────────────────────────────────────── */

export const VALID_UUID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
export const VALID_UUID_2 = "b1ffcd00-ad1c-4ef9-bb7e-7ccacea91b22";
export const VALID_UUID_3 = "c2aade11-be2d-4a00-ad8f-8ddbdfb02c33";

export { TEST_SESSION_ID };
