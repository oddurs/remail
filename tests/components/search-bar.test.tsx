import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/mail/search-bar";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("SearchBar", () => {
  it("renders search input", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText("Search mail")).toBeInTheDocument();
  });

  it("submitting navigates to /search?q=term", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search mail");
    await user.type(input, "test query");
    await user.keyboard("{Enter}");
    expect(mockPush).toHaveBeenCalledWith(
      "/search?q=test%20query",
    );
  });

  it("clear button resets input", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search mail");
    await user.type(input, "test");
    const clearBtn = screen.getByLabelText("Clear search");
    await user.click(clearBtn);
    expect(input).toHaveValue("");
  });

  it("has search submit button", () => {
    render(<SearchBar />);
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });
});
