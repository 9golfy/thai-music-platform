# 🎯 Complete E2E Testing Guide - Register 69 Form

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [What Was Implemented](#what-was-implemented)
3. [Test Coverage](#test-coverage)
4. [Running Tests](#running-tests)
5. [Test Details](#test-details)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Windows (Easiest)

Double-click `run-e2e-tests.bat` or run:

```cmd
run-e2e-tests.bat
```

### Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers (one-time)
npx playwright install

# 3. Run tests
npm run test:e2e
```

### First Time Recommended

```bash
# Run with UI mode to see tests execute
npm run test:e2e:ui
```

---

## 📦 What Was Implemented

### Files Created

```
├── playwright.config.ts              # Playwright configuration
├── tests/
│   ├── e2e/
│   │   └── register-69.spec.ts      # Main test suite (3 tests)
│   ├── helpers/
│   │   ├── register69.fixture.ts    # Test data (63+ fields)
│   │   └── createTestImages.ts      # Image generator
│   ├── fixtures/
│   │   ├── photo1.png               # Test image 1 (< 1KB)
│   │   └── photo2.png               # Test image 2 (< 1KB)
│   └── README.md                    # Testing documentation
├── run-e2e-tests.bat                # Windows quick start script
├── E2E_TEST_SUMMARY.md              # Implementation summary
└── COMPLETE_E2E_GUIDE.md            # This file
```

### Code Changes (Minimal)

**components/forms/Register69Wizard.tsx:**
- Added `data-testid="step-1"` through `data-testid="step-7"` to stepper
- Added `data-testid="btn-next"`, `btn-back`, `btn-save-draft`, `btn-submit`

**components/ui/ConsentModal.tsx:**
- Added `data-testid="btn-consent-accept"`

**package.json:**
- Added `@playwright/test` to devDependencies
- Added 4 test scripts

**Total changes:** ~10 lines of code (only test IDs)

---

## 🧪 Test Coverage

### Test 1: Full Registration Flow ✅
**File:** `tests/e2e/register-69.spec.ts`
**Duration:** ~15-20 seconds

#### What It Tests:

**Step 1: Basic Info + Address (17 fields)**
- ✅ Validation: Try submit without required fields
- ✅ Fill: schoolName, province, schoolLevel, affiliation
- ✅ Auto-calculation: studentCount (500) → schoolSize (MEDIUM)
- ✅ Override: Change schoolSize to LARGE manually
- ✅ Fill: staffCount, studentCountByGrade
- ✅ Fill: addressNo, moo, road, subDistrict, district, provinceAddress, postalCode, phone, fax
- ✅ Navigate: Click "ถัดไป"

**Step 2: Administrator (4 fields)**
- ✅ Verify: Step 2 is active
- ✅ Fill: mgtFullName, mgtPosition, mgtPhone, mgtEmail
- ✅ Navigate: Click Step 3 in stepper (test stepper navigation)

**Step 3: Thai Music Teachers (array)**
- ✅ Add: First teacher (5 fields)
- ✅ Add: Second teacher (5 fields)
- ✅ Remove: First teacher
- ✅ Re-add: Teacher (test add/remove functionality)
- ✅ Navigate: Click "ถัดไป"

**Step 4: Teaching Plans + Duration (6 fields)**
- ✅ Add: First teaching plan (2 fields)
- ✅ Add: Second teaching plan (2 fields)
- ✅ Fill: inClassInstructionDuration, outOfClassInstructionDuration, instructionLocationOverview
- ✅ Navigate: Click "ถัดไป"

**Step 5: Instruments + Sufficiency + External Instructors (11 fields)**
- ✅ Fill: availableInstruments
- ✅ Check: instrumentSufficiency + fill detail
- ✅ Check: instrumentINSufficiency + fill detail
- ✅ Add: External instructor (5 fields)
- ✅ Navigate: Click "ถัดไป"

**Step 6: Support + Skills + Curriculum + Feedback (14 fields)**
- ✅ Fill: 5 support fields
- ✅ Fill: 2 teacher skill fields
- ✅ Fill: 5 curriculum/results fields
- ✅ Fill: 2 feedback fields
- ✅ Navigate: Click "ย้อนกลับ" (test back button)
- ✅ Verify: Back to Step 5
- ✅ Verify: Data persisted (check availableInstruments)
- ✅ Navigate: Forward to Step 6, then to Step 7

**Step 7: Media + Source + Certification (11 fields)**
- ✅ Upload: 2 image files (photo1.png, photo2.png)
- ✅ Fill: publicityLinks
- ✅ Fill: heardFromSchoolName, heardFromSchoolDistrict, heardFromSchoolProvince
- ✅ Check: DCP_PR_Channel_FACEBOOK, YOUTUBE, Tiktok, heardFromOther
- ✅ Fill: heardFromOtherDetail
- ✅ Submit: Without certification (blocked)
- ✅ Verify: Alert shows "กรุณายืนยันความถูกต้องของข้อมูล"
- ✅ Check: certifiedINFOByAdminName
- ✅ Submit: Final submission
- ✅ Verify: Success alert with ID "TEST-E2E-123"

**Total:** 63+ fields tested

### Test 2: Free Stepper Navigation ✅
**Duration:** ~3-5 seconds

- ✅ Click Step 7 from Step 1 (jump forward)
- ✅ Verify: On Step 7
- ✅ Click Step 3 from Step 7 (jump backward)
- ✅ Verify: On Step 3
- ✅ Click Step 1 from Step 3
- ✅ Verify: On Step 1
- ✅ Confirm: No validation blocks stepper navigation

### Test 3: Draft Save/Restore ✅
**Duration:** ~5-7 seconds

- ✅ Fill: schoolName, schoolLevel
- ✅ Click: "บันทึกร่าง"
- ✅ Verify: Alert "บันทึกร่างเรียบร้อยแล้ว"
- ✅ Reload: Page
- ✅ Verify: Restore modal appears
- ✅ Click: "กู้คืนข้อมูล"
- ✅ Verify: Data restored (schoolName matches)

---

## 🎮 Running Tests

### Option 1: UI Mode (Recommended for First Time)

```bash
npm run test:e2e:ui
```

**Features:**
- Visual test runner
- See tests execute in real-time
- Time travel through test steps
- View screenshots and videos
- Debug easily

### Option 2: Headless Mode (CI/CD)

```bash
npm run test:e2e
```

**Features:**
- Fast execution
- No browser window
- Perfect for automation
- Generates HTML report

### Option 3: Headed Mode (Watch Browser)

```bash
npm run test:e2e:headed
```

**Features:**
- See browser window
- Watch automation happen
- Good for debugging
- Slower than headless

### Option 4: Debug Mode

```bash
npm run test:e2e:debug
```

**Features:**
- Playwright Inspector
- Step-by-step execution
- Pause and resume
- Inspect elements

### Run Specific Test

```bash
# Run only full registration flow
npx playwright test -g "should complete full registration flow"

# Run only stepper navigation
npx playwright test -g "should allow free stepper navigation"

# Run only draft test
npx playwright test -g "should save and restore draft"
```

---

## 📊 Test Details

### Test Data (Fixture)

**File:** `tests/helpers/register69.fixture.ts`

**Sample Data:**
```typescript
{
  schoolName: 'โรงเรียนดนตรีไทยตัวอย่าง',
  province: 'กรุงเทพมหานคร',
  schoolLevel: 'PRIMARY',
  studentCount: 500,
  mgtFullName: 'นายสมชาย ใจดี',
  mgtPosition: 'ผู้อำนวยการโรงเรียน',
  thaiMusicTeachers: [
    {
      teacherFullName: 'นางสาวสายฝน ดนตรีไทย',
      teacherPosition: 'ครูผู้สอน',
      teacherEducation: 'ศศ.บ.ดนตรี',
      teacherPhone: '0811111111',
      teacherEmail: 'teacher1@example.com'
    },
    // ... second teacher
  ],
  // ... 60+ more fields with realistic Thai content
}
```

### API Interception

Tests intercept POST to `/api/register-69`:

```typescript
await page.route('**/api/register-69', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ 
      success: true, 
      id: 'TEST-E2E-123' 
    }),
  });
});
```

**Benefits:**
- No real data submitted
- Fast tests
- Predictable responses
- No database needed

### Selectors Used

**Navigation (data-testid):**
```typescript
page.getByTestId('step-1')           // Stepper circle
page.getByTestId('btn-next')         // Next button
page.getByTestId('btn-back')         // Back button
page.getByTestId('btn-submit')       // Submit button
```

**Form Fields (name attribute):**
```typescript
page.fill('input[name="schoolName"]', value)
page.selectOption('select[name="schoolLevel"]', value)
page.check('input[name="certifiedINFOByAdminName"]')
```

**Array Fields:**
```typescript
page.fill('input[name="thaiMusicTeachers.0.teacherFullName"]', value)
page.fill('input[name="currentTeachingPlans.1.gradeLevel"]', value)
```

**Dynamic Elements:**
```typescript
page.locator('button:has-text("+ เพิ่มข้อมูล")')
page.locator('button:has-text("ลบ")')
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@playwright/test'"

**Solution:**
```bash
npm install
```

### Issue: "browserType.launch: Executable doesn't exist"

**Solution:**
```bash
npx playwright install
```

### Issue: "Error: page.goto: net::ERR_CONNECTION_REFUSED"

**Solution:**
- Make sure dev server is running
- Or let Playwright auto-start it (configured in playwright.config.ts)
- Check if port 3000 is available

### Issue: "Timeout 30000ms exceeded"

**Solution:**
- Increase timeout in test
- Check if element selector is correct
- Verify dev server is responding

### Issue: Tests fail on "file upload"

**Solution:**
```bash
# Verify test images exist
dir tests\fixtures\photo1.png
dir tests\fixtures\photo2.png

# If missing, recreate them
$pngData1 = [byte[]](0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A,0x00,0x00,0x00,0x0D,0x49,0x48,0x44,0x52,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,0x08,0x02,0x00,0x00,0x00,0x90,0x77,0x53,0xDE,0x00,0x00,0x00,0x0C,0x49,0x44,0x41,0x54,0x08,0xD7,0x63,0xF8,0xCF,0xC0,0x00,0x00,0x03,0x01,0x01,0x00,0x18,0xDD,0x8D,0xB4,0x00,0x00,0x00,0x00,0x49,0x45,0x4E,0x44,0xAE,0x42,0x60,0x82)
[System.IO.File]::WriteAllBytes("tests\fixtures\photo1.png", $pngData1)
```

### Issue: "Element is not visible"

**Solution:**
- Add `await page.waitForTimeout(500)` before action
- Check if element is in viewport
- Scroll to element if needed

### Issue: Tests pass locally but fail in CI

**Solution:**
- Use `--headed` mode to see what's happening
- Check CI logs for specific errors
- Increase timeouts for slower CI environments
- Ensure Playwright browsers are installed in CI

---

## 📈 Performance

**Test Suite Duration:**
- Test 1 (Full flow): ~15-20 seconds
- Test 2 (Stepper): ~3-5 seconds
- Test 3 (Draft): ~5-7 seconds
- **Total:** ~30-40 seconds

**Optimization Tips:**
- Tests run sequentially for stability
- API calls are intercepted (no network delay)
- Minimal wait times used
- Efficient selectors

---

## 📝 Viewing Results

### HTML Report

After tests complete:
```bash
npx playwright show-report
```

Opens interactive HTML report with:
- Test results
- Screenshots
- Videos
- Traces
- Timing information

### Screenshots

Automatically saved on failure:
```
test-results/
  register-69-spec-ts-should-complete-full-registration-flow/
    test-failed-1.png
```

### Videos

Recorded for failed tests:
```
test-results/
  register-69-spec-ts-should-complete-full-registration-flow/
    video.webm
```

### Traces

For detailed debugging:
```bash
npx playwright show-trace test-results/.../trace.zip
```

---

## ✅ Success Criteria

All tests should pass with:
- ✅ No errors
- ✅ All assertions pass
- ✅ API intercepted successfully
- ✅ Data persists across navigation
- ✅ Validation works correctly
- ✅ File upload succeeds
- ✅ Final submission succeeds

**Expected Output:**
```
Running 3 tests using 1 worker

  ✓  register-69.spec.ts:6:3 › should complete full registration flow (15s)
  ✓  register-69.spec.ts:XXX:3 › should allow free stepper navigation (3s)
  ✓  register-69.spec.ts:XXX:3 › should save and restore draft (5s)

  3 passed (23s)
```

---

## 🎓 Best Practices

1. ✅ **Run tests before committing** - Catch issues early
2. ✅ **Use UI mode for debugging** - Visual feedback helps
3. ✅ **Keep test data realistic** - Better coverage
4. ✅ **Intercept API calls** - Faster, more reliable
5. ✅ **Add waits after dynamic actions** - Stability
6. ✅ **Use stable selectors** - data-testid + name
7. ✅ **Test both happy and error paths** - Complete coverage
8. ✅ **Verify data persistence** - Catch state issues
9. ✅ **Keep tests independent** - No shared state
10. ✅ **Document test changes** - Maintainability

---

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📞 Support

### Documentation
- Playwright Docs: https://playwright.dev
- Test README: `tests/README.md`
- This Guide: `COMPLETE_E2E_GUIDE.md`

### Debugging Steps
1. Run in UI mode: `npm run test:e2e:ui`
2. Check screenshots in `test-results/`
3. View HTML report: `npx playwright show-report`
4. Run in debug mode: `npm run test:e2e:debug`
5. Check console logs in test output

### Common Commands
```bash
# Install everything
npm install && npx playwright install

# Run tests
npm run test:e2e

# Debug
npm run test:e2e:debug

# View report
npx playwright show-report

# Update snapshots (if using)
npx playwright test --update-snapshots
```

---

## 🎉 Summary

You now have a complete E2E test suite that:

- ✅ Tests all 63+ fields across 7 steps
- ✅ Covers validation, navigation, and data persistence
- ✅ Tests array operations (add/remove)
- ✅ Tests file uploads
- ✅ Tests draft save/restore
- ✅ Intercepts API calls (no real submissions)
- ✅ Uses realistic Thai test data
- ✅ Runs in ~30-40 seconds
- ✅ Provides detailed reports
- ✅ Ready for CI/CD

**Get Started:**
```bash
npm install
npx playwright install
npm run test:e2e:ui
```

**Happy Testing!** 🚀
