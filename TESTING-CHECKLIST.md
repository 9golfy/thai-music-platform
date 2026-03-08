# 🧪 Testing Checklist

รายการตรวจสอบการทำงานของระบบ

## 📋 Pre-Testing Setup

### ✅ Environment Check
- [ ] MongoDB running (`docker ps`)
- [ ] `.env` file configured
- [ ] Dependencies installed (`npm install`)
- [ ] Database setup completed (`npm run db:setup`)
- [ ] Application running (`npm run dev`)

---

## 🔐 Authentication Tests

### Admin Login (`/dcp-admin`)
- [ ] เปิดหน้า login ได้
- [ ] กรอก email + password ถูกต้อง → Login สำเร็จ
- [ ] กรอก email ผิด → แสดง error
- [ ] กรอก password ผิด → แสดง error
- [ ] กรอกไม่ครบ → แสดง validation error
- [ ] Login สำเร็จ → redirect ไป dashboard
- [ ] Session cookie ถูกสร้าง (ตรวจสอบใน DevTools)

### Teacher Login (`/teacher-login`)
- [ ] เปิดหน้า login ได้
- [ ] Layout: 60% form, 40% request password info
- [ ] กรอก email + password + schoolId ถูกต้อง → Login สำเร็จ
- [ ] กรอก email ผิด → แสดง error
- [ ] กรอก password ผิด → แสดง error
- [ ] กรอก schoolId ผิด → แสดง error
- [ ] กรอกไม่ครบ → แสดง validation error
- [ ] Login สำเร็จ → redirect ไป teacher dashboard
- [ ] Link ไป request password ทำงาน

### Request Password (`/request-password`)
- [ ] เปิดหน้าได้
- [ ] กรอก email + phone ถูกต้อง → ส่ง request สำเร็จ
- [ ] กรอก email ไม่ถูกต้อง → แสดง validation error
- [ ] กรอก phone ไม่ถูกต้อง → แสดง validation error
- [ ] ถ้าตั้งค่า Gmail → ได้รับ email
- [ ] Email มี password และ schoolId (สำหรับ teacher)

### Logout
- [ ] คลิก Logout → redirect ไป login page
- [ ] Session cookie ถูกลบ
- [ ] ไม่สามารถเข้า protected routes ได้

---

## 👥 Admin Dashboard Tests

### Dashboard Overview (`/dcp-admin/dashboard`)
- [ ] แสดง 4 statistics cards
  - [ ] โรงเรียน 100%
  - [ ] โรงเรียนสนับสนุน
  - [ ] คะแนนรวม
  - [ ] ใบประกาศ
- [ ] แสดงตาราง Recent Submissions (10 รายการล่าสุด)
- [ ] Sidebar แสดงเมนูครบ
- [ ] Header แสดงชื่อ user และปุ่ม logout

### Schools Management - Register100 (`/dcp-admin/dashboard/register100`)
- [ ] แสดงตารางโรงเรียนทั้งหมด
- [ ] แสดงข้อมูล: School ID, ชื่อโรงเรียน, คะแนน, วันที่สร้าง
- [ ] คลิก "ดูรายละเอียด" → ไปหน้า detail
- [ ] คลิก "ลบ" → แสดง confirmation dialog
- [ ] ยืนยันลบ → ลบสำเร็จ
- [ ] ยกเลิกลบ → ไม่ลบ

### School Detail View (`/dcp-admin/dashboard/register100/[id]`)
- [ ] แสดงข้อมูลโรงเรียนครบ 8 steps
- [ ] แสดงคะแนนแต่ละ step
- [ ] แสดงคะแนนรวม
- [ ] แสดงรูปภาพ (ถ้ามี)
- [ ] ปุ่ม "กลับ" ทำงาน

### Schools Management - Register-Support (`/dcp-admin/dashboard/register-support`)
- [ ] แสดงตารางโรงเรียนทั้งหมด
- [ ] แสดงข้อมูล: School ID, ชื่อโรงเรียน, คะแนน, วันที่สร้าง
- [ ] คลิก "ดูรายละเอียด" → ไปหน้า detail
- [ ] คลิก "ลบ" → แสดง confirmation dialog
- [ ] ยืนยันลบ → ลบสำเร็จ

### School Detail View (`/dcp-admin/dashboard/register-support/[id]`)
- [ ] แสดงข้อมูลโรงเรียนครบ 8 steps
- [ ] แสดงคะแนนแต่ละ step
- [ ] แสดงคะแนนรวม
- [ ] แสดงรูปภาพ (ถ้ามี)
- [ ] ปุ่ม "กลับ" ทำงาน

---

## 👤 User Management Tests

### Users List (`/dcp-admin/dashboard/users`)
- [ ] แสดง 2 tabs: Admin และ Teacher
- [ ] Tab Admin แสดง users ที่เป็น root และ admin
- [ ] Tab Teacher แสดง users ที่เป็น teacher
- [ ] แสดงข้อมูล: ชื่อ, email, เบอร์โทร, role, status
- [ ] ปุ่ม "เพิ่มผู้ใช้งาน" แสดงเฉพาะ Root user
- [ ] ปุ่ม "Reset Password" ทำงาน
- [ ] ปุ่ม "ลบ" ไม่แสดงสำหรับ Root users

### Create User (`/dcp-admin/dashboard/users/create`) - Root Only
- [ ] เฉพาะ Root เข้าได้
- [ ] Admin เข้าไม่ได้ (redirect หรือ 403)
- [ ] กรอกข้อมูล: ชื่อ, นามสกุล, email, เบอร์โทร, role
- [ ] เลือก role: Admin หรือ Teacher
- [ ] ถ้าเลือก Teacher → แสดงช่อง School ID
- [ ] ปุ่ม "สร้างรหัสผ่านอัตโนมัติ" ทำงาน
  - [ ] Admin → สร้างรหัส 8 ตัว
  - [ ] Teacher → สร้างรหัส 6 ตัว
- [ ] Upload รูปโปรไฟล์ (ถ้ามี feature)
- [ ] Submit → สร้าง user สำเร็จ
- [ ] แสดงรหัสผ่านที่สร้าง
- [ ] Validation ทำงานถูกต้อง

### Reset Password
- [ ] คลิก "Reset Password" → แสดง confirmation
- [ ] ยืนยัน → สร้างรหัสผ่านใหม่
- [ ] ถ้าตั้งค่า Email → ส่ง email แจ้งรหัสใหม่
- [ ] แสดงรหัสผ่านใหม่บนหน้าจอ

### Delete User
- [ ] Root users ไม่มีปุ่มลบ
- [ ] Admin/Teacher users มีปุ่มลบ
- [ ] คลิก "ลบ" → แสดง confirmation
- [ ] ยืนยัน → ลบสำเร็จ
- [ ] ยกเลิก → ไม่ลบ

---

## 🎓 Teacher Portal Tests

### Teacher Dashboard (`/teacher/dashboard`)
- [ ] Login เป็น Teacher เข้าได้
- [ ] Admin เข้าไม่ได้
- [ ] แสดงข้อมูลโรงเรียนของ teacher
- [ ] แสดงข้อมูลทั้ง 8 steps
- [ ] ไม่แสดงคะแนน (สำคัญ!)
- [ ] แสดงรูปภาพ (ถ้ามี)
- [ ] Sidebar สีเขียว (teacher theme)
- [ ] Header แสดงชื่อ teacher

### Teacher Certificate (`/teacher/certificate`)
- [ ] Login เป็น Teacher เข้าได้
- [ ] ถ้ามีใบประกาศ → แสดงใบประกาศ
- [ ] ถ้าไม่มีใบประกาศ → แสดงข้อความ "ยังไม่มีใบประกาศ"
- [ ] ปุ่ม Download (ถ้ามี feature)

---

## 📜 Certificate Management Tests

### Certificates List (`/dcp-admin/dashboard/certificates`)
- [ ] แสดงตารางใบประกาศทั้งหมด
- [ ] แสดงข้อมูล: เลขที่, ชื่อโรงเรียน, ประเภท, วันที่ออก
- [ ] ปุ่ม "สร้างใบประกาศ" ทำงาน
- [ ] ปุ่ม "ลบ" ทำงาน

### Create Certificate (`/dcp-admin/dashboard/certificates/create`)
- [ ] เปิดหน้าได้
- [ ] Dropdown เลือกโรงเรียน
  - [ ] แสดงโรงเรียนจาก register100
  - [ ] แสดงโรงเรียนจาก register-support
- [ ] เลือกโรงเรียน → แสดงข้อมูลโรงเรียน
- [ ] Dropdown เลือก Template
  - [ ] Default
  - [ ] Gold
  - [ ] Silver
- [ ] แสดง Preview ใบประกาศ
- [ ] เลขที่ใบประกาศ auto-generate (CERT-YYYY-XXXX)
- [ ] Submit → สร้างสำเร็จ
- [ ] Redirect ไปหน้า list

### Delete Certificate
- [ ] คลิก "ลบ" → แสดง confirmation
- [ ] ยืนยัน → ลบสำเร็จ
- [ ] ยกเลิก → ไม่ลบ

---

## 🔒 Security & Authorization Tests

### Role-based Access Control

#### Root User
- [ ] เข้า Admin Dashboard ได้
- [ ] เข้า User Management ได้
- [ ] สร้าง User ได้
- [ ] ลบ Admin/Teacher users ได้
- [ ] ไม่สามารถลบ Root users อื่นได้
- [ ] จัดการโรงเรียนได้
- [ ] จัดการใบประกาศได้

#### Admin User
- [ ] เข้า Admin Dashboard ได้
- [ ] เข้า User Management ได้ (ดูอย่างเดียว)
- [ ] สร้าง User ไม่ได้
- [ ] ลบ User ไม่ได้
- [ ] จัดการโรงเรียนได้
- [ ] จัดการใบประกาศได้

#### Teacher User
- [ ] เข้า Admin Dashboard ไม่ได้
- [ ] เข้า Teacher Dashboard ได้
- [ ] ดูข้อมูลโรงเรียนของตัวเองได้
- [ ] ไม่เห็นคะแนน
- [ ] ดูใบประกาศของตัวเองได้
- [ ] เข้าหน้าอื่นไม่ได้

### Protected Routes
- [ ] ไม่ login → redirect ไป login page
- [ ] Login แล้ว → เข้า protected routes ได้
- [ ] Session หมดอายุ → redirect ไป login page
- [ ] Role ไม่ถูกต้อง → 403 หรือ redirect

---

## 🌐 API Tests

### Authentication APIs
- [ ] `POST /api/auth/admin-login` - Login สำเร็จ
- [ ] `POST /api/auth/admin-login` - Login ผิด → 401
- [ ] `POST /api/auth/teacher-login` - Login สำเร็จ
- [ ] `POST /api/auth/teacher-login` - Login ผิด → 401
- [ ] `POST /api/auth/request-password` - ส่ง request สำเร็จ
- [ ] `POST /api/auth/logout` - Logout สำเร็จ

### Users APIs
- [ ] `GET /api/users` - List users (ต้อง login)
- [ ] `POST /api/users` - Create user (Root only)
- [ ] `GET /api/users/[id]` - Get user
- [ ] `PUT /api/users/[id]` - Update user
- [ ] `DELETE /api/users/[id]` - Delete user (Root only)
- [ ] `POST /api/users/[id]/reset-password` - Reset password

### Certificates APIs
- [ ] `GET /api/certificates` - List certificates
- [ ] `POST /api/certificates` - Create certificate
- [ ] `GET /api/certificates/[id]` - Get certificate
- [ ] `DELETE /api/certificates/[id]` - Delete certificate

### Schools APIs
- [ ] `GET /api/register100/list` - List schools
- [ ] `GET /api/register100/[id]` - Get school
- [ ] `PUT /api/register100/[id]` - Update school
- [ ] `DELETE /api/register100/[id]` - Delete school
- [ ] (Same for /api/register-support)

---

## 🎨 UI/UX Tests

### Responsive Design
- [ ] Desktop (1920x1080) - แสดงผลถูกต้อง
- [ ] Laptop (1366x768) - แสดงผลถูกต้อง
- [ ] Tablet (768x1024) - แสดงผลถูกต้อง
- [ ] Mobile (375x667) - แสดงผลถูกต้อง

### Theme & Colors
- [ ] Admin Portal - สีน้ำเงิน
- [ ] Teacher Portal - สีเขียว
- [ ] Buttons มี hover effect
- [ ] Links มี hover effect
- [ ] Form inputs มี focus state

### Loading States
- [ ] Login → แสดง loading
- [ ] Fetch data → แสดง loading
- [ ] Submit form → แสดง loading
- [ ] Delete → แสดง loading

### Error Handling
- [ ] Network error → แสดง error message
- [ ] Validation error → แสดง error ใต้ field
- [ ] API error → แสดง toast notification
- [ ] 404 page → แสดงหน้า Not Found

---

## 🗄️ Database Tests

### Data Integrity
- [ ] User email unique
- [ ] Certificate number unique
- [ ] School ID format ถูกต้อง
- [ ] Timestamps (createdAt, updatedAt) ถูกสร้าง
- [ ] Soft delete (ถ้ามี)

### Indexes
- [ ] users.email - unique index
- [ ] users.role - index
- [ ] users.schoolId - index
- [ ] certificates.schoolId - index
- [ ] certificates.certificateNumber - unique index

---

## 🚀 Performance Tests

### Page Load Time
- [ ] Home page < 2s
- [ ] Dashboard < 3s
- [ ] School list < 3s
- [ ] School detail < 2s

### API Response Time
- [ ] Login < 1s
- [ ] List APIs < 2s
- [ ] Get APIs < 1s
- [ ] Create/Update APIs < 2s

---

## 📱 Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Samsung Internet

---

## 🔧 DevOps Tests

### Docker
- [ ] `docker-compose up -d` - เริ่มได้
- [ ] `docker ps` - แสดง containers ทั้งหมด
- [ ] `docker logs thai-music-web` - แสดง logs
- [ ] `docker logs thai-music-mongo` - แสดง logs
- [ ] `docker-compose down` - หยุดได้

### Build & Deploy
- [ ] `npm run build` - Build สำเร็จ
- [ ] `npm start` - เริ่ม production server ได้
- [ ] Production build ทำงานถูกต้อง
- [ ] Environment variables ถูกโหลด

---

## ✅ Final Checklist

### Before Production
- [ ] เปลี่ยนรหัสผ่าน Root
- [ ] ตั้งค่า JWT_SECRET ใหม่
- [ ] ตั้งค่า MONGO_ROOT_PASSWORD ใหม่
- [ ] ตั้งค่า Email service
- [ ] ตั้งค่า NEXT_PUBLIC_APP_URL
- [ ] ทดสอบทุก features
- [ ] ตรวจสอบ security
- [ ] Backup database
- [ ] Setup monitoring
- [ ] Setup logging

### Documentation
- [ ] README.md updated
- [ ] DEPLOYMENT-GUIDE.md complete
- [ ] API documentation (ถ้ามี)
- [ ] User manual (ถ้าต้องการ)

---

## 📊 Test Results

### Test Summary
- Total Tests: ___
- Passed: ___
- Failed: ___
- Skipped: ___

### Issues Found
1. 
2. 
3. 

### Notes
- 
- 
- 

---

**Tested By:** _______________  
**Date:** _______________  
**Version:** _______________
