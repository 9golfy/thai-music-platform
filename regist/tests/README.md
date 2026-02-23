# E2E Testing Guide for Register 69 Form

## Setup

### 1. Install Dependencies

```bash
npm install
```

This will install Playwright and all required dependencies.

### 2. Install Playwright Browsers

```bash
npx playwright install
```

This downloads the necessary browser binaries (Chromium, Firefox, WebKit).

## Running Tests

### Run All E2E Tests

```bash
npm run test:e2e
```

This runs all tests in headless mode (no browser window visible).

### Run Tests with UI Mode (Recommended for Development)

```bash
npm run test:e2e:ui
```

This opens Playwright's UI mode where you can:
- See all tests
- Run tests individually
- Watch tests execute step-by-step
- Time travel through test execution
- See screenshots and videos

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:e2e:headed
```

This runs tests with the browser window visible so you can watch the automation.

### Run Tests in Debug Mode

```bash
npm run test:e2e:debug
```

This opens Playwright Inspector for step-by-step debugging.

### Run Specific Test File

```bash
npx playwright test tests/e2e/register-69.spec.ts
```

### Run Specific Test by Name

```bash
npx playwright test -g "should complete full registration flow"
```

## Test Coverage

### Test 1: Full Registration Flow
**File:** `tests/e2e/register-69.spec.ts`

**What it tests:**
1. ✅ Consent modal acceptance
2. ✅ Step 1: Basic info + Address (17 fields)
   - Validation errors for required fields
   - Auto school size calculation
   - Manual school size override
3. ✅ Step 2: Administrator (4 fields)
   - Stepper navigation to Step 3
4. ✅ Step 3: Thai Music Teachers (array)
   - Add 2 teachers
   - Remove and re-add functionality
5. ✅ Step 4: Teaching Plans + Duration (6 fields)
   - Add 2 teaching plans
6. ✅ Step 5: Instruments + Sufficiency + External Instructors (11 fields)
   - Checkbox handling
   - Array functionality
7. ✅ Step 6: Support + Skills + Curriculum + Feedback (14 fields)
   - Back button navigation
   - Data persistence verification
8. ✅ Step 7: Media + Source + Certification (11 fields)
   - File upload (2 images)
   - Certification checkbox validation
   - Final submission with API interception

**Total fields tested:** 63+ fields across all steps

### Test 2: Free Stepper Navigation
**What it tests:**
- Clicking any step circle navigates directly
- No validation blocks stepper navigation
- Step 1 → Step 7 → Step 3 → Step 1

### Test 3: Draft Save/Restore
**What it tests:**
- Save draft functionality
- Page reload
- Restore modal appears
- Data restoration works

## Test Data

**Fixture:** `tests/helpers/register69.fixture.ts`

Contains realistic Thai dummy data for all 63+ fields:
- School information
- Administrator details
- 2 Thai music teachers
- 2 teaching plans
- 1 external instructor
- All text fields with Thai content

**Test Images:** `tests/fixtures/`
- `photo1.png` - Minimal valid PNG (< 1KB)
- `photo2.png` - Minimal valid PNG (< 1KB)

## API Interception

Tests intercept the POST request to `/api/register-69` and return:

```json
{
  "success": true,
  "id": "TEST-E2E-123"
}
```

This prevents actual data submission during tests.

## Test Selectors

Tests use a combination of:
1. **data-testid** attributes for navigation:
   - `step-1` through `step-7` (stepper circles)
   - `btn-next`, `btn-back`, `btn-save-draft`, `btn-submit`
   - `btn-consent-accept`

2. **name** attributes for form fields:
   - React Hook Form automatically provides `name` attributes
   - Example: `input[name="schoolName"]`
   - Example: `textarea[name="obstacles"]`
   - Example: `input[name="thaiMusicTeachers.0.teacherFullName"]`

3. **Text selectors** for dynamic elements:
   - `button:has-text("+ เพิ่มข้อมูล")` for add buttons
   - `button:has-text("ลบ")` for remove buttons

## Debugging Failed Tests

### 1. Check Screenshots
After a test fails, Playwright automatically captures screenshots:
```
playwright-report/
```

### 2. Check Videos
Videos are recorded for failed tests:
```
test-results/
```

### 3. Check Trace
Open trace viewer for detailed debugging:
```bash
npx playwright show-trace test-results/.../trace.zip
```

### 4. Run in Debug Mode
```bash
npm run test:e2e:debug
```

### 5. Add Console Logs
Tests include `console.log()` statements showing progress:
- "Testing Step 1..."
- "Testing Step 2..."
- etc.

## Common Issues

### Issue: Tests fail with "Timeout"
**Solution:** Increase timeout in test or check if dev server is running

### Issue: "Element not found"
**Solution:** Check if selector is correct or add `waitForTimeout()`

### Issue: "Navigation didn't happen"
**Solution:** Check if validation is blocking navigation

### Issue: File upload fails
**Solution:** Verify test images exist in `tests/fixtures/`

## CI/CD Integration

For GitHub Actions or other CI:

```yaml
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

## Test Maintenance

### Adding New Fields
1. Add field to `tests/helpers/register69.fixture.ts`
2. Add fill/check action in `tests/e2e/register-69.spec.ts`
3. Use `name` attribute for selector

### Adding New Steps
1. Add step navigation in test
2. Fill all fields in that step
3. Add assertions as needed

### Updating Validation
1. Update test to expect new validation messages
2. Adjust field filling order if needed

## Performance

**Typical test duration:**
- Full registration flow: ~15-20 seconds
- Stepper navigation: ~3-5 seconds
- Draft save/restore: ~5-7 seconds

**Total suite:** ~30-40 seconds

## Best Practices

1. ✅ Always wait for network idle after navigation
2. ✅ Use `waitForTimeout()` after dynamic actions
3. ✅ Intercept API calls to avoid real submissions
4. ✅ Use realistic test data
5. ✅ Test both happy path and error cases
6. ✅ Verify data persistence across navigation
7. ✅ Clean up localStorage between tests if needed

## Support

For issues or questions:
1. Check Playwright documentation: https://playwright.dev
2. Review test output and screenshots
3. Run tests in debug mode
4. Check browser console for errors

---

**Status:** ✅ All tests implemented and ready to run

**Last Updated:** February 11, 2026
