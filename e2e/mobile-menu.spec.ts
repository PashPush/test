import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test.describe('Mobile Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hamburger button is visible on mobile', async ({ page }) => {
    const hamburger = page.locator('button.hamburger');
    await expect(hamburger).toBeVisible();
  });

  test('hamburger opens mobile menu', async ({ page }) => {
    const hamburger = page.locator('button.hamburger');
    await hamburger.click();

    const mobileMenu = page.locator('.mobile-menu');
    await expect(mobileMenu).toHaveClass(/open/);
  });

  test('mobile menu shows navigation links', async ({ page }) => {
    const hamburger = page.locator('button.hamburger');
    await hamburger.click();

    const nav = page.locator('.mobile-menu-nav');
    await expect(nav).toBeVisible();
  });

  test('clicking nav link closes menu', async ({ page }) => {
    const hamburger = page.locator('button.hamburger');
    await hamburger.click();

    const mobileMenu = page.locator('.mobile-menu');
    await expect(mobileMenu).toHaveClass(/open/);

    const firstLink = page.locator('.mobile-menu-nav a').first();
    await firstLink.click();
    await page.waitForTimeout(300);

    await expect(mobileMenu).not.toHaveClass(/open/);
  });

  test('backdrop is visible when menu is open', async ({ page }) => {
    const hamburger = page.locator('button.hamburger');
    await hamburger.click();

    const backdrop = page.locator('.mobile-menu-backdrop');
    await expect(backdrop).toHaveClass(/open/);
  });

  test('Escape key closes menu', async ({ page }) => {
    const hamburger = page.locator('button.hamburger');
    await hamburger.click();

    const mobileMenu = page.locator('.mobile-menu');
    await expect(mobileMenu).toHaveClass(/open/);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    await expect(mobileMenu).not.toHaveClass(/open/);
  });

  test('contact button in menu navigates correctly', async ({ page }) => {
    const hamburger = page.locator('button.hamburger');
    await hamburger.click();

    const contactBtn = page.locator('.mobile-menu-contact');
    await contactBtn.click();
    await page.waitForTimeout(500);

    const contactSection = page.locator('#contacts');
    await expect(contactSection).toBeInViewport();
  });
});
