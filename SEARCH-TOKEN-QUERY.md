# ค้นหา Token: 7ade1ea6-8478-43af-a854-53ec8dfddd06

## สรุปการทำงานของระบบ Draft

จากการตรวจสอบ code พบว่า:

1. **Draft ที่ยังไม่ส่ง**: เก็บใน `draft_submissions` collection (status = 'active')
2. **Draft ที่ส่งแล้ว**: ยังคงอยู่ใน `draft_submissions` (status = 'submitted') + สร้าง record ใหม่ใน submission collection
3. **Draft ที่หมดอายุ**: อาจถูกลบโดย cleanup script หรือยังคงอยู่ (status = 'active' แต่ expiresAt < now)

## คำสั่งค้นหาแบบครบถ้วน

### 1. ค้นหาใน draft_submissions (ทั้ง active และ submitted)

```javascript
use thai_music_school

// ค้นหาด้วย token (ไม่สนใจ status)
db.draft_submissions.find({
  $or: [
    { token: "7ade1ea6-8478-43af-a854-53ec8dfddd06" },
    { draftToken: "7ade1ea6-8478-43af-a854-53ec8dfddd06" }
  ]
})

// ถ้าไม่เจอ ลองค้นหาแบบ case-insensitive
db.draft_submissions.find({
  $or: [
    { token: /7ade1ea6-8478-43af-a854-53ec8dfddd06/i },
    { draftToken: /7ade1ea6-8478-43af-a854-53ec8dfddd06/i }
  ]
})
```

### 2. ค้นหาใน register100_submissions (ถ้า draft ถูกส่งแล้ว)

```javascript
// ค้นหาด้วย draftToken field
db.register100_submissions.find({
  draftToken: "7ade1ea6-8478-43af-a854-53ec8dfddd06"
})

// ค้นหาแบบ case-insensitive
db.register100_submissions.find({
  draftToken: /7ade1ea6-8478-43af-a854-53ec8dfddd06/i
})
```

### 3. ค้นหาใน register_support_submissions (ถ้า draft ถูกส่งแล้ว)

```javascript
// ค้นหาด้วย draftToken field
db.register_support_submissions.find({
  draftToken: "7ade1ea6-8478-43af-a854-53ec8dfddd06"
})

// ค้นหาแบบ case-insensitive
db.register_support_submissions.find({
  draftToken: /7ade1ea6-8478-43af-a854-53ec8dfddd06/i
})
```

### 4. ค้นหาแบบครบทุก collection พร้อมกัน

```javascript
use thai_music_school

print("=== ค้นหา Token: 7ade1ea6-8478-43af-a854-53ec8dfddd06 ===\n");

// 1. ค้นหาใน draft_submissions
print("1️⃣ ค้นหาใน draft_submissions:");
var draftResult = db.draft_submissions.findOne({
  $or: [
    { token: "7ade1ea6-8478-43af-a854-53ec8dfddd06" },
    { draftToken: "7ade1ea6-8478-43af-a854-53ec8dfddd06" }
  ]
});

if (draftResult) {
  print("✅ พบใน draft_submissions!");
  print("   Email: " + draftResult.email);
  print("   Status: " + draftResult.status);
  print("   Type: " + draftResult.submissionType);
  print("   Created: " + draftResult.createdAt);
  print("   Expires: " + draftResult.expiresAt);
  if (draftResult.submissionId) {
    print("   Submission ID: " + draftResult.submissionId);
  }
} else {
  print("❌ ไม่พบใน draft_submissions");
}

print("\n2️⃣ ค้นหาใน register100_submissions:");
var reg100Result = db.register100_submissions.findOne({
  draftToken: "7ade1ea6-8478-43af-a854-53ec8dfddd06"
});

if (reg100Result) {
  print("✅ พบใน register100_submissions!");
  print("   Email: " + reg100Result.email);
  print("   School ID: " + reg100Result.schoolId);
  print("   School Name: " + reg100Result.reg100_schoolName);
  print("   Submitted: " + reg100Result.submittedAt);
} else {
  print("❌ ไม่พบใน register100_submissions");
}

print("\n3️⃣ ค้นหาใน register_support_submissions:");
var regSupportResult = db.register_support_submissions.findOne({
  draftToken: "7ade1ea6-8478-43af-a854-53ec8dfddd06"
});

if (regSupportResult) {
  print("✅ พบใน register_support_submissions!");
  print("   Email: " + regSupportResult.email);
  print("   School ID: " + regSupportResult.schoolId);
  print("   School Name: " + regSupportResult.regSupport_schoolName);
  print("   Submitted: " + regSupportResult.submittedAt);
} else {
  print("❌ ไม่พบใน register_support_submissions");
}

print("\n=== สรุป ===");
if (!draftResult && !reg100Result && !regSupportResult) {
  print("❌ ไม่พบ token นี้ในระบบเลย");
  print("\nเหตุผลที่เป็นไปได้:");
  print("1. Draft หมดอายุและถูกลบโดย cleanup script");
  print("2. Link มาจาก environment อื่น (dev/staging)");
  print("3. Token ถูกพิมพ์ผิด");
  print("4. Database ไม่ใช่ production database");
}
```

## วิธีรันคำสั่ง

### แบบ One-liner (สำหรับ production server)

```bash
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" --eval 'var token="7ade1ea6-8478-43af-a854-53ec8dfddd06"; print("=== ค้นหา Token ==="); var d=db.draft_submissions.findOne({$or:[{token:token},{draftToken:token}]}); if(d){print("✅ draft_submissions: "+d.email+" ("+d.status+")")}else{print("❌ draft_submissions: ไม่พบ")}; var r1=db.register100_submissions.findOne({draftToken:token}); if(r1){print("✅ register100: "+r1.email)}else{print("❌ register100: ไม่พบ")}; var r2=db.register_support_submissions.findOne({draftToken:token}); if(r2){print("✅ register_support: "+r2.email)}else{print("❌ register_support: ไม่พบ")};'
```

### แบบ Interactive

```bash
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin"
```

แล้ววาง script ด้านบนลงไป

## สาเหตุที่อาจหาไม่เจอ

1. **Draft หมดอายุ (Expired)**: Draft มีอายุ 7 วัน หลังจากนั้นอาจถูกลบ
2. **Environment ผิด**: Link อาจมาจาก dev/staging database
3. **Token ผิด**: ตรวจสอบว่า copy link มาถูกต้อง
4. **Database ผิด**: ตรวจสอบว่าเชื่อมต่อกับ production database จริง

## ตรวจสอบ Database Connection

```javascript
// ตรวจสอบว่าอยู่ใน database ไหน
db.getName()

// ตรวจสอบจำนวน drafts ทั้งหมด
db.draft_submissions.countDocuments()

// ดู draft ล่าสุด 5 รายการ
db.draft_submissions.find().sort({createdAt: -1}).limit(5).pretty()
```

## ข้อมูลเพิ่มเติม

- **Database**: thai_music_school
- **Total Drafts**: 730 (ตามที่ user ตรวจสอบ)
- **Token Format**: UUID v4 (36 characters with hyphens)
- **Token Field**: ใช้ทั้ง `token` และ `draftToken` (เก็บซ้ำเพื่อ compatibility)
