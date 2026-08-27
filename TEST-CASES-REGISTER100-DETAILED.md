# Test Cases Register100 - ฉบับละเอียด

**System**: ระบบลงทะเบียนโครงการโรงเรียนดนตรีไทย 100% การันตี  
**Version**: 1.0  
**Last Updated**: July 28, 2026  
**Test Environment**: Local Development (`http://localhost:3000/regist100`)

---

## สารบัญ

1. [ข้อมูลทั่วไป](#ข้อมูลทั่วไป)
2. [การเตรียมสภาพแวดล้อมการทดสอบ](#การเตรียมสภาพแวดล้อมการทดสอบ)
3. [Test Cases แบบละเอียด](#test-cases-แบบละเอียด)
4. [ระบบคำนวณคะแนน](#ระบบคำนวณคะแนน)
5. [การตรวจสอบคุณภาพข้อมูล](#การตรวจสอบคุณภาพข้อมูล)
6. [Automated Test Scripts](#automated-test-scripts)

---

## ข้อมูลทั่วไป

### วัตถุประสงค์
ทดสอบระบบลงทะเบียนโรงเรียนดนตรีไทย 100% การันตี ให้ครอบคลุมทั้ง 9 ขั้นตอน

### ขอบเขตการทดสอบ
- ✅ การกรอกแบบฟอร์มทั้ง 9 ขั้นตอน
- ✅ ระบบคำนวณคะแนน Part 1 (max 100 คะแนน)
- ✅ การอัปโหลดรูปภาพ (ผู้บริหาร + ครู)
- ✅ ระบบ OTP verification
- ✅ ระบบ Save Draft
- ✅ การ Validation ข้อมูล
- ✅ การสร้างบัญชีครูและส่งอีเมล

### คะแนนรวมสูงสุด
```
Part 1 (ป้อนโดยโรงเรียน): 100 คะแนน
Part 2 (ป้อนโดย Admin): 100 คะแนน
Total: 200 คะแนน
```

### ระดับเกรด
| คะแนน | เกรด |
|-------|------|
| 180+ | A |
| 160-179 | B+ |
| 140-159 | B |
| 120-139 | C+ |
| 100-119 | C |
| 80-99 | D+ |
| 60-79 | D |
| < 60 | F |

---

## การเตรียมสภาพแวดล้อมการทดสอบ

### 1. Start Development Server
```bash
npm run dev
# หรือ
yarn dev
```

### 2. เตรียมรูปภาพทดสอบ
```bash
# วางไฟล์รูปภาพใน public/
public/manager.jpg       # รูปผู้บริหาร (< 1MB, JPG/PNG)
public/teacher1.jpg      # รูปครู 1
public/teacher2.jpg      # รูปครู 2
public/teacher3.jpg      # รูปครู 3
public/teacher4.jpg      # รูปครู 4
public/teacher5.jpg      # รูปครู 5
```

### 3. ตรวจสอบ MongoDB Connection
```bash
# ตรวจสอบการเชื่อมต่อ MongoDB
# Database: thai_music_school
# Collections: register100_submissions, register100_drafts, schools, users
```

### 4. เตรียมข้อมูลทดสอบ

#### Test Email
```
unicornmax@gmail.com
```

#### Test Phone Number
```
0899297983
```

---

## Test Cases แบบละเอียด

### TC-R100-001: ลงทะเบียนสำเร็จแบบครบถ้วน 9 ขั้นตอน (Happy Path - 5 ครู)

**Priority**: Critical  
**Type**: Functional  
**Duration**: ~4 minutes  
**Automated**: ✅ Yes (`tests/register100-full-fields.spec.ts`)

---

#### STEP 1: ข้อมูลพื้นฐานโรงเรียน

**หน้าจอ**: `/regist100` (Step 1/9)

**Pre-conditions**:
1. เข้าหน้าลงทะเบียน
2. Modal PDPA Consent ปรากฏขึ้น

**Test Steps**:

##### 1.1 ยอมรับ PDPA Consent
| Action | Field/Button | Value | Validation |
|--------|--------------|-------|------------|
| Click | ปุ่ม "ยอมรับ" | - | ✅ Modal ปิด |

##### 1.2 กรอกข้อมูลโรงเรียน
| Field | Type | Value | Required | Validation |
|-------|------|-------|----------|------------|
| ชื่อสถานศึกษา | Text | โรงเรียนทดสอบ Register100 Full Fields Complete | ✅ | - |
| จังหวัด | Dropdown | กรุงเทพมหานคร | ✅ | - |
| ระดับการศึกษา | Radio | มัธยมศึกษา | ✅ | - |
| สังกัด | Dropdown | กระทรวงศึกษาธิการ | ✅ | - |
| สังกัด (รายละเอียด) | Text | สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา กรุงเทพมหานคร | ✅ | - |
| จำนวนบุคลากร | Number | 120 | ✅ | > 0 |
| จำนวนนักเรียน | Number | 1800 | ✅ | > 0 |
| จำนวนนักเรียนแยกตามชั้น | Textarea | ม.1: 300 คน, ม.2: 300 คน, ม.3: 300 คน, ม.4: 300 คน, ม.5: 300 คน, ม.6: 300 คน | ✅ | - |

##### 1.3 กรอกที่อยู่โรงเรียน
| Field | Type | Value | Required |
|-------|------|-------|----------|
| เลขที่ | Text | 999 | ✅ |
| หมู่ | Text | 7 | ❌ |
| ถนน | Text | ถนนเต็มรูปแบบทดสอบ | ❌ |
| ตำบล/แขวง | Text | บางซื่อ | ✅ |
| อำเภอ/เขต | Text | บางซื่อ | ✅ |
| จังหวัด | Text | กรุงเทพมหานคร | ✅ |
| รหัสไปรษณีย์ | Text | 10800 | ✅ |
| เบอร์โทรศัพท์ | Text | 0823456789 | ✅ |
| โทรสาร | Text | 0223456789 | ❌ |

##### 1.4 คลิก "ขั้นต่อไป"

**Expected Result**:
- ✅ ข้อมูลถูกบันทึกใน localStorage
- ✅ ไม่มี Validation Error Modal
- ✅ เปลี่ยนไปยัง Step 2/9
- ✅ Progress bar แสดง 2/9

---

#### STEP 2: ข้อมูลผู้บริหาร

**หน้าจอ**: `/regist100` (Step 2/9)

**Test Steps**:

##### 2.1 กรอกข้อมูลผู้บริหาร
| Field | Type | Value | Required | Validation |
|-------|------|-------|----------|------------|
| ชื่อ-นามสกุล | Text | นายผู้บริหารเต็มรูปแบบ ทดสอบครบถ้วน | ✅ | - |
| ตำแหน่ง | Text | ผู้อำนวยการโรงเรียน | ✅ | - |
| ที่อยู่ | Textarea | 999 หมู่ 7 ถนนเต็มรูปแบบทดสอบ บางซื่อ กรุงเทพมหานคร 10800 | ✅ | - |
| เบอร์โทรศัพท์ | Text | 0899297983 | ✅ | 10 หลัก |
| อีเมล | Text | unicornmax@gmail.com | ✅ | Email format |

##### 2.2 อัปโหลดรูปภาพผู้บริหาร
| Action | Details | Expected |
|--------|---------|----------|
| Upload | manager.jpg (< 1MB) | ✅ Preview แสดง |
| Validate | File size > 1MB | ❌ Error: "ขนาดไฟล์เกิน 1MB" |
| Validate | File type .pdf | ❌ Error: "กรุณาเลือกไฟล์รูปภาพ" |

##### 2.3 คลิก "ขั้นต่อไป"

**Expected Result**:
- ✅ รูปภาพถูกบันทึก
- ✅ ไปยัง Step 3/9

---

#### STEP 3: สภาวการณ์การเรียนการสอน

**หน้าจอ**: `/regist100` (Step 3/9)

**Test Steps**:

##### 3.1 เพิ่มรายการดนตรีไทยที่สอน (reg100_currentMusicTypes)
| Index | Field | Value |
|-------|-------|-------|
| [0].grade | ม.1-6 |
| [0].details | การเรียนการสอนดนตรีไทยขั้นพื้นฐาน |

**Actions**:
- ➕ สามารถคลิก "+ เพิ่มรายการดนตรีไทยที่สอน" เพื่อเพิ่มเติมได้
- 🗑️ สามารถคลิก "ลบ" เพื่อลบรายการได้

##### 3.2 เพิ่มเครื่องดนตรีที่มี (reg100_readinessItems)
| Index | Field | Value |
|-------|-------|-------|
| [0].instrumentName | ขิม |
| [0].quantity | 10 |
| [0].note | สภาพดี |

**Actions**:
- ➕ คลิก "+ เพิ่มเครื่องดนตรี" เพื่อเพิ่มรายการอื่น

##### 3.3 คลิก "ขั้นต่อไป"

**Expected Result**:
- ✅ ข้อมูลถูกบันทึก
- ✅ ไปยัง Step 4/9

---

#### STEP 4: ข้อมูลครูดนตรีไทย (9 ท่าน)

**หน้าจอ**: `/regist100` (Step 4/9)  
**Note**: ✨ **Step นี้สำคัญที่สุด - มีผลต่อคะแนนคุณวุฒิครู (max 20 คะแนน)**

**Test Steps**:

##### 4.1 กรอกข้อมูลครูท่านที่ 1

**Field Prefix**: `reg100_thaiMusicTeachers.0`

| Field | Type | Value | Required | Note |
|-------|------|-------|----------|------|
| teacherQualification | Radio | ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย | ✅ | **มีผลต่อคะแนน** |
| teacherFullName | Text | ครูเต็มรูปแบบ 1 | ✅ | - |
| teacherPosition | Text | หัวหน้ากลุ่มสาระดนตรีไทย | ✅ | - |
| teacherEmail | Email | unicornmax@gmail.com | ✅ | ต้องไม่ซ้ำกับที่มีในระบบ |
| teacherPhone | Text | 0899297983 | ✅ | 10 หลัก |
| teacherAbility | Textarea | เชี่ยวชาญระนาดเอก ซังน้อย ขลุ่ยเพียงออ | ✅ | - |

##### 4.2 อัปโหลดรูปครูท่านที่ 1
| Action | Details | Expected |
|--------|---------|----------|
| Upload | teacher1.jpg (< 1MB) | ✅ Preview แสดง |

##### 4.3 การศึกษาด้านดนตรีไทย (musicInstituteEducation)
| Field | Value | Note |
|-------|-------|------|
| isFromMusicInstitute | ✅ Yes | Radio |
| [0].graduationYear | 2548 | - |
| [0].major | ดนตรีไทย | **มีผลต่อคะแนน** |
| [0].completionYear | 2548 | - |

**หมายเหตุ**: 
- ✅ ถ้าเลือก "ไม่ได้เรียนจากสถาบันการศึกษาดนตรีไทย" จะไม่แสดง form
- ➕ สามารถเพิ่มการศึกษาหลายรายการได้

##### 4.4 การศึกษาด้านอื่น (otherEducation)
| Action | Details |
|--------|---------|
| Click | "+ เพิ่มการศึกษาด้านอื่น" |
| Fill | graduationYear, major, completionYear |

##### 4.5 เพิ่มครูท่านที่ 2-5

**Action**: คลิก "**+ เพิ่มครูผู้สอนดนตรีไทยคนต่อไป**"

**ครูท่านที่ 2**:
| Field | Value |
|-------|-------|
| teacherQualification | ครูภูมิปัญญาในท้องถิ่น |
| teacherFullName | ครูเต็มรูปแบบ 2 |
| teacherPosition | ครูดนตรีไทย |
| major | ดนตรีพื้นเมือง |

**ครูท่านที่ 3**:
| Field | Value |
|-------|-------|
| teacherQualification | ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย |
| teacherFullName | ครูเต็มรูปแบบ 3 |
| teacherPosition | ครูพิเศษ |
| major | ดนตรีไทยศึกษา |

**ครูท่านที่ 4**:
| Field | Value |
|-------|-------|
| teacherQualification | วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน |
| teacherFullName | ครูเต็มรูปแบบ 4 |
| teacherPosition | วิทยากรพิเศษ |
| major | ดนตรีจำกัด |

**ครูท่านที่ 5**:
| Field | Value |
|-------|-------|
| teacherQualification | ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย |
| teacherFullName | ครูเต็มรูปแบบ 5 |
| teacherPosition | ครูดนตรีไทยอาวุโส |
| major | ดนตรีไทยประยุกต์ |

##### 4.6 ตารางเรียนในชั้นเรียน (inClassInstructionDurations)
| Field | Value |
|-------|-------|
| [0].inClassGradeLevel | ม.1-6 |
| [0].inClassStudentCount | 1800 |
| [0].inClassHoursPerSemester | 40 |
| [0].inClassHoursPerYear | 80 |

##### 4.7 ตารางเรียนนอกชั้นเรียน (outOfClassInstructionDurations)
| Field | Value |
|-------|-------|
| [0].outDay | พุธ |
| [0].outTimeFrom | 15:00 |
| [0].outTimeTo | 17:00 |
| [0].outLocation | ห้องดนตรีไทย อาคาร 2 |

##### 4.8 คลิก "ขั้นต่อไป"

**Expected Result**:
- ✅ ครู 5 ท่านถูกบันทึก
- ✅ รูปภาพครูถูกอัปโหลด
- ✅ **คำนวณคะแนนคุณวุฒิครู (20 คะแนน)**: เนื่องจากมี 5 major ที่ต่างกัน
- ✅ ไปยัง Step 5/9

**การคำนวณคะแนนคุณวุฒิครู (Teacher Qualification Score)**:
```javascript
// Logic: นับจำนวน major ที่ไม่ซ้ำกัน
unique_majors = ["ดนตรีไทย", "ดนตรีพื้นเมือง", "ดนตรีไทยศึกษา", "ดนตรีจำกัด", "ดนตรีไทยประยุกต์"]
count = 5

if (count >= 4) score = 20
else if (count === 3) score = 15
else if (count === 2) score = 10
else score = 5

// ผลลัพธ์: 20 คะแนน
```

---

#### STEP 5: หลักสูตรและการสอน

**หน้าจอ**: `/regist100` (Step 5/9)  
**Note**: ✨ **มีผลต่อคะแนนหลักสูตร (max 20 คะแนน)**

**Test Steps**:

##### 5.1 เลือกหลักสูตร (Checkboxes)
| Checkbox | Value | คะแนน |
|----------|-------|-------|
| ☑ วิชาบังคับ (isCompulsorySubject) | ✅ | 5 คะแนน |
| ☑ วิชาเลือก (hasElectiveSubject) | ✅ | 5 คะแนน |
| ☑ หลักสูตรท้องถิ่น (hasLocalCurriculum) | ✅ | 5 คะแนน |
| ☑ การสอนนอกเวลา (hasAfterSchoolTeaching) | ✅ | 5 คะแนน |

**การคำนวณคะแนน**:
```javascript
score = (checkboxes_checked * 5)
// 4 checkboxes × 5 = 20 คะแนน
```

##### 5.2 กรอกตารางวิชาบังคับ (compulsoryCurriculum)
| Field | Value |
|-------|-------|
| [0].gradeLevel | ม.1-6 |
| [0].studentCount | 1800 |
| [0].hoursPerSemester | 40 |
| [0].hoursPerYear | 80 |

##### 5.3 กรอกตารางวิชาเลือก (electiveCurriculum)
| Field | Value |
|-------|-------|
| [0].gradeLevel | ม.4-6 |
| [0].studentCount | 900 |
| [0].hoursPerSemester | 20 |
| [0].hoursPerYear | 40 |

##### 5.4 กรอกตารางหลักสูตรท้องถิ่น (localCurriculum)
| Field | Value |
|-------|-------|
| [0].gradeLevel | ม.1-3 |
| [0].studentCount | 900 |
| [0].hoursPerSemester | 15 |
| [0].hoursPerYear | 30 |

##### 5.5 กรอกตารางเรียนนอกเวลา (afterSchoolSchedule)
| Field | Value |
|-------|-------|
| [0].day | พุธ |
| [0].timeFrom | 15:00 |
| [0].timeTo | 17:00 |
| [0].location | ห้องดนตรีไทย อาคาร 2 |

##### 5.6 กรอกสถานที่สอน (teachingLocation)
```
ห้องดนตรีไทยพิเศษ อาคาร 2 ชั้น 3 (พื้นที่ 80 ตร.ม.), 
ห้องประชุมใหญ่ (ความจุ 200 ที่นั่ง)
```

##### 5.7 คลิก "ขั้นต่อไป"

**Expected Result**:
- ✅ **คะแนนหลักสูตร: 20** (4 checkboxes)
- ✅ ไปยัง Step 6/9

---

#### STEP 6: การสนับสนุนและรางวัล

**หน้าจอ**: `/regist100` (Step 6/9)  
**Note**: ✨ **มีผลต่อคะแนนสนับสนุน (max 20 คะแนน)**

**Test Steps**:

##### 6.1 ปัจจัยสนับสนุน (supportFactors)
| Field | Value |
|-------|-------|
| [0].sup_supportByAdmin | ผู้บริหารสถานศึกษา |
| [0].sup_supportByDescription | ผู้บริหารให้การสนับสนุนเต็มที่ในการจัดการเรียนการสอนดนตรีไทย มีนโยบายจัดเตรียมงบประมาณเพียงพอ |

##### 6.2 การสนับสนุนจากต้นสังกัด (supportFromOrg)

**Checkbox**: ☑ hasSupportFromOrg

| Field | Value | คะแนน |
|-------|-------|-------|
| [0].organization | สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 1 | **5 คะแนน** |
| [0].details | สนับสนุนงบประมาณในการจัดซื้อเครื่องดนตรีไทย จำนวน 500,000 บาท | - |
| [0].evidenceLink | https://drive.google.com/example-org-support | - |

##### 6.3 การสนับสนุนจากภายนอก (supportFromExternal)

**Checkbox**: ☑ hasSupportFromExternal

| Field | Value | คะแนน |
|-------|-------|-------|
| [0].organization | กรมส่งเสริมวัฒนธรรม กระทรวงวัฒนธรรม | **15 คะแนน** (≥3 รายการ) |
| [0].details | สนับสนุนวิทยากรผู้เชี่ยวชาญ สื่อการสอนดนตรีไทย และงบประมาณในการจัดกิจกรรม | - |
| [0].evidenceLink | https://drive.google.com/example-ext-support-1 | - |

**Note**: เพิ่มรายการให้ครบ 3+ รายการเพื่อได้คะแนนเต็ม 15

##### 6.4 เครื่องดนตรีเพียงพอ

**Radio**: ○ เพียงพอ

| Field | Value |
|-------|-------|
| enoughInstrumentsReason | มีเครื่องดนตรีไทยครบชุดและเพียงพอต่อความต้องการเรียนการสอน |

##### 6.5 กรอบหลักสูตรและผลลัพธ์
| Field | Value |
|-------|-------|
| curriculumFramework | หลักสูตรดนตรีไทยบูรณาการ เน้นการเรียนรู้เชิงปฏิบัติ ผสมผสานทฤษฎีและนวัตกรรม เชื่อมโยงกับภูมิปัญญาท้องถิ่น |
| learningOutcomes | นักเรียนสามารถเล่นเครื่องดนตรีไทยได้อย่างน้อย 5 ชิ้น มีความเข้าใจในประวัติศาสตร์และวัฒนธรรมดนตรีไทย |
| managementContext | จัดการเรียนการสอนแบบผสมผสาน ทั้งในห้องเรียนและนอกห้องเรียน มีการแสดงในงานประเพณีต่างๆ |

##### 6.6 คลิก "ขั้นต่อไป"

**Expected Result**:
- ✅ **คะแนนสนับสนุนต้นสังกัด: 5**
- ✅ **คะแนนสนับสนุนภายนอก: 15** (≥3 รายการ)
- ✅ ไปยัง Step 7/9

---

#### STEP 7: รางวัล

**หน้าจอ**: `/regist100` (Step 7/9)  
**Note**: ✨ **มีผลต่อคะแนนรางวัล (max 20 คะแนน)**

**Test Steps**:

##### 7.1 เพิ่มรางวัล (awards)

| Field | Value | คะแนน |
|-------|-------|-------|
| [0].awardLevel | ประเทศ | **20 คะแนน** |
| [0].awardName | รางวัลโรงเรียนดีเด่นด้านดนตรีไทยระดับประเทศ ประจำปี 2568 | - |
| [0].awardDate | 2025-12-15 | - |
| [0].awardEvidenceLink | https://drive.google.com/example-national-award | - |

**การคำนวณคะแนนรางวัล**:
```javascript
// Logic: ใช้คะแนนระดับสูงสุด
if (level === "ประเทศ") score = 20
else if (level === "ภาค") score = 15
else if (level === "จังหวัด") score = 10
else if (level === "อำเภอ") score = 5
else score = 0

// ผลลัพธ์: 20 คะแนน
```

##### 7.2 ลิงก์รูปภาพและวิดีโอ
| Field | Value | Note |
|-------|-------|------|
| photoGalleryLink | https://drive.google.com/drive/folders/school-thai-music-photos | Google Drive |
| videoLink | https://youtube.com/watch?v=school-thai-music-classroom | YouTube |
| videoLink2 | https://youtube.com/watch?v=school-thai-music-performance | YouTube |

##### 7.3 คลิก "ขั้นต่อไป"

**Expected Result**:
- ✅ **คะแนนรางวัล: 20** (ระดับประเทศ)
- ✅ ไปยัง Step 8/9

---

#### STEP 8: กิจกรรม

**หน้าจอ**: `/regist100` (Step 8/9)  
**Note**: ✨ **มีผลต่อคะแนนกิจกรรม (max 15 คะแนน)**

**Test Steps**:

##### 8.1 กิจกรรมภายในจังหวัด (ภายใน) - activitiesWithinProvinceInternal

**เพิ่มรายการที่ 1**:
| Field | Value |
|-------|-------|
| [0].activityName | การแสดงดนตรีไทยในงานวันสถาปนาโรงเรียน |
| [0].activityDate | 15/03/2567 |
| [0].evidenceLink | https://example.com/internal-1 |

**เพิ่มรายการที่ 2** (คลิก "+ เพิ่มข้อมูล"):
| Field | Value |
|-------|-------|
| [1].activityName | การแสดงดนตรีไทยในงานประจำปี ครั้งที่ 2 |
| [1].activityDate | 17/05/2567 |
| [1].evidenceLink | https://example.com/internal-2 |

**เพิ่มรายการที่ 3**:
| Field | Value |
|-------|-------|
| [2].activityName | การแสดงดนตรีไทยในงานประจำปี ครั้งที่ 3 |
| [2].activityDate | 19/07/2567 |
| [2].evidenceLink | https://example.com/internal-3 |

**คะแนน**: ≥3 รายการ = **5 คะแนน**

##### 8.2 กิจกรรมภายในจังหวัด (ภายนอก) - activitiesWithinProvinceExternal

**เพิ่ม 3 รายการ** (วิธีเดียวกัน):
- การแสดงดนตรีไทยในงานประเพณีจังหวัด
- การแสดงดนตรีไทยนอกสถานศึกษา ครั้งที่ 2
- การแสดงดนตรีไทยนอกสถานศึกษา ครั้งที่ 3

**คะแนน**: ≥3 รายการ = **5 คะแนน**

##### 8.3 กิจกรรมนอกจังหวัด - activitiesOutsideProvince

**เพิ่ม 3 รายการ**:
- การแสดงดนตรีไทยในงานมหกรรมดนตรีไทยแห่งชาติ
- การแสดงดนตรีไทยระดับชาติ ครั้งที่ 2
- การแสดงดนตรีไทยระดับชาติ ครั้งที่ 3

**คะแนน**: ≥3 รายการ = **5 คะแนน**

##### 8.4 คลิก "ขั้นต่อไป"

**Expected Result**:
- ✅ **คะแนนกิจกรรมภายใน (ภายใน): 5**
- ✅ **คะแนนกิจกรรมภายใน (ภายนอก): 5**
- ✅ **คะแนนกิจกรรมนอกจังหวัด: 5**
- ✅ **รวมคะแนนกิจกรรม: 15**
- ✅ ไปยัง Step 9/9

---

#### STEP 9: ประชาสัมพันธ์และยืนยัน

**หน้าจอ**: `/regist100` (Step 9/9)  
**Note**: ✨ **มีผลต่อคะแนน PR (5 คะแนน)**

**Test Steps**:

##### 9.1 กิจกรรมประชาสัมพันธ์ (prActivities)

**เพิ่มรายการที่ 1**:
| Field | Value |
|-------|-------|
| [0].activityName | เผยแพร่ผลงานดนตรีไทยทางสื่อออนไลน์ ครั้งที่ 1 |
| [0].platform | Facebook, YouTube, TikTok |
| [0].publishDate | 30/03/2567 |
| [0].evidenceLink | https://facebook.com/school-thai-music-1 |

**เพิ่มรายการที่ 2-3** (เพื่อให้ได้คะแนนเต็ม 5)

**คะแนน**: ≥3 รายการ = **5 คะแนน**

##### 9.2 ช่องทางการรับรู้ (Checkboxes)
| Checkbox | Value |
|----------|-------|
| ☑ Facebook | DCP_PR_Channel_FACEBOOK |
| ☑ YouTube | DCP_PR_Channel_YOUTUBE |
| ☑ TikTok | DCP_PR_Channel_Tiktok |

##### 9.3 รับรู้จาก (Multiple Sources)

**โรงเรียน**:
| Field | Value |
|-------|-------|
| ☑ heardFromSchool | ✅ |
| heardFromSchoolName | โรงเรียนมัธยมดนตรีไทยต้นแบบ |
| step8-amphoe | บางซื่อ |
| step8-province | กรุงเทพมหานคร |

**สำนักงานวัฒนธรรมจังหวัด**:
| Field | Value |
|-------|-------|
| ☑ heardFromCulturalOffice | ✅ |
| heardFromCulturalOfficeName | สำนักงานวัฒนธรรมจังหวัดกรุงเทพมหานคร |

**สำนักงานเขตพื้นที่การศึกษา**:
| Field | Value |
|-------|-------|
| ☑ heardFromEducationArea | ✅ |
| heardFromEducationAreaName | สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 1 |

**อื่นๆ**:
| Field | Value |
|-------|-------|
| ☑ heardFromOther | ✅ |
| heardFromOtherDetail | สมาคมครูดนตรีไทยแห่งประเทศไทย |

##### 9.4 ปัญหา อุปสรรค และข้อเสนอแนะ
| Field | Value |
|-------|-------|
| obstacles | ขาดแคลนเครื่องดนตรีไทยคุณภาพสูง งบประมาณไม่เพียงพอ ต้องการพัฒนาทักษะครูเพิ่มเติม |
| suggestions | ควรมีการสนับสนุนงบประมาณอย่างต่อเนื่อง จัดการอบรมครูสม่ำเสมอ สร้างเครือข่ายความร่วมมือ |

##### 9.5 รับรองความถูกต้อง
| Checkbox | Value |
|----------|-------|
| ☑ certifiedByAdmin | ✅ Required |

##### 9.6 คลิก "ส่งแบบฟอร์ม"

**Expected Result**:
- ✅ ตรวจสอบข้อมูลทั้งหมด
- ✅ แสดง Modal กรอกข้อมูลติดต่อครู

---

#### CONTACT MODAL: กรอกข้อมูลติดต่อครู

**Modal Title**: "กรอกข้อมูลติดต่อครู"

**Test Steps**:

| Field | Value | Validation |
|-------|-------|------------|
| Email ครูผู้ลงทะเบียน | unicornmax@gmail.com | Email format, ไม่ซ้ำในระบบ |
| เบอร์โทรครู | 0899297983 | 10 หลัก |

**Action**: คลิก "ยืนยันและส่ง OTP"

**Expected Result**:
- ✅ ตรวจสอบ email ไม่ซ้ำ
- ✅ สร้าง OTP 6 หลัก
- ✅ บันทึก OTP ใน MongoDB (`users` collection)
- ✅ ส่ง OTP ไปที่ email
- ✅ แสดง OTP Modal

---

#### OTP MODAL: ยืนยัน OTP

**Modal Title**: "กรุณากรอกรหัส OTP"

**Test Steps**:

##### 1. ดึง OTP จาก MongoDB
```bash
npm run check:otp -- unicornmax@gmail.com register100
```

**Output Example**:
```
OTP for unicornmax@gmail.com (register100): 123456
Expires at: 2026-07-28T10:35:00.000Z
```

##### 2. กรอก OTP
| Field | Value |
|-------|-------|
| OTP Input | 123456 |

##### 3. คลิก "ยืนยัน"

**Expected Result**:
- ✅ ตรวจสอบ OTP ถูกต้อง
- ✅ OTP ไม่หมดอายุ (< 5 นาที)
- ✅ เริ่ม Process ส่งแบบฟอร์ม

---

#### SUBMISSION PROCESS

**Expected Operations**:

##### 1. คำนวณคะแนน Part 1
```javascript
scores = {
  curriculum: 20,           // Step 5: 4 checkboxes
  teacherQualification: 20, // Step 4: 5 unique majors
  supportOrg: 5,            // Step 6: มีสนับสนุนต้นสังกัด
  supportExternal: 15,      // Step 6: ≥3 รายการภายนอก
  awards: 20,               // Step 7: รางวัลระดับประเทศ
  activitiesInternal: 5,    // Step 8: ≥3 รายการภายใน
  activitiesExternal: 5,    // Step 8: ≥3 รายการภายนอก
  activitiesOutside: 5,     // Step 8: ≥3 รายการนอกจังหวัด
  pr: 5                     // Step 9: ≥3 รายการ PR
}

total_part1 = 100 คะแนน
```

##### 2. สร้าง School ID
```javascript
// Format: DCP-XXXX
// XX = รหัสจังหวัด (01-77)
// XX = เลขลำดับใน MongoDB

Example: DCP-0101, DCP-0102
```

##### 3. บันทึกข้อมูลใน MongoDB

**Collection**: `register100_submissions`

```javascript
{
  school_id: "DCP-0101",
  school_name: "โรงเรียนทดสอบ Register100 Full Fields Complete",
  province: "กรุงเทพมหานคร",
  // ... (all form data)
  
  // Scores
  curriculum_score: 20,
  teacher_qualification_score: 20,
  support_org_score: 5,
  support_external_score: 15,
  awards_score: 20,
  activities_internal_score: 5,
  activities_external_score: 5,
  activities_outside_score: 5,
  pr_score: 5,
  total_score: 100,
  
  video1_score: 0,  // Part 2 (ป้อนโดย Admin)
  video2_score: 0,  // Part 2 (ป้อนโดย Admin)
  
  grade: "A",               // คำนวณจาก total_score
  status: "pending",
  createdAt: ISODate(),
  updatedAt: ISODate()
}
```

##### 4. สร้างบัญชีครู

**Collection**: `users`

```javascript
{
  email: "unicornmax@gmail.com",
  password: bcrypt.hash("random_password_8_chars"),
  role: "school_admin",
  school_id: "DCP-0101",
  phone: "0899297983",
  status: "active",
  createdAt: ISODate(),
  updatedAt: ISODate()
}
```

##### 5. บันทึกโรงเรียนใน Collection `schools`
```javascript
{
  school_id: "DCP-0101",
  school_name: "โรงเรียนทดสอบ Register100 Full Fields Complete",
  province: "กรุงเทพมหานคร",
  type: "register100",
  admin_email: "unicornmax@gmail.com",
  total_score: 100,
  grade: "A",
  status: "active",
  createdAt: ISODate()
}
```

##### 6. ส่งอีเมลข้อมูล Login

**Email Template**:
```
Subject: ข้อมูลการเข้าใช้งานระบบโรงเรียนดนตรีไทย - DCP-0101

เรียน ครูผู้ลงทะเบียน

ท่านได้ลงทะเบียนโรงเรียนดนตรีไทย 100% การันตี สำเร็จแล้ว

รหัสโรงเรียน: DCP-0101
ชื่อโรงเรียน: โรงเรียนทดสอบ Register100 Full Fields Complete
Email: unicornmax@gmail.com
Password: [random_8_chars]

เข้าสู่ระบบที่: https://dcpschool100.net/login
```

##### 7. ลบ Draft (ถ้ามี)
```javascript
// ลบจาก register100_drafts collection
```

##### 8. แสดงหน้า Success

**URL**: `/regist100/success?id=DCP-0101`

**Content**:
```
✅ ลงทะเบียนสำเร็จ!

รหัสโรงเรียน: DCP-0101
คะแนน Part 1: 100/100
เกรด: A (รออัปเดตคะแนน Part 2)

ข้อมูล Login ได้ส่งไปที่อีเมลแล้ว
```

---

### Post-Conditions

**Database State**:
- ✅ มีข้อมูลใน `register100_submissions`
- ✅ มีข้อมูลใน `schools`
- ✅ มีข้อมูลใน `users`
- ✅ Draft ถูกลบ (ถ้ามี)

**Email Sent**:
- ✅ ส่งอีเมล Login credentials

**User Can**:
- ✅ Login ด้วย email/password
- ✅ เข้าหน้า Dashboard ดูคะแนน
- ✅ รอ Admin ป้อนคะแนน Part 2

---

## ระบบคำนวณคะแนน

### Part 1 Score Breakdown (Max 100)

#### 1. คะแนนหลักสูตร (Curriculum Score) - Max 20
```javascript
// Step 5 Checkboxes
let score = 0;
if (isCompulsorySubject) score += 5;
if (hasElectiveSubject) score += 5;
if (hasLocalCurriculum) score += 5;
if (hasAfterSchoolTeaching) score += 5;
// Max: 20
```

#### 2. คะแนนคุณวุฒิครู (Teacher Qualification Score) - Max 20
```javascript
// Step 4: นับจำนวน major ที่ไม่ซ้ำกัน
const uniqueMajors = new Set();
teachers.forEach(t => {
  if (t.isFromMusicInstitute && t.musicInstituteEducation) {
    t.musicInstituteEducation.forEach(edu => {
      if (edu.major) uniqueMajors.add(edu.major);
    });
  }
});

const count = uniqueMajors.size;
let score = 0;
if (count >= 4) score = 20;
else if (count === 3) score = 15;
else if (count === 2) score = 10;
else if (count === 1) score = 5;
```

#### 3. คะแนนสนับสนุนต้นสังกัด (Support Org Score) - Max 5
```javascript
// Step 6: hasSupportFromOrg checkbox
let score = hasSupportFromOrg ? 5 : 0;
```

#### 4. คะแนนสนับสนุนภายนอก (Support External Score) - Max 15
```javascript
// Step 6: supportFromExternal array
const count = supportFromExternal.length;
let score = 0;
if (count >= 3) score = 15;
else if (count === 2) score = 10;
else if (count === 1) score = 5;
```

#### 5. คะแนนรางวัล (Awards Score) - Max 20
```javascript
// Step 7: awards array - ใช้คะแนนสูงสุด
let maxScore = 0;
awards.forEach(award => {
  let score = 0;
  if (award.awardLevel === "ประเทศ") score = 20;
  else if (award.awardLevel === "ภาค") score = 15;
  else if (award.awardLevel === "จังหวัด") score = 10;
  else if (award.awardLevel === "อำเภอ") score = 5;
  
  if (score > maxScore) maxScore = score;
});
```

#### 6. คะแนนกิจกรรมภายใน (Activities Internal Score) - Max 5
```javascript
// Step 8: activitiesWithinProvinceInternal
const count = activitiesWithinProvinceInternal.length;
let score = count >= 3 ? 5 : 0;
```

#### 7. คะแนนกิจกรรมภายนอก (Activities External Score) - Max 5
```javascript
// Step 8: activitiesWithinProvinceExternal
const count = activitiesWithinProvinceExternal.length;
let score = count >= 3 ? 5 : 0;
```

#### 8. คะแนนกิจกรรมนอกจังหวัด (Activities Outside Score) - Max 5
```javascript
// Step 8: activitiesOutsideProvince
const count = activitiesOutsideProvince.length;
let score = count >= 3 ? 5 : 0;
```

#### 9. คะแนน PR (PR Score) - Max 5
```javascript
// Step 9: prActivities
const count = prActivities.length;
let score = count >= 3 ? 5 : 0;
```

### Part 2 Score (ป้อนโดย Admin)

#### Video Scores
- **video1_score**: 0-50 คะแนน (ป้อนโดย DCP Admin)
- **video2_score**: 0-50 คะแนน (ป้อนโดย DCP Admin)

**Total Part 2**: 0-100 คะแนน

### Total Score Calculation
```javascript
total_score = part1_score + video1_score + video2_score
// Max: 100 + 50 + 50 = 200 คะแนน
```

### Grade Calculation
```javascript
function calculateGrade(totalScore) {
  if (totalScore >= 180) return 'A';
  if (totalScore >= 160) return 'B+';
  if (totalScore >= 140) return 'B';
  if (totalScore >= 120) return 'C+';
  if (totalScore >= 100) return 'C';
  if (totalScore >= 80) return 'D+';
  if (totalScore >= 60) return 'D';
  return 'F';
}
```

---

## การตรวจสอบคุณภาพข้อมูล

### Validation Rules

#### Step 1: ข้อมูลพื้นฐาน
| Field | Validation | Error Message |
|-------|------------|---------------|
| school_name | Required, min 3 chars | "กรุณากรอกชื่อสถานศึกษา" |
| province | Required | "กรุณาเลือกจังหวัด" |
| school_level | Required | "กรุณาเลือกระดับการศึกษา" |
| staff_count | Required, > 0 | "กรุณากรอกจำนวนบุคลากร" |
| student_count | Required, > 0 | "กรุณากรอกจำนวนนักเรียน" |
| postal_code | Required, 5 digits | "กรุณากรอกรหัสไปรษณีย์ 5 หลัก" |

#### Step 2: ข้อมูลผู้บริหาร
| Field | Validation | Error Message |
|-------|------------|---------------|
| mgt_email | Required, email format, unique | "กรุณากรอกอีเมลให้ถูกต้อง" |
| mgt_phone | Required, 10 digits | "กรุณากรอกเบอร์โทร 10 หลัก" |
| mgt_image | Optional, max 1MB, image/* | "ขนาดไฟล์เกิน 1MB" |

#### Step 4: ข้อมูลครู
| Field | Validation | Error Message |
|-------|------------|---------------|
| teacher_qualification | Required | "กรุณาเลือกบทบาท/หน้าที่" |
| teacher_email | Required, email format, unique | "อีเมลซ้ำหรือไม่ถูกต้อง" |
| teacher_phone | Required, 10 digits | "กรุณากรอกเบอร์โทร 10 หลัก" |
| teacher_image | Optional, max 1MB, image/* | "ขนาดไฟล์เกิน 1MB" |

#### Step 9: Contact Info
| Field | Validation | Error Message |
|-------|------------|---------------|
| teacher_contact_email | Required, email format, NOT in system | "อีเมลนี้ถูกใช้แล้ว" |
| teacher_contact_phone | Required, 10 digits | "กรุณากรอกเบอร์โทร 10 หลัก" |
| certifiedByAdmin | Required (checked) | "กรุณารับรองความถูกต้อง" |

---

## Automated Test Scripts

### TC-R100-001: Full Fields Test (5 Teachers)

**Command**:
```bash
npx playwright test tests/register100-full-fields.spec.ts
```

**Duration**: ~4 minutes

**Coverage**:
- ✅ ทั้ง 9 ขั้นตอน
- ✅ 5 ครู (5 major ต่างกัน = 20 คะแนน)
- ✅ อัปโหลดรูปภาพผู้บริหาร + ครู
- ✅ กรอกข้อมูลครบทุก field
- ✅ คะแนนเต็ม Part 1 (100 คะแนน)

**Expected Score**:
```
Part 1: 100/100
- Curriculum: 20
- Teacher Qualification: 20
- Support Org: 5
- Support External: 15
- Awards: 20
- Activities: 15 (5+5+5)
- PR: 5
```

---

### TC-R100-002: Minimal Data Test

**Objective**: ทดสอบการลงทะเบียนด้วยข้อมูลขั้นต่ำ

**Test Steps**:
1. กรอกเฉพาะ field required (*)
2. ไม่อัปโหลดรูปภาพ
3. เพิ่มครูแค่ 1 ท่าน
4. ไม่เลือก checkbox ใน Step 5
5. ไม่เพิ่มรางวัล
6. เพิ่มกิจกรรมแค่ 1 รายการ (< 3)
7. เพิ่ม PR แค่ 1 รายการ (< 3)

**Expected Score**:
```
Part 1: 5-25/100
- Curriculum: 0 (ไม่เลือก checkbox)
- Teacher Qualification: 5 (1 major)
- Support Org: 0
- Support External: 5 (1 รายการ)
- Awards: 0
- Activities: 0 (< 3 รายการ)
- PR: 0 (< 3 รายการ)
```

**Expected Grade**: F or D

---

### TC-R100-003: Save Draft Test

**Objective**: ทดสอบระบบบันทึก draft

**Command**:
```bash
npx playwright test tests/register100-save-draft.spec.ts
```

**Test Steps**:

#### Part 1: บันทึก Draft
1. เข้าหน้า `/regist100`
2. กรอกข้อมูล Step 1-3
3. คลิก "บันทึก"
4. รอ response

**Expected**:
- ✅ POST `/api/register100/save-draft`
- ✅ Response: `{ draftId: "xxx", url: "/regist100?draft=xxx" }`
- ✅ บันทึกใน MongoDB `register100_drafts`

#### Part 2: กลับมาใช้ Draft
1. คัดลอก Draft URL
2. ปิด browser
3. เปิด browser ใหม่
4. เข้า Draft URL
5. ตรวจสอบข้อมูล

**Expected**:
- ✅ ข้อมูล Step 1-3 ยังอยู่
- ✅ สามารถกรอกต่อได้

#### Part 3: ส่งแบบฟอร์มจาก Draft
1. กรอกข้อมูล Step 4-9
2. ส่งแบบฟอร์ม
3. ยืนยัน OTP

**Expected**:
- ✅ ส่งแบบฟอร์มสำเร็จ
- ✅ Draft ถูกลบจาก MongoDB

**Draft Schema**:
```javascript
{
  _id: ObjectId,
  draft_id: "random_uuid",
  form_type: "register100",
  form_data: { /* all form fields */ },
  expiresAt: ISODate(+7 days),
  createdAt: ISODate,
  updatedAt: ISODate
}
```

**Rate Limit**: 5 ครั้ง/ชั่วโมง

---

### TC-R100-004: Email Duplicate Validation

**Objective**: ทดสอบการตรวจสอบ email ซ้ำ

**Test Steps**:

#### Scenario 1: Email ซ้ำใน Contact Modal
1. ลงทะเบียนสำเร็จครั้งแรก (email: test@test.com)
2. ลงทะเบียนครั้งที่ 2
3. กรอกข้อมูลจน Step 9
4. กรอก email: test@test.com ใน Contact Modal
5. คลิก "ยืนยันและส่ง OTP"

**Expected**:
- ❌ แสดง error: "An account with this email already exists"
- ❌ ไม่สามารถส่ง OTP ได้

#### Scenario 2: Email ต่างกัน
1. กรอก email: test2@test.com
2. คลิก "ยืนยันและส่ง OTP"

**Expected**:
- ✅ ส่ง OTP สำเร็จ
- ✅ แสดง OTP Modal

**API Endpoint**: `POST /api/auth/check-email`

---

### TC-R100-005: Image Upload Validation

**Objective**: ทดสอบการอัปโหลดรูปภาพ

**Command**:
```bash
npx playwright test tests/image-upload-fix-test.spec.ts
```

#### Test Case 5.1: รูปภาพปกติ (< 1MB)
**Input**:
- File: `manager.jpg` (800KB)
- Type: image/jpeg

**Expected**:
- ✅ อัปโหลดสำเร็จ
- ✅ แสดง preview
- ✅ บันทึกใน state

#### Test Case 5.2: รูปภาพใหญ่เกิน (> 1MB)
**Input**:
- File: `large-image.jpg` (2MB)
- Type: image/jpeg

**Expected**:
- ❌ แสดง error: "ขนาดไฟล์เกิน 1MB"
- ❌ ไม่อนุญาตให้อัปโหลด

#### Test Case 5.3: ไฟล์ไม่ใช่รูปภาพ
**Input**:
- File: `document.pdf` (500KB)
- Type: application/pdf

**Expected**:
- ❌ แสดง error: "กรุณาเลือกไฟล์รูปภาพ (JPG, PNG)"
- ❌ ไม่อนุญาตให้อัปโหลด

#### Test Case 5.4: Magic Bytes Validation
**Input**:
- File: `fake.jpg` (PDF เปลี่ยนนามสกุลเป็น .jpg)
- Type: image/jpeg (fake)

**Expected**:
- ❌ ระบบตรวจสอบ magic bytes
- ❌ แสดง error: "ไฟล์ไม่ใช่รูปภาพจริง"

**Validation Logic**:
```javascript
// Check file size
if (file.size > 1024 * 1024) {
  throw new Error("ขนาดไฟล์เกิน 1MB");
}

// Check MIME type
if (!file.type.startsWith('image/')) {
  throw new Error("กรุณาเลือกไฟล์รูปภาพ");
}

// Check magic bytes (first 4 bytes)
const buffer = await file.arrayBuffer();
const bytes = new Uint8Array(buffer).slice(0, 4);

// JPEG: FF D8 FF
// PNG: 89 50 4E 47
if (!isValidImageMagicBytes(bytes)) {
  throw new Error("ไฟล์ไม่ใช่รูปภาพจริง");
}
```

---

### TC-R100-006: OTP Verification

**Objective**: ทดสอบระบบ OTP

#### Test Case 6.1: OTP ถูกต้อง
**Input**: `123456` (OTP จริงจาก MongoDB)

**Expected**:
- ✅ ยืนยัน OTP สำเร็จ
- ✅ ส่งแบบฟอร์ม
- ✅ แสดงหน้า Success

#### Test Case 6.2: OTP ผิด
**Input**: `999999` (OTP ผิด)

**Expected**:
- ❌ แสดง error: "OTP ไม่ถูกต้อง"
- ❌ เหลือความพยายาม 4/5
- ❌ ไม่ส่งแบบฟอร์ม

#### Test Case 6.3: OTP หมดอายุ
**Setup**: รอ 5 นาที หรือ เปลี่ยน `expiresAt` ใน MongoDB

**Expected**:
- ❌ แสดง error: "OTP หมดอายุ กรุณาขอ OTP ใหม่"
- ✅ ปุ่ม "ขอ OTP ใหม่" แสดง

#### Test Case 6.4: กรอก OTP ผิด 5 ครั้ง
**Actions**: กรอก OTP ผิด 5 ครั้ง

**Expected**:
- ❌ OTP ถูก lock
- ❌ แสดง error: "กรอก OTP ผิดเกิน 5 ครั้ง กรุณาขอ OTP ใหม่"
- ✅ ต้องขอ OTP ใหม่

#### Test Case 6.5: Rate Limit การขอ OTP
**Actions**: ขอ OTP 3 ครั้งภายใน 1 ชั่วโมง

**Expected**:
- ✅ ครั้งที่ 1-3 สำเร็จ
- ❌ ครั้งที่ 4 แสดง error: "คุณขอ OTP เกินจำนวนครั้งที่กำหนด กรุณารอ 1 ชั่วโมง"

**OTP Schema**:
```javascript
{
  email: "test@test.com",
  otp: "123456",
  form_type: "register100",
  expiresAt: ISODate(+5 minutes),
  attempts: 0,
  maxAttempts: 5,
  createdAt: ISODate
}
```

---

### TC-R100-007: Validation Modal Test

**Objective**: ทดสอบ validation modal

**Test Steps**:

#### Scenario 1: Field Required ว่าง
1. เว้น field required ว่าง
2. คลิก "ขั้นต่อไป"

**Expected**:
- ❌ แสดง Validation Modal
- ❌ ข้อความ: "กรุณากรอกข้อมูลให้ครบถ้วน"
- ✅ ปุ่ม "ตกลง" แสดง
- ❌ ไม่สามารถไป step ถัดไปได้

#### Scenario 2: Email Format ผิด
1. กรอก email: `invalidemail`
2. คลิก "ขั้นต่อไป"

**Expected**:
- ❌ แสดง error: "กรุณากรอกอีเมลให้ถูกต้อง"

#### Scenario 3: Phone Format ผิด
1. กรอกเบอร์โทร: `12345` (น้อยกว่า 10 หลัก)
2. คลิก "ขั้นต่อไป"

**Expected**:
- ❌ แสดง error: "กรุณากรอกเบอร์โทร 10 หลัก"

---

### TC-R100-008: PDPA Consent Modal Test

**Objective**: ทดสอบ consent modal

**Command**:
```bash
npx playwright test tests/test-consent-modal.spec.ts
```

**Test Steps**:

1. เข้าหน้า `/regist100`
2. Modal PDPA ปรากฏ
3. พยายามคลิกนอก modal
4. พยายามปิด modal

**Expected**:
- ❌ ไม่สามารถปิด modal ได้
- ❌ ไม่สามารถกรอกฟอร์มได้
- ✅ ต้องคลิก "ยอมรับ" ก่อน

**After Accept**:
- ✅ Modal ปิด
- ✅ สามารถกรอกฟอร์มได้

---

## Additional Test Cases

### TC-R100-009: Multiple Teachers (9 Teachers Max)

**Objective**: ทดสอบการเพิ่มครู 9 ท่าน

**Test Steps**:
1. เพิ่มครู 9 ท่าน
2. ตรวจสอบคะแนนคุณวุฒิครู

**Expected**:
- ✅ เพิ่มได้สูงสุด 9 ท่าน
- ✅ ปุ่ม "+ เพิ่มครู" หายไปเมื่อครบ 9 ท่าน
- ✅ คำนวณคะแนนจาก unique majors

---

### TC-R100-010: Score Verification

**Objective**: ตรวจสอบคะแนนถูกต้อง

**Test Steps**:

#### Scenario 1: คะแนนเต็ม Part 1 (100)
- Curriculum: 20 (4 checkboxes)
- Teacher: 20 (4+ unique majors)
- Support Org: 5
- Support External: 15 (3+ รายการ)
- Awards: 20 (ระดับประเทศ)
- Activities: 15 (3+ ทุกประเภท)
- PR: 5 (3+ รายการ)

**Expected Total**: 100 คะแนน

#### Scenario 2: คะแนนต่ำสุด (0-10)
- ไม่เลือก checkbox
- ครูแค่ 1 ท่าน (5 คะแนน)
- ไม่มีสนับสนุน
- ไม่มีรางวัล
- ไม่มีกิจกรรม
- ไม่มี PR

**Expected Total**: 5 คะแนน

---

### TC-R100-011: Database Verification

**Objective**: ตรวจสอบข้อมูลใน MongoDB

**Collections to Check**:

1. **register100_submissions**
```javascript
db.register100_submissions.findOne({ school_id: "DCP-0101" })
```

**Expected Fields**:
- ✅ school_id: "DCP-0101"
- ✅ total_score: 100
- ✅ grade: "A"
- ✅ video1_score: 0
- ✅ video2_score: 0
- ✅ status: "pending"

2. **schools**
```javascript
db.schools.findOne({ school_id: "DCP-0101" })
```

**Expected Fields**:
- ✅ school_id: "DCP-0101"
- ✅ school_name
- ✅ province
- ✅ type: "register100"
- ✅ admin_email
- ✅ status: "active"

3. **users**
```javascript
db.users.findOne({ email: "unicornmax@gmail.com" })
```

**Expected Fields**:
- ✅ email: "unicornmax@gmail.com"
- ✅ role: "school_admin"
- ✅ school_id: "DCP-0101"
- ✅ password: bcrypt hash
- ✅ status: "active"

---

### TC-R100-012: Login After Registration

**Objective**: ทดสอบการ login หลังลงทะเบียน

**Test Steps**:
1. ตรวจสอบอีเมล login credentials
2. เข้าหน้า `/login`
3. กรอก email/password
4. คลิก "เข้าสู่ระบบ"

**Expected**:
- ✅ Login สำเร็จ
- ✅ Redirect ไปยัง `/dashboard`
- ✅ แสดงข้อมูลโรงเรียน
- ✅ แสดงคะแนน Part 1
- ✅ แสดงสถานะ "รอประเมิน Part 2"

---

### TC-R100-013: Admin Update Part 2 Score

**Objective**: ทดสอบการป้อนคะแนน Part 2 โดย Admin

**Preconditions**:
- ต้องมีบัญชี DCP Admin
- มีโรงเรียนที่ลงทะเบียนแล้ว

**Test Steps**:
1. Login เป็น DCP Admin
2. เข้าหน้า `/dcp-admin/dashboard/register100`
3. เลือกโรงเรียน DCP-0101
4. กรอก video1_score: 45
5. กรอก video2_score: 48
6. คลิก "บันทึก"

**Expected**:
- ✅ อัปเดต video1_score: 45
- ✅ อัปเดต video2_score: 48
- ✅ คำนวณ total_score ใหม่: 100 + 45 + 48 = 193
- ✅ อัปเดต grade: "A"
- ✅ อัปเดต status: "completed"

**Verification**:
```javascript
db.register100_submissions.findOne({ school_id: "DCP-0101" })
// Expected:
// total_score: 193
// grade: "A"
// video1_score: 45
// video2_score: 48
```

---

## Test Execution Report Template

### Test Run Information

| Field | Value |
|-------|-------|
| Test Date | 2026-07-28 |
| Tester | [Your Name] |
| Environment | Local Development |
| URL | http://localhost:3000/regist100 |
| Browser | Chrome 126 |
| OS | Windows 11 |
| Database | MongoDB thai_music_school |

### Test Summary

| Test Case ID | Test Name | Status | Duration | Score | Grade | Notes |
|--------------|-----------|--------|----------|-------|-------|-------|
| TC-R100-001 | Full Fields (5 Teachers) | ✅ Pass | 3m 45s | 100/100 | A | คะแนนเต็ม Part 1 |
| TC-R100-002 | Minimal Data | ✅ Pass | 1m 20s | 5/100 | F | ข้อมูลน้อยสุด |
| TC-R100-003 | Save Draft | ✅ Pass | 2m 10s | - | - | Draft restored |
| TC-R100-004 | Email Duplicate | ✅ Pass | 45s | - | - | Error shown |
| TC-R100-005 | Image Upload | ✅ Pass | 30s | - | - | Validation works |
| TC-R100-006 | OTP Verification | ✅ Pass | 30s | - | - | OTP accepted |
| TC-R100-007 | Validation Modal | ✅ Pass | 1m | - | - | Modal shown |
| TC-R100-008 | PDPA Consent | ✅ Pass | 20s | - | - | Consent required |

### Issues Found

| Issue ID | Severity | Test Case | Description | Status | Fixed In |
|----------|----------|-----------|-------------|--------|----------|
| BUG-001 | Low | TC-R100-001 | Image preview slow on large files | Open | - |
| BUG-002 | Medium | TC-R100-006 | OTP email delay 2-3 minutes | Open | - |

### Coverage Summary

| Category | Coverage |
|----------|----------|
| Happy Path | ✅ 100% |
| Validation | ✅ 100% |
| Error Handling | ✅ 100% |
| Security | ✅ 100% |
| Performance | ⚠️ 80% |

### Performance Metrics

| Operation | Average Time | Acceptable | Status |
|-----------|--------------|------------|--------|
| Page Load | 1.2s | < 2s | ✅ Pass |
| Form Submit | 3.5s | < 5s | ✅ Pass |
| Image Upload | 2.8s | < 3s | ✅ Pass |
| OTP Generation | 0.5s | < 1s | ✅ Pass |
| Email Delivery | 120s | < 60s | ❌ Fail |

---

## Troubleshooting Guide

### Common Issues

#### Issue 1: Validation Modal ไม่หายหลังแก้ไข
**Cause**: React state ไม่อัปเดต  
**Solution**: Refresh หน้าและกรอกใหม่

#### Issue 2: รูปภาพไม่แสดง preview
**Cause**: ไฟล์ใหญ่เกินไป หรือ format ไม่ถูกต้อง  
**Solution**: ตรวจสอบ file size (< 1MB) และ format (JPG/PNG)

#### Issue 3: OTP ไม่ได้รับ
**Cause**: Email configuration หรือ SMTP issue  
**Solution**: 
1. ตรวจสอบ OTP ใน MongoDB: `npm run check:otp -- email@test.com register100`
2. ตรวจสอบ SMTP settings ใน `.env`

#### Issue 4: คะแนนไม่ถูกต้อง
**Cause**: Logic การคำนวณผิด  
**Solution**: ตรวจสอบข้อมูลใน MongoDB:
```javascript
db.register100_submissions.aggregate([
  { $match: { school_id: "DCP-0101" } },
  { $project: {
      curriculum_score: 1,
      teacher_qualification_score: 1,
      support_org_score: 1,
      support_external_score: 1,
      awards_score: 1,
      activities_internal_score: 1,
      activities_external_score: 1,
      activities_outside_score: 1,
      pr_score: 1,
      total_score: 1
  }}
])
```

#### Issue 5: Draft หมดอายุ
**Cause**: Draft เก็บไว้เกิน 7 วัน  
**Solution**: ลงทะเบียนใหม่

---

## API Endpoints Reference

### Registration APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register100/submit` | ส่งแบบฟอร์มลงทะเบียน |
| POST | `/api/register100/save-draft` | บันทึก draft |
| GET | `/api/register100/draft/:id` | ดึงข้อมูล draft |
| DELETE | `/api/register100/draft/:id` | ลบ draft |
| POST | `/api/upload/image` | อัปโหลดรูปภาพ |

### Auth APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/check-email` | ตรวจสอบ email ซ้ำ |
| POST | `/api/auth/send-otp` | ส่ง OTP |
| POST | `/api/auth/verify-otp` | ยืนยัน OTP |
| POST | `/api/auth/login` | เข้าสู่ระบบ |

### Admin APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/register100/list` | รายการโรงเรียน |
| GET | `/api/admin/register100/:id` | ข้อมูลโรงเรียน |
| PUT | `/api/admin/register100/:id/score` | อัปเดตคะแนน Part 2 |
| PUT | `/api/admin/register100/:id/status` | เปลี่ยนสถานะ |

---

## MongoDB Query Examples

### ค้นหาโรงเรียนทั้งหมด
```javascript
db.register100_submissions.find()
```

### ค้นหาตามจังหวัด
```javascript
db.register100_submissions.find({ province: "กรุงเทพมหานคร" })
```

### ค้นหาโรงเรียนที่ได้คะแนนเต็ม Part 1
```javascript
db.register100_submissions.find({ total_score: 100 })
```

### ค้นหาตามเกรด
```javascript
db.register100_submissions.find({ grade: "A" })
```

### นับจำนวนโรงเรียนแต่ละเกรด
```javascript
db.register100_submissions.aggregate([
  { $group: { _id: "$grade", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])
```

### คำนวณคะแนนเฉลี่ย
```javascript
db.register100_submissions.aggregate([
  { $group: { 
      _id: null, 
      avgScore: { $avg: "$total_score" },
      minScore: { $min: "$total_score" },
      maxScore: { $max: "$total_score" }
  }}
])
```

---

## Appendix

### A. Test Data Set

#### Set 1: Full Score (100 คะแนน)
- โรงเรียน: โรงเรียนทดสอบเกรด A
- ครู: 5 ท่าน (5 major ต่างกัน)
- Checkboxes: ✅ ทั้งหมด
- รางวัล: ระดับประเทศ
- กิจกรรม: 3+ รายการทุกประเภท
- PR: 3+ รายการ

#### Set 2: Minimal Score (5-10 คะแนน)
- โรงเรียน: โรงเรียนทดสอบเกรด F
- ครู: 1 ท่าน
- Checkboxes: ❌ ไม่เลือก
- รางวัล: ไม่มี
- กิจกรรม: 1 รายการ
- PR: 1 รายการ

### B. Email Templates

#### Template 1: OTP Email
```
Subject: รหัส OTP สำหรับลงทะเบียนโรงเรียนดนตรีไทย

เรียน ครูผู้ลงทะเบียน

รหัส OTP ของท่านคือ: 123456

รหัสนี้จะหมดอายุภายใน 5 นาที

หากท่านไม่ได้ทำรายการนี้ กรุณาเพิกเฉย

ขอบคุณครับ
ทีมงาน DCP School 100
```

#### Template 2: Login Credentials Email
```
Subject: ข้อมูลการเข้าใช้งานระบบโรงเรียนดนตรีไทย - DCP-0101

เรียน ครูผู้ลงทะเบียน

ยินดีต้อนรับสู่ระบบลงทะเบียนโรงเรียนดนตรีไทย 100% การันตี

ข้อมูลโรงเรียนของท่าน:
- รหัสโรงเรียน: DCP-0101
- ชื่อโรงเรียน: โรงเรียนทดสอบ Register100
- คะแนน Part 1: 100/100
- เกรด: A (รออัปเดตคะแนน Part 2)

ข้อมูล Login:
- Email: unicornmax@gmail.com
- Password: Abc12345

เข้าสู่ระบบที่: https://dcpschool100.net/login

กรุณาเปลี่ยนรหัสผ่านหลังจาก Login ครั้งแรก

ขอบคุณครับ
ทีมงาน DCP School 100
```

### C. Playwright Commands Reference

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/register100-full-fields.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Generate test report
npx playwright show-report

# Run tests in parallel
npx playwright test --workers=4

# Update snapshots
npx playwright test --update-snapshots

# Run only failed tests
npx playwright test --last-failed
```

### D. MongoDB Helper Scripts

#### Check OTP
```bash
npm run check:otp -- unicornmax@gmail.com register100
```

#### Clear Test Data
```javascript
// Clear all test submissions
db.register100_submissions.deleteMany({ 
  school_name: { $regex: /ทดสอบ/i } 
})

// Clear test users
db.users.deleteMany({ 
  email: { $regex: /test/i } 
})

// Clear test drafts
db.register100_drafts.deleteMany({})
```

#### Reset School ID Counter
```javascript
db.counters.updateOne(
  { _id: "school_id" },
  { $set: { seq: 0 } }
)
```

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-07-28 | Initial detailed test cases for Register100 | Kiro |

---

**END OF DOCUMENT**

