import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmailRow } from "@/components/mail/email-row";
import { SelectionProvider } from "@/components/mail/selection-provider";
import { ToastProvider } from "@/components/ui/toast";

// Mock server actions
vi.mock("@/lib/actions/email", () => ({
  toggleStar: vi.fn(),
  archiveEmails: vi.fn(),
  unarchiveEmails: vi.fn(),
  trashEmails: vi.fn(),
  untrashEmails: vi.fn(),
  markReadStatus: vi.fn(),
  snoozeEmail: vi.fn(),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SelectionProvider>{children}</SelectionProvider>
    </ToastProvider>
  );
}

const defaultProps = {
  emailId: "email-1",
  threadId: "thread-1",
  sender: "Alice Johnson",
  subject: "Project Update",
  snippet: "Here is the latest update on...",
  time: "2:34 PM",
};

describe("EmailRow", () => {
  it("renders sender, subject, snippet, time", () => {
    render(
      <Wrapper>
        <EmailRow {...defaultProps} />
      </Wrapper>,
    );
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Project Update")).toBeInTheDocument();
    expect(screen.getByText("2:34 PM")).toBeInTheDocument();
  });

  it("has star button with correct aria label", () => {
    render(
      <Wrapper>
        <EmailRow {...defaultProps} starred={false} />
      </Wrapper>,
    );
    expect(screen.getByLabelText("Star")).toBeInTheDocument();
  });

  it("shows starred state", () => {
    render(
      <Wrapper>
        <EmailRow {...defaultProps} starred={true} />
      </Wrapper>,
    );
    expect(screen.getByLabelText("Unstar")).toBeInTheDocument();
  });

  it("draft shows red 'Draft' label", () => {
    render(
      <Wrapper>
        <EmailRow {...defaultProps} isDraft={true} />
      </Wrapper>,
    );
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("labels render with correct colors", () => {
    render(
      <Wrapper>
        <EmailRow
          {...defaultProps}
          labels={[{ name: "Work", color: "#ff0000" }]}
        />
      </Wrapper>,
    );
    const label = screen.getByText("Work");
    expect(label).toBeInTheDocument();
    expect(label).toHaveStyle({ color: "#ff0000" });
  });

  it("important marker visible when important=true", () => {
    const { container } = render(
      <Wrapper>
        <EmailRow {...defaultProps} important={true} />
      </Wrapper>,
    );
    // Important marker is an SVG with a specific path
    const importantIcon = container.querySelector('[fill="currentColor"]');
    expect(importantIcon).toBeInTheDocument();
  });

  it("has archive hover action", () => {
    render(
      <Wrapper>
        <EmailRow {...defaultProps} />
      </Wrapper>,
    );
    expect(screen.getByLabelText("Archive")).toBeInTheDocument();
  });

  it("has delete hover action", () => {
    render(
      <Wrapper>
        <EmailRow {...defaultProps} />
      </Wrapper>,
    );
    expect(screen.getByLabelText("Delete")).toBeInTheDocument();
  });
});
