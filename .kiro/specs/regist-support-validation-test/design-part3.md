## Test Cases

### Test Case 1: Step 1 Validation Modal
**Purpose:** Verify validation modal appears when clicking "ถัดไป" without filling Step 1 required fields

**Steps:**
1. Navigate to /regist-support
2. Close consent modal
3. Click "ถัดไป" button without filling any fields
4. Verify validation modal appears with text "กรุณากรอกข้อมูลให้ครบถ้วน"
5. Click "ตกลง" to close modal
6. Verify still on Step 1

**Expected Result:** Validation modal appears and user remains on Step 1

### Test Case 2: Step 2 Validation Modal
**Purpose:** Verify validation modal appears when clicking "ถัดไป" without filling Step 2 required fields

**Steps:**
1. Fill Step 1 minimal required fields (schoolName, schoolProvince, schoolLevel)
2. Click "ถัดไป" to go to Step 2
3. Click "ถัดไป" without filling Step 2 fields
4. Verify validation modal appears
5. Close modal
6. Verify still on Step 2

**Expected Result:** Validation modal appears and user remains on Step 2

### Test Case 3: Steps 3-7 Navigation
**Purpose:** Verify Steps 3-7 can be navigated without required field validation

**Steps:**
1. Fill Steps 1-2 with minimal data
2. Navigate through Steps 3-7 by clicking "ถัดไป"
3. Verify no validation modals appear
4. Verify reaching Step 8

**Expected Result:** All steps can be navigated without validation errors

### Test Case 4: Missing Fields Modal - Unchecked Certification
**Purpose:** Verify missing fields modal appears when submitting without checking certification checkbox

**Steps:**
1. Fill Steps 1-2 with minimal required data
2. Navigate through Steps 3-7
3. On Step 8, ensure certification checkbox is NOT checked
4. Click "ส่งแบบฟอร์ม"
5. Verify missing fields modal appears
6. Verify modal content mentions "Step 8" and certification
7. Close modal

**Expected Result:** Missing fields modal appears with Step 8 certification message

### Test Case 5: Missing Fields Modal - Empty Required Fields
**Purpose:** Verify missing fields modal shows all missing required fields

**Steps:**
1. Navigate to Step 8 without filling any fields
2. Check certification checkbox
3. Click "ส่งแบบฟอร์ม"
4. Verify missing fields modal appears
5. Verify modal lists: "ชื่อสถานศึกษา (Step 1)", "จังหวัด (Step 1)", "ระดับสถานศึกษา (Step 1)", "ชื่อ-นามสกุล ผู้บริหาร (Step 2)", "ตำแหน่ง ผู้บริหาร (Step 2)", "เบอร์โทรศัพท์ ผู้บริหาร (Step 2)"
6. Close modal

**Expected Result:** Missing fields modal shows complete list of missing required fields

### Test Case 6: Successful Submission
**Purpose:** Verify form submits successfully when all required fields are filled

**Steps:**
1. Fill Step 1: schoolName, schoolProvince, schoolLevel
2. Fill Step 2: mgtFullName, mgtPosition, mgtPhone
3. Navigate through Steps 3-7
4. On Step 8, check certification checkbox
5. Click "ส่งแบบฟอร์ม"
6. Wait for submission
7. Verify success modal appears (testid="btn-success-close")
8. Take screenshot
9. Close success modal

**Expected Result:** Success modal appears, data is saved to database

### Test Case 7: Email Validation
**Purpose:** Verify email field validation in Step 2

**Steps:**
1. Fill Step 1 minimal data
2. Go to Step 2
3. Fill mgtFullName, mgtPosition, mgtPhone
4. Fill mgtEmail with invalid email (e.g., "invalid-email")
5. Try to proceed
6. Verify validation error appears

**Expected Result:** Email validation error is shown

### Test Case 8: Step Navigation Persistence
**Purpose:** Verify data persists when navigating back and forth between steps

**Steps:**
1. Fill Step 1 with data
2. Go to Step 2
3. Fill Step 2 with data
4. Click "ย้อนกลับ" to go back to Step 1
5. Verify Step 1 data is still filled
6. Go forward to Step 2
7. Verify Step 2 data is still filled

**Expected Result:** All filled data persists during navigation

### Test Case 9: Consent Modal Auto-Close
**Purpose:** Verify consent modal appears and can be closed

**Steps:**
1. Navigate to /regist-support
2. Wait for consent modal to appear
3. Verify consent modal is visible (testid="consent-modal")
4. Click accept button (testid="btn-consent-accept")
5. Verify modal is hidden
6. Verify form is accessible

**Expected Result:** Consent modal appears and closes properly

### Test Case 10: Image Upload Validation
**Purpose:** Verify image upload size and type validation

**Steps:**
1. Navigate to Step 2
2. Try to upload image > 1MB
3. Verify error message appears
4. Try to upload non-image file
5. Verify error message appears
6. Upload valid image (< 1MB, jpg/png)
7. Verify image is accepted

**Expected Result:** Invalid images are rejected, valid images are accepted

## Helper Functions

### Function: fillStep1Minimal()
```typescript
async function fillStep1Minimal(page: Page) {
  await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ');
  await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
  await page.selectOption('select[name="schoolLevel"]', 'ประถมศึกษา');
}
```

### Function: fillStep2Minimal()
```typescript
async function fillStep2Minimal(page: Page) {
  await page.fill('input[name="mgtFullName"]', 'นายทดสอบ');
  await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
  await page.fill('input[name="mgtPhone"]', '0812345678');
}
```

### Function: navigateToStep()
```typescript
async function navigateToStep(page: Page, targetStep: number) {
  const currentStep = await getCurrentStep(page);
  
  if (currentStep < targetStep) {
    for (let i = currentStep; i < targetStep; i++) {
      await page.getByRole('button', { name: 'ถัดไป' }).click();
      await page.waitForTimeout(1000);
    }
  } else if (currentStep > targetStep) {
    for (let i = currentStep; i > targetStep; i--) {
      await page.getByRole('button', { name: 'ย้อนกลับ' }).click();
      await page.waitForTimeout(1000);
    }
  }
}
```

### Function: closeConsentModal()
```typescript
async function closeConsentModal(page: Page) {
  const consentModal = page.locator('[data-testid="consent-modal"]');
  const isVisible = await consentModal.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (isVisible) {
    const acceptButton = page.locator('[data-testid="btn-consent-accept"]');
    await acceptButton.click();
    await consentModal.waitFor({ state: 'hidden', timeout: 5000 });
    console.log('✅ Consent modal closed');
  }
}
```

### Function: verifyValidationModal()
```typescript
async function verifyValidationModal(page: Page): Promise<boolean> {
  const validationModal = page.locator('text=กรุณากรอกข้อมูลให้ครบถ้วน');
  const isVisible = await validationModal.isVisible({ timeout: 3000 }).catch(() => false);
  
  if (isVisible) {
    await page.locator('button:has-text("ตกลง")').click();
    await page.waitForTimeout(500);
    return true;
  }
  
  return false;
}
```

### Function: verifyMissingFieldsModal()
```typescript
async function verifyMissingFieldsModal(page: Page, expectedFields: string[]): Promise<boolean> {
  const missingModal = page.locator('text=กรุณากรอกข้อมูลให้ครบถ้วน');
  const isVisible = await missingModal.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (!isVisible) return false;
  
  const modalContent = await page.locator('.bg-red-50').textContent();
  
  for (const field of expectedFields) {
    if (!modalContent?.includes(field)) {
      console.log(`❌ Missing field not found in modal: ${field}`);
      return false;
    }
  }
  
  await page.locator('button:has-text("ตกลง")').click();
  await page.waitForTimeout(500);
  
  return true;
}
```

## Correctness Properties

### Property 1: Validation Modal Consistency
**Statement:** ∀ step ∈ Steps, ∀ requiredFields ∈ step.requiredFields: 
  IF requiredFields are not filled THEN validation modal appears

**Test:** For each step with required fields, attempt to proceed without filling them and verify modal appears

### Property 2: Data Persistence
**Statement:** ∀ data ∈ FormData, ∀ navigation ∈ NavigationActions:
  data.value(before_navigation) = data.value(after_navigation)

**Test:** Fill fields, navigate away and back, verify data is unchanged

### Property 3: Certification Requirement
**Statement:** ∀ submission ∈ SubmissionAttempts:
  submission.success = true ⟺ certifiedINFOByAdminName = true ∧ allRequiredFields.filled = true

**Test:** Attempt submission with and without certification checkbox, verify behavior

### Property 4: Modal Closure Idempotence
**Statement:** ∀ modal ∈ Modals:
  close(modal) ⟹ modal.visible = false ∧ form.state = unchanged

**Test:** Close modals and verify form state is preserved

### Property 5: Step Progression
**Statement:** ∀ step ∈ Steps:
  canProceed(step) ⟺ (step.requiredFields.allFilled = true) ∨ (step.requiredFields = ∅)

**Test:** Verify steps with no required fields can be skipped, steps with required fields cannot

## Testing Strategy

### Unit Testing Approach
- Test individual validation functions
- Test modal component rendering
- Test form state management
- Test helper functions

### Property-Based Testing Approach
**Property Test Library:** fast-check (for TypeScript/JavaScript)

**Properties to Test:**
1. Any combination of filled/unfilled required fields produces consistent validation
2. Navigation sequence always preserves data
3. Modal appearance is deterministic based on form state

### Integration Testing Approach
- Test complete user flows from start to finish
- Test API integration with form submission
- Test database persistence
- Test error handling and recovery

## Performance Considerations
- Form should load within 2 seconds
- Step transitions should be smooth (< 500ms)
- Validation should be instant (< 100ms)
- Modal animations should not block interaction

## Security Considerations
- Validate all inputs on both client and server
- Sanitize file uploads
- Prevent XSS in text fields
- Rate limit form submissions
- Validate email format
- Secure file storage for uploaded images

## Dependencies
- Playwright (E2E testing framework)
- @playwright/test (test runner)
- TypeScript (type safety)
- React Hook Form (form management)
- Zod (schema validation)
- Next.js (framework)
- MongoDB (database)
