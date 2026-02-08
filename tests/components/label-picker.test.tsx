import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LabelPicker } from "@/components/mail/label-picker";
import { ToastProvider } from "@/components/ui/toast";

vi.mock("@/lib/actions/labels", () => ({
  assignLabels: vi.fn(() => Promise.resolve()),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

describe("LabelPicker", () => {
  const labels = [
    { id: "l1", name: "Work", color: "#ff0000" },
    { id: "l2", name: "Personal", color: "#00ff00" },
    { id: "l3", name: "Urgent", color: "#0000ff" },
  ];

  it("renders label list", () => {
    render(
      <Wrapper>
        <LabelPicker
          emailIds={["e1"]}
          currentLabelIds={[]}
          labels={labels}
          onClose={vi.fn()}
        />
      </Wrapper>,
    );
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
  });

  it("shows checked state for current labels", () => {
    render(
      <Wrapper>
        <LabelPicker
          emailIds={["e1"]}
          currentLabelIds={["l1"]}
          labels={labels}
          onClose={vi.fn()}
        />
      </Wrapper>,
    );
    const workCheckbox = screen.getByRole("checkbox", { name: /Work/i });
    expect(workCheckbox).toHaveAttribute("aria-checked", "true");
  });

  it("has Label as heading", () => {
    render(
      <Wrapper>
        <LabelPicker
          emailIds={["e1"]}
          currentLabelIds={[]}
          labels={labels}
          onClose={vi.fn()}
        />
      </Wrapper>,
    );
    expect(screen.getByText("Label as:")).toBeInTheDocument();
  });
});
