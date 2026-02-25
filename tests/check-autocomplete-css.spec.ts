import { test } from '@playwright/test';

test('Check autocomplete CSS classes', async ({ page }) => {
  await page.goto('http://localhost:3000/regist100');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  // Handle consent modal
  const consentButton = page.getByTestId('btn-consent-accept');
  if (await consentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await consentButton.click();
    await page.waitForTimeout(500);
  }

  // Type in district field to trigger autocomplete
  await page.fill('input#th-district', 'ด');
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({ path: 'test-results/autocomplete-dropdown.png', fullPage: true });

  // Get all autocomplete elements and their computed styles
  const autocompleteInfo = await page.evaluate(() => {
    const results: any[] = [];
    
    // Check for different possible autocomplete containers
    const selectors = [
      '.ui-autocomplete',
      '.tt-menu',
      '.twitter-typeahead',
      '[class*="autocomplete"]',
      '[role="listbox"]',
      '.ui-menu'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        const computed = window.getComputedStyle(el);
        results.push({
          selector,
          index,
          className: el.className,
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontWeight: computed.fontWeight,
          opacity: computed.opacity,
          innerHTML: el.innerHTML.substring(0, 200)
        });
        
        // Also check children
        const children = el.querySelectorAll('*');
        children.forEach((child, childIndex) => {
          if (childIndex < 5) { // Only first 5 children
            const childComputed = window.getComputedStyle(child);
            results.push({
              selector: `${selector} > child[${childIndex}]`,
              className: child.className,
              tagName: child.tagName,
              color: childComputed.color,
              backgroundColor: childComputed.backgroundColor,
              fontWeight: childComputed.fontWeight,
              opacity: childComputed.opacity,
              textContent: child.textContent?.substring(0, 100)
            });
          }
        });
      });
    });
    
    return results;
  });

  console.log('=== AUTOCOMPLETE CSS INFO ===');
  console.log(JSON.stringify(autocompleteInfo, null, 2));
  
  // Wait to see the dropdown
  await page.waitForTimeout(5000);
});
