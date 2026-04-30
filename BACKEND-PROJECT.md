# Backend API Documentation

โปรเจกต์นี้ใช้ **Next.js App Router** — API ทั้งหมดอยู่ใน `app/api/` และรันบน Node.js (PM2)  
Database: **MongoDB** | Auth: **JWT (HTTP-only Cookie)** | Email: **Nodemailer + Gmail**

---

## สรุปภาพรวม

| กลุ่ม | จำนวน Route | จำนวน Endpoint |
|---|---|---|
| Auth | 7 | 7 |
| Register100 | 4 | 8 |
| Register-Support | 4 | 8 |
| Certificates | 3 | 5 |
| Certificate Templates | 1 | 3 |
| Users | 4 | 7 |
| Draft | 7 | 9 |
| Consent | 2 | 2 |
| Registration Settings | 1 | 2 |
| Admin Utilities | 4 | 5 |
| Uploads / Health | 2 | 2 |
| **รวม** | **39** | **~63** |

---

## 1. Auth — การยืนยันตัวตน

| Method | Path | Auth | คำอธิบาย |
|---|---|---|---|
| POST | `/api/auth/admin-login` | Public | เข้าสู่ระบบสำหรับ Admin/DCP-Admin ตรวจสอบ role แล้วออก JWT cookie |
| POST | `/api/auth/login` | Public | เข้าสู่ระบบ legacy (ครู/โรงเรียน) ด้วย schoolId + password |
| POST | `/api/auth/teacher-login` | Public | เข้าสู่ระบบครูด้วย email + password ออก JWT cookie |
| POST | `/api/auth/logout` | Public | ลบ JWT cookie ออกจาก session |
| GET | `/api/auth/check` | Cookie | ตรวจสอบว่า session ยังใช้งานได้และ decode role |
| POST | `/api/auth/check-email` | Public | ตรวจสอบว่า email ครูมีในระบบหรือไม่ |
| POST | `/api/auth/request-password` | Public | ขอรหัสผ่านใหม่ผ่าน email (ส่ง OTP หรือ password ทาง Gmail) |

---

## 2. Register100 — โรงเรียนดนตรีไทย 100%

Collection: `register100_submissions`

| Method | Path | Auth | คำอธิบาย |
|---|---|---|---|
| POST | `/api/register100` | Public | สร้าง submission ใหม่ (โรงเรียนลงทะเบียน) |
| GET | `/api/register100/list` | Admin | ดึงรายการ submission ทั้งหมด พร้อม filter/pagination |
| GET | `/api/register100/[id]` | Admin/Teacher | ดึงข้อมูล submission ตาม ID |
| PUT | `/api/register100/[id]` | Admin/Teacher | อัปเดตข้อมูล submission (คะแนน, สถานะ, ข้อมูลโรงเรียน) |
| DELETE | `/api/register100/[id]` | Admin | ลบ submission |
| PATCH | `/api/register100/[id]` | Admin | อัปเดตบางส่วน (เช่น คะแนนรายหมวด) |
| GET | `/api/register100/[id]/export/excel` | Admin | Export ข้อมูลทั้งหมดเป็น CSV (UTF-8 BOM) |
| GET | `/api/register100/[id]/export/pdf` | Admin | Export ข้อมูลเป็น PDF |

---

## 3. Register-Support — โรงเรียนสนับสนุนและส่งเสริม

Collection: `register_support_submissions`

| Method | Path | Auth | คำอธิบาย |
|---|---|---|---|
| POST | `/api/register-support` | Public | สร้าง submission ใหม่ |
| GET | `/api/register-support/list` | Admin | ดึงรายการ submission ทั้งหมด พร้อม filter/pagination |
| GET | `/api/register-support/[id]` | Admin/Teacher | ดึงข้อมูล submission ตาม ID |
| PUT | `/api/register-support/[id]` | Admin/Teacher | อัปเดตข้อมูล submission |
| DELETE | `/api/register-support/[id]` | Admin | ลบ submission |
| PATCH | `/api/register-support/[id]` | Admin | อัปเดตบางส่วน |
| GET | `/api/register-support/[id]/export/excel` | Admin | Export ข้อมูลทั้งหมดเป็น CSV (UTF-8 BOM) |
| GET | `/api/register-support/[id]/export/pdf` | Admin | Export ข้อมูลเป็น PDF |

### เกณฑ์คะแนน Register100
| ระดับ | คะแนน |
|---|---|
| ระดับดีเด่น | 160 ขึ้นไป |
| ระดับดีมาก | 140–159 |
| ระดับดี | 120–139 |
| ระดับชมเชย | 100–119 |
| ต่ำกว่าเกณฑ์ | 0–99 |

### เกณฑ์คะแนน Register-Support
| ระดับ | คะแนน |
|---|---|
| ระดับดีเด่น | 144 ขึ้นไป |
| ระดับดีมาก | 126–143 |
| ระดับดี | 108–125 |
| ระดับชมเชย | 90–107 |
| ต่ำกว่าเกณฑ์ | 0–89 |

---

## 4. Certificates — ใบประกาศนียบัตร

Collection: `certificates`

| Method | Path | Auth | คำอธิบาย |
|---|---|---|---|
| GET | `/api/certificates` | Admin | ดึงรายการใบประกาศทั้งหมด |
| POST | `/api/certificates` | Admin | สร้างใบประกาศใหม่ พร้อม generate certificate number |
| GET | `/api/certificates/[id]` | Public | ดึงข้อมูลใบประกาศตาม ID (ใช้แสดงหน้า verify) |
| PUT | `/api/certificates/[id]` | Admin | อัปเดตข้อมูลใบประกาศ |
| DELETE | `/api/certificates/[id]` | Admin | ลบใบประกาศ |

---

## 5. Certificate Templates — Template ใบประกาศ

Collection: `certificate_templates` | ไฟล์รูป: `public/certificates/templates/`

| Method | Path | Auth | คำอธิบาย |
|---|---|---|---|
| GET | `/api/certificate-templates` | Admin | ดึงรายการ template ทั้งหมด |
| POST | `/api/certificate-templates` | Admin | อัปโหลด template ใหม่ (multipart/form-data, รองรับ PNG/JPG สูงสุด 10MB) |
| DELETE | `/api/certificate-templates` | Admin | ลบ template ตาม `?id=` พร้อมลบไฟล์รูปออกจาก disk |

---

## 6. Users — ผู้ใช้งานระบบ Admin

Collection: `users`

| Method | Path | Auth | คำอธิบาย |
|---|---|---|---|
| GET | `/api/users` | Admin | ดึงรายการ user ทั้งหมด |
| POST | `/api/users` | Admin | สร้าง user ใหม่ พร้อมส่ง email แจ้ง credentials |
| GET | `/api/users/[id]` | Admin | ดึงข้อมูล user ตาม ID |
| PUT | `/api/users/[id]` | Admin | อัปเดตข้อมูล user (ชื่อ, role, สถานะ) |
| DELETE | `/api/users/[id]` | Admin | ลบ user |
| POST | `/api/users/[id]/resend-credentials` | Admin | ส่ง email credentials ซ้ำให้ user |
| POST | `/api/users/[id]/reset-password` | Admin | Reset password และส่ง email แจ้ง |

---

## 7. Draft — บันทึกร่างแบบฟอร์ม

Collection: `drafts` | ใช้ token-based access (ไม่ต้องล็อกอิน)

| Method | Path | Auth | คำอธิบาย |
|---|---|---|---|
| POST | `/api/draft/save` | Public | บันทึก draft ใหม่ คืน token สำหรับเข้าถึงในภายหลัง |
| GET | `/api/draft/[token]` | Token | ดึงข้อมูล draft ตาม token |
| PUT | `/api/draft/[token]` | Token | อัปเดตข้อมูล draft |
| DELETE | `/api/draft/[token]` | Token | ลบ draft |
| GET | `/api/draft/[token]/data` | Token | ดึงเฉพาะ form data ของ draft |
| POST | `/api/draft/[token]/request-otp` | Token | ขอ OTP ส่งไปยัง email ของครู |
| POST | `/api/draft/[token]/verify-otp` | Token | ยืนยัน OTP |
| POST | `/api/draft/[token]/submit` | Token (OTP verified) | Submit draft เป็น submission จริง |
| POST | `/api/draft/upload-image` | Public | อัปโหลดรูปภาพสำหรับ draft (multipart/form-data) |
| POST | `/api/draft/cleanup-images` | Public | ลบรูปภาพ draft ที่ไม่ได้ใช้งาน |

---

## 8. Consent — การยินยอมข้อมูลส่วนบุคคล (PDPA)

Collection: `consents`

| Method | Path | Auth | คำอธิบาย |
|---|---|---|---|
| POST | `/api/consent/check` | Public | ตรวจสอบว่า email นี้เคยให้ consent แล้วหรือยัง |
| POST | `/api/consent/save` | Public | บันทึก consent พร้อม timestamp และ IP |

---

## 9. Registration Settings — ควบคุมการเปิด/ปิดรับสมัคร

Collection: `registration_settings`

| Method | Path | Auth | คำอธิบาย |
|---|---|---|---|
| GET | `/api/registration-settings` | Public | ดึงสถานะการเปิด/ปิดรับสมัคร (register100, register-support) |
| PUT | `/api/registration-settings` | DCP-Admin | เปิด/ปิดการรับสมัครแต่ละประเภท |

---

## 10. Admin Utilities — เครื่องมือ Admin

| Method | Path | Auth | คำอธิบาย |
|---|---|---|---|
| POST | `/api/admin/setup` | Bearer Token | ตั้งค่าระบบครั้งแรก (สร้าง indexes, default settings) |
| POST | `/api/admin/create-super-admin` | Bearer Token | สร้าง super admin account (deprecated — ใช้ setup แทน) |
| POST | `/api/admin/migrate-data` | Bearer Token | Migrate ข้อมูลจาก schema เก่าไปใหม่ |
| GET | `/api/admin/email-status` | Admin | ตรวจสอบสถานะ Gmail SMTP connection |

---

## 11. Uploads & Health

| Method | Path | Auth | คำอธิบาย |
|---|---|---|---|
| GET | `/api/uploads/[...path]` | Public | Serve static files จาก `public/uploads/` (รูปภาพ draft) |
| GET | `/api/health` | Public | Health check — คืน `{ status: "ok" }` สำหรับ monitoring |

---

## Auth Roles

| Role | สิทธิ์ |
|---|---|
| `root` / `super_admin` | เข้าถึงได้ทุก endpoint รวมถึง DCP-Admin |
| `admin` | จัดการ register100, register-support, certificates, users |
| `dcp_admin` | จัดการ registration-settings, certificates, users |
| `teacher` | ดู/แก้ไข submission ของโรงเรียนตัวเอง |
| Public | register, draft, consent, health, check-email |

---

## Environment Variables ที่จำเป็น

```env
MONGODB_URI=mongodb://...
MONGO_DB=thai_music_school
JWT_SECRET=...
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
NEXT_PUBLIC_APP_URL=https://dcpschool100.net
```

---

## Tech Stack

- **Runtime**: Next.js 14 App Router (Node.js)
- **Database**: MongoDB (native driver `mongodb`)
- **Auth**: JWT stored in HTTP-only cookie
- **Email**: Nodemailer + Gmail SMTP (App Password)
- **File Storage**: Local disk (`public/certificates/templates/`, `public/uploads/`)
- **Process Manager**: PM2
- **Deployment**: Ubuntu Server + Nginx reverse proxy + Cloudflare
