## Core Test Algorithms

### Algorithm 1: Consent Modal Handling

```pascal
ALGORITHM handleConsentModal
INPUT: page (Playwright Page object)
OUTPUT: boolean (success status)

BEGIN
  // Wait for page to load
  WAIT FOR page.domContentLoaded
  WAIT 2000 milliseconds
  
  // Check if consent modal is visible
  consentModal ← LOCATE element with testid "consent-modal"
  isVisible ← CHECK consentModal.isVisible WITH timeout 5000ms
  
  IF isVisible = true THEN
    acceptButton ← LOCATE element with testid "btn-consent-accept"
    CLICK acceptButton
    WAIT FOR consentModal to be hidden WITH timeout 5000ms
    LOG "✅ Consent modal closed"
    RETURN true
  ELSE
    LOG "ℹ️ Consent modal not shown"
    RETURN true
  END IF
END
```

**Preconditions:**
- Page is loaded at /regist-support
- Playwright page object is initialized

**Postconditions:**
- Consent modal is closed if it was visible
- Form is ready for interaction

### Algorithm 2: Step Validation Test

```pascal
ALGORITHM testStepValidation
INPUT: page, stepNumber, requiredFields[]
OUTPUT: validationResult (boolean)

BEGIN
  LOG "🧪 Testing Step " + stepNumber + " validation"
  
  // Try to proceed without filling required fields
  nextButton ← LOCATE button with text "ถัดไป"
  CLICK nextButton
  WAIT 1000 milliseconds
  
  // Check if validation modal appears
  validationModal ← LOCATE text "กรุณากรอกข้อมูลให้ครบถ้วน"
  isModalVisible ← CHECK validationModal.isVisible WITH timeout 3000ms
  
  IF isModalVisible = true THEN
    LOG "✅ Validation modal appeared for Step " + stepNumber
    
    // Close modal
    okButton ← LOCATE button with text "ตกลง"
    CLICK okButton
    WAIT 500 milliseconds
    
    // Verify still on same step
    stepIndicator ← LOCATE element with testid "step-" + stepNumber
    isStillOnStep ← CHECK stepIndicator.isVisible
    
    ASSERT isStillOnStep = true
    LOG "✅ Still on Step " + stepNumber + " after validation"
    
    RETURN true
  ELSE
    LOG "❌ Validation modal did not appear"
    RETURN false
  END IF
END
```

**Preconditions:**
- User is on the specified step
- Required fields are not filled
- Form is in valid state

**Postconditions:**
- Validation modal is shown and closed
- User remains on the same step
- No data is lost

**Loop Invariants:** N/A

### Algorithm 3: Fill Minimal Step Data

```pascal
ALGORITHM fillMinimalStepData
INPUT: page, stepNumber
OUTPUT: success (boolean)

BEGIN
  CASE stepNumber OF
    1:
      FILL input[name="schoolName"] WITH "โรงเรียนทดสอบ"
      SELECT option "กรุงเทพมหานคร" IN select[name="schoolProvince"]
      SELECT option "ประถมศึกษา" IN select[name="schoolLevel"]
      
    2:
      FILL input[name="mgtFullName"] WITH "นายทดสอบ"
      FILL input[name="mgtPosition"] WITH "ผู้อำนวยการ"
      FILL input[name="mgtPhone"] WITH "0812345678"
      
    3:
      // No required fields - can skip
      
    4:
      // No required fields - can skip
      
    5:
      // No required fields - can skip
      
    6:
      // No required fields - can skip
      
    7:
      // No required fields - can skip
      
    8:
      // Certification checkbox is required but tested separately
      
  END CASE
  
  RETURN true
END
```

**Preconditions:**
- Page is loaded and on the correct step
- Form elements are accessible

**Postconditions:**
- Minimal required data is filled for the step
- Form can proceed to next step

### Algorithm 4: Missing Fields Modal Test

```pascal
ALGORITHM testMissingFieldsModal
INPUT: page
OUTPUT: testResult (boolean)

BEGIN
  LOG "🧪 Testing Missing Fields Modal"
  
  // Fill Steps 1-2 with required fields
  CALL fillMinimalStepData(page, 1)
  CLICK button "ถัดไป"
  WAIT 1000 milliseconds
  
  CALL fillMinimalStepData(page, 2)
  CLICK button "ถัดไป"
  WAIT 1000 milliseconds
  
  // Navigate through Steps 3-7 without filling
  FOR step FROM 3 TO 7 DO
    CLICK button "ถัดไป"
    WAIT 1000 milliseconds
  END FOR
  
  // Now on Step 8 - DON'T check certification checkbox
  certCheckbox ← LOCATE input[name="certifiedINFOByAdminName"]
  isChecked ← CHECK certCheckbox.isChecked
  
  IF isChecked = true THEN
    UNCHECK certCheckbox
    WAIT 500 milliseconds
    LOG "✅ Unchecked certification checkbox"
  END IF
  
  // Try to submit without certification
  submitButton ← LOCATE button with text "ส่งแบบฟอร์ม"
  CLICK submitButton
  WAIT 2000 milliseconds
  
  // Check if missing fields modal appears
  missingModal ← LOCATE text "กรุณากรอกข้อมูลให้ครบถ้วน"
  isModalVisible ← CHECK missingModal.isVisible WITH timeout 5000ms
  
  IF isModalVisible = true THEN
    LOG "✅ Missing fields modal appeared"
    
    // Check if modal shows Step 8 certification message
    modalContent ← GET text content from ".bg-red-50"
    containsStep8 ← CHECK modalContent CONTAINS "Step 8"
    
    ASSERT containsStep8 = true
    LOG "✅ Modal shows Step 8 certification message"
    
    // Close modal
    okButton ← LOCATE button with text "ตกลง"
    CLICK okButton
    WAIT 500 milliseconds
    
    RETURN true
  ELSE
    LOG "❌ Missing fields modal did not appear"
    RETURN false
  END IF
END
```

**Preconditions:**
- Form is loaded and consent modal is closed
- User can navigate through all steps
- Certification checkbox exists in Step 8

**Postconditions:**
- Missing fields modal is shown with correct message
- Modal is closed
- Form remains on Step 8
- No submission occurs

**Loop Invariants:**
- For navigation loop: Each step transition is successful
- Form state remains consistent throughout navigation

### Algorithm 5: Successful Submission Test

```pascal
ALGORITHM testSuccessfulSubmission
INPUT: page
OUTPUT: success (boolean)

BEGIN
  LOG "🧪 Testing Successful Submission"
  
  // Fill all required fields
  // Step 1
  CALL fillMinimalStepData(page, 1)
  CLICK button "ถัดไป"
  WAIT 1000 milliseconds
  
  // Step 2
  CALL fillMinimalStepData(page, 2)
  CLICK button "ถัดไป"
  WAIT 1000 milliseconds
  
  // Steps 3-7 (no required fields)
  FOR step FROM 3 TO 7 DO
    CLICK button "ถัดไป"
    WAIT 1000 milliseconds
  END FOR
  
  // Step 8 - CHECK certification checkbox
  LOG "✅ Checking certification checkbox"
  certCheckbox ← LOCATE input[name="certifiedINFOByAdminName"]
  CHECK certCheckbox
  WAIT 500 milliseconds
  
  // Submit form
  submitButton ← LOCATE button with text "ส่งแบบฟอร์ม"
  CLICK submitButton
  WAIT 5000 milliseconds
  
  // Check for success modal
  successModal ← LOCATE element with testid "btn-success-close"
  isSuccessVisible ← CHECK successModal.isVisible WITH timeout 10000ms
  
  IF isSuccessVisible = true THEN
    LOG "✅✅✅ Success modal appeared!"
    
    // Take screenshot
    TAKE screenshot "successful-submission.png"
    
    // Close success modal
    CLICK successModal
    WAIT 1000 milliseconds
    
    RETURN true
  ELSE
    // Check if missing fields modal appeared instead
    missingModal ← LOCATE text "กรุณากรอกข้อมูลให้ครบถ้วน"
    isMissingVisible ← CHECK missingModal.isVisible WITH timeout 3000ms
    
    IF isMissingVisible = true THEN
      LOG "❌ Missing fields modal appeared instead of success"
      modalContent ← GET text content from ".bg-red-50"
      LOG "📋 Missing fields: " + modalContent
      
      TAKE screenshot "unexpected-missing-fields.png"
    END IF
    
    RETURN false
  END IF
END
```

**Preconditions:**
- Form is loaded and consent modal is closed
- All required fields can be filled
- API endpoint /api/register-support is available
- Database is accessible

**Postconditions:**
- If successful: Success modal is shown, data is saved to database
- If failed: Missing fields modal is shown with error details
- Screenshot is taken for debugging

**Loop Invariants:**
- For navigation loop: Each step transition is successful
- All filled data is preserved during navigation
