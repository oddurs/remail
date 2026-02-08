import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ComposeProvider, useCompose } from "@/components/mail/compose-provider";
import { ToastProvider } from "@/components/ui/toast";

// Mock the server actions used by ComposeModal
vi.mock("@/lib/actions/email", () => ({
  sendEmail: vi.fn(),
  saveDraft: vi.fn(),
  discardDraft: vi.fn(),
  searchContacts: vi.fn(() => Promise.resolve([])),
}));

function TestConsumer() {
  const { openCompose, openReply, openForward } = useCompose();
  return (
    <div>
      <button data-testid="compose" onClick={() => openCompose()}>
        Compose
      </button>
      <button
        data-testid="compose-opts"
        onClick={() => openCompose({ subject: "Pre-filled" })}
      >
        Compose With Options
      </button>
      <button
        data-testid="reply"
        onClick={() =>
          openReply({
            to: [{ id: "1", name: "Alice", email: "alice@test.com" }],
            subject: "Re: Test",
          })
        }
      >
        Reply
      </button>
      <button
        data-testid="forward"
        onClick={() => openForward({ subject: "Fwd: Test" })}
      >
        Forward
      </button>
    </div>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ComposeProvider>{children}</ComposeProvider>
    </ToastProvider>
  );
}

describe("ComposeProvider", () => {
  it("openCompose opens modal with no initial state", () => {
    render(
      <Wrapper>
        <TestConsumer />
      </Wrapper>,
    );
    act(() => screen.getByTestId("compose").click());
    expect(screen.getByText("New Message")).toBeInTheDocument();
  });

  it("openCompose with options passes through", () => {
    render(
      <Wrapper>
        <TestConsumer />
      </Wrapper>,
    );
    act(() => screen.getByTestId("compose-opts").click());
    expect(screen.getByText("Pre-filled")).toBeInTheDocument();
  });

  it("openReply opens with reply options", () => {
    render(
      <Wrapper>
        <TestConsumer />
      </Wrapper>,
    );
    act(() => screen.getByTestId("reply").click());
    expect(screen.getByText("Re: Test")).toBeInTheDocument();
  });

  it("openForward opens with forward options", () => {
    render(
      <Wrapper>
        <TestConsumer />
      </Wrapper>,
    );
    act(() => screen.getByTestId("forward").click());
    expect(screen.getByText("Fwd: Test")).toBeInTheDocument();
  });

  it("useCompose throws outside provider", () => {
    expect(() => render(<TestConsumer />)).toThrow(
      "useCompose must be used within ComposeProvider",
    );
  });
});
