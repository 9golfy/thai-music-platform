# Thai Music Platform — Complete Website Sitemap

**Domain**: https://dcpschool100.net  
**Version**: 2.0.0  
**Last Updated**: July 28, 2026  
**Framework**: Next.js 16 (App Router)

---

## สารบัญ

1. [Overview](#1-overview)
2. [Site Architecture](#2-site-architecture)
3. [Front Office (Public)](#3-front-office-public)
4. [Teacher Portal](#4-teacher-portal)
5. [School Admin Dashboard](#5-school-admin-dashboard)
6. [DCP Admin Dashboard](#6-dcp-admin-dashboard)
7. [Authentication Pages](#7-authentication-pages)
8. [Mermaid Sitemap Diagrams](#8-mermaid-sitemap-diagrams)
9. [Route Groups & Layouts](#9-route-groups--layouts)
10. [Access Control Matrix](#10-access-control-matrix)

---

## 1. Overview

### 1.1 System Summary

- **Total Pages**: 50+ pages
- **User Roles**: 4 (Public, Teacher, Admin, Super Admin)
- **Main Features**: Registration, Dashboard, Certificate, User Management
- **Languages**: Thai (primary), English (UI labels)

### 1.2 Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 18, TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Database | MongoDB 7.0 |
| Auth | Session-based (JWT cookies) |
| Deployment | Production Server (root@041034-U) |

---

## 2. Site Architecture

### 2.1 High-Level Structure

```
dcpschool100.net
├── / (Public Pages)
├── /teacher (Teacher Portal)
├── /dashboard (School Admin)
├── /dcp-admin (DCP Admin)
└── /api (API Routes)
```

### 2.2 Route Groups (Next.js)

| Route Group | Path Pattern | Layout | Auth |
|-------------|--------------|--------|------|
| `(front)` | `/`, `/regist100`, etc. | Public Layout | None |
| `(teacher)` | `/teacher/*` | Teacher Layout | Teacher |
| `(admin)` | `/dashboard/*`, `/dcp-admin/*` | Admin Layout | Admin+ |
| `api` | `/api/*` | No Layout | Varies |

---

## 3. Front Office (Public)

### 3.1 Main Navigation Pages


| URL | File Path | Description | Features |
|-----|-----------|-------------|----------|
| `/` | `app/(front)/page.tsx` | หน้าแรก | Hero, About, CTA |
| `/about` | `app/(front)/about/page.tsx` | เกี่ยวกับโครงการ | Project info, Goals |
| `/certificate` | `app/(front)/certificate/page.tsx` | ตรวจสอบใบประกาศนียบัตร | Search by cert number |
| `/contract` | `app/(front)/contract/page.tsx` | สัญญาและข้อตกลง | Terms, PDPA |
| `/download` | `app/(front)/download/page.tsx` | ดาวน์โหลดเอกสาร | PDF downloads |
| `/regist-activities` | `app/(front)/regist-activities/page.tsx` | กิจกรรมการลงทะเบียน | Activities list |

### 3.2 Registration Pages

| URL | File Path | Description | Steps |
|-----|-----------|-------------|-------|
| `/regist100` | `app/(front)/regist100/page.tsx` | ลงทะเบียนโรงเรียน 100% | 9 steps |
| `/regist-support` | `app/(front)/regist-support/page.tsx` | ลงทะเบียนสนับสนุนฯ | 9 steps |
| `/draft/[token]` | `app/(front)/draft/[token]/page.tsx` | แบบฟอร์มร่าง (Draft) | Resume form |

**Registration Features**:
- ✅ Multi-step form (9 steps)
- ✅ Auto-save draft
- ✅ Image upload (Manager + Teachers)
- ✅ OTP verification
- ✅ PDPA consent
- ✅ Score auto-calculation

### 3.3 Authentication Pages (Public Access)

| URL | File Path | Description |
|-----|-----------|-------------|
| `/teacher-login` | `app/(front)/teacher-login/page.tsx` | เข้าสู่ระบบครู |
| `/request-password` | `app/(front)/request-password/page.tsx` | ขอรหัสผ่านใหม่ (Teacher) |

---

## 4. Teacher Portal

**Base URL**: `/teacher`  
**Auth Required**: `teacher` role  
**Layout**: `app/(teacher)/layout.tsx`

### 4.1 Pages

| URL | File Path | Description | Features |
|-----|-----------|-------------|----------|
| `/teacher/dashboard` | `app/(teacher)/teacher/dashboard/page.tsx` | แดshบอร์ดครู | Overview, Stats |
| `/teacher/school-info` | `app/(teacher)/teacher/school-info/page.tsx` | ข้อมูลโรงเรียน | School details |
| `/teacher/certificate` | `app/(teacher)/teacher/certificate/page.tsx` | ใบประกาศนียบัตร | View, Download |

### 4.2 Registration Details

| URL | Description |
|-----|-------------|
| `/teacher/dashboard/register100/[id]` | รายละเอียดลงทะเบียน Register100 |
| `/teacher/dashboard/register-support/[id]` | รายละเอียดลงทะเบียน Register-Support |

### 4.3 Teacher Features

- ✅ View own school registration
- ✅ Check submission status
- ✅ View scores (Part 1 + Part 2)
- ✅ Download certificates
- ❌ Cannot edit after submission

---

## 5. School Admin Dashboard

**Base URL**: `/dashboard`  
**Auth Required**: `admin` role  
**Layout**: `app/(admin)/dashboard/layout.tsx`

### 5.1 Main Pages

| URL | File Path | Description |
|-----|-----------|-------------|
| `/dashboard` | `app/(admin)/dashboard/page.tsx` | แดshบอร์ดภาพรวม |
| `/dashboard/allschools` | `app/(admin)/dashboard/allschools/page.tsx` | รายชื่อโรงเรียนทั้งหมด |
| `/dashboard/members` | `app/(admin)/dashboard/members/page.tsx` | รายชื่อสมาชิก/ครู |

### 5.2 Registration Management

| URL | File Path | Description |
|-----|-----------|-------------|
| `/dashboard/register100` | `app/(admin)/dashboard/register100/page.tsx` | จัดการลงทะเบียน Register100 |
| `/dashboard/register100/[id]` | `app/(admin)/dashboard/register100/[id]/page.tsx` | แก้ไขลงทะเบียน Register100 |
| `/dashboard/register-support` | `app/(admin)/dashboard/register-support/page.tsx` | จัดการลงทะเบียน Register-Support |
| `/dashboard/register-support/[id]` | `app/(admin)/dashboard/register-support/[id]/page.tsx` | แก้ไขลงทะเบียน Register-Support |

### 5.3 School Details

| URL | Description |
|-----|-------------|
| `/dashboard/schools/[id]` | ข้อมูลโรงเรียนตาม School ID |

### 5.4 Admin Features

- ✅ View registrations in jurisdiction (by province)
- ✅ Edit registration data
- ✅ Update Part 2 scores (video scores)
- ✅ Export to CSV
- ✅ Filter by province, level, grade
- ❌ Cannot delete registrations

---

## 6. DCP Admin Dashboard

**Base URL**: `/dcp-admin`  
**Auth Required**: `super_admin` or `root` role  
**Layout**: `app/(admin)/dcp-admin/dashboard/layout.tsx`


### 6.1 Login & Main Dashboard

| URL | File Path | Description |
|-----|-----------|-------------|
| `/dcp-admin` | `app/(admin)/dcp-admin/page.tsx` | หน้า Login DCP Admin |
| `/dcp-admin/dashboard` | `app/(admin)/dcp-admin/dashboard/page.tsx` | แดshบอร์ดหลัก DCP |
| `/dcp-admin/dashboard/drafts` | `app/(admin)/dcp-admin/dashboard/drafts/page.tsx` | จัดการ Draft Submissions |

### 6.2 Registration Management (Full Access)

| URL | File Path | Description |
|-----|-----------|-------------|
| `/dcp-admin/dashboard/register100` | `app/(admin)/dcp-admin/dashboard/register100/page.tsx` | จัดการ Register100 (ทั้งหมด) |
| `/dcp-admin/dashboard/register100/[id]` | `app/(admin)/dcp-admin/dashboard/register100/[id]/page.tsx` | แก้ไข Register100 |
| `/dcp-admin/dashboard/register-support` | `app/(admin)/dcp-admin/dashboard/register-support/page.tsx` | จัดการ Register-Support (ทั้งหมด) |
| `/dcp-admin/dashboard/register-support/[id]` | `app/(admin)/dcp-admin/dashboard/register-support/[id]/page.tsx` | แก้ไข Register-Support |

### 6.3 Registration Control

| URL | File Path | Description |
|-----|-----------|-------------|
| `/dcp-admin/dashboard/registration-control` | `app/(admin)/dcp-admin/dashboard/registration-control/page.tsx` | เปิด/ปิดรับสมัคร |

### 6.4 User Management

| URL | File Path | Description |
|-----|-----------|-------------|
| `/dcp-admin/dashboard/users` | `app/(admin)/dcp-admin/dashboard/users/page.tsx` | จัดการผู้ใช้งาน |
| `/dcp-admin/dashboard/users/create` | `app/(admin)/dcp-admin/dashboard/users/create/page.tsx` | สร้างผู้ใช้งานใหม่ |
| `/dcp-admin/dashboard/users/[id]` | `app/(admin)/dcp-admin/dashboard/users/[id]/page.tsx` | แก้ไขข้อมูลผู้ใช้ |

### 6.5 Certificate Management

| URL | File Path | Description |
|-----|-----------|-------------|
| `/dcp-admin/dashboard/certificates` | `app/(admin)/dcp-admin/dashboard/certificates/page.tsx` | จัดการใบประกาศนียบัตร |
| `/dcp-admin/dashboard/certificates/create` | `app/(admin)/dcp-admin/dashboard/certificates/create/page.tsx` | สร้างใบประกาศนียบัตร |
| `/dcp-admin/dashboard/certificates/[id]` | `app/(admin)/dcp-admin/dashboard/certificates/[id]/page.tsx` | แก้ไขใบประกาศนียบัตร |

### 6.6 DCP Admin Features

- ✅ Full system access
- ✅ View all registrations nationwide
- ✅ User management (create, edit, delete)
- ✅ Certificate generation
- ✅ Registration control (open/close)
- ✅ System settings
- ✅ Delete registrations

---

## 7. Authentication Pages

### 7.1 Login Pages

| URL | File Path | For | Features |
|-----|-----------|-----|----------|
| `/login` | `app/(admin)/login/page.tsx` | Admin | Username/Password |
| `/teacher-login` | `app/(front)/teacher-login/page.tsx` | Teacher | Email/Password |
| `/dcp-admin` | `app/(admin)/dcp-admin/page.tsx` | Super Admin | Email/Password |

### 7.2 Password Management

| URL | File Path | Description |
|-----|-----------|-------------|
| `/forgetpassword` | `app/(admin)/forgetpassword/page.tsx` | ขอรหัสผ่านใหม่ (Admin) |
| `/request-password` | `app/(front)/request-password/page.tsx` | ขอรหัสผ่านใหม่ (Teacher) |

---

## 8. Mermaid Sitemap Diagrams

### 8.1 Complete Site Structure

\`\`\`mermaid
graph TB
    ROOT[dcpschool100.net]
    
    ROOT --> PUBLIC[Public Pages]
    ROOT --> TEACHER[Teacher Portal]
    ROOT --> ADMIN[Admin Dashboard]
    ROOT --> DCP[DCP Admin Dashboard]
    ROOT --> AUTH[Authentication]
    
    PUBLIC --> HOME[/ Homepage]
    PUBLIC --> ABOUT[/about]
    PUBLIC --> CERT[/certificate]
    PUBLIC --> CONTRACT[/contract]
    PUBLIC --> DOWNLOAD[/download]
    PUBLIC --> ACTIVITIES[/regist-activities]
    PUBLIC --> REG100[/regist100]
    PUBLIC --> REGSUP[/regist-support]
    PUBLIC --> DRAFT[/draft/token]
    
    TEACHER --> TDASH[/teacher/dashboard]
    TEACHER --> TSCHOOL[/teacher/school-info]
    TEACHER --> TCERT[/teacher/certificate]
    TEACHER --> TREG100[/teacher/dashboard/register100/id]
    TEACHER --> TREGSUP[/teacher/dashboard/register-support/id]
    
    ADMIN --> ADASH[/dashboard]
    ADMIN --> ASCHOOLS[/dashboard/allschools]
    ADMIN --> AMEMBERS[/dashboard/members]
    ADMIN --> AREG100[/dashboard/register100]
    ADMIN --> AREGSUP[/dashboard/register-support]
    
    DCP --> DLOGIN[/dcp-admin Login]
    DCP --> DDASH[/dcp-admin/dashboard]
    DCP --> DDRAFTS[/dcp-admin/dashboard/drafts]
    DCP --> DREG100[/dcp-admin/dashboard/register100]
    DCP --> DREGSUP[/dcp-admin/dashboard/register-support]
    DCP --> DCONTROL[/dcp-admin/dashboard/registration-control]
    DCP --> DUSERS[/dcp-admin/dashboard/users]
    DCP --> DCERTS[/dcp-admin/dashboard/certificates]
    
    AUTH --> ALOGIN[/login Admin]
    AUTH --> TLOGIN[/teacher-login]
    AUTH --> DALOGIN[/dcp-admin]
    AUTH --> FORGOT[/forgetpassword]
    AUTH --> REQUEST[/request-password]
    
    style ROOT fill:#e1f5ff
    style PUBLIC fill:#fff3cd
    style TEACHER fill:#d4edda
    style ADMIN fill:#f8d7da
    style DCP fill:#d1ecf1
    style AUTH fill:#e2e3e5
\`\`\`

### 8.2 Front Office Structure

\`\`\`mermaid
graph LR
    HOME[Homepage /]
    
    HOME --> INFO[Information Pages]
    HOME --> REG[Registration]
    HOME --> AUTH[Authentication]
    
    INFO --> ABOUT[About /about]
    INFO --> CERT[Certificate /certificate]
    INFO --> CONTRACT[Contract /contract]
    INFO --> DOWNLOAD[Download /download]
    INFO --> ACTIVITIES[Activities /regist-activities]
    
    REG --> REG100[Register 100% /regist100]
    REG --> REGSUP[Register Support /regist-support]
    REG --> DRAFT[Draft Resume /draft/token]
    
    REG100 --> STEP1[Step 1: Basic Info]
    REG100 --> STEP2[Step 2: Management]
    REG100 --> STEP3[Step 3: Curriculum]
    REG100 --> STEP4[Step 4: Teachers 9]
    REG100 --> STEP5[Step 5: Curriculum]
    REG100 --> STEP6[Step 6: Support]
    REG100 --> STEP7[Step 7: Awards]
    REG100 --> STEP8[Step 8: Activities]
    REG100 --> STEP9[Step 9: PR & Submit]
    
    AUTH --> TLOGIN[Teacher Login]
    
    style HOME fill:#e1f5ff
    style INFO fill:#fff3cd
    style REG fill:#d4edda
    style AUTH fill:#e2e3e5
\`\`\`

### 8.3 Teacher Portal Structure

\`\`\`mermaid
graph TB
    TLOGIN[Teacher Login<br/>/teacher-login]
    
    TLOGIN --> TDASH[Dashboard<br/>/teacher/dashboard]
    
    TDASH --> OVERVIEW[Overview Cards]
    TDASH --> TSCHOOL[School Info<br/>/teacher/school-info]
    TDASH --> TCERT[Certificates<br/>/teacher/certificate]
    TDASH --> TREG[Registration Details]
    
    TSCHOOL --> BASIC[Basic Info]
    TSCHOOL --> SCORES[Scores Display]
    TSCHOOL --> STATUS[Status]
    
    TCERT --> CERTLIST[Certificate List]
    TCERT --> DOWNLOAD[Download PDF]
    
    TREG --> REG100[Register100 Details<br/>/teacher/dashboard/register100/id]
    TREG --> REGSUP[Register-Support Details<br/>/teacher/dashboard/register-support/id]
    
    REG100 --> VIEW100[View Only Mode]
    REGSUP --> VIEWSUP[View Only Mode]
    
    style TLOGIN fill:#28a745
    style TDASH fill:#d4edda
\`\`\`

### 8.4 Admin Dashboard Structure

\`\`\`mermaid
graph TB
    ALOGIN[Admin Login<br/>/login]
    
    ALOGIN --> ADASH[Dashboard<br/>/dashboard]
    
    ADASH --> STATS[Statistics & Charts]
    ADASH --> ASCHOOLS[All Schools<br/>/dashboard/allschools]
    ADASH --> AMEMBERS[Members<br/>/dashboard/members]
    ADASH --> AREG100[Register100<br/>/dashboard/register100]
    ADASH --> AREGSUP[Register-Support<br/>/dashboard/register-support]
    
    ASCHOOLS --> SLIST[Schools List]
    ASCHOOLS --> SFILTER[Filter by Province/Level]
    
    AREG100 --> R100LIST[Registration List]
    AREG100 --> R100DETAIL[Details & Edit<br/>/dashboard/register100/id]
    
    AREGSUP --> RSLIST[Registration List]
    AREGSUP --> RSDETAIL[Details & Edit<br/>/dashboard/register-support/id]
    
    R100DETAIL --> VIEWDATA[View Data]
    R100DETAIL --> EDITSCORE[Edit Part 2 Scores]
    R100DETAIL --> EXPORT[Export CSV]
    
    style ALOGIN fill:#dc3545
    style ADASH fill:#f8d7da
\`\`\`

### 8.5 DCP Admin Dashboard Structure

\`\`\`mermaid
graph TB
    DLOGIN[DCP Admin Login<br/>/dcp-admin]
    
    DLOGIN --> DDASH[DCP Dashboard<br/>/dcp-admin/dashboard]
    
    DDASH --> DSTATS[System Statistics]
    DDASH --> DREG[Registration Management]
    DDASH --> DUSERS[User Management]
    DDASH --> DCERTS[Certificate Management]
    DDASH --> DSETTINGS[System Settings]
    
    DREG --> DREG100[Register100 All<br/>/dcp-admin/dashboard/register100]
    DREG --> DREGSUP[Register-Support All<br/>/dcp-admin/dashboard/register-support]
    DREG --> DDRAFTS[Drafts<br/>/dcp-admin/dashboard/drafts]
    DREG --> DCONTROL[Registration Control<br/>/dcp-admin/dashboard/registration-control]
    
    DUSERS --> ULIST[Users List<br/>/dcp-admin/dashboard/users]
    DUSERS --> UCREATE[Create User<br/>/dcp-admin/dashboard/users/create]
    DUSERS --> UEDIT[Edit User<br/>/dcp-admin/dashboard/users/id]
    
    DCERTS --> CLIST[Certificates List<br/>/dcp-admin/dashboard/certificates]
    DCERTS --> CCREATE[Create Certificate<br/>/dcp-admin/dashboard/certificates/create]
    DCERTS --> CEDIT[Edit Certificate<br/>/dcp-admin/dashboard/certificates/id]
    
    DCONTROL --> OPEN[Open Registration]
    DCONTROL --> CLOSE[Close Registration]
    
    style DLOGIN fill:#17a2b8
    style DDASH fill:#d1ecf1
\`\`\`

---

## 9. Route Groups & Layouts

### 9.1 Layout Hierarchy

\`\`\`
app/
├── layout.tsx                    # Root layout (Global)
├── (front)/
│   ├── layout.tsx               # Public layout
│   ├── page.tsx                 # /
│   ├── about/page.tsx           # /about
│   ├── regist100/page.tsx       # /regist100
│   └── ...
├── (teacher)/
│   └── teacher/
│       ├── layout.tsx           # Teacher layout
│       ├── dashboard/page.tsx   # /teacher/dashboard
│       └── ...
├── (admin)/
│   ├── login/page.tsx           # /login
│   ├── dashboard/
│   │   ├── layout.tsx           # Admin layout
│   │   ├── page.tsx             # /dashboard
│   │   └── ...
│   └── dcp-admin/
│       ├── page.tsx             # /dcp-admin
│       └── dashboard/
│           ├── layout.tsx       # DCP Admin layout
│           └── ...
└── api/
    ├── auth/
    ├── register100/
    ├── register-support/
    └── ...
\`\`\`

### 9.2 Middleware Protection

**File**: `middleware.ts`

\`\`\`typescript
// Protected routes
const protectedRoutes = {
  teacher: ['/teacher/*'],
  admin: ['/dashboard/*'],
  super_admin: ['/dcp-admin/dashboard/*']
};

// Public routes (no auth)
const publicRoutes = [
  '/',
  '/about',
  '/regist100',
  '/regist-support',
  '/certificate',
  '/login',
  '/teacher-login'
];
\`\`\`

---

## 10. Access Control Matrix

### 10.1 Page Access by Role

| Page/Section | Public | Teacher | Admin | Super Admin |
|--------------|--------|---------|-------|-------------|
| Homepage | ✅ | ✅ | ✅ | ✅ |
| About | ✅ | ✅ | ✅ | ✅ |
| Certificate Check | ✅ | ✅ | ✅ | ✅ |
| Register100 Form | ✅ | ❌ | ❌ | ❌ |
| Register-Support Form | ✅ | ❌ | ❌ | ❌ |
| Teacher Dashboard | ❌ | ✅ | ❌ | ❌ |
| Teacher School Info | ❌ | ✅ | ❌ | ❌ |
| Admin Dashboard | ❌ | ❌ | ✅ | ✅ |
| Registration Management | ❌ | ❌ | ✅ | ✅ |
| DCP Dashboard | ❌ | ❌ | ❌ | ✅ |
| User Management | ❌ | ❌ | ❌ | ✅ |
| Certificate Management | ❌ | ❌ | ❌ | ✅ |
| Registration Control | ❌ | ❌ | ❌ | ✅ |
| System Settings | ❌ | ❌ | ❌ | ✅ |


### 10.2 Feature Access Matrix

| Feature | Public | Teacher | Admin | Super Admin |
|---------|--------|---------|-------|-------------|
| **Registration** |
| Submit Register100 | ✅ | ❌ | ❌ | ❌ |
| Submit Register-Support | ✅ | ❌ | ❌ | ❌ |
| Save Draft | ✅ | ❌ | ❌ | ❌ |
| Resume Draft | ✅ | ❌ | ❌ | ❌ |
| **Viewing** |
| View Own School | ❌ | ✅ | ❌ | ❌ |
| View Jurisdiction Schools | ❌ | ❌ | ✅ | ✅ |
| View All Schools | ❌ | ❌ | ❌ | ✅ |
| View Drafts | ❌ | ❌ | ❌ | ✅ |
| **Editing** |
| Edit Registration | ❌ | ❌ | ✅ | ✅ |
| Edit Part 2 Scores | ❌ | ❌ | ✅ | ✅ |
| Delete Registration | ❌ | ❌ | ❌ | ✅ |
| **Export** |
| Export CSV | ❌ | ❌ | ✅ | ✅ |
| Export Excel | ❌ | ❌ | ✅ | ✅ |
| **User Management** |
| Create User | ❌ | ❌ | ❌ | ✅ |
| Edit User | ❌ | ❌ | ❌ | ✅ |
| Delete User | ❌ | ❌ | ❌ | ✅ |
| Reset Password | ❌ | ❌ | ❌ | ✅ |
| **Certificate** |
| Check Certificate | ✅ | ✅ | ✅ | ✅ |
| Download Certificate | ❌ | ✅ | ✅ | ✅ |
| Create Certificate | ❌ | ❌ | ❌ | ✅ |
| Edit Certificate | ❌ | ❌ | ❌ | ✅ |
| **System** |
| Open/Close Registration | ❌ | ❌ | ❌ | ✅ |
| System Settings | ❌ | ❌ | ❌ | ✅ |
| View Logs | ❌ | ❌ | ❌ | ✅ |

---

## 11. API Endpoints Summary

### 11.1 Authentication APIs

| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/api/auth/login` | POST | Public | Admin login |
| `/api/auth/admin-login` | POST | Public | Super admin login |
| `/api/auth/teacher-login` | POST | Public | Teacher login |
| `/api/auth/logout` | POST | Authenticated | Logout |
| `/api/auth/check` | GET | Authenticated | Check session |
| `/api/auth/check-email` | POST | Public | Check email unique |
| `/api/auth/request-password` | POST | Public | Request password reset |

### 11.2 Registration APIs

| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/api/register100` | POST | Public | Submit Register100 |
| `/api/register100/list` | GET | Admin+ | List registrations |
| `/api/register100/[id]` | GET | Admin+ | Get registration |
| `/api/register100/[id]` | PUT | Admin+ | Update registration |
| `/api/register100/[id]` | DELETE | Super Admin | Delete registration |
| `/api/register-support` | POST | Public | Submit Register-Support |
| `/api/register-support/list` | GET | Admin+ | List registrations |
| `/api/register-support/[id]` | GET | Admin+ | Get registration |
| `/api/register-support/[id]` | PUT | Admin+ | Update registration |
| `/api/register-support/[id]` | DELETE | Super Admin | Delete registration |

### 11.3 Draft APIs

| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/api/draft/save` | POST | Public | Save draft |
| `/api/draft/[token]` | GET | Public | Get draft |
| `/api/draft/[token]/data` | GET | Public | Get draft data |
| `/api/draft/[token]/request-otp` | POST | Public | Request OTP |
| `/api/draft/[token]/verify-otp` | POST | Public | Verify OTP |
| `/api/draft/[token]/submit` | POST | Public | Submit from draft |
| `/api/draft/upload-image` | POST | Public | Upload draft image |
| `/api/draft/cleanup-images` | POST/DELETE | Cron/Admin | Cleanup images |
| `/api/draft/clear-all` | DELETE | Super Admin | Clear all drafts |

### 11.4 User Management APIs

| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/api/users` | GET | Super Admin | List users |
| `/api/users` | POST | Super Admin | Create user |
| `/api/users/[id]` | GET | Super Admin | Get user |
| `/api/users/[id]` | PUT | Super Admin | Update user |
| `/api/users/[id]` | DELETE | Super Admin | Delete user |
| `/api/users/[id]/reset-password` | POST | Super Admin | Reset password |
| `/api/users/[id]/resend-credentials` | POST | Super Admin | Resend credentials |

### 11.5 Certificate APIs

| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/api/certificates` | GET | Admin+ | List certificates |
| `/api/certificates` | POST | Super Admin | Create certificate |
| `/api/certificates/[id]` | GET | Admin+ | Get certificate |
| `/api/certificates/[id]` | PUT | Super Admin | Update certificate |
| `/api/certificates/[id]` | DELETE | Super Admin | Delete certificate |
| `/api/certificates/check/[number]` | GET | Public | Check certificate |

### 11.6 System APIs

| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/api/registration-settings` | GET | Public | Get registration status |
| `/api/registration-settings` | PUT | Super Admin | Update registration status |
| `/api/health` | GET | Public | Health check |
| `/api/consent/check` | POST | Public | Check PDPA consent |
| `/api/consent/save` | POST | Public | Save PDPA consent |

---

## 12. File Upload Paths

### 12.1 Upload Directories

| Type | Path | Public URL | Cleanup |
|------|------|------------|---------|
| Manager Images | `/public/uploads/mgt/` | `/uploads/mgt/` | Manual |
| Teacher Images | `/public/uploads/teachers/` | `/uploads/teachers/` | Manual |
| Draft Images | `/public/draft-images/` | `/draft-images/` | Auto (7 days) |
| Certificate Templates | `/public/certificates/templates/` | `/certificates/templates/` | Manual |
| Certificate Images | `/public/certificates/` | `/certificates/` | Manual |

### 12.2 File Naming Convention

```javascript
// Manager Image
{school_id}-mgt-{timestamp}.jpg
// Example: DCP-0042-mgt-1721982000000.jpg

// Teacher Image
{school_id}-teacher-{index}-{timestamp}.jpg
// Example: DCP-0042-teacher-0-1721982000000.jpg

// Draft Image
{draft_token}-{type}-{timestamp}.jpg
// Example: uuid-abc-mgt-1721982000000.jpg
```

---

## 13. External Integrations

### 13.1 External Links

| Service | Purpose | User Provided |
|---------|---------|---------------|
| Google Drive | Photo galleries, Evidence | ✅ |
| YouTube | Video submissions (2 per school) | ✅ |
| Facebook | PR activities evidence | ✅ |
| TikTok | PR activities evidence | ✅ |
| Instagram | PR activities evidence | ✅ |

### 13.2 Email Service

- **Provider**: SMTP
- **Usage**: 
  - OTP verification
  - Login credentials
  - Password reset
  - System notifications

---

## 14. SEO & Metadata

### 14.1 Static Pages SEO

| Page | Title | Description |
|------|-------|-------------|
| `/` | โครงการโรงเรียนดนตรีไทย 100% การันตี | ระบบลงทะเบียนโรงเรียนดนตรีไทย |
| `/about` | เกี่ยวกับโครงการ | ข้อมูลโครงการโรงเรียนดนตรีไทย |
| `/certificate` | ตรวจสอบใบประกาศนียบัตร | ตรวจสอบความถูกต้องใบประกาศนียบัตร |
| `/regist100` | ลงทะเบียนโรงเรียน 100% | ลงทะเบียนโรงเรียนดนตรีไทย 100% การันตี |
| `/regist-support` | ลงทะเบียนสนับสนุนและส่งเสริม | ลงทะเบียนโรงเรียนสนับสนุนและส่งเสริม |

### 14.2 Dynamic Routes SEO

```typescript
// Example: Registration Detail
export async function generateMetadata({ params }) {
  const registration = await getRegistration(params.id);
  return {
    title: `${registration.school_name} - DCP School 100`,
    description: `ข้อมูลลงทะเบียนโรงเรียน ${registration.school_name}`
  };
}
```

---

## 15. Performance & Optimization

### 15.1 Rendering Strategy

| Page Type | Strategy | Cache |
|-----------|----------|-------|
| Public Static | SSG | ISR 3600s |
| Dashboard | SSR | No cache |
| API Routes | Dynamic | No cache |
| Images | Next/Image | Optimized |

### 15.2 Code Splitting

- ✅ Route-based splitting (automatic)
- ✅ Component lazy loading
- ✅ Dynamic imports for heavy components
- ✅ Separate chunks for admin/teacher

---

## 16. Mobile Responsiveness

### 16.1 Breakpoints

| Size | Width | Target Device |
|------|-------|---------------|
| Mobile | 320px - 767px | Smartphones |
| Tablet | 768px - 1365px | Tablets, iPad |
| Laptop | 1366px - 1920px | Laptops |
| Desktop | 1920px+ | Large screens |

### 16.2 Mobile Features

- ✅ Touch-optimized UI
- ✅ Responsive tables (horizontal scroll)
- ✅ Mobile-friendly forms
- ✅ Optimized images
- ✅ Hamburger menu

---

## 17. Security Features

### 17.1 Authentication Security

- ✅ HTTP-only cookies
- ✅ Secure flag (HTTPS only)
- ✅ SameSite strict
- ✅ JWT token (24h expiry)
- ✅ bcrypt password hashing

### 17.2 Input Validation

- ✅ Zod schema validation
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ File upload validation (magic bytes)

### 17.3 Rate Limiting

- ✅ Draft save: 5/hour
- ✅ OTP request: 3/hour
- ✅ OTP verify: 5 attempts
- ✅ Login attempts: 10/15min

---

## 18. Monitoring & Logging

### 18.1 Health Checks

- **Endpoint**: `/api/health`
- **Checks**: Database, File system, Email service

### 18.2 Audit Logs

| Event | Logged | Details |
|-------|--------|---------|
| User Login | ✅ | User, IP, timestamp |
| Registration Submit | ✅ | School, User, timestamp |
| Score Update | ✅ | Admin, School, old/new values |
| User Created | ✅ | Creator, New user, timestamp |
| Certificate Generated | ✅ | School, Admin, timestamp |

---

## 19. Backup & Recovery

### 19.1 Database Backup

- **Frequency**: Daily
- **Retention**: 30 days
- **Location**: Server backup directory

### 19.2 File Backup

- **Uploads**: Weekly backup
- **Drafts**: Not backed up (temporary, 7-day expiry)

---

## 20. Deployment Information

### 20.1 Server Details

- **Server**: root@041034-U
- **Domain**: https://dcpschool100.net
- **SSL**: Enabled
- **Port**: 443 (HTTPS), 80 (HTTP redirect)

### 20.2 Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/thai_music_school

# Session
SESSION_SECRET=***
JWT_SECRET=***

# Email
SMTP_HOST=***
SMTP_PORT=587
SMTP_USER=***
SMTP_PASS=***

# App
NEXT_PUBLIC_BASE_URL=https://dcpschool100.net
NODE_ENV=production
```

---

## Appendix A: Navigation Menu Structure

### Public Menu
```
Home
├── About
├── Registration
│   ├── Register 100%
│   └── Register Support
├── Certificate Check
├── Download
└── Login
    ├── Teacher Login
    └── Admin Login
```

### Teacher Menu
```
Dashboard
├── School Info
├── Registration Details
└── Certificates
```

### Admin Menu
```
Dashboard
├── All Schools
├── Members
├── Register100
└── Register-Support
```

### DCP Admin Menu
```
Dashboard
├── Registration Control
├── Register100 (All)
├── Register-Support (All)
├── Drafts
├── Users
├── Certificates
└── Settings
```

---

## Appendix B: Quick Reference

### URLs by Role

**Public**:
- `/` - Homepage
- `/regist100` - Register 100%
- `/regist-support` - Register Support
- `/certificate` - Check Certificate

**Teacher**:
- `/teacher/dashboard` - Teacher Dashboard
- `/teacher-login` - Login

**Admin**:
- `/dashboard` - Admin Dashboard
- `/login` - Login

**Super Admin**:
- `/dcp-admin/dashboard` - DCP Dashboard
- `/dcp-admin` - Login

---

**END OF SITEMAP**

**Document Version**: 2.0.0  
**Last Updated**: July 28, 2026  
**Maintained By**: Development Team

