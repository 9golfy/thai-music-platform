# Validation Test Guide - Register100 Form

## สรุป

เอกสารนี้อธิบายวิธีการทดสอบ validation และ modal popup ทั้งหมดในฟอร์ม register100

## Test File

**Location**: `tests/register100-complete-validation-test.spec.ts`

**Purpose**: ทดสอบ validation ทุก step และ modal popup ทั้งหมด

## Test Cases (6 Tests)

### Test 1: Step 1 Validation Modal
**Objective**: ทดสอบว่า validation modal แสดงเมื่อกด "ถัดไป" โดยไม่กรอกข้อมูล Step 1

**Steps**:
1. เปิดฟอร์ม register100
2. ไม่กรอกข้อมูลใน Step 1 เลย
3. กดปุ่ม "ถัดไป"

**Expected Result**:
- ✅ แสดง validation modal พร้อมข้อความ "กรุณากรอกข้อมูลให้ครบถ้วน"
- ✅ มีปุ่ม "ตกลง" เพื่อปิด modal
- ✅ ยังคงอยู่ที่ Step 1 หลังปิด modal

### Test 2: Step 2 Validation Modal
**Objective**: ทดสอบว่า validation modal แสดงเมื่อกด "ถัดไป" โดยไม่กรอกข้อมูล Step 2

**Steps**:
1. เปิดฟอร์ม register100
2. กรอก Step 1 ให้ครบ
3. ไปที่ Step 2 แต่ไม่กรอกข้อมูล
4. กดปุ่ม "ถัดไป"

**Expected Result**:
- ✅ แสดง validation modal
- ✅ ยังคงอยู่ที่ Step 2 หลังปิด modal

### Test 3: Step 5 Award Validation
**Objective**: ทดสอบว่า validation modal แสดงเมื่อไม่กรอกรางวัลใน Step 5

**Steps**:
1. เปิดฟอร์ม register100
2. กรอก Step 1-4 ให้ครบ
3. ไปที่ Step 5 แต่ไม่กรอกรางวัล
4. กดปุ่ม "ถัดไป"

**Expected Result**:
- ✅ แสดง validation modal
- ✅ ไม่สามารถไปต่อที่ Step 6 ได้

### Test 4: Missing Fields Modal - Empty Form
**Objective**: ทดสอบว่า missing fields modal แสดงรายการฟิลด์ที่ขาดเมื่อส่งฟอร์มที่ไม่ครบ

**Steps**:
1. เปิดฟอร์ม register100
2. กรอกข้อมูลเพียงบางส่วน (เพื่อให้ผ่าน validation แต่ละ step)
3. ไปถึง Step 8
4. ติ๊กถูก certification checkbox
5. กดปุ่ม "ส่งแบบฟอร์ม"

**Expected Result**:
- ✅ แสดง missing fields modal
- ✅ แสดงรายการฟิลด์ที่ขาดพร้อมหมายเลข Step
- ✅ มีข้อความจาก Step 1 ที่ยังไม่ได้กรอก

### Test 5: Step 8 Certification Checkbox ⭐ (MAIN TEST)
**Objective**: ทดสอบว่า missing fields modal แสดงข้อความเกี่ยวกับ certification checkbox เมื่อไม่ติ๊กถูก

**Steps**:
1. เปิดฟอร์ม register100
2. กรอกข้อมูลครบทุก step (Step 1-7)
3. ไปถึง Step 8
4. **ไม่ติ๊กถูก** certification checkbox
5. กดปุ่ม "ส่งแบบฟอร์ม"

**Expected Result**:
- ✅ แสดง missing fields modal
- ✅ มีข้อความ "การรับรองข้อมูล - กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูลเป็นความจริง (Step 8)"
- ✅ บันทึก screenshot ไว้ที่ `test-results/step8-certification-validation.png`

### Test 6: Successful Submission
**Objective**: ทดสอบว่าฟอร์มส่งสำเร็จเมื่อกรอกครบทุกฟิลด์และติ๊กถูก checkbox

**Steps**:
1. เปิดฟอร์ม register100
2. กรอกข้อมูลครบทุก step (Step 1-7)
3. ไปถึง Step 8
4. **ติ๊กถูก** certification checkbox
5. กดปุ่ม "ส่งแบบฟอร์ม"

**Expected Result**:
- ✅ ไม่แสดง missing fields modal
- ✅ แสดง success modal
- ✅ บันทึก screenshot ไว้ที่ `test-results/successful-submission.png`

## วิธีการรัน Test

### รัน Test ทั้งหมด
```bash
npx playwright test tests/register100-complete-validation-test.spec.ts
```

### รัน Test เฉพาะ Test 5 (Step 8 Certification)
```bash
npx playwright test tests/register100-complete-validation-test.spec.ts -g "Test 5"
```

### รัน Test แบบ Headed (เห็น Browser)
```bash
npx playwright test tests/register100-complete-validation-test.spec.ts --headed
```

### รัน Test แบบ UI Mode (Debug)
```bash
npx playwright test tests/register100-complete-validation-test.spec.ts --ui
```

### รัน Test แบบ Debug
```bash
npx playwright test tests/register100-complete-validation-test.spec.ts --debug
```

## Expected Test Results

### ✅ All Tests Should Pass

```
Running 6 tests using 1 worker

  ✓ Test 1: Should show validation modal when clicking "ถัดไป" without filling Step 1
  ✓ Test 2: Should show validation modal when clicking "ถัดไป" without filling Step 2
  ✓ Test 3: Should show validation modal when clicking "ถัดไป" without filling awards in Step 5
  ✓ Test 4: Should show missing fields modal when submitting empty form
  ✓ Test 5: Should show missing fields modal when submitting without checking certification checkbox
  ✓ Test 6: Should submit successfully when all fields are filled including certification checkbox

  6 passed (2m)
```

## Screenshots Generated

Test จะสร้าง screenshots ไว้ใน `test-results/`:

1. `step8-certification-validation.png` - Missing fields modal แสดง Step 8 message
2. `successful-submission.png` - Success modal หลังส่งฟอร์มสำเร็จ
3. `unexpected-missing-fields.png` - (ถ้ามี) Debug screenshot เมื่อ test fail

## Debugging Failed Tests

### ถ้า Test 5 Fail (Step 8 Certification)

**Possible Reasons**:
1. Validation logic ใน `Register100Wizard.tsx` ไม่ทำงาน
2. Missing fields modal ไม่แสดงข้อความ Step 8
3. Certification checkbox ไม่ถูก validate

**How to Debug**:
```bash
# รัน test แบบ headed เพื่อดู browser
npx playwright test tests/register100-complete-validation-test.spec.ts -g "Test 5" --headed

# รัน test แบบ debug เพื่อ step through
npx playwright test tests/register100-complete-validation-test.spec.ts -g "Test 5" --debug
```

**Check**:
1. เปิด `components-regist100/forms/Register100Wizard.tsx`
2. ตรวจสอบว่ามี validation code นี้:
```typescript
// Step 8 validation - Certification checkbox
if (!data.certifiedINFOByAdminName) {
  missingFields.push('การรับรองข้อมูล - กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูลเป็นความจริง (Step 8)');
}
```

### ถ้า Test 6 Fail (Successful Submission)

**Possible Reasons**:
1. ข้อมูลบางฟิลด์ยังไม่ครบ
2. API endpoint ไม่ทำงาน
3. Database connection error

**How to Debug**:
```bash
# ดู console logs
npx playwright test tests/register100-complete-validation-test.spec.ts -g "Test 6" --headed

# ตรวจสอบ screenshot
# เปิดไฟล์ test-results/unexpected-missing-fields.png
```

## Manual Testing Steps

### ทดสอบ Step 8 Certification Manually

1. เปิด browser ไปที่ `http://localhost:3000/regist100`
2. กรอกข้อมูลครบทุก step (ใช้ข้อมูลทดสอบ)
3. ไปถึง Step 8
4. **อย่าติ๊กถูก** checkbox "ข้าพเจ้าขอรับรองว่าข้อมูล..."
5. กดปุ่ม "ส่งแบบฟอร์ม"
6. **ตรวจสอบ**:
   - ✅ ต้องมี modal popup แสดงขึ้นมา
   - ✅ modal ต้องมีข้อความ "การรับรองข้อมูล" หรือ "Step 8"
   - ✅ มีปุ่ม "ตกลง" เพื่อปิด modal
7. กดปุ่ม "ตกลง" เพื่อปิด modal
8. ติ๊กถูก checkbox
9. กดปุ่ม "ส่งแบบฟอร์ม" อีกครั้ง
10. **ตรวจสอบ**:
    - ✅ ต้องแสดง success modal (ไม่ใช่ missing fields modal)
    - ✅ ฟอร์มถูกส่งสำเร็จ

## Validation Flow Diagram

```
User clicks "ส่งแบบฟอร์ม"
         ↓
┌─────────────────────────┐
│ Check Step 8 Checkbox   │
└─────────────────────────┘
         ↓
    ┌────────┐
    │Checked?│
    └────────┘
         ↓
    ┌────┴────┐
    │         │
   NO        YES
    │         │
    │         ↓
    │    Check all other fields
    │    (Step 1-5)
    │         ↓
    │    ┌────────┐
    │    │All OK? │
    │    └────────┘
    │         ↓
    │    ┌────┴────┐
    │    │         │
    │   NO        YES
    │    │         │
    ↓    ↓         ↓
Show Missing    Submit Form
Fields Modal    Show Success Modal
    ↓
User clicks "ตกลง"
    ↓
Modal closes
User fixes issues
```

## Related Files

### Test Files:
- ✅ `tests/register100-complete-validation-test.spec.ts` - Main validation test (NEW)
- `tests/register100-validation-modals.spec.ts` - Validation modal tests
- `tests/register100.spec.ts` - Main comprehensive test
- `tests/register100-scenarios.spec.ts` - Score scenarios
- `tests/register100-regression.spec.ts` - Regression tests

### Source Files:
- `components-regist100/forms/Register100Wizard.tsx` - Main form with validation
- `components-regist100/forms/steps/Step8.tsx` - Step 8 with certification checkbox
- `components-regist100/ui/MissingFieldsModal.tsx` - Missing fields modal component
- `components-regist100/ui/ValidationErrorModal.tsx` - Simple validation modal

### Documentation:
- `VALIDATION-ENHANCEMENTS-COMPLETE.md` - Complete validation documentation
- `MISSING-FIELDS-MODAL-CONFIRMATION.md` - Missing fields modal feature
- `STEP8-CERTIFICATION-VALIDATION-ADDED.md` - Step 8 validation documentation
- `VALIDATION-TEST-GUIDE.md` - This document

## Troubleshooting

### Modal ไม่แสดง

**Check**:
1. ตรวจสอบว่า `showMissingFieldsModal` state ถูก set เป็น `true`
2. ตรวจสอบว่า `MissingFieldsModal` component ถูก render
3. ตรวจสอบ z-index ของ modal (ควรเป็น `z-50`)
4. เปิด browser console ดู errors

### Modal แสดงแต่ไม่มีข้อความ Step 8

**Check**:
1. ตรวจสอบว่า validation code ใน `onSubmit` มีการเพิ่ม Step 8 message
2. ตรวจสอบว่า `missingFieldsList` array มีข้อความ Step 8
3. ตรวจสอบว่า `MissingFieldsModal` render `missingFields` prop ถูกต้อง

### Test Timeout

**Solution**:
```typescript
test.setTimeout(180000); // เพิ่ม timeout เป็น 3 นาที
```

## Summary

✅ **Test file สร้างเสร็จแล้ว**: `tests/register100-complete-validation-test.spec.ts`

Test file นี้ครอบคลุม:
- ✅ Validation modal ทุก step
- ✅ Missing fields modal
- ✅ Step 8 certification checkbox validation
- ✅ Successful submission

รัน test เพื่อตรวจสอบว่า validation ทำงานถูกต้อง:
```bash
npx playwright test tests/register100-complete-validation-test.spec.ts
```

---

**Date**: March 1, 2026
**Status**: ✅ Complete
**Test Coverage**: 6 test cases covering all validation scenarios
