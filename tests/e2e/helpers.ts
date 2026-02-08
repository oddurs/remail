import type { Page } from "@playwright/test";

/**
 * Navigate to inbox and wait for seeded emails to appear.
 *
 * Next.js 15 runs layouts and pages in parallel, so on the very first
 * request the page query can execute before `ensureSession()` finishes
 * seeding. A reload solves this. We retry up to 2 times.
 */
export async function gotoInboxWithEmails(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Retry up to 2 reloads if emails aren't visible yet
  for (let attempt = 0; attempt < 3; attempt++) {
    const count = await page.locator("[data-email-id]").count();
    if (count > 0) break;
    await page.waitForTimeout(1000);
    try {
      await page.reload();
      await page.waitForLoadState("networkidle");
    } catch {
      // reload can fail under heavy dev server load — retry via goto
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    }
  }

  await page.locator("[data-email-id]").first().waitFor({ timeout: 20000 });
}
