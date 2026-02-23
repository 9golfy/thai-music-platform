# Selenium E2E Test - Quick Start Guide

## 🚀 Quick Start (3 Steps)

### 1. Make sure your servers are running

```cmd
REM Terminal 1: Start the frontend
cd web
npm run dev

REM Terminal 2: Start the API (if using Docker)
docker-compose up api
```

Frontend should be at: `http://localhost:3000`  
API should be at: `http://localhost:8080`

### 2. Run the setup (first time only)

**In PowerShell:**
```powershell
cd web
.\setup-e2e.bat
```

**In CMD:**
```cmd
cd web
setup-e2e.bat
```

This will:
- Create test images (manager.jpg, teacher1.jpg, teacher2.jpg)
- Install Selenium dependencies

### 3. Run the test

**In PowerShell:**
```powershell
.\run-selenium-e2e.bat
```

**In CMD:**
```cmd
run-selenium-e2e.bat
```

**Or use npm (works in both):**
```cmd
npm run test:e2e:selenium
```

## 📋 What the Test Does

1. ✅ Opens Chrome browser (visible)
2. ✅ Navigates to http://localhost:3000
3. ✅ Clicks "เริ่มกรอกแบบฟอร์ม"
4. ✅ Fills Step 1: School information (11 fields)
5. ✅ Fills Step 2: Manager information + uploads photo
6. ✅ Fills Step 3: 2 teachers + uploads photo for teacher 1
7. ✅ Skips Steps 4-6 (no required fields)
8. ✅ Step 7: Checks certification checkbox
9. ✅ Submits form
10. ✅ Verifies success message
11. ✅ Keeps browser open for 5 seconds

## 📁 Files Created

```
web/
├── e2e/
│   └── register69.e2e.ts              ← Main test file
├── test-assets/
│   ├── manager.jpg                    ← Auto-generated
│   ├── teacher1.jpg                   ← Auto-generated
│   ├── teacher2.jpg                   ← Auto-generated
│   └── create-test-images.ps1         ← Image generator
├── setup-e2e.bat                      ← One-time setup
├── run-selenium-e2e.bat               ← Run test
├── tsconfig-e2e.json                  ← TypeScript config
├── E2E-SELENIUM-README.md             ← Full documentation
└── SELENIUM-E2E-QUICKSTART.md         ← This file
```

## 🎯 Test Features

- **Realistic typing**: 80-120ms delay per character
- **Smart scrolling**: Scrolls elements into view
- **Explicit waits**: Waits up to 10 seconds for elements
- **File uploads**: Uploads 3 image files
- **Array handling**: Adds multiple teachers
- **Error handling**: Takes screenshot on failure
- **Visual verification**: Browser stays open 5 seconds

## 🔧 Customization

Edit `e2e/register69.e2e.ts`:

```typescript
// Change base URL
const CONFIG = {
  baseUrl: 'http://localhost:3001',  // If using different port
  ...
};

// Change test data
const TEST_DATA = {
  schoolName: 'Your School Name',
  ...
};
```

## ❓ Troubleshooting

### "Chrome driver version mismatch"
```cmd
npm install chromedriver@latest
```

### "Cannot find test images"
```cmd
cd test-assets
powershell -ExecutionPolicy Bypass -File create-test-images.ps1
```

### "Element not found"
- Make sure frontend is running at http://localhost:3000
- Check if API is running at http://localhost:8080
- Increase timeout in CONFIG.waitTimeout

### "Form submission failed"
- Verify API is running
- Check browser console for errors
- Make sure all required fields are filled

## 📊 Expected Output

```
🚀 Starting E2E Test for Thai Music School Registration Form
======================================================================

📍 Step 0: Navigate to home page
  🖱️  Clicking: เริ่มกรอกแบบฟอร์ม button

📍 Step 1: Basic Information (ข้อมูลพื้นฐาน)
  📝 Filling: School Name
  📋 Selecting: School Province = กรุงเทพมหานคร
  ...

✅ SUCCESS!
======================================================================
📋 Alert Message: ส่งแบบฟอร์มสำเร็จ! ID: 12345
🆔 Submission ID: 12345
```

## 🎓 Next Steps

1. **Add more test data**: Edit TEST_DATA in register69.e2e.ts
2. **Test more fields**: Add Steps 4-6 field filling
3. **Add assertions**: Verify field values after filling
4. **Multiple scenarios**: Create separate test files for different cases
5. **CI/CD integration**: Add to your build pipeline

## 📚 Full Documentation

See `E2E-SELENIUM-README.md` for complete documentation.

## ✅ Requirements Checklist

- [x] Opens Chrome in visible mode
- [x] Navigates to http://localhost:3000
- [x] Clicks "เริ่มกรอกแบบฟอร์ม"
- [x] Fills ALL required fields
- [x] Fills many optional fields
- [x] Uploads 3 files (manager, teacher1, teacher2)
- [x] Adds 2 teacher rows
- [x] Realistic typing (80-120ms per char)
- [x] Scrolls and waits for elements
- [x] Checks certification checkbox
- [x] Submits form
- [x] Verifies success
- [x] Keeps browser open 5 seconds
- [x] Uses data-testid selectors (where available)
- [x] Centralized selector map
- [x] TypeScript with proper types
- [x] Easy to run on Windows

---

**Ready to test!** Just run `run-selenium-e2e.bat` 🚀
