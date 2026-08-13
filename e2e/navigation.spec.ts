import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Pavel|Павел/);
  });

  test('navbar is visible', async ({ page }) => {
    const navbar = page.locator('header');
    await expect(navbar).toBeVisible();
  });

  test('navbar becomes scrolled on scroll', async ({ page }) => {
    const navbar = page.locator('header');
    await expect(navbar).toHaveClass(/not-scrolled/);

    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(100);

    await expect(navbar).toHaveClass(/scrolled/);
  });

  test('logo click scrolls to top', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(100);

    await page.click('.logo');
    await page.waitForTimeout(500);

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test.describe('desktop', () => {
    test.skip(({ browserName }) => browserName !== 'chromium', 'desktop-only layout');

    test('navigation links scroll to sections', async ({ page }) => {
      const projectsLink = page.locator('nav.desktop a[href="#projects"]');
      await projectsLink.click();
      await page.waitForTimeout(500);

      const projectsSection = page.locator('#projects');
      await expect(projectsSection).toBeInViewport();
    });

    test('contact button navigates to contact section', async ({ page }) => {
      const contactBtn = page.locator('.contact-btn');
      await contactBtn.click();
      await page.waitForTimeout(1500);

      const contactSection = page.locator('#contacts');
      await expect(contactSection).toBeInViewport();

      // Land on the section start, not somewhere inside it. toBeInViewport alone
      // passes even when the anchor overshoots into the middle of the form.
      await expect
        .poll(() => page.evaluate(() => document.getElementById('contacts')!.getBoundingClientRect().top))
        .toBeGreaterThan(-100);
    });
  });
});
