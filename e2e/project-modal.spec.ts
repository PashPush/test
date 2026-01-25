import { test, expect } from '@playwright/test';

test.describe('Project Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.querySelector('#projects')?.scrollIntoView();
    });
    await page.waitForTimeout(500);
  });

  test('project cards are visible', async ({ page }) => {
    const projectCards = page.locator('.project-card-clickable');
    await expect(projectCards.first()).toBeVisible();
  });

  test('clicking project card opens modal', async ({ page }) => {
    const projectCard = page.locator('.project-card-clickable').first();
    await projectCard.click();
    await page.waitForTimeout(500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test('modal has correct ARIA attributes', async ({ page }) => {
    const projectCard = page.locator('.project-card-clickable').first();
    await projectCard.click();
    await page.waitForTimeout(500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  test('modal displays project details', async ({ page }) => {
    const projectCard = page.locator('.project-card-clickable').first();
    await projectCard.click();
    await page.waitForTimeout(500);

    const modalTitle = page.locator('#modal-title');
    await expect(modalTitle).toBeVisible();
    await expect(modalTitle).not.toBeEmpty();
  });

  test('close button closes modal', async ({ page }) => {
    const projectCard = page.locator('.project-card-clickable').first();
    await projectCard.click();
    await page.waitForTimeout(500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const closeButton = page.locator('.project-modal-close');
    await closeButton.click();
    await page.waitForTimeout(500);

    await expect(modal).not.toBeVisible();
  });

  test('Escape key closes modal', async ({ page }) => {
    const projectCard = page.locator('.project-card-clickable').first();
    await projectCard.click();
    await page.waitForTimeout(500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    await expect(modal).not.toBeVisible();
  });

  test('modal overlay exists', async ({ page }) => {
    const projectCard = page.locator('.project-card-clickable').first();
    await projectCard.click();
    await page.waitForTimeout(500);

    const overlay = page.locator('.project-modal-overlay');
    await expect(overlay).toBeVisible();
  });

  test('modal shows screenshots', async ({ page }) => {
    const projectCard = page.locator('.project-card-clickable').first();
    await projectCard.click();
    await page.waitForTimeout(500);

    const screenshots = page.locator('.project-modal-screenshot img');
    const count = await screenshots.count();
    expect(count).toBeGreaterThan(0);
  });
});
