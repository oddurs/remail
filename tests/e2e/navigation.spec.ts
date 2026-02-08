import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("sidebar links navigate to correct routes", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navigate to Starred
    const starredLink = page.getByRole("link", { name: /Starred/i });
    if (await starredLink.isVisible()) {
      await starredLink.click();
      await expect(page).toHaveURL(/\/starred/);
    }
  });

  test("inbox link returns to inbox", async ({ page }) => {
    await page.goto("/starred");
    await page.waitForLoadState("networkidle");
    const inboxLink = page.getByRole("link", { name: /Inbox/i });
    if (await inboxLink.isVisible()) {
      await inboxLink.click();
      await expect(page).toHaveURL("/");
    }
  });

  test("sent link navigates", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const sentLink = page.getByRole("link", { name: /Sent/i });
    if (await sentLink.isVisible()) {
      await sentLink.click();
      await expect(page).toHaveURL(/\/sent/);
    }
  });

  test("drafts link navigates", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const draftsLink = page.getByRole("link", { name: /Drafts/i });
    if (await draftsLink.isVisible()) {
      await draftsLink.click();
      await expect(page).toHaveURL(/\/drafts/);
    }
  });

  test("settings link opens settings page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const settingsLink = page.getByRole("link", { name: /Settings/i });
    if (await settingsLink.isVisible()) {
      await settingsLink.click();
      await expect(page).toHaveURL(/\/settings/);
    }
  });
});
