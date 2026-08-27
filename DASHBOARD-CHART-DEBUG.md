# Dashboard Chart Debugging Guide

**Date**: July 27, 2026  
**Issue**: กราฟแสดงผลไม่ถูกต้องที่หน้า `/dcp-admin/dashboard`

---

## ปัญหาที่พบ

กราฟ Grade Distribution บนหน้า Dashboard อาจแสดงผลไม่ถูกต้องเนื่องจาก:

1. **คะแนนไม่ครบถ้วน** - Part 2 (video scores) ยังไม่ได้ป้อนโดย Admin
2. **การคำนวณเกรด** - ใช้ total_score ที่อาจเป็น Part 1 อย่างเดียว
3. **ข้อมูลไม่ sync** - มีการแก้ไขข้อมูลแต่ไม่ refresh

---

## เกณฑ์การให้เกรด

### Register100 (คะแนนเต็ม 200)

| เกรด | คะแนน | เปอร์เซ็นต์ | ชื่อเกรด |
|------|-------|-------------|----------|
| A | 160 ขึ้นไป | 80%+ | ระดับดีเด่น |
| B | 140-159 | 70-79% | ระดับดีมาก |
| C | 120-139 | 60-69% | ระดับดี |
| D | 100-119 | 50-59% | ระดับชมเชย |
| F | 0-99 | <50% | ต่ำกว่าเกณฑ์ |

**สูตรคะแนน**:
```
Total Score = Part 1 (100) + Part 2 (100)
Part 1 = teaching_curriculum_score (20)
       + teacher_qualification_score (20)
       + support_from_org_score (5)
       + support_from_external_score (15)
       + award_score (20)
       + activity_within_province_internal_score (5)
       + activity_within_province_external_score (5)
       + activity_outside_province_score (5)
       + pr_activity_score (5)
Part 2 = video1_score (50) + video2_score (50)
```

### Register-Support (คะแนนเต็ม 180)

| เกรด | คะแนน | เปอร์เซ็นต์ | ชื่อเกรด |
|------|-------|-------------|----------|
| A | 144 ขึ้นไป | 80%+ | ระดับดีเด่น |
| B | 126-143 | 70-79% | ระดับดีมาก |
| C | 108-125 | 60-69% | ระดับดี |
| D | 90-107 | 50-59% | ระดับชมเชย |
| F | 0-89 | <50% | ต่ำกว่าเกณฑ์ |

**สูตรคะแนน**:
```
Total Score = Part 1 (100) + Part 2 (80)
Part 1 = teacher_training_score (20)
       + teacher_qualification_score (20)
       + support_from_org_score (5)
       + support_from_external_score (15)
       + award_score (20)
       + activity_within_province_internal_score (5)
       + activity_within_province_external_score (5)
       + activity_outside_province_score (5)
       + pr_activity_score (5)
Part 2 = video1_score (40) + video2_score (40)
```

---

## วิธีการ Debug

### 1. เปิด Browser Console

```
F12 → Console Tab
```

### 2. ดู Console Logs

หลังจากแก้ไขแล้ว จะมี logs แสดง:

```
Processing register100 grades for 42 submissions
Register100 - Score: 195, Grade: A
Register100 - Score: 142, Grade: B
Register100 - Score: 95, Grade: F
Grade counts for register100: {A: 15, B: 20, C: 5, D: 2, F: 0}

Processing register-support grades for 38 submissions
Register-Support - Score: 165, Grade: A
Register-Support - Score: 130, Grade: B
Grade counts for register-support: {A: 12, B: 18, C: 6, D: 2, F: 0}
```

### 3. ตรวจสอบข้อมูล

เช็คว่า:
- ✅ มีข้อมูลกี่รายการ
- ✅ คะแนนของแต่ละรายการถูกต้องไหม
- ✅ การจัดเกรดถูกต้องไหม

---

## สาเหตุที่พบบ่อย

### 1. คะแนน Part 2 ยังไม่ได้ป้อน

**ปัญหา**: `video1_score` และ `video2_score` = 0 หรือ null

**ผลกระทบ**:
- Register100: คะแนนสูงสุดเป็น 100 แทน 200 → ทุกเกรดเป็น F
- Register-Support: คะแนนสูงสุดเป็น 100 แทน 180 → ทุกเกรดเป็น D หรือ F

**วิธีแก้**:
1. เข้าไปแก้ไขลงทะเบียนที่ `/dcp-admin/dashboard/register100/[id]`
2. ป้อนคะแนน video1_score และ video2_score
3. กด Save

### 2. ข้อมูลไม่ Refresh

**ปัญหา**: แก้ไขข้อมูลแล้วแต่กราฟไม่อัพเดท

**วิธีแก้**:
- กด F5 เพื่อ refresh หน้า
- หรือกด Clear Cache แล้ว refresh

### 3. API ไม่ Load ข้อมูลทั้งหมด

**ปัญหา**: API มี pagination แต่ไม่ใช้ `loadAll=true`

**การแก้ไข** (ทำแล้ว):
```typescript
// ✅ ถูกต้อง - Load ทั้งหมด
const res100 = await fetch('/api/register100/list?loadAll=true');

// ❌ ผิด - Load เฉพาะ 10 รายการแรก
const res100 = await fetch('/api/register100/list');
```

---

## การตรวจสอบในฐานข้อมูล

### MongoDB Query

```javascript
// ตรวจสอบคะแนน Register100
db.register100_submissions.find({}, {
  schoolId: 1,
  reg100_schoolName: 1,
  teaching_curriculum_score: 1,
  teacher_qualification_score: 1,
  video1_score: 1,
  video2_score: 1,
  total_score: 1
})

// นับจำนวนแต่ละเกรด
db.register100_submissions.aggregate([
  {
    $project: {
      grade: {
        $cond: [
          { $gte: ["$total_score", 160] }, "A",
          { $cond: [
            { $gte: ["$total_score", 140] }, "B",
            { $cond: [
              { $gte: ["$total_score", 120] }, "C",
              { $cond: [
                { $gte: ["$total_score", 100] }, "D",
                "F"
              ]}
            ]}
          ]}
        ]
      }
    }
  },
  {
    $group: {
      _id: "$grade",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
])
```

---

## Files Modified

### 1. `components/admin/GradeDistributionChart.tsx`

**Changes**:
- ✅ เพิ่ม console.log ใน `processGradeData()` เพื่อ debug
- ✅ แสดงคะแนนและเกรดของแต่ละรายการ
- ✅ แสดงจำนวนรายการทั้งหมด
- ✅ แสดง grade counts สุดท้าย

**Code Added**:
```typescript
console.log(`Processing ${type} grades for ${submissions.length} submissions`);
console.log(`Register100 - Score: ${score}, Grade: ${grade}`);
console.log(`Grade counts for ${type}:`, gradeCounts);
```

---

## Next Steps

### 1. ตรวจสอบข้อมูล
- เข้าไปดูข้อมูลลงทะเบียนทั้งหมด
- เช็คว่า video scores ถูกป้อนหรือยัง

### 2. ป้อนคะแนน Part 2
- แก้ไขลงทะเบียนที่ยังไม่มี video scores
- ป้อนคะแนนตามการประเมินวิดีโอ

### 3. Verify กราฟ
- Refresh หน้า dashboard
- เช็ค console logs
- ยืนยันว่ากราฟแสดงผลถูกต้อง

---

## Expected Output

### ตัวอย่างกราฟที่ถูกต้อง

**Register100** (42 โรงเรียน):
```
A: 15 โรงเรียน (160+ คะแนน)
B: 20 โรงเรียน (140-159 คะแนน)
C: 5 โรงเรียน (120-139 คะแนน)
D: 2 โรงเรียน (100-119 คะแนน)
F: 0 โรงเรียน (0-99 คะแนน)
```

**Register-Support** (38 โรงเรียน):
```
A: 12 โรงเรียน (144+ คะแนน)
B: 18 โรงเรียน (126-143 คะแนน)
C: 6 โรงเรียน (108-125 คะแนน)
D: 2 โรงเรียน (90-107 คะแนน)
F: 0 โรงเรียน (0-89 คะแนน)
```

---

## Testing Checklist

- [ ] เปิด `/dcp-admin/dashboard`
- [ ] เปิด Browser Console (F12)
- [ ] ดู logs การคำนวณเกรด
- [ ] ตรวจสอบว่าข้อมูลครบถ้วน
- [ ] Verify จำนวนแต่ละเกรดถูกต้อง
- [ ] Refresh และทดสอบอีกครั้ง
- [ ] เช็ค legend ว่าตรงกับเกณฑ์

---

**Status**: ✅ Debug code added, waiting for verification

**Contact**: Check console logs and verify data in MongoDB
