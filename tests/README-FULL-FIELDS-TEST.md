# Register100 Full Fields Test

## Overview

This comprehensive test suite validates that **ALL fields** in the register100 form are correctly filled and saved to MongoDB with **NO EMPTY FIELDS**.

## Test Files

### 1. `register100-full-fields.spec.ts`
Playwright test that:
- Fills **EVERY SINGLE FIELD** across all 8 steps
- Uploads images for manager and 4 teachers
- Adds multiple items to all array fields
- Submits the form
- Validates successful submission

### 2. `validate-all-fields-mongodb.js`
MongoDB validation script that:
- Retrieves the submitted data from MongoDB
- Validates **EVERY FIELD** is present and not empty
- Checks all array fields have items
- Validates score calculations
- Provides detailed field-by-field report
- Shows completion rate percentage

## Prerequisites

1. **MongoDB** running on `localhost:27017`
2. **Next.js dev server** running on `http://localhost:3000`
3. **Test images** in `test-assets/` folder:
   - `manager-photo.jpg`
   - `teacher1-photo.jpg`
   - `teacher2-photo.jpg`
   - `teacher3-photo.jpg`
   - `teacher4-photo.jpg`

## Running the Tests

### Step 1: Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### Step 2: Start Next.js Dev Server
```bash
npm run dev
```

### Step 3: Run the Playwright Test
```bash
# Run the full fields test
npx playwright test tests/register100-full-fields.spec.ts --headed

# Or run in headless mode
npx playwright test tests/register100-full-fields.spec.ts
```

### Step 4: Validate Data in MongoDB
```bash
# Run the validation script
node tests/validate-all-fields-mongodb.js
```

## Expected Results

### Playwright Test Output
```
📝 Step 1: Basic Information
📝 Step 2: School Administrator
📝 Step 3: Teaching Plan
📝 Step 4: Thai Music Teachers
📝 Step 5: Support Factors and Awards
📝 Step 6: Photos and Videos
📝 Step 7: Activities
📝 Step 8: PR and Other Information
🚀 Submitting form with ALL fields filled...
✅ Form submitted successfully!
```

### MongoDB Validation Output
```
================================================================================
VALIDATION SUMMARY
================================================================================
Total Fields Checked: 150+
Filled Fields: 150+
Empty Fields: 0
Completion Rate: 100.00%

✅ ALL FIELDS VALIDATED SUCCESSFULLY!
✅ 100% FIELD COMPLETION!
```

### Expected Score Breakdown
```
Teacher Training Score: 20 / 20  (4 checkboxes checked)
Teacher Qualification Score: 20 / 20  (4 unique teacher types)
Support from Org Score: 5 / 5  (checkbox checked)
Support from External Score: 15 / 15  (3+ external supporters)
Award Score: 20 / 20  (ประเทศ level award)
Activity Internal Score: 5 / 5  (4 internal activities)
Activity External Score: 5 / 5  (4 external activities)
Activity Outside Score: 5 / 5  (4 outside activities)
PR Activity Score: 5 / 5  (4 PR activities)
TOTAL SCORE: 100 / 100
```

## Test Data Summary

### Step 1: Basic Information
- School name, province, level, affiliation
- Staff count: 75
- Student count: 850
- Complete address with all fields
- Phone and fax numbers

### Step 2: School Administrator
- Full name, position, phone, address, email
- Manager photo uploaded

### Step 3: Teaching Plan
- 3 music type entries with grades and details
- 5 instrument entries with quantities and notes

### Step 4: Thai Music Teachers
- 4 teachers with different qualifications
- All 4 teacher photos uploaded
- All 4 training checkboxes checked
- 3 in-class instruction duration entries
- 3 out-of-class instruction duration entries
- Teaching location description

### Step 5: Support Factors and Awards
- 2 support factor entries
- 2 organization support entries
- 3 external support entries
- Curriculum framework, learning outcomes, management context
- 3 awards (ประเทศ, ภาค, จังหวัด)

### Step 6: Photos and Videos
- Photo gallery link
- Video link

### Step 7: Activities
- 4 internal activities
- 4 external activities
- 4 outside province activities

### Step 8: PR and Other Information
- 4 PR activities
- All information sources checked
- Obstacles and suggestions filled
- Certification checkbox checked

## Troubleshooting

### Test Images Not Found
Create dummy images in `test-assets/` folder:
```bash
mkdir -p test-assets
# Add your test images or create dummy ones
```

### MongoDB Connection Error
Check MongoDB is running:
```bash
mongosh
# Should connect successfully
```

### Form Submission Timeout
Increase timeout in test file if needed:
```typescript
test.setTimeout(300000); // 5 minutes
```

## Notes

- This test fills **100% of all fields** - no empty fields allowed
- All array fields have multiple items (3-5 items each)
- All images are uploaded
- Expected score: **100/100 points**
- Validation script checks every single field
- Any empty field will be reported in the validation output

## Comparison with Other Tests

### `register100-scenarios.spec.ts`
- Tests 3 different score scenarios (100, 50, 0 points)
- Some fields intentionally left empty
- Focus on score calculation validation

### `register100-full-fields.spec.ts` (THIS TEST)
- Tests **100% field completion**
- **NO EMPTY FIELDS** allowed
- Focus on data completeness validation
- Validates all data is correctly saved to MongoDB

