import { test, expect } from "@playwright/test";

test.describe("Keyboard Shortcuts", () => {
  test("'c' opens compose modal", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("c");
    await expect(page.getByText("New Message")).toBeVisible();
  });

  test("'?' opens keyboard shortcuts help dialog", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Click body first to ensure focus is on the page
    await page.locator("body").click();
    await page.keyboard.type("?");
    await expect(page.getByText("Keyboard shortcuts")).toBeVisible({ timeout: 5000 });
  });

  test("'/' focuses search input", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("/");
    const searchInput = page.getByPlaceholder("Search mail");
    await expect(searchInput).toBeFocused();
  });
});
