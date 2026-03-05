# Register-Support Test Files Summary

## AWS Production Tests (ทดสอบบน AWS แล้ว ✅)

### 1. `tests/aws-quick-test-no-images.spec.ts` ✅
- **Status**: PASSED
- **Purpose**: ทดสอบความเร็ว API โดยไม่มีรูปภาพ
- **Duration**: 0.27s (API response)
- **Data**: ไม่มีรูปภาพ
- **Submission ID**: 699fef026dfd365c1b772658
- **URL**: http://13.212.254.184:3000/regist-support

### 2. `tests/aws-partial-score-test.spec.ts` ✅
- **Status**: PASSED
- **Purpose**: ทดสอบการส่งข้อมูลแบบบางส่วน (3 ครู, ~45 คะแนน)
- **Duration**: 3.30s (API response), 36.8s (total)
- **Data**: 2.04 MB (Manager + 3 Teachers)
- **Submission ID**: 699ff2c86dfd365c1b772659
- **URL**: http://13.212.254.184:3000/regist-support

### 3. `tests/aws-regist-support-test.spec.ts` ✅
- **Status**: PASSED
- **Purpose**: ทดสอบการส่งฟอร์มพื้นฐานด้วย 3 ครู
- **Duration**: 35.8s
- **Data**: 2.04 MB
- **Submission ID**: 699feddb6dfd365c1b772657
- **URL**: http://13.212.254.184:3000/regist-support

### 4. `tests/aws-full-9teachers-test.spec.ts` ✅
- **Status**: PASSED
- **Purpose**: ทดสอบการส่งข้อมูลเต็ม 100 คะแนน (9 ครู)
- **Duration**: 2.19s (API response)
- **Data**: 5.1 MB (Manager + 9 Teachers)
- **Submission ID**: 699fee706dfd365c1b772657
- **URL**: http://13.212.254.184:3000/regist-support

---

## Local Development Tests (สำหรับ localhost)

### 5. `tests/regist-support-full.spec.ts`
- **Purpose**: ทดสอบการกรอกฟอร์มเต็มรูปแบบ
- **Features**:
  - Full form submission test
  - Validation test (ทดสอบ error messages)
  - Image size warning test (รูปใหญ่เกิน 10 MB)
- **URL**: http://localhost:3000/regist-support

### 6. `tests/regist-support-full-100points.spec.ts`
- **Purpose**: ทดสอบการส่งข้อมูลเต็ม 100 คะแนน พร้อมตรวจสอบ MongoDB
- **Features**:
  - กรอกข้อมูลครบทุก field
  - ตรวจสอบข้อมูลใน MongoDB
  - ตรวจสอบการคำนวณคะแนน
- **URL**: http://localhost:3000/regist-support

### 7. `tests/regist-support-full-9teachers-db-check.spec.ts`
- **Purpose**: ทดสอบการส่งข้อมูล 9 ครู พร้อมตรวจสอบ MongoDB
- **Features**:
  - กรอกข้อมูล 9 ครู
  - ตรวจสอบข้อมูลครูทั้ง 9 คนใน MongoDB
  - ตรวจสอบรูปภาพทั้งหมด
- **URL**: http://localhost:3000/regist-support

### 8. `tests/regist-support-9teachers-full.spec.ts`
- **Purpose**: ทดสอบการส่งข้อมูล 9 ครู แบบเต็มรูปแบบ
- **Features**:
  - กรอกข้อมูล 9 ครู
  - ตรวจสอบ MongoDB
- **URL**: http://localhost:3000/regist-support

### 9. `tests/regist-support-2teachers-quick.spec.ts`
- **Purpose**: ทดสอบแบบเร็ว ด้วย 2 ครู
- **Features**:
  - กรอกข้อมูล 2 ครู
  - ทดสอบความเร็วในการส่งข้อมูล
  - ตรวจสอบ MongoDB
- **URL**: http://localhost:3000/regist-support

### 10. `tests/regist-support-small-image-test.spec.ts`
- **Purpose**: ทดสอบการอัพโหลดรูปภาพขนาดเล็ก
- **Features**:
  - ทดสอบรูปภาพขนาดเล็ก
  - ตรวจสอบการบันทึกรูปใน MongoDB
- **URL**: http://localhost:3000/regist-support

### 11. `tests/image-size-warning.spec.ts`
- **Purpose**: ทดสอบ warning modal เมื่อรูปภาพใหญ่เกิน 10 MB
- **Features**:
  - ทดสอบทั้ง regist-support และ regist100
  - ตรวจสอบ modal แสดงเตือน
  - ตรวจสอบปุ่ม "ปิด" และ "ส่งต่อ"
- **URL**: http://localhost:3000/regist-support

---

## Summary

### AWS Production Tests (ใช้งานจริง)
- **Total**: 4 files
- **Status**: ✅ ทดสอบผ่านทั้งหมด
- **Coverage**:
  - Quick test (no images)
  - Partial score (3 teachers, ~45 points)
  - Standard test (3 teachers)
  - Full test (9 teachers, 100 points)

### Local Development Tests
- **Total**: 7 files
- **Purpose**: ทดสอบบน localhost ก่อน deploy
- **Coverage**:
  - Full form submission
  - Validation testing
  - Image size warnings
  - MongoDB verification
  - Various teacher counts (2, 9 teachers)
  - 100 points scoring

### Total Test Files for Register-Support
- **11 test files** ทั้งหมด
- **4 files** สำหรับ AWS Production (ทดสอบผ่านแล้ว ✅)
- **7 files** สำหรับ Local Development

---

## Test Commands

### Run AWS Tests
```bash
# Quick test (no images)
npx playwright test tests/aws-quick-test-no-images.spec.ts

# Partial score test (3 teachers)
npx playwright test tests/aws-partial-score-test.spec.ts

# Standard test (3 teachers)
npx playwright test tests/aws-regist-support-test.spec.ts

# Full test (9 teachers, 100 points)
npx playwright test tests/aws-full-9teachers-test.spec.ts

# Run all AWS register-support tests
npx playwright test tests/aws-*-test.spec.ts --grep "register-support|regist-support"
```

### Run Local Tests
```bash
# Full form test
npx playwright test tests/regist-support-full.spec.ts

# 100 points test with DB check
npx playwright test tests/regist-support-full-100points.spec.ts

# 9 teachers with DB check
npx playwright test tests/regist-support-full-9teachers-db-check.spec.ts

# Quick 2 teachers test
npx playwright test tests/regist-support-2teachers-quick.spec.ts

# Run all local register-support tests
npx playwright test tests/regist-support-*.spec.ts
```

---

## Notes

1. **AWS Tests**: ทดสอบบน production environment (http://13.212.254.184:3000)
2. **Local Tests**: ต้องรัน Docker containers ก่อน (`docker-compose up`)
3. **Test Images**: ใช้รูปดอกกล้วยไม้ขนาด 0.51 MB ต่อรูป จาก `regist/test-assets/`
4. **MongoDB**: Local tests จะตรวจสอบข้อมูลใน MongoDB ด้วย
5. **Success Rate**: AWS tests ผ่าน 100% (4/4)
