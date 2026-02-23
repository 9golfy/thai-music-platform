# Selenium E2E Test for Thai Music School Registration Form

## Overview

This is a comprehensive end-to-end UI automation test using Selenium WebDriver with Chrome in **visible mode** (non-headless). The test simulates a real user filling out the Thai Music School registration form (แบบเสนอผลงาน 69).

## Features

✅ Opens Chrome browser in visible mode  
✅ Realistic typing simulation (80-120ms per character)  
✅ Fills ALL required fields and many optional fields  
✅ Uploads multiple files (manager photo, teacher photos)  
✅ Adds multiple array entries (2 teachers)  
✅ Scrolls and waits for elements properly  
✅ Submits form and verifies success  
✅ Keeps browser open for 5 seconds after completion  
✅ Takes screenshot on error  

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Google Chrome** browser installed
3. **Frontend running** at `http://localhost:3000`
4. **API running** at `http://localhost:8080`

## Installation

### Option 1: Quick Start (Recommended)

Simply run the batch file which handles everything:

```cmd
run-selenium-e2e.bat
```

This will:
- Create test images if they don't exist
- Install dependencies if needed
- Run the E2E test

### Option 2: Manual Setup

1. **Create test images:**
```cmd
cd test-assets
powershell -ExecutionPolicy Bypass -File create-test-images.ps1
cd ..
```

2. **Install dependencies:**
```cmd
npm install --save-dev selenium-webdriver chromedriver typescript ts-node @types/node @types/selenium-webdriver
```

3. **Run the test:**
```cmd
npm run test:e2e
```

Or directly:
```cmd
npx ts-node --project tsconfig-e2e.json e2e/register69.e2e.ts
```

## Project Structure

```
web/
├── e2e/
│   └── register69.e2e.ts          # Main E2E test file
├── test-assets/
│   ├── manager.jpg                # Manager photo (auto-generated)
│   ├── teacher1.jpg               # Teacher 1 photo (auto-generated)
│   ├── teacher2.jpg               # Teacher 2 photo (auto-generated)
│   ├── create-test-images.ps1     # Script to create test images
│   └── README.md                  # Test assets documentation
├── package-e2e.json               # E2E dependencies
├── tsconfig-e2e.json              # TypeScript config for E2E
├── run-selenium-e2e.bat           # Windows batch file to run test
└── E2E-SELENIUM-README.md         # This file
```

## Test Flow

The test follows this sequence:

### Step 0: Navigation
- Navigate to `http://localhost:3000`
- Click "เริ่มกรอกแบบฟอร์ม" button

### Step 1: Basic Information (ข้อมูลพื้นฐาน)
- School name
- Province
- School level
- Affiliation
- Staff count
- Student count
- Full address (street, district, province, postal code)
- Phone and fax

### Step 2: Management Information (ผู้บริหารสถานศึกษา)
- Manager full name ✅ Required
- Manager position ✅ Required
- Manager phone ✅ Required
- Manager email
- Manager photo upload

### Step 3: Teachers Information (ผู้สอนดนตรีไทย)
- Teacher 1 (pre-existing row):
  - Full name, position, education
  - Phone, email
  - Photo upload
- Add Teacher 2:
  - Full name, position, education
  - Phone, email

### Step 4-6: Quick Navigation
- Skip through steps 4-6 (no required fields)

### Step 7: Review and Submit
- Check certification checkbox ✅ Required
- Submit form
- Verify success message

## Configuration

Edit `e2e/register69.e2e.ts` to customize:

```typescript
const CONFIG = {
  baseUrl: 'http://localhost:3000',      // Frontend URL
  typingDelayMin: 80,                    // Min typing delay (ms)
  typingDelayMax: 120,                   // Max typing delay (ms)
  waitTimeout: 10000,                    // Element wait timeout (ms)
  keepBrowserOpenSeconds: 5,             // Browser open time after test
};
```

## Selector Map

All selectors are centralized at the top of the test file for easy maintenance:

```typescript
const SELECTORS = {
  startButton: '//a[contains(text(), "เริ่มกรอกแบบฟอร์ม")]',
  btnNext: '[data-testid="btn-next"]',
  btnSubmit: '[data-testid="btn-submit"]',
  schoolName: 'input[name="schoolName"]',
  // ... and more
};
```

## Test Data

Modify test data in the `TEST_DATA` object:

```typescript
const TEST_DATA = {
  schoolName: 'โรงเรียนดนตรีไทยตัวอย่าง',
  schoolProvince: 'กรุงเทพมหานคร',
  // ... and more
};
```

## Troubleshooting

### Chrome driver version mismatch
```cmd
npm install chromedriver@latest
```

### Port 3000 not available
Update `CONFIG.baseUrl` in the test file to match your frontend port.

### Test images not found
Run the image creation script:
```cmd
cd test-assets
powershell -ExecutionPolicy Bypass -File create-test-images.ps1
```

### Element not found errors
The test uses explicit waits with 10-second timeout. If elements are still not found:
1. Check if the frontend is running
2. Verify selector names match the actual HTML
3. Increase `CONFIG.waitTimeout`

### Form submission fails
Ensure:
1. API is running at `http://localhost:8080`
2. All required fields are filled
3. Certification checkbox is checked

## Advanced Usage

### Run with custom timeout
Edit the test file and change:
```typescript
waitTimeout: 20000,  // 20 seconds
```

### Add more test data
Extend the `TEST_DATA` object with additional fields from Steps 4-6.

### Headless mode
To run in headless mode, add to Chrome options:
```typescript
options.addArguments('--headless');
```

### Take screenshots
Screenshots are automatically taken on error and saved to `test-assets/error-screenshot.png`.

## Expected Output

```
🚀 Starting E2E Test for Thai Music School Registration Form
======================================================================

📍 Step 0: Navigate to home page
  🖱️  Clicking: เริ่มกรอกแบบฟอร์ม button

📍 Step 1: Basic Information (ข้อมูลพื้นฐาน)
  📝 Filling: School Name
  📋 Selecting: School Province = กรุงเทพมหานคร
  ...

📍 Step 2: Management Information (ผู้บริหารสถานศึกษา)
  📝 Filling: Manager Full Name
  ...

📍 Step 3: Teachers Information (ผู้สอนดนตรีไทย)
  👤 Teacher 1:
  ...

📍 Step 7: Review and Submit (ตรวจสอบและส่งแบบฟอร์ม)
  ✅ Checking certification checkbox
  🚀 Submitting form...

✅ SUCCESS!
======================================================================
📋 Alert Message: ส่งแบบฟอร์มสำเร็จ! ID: 12345
🆔 Submission ID: 12345
======================================================================

⏳ Keeping browser open for 5 seconds...
🏁 Closing browser...
✅ Test completed!
```

## Notes

- The test uses realistic typing delays to simulate human behavior
- Browser stays open for 5 seconds after completion for visual verification
- All file uploads use absolute paths resolved from `test-assets/`
- The test scrolls elements into view before interaction
- Explicit waits ensure elements are visible before interaction

## Support

For issues or questions:
1. Check the console output for detailed error messages
2. Review the error screenshot if test fails
3. Verify all prerequisites are met
4. Ensure frontend and API are running

## License

This test suite is part of the Thai Music School Registration project.
