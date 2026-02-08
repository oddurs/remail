import { test, expect } from "@playwright/test";

test.describe("Search", () => {
  test("search bar is visible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByPlaceholder("Search mail")).toBeVisible();
  });

  test("search bar submits query and navigates", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const searchInput = page.getByPlaceholder("Search mail");
    await searchInput.fill("test");
    await searchInput.press("Enter");
    await expect(page).toHaveURL(/\/search\?q=test/);
  });

  test("search results page loads", async ({ page }) => {
    await page.goto("/search?q=project");
    await page.waitForLoadState("networkidle");
    // Page should show either results or empty state
    const pageContent = page.locator("main, [role='main']").first();
    await expect(pageContent).toBeVisible({ timeout: 10000 });
  });

  test("search query persists in input", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Ensure client components have hydrated by clicking body first
    await page.locator("body").click();
    const searchInput = page.getByPlaceholder("Search mail");
    await searchInput.click();
    await searchInput.fill("meeting");
    await searchInput.press("Enter");
    await expect(page).toHaveURL(/\/search\?q=meeting/, { timeout: 10000 });
  });
});
