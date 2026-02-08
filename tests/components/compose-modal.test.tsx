import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComposeModal } from "@/components/mail/compose-modal";
import { ToastProvider } from "@/components/ui/toast";

// Mock server actions
vi.mock("@/lib/actions/email", () => ({
  sendEmail: vi.fn(),
  saveDraft: vi.fn(),
  discardDraft: vi.fn(),
  searchContacts: vi.fn(() => Promise.resolve([])),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

describe("ComposeModal", () => {
  it("not rendered when open=false", () => {
    render(
      <Wrapper>
        <ComposeModal open={false} onClose={vi.fn()} />
      </Wrapper>,
    );
    // ComposeModal returns null when open=false — no "New Message" header
    expect(screen.queryByText("New Message")).not.toBeInTheDocument();
    expect(screen.queryByText("Send")).not.toBeInTheDocument();
  });

  it("renders header with 'New Message' when no subject", () => {
    render(
      <Wrapper>
        <ComposeModal open={true} onClose={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.getByText("New Message")).toBeInTheDocument();
  });

  it("shows subject in header when provided", () => {
    render(
      <Wrapper>
        <ComposeModal
          open={true}
          onClose={vi.fn()}
          initialState={{ subject: "Hello World" }}
        />
      </Wrapper>,
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("has minimize button", () => {
    render(
      <Wrapper>
        <ComposeModal open={true} onClose={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.getByLabelText("Minimize")).toBeInTheDocument();
  });

  it("send button is disabled when no recipients", () => {
    render(
      <Wrapper>
        <ComposeModal open={true} onClose={vi.fn()} />
      </Wrapper>,
    );
    const sendButton = screen.getByText("Send");
    expect(sendButton).toBeDisabled();
  });

  it("send button is enabled with recipients", () => {
    render(
      <Wrapper>
        <ComposeModal
          open={true}
          onClose={vi.fn()}
          initialState={{
            to: [{ id: "1", name: "Alice", email: "alice@test.com" }],
          }}
        />
      </Wrapper>,
    );
    const sendButton = screen.getByText("Send");
    expect(sendButton).not.toBeDisabled();
  });

  it("has discard button", () => {
    render(
      <Wrapper>
        <ComposeModal open={true} onClose={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.getByLabelText("Discard draft")).toBeInTheDocument();
  });

  it("has subject input field", () => {
    render(
      <Wrapper>
        <ComposeModal open={true} onClose={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.getByPlaceholderText("Subject")).toBeInTheDocument();
  });
});
