# 🧪 Navigation Testing Guide

## Quick Test Scenarios

### Test 1: Next Button = Stepper Click
**Goal:** Verify "ถัดไป" behaves exactly like clicking next stepper circle

1. Go to Step 1
2. Fill in required field: "ชื่อสถานศึกษา" (schoolName)
3. Click "ถัดไป" button → Should go to Step 2
4. Go back to Step 1
5. Click Step 2 circle in stepper → Should go to Step 2
6. **Expected:** Both methods should produce identical navigation

### Test 2: Back Button = Stepper Click
**Goal:** Verify "ย้อนกลับ" behaves exactly like clicking previous stepper circle

1. Navigate to Step 3
2. Click "ย้อนกลับ" button → Should go to Step 2
3. Navigate to Step 3 again
4. Click Step 2 circle in stepper → Should go to Step 2
5. **Expected:** Both methods should produce identical navigation

### Test 3: Validation on Next Only
**Goal:** Verify validation only happens on "ถัดไป", not on stepper clicks

1. Go to Step 1
2. Leave "ชื่อสถานศึกษา" empty (required field)
3. Click "ถัดไป" → Should show error "กรุณากรอกชื่อสถานศึกษา" and stay on Step 1
4. Click Step 2 circle in stepper → Should navigate to Step 2 (no validation)
5. **Expected:** Stepper allows free navigation, "ถัดไป" validates

### Test 4: No Validation on Back
**Goal:** Verify "ย้อนกลับ" never validates

1. Go to Step 2
2. Leave all fields empty (mgtFullName, mgtPosition, mgtPhone are required)
3. Click "ย้อนกลับ" → Should go to Step 1 without showing errors
4. **Expected:** Back button never validates

### Test 5: Step 1 Back Disabled
**Goal:** Verify back button is disabled on Step 1

1. Go to Step 1
2. Check "ย้อนกลับ" button
3. **Expected:** Button should be disabled (grayed out, not clickable)

### Test 6: Step 7 Submit Button
**Goal:** Verify Step 7 shows submit button instead of next

1. Navigate to Step 7
2. Check button text
3. **Expected:** Should say "ส่งแบบฟอร์ม" not "ถัดไป"

### Test 7: Certification Required
**Goal:** Verify certification checkbox is required for submission

1. Navigate to Step 7
2. Leave "ข้าพเจ้ารับรองว่าข้อมูลที่กรอกทั้งหมดเป็นความจริง" unchecked
3. Click "ส่งแบบฟอร์ม"
4. **Expected:** Should show alert "กรุณายืนยันความถูกต้องของข้อมูล" and stay on Step 7

### Test 8: Form Data Persistence
**Goal:** Verify form data persists across navigation

1. Go to Step 1
2. Fill in "ชื่อสถานศึกษา" with "โรงเรียนทดสอบ"
3. Click "ถัดไป" to Step 2
4. Fill in "ชื่อ-นามสกุล" with "ทดสอบ ผู้บริหาร"
5. Click "ย้อนกลับ" to Step 1
6. **Expected:** "ชื่อสถานศึกษา" should still show "โรงเรียนทดสอบ"
7. Click Step 2 circle
8. **Expected:** "ชื่อ-นามสกุล" should still show "ทดสอบ ผู้บริหาร"

### Test 9: Draft Save/Restore
**Goal:** Verify draft functionality works with navigation

1. Go to Step 1, fill some data
2. Navigate to Step 3, fill some data
3. Click "บันทึกร่าง"
4. **Expected:** Should show alert "บันทึกร่างเรียบร้อยแล้ว"
5. Refresh page
6. **Expected:** Should show restore modal
7. Click "กู้คืนข้อมูล"
8. Navigate to Step 1 and Step 3
9. **Expected:** All filled data should be restored

### Test 10: Free Stepper Navigation
**Goal:** Verify stepper allows jumping to any step

1. Start at Step 1
2. Click Step 7 circle → Should jump to Step 7
3. Click Step 3 circle → Should jump to Step 3
4. Click Step 1 circle → Should jump to Step 1
5. **Expected:** All jumps should work without validation

## Per-Step Validation Fields

### Step 1 Required Fields
- ชื่อสถานศึกษา (schoolName) *
- ระดับการศึกษา (schoolLevel) *

### Step 2 Required Fields
- ชื่อ-นามสกุล (mgtFullName) *
- ตำแหน่ง (mgtPosition) *
- เบอร์โทรศัพท์ (mgtPhone) *

### Steps 3-6
- No required fields (arrays and optional text fields)

### Step 7 Required Fields
- การรับรองข้อมูล checkbox (certifiedINFOByAdminName) *

## Expected Behavior Summary

| Action | Validation | Navigation | Data Persistence |
|--------|-----------|------------|------------------|
| Click "ถัดไป" | ✅ Current step only | ✅ If valid | ✅ Yes |
| Click "ย้อนกลับ" | ❌ Never | ✅ Always | ✅ Yes |
| Click stepper circle | ❌ Never | ✅ Always | ✅ Yes |
| Click "บันทึกร่าง" | ❌ Never | ❌ Stays | ✅ Saves to localStorage |
| Click "ส่งแบบฟอร์ม" (Step 7) | ✅ Full form | ❌ Only on success | ✅ Clears on success |

## Common Issues to Check

1. ❌ "ถัดไป" doesn't advance → Check if required fields are filled
2. ❌ Stepper doesn't work → Check browser console for errors
3. ❌ Data disappears → Check if form is unmounting/remounting
4. ❌ Validation errors don't show → Check if Thai error messages are in schema
5. ❌ Can't submit on Step 7 → Check if certification checkbox is checked

## Success Criteria

✅ All 10 test scenarios pass
✅ Navigation is consistent between buttons and stepper
✅ Validation only blocks "ถัดไป", not other navigation
✅ Form data persists across all navigation methods
✅ Draft save/restore works correctly
✅ No console errors during navigation
✅ Smooth scroll to top on every navigation
✅ Stepper visual state updates correctly

## Browser Testing

Test in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if available)

Test on:
- ✅ Desktop (1920x1080)
- ✅ Tablet (768px)
- ✅ Mobile (375px)

## Performance Check

- Navigation should be instant (< 100ms)
- Validation should complete quickly (< 500ms)
- Smooth scroll should be smooth (not janky)
- No memory leaks on repeated navigation

## Accessibility Check

- Tab through form fields
- Use Enter key to submit
- Screen reader should announce step changes
- Focus should be managed on navigation

---

**Current Status:** ✅ All navigation logic implemented and ready for testing

**Test URL:** http://localhost:3000/register-69
