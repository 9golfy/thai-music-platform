# Step 5 Award Validation Fix - Complete

## ปัญหาที่พบ

Step 5 ไม่มีการ validate ว่าต้องกรอกรางวัลอย่างน้อย 1 รายการ ทำให้ผู้ใช้สามารถกดปุ่ม "ถัดไป" ได้โดยไม่ต้องกรอกข้อมูลรางวัล

## สาเหตุ

ใน `Register100Wizard.tsx` ไม่มี validation logic สำหรับ Step 5 ใน `handleNext` function และ validation ใน `onSubmit` ตรวจสอบเฉพาะกรณีที่มีรางวัลแล้วแต่ไม่ได้เลือก awardLevel เท่านั้น

## การแก้ไข

### 1. เพิ่ม Validation ใน handleNext Function

**Location**: `components-regist100/forms/Register100Wizard.tsx`

**Before**:
```typescript
} else if (currentStep === 4) {
  // Check if at least 1 teacher exists
  const teachers = form.getValues('thaiMusicTeachers') || [];
  if (teachers.length === 0) {
    setShowValidationErrorModal(true);
    return;
  }
  
  // Check if first teacher has qualification selected
  if (teachers[0] && !teachers[0].teacherQualification) {
    setShowValidationErrorModal(true);
    return;
  }
}

if (requiredFields.length > 0) {
  const isValid = await form.trigger(requiredFields);
  if (!isValid) {
    setShowValidationErrorModal(true);
    return;
  }
}
```

**After**:
```typescript
} else if (currentStep === 4) {
  // Check if at least 1 teacher exists
  const teachers = form.getValues('thaiMusicTeachers') || [];
  if (teachers.length === 0) {
    setShowValidationErrorModal(true);
    return;
  }
  
  // Check if first teacher has qualification selected
  if (teachers[0] && !teachers[0].teacherQualification) {
    setShowValidationErrorModal(true);
    return;
  }
} else if (currentStep === 5) {
  // Check if at least 1 award exists with awardLevel selected
  const awards = form.getValues('awards') || [];
  if (awards.length === 0 || !awards[0]?.awardLevel) {
    setShowValidationErrorModal(true);
    return;
  }
}

if (requiredFields.length > 0) {
  const isValid = await form.trigger(requiredFields);
  if (!isValid) {
    setShowValidationErrorModal(true);
    return;
  }
}
```

### 2. เพิ่ม Validation ใน onSubmit Function

**Location**: `components-regist100/forms/Register100Wizard.tsx`

**Before**:
```typescript
// Step 5 validation - Award level is required if awards exist
if (data.awards && data.awards.length > 0) {
  data.awards.forEach((award, index) => {
    if (award.awardName && !award.awardLevel) {
      missingFields.push(`ระดับรางวัล - รางวัลที่ ${index + 1} (Step 5)`);
    }
  });
}
```

**After**:
```typescript
// Step 5 validation - At least 1 award is required
if (!data.awards || data.awards.length === 0 || !data.awards[0]?.awardLevel) {
  missingFields.push('รางวัล - กรุณาเพิ่มอย่างน้อย 1 รายการและเลือกระดับรางวัล (Step 5)');
} else {
  // Award level is required if awards exist
  data.awards.forEach((award, index) => {
    if (award.awardName && !award.awardLevel) {
      missingFields.push(`ระดับรางวัล - รางวัลที่ ${index + 1} (Step 5)`);
    }
  });
}
```

## Validation Logic

### handleNext (Step 5 → Step 6)
ตรวจสอบว่า:
1. มีรางวัลอย่างน้อย 1 รายการ (`awards.length > 0`)
2. รางวัลแรกต้องมีการเลือก `awardLevel`

ถ้าไม่ผ่าน → แสดง `ValidationErrorModal` พร้อมข้อความ "กรุณากรอกข้อมูลให้ครบถ้วน"

### onSubmit (Final Submission)
ตรวจสอบว่า:
1. มีรางวัลอย่างน้อย 1 รายการ
2. รางวัลแรกต้องมีการเลือก `awardLevel`
3. ถ้ามีรางวัลหลายรายการ ทุกรายการที่มี `awardName` ต้องมี `awardLevel`

ถ้าไม่ผ่าน → แสดง `MissingFieldsModal` พร้อมรายการฟิลด์ที่ขาด

## ผลลัพธ์

### Before Fix:
- ✗ ผู้ใช้สามารถกดปุ่ม "ถัดไป" จาก Step 5 ได้โดยไม่ต้องกรอกรางวัล
- ✗ ผู้ใช้สามารถ submit form ได้โดยไม่มีรางวัล
- ✗ ไม่มี validation modal แสดงเมื่อไม่กรอกรางวัล

### After Fix:
- ✓ ผู้ใช้ต้องกรอกรางวัลอย่างน้อย 1 รายการ
- ✓ ผู้ใช้ต้องเลือกระดับรางวัล (dropdown)
- ✓ แสดง validation modal เมื่อพยายามกดปุ่ม "ถัดไป" โดยไม่กรอกรางวัล
- ✓ แสดง missing fields modal เมื่อพยายาม submit โดยไม่มีรางวัล

## Testing

### Manual Testing Steps:

1. **Test Case 1: ไม่กรอกรางวัลเลย**
   - เปิดฟอร์ม register100
   - ไปที่ Step 5
   - ไม่กรอกข้อมูลรางวัลเลย
   - กดปุ่ม "ถัดไป"
   - **Expected**: แสดง validation modal "กรุณากรอกข้อมูลให้ครบถ้วน"

2. **Test Case 2: กรอกรางวัลแต่ไม่เลือกระดับ**
   - เปิดฟอร์ม register100
   - ไปที่ Step 5
   - กรอกชื่อรางวัล แต่ไม่เลือก dropdown "ระดับรางวัล"
   - กดปุ่ม "ถัดไป"
   - **Expected**: แสดง validation modal "กรุณากรอกข้อมูลให้ครบถ้วน"

3. **Test Case 3: กรอกรางวัลครบถ้วน**
   - เปิดฟอร์ม register100
   - ไปที่ Step 5
   - เลือก "ระดับรางวัล" จาก dropdown (เช่น "ประเทศ")
   - กรอกชื่อรางวัล
   - กดปุ่ม "ถัดไป"
   - **Expected**: ไปต่อที่ Step 6 ได้

4. **Test Case 4: Submit โดยไม่มีรางวัล**
   - เปิดฟอร์ม register100
   - กรอกข้อมูลทุก step ยกเว้น Step 5 (ไม่กรอกรางวัล)
   - ไปที่ Step 8 และกด "ส่งแบบฟอร์ม"
   - **Expected**: แสดง missing fields modal พร้อมข้อความ "รางวัล - กรุณาเพิ่มอย่างน้อย 1 รายการและเลือกระดับรางวัล (Step 5)"

## Related Files

### Modified:
- ✅ `components-regist100/forms/Register100Wizard.tsx`
  - เพิ่ม validation ใน `handleNext` สำหรับ Step 5
  - เพิ่ม validation ใน `onSubmit` สำหรับรางวัล

### UI Components (No Changes):
- `components-regist100/forms/steps/Step5.tsx` - ไม่มีการเปลี่ยนแปลง
- `components-regist100/ui/ValidationErrorModal.tsx` - ใช้ modal เดิม
- `components-regist100/ui/MissingFieldsModal.tsx` - ใช้ modal เดิม

## Award Field Structure

```typescript
interface Award {
  awardLevel: string;      // Required - dropdown: "ประเทศ", "ภาค", "จังหวัด", "เขต"
  awardName: string;       // Optional - text input
  awardDate: string;       // Optional - date input
  awardEvidenceLink: string; // Optional - URL input
}
```

## Validation Rules Summary

| Field | Required | Validation |
|-------|----------|------------|
| awards array | ✓ | Must have at least 1 item |
| awards[0].awardLevel | ✓ | Must be selected from dropdown |
| awards[0].awardName | ⚪ | Optional |
| awards[0].awardDate | ⚪ | Optional |
| awards[0].awardEvidenceLink | ⚪ | Optional |
| awards[n].awardLevel | ✓ | Required if awardName is filled |

## Notes

- รางวัลเป็นฟิลด์ที่สำคัญสำหรับการคำนวณคะแนน (ระดับประเทศ = 20 คะแนน)
- ผู้ใช้ต้องเลือกระดับรางวัลจาก dropdown ก่อนเสมอ
- สามารถเพิ่มรางวัลได้หลายรายการ แต่ต้องมีอย่างน้อย 1 รายการ
- ถ้ามีรางวัลหลายรายการ ทุกรายการที่กรอกชื่อรางวัลต้องเลือกระดับรางวัลด้วย

## Impact

- **User Experience**: ดีขึ้น - ป้องกันการ submit form โดยไม่มีรางวัล
- **Data Quality**: ดีขึ้น - รับประกันว่าทุก submission จะมีรางวัลอย่างน้อย 1 รายการ
- **Score Calculation**: ถูกต้อง - มีข้อมูลรางวัลสำหรับคำนวณคะแนน
- **Backward Compatibility**: ✓ ไม่กระทบข้อมูลเก่า

---

**Date**: March 1, 2026
**Status**: Complete
**Priority**: High (Bug Fix)
