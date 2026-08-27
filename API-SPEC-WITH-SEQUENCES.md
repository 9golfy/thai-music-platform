# Thai Music Platform — API Specification with Sequence Diagrams

**Version**: 2.0.0  
**Last Updated**: July 28, 2026  
**Base URL**: `https://dcpschool100.net`  
**API Base**: `https://dcpschool100.net/api`

---

## สารบัญ

1. [ภาพรวม API](#1-ภาพรวม-api)
2. [Authentication & Session](#2-authentication--session)
3. [Workflow 1: Register100 Complete Flow](#workflow-1-register100-complete-flow)
4. [Workflow 2: Register-Support Complete Flow](#workflow-2-register-support-complete-flow)
5. [Workflow 3: Save Draft Flow](#workflow-3-save-draft-flow)
6. [Workflow 4: OTP Verification Flow](#workflow-4-otp-verification-flow)
7. [Workflow 5: Admin Login & Dashboard](#workflow-5-admin-login--dashboard)
8. [Workflow 6: Score Update Flow](#workflow-6-score-update-flow)
9. [Workflow 7: User Management Flow](#workflow-7-user-management-flow)
10. [Workflow 8: Certificate Generation Flow](#workflow-8-certificate-generation-flow)
11. [Workflow 9: Export Data Flow](#workflow-9-export-data-flow)
12. [Workflow 10: Email Notification Flow](#workflow-10-email-notification-flow)
13. [API Reference](#api-reference)
14. [Data Models](#data-models)
15. [Error Handling](#error-handling)

---

## 1. ภาพรวม API

### 1.1 Architecture Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser   │─────▶│  Next.js    │─────▶│  MongoDB    │      │   Email     │
│   Client    │◀─────│  API Route  │◀─────│  Database   │      │   Service   │
└─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
                            │                                            ▲
                            │                                            │
                            └────────────────────────────────────────────┘
                                    File Upload & Email Queue
```

### 1.2 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB 7.0
- **Authentication**: Session-based (HTTP-only cookies)
- **File Storage**: Local filesystem (`/public/uploads/`)
- **Email**: Nodemailer with SMTP
- **Validation**: Zod schemas

### 1.3 Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://dcpschool100.net` |
| Development | `http://localhost:3000` |

---

## 2. Authentication & Session

### 2.1 Session Management

**Cookie Structure**:
```javascript
{
  name: "session",
  httpOnly: true,
  secure: true, // Production only
  sameSite: "strict",
  maxAge: 86400, // 24 hours
  path: "/"
}
```

**Session Data** (JWT payload):
```javascript
{
  userId: "507f1f77bcf86cd799439011",
  email: "user@example.com",
  role: "admin" | "teacher" | "super_admin" | "root",
  schoolId: "DCP-0001", // For teachers
  iat: 1721982000,
  exp: 1722068400
}
```

### 2.2 Role-Based Access

| Role | Access Level | Typical Users |
|------|--------------|---------------|
| `root` | Full system | System administrator |
| `super_admin` | All features | DCP administrators |
| `admin` | Jurisdiction | Provincial admins |
| `teacher` | Own school | School teachers |

---

## Workflow 1: Register100 Complete Flow

### 1.1 Overview
ครูกรอกแบบฟอร์มลงทะเบียนโรงเรียนดนตรีไทย 100% ทั้ง 9 ขั้นตอน

### 1.2 Sequence Diagram

```
Teacher          Browser         Next.js API      MongoDB         Email Service
  │                 │                 │                 │                 │
  │   1. Open Form  │                 │                 │                 │
  ├────────────────▶│                 │                 │                 │
  │                 │                 │                 │                 │
  │   2. Accept PDPA Consent          │                 │                 │
  ├────────────────▶│                 │                 │                 │
  │                 │                 │                 │                 │
  │   3. Fill Steps 1-9 (Auto-save)   │                 │                 │
  ├────────────────▶│  POST /api/     │                 │                 │
  │                 │  draft/save     │  Save Draft     │                 │
  │                 ├────────────────▶│────────────────▶│                 │
  │                 │◀────────────────│◀────────────────│                 │
  │◀────────────────│  Draft Saved    │                 │                 │
  │                 │                 │                 │                 │
  │   4. Upload Images (Manager + Teachers)             │                 │
  ├────────────────▶│  POST /api/     │  Save Images    │                 │
  │                 │  draft/upload-  │  to /public/    │                 │
  │                 │  image          │  draft-images/  │                 │
  │                 ├────────────────▶│                 │                 │
  │                 │◀────────────────│                 │                 │
  │◀────────────────│  Image URL      │                 │                 │
  │                 │                 │                 │                 │
  │   5. Click "Submit Form"          │                 │                 │
  ├────────────────▶│                 │                 │                 │
  │                 │  Show Contact   │                 │                 │
  │◀────────────────│  Modal          │                 │                 │
  │                 │                 │                 │                 │
  │   6. Enter Teacher Email & Phone  │                 │                 │
  ├────────────────▶│  POST /api/auth/│  Check Email    │                 │
  │                 │  check-email    │  Unique         │                 │
  │                 ├────────────────▶│────────────────▶│                 │
  │                 │◀────────────────│◀────────────────│                 │
  │◀────────────────│  Email Valid    │                 │                 │
  │                 │                 │                 │                 │
  │   7. Request OTP                  │                 │                 │
  ├────────────────▶│  POST /api/draft│  Generate OTP   │  Send Email     │
  │                 │  /[token]/      │  (6 digits)     │  with OTP       │
  │                 │  request-otp    │                 │                 │
  │                 ├────────────────▶│────────────────▶│────────────────▶│
  │                 │◀────────────────│  Save OTP       │                 │
  │◀────────────────│  OTP Modal      │  (hashed)       │                 │
  │                 │                 │                 │                 │
  │   8. Enter OTP (123456)           │                 │                 │
  ├────────────────▶│  POST /api/draft│  Verify OTP     │                 │
  │                 │  /[token]/      │  (bcrypt)       │                 │
  │                 │  verify-otp     │                 │                 │
  │                 ├────────────────▶│────────────────▶│                 │
  │                 │◀────────────────│◀────────────────│                 │
  │◀────────────────│  OTP Verified   │                 │                 │
  │                 │                 │                 │                 │
  │   9. Final Submit                 │                 │                 │
  ├────────────────▶│  POST /api/     │  1. Validate    │                 │
  │                 │  register100    │  2. Calculate   │                 │
  │                 │                 │     Scores      │                 │
  │                 │                 │  3. Generate    │                 │
  │                 │                 │     School ID   │                 │
  │                 ├────────────────▶│     (DCP-XXXX)  │                 │
  │                 │                 ├────────────────▶│                 │
  │                 │                 │  4. Create User │                 │
  │                 │                 │  5. Save School │                 │
  │                 │                 │  6. Delete Draft│                 │
  │                 │                 │◀────────────────│                 │
  │                 │                 │  7. Send Login  │  Email Login    │
  │                 │                 │     Credentials │  Info           │
  │                 │                 │────────────────────────────────▶│
  │                 │◀────────────────│                 │                 │
  │◀────────────────│  Success +      │                 │                 │
  │                 │  School ID      │                 │                 │
  │                 │                 │                 │                 │
```

### 1.3 API Calls Detail

#### Call 1: Check Email Unique
```http
POST /api/auth/check-email
Content-Type: application/json

{
  "email": "teacher@school.ac.th"
}
```

**Response** (200):
```json
{
  "exists": false,
  "available": true
}
```

#### Call 2: Request OTP
```http
POST /api/draft/[token]/request-otp
Content-Type: application/json

{
  "email": "teacher@school.ac.th",
  "phone": "0812345678"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 300,
  "otpExpiresAt": "2026-07-28T10:35:00.000Z"
}
```

#### Call 3: Verify OTP
```http
POST /api/draft/[token]/verify-otp
Content-Type: application/json

{
  "otp": "123456",
  "email": "teacher@school.ac.th"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "verified": true
}
```

#### Call 4: Submit Form
```http
POST /api/register100
Content-Type: multipart/form-data

{
  // All form data from 9 steps
  "reg100_schoolName": "โรงเรียนทดสอบ",
  "reg100_schoolProvince": "กรุงเทพมหานคร",
  "reg100_mgtFullName": "นายผู้บริหาร",
  "reg100_thaiMusicTeachers": [...],
  "teacherEmail": "teacher@school.ac.th",
  "teacherPhone": "0812345678",
  "reg100_certifiedByAdmin": true,
  // + images
}
```

**Response** (200):
```json
{
  "success": true,
  "id": "507f1f77bcf86cd799439011",
  "schoolId": "DCP-0042",
  "message": "Registration submitted successfully",
  "scores": {
    "teaching_curriculum_score": 20,
    "teacher_qualification_score": 20,
    "support_from_org_score": 5,
    "support_from_external_score": 15,
    "award_score": 20,
    "activity_within_province_internal_score": 5,
    "activity_within_province_external_score": 5,
    "activity_outside_province_score": 5,
    "pr_activity_score": 5,
    "total_score": 100
  },
  "grade": "A",
  "emailSent": true
}
```

### 1.4 Score Calculation Logic

```javascript
// Step 1: Calculate Curriculum Score (max 20)
curriculum_score = 0;
if (isCompulsorySubject) curriculum_score += 5;
if (hasElectiveSubject) curriculum_score += 5;
if (hasLocalCurriculum) curriculum_score += 5;
if (hasAfterSchoolTeaching) curriculum_score += 5;

// Step 2: Calculate Teacher Qualification Score (max 20)
const uniqueMajors = new Set();
teachers.forEach(t => {
  if (t.musicInstituteEducation) {
    t.musicInstituteEducation.forEach(edu => {
      if (edu.major) uniqueMajors.add(edu.major);
    });
  }
});
const count = uniqueMajors.size;
if (count >= 4) teacher_score = 20;
else if (count === 3) teacher_score = 15;
else if (count === 2) teacher_score = 10;
else teacher_score = 5;

// Step 3-9: Similar calculation patterns
// Total Part 1: 100 points
// Part 2 (video scores): 0-100 points (manual entry by admin)
```

---

## Workflow 2: Register-Support Complete Flow

### 2.1 Sequence Diagram

```
Teacher          Browser         Next.js API      MongoDB         Email Service
  │                 │                 │                 │                 │
  │   1. Open /regist-support         │                 │                 │
  ├────────────────▶│                 │                 │                 │
  │                 │                 │                 │                 │
  │   2. Select Support Type          │                 │                 │
  │      - สถานศึกษา                  │                 │                 │
  │      - ชุมนุม / ชมรม / กลุ่ม       │                 │                 │
  │      - วงดนตรีไทย                  │                 │                 │
  ├────────────────▶│  Show Fields    │                 │                 │
  │◀────────────────│  by Type        │                 │                 │
  │                 │                 │                 │                 │
  │   3. Fill Steps 1-9               │                 │                 │
  │      (Similar to Register100)     │                 │                 │
  ├────────────────▶│  POST /api/     │                 │                 │
  │                 │  register-      │                 │                 │
  │                 │  support        │                 │                 │
  │                 ├────────────────▶│  Calculate      │                 │
  │                 │                 │  Scores         │                 │
  │                 │                 │  (Different)    │                 │
  │                 │                 ├────────────────▶│                 │
  │                 │◀────────────────│◀────────────────│                 │
  │◀────────────────│  Success        │                 │                 │
```

### 2.2 Key Differences from Register100

| Feature | Register100 | Register-Support |
|---------|-------------|------------------|
