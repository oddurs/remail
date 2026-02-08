import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ThreadToolbarActions,
  StarButton,
  ReplyButton,
  ForwardButton,
} from "@/components/mail/thread-actions";
import { ToastProvider } from "@/components/ui/toast";
import { ComposeProvider } from "@/components/mail/compose-provider";

vi.mock("@/lib/actions/email", () => ({
  toggleStar: vi.fn(),
  archiveThread: vi.fn(),
  unarchiveThread: vi.fn(),
  trashThread: vi.fn(),
  untrashThread: vi.fn(),
  markThreadReadStatus: vi.fn(),
  sendEmail: vi.fn(),
  saveDraft: vi.fn(),
  discardDraft: vi.fn(),
  searchContacts: vi.fn(() => Promise.resolve([])),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/thread/123",
  useSearchParams: () => new URLSearchParams(),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ComposeProvider>{children}</ComposeProvider>
    </ToastProvider>
  );
}

describe("ThreadToolbarActions", () => {
  it("renders archive button", () => {
    render(
      <Wrapper>
        <ThreadToolbarActions threadId="thread-1" />
      </Wrapper>,
    );
    expect(screen.getByLabelText("Archive")).toBeInTheDocument();
  });

  it("renders delete button", () => {
    render(
      <Wrapper>
        <ThreadToolbarActions threadId="thread-1" />
      </Wrapper>,
    );
    expect(screen.getByLabelText("Delete")).toBeInTheDocument();
  });

  it("renders mark unread button", () => {
    render(
      <Wrapper>
        <ThreadToolbarActions threadId="thread-1" />
      </Wrapper>,
    );
    expect(screen.getByLabelText("Mark unread")).toBeInTheDocument();
  });
});

describe("StarButton", () => {
  it("shows star when not starred", () => {
    render(
      <Wrapper>
        <StarButton emailId="e1" starred={false} />
      </Wrapper>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});

describe("ReplyButton", () => {
  it("renders Reply text", () => {
    render(
      <Wrapper>
        <ReplyButton
          threadId="t1"
          subject="Test"
          senderName="Alice"
          senderEmail="alice@test.com"
          bodyHtml="<p>body</p>"
          sentAt="Jan 1, 2025"
        />
      </Wrapper>,
    );
    expect(screen.getByText("Reply")).toBeInTheDocument();
  });
});

describe("ForwardButton", () => {
  it("renders Forward text", () => {
    render(
      <Wrapper>
        <ForwardButton
          threadId="t1"
          subject="Test"
          senderName="Alice"
          senderEmail="alice@test.com"
          bodyHtml="<p>body</p>"
          sentAt="Jan 1, 2025"
        />
      </Wrapper>,
    );
    expect(screen.getByText("Forward")).toBeInTheDocument();
  });
});
