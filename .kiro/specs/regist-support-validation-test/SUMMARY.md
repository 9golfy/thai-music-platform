# Regist-Support Validation Test Specification

## Overview
Comprehensive validation test specification สำหรับฟอร์ม regist-support ที่ http://localhost:3000/regist-support

## Feature Name
`regist-support-validation-test`

## Design Artifacts
- **High-Level Design:** System diagrams, test flow, และ components ที่เกี่ยวข้อง ✅
- **Low-Level Design:** Test cases รายละเอียด, code structure, และ helper functions ✅

## Documents Created
1. **design.md** - Main design document with overview, test flow diagram, and form structure
2. **design-part2.md** - Core test algorithms with formal specifications (preconditions, postconditions, loop invariants)
3. **design-part3.md** - Test cases, helper functions, correctness properties, and testing strategy

## Key Components

### Form Structure (8 Steps)
1. **Step 1:** ข้อมูลพื้นฐาน (schoolName*, schoolProvince*, schoolLevel*)
2. **Step 2:** ผู้บริหารสถานศึกษา (mgtFullName*, mgtPosition*, mgtPhone*)
3. **Step 3:** ความพร้อมในการส่งเสริม (optional)
4. **Step 4:** ผู้สอนดนตรีไทย (optional)
5. **Step 5:** ปัจจัยที่เกี่ยวข้อง (optional)
6. **Step 6:** ภาพถ่ายและวีดิโอ (optional)
7. **Step 7:** การเผยแพร่ (optional)
8. **Step 8:** การประชาสัมพันธ์และการรับรอง (certifiedINFOByAdminName* - REQUIRED)

### Modals
- **ConsentModal** - แสดงเมื่อเปิดฟอร์มครั้งแรก
- **ValidationErrorModal** - แสดงเมื่อกด "ถัดไป" โดยไม่กรอกข้อมูลครบ
- **MissingFieldsModal** - แสดงเมื่อกด "ส่งแบบฟอร์ม" โดยไม่กรอกข้อมูลครบ
- **SuccessModal** - แสดงเมื่อส่งฟอร์มสำเร็จ

## Test Cases (10 Cases)

### Validation Tests
1. **Test 1:** Step 1 Validation Modal
2. **Test 2:** Step 2 Validation Modal
3. **Test 3:** Steps 3-7 Navigation (no validation)
4. **Test 4:** Missing Fields Modal - Unchecked Certification
5. **Test 5:** Missing Fields Modal - Empty Required Fields
6. **Test 7:** Email Validation

### Functional Tests
7. **Test 6:** Successful Submission
8. **Test 8:** Step Navigation Persistence
9. **Test 9:** Consent Modal Auto-Close
10. **Test 10:** Image Upload Validation

## Core Algorithms

### Algorithm 1: handleConsentModal
- Handles consent modal appearance and closure
- Preconditions: Page loaded at /regist-support
- Postconditions: Modal closed, form ready

### Algorithm 2: testStepValidation
- Tests validation modal for each step
- Preconditions: On specified step, required fields not filled
- Postconditions: Modal shown and closed, user remains on step

### Algorithm 3: fillMinimalStepData
- Fills minimal required data for each step
- Preconditions: Page on correct step
- Postconditions: Minimal data filled, can proceed

### Algorithm 4: testMissingFieldsModal
- Tests missing fields modal on submission
- Preconditions: Form loaded, can navigate to Step 8
- Postconditions: Modal shown with correct message
- Loop Invariants: Each step transition successful, form state consistent

### Algorithm 5: testSuccessfulSubmission
- Tests successful form submission
- Preconditions: All required fields can be filled, API available
- Postconditions: Success modal shown, data saved
- Loop Invariants: All filled data preserved during navigation

## Helper Functions
- `fillStep1Minimal()` - Fill Step 1 required fields
- `fillStep2Minimal()` - Fill Step 2 required fields
- `navigateToStep()` - Navigate to specific step
- `closeConsentModal()` - Close consent modal
- `verifyValidationModal()` - Verify and close validation modal
- `verifyMissingFieldsModal()` - Verify missing fields modal content

## Correctness Properties

### Property 1: Validation Modal Consistency
∀ step ∈ Steps, ∀ requiredFields ∈ step.requiredFields: 
IF requiredFields are not filled THEN validation modal appears

### Property 2: Data Persistence
∀ data ∈ FormData, ∀ navigation ∈ NavigationActions:
data.value(before_navigation) = data.value(after_navigation)

### Property 3: Certification Requirement
∀ submission ∈ SubmissionAttempts:
submission.success = true ⟺ certifiedINFOByAdminName = true ∧ allRequiredFields.filled = true

### Property 4: Modal Closure Idempotence
∀ modal ∈ Modals:
close(modal) ⟹ modal.visible = false ∧ form.state = unchanged

### Property 5: Step Progression
∀ step ∈ Steps:
canProceed(step) ⟺ (step.requiredFields.allFilled = true) ∨ (step.requiredFields = ∅)

## Testing Strategy

### Unit Testing
- Individual validation functions
- Modal component rendering
- Form state management
- Helper functions

### Property-Based Testing
- Library: fast-check
- Test validation consistency
- Test data persistence
- Test modal behavior determinism

### Integration Testing
- Complete user flows
- API integration
- Database persistence
- Error handling

## Implementation Notes

### Based on register100-complete-validation-test.spec.ts
- Similar multi-step form structure
- Same modal components pattern
- Consistent validation approach
- Reusable helper functions

### Key Differences from register100
- 8 steps instead of 8 steps (same)
- Different required fields per step
- Additional optional fields
- Different scoring system (not tested in validation)

### Test File Location
`tests/regist-support-complete-validation-test.spec.ts`

### Test Execution
```bash
# Run all validation tests
npx playwright test regist-support-complete-validation-test

# Run specific test
npx playwright test regist-support-complete-validation-test -g "Test 1"

# Run with UI
npx playwright test regist-support-complete-validation-test --ui

# Debug mode
npx playwright test regist-support-complete-validation-test --debug
```

## Dependencies
- Playwright ^1.40.0
- @playwright/test ^1.40.0
- TypeScript ^5.0.0
- React Hook Form ^7.48.0
- Zod ^3.22.0
- Next.js ^14.0.0
- MongoDB ^6.0.0

## Performance Requirements
- Form load: < 2 seconds
- Step transitions: < 500ms
- Validation: < 100ms
- Modal animations: non-blocking

## Security Requirements
- Client and server validation
- File upload sanitization
- XSS prevention
- Rate limiting
- Email format validation
- Secure file storage

## Next Steps
1. Review and approve design document
2. Implement test file based on design
3. Run tests and verify all cases pass
4. Document any edge cases found
5. Add to CI/CD pipeline

## References
- Original test: `tests/register100-complete-validation-test.spec.ts`
- Form component: `components-regist-support/forms/RegisterSupportWizard.tsx`
- Schema: `lib/validators/registerSupport.schema.ts`
- Modal components: `components-regist-support/ui/`
