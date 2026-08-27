# Manual Test Cases - Thai Music Platform Registration

**System**: ระบบลงทะเบียนโครงการโรงเรียนดนตรีไทย  
**Version**: 1.0  
**Last Updated**: July 27, 2026  
**Test Environment**: Local Development (`http://localhost:3000`)

---

## Table of Contents

1. [Test Environment Setup](#test-environment-setup)
2. [Test Data Preparation](#test-data-preparation)
3. [Register100 Test Cases](#register100-test-cases)
4. [Register-Support Test Cases](#register-support-test-cases)
5. [Draft System Test Cases](#draft-system-test-cases)
6. [Validation Test Cases](#validation-test-cases)
7. [Image Upload Test Cases](#image-upload-test-cases)
8. [OTP Verification Test Cases](#otp-verification-test-cases)

---

## Test Environment Setup

### Prerequisites
- Node.js v18+ installed
- MongoDB running locally or connection string configured
- Development server running
- Test images prepared in `public/` folder

### Start Development Server
```bash
npm run dev
# Server starts at http://localhost:3000
```

### Prepare Test Images
```bash
# Copy test images to public folder
public/manager.jpg       # Manager/Director photo (< 1MB)
public/teacher1.jpg      # Teacher 1 photo
public/teacher2.jpg      # Teacher 2 photo
public/teacher3.jpg      # Teacher 3 photo
public/teacher4.jpg      # Teacher 4 photo
```

---

## Test Data Preparation

### Sample School Data - Register100


```
ชื่อโรงเรียน: โรงเรียนทดสอบดนตรีไทย 100% การันตี
จังหวัด: กรุงเทพมหานคร
ระดับการศึกษา: ประถมศึกษา
ขนาด: MEDIUM (121-300 คน)
จำนวนบุคลากร: 25
จำนวนนักเรียน: 250

ผู้บริหาร:
- ชื่อ: ทดสอบ ระบบ
- ตำแหน่ง: ผู้อำนวยการ
- โทร: 0812345678
- Email: director@test.ac.th

ครูผู้ลงทะเบียน:
- Email: teacher@test.ac.th
- โทร: 0898765432
```

### Sample School Data - Register-Support
```
ชื่อโรงเรียน: โรงเรียนสาธิตดนตรีไทย
จังหวัด: พระนครศรีอยุธยา
ระดับการศึกษา: มัธยมศึกษา
ประเภท: สถานศึกษา
จำนวนบุคลากร: 30
จำนวนนักเรียน: 300

ผู้บริหาร:
- ชื่อ: ทดสอบระบบ สนับสนุน
- ตำแหน่ง: ผู้อำนวยการ
- โทร: 0823456789
- Email: support@test.ac.th

ครูผู้ลงทะเบียน:
- Email: teacher-support@test.ac.th
- โทร: 0887654321
```

---

## Register100 Test Cases

### TC-R100-001: ลงทะเบียนสำเร็จแบบครบถ้วน (Happy Path)

**URL**: `http://localhost:3000/regist100`

**Objective**: ทดสอบการลงทะเบียนโรงเรียนดนตรีไทย 100% แบบครบถ้วนทั้ง 9 ขั้นตอน

**Test Steps**:

#### Step 1: ข้อมูลพื้นฐาน
1. เข้าหน้า `/regist100`
2. คลิก "ยอมรับ" ในหน้า Consent Modal
3. กรอกข้อมูล:
   - ชื่อสถานศึกษา
   - จังหวัด (dropdown)
   - ระดับการศึกษา (radio)
   - สังกัด (dropdown + text)
   - ขนาดโรงเรียน
   - จำนวนบุคลากร
   - จำนวนนักเรียน
   - ที่อยู่ (เลขที่, หมู่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์)
   - เบอร์โทรศัพท์, โทรสาร
4. คลิก "ขั้นต่อไป"

**Expected Result**: 
- ✅ ข้อมูลถูกบันทึก
- ✅ ไปยัง Step 2

#### Step 2: ข้อมูลผู้บริหาร

1. กรอกข้อมูลผู้บริหาร:
   - ชื่อ-นามสกุล
   - ตำแหน่ง
   - ที่อยู่
   - เบอร์โทร
   - อีเมล
2. อัปโหลดรูปภาพผู้บริหาร (< 1MB)
3. คลิก "ขั้นต่อไป"

**Expected Result**: 
- ✅ รูปภาพถูกอัปโหลด
- ✅ แสดง preview รูปภาพ
- ✅ ไปยัง Step 3

#### Step 3: สภาวการณ์การเรียนการสอน
1. เพิ่มรายการดนตรีไทยที่สอน (ระดับชั้น + รายละเอียด)
2. เพิ่มเครื่องดนตรี (ชื่อ + จำนวน + หมายเหตุ)
3. คลิก "ขั้นต่อไป"

**Expected Result**: 
- ✅ เพิ่มรายการได้หลายรายการ
- ✅ สามารถลบรายการได้
- ✅ ไปยัง Step 4

#### Step 4: ข้อมูลครูดนตรีไทย (9 ท่าน)
1. เพิ่มครูท่านที่ 1:
   - บทบาท/หน้าที่ (dropdown)
   - ชื่อ-นามสกุล
   - ตำแหน่ง
   - วุฒิการศึกษา (dropdown)
   - เบอร์โทร, อีเมล
   - ทักษะความสามารถ
   - อัปโหลดรูปภาพ
   - การศึกษาด้านดนตรีไทย (หลายรายการ)
   - การศึกษาด้านอื่น (หลายรายการ)
2. เพิ่มครู 8 ท่านเพิ่มเติม (รวม 9 ท่าน)
3. คลิก "ขั้นต่อไป"

**Expected Result**: 
- ✅ ครู 9 ท่านถูกบันทึก
- ✅ รูปภาพครูถูกอัปโหลด
- ✅ คำนวณคะแนนคุณวุฒิครูอัตโนมัติ (max 20 คะแนน)
- ✅ ไปยัง Step 5

#### Step 5: หลักสูตรและการสอน
1. เลือก checkbox:
   - ☑ วิชาบังคับ
   - ☑ วิชาเลือก
   - ☑ หลักสูตรท้องถิ่น
   - ☑ การสอนนอกเวลา
2. กรอกตารางวิชาบังคับ (ถ้าเลือก)
3. กรอกตารางวิชาเลือก (ถ้าเลือก)
4. กรอกตารางหลักสูตรท้องถิ่น (ถ้าเลือก)
5. กรอกตารางเรียนนอกเวลา (ถ้าเลือก)
6. กรอกสถานที่สอน
7. คลิก "ขั้นต่อไป"

**Expected Result**: 
- ✅ คำนวณคะแนนหลักสูตร (max 20 คะแนน: 4 checkbox × 5)
- ✅ ไปยัง Step 6

#### Step 6: การสนับสนุนและรางวัล
1. เพิ่มปัจจัยสนับสนุน
2. เลือก "ได้รับการสนับสนุนจากต้นสังกัด"
3. เพิ่มรายการสนับสนุนจากต้นสังกัด (องค์กร + รายละเอียด + ลิงก์)
4. เลือก "ได้รับการสนับสนุนจากภายนอก"
5. เพิ่มรายการสนับสนุนจากภายนอก (3+ รายการ)
6. กรอกกรอบการเรียนการสอน
7. กรอกผลลัพธ์การเรียนรู้
8. กรอกการบริหารจัดการ
9. คลิก "ขั้นต่อไป"

**Expected Result**: 
- ✅ คำนวณคะแนนสนับสนุน:
  - ต้นสังกัด: 5 คะแนน
  - ภายนอก: 15 คะแนน (3+ รายการ)
- ✅ ไปยัง Step 7

#### Step 7: รางวัล
1. เพิ่มรางวัล (3+ รายการ):
   - ระดับ: อำเภอ/จังหวัด/ภาค/ประเทศ
   - ชื่อรางวัล
   - วันที่ได้รับ
   - ลิงก์หลักฐาน
2. คลิก "ขั้นต่อไป"

**Expected Result**: 
- ✅ คำนวณคะแนนรางวัล (max 20 คะแนน):
  - ระดับประเทศ = 20
  - ระดับภาค = 15
  - ระดับจังหวัด = 10
  - ระดับอำเภอ = 5
- ✅ ใช้คะแนนสูงสุด
- ✅ ไปยัง Step 8

#### Step 8: กิจกรรม
1. เพิ่มกิจกรรมภายในจังหวัด (ภายใน) - 3+ รายการ
2. เพิ่มกิจกรรมภายในจังหวัด (ภายนอก) - 3+ รายการ
3. เพิ่มกิจกรรมนอกจังหวัด - 3+ รายการ
4. กรอกลิงก์ Google Drive รูปภาพ
5. กรอกลิงก์วิดีโอที่ 1 (YouTube)
6. กรอกลิงก์วิดีโอที่ 2 (YouTube)
7. คลิก "ขั้นต่อไป"

**Expected Result**: 
- ✅ คำนวณคะแนนกิจกรรม (≥3 = 5 คะแนน แต่ละประเภท)
- ✅ ไปยัง Step 9

#### Step 9: ประชาสัมพันธ์และยืนยัน
1. เพิ่มกิจกรรมประชาสัมพันธ์ - 3+ รายการ
2. เลือก checkbox ช่องทางการรับรู้
3. กรอกปัญหาและอุปสรรค
4. กรอกข้อเสนอแนะ
5. กรอก Email ครูผู้ลงทะเบียน
6. กรอกเบอร์โทรครู
7. ☑ รับรองความถูกต้อง
8. คลิก "ส่งแบบฟอร์ม"

**Expected Result**: 
- ✅ คำนวณคะแนน PR (≥3 = 5 คะแนน)
- ✅ แสดง Modal OTP

#### OTP Verification
1. ตรวจสอบ OTP จาก MongoDB:
   ```bash
   npm run check:otp -- teacher@test.ac.th register100
   ```
2. กรอก OTP 6 หลัก
3. คลิก "ยืนยัน"

**Expected Result**: 
- ✅ OTP ถูกต้อง
- ✅ แบบฟอร์มถูกส่ง
- ✅ สร้าง School ID (DCP-XXXX)
- ✅ คำนวณคะแนน Part 1 (max 100)
- ✅ สร้างบัญชีครู
- ✅ ส่งอีเมลข้อมูล login
- ✅ แสดงหน้า Success

**Expected Scores**:
```
Part 1 (max 100):
- หลักสูตร: 20 (4 checkbox)
- คุณวุฒิครู: 20 (4+ unique qualifications)
- สนับสนุนต้นสังกัด: 5
- สนับสนุนภายนอก: 15 (3+ รายการ)
- รางวัล: 20 (ระดับสูงสุด)
- กิจกรรมภายใน: 5 (3+ รายการ)
- กิจกรรมภายนอก: 5 (3+ รายการ)
- กิจกรรมนอกจังหวัด: 5 (3+ รายการ)
- ประชาสัมพันธ์: 5 (3+ รายการ)
Total Part 1: 100 คะแนน

Part 2 (ป้อนโดย Admin):
- video1_score: 0-50
- video2_score: 0-50
Total Part 2: 0-100 คะแนน

Total Score: 0-200 คะแนน
```

**Test Data**: Stored in MongoDB `register100_submissions` collection

---

### TC-R100-002: ลงทะเบียนแบบข้อมูลน้อยสุด (Minimal Data)

**Objective**: ทดสอบการลงทะเบียนด้วยข้อมูลขั้นต่ำที่จำเป็น

**Test Steps**:
1. กรอกเฉพาะ field ที่ required (*)
2. ไม่อัปโหลดรูปภาพ (optional)
3. เพิ่มครูแค่ 1 ท่าน
4. ไม่เลือก checkbox ใน Step 5
5. ไม่เพิ่มรางวัล
6. ส่งแบบฟอร์ม

**Expected Result**: 
- ✅ ลงทะเบียนสำเร็จ
- ✅ คะแนน Part 1 ต่ำ (ประมาณ 5-25 คะแนน)
- ✅ เกรด F หรือ D

---

### TC-R100-003: ทดสอบ Save Draft

**Objective**: ทดสอบการบันทึก draft และกลับมากรอกต่อ

**Test Steps**:
1. กรอกข้อมูล Step 1-3
2. คลิก "บันทึก"
3. จดบันทึก Draft URL
4. ปิด browser
5. เปิด Draft URL ใหม่
6. ตรวจสอบข้อมูลเดิม
7. กรอกต่อจน Step 9
8. ส่งแบบฟอร์ม

**Expected Result**: 
- ✅ ข้อมูลถูกบันทึกเป็น draft
- ✅ กลับมาดูได้ภายใน 7 วัน
- ✅ ข้อมูลเดิมยังอยู่
- ✅ ส่งแบบฟอร์มสำเร็จ
- ✅ Draft ถูกลบหลังส่งสำเร็จ

**Playwright Script**: 
```bash
npx playwright test tests/register100-save-draft.spec.ts
```

---

### TC-R100-004: ทดสอบ Email ซ้ำ

**Objective**: ทดสอบการตรวจสอบ email ซ้ำ

**Test Steps**:
1. ลงทะเบียนสำเร็จครั้งแรก (email: test1@test.com)
2. ลงทะเบียนอีกครั้ง ใช้ email เดียวกัน
3. กรอกข้อมูลจน Step 9
4. กรอก email: test1@test.com
5. ส่งแบบฟอร์ม

**Expected Result**: 
- ✅ แสดง error: "An account with this email already exists"
- ❌ ไม่สามารถส่งแบบฟอร์มได้

---

### TC-R100-005: ทดสอบ Image Upload

**Objective**: ทดสอบการอัปโหลดรูปภาพ

**Test Cases**:

#### 5.1 รูปภาพปกติ (< 1MB)
- ✅ อัปโหลดสำเร็จ
- ✅ แสดง preview

#### 5.2 รูปภาพใหญ่เกิน (> 1MB)
- ❌ แสดง error: "ขนาดไฟล์เกิน 1MB"
- ❌ ไม่อนุญาตให้อัปโหลด

#### 5.3 ไฟล์ที่ไม่ใช่รูปภาพ (.pdf, .doc)
- ❌ แสดง error: "กรุณาเลือกไฟล์รูปภาพ"
- ❌ ไม่อนุญาตให้อัปโหลด

**Playwright Script**: 
```bash
npx playwright test tests/image-upload-fix-test.spec.ts
```

---


## Register-Support Test Cases

### TC-RS-001: ลงทะเบียนสำเร็จแบบครบถ้วน 9 ครู

**URL**: `http://localhost:3000/regist-support`

**Objective**: ทดสอบการลงทะเบียนโรงเรียนสนับสนุนฯ แบบครบถ้วน

**Test Steps**: (คล้าย Register100 แต่มีความแตกต่าง)

#### Step 1: ข้อมูลพื้นฐาน
1. เข้าหน้า `/regist-support`
2. ยอมรับ PDPA
3. **เพิ่มเติม**: เลือกประเภทการสนับสนุน:
   - ○ สถานศึกษา
   - ○ ชุมนุม
   - ○ ชมรม
   - ○ กลุ่ม
   - ○ วงดนตรีไทย
4. กรอกชื่อตามประเภทที่เลือก
5. กรอกจำนวนสมาชิก (ถ้าไม่ใช่สถานศึกษา)
6. กรอกข้อมูลพื้นฐานอื่นๆ
7. คลิก "ขั้นต่อไป"

**Expected Result**: 
- ✅ แสดง field ตามประเภทที่เลือก
- ✅ ไปยัง Step 2

#### Step 2-3: เหมือน Register100

#### Step 4: ข้อมูลครู (9 ท่าน)
**ความแตกต่าง**: มี field "การฝึกอบรมครู" เพิ่มเติม

**Expected Result**:
- ✅ คำนวณคะแนนการฝึกอบรมครู (20 คะแนน)
- ✅ คำนวณคะแนนคุณวุฒิครู (20 คะแนน)

#### Step 5-9: เหมือน Register100

**Expected Scores**:
```
Part 1 (max 100):
- การฝึกอบรมครู: 20 (แทนหลักสูตร)
- คุณวุฒิครู: 20
- สนับสนุนต้นสังกัด: 5
- สนับสนุนภายนอก: 15
- รางวัล: 20
- กิจกรรมภายใน: 5
- กิจกรรมภายนอก: 5
- กิจกรรมนอกจังหวัด: 5
- ประชาสัมพันธ์: 5
Total Part 1: 100 คะแนน

Part 2 (ป้อนโดย Admin):
- video1_score: 0-40
- video2_score: 0-40
Total Part 2: 0-80 คะแนน

Total Score: 0-180 คะแนน
```

**Playwright Script**: 
```bash
npx playwright test tests/regist-support-9teachers-full.spec.ts
```

---

### TC-RS-002: ลงทะเบียนแบบ 2 ครู (Quick Test)

**Objective**: ทดสอบแบบรวดเร็วด้วยครูแค่ 2 ท่าน

**Test Steps**:
1. กรอกข้อมูลครบทุก step
2. เพิ่มครูแค่ 2 ท่าน (แทน 9 ท่าน)
3. ส่งแบบฟอร์ม

**Expected Result**: 
- ✅ ลงทะเบียนสำเร็จ
- ✅ คะแนนคุณวุฒิครูต่ำกว่า (10 คะแนน แทน 20)

**Playwright Script**: 
```bash
npx playwright test tests/regist-support-2teachers-quick.spec.ts
```

---

### TC-RS-003: ทดสอบคะแนนเต็ม 100 Part 1

**Objective**: ทดสอบการได้คะแนนเต็ม Part 1 (100 คะแนน)

**Test Steps**:
1. กรอกข้อมูลเพื่อให้ได้คะแนนสูงสุดทุกส่วน:
   - ครู 4+ ท่าน (ต่างคุณวุฒิ) = 20 คะแนน
   - มีการฝึกอบรมครบ = 20 คะแนน
   - มีสนับสนุนต้นสังกัด = 5 คะแนน
   - มีสนับสนุนภายนอก 3+ = 15 คะแนน
   - มีรางวัลระดับประเทศ = 20 คะแนน
   - มีกิจกรรมครบทุกประเภท 3+ = 15 คะแนน
   - มี PR 3+ = 5 คะแนน
2. ส่งแบบฟอร์ม

**Expected Result**: 
- ✅ คะแนน Part 1 = 100
- ✅ รอ Admin ป้อน Part 2
- ✅ คะแนนรวมสูงสุด = 180 (ถ้า Part 2 เต็ม)

**Playwright Script**: 
```bash
npx playwright test tests/regist-support-full-100points.spec.ts
```

---

### TC-RS-004: ทดสอบ Save Draft

**Objective**: ทดสอบการบันทึก draft

**Test Steps**: (เหมือน TC-R100-003)

**Playwright Script**: 
```bash
npx playwright test tests/regist-support-save-draft.spec.ts
```

---

### TC-RS-005: ทดสอบรูปภาพขนาดเล็ก

**Objective**: ทดสอบการอัปโหลดรูปภาพขนาดเล็ก (< 100KB)

**Test Steps**:
1. เตรียมรูปภาพขนาดเล็ก (50KB)
2. อัปโหลดเป็นรูปผู้บริหาร
3. อัปโหลดเป็นรูปครู
4. ส่งแบบฟอร์ม

**Expected Result**: 
- ✅ อัปโหลดสำเร็จ
- ✅ รูปภาพถูกบันทึก
- ✅ ลงทะเบียนสำเร็จ

**Playwright Script**: 
```bash
npx playwright test tests/regist-support-small-image-test.spec.ts
```

---

## Draft System Test Cases

### TC-DRAFT-001: บันทึก Draft อัตโนมัติ

**Objective**: ทดสอบระบบ auto-save draft

**Test Steps**:
1. เข้าหน้าลงทะเบียน
2. กรอกข้อมูล Step 1
3. รอ 30 วินาที (auto-save)
4. ตรวจสอบ localStorage
5. Refresh หน้า
6. ตรวจสอบว่าข้อมูลยังอยู่

**Expected Result**: 
- ✅ ข้อมูลถูก auto-save
- ✅ Refresh แล้วข้อมูลยังอยู่

---

### TC-DRAFT-002: Draft หมดอายุ

**Objective**: ทดสอบการหมดอายุของ draft

**Test Steps**:
1. สร้าง draft
2. เปลี่ยน `expiresAt` ใน MongoDB ให้เป็นอดีต
3. พยายามเข้า draft URL
4. ตรวจสอบผล

**Expected Result**: 
- ❌ Draft หมดอายุ
- ❌ ไม่สามารถเข้าถึงได้
- ✅ แสดงข้อความ "Draft หมดอายุ"

---

### TC-DRAFT-003: Rate Limit การบันทึก

**Objective**: ทดสอบ rate limit 5 ครั้ง/ชั่วโมง

**Test Steps**:
1. บันทึก draft 5 ครั้งภายใน 1 ชั่วโมง
2. พยายามบันทึกครั้งที่ 6
3. ตรวจสอบผล

**Expected Result**: 
- ✅ บันทึก 5 ครั้งแรกสำเร็จ
- ❌ ครั้งที่ 6 แสดง rate limit error

---

## Validation Test Cases

### TC-VAL-001: ตรวจสอบ Required Fields

**Objective**: ทดสอบ validation field required

**Test Steps**:
1. เว้น field required (*) ว่าง
2. พยายามไป step ถัดไป

**Expected Result**: 
- ❌ แสดง error message
- ❌ ไม่สามารถไป step ถัดไปได้

---

### TC-VAL-002: ตรวจสอบรูปแบบข้อมูล

**Test Cases**:

#### Email Format
- Input: `invalidemail`
- Expected: ❌ "กรุณากรอกอีเมลให้ถูกต้อง"

#### Phone Format
- Input: `12345` (น้อยกว่า 10 หลัก)
- Expected: ❌ "กรุณากรอกเบอร์โทรให้ถูกต้อง"

#### URL Format
- Input: `not-a-url`
- Expected: ❌ "กรุณากรอก URL ให้ถูกต้อง"

---

### TC-VAL-003: ตรวจสอบ Modal Consent

**Objective**: ทดสอบ PDPA consent modal

**Test Steps**:
1. เข้าหน้าลงทะเบียน
2. ไม่กด "ยอมรับ"
3. พยายามปิด modal

**Expected Result**: 
- ❌ ไม่สามารถปิดได้
- ❌ ต้องกด "ยอมรับ" ก่อน

---

## Image Upload Test Cases

### TC-IMG-001: อัปโหลดรูปภาพปกติ

**Formats**: JPG, PNG, JPEG  
**Size**: < 1MB

**Expected Result**: ✅ สำเร็จ

---

### TC-IMG-002: อัปโหลดรูปภาพใหญ่เกิน

**Size**: > 1MB

**Expected Result**: 
- ❌ แสดง error
- ❌ ไม่อนุญาต

---

### TC-IMG-003: อัปโหลดไฟล์ไม่ใช่รูปภาพ

**File Type**: .pdf, .doc, .txt

**Expected Result**: 
- ❌ แสดง error
- ❌ ไม่อนุญาต

---

### TC-IMG-004: Magic Bytes Validation

**Objective**: ทดสอบการตรวจสอบ file type ด้วย magic bytes

**Test Steps**:
1. เปลี่ยนนามสกุล .pdf → .jpg
2. พยายามอัปโหลด

**Expected Result**: 
- ❌ ระบบตรวจพบว่าไม่ใช่รูปภาพจริง
- ❌ ไม่อนุญาตให้อัปโหลด

---

## OTP Verification Test Cases

### TC-OTP-001: ยืนยัน OTP สำเร็จ

**Test Steps**:
1. กรอก OTP ที่ถูกต้อง
2. คลิก "ยืนยัน"

**Expected Result**: 
- ✅ OTP ถูกต้อง
- ✅ ส่งแบบฟอร์มสำเร็จ

---

### TC-OTP-002: OTP ไม่ถูกต้อง

**Test Steps**:
1. กรอก OTP ผิด
2. คลิก "ยืนยัน"

**Expected Result**: 
- ❌ แสดง error: "OTP ไม่ถูกต้อง"
- ❌ เหลือความพยายาม 4/5

---

### TC-OTP-003: OTP หมดอายุ

**Test Steps**:
1. รอ 5 นาที (OTP หมดอายุ)
2. กรอก OTP
3. คลิก "ยืนยัน"

**Expected Result**: 
- ❌ แสดง error: "OTP หมดอายุ"
- ✅ สามารถขอ OTP ใหม่ได้

---

### TC-OTP-004: Rate Limit การขอ OTP

**Test Steps**:
1. ขอ OTP 3 ครั้งภายใน 1 ชั่วโมง
2. พยายามขอครั้งที่ 4

**Expected Result**: 
- ✅ ขอ 3 ครั้งแรกสำเร็จ
- ❌ ครั้งที่ 4 แสดง rate limit error

---

### TC-OTP-005: กรอก OTP ผิด 5 ครั้ง

**Test Steps**:
1. กรอก OTP ผิด 5 ครั้ง

**Expected Result**: 
- ❌ OTP ถูก lock
- ❌ ต้องขอ OTP ใหม่

---

## Automated Test Scripts

### Available Playwright Test Scripts

#### Register100 Tests
```bash
# Basic test
npx playwright test tests/register100-basic.spec.ts

# Full fields test (9 teachers)
npx playwright test tests/register100-full-fields.spec.ts

# Save draft test
npx playwright test tests/register100-save-draft.spec.ts

# Minimal data test
npx playwright test tests/register100-minimal.spec.ts

# Validation test
npx playwright test tests/register100-complete-validation-test.spec.ts

# Image upload test
npx playwright test tests/image-upload-fix-test.spec.ts
```

#### Register-Support Tests
```bash
# Full test (9 teachers)
npx playwright test tests/regist-support-9teachers-full.spec.ts

# Quick test (2 teachers)
npx playwright test tests/regist-support-2teachers-quick.spec.ts

# Full 100 points
npx playwright test tests/regist-support-full-100points.spec.ts

# Save draft test
npx playwright test tests/regist-support-save-draft.spec.ts

# Small image test
npx playwright test tests/regist-support-small-image-test.spec.ts

# Comprehensive validation
npx playwright test tests/regist-support-comprehensive-validation.spec.ts
```

#### Draft System Tests
```bash
# Complete save draft flow
npx playwright test tests/complete-save-draft-flow.spec.ts

# Save draft scenarios
npx playwright test tests/save-draft-scenarios.spec.ts
```

#### Validation Tests
```bash
# Email duplicate validation
npx playwright test tests/email-duplicate-validation.spec.ts

# Consent modal test
npx playwright test tests/test-consent-modal.spec.ts
```

---

## Test Execution Report Template

### Test Summary

| Test Case ID | Test Name | Status | Duration | Notes |
|--------------|-----------|--------|----------|-------|
| TC-R100-001 | Register100 Full | ✅ Pass | 3m 45s | All steps completed |
| TC-R100-002 | Register100 Minimal | ✅ Pass | 1m 20s | Minimal data accepted |
| TC-R100-003 | Save Draft | ✅ Pass | 2m 10s | Draft restored |
| TC-RS-001 | Register-Support Full | ✅ Pass | 3m 50s | 9 teachers added |
| TC-RS-002 | Register-Support Quick | ✅ Pass | 1m 45s | 2 teachers only |
| TC-OTP-001 | OTP Verification | ✅ Pass | 30s | OTP accepted |

### Environment

- **URL**: http://localhost:3000
- **Date**: 2026-07-27
- **Tester**: [Name]
- **Browser**: Chrome 126
- **OS**: Windows 11

### Issues Found

| Issue ID | Severity | Description | Status |
|----------|----------|-------------|--------|
| BUG-001 | Low | Image preview slow | Open |
| BUG-002 | Medium | OTP email delay 2 min | Open |

---

**END OF DOCUMENT**
