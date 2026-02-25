import { test } from '@playwright/test';

test.describe('Register100 Dashboard Screenshots', () => {
  test('should capture dashboard page', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/register100');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/dashboard-full.png', 
      fullPage: true 
    });
    console.log('✅ Captured full dashboard page');

    // Take screenshot of table only
    const table = page.locator('table');
    await table.screenshot({ 
      path: 'test-results/dashboard-table.png' 
    });
    console.log('✅ Captured table');
  });

  test('should capture detail modal', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/register100');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click first "ดูรายละเอียด" button
    const detailButton = page.locator('button:has-text("ดูรายละเอียด")').first();
    await detailButton.click();
    await page.waitForTimeout(1000);

    // Take screenshot of modal
    await page.screenshot({ 
      path: 'test-results/dashboard-modal.png', 
      fullPage: true 
    });
    console.log('✅ Captured detail modal');
  });

  test('should capture search functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/register100');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Type in search box
    const searchInput = page.locator('input[placeholder*="ค้นหา"]');
    await searchInput.fill('กรุงเทพ');
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/dashboard-search.png', 
      fullPage: true 
    });
    console.log('✅ Captured search results');
  });
});
