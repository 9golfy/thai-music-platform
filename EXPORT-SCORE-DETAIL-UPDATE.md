# Export Score Detail Update (ฉบับสมบูรณ์)

**Date**: July 24, 2026  
**Status**: ✅ Completed  
**Task**: แสดงคะแนนทุก Step แบบละเอียดพร้อมวิธีคำนวณในไฟล์ Export

---

## สรุปการแก้ไข

เพิ่มส่วนแสดงคะแนนแบบละเอียดทุก Step พร้อมวิธีคำนวณในไฟล์ Export ทั้ง 2 ระบบ:

### Register100 Export
- ✅ แสดงคะแนนทุก Step พร้อมชื่อและวิธีคำนวณ
- ✅ แสดง Link/URL วิดีโอทั้ง 2
- ✅ แสดงคะแนนรวมส่วนที่ 1 (100), ส่วนที่ 2 (100), รวมทั้งหมด (200)

### Register-Support Export
- ✅ แสดงคะแนนทุก Step พร้อมชื่อและวิธีคำนวณ
- ✅ แสดง Link/URL วิดีโอทั้ง 2
- ✅ แสดงคะแนนรวมส่วนที่ 1 (100), ส่วนที่ 2 (80), รวมทั้งหมด (180)

---

## รูปแบบการแสดงคะแนนในไฟล์ Export

### Register100 - ส่วนที่ 1 (100 คะแนน)

```
ส่วนที่ 1: สรุปการหาคะแนนคะแนนแบบ (100 คะแนน)
หมวด                                                                    คะแนนที่ได้    คะแนนเต็ม
Step 5: การมีนโยบายการสนับสนุนดนตรีไทย (4 ข้อ x 5)                       XX            20
Step 4: คุณสมบัติและคุณวุฒิครูผู้สอน (จำนวนคุณสมบัติไม่ซ้ำ x 5)          XX            20
Step 6: การสนับสนุนจากต้นสังกัด (มี/ไม่มี)                                 XX             5
Step 6: การสนับสนุนจากภายนอก (1=5, 2=10, 3+=15)                          XX            15
Step 7: รางวัล (ระดับสูงสุด: อำเภอ=5, จังหวัด=10, ภาค=15, ประเทศ=20)      XX            20
Step 8: กิจกรรมภายในสถานศึกษา (≥3 กิจกรรม = 5 คะแนน)                     XX             5
Step 8: กิจกรรมภายนอกสถานศึกษา (≥3 กิจกรรม = 5 คะแนน)                    XX             5
Step 8: กิจกรรมนอกจังหวัด (≥3 กิจกรรม = 5 คะแนน)                         XX             5
Step 9: การประชาสัมพันธ์ผ่านสื่อสังคมออนไลน์ (≥3 กิจกรรม = 5 คะแนน)      XX             5
รวมคะแนนส่วนที่ 1                                                        XX           100
```

### Register100 - ส่วนที่ 2 (100 คะแนน)

```
ส่วนที่ 2: คะแนนมาจากการบรรยายกันทีเดียว (100 คะแนน)
หมวด                                                                    คะแนนที่ได้    คะแนนเต็ม
1 บรรยากาศการเรียนการสอนในชั้นเรียน (ทุกระดับชั้น) - วิดีโอความยาวไม่เกิน 3 นาที  XX    50
Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)              [URL]

2 การแสดงผลงานด้านดนตรีไทยของนักเรียนทั้งโรงเรียน - วิดีโอความยาวไม่เกิน 3 นาที  XX    50
Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)              [URL]
รวมคะแนนส่วนที่ 2                                                        XX           100

รวมคะแนนทั้งหมด                                                          XX           200
```

---

## Database Fields ที่ใช้

### Part 1 Score Fields (100 คะแนน)

#### Register100
- `teaching_curriculum_score` (20 คะแนน) - Step 5
- `teacher_qualification_score` (20 คะแนน) - Step 4
- `support_from_org_score` (5 คะแนน) - Step 6
- `support_from_external_score` (15 คะแนน) - Step 6
- `award_score` (20 คะแนน) - Step 7
- `activity_within_province_internal_score` (5 คะแนน) - Step 8
- `activity_within_province_external_score` (5 คะแนน) - Step 8
- `activity_outside_province_score` (5 คะแนน) - Step 8
- `pr_activity_score` (5 คะแนน) - Step 9

#### Register-Support
- `teacher_training_score` (20 คะแนน) - Step 4
- `teacher_qualification_score` (20 คะแนน) - Step 4
- (เหมือน Register100 สำหรับ field อื่นๆ)

### Part 2 Score Fields (Video)
- `video1_score` - Admin ให้คะแนนเอง (Register100: 50, Register-Support: 40)
- `video2_score` - Admin ให้คะแนนเอง (Register100: 50, Register-Support: 40)
- `videoLink` - URL วิดีโอที่ 1
- `videoLink2` - URL วิดีโอที่ 2

---

## ไฟล์ที่แก้ไข

1. `app/api/register100/[id]/export/excel/route.ts`
2. `app/api/register-support/[id]/export/excel/route.ts`

---

## การทดสอบ

### Register100
1. เข้า http://localhost:3000/dcp-admin/dashboard/register100
2. คลิก Export
3. ตรวจสอบ:
   - ✅ แสดงคะแนนทุก Step พร้อมชื่อและวิธีคำนวณ
   - ✅ มี Link/URL วิดีโอ
   - ✅ มีคะแนนรวมทุกส่วน

### Register-Support
1. เข้า http://localhost:3000/dcp-admin/dashboard/register-support
2. คลิก Export
3. ตรวจสอบ:
   - ✅ แสดงคะแนนทุก Step พร้อมชื่อและวิธีคำนวณ
   - ✅ มี Link/URL วิดีโอ
   - ✅ มีคะแนนรวมทุกส่วน

---

**สร้างเมื่อ**: 24 กรกฎาคม 2569  
**ผู้สร้าง**: Kiro AI Assistant
