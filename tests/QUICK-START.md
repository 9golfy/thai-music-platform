# Quick Start - Full Fields Test

## ✅ Prerequisites Check

The test images already exist in `test-assets/`:
- ✅ `manager.jpg`
- ✅ `teacher1.jpg`
- ✅ `teacher2.jpg`

You're ready to run the test!

## 🚀 Run the Test (3 Simple Steps)

### Step 1: Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### Step 2: Start Dev Server
```bash
# In another terminal
npm run dev
```

### Step 3: Run Test & Validate
```bash
# Run the Playwright test
npx playwright test tests/register100-full-fields.spec.ts --headed

# After test completes, validate data in MongoDB
node tests/validate-all-fields-mongodb.js
```

## 📊 What to Expect

### During Test (2-3 minutes)
```
🎯 FULL FIELDS TEST: Filling ALL fields with data
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

### After Validation
```
================================================================================
VALIDATION SUMMARY
================================================================================
Total Fields Checked: 150+
Filled Fields: 150+
Empty Fields: 0
Completion Rate: 100.00%

TOTAL SCORE: 100 / 100

✅ ALL FIELDS VALIDATED SUCCESSFULLY!
✅ 100% FIELD COMPLETION!
```

## 🎯 What This Test Does

1. ✅ Fills **ALL 150+ fields** across 8 steps
2. ✅ Uploads **5 images** (manager + 4 teachers)
3. ✅ Adds **multiple items** to all array fields
4. ✅ Validates **100% field completion**
5. ✅ Checks **all data saved to MongoDB**
6. ✅ Verifies **score calculation (100/100)**

## 📝 Test Data Summary

- **School**: โรงเรียนทดสอบครบทุกฟิลด์
- **Students**: 850
- **Teachers**: 4 (with photos)
- **Instruments**: 5 types
- **Activities**: 12 total (4+4+4)
- **Awards**: 3 (ประเทศ, ภาค, จังหวัด)
- **PR Activities**: 4
- **Score**: 100/100 points

## 🔍 Verify in MongoDB

```bash
# Connect to MongoDB
mongosh

# Switch to database
use thai_music_school

# Find the submission
db.register100_submissions.findOne(
  { schoolName: "โรงเรียนทดสอบครบทุกฟิลด์" },
  { schoolName: 1, total_score: 1, createdAt: 1 }
)

# Count total submissions
db.register100_submissions.countDocuments()
```

## 📚 More Information

- Full documentation: `tests/README-FULL-FIELDS-TEST.md`
- Complete summary: `tests/FULL-FIELDS-TEST-SUMMARY.md`
- Test file: `tests/register100-full-fields.spec.ts`
- Validation script: `tests/validate-all-fields-mongodb.js`

## 🎉 That's It!

You now have a comprehensive test that validates 100% field completion!

