# Automated Testing on Production Environment

## Overview

เอกสารนี้อธิบายวิธีการรัน automated tests บน production environment (http://18.138.63.84:3000) เพื่อทดสอบการทำงานของระบบลงทะเบียนดนตรีไทย

---

## Test Files

### 1. Register100 Production Test
**ไฟล์**: `tests/register100-full-fields-production.spec.ts`  
**URL**: http://18.138.63.84:3000/regist100  
**คะแนนเป้าหมาย**: 100/100

**ครอบคลุม**:
- ✅ Step 1: ข้อมูลโรงเรียน
- ✅ Step 2: ผู้บริหารสถานศึกษา
- ✅ Step 3: ความพร้อมในการส่งเสริม
- ✅ Step 4: ครูผู้สอนดนตรีไทย (5 คน)
- ✅ Step 5: หลักสูตรและการจัดการเรียนการสอน
- ✅ Step 6: การสนับสนุน
- ✅ Step 7: รางวัลและผลงาน
- ✅ Step 8: กิจกรรมดนตรีไทย
- ✅ Step 9: การประชาสัมพันธ์

---

### 2. Register Support Production Test
**ไฟล์**: `tests/regist-support-9teachers-full-production.spec.ts`  
**URL**: http://18.138.63.84:3000/regist-support  
**คะแนนเป้าหมาย**: 80/80

**ครอบคลุม**:
- ✅ Step 1: ข้อมูลหน่วยงาน
- ✅ Step 2: ผู้บริหารสถานศึกษา
- ✅ Step 3: ความพร้อมในการส่งเสริม
- ✅ Step 4: ครูผู้สอนดนตรีไทย (4 คน = 20 คะแนน)
- ✅ Step 5: สถานที่ทำการเรียนการสอน
- ✅ Step 6: การสนับสนุน (20 คะแนน)
- ✅ Step 7: รางวัลและผลงาน (20 คะแนน)
- ✅ Step 8: กิจกรรมดนตรีไทย (15 คะแนน)
- ✅ Step 9: การประชาสัมพันธ์ (5 คะแนน)

---

## Prerequisites

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ติดตั้ง Playwright Browsers
```bash
npx playwright install
```

### 3. เตรียมไฟล์รูปภาพ
ต้องมีไฟล์รูปภาพใน `public/` directory:
- `public/manager.jpg` - รูปผู้บริหาร
- `public/teacher1.jpg` - รูปครูคนที่ 1
- `public/teacher2.jpg` - รูปครูคนที่ 2
- `public/teacher3.jpg` - รูปครูคนที่ 3
- `public/teacher4.jpg` - รูปครูคนที่ 4
- `public/teacher5.jpg` - รูปครูคนที่ 5 (สำหรับ Register100)

---

## วิธีการรัน Tests

### รัน Register100 Test บน Production

```bash
# แบบ headless (ไม่เปิด browser)
npx playwright test tests/register100-full-fields-production.spec.ts

# แบบ headed (เปิด browser ดูการทำงาน)
npx playwright test tests/register100-full-fields-production.spec.ts --headed

# แบบ debug (ดู step-by-step)
npx playwright test tests/register100-full-fields-production.spec.ts --debug

# แบบ UI mode (interactive)
npx playwright test tests/register100-full-fields-production.spec.ts --ui
```

---

### รัน Register Support Test บน Production

```bash
# แบบ headless (ไม่เปิด browser)
npx playwright test tests/regist-support-9teachers-full-production.spec.ts

# แบบ headed (เปิด browser ดูการทำงาน)
npx playwright test tests/regist-support-9teachers-full-production.spec.ts --headed

# แบบ debug (ดู step-by-step)
npx playwright test tests/regist-support-9teachers-full-production.spec.ts --debug

# แบบ UI mode (interactive)
npx playwright test tests/regist-support-9teachers-full-production.spec.ts --ui
```

---

### รัน Tests ทั้งหมดบน Production

```bash
# รัน tests ทั้งหมดที่มี "production" ในชื่อ
npx playwright test --grep production

# รัน tests ทั้งหมดแบบ headed
npx playwright test --grep production --headed

# รัน tests ทั้งหมดแบบ parallel
npx playwright test --grep production --workers=2
```

---

## Test Configuration

### Timeout Settings
```typescript
test.setTimeout(240000); // Register100: 4 minutes
test.setTimeout(600000); // Register Support: 10 minutes
```

### Test Data
```typescript
const EMAIL = 'thaimusicplatform@gmail.com';
const PHONE = '0899297983';
const FAX = '0223456789';
```

---

## Expected Results

### Register100 Test
```
✅ Step 1: ข้อมูลโรงเรียน
✅ Step 2: ผู้บริหารสถานศึกษา
✅ Step 3: ความพร้อมในการส่งเสริม
✅ Step 4: ครูผู้สอนดนตรีไทย (5 คน)
✅ Step 5: หลักสูตรและการจัดการเรียนการสอน
✅ Step 6: การสนับสนุน
✅ Step 7: รางวัลและผลงาน
✅ Step 8: กิจกรรมดนตรีไทย
✅ Step 9: การประชาสัมพันธ์
✅ Form submitted successfully
✅ Redirected to draft page

🏆 Expected Score: 100/100
```

### Register Support Test
```
✅ Step 1: ข้อมูลหน่วยงาน
✅ Step 2: ผู้บริหารสถานศึกษา
✅ Step 3: ความพร้อมในการส่งเสริม
✅ Step 4: ครูผู้สอนดนตรีไทย (4 คน = 20/20)
✅ Step 5: สถานที่ทำการเรียนการสอน
✅ Step 6: การสนับสนุน (20/20)
✅ Step 7: รางวัลและผลงาน (20/20)
✅ Step 8: กิจกรรมดนตรีไทย (15/15)
✅ Step 9: การประชาสัมพันธ์ (5/5)
✅ Form submitted successfully
✅ Redirected to home page

🏆 Expected Score: 80/80
```

---

## Debugging

### View Test Reports
```bash
# เปิด HTML report
npx playwright show-report
```

### View Screenshots
Screenshots จะถูกบันทึกอัตโนมัติเมื่อ test fail:
- `debug-*.png` - Screenshots ของ validation errors
- `test-results/` - Playwright test results directory

### View Traces
```bash
# รัน test พร้อม trace
npx playwright test --trace on

# ดู trace
npx playwright show-trace trace.zip
```

---

## Troubleshooting

### ปัญหา: Test timeout
**สาเหตุ**: Network ช้า หรือ server ตอบสนองช้า  
**แก้ไข**:
```typescript
test.setTimeout(600000); // เพิ่ม timeout เป็น 10 นาที
```

### ปัญหา: Validation modal ปรากฏ
**สาเหตุ**: ข้อมูลไม่ครบหรือไม่ถูกต้อง  
**แก้ไข**: ดู screenshot ที่ `debug-validation-*.png` เพื่อดูว่า field ไหนมีปัญหา

### ปัญหา: Cannot find element
**สาเหตุ**: Element ยังไม่โหลด หรือ selector ผิด  
**แก้ไข**:
```typescript
await page.waitForSelector('selector', { timeout: 15000 });
```

### ปัญหา: Upload file failed
**สาเหตุ**: ไฟล์รูปภาพไม่มีใน `public/` directory  
**แก้ไข**: ตรวจสอบว่ามีไฟล์รูปภาพครบถ้วน

---

## Best Practices

### 1. รัน Tests บน Production อย่างระมัดระวัง
- ⚠️ Tests จะสร้างข้อมูลจริงใน production database
- ✅ ควรเคลียร์ข้อมูล test หลังรัน tests เสร็จ
- ✅ ใช้ email และ phone ที่เป็น test data

### 2. เคลียร์ข้อมูล Test หลังรัน
```bash
# SSH เข้า production server
ssh -i "D:\Fatcat\ThaiMusic\aws-credential\thai-music-key.pem" ubuntu@18.138.63.84

# รัน cleanup script
docker exec -i thai-music-mongo mongosh thai_music_school < /home/ubuntu/cleanup-all-data.js
```

### 3. Monitor Test Results
- ตรวจสอบ console logs
- ดู screenshots เมื่อ test fail
- ตรวจสอบ API responses

### 4. Run Tests in CI/CD
```yaml
# .github/workflows/test-production.yml
name: Test Production

on:
  workflow_dispatch: # Manual trigger only

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --grep production
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Test Maintenance

### อัพเดท Test Data
แก้ไขข้อมูลใน test files:
```typescript
const EMAIL = 'your-test-email@example.com';
const PHONE = '0899297983';
```

### อัพเดท Production URL
ถ้า production URL เปลี่ยน:
```typescript
await page.goto('http://NEW-IP:3000/regist100');
```

### เพิ่ม Test Cases ใหม่
1. Copy existing test file
2. แก้ไข test data
3. เพิ่ม assertions ตามต้องการ

---

## Cleanup Commands

### เคลียร์ข้อมูล Test ทั้งหมด
```bash
# Upload cleanup script
scp -i "D:\Fatcat\ThaiMusic\aws-credential\thai-music-key.pem" cleanup-all-data.js ubuntu@18.138.63.84:/home/ubuntu/

# Execute cleanup
ssh -i "D:\Fatcat\ThaiMusic\aws-credential\thai-music-key.pem" ubuntu@18.138.63.84 "docker exec -i thai-music-mongo mongosh thai_music_school < /home/ubuntu/cleanup-all-data.js"
```

### ตรวจสอบข้อมูลใน Database
```bash
# Check collections
ssh -i "D:\Fatcat\ThaiMusic\aws-credential\thai-music-key.pem" ubuntu@18.138.63.84 "docker exec -i thai-music-mongo mongosh thai_music_school < /home/ubuntu/check-all-collections.js"
```

---

## Contact Information

**Test Email**: thaimusicplatform@gmail.com  
**Test Phone**: 0899297983  
**Production URL**: http://18.138.63.84:3000  
**Admin Dashboard**: http://18.138.63.84:3000/dcp-admin

---

## Notes

- ⚠️ Tests ใช้เวลานาน (4-10 นาที) เนื่องจากต้องกรอกข้อมูลหลายขั้นตอน
- ✅ Tests จะ upload รูปภาพจริง ต้องมีไฟล์ใน `public/` directory
- ✅ Tests จะสร้างข้อมูลจริงใน production database
- ⚠️ ควรเคลียร์ข้อมูล test หลังรัน tests เสร็จทุกครั้ง
- ✅ Tests รองรับ retry mechanism สำหรับ validation errors

---

**Last Updated**: 2026-03-20  
**Version**: 1.0.0
