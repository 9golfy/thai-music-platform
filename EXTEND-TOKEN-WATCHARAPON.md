# 🔄 ต่ออายุ Token สำหรับ watcharapon_me@sb.ac.th

## คำสั่ง MongoDB (Copy ทั้งหมดแล้ว Paste ใน MongoDB shell)

```javascript
use thai_music_school

// ต่ออายุ token สำหรับ watcharapon_me@sb.ac.th
var email = "watcharapon_me@sb.ac.th";

print('=== กำลังค้นหา Draft ของ ' + email + ' ===\n');

var draft = db.draft_submissions.findOne({ 
  email: email 
}, { 
  sort: { lastModified: -1 } 
});

if (draft) {
  print('✅ พบ Draft:');
  print('Email: ' + draft.email);
  print('Token: ' + (draft.token || draft.draftToken || 'N/A'));
  print('Created: ' + draft.createdAt);
  print('Last Modified: ' + draft.lastModified);
  print('Old Expires: ' + draft.expiresAt);
  print('Status: ' + (draft.expiresAt > new Date() ? '✅ Active' : '❌ Expired'));
  print('');
  
  // ต่ออายุ 30 วัน
  var newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 30);
  
  var result = db.draft_submissions.updateOne(
    { _id: draft._id },
    { 
      $set: { 
        expiresAt: newExpiresAt,
        lastModified: new Date(),
        status: 'active'
      } 
    }
  );
  
  if (result.modifiedCount > 0) {
    print('✅ ต่ออายุ Token สำเร็จ!');
    print('');
    print('📋 ข้อมูลใหม่:');
    print('Email: ' + email);
    
    // ใช้ token หรือ draftToken ที่มีอยู่
    var tokenToUse = draft.token || draft.draftToken;
    if (tokenToUse) {
      print('Token: ' + tokenToUse);
      print('Link: https://dcpschool100.net/draft/' + tokenToUse);
    } else {
      print('⚠️ Warning: Token is undefined');
      print('กรุณาตรวจสอบ draft document');
    }
    
    print('New Expires: ' + newExpiresAt);
    print('Valid for: 30 days');
    print('');
    print('✅ ผู้ใช้สามารถใช้ link ด้านบนเพื่อกรอกข้อมูลต่อได้');
  } else {
    print('❌ ไม่สามารถต่ออายุได้');
    print('กรุณาตรวจสอบข้อมูล');
  }
} else {
  print('❌ ไม่พบ Draft สำหรับ email: ' + email);
  print('');
  print('💡 แนะนำ: ให้ผู้ใช้ไปที่ https://dcpschool100.net/register-support');
  print('และกรอก email + เบอร์โทรเพื่อสร้าง draft ใหม่');
}
```

---

## 📝 วิธีใช้งาน

### 1. เปิด MongoDB shell
```bash
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin"
```

### 2. Copy คำสั่งด้านบน

### 3. Paste ลงใน MongoDB shell

### 4. กด Enter

---

## ✅ ผลลัพธ์ที่คาดหวัง

```
=== กำลังค้นหา Draft ของ watcharapon_me@sb.ac.th ===

✅ พบ Draft:
Email: watcharapon_me@sb.ac.th
Token: 6e3c25ca-890c-4e41-a816-8bbb95ecadce
Created: 2026-05-08T08:36:46.047Z
Last Modified: 2026-05-08T08:36:46.047Z
Old Expires: 2026-05-15T08:36:46.047Z
Status: ❌ Expired

✅ ต่ออายุ Token สำเร็จ!

📋 ข้อมูลใหม่:
Email: watcharapon_me@sb.ac.th
Token: 6e3c25ca-890c-4e41-a816-8bbb95ecadce
Link: https://dcpschool100.net/draft/6e3c25ca-890c-4e41-a816-8bbb95ecadce
New Expires: 2026-06-28T09:30:00.000Z
Valid for: 30 days

✅ ผู้ใช้สามารถใช้ link ด้านบนเพื่อกรอกข้อมูลต่อได้
```

---

## 🔍 ตรวจสอบหลังต่ออายุ

```javascript
// ตรวจสอบว่าต่ออายุสำเร็จหรือไม่
var email = "watcharapon_me@sb.ac.th";
var draft = db.draft_submissions.findOne({ email: email }, { sort: { lastModified: -1 } });

if (draft) {
  var tokenToUse = draft.token || draft.draftToken;
  print('Link: https://dcpschool100.net/draft/' + tokenToUse);
  print('Expires: ' + draft.expiresAt);
  print('Status: ' + (draft.expiresAt > new Date() ? '✅ Active' : '❌ Expired'));
}
```

---

## ⚠️ หมายเหตุ

- Token จะถูกต่ออายุ **30 วัน** จากวันนี้
- ถ้า token เป็น `undefined` ระบบจะพยายามใช้ `draftToken` แทน
- ถ้ายังไม่ได้ ให้ผู้ใช้สร้าง draft ใหม่ที่หน้า register-support

---

## 🆘 ถ้ายังไม่ได้

### ดูข้อมูล Draft เต็มๆ
```javascript
var email = "watcharapon_me@sb.ac.th";
var draft = db.draft_submissions.findOne({ email: email }, { sort: { lastModified: -1 } });
printjson(draft);
```

### สร้าง Token ใหม่ (ถ้า token เป็น undefined)
```javascript
var email = "watcharapon_me@sb.ac.th";
var crypto = require('crypto');
var newToken = crypto.randomUUID();
var newExpiresAt = new Date();
newExpiresAt.setDate(newExpiresAt.getDate() + 30);

db.draft_submissions.updateOne(
  { email: email },
  { 
    $set: { 
      token: newToken,
      draftToken: newToken,
      expiresAt: newExpiresAt,
      lastModified: new Date(),
      status: 'active'
    } 
  },
  { sort: { lastModified: -1 } }
);

print('✅ สร้าง Token ใหม่สำเร็จ!');
print('Link: https://dcpschool100.net/draft/' + newToken);
```
