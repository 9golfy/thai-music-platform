# ✅ Navigation Fix Summary

## Problem Fixed
Navigation buttons ("ถัดไป" and "ย้อนกลับ") now behave EXACTLY like clicking stepper circles.

## Solution: Single Source of Truth

### 1. Core Navigation Function

```typescript
const goToStep = (targetStep: number) => {
  // Clamp step range to 1..7
  const clampedStep = Math.max(1, Math.min(7, targetStep));
  setCurrentStep(clampedStep);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

All navigation now goes through this single function.

### 2. Next Button Logic

```typescript
const handleNext = async () => {
  if (currentStep === 7) {
    // Step 7: trigger final submit
    form.handleSubmit(onSubmit)();
    return;
  }

  // Validate only current step fields
  const fieldsToValidate = STEP_FIELDS[currentStep];
  if (fieldsToValidate && fieldsToValidate.length > 0) {
    const isValid = await form.trigger(fieldsToValidate as any);
    if (!isValid) {
      // Show errors and remain on current step
      return;
    }
  }

  // Valid: advance to next step
  goToStep(currentStep + 1);
};
```

**Behavior:**
- Steps 1-6: Validates current step fields only
- If validation fails: Shows Thai error messages, stays on current step
- If validation passes: Calls `goToStep(currentStep + 1)` - same as clicking next stepper circle
- Step 7: Triggers final form submission with full validation

### 3. Back Button Logic

```typescript
const handleBack = () => {
  // No validation on back
  goToStep(currentStep - 1);
};
```

**Behavior:**
- No validation
- Calls `goToStep(currentStep - 1)` - same as clicking previous stepper circle
- Disabled on Step 1 (via `disabled={currentStep === 1}`)

### 4. Stepper Click Logic

```typescript
const handleStepClick = (step: number) => {
  goToStep(step);
};
```

**Behavior:**
- Direct navigation to any step
- No validation
- Same `goToStep()` function used by buttons

## Step-to-Fields Mapping

Created `lib/constants/register69.steps.ts` with explicit field mapping:

```typescript
export const STEP_FIELDS: Record<number, StepFieldKey[]> = {
  1: [
    'schoolName', 'province', 'schoolLevel', 'affiliation',
    'schoolSize', 'staffCount', 'studentCount', 'studentCountByGrade',
    'addressNo', 'moo', 'road', 'subDistrict', 'district',
    'provinceAddress', 'postalCode', 'phone', 'fax'
  ],
  2: ['mgtFullName', 'mgtPosition', 'mgtPhone', 'mgtEmail'],
  3: ['thaiMusicTeachers'],
  4: [
    'currentTeachingPlans', 'inClassInstructionDuration',
    'outOfClassInstructionDuration', 'instructionLocationOverview'
  ],
  5: [
    'availableInstruments', 'instrumentSufficiency',
    'instrumentSufficiencyDetail', 'instrumentINSufficiency',
    'instrumentINSufficiencyDetail', 'externalInstructors'
  ],
  6: [
    'supportByAdmin', 'supportBySchoolBoard', 'supportByLocalGov',
    'supportByCommunity', 'supportByOthers', 'teacherSkillThaiMusicMajor',
    'teacherSkillOtherMajorButTrained', 'curriculumFramework',
    'learningOutcomes', 'managementContext', 'equipmentAndBudgetSupport',
    'awardsLastYear', 'obstacles', 'suggestions'
  ],
  7: [
    'mediaPhotos', 'publicityLinks', 'heardFromSchoolName',
    'heardFromSchoolDistrict', 'heardFromSchoolProvince',
    'DCP_PR_Channel_FACEBOOK', 'DCP_PR_Channel_YOUTUBE',
    'DCP_PR_Channel_Tiktok', 'heardFromOther', 'heardFromOtherDetail',
    'certifiedINFOByAdminName'
  ]
};
```

This ensures `handleNext` validates only the fields belonging to the current step.

## Validation Rules

### Per-Step Validation (Steps 1-6)
- Triggered by: "ถัดไป" button only
- Validates: Only fields in `STEP_FIELDS[currentStep]`
- On error: Shows Thai error messages, stays on current step
- On success: Advances to next step

### No Validation
- "ย้อนกลับ" button: Never validates
- Stepper clicks: Never validate
- "บันทึกร่าง" button: Never validates

### Final Submit Validation (Step 7)
- Triggered by: "ส่งแบบฟอร์ม" button
- Validates: All fields via Zod schema
- Special check: `certifiedINFOByAdminName` must be checked
- On error: Shows Thai alert, stays on Step 7
- On success: Submits to API

## Button States

### Step 1
- "ย้อนกลับ": Disabled (`disabled={currentStep === 1}`)
- "บันทึกร่าง": Enabled
- "ถัดไป": Enabled

### Steps 2-6
- "ย้อนกลับ": Enabled
- "บันทึกร่าง": Enabled
- "ถัดไป": Enabled

### Step 7
- "ย้อนกลับ": Enabled
- "บันทึกร่าง": Enabled
- "ส่งแบบฟอร์ม": Replaces "ถัดไป", triggers final submit

## Files Modified

1. **Created:** `lib/constants/register69.steps.ts`
   - Step-to-fields mapping
   - Step titles (moved from wizard)

2. **Updated:** `components/forms/Register69Wizard.tsx`
   - Added `goToStep()` single source of truth function
   - Updated `handleNext()` with per-step validation
   - Updated `handleBack()` to use `goToStep()`
   - Updated `handleStepClick()` to use `goToStep()`
   - Added certification check in `onSubmit()`

## Confirmation Checklist

✅ **Next behaves exactly like clicking next step in stepper**
- Both call `goToStep(currentStep + 1)`
- Same navigation path
- Same scroll behavior

✅ **Back behaves exactly like clicking previous step**
- Both call `goToStep(currentStep - 1)`
- Same navigation path
- Same scroll behavior

✅ **Step 1 back disabled**
- `disabled={currentStep === 1}` on back button

✅ **Step 7 next triggers submit**
- Button label changes to "ส่งแบบฟอร์ม"
- Calls `form.handleSubmit(onSubmit)()`
- Validates `certifiedINFOByAdminName`

✅ **No field key/schema/payload changes**
- All field names unchanged
- Zod schema unchanged
- API payload structure unchanged

✅ **Form data persists across steps**
- React Hook Form maintains state
- No unmount/remount issues
- Draft save/restore works

## Testing Checklist

1. ✅ Click "ถัดไป" from Step 1 → Should go to Step 2 (same as clicking Step 2 circle)
2. ✅ Click "ย้อนกลับ" from Step 2 → Should go to Step 1 (same as clicking Step 1 circle)
3. ✅ Click Step 5 circle from Step 1 → Should jump to Step 5
4. ✅ Click "ถัดไป" without filling required fields → Should show errors and stay
5. ✅ Click "ย้อนกลับ" from any step → Should go back without validation
6. ✅ Click stepper circles → Should navigate without validation
7. ✅ On Step 1, "ย้อนกลับ" should be disabled
8. ✅ On Step 7, button should say "ส่งแบบฟอร์ม"
9. ✅ Submit without checking certification → Should show Thai error
10. ✅ Form data should persist when navigating between steps

## Result

Navigation is now consistent and predictable. All navigation paths (buttons and stepper) use the same `goToStep()` function, ensuring identical behavior.
