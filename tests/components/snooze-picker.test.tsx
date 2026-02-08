import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SnoozePicker } from "@/components/mail/snooze-picker";
import { ToastProvider } from "@/components/ui/toast";

vi.mock("@/lib/actions/email", () => ({
  snoozeEmail: vi.fn(() => Promise.resolve()),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

describe("SnoozePicker", () => {
  it("renders preset options", () => {
    render(
      <Wrapper>
        <SnoozePicker emailId="test-id" onClose={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.getByText("Later today")).toBeInTheDocument();
    expect(screen.getByText("Tomorrow")).toBeInTheDocument();
    expect(screen.getByText("This weekend")).toBeInTheDocument();
    expect(screen.getByText("Next week")).toBeInTheDocument();
  });

  it("has custom date picker button", () => {
    render(
      <Wrapper>
        <SnoozePicker emailId="test-id" onClose={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.getByText("Pick date & time")).toBeInTheDocument();
  });

  it("shows custom date inputs when clicking Pick date & time", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    render(
      <Wrapper>
        <SnoozePicker emailId="test-id" onClose={vi.fn()} />
      </Wrapper>,
    );
    await user.click(screen.getByText("Pick date & time"));
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Time")).toBeInTheDocument();
  });

  it("has Snooze until header", () => {
    render(
      <Wrapper>
        <SnoozePicker emailId="test-id" onClose={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.getByText("Snooze until...")).toBeInTheDocument();
  });
});
