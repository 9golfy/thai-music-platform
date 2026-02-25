# Register Support Test - Fixes Needed

## ปัญหาที่พบจากการรัน Test

### 1. ✅ FIXED: Support Type Selection (Step 1)
**ปัญหา**: Input fields ถูก disabled เพราะใช้ name เดียวกันหลายตัว

**แก้ไข**:
```typescript
// เดิม - ใช้ name selector ธรรมดา (ผิด)
await page.fill('input[name="supportTypeName"]', 'ชุมนุม...');

// ใหม่ - ใช้ id และ :not([disabled])
await page.locator('input[type="radio"][id="type-club"]').click();
await page.locator('input[name="supportTypeName"]:not([disabled])').fill('ชุมนุม...');
```

### 2. ✅ FIXED: Support From Organization (Step 5)
**ปัญหา**: ไม่ต้องกดปุ่ม "+ เพิ่มข้อมูล" สำหรับ item แรก (index 0)

**แก้ไข**:
```typescript
// เดิม - กดปุ่มเพิ่มก่อน (ผิด)
await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
await page.fill('input[name="supportFromOrg.0.organization"]', '...');

// ใหม่ - กรอกเลย item 0 มีอยู่แล้ว
await page.check('input[name="hasSupportFromOrg"]');
await page.fill('input[name="supportFromOrg.0.organization"]', '...');
```

### 3. ⚠️ PENDING: Unhappy Case Validation
**ปัญหา**: Step 2 validation ไม่แสดง error เพราะ Step 1 ไม่ได้กรอกข้อมูลบังคับครบ

**สาเหตุ**: Form อาจไม่ validate จนกว่าจะกด Next หรือ blur ออกจาก field

**แนะนำ**:
- เพิ่ม `await page.locator('input[name="mgtFullName"]').blur()` หลังจากกด Next
- หรือเปลี่ยนเป็นตรวจสอบว่า form ไม่ให้ไปขั้นต่อไป

## การแก้ไขที่ทำแล้ว

### ไฟล์: `tests/regist-support-full.spec.ts`

1. **Step 1 - Support Type Selection**
   - ใช้ `id="type-club"` แทน `value="ชุมนุม"`
   - ใช้ `:not([disabled])` selector
   - เพิ่ม timeout เป็น 1000ms

2. **Step 5 - Support From Org**
   - ลบการกดปุ่ม "+ เพิ่มข้อมูล" สำหรับ item แรก
   - กรอก index 0 โดยตรง
   - เพิ่ม timeout เป็น 1000ms

3. **Step 5 - Support From External**
   - กรอก index 0 ก่อน
   - จึงกดปุ่มเพิ่มสำหรับ index 1, 2

## วิธีรัน Test ที่แก้ไขแล้ว

```bash
# รัน Happy Case เท่านั้น
npx playwright test tests/regist-support-full.spec.ts --grep "Happy Case"

# รันแบบเห็น Browser
npx playwright test tests/regist-support-full.spec.ts --grep "Happy Case" --headed

# รัน Unhappy Case
npx playwright test tests/regist-support-full.spec.ts --grep "Unhappy Case"
```

## Expected Results

### Happy Case
- ✅ Step 1-4: ผ่าน
- ⏳ Step 5: กำลังแก้ไข
- ⏳ Step 6-8: ยังไม่ได้ทดสอบ

### Unhappy Case
- ✅ Step 1: แสดง error ถูกต้อง
- ⚠️ Step 2: ไม่แสดง error (ต้องแก้ไข)
- ⏳ Step 8: ยังไม่ได้ทดสอบ

## ปัญหาที่ยังต้องแก้

### 1. Step 5 - Awards
ต้องตรวจสอบว่า field names ถูกต้องหรือไม่:
- `awards.0.awardLevel`
- `awards.0.awardName`
- `awards.0.awardDate`
- `awards.0.awardEvidenceLink`

### 2. Step 6 - Video Link
ต้องตรวจสอบว่ามี field `videoLink` หรือไม่

### 3. Step 7 - Activities
ต้องตรวจสอบ field names:
- `activitiesWithinProvinceInternal`
- `activitiesWithinProvinceExternal`
- `activitiesOutsideProvince`

### 4. Step 8 - PR Activities
ต้องตรวจสอบ field names:
- `prActivities.0.activityName`
- `prActivities.0.platform`
- `prActivities.0.publishDate`
- `prActivities.0.evidenceLink`

## คำแนะนำ

1. **ใช้ Playwright Inspector**
   ```bash
   npx playwright test tests/regist-support-full.spec.ts --grep "Happy Case" --debug
   ```

2. **ดู Screenshot เมื่อ Test Fail**
   - ไฟล์จะอยู่ใน `test-results/`
   - ชื่อไฟล์: `regist-support-full-*-test-failed-1.png`

3. **ดู Video Recording**
   - ไฟล์ video จะอยู่ใน `test-results/`
   - ชื่อไฟล์: `video.webm`

4. **เพิ่ม Console Logs**
   ```typescript
   console.log('Current step:', currentStep);
   await page.screenshot({ path: `debug-step-${currentStep}.png` });
   ```

## สรุป

Test cases สร้างเสร็จแล้ว แต่ต้องแก้ไข selector และ logic บางส่วนให้ตรงกับ UI จริง

**Progress**: 
- ✅ Test structure complete
- ✅ Step 1-4 working
- ⏳ Step 5-8 need fixes
- ⚠️ Unhappy case needs adjustment

**Next Steps**:
1. แก้ไข Step 5-8 field selectors
2. ทดสอบ Happy Case จนผ่าน
3. แก้ไข Unhappy Case validation logic
4. เพิ่ม score calculation verification
