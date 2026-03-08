# Implementation Plan: Regist-Support Validation Test

## Overview

สร้าง Playwright test file สำหรับทดสอบ validation ครบวงจรของฟอร์ม regist-support (8 steps) โดยอ้างอิงจาก pattern ของ register100-complete-validation-test.spec.ts ทดสอบ ValidationErrorModal และ MissingFieldsModal ในทุกกรณีที่จำเป็น

## Tasks

- [x] 1. สร้าง test file และ helper functions
  - [x] 1.1 สร้างไฟล์ tests/regist-support-complete-validation-test.spec.ts
    - Import Playwright test และ expect
    - เพิ่ม header comment อธิบายวัตถุประสงค์ของ test suite
    - _Requirements: 1.1_
  
  - [x] 1.2 สร้าง helper function สำหรับ fill Step 1 minimal data
    - Function: fillStep1Minimal(page) - กรอก schoolName*, schoolProvince*, schoolLevel*, addressNo*, subDistrict*, district*, provinceAddress*, postalCode*, phone*
    - _Requirements: 1.2, 2.1_
  
  - [x] 1.3 สร้าง helper function สำหรับ fill Step 2 minimal data
    - Function: fillStep2Minimal(page) - กรอก mgtFullName*, mgtPosition*, mgtPhone*, mgtAddress*, mgtEmail*, mgtImage*
    - _Requirements: 1.2, 2.2_
  
  - [x] 1.4 สร้าง beforeEach hook
    - Navigate ไปที่ http://localhost:3000/regist-support
    - รอให้หน้าโหลดเสร็จ
    - ปิด ConsentModal ถ้ามี
    - _Requirements: 1.3_

- [x] 2. Implement Test 1: Step 1 Validation Modal
  - [x] 2.1 เขียน test case สำหรับ Step 1 validation
    - คลิก "ถัดไป" โดยไม่กรอกข้อมูล
    - ตรวจสอบว่า ValidationErrorModal ปรากฏ
    - ปิด modal และตรวจสอบว่ายังอยู่ที่ Step 1
    - _Requirements: 2.1, 3.1_
  
  - [ ]* 2.2 เพิ่ม console logging และ screenshot
    - Log ขั้นตอนการทดสอบ
    - บันทึก screenshot เมื่อ modal ปรากฏ
    - _Requirements: 4.1_

- [x] 3. Implement Test 2: Step 2 Validation Modal
  - [x] 3.1 เขียน test case สำหรับ Step 2 validation
    - กรอก Step 1 minimal data และไปต่อ
    - คลิก "ถัดไป" ที่ Step 2 โดยไม่กรอกข้อมูล
    - ตรวจสอบว่า ValidationErrorModal ปรากฏ
    - _Requirements: 2.2, 3.1_

- [x] 4. Implement Test 3: Steps 3-7 Navigation
  - [x] 4.1 เขียน test case สำหรับ navigation ผ่าน Steps 3-7
    - กรอก Steps 1-2 minimal data
    - Step 4: กรอก thaiMusicTeachers[]* อย่างน้อย 1 รายการ
    - Step 5: กรอก supportFactors[]* และ awards[]* อย่างน้อย 1 รายการ
    - คลิก "ถัดไป" ผ่าน Steps 3-7
    - ตรวจสอบว่าสามารถไปถึง Step 8 ได้
    - _Requirements: 2.3_

- [x] 5. Implement Test 4: Missing Fields Modal - Unchecked Certification
  - [x] 5.1 เขียน test case สำหรับ unchecked certification
    - กรอก Steps 1-2 minimal data
    - Step 4: กรอก thaiMusicTeachers[]* อย่างน้อย 1 รายการ
    - Step 5: กรอก supportFactors[]* และ awards[]* อย่างน้อย 1 รายการ
    - Navigate ผ่าน Steps 3-7
    - ไม่ check certifiedINFOByAdminName* checkbox
    - คลิก "ส่งแบบฟอร์ม"
    - ตรวจสอบว่า MissingFieldsModal ปรากฏพร้อม Step 8 message
    - _Requirements: 2.4, 3.2_

- [x] 6. Implement Test 5: Missing Fields Modal - Empty Required Fields
  - [x] 6.1 เขียน test case สำหรับ empty required fields
    - ไม่กรอกข้อมูลเลย
    - Navigate ไปถึง Step 8
    - Check certification checkbox
    - คลิก "ส่งแบบฟอร์ม"
    - ตรวจสอบว่า MissingFieldsModal แสดง missing fields จาก Steps 1-2
    - _Requirements: 2.5, 3.2_

- [x] 7. Implement Test 6: Successful Submission
  - [x] 7.1 เขียน test case สำหรับ successful submission
    - กรอก Steps 1-2 minimal data
    - Step 4: กรอก thaiMusicTeachers[]* อย่างน้อย 1 รายการ
    - Step 5: กรอก supportFactors[]* และ awards[]* อย่างน้อย 1 รายการ
    - Navigate ผ่าน Steps 3-7
    - Check certifiedINFOByAdminName* checkbox
    - คลิก "ส่งแบบฟอร์ม"
    - ตรวจสอบว่า SuccessModal ปรากฏ (ไม่ใช่ MissingFieldsModal)
    - _Requirements: 2.6, 3.3_

- [ ] 8. Checkpoint - Run tests และตรวจสอบผลลัพธ์
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 9. Implement Test 7: Email Validation (Optional)
  - [ ]* 9.1 เขียน test case สำหรับ email validation
    - กรอก mgtEmail* ที่ไม่ถูกต้อง (ถ้ามี validation)
    - ตรวจสอบ error message
    - _Requirements: 2.7_

- [ ]* 10. Implement Test 8: Step Navigation Persistence (Optional)
  - [ ]* 10.1 เขียน test case สำหรับ step navigation persistence
    - กรอกข้อมูลที่ Step 1
    - ไปที่ Step 2
    - กลับมาที่ Step 1
    - ตรวจสอบว่าข้อมูลยังอยู่
    - _Requirements: 2.8_

- [ ]* 11. Implement Test 9: Consent Modal Auto-Close (Optional)
  - [ ]* 11.1 เขียน test case สำหรับ consent modal behavior
    - ตรวจสอบว่า ConsentModal ปรากฏเมื่อโหลดหน้า
    - ตรวจสอบว่าปิดได้ถูกต้อง
    - _Requirements: 2.9_

- [ ]* 12. Implement Test 10: Image Upload Validation (Optional)
  - [ ]* 12.1 เขียน test case สำหรับ image upload
    - ทดสอบ upload รูปภาพที่ Step 2 (mgtImage*)
    - ตรวจสอบว่า upload สำเร็จ
    - _Requirements: 2.10_

- [ ] 13. Final checkpoint - Run full test suite
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional และสามารถข้ามได้สำหรับ MVP
- Test file จะอยู่ที่ tests/regist-support-complete-validation-test.spec.ts
- อ้างอิงจาก tests/register100-complete-validation-test.spec.ts เป็น pattern
- Required fields ที่ต้องทดสอบ (มีดอกจันทร์แดง *):
  - Step 1: schoolName*, schoolProvince*, schoolLevel*, addressNo*, subDistrict*, district*, provinceAddress*, postalCode*, phone*
  - Step 2: mgtFullName*, mgtPosition*, mgtPhone*, mgtAddress*, mgtEmail*, mgtImage*
  - Step 4: thaiMusicTeachers[]* (array ต้องมีอย่างน้อย 1 รายการ)
  - Step 5: supportFactors[]*, awards[]* (arrays ต้องมีอย่างน้อย 1 รายการ)
  - Step 8: certifiedINFOByAdminName* checkbox
- ใช้ TypeScript สำหรับ implementation
- ใช้ Playwright test framework
- Test ควรรัน headless mode ได้
