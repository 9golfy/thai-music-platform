import { test, expect } from '@playwright/test';

test.describe('Register100 - Consent Modal', () => {
  test('should show consent modal on first visit', async ({ page }) => {
    // Clear localStorage to simulate first visit
    await page.goto('http://localhost:3000/regist100');
    await page.evaluate(() => localStorage.clear());
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Check if consent modal is visible
    const consentModal = page.locator('[data-testid="btn-consent-accept"]');
    const isVisible = await consentModal.isVisible();
    
    expect(isVisible).toBe(true);
    console.log('✅ Consent modal is visible on first visit');

    // Take screenshot
    await page.screenshot({ path: 'test-results/consent-modal.png', fullPage: true });

    // Click accept button
    await consentModal.click();
    await page.waitForTimeout(500);

    // Check if modal is closed
    const isHidden = await consentModal.isHidden();
    expect(isHidden).toBe(true);
    console.log('✅ Consent modal closed after accepting');

    // Check if consent is saved in localStorage
    const consentValue = await page.evaluate(() => 
      localStorage.getItem('register100_consent_accepted')
    );
    expect(consentValue).toBe('true');
    console.log('✅ Consent saved in localStorage');
  });

  test('should not show consent modal on subsequent visits', async ({ page }) => {
    // Set consent in localStorage
    await page.goto('http://localhost:3000/regist100');
    await page.evaluate(() => 
      localStorage.setItem('register100_consent_accepted', 'true')
    );
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Check if consent modal is NOT visible
    const consentModal = page.locator('[data-testid="btn-consent-accept"]');
    const isHidden = await consentModal.isHidden();
    
    expect(isHidden).toBe(true);
    console.log('✅ Consent modal is hidden on subsequent visits');
  });

  test('should prevent closing modal by ESC key', async ({ page }) => {
    // Clear localStorage
    await page.goto('http://localhost:3000/regist100');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Check modal is visible
    const consentModal = page.locator('[data-testid="btn-consent-accept"]');
    let isVisible = await consentModal.isVisible();
    expect(isVisible).toBe(true);

    // Try to close with ESC key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Modal should still be visible
    isVisible = await consentModal.isVisible();
    expect(isVisible).toBe(true);
    console.log('✅ Modal cannot be closed with ESC key');
  });
});
