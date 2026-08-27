# TEST CASES — การลงทะเบียนโรงเรียนดนตรีไทย
## Thai Music Platform Registration Testing

**Document Version**: 1.0  
**Last Updated**: July 6, 2026  
**Test Environment**: Development / Staging / Production  
**Tested By**: QA Team

---

## สารบัญ (Table of Contents)

1. [ภาพรวมการทดสอบ](#overview)
2. [Test Cases: Register100](#register100-test-cases)
3. [Test Cases: Register-Support](#register-support-test-cases)
4. [Test Cases: Draft System](#draft-system-test-cases)
5. [Test Cases: Admin Management](#admin-management-test-cases)
6. [Test Data](#test-data)
7. [Expected Results](#expected-results)

---

## Overview

### ขอบเขตการทดสอบ (Test Scope)

#### ✅ In Scope
- การลงทะเบียน Register100 (10 steps)
- การลงทะเบียน Register-Support (10 steps)
- Draft system (save, OTP, resume)
- Form validation (required fields, formats)
- Score calculation
- Admin dashboard (view, edit, delete)
- Data export (Excel, PDF)
- Registration control (on/off)

#### ❌ Out of Scope
- Performance testing
- Load testing
- Security penetration testing
- Browser compatibility (manual test only)

### Test Environments

| Environment | URL | Database | Purpose |
|-------------|-----|----------|---------|
| **Development** | http://localhost:3000 | thai_music_school_dev | Development testing |
| **Staging** | https://staging.dcpschool100.net | thai_music_school_staging | Pre-production testing |
| **Production** | https://dcpschool100.net | thai_music_school | Live environment |

### Test Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Admin | admin@test.com | Test@1234 | Admin dashboard access |
| Teacher | teacher1@test.com | Test@1234 | Registration form |
| Teacher | teacher2@test.com | Test@1234 | Duplicate email test |

---

## Register100 Test Cases

### TC-R100-001: เปิดหน้าแบบฟอร์ม Register100

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เข้า URL: `/regist100` | หน้าเว็บโหลดสำเร็จ |
| 2 | ตรวจสอบหัวข้อหน้า | แสดง "ลงทะเบียนโรงเรียนดนตรีไทย 100%" |
| 3 | ตรวจสอบ Step Indicator | แสดง Step 1/10 |
| 4 | ตรวจสอบปุ่ม | แสดงปุ่ม "ถัดไป" และ "บันทึกแบบร่าง" |

**Test Data**: N/A  
**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-002: กรอกข้อมูล Step 1 (ข้อมูลพื้นฐาน) - Happy Path

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | กรอก Email | รับค่า email format ได้ถูกต้อง |
| 2 | กรอก เบอร์โทร | รับค่า 10 หลักได้ถูกต้อง |
| 3 | กรอก ชื่อสถานศึกษา | รับค่าภาษาไทยได้ |
| 4 | เลือก จังหวัด | แสดง dropdown จังหวัดครบ 77 จังหวัด |
| 5 | เลือก ระดับการศึกษา | แสดงตัวเลือก: ประถม, มัธยม, ขยายโอกาส, เฉพาะทาง |
| 6 | กรอก ที่อยู่โรงเรียน | รับค่าได้ครบทุก field |
| 7 | คลิก "ถัดไป" | เปลี่ยนไป Step 2 สำเร็จ |

**Test Data**:
```
Email: teacher@school.ac.th
Phone: 0812345678
School Name: โรงเรียนทดสอบดนตรีไทย
Province: กรุงเทพมหานคร
Level: ประถมศึกษา
Address: 123 ถนนทดสอบ แขวงทดสอบ เขตทดสอบ กรุงเทพฯ 10100
```

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-003: Validation - Required Fields (Step 1)

**Priority**: High  
**Type**: Negative

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เว้น Email ว่าง | แสดง error "กรุณากรอก Email" |
| 2 | กรอก Email ผิด format | แสดง error "รูปแบบ Email ไม่ถูกต้อง" |
| 3 | เว้น เบอร์โทร ว่าง | แสดง error "กรุณากรอกเบอร์โทรศัพท์" |
| 4 | กรอก เบอร์โทร ไม่ครบ 10 หลัก | แสดง error "เบอร์โทรต้องเป็น 10 หลัก" |
| 5 | เว้น ชื่อสถานศึกษา ว่าง | แสดง error "กรุณากรอกชื่อสถานศึกษา" |
| 6 | ไม่เลือก จังหวัด | แสดง error "กรุณาเลือกจังหวัด" |
| 7 | ไม่เลือก ระดับการศึกษา | แสดง error "กรุณาเลือกระดับการศึกษา" |
| 8 | คลิก "ถัดไป" | ไม่สามารถไปต่อได้ แสดง errors ทั้งหมด |

**Test Data**: ใส่ค่าว่าง / ค่าผิด format  
**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-004: กรอกข้อมูล Step 2 (ผู้บริหารสถานศึกษา)

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | กรอก ชื่อ-นามสกุลผู้บริหาร | รับค่าภาษาไทยได้ |
| 2 | กรอก ตำแหน่ง | รับค่าได้ |
| 3 | กรอก เบอร์โทรผู้บริหาร | รับค่า 10 หลักได้ |
| 4 | กรอก Email ผู้บริหาร (optional) | รับค่า email format |
| 5 | อัพโหลด รูปผู้บริหาร (optional) | อัพโหลดไฟล์ภาพได้ (jpg, png) |
| 6 | คลิก "ถัดไป" | เปลี่ยนไป Step 3 |

**Test Data**:
```
Full Name: นายทดสอบ ผู้บริหาร
Position: ผู้อำนวยการ
Phone: 0823456789
Email: director@school.ac.th
Image: director.jpg (< 5MB)
```

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-005: File Upload - รูปผู้บริหาร

**Priority**: Medium  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | อัพโหลด JPG (2MB) | อัพโหลดสำเร็จ แสดง preview |
| 2 | อัพโหลด PNG (3MB) | อัพโหลดสำเร็จ แสดง preview |
| 3 | อัพโหลด GIF (1MB) | อัพโหลดสำเร็จ |
| 4 | ลบรูปที่อัพโหลด | ลบสำเร็จ แสดงช่องอัพโหลดใหม่ |

**Test Data**: ไฟล์รูปภาพ (.jpg, .png, .gif)  
**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-006: File Upload Validation - ไฟล์ไม่ถูกต้อง

**Priority**: Medium  
**Type**: Negative

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | อัพโหลด PDF | แสดง error "รองรับเฉพาะไฟล์รูปภาพ" |
| 2 | อัพโหลดไฟล์ > 10MB | แสดง error "ไฟล์ใหญ่เกิน 10MB" |
| 3 | อัพโหลดไฟล์ .exe | แสดง error "ประเภทไฟล์ไม่รองรับ" |
| 4 | อัพโหลดไฟล์เสีย | แสดง error "ไฟล์ไม่สามารถอัพโหลดได้" |

**Test Data**: ไฟล์ผิด format และขนาดใหญ่เกิน  
**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-007: กรอกข้อมูล Step 3 (สภาวการณ์)

**Priority**: Medium  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เพิ่ม ระดับชั้นที่สอน | แสดงฟอร์มเพิ่มรายการได้ |
| 2 | กรอก ระดับชั้น และ รายละเอียด | รับค่าได้ |
| 3 | เพิ่มรายการที่ 2-3 | สามารถเพิ่มได้หลายรายการ |
| 4 | ลบรายการ | สามารถลบได้ |
| 5 | เพิ่ม เครื่องดนตรี | แสดงฟอร์มเพิ่มรายการได้ |
| 6 | กรอก ชื่อเครื่องดนตรี, จำนวน | รับค่าได้ |
| 7 | คลิก "ถัดไป" | เปลี่ยนไป Step 4 |

**Test Data**:
```
Music Types:
- Grade: ป.1-ป.6
  Details: สอนดนตรีไทยเบื้องต้น

Instruments:
- Name: ระนาดเอก, Quantity: 5
- Name: ฆ้องวงใหญ่, Quantity: 1
```

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-008: กรอกข้อมูล Step 4 (ผู้สอนดนตรีไทย)

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เพิ่ม ครูผู้สอน | แสดงฟอร์มเพิ่มครู |
| 2 | กรอก ชื่อ-นามสกุลครู | รับค่าภาษาไทยได้ |
| 3 | เลือก บทบาท/หน้าที่ | แสดง dropdown ตัวเลือก |
| 4 | กรอก ตำแหน่ง | รับค่าได้ |
| 5 | กรอก วุฒิการศึกษา | รับค่าได้ |
| 6 | กรอก เบอร์โทร, Email | รับค่า format ถูกต้อง |
| 7 | กรอก ทักษะความสามารถ | รับค่าได้ (text area) |
| 8 | อัพโหลด รูปครู | อัพโหลดสำเร็จ |
| 9 | เพิ่มครูคนที่ 2-3 | สามารถเพิ่มได้หลายคน |
| 10 | คลิก "ถัดไป" | เปลี่ยนไป Step 5 |

**Test Data**:
```
Teacher 1:
- Name: นางสาวทดสอบ ครูดนตรี
- Qualification: ครูผู้สอน
- Position: ครู
- Education: ปริญญาตรี ดนตรีไทย
- Phone: 0834567890
- Email: teacher1@school.ac.th
- Ability: สามารถสอนระนาดเอก ฆ้องวง
```

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-009: กรอกข้อมูล Step 5 (หลักสูตร)

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | ติ๊ก มีวิชาบังคับ | Checkbox เลือกได้ |
| 2 | เพิ่ม ตารางวิชาบังคับ | แสดงฟอร์มเพิ่มตาราง |
| 3 | ติ๊ก มีวิชาเลือก | Checkbox เลือกได้ |
| 4 | เพิ่ม ตารางวิชาเลือก | แสดงฟอร์มเพิ่มตาราง |
| 5 | ติ๊ก มีหลักสูตรท้องถิ่น | Checkbox เลือกได้ |
| 6 | ติ๊ก มีการสอนนอกเวลา | Checkbox เลือกได้ |
| 7 | คลิก "ถัดไป" | เปลี่ยนไป Step 6 |

**Test Data**:
```
Curriculum:
☑ มีวิชาบังคับ (ดนตรีไทย 2 ชม./สัปดาห์)
☑ มีวิชาเลือก (ดนตรีไทยขั้นสูง 1 ชม./สัปดาห์)
☐ มีหลักสูตรท้องถิ่น
☑ มีการสอนนอกเวลา (ทุกวันอังคาร 16:00-17:00)
```

**Expected Score**: teaching_curriculum_score = จำนวน checkbox × 5 (max 20)

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-010: กรอกข้อมูล Step 6 (การสนับสนุน)

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | ติ๊ก ได้รับการสนับสนุนจากต้นสังกัด | Checkbox เลือกได้ |
| 2 | เพิ่ม รายการสนับสนุน | แสดงฟอร์มเพิ่มรายการ |
| 3 | กรอก ชื่อองค์กร, รายละเอียด | รับค่าได้ |
| 4 | กรอก ลิงก์หลักฐาน | รับค่า URL ได้ |
| 5 | ติ๊ก ได้รับการสนับสนุนจากภายนอก | Checkbox เลือกได้ |
| 6 | เพิ่ม รายการสนับสนุนภายนอก | แสดงฟอร์มเพิ่มรายการ |
| 7 | เพิ่ม รางวัลที่ได้รับ | แสดงฟอร์มเพิ่มรางวัล |
| 8 | เลือก ระดับรางวัล | แสดงตัวเลือก: อำเภอ, จังหวัด, ภาค, ประเทศ |
| 9 | กรอก ชื่อรางวัล, วันที่ | รับค่าได้ |
| 10 | คลิก "ถัดไป" | เปลี่ยนไป Step 7 |

**Test Data**:
```
Support from Org: ✓
- Organization: สพฐ.
- Details: สนับสนุนงบประมาณ 50,000 บาท
- Link: https://evidence.com/doc1

Awards:
- Level: ประเทศ
- Name: รางวัลโรงเรียนดนตรีไทยดีเด่น
- Date: 15/03/2025
```

**Expected Score**:
- support_from_org_score = 5
- award_score = 20 (ระดับประเทศ)

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-011: กรอกข้อมูล Step 7 (กิจกรรม)

**Priority**: Medium  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เพิ่ม กิจกรรมภายในจังหวัด (ภายใน) | แสดงฟอร์มเพิ่มกิจกรรม |
| 2 | กรอก ชื่อกิจกรรม, วันที่, ลิงก์ | รับค่าได้ |
| 3 | เพิ่ม กิจกรรมภายในจังหวัด (ภายนอก) | แสดงฟอร์มเพิ่มกิจกรรม |
| 4 | เพิ่ม กิจกรรมนอกจังหวัด | แสดงฟอร์มเพิ่มกิจกรรม |
| 5 | คลิก "ถัดไป" | เปลี่ยนไป Step 8 |

**Test Data**:
```
Activities:
1. กิจกรรมภายในจังหวัด (ภายใน):
   - Name: แสดงดนตรีไทยวันไหว้ครู
   - Date: 16/06/2025
   
2. กิจกรรมนอกจังหวัด:
   - Name: เข้าร่วมการแข่งขันดนตรีไทยระดับภาค
   - Date: 20/08/2025
```

**Expected Score**:
- activity_within_province_internal_score = 5
- activity_outside_province_score = 5

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-012: กรอกข้อมูล Step 8 (ประชาสัมพันธ์)

**Priority**: Medium  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เพิ่ม กิจกรรมประชาสัมพันธ์ | แสดงฟอร์มเพิ่มกิจกรรม |
| 2 | กรอก ชื่อกิจกรรม, แพลตฟอร์ม | รับค่าได้ |
| 3 | กรอก วันที่เผยแพร่, ลิงก์ | รับค่าได้ |
| 4 | ติ๊ก ช่องทาง PR (Facebook, YouTube, TikTok) | Checkbox เลือกได้หลายตัว |
| 5 | ติ๊ก ทราบข่าวจาก (โรงเรียน, สำนักวัฒนธรรม, ฯลฯ) | Checkbox เลือกได้ |
| 6 | กรอก ปัญหาและอุปสรรค (optional) | รับค่าได้ (text area) |
| 7 | กรอก ข้อเสนอแนะ (optional) | รับค่าได้ (text area) |
| 8 | คลิก "ถัดไป" | เปลี่ยนไป Step 9 |

**Test Data**:
```
PR Activities:
- Name: เผยแพร่คลิปการแสดงดนตรีไทย
- Platform: YouTube
- Date: 10/07/2025
- Link: https://youtube.com/watch?v=xxx

PR Channels: ☑ Facebook ☑ YouTube
Heard From: ☑ สำนักงานวัฒนธรรม
```

**Expected Score**: pr_activity_score = 5

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-013: กรอกข้อมูล Step 9 (ลิงก์รูปภาพและวิดีโอ)

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | กรอก ลิงก์ Google Drive รูปภาพ | รับค่า URL ได้ (required) |
| 2 | กรอก ลิงก์วิดีโอที่ 1 | รับค่า URL ได้ (required) |
| 3 | กรอก ลิงก์วิดีโอที่ 2 | รับค่า URL ได้ (required) |
| 4 | ตรวจสอบ URL format | ต้องเป็น https:// |
| 5 | คลิก "ถัดไป" | เปลี่ยนไป Step 10 |

**Test Data**:
```
Photo Gallery: https://drive.google.com/drive/folders/xxxxx
Video 1: https://youtube.com/watch?v=video1
Video 2: https://youtube.com/watch?v=video2
```

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-014: Validation - URL ไม่ถูกต้อง (Step 9)

**Priority**: Medium  
**Type**: Negative

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | กรอก URL ไม่มี https:// | แสดง error "URL ต้องเริ่มด้วย https://" |
| 2 | กรอก URL ผิด format | แสดง error "URL ไม่ถูกต้อง" |
| 3 | เว้น ลิงก์รูปภาพ ว่าง | แสดง error "กรุณากรอกลิงก์รูปภาพ" |
| 4 | เว้น ลิงก์วิดีโอ ว่าง | แสดง error "กรุณากรอกลิงก์วิดีโอ" |
| 5 | คลิก "ถัดไป" | ไม่สามารถไปต่อได้ |

**Test Data**: URL ผิด format  
**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-015: กรอกข้อมูล Step 10 (ยืนยันและส่ง)

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | ตรวจสอบข้อมูลสรุป | แสดงข้อมูลที่กรอกทั้งหมด |
| 2 | ตรวจสอบคะแนนที่คำนวณได้ | แสดงคะแนนแต่ละหมวด + คะแนนรวม |
| 3 | ติ๊ก รับรองความถูกต้อง | Checkbox ต้องติ๊กถึงจะส่งได้ |
| 4 | คลิก "ส่งข้อมูล" | แสดง popup ยืนยัน |
| 5 | ยืนยันการส่ง | ส่งข้อมูลสำเร็จ |
| 6 | ตรวจสอบหน้าผลลัพธ์ | แสดงข้อความ "ส่งข้อมูลสำเร็จ" พร้อม schoolId |
| 7 | ตรวจสอบ Email | ได้รับ email แจ้งการส่งข้อมูลสำเร็จ |

**Test Data**: ข้อมูลครบถ้วนจาก Step 1-9  
**Expected**: 
- schoolId format: `DCP-XXXX`
- status: `pending`
- total_score: ตามการคำนวณจากข้อมูล (max 200)

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-R100-016: Score Calculation - ตรวจสอบการคำนวณคะแนน

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | ติ๊ก หลักสูตร 4 ช่อง | teaching_curriculum_score = 20 |
| 2 | เพิ่ม ครู 4 คน (unique qualification) | teacher_qualification_score = 20 |
| 3 | ติ๊ก สนับสนุนจากต้นสังกัด | support_from_org_score = 5 |
| 4 | ติ๊ก สนับสนุนจากภายนอก | support_from_external_score = 15 |
| 5 | เพิ่ม รางวัลระดับประเทศ | award_score = 20 |
| 6 | เพิ่ม กิจกรรมภายใน | activity_within_province_internal_score = 5 |
| 7 | เพิ่ม กิจกรรมภายนอก | activity_within_province_external_score = 5 |
| 8 | เพิ่ม กิจกรรมนอกจังหวัด | activity_outside_province_score = 5 |
| 9 | เพิ่ม กิจกรรม PR | pr_activity_score = 5 |
| 10 | ตรวจสอบคะแนนรวม | total_score = 100 (Part 1) |

**Expected Total**: 100 คะแนน (Part 1) + 100 คะแนน (Part 2 จาก video) = **200 คะแนน**

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

## Register-Support Test Cases

### TC-RS-001: เปิดหน้าแบบฟอร์ม Register-Support

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เข้า URL: `/regist-support` | หน้าเว็บโหลดสำเร็จ |
| 2 | ตรวจสอบหัวข้อหน้า | แสดง "ลงทะเบียนโรงเรียนสนับสนุนและส่งเสริม" |
| 3 | ตรวจสอบ Step Indicator | แสดง Step 1/10 |
| 4 | ตรวจสอบปุ่ม | แสดงปุ่ม "ถัดไป" และ "บันทึกแบบร่าง" |

**Test Data**: N/A  
**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-RS-002: กรอกข้อมูล Step 1 - ประเภทองค์กร

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เลือก ประเภทองค์กร | แสดงตัวเลือก: สถานศึกษา, ชุมนุม, ชมรม, กลุ่ม, วงดนตรีไทย |
| 2 | เลือก "สถานศึกษา" | แสดงช่อง "ชื่อสถานศึกษา" |
| 3 | เลือก "ชุมนุม" | แสดงช่อง "ชื่อชุมนุม" |
| 4 | เลือก "ชมรม" | แสดงช่อง "ชื่อชมรม" |
| 5 | เลือก "กลุ่ม" | แสดงช่อง "ชื่อกลุ่ม" |
| 6 | เลือก "วงดนตรีไทย" | แสดงช่อง "ชื่อวงดนตรี" |
| 7 | กรอก จำนวนสมาชิก | รับค่าตัวเลขได้ |
| 8 | กรอก Email, เบอร์โทร | รับค่า format ถูกต้อง |

**Test Data**:
```
Type: สถานศึกษา
Name: โรงเรียนทดสอบสนับสนุน
Members: 50
Email: support@school.ac.th
Phone: 0845678901
```

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-RS-003: กรอกข้อมูล Step 2-9 (เหมือน Register100)

**Priority**: High  
**Type**: Functional

**Steps 2-9 ทดสอบแบบเดียวกับ Register100**:
- Step 2: ผู้บริหาร ✓
- Step 3: สภาวการณ์ ✓
- Step 4: ผู้สอน ✓
- Step 5: หลักสูตร (แต่คะแนน = teacher_training_score แทน) ✓
- Step 6: การสนับสนุน ✓
- Step 7: กิจกรรม ✓
- Step 8: ประชาสัมพันธ์ ✓
- Step 9: รูปภาพและวิดีโอ ✓

**Test Data**: ใช้ Test Data เดียวกับ TC-R100-002 ถึง TC-R100-013  
**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-RS-004: Score Calculation - Register-Support (คะแนนเต็ม 180)

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เพิ่ม การฝึกอบรมครู | teacher_training_score = 20 (max) |
| 2 | เพิ่ม ครู 4 คน (unique) | teacher_qualification_score = 20 |
| 3 | ติ๊ก สนับสนุนจากต้นสังกัด | support_from_org_score = 5 |
| 4 | ติ๊ก สนับสนุนจากภายนอก | support_from_external_score = 15 |
| 5 | เพิ่ม รางวัลระดับประเทศ | award_score = 20 |
| 6 | เพิ่ม กิจกรรมทั้ง 3 ประเภท | activity scores = 5+5+5 = 15 |
| 7 | เพิ่ม กิจกรรม PR | pr_activity_score = 5 |
| 8 | ตรวจสอบคะแนนรวม | total_score = 100 (Part 1) |

**Expected Total**: 100 คะแนน (Part 1) + 80 คะแนน (Part 2) = **180 คะแนน**  
**Note**: Part 2 คะแนนเต็ม 80 (ไม่ใช่ 100 เหมือน Register100)

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-RS-005: Grade Calculation - Register-Support

**Priority**: Medium  
**Type**: Functional

| Test Case | Total Score | Expected Grade | Calculation |
|-----------|-------------|----------------|-------------|
| RS-005-A | 180 คะแนน | A | 180/180 = 100% ≥ 80% |
| RS-005-B | 144 คะแนน | A | 144/180 = 80% |
| RS-005-C | 143 คะแนน | B | 143/180 = 79.4% |
| RS-005-D | 126 คะแนน | B | 126/180 = 70% |
| RS-005-E | 125 คะแนน | C | 125/180 = 69.4% |
| RS-005-F | 108 คะแนน | C | 108/180 = 60% |
| RS-005-G | 90 คะแนน | D | 90/180 = 50% |
| RS-005-H | 89 คะแนน | F | 89/180 = 49.4% |
| RS-005-I | 0 คะแนน | F | 0/180 = 0% |

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

## Automated Testing (Playwright)

### Overview

ระบบมี Automated Test Scripts สำหรับทดสอบการลงทะเบียนโดยอัตโนมัติด้วย Playwright

**Test Framework**: Playwright  
**Test Location**: `tests/`  
**Test Environment**: Local (http://localhost:3000)

### คำสั่งรัน Test

#### 1. คำสั่งหลักสำหรับรัน Test ใน Local

| คำสั่ง | จุดประสงค์ | Mode |
|--------|-----------|------|
| `npx playwright test tests/regist-support-9teachers-full.spec.ts` | ทดสอบแบบมาตรฐาน (9 ครู) | Headless |
| `npx playwright test tests/regist-support-save-draft.spec.ts` | ทดสอบบันทึกแบบร่าง (Save Draft) | Headless |
| `npx playwright test tests/register-support-production-test.spec.ts --headed` | เปิด Browser ให้เห็นการทำงาน | Headed |
| `npx playwright test tests/regist-support-2teachers-quick.spec.ts` | ทดสอบแบบรวดเร็ว (2 ครู) | Headless |
| `npx playwright test tests/regist-support-full-100points.spec.ts` | ทดสอบคะแนนเต็ม 100 | Headless |
| `npx playwright test tests/regist-support-small-image-test.spec.ts` | ทดสอบอัปโหลดรูปขนาดเล็ก | Headless |

---

### รายการ Test Cases สำหรับ Register-Support (Local)

#### TC-AUTO-RS-001: Register-Support Full Test (9 Teachers)

**File**: `tests/regist-support-9teachers-full.spec.ts`  
**Purpose**: ทดสอบการกรอกข้อมูลครบถ้วนทั้ง 9 ครู  
**Target Score**: 80/80 คะแนน (Part 1)

**Test Coverage**:
- ✅ Step 1: ข้อมูลหน่วยงาน (ประเภท: ชมรม, สมาชิก 50 คน)
- ✅ Step 2: ผู้บริหาร + อัปโหลดรูป
- ✅ Step 3: ความพร้อม (เครื่องดนตรี)
- ✅ Step 4: ครู 4 คน (unique qualifications) + รูปครู
- ✅ Step 5: สถานที่สอน
- ✅ Step 6: การสนับสนุน (ต้นสังกัด + ภายนอก 3 รายการ)
- ✅ Step 7: รางวัล (ระดับประเทศ = 20 คะแนน)
- ✅ Step 8: กิจกรรม (3 ประเภท × 3 รายการ = 15 คะแนน)
- ✅ Step 9: ประชาสัมพันธ์ (3 รายการ = 5 คะแนน)

**Expected Result**:
```
Teacher Qualification: 20 points (4 unique types × 5)
Support from Org: 5 points
Support from External: 15 points (3+ items)
Award: 20 points (ระดับประเทศ)
Activities Internal: 5 points
Activities External: 5 points
Activities Outside: 5 points
PR Activities: 5 points
──────────────────────
TOTAL: 80 points
```

**Command**: `npx playwright test tests/regist-support-9teachers-full.spec.ts`

---

#### TC-AUTO-RS-002: Save Draft Test

**File**: `tests/regist-support-save-draft.spec.ts`  
**Purpose**: ทดสอบการบันทึกแบบร่าง (Save Draft)  
**Timeout**: 120 seconds (รอ manual OTP entry)

**Test Coverage**:
- ✅ Step 1: กรอกข้อมูลบางส่วน (ประเภท: กลุ่ม)
- ✅ คลิก "บันทึกแบบร่าง" ใน Step 1
- ✅ รอ 30 วินาที สำหรับกรอก Email/Phone manual
- ✅ Step 2-5: กรอกข้อมูลบางส่วนและบันทึกแบบร่างทุก step

**Test Data**:
```
Email: draft-support-{timestamp}@gmail.com
Phone: 0899297983
Support Type: กลุ่ม (15 members)
Teachers: 3 teachers (minimal)
Instruments: 2 instruments
```

**Command**: `npx playwright test tests/regist-support-save-draft.spec.ts`

---

#### TC-AUTO-RS-003: Production Test (Headed Mode)

**File**: `tests/register-support-production-test.spec.ts`  
**Purpose**: ทดสอบบน production server พร้อมแสดง browser  
**Server**: http://18.138.63.84:3000

**Test Coverage**:
- ✅ Network monitoring (API requests/responses)
- ✅ Error tracking (400, 500 errors)
- ✅ Full form submission
- ✅ Teacher info modal handling

**Test Data**:
```
Email: thaimusicplatform@gmail.com
Phone: 0899297983
Support Type: สถานศึกษา
```

**Command**: `npx playwright test tests/register-support-production-test.spec.ts --headed`

---

#### TC-AUTO-RS-004: Quick Test (2 Teachers)

**File**: `tests/regist-support-2teachers-quick.spec.ts`  
**Purpose**: ทดสอบแบบรวดเร็วด้วยครู 2 คน + ตรวจสอบ MongoDB  
**Timeout**: 180 seconds

**Test Coverage**:
- ✅ กรอกข้อมูลขั้นต่ำทุก step
- ✅ ครู 2 คน (2 unique qualifications)
- ✅ อัปโหลดรูป (manager + 2 teachers)
- ✅ Submit form
- ✅ **Verify data in MongoDB**

**MongoDB Verification**:
```javascript
✓ School name
✓ Support type
✓ Manager name
✓ Teachers count (2)
✓ Teachers with images (2/2)
✓ Manager image uploaded
✓ Score calculation:
  - Teacher Training: 10 points
  - Support from Org: 5 points
  - Total: calculated correctly
```

**Command**: `npx playwright test tests/regist-support-2teachers-quick.spec.ts`

---

#### TC-AUTO-RS-005: Full 100 Points Test

**File**: `tests/regist-support-full-100points.spec.ts`  
**Purpose**: ทดสอบในกรณีต้องการคะแนนเต็ม 100 คะแนน  
**Target**: Maximum points

**Test Coverage**:
- ✅ Support Type: สถานศึกษา (500 members)
- ✅ Staff: 150, Students: 2000
- ✅ เครื่องดนตรี 8 ชนิด (maximum)
- ✅ ครู 12 คน (maximum)
- ✅ Training checkboxes: ALL checked
- ✅ สนับสนุน: ต้นสังกัด + ภายนอก 3+ รายการ
- ✅ รางวัล 3+ รายการ (ระดับประเทศ)
- ✅ กิจกรรม 3 ประเภท (3+ รายการแต่ละประเภท)
- ✅ PR 3+ รายการ

**Expected Score**: 100 คะแนน (maximum)

**Command**: `npx playwright test tests/regist-support-full-100points.spec.ts`

---

#### TC-AUTO-RS-006: Small Image Upload Test

**File**: `tests/regist-support-small-image-test.spec.ts`  
**Purpose**: ทดสอบการอัปโหลดรูปภาพขนาดเล็ก  
**Image Size**: ~100 bytes (1×1 pixel PNG)

**Test Coverage**:
- ✅ Support Type: วงดนตรีไทย
- ✅ อัปโหลดรูปผู้บริหารขนาดเล็ก (~100 bytes)
- ✅ อัปโหลดรูปครูขนาดเล็ก
- ✅ Verify upload success
- ✅ **Verify image paths in MongoDB**

**Command**: `npx playwright test tests/regist-support-small-image-test.spec.ts`

---

### Test Utilities

#### Helper Functions (ใช้ในทุก test)

```typescript
// Dismiss consent modal
async function dismissConsent(page) {
  const btn = page.locator('button:has-text("ยอมรับ")');
  if (await btn.isVisible()) await btn.click();
}

// Set controlled input (for React controlled components)
async function setControlledInput(page, selector, value) {
  await page.evaluate(({ sel, val }) => {
    const input = document.querySelector(sel);
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    setter.call(input, val);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, { sel: selector, val: value });
}

// Upload file
async function uploadFile(page, inputId, filePath) {
  await page.locator(`#${inputId}`).setInputFiles(filePath);
}

// Click next button with retry
async function clickNext(page, label) {
  for (let attempt = 1; attempt <= 8; attempt++) {
    const btn = page.locator('button:has-text("ถัดไป")').last();
    await btn.click({ force: true });
    // Handle validation modals
    const modal = page.locator('button:has-text("ตกลง")');
    if (await modal.isVisible()) {
      await modal.click();
      continue;
    }
    return; // Success
  }
  throw new Error(`Cannot advance from ${label}`);
}
```

---

### Test Assets

**Location**: `tests/test-assets/` หรือ `public/`

**Required Files**:
- `manager.jpg` — รูปผู้บริหาร
- `teacher1.jpg`, `teacher2.jpg`, `teacher3.jpg`, `teacher4.jpg` — รูปครู
- `flower.jpg` — รูปทดสอบ (optional)

**Image Requirements**:
- Format: JPG, PNG, GIF
- Max Size: 10 MB
- Min Size: ~100 bytes (for small image test)

---

### Environment Variables

```bash
# MongoDB Connection (สำหรับ verification tests)
MONGODB_URI=mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin
```

---

### Test Reports

**Screenshot Location**: `test-results/`

**Generated Screenshots**:
- `regist-support-full-submission.png` — Full form submission
- `regist-support-2teachers-submission.png` — 2 teachers test
- `regist-support-missing-fields.png` — Validation errors
- `regist-support-validation-errors.png` — Validation test

---

### Running All Register-Support Tests

```bash
# Run all register-support tests
npx playwright test tests/regist-support*.spec.ts

# Run with UI mode (debug)
npx playwright test tests/regist-support-9teachers-full.spec.ts --ui

# Run with trace
npx playwright test tests/regist-support-9teachers-full.spec.ts --trace on

# Generate HTML report
npx playwright show-report
```

---

### Test Results Summary

| Test Case | Duration | Status | Notes |
|-----------|----------|--------|-------|
| TC-AUTO-RS-001 (9 Teachers) | ~5 min | ✅ Pass | Full workflow |
| TC-AUTO-RS-002 (Save Draft) | ~2 min | ✅ Pass | Manual OTP entry |
| TC-AUTO-RS-003 (Production) | ~2 min | ✅ Pass | Headed mode |
| TC-AUTO-RS-004 (2 Teachers) | ~3 min | ✅ Pass | + MongoDB verify |
| TC-AUTO-RS-005 (100 Points) | ~6 min | ✅ Pass | Maximum score |
| TC-AUTO-RS-006 (Small Image) | ~2 min | ✅ Pass | Image upload |

---


## Draft System Test Cases

### TC-DRAFT-001: บันทึกแบบร่าง (Save Draft) - Register100

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | กรอกข้อมูล Step 1 บางส่วน | ข้อมูลถูกบันทึกใน state |
| 2 | คลิก "บันทึกแบบร่าง" | แสดง modal กรอก Email/Phone |
| 3 | กรอก Email และ Phone | ส่ง OTP ไปยัง Email |
| 4 | กรอก OTP 6 หลัก | ตรวจสอบ OTP สำเร็จ |
| 5 | บันทึกแบบร่างสำเร็จ | ได้รับ Draft Token (UUID) |
| 6 | เปิด Email | ได้รับลิงก์กลับมาแก้ไข |
| 7 | คลิกลิงก์ในอีเมล | เข้าสู่หน้าฟอร์มพร้อมข้อมูลเดิม |
| 8 | แก้ไขและส่งแบบฟอร์ม | ส่งข้อมูลสำเร็จ |

**Test Data**:
```
Email: draft-test@example.com
Phone: 0812345678
Draft Token: 26b4458a-49b8-4b24-b90f-64020794a306
```

**Expected**:
- Draft expires: 7 days
- OTP expires: 10 minutes
- OTP attempts: max 5
- Save rate limit: 5 times/hour

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-DRAFT-002: OTP Rate Limiting

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | ขอ OTP ครั้งที่ 1 | OTP sent successfully |
| 2 | ขอ OTP ครั้งที่ 2 (ภายใน 1 ชม.) | OTP sent successfully |
| 3 | ขอ OTP ครั้งที่ 3 (ภายใน 1 ชม.) | OTP sent successfully |
| 4 | ขอ OTP ครั้งที่ 4 (ภายใน 1 ชม.) | แสดง error "เกินจำนวนครั้งที่กำหนด" |
| 5 | รอ 1 ชั่วโมง | Rate limit reset |
| 6 | ขอ OTP อีกครั้ง | OTP sent successfully |

**Rate Limits**:
- OTP request: 3 times/hour
- Draft save: 5 times/hour
- OTP wrong attempts: 5 attempts before lock

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-DRAFT-003: OTP Verification - Wrong OTP

**Priority**: High  
**Type**: Negative

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | กรอก OTP ผิด (ครั้งที่ 1) | แสดง error "รหัส OTP ไม่ถูกต้อง" (เหลือ 4 ครั้ง) |
| 2 | กรอก OTP ผิด (ครั้งที่ 2) | แสดง error (เหลือ 3 ครั้ง) |
| 3 | กรอก OTP ผิด (ครั้งที่ 3) | แสดง error (เหลือ 2 ครั้ง) |
| 4 | กรอก OTP ผิด (ครั้งที่ 4) | แสดง error (เหลือ 1 ครั้ง) |
| 5 | กรอก OTP ผิด (ครั้งที่ 5) | แสดง error "OTP ถูก lock" |
| 6 | ขอ OTP ใหม่ | Reset OTP attempts |
| 7 | กรอก OTP ถูกต้อง | ยืนยัน OTP สำเร็จ |

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-DRAFT-004: Draft Expiry

**Priority**: Medium  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | บันทึกแบบร่าง | Draft created with expiresAt = +7 days |
| 2 | เปิดลิงก์ภายใน 7 วัน | เข้าฟอร์มได้ พร้อมข้อมูลเดิม |
| 3 | รอจนหมดอายุ (7 วัน) | Draft status = "expired" |
| 4 | เปิดลิงก์หลังหมดอายุ | แสดง error "แบบร่างหมดอายุแล้ว" |
| 5 | ลองส่งแบบฟอร์ม | ไม่สามารถส่งได้ |

**MongoDB Query**:
```javascript
db.draft_submissions.findOne({
  token: "...",
  expiresAt: { $gt: new Date() }
})
```

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

## Admin Management Test Cases

### TC-ADMIN-001: Admin Login

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เข้า `/dcp-admin` | แสดงหน้า login |
| 2 | กรอก Email: `admin@test.com` | รับค่า email |
| 3 | กรอก Password: `Test@1234` | รับค่า password (masked) |
| 4 | คลิก "เข้าสู่ระบบ" | ตรวจสอบ credentials |
| 5 | Login สำเร็จ | Redirect to `/dcp-admin/dashboard` |
| 6 | ตรวจสอบ JWT token | Token stored in cookie |
| 7 | Refresh หน้า | ยังคง logged in |

**Test Data**:
```
Email: admin@test.com
Password: Test@1234
Role: admin
```

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-ADMIN-002: View Register-Support Details

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as admin | เข้าสู่ระบบสำเร็จ |
| 2 | เข้า `/dcp-admin/dashboard/register-support` | แสดงรายการโรงเรียน |
| 3 | คลิกดูรายละเอียดโรงเรียน | เข้าสู่หน้า `/register-support/[id]` |
| 4 | ตรวจสอบข้อมูลทั้งหมด | แสดงข้อมูล 9 steps ครบถ้วน |
| 5 | ตรวจสอบคะแนน | แสดงคะแนนแต่ละหมวด + คะแนนรวม |
| 6 | ตรวจสอบเกรด | แสดงเกรด A-F ตามคะแนน |

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-ADMIN-003: Edit Register-Support Scores (Manual Mode)

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เข้าหน้ารายละเอียดโรงเรียน | แสดงข้อมูลและคะแนน |
| 2 | คลิกปุ่ม "แก้ไข" (mode=edit) | เปลี่ยนเป็น edit mode |
| 3 | แก้ไขคะแนน teacher_qualification_score จาก 10 → 20 | รับค่าใหม่ |
| 4 | แก้ไขคะแนน award_score จาก 10 → 20 | รับค่าใหม่ |
| 5 | คลิก "บันทึก" | ส่ง API PUT with scores |
| 6 | ตรวจสอบคะแนน | คะแนนเป็น 20 (ไม่ถูกคำนวณใหม่) |
| 7 | Reload หน้า | คะแนนยังคงเป็น 20 (preserved) |

**Expected Log**:
```
Manual score edit detected - using admin-provided scores
✓ Scores preserved: 20, 20
✓ Total score updated
```

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-ADMIN-004: Edit Register-Support Data (Auto-Calculate Mode)

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เข้าหน้ารายละเอียดโรงเรียน | แสดงข้อมูลและคะแนน |
| 2 | คลิกปุ่ม "แก้ไข" (mode=edit) | เปลี่ยนเป็น edit mode |
| 3 | แก้ไขชื่อโรงเรียน | รับค่าใหม่ |
| 4 | แก้ไข province | รับค่าใหม่ |
| 5 | **ไม่แก้ไขคะแนน** | - |
| 6 | คลิก "บันทึก" | ส่ง API PUT without scores |
| 7 | ตรวจสอบคะแนน | คะแนนถูกคำนวณใหม่จากข้อมูล |

**Expected Log**:
```
Normal edit detected - recalculating scores
✓ Scores recalculated from data
✓ Total score updated
```

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-ADMIN-005: Delete Submission

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เข้าหน้ารายการโรงเรียน | แสดงรายการ |
| 2 | คลิกปุ่ม "ลบ" | แสดง confirmation modal |
| 3 | ยืนยันการลบ | ส่ง API DELETE |
| 4 | ลบสำเร็จ | แสดง success message |
| 5 | Reload หน้า | ข้อมูลถูกลบออกจากรายการ |
| 6 | ตรวจสอบ MongoDB | ข้อมูลถูกลบ (hard delete) |

**Warning**: ระบบใช้ **Hard Delete** ข้อมูลที่ลบแล้วจะหายถาวร

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-ADMIN-006: Export to Excel

**Priority**: Medium  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เข้าหน้ารายละเอียดโรงเรียน | แสดงข้อมูล |
| 2 | คลิกปุ่ม "Export Excel" | ดาวน์โหลดไฟล์ .xlsx |
| 3 | เปิดไฟล์ Excel | แสดงข้อมูลทั้งหมด |
| 4 | ตรวจสอบข้อมูล | ครบถ้วน readable format |
| 5 | ตรวจสอบคะแนน | แสดงคะแนนแต่ละหมวด |

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-ADMIN-007: Export to PDF

**Priority**: Medium  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เข้าหน้ารายละเอียดโรงเรียน | แสดงข้อมูล |
| 2 | คลิกปุ่ม "Export PDF" | ดาวน์โหลดไฟล์ .pdf |
| 3 | เปิดไฟล์ PDF | แสดงข้อมูลในรูปแบบเอกสาร |
| 4 | ตรวจสอบการจัดรูปแบบ | อ่านง่าย พร้อมพิมพ์ |

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-ADMIN-008: Server-Side Filtering

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เข้าหน้ารายการโรงเรียน | แสดงรายการทั้งหมด (408+ schools) |
| 2 | เลือก Province: "กรุงเทพมหานคร" | แสดงเฉพาะโรงเรียนใน กทม. |
| 3 | เลือก Level: "มัธยมศึกษา" | แสดงเฉพาะระดับมัธยม |
| 4 | กรอก Search: "ดนตรีไทย" | แสดงโรงเรียนที่มีคำว่า "ดนตรีไทย" |
| 5 | เลือก Grade: "A" | แสดงเฉพาะโรงเรียนเกรด A (client-side) |
| 6 | Clear filters | แสดงรายการทั้งหมด |

**API Endpoint**:
```
GET /api/register-support/list?province=...&level=...&search=...
```

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-ADMIN-009: Smart Pagination

**Priority**: Medium  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เข้าหน้ารายการ (ไม่มี filter) | โหลด 10 รายการแรก (fast) |
| 2 | คลิกหน้าถัดไป | โหลด 10 รายการต่อไป |
| 3 | ใส่ filter (province) | โหลดทั้งหมดเพื่อคำนวณ (accurate) |
| 4 | แสดงจำนวนทั้งหมด | แสดงจำนวนที่ตรงกับ filter |

**Pagination Logic**:
- Initial load: 10 items (fast)
- With filter: Load all (accurate count)

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

### TC-ADMIN-010: Registration Control (On/Off)

**Priority**: High  
**Type**: Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as admin | เข้าสู่ระบบสำเร็จ |
| 2 | เข้า `/dcp-admin/dashboard/registration-control` | แสดงหน้าควบคุม |
| 3 | Toggle Register100: OFF | บันทึกการตั้งค่า |
| 4 | เปิดหน้า `/regist100` | แสดงข้อความ "ปิดรับสมัคร" |
| 5 | Toggle Register100: ON | บันทึกการตั้งค่า |
| 6 | เปิดหน้า `/regist100` | แสดงฟอร์มปกติ |

**MongoDB Query**:
```javascript
db.system_settings.updateOne(
  { key: "registration_settings" },
  { $set: { "value.register100Open": false } }
)
```

**Status**: ⬜ Not Tested / ✅ Pass / ❌ Fail  
**Notes**: _______________________

---

## Test Data

### ข้อมูลสำหรับทดสอบ Register100

```javascript
const register100TestData = {
  email: "test-r100@school.ac.th",
  phone: "0812345678",
  schoolName: "โรงเรียนทดสอบดนตรีไทย 100%",
  province: "กรุงเทพมหานคร",
  level: "มัธยมศึกษา",
  affiliation: "กระทรวงศึกษาธิการ",
  staffCount: 100,
  studentCount: 1500,
  
  manager: {
    name: "นายผู้บริหาร ทดสอบ",
    position: "ผู้อำนวยการ",
    phone: "0823456789",
    email: "manager@school.ac.th"
  },
  
  teachers: [
    { name: "ครูทดสอบ 1", qualification: "ครูผู้สอนดนตรี", phone: "0834567890" },
    { name: "ครูทดสอบ 2", qualification: "ครูภูมิปัญญา", phone: "0845678901" },
    { name: "ครูทดสอบ 3", qualification: "ผู้ทรงคุณวุฒิ", phone: "0856789012" },
    { name: "ครูทดสอบ 4", qualification: "วิทยากร", phone: "0867890123" }
  ],
  
  curriculum: {
    compulsory: true,
    elective: true,
    local: true,
    afterSchool: true
  },
  
  awards: [
    { level: "ประเทศ", name: "รางวัลดีเด่น", date: "15/03/2025" }
  ],
  
  expectedScore: {
    teachingCurriculum: 20,
    teacherQualification: 20,
    supportFromOrg: 5,
    supportFromExternal: 15,
    award: 20,
    activityInternal: 5,
    activityExternal: 5,
    activityOutside: 5,
    prActivity: 5,
    total: 100
  }
};
```

### ข้อมูลสำหรับทดสอบ Register-Support

```javascript
const registerSupportTestData = {
  email: "test-support@school.ac.th",
  phone: "0898765432",
  supportType: "สถานศึกษา",
  schoolName: "โรงเรียนทดสอบสนับสนุน",
  province: "กรุงเทพมหานคร",
  level: "มัธยมศึกษา",
  
  expectedScore: {
    teacherTraining: 20,  // Different from Register100
    teacherQualification: 20,
    supportFromOrg: 5,
    supportFromExternal: 15,
    award: 20,
    activityInternal: 5,
    activityExternal: 5,
    activityOutside: 5,
    prActivity: 5,
    total: 100  // Max 180 with Part 2
  }
};
```

---

## Expected Results

### Score Calculation Results

#### Register100 (Max 200)

| Category | Max Score | Calculation Rule |
|----------|-----------|------------------|
| Teaching Curriculum | 20 | checkboxes × 5 (max 4) |
| Teacher Qualification | 20 | unique types × 5 (max 4) |
| Support from Org | 5 | has = 5, none = 0 |
| Support from External | 15 | has = 15, none = 0 |
| Award | 20 | ประเทศ=20, ภาค=15, จังหวัด=10, อำเภอ=5 |
| Activity Internal | 5 | has = 5, none = 0 |
| Activity External | 5 | has = 5, none = 0 |
| Activity Outside | 5 | has = 5, none = 0 |
| PR Activity | 5 | has = 5, none = 0 |
| **Part 1 Total** | **100** | Sum of all categories |
| **Part 2 (Video)** | **100** | Manual scoring by admin |
| **Grand Total** | **200** | Part 1 + Part 2 |

#### Register-Support (Max 180)

| Category | Max Score | Calculation Rule |
|----------|-----------|------------------|
| Teacher Training | 20 | checkboxes × 5 (max 4) |
| Teacher Qualification | 20 | unique types × 5 (max 4) |
| Support from Org | 5 | has = 5, none = 0 |
| Support from External | 15 | has = 15, none = 0 |
| Award | 20 | ประเทศ=20, ภาค=15, จังหวัด=10, อำเภอ=5 |
| Activity Internal | 5 | has = 5, none = 0 |
| Activity External | 5 | has = 5, none = 0 |
| Activity Outside | 5 | has = 5, none = 0 |
| PR Activity | 5 | has = 5, none = 0 |
| **Part 1 Total** | **100** | Sum of all categories |
| **Part 2 (Video)** | **80** | Manual scoring by admin |
| **Grand Total** | **180** | Part 1 + Part 2 |

---

## Test Summary Template

```markdown
## Test Execution Summary

**Date**: _____________  
**Tester**: _____________  
**Environment**: Development / Staging / Production  
**Browser**: Chrome / Firefox / Safari / Edge

### Test Results

| Test Case ID | Description | Status | Notes |
|--------------|-------------|--------|-------|
| TC-R100-001 | เปิดหน้าฟอร์ม Register100 | ✅ Pass | |
| TC-R100-002 | กรอกข้อมูล Step 1 | ✅ Pass | |
| TC-R100-003 | Validation Required Fields | ✅ Pass | |
| TC-R100-015 | Submit Form | ✅ Pass | |
| TC-RS-001 | เปิดหน้าฟอร์ม Register-Support | ✅ Pass | |
| TC-DRAFT-001 | บันทึกแบบร่าง | ✅ Pass | |
| TC-ADMIN-003 | Edit Scores (Manual) | ✅ Pass | |

### Issues Found

| Issue ID | Severity | Description | Status |
|----------|----------|-------------|--------|
| BUG-001 | Medium | Score overwrite issue | ✅ Fixed (fd447a8) |
| BUG-002 | Low | Dropdown not loading | ⬜ Open |

### Overall Result

- **Total Tests**: 50
- **Passed**: 48
- **Failed**: 2
- **Pass Rate**: 96%

**Conclusion**: System ready for production deployment after fixing 2 minor issues.
```

---

**Document Version**: 1.0  
**Last Updated**: July 6, 2026  
**Next Review**: August 6, 2026
