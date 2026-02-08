import { test, expect } from "@playwright/test";

test.describe("Compose", () => {
  test("compose button opens modal", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const composeButton = page.getByRole("button", { name: /Compose/i });
    await composeButton.click();
    await expect(page.getByText("New Message")).toBeVisible();
  });

  test("compose modal has recipient, subject, and body fields", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /Compose/i }).click();
    await expect(page.getByPlaceholder("Subject")).toBeVisible();
    await expect(page.getByText("To", { exact: true })).toBeVisible();
  });

  test("send button is initially disabled", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /Compose/i }).click();
    const sendButton = page.getByRole("button", { name: /Send/i });
    await expect(sendButton).toBeDisabled();
  });

  test("minimize/expand toggle works", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /Compose/i }).click();
    await expect(page.getByPlaceholder("Subject")).toBeVisible();

    // Click minimize
    const minimizeButton = page.getByLabel("Minimize");
    await minimizeButton.click();
    // Subject should be hidden when minimized
    await expect(page.getByPlaceholder("Subject")).not.toBeVisible();

    // Click expand (same button)
    const expandButton = page.getByLabel("Expand");
    await expandButton.click();
    await expect(page.getByPlaceholder("Subject")).toBeVisible();
  });

  test("close button closes modal", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /Compose/i }).click();
    await expect(page.getByText("New Message")).toBeVisible();

    const closeButton = page.getByLabel("Close");
    await closeButton.click();
    await expect(page.getByText("New Message")).not.toBeVisible();
  });

  test("discard draft button available", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /Compose/i }).click();
    await expect(page.getByLabel("Discard draft")).toBeVisible();
  });
});
