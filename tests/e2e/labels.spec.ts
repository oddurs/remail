import { test, expect } from "@playwright/test";
import { gotoInboxWithEmails } from "./helpers";

test.describe("Labels", () => {
  test("sidebar shows user labels", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Labels")).toBeVisible({ timeout: 10000 });
  });

  test("create label button exists in sidebar", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const createButton = page.getByLabel(/Create.*label|New.*label|Add.*label/i);
    await expect(createButton).toBeVisible({ timeout: 5000 });
  });

  test("label picker is accessible from thread view", async ({ page }) => {
    await gotoInboxWithEmails(page);
    await page.locator("[data-email-id]").first().click();
    await page.waitForURL(/\/thread\//);
    await page.waitForLoadState("networkidle");
    const labelButton = page.getByLabel("Labels");
    await expect(labelButton).toBeVisible({ timeout: 5000 });
  });

  test("label picker opens on click", async ({ page }) => {
    await gotoInboxWithEmails(page);
    await page.locator("[data-email-id]").first().click();
    await page.waitForURL(/\/thread\//);
    await page.waitForLoadState("networkidle");
    const labelButton = page.getByLabel("Labels");
    await expect(labelButton).toBeVisible({ timeout: 5000 });
    await labelButton.click();
    // The picker should show "Label as:" header or label names
    const picker = page.locator("text=Label as:");
    const noLabels = page.locator("text=No labels");
    // Either label picker text or "no labels" should appear
    await expect(picker.or(noLabels).first()).toBeVisible({ timeout: 5000 });
  });
});
