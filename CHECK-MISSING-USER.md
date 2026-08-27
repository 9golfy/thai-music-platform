# 🔍 ตรวจสอบ User ที่หายไป - 10120002@nonedu2.go.th

## ปัญหา
- มีข้อมูล **submit** ใน `register100_submissions` (ID: 6a180787f597341e559627b8)
- แต่**ไม่มี user** ใน `users` collection
- ทำให้ไม่แสดงในหน้า `/dcp-admin/dashboard/users`

---

## 1. ตรวจสอบข้อมูล Register100 Submission

```javascript
use thai_music_school

// ค้นหาด้วย ObjectId
db.register100_submissions.findOne({ 
  _id: ObjectId("6a180787f597341e559627b8") 
})

// หรือค้นหาด้วย email
db.register100_submissions.findOne({ 
  email: "10120002@nonedu2.go.th" 
})
```

### ข้อมูลที่ต้องเช็ค:
```javascript
var submission = db.register100_submissions.findOne({ 
  email: "10120002@nonedu2.go.th" 
});

if (submission) {
  print("=== Register100 Submission ===");
  print("Email: " + submission.email);
  print("Phone: " + submission.phone);
  print("School: " + submission.reg100_schoolName);
  print("Status: " + submission.status);
  print("Submitted At: " + submission.submittedAt);
  print("School ID: " + submission.schoolId);
} else {
  print("❌ ไม่พบ submission");
}
```

---

## 2. ตรวจสอบว่ามี User หรือไม่

```javascript
use thai_music_school

// ค้นหา user
var user = db.users.findOne({ 
  email: "10120002@nonedu2.go.th" 
});

if (user) {
  print("✅ พบ User");
  printjson(user);
} else {
  print("❌ ไม่พบ User - ต้องสร้างใหม่");
}
```

---

## 3. สาเหตุที่เป็นไปได้

### สาเหตุที่ 1: Submit API ไม่ได้สร้าง User
- API `/api/draft/[token]/submit` อาจมี bug
- ไม่ได้สร้าง user ใน `users` collection
- ต้องตรวจสอบ code

### สาเหตุที่ 2: Transaction Failed
- การ submit อาจ fail ตอนสร้าง user
- แต่ submission ถูกบันทึกไปแล้ว
- ทำให้ข้อมูลไม่สมบูรณ์

### สาเหตุที่ 3: User ถูกลบ
- User เคยถูกสร้างแล้ว
- แต่ถูกลบทิ้งไปในภายหลัง
- Submission ยังคงอยู่

---

## 4. วิธีแก้ไข - สร้าง User ด้วยตนเอง

### ขั้นตอนที่ 1: ดึงข้อมูลจาก Submission

```javascript
use thai_music_school

var submission = db.register100_submissions.findOne({ 
  email: "10120002@nonedu2.go.th" 
});

// แสดงข้อมูลที่จำเป็น
print("Email: " + submission.email);
print("Phone: " + submission.phone);
print("School ID: " + submission.schoolId);
print("Manager Name: " + submission.reg100_mgtFullName);
```

### ขั้นตอนที่ 2: สร้าง User

```javascript
use thai_music_school

var submission = db.register100_submissions.findOne({ 
  email: "10120002@nonedu2.go.th" 
});

// แยกชื่อ-นามสกุล
var fullName = submission.reg100_mgtFullName || "";
var nameParts = fullName.split(" ");
var firstName = nameParts[0] || "";
var lastName = nameParts.slice(1).join(" ") || "";

// สร้าง user
db.users.insertOne({
  email: submission.email,
  phone: submission.phone || "",
  firstName: firstName,
  lastName: lastName,
  role: "teacher",
  schoolId: submission.schoolId || "",
  isActive: true,
  createdAt: submission.submittedAt || new Date(),
  updatedAt: new Date(),
  password: "$2b$12$DEFAULT_HASH_NEED_TO_RESET" // ต้อง reset password
});

print("✅ สร้าง User สำเร็จ");
print("⚠️ ผู้ใช้ต้อง Reset Password ก่อนใช้งาน");
```

---

## 5. สคริปต์สร้าง User แบบสมบูรณ์

```javascript
use thai_music_school

// ฟังก์ชันสร้าง User จาก Submission
function createUserFromSubmission(email) {
  // 1. หา submission
  var submission = db.register100_submissions.findOne({ email: email });
  
  if (!submission) {
    print("❌ ไม่พบ submission สำหรับ email: " + email);
    return;
  }
  
  // 2. เช็คว่ามี user อยู่แล้วหรือไม่
  var existingUser = db.users.findOne({ email: email });
  if (existingUser) {
    print("⚠️ User มีอยู่แล้ว");
    return;
  }
  
  // 3. แยกชื่อ-นามสกุล
  var fullName = submission.reg100_mgtFullName || "";
  var nameParts = fullName.split(" ");
  var firstName = nameParts[0] || "";
  var lastName = nameParts.slice(1).join(" ") || "";
  
  // 4. สร้าง user
  var newUser = {
    email: submission.email,
    phone: submission.phone || "",
    firstName: firstName,
    lastName: lastName,
    role: "teacher",
    schoolId: submission.schoolId || "",
    isActive: true,
    createdAt: submission.submittedAt || new Date(),
    updatedAt: new Date(),
    password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koiyZvnWlKm6" // password: "changeme"
  };
  
  db.users.insertOne(newUser);
  
  print("✅ สร้าง User สำเร็จ");
  print("Email: " + newUser.email);
  print("Name: " + newUser.firstName + " " + newUser.lastName);
  print("Role: " + newUser.role);
  print("School ID: " + newUser.schoolId);
  print("");
  print("⚠️ Password เริ่มต้น: changeme");
  print("⚠️ ผู้ใช้ต้อง Reset Password ก่อนใช้งาน");
}

// เรียกใช้ฟังก์ชัน
createUserFromSubmission("10120002@nonedu2.go.th");
```

---

## 6. ตรวจสอบหลังสร้าง User

```javascript
use thai_music_school

var email = "10120002@nonedu2.go.th";

print("=== ตรวจสอบข้อมูล ===");
print("Users: " + db.users.countDocuments({ email: email }));
print("Drafts: " + db.draft_submissions.countDocuments({ email: email }));
print("Register100: " + db.register100_submissions.countDocuments({ email: email }));
print("RegisterSupport: " + db.register_support_submissions.countDocuments({ email: email }));

// แสดงข้อมูล user
var user = db.users.findOne({ email: email });
if (user) {
  print("\n✅ User Details:");
  print("Name: " + user.firstName + " " + user.lastName);
  print("Email: " + user.email);
  print("Phone: " + user.phone);
  print("Role: " + user.role);
  print("School ID: " + user.schoolId);
  print("Active: " + user.isActive);
}
```

---

## 7. ตรวจสอบ Submit API

### ไฟล์ที่ต้องเช็ค:
`app/api/draft/[token]/submit/route.ts`

### จุดที่ต้องตรวจสอบ:

1. **มีการสร้าง User หรือไม่?**
   ```typescript
   // ควรมี code แบบนี้
   await usersCollection.insertOne({
     email: draft.email,
     phone: draft.phone,
     firstName: ...,
     lastName: ...,
     role: 'teacher',
     schoolId: ...,
     password: hashedPassword,
     isActive: true,
     createdAt: new Date(),
     updatedAt: new Date()
   });
   ```

2. **มี Transaction หรือไม่?**
   ```typescript
   // ควรใช้ transaction เพื่อให้ข้อมูลสมบูรณ์
   const session = client.startSession();
   try {
     await session.withTransaction(async () => {
       // สร้าง submission
       // สร้าง user
       // ลบ draft
     });
   } finally {
     await session.endSession();
   }
   ```

3. **มี Error Handling หรือไม่?**
   ```typescript
   try {
     // สร้าง user
   } catch (error) {
     console.error('Failed to create user:', error);
     // ควร rollback submission ด้วย
   }
   ```

---

## 8. แก้ไข Submit API (ถ้าจำเป็น)

### ตรวจสอบว่า API สร้าง User หรือไม่:

```typescript
// ใน app/api/draft/[token]/submit/route.ts

// หลังจากสร้าง submission แล้ว ต้องสร้าง user ด้วย
const usersCollection = db.collection('users');

// เช็คว่ามี user อยู่แล้วหรือไม่
const existingUser = await usersCollection.findOne({ 
  email: draft.email 
});

if (!existingUser) {
  // สร้าง user ใหม่
  const [firstName, ...lastNameParts] = (
    draft.formData.reg100_mgtFullName || 
    draft.formData.regsup_school_director_name || 
    ''
  ).split(' ');
  
  await usersCollection.insertOne({
    email: draft.email,
    phone: draft.phone,
    firstName: firstName || '',
    lastName: lastNameParts.join(' ') || '',
    role: 'teacher',
    schoolId: newSubmission.schoolId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: draft.password || '' // ใช้ password จาก draft
  });
}
```

---

## 9. สคริปต์แก้ไขข้อมูลทั้งหมด

### หา Submissions ที่ไม่มี User

```javascript
use thai_music_school

// หา submissions ทั้งหมด
var submissions = db.register100_submissions.find({}).toArray();

print("=== ตรวจสอบ Submissions ที่ไม่มี User ===\n");

var missingUsers = [];

submissions.forEach(function(submission) {
  var user = db.users.findOne({ email: submission.email });
  
  if (!user) {
    missingUsers.push(submission.email);
    print("❌ Missing User: " + submission.email);
    print("   School: " + submission.reg100_schoolName);
    print("   Submitted: " + submission.submittedAt);
    print("");
  }
});

print("=== สรุป ===");
print("Total Submissions: " + submissions.length);
print("Missing Users: " + missingUsers.length);

if (missingUsers.length > 0) {
  print("\n📋 รายการ Email ที่ไม่มี User:");
  missingUsers.forEach(function(email) {
    print("  - " + email);
  });
}
```

### สร้าง Users ทั้งหมดที่หายไป

```javascript
use thai_music_school

function createMissingUsers() {
  var submissions = db.register100_submissions.find({}).toArray();
  var created = 0;
  
  submissions.forEach(function(submission) {
    var user = db.users.findOne({ email: submission.email });
    
    if (!user) {
      var fullName = submission.reg100_mgtFullName || "";
      var nameParts = fullName.split(" ");
      var firstName = nameParts[0] || "";
      var lastName = nameParts.slice(1).join(" ") || "";
      
      db.users.insertOne({
        email: submission.email,
        phone: submission.phone || "",
        firstName: firstName,
        lastName: lastName,
        role: "teacher",
        schoolId: submission.schoolId || "",
        isActive: true,
        createdAt: submission.submittedAt || new Date(),
        updatedAt: new Date(),
        password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koiyZvnWlKm6"
      });
      
      created++;
      print("✅ Created user: " + submission.email);
    }
  });
  
  print("\n=== สรุป ===");
  print("สร้าง Users ใหม่: " + created + " รายการ");
}

// เรียกใช้ฟังก์ชัน
createMissingUsers();
```

---

## 🎯 คำสั่งด่วนสำหรับกรณีนี้

```javascript
use thai_music_school

// 1. ตรวจสอบ submission
var submission = db.register100_submissions.findOne({ 
  email: "10120002@nonedu2.go.th" 
});

if (submission) {
  print("✅ พบ Submission");
  print("School: " + submission.reg100_schoolName);
  print("Manager: " + submission.reg100_mgtFullName);
  print("School ID: " + submission.schoolId);
  
  // 2. สร้าง user
  var nameParts = (submission.reg100_mgtFullName || "").split(" ");
  
  db.users.insertOne({
    email: submission.email,
    phone: submission.phone || "",
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    role: "teacher",
    schoolId: submission.schoolId || "",
    isActive: true,
    createdAt: submission.submittedAt || new Date(),
    updatedAt: new Date(),
    password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koiyZvnWlKm6"
  });
  
  print("\n✅ สร้าง User สำเร็จ!");
  print("⚠️ Password เริ่มต้น: changeme");
} else {
  print("❌ ไม่พบ Submission");
}
```

---

## 📝 สรุป

### ปัญหา:
- มี **submission** แต่ไม่มี **user**
- Submit API อาจไม่ได้สร้าง user

### วิธีแก้:
1. **แก้ไขทันที:** สร้าง user ด้วยตนเองจาก submission
2. **แก้ไขถาวร:** ตรวจสอบและแก้ไข Submit API

### Password เริ่มต้น:
```
Username: 10120002@nonedu2.go.th
Password: changeme
```

ผู้ใช้ต้อง **Reset Password** ก่อนใช้งาน

---

**วันที่สร้าง:** 29 พฤษภาคม 2026  
**Email:** 10120002@nonedu2.go.th  
**Submission ID:** 6a180787f597341e559627b8

