# 🔍 ตรวจสอบ Field Names ใน Submission

## คำสั่ง MongoDB

รันคำสั่งนี้ใน MongoDB shell เพื่อดู field names:

```javascript
use thai_music_school

// ดู submission ที่มีปัญหา
db.register_support_submissions.findOne(
  { _id: ObjectId('6a0d3a91ce726e5f0dd457e0') },
  { 
    teacher_qualification_score: 1,
    regsup_teacher_qualification_score: 1,
    support_from_org_score: 1,
    regsup_support_from_org_score: 1,
    schoolName: 1,
    regsup_schoolName: 1,
    _id: 1
  }
)
```

## สิ่งที่ต้องการทราบ

1. Submission ใช้ field name แบบไหน?
   - ✅ `teacher_qualification_score` (ไม่มี prefix)
   - ❌ `regsup_teacher_qualification_score` (มี prefix)

2. ถ้าใช้ `regsup_` prefix → ต้องแก้ไข `handleFieldChange` ให้ใช้ prefix
3. ถ้าไม่ใช้ prefix → โค้ดที่แก้ไขไปถูกต้องแล้ว

## ผลลัพธ์ที่คาดหวัง

### ถ้า submission ไม่มี prefix (ถูกต้อง)
```javascript
{
  _id: ObjectId('6a0d3a91ce726e5f0dd457e0'),
  teacher_qualification_score: 10,
  support_from_org_score: 5,
  schoolName: 'โรงเรียนXXX'
}
```
→ โค้ดที่แก้ไขไปถูกต้องแล้ว ✅

### ถ้า submission มี prefix (ต้องแก้ไขเพิ่ม)
```javascript
{
  _id: ObjectId('6a0d3a91ce726e5f0dd457e0'),
  regsup_teacher_qualification_score: 10,
  regsup_support_from_org_score: 5,
  regsup_schoolName: 'โรงเรียนXXX'
}
```
→ ต้องแก้ไข `handleFieldChange` ให้ใช้ prefix ❌

---

**กรุณารันคำสั่งด้านบนแล้วส่งผลลัพธ์มาครับ** 🙏
