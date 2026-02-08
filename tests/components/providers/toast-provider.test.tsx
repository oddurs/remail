import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ToastProvider, useToast } from "@/components/ui/toast";

function TestConsumer() {
  const { showToast } = useToast();
  return (
    <div>
      <button
        data-testid="show"
        onClick={() => showToast({ message: "Test toast" })}
      >
        Show
      </button>
      <button
        data-testid="show-action"
        onClick={() =>
          showToast({
            message: "With action",
            action: { label: "Undo", onClick: vi.fn() },
          })
        }
      >
        Show Action
      </button>
      <button
        data-testid="show-many"
        onClick={() => {
          showToast({ message: "Toast 1" });
          showToast({ message: "Toast 2" });
          showToast({ message: "Toast 3" });
          showToast({ message: "Toast 4" });
        }}
      >
        Show Many
      </button>
    </div>
  );
}

describe("ToastProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("showToast renders toast message", () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );
    act(() => screen.getByTestId("show").click());
    expect(screen.getByText("Test toast")).toBeInTheDocument();
  });

  it("toast auto-dismisses after duration", () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );
    act(() => screen.getByTestId("show").click());
    expect(screen.getByText("Test toast")).toBeInTheDocument();

    // Advance past 5000ms default + 200ms exit animation
    act(() => vi.advanceTimersByTime(5200));
    expect(screen.queryByText("Test toast")).not.toBeInTheDocument();
  });

  it("max 3 toasts visible (trims oldest)", () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );
    act(() => screen.getByTestId("show-many").click());
    // Should show 3 most recent (slices -2 + adds 1 each time)
    // With the implementation: [...prev.slice(-2), newToast]
    // After 4 calls: Toast 2, Toast 3, Toast 4
    expect(screen.queryByText("Toast 1")).not.toBeInTheDocument();
    expect(screen.getByText("Toast 4")).toBeInTheDocument();
  });

  it("action button renders and is clickable", () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );
    act(() => screen.getByTestId("show-action").click());
    const undoButton = screen.getByText("Undo");
    expect(undoButton).toBeInTheDocument();
  });

  it("useToast throws outside provider", () => {
    expect(() => render(<TestConsumer />)).toThrow(
      "useToast must be used within ToastProvider",
    );
  });
});
