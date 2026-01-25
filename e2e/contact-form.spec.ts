import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.querySelector('#contacts')?.scrollIntoView();
    });
    await page.waitForTimeout(300);
  });

  test('form fields are visible', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('form fields accept input', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const messageInput = page.locator('textarea[name="message"]');

    await nameInput.fill('John Doe');
    await emailInput.fill('john@example.com');
    await messageInput.fill('Hello, this is a test message');

    await expect(nameInput).toHaveValue('John Doe');
    await expect(emailInput).toHaveValue('john@example.com');
    await expect(messageInput).toHaveValue('Hello, this is a test message');
  });

  test('submit button is visible', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('social links are accessible', async ({ page }) => {
    const telegramLink = page.locator('a[aria-label="telegram"]');
    const whatsappLink = page.locator('a[aria-label="whatsapp"]');
    const emailLink = page.locator('a[aria-label="email"]');

    await expect(telegramLink).toHaveAttribute('href', /t\.me/);
    await expect(whatsappLink).toHaveAttribute('href', /wa\.me/);
    await expect(emailLink).toHaveAttribute('href', /mailto:/);
  });

  test('social links open in new tab', async ({ page }) => {
    const telegramLink = page.locator('a[aria-label="telegram"]');
    await expect(telegramLink).toHaveAttribute('target', '_blank');
  });
});
