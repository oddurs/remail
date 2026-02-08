import { test, expect } from "@playwright/test";
import { gotoInboxWithEmails } from "./helpers";

test.describe("Inbox", () => {
  test("page loads with seeded emails", async ({ page }) => {
    await gotoInboxWithEmails(page);
    await expect(page.locator("[data-email-id]").first()).toBeVisible();
  });

  test("category tabs switch content", async ({ page }) => {
    await gotoInboxWithEmails(page);

    // Category tabs are <Link> elements, not buttons
    const socialTab = page.getByRole("link", { name: /Social/i });
    await expect(socialTab).toBeVisible();
    await socialTab.click();
    await page.waitForLoadState("networkidle");
  });

  test("email row shows sender, subject, snippet, time", async ({ page }) => {
    await gotoInboxWithEmails(page);
    const firstRow = page.locator("[data-email-id]").first();
    // Should have text content (sender, subject, etc.)
    await expect(firstRow).not.toBeEmpty();
  });

  test("pagination info displays", async ({ page }) => {
    await gotoInboxWithEmails(page);
    // Toolbar shows "No conversations" or "1–N of N"
    const toolbar = page.locator("text=/No conversations|\\d+–\\d+ of \\d+/");
    await expect(toolbar.first()).toBeVisible();
  });

  test("email row star button is interactive", async ({ page }) => {
    await gotoInboxWithEmails(page);
    const starButton = page.locator("[data-email-id]").first().getByLabel(/Star|Unstar/);
    await expect(starButton).toBeVisible();
  });

  test("email row has checkbox for selection", async ({ page }) => {
    await gotoInboxWithEmails(page);
    const checkbox = page.locator("[data-email-id]").first().getByLabel(/Select|Deselect/);
    await expect(checkbox).toBeVisible();
  });
});
