import { test, expect } from '@playwright/test';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

test.describe('Register100 Form - Regression Test Suite', () => {
  
  // ==================== HAPPY CASE ====================
  test('HAPPY CASE 1: Complete form with all required fields', async ({ page }) => {
    console.log('🎯 HAPPY CASE 1: Testing complete form submission');
    
    await page.goto(`${BASE_URL}/regist100`);
    
    // Close consent modal properly
    console.log('📝 Closing Consent Modal...');
    const consentModal = page.locator('[data-testid="consent-modal"]');
    try {
      await consentModal.waitFor({ state: 'visible', timeout: 3000 });
      console.log('✅ Consent modal found, clicking accept button...');
      await page.click('button:has-text("ยอมรับ")');
      await consentModal.waitFor({ state: 'hidden', timeout: 3000 });
      console.log('✅ Consent modal closed');
    } catch (error) {
      console.log('ℹ️  Consent modal not found or already closed');
    }
    
    await page.waitForTimeout(500);
    
    // Step 1: Basic Information
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ Happy Case');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'ประถมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'สพฐ. (OBEC)');
    await page.fill('input[name="staffCount"]', '50');
    await page.fill('input[name="studentCount"]', '500');
    await page.selectOption('select[name="schoolSize"]', 'MEDIUM');
    await page.fill('textarea[name="studentCountByGrade"]', 'ป.1-6 รวม 500 คน');
    
    // Address
    await page.fill('input[name="addressNo"]', '123');
    await page.fill('input[name="moo"]', '5');
    await page.fill('input[name="road"]', 'ถนนทดสอบ');
    await page.fill('#th-district', 'คลอง');
    await page.waitForSelector('.tt-suggestion', { timeout: 5000 });
    await page.click('.tt-suggestion:first-child');
    await page.fill('input[name="postalCode"]', '10110');
    await page.fill('input[name="phone"]', '021234567');
    
    await page.click('button:has-text("ถัดไป")');
    
    // Step 2: Administrator
    await page.fill('input[name="mgtFullName"]', 'นายทดสอบ Happy');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0812345678');
    await page.fill('textarea[name="mgtAddress"]', '123 ถนนทดสอบ');
    await page.fill('input[name="mgtEmail"]', 'test@school.ac.th');
    
    const managerImagePath = path.join(process.cwd(), 'test-assets', 'manager.jpg');
    await page.setInputFiles('input[name="mgtImage"]', managerImagePath);
    
    await page.click('button:has-text("ถัดไป")');
    
    // Step 3-8: Fill minimal required fields
    await page.click('button:has-text("ถัดไป")'); // Step 3
    await page.click('button:has-text("ถัดไป")'); // Step 4
    await page.click('button:has-text("ถัดไป")'); // Step 5
    await page.click('button:has-text("ถัดไป")'); // Step 6
    await page.click('button:has-text("ถัดไป")'); // Step 7
    
    // Step 8: Final step
    await page.check('input[name="certifiedINFOByAdminName"]');
    
    // Submit
    await page.click('button:has-text("ส่งแบบฟอร์ม")');
    
    // Wait for success
    await expect(page.locator('text=ส่งข้อมูลสำเร็จ')).toBeVisible({ timeout: 10000 });
    console.log('✅ HAPPY CASE 1: Form submitted successfully');
  });

  // ==================== UNHAPPY CASE ====================
  test('UNHAPPY CASE 1: Submit without required fields', async ({ page }) => {
    console.log('🔴 UNHAPPY CASE 1: Testing form submission without required fields');
    
    await page.goto(`${BASE_URL}/regist100`);
    
    // Close consent modal properly
    console.log('📝 Closing Consent Modal...');
    const consentModal = page.locator('[data-testid="consent-modal"]');
    try {
      await consentModal.waitFor({ state: 'visible', timeout: 3000 });
      console.log('✅ Consent modal found, clicking accept button...');
      await page.click('button:has-text("ยอมรับ")');
      await consentModal.waitFor({ state: 'hidden', timeout: 3000 });
      console.log('✅ Consent modal closed');
    } catch (error) {
      console.log('ℹ️  Consent modal not found or already closed');
    }
    
    await page.waitForTimeout(500);
    
    // Try to proceed without filling anything
    await page.click('button:has-text("ถัดไป")');
    
    // Should show validation errors or stay on same page
    const currentUrl = page.url();
    console.log('Current URL after empty submit:', currentUrl);
    
    // Check if validation messages appear
    const validationMessages = await page.locator('.text-red-500, .text-red-600, [class*="error"]').count();
    console.log(`Found ${validationMessages} validation messages`);
    
    if (validationMessages === 0) {
      console.log('⚠️  VULNERABILITY: No validation messages shown for empty required fields!');
    } else {
      console.log('✅ Validation working: Error messages displayed');
    }
  });

  test('UNHAPPY CASE 2: Invalid email format', async ({ page }) => {
    console.log('🔴 UNHAPPY CASE 2: Testing invalid email format');
    
    await page.goto(`${BASE_URL}/regist100`);
    
    // Close consent modal properly
    console.log('📝 Closing Consent Modal...');
    const consentModal = page.locator('[data-testid="consent-modal"]');
    try {
      await consentModal.waitFor({ state: 'visible', timeout: 3000 });
      console.log('✅ Consent modal found, clicking accept button...');
      await page.click('button:has-text("ยอมรับ")');
      await consentModal.waitFor({ state: 'hidden', timeout: 3000 });
      console.log('✅ Consent modal closed');
    } catch (error) {
      console.log('ℹ️  Consent modal not found or already closed');
    }
    
    await page.waitForTimeout(500);
    
    // Fill Step 1 with valid data
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ Email');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'ประถมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'สพฐ. (OBEC)');
    await page.fill('input[name="staffCount"]', '50');
    await page.fill('input[name="studentCount"]', '500');
    await page.selectOption('select[name="schoolSize"]', 'MEDIUM');
    
    await page.click('button:has-text("ถัดไป")');
    
    // Step 2: Try invalid email formats
    await page.fill('input[name="mgtFullName"]', 'นายทดสอบ Email');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0812345678');
    
    const invalidEmails = [
      'invalid-email',
      'test@',
      '@school.ac.th',
      'test@@school.ac.th',
      'test@school',
    ];
    
    for (const invalidEmail of invalidEmails) {
      await page.fill('input[name="mgtEmail"]', invalidEmail);
      await page.click('button:has-text("ถัดไป")');
      
      // Check if validation prevents progression
      const emailInput = page.locator('input[name="mgtEmail"]');
      const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      
      if (validationMessage) {
        console.log(`✅ Email validation working for: ${invalidEmail}`);
      } else {
        console.log(`⚠️  VULNERABILITY: Invalid email accepted: ${invalidEmail}`);
      }
      
      // Clear for next test
      await page.fill('input[name="mgtEmail"]', '');
    }
  });

  test('UNHAPPY CASE 3: SQL Injection and XSS attempts', async ({ page }) => {
    console.log('🔴 UNHAPPY CASE 3: Testing SQL Injection and XSS vulnerabilities');
    
    await page.goto(`${BASE_URL}/regist100`);
    
    // Close consent modal properly
    console.log('📝 Closing Consent Modal...');
    const consentModal = page.locator('[data-testid="consent-modal"]');
    try {
      await consentModal.waitFor({ state: 'visible', timeout: 3000 });
      console.log('✅ Consent modal found, clicking accept button...');
      await page.click('button:has-text("ยอมรับ")');
      await consentModal.waitFor({ state: 'hidden', timeout: 3000 });
      console.log('✅ Consent modal closed');
    } catch (error) {
      console.log('ℹ️  Consent modal not found or already closed');
    }
    
    await page.waitForTimeout(500);
    
    const maliciousInputs = [
      // SQL Injection attempts
      "'; DROP TABLE register100_submissions; --",
      "1' OR '1'='1",
      "admin'--",
      "' UNION SELECT * FROM users--",
      
      // XSS attempts
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<iframe src="javascript:alert(\'XSS\')">',
      
      // Command Injection
      '; ls -la',
      '| cat /etc/passwd',
      '`whoami`',
    ];
    
    for (const maliciousInput of maliciousInputs) {
      console.log(`Testing malicious input: ${maliciousInput.substring(0, 30)}...`);
      
      // Try in school name field
      await page.fill('input[name="schoolName"]', maliciousInput);
      
      // Check if input is sanitized or escaped
      const inputValue = await page.inputValue('input[name="schoolName"]');
      
      if (inputValue === maliciousInput) {
        console.log(`⚠️  POTENTIAL VULNERABILITY: Malicious input accepted without sanitization`);
      } else {
        console.log(`✅ Input sanitized or escaped`);
      }
      
      // Clear for next test
      await page.fill('input[name="schoolName"]', '');
    }
  });

  // ==================== EDGE CASES ====================
  test('EDGE CASE 1: Maximum length validation', async ({ page }) => {
    console.log('🔶 EDGE CASE 1: Testing maximum length validation');
    
    await page.goto(`${BASE_URL}/regist100`);
    
    // Close consent modal properly
    console.log('📝 Closing Consent Modal...');
    const consentModal = page.locator('[data-testid="consent-modal"]');
    try {
      await consentModal.waitFor({ state: 'visible', timeout: 3000 });
      console.log('✅ Consent modal found, clicking accept button...');
      await page.click('button:has-text("ยอมรับ")');
      await consentModal.waitFor({ state: 'hidden', timeout: 3000 });
      console.log('✅ Consent modal closed');
    } catch (error) {
      console.log('ℹ️  Consent modal not found or already closed');
    }
    
    await page.waitForTimeout(500);
    
    // Test very long input
    const veryLongText = 'A'.repeat(10000);
    await page.fill('input[name="schoolName"]', veryLongText);
    
    const inputValue = await page.inputValue('input[name="schoolName"]');
    
    if (inputValue.length === veryLongText.length) {
      console.log(`⚠️  No max length validation: Accepted ${inputValue.length} characters`);
    } else {
      console.log(`✅ Max length enforced: Limited to ${inputValue.length} characters`);
    }
  });

  test('EDGE CASE 2: Special characters in text fields', async ({ page }) => {
    console.log('🔶 EDGE CASE 2: Testing special characters handling');
    
    await page.goto(`${BASE_URL}/regist100`);
    
    // Close consent modal properly
    console.log('📝 Closing Consent Modal...');
    const consentModal = page.locator('[data-testid="consent-modal"]');
    try {
      await consentModal.waitFor({ state: 'visible', timeout: 3000 });
      console.log('✅ Consent modal found, clicking accept button...');
      await page.click('button:has-text("ยอมรับ")');
      await consentModal.waitFor({ state: 'hidden', timeout: 3000 });
      console.log('✅ Consent modal closed');
    } catch (error) {
      console.log('ℹ️  Consent modal not found or already closed');
    }
    
    await page.waitForTimeout(500);
    
    const specialChars = [
      'โรงเรียน "ทดสอบ" \'พิเศษ\'',
      'School & Academy',
      'Test <> School',
      'School @ 2024',
      'Test\nNew\nLine',
      'Test\tTab\tSchool',
    ];
    
    for (const specialChar of specialChars) {
      await page.fill('input[name="schoolName"]', specialChar);
      const inputValue = await page.inputValue('input[name="schoolName"]');
      
      if (inputValue === specialChar) {
        console.log(`✅ Special characters preserved: ${specialChar.substring(0, 30)}`);
      } else {
        console.log(`⚠️  Special characters modified: "${specialChar}" → "${inputValue}"`);
      }
    }
  });

  test('EDGE CASE 3: File upload validation', async ({ page }) => {
    console.log('🔶 EDGE CASE 3: Testing file upload validation');
    
    await page.goto(`${BASE_URL}/regist100`);
    
    // Close consent modal properly
    console.log('📝 Closing Consent Modal...');
    const consentModal = page.locator('[data-testid="consent-modal"]');
    try {
      await consentModal.waitFor({ state: 'visible', timeout: 3000 });
      console.log('✅ Consent modal found, clicking accept button...');
      await page.click('button:has-text("ยอมรับ")');
      await consentModal.waitFor({ state: 'hidden', timeout: 3000 });
      console.log('✅ Consent modal closed');
    } catch (error) {
      console.log('ℹ️  Consent modal not found or already closed');
    }
    
    await page.waitForTimeout(500);
    
    // Fill Step 1
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ File Upload');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'ประถมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'สพฐ. (OBEC)');
    await page.click('button:has-text("ถัดไป")');
    
    // Step 2: Try uploading invalid file types
    await page.fill('input[name="mgtFullName"]', 'นายทดสอบ File');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0812345678');
    
    // Create a test text file
    const fs = require('fs');
    const testFilePath = path.join(process.cwd(), 'test-assets', 'test.txt');
    
    // Check if test file exists, if not create it
    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(testFilePath, 'This is a test file');
    }
    
    try {
      await page.setInputFiles('input[name="mgtImage"]', testFilePath);
      console.log('⚠️  VULNERABILITY: Non-image file accepted (.txt)');
    } catch (error) {
      console.log('✅ File type validation working: Non-image file rejected');
    }
    
    // Test very large file (if exists)
    const largeFilePath = path.join(process.cwd(), 'test-assets', 'large-image.jpg');
    if (fs.existsSync(largeFilePath)) {
      const stats = fs.statSync(largeFilePath);
      const fileSizeMB = stats.size / (1024 * 1024);
      
      try {
        await page.setInputFiles('input[name="mgtImage"]', largeFilePath);
        console.log(`⚠️  Large file accepted: ${fileSizeMB.toFixed(2)} MB`);
      } catch (error) {
        console.log(`✅ File size validation working: Large file rejected`);
      }
    }
  });

  // ==================== HAPPY CASE 2 ====================
  test('HAPPY CASE 2: Form with minimal required fields only', async ({ page }) => {
    console.log('🎯 HAPPY CASE 2: Testing minimal required fields submission');
    
    await page.goto(`${BASE_URL}/regist100`);
    
    // Close consent modal properly
    console.log('📝 Closing Consent Modal...');
    const consentModal = page.locator('[data-testid="consent-modal"]');
    try {
      await consentModal.waitFor({ state: 'visible', timeout: 3000 });
      console.log('✅ Consent modal found, clicking accept button...');
      await page.click('button:has-text("ยอมรับ")');
      await consentModal.waitFor({ state: 'hidden', timeout: 3000 });
      console.log('✅ Consent modal closed');
    } catch (error) {
      console.log('ℹ️  Consent modal not found or already closed');
    }
    
    await page.waitForTimeout(500);
    
    // Fill only absolutely required fields
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ Minimal');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'ประถมศึกษา');
    
    // Navigate through all steps with minimal input
    for (let i = 0; i < 7; i++) {
      await page.click('button:has-text("ถัดไป")');
      await page.waitForTimeout(500);
    }
    
    // Final step
    await page.check('input[name="certifiedINFOByAdminName"]');
    await page.click('button:has-text("ส่งแบบฟอร์ม")');
    
    // Check if submission succeeds or fails
    const successVisible = await page.locator('text=ส่งข้อมูลสำเร็จ').isVisible({ timeout: 5000 }).catch(() => false);
    
    if (successVisible) {
      console.log('✅ HAPPY CASE 2: Minimal form submitted successfully');
    } else {
      console.log('⚠️  Minimal form rejected - check required field validation');
    }
  });

  // ==================== HAPPY CASE 3 ====================
  test('HAPPY CASE 3: Form navigation - Back and forth', async ({ page }) => {
    console.log('🎯 HAPPY CASE 3: Testing form navigation and data persistence');
    
    await page.goto(`${BASE_URL}/regist100`);
    
    // Close consent modal properly
    console.log('📝 Closing Consent Modal...');
    const consentModal = page.locator('[data-testid="consent-modal"]');
    try {
      await consentModal.waitFor({ state: 'visible', timeout: 3000 });
      console.log('✅ Consent modal found, clicking accept button...');
      await page.click('button:has-text("ยอมรับ")');
      await consentModal.waitFor({ state: 'hidden', timeout: 3000 });
      console.log('✅ Consent modal closed');
    } catch (error) {
      console.log('ℹ️  Consent modal not found or already closed');
    }
    
    await page.waitForTimeout(500);
    
    // Step 1: Fill data
    const schoolName = 'โรงเรียนทดสอบ Navigation';
    await page.fill('input[name="schoolName"]', schoolName);
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.click('button:has-text("ถัดไป")');
    
    // Step 2: Fill data
    const mgtName = 'นายทดสอบ Navigation';
    await page.fill('input[name="mgtFullName"]', mgtName);
    await page.click('button:has-text("ถัดไป")');
    
    // Go back to Step 1
    await page.click('button:has-text("ย้อนกลับ")');
    
    // Check if data persists
    const persistedSchoolName = await page.inputValue('input[name="schoolName"]');
    
    if (persistedSchoolName === schoolName) {
      console.log('✅ Data persistence working: Form data retained when navigating back');
    } else {
      console.log('⚠️  Data lost when navigating back');
    }
    
    // Go forward again
    await page.click('button:has-text("ถัดไป")');
    
    // Check Step 2 data
    const persistedMgtName = await page.inputValue('input[name="mgtFullName"]');
    
    if (persistedMgtName === mgtName) {
      console.log('✅ Data persistence working: Step 2 data retained');
    } else {
      console.log('⚠️  Step 2 data lost');
    }
  });
});
