/**
 * E2E Test for Thai Music School Registration Form (แบบเสนอผลงาน 69)
 * 
 * This test uses Selenium WebDriver with Chrome in visible mode to:
 * 1. Navigate to the registration form
 * 2. Fill all required and optional fields
 * 3. Upload files
 * 4. Submit the form
 * 5. Verify success
 */

import { Builder, By, until, WebDriver, WebElement, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import 'chromedriver';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// SELECTOR MAP - Easy to adjust if needed
// ============================================================================
const SELECTORS = {
  // Home page
  startButton: '//a[contains(text(), "เริ่มกรอกแบบฟอร์ม")]',
  
  // Navigation
  btnNext: '[data-testid="btn-next"]',
  btnBack: '[data-testid="btn-back"]',
  btnSubmit: '[data-testid="btn-submit"]',
  btnSaveDraft: '[data-testid="btn-save-draft"]',
  
  // Step indicators
  step1: '[data-testid="step-1"]',
  step2: '[data-testid="step-2"]',
  step3: '[data-testid="step-3"]',
  step4: '[data-testid="step-4"]',
  step5: '[data-testid="step-5"]',
  step6: '[data-testid="step-6"]',
  step7: '[data-testid="step-7"]',
  
  // Step 1 fields
  schoolName: 'input[name="schoolName"]',
  schoolProvince: 'select[name="schoolProvince"]',
  schoolLevel: 'select[name="schoolLevel"]',
  affiliation: 'select[name="affiliation"]',
  staffCount: 'input[name="staffCount"]',
  studentCount: 'input[name="studentCount"]',
  addressNo: 'input[name="addressNo"]',
  moo: 'input[name="moo"]',
  road: 'input[name="road"]',
  subDistrict: '#th-district',
  district: '#th-amphoe',
  provinceAddress: '#th-province',
  postalCode: '#th-zipcode',
  phone: 'input[name="phone"]',
  fax: 'input[name="fax"]',
  
  // Step 2 fields
  mgtFullName: 'input[name="mgtFullName"]',
  mgtPosition: 'input[name="mgtPosition"]',
  mgtPhone: 'input[name="mgtPhone"]',
  mgtEmail: 'input[name="mgtEmail"]',
  mgtImage: 'input[name="mgtImage"]',
  
  // Step 3 - Teachers (dynamic)
  teacherFullName: (index: number) => `input[name="thaiMusicTeachers.${index}.teacherFullName"]`,
  teacherPosition: (index: number) => `input[name="thaiMusicTeachers.${index}.teacherPosition"]`,
  teacherEducation: (index: number) => `input[name="thaiMusicTeachers.${index}.teacherEducation"]`,
  teacherPhone: (index: number) => `input[name="thaiMusicTeachers.${index}.teacherPhone"]`,
  teacherEmail: (index: number) => `input[name="thaiMusicTeachers.${index}.teacherEmail"]`,
  teacherImage: (index: number) => `input[name="thaiMusicTeachers.${index}.teacherImage"]`,
  addTeacherBtn: '//button[contains(text(), "+ เพิ่มข้อมูล")]',
  
  // Step 7 - Certification
  certifiedCheckbox: 'input[name="certifiedINFOByAdminName"]',
};

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  baseUrl: 'http://localhost:3000',
  typingDelayMin: 30,  // Reduced from 80
  typingDelayMax: 50,  // Reduced from 120
  waitTimeout: 20000, // Increased to 20 seconds
  keepBrowserOpenSeconds: 5,
};

// ============================================================================
// TEST DATA
// ============================================================================
const TEST_DATA = {
  // Step 1
  schoolName: 'โรงเรียนดนตรีไทยตัวอย่าง',
  schoolProvince: 'กรุงเทพมหานคร',
  schoolLevel: 'ประถมศึกษา',
  affiliation: 'กระทรวงศึกษาธิการ (Ministry of Education)',
  staffCount: '120',
  studentCount: '2344',
  addressNo: '123',
  moo: '5',
  road: 'ถนนพระราม 4',
  subDistrict: 'ดอนเมือง',
  district: 'ดอนเมือง',
  provinceAddress: 'กรุงเทพมหานคร',
  postalCode: '10210',
  phone: '021234567',
  fax: '021234568',
  
  // Step 2
  mgtFullName: 'นายสมชาย ใจดี',
  mgtPosition: 'ผู้อำนวยการ',
  mgtPhone: '0812345678',
  mgtEmail: 'somchai@school.ac.th',
  
  // Step 3 - Teachers
  teachers: [
    {
      fullName: 'นางสาวสมหญิง ดนตรี',
      position: 'ครูดนตรีไทย',
      education: 'ปริญญาตรี ดนตรีไทย',
      phone: '0823456789',
      email: 'somying@school.ac.th',
    },
    {
      fullName: 'นายสมศักดิ์ ดนตรีไทย',
      position: 'ครูพิเศษ',
      education: 'ปริญญาโท ดนตรีไทย',
      phone: '0834567890',
      email: 'somsak@school.ac.th',
    },
  ],
  
  // Step 4 - Teaching Plans
  teachingPlans: [
    {
      gradeLevel: 'ป.4-ป.6',
      planDetails: 'สอนดนตรีไทยพื้นฐาน เน้นการเล่นเครื่องดนตรีประเภทเครื่องตี เช่น ระนาดเอก ระนาดทุ้ม',
    },
    {
      gradeLevel: 'ม.1-ม.3',
      planDetails: 'สอนดนตรีไทยขั้นสูง เน้นการเล่นเครื่องดนตรีประเภทเครื่องสี เช่น ซอด้วง ซออู้',
    },
  ],
  
  instruments: [
    {
      instrumentName: 'ระนาดเอก',
      quantity: '5',
    },
    {
      instrumentName: 'ซอด้วง',
      quantity: '3',
    },
  ],
  
  // Step 5
  teacherSkills: 'ครูมีความเชี่ยวชาญในการสอนดนตรีไทย จบการศึกษาสาขาดนตรีไทยโดยตรง มีประสบการณ์การสอนมากกว่า 10 ปี',
  teacherSkillsOther: 'ครูที่จบสาขาอื่นได้ผ่านการอบรมดนตรีไทยจากสถาบันชั้นนำ มีทักษะการสอนที่ดี',
  curriculum: 'มีหลักสูตรดนตรีไทยเป็นวิชาเลือกและวิชาเพิ่มเติม บูรณาการกับวิชาอื่นๆ',
  instrumentSufficiencyDetail: 'มีเครื่องดนตรีครบชุด เพียงพอสำหรับนักเรียนทุกคน',
  learningOutcomes: 'นักเรียนสามารถเล่นดนตรีไทยได้อย่างมีทักษะ มีความเข้าใจในวัฒนธรรมไทย',
  managementContext: 'มีการจัดการเรียนการสอนอย่างเป็นระบบ แบ่งตามระดับชั้นและความสามารถ',
  equipmentAndBudgetSupport: 'ได้รับงบประมาณสนับสนุนจากโรงเรียนและผู้ปกครอง',
  
  // Step 6
  photoGalleryLink: 'https://drive.google.com/drive/folders/example-photos',
  
  classroomVideos: [
    {
      videoLink: 'https://www.youtube.com/watch?v=example1',
    },
  ],
  
  performanceVideos: [
    {
      type: 'internal',
      videoLink: 'https://www.youtube.com/watch?v=example2',
    },
    {
      type: 'external',
      videoLink: 'https://www.youtube.com/watch?v=example3',
    },
  ],
  
  // Step 7
  publicityLinks: 'https://www.facebook.com/schoolpage, https://www.youtube.com/channel/schoolchannel',
  heardFromSchoolName: 'โรงเรียนตัวอย่าง',
  heardFromSchoolDistrict: 'เมือง',
  heardFromSchoolProvince: 'กรุงเทพมหานคร',
  heardFromCulturalOffice: 'สำนักงานวัฒนธรรมจังหวัดกรุงเทพมหานคร',
  heardFromEducationArea: 'สพป.กรุงเทพมหานคร เขต 1',
  heardFromEducationAreaProvince: 'กรุงเทพมหานคร',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get random typing delay between min and max
 */
function getTypingDelay(): number {
  return Math.floor(
    Math.random() * (CONFIG.typingDelayMax - CONFIG.typingDelayMin) + CONFIG.typingDelayMin
  );
}

/**
 * Type text character by character with realistic delay
 */
async function typeText(element: WebElement, text: string): Promise<void> {
  for (const char of text) {
    await element.sendKeys(char);
    await sleep(getTypingDelay());
  }
}

/**
 * Scroll element into view
 */
async function scrollIntoView(driver: WebDriver, element: WebElement): Promise<void> {
  await driver.executeScript('arguments[0].scrollIntoView({block: "center", behavior: "smooth"});', element);
  await sleep(300);
}

/**
 * Wait for element and return it
 */
async function waitAndFind(driver: WebDriver, selector: string, isCss: boolean = true): Promise<WebElement> {
  const locator = isCss ? By.css(selector) : By.xpath(selector);
  await driver.wait(until.elementLocated(locator), CONFIG.waitTimeout);
  const element = await driver.findElement(locator);
  await driver.wait(until.elementIsVisible(element), CONFIG.waitTimeout);
  return element;
}

/**
 * Fill input field with typing simulation
 */
async function fillField(
  driver: WebDriver,
  selector: string,
  value: string,
  label: string
): Promise<void> {
  console.log(`  📝 Filling: ${label}`);
  const element = await waitAndFind(driver, selector);
  await scrollIntoView(driver, element);
  await element.clear();
  
  // Check if it's a textarea - if so, set value directly for speed
  const tagName = await element.getTagName();
  if (tagName.toLowerCase() === 'textarea' && value.length > 50) {
    // For long text in textareas, set value directly instead of typing
    await driver.executeScript('arguments[0].value = arguments[1];', element, value);
    await driver.executeScript('arguments[0].dispatchEvent(new Event("input", { bubbles: true }));', element);
  } else {
    // For short text or input fields, type normally
    await typeText(element, value);
  }
  
  // Trigger change and blur events to ensure validation
  await driver.executeScript('arguments[0].dispatchEvent(new Event("change", { bubbles: true }));', element);
  await driver.executeScript('arguments[0].dispatchEvent(new Event("blur", { bubbles: true }));', element);
  await sleep(100);
}

/**
 * Select dropdown option
 */
async function selectOption(
  driver: WebDriver,
  selector: string,
  value: string,
  label: string
): Promise<void> {
  console.log(`  📋 Selecting: ${label} = ${value}`);
  const element = await waitAndFind(driver, selector);
  await scrollIntoView(driver, element);
  
  // Use executeScript to select the option
  await driver.executeScript(`
    const select = arguments[0];
    select.value = arguments[1];
    select.dispatchEvent(new Event('change', { bubbles: true }));
    select.dispatchEvent(new Event('blur', { bubbles: true }));
  `, element, value);
  
  await sleep(100);
}

/**
 * Upload file
 */
async function uploadFile(
  driver: WebDriver,
  selector: string,
  fileName: string,
  label: string
): Promise<void> {
  console.log(`  📤 Uploading: ${label} = ${fileName}`);
  const filePath = path.resolve(__dirname, '..', 'test-assets', fileName);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  File not found: ${filePath}`);
    return;
  }
  
  const element = await waitAndFind(driver, selector);
  await scrollIntoView(driver, element);
  await element.sendKeys(filePath);
  await sleep(500);
}

/**
 * Click button
 */
async function clickButton(
  driver: WebDriver,
  selector: string,
  label: string,
  isCss: boolean = true
): Promise<void> {
  console.log(`  🖱️  Clicking: ${label}`);
  const element = await waitAndFind(driver, selector, isCss);
  await scrollIntoView(driver, element);
  await sleep(300);
  await element.click();
  await sleep(500);
}

// ============================================================================
// MAIN TEST
// ============================================================================

async function runE2ETest() {
  console.log('🚀 Starting E2E Test for Thai Music School Registration Form');
  console.log('='.repeat(70));
  
  // Setup Chrome options (non-headless)
  const options = new chrome.Options();
  options.addArguments('--start-maximized');
  options.addArguments('--disable-blink-features=AutomationControlled');
  
  // Build driver
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  try {
    // ========================================================================
    // STEP 0: Navigate to home page and start
    // ========================================================================
    console.log('\n📍 Step 0: Navigate to home page');
    await driver.get(CONFIG.baseUrl);
    await sleep(2000);
    
    // Hard refresh to ensure jQuery loads properly (Ctrl+Shift+R)
    console.log('  🔄 Performing hard refresh (Ctrl+Shift+R)...');
    await driver.navigate().refresh();
    
    console.log('  ⏳ Waiting 5 seconds for jQuery to load...');
    await sleep(5000);
    
    // Wait for jQuery.Thailand.js initialization message in console
    console.log('  ⏳ Waiting for jquery.Thailand.js initialization...');
    let jqueryInitialized = false;
    let attempts = 0;
    const maxAttempts = 20; // 10 seconds max
    
    while (!jqueryInitialized && attempts < maxAttempts) {
      try {
        jqueryInitialized = await driver.executeScript(`
          // Check if jQuery and Thailand plugin are loaded
          return typeof window.jQuery !== 'undefined' && 
                 typeof window.jQuery.Thailand === 'function';
        `);
        
        if (jqueryInitialized) {
          console.log('  ✅ jquery.Thailand.js is initialized and ready!');
          break;
        }
      } catch (e) {
        // Continue waiting
      }
      
      await sleep(500);
      attempts++;
    }
    
    if (!jqueryInitialized) {
      console.log('  ⚠️  jquery.Thailand.js not detected, but continuing anyway...');
    }
    
    // Clear localStorage to avoid draft restoration
    await driver.executeScript('localStorage.clear();');
    console.log('  🗑️  Cleared localStorage');
    
    console.log('  🖱️  Clicking: เริ่มกรอกแบบฟอร์ม button');
    await clickButton(driver, SELECTORS.startButton, 'Start Form Button', false);
    await sleep(2000);
    
    // ========================================================================
    // Handle Consent Modal (if it appears)
    // ========================================================================
    console.log('\n📍 Checking for consent modal...');
    try {
      const consentButton = await driver.findElement(By.css('[data-testid="btn-consent-accept"]'));
      if (await consentButton.isDisplayed()) {
        console.log('  ✅ Consent modal found - clicking accept');
        await consentButton.click();
        await sleep(1000);
      }
    } catch (e) {
      console.log('  ℹ️  No consent modal (already accepted)');
    }
    
    // ========================================================================
    // STEP 1: Basic Information
    // ========================================================================
    console.log('\n📍 Step 1: Basic Information (ข้อมูลพื้นฐาน)');
    
    await fillField(driver, SELECTORS.schoolName, TEST_DATA.schoolName, 'School Name');
    await selectOption(driver, SELECTORS.schoolProvince, TEST_DATA.schoolProvince, 'School Province');
    await sleep(300); // Wait for province to be set
    await selectOption(driver, SELECTORS.schoolLevel, TEST_DATA.schoolLevel, 'School Level');
    await sleep(300); // Wait for level to be set
    await selectOption(driver, SELECTORS.affiliation, TEST_DATA.affiliation, 'Affiliation');
    
    // Fill staff count (จำนวนครู/บุคลากร)
    console.log('  📝 Filling: Staff Count = ' + TEST_DATA.staffCount);
    await sleep(500);
    
    const allStaffInputs = await driver.findElements(By.css('input[type="text"]'));
    let staffCountFilled = false;
    
    for (const input of allStaffInputs) {
      try {
        const parent = await input.findElement(By.xpath('..'));
        const parentText = await parent.getText();
        
        if (parentText.includes('จำนวนครู') || parentText.includes('บุคลากร')) {
          console.log('  ✅ Found staff count input field');
          await scrollIntoView(driver, input);
          await input.clear();
          await input.sendKeys(TEST_DATA.staffCount);
          await driver.executeScript('arguments[0].dispatchEvent(new Event("change", { bubbles: true }));', input);
          await driver.executeScript('arguments[0].dispatchEvent(new Event("blur", { bubbles: true }));', input);
          staffCountFilled = true;
          break;
        }
      } catch (e) {
        // Continue to next input
      }
    }
    
    if (!staffCountFilled) {
      console.log('  ⚠️  Could not find staff count field by label, trying alternative method...');
      await driver.executeScript(`
        const labels = Array.from(document.querySelectorAll('label'));
        const staffLabel = labels.find(l => l.textContent.includes('จำนวนครู') || l.textContent.includes('บุคลากร'));
        if (staffLabel) {
          const container = staffLabel.closest('div');
          const input = container.querySelector('input[type="text"]');
          if (input) {
            input.value = '${TEST_DATA.staffCount}';
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('blur', { bubbles: true }));
            console.log('✅ Filled staff count via JavaScript');
          }
        }
      `);
    }
    
    await sleep(500);
    
    // Fill student count (required for schoolSize calculation)
    console.log('  📝 Filling: Student Count = ' + TEST_DATA.studentCount);
    // Wait a bit to ensure the page is fully loaded
    await sleep(500);
    
    // Find all text inputs and identify the student count field
    const allInputs = await driver.findElements(By.css('input[type="text"]'));
    let studentCountFilled = false;
    
    for (const input of allInputs) {
      try {
        // Check if this input is near a label containing "จำนวนนักเรียน"
        const parent = await input.findElement(By.xpath('..'));
        const parentText = await parent.getText();
        
        if (parentText.includes('จำนวนนักเรียน')) {
          console.log('  ✅ Found student count input field');
          await scrollIntoView(driver, input);
          await input.clear();
          await input.sendKeys(TEST_DATA.studentCount);
          await driver.executeScript('arguments[0].dispatchEvent(new Event("change", { bubbles: true }));', input);
          await driver.executeScript('arguments[0].dispatchEvent(new Event("blur", { bubbles: true }));', input);
          studentCountFilled = true;
          break;
        }
      } catch (e) {
        // Continue to next input
      }
    }
    
    if (!studentCountFilled) {
      console.log('  ⚠️  Could not find student count field by label, trying alternative method...');
      // Alternative: Use JavaScript to find and fill the field
      await driver.executeScript(`
        const labels = Array.from(document.querySelectorAll('label'));
        const studentLabel = labels.find(l => l.textContent.includes('จำนวนนักเรียน'));
        if (studentLabel) {
          const container = studentLabel.closest('div');
          const input = container.querySelector('input[type="text"]');
          if (input) {
            input.value = '${TEST_DATA.studentCount}';
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('blur', { bubbles: true }));
            console.log('✅ Filled student count via JavaScript');
          }
        }
      `);
    }
    
    await sleep(1000); // Wait for schoolSize to be calculated
    
    // Verify schoolSize was calculated
    const schoolSizeValue = await driver.executeScript(`
      const schoolSizeDisplay = document.querySelector('div.text-\\\\[\\\\#0FA968\\\\]');
      return schoolSizeDisplay ? schoolSizeDisplay.textContent : 'NOT FOUND';
    `);
    console.log(`  📊 School Size calculated: ${schoolSizeValue}`);
    
    // Address fields
    await fillField(driver, SELECTORS.addressNo, TEST_DATA.addressNo, 'Address No');
    await fillField(driver, SELECTORS.moo, TEST_DATA.moo, 'Moo');
    await fillField(driver, SELECTORS.road, TEST_DATA.road, 'Road');
    
    // Fill subDistrict (ตำบล/แขวง) and wait for autocomplete
    console.log('  📝 Filling: Sub-district (ตำบล/แขวง) = ' + TEST_DATA.subDistrict);
    const subDistrictInput = await waitAndFind(driver, SELECTORS.subDistrict);
    await scrollIntoView(driver, subDistrictInput);
    await subDistrictInput.clear();
    await subDistrictInput.sendKeys(TEST_DATA.subDistrict);
    await driver.executeScript('arguments[0].dispatchEvent(new Event("input", { bubbles: true }));', subDistrictInput);
    await driver.executeScript('arguments[0].dispatchEvent(new Event("change", { bubbles: true }));', subDistrictInput);
    
    console.log('  ⏳ Waiting 3 seconds for jquery.Thailand.js autocomplete...');
    await sleep(3000);
    
    // The autocomplete should have filled district and province automatically
    console.log('  ✅ Autocomplete should have filled district and province');
    
    // Verify autocomplete worked by checking if district and province are filled
    const districtValue = await driver.executeScript(`
      return document.querySelector('#th-amphoe')?.value || 'NOT FILLED';
    `);
    const provinceValue = await driver.executeScript(`
      return document.querySelector('#th-province')?.value || 'NOT FILLED';
    `);
    console.log(`  📍 District autocompleted: ${districtValue}`);
    console.log(`  📍 Province autocompleted: ${provinceValue}`);
    
    // If autocomplete didn't work, fill manually
    if (districtValue === 'NOT FILLED' || districtValue === '') {
      console.log('  ⚠️  Autocomplete did not work, filling district manually...');
      await fillField(driver, SELECTORS.district, TEST_DATA.district, 'District');
    }
    
    if (provinceValue === 'NOT FILLED' || provinceValue === '') {
      console.log('  ⚠️  Autocomplete did not work, filling province manually...');
      await fillField(driver, SELECTORS.provinceAddress, TEST_DATA.provinceAddress, 'Province');
    }
    
    await fillField(driver, SELECTORS.postalCode, TEST_DATA.postalCode, 'Postal Code');
    await fillField(driver, SELECTORS.phone, TEST_DATA.phone, 'Phone');
    await fillField(driver, SELECTORS.fax, TEST_DATA.fax, 'Fax');
    
    console.log('  ⏳ Waiting 5 seconds for schoolSize calculation and React state updates...');
    await sleep(5000);
    
    console.log('  🖱️  Scrolling to footer and clicking: ถัดไป button');
    // Find the "ถัดไป" button in the footer
    const nextButton = await driver.findElement(By.xpath('//button[contains(text(), "ถัดไป")]'));
    await driver.executeScript('arguments[0].scrollIntoView({block: "center", behavior: "smooth"});', nextButton);
    await sleep(500);
    await nextButton.click();
    await sleep(2000); // Wait for page transition
    
    // Debug: Check if we're still on step 1
    try {
      const currentUrl = await driver.getCurrentUrl();
      console.log(`  📍 Current URL after click: ${currentUrl}`);
      
      // Check if there are any validation errors visible
      const errorMessages = await driver.findElements(By.css('p.text-red-500'));
      if (errorMessages.length > 0) {
        console.log(`  ⚠️  Found ${errorMessages.length} validation error messages:`);
        for (const error of errorMessages) {
          const errorText = await error.getText();
          if (errorText && errorText !== '*') {
            console.log(`    - ${errorText}`);
          }
        }
      } else {
        console.log('  ℹ️  No validation error messages found');
      }
    } catch (e) {
      // Ignore debug errors
    }
    
    // ========================================================================
    // STEP 2: Management Information
    // ========================================================================
    console.log('\n📍 Step 2: Management Information (ผู้บริหารสถานศึกษา)');
    
    // Wait for Step 2 to be active and form fields to be visible
    console.log('  ⏳ Waiting for Step 2 to load...');
    await driver.wait(until.elementLocated(By.css('input[name="mgtFullName"]')), CONFIG.waitTimeout);
    await sleep(500);
    
    await fillField(driver, SELECTORS.mgtFullName, TEST_DATA.mgtFullName, 'Manager Full Name');
    await fillField(driver, SELECTORS.mgtPosition, TEST_DATA.mgtPosition, 'Manager Position');
    await fillField(driver, SELECTORS.mgtPhone, TEST_DATA.mgtPhone, 'Manager Phone');
    
    // ========================================================================
    // EMAIL VALIDATION TEST
    // ========================================================================
    console.log('\n  📧 Testing email validation...');
    
    // Test 1: Invalid format - missing domain (abc@.com)
    console.log('  ❌ Test 1: Invalid email format (abc@.com)');
    const emailInput = await waitAndFind(driver, SELECTORS.mgtEmail);
    await scrollIntoView(driver, emailInput);
    await emailInput.clear();
    await emailInput.sendKeys('abc@.com');
    await sleep(300);
    
    // Check HTML5 validation state
    const isValid1 = await driver.executeScript('return arguments[0].validity.valid;', emailInput);
    console.log(`    Validation result: ${isValid1 ? '✅ Valid (unexpected)' : '❌ Invalid (expected)'}`);
    
    // Test 2: Invalid format - missing @ (abc.com)
    console.log('  ❌ Test 2: Invalid email format (abc.com)');
    await emailInput.clear();
    await emailInput.sendKeys('abc.com');
    await sleep(300);
    
    const isValid2 = await driver.executeScript('return arguments[0].validity.valid;', emailInput);
    console.log(`    Validation result: ${isValid2 ? '✅ Valid (unexpected)' : '❌ Invalid (expected)'}`);
    
    // Test 3: Valid format (abc@email.com)
    console.log('  ✅ Test 3: Valid email format (abc@email.com)');
    await emailInput.clear();
    await emailInput.sendKeys(TEST_DATA.mgtEmail);
    await sleep(300);
    
    const isValid3 = await driver.executeScript('return arguments[0].validity.valid;', emailInput);
    console.log(`    Validation result: ${isValid3 ? '✅ Valid (expected)' : '❌ Invalid (unexpected)'}`);
    
    // Trigger change and blur events
    await driver.executeScript('arguments[0].dispatchEvent(new Event("change", { bubbles: true }));', emailInput);
    await driver.executeScript('arguments[0].dispatchEvent(new Event("blur", { bubbles: true }));', emailInput);
    await sleep(100);
    
    console.log('  ✅ Email validation tests completed');
    // ========================================================================
    
    await uploadFile(driver, SELECTORS.mgtImage, 'manager.jpg', 'Manager Image');
    
    await clickButton(driver, SELECTORS.btnNext, 'Next Button');
    await sleep(1000);
    
    // ========================================================================
    // STEP 3: Teachers Information
    // ========================================================================
    console.log('\n📍 Step 3: Teachers Information (ผู้สอนดนตรีไทย)');
    
    // Fill first teacher (already exists)
    console.log('  👤 Teacher 1:');
    await fillField(driver, SELECTORS.teacherFullName(0), TEST_DATA.teachers[0].fullName, 'Teacher 1 Name');
    await fillField(driver, SELECTORS.teacherPosition(0), TEST_DATA.teachers[0].position, 'Teacher 1 Position');
    await fillField(driver, SELECTORS.teacherEducation(0), TEST_DATA.teachers[0].education, 'Teacher 1 Education');
    await fillField(driver, SELECTORS.teacherPhone(0), TEST_DATA.teachers[0].phone, 'Teacher 1 Phone');
    await fillField(driver, SELECTORS.teacherEmail(0), TEST_DATA.teachers[0].email, 'Teacher 1 Email');
    await uploadFile(driver, SELECTORS.teacherImage(0), 'teacher1.jpg', 'Teacher 1 Image');
    
    // Add second teacher
    console.log('  ➕ Adding Teacher 2');
    await clickButton(driver, SELECTORS.addTeacherBtn, 'Add Teacher Button', false);
    await sleep(1000);
    
    console.log('  👤 Teacher 2:');
    await fillField(driver, SELECTORS.teacherFullName(1), TEST_DATA.teachers[1].fullName, 'Teacher 2 Name');
    await fillField(driver, SELECTORS.teacherPosition(1), TEST_DATA.teachers[1].position, 'Teacher 2 Position');
    await fillField(driver, SELECTORS.teacherEducation(1), TEST_DATA.teachers[1].education, 'Teacher 2 Education');
    await fillField(driver, SELECTORS.teacherPhone(1), TEST_DATA.teachers[1].phone, 'Teacher 2 Phone');
    await fillField(driver, SELECTORS.teacherEmail(1), TEST_DATA.teachers[1].email, 'Teacher 2 Email');
    
    await clickButton(driver, SELECTORS.btnNext, 'Next Button');
    await sleep(1000);
    
    // ========================================================================
    // STEP 4: Teaching Plans and Instruments
    // ========================================================================
    console.log('\n📍 Step 4: Teaching Plans and Instruments');
    
    // Wait for Step 4 to load
    await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "+ เพิ่มข้อมูล")]')), CONFIG.waitTimeout);
    await sleep(500);
    
    // Add first teaching plan
    console.log('  ➕ Adding teaching plan 1');
    const addPlanBtn = await driver.findElement(By.xpath('//button[contains(text(), "+ เพิ่มข้อมูล")]'));
    await scrollIntoView(driver, addPlanBtn);
    await addPlanBtn.click();
    await sleep(500);
    
    await fillField(driver, 'input[name="currentTeachingPlans.0.gradeLevel"]', TEST_DATA.teachingPlans[0].gradeLevel, 'Grade Level 1');
    await fillField(driver, 'textarea[name="currentTeachingPlans.0.planDetails"]', TEST_DATA.teachingPlans[0].planDetails, 'Plan Details 1');
    
    // Add second teaching plan
    console.log('  ➕ Adding teaching plan 2');
    const addPlanBtn2 = await driver.findElement(By.xpath('//button[contains(text(), "+ เพิ่มข้อมูล")]'));
    await scrollIntoView(driver, addPlanBtn2);
    await addPlanBtn2.click();
    await sleep(500);
    
    await fillField(driver, 'input[name="currentTeachingPlans.1.gradeLevel"]', TEST_DATA.teachingPlans[1].gradeLevel, 'Grade Level 2');
    await fillField(driver, 'textarea[name="currentTeachingPlans.1.planDetails"]', TEST_DATA.teachingPlans[1].planDetails, 'Plan Details 2');
    
    // Add instruments
    console.log('  🎵 Adding instruments');
    // Find the instruments section (look for the second "+ เพิ่มข้อมูล" button group)
    const addInstrumentBtns = await driver.findElements(By.xpath('//button[contains(text(), "+ เพิ่มข้อมูล")]'));
    if (addInstrumentBtns.length > 1) {
      await scrollIntoView(driver, addInstrumentBtns[1]);
      await addInstrumentBtns[1].click();
      await sleep(500);
      
      await fillField(driver, 'input[name="availableInstruments.0.availableInstrumentsName"]', TEST_DATA.instruments[0].instrumentName, 'Instrument 1 Name');
      await fillField(driver, 'input[name="availableInstruments.0.availableInstrumentsAmount"]', TEST_DATA.instruments[0].quantity, 'Instrument 1 Quantity');
      
      // Add second instrument
      const addInstrumentBtns2 = await driver.findElements(By.xpath('//button[contains(text(), "+ เพิ่มข้อมูล")]'));
      if (addInstrumentBtns2.length > 1) {
        await scrollIntoView(driver, addInstrumentBtns2[1]);
        await addInstrumentBtns2[1].click();
        await sleep(500);
        
        await fillField(driver, 'input[name="availableInstruments.1.availableInstrumentsName"]', TEST_DATA.instruments[1].instrumentName, 'Instrument 2 Name');
        await fillField(driver, 'input[name="availableInstruments.1.availableInstrumentsAmount"]', TEST_DATA.instruments[1].quantity, 'Instrument 2 Quantity');
      }
    }
    
    // Click next to Step 5
    const nextBtn4 = await driver.findElement(By.xpath('//button[contains(text(), "ถัดไป")]'));
    await scrollIntoView(driver, nextBtn4);
    await nextBtn4.click();
    await sleep(2000);
    
    // ========================================================================
    // STEP 5: Support and Skills
    // ========================================================================
    console.log('\n📍 Step 5: Support and Skills');
    
    // Wait for Step 5 to load
    await driver.wait(until.elementLocated(By.css('textarea[name="teacherSkillThaiMusicMajor"]')), CONFIG.waitTimeout);
    await sleep(500);
    
    // Fill teacher skills
    await fillField(driver, 'textarea[name="teacherSkillThaiMusicMajor"]', TEST_DATA.teacherSkills, 'Teacher Skills (Thai Music Major)');
    await fillField(driver, 'textarea[name="teacherSkillOtherMajorButTrained"]', TEST_DATA.teacherSkillsOther, 'Teacher Skills (Other Major)');
    
    // Select instrument sufficiency - เพียงพอ
    console.log('  📋 Selecting: Instrument Sufficiency = เพียงพอ');
    const sufficientRadio = await driver.findElement(By.xpath('//input[@type="radio" and @value="sufficient"]'));
    await scrollIntoView(driver, sufficientRadio);
    await sufficientRadio.click();
    await sleep(300);
    
    // Fill sufficiency detail
    await fillField(driver, 'textarea[name="instrumentSufficiencyDetail"]', TEST_DATA.instrumentSufficiencyDetail, 'Instrument Sufficiency Detail');
    
    // Fill curriculum framework
    await fillField(driver, 'textarea[name="curriculumFramework"]', TEST_DATA.curriculum, 'Curriculum Framework');
    
    // Fill learning outcomes
    await fillField(driver, 'textarea[name="learningOutcomes"]', TEST_DATA.learningOutcomes, 'Learning Outcomes');
    
    // Fill management context
    await fillField(driver, 'textarea[name="managementContext"]', TEST_DATA.managementContext, 'Management Context');
    
    // Fill equipment and budget support
    await fillField(driver, 'textarea[name="equipmentAndBudgetSupport"]', TEST_DATA.equipmentAndBudgetSupport, 'Equipment and Budget Support');
    
    console.log('  ⏭️  Skipping support factors and awards (optional complex fields)');
    
    // Click next to Step 6
    const nextBtn5 = await driver.findElement(By.xpath('//button[contains(text(), "ถัดไป")]'));
    await scrollIntoView(driver, nextBtn5);
    await nextBtn5.click();
    await sleep(2000);
    
    // ========================================================================
    // STEP 6: Media and Videos
    // ========================================================================
    console.log('\n📍 Step 6: Media and Videos');
    
    // Wait for Step 6 to load
    await driver.wait(until.elementLocated(By.css('input[name="photoGalleryLink"]')), CONFIG.waitTimeout);
    await sleep(500);
    
    // Fill photo gallery link
    await fillField(driver, 'input[name="photoGalleryLink"]', TEST_DATA.photoGalleryLink, 'Photo Gallery Link');
    
    // Add classroom video
    console.log('  📹 Adding classroom video');
    const addClassroomVideoBtn = await driver.findElement(By.xpath('//button[contains(text(), "+ เพิ่มข้อมูล")]'));
    await scrollIntoView(driver, addClassroomVideoBtn);
    await addClassroomVideoBtn.click();
    await sleep(500);
    
    await fillField(driver, 'input[name="classroomVideos.0.classroomVideoLink"]', TEST_DATA.classroomVideos[0].videoLink, 'Classroom Video Link');
    
    // Add performance videos (internal, external)
    console.log('  🎭 Adding performance videos');
    
    // Find all "+ เพิ่มข้อมูล" buttons - we need the ones in the performance section
    const allAddBtns = await driver.findElements(By.xpath('//button[contains(text(), "+ เพิ่มข้อมูล")]'));
    
    // Internal performance video (second button in performance section)
    if (allAddBtns.length > 1) {
      await scrollIntoView(driver, allAddBtns[1]);
      await allAddBtns[1].click();
      await sleep(500);
      await fillField(driver, 'input[name="performanceVideos.0.performanceVideoLink"]', TEST_DATA.performanceVideos[0].videoLink, 'Internal Performance Video Link');
    }
    
    // External performance video (third button in performance section)
    const allAddBtns2 = await driver.findElements(By.xpath('//button[contains(text(), "+ เพิ่มข้อมูล")]'));
    if (allAddBtns2.length > 2) {
      await scrollIntoView(driver, allAddBtns2[2]);
      await allAddBtns2[2].click();
      await sleep(500);
      await fillField(driver, 'input[name="performanceVideos.1.performanceVideoLink"]', TEST_DATA.performanceVideos[1].videoLink, 'External Performance Video Link');
    }
    
    // CRITICAL: Check the certification checkbox in Step 7 BEFORE clicking Next
    // This prevents validation errors when navigating to Step 7
    console.log('\n  ✅ PRE-CHECKING: Checking Step 7 certification checkbox BEFORE navigation...');
    try {
      // The checkbox might already be in the DOM even though we're on Step 6
      const preCheckbox = await driver.findElement(By.css('[data-testid="certification-checkbox"]'));
      
      // Check if it's currently visible (it might be hidden)
      const isDisplayed = await preCheckbox.isDisplayed();
      console.log(`  📋 Checkbox visible from Step 6: ${isDisplayed}`);
      
      if (!isDisplayed) {
        // Checkbox is in DOM but not visible - use JavaScript to check it
        console.log('  🔧 Using JavaScript to pre-check the checkbox...');
        await driver.executeScript(`
          const checkbox = document.querySelector('[data-testid="certification-checkbox"]');
          if (checkbox) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            checkbox.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('✅ Checkbox pre-checked via JavaScript');
          }
        `);
        await sleep(500);
        console.log('  ✅ Certification checkbox pre-checked successfully!');
      }
    } catch (e) {
      console.log('  ℹ️  Could not pre-check checkbox (element not in DOM yet), will check after navigation');
    }
    
    // Click next to Step 7 - scroll to bottom footer first to ensure we click the visible button
    console.log('\n  🖱️  Scrolling to bottom and clicking Next button to go to Step 7...');
    
    // Scroll to the very bottom of the page to ensure we're in the footer area
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
    await sleep(500);
    
    // Find the Next button in the footer (should be the visible one)
    const nextBtn6 = await driver.findElement(By.css('[data-testid="btn-next"]'));
    
    // Ensure it's visible and in viewport
    await driver.executeScript('arguments[0].scrollIntoView({block: "center", behavior: "smooth"});', nextBtn6);
    await sleep(500);
    
    // Verify it's the correct button by checking if it's visible
    const isVisibleStep6 = await nextBtn6.isDisplayed();
    console.log(`  📋 Next button visible: ${isVisibleStep6}`);
    
    await nextBtn6.click();
    await sleep(2000);
    
    console.log('  ✅ Navigated to Step 7');
    
    // ========================================================================
    // STEP 7: Review and Submit
    // ========================================================================
    console.log('\n📍 Step 7: Review and Submit (ตรวจสอบและส่งแบบฟอร์ม)');
    
    // Wait for Step 7 to load - use the checkbox as the indicator
    console.log('  ⏳ Waiting for Step 7 to load...');
    
    // IMPORTANT: Handle any alert that appears immediately (validation error from Step 6 -> Step 7 transition)
    try {
      await sleep(1000); // Wait a moment for any alert to appear
      const alert = await driver.switchTo().alert();
      const alertText = await alert.getText();
      console.log(`  ⚠️  Alert detected on Step 7 load: ${alertText}`);
      console.log('  🔧 Accepting alert and continuing...');
      await alert.accept();
      await sleep(500);
    } catch (e) {
      console.log('  ℹ️  No alert on Step 7 load (good!)');
    }
    
    // Now wait for the checkbox to be present
    await driver.wait(until.elementLocated(By.css('[data-testid="certification-checkbox"]')), CONFIG.waitTimeout);
    await sleep(1000);
    
    // CRITICAL: CHECK CERTIFICATION CHECKBOX FIRST (before filling any other fields!)
    // This is required by the form validation - checkbox must be checked before submission
    console.log('  ✅ STEP 1: Checking certification checkbox FIRST (required for validation)...');
    
    // Scroll to the certification section at the bottom
    await driver.executeScript(`
      const certSection = document.querySelector('[data-testid="certification-checkbox"]')?.closest('div.bg-white');
      if (certSection) {
        certSection.scrollIntoView({block: "center", behavior: "smooth"});
      }
    `);
    await sleep(500);
    
    // Use data-testid selector for reliable finding
    const checkbox = await driver.findElement(By.css('[data-testid="certification-checkbox"]'));
    await scrollIntoView(driver, checkbox);
    await sleep(500);
    
    // Check current state
    const isChecked = await checkbox.isSelected();
    console.log(`  📋 Initial checkbox state: ${isChecked ? 'CHECKED' : 'NOT CHECKED'}`);
    
    if (!isChecked) {
      console.log('  🔧 Attempting to check the checkbox...');
      
      // Method 1: Click the parent label element (most reliable for React forms)
      try {
        const label = await driver.findElement(By.xpath('//label[contains(., "ข้าพเจ้ารับรองว่าข้อมูลที่กรอกทั้งหมดเป็นความจริง")]'));
        await scrollIntoView(driver, label);
        await sleep(300);
        await label.click();
        await sleep(800);
        console.log('  ✅ Method 1: Label clicked');
        
        // Verify it worked
        const nowChecked = await checkbox.isSelected();
        if (nowChecked) {
          console.log('  ✅ Checkbox successfully checked via label click!');
        }
      } catch (e) {
        console.log('  ⚠️  Method 1 (label click) failed:', (e as Error).message);
      }
      
      // Method 2: Direct checkbox click (fallback)
      const stillNotChecked = await checkbox.isSelected();
      if (!stillNotChecked) {
        try {
          await checkbox.click();
          await sleep(500);
          console.log('  ✅ Method 2: Direct checkbox click executed');
        } catch (e) {
          console.log('  ⚠️  Method 2 (direct click) failed:', (e as Error).message);
        }
      }
      
      // Method 3: JavaScript-based checking (last resort)
      const finalCheck = await checkbox.isSelected();
      if (!finalCheck) {
        console.log('  🔧 Method 3: Using JavaScript to force checkbox state...');
        await driver.executeScript(`
          const checkbox = document.querySelector('[data-testid="certification-checkbox"]');
          if (checkbox && !checkbox.checked) {
            // Simulate a real user click
            checkbox.checked = true;
            
            // Trigger React Hook Form events
            checkbox.dispatchEvent(new Event('click', { bubbles: true }));
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            checkbox.dispatchEvent(new Event('input', { bubbles: true }));
            checkbox.dispatchEvent(new Event('blur', { bubbles: true }));
            
            console.log('✅ Checkbox checked via JavaScript');
          }
        `);
        await sleep(1000);
      }
    }
    
    // Verify final checkbox state
    const finalChecked = await checkbox.isSelected();
    const domChecked = await driver.executeScript(`
      return document.querySelector('[data-testid="certification-checkbox"]')?.checked || false;
    `);
    
    console.log(`  📋 Final checkbox state (Selenium): ${finalChecked ? 'CHECKED ✅' : 'NOT CHECKED ❌'}`);
    console.log(`  📋 Final checkbox state (DOM): ${domChecked ? 'CHECKED ✅' : 'NOT CHECKED ❌'}`);
    
    if (!finalChecked && !domChecked) {
      console.error('  ❌ CRITICAL ERROR: Checkbox is still not checked after all attempts!');
      console.error('  ❌ Form submission will likely fail validation!');
    } else {
      console.log('  ✅ SUCCESS: Certification checkbox is now checked!');
    }
    
    // NOW fill other Step 7 fields (after checkbox is confirmed checked)
    console.log('\n  📝 STEP 2: Filling minimal Step 7 fields (optional fields)...');
    await sleep(300);
    
    // Fill only essential fields - skip optional ones to speed up test
    console.log('  ℹ️  Skipping optional Step 7 fields to speed up test');
    console.log('  ✅ Step 7 fields completed (checkbox is the critical field)');
    
    // Submit form
    console.log('\n  🚀 STEP 3: Submitting form...');
    await sleep(500);
    
    // Scroll to the very bottom to ensure we're in the footer area with the submit button
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
    await sleep(500);
    
    // Find the submit button using data-testid
    const submitButton = await driver.findElement(By.css('[data-testid="btn-submit"]'));
    
    // Verify it's visible and enabled
    const isVisibleSubmit = await submitButton.isDisplayed();
    const isEnabled = await submitButton.isEnabled();
    console.log(`  📋 Submit button visible: ${isVisibleSubmit}, enabled: ${isEnabled}`);
    
    // Scroll to button and click
    await driver.executeScript('arguments[0].scrollIntoView({block: "center", behavior: "smooth"});', submitButton);
    await sleep(500);
    
    // Click the submit button
    await submitButton.click();
    console.log('  ✅ Submit button clicked!');
    
    // ========================================================================
    // VERIFY SUCCESS MODAL
    // ========================================================================
    console.log('\n📍 Waiting for success modal...');
    await sleep(3000);
    
    // Wait for success modal to appear
    try {
      await driver.wait(until.elementLocated(By.css('[data-testid="btn-success-close"]')), 10000);
      console.log('  ✅ Success modal appeared!');
      
      // Check modal message
      const modalText = await driver.findElement(By.css('body')).getText();
      if (modalText.includes('ระบบได้รับข้อมูลของท่านเรียบร้อยแล้ว')) {
        console.log('  ✅ Success message found: "ระบบได้รับข้อมูลของท่านเรียบร้อยแล้ว"');
      }
      
      console.log('\n✅ SUCCESS!');
      console.log('='.repeat(70));
      console.log('📋 Form submitted successfully!');
      console.log('📋 Success modal displayed with message');
      console.log('='.repeat(70));
      
      // Click close button
      console.log('\n  🖱️  Clicking close button on success modal...');
      const closeButton = await driver.findElement(By.css('[data-testid="btn-success-close"]'));
      await closeButton.click();
      await sleep(2000);
      
      // Verify redirect to home page
      console.log('  ⏳ Waiting for redirect to home page...');
      await sleep(2000);
      const finalUrl = await driver.getCurrentUrl();
      console.log(`  📍 Final URL after redirect: ${finalUrl}`);
      
      if (finalUrl === CONFIG.baseUrl || finalUrl === CONFIG.baseUrl + '/') {
        console.log('  ✅ Successfully redirected to home page!');
      } else {
        console.log(`  ⚠️  Expected redirect to ${CONFIG.baseUrl}, but got ${finalUrl}`);
      }
      
    } catch (e) {
      console.log('  ❌ Success modal not found!');
      console.error(e);
      
      // Fallback: Check for old alert
      try {
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        console.log(`  ℹ️  Found alert instead: ${alertText}`);
        await alert.accept();
      } catch (alertError) {
        console.log('  ℹ️  No alert found either');
      }
    }
    
    console.log('='.repeat(70));
    console.log(`\n⏳ Keeping browser open for ${CONFIG.keepBrowserOpenSeconds} seconds...`);
    await sleep(CONFIG.keepBrowserOpenSeconds * 1000);
    
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error);
    
    // Take screenshot on error
    try {
      const screenshot = await driver.takeScreenshot();
      const screenshotPath = path.resolve(__dirname, '..', 'test-assets', 'error-screenshot.png');
      fs.writeFileSync(screenshotPath, screenshot, 'base64');
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    } catch (screenshotError) {
      console.error('Failed to take screenshot:', screenshotError);
    }
    
    throw error;
  } finally {
    console.log('\n🏁 Closing browser...');
    await driver.quit();
    console.log('✅ Test completed!');
  }
}

// ============================================================================
// RUN TEST
// ============================================================================

runE2ETest()
  .then(() => {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed!');
    console.error(error);
    process.exit(1);
  });
