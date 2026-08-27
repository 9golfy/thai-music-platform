# DATA DICTIONARY — Thai Music Platform
## ฉบับปัจจุบัน (Latest Version)

**Database**: MongoDB  
**Database Name**: `thai_music_school`  
**Production Server**: root@041034-U (https://dcpschool100.net)  
**Last Updated**: July 27, 2026  
**Latest Commit**: cabca94 (Add detailed score columns to Excel export)

---

## สารบัญ (Table of Contents)

1. [ภาพรวมฐานข้อมูล (Database Overview)](#database-overview)
2. [Collection: users](#1-collection-users)
3. [Collection: register100_submissions](#2-collection-register100_submissions)
4. [Collection: register_support_submissions](#3-collection-register_support_submissions)
5. [Collection: draft_submissions](#4-collection-draft_submissions)
6. [Collection: certificates](#5-collection-certificates)
7. [Collection: certificate_templates](#6-collection-certificate_templates)
8. [Collection: user_consents](#7-collection-user_consents)
9. [Collection: system_settings](#8-collection-system_settings)
10. [Naming Convention](#naming-convention)
11. [Relationships](#relationships)
12. [Indexes](#indexes)
13. [Score Calculation Rules](#score-calculation-rules)
14. [Export Features](#export-features)
15. [Recent Schema Changes](#recent-schema-changes)

---

## Database Overview

### Collections Summary

| Collection | คำอธิบาย | จำนวน Field (โดยประมาณ) | คะแนนเต็ม |
|---|---|---|---|
| `users` | บัญชีผู้ใช้งานระบบ (admin, teacher) | 11 | - |
| `register100_submissions` | ข้อมูลการลงทะเบียนโรงเรียนดนตรีไทย 100% | ~100+ | 200 |
| `register_support_submissions` | ข้อมูลการลงทะเบียนโรงเรียนสนับสนุนและส่งเสริม | ~100+ | 180 |
| `draft_submissions` | บันทึกร่างแบบฟอร์มก่อน submit (หมดอายุ 7 วัน) | 18 | - |
| `certificates` | ใบประกาศนียบัตรที่ออกให้โรงเรียน | 10 | - |
| `certificate_templates` | Template รูปภาพสำหรับใบประกาศ | 8 | - |
| `user_consents` | บันทึกการยินยอม PDPA | 6 | - |
| `system_settings` | ตั้งค่าระบบ (เปิด/ปิดรับสมัคร) | 3 | - |

### Database Connection

**Connection String**:
```
mongodb://username:password@localhost:27017/thai_music_school?authSource=admin
```

**Connection Pool Settings**:
- Max Pool Size: 10
- Min Pool Size: 2
- Max Idle Time: 30000ms
- Server Selection Timeout: 5000ms

---

## 1. Collection: `users`

**Purpose**: เก็บข้อมูลผู้ใช้งานระบบทั้งหมด รวมถึง admin และครูผู้สอน

**Indexes**:
- `email` (unique): สำหรับ login และป้องกัน duplicate

### Data Dictionary

| Field Name | Data Type | Required | Unique | Default | Description | Example |
|------------|-----------|----------|--------|---------|-------------|---------|
| `_id` | ObjectId | Yes | Yes | Auto | MongoDB document ID | `ObjectId("507f1f77bcf86cd799439011")` |
| `email` | String | Yes | Yes | - | Email (lowercase) ใช้เป็น username | `"admin@thaimusic.com"` |
| `password` | String | Yes | No | - | Password (bcrypt hashed, salt rounds: 10) | `"$2a$10$..."` |
| `role` | String | Yes | No | - | บทบาท: `root` / `admin` / `super_admin` / `teacher` | `"admin"` |
| `firstName` | String | Yes | No | - | ชื่อ | `"สมชาย"` |
| `lastName` | String | Yes | No | - | นามสกุล | `"ใจดี"` |
| `phone` | String | Yes | No | - | เบอร์โทรศัพท์ (10 digits) | `"0812345678"` |
| `schoolId` | String | No | No | null | รหัสโรงเรียน (เฉพาะ role=teacher) | `"DCP-0001"` |
| `profileImage` | String | No | No | null | Path รูปโปรไฟล์ | `"/uploads/profiles/user.jpg"` |
| `isActive` | Boolean | Yes | No | true | สถานะบัญชี (active/inactive) | `true` |
| `createdAt` | Date | Yes | No | Auto | วันที่สร้างบัญชี | `ISODate("2024-01-15T10:30:00Z")` |
| `updatedAt` | Date | Yes | No | Auto | วันที่แก้ไขล่าสุด | `ISODate("2024-01-20T14:45:00Z")` |

### Role Descriptions

| Role | คำอธิบาย | สิทธิ์การเข้าถึง |
|------|----------|-----------------|
| `root` | Super Admin ระดับสูงสุด | เข้าถึงทุกอย่างในระบบ |
| `admin` | ผู้ดูแลระบบทั่วไป | จัดการข้อมูลโรงเรียนและผู้ใช้ |
| `super_admin` | DCP Admin | จัดการระบบลงทะเบียนและใบประกาศ |
| `teacher` | ครูผู้สอน | ลงทะเบียนและดูข้อมูลของโรงเรียนตนเอง |

### Validation Rules

- Email: ต้องเป็น valid email format และ lowercase
- Password: min length 8 characters, hashed with bcrypt
- Phone: 10 digits, format: `0XXXXXXXXX`
- schoolId: required เมื่อ role = `teacher`

---

## 2. Collection: `register100_submissions`

**Purpose**: เก็บข้อมูลการลงทะเบียนโรงเรียนดนตรีไทย 100%  
**Prefix**: ทุก field ใช้ prefix `reg100_`  
**คะแนนเต็ม**: 200 คะแนน (Part 1: 100 + Part 2: 100 จาก video)

### Metadata (Server-generated)

| Field Name | Data Type | Required | Description | Example |
|------------|-----------|----------|-------------|---------|
| `_id` | ObjectId | Yes | MongoDB document ID | `ObjectId("6a1d74d61b4650d917db5648")` |
| `schoolId` | String | Auto | รหัสโรงเรียน รูปแบบ `DCP-XXXX` (auto-generated) | `"DCP-0001"` |
| `teacherEmail` | String | Yes | Email ครูผู้ลงทะเบียน | `"teacher@school.ac.th"` |
| `teacherPhone` | String | Yes | เบอร์โทรครู (10 digits) | `"0812345678"` |
| `status` | String | Auto | `pending` / `approved` / `rejected` | `"pending"` |
| `createdAt` | String (ISO) | Auto | วันที่สร้าง | `"2024-01-15T10:30:00.000Z"` |
| `submittedAt` | String (ISO) | Auto | วันที่ submit | `"2024-01-15T11:00:00.000Z"` |
| `adminNotes` | String | No | หมายเหตุจาก admin (เพิ่มใหม่) | `"ข้อมูลครบถ้วน"` |

### Step 1 — ข้อมูลพื้นฐาน

| Field Name | Data Type | Required | Max Length | Description |
|------------|-----------|----------|------------|-------------|
| `reg100_schoolName` | String | Yes | 200 | ชื่อสถานศึกษา |
| `reg100_schoolProvince` | String | Yes | 100 | จังหวัดที่ตั้งโรงเรียน |
| `reg100_province` | String | No | 100 | จังหวัด (สำรอง) |
| `reg100_schoolLevel` | String | Yes | - | `ประถมศึกษา` / `มัธยมศึกษา` / `ขยายโอกาส` / `เฉพาะทาง` |
| `reg100_affiliation` | String | No | 200 | สังกัด |
| `reg100_affiliationDetail` | String | No | 500 | รายละเอียดสังกัด |
| `reg100_schoolSize` | String | No | - | `SMALL` / `MEDIUM` / `LARGE` / `EXTRA_LARGE` |
| `reg100_staffCount` | Number | No | - | จำนวนบุคลากร |
| `reg100_studentCount` | Number | No | - | จำนวนนักเรียนทั้งหมด |
| `reg100_studentCountByGrade` | String | No | 500 | จำนวนนักเรียนแต่ละชั้น |
| `reg100_addressNo` | String | No | 50 | เลขที่ |
| `reg100_moo` | String | No | 50 | หมู่ |
| `reg100_road` | String | No | 100 | ถนน |
| `reg100_subDistrict` | String | No | 100 | ตำบล/แขวง |
| `reg100_district` | String | No | 100 | อำเภอ/เขต |
| `reg100_provinceAddress` | String | No | 100 | จังหวัด (ที่อยู่) |
| `reg100_postalCode` | String | No | 5 | รหัสไปรษณีย์ |
| `reg100_phone` | String | No | 20 | โทรศัพท์สถานศึกษา |
| `reg100_fax` | String | No | 20 | โทรสาร |

### Step 2 — ผู้บริหารสถานศึกษา

| Field Name | Data Type | Required | Max Length | Description |
|------------|-----------|----------|------------|-------------|
| `reg100_mgtFullName` | String | Yes | 100 | ชื่อ-นามสกุลผู้บริหาร |
| `reg100_mgtPosition` | String | Yes | 100 | ตำแหน่ง |
| `reg100_mgtAddress` | String | No | 500 | ที่อยู่ผู้บริหาร |
| `reg100_mgtPhone` | String | Yes | 20 | เบอร์โทรผู้บริหาร |
| `reg100_mgtEmail` | String | No | 100 | Email ผู้บริหาร |
| `reg100_mgtImage` | String | No | 500 | Path รูปภาพผู้บริหาร |

### Step 3 — สภาวการณ์การเรียนการสอน

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| `reg100_currentMusicTypes` | Array\<Object\> | รายการระดับชั้นและรายละเอียด |
| `reg100_currentMusicTypes[].grade` | String | ระดับชั้น |
| `reg100_currentMusicTypes[].details` | String | รายละเอียด |
| `reg100_readinessItems` | Array\<Object\> | รายการเครื่องดนตรี |
| `reg100_readinessItems[].instrumentName` | String | ชื่อเครื่องดนตรี |
| `reg100_readinessItems[].quantity` | String | จำนวน |
| `reg100_readinessItems[].note` | String | หมายเหตุ |

### Step 4 — ผู้สอนดนตรีไทย

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| `reg100_thaiMusicTeachers` | Array\<Object\> | รายชื่อครูดนตรีไทย |
| `reg100_thaiMusicTeachers[].teacherQualification` | String | บทบาท/หน้าที่ผู้สอน |
| `reg100_thaiMusicTeachers[].teacherFullName` | String | ชื่อ-นามสกุลครู |
| `reg100_thaiMusicTeachers[].teacherPosition` | String | ตำแหน่ง |
| `reg100_thaiMusicTeachers[].teacherEducation` | String | วุฒิการศึกษา |
| `reg100_thaiMusicTeachers[].teacherPhone` | String | เบอร์โทร |
| `reg100_thaiMusicTeachers[].teacherEmail` | String | Email |
| `reg100_thaiMusicTeachers[].teacherAbility` | String | ทักษะความสามารถ |
| `reg100_thaiMusicTeachers[].teacherImage` | String | Path รูปภาพครู |
| `reg100_thaiMusicTeachers[].musicInstituteEducation` | Array\<Object\> | การศึกษาด้านดนตรีไทย |
| `reg100_thaiMusicTeachers[].otherEducation` | Array\<Object\> | การศึกษาด้านอื่น |
| `reg100_compulsoryCurriculum` | Array\<Object\> | ตารางวิชาบังคับ |
| `reg100_electiveCurriculum` | Array\<Object\> | ตารางวิชาเลือก |
| `reg100_localCurriculum` | Array\<Object\> | ตารางหลักสูตรท้องถิ่น |
| `reg100_afterSchoolSchedule` | Array\<Object\> | ตารางเรียนนอกเวลา |
| `reg100_teachingLocation` | String | สถานที่สอน |

### Step 5 — หลักสูตร (Boolean Flags)

| Field Name | Data Type | Default | Description |
|------------|-----------|---------|-------------|
| `reg100_isCompulsorySubject` | Boolean | false | มีวิชาบังคับ |
| `reg100_hasElectiveSubject` | Boolean | false | มีวิชาเลือก |
| `reg100_hasLocalCurriculum` | Boolean | false | มีหลักสูตรท้องถิ่น |
| `reg100_hasAfterSchoolTeaching` | Boolean | false | มีการสอนนอกเวลา |

### Step 6 — การสนับสนุน

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| `reg100_supportFactors` | Array\<Object\> | ปัจจัยสนับสนุน |
| `reg100_supportFactors[].sup_supportByAdmin` | String | ผู้สนับสนุน |
| `reg100_supportFactors[].sup_supportByDescription` | String | รายละเอียด |
| `reg100_hasSupportFromOrg` | Boolean | ได้รับการสนับสนุนจากต้นสังกัด |
| `reg100_supportFromOrg` | Array\<Object\> | รายการสนับสนุนจากต้นสังกัด |
| `reg100_hasSupportFromExternal` | Boolean | ได้รับการสนับสนุนจากภายนอก |
| `reg100_supportFromExternal` | Array\<Object\> | รายการสนับสนุนจากภายนอก |
| `reg100_supportFromOrg[].organization` | String | ชื่อองค์กร |
| `reg100_supportFromOrg[].details` | String | รายละเอียด |
| `reg100_supportFromOrg[].evidenceLink` | String | ลิงก์หลักฐาน |
| `reg100_curriculumFramework` | String | กรอบการเรียนการสอน |
| `reg100_learningOutcomes` | String | ผลลัพธ์การเรียนรู้ |
| `reg100_managementContext` | String | การบริหารจัดการ |
| `reg100_awards` | Array\<Object\> | รางวัลที่ได้รับ |
| `reg100_awards[].awardLevel` | String | `อำเภอ` / `จังหวัด` / `ภาค` / `ประเทศ` |
| `reg100_awards[].awardName` | String | ชื่อรางวัล |
| `reg100_awards[].awardDate` | String | วันที่ได้รับ |
| `reg100_awards[].awardEvidenceLink` | String | ลิงก์หลักฐาน |
| `reg100_photoGalleryLink` | String | ลิงก์ Google Drive รูปภาพ |
| `reg100_videoLink` | String | ลิงก์วิดีโอที่ 1 |
| `reg100_videoLink2` | String | ลิงก์วิดีโอที่ 2 |

### Step 7–8 — กิจกรรมและประชาสัมพันธ์

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| `reg100_activitiesWithinProvinceInternal` | Array\<Object\> | กิจกรรมภายในจังหวัด (ภายใน) |
| `reg100_activitiesWithinProvinceExternal` | Array\<Object\> | กิจกรรมภายในจังหวัด (ภายนอก) |
| `reg100_activitiesOutsideProvince` | Array\<Object\> | กิจกรรมนอกจังหวัด |
| `reg100_prActivities` | Array\<Object\> | กิจกรรมประชาสัมพันธ์ |
| `reg100_prActivities[].activityName` | String | ชื่อกิจกรรม |
| `reg100_prActivities[].platform` | String | แพลตฟอร์ม |
| `reg100_prActivities[].publishDate` | String | วันที่เผยแพร่ |
| `reg100_prActivities[].evidenceLink` | String | ลิงก์หลักฐาน |
| `reg100_DCP_PR_Channel_FACEBOOK` | Boolean | ประชาสัมพันธ์ผ่าน Facebook |
| `reg100_DCP_PR_Channel_YOUTUBE` | Boolean | ประชาสัมพันธ์ผ่าน YouTube |
| `reg100_DCP_PR_Channel_Tiktok` | Boolean | ประชาสัมพันธ์ผ่าน TikTok |
| `reg100_heardFromSchool` | Boolean | ได้ยินจากโรงเรียน |
| `reg100_heardFromCulturalOffice` | Boolean | ได้ยินจากสำนักงานวัฒนธรรม |
| `reg100_heardFromEducationArea` | Boolean | ได้ยินจากสำนักงานเขตพื้นที่ |
| `reg100_heardFromOther` | Boolean | ได้ยินจากแหล่งอื่น |
| `reg100_obstacles` | String | ปัญหาและอุปสรรค |
| `reg100_suggestions` | String | ข้อเสนอแนะ |
| `reg100_certifiedByAdmin` | Boolean | รับรองความถูกต้อง |

### คะแนน (Score Fields) — **คะแนนเต็ม 200**

| Field Name | Data Type | Max Score | Description |
|------------|-----------|-----------|-------------|
| `teaching_curriculum_score` | Number | 20 | คะแนนหลักสูตร (checkbox × 5) |
| `teacher_qualification_score` | Number | 20 | คะแนนคุณสมบัติครู (unique qualification × 5) |
| `support_from_org_score` | Number | 5 | คะแนนสนับสนุนจากต้นสังกัด |
| `support_from_external_score` | Number | 15 | คะแนนสนับสนุนจากภายนอก |
| `award_score` | Number | 20 | คะแนนรางวัล (ระดับสูงสุด) |
| `activity_within_province_internal_score` | Number | 5 | คะแนนกิจกรรมภายใน |
| `activity_within_province_external_score` | Number | 5 | คะแนนกิจกรรมภายนอก |
| `activity_outside_province_score` | Number | 5 | คะแนนกิจกรรมนอกจังหวัด |
| `pr_activity_score` | Number | 5 | คะแนนประชาสัมพันธ์ |
| `total_score` | Number | 200 | **คะแนนรวมทั้งหมด** |

**หมายเหตุ**: คะแนนคำนวณอัตโนมัติจากข้อมูลที่กรอก Admin ไม่สามารถแก้ไขคะแนนได้

---

## 3. Collection: `register_support_submissions`

**Purpose**: เก็บข้อมูลการลงทะเบียนโรงเรียนสนับสนุนและส่งเสริม  
**Prefix**: ทุก field ใช้ prefix `regsup_`  
**คะแนนเต็ม**: 180 คะแนน

### Metadata (เหมือน register100_submissions)

| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| `_id` | ObjectId | Yes | MongoDB document ID |
| `schoolId` | String | Auto | รหัสโรงเรียน รูปแบบ `DCP-XXXX` |
| `teacherEmail` | String | Yes | Email ครูผู้ลงทะเบียน |
| `teacherPhone` | String | Yes | เบอร์โทรครู |
| `status` | String | Auto | `pending` / `approved` / `rejected` |
| `createdAt` | String (ISO) | Auto | วันที่สร้าง |
| `submittedAt` | String (ISO) | Auto | วันที่ submit |
| `adminNotes` | String | No | หมายเหตุจาก admin (เพิ่มใหม่) |

### Field เพิ่มเติม (เฉพาะ register-support)

| Field Name | Data Type | Required | Description | Options |
|------------|-----------|----------|-------------|---------|
| `regsup_supportType` | String | No | ประเภทองค์กร | `สถานศึกษา` / `ชุมนุม` / `ชมรม` / `กลุ่ม` / `วงดนตรีไทย` |
| `regsup_supportTypeSchoolName` | String | No | ชื่อ (กรณีเป็นสถานศึกษา) | - |
| `regsup_supportTypeClubName` | String | No | ชื่อ (กรณีเป็นชุมนุม) | - |
| `regsup_supportTypeAssociationName` | String | No | ชื่อ (กรณีเป็นชมรม) | - |
| `regsup_supportTypeGroupName` | String | No | ชื่อ (กรณีเป็นกลุ่ม) | - |
| `regsup_supportTypeBandName` | String | No | ชื่อ (กรณีเป็นวงดนตรีไทย) | - |
| `regsup_supportTypeMemberCount` | Number | No | จำนวนสมาชิก | min: 1 |
| `regsup_currentMusicTypes` | Array\<Object\> | No | สภาวการณ์การเรียนการสอน | - |

### Steps 1-8 (เหมือน register100_submissions)

โครงสร้างเหมือน `register100_submissions` ทุกอย่าง แต่ใช้ prefix `regsup_` แทน `reg100_`

### คะแนน (Score Fields) — **คะแนนเต็ม 180**

| Field Name | Data Type | Max Score | Description |
|------------|-----------|-----------|-------------|
| `teacher_training_score` | Number | 20 | **คะแนนการฝึกอบรมครู (ใช้แทน curriculum)** |
| `teacher_qualification_score` | Number | 20 | คะแนนคุณสมบัติครู |
| `support_from_org_score` | Number | 5 | คะแนนสนับสนุนจากต้นสังกัด |
| `support_from_external_score` | Number | 15 | คะแนนสนับสนุนจากภายนอก |
| `award_score` | Number | 20 | คะแนนรางวัล |
| `activity_within_province_internal_score` | Number | 5 | คะแนนกิจกรรมภายใน |
| `activity_within_province_external_score` | Number | 5 | คะแนนกิจกรรมภายนอก |
| `activity_outside_province_score` | Number | 5 | คะแนนกิจกรรมนอกจังหวัด |
| `pr_activity_score` | Number | 5 | คะแนนประชาสัมพันธ์ |
| `total_score` | Number | 180 | **คะแนนรวมทั้งหมด** |

### การจัดการคะแนน (Score Management) — **ฟีเจอร์สำคัญ**

**Register-Support มี 2 โหมดการจัดการคะแนน**:

1. **Auto-Calculate Mode** (Normal Edit):
   - เมื่อ Admin แก้ไขข้อมูลทั่วไป (ชื่อโรงเรียน, ที่อยู่, ฯลฯ)
   - ระบบคำนวณคะแนนอัตโนมัติจากข้อมูล

2. **Manual Edit Mode** (Score Edit):
   - เมื่อ Admin แก้ไขคะแนนโดยตรง
   - ระบบใช้คะแนนที่ Admin ใส่ **ไม่คำนวณใหม่**
   - คะแนนที่แก้ไขจะถูก **บันทึกถาวร** (preserved)

**API Logic** (ใน `app/api/register-support/[id]/route.ts`):
```javascript
// ตรวจสอบว่าเป็น Manual Edit หรือไม่
const isManualScoreEdit = Object.keys(updateData).some(key =>
  key.includes('_score')
);

if (isManualScoreEdit) {
  // Manual Mode: ใช้คะแนนจาก Admin
  console.log('Manual score edit detected - using admin-provided scores');
} else {
  // Auto Mode: คำนวณคะแนนใหม่
  console.log('Normal edit detected - recalculating scores');
  const scores = calculateScoresFromData(updateData);
  updateData = { ...updateData, ...scores };
}
```

**เอกสารอ้างอิง**: `FIX-SCORE-OVERWRITE-ISSUE.md`, Commit: `fd447a8`

---

## 4. Collection: `draft_submissions`

**Purpose**: บันทึกร่างแบบฟอร์มก่อน submit — หมดอายุใน 7 วัน  
**Rate Limit**: บันทึก draft 5 ครั้ง/ชั่วโมง, ขอ OTP 3 ครั้ง/ชั่วโมง  
**Constraint**: 1 email + 1 submissionType = 1 active draft

### Data Dictionary

| Field Name | Data Type | Required | Description | Example |
|------------|-----------|----------|-------------|---------|
| `_id` | ObjectId | Yes | MongoDB document ID | `ObjectId("6a2789e236ec83a67498720e")` |
| `token` | String | Yes | Draft token (UUID) ใช้เข้าถึง draft | `"26b4458a-49b8-4b24-b90f-64020794a306"` |
| `draftToken` | String | Yes | เหมือน token (backward compatibility) | `"26b4458a-49b8-4b24-b90f-64020794a306"` |
| `email` | String | Yes | Email ครูผู้บันทึก (lowercase) | `"teacher@school.ac.th"` |
| `phone` | String | Yes | เบอร์โทรครู (10 digits) | `"0812345678"` |
| `submissionType` | String | Yes | `register100` / `register-support` | `"register100"` |
| `formData` | Object | Yes | ข้อมูลแบบฟอร์มทั้งหมด (snapshot) | `{ reg100_schoolName: "...", ... }` |
| `currentStep` | Number | Yes | Step ปัจจุบัน (1–8) | `3` |
| `status` | String | Yes | `active` / `submitted` / `expired` | `"active"` |
| `saveCount` | Number | Yes | จำนวนครั้งที่บันทึก | `5` |
| `lastSaveAt` | Date | Yes | วันที่บันทึกล่าสุด | `ISODate("2024-01-15T10:30:00Z")` |
| `otp` | String | Yes | OTP (bcrypt hashed, 6 digits) | `"$2a$10$..."` |
| `otpExpiresAt` | Date | Yes | วันหมดอายุ OTP (+10 นาที) | `ISODate("2024-01-15T10:40:00Z")` |
| `otpAttempts` | Number | Yes | จำนวนครั้งที่กรอก OTP ผิด (max 5) | `0` |
| `otpRequestCount` | Number | Yes | จำนวนครั้งที่ขอ OTP (rate limit) | `1` |
| `lastOtpRequestAt` | Date | Yes | วันที่ขอ OTP ล่าสุด | `ISODate("2024-01-15T10:30:00Z")` |
| `createdAt` | Date | Yes | วันที่สร้าง draft | `ISODate("2024-01-15T10:00:00Z")` |
| `lastModified` | Date | Yes | วันที่แก้ไข draft ล่าสุด | `ISODate("2024-01-15T10:30:00Z")` |
| `expiresAt` | Date | Yes | วันหมดอายุ draft (+7 วัน) | `ISODate("2024-01-22T10:00:00Z")` |

### Rate Limits & Security

| Feature | Limit | Description |
|---------|-------|-------------|
| **Draft Save** | 5 times / hour | ป้องกันการบันทึกบ่อยเกินไป |
| **OTP Request** | 3 times / hour | ป้องกันการขอ OTP spam |
| **OTP Attempts** | 5 times | จำนวนครั้งที่กรอก OTP ผิดได้ก่อน lock |
| **OTP Expiry** | 10 minutes | OTP หมดอายุหลังจากขอ 10 นาที |
| **Draft Expiry** | 7 days | Draft หมดอายุหลังจากสร้าง 7 วัน |

### OTP Management Scripts

มี utility scripts สำหรับจัดการ OTP:

1. **`scripts/generate-otp-for-draft.js`** — สร้าง OTP ใหม่พร้อม bcrypt hash
2. **`scripts/view-otp-for-draft.js`** — ดูข้อมูล OTP ปัจจุบัน
3. **`scripts/set-otp-123456.js`** — ตั้ง OTP เป็น 123456 สำหรับ testing
4. **`scripts/get-mongodb-command.js`** — สร้างคำสั่ง MongoDB

### MongoDB Commands for Draft Management

**Reset OTP Attempts**:
```javascript
db.draft_submissions.updateOne(
  { token: "26b4458a-49b8-4b24-b90f-64020794a306" },
  {
    $set: {
      otpAttempts: 0,
      otpRequestCount: 0,
      lastOtpRequestAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  }
);
```

**Extend Draft Expiry**:
```javascript
db.draft_submissions.updateOne(
  { token: "26b4458a-49b8-4b24-b90f-64020794a306" },
  { $set: { expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }
);
```

**Check Draft Status**:
```javascript
db.draft_submissions.findOne(
  { token: "26b4458a-49b8-4b24-b90f-64020794a306" },
  { token: 1, email: 1, status: 1, expiresAt: 1, otpAttempts: 1 }
);
```

---

## 5. Collection: `certificates`

**Purpose**: เก็บข้อมูลใบประกาศนียบัตรที่ออกให้โรงเรียน  
**Constraint**: 1 โรงเรียน ต่อ 1 ใบประกาศ (unique บน `schoolId` + `isActive: true`)

### Data Dictionary

| Field Name | Data Type | Required | Unique | Description | Example |
|------------|-----------|----------|--------|-------------|---------|
| `_id` | ObjectId | Yes | Yes | MongoDB document ID | `ObjectId("507f1f77bcf86cd799439011")` |
| `schoolId` | String | Yes | No | รหัสโรงเรียน (อ้างอิงจาก submission) | `"DCP-0001"` |
| `schoolName` | String | Yes | No | ชื่อโรงเรียน | `"โรงเรียนดนตรีไทยกรุงเทพ"` |
| `certificateType` | String | Yes | No | `register100` / `register-support` | `"register100"` |
| `templateName` | String | Yes | No | ชื่อ template ที่ใช้ (อ้างอิง certificate_templates.name) | `"certificate-2026"` |
| `certificateNumber` | String | Yes | Yes | เลขที่ใบประกาศ รูปแบบ `CERT-{ปีไทย}-{timestamp}{random}` | `"CERT-2569-1705308000000-a1b2"` |
| `issueDate` | Date | Yes | No | วันที่ออกใบประกาศ | `ISODate("2024-01-15T10:00:00Z")` |
| `isActive` | Boolean | Yes | No | สถานะใบประกาศ (active/inactive) | `true` |
| `createdBy` | String | Yes | No | userId ของ admin ที่สร้าง | `"admin@thaimusic.com"` |
| `createdAt` | Date | Yes | No | วันที่สร้าง record | `ISODate("2024-01-15T10:00:00Z")` |
| `updatedAt` | Date | Yes | No | วันที่แก้ไข record ล่าสุด | `ISODate("2024-01-15T10:00:00Z")` |

### Certificate Number Format

```
CERT-{ปีไทย}-{timestamp}{random}

ตัวอย่าง:
CERT-2569-1705308000000-a1b2

ส่วนประกอบ:
- CERT: Prefix
- 2569: ปีไทย (พ.ศ.)
- 1705308000000: Unix timestamp (milliseconds)
- a1b2: Random string (4 characters)
```

### Validation Rules

- schoolId: ต้องมีอยู่ใน register100_submissions หรือ register_support_submissions
- certificateType: ต้องตรงกับประเภทการลงทะเบียนของ schoolId
- templateName: ต้องมีอยู่ใน certificate_templates collection และ isActive = true
- isActive: แต่ละ schoolId มีได้เพียง 1 certificate ที่ isActive = true

---

## 6. Collection: `certificate_templates`

**Purpose**: เก็บ template รูปภาพสำหรับใบประกาศ  
**File Storage**: `public/certificates/templates/`

### Data Dictionary

| Field Name | Data Type | Required | Unique | Description | Example |
|------------|-----------|----------|--------|-------------|---------|
| `_id` | ObjectId | Yes | Yes | MongoDB document ID | `ObjectId("507f1f77bcf86cd799439011")` |
| `name` | String | Yes | Yes | ชื่อ template (ใช้อ้างอิงใน certificates) | `"certificate-2026"` |
| `imageUrl` | String | Yes | No | Path รูปภาพ template | `"/certificates/templates/cert-2026.png"` |
| `isActive` | Boolean | Yes | No | สถานะ template (active/inactive) | `true` |
| `createdAt` | Date | Yes | No | วันที่สร้าง | `ISODate("2024-01-15T10:00:00Z")` |
| `updatedAt` | Date | Yes | No | วันที่แก้ไขล่าสุด | `ISODate("2024-01-15T10:00:00Z")` |
| `deletedAt` | Date | No | No | วันที่ลบ (soft delete) | `ISODate("2024-02-01T10:00:00Z")` |
| `deletedBy` | String | No | No | userId ของ admin ที่ลบ | `"admin@thaimusic.com"` |

### Soft Delete Implementation

Template ใช้ **soft delete** เพื่อป้องกันการสูญหาย:
- เมื่อลบ: ตั้งค่า `deletedAt` และ `deletedBy` แทนการลบจริง
- Query: ต้องกรอง `deletedAt: null` เพื่อดูเฉพาะ active templates
- Restore: ลบ `deletedAt` และ `deletedBy` fields

---

## 7. Collection: `user_consents`

**Purpose**: บันทึกการยินยอม PDPA  
**Update Strategy**: upsert บน `{ email, submissionType }`

### Data Dictionary

| Field Name | Data Type | Required | Description | Example |
|------------|-----------|----------|-------------|---------|
| `_id` | ObjectId | Yes | MongoDB document ID | `ObjectId("507f1f77bcf86cd799439011")` |
| `email` | String | Yes | Email ผู้ยินยอม (lowercase) | `"teacher@school.ac.th"` |
| `submissionType` | String | Yes | `register100` / `register-support` | `"register100"` |
| `consentDate` | Date | Yes | วันที่ยินยอม | `ISODate("2024-01-15T10:00:00Z")` |
| `ipAddress` | String | No | IP Address ของผู้ยินยอม | `"103.123.45.67"` |
| `userAgent` | String | No | Browser/User-Agent | `"Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."` |

### Indexes

**Compound Index**: `{ email: 1, submissionType: 1 }` (unique)
- ใช้สำหรับ upsert operation
- ป้องกัน duplicate consent record

### Upsert Example

```javascript
db.user_consents.updateOne(
  { email: "teacher@school.ac.th", submissionType: "register100" },
  {
    $set: {
      consentDate: new Date(),
      ipAddress: "103.123.45.67",
      userAgent: "Mozilla/5.0..."
    }
  },
  { upsert: true }
);
```

---

## 8. Collection: `system_settings`

**Purpose**: ตั้งค่าระบบ (เปิด/ปิดรับสมัคร)  
**Pattern**: Key-Value ใช้ document เดียวต่อ key

### Data Dictionary

| Field Name | Data Type | Required | Description | Example |
|------------|-----------|----------|-------------|---------|
| `_id` | ObjectId | Yes | MongoDB document ID | `ObjectId("507f1f77bcf86cd799439011")` |
| `key` | String | Yes | ชื่อ setting: `"registration_settings"` | `"registration_settings"` |
| `value` | Object | Yes | ค่า setting (object) | `{ register100Open: true, ... }` |
| `value.register100Open` | Boolean | Yes | เปิด/ปิดรับสมัคร register100 | `true` |
| `value.registerSupportOpen` | Boolean | Yes | เปิด/ปิดรับสมัคร register-support | `true` |
| `value.updatedAt` | Date | Yes | วันที่แก้ไขล่าสุด | `ISODate("2024-01-15T10:00:00Z")` |
| `value.updatedBy` | String | No | userId ของ admin ที่แก้ไข | `"admin@thaimusic.com"` |

### Example Document

```javascript
{
  _id: ObjectId("..."),
  key: "registration_settings",
  value: {
    register100Open: true,
    registerSupportOpen: false,
    updatedAt: ISODate("2024-01-15T10:00:00Z"),
    updatedBy: "admin@thaimusic.com"
  }
}
```

### Query Example

```javascript
// ดึงการตั้งค่าลงทะเบียน
const settings = await db.system_settings.findOne({ key: "registration_settings" });
const isRegister100Open = settings?.value?.register100Open || false;
```

---

## Naming Convention

### Field Prefixes

| Prefix | Collection | Description |
|--------|------------|-------------|
| `reg100_` | register100_submissions | Field ของโรงเรียนดนตรีไทย 100% |
| `regsup_` | register_support_submissions | Field ของโรงเรียนสนับสนุนและส่งเสริม |
| `sup_` | (nested object) | Field ภายใน supportFactors array |
| ไม่มี prefix | users, certificates, drafts | Collections อื่นๆ |

### Score Field Naming

ทุก field คะแนนจะลงท้ายด้วย `_score`:
- `teaching_curriculum_score`
- `teacher_qualification_score`
- `award_score`
- `total_score`

### Boolean Field Naming

Boolean fields ใช้ prefix:
- `is...` — สถานะ: `isActive`, `isCompulsorySubject`
- `has...` — การมีอยู่: `hasElectiveSubject`, `hasSupportFromOrg`
- `...Channel...` — ช่องทาง: `DCP_PR_Channel_FACEBOOK`

---

## Relationships

```
users.schoolId ──────────────────► register100_submissions.schoolId
                                   register_support_submissions.schoolId

certificates.schoolId ───────────► register100_submissions.schoolId
                                   register_support_submissions.schoolId

certificates.templateName ───────► certificate_templates.name

users.email (createdBy) ─────────► certificates.createdBy
                                   certificate_templates.deletedBy
                                   system_settings.value.updatedBy

draft_submissions.email ─────────► users.email (อ้างอิงทางตรรกะ)
draft_submissions.submissionType ► ใช้สร้าง register100/support_submissions

user_consents.email ─────────────► users.email (อ้างอิงทางตรรกะ)
```

> **หมายเหตุ**: MongoDB ไม่มี foreign key constraints — relationships เป็น application-level reference ผ่าน String fields

---

## Indexes

### Collection: users
- `email` (unique) — สำหรับ login และป้องกัน duplicate

### Collection: register100_submissions
- `schoolId` — ค้นหาตามโรงเรียน
- `teacherEmail` — ค้นหาตามครู
- `status` — filter ตามสถานะ
- `createdAt` — เรียงลำดับตามวันที่

### Collection: register_support_submissions
- `schoolId` — ค้นหาตามโรงเรียน
- `teacherEmail` — ค้นหาตามครู
- `status` — filter ตามสถานะ
- `createdAt` — เรียงลำดับตามวันที่

### Collection: draft_submissions
- `token` (unique) — เข้าถึง draft ด้วย UUID
- `email` — ค้นหา draft ของครู
- `{ email: 1, submissionType: 1 }` (compound) — enforce 1 draft per email per type
- `expiresAt` — TTL index สำหรับ auto-delete expired drafts

### Collection: certificates
- `schoolId` — ค้นหาใบประกาศของโรงเรียน
- `certificateNumber` (unique) — ค้นหาด้วยเลขที่ใบประกาศ
- `{ schoolId: 1, isActive: 1 }` (compound) — enforce 1 active certificate per school

### Collection: certificate_templates
- `name` (unique) — อ้างอิงจาก certificates

### Collection: user_consents
- `{ email: 1, submissionType: 1 }` (compound, unique) — upsert operation

### Collection: system_settings
- `key` (unique) — ค้นหา setting ด้วยชื่อ key

---

## Score Calculation Rules

### Register100 (คะแนนเต็ม 200)

| Category | Field Name | Max Score | Calculation Logic |
|----------|------------|-----------|-------------------|
| **หลักสูตร** | `teaching_curriculum_score` | 20 | จำนวน checkbox ที่ติ๊ก × 5 คะแนน (สูงสุด 4 checkbox) |
| **คุณสมบัติครู** | `teacher_qualification_score` | 20 | จำนวน unique qualifications × 5 คะแนน |
| **สนับสนุนจากต้นสังกัด** | `support_from_org_score` | 5 | มี = 5, ไม่มี = 0 |
| **สนับสนุนจากภายนอก** | `support_from_external_score` | 15 | มี = 15, ไม่มี = 0 |
| **รางวัล** | `award_score` | 20 | ระดับสูงสุด: ประเทศ=20, ภาค=15, จังหวัด=10, อำเภอ=5 |
| **กิจกรรมภายใน** | `activity_within_province_internal_score` | 5 | มี = 5, ไม่มี = 0 |
| **กิจกรรมภายนอก** | `activity_within_province_external_score` | 5 | มี = 5, ไม่มี = 0 |
| **กิจกรรมนอกจังหวัด** | `activity_outside_province_score` | 5 | มี = 5, ไม่มี = 0 |
| **ประชาสัมพันธ์** | `pr_activity_score` | 5 | มี = 5, ไม่มี = 0 |
| **รวม** | `total_score` | **200** | ผลรวมของทุกหมวด |

### Register-Support (คะแนนเต็ม 180)

| Category | Field Name | Max Score | Calculation Logic |
|----------|------------|-----------|-------------------|
| **การฝึกอบรมครู** | `teacher_training_score` | 20 | (แทนหลักสูตร) ขึ้นอยู่กับจำนวนการฝึกอบรม |
| **คุณสมบัติครู** | `teacher_qualification_score` | 20 | จำนวน unique qualifications × 5 คะแนน |
| **สนับสนุนจากต้นสังกัด** | `support_from_org_score` | 5 | มี = 5, ไม่มี = 0 |
| **สนับสนุนจากภายนอก** | `support_from_external_score` | 15 | มี = 15, ไม่มี = 0 |
| **รางวัล** | `award_score` | 20 | ระดับสูงสุด: ประเทศ=20, ภาค=15, จังหวัด=10, อำเภอ=5 |
| **กิจกรรมภายใน** | `activity_within_province_internal_score` | 5 | มี = 5, ไม่มี = 0 |
| **กิจกรรมภายนอก** | `activity_within_province_external_score` | 5 | มี = 5, ไม่มี = 0 |
| **กิจกรรมนอกจังหวัด** | `activity_outside_province_score` | 5 | มี = 5, ไม่มี = 0 |
| **ประชาสัมพันธ์** | `pr_activity_score` | 5 | มี = 5, ไม่มี = 0 |
| **รวม** | `total_score` | **180** | ผลรวมของทุกหมวด |

### Grade Calculation (เกณฑ์การให้เกรด)

#### Register100 (คะแนนเต็ม 200)
```javascript
function calculateGrade(score, maxScore) {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 80) return 'A';  // 160+ คะแนน
  if (percentage >= 70) return 'B';  // 140-159 คะแนน
  if (percentage >= 60) return 'C';  // 120-139 คะแนน
  if (percentage >= 50) return 'D';  // 100-119 คะแนน
  return 'F';                        // 0-99 คะแนน
}
```

#### Register-Support (คะแนนเต็ม 180)
```javascript
function calculateGrade(score, maxScore) {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 80) return 'A';  // 144+ คะแนน
  if (percentage >= 70) return 'B';  // 126-143 คะแนน
  if (percentage >= 60) return 'C';  // 108-125 คะแนน
  if (percentage >= 50) return 'D';  // 90-107 คะแนน
  return 'F';                        // 0-89 คะแนน
}
```

**อ้างอิง**: `lib/utils/gradeCalculator.ts`

---

## Export Features

### Overview

ระบบมีฟีเจอร์ Export ข้อมูลโรงเรียนเป็นไฟล์ CSV พร้อมคะแนนแบบละเอียดทุกส่วน โดยจัดเรียงคะแนนเป็น columns แนวนอนเพื่อให้ง่ายต่อการวิเคราะห์ข้อมูล

**Implementation**: Client-side export ใน `components/admin/SchoolsDataTable.tsx`  
**Commit**: `cabca94` (Add detailed score columns to Excel export)  
**Date**: July 27, 2026

### Export Locations

| Registration Type | Dashboard URL |
|-------------------|---------------|
| Register100 | `/dashboard/register100` |
| Register-Support | `/dashboard/register-support` |

### Export Button
- ปุ่ม "Export Excel" อยู่ที่มุมขวาบนของ Data Table
- Export เฉพาะข้อมูลที่กรองแล้ว (filtered data)
- รองรับการค้นหา, กรองจังหวัด, ระดับการศึกษา, และเกณฑ์

### File Format

**File Naming Convention**:
- Register100: `register100_schools_YYYYMMDD_HHmmss.csv`
- Register-Support: `register_support_schools_YYYYMMDD_HHmmss.csv`

**Encoding**: UTF-8 with BOM (รองรับภาษาไทยใน Excel)

### Column Structure

#### Register100 Export (23 columns)

| Column | Data Type | Description |
|--------|-----------|-------------|
| ลำดับ | Number | Running number |
| วันที่บันทึก | Date String | Registration date (Thai format) |
| ชื่อโรงเรียน | String | School name |
| จังหวัด | String | Province |
| ระดับการศึกษา | String | Education level |
| เกณฑ์ | String | Grade (ดีเด่น, ดีมาก, ดี, พอใช้, ปรับปรุง) |
| School ID | String | Unique school ID |
| อีเมลครู | String | Teacher email |
| เบอร์โทรศัพท์ | String | Teacher phone |
| **Part 1 Scores (9 columns)** |
| Step 5: นโยบาย (20) | Number | `teaching_curriculum_score` |
| Step 4: คุณวุฒิครู (20) | Number | `teacher_qualification_score` |
| Step 6: สนับสนุนต้นสังกัด (5) | Number | `support_from_org_score` |
| Step 6: สนับสนุนภายนอก (15) | Number | `support_from_external_score` |
| Step 7: รางวัล (20) | Number | `award_score` |
| Step 8: กิจกรรมภายใน (5) | Number | `activity_within_province_internal_score` |
| Step 8: กิจกรรมภายนอก (5) | Number | `activity_within_province_external_score` |
| Step 8: กิจกรรมนอกจังหวัด (5) | Number | `activity_outside_province_score` |
| Step 9: ประชาสัมพันธ์ (5) | Number | `pr_activity_score` |
| **Subtotals & Part 2 (5 columns)** |
| รวมส่วนที่ 1 (100) | Number | Sum of all Part 1 scores |
| วิดีโอ 1 (50) | Number | `video1_score` (manual entry) |
| วิดีโอ 2 (50) | Number | `video2_score` (manual entry) |
| รวมส่วนที่ 2 (100) | Number | Sum of video scores |
| คะแนนรวมทั้งหมด (200) | Number | Total score (Part 1 + Part 2) |

#### Register-Support Export (23 columns)

| Column | Data Type | Description |
|--------|-----------|-------------|
| ลำดับ | Number | Running number |
| วันที่บันทึก | Date String | Registration date (Thai format) |
| ชื่อโรงเรียน | String | School name |
| จังหวัด | String | Province |
| ระดับการศึกษา | String | Education level |
| เกณฑ์ | String | Grade (ดีเด่น, ดีมาก, ดี, พอใช้, ปรับปรุง) |
| School ID | String | Unique school ID |
| อีเมลครู | String | Teacher email |
| เบอร์โทรศัพท์ | String | Teacher phone |
| **Part 1 Scores (9 columns)** |
| Step 4: ฝึกอบรมครู (20) | Number | `teacher_training_score` |
| Step 4: คุณวุฒิครู (20) | Number | `teacher_qualification_score` |
| Step 6: สนับสนุนต้นสังกัด (5) | Number | `support_from_org_score` |
| Step 6: สนับสนุนภายนอก (15) | Number | `support_from_external_score` |
| Step 7: รางวัล (20) | Number | `award_score` |
| Step 8: กิจกรรมภายใน (5) | Number | `activity_within_province_internal_score` |
| Step 8: กิจกรรมภายนอก (5) | Number | `activity_within_province_external_score` |
| Step 8: กิจกรรมนอกจังหวัด (5) | Number | `activity_outside_province_score` |
| Step 9: ประชาสัมพันธ์ (5) | Number | `pr_activity_score` |
| **Subtotals & Part 2 (5 columns)** |
| รวมส่วนที่ 1 (100) | Number | Sum of all Part 1 scores |
| วิดีโอ 1 (40) | Number | `video1_score` (manual entry) |
| วิดีโอ 2 (40) | Number | `video2_score` (manual entry) |
| รวมส่วนที่ 2 (80) | Number | Sum of video scores |
| คะแนนรวมทั้งหมด (180) | Number | Total score (Part 1 + Part 2) |

### Score Field Mapping

#### Register100 Score Fields → Export Columns

```javascript
{
  teaching_curriculum_score → 'Step 5: นโยบาย (20)',
  teacher_qualification_score → 'Step 4: คุณวุฒิครู (20)',
  support_from_org_score → 'Step 6: สนับสนุนต้นสังกัด (5)',
  support_from_external_score → 'Step 6: สนับสนุนภายนอก (15)',
  award_score → 'Step 7: รางวัล (20)',
  activity_within_province_internal_score → 'Step 8: กิจกรรมภายใน (5)',
  activity_within_province_external_score → 'Step 8: กิจกรรมภายนอก (5)',
  activity_outside_province_score → 'Step 8: กิจกรรมนอกจังหวัด (5)',
  pr_activity_score → 'Step 9: ประชาสัมพันธ์ (5)',
  video1_score → 'วิดีโอ 1 (50)',
  video2_score → 'วิดีโอ 2 (50)'
}
```

#### Register-Support Score Fields → Export Columns

```javascript
{
  teacher_training_score → 'Step 4: ฝึกอบรมครู (20)',
  teacher_qualification_score → 'Step 4: คุณวุฒิครู (20)',
  support_from_org_score → 'Step 6: สนับสนุนต้นสังกัด (5)',
  support_from_external_score → 'Step 6: สนับสนุนภายนอก (15)',
  award_score → 'Step 7: รางวัล (20)',
  activity_within_province_internal_score → 'Step 8: กิจกรรมภายใน (5)',
  activity_within_province_external_score → 'Step 8: กิจกรรมภายนอก (5)',
  activity_outside_province_score → 'Step 8: กิจกรรมนอกจังหวัด (5)',
  pr_activity_score → 'Step 9: ประชาสัมพันธ์ (5)',
  video1_score → 'วิดีโอ 1 (40)',
  video2_score → 'วิดีโอ 2 (40)'
}
```

### Export Features Details

#### 1. Client-Side Generation
- ข้อมูลถูกสร้างเป็น CSV โดยตรงใน browser (ไม่ผ่าน API)
- ใช้ `SchoolsDataTable.tsx` component สำหรับการ generate
- Performance: เร็ว, ไม่ให้ load server

#### 2. Data Processing
```typescript
// Calculate total score including videos
const totalScore = 
  part1Score + 
  (school.video1_score || 0) + 
  (school.video2_score || 0);

// Calculate grade
const grade = type === 'register100'
  ? calculateGradeRegister100(totalScore)
  : calculateGrade(totalScore, 180);
```

#### 3. CSV Formatting
- **UTF-8 BOM**: เพิ่ม `\uFEFF` เพื่อให้ Excel เปิดภาษาไทยได้ถูกต้อง
- **Escape Special Characters**: จัดการ comma และ quotes ใน CSV
- **Date Format**: Thai locale (วัน เดือน ปี)

```typescript
// Add BOM for Thai characters in Excel
const blob = new Blob(['\uFEFF' + csvContent], { 
  type: 'text/csv;charset=utf-8;' 
});
```

#### 4. Filter Support
Export รองรับการกรองข้อมูลตาม:
- Search term (ค้นหาชื่อโรงเรียน, จังหวัด, School ID)
- Province filter (กรองจังหวัด)
- Education level filter (กรองระดับการศึกษา)
- Grade filter (กรองเกณฑ์)

### Technical Implementation

**Component**: `components/admin/SchoolsDataTable.tsx`  
**Function**: `handleExportExcel()`  
**Lines**: ~220-330

**Key Logic**:
1. Map filtered schools to export format
2. Calculate all scores and subtotals
3. Format data as CSV with proper escaping
4. Add UTF-8 BOM for Thai support
5. Generate download link with timestamp filename

### Notes

1. **Score Preservation**: Video scores (Part 2) ต้องถูกป้อนด้วยตนเองโดย admin หลังจากประเมินวิดีโอ
2. **Zero Values**: คะแนนที่ไม่มีข้อมูลจะแสดงเป็น 0
3. **Real-time Calculation**: คะแนนรวมและ subtotals คำนวณแบบ real-time ตอน export
4. **No API Routes**: Export ไม่ใช้ API routes (`/api/register100/[id]/export/excel` และ `/api/register-support/[id]/export/excel`) - ใช้ client-side generation แทน
5. **Performance**: สามารถ export ข้อมูลหลายพันรายการได้โดยไม่มีปัญหา

---

## Recent Schema Changes

### 1. Admin Notes Field (เพิ่มใหม่)

**Date**: June 2026  
**Collections**: `register100_submissions`, `register_support_submissions`  
**Field**: `adminNotes` (String, optional)

**Purpose**: เพิ่ม field สำหรับ admin บันทึกหมายเหตุเกี่ยวกับการลงทะเบียน

**Example**:
```javascript
{
  schoolId: "DCP-0001",
  adminNotes: "โรงเรียนมีความพร้อมสูง ควรได้รับการสนับสนุนเพิ่มเติม",
  ...
}
```

### 2. Score Preservation Logic (Register-Support)

**Date**: June 2026 (Commit: fd447a8)  
**Collection**: `register_support_submissions`  
**Feature**: Manual Score Edit Mode

**Problem**: 
- Admin แก้ไขคะแนนเป็น 5 → กด Save → คะแนนกลับเป็น 4 (auto-recalculated)

**Solution**:
- เพิ่ม logic ตรวจสอบว่าเป็น Manual Edit หรือ Normal Edit
- Manual Edit: ใช้คะแนนที่ Admin ใส่ (ไม่คำนวณใหม่)
- Normal Edit: คำนวณคะแนนจากข้อมูล (ตามเดิม)

**API File**: `app/api/register-support/[id]/route.ts`

**Code Logic**:
```javascript
const isManualScoreEdit = Object.keys(updateData).some(key =>
  key.includes('_score')
);

if (isManualScoreEdit) {
  // Use admin-provided scores (no recalculation)
  console.log('Manual score edit - preserving admin input');
} else {
  // Recalculate scores from data
  const scores = calculateScoresFromData(updateData);
  updateData = { ...updateData, ...scores };
}
```

**Documentation**: `FIX-SCORE-OVERWRITE-ISSUE.md`

### 3. Draft System Rate Limiting

**Date**: April 2026  
**Collection**: `draft_submissions`  
**Features Added**:
- OTP rate limiting (3 requests/hour)
- Draft save rate limiting (5 saves/hour)
- OTP attempt limiting (5 attempts before lock)
- Draft expiry (7 days)
- OTP expiry (10 minutes)

**Fields Added**:
```javascript
{
  otpAttempts: Number,          // จำนวนครั้งที่กรอก OTP ผิด
  otpRequestCount: Number,      // จำนวนครั้งที่ขอ OTP
  lastOtpRequestAt: Date,       // วันที่ขอ OTP ล่าสุด
  saveCount: Number,            // จำนวนครั้งที่บันทึก draft
  lastSaveAt: Date,             // วันที่บันทึกล่าสุด
  expiresAt: Date               // วันหมดอายุ draft
}
```

### 4. Server-Side Filtering

**Date**: June 2026  
**API Routes**: `app/api/register100/list/route.ts`, `app/api/register-support/list/route.ts`  
**Feature**: Server-side filtering สำหรับ data table

**Filters Added**:
- `province` — กรองตามจังหวัด
- `level` — กรองตามระดับการศึกษา
- `search` — ค้นหาตามชื่อโรงเรียนหรือ schoolId

**Benefits**:
- ลดเวลาโหลดข้อมูลบน production (408+ schools)
- Grade filter ยังเป็น client-side (ต้องคำนวณจากคะแนน)

### 5. PDPA Consent Tracking

**Date**: March 2026  
**Collection**: `user_consents`  
**Purpose**: บันทึกการยินยอม PDPA ของผู้ใช้

**Fields**:
```javascript
{
  email: String,
  submissionType: String,  // register100 / register-support
  consentDate: Date,
  ipAddress: String,
  userAgent: String
}
```

**Unique Constraint**: `{ email, submissionType }` — 1 consent per email per type

---

## Utility Scripts

### OTP & Draft Management

| Script | Purpose | Location |
|--------|---------|----------|
| `generate-otp-for-draft.js` | สร้าง OTP ใหม่พร้อม bcrypt hash | `scripts/` |
| `view-otp-for-draft.js` | ดูข้อมูล OTP ปัจจุบัน | `scripts/` |
| `set-otp-123456.js` | ตั้ง OTP เป็น 123456 สำหรับ testing | `scripts/` |
| `get-mongodb-command.js` | สร้างคำสั่ง MongoDB | `scripts/` |

### Data Verification

| Script | Purpose | Location |
|--------|---------|----------|
| `check-school-scores.js` | ตรวจสอบคะแนนของโรงเรียน | `scripts/` |
| `find-missing-scores.js` | หาโรงเรียนที่มีข้อมูลแต่คะแนนหาย | `scripts/` |
| `check-activity-scores.js` | ตรวจสอบคะแนนกิจกรรม | `scripts/` |

### Backup & Restore

| Script | Purpose | Location |
|--------|---------|----------|
| `check-backup-data.js` | ดูข้อมูลใน backup database | `scripts/` |
| `compare-backup-production.js` | เปรียบเทียบ backup กับ production | `scripts/` |
| `restore-from-backup.js` | กู้ข้อมูลจาก backup | `scripts/` |

**Documentation**: `scripts/README.md`

---

## Environment Variables

### Required Variables

```bash
# MongoDB
MONGODB_URI=mongodb://username:password@localhost:27017/thai_music_school?authSource=admin
MONGO_DB=thai_music_school

# Backup Database (Optional)
BACKUP_MONGODB_URI=mongodb://username:password@localhost:27017/thai_music_school_backup?authSource=admin

# Authentication
JWT_SECRET=<generated-secret-32-chars-minimum>

# Email (Gmail SMTP)
GMAIL_USER=<gmail-address>
GMAIL_APP_PASSWORD=<gmail-app-password>

# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://dcpschool100.net

# File Upload (Optional)
MAX_FILE_SIZE=10485760
UPLOAD_DIR=public/uploads
```

### Windows Server Environment Variables

**Path**: System Properties → Advanced → Environment Variables → System variables

**Set via PowerShell**:
```powershell
[System.Environment]::SetEnvironmentVariable('MONGODB_URI', 'mongodb://...', 'Machine')
[System.Environment]::SetEnvironmentVariable('JWT_SECRET', '<secret>', 'Machine')
# ... etc
```

---

## Database Backup & Restore

### Backup Strategy

#### 1. MongoDB Backup (Daily)

**Command** (Windows):
```batch
"C:\Program Files\MongoDB\Server\7.0\bin\mongodump.exe" ^
  --uri="mongodb://root:<password>@localhost:27017/thai_music_school?authSource=admin" ^
  --out="C:\backups\thai-music-platform\mongodb\backup_%DATE%_%TIME%"
```

**Schedule**: Daily at 2:00 AM via Windows Task Scheduler

**Retention**:
- Daily backups: 7 days
- Weekly backups: 4 weeks
- Monthly backups: 12 months

#### 2. Uploads Backup (Daily)

**Command**:
```batch
xcopy "C:\inetpub\thai-music-platform\public\uploads" ^
  "C:\backups\thai-music-platform\uploads\uploads_%DATE%" /E /I /Y
```

### Restore Process

#### 1. Restore MongoDB

**Full Restore**:
```batch
"C:\Program Files\MongoDB\Server\7.0\bin\mongorestore.exe" ^
  --uri="mongodb://root:<password>@localhost:27017" ^
  --drop ^
  "C:\backups\thai-music-platform\mongodb\backup_YYYYMMDD_HHMMSS"
```

**Collection-Specific Restore**:
```batch
mongorestore ^
  --uri="mongodb://root:<password>@localhost:27017/thai_music_school" ^
  --collection=register100_submissions ^
  "C:\backups\mongodb\backup_YYYYMMDD\thai_music_school\register100_submissions.bson"
```

#### 2. Restore Uploads

```batch
xcopy "C:\backups\thai-music-platform\uploads\uploads_YYYYMMDD\*" ^
  "C:\inetpub\thai-music-platform\public\uploads\" /E /I /Y
```

### Backup Location

```
C:\backups\thai-music-platform\
├── mongodb\
│   ├── backup_20260706_020000\
│   │   └── thai_music_school\
│   │       ├── users.bson
│   │       ├── register100_submissions.bson
│   │       └── ...
│   └── ...
└── uploads\
    ├── uploads_20260706\
    │   ├── certificates\
    │   ├── documents\
    │   └── images\
    └── ...
```

---

## Security Considerations

### 1. Password Hashing

**Algorithm**: bcrypt  
**Salt Rounds**: 10  
**Implementation**: `bcryptjs` package

```javascript
import bcrypt from 'bcryptjs';

// Hash password
const hashedPassword = await bcrypt.hash(plainPassword, 10);

// Verify password
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

### 2. JWT Tokens

**Algorithm**: HS256  
**Secret**: 32+ characters random string  
**Expiry**: 7 days (configurable)

```javascript
import * as jose from 'jose';

// Generate token
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const token = await new jose.SignJWT({ userId, email, role })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('7d')
  .sign(secret);
```

### 3. File Upload Security

**Validation**:
- File type validation (whitelist)
- File size limit (10 MB)
- Filename sanitization
- Virus scanning (recommended)

**Allowed Types**:
```javascript
const ALLOWED_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif'],
  documents: ['application/pdf'],
  spreadsheets: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
};
```

### 4. Database Security

**MongoDB Authentication**: Enabled  
**Bind IP**: 127.0.0.1 (localhost only)  
**User Roles**:
- `root` — Full admin access
- `thai_music_app` (optional) — Application user with readWrite only

---

## Production Information

### Server Details

| Item | Value |
|------|-------|
| **Server** | root@041034-U |
| **URL** | https://dcpschool100.net |
| **Path** | /var/www/thai-music-platform |
| **PM2 Process** | thai-music-platform |
| **MongoDB** | localhost:27017 |
| **Database** | thai_music_school |
| **Node Version** | 22.x LTS |
| **Next.js Version** | 16.1.6 |

### Deployment Process

```bash
# 1. Connect to server
ssh root@041034-U

# 2. Navigate to application directory
cd /var/www/thai-music-platform

# 3. Pull latest code
git pull

# 4. Install dependencies (if package.json changed)
npm install

# 5. Build application
npm run build

# 6. Restart PM2
pm2 restart thai-music-platform

# 7. Check status
pm2 status
pm2 logs thai-music-platform --lines 50
```

### Common Issues

#### 1. Bad Gateway 502

**Cause**: `.next` directory corrupted or missing

**Solution**:
```bash
rm -rf .next
npm run build
pm2 restart thai-music-platform
```

#### 2. Environment Variables Not Loaded

**Solution**:
```bash
# Check current env
pm2 env thai-music-platform

# Restart with --update-env
pm2 restart thai-music-platform --update-env
```

#### 3. MongoDB Connection Failed

**Check**:
```bash
# Check MongoDB service
systemctl status mongod

# Test connection
mongosh "mongodb://localhost:27017/thai_music_school"
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Register100

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/register100/list` | List submissions (with filters) |
| GET | `/api/register100/[id]` | Get submission by ID |
| POST | `/api/register100` | Create new submission |
| PUT | `/api/register100/[id]` | Update submission |
| DELETE | `/api/register100/[id]` | Delete submission |

### Register-Support

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/register-support/list` | List submissions (with filters) |
| GET | `/api/register-support/[id]` | Get submission by ID |
| POST | `/api/register-support` | Create new submission |
| PUT | `/api/register-support/[id]` | **Update submission (with score preservation)** |
| DELETE | `/api/register-support/[id]` | Delete submission |

### Draft Submissions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/draft/[token]` | Get draft by token |
| POST | `/api/draft` | Create/update draft |
| POST | `/api/draft/verify-otp` | Verify OTP |
| POST | `/api/draft/resend-otp` | Resend OTP |

### Certificates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/certificates` | List certificates |
| POST | `/api/certificates` | Create certificate |
| DELETE | `/api/certificates/[id]` | Delete certificate |

### System Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/registration` | Get registration settings |
| PUT | `/api/settings/registration` | Update registration settings |

---

## Data Types Reference

### String Types

| Type | Format | Example | Max Length |
|------|--------|---------|------------|
| Email | lowercase, valid email | `"admin@thaimusic.com"` | 100 |
| Phone | 10 digits | `"0812345678"` | 10 |
| UUID | RFC 4122 | `"26b4458a-49b8-4b24-b90f-64020794a306"` | 36 |
| School ID | `DCP-XXXX` | `"DCP-0001"` | 8 |
| Certificate No | `CERT-{year}-{ts}-{rand}` | `"CERT-2569-1705308000000-a1b2"` | 50 |
| ISO Date | ISO 8601 | `"2024-01-15T10:30:00.000Z"` | - |
| Path | Relative path | `"/uploads/images/photo.jpg"` | 500 |
| URL | Full URL | `"https://drive.google.com/..."` | 1000 |

### Number Types

| Type | Range | Example | Description |
|------|-------|---------|-------------|
| Integer | 0 - 2,147,483,647 | `50` | Whole numbers |
| Score | 0 - 200 (register100) | `145` | Registration scores |
| Score | 0 - 180 (register-support) | `120` | Support scores |
| Count | 0 - unlimited | `5` | Counters, quantities |

### Boolean Types

| Value | Description |
|-------|-------------|
| `true` | Yes, enabled, has, is |
| `false` | No, disabled, hasn't, isn't |

### Date Types

| Format | Storage | Example |
|--------|---------|---------|
| Date Object | BSON Date | `ISODate("2024-01-15T10:30:00Z")` |
| ISO String | String | `"2024-01-15T10:30:00.000Z"` |

### Array Types

| Type | Description | Example |
|------|-------------|---------|
| Array\<String\> | Array of strings | `["ระนาดเอก", "ฆ้องวงใหญ่"]` |
| Array\<Object\> | Array of objects | `[{ grade: "ม.1", details: "..." }]` |

### Object Types

| Type | Description | Example |
|------|-------------|---------|
| Plain Object | Key-value pairs | `{ name: "...", value: "..." }` |
| Nested Object | Object within object | `{ teacher: { name: "...", email: "..." } }` |

---

## Query Examples

### Find by School ID

```javascript
db.register100_submissions.findOne({ schoolId: "DCP-0001" });
```

### Filter by Status

```javascript
db.register100_submissions.find({ status: "approved" });
```

### Search by School Name (case-insensitive)

```javascript
db.register100_submissions.find({
  reg100_schoolName: { $regex: "ดนตรีไทย", $options: "i" }
});
```

### Get High Scores (Register100 > 160)

```javascript
db.register100_submissions.find({
  total_score: { $gte: 160 }
}).sort({ total_score: -1 });
```

### Filter by Province

```javascript
db.register100_submissions.find({
  reg100_schoolProvince: "กรุงเทพมหานคร"
});
```

### Get Active Drafts

```javascript
db.draft_submissions.find({
  status: "active",
  expiresAt: { $gt: new Date() }
});
```

### Find Certificate by Number

```javascript
db.certificates.findOne({
  certificateNumber: "CERT-2569-1705308000000-a1b2"
});
```

### Get Registration Settings

```javascript
db.system_settings.findOne({ key: "registration_settings" });
```

### Update Score (Manual Edit)

```javascript
db.register_support_submissions.updateOne(
  { schoolId: "DCP-0001" },
  {
    $set: {
      teacher_qualification_score: 20,
      total_score: 145
    }
  }
);
```

---

## Change Log

### Version History

#### July 2026
- **Fixed**: Register-Support score overwrite issue (Commit: fd447a8)
  - Added manual score edit detection
  - Scores now preserved when admin edits them directly
  - Auto-calculation only happens on normal data edits

#### June 2026
- **Added**: Server-side filtering for data tables
  - Filter by province, level, search
  - Improved performance for 408+ schools
- **Added**: Admin notes field to submissions
- **Added**: Backup/restore utility scripts
  - `check-backup-data.js`
  - `compare-backup-production.js`
  - `restore-from-backup.js`

#### May 2026
- **Updated**: Site structure documentation (SITE-STRUCTURE-LATEST.md)
- **Added**: Data verification scripts
  - `check-school-scores.js`
  - `find-missing-scores.js`
  - `check-activity-scores.js`

#### April 2026
- **Added**: Draft system rate limiting
  - OTP rate limiting: 3 requests/hour
  - Draft save limiting: 5 saves/hour
  - OTP attempt limiting: 5 attempts before lock
- **Added**: OTP management scripts
  - `generate-otp-for-draft.js`
  - `view-otp-for-draft.js`
  - `set-otp-123456.js`
  - `get-mongodb-command.js`

#### March 2026
- **Added**: PDPA consent tracking (user_consents collection)
- **Added**: Certificate template soft delete
- **Updated**: MongoDB indexes for performance

#### February 2026
- **Added**: System settings collection
- **Added**: Registration control (open/close registration)

#### January 2026
- **Initial**: Database schema design
- **Created**: All 8 collections
- **Implemented**: Score calculation system
- **Deployed**: Production on Windows Server

---

## Contact & Support

### Development Team

- **Project Owner**: กรมส่งเสริมวัฒนธรรม (Department of Cultural Promotion)
- **Technical Contact**: admin@thaimusic.com
- **Production Server**: root@041034-U

### Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| **DATA-DICTIONARY-LATEST.md** | Root directory | This document (comprehensive data dictionary) |
| **SITE-STRUCTURE-LATEST.md** | Root directory | Complete site structure and features |
| **DATABASE-DESIGN.md** | Root directory | Original database design document |
| **FIX-SCORE-OVERWRITE-ISSUE.md** | Root directory | Score preservation fix documentation |
| **scripts/README.md** | scripts/ | Utility scripts documentation |

### Related Specifications

| Spec | Location | Purpose |
|------|----------|---------|
| **Deployment Requirements** | .kiro/specs/windows-server-deployment-requirements/ | Windows Server deployment guide |
| **Design Document** | .kiro/specs/.../design.md | Architecture and deployment design |

---

## Glossary

| Term | Definition |
|------|------------|
| **DCP** | Department of Cultural Promotion (กรมส่งเสริมวัฒนธรรม) |
| **Register100** | โรงเรียนดนตรีไทย 100% (100% Thai Music Schools) |
| **Register-Support** | โรงเรียนสนับสนุนและส่งเสริม (Supporting & Promoting Schools) |
| **Draft** | ร่างแบบฟอร์มที่บันทึกไว้ก่อน submit |
| **OTP** | One-Time Password (รหัสผ่านใช้ครั้งเดียว) |
| **PDPA** | Personal Data Protection Act (พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล) |
| **bcrypt** | Password hashing algorithm |
| **JWT** | JSON Web Token (for authentication) |
| **UUID** | Universally Unique Identifier |
| **TTL** | Time To Live (for auto-expiring documents) |
| **Soft Delete** | Mark as deleted without actually removing from database |
| **Hard Delete** | Permanently remove from database |
| **Upsert** | Update if exists, insert if not exists |

---

**Document Version**: 1.0  
**Last Updated**: July 6, 2026  
**Maintained By**: Development Team  
**Production URL**: https://dcpschool100.net

---

*End of Data Dictionary*
