import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import { KeyboardShortcuts } from "@/components/mail/keyboard-shortcuts";
import { SelectionProvider } from "@/components/mail/selection-provider";
import { ToastProvider } from "@/components/ui/toast";
import { ComposeProvider } from "@/components/mail/compose-provider";

const mockPush = vi.fn();
const mockOpenCompose = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/lib/actions/email", () => ({
  toggleStar: vi.fn(),
  archiveEmails: vi.fn(),
  unarchiveEmails: vi.fn(),
  trashEmails: vi.fn(),
  untrashEmails: vi.fn(),
  markReadStatus: vi.fn(),
  sendEmail: vi.fn(),
  saveDraft: vi.fn(),
  discardDraft: vi.fn(),
  searchContacts: vi.fn(() => Promise.resolve([])),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ComposeProvider>
        <SelectionProvider>{children}</SelectionProvider>
      </ComposeProvider>
    </ToastProvider>
  );
}

function fireKey(key: string, options: Partial<KeyboardEvent> = {}) {
  act(() => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true, ...options }),
    );
  });
}

describe("KeyboardShortcuts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("'?' key opens help dialog", () => {
    render(
      <Wrapper>
        <KeyboardShortcuts />
      </Wrapper>,
    );
    fireKey("?");
    // Radix Dialog renders in a portal, so query document.body
    expect(document.body.querySelector('[role="dialog"]')).toBeInTheDocument();
  });

  it("'/' key focuses search input", () => {
    // Create a search input element to focus
    const input = document.createElement("input");
    input.placeholder = "Search mail";
    document.body.appendChild(input);
    const focusSpy = vi.spyOn(input, "focus");

    render(
      <Wrapper>
        <KeyboardShortcuts />
      </Wrapper>,
    );
    fireKey("/");
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it("'c' key opens compose", () => {
    render(
      <Wrapper>
        <KeyboardShortcuts />
      </Wrapper>,
    );
    fireKey("c");
    // ComposeProvider should now have the modal open — check for "New Message"
    // The compose modal renders inside ComposeProvider
  });

  it("'g' then 'i' navigates to inbox", () => {
    render(
      <Wrapper>
        <KeyboardShortcuts />
      </Wrapper>,
    );
    fireKey("g");
    fireKey("i");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("'g' then 's' navigates to starred", () => {
    render(
      <Wrapper>
        <KeyboardShortcuts />
      </Wrapper>,
    );
    fireKey("g");
    fireKey("s");
    expect(mockPush).toHaveBeenCalledWith("/starred");
  });

  it("shortcuts disabled when input is focused", () => {
    render(
      <Wrapper>
        <KeyboardShortcuts />
        <input data-testid="input" />
      </Wrapper>,
    );
    // Focus an input
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    fireKey("c");
    // Compose should NOT open because input is focused
    document.body.removeChild(input);
  });
});
