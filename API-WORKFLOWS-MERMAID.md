# API Workflows - Mermaid Sequence Diagrams

**สำหรับสร้างภาพ Sequence Diagram ใน MS Word หรือเครื่องมืออื่นๆ**

---

## วิธีใช้งาน

1. Copy โค้ด Mermaid จากแต่ละ Workflow
2. วาง ใน Mermaid Live Editor (https://mermaid.live)
3. Export เป็นรูปภาพ (PNG/SVG)
4. นำไปใส่ใน MS Word

---

## Workflow 1: Register100 Complete Registration Flow

### Mermaid Code

\`\`\`mermaid
sequenceDiagram
    participant T as Teacher
    participant B as Browser
    participant API as Next.js API
    participant DB as MongoDB
    participant Email as Email Service
    
    T->>B: 1. เปิดหน้าแบบฟอร์ม /regist100
    B->>B: 2. แสดง PDPA Consent Modal
    T->>B: 3. คลิก "ยอมรับ"
    
    Note over T,B: Steps 1-9: กรอกข้อมูล
    
    loop Auto-save ทุก step
        T->>B: กรอกข้อมูล Step N
        B->>API: POST /api/draft/save
        API->>DB: บันทึก Draft
        DB-->>API: Draft Saved
        API-->>B: Success
        B-->>T: ✅ บันทึกอัตโนมัติ
    end
    
    T->>B: 4. อัปโหลดรูปภาพ
    B->>API: POST /api/draft/upload-image
    API->>API: บันทึกไฟล์ /public/draft-images/
    API-->>B: Image URL
    B-->>T: ✅ แสดง Preview
    
    T->>B: 5. คลิก "ส่งแบบฟอร์ม"
    B->>B: แสดง Contact Modal
    
    T->>B: 6. กรอก Email & Phone
    B->>API: POST /api/auth/check-email
    API->>DB: ตรวจสอบ Email ซ้ำ
    DB-->>API: Email Available
    API-->>B: ✅ Email Valid
    
    T->>B: 7. คลิก "ส่ง OTP"
    B->>API: POST /api/draft/[token]/request-otp
    API->>API: สร้าง OTP 6 หลัก
    API->>DB: บันทึก OTP (hashed)
    API->>Email: ส่งอีเมล OTP
    Email-->>T: 📧 OTP: 123456
    API-->>B: แสดง OTP Modal
    
    T->>B: 8. กรอก OTP
    B->>API: POST /api/draft/[token]/verify-otp
    API->>DB: ตรวจสอบ OTP
    DB-->>API: ✅ OTP Valid
    API-->>B: OTP Verified
    
    T->>B: 9. ยืนยันส่งแบบฟอร์ม
    B->>API: POST /api/register100 (multipart/form-data)
    
    Note over API,DB: Backend Processing
    
    API->>API: 1. Validate Form Data
    API->>API: 2. Calculate Scores (Part 1)
    API->>API: 3. Generate School ID (DCP-XXXX)
    API->>DB: 4. Create User Account
    API->>DB: 5. Save School Data
    API->>DB: 6. Save Submission
    API->>DB: 7. Delete Draft
    DB-->>API: ✅ All Saved
    
    API->>Email: ส่งอีเมล Login Credentials
    Email-->>T: 📧 School ID + Password
    
    API-->>B: Success Response
    B-->>T: ✅ หน้า Success + School ID
\`\`\`

### API Endpoints Used

1. `POST /api/draft/save` - บันทึก draft
2. `POST /api/draft/upload-image` - อัปโหลดรูปภาพ
3. `POST /api/auth/check-email` - ตรวจสอบ email
4. `POST /api/draft/[token]/request-otp` - ขอ OTP
5. `POST /api/draft/[token]/verify-otp` - ยืนยัน OTP
6. `POST /api/register100` - ส่งแบบฟอร์ม

### คะแนนที่คำนวณ (Part 1 - max 100)

- หลักสูตร: 0-20
- คุณวุฒิครู: 5-20
- สนับสนุนต้นสังกัด: 0-5
- สนับสนุนภายนอก: 0-15
- รางวัล: 0-20
- กิจกรรมภายในจังหวัด: 0-5
- กิจกรรมภายนอกจังหวัด: 0-5
- กิจกรรมนอกจังหวัด: 0-5
- ประชาสัมพันธ์: 0-5

---

## Workflow 2: Save Draft Flow

### Mermaid Code

\`\`\`mermaid
sequenceDiagram
    participant T as Teacher
    participant B as Browser
    participant API as Next.js API
    participant DB as MongoDB
    
    T->>B: 1. กรอกข้อมูล Step 1-3
    B->>B: 2. Auto-save triggered
    
    B->>API: POST /api/draft/save
    Note right of API: Rate Limit: 5/hour
    
    alt First Save
        API->>API: สร้าง Draft Token (UUID)
        API->>DB: INSERT Draft
        DB-->>API: Draft Created
        API-->>B: { token, expiresAt: +7 days }
        B->>B: Update URL ?draft=[token]
    else Update Existing
        API->>DB: UPDATE Draft
        DB-->>API: Draft Updated
        API-->>B: { saveCount: N }
    end
    
    B-->>T: ✅ บันทึกอัตโนมัติ
    
    Note over T,B: ครูปิด Browser
    
    T->>B: 3. กลับมาภายหลัง
    T->>B: เปิด URL ?draft=[token]
    
    B->>API: GET /api/draft/[token]
    API->>DB: SELECT Draft
    
    alt Draft Valid
        DB-->>API: Draft Data
        API-->>B: { formData, currentStep }
        B->>B: Restore Form State
        B-->>T: ✅ ข้อมูลเดิมกลับมา
    else Draft Expired
        DB-->>API: null
        API-->>B: 404 Not Found
        B-->>T: ❌ Draft หมดอายุ (>7 วัน)
    end
\`\`\`

### API Endpoints Used

1. `POST /api/draft/save` - บันทึก/อัปเดต draft
2. `GET /api/draft/[token]` - ดึงข้อมูล draft
3. `GET /api/draft/[token]/data` - ดึง formData

### Draft Schema

```javascript
{
  token: "uuid-v4",
  email: "teacher@school.ac.th",
  phone: "0812345678",
  submissionType: "register100" | "register-support",
  formData: { /* all form fields */ },
  currentStep: 3,
  saveCount: 5,
  status: "active",
  expiresAt: Date (now + 7 days),
  createdAt: Date,
  lastSaveAt: Date
}
```

---

## Workflow 3: OTP Verification Flow

### Mermaid Code

\`\`\`mermaid
sequenceDiagram
    participant T as Teacher
    participant B as Browser
    participant API as Next.js API
    participant DB as MongoDB
    participant Email as Email Service
    
    T->>B: 1. คลิก "ส่ง OTP"
    B->>API: POST /api/draft/[token]/request-otp
    Note right of API: Rate Limit: 3/hour
    
    API->>API: Generate 6-digit OTP
    API->>API: Hash OTP (bcrypt)
    API->>DB: Save OTP { otp, email, expiresAt: +5min }
    
    API->>Email: Send Email with OTP
    Email-->>T: 📧 Your OTP: 123456
    
    API-->>B: { success, expiresIn: 300 }
    B-->>T: แสดง OTP Modal
    
    T->>B: 2. กรอก OTP
    B->>API: POST /api/draft/[token]/verify-otp
    
    API->>DB: SELECT OTP
    
    alt OTP Valid
        API->>API: bcrypt.compare(input, hashed)
        API-->>B: { verified: true }
        B->>B: Enable Submit Button
        B-->>T: ✅ OTP ถูกต้อง
    else OTP Invalid
        API->>DB: INCREMENT attempts
        API-->>B: { verified: false, attemptsRemaining: 4 }
        B-->>T: ❌ OTP ไม่ถูกต้อง (เหลือ 4/5)
    else OTP Expired
        API-->>B: { error: "OTP expired" }
        B-->>T: ❌ OTP หมดอายุ (>5 นาที)
    else Too Many Attempts
        API->>DB: LOCK OTP
        API-->>B: { error: "OTP locked" }
        B-->>T: ❌ กรอกผิด 5 ครั้ง กรุณาขอใหม่
    end
\`\`\`

### API Endpoints Used

1. `POST /api/draft/[token]/request-otp` - ขอ OTP
2. `POST /api/draft/[token]/verify-otp` - ยืนยัน OTP

### OTP Rules

- **ความยาว**: 6 หลัก (numeric)
- **อายุ**: 5 นาที
- **Attempts**: สูงสุด 5 ครั้ง
- **Rate Limit**: 3 requests/hour
- **Hash**: bcrypt (rounds=10)

---

## Workflow 4: Admin Login & Dashboard

### Mermaid Code

\`\`\`mermaid
sequenceDiagram
    participant A as Admin
    participant B as Browser
    participant API as Next.js API
    participant DB as MongoDB
    
    A->>B: 1. เปิด /login
    B-->>A: แสดงหน้า Login
    
    A->>B: 2. กรอก Username & Password
    B->>API: POST /api/auth/admin-login
    
    API->>DB: SELECT User WHERE email
    
    alt User Found
        API->>API: bcrypt.compare(password, hash)
        
        alt Password Correct
            API->>API: Generate JWT Token
            API->>API: Set Session Cookie (24h)
            API-->>B: { success, user: { role, ... } }
            
            alt Role: super_admin
                B->>B: Redirect /dcp-admin/dashboard
                B-->>A: ✅ DCP Admin Dashboard
            else Role: admin
                B->>B: Redirect /dashboard
                B-->>A: ✅ School Admin Dashboard
            end
        else Password Wrong
            API-->>B: { error: "Invalid credentials" }
            B-->>A: ❌ รหัสผ่านไม่ถูกต้อง
        end
    else User Not Found
        API-->>B: { error: "User not found" }
        B-->>A: ❌ ไม่พบผู้ใช้งาน
    end
    
    Note over A,B: Admin ทำงานใน Dashboard
    
    A->>B: 3. View Dashboard
    B->>API: GET /api/register100/list?page=1
    Note right of API: Requires Auth Cookie
    
    API->>API: Verify JWT Token
    
    alt Token Valid
        API->>DB: SELECT Registrations
        Note right of DB: Filter by admin jurisdiction
        DB-->>API: Registration List
        API-->>B: { data, pagination }
        B-->>A: ✅ แสดงรายการโรงเรียน
    else Token Invalid/Expired
        API-->>B: 401 Unauthorized
        B->>B: Redirect /login
        B-->>A: ❌ Session หมดอายุ
    end
\`\`\`

### API Endpoints Used

1. `POST /api/auth/admin-login` - Admin login
2. `GET /api/auth/check` - ตรวจสอบ session
3. `GET /api/register100/list` - ดึงรายการ
4. `POST /api/auth/logout` - Logout

---

## Workflow 5: Score Update Flow (Admin)

### Mermaid Code

\`\`\`mermaid
sequenceDiagram
    participant A as DCP Admin
    participant B as Browser
    participant API as Next.js API
    participant DB as MongoDB
    
    A->>B: 1. เปิดหน้ารายละเอียดโรงเรียน
    B->>API: GET /api/register100/[id]
    API->>DB: SELECT Registration
    DB-->>API: Registration Data
    API-->>B: { data: { scores, ... } }
    B-->>A: แสดงข้อมูล + คะแนน Part 1
    
    A->>B: 2. กรอกคะแนน Part 2
    Note over A: video1_score: 45<br/>video2_score: 48
    
    A->>B: 3. คลิก "บันทึก"
    B->>API: PUT /api/register100/[id]?manualEdit=true
    Note right of API: manualEdit=true<br/>เก็บคะแนนทั้งหมด
    
    API->>API: Validate Input
    
    alt Normal Edit (ไม่มี manualEdit)
        API->>API: Recalculate Part 1 Scores
        Note right of API: คำนวณใหม่จาก form data
        API->>API: Keep Part 2 Scores
    else Manual Edit (มี manualEdit=true)
        API->>API: Keep ALL Scores
        Note right of API: ไม่คำนวณใหม่
    end
    
    API->>API: Calculate Total Score
    Note right of API: total = part1 + video1 + video2
    
    API->>API: Calculate Grade
    Note right of API: A: 180+, B+: 160-179, etc.
    
    API->>DB: UPDATE Registration
    DB-->>API: Updated
    
    API-->>B: { success, data: { total_score, grade } }
    B-->>A: ✅ บันทึกสำเร็จ<br/>คะแนนรวม: 193 (Grade A)
\`\`\`

### API Endpoints Used

1. `GET /api/register100/[id]` - ดึงข้อมูล
2. `PUT /api/register100/[id]` - อัปเดตแบบทั่วไป (recalculate Part 1)
3. `PUT /api/register100/[id]?manualEdit=true` - อัปเดตแบบ manual (เก็บทุกคะแนน)

### Score Preservation Logic

```javascript
// Normal Edit
PUT /api/register100/[id]
Body: { reg100_awards: [...] }
→ Recalculate Part 1 scores
→ Keep Part 2 scores (video1_score, video2_score)

// Manual Edit
PUT /api/register100/[id]?manualEdit=true
Body: { video1_score: 48 }
→ Keep ALL scores (no recalculation)
```

---

## Workflow 6: User Management Flow

### Mermaid Code

\`\`\`mermaid
sequenceDiagram
    participant SA as Super Admin
    participant B as Browser
    participant API as Next.js API
    participant DB as MongoDB
    participant Email as Email Service
    
    SA->>B: 1. เปิด /dcp-admin/dashboard/users
    B->>API: GET /api/users?page=1
    API->>DB: SELECT Users
    DB-->>API: User List
    API-->>B: { data, pagination }
    B-->>SA: แสดงรายการผู้ใช้
    
    SA->>B: 2. คลิก "สร้างผู้ใช้ใหม่"
    B->>B: Navigate to /users/create
    B-->>SA: แสดงฟอร์มสร้างผู้ใช้
    
    SA->>B: 3. กรอกข้อมูลผู้ใช้
    Note over SA: email, role, firstName,<br/>lastName, phone, schoolId
    
    SA->>B: 4. คลิก "สร้าง"
    B->>API: POST /api/users
    
    API->>DB: SELECT User WHERE email
    
    alt Email Exists
        API-->>B: { error: "Email already exists" }
        B-->>SA: ❌ อีเมลซ้ำ
    else Email Available
        API->>API: Generate Password (8 chars)
        API->>API: Hash Password (bcrypt)
        API->>DB: INSERT User
        DB-->>API: User Created
        
        API->>Email: Send Credentials Email
        Email-->>SA: 📧 Welcome + Login Info
        
        API-->>B: { success, userId }
        B-->>SA: ✅ สร้างสำเร็จ
    end
    
    Note over SA,B: การแก้ไขผู้ใช้
    
    SA->>B: 5. คลิกแก้ไขผู้ใช้
    B->>API: GET /api/users/[id]
    API->>DB: SELECT User
    DB-->>API: User Data
    API-->>B: { data }
    B-->>SA: แสดงฟอร์มแก้ไข
    
    SA->>B: 6. แก้ไขข้อมูล
    B->>API: PUT /api/users/[id]
    API->>DB: UPDATE User
    DB-->>API: Updated
    API-->>B: { success }
    B-->>SA: ✅ แก้ไขสำเร็จ
    
    Note over SA,B: Reset Password
    
    SA->>B: 7. คลิก "Reset Password"
    B->>API: POST /api/users/[id]/reset-password
    API->>API: Generate New Password
    API->>API: Hash Password
    API->>DB: UPDATE User Password
    API->>Email: Send New Password
    Email-->>SA: 📧 New Password
    API-->>B: { success }
    B-->>SA: ✅ รีเซ็ตสำเร็จ
\`\`\`

### API Endpoints Used

1. `GET /api/users` - รายการผู้ใช้
2. `POST /api/users` - สร้างผู้ใช้
3. `GET /api/users/[id]` - ข้อมูลผู้ใช้
4. `PUT /api/users/[id]` - แก้ไขผู้ใช้
5. `DELETE /api/users/[id]` - ลบผู้ใช้
6. `POST /api/users/[id]/reset-password` - รีเซ็ตรหัสผ่าน

---

## Workflow 7: Export Data Flow

### Mermaid Code

\`\`\`mermaid
sequenceDiagram
    participant A as Admin
    participant B as Browser (React)
    participant API as Next.js API
    participant DB as MongoDB
    
    A->>B: 1. เปิดหน้ารายการโรงเรียน
    B->>API: GET /api/register100/list?loadAll=true
    Note right of API: loadAll=true = ไม่มี pagination
    
    API->>DB: SELECT ALL Registrations
    DB-->>API: All Data
    API-->>B: { data: [...] } (ทุกรายการ)
    B-->>A: แสดงตาราง
    
    A->>B: 2. คลิก "Export CSV"
    
    Note over B: Client-Side Export<br/>(SchoolsDataTable.tsx)
    
    B->>B: Prepare CSV Data
    Note right of B: 23 Columns:<br/>- Basic Info<br/>- Part 1 Scores (9 items)<br/>- Part 2 Scores<br/>- Total & Grade
    
    B->>B: Convert to CSV Format
    Note right of B: UTF-8 with BOM<br/>for Thai characters
    
    B->>B: Create Blob
    B->>B: Trigger Download
    
    B-->>A: ⬇️ register100_export_YYYYMMDD.csv
    
    alt Alternative: Server-Side Export
        A->>B: คลิก "Export Excel"
        B->>API: GET /api/register100/export/excel
        API->>DB: SELECT Registrations
        API->>API: Generate Excel (xlsx)
        API-->>B: Excel File Stream
        B-->>A: ⬇️ register100.xlsx
    end
\`\`\`

### Export Format (CSV)

**Columns** (23 total):
1. school_id
2. school_name
3. province
4. school_level
5. total_score
6. grade
7. teaching_curriculum_score
8. teacher_qualification_score
9. support_from_org_score
10. support_from_external_score
11. award_score
12. activity_within_province_internal_score
13. activity_within_province_external_score
14. activity_outside_province_score
15. pr_activity_score
16. part1_total (calculated)
17. video1_score
18. video2_score
19. part2_total (calculated)
20. status
21. admin_notes
22. created_at
23. updated_at

---

## Workflow 8: Email Notification Flow

### Mermaid Code

\`\`\`mermaid
sequenceDiagram
    participant System as System Event
    participant Queue as Email Queue
    participant Service as Email Service
    participant SMTP as SMTP Server
    participant User as Recipient
    
    Note over System: Trigger Events:<br/>- Registration<br/>- OTP Request<br/>- Password Reset<br/>- User Creation
    
    System->>Queue: Add Email Job
    Note right of Queue: {<br/>  to, subject,<br/>  template, data,<br/>  priority<br/>}
    
    Queue->>Queue: Check Priority
    
    alt High Priority (OTP)
        Queue->>Service: Process Immediately
    else Normal Priority
        Queue->>Service: Process in Order
    end
    
    Service->>Service: Load Email Template
    Service->>Service: Render with Data
    
    Service->>SMTP: Send Email
    Note right of SMTP: SMTP Config:<br/>- Host<br/>- Port<br/>- Auth
    
    alt Send Success
        SMTP-->>User: 📧 Email Delivered
        SMTP-->>Service: Success
        Service->>Queue: Mark Complete
        Queue->>System: Log Success
    else Send Failure
        SMTP-->>Service: Error
        Service->>Queue: Retry (max 3 times)
        
        alt Retry Success
            Service->>SMTP: Resend
            SMTP-->>User: 📧 Email Delivered
        else Max Retries
            Queue->>System: Log Failure
            System-->>System: Alert Admin
        end
    end
\`\`\`

### Email Templates

1. **OTP Email** (`email-otp.html`)
2. **Login Credentials** (`email-login.html`)
3. **Password Reset** (`email-reset.html`)
4. **Welcome Email** (`email-welcome.html`)

---

## Workflow 9: Image Upload & Validation

### Mermaid Code

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant API as Next.js API
    participant FS as File System
    
    U->>B: 1. เลือกไฟล์รูปภาพ
    B->>B: Validate Client-Side
    
    alt File > 1MB
        B-->>U: ❌ ขนาดไฟล์เกิน 1MB
    else Not Image Type
        B-->>U: ❌ กรุณาเลือกไฟล์รูปภาพ
    else Valid
        B->>API: POST /api/draft/upload-image
        Note right of API: multipart/form-data
        
        API->>API: Validate File Size (<= 1MB)
        API->>API: Check MIME Type (image/*)
        API->>API: Check Magic Bytes
        Note right of API: JPEG: FF D8 FF<br/>PNG: 89 50 4E 47
        
        alt Invalid Magic Bytes
            API-->>B: 400 { error: "Invalid file type" }
            B-->>U: ❌ ไฟล์ไม่ใช่รูปภาพจริง
        else Valid Image
            API->>API: Generate Filename
            Note right of API: {token}-{type}-{timestamp}.{ext}
            
            API->>FS: Save to /public/draft-images/
            FS-->>API: File Saved
            
            API-->>B: 200 { imageUrl }
            B->>B: Display Preview
            B-->>U: ✅ แสดง Preview รูปภาพ
        end
    end
\`\`\`

### Image Validation Rules

1. **Size**: Max 1MB
2. **Types**: JPG, PNG, JPEG
3. **Magic Bytes**: Must match actual file type
4. **Filename**: Sanitized and timestamped

---

## Summary Table: All API Endpoints

| Endpoint | Method | Workflow | Auth Required |
|----------|--------|----------|---------------|
| `/api/auth/check-email` | POST | 1,2 | No |
| `/api/auth/admin-login` | POST | 5 | No |
| `/api/auth/logout` | POST | 5 | Yes |
| `/api/register100` | POST | 1 | No |
| `/api/register-support` | POST | 2 | No |
| `/api/register100/list` | GET | 5,9 | Yes (admin) |
| `/api/register100/[id]` | GET | 6 | Yes (admin) |
| `/api/register100/[id]` | PUT | 6 | Yes (admin) |
| `/api/draft/save` | POST | 3 | No |
| `/api/draft/[token]` | GET | 3 | No |
| `/api/draft/[token]/request-otp` | POST | 4 | No |
| `/api/draft/[token]/verify-otp` | POST | 4 | No |
| `/api/draft/upload-image` | POST | 9 | No |
| `/api/users` | GET,POST | 7 | Yes (super_admin) |
| `/api/users/[id]` | GET,PUT,DELETE | 7 | Yes (super_admin) |
| `/api/users/[id]/reset-password` | POST | 7 | Yes (super_admin) |

---

**END OF DOCUMENT**

