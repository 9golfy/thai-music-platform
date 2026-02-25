# Register Support - Full Test Summary

## Test Overview
Created comprehensive automated test for `/regist-support` form that:
1. Fills ALL form fields across all 8 steps
2. Uploads 9 teacher images (9 MB) + 1 manager image (1 MB) = 10 MB total
3. Submits the form successfully
4. Verifies all data is correctly saved in MongoDB

## Test File
**Location**: `tests/regist-support-full-9teachers-db-check.spec.ts`

## Test Execution Script
**Location**: `run-regist-support-9teachers-test.ps1`

## Test Details

### Step 1: Support Type & Basic Information
- Support Type: ชุมนุม (Club)
- Support Type Name: ชุมนุมดนตรีไทยโรงเรียนทดสอบ 9 ครู
- Member Count: 45
- School Name: โรงเรียนสนับสนุนดนตรีไทยทดสอบ 9 ครู
- Province: กรุงเทพมหานคร
- School Level: มัธยมศึกษา
- Affiliation: กระทรวงศึกษาธิการ
- Staff Count: 55
- Student Count: 650
- Complete address information

### Step 2: Administrator
- Manager Name: นายผู้บริหาร ทดสอบ 9 ครู
- Position: ผู้อำนวยการโรงเรียน
- Phone: 0899999999
- Email: admin9@support-school.ac.th
- **Image Upload**: manager.jpg (1 MB)

### Step 3: Readiness Items (Instruments)
- 3 instruments added:
  1. ระนาดเอก (4 units)
  2. ซอด้วง (6 units)
  3. ฆ้องวงใหญ่ (2 units)

### Step 4: Thai Music Teachers (9 Teachers)
**Training Checkboxes** (20 points):
- ✅ วิชาบังคับ (Compulsory Subject)
- ✅ สอนหลังเลิกเรียน (After School Teaching)
- ✅ วิชาเลือก (Elective Subject)
- ✅ หลักสูตรท้องถิ่น (Local Curriculum)

**9 Teachers with Images** (20 points for qualifications):
1. Teacher 1: ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย + teacher1.jpg (1 MB)
2. Teacher 2: ครูภูมิปัญญาในท้องถิ่น + teacher2.jpg (1 MB)
3. Teacher 3: ผู้ทรงคุณวุฒิ + teacher3.jpg (1 MB)
4. Teacher 4: วิทยากรภายนอก + teacher4.jpg (1 MB)
5. Teacher 5: ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย + teacher5.jpg (1 MB)
6. Teacher 6: ครูภูมิปัญญาในท้องถิ่น + teacher6.jpg (1 MB)
7. Teacher 7: ผู้ทรงคุณวุฒิ + teacher7.jpg (1 MB)
8. Teacher 8: วิทยากรภายนอก + teacher8.jpg (1 MB)
9. Teacher 9: ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย + teacher9.jpg (1 MB)

**Unique Qualification Types**: 4 types × 5 points = 20 points

**In-Class & Out-of-Class Instruction**: Complete duration information

### Step 5: Support Factors & Awards
**Support Factors**: 1 item added

**Support from Organization** (5 points):
- ✅ Checked
- 1 organization: สำนักงานวัฒนธรรมจังหวัดกรุงเทพมหานคร

**Support from External** (15 points):
- ✅ Checked
- 3 organizations:
  1. มูลนิธิส่งเสริมดนตรีไทยแห่งชาติ
  2. ชุมชนท้องถิ่น
  3. ผู้ปกครองนักเรียน

**Awards** (20 points):
- 3 awards with highest level "ประเทศ":
  1. จังหวัด: รางวัลชนะเลิศระดับจังหวัด
  2. ภาค: รองชนะเลิศอันดับ 1 ระดับภาค
  3. ประเทศ: รางวัลเกียรติยศระดับประเทศ (highest = 20 points)

### Step 6: Media
- Photo Gallery Link: https://drive.google.com/photos-9teachers
- Video Link: https://youtube.com/watch?v=9teachers-video

### Step 7: Activities
**Internal Activities** (5 points):
- 3 activities within school

**External Activities** (5 points):
- 3 activities within province but outside school

**Outside Province Activities** (5 points):
- 3 activities outside province

### Step 8: PR & Certification
**PR Activities** (5 points):
- 3 PR activities:
  1. Facebook post
  2. YouTube video
  3. TikTok clip

**Heard From Sources**:
- School, Facebook, YouTube, TikTok, Cultural Office, Education Area, Other

**Problems & Suggestions**: Complete text

**Certification**: ✅ Checked

## Expected Score Calculation

| Category | Points | Details |
|----------|--------|---------|
| Teacher Training | 20 | 4 checkboxes × 5 points |
| Teacher Qualification | 20 | 4 unique types × 5 points |
| Support from Org | 5 | Checked |
| Support from External | 15 | 3 organizations |
| Awards | 20 | Highest level "ประเทศ" |
| Internal Activities | 5 | 3+ activities |
| External Activities | 5 | 3+ activities |
| Outside Province | 5 | 3+ activities |
| PR Activities | 5 | 3+ activities |
| **TOTAL** | **100** | **Perfect Score** |

## Image Size Verification
- Manager Image: 1 MB
- Teacher Images: 9 × 1 MB = 9 MB
- **Total: 10 MB** (exactly at the limit, no warning modal should appear)

## MongoDB Verification
The test verifies the following in MongoDB:

### Basic Information
- ✅ School name
- ✅ Support type
- ✅ Support type name
- ✅ Member count
- ✅ Province
- ✅ Manager name

### Teachers
- ✅ Teacher count (9 teachers)
- ✅ All teachers have images
- ✅ Manager has image

### Instruments
- ✅ 3 instruments saved

### Scores
- ✅ teacher_training_score = 20
- ✅ teacher_qualification_score = 20
- ✅ support_from_org_score = 5
- ✅ support_from_external_score = 15
- ✅ award_score = 20
- ✅ activity_within_province_internal_score = 5
- ✅ activity_within_province_external_score = 5
- ✅ activity_outside_province_score = 5
- ✅ pr_activity_score = 5
- ✅ total_score = 100

### Support & Awards
- ✅ Support from org items
- ✅ Support from external items (3)
- ✅ Awards (3)

### Activities
- ✅ Internal activities (3)
- ✅ External activities (3)
- ✅ Outside province activities (3)
- ✅ PR activities (3)

### Other Fields
- ✅ Obstacles
- ✅ Suggestions
- ✅ Certification (true)

## Test Output
The test provides detailed console output showing:
1. Progress through each step
2. Number of items added
3. Expected vs actual scores
4. MongoDB verification results
5. Submission ID for viewing in dashboard

## Dashboard Verification
After test completion, the submission can be viewed at:
```
http://localhost:3000/dashboard/register-support/[submission_id]
```

## Test Duration
- Expected: ~4-5 minutes
- Includes: Form filling, image uploads, submission, MongoDB verification

## Success Criteria
✅ All form fields filled correctly
✅ 9 teachers + 1 manager images uploaded (10 MB total)
✅ No image size warning modal (within 10 MB limit)
✅ Form submitted successfully
✅ Success modal appears
✅ Data saved to MongoDB
✅ All scores calculated correctly (100 points)
✅ All arrays have correct item counts
✅ All required fields present in database

## Files Created
1. `tests/regist-support-full-9teachers-db-check.spec.ts` - Main test file
2. `run-regist-support-9teachers-test.ps1` - Test execution script
3. `REGIST-SUPPORT-FULL-TEST-SUMMARY.md` - This documentation

## How to Run
```powershell
.\run-regist-support-9teachers-test.ps1
```

Or directly:
```powershell
npx playwright test tests/regist-support-full-9teachers-db-check.spec.ts --headed --workers=1
```

## Prerequisites
- MongoDB running on localhost:27017
- Test images in `regist/test-assets/` (manager.jpg, teacher1-9.jpg)
- Dev server running on http://localhost:3000
- Playwright installed

## Notes
- Test uses `--headed` mode to show browser interaction
- Test uses `--workers=1` to run sequentially
- Test timeout: 5 minutes (300,000ms)
- Screenshots saved to `test-results/` folder
- MongoDB connection verified before and after submission
