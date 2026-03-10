import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Create Next App/);
});

test("blog link navigates to blog", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Blog" }).click();
  await expect(page).toHaveURL(/\/blog/);
});
