import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { SelectionProvider, useSelection } from "@/components/mail/selection-provider";

function TestConsumer() {
  const { selectedIds, isSelected, toggle, selectAll, clearSelection, selectionCount } = useSelection();
  return (
    <div>
      <span data-testid="count">{selectionCount}</span>
      <span data-testid="selected">{Array.from(selectedIds).join(",")}</span>
      <button data-testid="toggle-a" onClick={() => toggle("a")}>Toggle A</button>
      <button data-testid="toggle-b" onClick={() => toggle("b")}>Toggle B</button>
      <button data-testid="select-all" onClick={() => selectAll(["a", "b", "c"])}>Select All</button>
      <button data-testid="clear" onClick={() => clearSelection()}>Clear</button>
      <span data-testid="is-a">{isSelected("a") ? "yes" : "no"}</span>
    </div>
  );
}

describe("SelectionProvider", () => {
  it("toggle adds item to selection", () => {
    render(
      <SelectionProvider>
        <TestConsumer />
      </SelectionProvider>,
    );
    act(() => screen.getByTestId("toggle-a").click());
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("is-a").textContent).toBe("yes");
  });

  it("toggle removes already-selected item", () => {
    render(
      <SelectionProvider>
        <TestConsumer />
      </SelectionProvider>,
    );
    act(() => screen.getByTestId("toggle-a").click());
    act(() => screen.getByTestId("toggle-a").click());
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("is-a").textContent).toBe("no");
  });

  it("selectAll selects all provided IDs", () => {
    render(
      <SelectionProvider>
        <TestConsumer />
      </SelectionProvider>,
    );
    act(() => screen.getByTestId("select-all").click());
    expect(screen.getByTestId("count").textContent).toBe("3");
  });

  it("selectAll when all selected clears selection (toggle-all)", () => {
    render(
      <SelectionProvider>
        <TestConsumer />
      </SelectionProvider>,
    );
    act(() => screen.getByTestId("select-all").click());
    act(() => screen.getByTestId("select-all").click());
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("clearSelection empties the set", () => {
    render(
      <SelectionProvider>
        <TestConsumer />
      </SelectionProvider>,
    );
    act(() => screen.getByTestId("toggle-a").click());
    act(() => screen.getByTestId("toggle-b").click());
    act(() => screen.getByTestId("clear").click());
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("useSelection throws outside provider", () => {
    expect(() => render(<TestConsumer />)).toThrow(
      "useSelection must be used within SelectionProvider",
    );
  });
});
