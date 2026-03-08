# Authentication System - Phase 1 Complete

## ✅ สิ่งที่สร้างเสร็จแล้ว

### 1. Database Schema & Types
- `lib/types/user.types.ts` - User types (Admin, Teacher, Root)
- `lib/types/certificate.types.ts` - Certificate types

### 2. Authentication Utilities
- `lib/auth/password.ts` - Password hashing, verification, generation
- `lib/auth/session.ts` - JWT session management
- `lib/email/mailer.ts` - NodeMailer email service

### 3. API Routes
- `/api/auth/admin-login` - Admin login endpoint
- `/api/auth/teacher-login` - Teacher login endpoint (with School ID)
- `/api/auth/request-password` - Password reset request

### 4. Login Pages
- `/dcp-admin` - Admin login page
- `/teacher-login` - Teacher login page (60% login, 40% request password)
- `/request-password` - Password request page

### 5. Middleware
- Updated `middleware.ts` - Route protection for admin and teacher areas

---

## 📦 Dependencies ที่ต้องติดตั้ง

```bash
npm install bcryptjs jose nodemailer
npm install -D @types/bcryptjs @types/nodemailer
```

---

## 🔧 Environment Variables ที่ต้องเพิ่ม

เพิ่มใน `.env`:

```env
# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Gmail for sending emails
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# App URL
NEXT_PUBLIC_APP_URL=http://13.228.225.47:3000
```

### วิธีสร้าง Gmail App Password:
1. ไปที่ Google Account Settings
2. Security → 2-Step Verification (เปิดใช้งาน)
3. App passwords → สร้าง App Password ใหม่
4. คัดลอกรหัส 16 หลักมาใส่ใน `GMAIL_APP_PASSWORD`

---

## 🗄️ MongoDB Collections ที่ต้องสร้าง

### Collection: `users`
```javascript
{
  _id: ObjectId,
  email: String,
  password: String, // hashed
  role: String, // 'root' | 'admin' | 'teacher'
  firstName: String,
  lastName: String,
  phone: String,
  profileImage: String,
  schoolId: String, // For teachers only
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### สร้าง Root User (ครั้งแรก):
```javascript
// Run in MongoDB shell or Compass
use thai_music_school;

db.users.insertOne({
  email: "root@thaimusic.com",
  password: "$2a$10$...", // Use bcrypt to hash "admin123"
  role: "root",
  firstName: "System",
  lastName: "Administrator",
  phone: "0000000000",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

---

## 🎯 ขั้นตอนต่อไป (Phase 2)

### Admin Dashboard Pages:
1. `/dcp-admin/dashboard` - Overview dashboard
2. `/dcp-admin/dashboard/register100` - Manage Register100 schools
3. `/dcp-admin/dashboard/register-support` - Manage Register Support schools
4. `/dcp-admin/dashboard/users` - User management
5. `/dcp-admin/dashboard/users/create` - Create new admin/teacher
6. `/dcp-admin/dashboard/certificates` - Certificate management

### Teacher Dashboard Pages:
1. `/teacher/dashboard` - View school details (no scores)
2. `/teacher/certificate` - View certificates

### APIs:
1. `/api/users` - CRUD for users
2. `/api/certificates` - CRUD for certificates
3. `/api/dashboard/stats` - Dashboard statistics

---

## 🧪 Testing

### Test Admin Login:
```bash
curl -X POST http://localhost:3000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"root@thaimusic.com","password":"admin123"}'
```

### Test Teacher Login:
```bash
curl -X POST http://localhost:3000/api/auth/teacher-login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@school.ac.th","password":"123456","schoolId":"SCH-20260228-0001"}'
```

---

## 📝 Notes

1. Password reset feature ยังไม่ได้ implement จริง (ต้องเพิ่ม email sending)
2. Session management ใช้ JWT stored in httpOnly cookie
3. Middleware จะ redirect `/login` เก่าไปที่ `/dcp-admin` ใหม่
4. Old dashboard routes จะ redirect ไปที่ admin dashboard ใหม่

---

## 🔐 Security Considerations

1. ใช้ bcrypt สำหรับ hash passwords (10 rounds)
2. JWT tokens expire ใน 7 วัน
3. httpOnly cookies ป้องกัน XSS attacks
4. Secure cookies ใน production (HTTPS)
5. Password ของ teacher เป็นตัวเลข 6 หลัก
6. School ID format: SCH-YYYYMMDD-XXXX

---

## 🚀 Ready to Deploy

หลังจากติดตั้ง dependencies และตั้งค่า environment variables แล้ว:

```bash
npm install
npm run build
docker-compose up -d --build
```
