# Database Design — Data Dictionary

Database: **MongoDB**  
Database Name: `thai_music_school`  
Driver: `mongodb` (native Node.js driver)

---

## Collections Overview

| Collection | คำอธิบาย | จำนวน Field (โดยประมาณ) |
|---|---|---|
| `register100_submissions` | ข้อมูลการลงทะเบียนโรงเรียนดนตรีไทย 100% | ~100+ |
| `register_support_submissions` | ข้อมูลการลงทะเบียนโรงเรียนสนับสนุนและส่งเสริม | ~100+ |
| `users` | บัญชีผู้ใช้งานระบบ (admin, teacher) | 11 |
| `certificates` | ใบประกาศนียบัตรที่ออกให้โรงเรียน | 10 |
| `certificate_templates` | Template รูปภาพสำหรับใบประกาศ | 8 |
| `draft_submissions` | บันทึกร่างแบบฟอร์มก่อน submit | 18 |
| `user_consents` | บันทึกการยินยอม PDPA | 6 |
| `system_settings` | ตั้งค่าระบบ (เปิด/ปิดรับสมัคร) | 3 |

---

## 1. Collection: `register100_submissions`

โรงเรียนดนตรีไทย 100% — field ทั้งหมดใช้ prefix `reg100_`  
คะแนนเต็ม: **200 คะแนน** (Part 1: 100 + Part 2: 100 จาก video)

### Metadata (Server-generated)

| Field | Type | Required | คำอธิบาย |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB document ID |
| `schoolId` | String | Auto | รหัสโรงเรียน รูปแบบ `DCP-XXXX` (auto-generated) |
| `teacherEmail` | String | Yes | Email ครูผู้ลงทะเบียน (ใช้เป็น login) |
| `teacherPhone` | String | Yes | เบอร์โทรครู |
| `status` | String | Auto | สถานะ: `pending` / `approved` / `rejected` |
| `createdAt` | String (ISO) | Auto | วันที่สร้าง |
| `submittedAt` | String (ISO) | Auto | วันที่ submit |

### Step 1 — ข้อมูลพื้นฐาน

| Field | Type | Required | คำอธิบาย |
|---|---|---|---|
| `reg100_schoolName` | String | Yes | ชื่อสถานศึกษา |
| `reg100_schoolProvince` | String | Yes | จังหวัดที่ตั้งโรงเรียน |
| `reg100_province` | String | No | จังหวัด (สำรอง) |
| `reg100_schoolLevel` | String (Enum) | Yes | ระดับการศึกษา: `ประถมศึกษา` / `มัธยมศึกษา` / `ขยายโอกาส` / `เฉพาะทาง` |
| `reg100_affiliation` | String | No | สังกัด |
| `reg100_affiliationDetail` | String | No | รายละเอียดสังกัด |
| `reg100_schoolSize` | String (Enum) | No | ขนาดโรงเรียน: `SMALL` / `MEDIUM` / `LARGE` / `EXTRA_LARGE` |
| `reg100_staffCount` | Number | No | จำนวนบุคลากร |
| `reg100_studentCount` | Number | No | จำนวนนักเรียนทั้งหมด |
| `reg100_studentCountByGrade` | String | No | จำนวนนักเรียนแต่ละชั้น |
| `reg100_addressNo` | String | No | เลขที่ |
| `reg100_moo` | String | No | หมู่ |
| `reg100_road` | String | No | ถนน |
| `reg100_subDistrict` | String | No | ตำบล/แขวง |
| `reg100_district` | String | No | อำเภอ/เขต |
| `reg100_provinceAddress` | String | No | จังหวัด (ที่อยู่) |
| `reg100_postalCode` | String | No | รหัสไปรษณีย์ |
| `reg100_phone` | String | No | โทรศัพท์สถานศึกษา |
| `reg100_fax` | String | No | โทรสาร |

### Step 2 — ผู้บริหารสถานศึกษา

| Field | Type | Required | คำอธิบาย |
|---|---|---|---|
| `reg100_mgtFullName` | String | Yes | ชื่อ-นามสกุลผู้บริหาร |
| `reg100_mgtPosition` | String | Yes | ตำแหน่ง |
| `reg100_mgtAddress` | String | No | ที่อยู่ผู้บริหาร |
| `reg100_mgtPhone` | String | Yes | เบอร์โทรผู้บริหาร |
| `reg100_mgtEmail` | String | No | Email ผู้บริหาร |
| `reg100_mgtImage` | String | No | Path รูปภาพผู้บริหาร (`/uploads/mgt_...`) |

### Step 3 — สภาวการณ์การเรียนการสอน

| Field | Type | Required | คำอธิบาย |
|---|---|---|---|
| `reg100_currentMusicTypes` | Array\<Object\> | No | รายการระดับชั้นและรายละเอียด |
| `reg100_currentMusicTypes[].grade` | String | No | ระดับชั้น |
| `reg100_currentMusicTypes[].details` | String | No | รายละเอียด |
| `reg100_readinessItems` | Array\<Object\> | No | รายการเครื่องดนตรี |
| `reg100_readinessItems[].instrumentName` | String | No | ชื่อเครื่องดนตรี |
| `reg100_readinessItems[].quantity` | String | No | จำนวน |
| `reg100_readinessItems[].note` | String | No | หมายเหตุ |

### Step 4 — ผู้สอนดนตรีไทย

| Field | Type | Required | คำอธิบาย |
|---|---|---|---|
| `reg100_thaiMusicTeachers` | Array\<Object\> | No | รายชื่อครูดนตรีไทย |
| `reg100_thaiMusicTeachers[].teacherQualification` | String | No | บทบาท/หน้าที่ผู้สอน |
| `reg100_thaiMusicTeachers[].teacherFullName` | String | No | ชื่อ-นามสกุลครู |
| `reg100_thaiMusicTeachers[].teacherPosition` | String | No | ตำแหน่ง |
| `reg100_thaiMusicTeachers[].teacherEducation` | String | No | วุฒิการศึกษา |
| `reg100_thaiMusicTeachers[].teacherPhone` | String | No | เบอร์โทร |
| `reg100_thaiMusicTeachers[].teacherEmail` | String | No | Email |
| `reg100_thaiMusicTeachers[].teacherAbility` | String | No | ทักษะความสามารถ |
| `reg100_thaiMusicTeachers[].teacherImage` | String | No | Path รูปภาพครู |
| `reg100_thaiMusicTeachers[].musicInstituteEducation` | Array\<Object\> | No | การศึกษาด้านดนตรีไทย |
| `reg100_thaiMusicTeachers[].otherEducation` | Array\<Object\> | No | การศึกษาด้านอื่น |
| `reg100_compulsoryCurriculum` | Array\<Object\> | No | ตารางวิชาบังคับ |
| `reg100_electiveCurriculum` | Array\<Object\> | No | ตารางวิชาเลือก |
| `reg100_localCurriculum` | Array\<Object\> | No | ตารางหลักสูตรท้องถิ่น |
| `reg100_afterSchoolSchedule` | Array\<Object\> | No | ตารางเรียนนอกเวลา |
| `reg100_teachingLocation` | String | No | สถานที่สอน |

### Step 5 — หลักสูตร (Boolean flags)

| Field | Type | Default | คำอธิบาย |
|---|---|---|---|
| `reg100_isCompulsorySubject` | Boolean | false | มีวิชาบังคับ |
| `reg100_hasElectiveSubject` | Boolean | false | มีวิชาเลือก |
| `reg100_hasLocalCurriculum` | Boolean | false | มีหลักสูตรท้องถิ่น |
| `reg100_hasAfterSchoolTeaching` | Boolean | false | มีการสอนนอกเวลา |

### Step 6 — การสนับสนุน

| Field | Type | Required | คำอธิบาย |
|---|---|---|---|
| `reg100_supportFactors` | Array\<Object\> | No | ปัจจัยสนับสนุน |
| `reg100_supportFactors[].sup_supportByAdmin` | String | No | ผู้สนับสนุน |
| `reg100_supportFactors[].sup_supportByDescription` | String | No | รายละเอียด |
| `reg100_hasSupportFromOrg` | Boolean | false | ได้รับการสนับสนุนจากต้นสังกัด |
| `reg100_supportFromOrg` | Array\<Object\> | No | รายการสนับสนุนจากต้นสังกัด |
| `reg100_hasSupportFromExternal` | Boolean | false | ได้รับการสนับสนุนจากภายนอก |
| `reg100_supportFromExternal` | Array\<Object\> | No | รายการสนับสนุนจากภายนอก |
| `reg100_supportFromOrg[].organization` | String | No | ชื่อองค์กร |
| `reg100_supportFromOrg[].details` | String | No | รายละเอียด |
| `reg100_supportFromOrg[].evidenceLink` | String | No | ลิงก์หลักฐาน |
| `reg100_curriculumFramework` | String | No | กรอบการเรียนการสอน |
| `reg100_learningOutcomes` | String | No | ผลลัพธ์การเรียนรู้ |
| `reg100_managementContext` | String | No | การบริหารจัดการ |
| `reg100_awards` | Array\<Object\> | No | รางวัลที่ได้รับ |
| `reg100_awards[].awardLevel` | String | No | ระดับรางวัล: `อำเภอ` / `จังหวัด` / `ภาค` / `ประเทศ` |
| `reg100_awards[].awardName` | String | No | ชื่อรางวัล |
| `reg100_awards[].awardDate` | String | No | วันที่ได้รับ |
| `reg100_awards[].awardEvidenceLink` | String | No | ลิงก์หลักฐาน |
| `reg100_photoGalleryLink` | String | Yes | ลิงก์ Google Drive รูปภาพ |
| `reg100_videoLink` | String | Yes | ลิงก์วิดีโอที่ 1 |
| `reg100_videoLink2` | String | Yes | ลิงก์วิดีโอที่ 2 |

### Step 7–8 — กิจกรรมและประชาสัมพันธ์

| Field | Type | Required | คำอธิบาย |
|---|---|---|---|
| `reg100_activitiesWithinProvinceInternal` | Array\<Object\> | No | กิจกรรมภายในจังหวัด (ภายใน) |
| `reg100_activitiesWithinProvinceExternal` | Array\<Object\> | No | กิจกรรมภายในจังหวัด (ภายนอก) |
| `reg100_activitiesOutsideProvince` | Array\<Object\> | No | กิจกรรมนอกจังหวัด |
| `reg100_prActivities` | Array\<Object\> | No | กิจกรรมประชาสัมพันธ์ |
| `reg100_prActivities[].activityName` | String | No | ชื่อกิจกรรม |
| `reg100_prActivities[].platform` | String | No | แพลตฟอร์ม |
| `reg100_prActivities[].publishDate` | String | No | วันที่เผยแพร่ |
| `reg100_prActivities[].evidenceLink` | String | No | ลิงก์หลักฐาน |
| `reg100_DCP_PR_Channel_FACEBOOK` | Boolean | false | ประชาสัมพันธ์ผ่าน Facebook |
| `reg100_DCP_PR_Channel_YOUTUBE` | Boolean | false | ประชาสัมพันธ์ผ่าน YouTube |
| `reg100_DCP_PR_Channel_Tiktok` | Boolean | false | ประชาสัมพันธ์ผ่าน TikTok |
| `reg100_heardFromSchool` | Boolean | false | ได้ยินจากโรงเรียน |
| `reg100_heardFromCulturalOffice` | Boolean | false | ได้ยินจากสำนักงานวัฒนธรรม |
| `reg100_heardFromEducationArea` | Boolean | false | ได้ยินจากสำนักงานเขตพื้นที่ |
| `reg100_heardFromOther` | Boolean | false | ได้ยินจากแหล่งอื่น |
| `reg100_obstacles` | String | No | ปัญหาและอุปสรรค |
| `reg100_suggestions` | String | No | ข้อเสนอแนะ |
| `reg100_certifiedByAdmin` | Boolean | Yes | รับรองความถูกต้อง |

### คะแนน (Score Fields)

| Field | Type | Max | คำอธิบาย |
|---|---|---|---|
| `teaching_curriculum_score` | Number | 20 | คะแนนหลักสูตร (checkbox × 5) |
| `teacher_qualification_score` | Number | 20 | คะแนนคุณสมบัติครู (unique qualification × 5) |
| `support_from_org_score` | Number | 5 | คะแนนสนับสนุนจากต้นสังกัด |
| `support_from_external_score` | Number | 15 | คะแนนสนับสนุนจากภายนอก |
| `award_score` | Number | 20 | คะแนนรางวัล (ระดับสูงสุด) |
| `activity_within_province_internal_score` | Number | 5 | คะแนนกิจกรรมภายใน |
| `activity_within_province_external_score` | Number | 5 | คะแนนกิจกรรมภายนอก |
| `activity_outside_province_score` | Number | 5 | คะแนนกิจกรรมนอกจังหวัด |
| `pr_activity_score` | Number | 5 | คะแนนประชาสัมพันธ์ |
| `total_score` | Number | 200 | คะแนนรวม |

---

## 2. Collection: `register_support_submissions`

โรงเรียนสนับสนุนและส่งเสริม — field ทั้งหมดใช้ prefix `regsup_`  
คะแนนเต็ม: **180 คะแนน**

โครงสร้างเหมือน `register100_submissions` ทุกอย่าง ยกเว้น:

### Field เพิ่มเติม (เฉพาะ register-support)

| Field | Type | Required | คำอธิบาย |
|---|---|---|---|
| `regsup_supportType` | String (Enum) | No | ประเภท: `สถานศึกษา` / `ชุมนุม` / `ชมรม` / `กลุ่ม` / `วงดนตรีไทย` |
| `regsup_supportTypeSchoolName` | String | No | ชื่อ (กรณีเป็นสถานศึกษา) |
| `regsup_supportTypeClubName` | String | No | ชื่อ (กรณีเป็นชุมนุม) |
| `regsup_supportTypeAssociationName` | String | No | ชื่อ (กรณีเป็นชมรม) |
| `regsup_supportTypeGroupName` | String | No | ชื่อ (กรณีเป็นกลุ่ม) |
| `regsup_supportTypeBandName` | String | No | ชื่อ (กรณีเป็นวงดนตรีไทย) |
| `regsup_supportTypeMemberCount` | Number | No | จำนวนสมาชิก |
| `regsup_currentMusicTypes` | Array\<Object\> | No | สภาวการณ์การเรียนการสอน |

### คะแนน (Score Fields) — register-support

| Field | Type | Max | คำอธิบาย |
|---|---|---|---|
| `teacher_training_score` | Number | 20 | คะแนนการฝึกอบรมครู |
| `teacher_qualification_score` | Number | 20 | คะแนนคุณสมบัติครู |
| `support_from_org_score` | Number | 5 | คะแนนสนับสนุนจากต้นสังกัด |
| `support_from_external_score` | Number | 15 | คะแนนสนับสนุนจากภายนอก |
| `award_score` | Number | 20 | คะแนนรางวัล |
| `activity_within_province_internal_score` | Number | 5 | คะแนนกิจกรรมภายใน |
| `activity_within_province_external_score` | Number | 5 | คะแนนกิจกรรมภายนอก |
| `activity_outside_province_score` | Number | 5 | คะแนนกิจกรรมนอกจังหวัด |
| `pr_activity_score` | Number | 5 | คะแนนประชาสัมพันธ์ |
| `total_score` | Number | 180 | คะแนนรวม |

---

## 3. Collection: `users`

| Field | Type | Required | Unique | คำอธิบาย |
|---|---|---|---|---|
| `_id` | ObjectId | Auto | Yes | MongoDB document ID |
| `email` | String | Yes | Yes | Email (lowercase) ใช้เป็น username |
| `password` | String | Yes | No | Password (bcrypt hashed) |
| `role` | String (Enum) | Yes | No | `root` / `admin` / `super_admin` / `teacher` |
| `firstName` | String | Yes | No | ชื่อ |
| `lastName` | String | Yes | No | นามสกุล |
| `phone` | String | Yes | No | เบอร์โทรศัพท์ |
| `schoolId` | String | No | No | รหัสโรงเรียน (เฉพาะ role=teacher) |
| `profileImage` | String | No | No | Path รูปโปรไฟล์ |
| `isActive` | Boolean | Yes | No | สถานะบัญชี (default: true) |
| `createdAt` | Date | Auto | No | วันที่สร้าง |
| `updatedAt` | Date | Auto | No | วันที่แก้ไขล่าสุด |

**Indexes**: `email` (unique)

---

## 4. Collection: `certificates`

| Field | Type | Required | คำอธิบาย |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB document ID |
| `schoolId` | String | Yes | รหัสโรงเรียน (อ้างอิงจาก submission) |
| `schoolName` | String | Yes | ชื่อโรงเรียน |
| `certificateType` | String (Enum) | Yes | `register100` / `register-support` |
| `templateName` | String | Yes | ชื่อ template ที่ใช้ (อ้างอิง certificate_templates.name) |
| `certificateNumber` | String | Yes | เลขที่ใบประกาศ รูปแบบ `CERT-{ปีไทย}-{timestamp}{random}` |
| `issueDate` | Date | Auto | วันที่ออกใบประกาศ |
| `isActive` | Boolean | Yes | สถานะ (default: true) |
| `createdBy` | String | Yes | userId ของ admin ที่สร้าง |
| `createdAt` | Date | Auto | วันที่สร้าง |
| `updatedAt` | Date | Auto | วันที่แก้ไขล่าสุด |

**Constraint**: 1 โรงเรียน ต่อ 1 ใบประกาศ (unique บน `schoolId` + `isActive: true`)

---

## 5. Collection: `certificate_templates`

ไฟล์รูปภาพเก็บที่: `public/certificates/templates/`

| Field | Type | Required | คำอธิบาย |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB document ID |
| `name` | String | Yes | ชื่อ template (unique) |
| `imageUrl` | String | Yes | Path รูปภาพ (`/certificates/templates/filename.png`) |
| `isActive` | Boolean | Yes | สถานะ (default: true) |
| `createdAt` | Date | Auto | วันที่สร้าง |
| `updatedAt` | Date | Auto | วันที่แก้ไขล่าสุด |
| `deletedAt` | Date | No | วันที่ลบ (soft delete) |
| `deletedBy` | String | No | userId ของ admin ที่ลบ |

---

## 6. Collection: `draft_submissions`

บันทึกร่างแบบฟอร์มก่อน submit — หมดอายุใน 7 วัน

| Field | Type | Required | คำอธิบาย |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB document ID |
| `token` | String | Yes | Draft token (UUID) ใช้เข้าถึง draft |
| `draftToken` | String | Yes | เหมือน token (เก็บ 2 field เพื่อ backward compatibility) |
| `email` | String | Yes | Email ครูผู้บันทึก |
| `phone` | String | Yes | เบอร์โทรครู |
| `submissionType` | String (Enum) | Yes | `register100` / `register-support` |
| `formData` | Object | Yes | ข้อมูลแบบฟอร์มทั้งหมด (snapshot) |
| `currentStep` | Number | Yes | Step ปัจจุบัน (1–8) |
| `status` | String | Yes | `active` / `submitted` / `expired` |
| `saveCount` | Number | Yes | จำนวนครั้งที่บันทึก |
| `lastSaveAt` | Date | Yes | วันที่บันทึกล่าสุด |
| `otp` | String | Yes | OTP (bcrypt hashed) |
| `otpExpiresAt` | Date | Yes | วันหมดอายุ OTP |
| `otpAttempts` | Number | Yes | จำนวนครั้งที่กรอก OTP ผิด |
| `otpRequestCount` | Number | Yes | จำนวนครั้งที่ขอ OTP |
| `lastOtpRequestAt` | Date | Yes | วันที่ขอ OTP ล่าสุด |
| `createdAt` | Date | Auto | วันที่สร้าง |
| `lastModified` | Date | Auto | วันที่แก้ไขล่าสุด |
| `expiresAt` | Date | Auto | วันหมดอายุ draft (+7 วัน) |

**Rate Limit**: บันทึก draft ได้ 5 ครั้ง/ชั่วโมง, ขอ OTP ได้ 3 ครั้ง/ชั่วโมง  
**Constraint**: 1 email + 1 submissionType = 1 active draft

---

## 7. Collection: `user_consents`

บันทึกการยินยอม PDPA — upsert บน `{ email, submissionType }`

| Field | Type | Required | คำอธิบาย |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB document ID |
| `email` | String | Yes | Email ผู้ยินยอม |
| `submissionType` | String (Enum) | Yes | `register100` / `register-support` |
| `consentDate` | Date | Yes | วันที่ยินยอม |
| `ipAddress` | String | No | IP Address ของผู้ยินยอม |
| `userAgent` | String | No | Browser/User-Agent |

**Indexes**: Compound index บน `{ email, submissionType }` (unique)

---

## 8. Collection: `system_settings`

ใช้ key-value pattern — document เดียวต่อ key

| Field | Type | Required | คำอธิบาย |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB document ID |
| `key` | String | Yes | ชื่อ setting: `"registration_settings"` |
| `value` | Object | Yes | ค่า setting |
| `value.register100Open` | Boolean | Yes | เปิด/ปิดรับสมัคร register100 |
| `value.registerSupportOpen` | Boolean | Yes | เปิด/ปิดรับสมัคร register-support |
| `value.updatedAt` | Date | Yes | วันที่แก้ไขล่าสุด |
| `value.updatedBy` | String | No | userId ของ admin ที่แก้ไข |

---

## Naming Convention

| Prefix | Collection | คำอธิบาย |
|---|---|---|
| `reg100_` | register100_submissions | Field ของโรงเรียนดนตรีไทย 100% |
| `regsup_` | register_support_submissions | Field ของโรงเรียนสนับสนุนและส่งเสริม |
| `sup_` | (nested object) | Field ภายใน supportFactors array |
| ไม่มี prefix | users, certificates, drafts | Collection อื่นๆ |

> หมายเหตุ: field บางตัวใน submission มีทั้งแบบมี prefix และไม่มี prefix เก็บไว้คู่กัน เพื่อ backward compatibility กับ code เก่า

---

## Relationships

```
users.schoolId ──────────────────► register100_submissions.schoolId
                                   register_support_submissions.schoolId

certificates.schoolId ───────────► register100_submissions.schoolId
                                   register_support_submissions.schoolId

certificates.templateName ───────► certificate_templates.name

users._id (createdBy) ───────────► certificates.createdBy
                                   certificate_templates.deletedBy
```

> MongoDB ไม่มี foreign key — relationship เป็น application-level reference ผ่าน `schoolId` (String) และ `templateName` (String)
