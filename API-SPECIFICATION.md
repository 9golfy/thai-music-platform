# Thai Music Platform — API Specification

**Version**: 1.0.0  
**Last Updated**: July 27, 2026  
**Base URL**: `https://dcpschool100.net`  
**API Base**: `https://dcpschool100.net/api`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Response Formats](#common-response-formats)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [API Endpoints](#api-endpoints)
   - [Authentication APIs](#authentication-apis)
   - [Registration APIs](#registration-apis)
   - [Draft System APIs](#draft-system-apis)
   - [User Management APIs](#user-management-apis)
   - [Certificate APIs](#certificate-apis)
   - [System Settings APIs](#system-settings-apis)
   - [Admin Utility APIs](#admin-utility-apis)
7. [Data Models](#data-models)
8. [Score Calculation Rules](#score-calculation-rules)

---

## Overview

### API Architecture
- **Framework**: Next.js 16 App Router
- **Database**: MongoDB
- **Authentication**: Session-based with HTTP-only cookies
- **File Uploads**: Multipart form-data
- **Response Format**: JSON

### Base URLs

| Environment | Base URL |
|-------------|----------|
| Production | `https://dcpschool100.net` |
| Development | `http://localhost:3000` |

### API Conventions
- All timestamps are in ISO 8601 format
- All dates use Thai Buddhist calendar in display
- Field names use snake_case for database fields
- Field names use camelCase for API requests
- Prefix `reg100_` for Register100 fields
- Prefix `regsup_` for Register-Support fields

---

## Authentication

### Session-Based Authentication

The API uses HTTP-only cookies for session management.

#### Login Flow
1. Client sends credentials to login endpoint
2. Server validates credentials
3. Server creates session token
4. Server sets `session` cookie (HTTP-only, secure)
5. Client includes cookie in subsequent requests

#### Cookie Details
```
Name: session
HttpOnly: true
Secure: true (production only)
SameSite: strict
Max-Age: 86400 (24 hours)
```

### Role-Based Access Control (RBAC)

| Role | Access Level | Description |
|------|--------------|-------------|
| `root` | System | Full system access, database operations |
| `super_admin` | Admin+ | All admin permissions + user management |
| `admin` | Admin | Manage registrations in jurisdiction |
| `teacher` | User | View own school data only |


---

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "id": "507f1f77bcf86cd799439011"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Pagination Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource (e.g., email exists) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Common Error Messages

```json
{
  "success": false,
  "message": "An account with this email already exists"
}
```

```json
{
  "success": false,
  "message": "Teacher email and phone are required"
}
```

```json
{
  "success": false,
  "message": "รูปภาพผู้บริหารไม่ถูกต้อง: Invalid file type"
}
```

---

## Rate Limiting

### Rate Limits by Operation

| Operation | Limit | Window | Notes |
|-----------|-------|--------|-------|
| Draft Save | 5 requests | 1 hour | Per email + submission type |
| OTP Request | 3 requests | 1 hour | Per draft token |
| OTP Verification | 5 attempts | Per OTP | Locks after 5 failures |
| Email Sending | Varies | Per priority | High=immediate, Normal=queued |
| Login Attempts | 10 attempts | 15 minutes | Per IP address |

### Rate Limit Headers

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later.",
  "rateLimited": true,
  "retryAfter": 3600
}
```

---

## API Endpoints

## Authentication APIs

### POST /api/auth/login
Admin login endpoint.

**Request**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "เข้าสู่ระบบสำเร็จ",
  "user": {
    "username": "admin",
    "displayName": "Admin User",
    "role": "admin"
  }
}
```

**Sets Cookie**: `session` (HTTP-only, 24 hours)

---

### POST /api/auth/admin-login
Super Admin login endpoint.

**Request**:
```json
{
  "email": "admin@dcpschool100.net",
  "password": "SecurePassword123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "email": "admin@dcpschool100.net",
    "role": "super_admin",
    "firstName": "Admin",
    "lastName": "User"
  }
}
```

---

### POST /api/auth/teacher-login
Teacher login endpoint.

**Request**:
```json
{
  "email": "teacher@school.ac.th",
  "password": "TeacherPass123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "email": "teacher@school.ac.th",
    "role": "teacher",
    "schoolId": "DCP-0001",
    "firstName": "Teacher Name"
  }
}
```

---

### POST /api/auth/logout
Logout current session.

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Clears Cookie**: `session`

---

### GET /api/auth/check
Check current session status.

**Response** (200):
```json
{
  "authenticated": true,
  "user": {
    "email": "user@example.com",
    "role": "admin",
    "schoolId": "DCP-0001"
  }
}
```

---

### POST /api/auth/check-email
Check if email already exists.

**Request**:
```json
{
  "email": "teacher@school.ac.th"
}
```

**Response** (200):
```json
{
  "exists": false
}
```

---

### POST /api/auth/request-password
Request password reset.

**Request**:
```json
{
  "email": "teacher@school.ac.th"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```


---

## Registration APIs

### POST /api/register100
Submit Register100 registration form.

**Content-Type**: `multipart/form-data`

**Request Fields**:
```typescript
{
  // Step 1: Basic Info
  reg100_schoolName: string;
  reg100_schoolProvince: string;
  reg100_schoolLevel: "ประถมศึกษา" | "มัธยมศึกษา" | "ขยายโอกาส" | "เฉพาะทาง";
  reg100_affiliation: string;
  reg100_staffCount: number;
  reg100_studentCount: number;
  
  // Step 2: Management
  reg100_mgtFullName: string;
  reg100_mgtPosition: string;
  reg100_mgtPhone: string;
  reg100_mgtEmail?: string;
  mgtImage: File; // Image file (max 1MB)
  
  // Step 4: Teachers
  reg100_thaiMusicTeachers: Array<Teacher>;
  teacherImage_0: File; // Teacher images
  teacherImage_1: File;
  
  // Step 5: Curriculum (Boolean flags)
  reg100_isCompulsorySubject: boolean;
  reg100_hasElectiveSubject: boolean;
  reg100_hasLocalCurriculum: boolean;
  reg100_hasAfterSchoolTeaching: boolean;
  
  // Step 6-7: Support & Awards
  reg100_hasSupportFromOrg: boolean;
  reg100_supportFromExternal: Array<SupportOrg>;
  reg100_awards: Array<Award>;
  
  // Step 8: Activities
  reg100_activitiesWithinProvinceInternal: Array<Activity>;
  reg100_activitiesWithinProvinceExternal: Array<Activity>;
  reg100_activitiesOutsideProvince: Array<Activity>;
  
  // Step 9: PR & Links
  reg100_prActivities: Array<PRActivity>;
  reg100_photoGalleryLink: string; // Google Drive link
  reg100_videoLink: string; // YouTube link 1
  reg100_videoLink2: string; // YouTube link 2
  
  // Teacher Login Info
  teacherEmail: string;
  teacherPhone: string;
  
  // Certification
  reg100_certifiedByAdmin: boolean;
}
```

**Response** (200):
```json
{
  "success": true,
  "id": "507f1f77bcf86cd799439011",
  "schoolId": "DCP-0042",
  "message": "Form submitted successfully",
  "emailSent": true
}
```

**Auto-Generated Fields**:
- `schoolId`: Format `DCP-XXXX` (sequential)
- `createdAt`, `submittedAt`: ISO 8601 timestamp
- `status`: `"pending"`
- Scores: Auto-calculated based on form data
- User account: Created for teacher with generated password

**Score Calculation** (Auto-calculated):
```json
{
  "teaching_curriculum_score": 20,
  "teacher_qualification_score": 15,
  "support_from_org_score": 5,
  "support_from_external_score": 15,
  "award_score": 20,
  "activity_within_province_internal_score": 5,
  "activity_within_province_external_score": 5,
  "activity_outside_province_score": 5,
  "pr_activity_score": 5,
  "total_score": 95
}
```

**Error Responses**:
- 400: Missing required fields or validation error
- 409: Email already exists
- 500: Server error during upload or database operation

---

### POST /api/register-support
Submit Register-Support registration form.

**Content-Type**: `multipart/form-data`

**Request Fields** (Similar to Register100 with prefix `regsup_`):
```typescript
{
  // Additional fields for Register-Support
  regsup_supportType: "สถานศึกษา" | "ชุมนุม" | "ชมรม" | "กลุ่ม" | "วงดนตรีไทย";
  regsup_supportTypeMemberCount: number;
  
  // Other fields similar to Register100 but with regsup_ prefix
  regsup_schoolName: string;
  regsup_schoolProvince: string;
  // ... (same structure as Register100)
}
```

**Score Differences**:
- `teacher_training_score`: 20 (unique to Register-Support)
- Max total: 100 (vs 100 for Register100 Part 1)
- Part 2 video scores: 80 max (vs 100 for Register100)

---

### GET /api/register100/list
Get list of Register100 registrations (Admin).

**Query Parameters**:
```
?page=1
&limit=10
&province=กรุงเทพมหานคร
&level=ประถมศึกษา
&grade=A
&search=โรงเรียน
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "schoolId": "DCP-0042",
      "reg100_schoolName": "โรงเรียนดนตรีไทยตัวอย่าง",
      "reg100_schoolProvince": "กรุงเทพมหานคร",
      "reg100_schoolLevel": "ประถมศึกษา",
      "status": "approved",
      "total_score": 195,
      "grade": "A",
      "createdAt": "2026-07-20T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

---

### GET /api/register100/[id]
Get single Register100 registration by ID.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "schoolId": "DCP-0042",
    "reg100_schoolName": "โรงเรียนดนตรีไทยตัวอย่าง",
    "reg100_schoolProvince": "กรุงเทพมหานคร",
    "reg100_mgtFullName": "นายผู้บริหาร",
    "reg100_thaiMusicTeachers": [...],
    "teaching_curriculum_score": 20,
    "teacher_qualification_score": 15,
    "video1_score": 45,
    "video2_score": 48,
    "total_score": 193,
    "adminNotes": "โรงเรียนมีความพร้อมสูง",
    "status": "approved",
    "createdAt": "2026-07-20T10:30:00.000Z"
  }
}
```

---

### PUT /api/register100/[id]
Update Register100 registration.

**Query Parameters**:
- `?manualEdit=true` - Preserve all scores (for manual score editing)
- (No param) - Recalculate Part 1 scores, preserve Part 2

**Request** (JSON):
```json
{
  "reg100_schoolName": "โรงเรียนดนตรีไทยอัพเดท",
  "video1_score": 48,
  "video2_score": 49,
  "adminNotes": "อัพเดทคะแนนวิดีโอ"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Registration updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "total_score": 197
  }
}
```

**Score Preservation Logic**:
```typescript
// Normal Edit: Recalculate Part 1, keep Part 2
PUT /api/register100/[id]
Body: { reg100_awards: [...] } // Scores recalculated

// Manual Edit: Keep all scores
PUT /api/register100/[id]?manualEdit=true
Body: { video1_score: 48 } // No recalculation
```

---

### DELETE /api/register100/[id]
Delete Register100 registration (Hard Delete).

**Response** (200):
```json
{
  "success": true,
  "message": "Registration deleted successfully"
}
```

**Note**: This performs a hard delete. All data is permanently removed.

---

### GET /api/register100/[id]/export/pdf
Export registration as PDF (Not implemented - returns 501).

---

### GET /api/register100/[id]/export/excel
Export registration as Excel (Not used - client-side export preferred).

**Note**: The actual export is done client-side in `SchoolsDataTable.tsx` component, generating CSV with all score details.

---

## Draft System APIs

### POST /api/draft/save
Save form draft.

**Request** (JSON):
```json
{
  "draftToken": "550e8400-e29b-41d4-a716-446655440000",
  "email": "teacher@school.ac.th",
  "phone": "0812345678",
  "submissionType": "register100",
  "formData": {
    "reg100_schoolName": "โรงเรียนตัวอย่าง",
    "step1": {...},
    "step2": {...}
  },
  "currentStep": 3
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Draft saved successfully",
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "saveCount": 5,
  "expiresAt": "2026-07-27T10:30:00.000Z"
}
```

**Rate Limit**: 5 saves per hour per email+submissionType

**Behavior**:
- Creates new draft or updates existing one
- Single active draft per email+submissionType combination
- Draft expires after 7 days
- Images saved to `/public/draft-images/`

---

### GET /api/draft/[token]
Get draft by token.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "token": "550e8400-e29b-41d4-a716-446655440000",
    "email": "teacher@school.ac.th",
    "phone": "0812345678",
    "submissionType": "register100",
    "currentStep": 3,
    "status": "active",
    "saveCount": 5,
    "lastSaveAt": "2026-07-27T09:30:00.000Z",
    "expiresAt": "2026-08-03T09:30:00.000Z",
    "createdAt": "2026-07-20T09:30:00.000Z"
  }
}
```

---

### GET /api/draft/[token]/data
Get draft form data.

**Response** (200):
```json
{
  "success": true,
  "formData": {
    "reg100_schoolName": "โรงเรียนตัวอย่าง",
    "reg100_schoolProvince": "กรุงเทพมหานคร",
    "reg100_mgtFullName": "นายผู้บริหาร",
    "step1": {...},
    "step2": {...}
  }
}
```

---

### POST /api/draft/[token]/request-otp
Request OTP for draft submission.

**Request** (JSON):
```json
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
  "otpExpiresAt": "2026-07-27T10:35:00.000Z"
}
```

**Rate Limit**: 3 requests per hour per draft token

**OTP Details**:
- 6-digit numeric code
- Valid for 5 minutes
- Sent via email and SMS
- Hashed using bcrypt before storage

---

### POST /api/draft/[token]/verify-otp
Verify OTP before submission.

**Request** (JSON):
```json
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

**Error** (400):
```json
{
  "success": false,
  "message": "Invalid or expired OTP",
  "attemptsRemaining": 3
}
```

**Rate Limit**: 5 attempts per OTP (then locked)

---

### POST /api/draft/[token]/submit
Submit draft after OTP verification.

**Request** (multipart/form-data):
```
// Same as POST /api/register100 or /api/register-support
// Converts draft to final submission
```

**Response** (200):
```json
{
  "success": true,
  "id": "507f1f77bcf86cd799439011",
  "schoolId": "DCP-0042",
  "message": "Form submitted successfully",
  "draftDeleted": true
}
```

**Behavior**:
- Validates OTP was verified
- Creates final submission
- Deletes draft
- Sends teacher login email

---

### POST /api/draft/upload-image
Upload image for draft.

**Content-Type**: `multipart/form-data`

**Request Fields**:
```
draftToken: string
imageType: "management" | "teacher_0" | "teacher_1"
file: File (max 1MB, image/* only)
```

**Response** (200):
```json
{
  "success": true,
  "imageUrl": "/draft-images/550e8400-management-1721982600000.jpg"
}
```

**File Naming**: `{draftToken}-{imageType}-{timestamp}.{ext}`

**Security**: Magic bytes validation to prevent malicious uploads

---

### POST /api/draft/cleanup-images
Cleanup orphaned draft images (Cron job).

**Response** (200):
```json
{
  "success": true,
  "message": "Cleanup completed",
  "deletedCount": 15,
  "deletedFiles": ["file1.jpg", "file2.jpg"]
}
```

**Behavior**: Deletes images older than 7 days

---

### DELETE /api/draft/cleanup-images
Manually trigger image cleanup.

(Same as POST)

---

### DELETE /api/draft/clear-all
Clear all drafts (Admin only).

**Response** (200):
```json
{
  "success": true,
  "message": "All drafts cleared",
  "deletedCount": 42
}
```

---

## User Management APIs

### GET /api/users
Get list of users (Admin only).

**Query Parameters**:
```
?page=1
&limit=10
&role=teacher
&search=email@example.com
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "teacher@school.ac.th",
      "role": "teacher",
      "firstName": "Teacher",
      "lastName": "Name",
      "phone": "0812345678",
      "schoolId": "DCP-0042",
      "isActive": true,
      "createdAt": "2026-07-20T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

---

### POST /api/users
Create new user (Admin only).

**Request** (JSON):
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "role": "teacher",
  "firstName": "New",
  "lastName": "User",
  "phone": "0812345678",
  "schoolId": "DCP-0042"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "userId": "507f1f77bcf86cd799439011",
  "emailSent": true
}
```

---

### GET /api/users/[id]
Get user by ID (Admin only).

**Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "teacher@school.ac.th",
    "role": "teacher",
    "firstName": "Teacher",
    "lastName": "Name",
    "phone": "0812345678",
    "schoolId": "DCP-0042",
    "isActive": true,
    "createdAt": "2026-07-20T10:30:00.000Z",
    "updatedAt": "2026-07-27T10:30:00.000Z"
  }
}
```

---

### PUT /api/users/[id]
Update user (Admin only).

**Request** (JSON):
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "phone": "0898765432",
  "isActive": false
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "User updated successfully"
}
```

**Note**: Cannot update email or role

---

### DELETE /api/users/[id]
Delete user (Admin only).

**Response** (200):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### POST /api/users/[id]/reset-password
Reset user password (Admin only).

**Request** (JSON):
```json
{
  "newPassword": "NewSecurePassword123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Password reset successfully",
  "emailSent": true
}
```

---

### POST /api/users/[id]/resend-credentials
Resend login credentials email (Admin only).

**Response** (200):
```json
{
  "success": true,
  "message": "Credentials resent successfully",
  "emailSent": true
}
```

**Note**: Generates new temporary password
