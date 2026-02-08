import { test, expect } from "@playwright/test";
import { gotoInboxWithEmails } from "./helpers";

test.describe("Visual Regression", () => {
  test("inbox page — light theme snapshot", async ({ page }) => {
    await gotoInboxWithEmails(page);

    // Ensure light theme
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "light");
    });
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot("inbox-light.png", {
      maxDiffPixelRatio: 0.05,
      fullPage: true,
    });
  });

  test("inbox page — dark theme snapshot", async ({ page }) => {
    await gotoInboxWithEmails(page);

    // Switch to dark theme
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
    });
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot("inbox-dark.png", {
      maxDiffPixelRatio: 0.05,
      fullPage: true,
    });
  });

  test("thread view snapshot", async ({ page }) => {
    await gotoInboxWithEmails(page);
    await page.locator("[data-email-id]").first().click();
    await page.waitForURL(/\/thread\//);
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("thread-view.png", {
      maxDiffPixelRatio: 0.05,
      fullPage: true,
    });
  });
});
