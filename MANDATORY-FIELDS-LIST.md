# Mandatory Fields List - Register100 Form

## สรุป Required Fields ที่มี * (Mandatory)

---

## Step 1: ข้อมูลพื้นฐาน

### ข้อมูลโรงเรียน:
- ✅ **ชื่อสถานศึกษา** * (schoolName)
- ✅ **จังหวัด** * (schoolProvince)
- ✅ **ระดับการศึกษา** * (schoolLevel)
- ✅ **สังกัด** * (affiliation)
- ⚪ **ขนาดโรงเรียน** (schoolSize) - Auto-calculated from studentCount
- ✅ **จำนวนบุคลากร** * (staffCount)
- ✅ **จำนวนนักเรียน** * (studentCount)

### สถานที่ตั้ง:
- ✅ **เลขที่** * (addressNo)
- ⚪ หมู่ (moo) - Optional
- ⚪ ถนน (road) - Optional
- ✅ **ตำบล/แขวง** * (subDistrict)
- ✅ **อำเภอ/เขต** * (district)
- ✅ **จังหวัด** * (provinceAddress)
- ✅ **รหัสไปรษณีย์** * (postalCode)
- ✅ **โทรศัพท์** * (phone)
- ⚪ โทรสาร (fax) - Optional

**Total Required: 13 fields** (ขนาดโรงเรียนคำนวณอัตโนมัติ)

---

## Step 2: ผู้บริหารสถานศึกษา

- ✅ **ชื่อ-นามสกุล** * (mgtFullName)
- ✅ **ตำแหน่ง** * (mgtPosition)
- ✅ **ที่อยู่** * (mgtAddress)
- ✅ **โทรศัพท์** * (mgtPhone)
- ✅ **อีเมล** * (mgtEmail)
- ⚪ รูปภาพผู้บริหาร (mgtImage) - Optional

**Total Required: 5 fields**

---

## Step 3: แผนการสอนดนตรีไทย

### สภาวการณ์การเรียนการสอน:
- ✅ **อย่างน้อย 1 รายการ** * (currentMusicTypes)
  - ระดับชั้น *
  - รายละเอียด *

### แผนการจัดการเรียนการสอนในอนาคต:
- ✅ **อย่างน้อย 1 รายการ** * (futureMusicPlans)
  - ระดับชั้น *
  - รายละเอียด *

**Total Required: 2 arrays (minimum 1 item each)**

---

## Step 4: ผู้สอนดนตรีไทย

### การเรียนการสอน (Checkboxes):
- ⚪ วิชาบังคับ (isCompulsorySubject) - Optional
- ⚪ หลังเลิกเรียน (hasAfterSchoolTeaching) - Optional
- ⚪ วิชาเลือก (hasElectiveSubject) - Optional
- ⚪ หลักสูตรท้องถิ่น (hasLocalCurriculum) - Optional

### ครูผู้สอน:
- ✅ **อย่างน้อย 1 คน** * (thaiMusicTeachers)
  - ชื่อ-นามสกุล *
  - ✅ **คุณลักษณะ (Dropdown)** * - MANDATORY
    - ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย
    - ครูภูมิปัญญาในท้องถิ่น
    - ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย
    - วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน
  - รูปภาพ (Optional)

**Total Required: 1 array (minimum 1 teacher with qualification)**

**⚠️ Important:** คุณลักษณะครู (teacherQualification) เป็น MANDATORY - ห้าม submit ค่า default

---

## Step 5: ปัจจัยสนับสนุน

### การสนับสนุนจากต้นสังกัด:
- ⚪ มีการสนับสนุน (hasSupportFromOrg) - Optional checkbox

### การสนับสนุนจากภายนอก:
- ⚪ มีการสนับสนุน (hasSupportFromExternal) - Optional checkbox
- ⚪ รายการสนับสนุน (supportFromExternal) - Optional array

### รางวัลและเกียรติคุณ:
- ⚪ รายการรางวัล (awards) - Optional array
  - ชื่อรางวัล
  - ✅ **ระดับรางวัล (Dropdown)** * - MANDATORY (ถ้ามีรางวัล)
    - อำเภอ (5 คะแนน)
    - จังหวัด (10 คะแนน)
    - ภาค (15 คะแนน)
    - ประเทศ (20 คะแนน)
  - หน่วยงานที่มอบ
  - วันที่ได้รับ

**Total Required: 0 (all optional, but if awards exist, level is mandatory)**

**⚠️ Important:** ระดับรางวัล (awardLevel) เป็น MANDATORY ถ้ามีการเพิ่มรางวัล - ห้าม submit ค่า default

---

## Step 6: ภาพถ่ายและวิดีโอ

- ⚪ ลิงก์ภาพถ่าย (photoGalleryLink) - Optional
- ⚪ วิดีโอการเรียนการสอน (videoLink) - Optional
- ⚪ วิดีโอการแสดงผลงาน (performance videos) - Optional

**Total Required: 0 fields (all optional)**

---

## Step 7: กิจกรรม

### กิจกรรมภายในจังหวัด (ภายในโรงเรียน):
- ⚪ รายการกิจกรรม (activitiesWithinProvinceInternal) - Optional array

### กิจกรรมภายในจังหวัด (ภายนอกโรงเรียน):
- ⚪ รายการกิจกรรม (activitiesWithinProvinceExternal) - Optional array

### กิจกรรมภายนอกจังหวัด:
- ⚪ รายการกิจกรรม (activitiesOutsideProvince) - Optional array

**Total Required: 0 fields (all optional)**

---

## Step 8: การประชาสัมพันธ์

### ช่องทางประชาสัมพันธ์:
- ⚪ Facebook (DCP_PR_Channel_FACEBOOK) - Optional checkbox
- ⚪ YouTube (DCP_PR_Channel_YOUTUBE) - Optional checkbox
- ⚪ TikTok (DCP_PR_Channel_Tiktok) - Optional checkbox
- ⚪ Website (DCP_PR_Channel_Website) - Optional checkbox

### รายการกิจกรรม PR:
- ⚪ รายการ PR (prActivities) - Optional array

### ทราบข่าวจาก:
- ⚪ สำนักงานวัฒนธรรมจังหวัด (heardFromCulturalOffice) - Optional
- ⚪ สำนักงานเขตพื้นที่การศึกษา (heardFromEducationArea) - Optional
- ⚪ โรงเรียนอื่น (heardFromSchool) - Optional
- ⚪ อื่นๆ (heardFromOther) - Optional

### การรับรอง:
- ✅ **ยืนยันความถูกต้อง** * (certifiedINFOByAdminName) - Checkbox

**Total Required: 1 field (certification checkbox)**

---

## สรุปรวม Mandatory Fields

### จำนวน Required Fields ทั้งหมด:

| Step | Required Fields | Notes |
|------|----------------|-------|
| Step 1 | 14 fields | ข้อมูลพื้นฐานและที่อยู่ |
| Step 2 | 5 fields | ข้อมูลผู้บริหาร |
| Step 3 | 2 arrays | แผนการสอน (min 1 item each) |
| Step 4 | 1 array + dropdown | ครูผู้สอน (min 1 teacher) + คุณลักษณะ * |
| Step 5 | 0 fields | ทั้งหมด optional (แต่ dropdown level * ถ้ามีรางวัล) |
| Step 6 | 0 fields | ทั้งหมด optional |
| Step 7 | 0 fields | ทั้งหมด optional |
| Step 8 | 1 field | Certification checkbox |

**Total: 22 required fields + 2 mandatory dropdowns (conditional)**

---

## Mandatory Dropdowns (ห้าม Submit ค่า Default)

### 1. Step 4: คุณลักษณะครู (teacherQualification) *
**Status:** MANDATORY for each teacher
**Default Value:** "เลือกคุณลักษณะ" (ห้าม submit)
**Options:**
- ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย
- ครูภูมิปัญญาในท้องถิ่น
- ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย
- วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน

**Validation:**
```typescript
// ตรวจสอบว่าทุกครูมีคุณลักษณะ
if (teacher.teacherQualification === '' || !teacher.teacherQualification) {
  errors.push(`ครูคนที่ ${index + 1}: กรุณาเลือกคุณลักษณะ`);
}
```

### 2. Step 5: ระดับรางวัล (awardLevel) *
**Status:** MANDATORY if awards exist
**Default Value:** "เลือกระดับรางวัล" (ห้าม submit)
**Options:**
- อำเภอ (5 คะแนน)
- จังหวัด (10 คะแนน)
- ภาค (15 คะแนน)
- ประเทศ (20 คะแนน)

**Validation:**
```typescript
// ตรวจสอบว่าทุกรางวัลมีระดับ
if (award.awardLevel === '' || !award.awardLevel) {
  errors.push(`รางวัลที่ ${index + 1}: กรุณาเลือกระดับรางวัล`);
}
```

---

## Auto-Generated Fields (ไม่ต้องกรอก)

- ✅ **School ID** - สร้างอัตโนมัติ (SCH-YYYYMMDD-XXXX)
- ✅ **Created At** - Timestamp อัตโนมัติ
- ✅ **Submitted At** - Timestamp อัตโนมัติ
- ✅ **Status** - Default: "pending"
- ✅ **Total Score** - คำนวณอัตโนมัติ (0-100)
- ✅ **Score Breakdown** - คำนวณอัตโนมัติ
  - teacher_training_score (0-20)
  - teacher_qualification_score (0-20)
  - support_from_org_score (0-5)
  - support_from_external_score (0-15)
  - award_score (0-20)
  - activity_within_province_internal_score (0-5)
  - activity_within_province_external_score (0-5)
  - activity_outside_province_score (0-5)
  - pr_activity_score (0-5)

---

## Validation Rules

### Text Fields:
- ⚠️ No max length validation (accepts 10,000+ characters)
- ⚠️ No special character sanitization
- ⚠️ SQL injection vulnerable
- ⚠️ XSS vulnerable

### Email:
- ⚠️ No email format validation

### Phone:
- ⚠️ No phone format validation

### File Upload:
- ⚠️ Accepts non-image files (.txt, .pdf, etc.)
- ⚠️ No file size limit enforced
- Recommended: Images only, max 2MB per file

### Arrays:
- Minimum 1 item for:
  - currentMusicTypes (Step 3)
  - futureMusicPlans (Step 3)
  - thaiMusicTeachers (Step 4)

---

## Checklist สำหรับการ Submit

### ✅ ข้อมูลพื้นฐาน (Step 1):
- [ ] ชื่อสถานศึกษา
- [ ] จังหวัด
- [ ] ระดับการศึกษา
- [ ] สังกัด
- [ ] ขนาดโรงเรียน
- [ ] จำนวนบุคลากร
- [ ] จำนวนนักเรียน
- [ ] ที่อยู่ครบถ้วน (เลขที่, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์)
- [ ] โทรศัพท์

### ✅ ผู้บริหาร (Step 2):
- [ ] ชื่อ-นามสกุล
- [ ] ตำแหน่ง
- [ ] ที่อยู่
- [ ] โทรศัพท์
- [ ] อีเมล

### ✅ แผนการสอน (Step 3):
- [ ] สภาวการณ์ปัจจุบัน (อย่างน้อย 1 รายการ)
- [ ] แผนอนาคต (อย่างน้อย 1 รายการ)

### ✅ ครูผู้สอน (Step 4):
- [ ] มีครูอย่างน้อย 1 คน
- [ ] ✅ **ทุกครูต้องเลือกคุณลักษณะ** (ห้าม submit ค่า default)

### ✅ รางวัล (Step 5 - ถ้ามี):
- [ ] ✅ **ทุกรางวัลต้องเลือกระดับ** (ห้าม submit ค่า default)

### ✅ การรับรอง (Step 8):
- [ ] ✅ **ติ๊กยืนยันความถูกต้อง**

---

## สรุป

**Total Mandatory Fields:** 22 fields + 2 conditional dropdowns
**Validation:** Basic HTML5 required attribute
**Security:** ⚠️ Needs improvement (SQL injection, XSS, file upload)
**Score Calculation:** ✅ Automatic (0-100 points)
**School ID:** ✅ Auto-generated (SCH-YYYYMMDD-XXXX)
