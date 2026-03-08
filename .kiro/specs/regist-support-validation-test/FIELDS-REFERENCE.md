# Regist-Support Form Fields Reference

## Complete Field List by Step

### Step 1: ข้อมูลพื้นฐาน

#### ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย
- `supportType` (radio) - ประเภท: สถานศึกษา/ชุมนุม/ชมรม/กลุ่ม/วงดนตรีไทย
- `supportTypeName` (text) - ชื่อ (conditional based on supportType)
- `supportTypeMemberCount` (number) - จำนวนสมาชิก (conditional, not for สถานศึกษา)

#### ข้อมูลพื้นฐาน
- `schoolName` (text) **REQUIRED** - ชื่อสถานศึกษา
- `schoolProvince` (select) **REQUIRED** - จังหวัด (77 provinces)
- `schoolLevel` (select) **REQUIRED** - ระดับสถานศึกษา
  - Options: ประถมศึกษา, มัธยมศึกษา, ขยายโอกาส, เฉพาะทาง
- `affiliation` (select) - สังกัด
  - Options: กระทรวงศึกษาธิการ, องค์กรปกครองส่วนท้องถิ่น, สังกัดกระทรวงอื่น ๆ, etc.
- `staffCount` (number) - จำนวนครู/บุคลากร
- `studentCount` (number) - จำนวนนักเรียน
- `schoolSize` (auto-calculated) - ขนาดโรงเรียน (SMALL/MEDIUM/LARGE/EXTRA_LARGE)
- `studentCountByGrade` (textarea) - จำนวนนักเรียนแต่ละระดับชั้น

#### สถานที่ตั้ง
- `addressNo` (text) - เลขที่
- `moo` (text) - หมู่
- `road` (text) - ถนน
- `subDistrict` (text) - ตำบล/แขวง (with autocomplete)
- `district` (text) - อำเภอ/เขต (with autocomplete)
- `provinceAddress` (text) - จังหวัด (with autocomplete)
- `postalCode` (text) - รหัสไปรษณีย์ (with autocomplete)
- `phone` (text) - โทรศัพท์
- `fax` (text) - โทรสาร

### Step 2: ผู้บริหารสถานศึกษา

- `mgtFullName` (text) **REQUIRED** - ชื่อ-นามสกุล
- `mgtPosition` (text) **REQUIRED** - ตำแหน่ง
- `mgtPhone` (tel) **REQUIRED** - เบอร์โทรศัพท์
- `mgtAddress` (text) - ที่อยู่
- `mgtEmail` (email) - อีเมล (validated if filled)
- `mgtImage` (file) - รูปภาพผู้บริหาร (max 1MB, jpg/jpeg/png)

### Step 3: ความพร้อมในการส่งเสริม

#### เครื่องดนตรีไทย (Array)
- `readinessItems[]`
  - `instrumentName` (text) - ชื่อเครื่องดนตรี
  - `quantity` (text) - จำนวน
  - `note` (text) - หมายเหตุ

### Step 4: ผู้สอนดนตรีไทย

#### ผู้สอนดนตรีไทย (Array)
- `thaiMusicTeachers[]`
  - `teacherQualification` (select) - คุณลักษณะครูผู้สอน
    - Options: ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย, ครูภูมิปัญญาในท้องถิ่น, ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย, วิทยากร/บุคคลภายนอก
  - `teacherFullName` (text) - ชื่อ-นามสกุล
  - `teacherPosition` (text) - ตำแหน่ง
  - `teacherEducation` (text) - วุฒิการศึกษา
  - `teacherPhone` (tel) - โทรศัพท์
  - `teacherEmail` (email) - อีเมล
  - `teacherImage` (file) - รูปภาพครู (max 1MB, jpg/jpeg/png)

#### การเรียนการสอนดนตรีไทย (Checkboxes - Scoring)
- `isCompulsorySubject` (checkbox) - เป็นวิชาบังคับในชั้นเรียน (5 points)
- `hasAfterSchoolTeaching` (checkbox) - มีการเรียนการสอนนอกเวลาราชการ (5 points)
- `hasElectiveSubject` (checkbox) - มีวิชาเลือก/วิชาเรียนเพิ่มเติม/ชุมนุม (5 points)
- `hasLocalCurriculum` (checkbox) - มีหลักสูตรวิชาของท้องถิ่น (5 points)

#### ระยะเวลาทำการเรียนการสอนในเวลาราชการ (Array)
- `inClassInstructionDurations[]`
  - `inClassGradeLevel` (text) - ระดับชั้น
  - `inClassStudentCount` (number) - เรียนดนตรีไทยจำนวน (คน)
  - `inClassHoursPerSemester` (number) - ชั่วโมง/ภาคการศึกษา
  - `inClassHoursPerYear` (number) - ชั่วโมง/ปีการศึกษา

#### ระยะเวลาทำการเรียนการสอนนอกเวลาราชการ (Array)
- `outOfClassInstructionDurations[]`
  - `outDay` (select) - วัน (จันทร์-อาทิตย์)
  - `outTimeFrom` (text) - เวลา
  - `outTimeTo` (text) - ถึง
  - `outLocation` (text) - สถานที่

- `teachingLocation` (text) - สถานที่สอน

### Step 5: ปัจจัยที่เกี่ยวข้อง

#### ปัจจัยที่เกี่ยวข้องโดยตรง (Array)
- `supportFactors[]`
  - `sup_supportByAdmin` (text) - ผู้บริหารสถานศึกษา
  - `sup_supportBySchoolBoard` (text) - กรรมการสถานศึกษา
  - `sup_supportByOthers` (text) - อื่นๆ (วัด สมาคม มูลนิธิ)
  - `sup_supportByDescription` (text) - รายละเอียด
  - `sup_supportByDate` (text) - วันที่
  - `sup_supportByDriveLink` (text) - หลักฐาน/ภาพถ่าย/รางวัล (Link)

#### การสนับสนุนจากต้นสังกัด (Scoring: 5 points if checked)
- `hasSupportFromOrg` (checkbox) - ได้รับการสนับสนุนจากต้นสังกัด
- `supportFromOrg[]` (Array)
  - `organization` (text) - บุคคล/หน่วยงาน
  - `details` (textarea) - รายละเอียด
  - `evidenceLink` (url) - หลักฐาน/ภาพถ่าย (Link)

#### การสนับสนุนจากภายนอก (Scoring: 5/10/15 points based on count)
- `hasSupportFromExternal` (checkbox) - ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก
- `supportFromExternal[]` (Array)
  - `organization` (text) - บุคคล/หน่วยงาน
  - `details` (textarea) - รายละเอียด
  - `evidenceLink` (url) - หลักฐาน/ภาพถ่าย (Link)

#### กรอบการเรียนการสอน
- `curriculumFramework` (textarea) - สถานศึกษามีกรอบการเรียนการสอนดนตรีไทย
- `learningOutcomes` (textarea) - ผลสัมฤทธิ์ในการเรียนการสอนด้านดนตรีไทย
- `managementContext` (textarea) - การบริหารจัดการสอนดนตรีไทยของสถานศึกษา

#### รางวัล (Scoring: 5/10/15/20 points based on level)
- `awards[]` (Array)
  - `awardLevel` (select) - ระดับรางวัล (อำเภอ=5, จังหวัด=10, ภาค=15, ประเทศ=20)
  - `awardName` (text) - ชื่อรางวัล
  - `awardDate` (text) - วันที่ได้รับรางวัล
  - `awardEvidenceLink` (url) - หลักฐาน (Link)

### Step 6: ภาพถ่ายและวีดิโอ

- `photoGalleryLink` (url) - ภาพถ่ายผลงาน (Link/URL สำหรับ Share Drive)
- `videoLink` (url) - วีดิโอ/คลิป (Link/URL, ความยาวไม่เกิน 3 นาที)

### Step 7: การเผยแพร่

#### ภายในจังหวัด - ภายในสถานศึกษา (Scoring: 5 points if >= 3 activities)
- `activitiesWithinProvinceInternal[]` (Array)
  - `activityName` (text) - ชื่อกิจกรรม
  - `activityDate` (text) - วันที่
  - `evidenceLink` (url) - หลักฐาน/ภาพถ่าย (Link)

#### ภายในจังหวัด - ภายนอกสถานศึกษา (Scoring: 5 points if >= 3 activities)
- `activitiesWithinProvinceExternal[]` (Array)
  - `activityName` (text) - ชื่อกิจกรรม
  - `activityDate` (text) - วันที่
  - `evidenceLink` (url) - หลักฐาน/ภาพถ่าย (Link)

#### ภายนอกจังหวัด (Scoring: 5 points if >= 3 activities)
- `activitiesOutsideProvince[]` (Array)
  - `activityName` (text) - ชื่อกิจกรรม
  - `activityDate` (text) - วันที่
  - `evidenceLink` (url) - หลักฐาน/ภาพถ่าย (Link)

### Step 8: การประชาสัมพันธ์และการรับรอง

#### การประชาสัมพันธ์ (Scoring: 5 points if >= 3 activities)
- `prActivities[]` (Array)
  - `activityName` (text) - ชื่อกิจกรรม/งาน
  - `platform` (text) - แหล่งเผยแพร่/ประชาสัมพันธ์ในสื่อสังคมออนไลน์
  - `publishDate` (text) - วันที่เผยแพร่
  - `evidenceLink` (url) - หลักฐานการเผยแพร่ (Link)

#### แหล่งที่มาของข้อมูล

**โรงเรียน**
- `heardFromSchool` (checkbox) - โรงเรียน
- `heardFromSchoolName` (text) - ชื่อโรงเรียน
- `heardFromSchoolDistrict` (text) - อำเภอ (with autocomplete)
- `heardFromSchoolProvince` (text) - จังหวัด (with autocomplete)

**ช่องทางประชาสัมพันธ์ของกรมส่งเสริมวัฒนธรรม**
- `DCP_PR_Channel_FACEBOOK` (checkbox) - เฟซบุ๊ก (Facebook)
- `DCP_PR_Channel_YOUTUBE` (checkbox) - ยูทูบ (YouTube)
- `DCP_PR_Channel_Tiktok` (checkbox) - ติ๊กต๊อก (TikTok)

**สำนักงานวัฒนธรรมจังหวัด**
- `heardFromCulturalOffice` (checkbox) - สำนักงานวัฒนธรรมจังหวัด
- `heardFromCulturalOfficeName` (text) - ระบุสำนักงานวัฒนธรรมจังหวัด

**สำนักงานเขตพื้นที่การศึกษา**
- `heardFromEducationArea` (checkbox) - สำนักงานเขตพื้นที่การศึกษา
- `heardFromEducationAreaName` (text) - ระบุสำนักงานเขตพื้นที่การศึกษา
- `heardFromEducationAreaProvince` (select) - จังหวัด (77 provinces)

**อื่นๆ**
- `heardFromOther` (checkbox) - อื่น ๆ ระบุ
- `heardFromOtherDetail` (text) - ระบุ

#### ข้อมูลด้านอื่นๆ
- `obstacles` (textarea) - ปัญหาและอุปสรรคที่มีผลกระทบต่อการเรียนการสอนดนตรีไทย
- `suggestions` (textarea) - ข้อเสนอแนะในการส่งเสริมดนตรีไทยในสถานศึกษา

#### การรับรองข้อมูล
- `certifiedINFOByAdminName` (checkbox) **REQUIRED** - ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในแบบฟอร์มนี้เป็นความจริงทุกประการ

## Scoring Fields (Auto-calculated, not user input)

- `teacher_training_score` (number) - คะแนนจากการเรียนการสอน (max 20)
- `teacher_qualification_score` (number) - คะแนนจากคุณสมบัติครู (max 20)
- `support_from_org_score` (number) - คะแนนจากการสนับสนุนต้นสังกัด (5)
- `support_from_external_score` (number) - คะแนนจากการสนับสนุนภายนอก (5/10/15)
- `award_score` (number) - คะแนนจากรางวัล (5/10/15/20)
- `activity_within_province_internal_score` (number) - คะแนนกิจกรรมภายในจังหวัด-ภายใน (5)
- `activity_within_province_external_score` (number) - คะแนนกิจกรรมภายในจังหวัด-ภายนอก (5)
- `activity_outside_province_score` (number) - คะแนนกิจกรรมภายนอกจังหวัด (5)
- `pr_activity_score` (number) - คะแนนการประชาสัมพันธ์ (5)
- `total_score` (number) - คะแนนรวม (max 100)

## Required Fields Summary

### Mandatory for Submission
1. `schoolName` (Step 1)
2. `schoolProvince` (Step 1)
3. `schoolLevel` (Step 1)
4. `mgtFullName` (Step 2)
5. `mgtPosition` (Step 2)
6. `mgtPhone` (Step 2)
7. `certifiedINFOByAdminName` (Step 8) - **MUST BE CHECKED**

### Conditional Validation
- `mgtEmail` - If filled, must be valid email format
- `supportTypeName` - Required if supportType is selected
- `supportTypeMemberCount` - Required if supportType is ชุมนุม/ชมรม/กลุ่ม/วงดนตรีไทย

## Field Validation Rules

### Text Fields
- `schoolName`: min 1 character
- `mgtFullName`: min 1 character
- `mgtPosition`: min 1 character
- `mgtPhone`: min 1 character

### Email Fields
- `mgtEmail`: valid email format or empty
- `teacherEmail`: valid email format or empty

### File Upload
- `mgtImage`: max 1MB, jpg/jpeg/png only
- `teacherImage`: max 1MB, jpg/jpeg/png only
- Total images: max 10MB (warning modal if exceeded)

### Number Fields
- `staffCount`: positive integer
- `studentCount`: positive integer
- `supportTypeMemberCount`: positive integer
- `inClassStudentCount`: positive integer
- `inClassHoursPerSemester`: positive integer
- `inClassHoursPerYear`: positive integer

### URL Fields
- All `evidenceLink`, `awardEvidenceLink`, `photoGalleryLink`, `videoLink`: valid URL format

### Auto-calculated Fields
- `schoolSize`: calculated from `studentCount`
  - SMALL: < 120 students
  - MEDIUM: 120-719 students
  - LARGE: 720-1679 students
  - EXTRA_LARGE: >= 1680 students

## Notes

- Fields marked with * are REQUIRED
- Array fields can have 0 or more items
- Checkboxes default to false
- Number fields default to 0
- Auto-calculated scores are computed on submission
- jquery.Thailand.js is used for address autocomplete in Step 1 and Step 8
