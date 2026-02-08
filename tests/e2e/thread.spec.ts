import { test, expect } from "@playwright/test";
import { gotoInboxWithEmails } from "./helpers";

test.describe("Thread View", () => {
  test("clicking email row navigates to thread view", async ({ page }) => {
    await gotoInboxWithEmails(page);
    const firstRow = page.locator("[data-email-id]").first();
    const threadId = await firstRow.getAttribute("data-thread-id");
    await firstRow.click();
    await expect(page).toHaveURL(new RegExp(`/thread/${threadId}`));
  });

  test("thread shows subject heading", async ({ page }) => {
    await gotoInboxWithEmails(page);
    await page.locator("[data-email-id]").first().click();
    await page.waitForURL(/\/thread\//);
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test("thread has reply button", async ({ page }) => {
    await gotoInboxWithEmails(page);
    // Skip draft rows (Reply/Forward only show on non-draft last messages)
    const rows = page.locator("[data-email-id]");
    const count = await rows.count();
    let clicked = false;
    for (let i = 0; i < count; i++) {
      const text = await rows.nth(i).textContent();
      if (text && !text.includes("Draft")) {
        await rows.nth(i).click();
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      await rows.first().click();
    }
    await page.waitForURL(/\/thread\//);
    await page.waitForLoadState("networkidle");
    // Use exact + first to avoid matching "Reply all" and toolbar reply icon
    const replyButton = page
      .getByRole("button", { name: "Reply", exact: true })
      .first();
    await expect(replyButton).toBeVisible({ timeout: 10000 });
  });

  test("thread has forward button", async ({ page }) => {
    await gotoInboxWithEmails(page);
    // Skip draft rows
    const rows = page.locator("[data-email-id]");
    const count = await rows.count();
    let clicked = false;
    for (let i = 0; i < count; i++) {
      const text = await rows.nth(i).textContent();
      if (text && !text.includes("Draft")) {
        await rows.nth(i).click();
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      await rows.first().click();
    }
    await page.waitForURL(/\/thread\//);
    await page.waitForLoadState("networkidle");
    const forwardButton = page.getByRole("button", { name: "Forward" });
    await expect(forwardButton).toBeVisible({ timeout: 10000 });
  });

  test("back arrow returns to inbox", async ({ page }) => {
    await gotoInboxWithEmails(page);
    await page.locator("[data-email-id]").first().click();
    await page.waitForURL(/\/thread\//);
    const backButton = page.getByLabel(/Back/i);
    await expect(backButton).toBeVisible({ timeout: 5000 });
    await backButton.click();
    await expect(page).toHaveURL("/");
  });
});
