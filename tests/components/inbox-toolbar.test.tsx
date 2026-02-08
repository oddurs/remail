import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { InboxToolbar } from "@/components/mail/inbox-toolbar";
import { SelectionProvider, useSelection } from "@/components/mail/selection-provider";
import { ToastProvider } from "@/components/ui/toast";

vi.mock("@/lib/actions/email", () => ({
  archiveEmails: vi.fn(() => Promise.resolve()),
  unarchiveEmails: vi.fn(),
  trashEmails: vi.fn(() => Promise.resolve()),
  untrashEmails: vi.fn(),
  markReadStatus: vi.fn(() => Promise.resolve()),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SelectionProvider>{children}</SelectionProvider>
    </ToastProvider>
  );
}

// Helper to pre-select items
function SelectAndToolbar({ selectIds }: { selectIds: string[] }) {
  const { toggle } = useSelection();
  return (
    <div>
      <button
        data-testid="select-items"
        onClick={() => selectIds.forEach(toggle)}
      >
        Select
      </button>
      <InboxToolbar totalCount={10} allEmailIds={["a", "b", "c"]} />
    </div>
  );
}

describe("InboxToolbar", () => {
  it("shows pagination info when no selection", () => {
    render(
      <Wrapper>
        <InboxToolbar totalCount={10} allEmailIds={["a", "b", "c"]} />
      </Wrapper>,
    );
    expect(screen.getByText("1–10 of 10")).toBeInTheDocument();
  });

  it("shows 'No conversations' when empty", () => {
    render(
      <Wrapper>
        <InboxToolbar totalCount={0} allEmailIds={[]} />
      </Wrapper>,
    );
    expect(screen.getByText("No conversations")).toBeInTheDocument();
  });

  it("has select all checkbox", () => {
    render(
      <Wrapper>
        <InboxToolbar totalCount={5} allEmailIds={["a", "b"]} />
      </Wrapper>,
    );
    expect(screen.getByLabelText("Select all")).toBeInTheDocument();
  });

  it("shows selection count when items selected", () => {
    render(
      <Wrapper>
        <SelectAndToolbar selectIds={["a", "b"]} />
      </Wrapper>,
    );
    act(() => screen.getByTestId("select-items").click());
    expect(screen.getByText("2 selected")).toBeInTheDocument();
  });

  it("shows archive and trash buttons when items selected", () => {
    render(
      <Wrapper>
        <SelectAndToolbar selectIds={["a"]} />
      </Wrapper>,
    );
    act(() => screen.getByTestId("select-items").click());
    expect(screen.getByLabelText("Archive")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete")).toBeInTheDocument();
  });
});
