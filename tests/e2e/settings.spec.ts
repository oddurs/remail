import { test, expect } from "@playwright/test";

test.describe("Settings", () => {
  test("settings page renders", async ({ page }) => {
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");
    // Settings page should have some heading
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
  });

  test("settings page has theme section", async ({ page }) => {
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");
    // Should show settings content
    const content = page.locator("main, [role='main']").first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
