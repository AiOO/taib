import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('should display correct page title', async ({ page }) => {
  await page.goto(BASE_URL);

  await expect(page).toHaveTitle(/Taib/);
});

test('should show AI suggestion when typing in text editor', async ({ page }) => {
  await page.route('**/api/complete', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ completion: 'mocked AI suggestion' }),
    });
  });

  await page.goto(BASE_URL);

  const editor = page.locator('.cm-editor [contenteditable="true"]');
  await editor.click();
  await editor.fill('저는');

  const suggestion = page.locator('.cm-editor span[style*="opacity: 0.5"]');

  await expect(suggestion).toBeVisible({ timeout: 10000 });
  await expect(suggestion).toHaveText('mocked AI suggestion');
});
