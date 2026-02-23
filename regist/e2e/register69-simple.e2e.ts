/**
 * Simplified E2E Test - Fills minimum required fields + at least 1 field per step
 */

import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as path from 'path';

require('chromedriver');

const CONFIG = {
  baseUrl: 'http://localhost:3000',
  waitTimeout: 20000,
};

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrollIntoView(driver: WebDriver, element: WebElement): Promise<void> {
  await driver.executeScript('arguments[0].scrollIntoView({block: "center", behavior: "smooth"});', element);
  await sleep(300);
}

async function fillField(driver: WebDriver, selector: string, value: string): Promise<void> {
  const element = await driver.wait(until.elementLocated(By.css(selector)), CONFIG.waitTimeout);
  await driver.wait(until.elementIsVisible(element), CONFIG.waitTimeout);
  await scrollIntoView(driver, element);
  await element.clear();
  await element.sendKeys(value);
  await driver.executeScript('arguments[0].dispatchEvent(new Event("change", { bubbles: true }));', element);
  await driver.executeScript('arguments[0].dispatchEvent(new Event("blur", { bubbles: true }));', element);
  await sleep(100);
}

async function selectOption(driver: WebDriver, selector: string, value: string): Promise<void> {
  const element = await driver.wait(until.elementLocated(By.css(selector)), CONFIG.waitTimeout);
  await scrollIntoView(driver, element);
  const Select = require('selenium-webdriver/lib/select').Select;
  const select = new Select(element);
  await select.selectByValue(value);
  await driver.executeScript('arguments[0].dispatchEvent(new Event("change", { bubbles: true }));', element);
  await sleep(100);
}

async function uploadFile(driver: WebDriver, selector: string, fileName: string): Promise<void> {
  const filePath = path.resolve(__dirname, '..', 'test-assets', fileName);
  const element = await driver.wait(until.elementLocated(By.css(selector)), CONFIG.waitTimeout);
  await scrollIntoView(driver, element);
  await element.sendKeys(filePath);
  await sleep(500);
}

async function clickNext(driver: WebDriver): Promise<void> {
  const nextBtn = await driver.findElement(By.xpath('//button[contains(text(), "ถัดไป")]'));
  await scrollIntoView(driver, nextBtn);
  await sleep(300);
  await nextBtn.click();
  await sleep(2000);
}

async function runTest() {
  console.log('🚀 Starting Simplified E2E Test');
  console.log('='.repeat(70));
  
  const options = new chrome.Options();
  options.addArguments('--start-maximized');
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  try {
    // Navigate
    console.log('\n📍 Navigating to form...');
    await driver.get(CONFIG.baseUrl);
    await sleep(1000);
    await driver.executeScript('localStorage.clear();');
    
    const startBtn = await driver.findElement(By.xpath('//a[contains(text(), "เริ่มกรอกแบบฟอร์ม")]'));
    await startBtn.click();
    await sleep(2000);
    
    // Close consent modal
    try {
      const consentBtn = await driver.findElement(By.css('[data-testid="btn-consent-accept"]'));
      if (await consentBtn.isDisplayed()) {
        await consentBtn.click();
        await sleep(1000);
      }
    } catch (e) {}
    
    // STEP 1
    console.log('\n📍 Step 1: Basic Information');
    await fillField(driver, 'input[name="schoolName"]', 'โรงเรียนทดสอบ E2E');
    await selectOption(driver, 'select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await sleep(300);
    await selectOption(driver, 'select[name="schoolLevel"]', 'ประถมศึกษา');
    await fillField(driver, 'input[name="phone"]', '02-123-4567');
    await clickNext(driver);
    
    // STEP 2
    console.log('\n📍 Step 2: Management');
    await fillField(driver, 'input[name="mgtFullName"]', 'นายทดสอบ E2E');
    await fillField(driver, 'input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await fillField(driver, 'input[name="mgtPhone"]', '081-234-5678');
    await uploadFile(driver, 'input[name="mgtImage"]', 'manager.jpg');
    await clickNext(driver);
    
    // STEP 3
    console.log('\n📍 Step 3: Teachers');
    await fillField(driver, 'input[name="thaiMusicTeachers.0.teacherFullName"]', 'นางสาวครู E2E');
    await fillField(driver, 'input[name="thaiMusicTeachers.0.teacherPosition"]', 'ครูดนตรี');
    await fillField(driver, 'input[name="thaiMusicTeachers.0.teacherPhone"]', '082-345-6789');
    await clickNext(driver);
    
    // STEP 4
    console.log('\n📍 Step 4: Teaching Plans');
    const addPlanBtn = await driver.findElement(By.xpath('//button[contains(text(), "+ เพิ่มข้อมูล")]'));
    await scrollIntoView(driver, addPlanBtn);
    await addPlanBtn.click();
    await sleep(500);
    await fillField(driver, 'input[name="currentTeachingPlans.0.gradeLevel"]', 'ป.4-ป.6');
    await fillField(driver, 'textarea[name="currentTeachingPlans.0.planDetails"]', 'สอนดนตรีไทยพื้นฐาน');
    await clickNext(driver);
    
    // STEP 5
    console.log('\n📍 Step 5: Skills');
    await fillField(driver, 'textarea[name="teacherSkillThaiMusicMajor"]', 'ครูมีความเชี่ยวชาญในการสอนดนตรีไทย');
    await clickNext(driver);
    
    // STEP 6
    console.log('\n📍 Step 6: Media');
    await fillField(driver, 'input[name="photoGalleryLink"]', 'https://drive.google.com/example');
    await clickNext(driver);
    
    // STEP 7
    console.log('\n📍 Step 7: Submit');
    
    // Wait for step 7 to load
    await driver.wait(until.elementLocated(By.css('input[name="certifiedINFOByAdminName"]')), CONFIG.waitTimeout);
    await sleep(500);
    
    const checkbox = await driver.findElement(By.css('input[name="certifiedINFOByAdminName"]'));
    await scrollIntoView(driver, checkbox);
    
    // Click checkbox and trigger React events
    await checkbox.click();
    await driver.executeScript(`
      const checkbox = arguments[0];
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      checkbox.dispatchEvent(new Event('blur', { bubbles: true }));
    `, checkbox);
    await sleep(500);
    
    console.log('  ✅ Checkbox clicked and events triggered');
    
    // Verify checkbox is checked
    const isChecked = await checkbox.isSelected();
    console.log(`  📋 Checkbox state: ${isChecked ? 'CHECKED' : 'NOT CHECKED'}`);
    
    if (!isChecked) {
      console.log('  ⚠️  Checkbox not checked, trying again...');
      await driver.executeScript('arguments[0].click();', checkbox);
      await driver.executeScript(`
        const checkbox = arguments[0];
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      `, checkbox);
      await sleep(500);
      const isCheckedAgain = await checkbox.isSelected();
      console.log(`  📋 Checkbox state after retry: ${isCheckedAgain ? 'CHECKED' : 'NOT CHECKED'}`);
    }
    
    // Find the submit button (type="submit")
    const submitBtn = await driver.findElement(By.css('[data-testid="btn-submit"]'));
    await scrollIntoView(driver, submitBtn);
    
    // Check if button is enabled
    const isEnabled = await submitBtn.isEnabled();
    console.log(`  📋 Submit button state: ${isEnabled ? 'ENABLED' : 'DISABLED'}`);
    
    // Get button text to confirm it's the right button
    const buttonText = await submitBtn.getText();
    console.log(`  📋 Button text: "${buttonText}"`);
    
    console.log('  🖱️  Clicking submit button...');
    
    // Click the submit button
    await submitBtn.click();
    
    // Also try to see if there are any form validation errors
    await sleep(1000);
    const validationErrors = await driver.findElements(By.css('p.text-red-500'));
    if (validationErrors.length > 0) {
      console.log('\n⚠️  Form validation errors found:');
      for (const error of validationErrors) {
        const errorText = await error.getText();
        if (errorText && errorText !== '*') {
          console.log(`    - ${errorText}`);
        }
      }
    }
    
    // Wait for success
    console.log('\n⏳ Waiting for API call and response...');
    await sleep(5000); // Increased wait time
    
    // Check for any JavaScript errors in console
    const logs = await driver.manage().logs().get('browser');
    const errors = logs.filter(log => log.level.name === 'SEVERE');
    if (errors.length > 0) {
      console.log('\n⚠️  Browser console errors:');
      errors.forEach(error => {
        console.log(`  - ${error.message}`);
      });
    }
    
    try {
      const alert = await driver.switchTo().alert();
      const alertText = await alert.getText();
      
      if (alertText.includes('สำเร็จ') || alertText.includes('ID:')) {
        console.log('\n✅ SUCCESS! Form submitted successfully');
        console.log(`📋 Message: ${alertText}`);
        
        // Extract submission ID
        const idMatch = alertText.match(/ID:\s*(\S+)/);
        if (idMatch) {
          console.log(`🆔 Submission ID: ${idMatch[1]}`);
        }
        
        await alert.accept();
      } else {
        console.log('\n❌ FAILURE! Alert shows error');
        console.log(`📋 Message: ${alertText}`);
        await alert.accept();
        throw new Error('Form submission failed: ' + alertText);
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes('Form submission failed')) {
        throw e;
      }
      console.log('\n❌ FAILURE! No success alert appeared');
      console.log('⚠️  This indicates the form did not submit properly');
      console.log('⚠️  Check browser console errors above for the root cause');
      throw new Error('Form submission did not complete - no success alert');
    }
    
    console.log('\n⏳ Keeping browser open for 5 seconds...');
    await sleep(5000);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    throw error;
  } finally {
    await driver.quit();
    console.log('\n✅ Test completed!');
  }
}

runTest()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
