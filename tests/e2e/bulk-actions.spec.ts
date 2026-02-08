import { test, expect } from "@playwright/test";
import { gotoInboxWithEmails } from "./helpers";

test.describe("Bulk Actions", () => {
  test("selecting email shows selection toolbar", async ({ page }) => {
    await gotoInboxWithEmails(page);
    const checkbox = page.locator("[data-email-id]").first().getByLabel(/Select/);
    await checkbox.click();
    await expect(page.getByText(/1 selected/)).toBeVisible();
  });

  test("select all checkbox works", async ({ page }) => {
    await gotoInboxWithEmails(page);
    const selectAll = page.getByLabel("Select all");
    await selectAll.click();
    await expect(page.getByText(/selected/)).toBeVisible();
  });

  test("archive button appears when items selected", async ({ page }) => {
    await gotoInboxWithEmails(page);
    const checkbox = page.locator("[data-email-id]").first().getByLabel(/Select/);
    await checkbox.click();
    await expect(page.getByText(/1 selected/)).toBeVisible();
    // Scope to the selection toolbar (not the hover actions on email rows)
    const toolbar = page.locator("text=selected").locator("..");
    const archiveButton = toolbar.getByLabel("Archive");
    await expect(archiveButton).toBeVisible({ timeout: 3000 });
  });

  test("trash button appears when items selected", async ({ page }) => {
    await gotoInboxWithEmails(page);
    const checkbox = page.locator("[data-email-id]").first().getByLabel(/Select/);
    await checkbox.click();
    await expect(page.getByText(/1 selected/)).toBeVisible();
    // Scope to the selection toolbar
    const toolbar = page.locator("text=selected").locator("..");
    const deleteButton = toolbar.getByLabel("Delete");
    await expect(deleteButton).toBeVisible({ timeout: 3000 });
  });
});
