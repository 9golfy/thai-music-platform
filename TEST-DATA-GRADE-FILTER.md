# Test Data สำหรับทดสอบ Grade Filter

**วันที่สร้าง**: 30 กรกฎาคม 2026  
**วัตถุประสงค์**: ทดสอบการ filter ตามเกณฑ์คะแนนทั้ง Register100 และ Register-Support

---

## 📋 Register100 Test Data (คะแนนเต็ม 200)

### เกณฑ์การให้คะแนน:
- **A (ระดับดีเด่น)**: 160 ขึ้นไป
- **B (ระดับดีมาก)**: 140-159 คะแนน
- **C (ระดับดี)**: 120-139 คะแนน
- **D (ระดับชมเชย)**: 100-119 คะแนน
- **F (ต่ำกว่าเกณฑ์)**: 0-99 คะแนน

---

### Test Case 1: เกรด A (ระดับดีเด่น)

```json
{
  "reg100_schoolName": "โรงเรียนทดสอบ A1 - คะแนน 200 เต็ม",
  "schoolId": "TEST-REG100-A1",
  "reg100_schoolProvince": "กรุงเทพมหานคร",
  "reg100_schoolLevel": "มัธยมศึกษา",
  
  "teaching_curriculum_score": 20,
  "teacher_qualification_score": 20,
  "support_from_org_score": 5,
  "support_from_external_score": 15,
  "award_score": 20,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "video1_score": 50,
  "video2_score": 50,
  
  "คะแนนรวม": 200,
  "เกรดที่คาดหวัง": "A (ระดับดีเด่น)"
}
```

```json
{
  "reg100_schoolName": "โรงเรียนทดสอบ A2 - คะแนน 160 (ขั้นต่ำของ A)",
  "schoolId": "TEST-REG100-A2",
  "reg100_schoolProvince": "เชียงใหม่",
  "reg100_schoolLevel": "ประถมศึกษา",
  
  "teaching_curriculum_score": 15,
  "teacher_qualification_score": 15,
  "support_from_org_score": 5,
  "support_from_external_score": 10,
  "award_score": 15,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "video1_score": 40,
  "video2_score": 40,
  
  "คะแนนรวม": 160,
  "เกรดที่คาดหวัง": "A (ระดับดีเด่น)"
}
```

---

### Test Case 2: เกรด B (ระดับดีมาก)

```json
{
  "reg100_schoolName": "โรงเรียนทดสอบ B1 - คะแนน 159 (สูงสุดของ B)",
  "schoolId": "TEST-REG100-B1",
  "reg100_schoolProvince": "ภูเก็ต",
  "reg100_schoolLevel": "มัธยมศึกษา",
  
  "teaching_curriculum_score": 15,
  "teacher_qualification_score": 15,
  "support_from_org_score": 5,
  "support_from_external_score": 10,
  "award_score": 15,
  "activity_within_province_internal_score": 4,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "video1_score": 40,
  "video2_score": 40,
  
  "คะแนนรวม": 159,
  "เกรดที่คาดหวัง": "B (ระดับดีมาก)"
}
```

```json
{
  "reg100_schoolName": "โรงเรียนทดสอบ B2 - คะแนน 140 (ขั้นต่ำของ B)",
  "schoolId": "TEST-REG100-B2",
  "reg100_schoolProvince": "ขอนแก่น",
  "reg100_schoolLevel": "ประถมศึกษา",
  
  "teaching_curriculum_score": 10,
  "teacher_qualification_score": 10,
  "support_from_org_score": 5,
  "support_from_external_score": 10,
  "award_score": 15,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "video1_score": 35,
  "video2_score": 35,
  
  "คะแนนรวม": 140,
  "เกรดที่คาดหวัง": "B (ระดับดีมาก)"
}
```

---

### Test Case 3: เกรด C (ระดับดี)

```json
{
  "reg100_schoolName": "โรงเรียนทดสอบ C1 - คะแนน 139 (สูงสุดของ C)",
  "schoolId": "TEST-REG100-C1",
  "reg100_schoolProvince": "สงขลา",
  "reg100_schoolLevel": "มัธยมศึกษา",
  
  "teaching_curriculum_score": 10,
  "teacher_qualification_score": 10,
  "support_from_org_score": 5,
  "support_from_external_score": 10,
  "award_score": 15,
  "activity_within_province_internal_score": 4,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "video1_score": 35,
  "video2_score": 35,
  
  "คะแนนรวม": 139,
  "เกรดที่คาดหวัง": "C (ระดับดี)"
}
```

```json
{
  "reg100_schoolName": "โรงเรียนทดสอบ C2 - คะแนน 120 (ขั้นต่ำของ C)",
  "schoolId": "TEST-REG100-C2",
  "reg100_schoolProvince": "นครราชสีมา",
  "reg100_schoolLevel": "ประถมศึกษา",
  
  "teaching_curriculum_score": 10,
  "teacher_qualification_score": 10,
  "support_from_org_score": 5,
  "support_from_external_score": 5,
  "award_score": 10,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "video1_score": 30,
  "video2_score": 30,
  
  "คะแนนรวม": 120,
  "เกรดที่คาดหวัง": "C (ระดับดี)"
}
```

---

### Test Case 4: เกรด D (ระดับชมเชย)

```json
{
  "reg100_schoolName": "โรงเรียนทดสอบ D1 - คะแนน 119 (สูงสุดของ D)",
  "schoolId": "TEST-REG100-D1",
  "reg100_schoolProvince": "ระยอง",
  "reg100_schoolLevel": "มัธยมศึกษา",
  
  "teaching_curriculum_score": 10,
  "teacher_qualification_score": 10,
  "support_from_org_score": 5,
  "support_from_external_score": 5,
  "award_score": 10,
  "activity_within_province_internal_score": 4,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "video1_score": 30,
  "video2_score": 30,
  
  "คะแนนรวม": 119,
  "เกรดที่คาดหวัง": "D (ระดับชมเชย)"
}
```

```json
{
  "reg100_schoolName": "โรงเรียนทดสอบ D2 - คะแนน 100 (ขั้นต่ำของ D)",
  "schoolId": "TEST-REG100-D2",
  "reg100_schoolProvince": "อุบลราชธานี",
  "reg100_schoolLevel": "ประถมศึกษา",
  
  "teaching_curriculum_score": 5,
  "teacher_qualification_score": 5,
  "support_from_org_score": 5,
  "support_from_external_score": 5,
  "award_score": 10,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "video1_score": 25,
  "video2_score": 25,
  
  "คะแนนรวม": 100,
  "เกรดที่คาดหวัง": "D (ระดับชมเชย)"
}
```

---

### Test Case 5: เกรด F (ต่ำกว่าเกณฑ์)

```json
{
  "reg100_schoolName": "โรงเรียนทดสอบ F1 - คะแนน 99 (สูงสุดของ F)",
  "schoolId": "TEST-REG100-F1",
  "reg100_schoolProvince": "สุราษฎร์ธานี",
  "reg100_schoolLevel": "มัธยมศึกษา",
  
  "teaching_curriculum_score": 5,
  "teacher_qualification_score": 5,
  "support_from_org_score": 5,
  "support_from_external_score": 5,
  "award_score": 10,
  "activity_within_province_internal_score": 4,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "video1_score": 25,
  "video2_score": 25,
  
  "คะแนนรวม": 99,
  "เกรดที่คาดหวัง": "F (ต่ำกว่าเกณฑ์)"
}
```

```json
{
  "reg100_schoolName": "โรงเรียนทดสอบ F2 - คะแนน 50",
  "schoolId": "TEST-REG100-F2",
  "reg100_schoolProvince": "ลำปาง",
  "reg100_schoolLevel": "ประถมศึกษา",
  
  "teaching_curriculum_score": 5,
  "teacher_qualification_score": 5,
  "support_from_org_score": 0,
  "support_from_external_score": 5,
  "award_score": 5,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 0,
  "activity_outside_province_score": 0,
  "pr_activity_score": 5,
  "video1_score": 10,
  "video2_score": 10,
  
  "คะแนนรวม": 50,
  "เกรดที่คาดหวัง": "F (ต่ำกว่าเกณฑ์)"
}
```

---

## 📋 Register-Support Test Data (คะแนนเต็ม 180)

### เกณฑ์การให้คะแนน:
- **A (ระดับดีเด่น)**: 144 ขึ้นไป (80%+)
- **B (ระดับดีมาก)**: 126-143 คะแนน (70-79%)
- **C (ระดับดี)**: 108-125 คะแนน (60-69%)
- **D (ระดับชมเชย)**: 90-107 คะแนน (50-59%)
- **F (ต่ำกว่าเกณฑ์)**: 0-89 คะแนน (<50%)

**หมายเหตุ**: Register-Support **ไม่มี** `teacher_training_score` (ตามที่ระบุใน DetailView)

---

### Test Case 1: เกรด A (ระดับดีเด่น)

```json
{
  "regsup_schoolName": "โรงเรียนทดสอบ Support-A1 - คะแนน 180 เต็ม",
  "schoolId": "TEST-REGSUP-A1",
  "regsup_schoolProvince": "กรุงเทพมหานคร",
  "regsup_schoolLevel": "มัธยมศึกษา",
  
  "teacher_qualification_score": 20,
  "support_from_org_score": 5,
  "support_from_external_score": 15,
  "award_score": 20,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "video1_score": 50,
  "video2_score": 50,
  
  "คะแนนรวม": 180,
  "เกรดที่คาดหวัง": "A (ระดับดีเด่น)"
}
```

```json
{
  "regsup_schoolName": "โรงเรียนทดสอบ Support-A2 - คะแนน 144 (ขั้นต่ำของ A)",
  "schoolId": "TEST-REGSUP-A2",
  "regsup_schoolProvince": "เชียงใหม่",
  "regsup_schoolLevel": "ประถมศึกษา",
  
  "teacher_qualification_score": 15,
  "support_from_org_score": 5,
  "support_from_external_score": 10,
  "award_score": 15,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 4,
  "video1_score": 40,
  "video2_score": 40,
  
  "คะแนนรวม": 144,
  "เกรดที่คาดหวัง": "A (ระดับดีเด่น)"
}
```

---

### Test Case 2: เกรด B (ระดับดีมาก)

```json
{
  "regsup_schoolName": "โรงเรียนทดสอบ Support-B1 - คะแนน 143 (สูงสุดของ B)",
  "schoolId": "TEST-REGSUP-B1",
  "regsup_schoolProvince": "ภูเก็ต",
  "regsup_schoolLevel": "มัธยมศึกษา",
  
  "teacher_qualification_score": 15,
  "support_from_org_score": 5,
  "support_from_external_score": 10,
  "award_score": 15,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 3,
  "video1_score": 40,
  "video2_score": 40,
  
  "คะแนนรวม": 143,
  "เกรดที่คาดหวัง": "B (ระดับดีมาก)"
}
```

```json
{
  "regsup_schoolName": "โรงเรียนทดสอบ Support-B2 - คะแนน 126 (ขั้นต่ำของ B)",
  "schoolId": "TEST-REGSUP-B2",
  "regsup_schoolProvince": "ขอนแก่น",
  "regsup_schoolLevel": "ประถมศึกษา",
  
  "teacher_qualification_score": 10,
  "support_from_org_score": 5,
  "support_from_external_score": 10,
  "award_score": 15,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "video1_score": 33,
  "video2_score": 33,
  
  "คะแนนรวม": 126,
  "เกรดที่คาดหวัง": "B (ระดับดีมาก)"
}
```

---

### Test Case 3: เกรด C (ระดับดี)

```json
{
  "regsup_schoolName": "โรงเรียนทดสอบ Support-C1 - คะแนน 125 (สูงสุดของ C)",
  "schoolId": "TEST-REGSUP-C1",
  "regsup_schoolProvince": "สงขลา",
  "regsup_schoolLevel": "มัธยมศึกษา",
  
  "teacher_qualification_score": 10,
  "support_from_org_score": 5,
  "support_from_external_score": 10,
  "award_score": 15,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 4,
  "video1_score": 33,
  "video2_score": 33,
  
  "คะแนนรวม": 125,
  "เกรดที่คาดหวัง": "C (ระดับดี)"
}
```

```json
{
  "regsup_schoolName": "โรงเรียนทดสอบ Support-C2 - คะแนน 108 (ขั้นต่ำของ C)",
  "schoolId": "TEST-REGSUP-C2",
  "regsup_schoolProvince": "นครราชสีมา",
  "regsup_schoolLevel": "ประถมศึกษา",
  
  "teacher_qualification_score": 10,
  "support_from_org_score": 5,
  "support_from_external_score": 5,
  "award_score": 10,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "video1_score": 29,
  "video2_score": 29,
  
  "คะแนนรวม": 108,
  "เกรดที่คาดหวัง": "C (ระดับดี)"
}
```

---

### Test Case 4: เกรด D (ระดับชมเชย)

```json
{
  "regsup_schoolName": "โรงเรียนทดสอบ Support-D1 - คะแนน 107 (สูงสุดของ D)",
  "schoolId": "TEST-REGSUP-D1",
  "regsup_schoolProvince": "ระยอง",
  "regsup_schoolLevel": "มัธยมศึกษา",
  
  "teacher_qualification_score": 10,
  "support_from_org_score": 5,
  "support_from_external_score": 5,
  "award_score": 10,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 4,
  "video1_score": 29,
  "video2_score": 29,
  
  "คะแนนรวม": 107,
  "เกรดที่คาดหวัง": "D (ระดับชมเชย)"
}
```

```json
{
  "regsup_schoolName": "โรงเรียนทดสอบ Support-D2 - คะแนน 90 (ขั้นต่ำของ D)",
  "schoolId": "TEST-REGSUP-D2",
  "regsup_schoolProvince": "อุบลราชธานี",
  "regsup_schoolLevel": "ประถมศึกษา",
  
  "teacher_qualification_score": 5,
  "support_from_org_score": 5,
  "support_from_external_score": 5,
  "award_score": 10,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "video1_score": 23,
  "video2_score": 22,
  
  "คะแนนรวม": 90,
  "เกรดที่คาดหวัง": "D (ระดับชมเชย)"
}
```

---

### Test Case 5: เกรด F (ต่ำกว่าเกณฑ์)

```json
{
  "regsup_schoolName": "โรงเรียนทดสอบ Support-F1 - คะแนน 89 (สูงสุดของ F)",
  "schoolId": "TEST-REGSUP-F1",
  "regsup_schoolProvince": "สุราษฎร์ธานี",
  "regsup_schoolLevel": "มัธยมศึกษา",
  
  "teacher_qualification_score": 5,
  "support_from_org_score": 5,
  "support_from_external_score": 5,
  "award_score": 10,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 4,
  "video1_score": 23,
  "video2_score": 22,
  
  "คะแนนรวม": 89,
  "เกรดที่คาดหวัง": "F (ต่ำกว่าเกณฑ์)"
}
```

```json
{
  "regsup_schoolName": "โรงเรียนทดสอบ Support-F2 - คะแนน 45",
  "schoolId": "TEST-REGSUP-F2",
  "regsup_schoolProvince": "ลำปาง",
  "regsup_schoolLevel": "ประถมศึกษา",
  
  "teacher_qualification_score": 5,
  "support_from_org_score": 0,
  "support_from_external_score": 5,
  "award_score": 5,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 0,
  "activity_outside_province_score": 0,
  "pr_activity_score": 5,
  "video1_score": 10,
  "video2_score": 10,
  
  "คะแนนรวม": 45,
  "เกรดที่คาดหวัง": "F (ต่ำกว่าเกณฑ์)"
}
```

---

## 📝 Test Checklist

### Register100 (10 test cases):
- [ ] A1 (200 คะแนน) → ควรอยู่ใน filter "ระดับดีเด่น"
- [ ] A2 (160 คะแนน) → ควรอยู่ใน filter "ระดับดีเด่น"
- [ ] B1 (159 คะแนน) → ควรอยู่ใน filter "ระดับดีมาก"
- [ ] B2 (140 คะแนน) → ควรอยู่ใน filter "ระดับดีมาก"
- [ ] C1 (139 คะแนน) → ควรอยู่ใน filter "ระดับดี"
- [ ] C2 (120 คะแนน) → ควรอยู่ใน filter "ระดับดี"
- [ ] D1 (119 คะแนน) → ควรอยู่ใน filter "ระดับชมเชย"
- [ ] D2 (100 คะแนน) → ควรอยู่ใน filter "ระดับชมเชย"
- [ ] F1 (99 คะแนน) → ควรอยู่ใน filter "ต่ำกว่าเกณฑ์"
- [ ] F2 (50 คะแนน) → ควรอยู่ใน filter "ต่ำกว่าเกณฑ์"

### Register-Support (10 test cases):
- [ ] Support-A1 (180 คะแนน) → ควรอยู่ใน filter "ระดับดีเด่น"
- [ ] Support-A2 (144 คะแนน) → ควรอยู่ใน filter "ระดับดีเด่น"
- [ ] Support-B1 (143 คะแนน) → ควรอยู่ใน filter "ระดับดีมาก"
- [ ] Support-B2 (126 คะแนน) → ควรอยู่ใน filter "ระดับดีมาก"
- [ ] Support-C1 (125 คะแนน) → ควรอยู่ใน filter "ระดับดี"
- [ ] Support-C2 (108 คะแนน) → ควรอยู่ใน filter "ระดับดี"
- [ ] Support-D1 (107 คะแนน) → ควรอยู่ใน filter "ระดับชมเชย"
- [ ] Support-D2 (90 คะแนน) → ควรอยู่ใน filter "ระดับชมเชย"
- [ ] Support-F1 (89 คะแนน) → ควรอยู่ใน filter "ต่ำกว่าเกณฑ์"
- [ ] Support-F2 (45 คะแนน) → ควรอยู่ใน filter "ต่ำกว่าเกณฑ์"

---

## 🎯 วิธีทดสอบ

### 1. Import Test Data:
```javascript
// คัดลอก JSON ข้างบนไปใส่ใน MongoDB
// Database: thai_music_school
// Collections: 
//   - register100_submissions (10 records)
//   - register_support_submissions (10 records)
```

### 2. ทดสอบ Filter แต่ละเกณฑ์:

**Register100**:
1. ไปที่ https://dcpschool100.net/dcp-admin/dashboard/register100
2. เลือก Filter "เกณฑ์" = "ระดับดีเด่น" → ควรเห็น A1, A2 (2 โรงเรียน)
3. เลือก Filter "เกณฑ์" = "ระดับดีมาก" → ควรเห็น B1, B2 (2 โรงเรียน)
4. เลือก Filter "เกณฑ์" = "ระดับดี" → ควรเห็น C1, C2 (2 โรงเรียน)
5. เลือก Filter "เกณฑ์" = "ระดับชมเชย" → ควรเห็น D1, D2 (2 โรงเรียน)
6. เลือก Filter "เกณฑ์" = "ต่ำกว่าเกณฑ์" → ควรเห็น F1, F2 (2 โรงเรียน)

**Register-Support**:
1. ไปที่ https://dcpschool100.net/dcp-admin/dashboard/register-support
2. ทดสอบเหมือน Register100

### 3. ตรวจสอบ:
- ✅ Filter แสดงผลถูกต้อง (กรองตรงตามเกณฑ์)
- ✅ จำนวนแสดง: "แสดง X จาก Y รายการ" (ถูกต้อง)
- ✅ คะแนนที่แสดงตรงกับ JSON
- ✅ เกรดที่แสดงตรงกับที่คาดหวัง

---

## ⚠️ หมายเหตุสำคัญ

**Register-Support ไม่มี teacher_training_score**:
- ตาม DetailView code (line 332-340) **ไม่ได้บวก teacher_training_score**
- Test data นี้จึง**ไม่มีฟิลด์นั้น**
- คะแนนเต็ม = 80 (Part 1) + 100 (Part 2) = **180 คะแนน**

**หากเจอปัญหา**:
- เช็คว่าคะแนนที่แสดงในตารางตรงกับ test data ไหม
- เช็คว่า filter ทำงานถูกต้องไหม
- เช็คว่าจำนวน "แสดง X จาก Y" ถูกต้องไหม

---

**สร้างโดย**: Kiro AI  
**วันที่**: 30 กรกฎาคม 2026
