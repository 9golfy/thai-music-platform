# Thai Music Platform — Website Sitemap

**Domain**: https://dcpschool100.net  
**Last Updated**: July 27, 2026  
**Framework**: Next.js 16 (App Router)

---

## Table of Contents

1. [Public Pages (Front-end)](#1-public-pages-front-end)
2. [Teacher Portal](#2-teacher-portal)
3. [School Admin Dashboard](#3-school-admin-dashboard)
4. [DCP Admin Dashboard](#4-dcp-admin-dashboard)
5. [Authentication Pages](#5-authentication-pages)
6. [API Endpoints](#6-api-endpoints)
7. [Dynamic Routes](#7-dynamic-routes)

---

## 1. Public Pages (Front-end)

### 1.1 Main Pages

| URL | File Path | Description | Access |
|-----|-----------|-------------|--------|
| `/` | `app/(front)/page.tsx` | หน้าแรก — แนะนำโครงการ | Public |
| `/about` | `app/(front)/about/page.tsx` | เกี่ยวกับโครงการ | Public |
| `/certificate` | `app/(front)/certificate/page.tsx` | ตรวจสอบใบประกาศนียบัตร | Public |
| `/contract` | `app/(front)/contract/page.tsx` | สัญญาและข้อตกลง | Public |
| `/download` | `app/(front)/download/page.tsx` | ดาวน์โหลดเอกสาร | Public |
| `/regist-activities` | `app/(front)/regist-activities/page.tsx` | กิจกรรมการลงทะเบียน | Public |

### 1.2 Registration Pages

| URL | File Path | Description | Access |
|-----|-----------|-------------|--------|
| `/regist100` | `app/(front)/regist100/page.tsx` | ลงทะเบียนโรงเรียนดนตรีไทย 100% | Public |
| `/regist-support` | `app/(front)/regist-support/page.tsx` | ลงทะเบียนโรงเรียนสนับสนุนและส่งเสริม | Public |
| `/draft/[token]` | `app/(front)/draft/[token]/page.tsx` | แบบฟอร์มร่าง (Draft Mode) | Public with Token |

**Registration Features**:
- Multi-step form (8 steps)
- Draft save functionality
- OTP verification before submit
- PDPA consent required

---

## 2. Teacher Portal

**Base Path**: `/teacher`  
**Role Required**: `teacher`

| URL | File Path | Description | Access |
|-----|-----------|-------------|--------|
| `/teacher/dashboard` | `app/(teacher)/teacher/dashboard/page.tsx` | แดชบอร์ดครู — ภาพรวมข้อมูลโรงเรียน | Teacher |
| `/teacher/school-info` | `app/(teacher)/teacher/school-info/page.tsx` | ข้อมูลโรงเรียน | Teacher |
| `/teacher/certificate` | `app/(teacher)/teacher/certificate/page.tsx` | ใบประกาศนียบัตร | Teacher |
| `/teacher/dashboard/register100/[id]` | `app/(teacher)/teacher/dashboard/register100/[id]/page.tsx` | รายละเอียดลงทะเบียน Register100 | Teacher |
| `/teacher/dashboard/register-support/[id]` | `app/(teacher)/teacher/dashboard/register-support/[id]/page.tsx` | รายละเอียดลงทะเบียน Register-Support | Teacher |

**Teacher Portal Features**:
- View school registration data
- Check registration status
- View and download certificates
- Update school information

---

## 3. School Admin Dashboard

**Base Path**: `/dashboard`  
**Role Required**: `admin`

### 3.1 Main Dashboard

| URL | File Path | Description | Access |
|-----|-----------|-------------|--------|
| `/dashboard` | `app/(admin)/dashboard/page.tsx` | แดshบอร์ดภาพรวม — สถิติและข้อมูลโรงเรียนในสังกัด | Admin |
| `/dashboard/allschools` | `app/(admin)/dashboard/allschools/page.tsx` | รายชื่อโรงเรียนทั้งหมด | Admin |
| `/dashboard/members` | `app/(admin)/dashboard/members/page.tsx` | รายชื่อสมาชิก/ครู | Admin |

### 3.2 Registration Management

| URL | File Path | Description | Access |
|-----|-----------|-------------|--------|
| `/dashboard/register100` | `app/(admin)/dashboard/register100/page.tsx` | จัดการลงทะเบียน Register100 | Admin |
| `/dashboard/register100/[id]` | `app/(admin)/dashboard/register100/[id]/page.tsx` | ดูรายละเอียดและแก้ไขลงทะเบียน Register100 | Admin |
| `/dashboard/register-support` | `app/(admin)/dashboard/register-support/page.tsx` | จัดการลงทะเบียน Register-Support | Admin |
| `/dashboard/register-support/[id]` | `app/(admin)/dashboard/register-support/[id]/page.tsx` | ดูรายละเอียดและแก้ไขลงทะเบียน Register-Support | Admin |
| `/dashboard/schools/[id]` | `app/(admin)/dashboard/schools/[id]/page.tsx` | ดูข้อมูลโรงเรียนตาม School ID | Admin |

**Admin Features**:
- View registrations in their jurisdiction
- Edit registration data
- Score management (Part 1 auto-calculated, Part 2 manual entry)
- Export to CSV with detailed scores
- Filter by province, level, grade

---

## 4. DCP Admin Dashboard

**Base Path**: `/dcp-admin/dashboard`  
**Role Required**: `super_admin` or `root`

### 4.1 Main Dashboard

| URL | File Path | Description | Access |
|-----|-----------|-------------|--------|
| `/dcp-admin` | `app/(admin)/dcp-admin/page.tsx` | เข้าสู่ระบบ DCP Admin | Public (Login) |
| `/dcp-admin/dashboard` | `app/(admin)/dcp-admin/dashboard/page.tsx` | แดshบอร์ดหลัก DCP — ภาพรวมระบบทั้งหมด | Super Admin |
| `/dcp-admin/dashboard/drafts` | `app/(admin)/dcp-admin/dashboard/drafts/page.tsx` | จัดการ Draft Submissions | Super Admin |

### 4.2 Registration Management (Full Access)

| URL | File Path | Description | Access |
|-----|-----------|-------------|--------|
| `/dcp-admin/dashboard/register100` | `app/(admin)/dcp-admin/dashboard/register100/page.tsx` | จัดการลงทะเบียน Register100 (ทั้งหมด) | Super Admin |
| `/dcp-admin/dashboard/register100/[id]` | `app/(admin)/dcp-admin/dashboard/register100/[id]/page.tsx` | ดูและแก้ไขลงทะเบียน Register100 | Super Admin |
| `/dcp-admin/dashboard/register-support` | `app/(admin)/dcp-admin/dashboard/register-support/page.tsx` | จัดการลงทะเบียน Register-Support (ทั้งหมด) | Super Admin |
| `/dcp-admin/dashboard/register-support/[id]` | `app/(admin)/dcp-admin/dashboard/register-support/[id]/page.tsx` | ดูและแก้ไขลงทะเบียน Register-Support | Super Admin |

### 4.3 Registration Control

| URL | File Path | Description | Access |
|-----|-----------|-------------|--------|
| `/dcp-admin/dashboard/registration-control` | `app/(admin)/dcp-admin/dashboard/registration-control/page.tsx` | เปิด/ปิดรับสมัคร Register100 และ Register-Support | Super Admin |

### 4.4 User Management

| URL | File Path | Description | Access |
|-----|-----------|-------------|--------|
| `/dcp-admin/dashboard/users` | `app/(admin)/dcp-admin/dashboard/users/page.tsx` | จัดการผู้ใช้งานระบบ | Super Admin |
| `/dcp-admin/dashboard/users/create` | `app/(admin)/dcp-admin/dashboard/users/create/page.tsx` | สร้างผู้ใช้งานใหม่ | Super Admin |
| `/dcp-admin/dashboard/users/[id]` | `app/(admin)/dcp-admin/dashboard/users/[id]/page.tsx` | แก้ไขข้อมูลผู้ใช้งาน | Super Admin |

### 4.5 Certificate Management

| URL | File Path | Description | Access |
|-----|-----------|-------------|--------|
| `/dcp-admin/dashboard/certificates` | `app/(admin)/dcp-admin/dashboard/certificates/page.tsx` | จัดการใบประกาศนียบัตร | Super Admin |
| `/dcp-admin/dashboard/certificates/create` | `app/(admin)/dcp-admin/dashboard/certificates/create/page.tsx` | สร้างใบประกาศนียบัตรใหม่ | Super Admin |
| `/dcp-admin/dashboard/certificates/[id]` | `app/(admin)/dcp-admin/dashboard/certificates/[id]/page.tsx` | แก้ไขใบประกาศนียบัตร | Super Admin |

**DCP Admin Features**:
- Full system access
- User management (create admin, teacher accounts)
- Certificate generation and management
- Registration control (open/close)
- View all registrations nationwide
- System settings

---

## 5. Authentication Pages

| URL | File Path | Description | Access |
|-----|-----------|-------------|--------|
| `/login` | `app/(admin)/login/page.tsx` | เข้าสู่ระบบสำหรับ Admin | Public |
| `/teacher-login` | `app/(front)/teacher-login/page.tsx` | เข้าสู่ระบบสำหรับครู | Public |
| `/forgetpassword` | `app/(admin)/forgetpassword/page.tsx` | ขอรหัสผ่านใหม่ | Public |
| `/request-password` | `app/(front)/request-password/page.tsx` | ขอรหัสผ่าน (Teacher) | Public |

**Authentication Features**:
- Role-based login (admin, teacher)
- Password reset functionality
- Session management
- Protected routes with middleware

---

## 6. API Endpoints

### 6.1 Authentication APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login สำหรับ Admin |
| `/api/auth/admin-login` | POST | Login สำหรับ Super Admin |
| `/api/auth/teacher-login` | POST | Login สำหรับครู |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/check` | GET | ตรวจสอบ session |
| `/api/auth/check-email` | POST | ตรวจสอบอีเมลซ้ำ |
| `/api/auth/request-password` | POST | ขอรหัสผ่านใหม่ |

### 6.2 Registration APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/register100` | POST | สร้างลงทะเบียน Register100 |
| `/api/register100` | GET | ดึงรายการลงทะเบียน Register100 |
| `/api/register100/[id]` | GET | ดึงข้อมูลลงทะเบียนตาม ID |
| `/api/register100/[id]` | PUT | แก้ไขลงทะเบียน |
| `/api/register100/[id]` | DELETE | ลบลงทะเบียน (Hard Delete) |
| `/api/register100/[id]/export/excel` | GET | Export Excel (ไม่ใช้งาน — ใช้ client-side แทน) |
| `/api/register100/[id]/export/pdf` | GET | Export PDF |
| `/api/register100/list` | GET | ดึงรายการสำหรับ Admin Dashboard |
| | | |
| `/api/register-support` | POST | สร้างลงทะเบียน Register-Support |
| `/api/register-support` | GET | ดึงรายการลงทะเบียน Register-Support |
| `/api/register-support/[id]` | GET | ดึงข้อมูลลงทะเบียนตาม ID |
| `/api/register-support/[id]` | PUT | แก้ไขลงทะเบียน |
| `/api/register-support/[id]` | DELETE | ลบลงทะเบียน (Hard Delete) |
| `/api/register-support/[id]/export/excel` | GET | Export Excel (ไม่ใช้งาน — ใช้ client-side แทน) |
| `/api/register-support/[id]/export/pdf` | GET | Export PDF |
| `/api/register-support/list` | GET | ดึงรายการสำหรับ Admin Dashboard |

**Score Management**:
- Normal Edit: `PUT /api/register-support/[id]` — คำนวณคะแนน Part 1 ใหม่, เก็บ Part 2
- Manual Edit: `PUT /api/register-support/[id]?manualEdit=true` — เก็บคะแนนทั้งหมดไว้

### 6.3 Draft APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/draft/save` | POST | บันทึกร่างแบบฟอร์ม |
| `/api/draft/[token]` | GET | ดึงข้อมูลร่าง |
| `/api/draft/[token]/data` | GET | ดึงข้อมูล formData |
| `/api/draft/[token]/request-otp` | POST | ขอ OTP สำหรับ submit |
| `/api/draft/[token]/verify-otp` | POST | ยืนยัน OTP |
| `/api/draft/[token]/submit` | POST | Submit แบบฟอร์มหลังยืนยัน OTP |
| `/api/draft/upload-image` | POST | Upload รูปภาพ (draft-images) |
| `/api/draft/cleanup-images` | POST, DELETE | ลบรูปภาพเก่า |
| `/api/draft/clear-all` | DELETE | ลบ draft ทั้งหมด (admin only) |
| `/api/draft/debug/latest` | GET | ดึง draft ล่าสุด (debug) |

**Draft Features**:
- Auto-save every step
- 7-day expiration
- OTP verification before submit
- Rate limiting (5 saves/hour, 3 OTP requests/hour)
- Image upload and cleanup

### 6.4 User Management APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | ดึงรายการผู้ใช้ |
| `/api/users` | POST | สร้างผู้ใช้ใหม่ |
| `/api/users/[id]` | GET | ดึงข้อมูลผู้ใช้ตาม ID |
| `/api/users/[id]` | PUT | แก้ไขข้อมูลผู้ใช้ |
| `/api/users/[id]` | DELETE | ลบผู้ใช้ |
| `/api/users/[id]/reset-password` | POST | รีเซ็ตรหัสผ่าน |
| `/api/users/[id]/resend-credentials` | POST | ส่งข้อมูล login ใหม่ทาง email |

### 6.5 Certificate APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/certificates` | GET | ดึงรายการใบประกาศ |
| `/api/certificates` | POST | สร้างใบประกาศใหม่ |
| `/api/certificates/[id]` | GET | ดึงข้อมูลใบประกาศตาม ID |
| `/api/certificates/[id]` | PUT | แก้ไขใบประกาศ |
| `/api/certificates/[id]` | DELETE | ลบใบประกาศ |
| `/api/certificates/[certificateNumber]` | GET | ตรวจสอบใบประกาศจากเลขที่ |
| `/api/certificate-templates` | GET | ดึงรายการ templates |
| `/api/certificate-templates` | POST | สร้าง template ใหม่ |
| `/api/certificate-templates` | PUT | แก้ไข template |
| `/api/certificate-templates` | DELETE | ลบ template |

### 6.6 System & Settings APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/registration-settings` | GET | ดึงสถานะเปิด/ปิดรับสมัคร |
| `/api/registration-settings` | PUT | แก้ไขสถานะเปิด/ปิดรับสมัคร |
| `/api/consent/check` | POST | ตรวจสอบ PDPA consent |
| `/api/consent/save` | POST | บันทึก PDPA consent |
| `/api/health` | GET | ตรวจสอบสถานะระบบ |
| `/api/email-preview` | POST | Preview email template |
| `/api/uploads/[...path]` | GET | Serve uploaded files |

### 6.7 Admin Utilities APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/setup` | POST | Setup ระบบครั้งแรก |
| `/api/admin/create-super-admin` | POST | สร้าง Super Admin |
| `/api/admin/migrate-data` | POST | Migration scripts |
| `/api/admin/email-status` | GET | ตรวจสอบสถานะ email service |

### 6.8 Debug APIs (Development Only)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/debug/get-otp` | GET | ดึง OTP สำหรับ testing |
| `/api/debug/check-otp-status` | GET | ตรวจสอบสถานะ OTP |
| `/api/debug/reset-rate-limit` | POST | รีเซ็ต rate limit |
| `/api/debug/clear-storage` | POST | ล้างข้อมูล session storage |

---

## 7. Dynamic Routes

### 7.1 Dynamic Parameters

| Route Pattern | Parameter | Description | Example |
|---------------|-----------|-------------|---------|
| `/draft/[token]` | `token` | Draft UUID token | `/draft/abc-123-def` |
| `/register100/[id]` | `id` | MongoDB ObjectId | `/register100/507f1f77bcf86cd799439011` |
| `/register-support/[id]` | `id` | MongoDB ObjectId | `/register-support/507f1f77bcf86cd799439011` |
| `/schools/[id]` | `id` | School ID | `/schools/DCP-0001` |
| `/users/[id]` | `id` | User MongoDB ObjectId | `/users/507f1f77bcf86cd799439011` |
| `/certificates/[id]` | `id` | Certificate ID or Number | `/certificates/CERT-2569-...` |
| `/api/uploads/[...path]` | `path` | File path array | `/api/uploads/mgt/image.jpg` |

### 7.2 Query Parameters

#### Registration APIs
- `?manualEdit=true` — Manual edit mode (preserve scores)
- `?page=1&limit=10` — Pagination
- `?province=กรุงเทพมหานคร` — Filter by province
- `?level=ประถมศึกษา` — Filter by education level
- `?grade=A` — Filter by grade

#### Draft APIs
- `?email=teacher@example.com` — Check existing draft by email
- `?submissionType=register100` — Filter by registration type

---

## 8. Access Control Matrix

| Role | Access Level | Permissions |
|------|--------------|-------------|
| **Public** | Guest | View public pages, register, check certificate |
| **Teacher** | Authenticated | View own school data, manage registration, view certificates |
| **Admin** | Authenticated | Manage registrations in jurisdiction, view reports, export data |
| **Super Admin** | Full Access | All admin permissions + user management + system settings |
| **Root** | System | All permissions + database access + system configuration |

---

## 9. Route Groups (Next.js App Router)

| Route Group | Base Path | Layout | Auth Required |
|-------------|-----------|--------|---------------|
| `(front)` | `/` | Public layout | No |
| `(teacher)` | `/teacher` | Teacher layout | Yes (teacher) |
| `(admin)` | `/dashboard`, `/dcp-admin` | Admin layout | Yes (admin/super_admin) |
| `api` | `/api` | API routes | Varies |

---

## 10. File Upload Paths

| Upload Type | Storage Path | Public URL |
|-------------|--------------|------------|
| Management Images | `/public/uploads/mgt/` | `/uploads/mgt/` |
| Teacher Images | `/public/uploads/teachers/` | `/uploads/teachers/` |
| Draft Images | `/public/draft-images/` | `/draft-images/` |
| Certificate Templates | `/public/certificates/templates/` | `/certificates/templates/` |
| Certificate Images | `/public/certificates/` | `/certificates/` |

**Cleanup**:
- Draft images auto-cleanup after 7 days
- Unused uploads flagged for manual review

---

## 11. External Links & Resources

| Resource | URL | Description |
|----------|-----|-------------|
| Google Drive | User provided links | Photo galleries, evidence links |
| YouTube | User provided links | Video submissions (2 videos per school) |
| Facebook | User provided links | PR activities evidence |
| TikTok | User provided links | PR activities evidence |

---

## 12. SEO & Metadata

### Static Pages
- Each page has custom title and description
- Open Graph tags for social sharing
- Structured data for rich snippets

### Generated Sitemap
- Auto-generated from Next.js routes
- XML sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`

---

## 13. Navigation Structure

### Public Navigation
```
Home (/)
├── About (/about)
├── Register
│   ├── Register 100% (/regist100)
│   └── Register Support (/regist-support)
├── Certificate (/certificate)
├── Download (/download)
├── Contract (/contract)
└── Login
    ├── Admin Login (/login)
    └── Teacher Login (/teacher-login)
```

### Teacher Navigation
```
Teacher Dashboard (/teacher/dashboard)
├── School Info (/teacher/school-info)
├── Certificate (/teacher/certificate)
└── Registration Details
    ├── Register100 Details (/teacher/dashboard/register100/[id])
    └── Register-Support Details (/teacher/dashboard/register-support/[id])
```

### School Admin Navigation
```
Admin Dashboard (/dashboard)
├── All Schools (/dashboard/allschools)
├── Members (/dashboard/members)
├── Register100 Management (/dashboard/register100)
│   └── Details & Edit (/dashboard/register100/[id])
└── Register-Support Management (/dashboard/register-support)
    └── Details & Edit (/dashboard/register-support/[id])
```

### DCP Admin Navigation
```
DCP Admin Dashboard (/dcp-admin/dashboard)
├── Registration Control (/dcp-admin/dashboard/registration-control)
├── Register100 (All) (/dcp-admin/dashboard/register100)
├── Register-Support (All) (/dcp-admin/dashboard/register-support)
├── Drafts Management (/dcp-admin/dashboard/drafts)
├── User Management (/dcp-admin/dashboard/users)
│   ├── Create User (/dcp-admin/dashboard/users/create)
│   └── Edit User (/dcp-admin/dashboard/users/[id])
└── Certificate Management (/dcp-admin/dashboard/certificates)
    ├── Create Certificate (/dcp-admin/dashboard/certificates/create)
    └── Edit Certificate (/dcp-admin/dashboard/certificates/[id])
```

---

## 14. Mobile Responsiveness

All pages are responsive and optimized for:
- Desktop (1920px+)
- Laptop (1366px - 1920px)
- Tablet (768px - 1365px)
- Mobile (320px - 767px)

---

## 15. Performance Features

- Server-Side Rendering (SSR) for dynamic content
- Static Generation for public pages
- Image optimization with Next.js Image component
- Route prefetching
- Code splitting per route
- Edge caching for static assets

---

## 16. Security Features

- Role-based access control (RBAC)
- JWT session tokens
- CSRF protection
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- SQL injection prevention (MongoDB)
- XSS protection
- Secure headers (helmet)

---

## 17. Monitoring & Analytics

- Health check endpoint: `/api/health`
- Error tracking: MongoDB logs
- Performance monitoring: Next.js analytics
- User activity logs: Database audit trails

---

**End of Sitemap**

For technical documentation, see:
- `DATABASE-DESIGN.md` — Database schema
- `DATA-DICTIONARY-LATEST.md` — Complete data dictionary
- `API-DOCUMENTATION.md` — API reference (if exists)

**Contact**: [Project Administrator]  
**Version**: 1.0.0  
**Last Review**: July 27, 2026
