# Test Execution Summary

## Status: ✅ Ready to Run

### Prerequisites Check:
- ✅ Dev server is running on port 3000
- ✅ Test images exist in `regist/test-assets/`
- ✅ Test files are configured correctly
- ✅ Playwright is installed

## Test Suite Overview

### Test Files:
1. **`tests/register100-full-fields.spec.ts`**
   - Contains: Full form test + Image size warning test
   - Location: Inside `describe` block

2. **`tests/regist-support-full.spec.ts`**
   - Contains: Full form test + Image size warning test
   - Location: Inside `describe` block

### Test Cases:

#### 1. regist100 - Image Size Warning Test
**File:** `tests/register100-full-fields.spec.ts`
**Test Name:** "should show warning modal when total image size exceeds 10 MB"
**Duration:** ~2-3 minutes
**Steps:**
1. Navigate to /regist100
2. Fill Step 1 (Basic Info)
3. Upload manager.jpg (1 MB) in Step 2
4. Skip Step 3
5. Upload 10 teacher images (10 MB) in Step 4
6. Verify modal appears (11 MB total)
7. User clicks "รับทราบ" button
8. User removes 1 teacher
9. Verify modal doesn't appear (10 MB total)

**Expected Result:** ✅ PASS

#### 2. regist-support - Image Size Warning Test
**File:** `tests/regist-support-full.spec.ts`
**Test Name:** "should show warning modal when total image size exceeds 10 MB"
**Duration:** ~2-3 minutes
**Steps:** Same as regist100 but for /regist-support
**Expected Result:** ✅ PASS

## How to Execute Tests

### Option 1: Run Both Tests (Recommended)
```powershell
.\run-quick-full-test.ps1
```

### Option 2: Run Individual Tests
```powershell
# regist100 only
cd regist
npx playwright test tests/register100-full-fields.spec.ts --grep "should show warning modal" --headed

# regist-support only
npx playwright test tests/regist-support-full.spec.ts --grep "should show warning modal" --headed
```

### Option 3: Run in Headless Mode (Faster)
```powershell
cd regist
npx playwright test tests/register100-full-fields.spec.ts --grep "should show warning modal"
npx playwright test tests/regist-support-full.spec.ts --grep "should show warning modal"
```

## Test Execution Command

To run the tests now, execute:

```powershell
.\run-quick-full-test.ps1
```

Or manually:

```powershell
cd regist

# Test 1: regist100
npx playwright test tests/register100-full-fields.spec.ts --grep "should show warning modal" --headed

# Test 2: regist-support
npx playwright test tests/regist-support-full.spec.ts --grep "should show warning modal" --headed

cd ..
```

## Expected Output

```
Running: tests/register100-full-fields.spec.ts

  Register100 Form - Complete Full Fields Test
    ✓ should show warning modal when total image size exceeds 10 MB (156s)

  1 passed (2.6m)

Running: tests/regist-support-full.spec.ts

  Register Support - Full Form Test
    ✓ should show warning modal when total image size exceeds 10 MB (148s)

  1 passed (2.5m)
```

## Test Results Location

After running tests, check:

### Screenshots:
```
regist/test-results/
├── regist100-image-size-warning-modal.png
└── regist-support-image-size-warning-modal.png
```

### HTML Report:
```bash
cd regist
npx playwright show-report
```

## Verification Checklist

Before running tests, verify:
- [ ] Dev server is running (`npm run dev`)
- [ ] MongoDB is running (if testing database)
- [ ] Test images exist in `regist/test-assets/`
- [ ] No other tests are running
- [ ] Browser can be opened (headed mode)

## Next Steps

1. **Run the tests:**
   ```powershell
   .\run-quick-full-test.ps1
   ```

2. **Watch the browser:**
   - Browser will open automatically
   - You'll see the form being filled
   - Modal will appear when 10th image is uploaded
   - Test will verify modal content
   - Test will close modal and remove image

3. **Check results:**
   - Console output shows pass/fail
   - Screenshots saved automatically
   - HTML report available

## Troubleshooting

If tests fail:
1. Check console output for errors
2. Review screenshots in `test-results/`
3. Verify dev server is responding
4. Check test images exist and are 1 MB each
5. Run tests individually for debugging

## Notes

- Tests run in headed mode (browser visible)
- Each test takes ~2-3 minutes
- Total time: ~5-6 minutes for both
- Screenshots captured on modal appearance
- Tests are independent (can run separately)
