# Register Support Form - Fixes Plan

## Current Status Analysis

### ✅ Already Fixed
1. **ขนาดโรงเรียน (School Size)** - Already converted to read-only text display (not input field)

### ⚠️ To Fix

## 1. Add Red Asterisks (*) to Mandatory Fields

### Step 1 - Mandatory Fields:
- ✅ ชื่อสถานศึกษา (schoolName) - Already has asterisk
- ✅ จังหวัด (schoolProvince) - Already has asterisk  
- ✅ ระดับสถานศึกษา (schoolLevel) - Already has asterisk

### Step 2 - Mandatory Fields:
- ❌ ชื่อผู้บริหาร (mgtFullName) - NEEDS asterisk
- ❌ ตำแหน่ง (mgtPosition) - NEEDS asterisk
- ❌ เบอร์โทรศัพท์ (mgtPhone) - NEEDS asterisk
- ❌ ที่อยู่ (mgtAddress) - NEEDS asterisk (if required)
- ❌ อีเมล (mgtEmail) - NEEDS asterisk (if required)

### Step 8 - Mandatory Fields:
- ❌ การรับรองข้อมูล (certifiedINFOByAdminName) - NEEDS validation

## 2. Add Validation Modal (like register100)

Need to add modal popup that shows "กรุณากรอกข้อมูลให้ครบถ้วน" when clicking "ถัดไป" without filling required fields.

### Implementation:
- Create `ValidationModal` component
- Add validation logic in `handleNext()` function
- Show modal when validation fails

## 3. Add Missing Fields Modal

Need to add modal that shows list of missing fields when submitting incomplete form (like register100).

### Implementation:
- Create `MissingFieldsModal` component
- Add comprehensive validation in `onSubmit()` function
- Show list of missing fields with step numbers

## 4. Add Step 8 Certification Checkbox Validation

Need to validate that certification checkbox is checked before submission.

### Implementation:
- Add validation in `onSubmit()` function
- Show in missing fields modal if not checked
- Message: "การรับรองข้อมูล - กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูลเป็นความจริง (Step 8)"

## 5. Test All Steps

Need to test that validation modals work correctly in all steps.

---

## Implementation Order

1. Add red asterisks to Step 2 mandatory fields
2. Create ValidationModal component
3. Add validation logic to handleNext()
4. Create MissingFieldsModal component  
5. Add comprehensive validation to onSubmit()
6. Test all steps

---

## Reference

Based on register100 implementation:
- `components-regist100/ui/ValidationModal.tsx`
- `components-regist100/ui/MissingFieldsModal.tsx`
- `components-regist100/forms/Register100Wizard.tsx`
