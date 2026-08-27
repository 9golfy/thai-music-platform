# 🔍 คำสั่งเช็ค Token ใหม่ล่าสุด

## 1. หา Token ล่าสุดของ Email ที่ระบุ

```javascript
use thai_music_school

// แทนที่ EMAIL_HERE ด้วย email ที่ต้องการค้นหา
db.draft_submissions.find({
  email: "EMAIL_HERE"
}).sort({ lastModified: -1 }).limit(1).pretty()
```

**ตัวอย่าง:**
```javascript
db.draft_submissions.find({
  email: "watcharapon_me@sb.ac.th"
}).sort({ lastModified: -1 }).limit(1).pretty()
```

---

## 2. หา Token ล่าสุดทั้งหมด (10 อันดับแรก)

```javascript
db.draft_submissions.find({
  status: "active"
}).sort({ lastModified: -1 }).limit(10).pretty()
```

---

## 3. หา Token ที่ยังไม่หมดอายุ

```javascript
db.draft_submissions.find({
  status: "active",
  expiresAt: { $gt: new Date() }
}).sort({ lastModified: -1 }).limit(10).pretty()
```

---

## 4. แสดงเฉพาะ Email, Token และวันที่

```javascript
db.draft_submissions.find({
  status: "active"
}).sort({ lastModified: -1 }).limit(10).forEach(doc => {
  print('Email: ' + doc.email);
  print('Token: ' + doc.token);
  print('Link: https://dcpschool100.net/draft/' + doc.token);
  print('Created: ' + doc.createdAt);
  print('Expires: ' + doc.expiresAt);
  print('Status: ' + (doc.expiresAt > new Date() ? '✅ Active' : '❌ Expired'));
  print('---');
});
```

---

## 5. หา Token ของ Email และแสดงเป็น Link

```javascript
var email = "watcharapon_me@sb.ac.th"; // เปลี่ยน email ตรงนี้

var draft = db.draft_submissions.findOne({
  email: email
}, {
  sort: { lastModified: -1 }
});

if (draft) {
  print('✅ พบ Draft ล่าสุด:');
  print('Email: ' + draft.email);
  print('Token: ' + draft.token);
  print('Link: https://dcpschool100.net/draft/' + draft.token);
  print('Created: ' + draft.createdAt);
  print('Last Modified: ' + draft.lastModified);
  print('Expires: ' + draft.expiresAt);
  print('Status: ' + (draft.expiresAt > new Date() ? '✅ ยังไม่หมดอายุ' : '❌ หมดอายุแล้ว'));
  print('Current Step: ' + draft.currentStep);
  print('Save Count: ' + draft.saveCount);
} else {
  print('❌ ไม่พบ Draft สำหรับ email: ' + email);
}
```

---

## 6. หา Token ทั้งหมดของ Email (เรียงจากใหม่ไปเก่า)

```javascript
var email = "watcharapon_me@sb.ac.th"; // เปลี่ยน email ตรงนี้

print('=== Draft ทั้งหมดของ ' + email + ' ===\n');

db.draft_submissions.find({
  email: email
}).sort({ lastModified: -1 }).forEach((doc, index) => {
  print((index + 1) + '. Token: ' + doc.token);
  print('   Link: https://dcpschool100.net/draft/' + doc.token);
  print('   Created: ' + doc.createdAt);
  print('   Last Modified: ' + doc.lastModified);
  print('   Expires: ' + doc.expiresAt);
  print('   Status: ' + (doc.expiresAt > new Date() ? '✅ Active' : '❌ Expired'));
  print('   Save Count: ' + doc.saveCount);
  print('');
});
```

---

## 7. นับจำนวน Draft ที่ยังไม่หมดอายุ

```javascript
var activeCount = db.draft_submissions.countDocuments({
  status: "active",
  expiresAt: { $gt: new Date() }
});

var expiredCount = db.draft_submissions.countDocuments({
  status: "active",
  expiresAt: { $lte: new Date() }
});

print('📊 สถิติ Draft:');
print('✅ ยังไม่หมดอายุ: ' + activeCount + ' drafts');
print('❌ หมดอายุแล้ว: ' + expiredCount + ' drafts');
print('📝 รวมทั้งหมด: ' + (activeCount + expiredCount) + ' drafts');
```

---

## 8. หา Draft ที่ถูก Save ล่าสุด (ทุก Email)

```javascript
print('=== Draft ที่ถูก Save ล่าสุด (10 อันดับแรก) ===\n');

db.draft_submissions.find({
  status: "active"
}).sort({ lastSaveAt: -1 }).limit(10).forEach((doc, index) => {
  print((index + 1) + '. Email: ' + doc.email);
  print('   Token: ' + doc.token);
  print('   Link: https://dcpschool100.net/draft/' + doc.token);
  print('   Last Save: ' + doc.lastSaveAt);
  print('   Save Count: ' + doc.saveCount);
  print('   Status: ' + (doc.expiresAt > new Date() ? '✅ Active' : '❌ Expired'));
  print('');
});
```

---

## 9. ค้นหา Draft จาก Token บางส่วน

```javascript
var partialToken = "6e3c25ca"; // ใส่ token บางส่วน

print('=== ค้นหา Token ที่มี "' + partialToken + '" ===\n');

db.draft_submissions.find({
  token: { $regex: partialToken, $options: 'i' }
}).forEach((doc, index) => {
  print((index + 1) + '. Email: ' + doc.email);
  print('   Token: ' + doc.token);
  print('   Link: https://dcpschool100.net/draft/' + doc.token);
  print('   Status: ' + (doc.expiresAt > new Date() ? '✅ Active' : '❌ Expired'));
  print('');
});
```

---

## 10. สร้าง Token ใหม่สำหรับ Email (ถ้า Token เก่าหมดอายุ)

```javascript
// ⚠️ คำเตือน: คำสั่งนี้จะสร้าง token ใหม่ให้กับ draft ที่หมดอายุ
// ใช้เฉพาะเมื่อจำเป็นเท่านั้น

var email = "watcharapon_me@sb.ac.th"; // เปลี่ยน email ตรงนี้

var draft = db.draft_submissions.findOne({
  email: email
}, {
  sort: { lastModified: -1 }
});

if (draft && draft.expiresAt < new Date()) {
  // Token หมดอายุแล้ว - ขยายเวลา
  var newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7); // ขยายอีก 7 วัน
  
  db.draft_submissions.updateOne(
    { _id: draft._id },
    { 
      $set: { 
        expiresAt: newExpiresAt,
        lastModified: new Date()
      } 
    }
  );
  
  print('✅ ขยายเวลา Token สำเร็จ!');
  print('Email: ' + email);
  print('Token: ' + draft.token);
  print('Link: https://dcpschool100.net/draft/' + draft.token);
  print('Expires: ' + newExpiresAt);
} else if (draft) {
  print('ℹ️ Token ยังไม่หมดอายุ');
  print('Link: https://dcpschool100.net/draft/' + draft.token);
  print('Expires: ' + draft.expiresAt);
} else {
  print('❌ ไม่พบ Draft สำหรับ email: ' + email);
}
```

---

## 📝 วิธีใช้งาน

1. เปิด MongoDB shell:
   ```bash
   mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin"
   ```

2. Copy คำสั่งที่ต้องการ

3. Paste ลงใน MongoDB shell

4. กด Enter

---

## 🎯 คำสั่งที่แนะนำ

### สำหรับหา Token ใหม่ล่าสุดของ Email:
```javascript
var email = "EMAIL_HERE";
var draft = db.draft_submissions.findOne({ email: email }, { sort: { lastModified: -1 } });
if (draft) {
  print('Link: https://dcpschool100.net/draft/' + draft.token);
  print('Status: ' + (draft.expiresAt > new Date() ? '✅ Active' : '❌ Expired'));
}
```

### สำหรับดู Draft ล่าสุดทั้งหมด:
```javascript
db.draft_submissions.find({ status: "active" }).sort({ lastModified: -1 }).limit(5).forEach(doc => {
  print(doc.email + ' → https://dcpschool100.net/draft/' + doc.token);
});
```

---

**หมายเหตุ:** 
- Token จะหมดอายุใน 7 วันหลังจาก save ครั้งสุดท้าย
- ทุกครั้งที่ save draft ใหม่ จะสร้าง token ใหม่
- Token เก่าจะไม่สามารถใช้งานได้หลังจากมีการ save ใหม่
