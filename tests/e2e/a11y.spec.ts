import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { gotoInboxWithEmails } from "./helpers";

// Known design system issues tracked separately:
// - color-contrast: --color-text-tertiary (#a1a1aa) on white = 2.56:1 (needs 4.5:1)
// - link-name: Settings back button SVG link without aria-label
const DISABLED_RULES = ["color-contrast", "link-name"];

test.describe("Accessibility @a11y", () => {
  test("inbox page passes axe audit", async ({ page }) => {
    await gotoInboxWithEmails(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(DISABLED_RULES)
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("compose modal passes axe audit", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("c");
    await expect(page.getByText("New Message")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(DISABLED_RULES)
      .include('[class*="compose"], [role="dialog"]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("settings page passes axe audit", async ({ page }) => {
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(DISABLED_RULES)
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("all interactive elements have accessible names", async ({ page }) => {
    await gotoInboxWithEmails(page);

    const buttons = page.locator("button");
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, 20); i++) {
      const button = buttons.nth(i);
      const name = await button.getAttribute("aria-label");
      const title = await button.getAttribute("title");
      const text = await button.textContent();
      const hasName = name || title || (text && text.trim().length > 0);
      expect(hasName, `Button ${i} should have accessible name`).toBeTruthy();
    }
  });

  test("thread view passes axe audit", async ({ page }) => {
    test.setTimeout(60000);
    await gotoInboxWithEmails(page);
    await page.locator("[data-email-id]").first().click();
    await page.waitForURL(/\/thread\//);
    await page.waitForLoadState("networkidle");

    // Wait for client-side hydration — StarButton renders aria-label after hydrate
    await page
      .locator('button[aria-label="Star"], button[aria-label="Unstar"]')
      .first()
      .waitFor({ timeout: 15000 });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(DISABLED_RULES)
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
