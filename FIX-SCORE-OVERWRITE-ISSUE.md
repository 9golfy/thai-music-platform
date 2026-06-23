# Fix Score Overwrite Issue

## 🐛 ปัญหา

เมื่อ Admin แก้ไขคะแนนใน **Register-Support Detail View** แล้วกด Save:
- ใส่คะแนน = 5
- กด Save แล้วกลายเป็น 4
- คะแนนที่ใส่หายไป ถูกคำนวณใหม่โดยอัตโนมัติ

## 🔍 สาเหตุ

API `/api/register-support/[id]/route.ts` ในส่วน **PUT handler** มีการ:
1. รับข้อมูลจาก frontend (รวมคะแนนที่ admin แก้ไข)
2. **คำนวณคะแนนใหม่** จากข้อมูลต้นทาง (teachers, awards, activities)
3. **เขียนทับคะแนน** ที่ admin ส่งมาด้วยคะแนนที่คำนวณได้

### ตัวอย่างโค้ดเดิม (มีปัญหา):

```typescript
// Recalculate scores from data
const teachers = getFieldValue('thaiMusicTeachers') || [];
const uniqueQualifications = new Set<string>();
teachers.forEach((t: any) => {
  if (t.teacherQualification) uniqueQualifications.add(t.teacherQualification);
});
const teacher_qualification_score = Math.min(uniqueQualifications.size * 5, 20);

// ... คำนวณคะแนนอื่นๆ ...

// เขียนลง DB โดยเขียนทับคะแนนที่ admin ส่งมา
await collection.updateOne(
  { _id: new ObjectId(id) },
  {
    $set: {
      ...cleanData,  // มีคะแนนที่ admin แก้ไข
      teacher_qualification_score,  // ← เขียนทับด้วยคะแนนที่คำนวณใหม่!
      // ...
    }
  }
);
```

---

## ✅ วิธีแก้ไข

เพิ่มการตรวจสอบว่า admin ส่งคะแนนมาเองหรือไม่:
- **ถ้ามีคะแนนใน request** → ใช้คะแนนที่ admin ส่งมา (Manual Edit Mode)
- **ถ้าไม่มีคะแนนใน request** → คำนวณคะแนนจากข้อมูล (Normal Edit Mode)

### โค้ดหลังแก้ไข:

```typescript
// Check if admin manually edited scores
const hasManualScores = cleanData.teacher_qualification_score !== undefined ||
                       cleanData.support_from_org_score !== undefined ||
                       // ... check other score fields ...

let scoreData: any = {};

if (hasManualScores) {
  // ✅ Admin edited scores manually - use provided scores
  console.log('✅ Using admin-provided scores (manual edit mode)');
  
  if (cleanData.teacher_qualification_score !== undefined) {
    scoreData.teacher_qualification_score = cleanData.teacher_qualification_score;
  }
  // ... use other scores from cleanData ...
  
  // Calculate total from provided scores
  scoreData.total_score = 
    scoreData.teacher_qualification_score + 
    scoreData.support_from_org_score + 
    // ...
  
} else {
  // 🔄 Normal edit mode - recalculate scores from data
  console.log('🔄 Recalculating scores from data (normal edit mode)');
  
  const teachers = getFieldValue('thaiMusicTeachers') || [];
  const uniqueQualifications = new Set<string>();
  teachers.forEach((t: any) => {
    if (t.teacherQualification) uniqueQualifications.add(t.teacherQualification);
  });
  scoreData.teacher_qualification_score = Math.min(uniqueQualifications.size * 5, 20);
  
  // ... calculate other scores ...
}

// Save with correct scores
await collection.updateOne(
  { _id: new ObjectId(id) },
  {
    $set: {
      ...cleanData,
      ...scoreData,  // ← ใช้ scoreData ที่ถูกต้อง (manual หรือ calculated)
      updatedAt: new Date(),
    }
  }
);
```

---

## 📊 การทำงานหลังแก้ไข

### Scenario 1: Admin แก้ไขคะแนน (Manual Edit)

```
1. Admin เปิด edit mode → กดแก้ไข teaching_curriculum_score = 15
2. กด Save
3. Frontend ส่ง: { teaching_curriculum_score: 15, ... }
4. API ตรวจสอบ: hasManualScores = true
5. API ใช้: teacher_qualification_score = 15 (ตามที่ admin ส่งมา)
6. บันทึกลง DB: teaching_curriculum_score = 15 ✅
```

### Scenario 2: Admin แก้ไขข้อมูลอื่น (Normal Edit)

```
1. Admin แก้ไขชื่อโรงเรียนหรือข้อมูลครู
2. กด Save
3. Frontend ส่ง: { reg100_schoolName: "...", teachers: [...] }
4. API ตรวจสอบ: hasManualScores = false (ไม่มี score fields)
5. API คำนวณ: teacher_qualification_score = ... (จากข้อมูลครู)
6. บันทึกลง DB: คะแนนที่คำนวณได้ ✅
```

---

## 🔍 ตรวจสอบการทำงาน

### ขั้นตอนทดสอบ:

1. เปิด http://localhost:3000/dcp-admin/dashboard/register-support/{id}?mode=edit
2. แก้ไขคะแนนใน ScoreCard (เช่น teaching_curriculum_score = 15)
3. กด "แก้ไขคะแนน" (Save)
4. Refresh หน้า หรือ กลับมาดูอีกครั้ง
5. ✅ คะแนนควรเป็น 15 ตามที่แก้ไข (ไม่ถูกคำนวณทับ)

### ตรวจสอบใน Console:

```
✅ Using admin-provided scores (manual edit mode)
```

หรือ

```
🔄 Recalculating scores from data (normal edit mode)
```

---

## 📝 ไฟล์ที่แก้ไข

### 1. `/app/api/register-support/[id]/route.ts`
- แก้ไข PUT handler ให้ตรวจสอบว่ามี manual scores หรือไม่
- เพิ่ม logic แยกระหว่าง manual edit vs normal edit

### 2. `/app/api/register100/[id]/route.ts`
- ✅ **ไม่ต้องแก้ไข** - API นี้ไม่มีปัญหา
- ไม่มีการคำนวณคะแนนทับ ใช้ค่าที่ส่งมาตรงๆ

---

## ⚠️ หมายเหตุ

### Register100 ไม่มีปัญหานี้เพราะ:
- API ไม่ได้มีการคำนวณคะแนนอัตโนมัติ
- ใช้ข้อมูลที่ส่งมาจาก frontend ตรงๆ
- `$set: { ...updateData }` - ไม่มีการคำนวณทับ

### Register-Support มีปัญหาเพราะ:
- เดิมออกแบบให้คำนวณคะแนนอัตโนมัติทุกครั้งที่ save
- ใช้สำหรับกรณีที่ครูแก้ไขข้อมูล → คะแนนต้องคำนวณใหม่
- แต่เมื่อ admin แก้ไขคะแนนโดยตรง → ไม่ควรคำนวณทับ

### การแก้ไขนี้รองรับทั้งสองกรณี:
- ✅ Admin แก้ไขคะแนน → ใช้คะแนนที่ admin ใส่
- ✅ ครูแก้ไขข้อมูล → คำนวณคะแนนใหม่อัตโนมัติ

---

## 🚀 Status

- [x] ระบุสาเหตุปัญหา
- [x] แก้ไข API logic
- [ ] ทดสอบบน local
- [ ] Deploy ไป production
- [ ] ทดสอบบน production

---

**แก้ไขเมื่อ:** 2026-06-24
**แก้ไขโดย:** Kiro AI Assistant
