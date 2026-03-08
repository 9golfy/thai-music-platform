# Design Document: Regist-Support Validation Test

## Overview

การทดสอบ validation ครบวงจรสำหรับฟอร์ม regist-support ที่ http://localhost:3000/regist-support โดยอ้างอิงจาก pattern ของ register100-complete-validation-test.spec.ts ฟอร์มนี้เป็น multi-step form (8 steps) ที่มี validation ที่แต่ละ step และมี MissingFieldsModal component สำหรับแสดง missing fields เมื่อกด "ส่งแบบฟอร์ม"

## Main Test Flow

```mermaid
sequenceDiagram
    participant Test as Test Suite
    participant Page as Browser Page
    participant Form as RegisterSupportWizard
    participant Modal as Validation/Missing Modals
    
    Test->>Page: Navigate to /regist-support
    Page->>Form: Load form
    Form->>Modal: Show ConsentModal
    Test->>Modal: Close consent modal
    
    Note over Test,Form: Test 1: Step 1 Validation
    Test->>Form: Click "ถัดไป" without filling
    Form->>Modal: Show ValidationErrorModal
    Test->>Modal: Verify modal visible
    Test->>Modal: Close modal
    
    Note over Test,Form: Test 2-7: Each Step Validation
    Test->>Form: Fill minimal Step 1
    Test->>Form: Click "ถัดไป"
    Test->>Form: Try next step without filling
    Form->>Modal: Show ValidationErrorModal
    
    Note over Test,Form: Test 8: Missing Fields Modal
    Test->>Form: Fill partial data (Steps 1-7)
    Test->>Form: Don't check certification
    Test->>Form: Click "ส่งแบบฟอร์ม"
    Form->>Modal: Show MissingFieldsModal
    Test->>Modal: Verify missing fields list
    
    Note over Test,Form: Test 9: Successful Submission
    Test->>Form: Fill all required fields
    Test->>Form: Check certification checkbox
    Test->>Form: Click "ส่งแบบฟอร์ม"
    Form->>Modal: Show SuccessModal
    Test->>Modal: Verify success
```

## Form Structure

### Step 1: ข้อมูลพื้นฐาน
**Required Fields:**
- schoolName (ชื่อสถานศึกษา) *
- schoolProvince (จังหวัด) *
- schoolLevel (ระดับสถานศึกษา) *

**Optional Fields:**
- supportType (ประเภท: สถานศึกษา/ชุมนุม/ชมรม/กลุ่ม/วงดนตรีไทย)
- supportTypeName
- supportTypeMemberCount
- affiliation (สังกัด)
- staffCount (จำนวนบุคลากร)
- studentCount (จำนวนนักเรียน)
- schoolSize (ขนาดโรงเรียน - auto-calculated)
- studentCountByGrade
- addressNo *, moo, road, subDistrict *, district *, provinceAddress *, postalCode *, phone *, fax

### Step 2: ผู้บริหารสถานศึกษา
**Required Fields:**
- mgtFullName (ชื่อ-นามสกุล) *
- mgtPosition (ตำแหน่ง) *
- mgtPhone (เบอร์โทรศัพท์) *
- mgtAddress *
- mgtEmail *

**Fields:**
- mgtImage (รูปภาพผู้บริหาร)

### Step 3: ความพร้อมในการส่งเสริม
**Fields:**
- readinessItems[] (เครื่องดนตรีไทย)
  - instrumentName
  - quantity
  - note

### Step 4: ผู้สอนดนตรีไทย
**Required Fields:**
- thaiMusicTeachers[]

**Fields:**
  - teacherQualification
  - teacherFullName
  - teacherPosition
  - teacherEducation
  - teacherPhone
  - teacherEmail
  - teacherImage
- isCompulsorySubject (checkbox)
- hasAfterSchoolTeaching (checkbox)
- hasElectiveSubject (checkbox)
- hasLocalCurriculum (checkbox)
- inClassInstructionDurations[]
- outOfClassInstructionDurations[]

### Step 5: ปัจจัยที่เกี่ยวข้อง
**Required Fields:**
- supportFactors[]
- awards[]

**Fields:**
- hasSupportFromOrg (checkbox)
- supportFromOrg[]
- hasSupportFromExternal (checkbox)
- supportFromExternal[]
- curriculumFramework
- learningOutcomes
- managementContext


### Step 6: ภาพถ่ายและวีดิโอ
**Fields:**
- photoGalleryLink
- videoLink

### Step 7: การเผยแพร่
**Fields:**
- activitiesWithinProvinceInternal[]
- activitiesWithinProvinceExternal[]
- activitiesOutsideProvince[]

### Step 8: การประชาสัมพันธ์และการรับรอง
**Fields:**
- prActivities[]
- heardFromSchool (checkbox)
- heardFromSchoolName, heardFromSchoolDistrict, heardFromSchoolProvince
- DCP_PR_Channel_FACEBOOK, DCP_PR_Channel_YOUTUBE, DCP_PR_Channel_Tiktok
- heardFromCulturalOffice (checkbox)
- heardFromCulturalOfficeName
- heardFromEducationArea (checkbox)
- heardFromEducationAreaName, heardFromEducationAreaProvince
- heardFromOther (checkbox)
- heardFromOtherDetail
- obstacles
- suggestions
**Required Fields:**
- **certifiedINFOByAdminName (checkbox) * - REQUIRED**
