# 🔍 คำสั่งค้นหา User - MongoDB

## ค้นหา User: 10120002@nonedu2.go.th

---

## 1. ค้นหาใน Collection `users`

### ค้นหาแบบตรงทั้งหมด
```javascript
// เชื่อมต่อ database
use thai_music_school

// ค้นหา user ด้วย email
db.users.findOne({ email: "10120002@nonedu2.go.th" })

// ค้นหาและแสดงเฉพาะ field ที่สำคัญ
db.users.findOne(
  { email: "10120002@nonedu2.go.th" },
  { email: 1, firstName: 1, lastName: 1, role: 1, schoolId: 1, isActive: 1, createdAt: 1 }
)
```

### ค้นหาแบบ Case-Insensitive
```javascript
// ค้นหาไม่สนใจตัวพิมพ์เล็ก-ใหญ่
db.users.findOne({ 
  email: { $regex: /^10120002@nonedu2\.go\.th$/i } 
})
```

### ค้นหาแบบ Partial Match
```javascript
// ค้นหาที่มี "10120002" ในอีเมล
db.users.find({ 
  email: { $regex: "10120002", $options: "i" } 
})

// ค้นหาที่มี "@nonedu2.go.th" ในอีเมล
db.users.find({ 
  email: { $regex: "@nonedu2\\.go\\.th$", $options: "i" } 
})
```

---

## 2. ค้นหาใน Collection `draft_submissions`

### ค้นหา Draft ของ User นี้
```javascript
// ค้นหา draft ทั้งหมดของ email นี้
db.draft_submissions.find({ 
  email: "10120002@nonedu2.go.th" 
})

// นับจำนวน drafts
db.draft_submissions.countDocuments({ 
  email: "10120002@nonedu2.go.th" 
})

// ค้นหา draft ล่าสุด
db.draft_submissions.findOne(
  { email: "10120002@nonedu2.go.th" },
  { sort: { lastModified: -1 } }
)
```

---

## 3. ค้นหาใน Collection `register100_submissions`

### ค้นหาการสมัครโรงเรียนดนตรีไทย 100%
```javascript
// ค้นหาการสมัครทั้งหมด
db.register100_submissions.find({ 
  email: "10120002@nonedu2.go.th" 
})

// นับจำนวน
db.register100_submissions.countDocuments({ 
  email: "10120002@nonedu2.go.th" 
})

// แสดงเฉพาะข้อมูลสำคัญ
db.register100_submissions.find(
  { email: "10120002@nonedu2.go.th" },
  { 
    email: 1, 
    schoolName: 1, 
    status: 1, 
    submittedAt: 1,
    totalScore: 1 
  }
)
```

---

## 4. ค้นหาใน Collection `register_support_submissions`

### ค้นหาการสมัครโรงเรียนสนับสนุน
```javascript
// ค้นหาการสมัครทั้งหมด
db.register_support_submissions.find({ 
  email: "10120002@nonedu2.go.th" 
})

// นับจำนวน
db.register_support_submissions.countDocuments({ 
  email: "10120002@nonedu2.go.th" 
})

// แสดงเฉพาะข้อมูลสำคัญ
db.register_support_submissions.find(
  { email: "10120002@nonedu2.go.th" },
  { 
    email: 1, 
    regsup_school_name: 1, 
    status: 1, 
    submittedAt: 1,
    totalScore: 1 
  }
)
```

---

## 5. ค้นหาทุก Collection พร้อมกัน

### สคริปต์ค้นหาครบทุก Collection
```javascript
// เชื่อมต่อ database
use thai_music_school

var email = "10120002@nonedu2.go.th";

print("=== ค้นหา User: " + email + " ===\n");

// 1. ค้นหาใน users
print("1. Collection: users");
var user = db.users.findOne({ email: email });
if (user) {
  print("✅ พบ User!");
  print("   - Name: " + user.firstName + " " + user.lastName);
  print("   - Role: " + user.role);
  print("   - School ID: " + user.schoolId);
  print("   - Active: " + user.isActive);
  print("   - Created: " + user.createdAt);
} else {
  print("❌ ไม่พบ User");
}
print("");

// 2. ค้นหาใน draft_submissions
print("2. Collection: draft_submissions");
var draftCount = db.draft_submissions.countDocuments({ email: email });
print("   - จำนวน Drafts: " + draftCount);
if (draftCount > 0) {
  var latestDraft = db.draft_submissions.findOne(
    { email: email },
    { sort: { lastModified: -1 } }
  );
  print("   - Draft ล่าสุด:");
  print("     Token: " + latestDraft.token);
  print("     Type: " + latestDraft.submissionType);
  print("     Step: " + latestDraft.currentStep);
  print("     Status: " + latestDraft.status);
  print("     Expires: " + latestDraft.expiresAt);
}
print("");

// 3. ค้นหาใน register100_submissions
print("3. Collection: register100_submissions");
var reg100Count = db.register100_submissions.countDocuments({ email: email });
print("   - จำนวนการสมัคร: " + reg100Count);
if (reg100Count > 0) {
  db.register100_submissions.find({ email: email }).forEach(function(doc) {
    print("   - School: " + doc.schoolName);
    print("     Status: " + doc.status);
    print("     Score: " + doc.totalScore);
    print("     Submitted: " + doc.submittedAt);
  });
}
print("");

// 4. ค้นหาใน register_support_submissions
print("4. Collection: register_support_submissions");
var regSupportCount = db.register_support_submissions.countDocuments({ email: email });
print("   - จำนวนการสมัคร: " + regSupportCount);
if (regSupportCount > 0) {
  db.register_support_submissions.find({ email: email }).forEach(function(doc) {
    print("   - School: " + doc.regsup_school_name);
    print("     Status: " + doc.status);
    print("     Score: " + doc.totalScore);
    print("     Submitted: " + doc.submittedAt);
  });
}
print("");

print("=== สรุป ===");
print("Users: " + (user ? "✅ พบ" : "❌ ไม่พบ"));
print("Drafts: " + draftCount);
print("Register100: " + reg100Count);
print("RegisterSupport: " + regSupportCount);
```

---

## 6. ค้นหาแบบ Fuzzy (คล้ายๆ)

### ค้นหา Email ที่คล้ายกัน
```javascript
// ค้นหา email ที่มี "10120002"
db.users.find({ 
  email: { $regex: "10120002", $options: "i" } 
})

// ค้นหา email ที่ขึ้นต้นด้วย "10120002"
db.users.find({ 
  email: { $regex: "^10120002", $options: "i" } 
})

// ค้นหา email ทั้งหมดที่มี "@nonedu2.go.th"
db.users.find({ 
  email: { $regex: "@nonedu2\\.go\\.th$", $options: "i" } 
}).limit(10)
```

---

## 7. ตรวจสอบ Field Names

### ดู Field Names ที่มีใน Collection
```javascript
// ดู field names ใน users collection
var sampleUser = db.users.findOne();
if (sampleUser) {
  print("Fields in users collection:");
  Object.keys(sampleUser).forEach(function(key) {
    print("  - " + key);
  });
}

// ดู field names ใน draft_submissions
var sampleDraft = db.draft_submissions.findOne();
if (sampleDraft) {
  print("\nFields in draft_submissions collection:");
  Object.keys(sampleDraft).forEach(function(key) {
    print("  - " + key);
  });
}
```

---

## 8. ค้นหาด้วย Phone Number (ถ้ามี)

### ค้นหาด้วยเบอร์โทร
```javascript
// ถ้ารู้เบอร์โทร
db.users.find({ 
  phone: "0812345678" 
})

// ค้นหาแบบ partial
db.users.find({ 
  phone: { $regex: "0812345", $options: "i" } 
})
```

---

## 9. ค้นหาด้วย School ID

### ค้นหา Users ในโรงเรียนเดียวกัน
```javascript
// ถ้ารู้ schoolId
db.users.find({ 
  schoolId: "SCH-20260525-0190" 
})

// นับจำนวน users ในโรงเรียน
db.users.countDocuments({ 
  schoolId: "SCH-20260525-0190" 
})
```

---

## 10. Export ข้อมูลเป็น JSON

### Export ข้อมูล User
```javascript
// แสดงข้อมูลแบบ JSON สวยงาม
var user = db.users.findOne({ email: "10120002@nonedu2.go.th" });
if (user) {
  printjson(user);
}

// หรือใช้คำสั่งนี้
db.users.find({ email: "10120002@nonedu2.go.th" }).pretty()
```

---

## 🎯 คำสั่งด่วน (Quick Commands)

### คัดลอกไปใช้เลย

```javascript
// เชื่อมต่อ database
use thai_music_school

// ค้นหา user
db.users.findOne({ email: "10120002@nonedu2.go.th" })

// ค้นหา drafts
db.draft_submissions.find({ email: "10120002@nonedu2.go.th" })

// ค้นหา register100
db.register100_submissions.find({ email: "10120002@nonedu2.go.th" })

// ค้นหา register support
db.register_support_submissions.find({ email: "10120002@nonedu2.go.th" })

// นับจำนวนทั้งหมด
db.users.countDocuments({ email: "10120002@nonedu2.go.th" })
db.draft_submissions.countDocuments({ email: "10120002@nonedu2.go.th" })
db.register100_submissions.countDocuments({ email: "10120002@nonedu2.go.th" })
db.register_support_submissions.countDocuments({ email: "10120002@nonedu2.go.th" })
```

---

## 🔍 ตรวจสอบว่ามีข้อมูลหรือไม่

### สคริปต์ตรวจสอบแบบเร็ว
```javascript
use thai_music_school

var email = "10120002@nonedu2.go.th";

print("=== ตรวจสอบ: " + email + " ===");
print("Users: " + db.users.countDocuments({ email: email }));
print("Drafts: " + db.draft_submissions.countDocuments({ email: email }));
print("Register100: " + db.register100_submissions.countDocuments({ email: email }));
print("RegisterSupport: " + db.register_support_submissions.countDocuments({ email: email }));
```

---

## 📝 บันทึกผลการค้นหา

### บันทึกเป็นไฟล์
```bash
# บน Linux/Mac
mongosh "mongodb://localhost:27017/thai_music_school" \
  --eval 'db.users.findOne({ email: "10120002@nonedu2.go.th" })' \
  > user-search-result.json

# หรือใช้ mongosh interactive แล้ว copy output
```

---

## 🚨 ถ้าไม่พบข้อมูล

### เช็คสาเหตุที่เป็นไปได้

1. **Email สะกดผิด**
   ```javascript
   // ลองค้นหาแบบ partial
   db.users.find({ email: { $regex: "10120002", $options: "i" } })
   ```

2. **อยู่คนละ Database**
   ```javascript
   // ดู databases ทั้งหมด
   show dbs
   
   // เปลี่ยน database
   use test
   db.users.findOne({ email: "10120002@nonedu2.go.th" })
   ```

3. **Field Name ผิด**
   ```javascript
   // ดู field names ที่มีจริง
   db.users.findOne()
   ```

4. **ข้อมูลถูกลบ**
   ```javascript
   // เช็คว่ามี soft delete หรือไม่
   db.users.findOne({ 
     email: "10120002@nonedu2.go.th",
     isDeleted: true 
   })
   ```

---

## 💡 Tips

### ค้นหาอย่างมีประสิทธิภาพ

1. **ใช้ Index** - email field ควรมี index
   ```javascript
   db.users.getIndexes()
   ```

2. **จำกัดผลลัพธ์**
   ```javascript
   db.users.find({ email: /10120002/ }).limit(10)
   ```

3. **เลือก Fields ที่ต้องการ**
   ```javascript
   db.users.find(
     { email: "10120002@nonedu2.go.th" },
     { email: 1, firstName: 1, lastName: 1, _id: 0 }
   )
   ```

---

## 📞 ถ้ายังหาไม่เจอ

### ติดต่อทีม Dev พร้อมข้อมูล

1. คำสั่งที่ใช้ค้นหา
2. Database ที่เชื่อมต่อ: `db.getName()`
3. Collections ที่มี: `show collections`
4. ตัวอย่าง document: `db.users.findOne()`

---

**วันที่สร้าง:** 29 พฤษภาคม 2026  
**Email ที่ค้นหา:** 10120002@nonedu2.go.th  
**Database:** thai_music_school

