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

test('should show context panel when settings button is clicked', async ({ page }) => {
  await page.goto(BASE_URL);

  const settingsButton = page.getByText('컨텍스트 & 지시사항');
  await expect(settingsButton).toBeVisible();

  await settingsButton.click();

  await expect(page.getByText('컨텍스트 (상황 설명)')).toBeVisible();
  await expect(page.getByText('지시사항 (작성 가이드)')).toBeVisible();
});

test('should hide context panel when settings button is clicked again', async ({ page }) => {
  await page.goto(BASE_URL);

  const settingsButton = page.getByText('컨텍스트 & 지시사항');
  await settingsButton.click();

  await expect(page.getByText('컨텍스트 (상황 설명)')).toBeVisible();

  await settingsButton.click();

  await expect(page.getByText('컨텍스트 (상황 설명)')).not.toBeVisible();
});

test('should allow entering context and instructions', async ({ page }) => {
  await page.goto(BASE_URL);

  const settingsButton = page.getByText('컨텍스트 & 지시사항');
  await settingsButton.click();

  const contextTextarea = page.getByPlaceholder(/이 텍스트는 블로그 포스트입니다/);
  const instructionsTextarea = page.getByPlaceholder(/친근하고 대화하는 톤으로/);

  await contextTextarea.fill('Test context for blog writing');
  await instructionsTextarea.fill('Write in a friendly tone');

  await expect(contextTextarea).toHaveValue('Test context for blog writing');
  await expect(instructionsTextarea).toHaveValue('Write in a friendly tone');
});

test('should send context and instructions in API request', async ({ page }) => {
  let apiRequestData: any = null;

  await page.route('**/api/complete', route => {
    const request = route.request();
    apiRequestData = JSON.parse(request.postData() || '{}');
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ completion: 'context-aware suggestion' }),
    });
  });

  await page.goto(BASE_URL);

  const settingsButton = page.getByText('컨텍스트 & 지시사항');
  await settingsButton.click();

  const contextTextarea = page.getByPlaceholder(/이 텍스트는 블로그 포스트입니다/);
  const instructionsTextarea = page.getByPlaceholder(/친근하고 대화하는 톤으로/);

  await contextTextarea.fill('This is test context');
  await instructionsTextarea.fill('These are test instructions');

  const editor = page.locator('.cm-editor [contenteditable="true"]');
  await editor.click();
  await editor.fill('새로운 텍스트');

  await expect(page.locator('.cm-editor span[style*="opacity: 0.5"]')).toBeVisible({ timeout: 10000 });

  expect(apiRequestData).toBeTruthy();
  expect(apiRequestData.context).toBe('This is test context');
  expect(apiRequestData.instructions).toBe('These are test instructions');
});
