# วิธีรัน Image Size Warning Tests

## Overview
Test cases สำหรับทดสอบ modal แจ้งเตือนเมื่อขนาดรูปภาพรวมเกิน 10 MB

## Test Files
- ✅ `tests/register100-full-fields.spec.ts` - รวม test case สำหรับ regist100
- ✅ `tests/regist-support-full.spec.ts` - รวม test case สำหรับ regist-support

## Prerequisites

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Create Test Images (ถ้ายังไม่มี)
```powershell
.\create-test-images-simple.ps1
```

ไฟล์รูปจะถูกสร้างใน `regist/test-assets/`:
- `manager.jpg` (1 MB)
- `teacher1.jpg` ถึง `teacher10.jpg` (1 MB แต่ละไฟล์)

## วิธีรัน Tests

### Option 1: รัน Test ทั้งสองแบบพร้อมกัน (แนะนำ)
```powershell
.\run-all-image-size-tests.ps1
```

### Option 2: รัน Test แยกทีละแบบ

**regist100:**
```bash
cd regist
npx playwright test tests/register100-full-fields.spec.ts --grep "should show warning modal when total image size exceeds 10 MB" --headed
```

**regist-support:**
```bash
cd regist
npx playwright test tests/regist-support-full.spec.ts --grep "should show warning modal when total image size exceeds 10 MB" --headed
```

### Option 3: รัน Test แบบ Headless (ไม่เปิด Browser)
```bash
cd regist
npx playwright test tests/register100-full-fields.spec.ts --grep "should show warning modal"
npx playwright test tests/regist-support-full.spec.ts --grep "should show warning modal"
```

## Test Scenario

### ขั้นตอนการทดสอบ:

1. **Step 1:** กรอกข้อมูลพื้นฐาน
2. **Step 2:** อัพโหลด manager.jpg (1 MB)
3. **Step 3:** ข้าม
4. **Step 4:** อัพโหลดครู 10 คน
   - teacher1.jpg (1 MB)
   - teacher2.jpg (1 MB)
   - ...
   - teacher10.jpg (1 MB)
   - **รวม: 1 + 10 = 11 MB**

### Expected Results:

✅ **หลังอัพโหลดครูคนที่ 10:**
- Modal แจ้งเตือนแสดงขึ้นทันที
- Title: "ขนาดภาพเกินกำหนด"
- Message: "ขนาดภาพรวมทั้งหมดมากกว่า 10 MB (11.00 MB) กรุณาลดจำนวนหรือน้ำหนักภาพ"
- Button: "รับทราบ"

✅ **User กดปุ่ม "รับทราบ":**
- Modal ปิด
- User สามารถแก้ไขได้

✅ **User ลบครูคนที่ 10:**
- ขนาดรวมลดเหลือ 10 MB
- Modal ไม่แสดงอีก

## Test Output

### Console Output:
```
🚀 Starting Image Size Warning test...
📝 Step 1: Basic Information
✅ Step 1 completed
📝 Step 2: Upload Manager Image (1 MB)
✅ Step 2: Manager image uploaded (1 MB)
📝 Step 3: Skipping...
📝 Step 4: Uploading 10 teacher images (10 MB total)
  Adding teacher 1...
  ✅ Teacher 1 image uploaded (1 MB)
  ...
  Adding teacher 10...
  ✅ Teacher 10 image uploaded (1 MB)

⏳ Checking for warning modal after 10th image...
✅ Warning modal appeared!
✅ Modal content verified
📸 Screenshot saved
👆 User clicking "รับทราบ" button...
✅ Modal closed after user acknowledgment

🔄 User removing last teacher to reduce total size...
✅ Last teacher removed
✅ Modal does not appear with 10 MB total (within limit)

✅✅✅ Image Size Warning test completed successfully!
```

### Screenshots:
- `regist/test-results/regist100-image-size-warning-modal.png`
- `regist/test-results/regist-support-image-size-warning-modal.png`

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

### ❌ Modal doesn't appear
**Check:**
1. ไฟล์รูปมีขนาด 1 MB จริงหรือไม่
2. `useEffect` ใน Step4 ทำงานหรือไม่
3. `mgtImageFile` prop ถูกส่งไปยัง Step4 หรือไม่

### ❌ Modal appears at wrong time
**Check:**
1. Threshold ตั้งไว้ที่ 10 MB (10 * 1024 * 1024 bytes)
2. การคำนวณขนาดรวมถูกต้องหรือไม่

## Test Coverage

### ✅ Tested Scenarios:
1. Modal appears when total > 10 MB
2. Modal shows correct content
3. Modal shows correct total size
4. User must click button to close (cannot click backdrop)
5. Modal closes after clicking "รับทราบ"
6. User can remove images to reduce size
7. Modal doesn't appear when size ≤ 10 MB

### ✅ Forms Tested:
- `/regist100` - โรงเรียนดนตรีไทย 100 เปอร์เซ็นต์
- `/regist-support` - โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย

## Notes

- Test ใช้เวลาประมาณ 2-3 นาทีต่อ form
- Modal จะแสดงเฉพาะเมื่อขนาดรวม > 10 MB
- User ต้องกดปุ่ม "รับทราบ" เพื่อปิด modal (ไม่สามารถคลิก backdrop)
- Test จะถ่าย screenshot อัตโนมัติเมื่อ modal แสดง
- Test จะ verify ว่า modal ไม่แสดงอีกหลังจากลดขนาดรูป
