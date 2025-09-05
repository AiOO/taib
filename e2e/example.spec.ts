import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('has title', async ({ page }) => {
  await page.goto(BASE_URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Taib/);
});

test('should show suggestion on text input', async ({ page }) => {
  // Mock the API call before navigating to the page
  await page.route('**/api/complete', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ completion: 'mocked suggestion' }),
    });
  });

  await page.goto(BASE_URL);

  // Find the CodeMirror editor and type text.
  const editor = page.locator('.cm-editor [contenteditable="true"]');
  await editor.click();
  await editor.fill('저는');

  // The suggestion text should now be the mocked response.
  const suggestion = page.locator('.cm-editor span[style*="opacity: 0.5"]');

  // Wait for the suggestion to be visible and check its content.
  await expect(suggestion).toBeVisible({ timeout: 10000 });
  await expect(suggestion).toHaveText('mocked suggestion');
});
