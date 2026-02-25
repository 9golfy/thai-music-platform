# Full Test Suite Guide

## Overview
รัน test ครบทุก test case สำหรับทั้ง `/regist100` และ `/regist-support`

## Test Coverage

### regist100 Tests:
1. ✅ **Full Form Test** - กรอกข้อมูลครบทุกฟิลด์และบันทึกลง MongoDB
2. ✅ **Image Size Warning Test** - ทดสอบ modal แจ้งเตือนเมื่อรูปเกิน 10 MB

### regist-support Tests:
3. ✅ **Full Form Test** - กรอกข้อมูลครบทุกฟิลด์และบันทึกลง MongoDB
4. ✅ **Image Size Warning Test** - ทดสอบ modal แจ้งเตือนเมื่อรูปเกิน 10 MB

## Prerequisites

### 1. Start Dev Server
```bash
npm run dev
```
**Important:** Dev server ต้องรันอยู่ตลอดเวลาที่ทำ test

### 2. Start MongoDB (if testing database)
```bash
# MongoDB should be running on localhost:27017
```

### 3. Test Images
Test images จะถูกสร้างอัตโนมัติถ้ายังไม่มี หรือสร้างเองได้:
```powershell
.\create-test-images-simple.ps1
```

## How to Run

### Full Test Suite (Recommended)
```powershell
.\run-full-tests.ps1
```

This will:
1. ✅ Check test images (create if missing)
2. ✅ Check dev server status
3. ✅ Run all 4 test cases sequentially
4. ✅ Show summary with pass/fail status
5. ✅ Display test duration for each test

### Individual Tests

**regist100 only:**
```powershell
.\quick-test-image-size.ps1 -Form regist100
```

**regist-support only:**
```powershell
.\quick-test-image-size.ps1 -Form regist-support
```

**Both forms:**
```powershell
.\quick-test-image-size.ps1 -Form both
```

## Test Execution Flow

```
┌─────────────────────────────────────┐
│  1. Check Prerequisites             │
│     - Test images                   │
│     - Dev server                    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  2. TEST 1: regist100 Full Form     │
│     Duration: ~3-5 minutes          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  3. TEST 2: regist100 Image Size    │
│     Duration: ~2-3 minutes          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  4. TEST 3: regist-support Full     │
│     Duration: ~3-5 minutes          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  5. TEST 4: regist-support Image    │
│     Duration: ~2-3 minutes          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  6. Show Test Summary               │
│     - Pass/Fail status              │
│     - Duration per test             │
│     - Total results                 │
└─────────────────────────────────────┘
```

## Expected Output

```
========================================
  TEST SUMMARY
========================================

Test                              Duration  Status
----                              --------  ------
regist100 Full Form              245.67s   ✅ PASS
regist100 Image Size Warning     156.23s   ✅ PASS
regist-support Full Form         267.89s   ✅ PASS
regist-support Image Size Warning 148.45s   ✅ PASS

Total Tests: 4
Passed: 4
Failed: 0

🎉 ALL TESTS PASSED! 🎉
```

## Test Results Location

### Screenshots:
```
regist/test-results/
├── regist100-image-size-warning-modal.png
├── regist-support-image-size-warning-modal.png
└── [other test screenshots]
```

### HTML Report:
```bash
npx playwright show-report
```

## Troubleshooting

### ❌ Dev server not running
```
Error: page.goto: net::ERR_CONNECTION_REFUSED
```
**Solution:** Start dev server with `npm run dev`

### ❌ Test images not found
```
Error: ENOENT: no such file or directory
```
**Solution:** Run `.\create-test-images-simple.ps1`

### ❌ MongoDB connection error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service

### ❌ Test timeout
```
Error: Test timeout of 180000ms exceeded
```
**Solution:** 
- Check if dev server is responding
- Increase timeout in test file
- Check system resources

### ⚠️ Some tests failed
**Actions:**
1. Check console output for error details
2. Review screenshots in `test-results/`
3. Run failed test individually for debugging
4. Check browser console in headed mode

## Performance Tips

### Run in Headless Mode (Faster)
Edit test files and remove `--headed` flag:
```typescript
// In run-full-tests.ps1, change:
npx playwright test ... --headed
// to:
npx playwright test ...
```

### Run Specific Test Only
```bash
cd regist
npx playwright test tests/register100-full-fields.spec.ts --grep "Image Size"
```

### Parallel Execution (Advanced)
```bash
npx playwright test --workers=2
```

## CI/CD Integration

For automated testing in CI/CD:
```yaml
# Example GitHub Actions
- name: Run Full Tests
  run: |
    npm run dev &
    sleep 10
    npx playwright test
```

## Notes

- Total test time: ~10-15 minutes
- Tests run sequentially (not parallel)
- Browser opens in headed mode (visible)
- Screenshots saved automatically on failure
- HTML report generated after completion
- All tests must pass for success

## Support

If tests fail consistently:
1. Check test logs in console
2. Review screenshots
3. Run tests individually
4. Check system requirements
5. Verify all dependencies installed
