# Thai Music Platform - Site Structure (Updated)

## 🏗️ โครงสร้างหน้าเว็บไซต์ทั้งหมด

```
📱 FRONTEND (Public Pages)
│
├── / (Home)
│   └── หน้าแรก - แนะนำโครงการ
│
├── /about
│   └── เกี่ยวกับโครงการ
│
├── /regist100
│   └── 📝 ฟอร์มลงทะเบียนโรงเรียนดนตรีไทย 100%
│       └── 8 Steps Form
│
├── /regist-support
│   └── 📝 ฟอร์มลงทะเบียนโรงเรียนสนับสนุนฯ
│       └── 8 Steps Form
│
├── /certificate
│   └── ตรวจสอบใบรับรอง
│
├── /contract
│   └── เอกสารสัญญา
│
├── /download
│   └── ดาวน์โหลดเอกสาร
│
├── /teacher-login ⭐ NEW
│   ├── Left 60%: Login Form
│   │   ├── Email
│   │   ├── Password
│   │   └── School ID
│   └── Right 40%: Request Password Info
│       └── Link to /request-password
│
└── /request-password ⭐ NEW
    └── ฟอร์มขอรหัสผ่านใหม่
        ├── Email
        └── เบอร์โทรศัพท์

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 ADMIN PORTAL (Admin & Root Level)
│
├── /dcp-admin ⭐ NEW
│   └── Admin Login Page
│       ├── Email
│       └── Password
│
└── /dcp-admin/dashboard ⭐ NEW (Protected)
    │
    ├── 📊 Dashboard (Overview)
    │   ├── สรุปจำนวนโรงเรียนทั้งหมด
    │   ├── สรุปคะแนนรวม
    │   ├── กราฟสถิติ
    │   └── รายการล่าสุด
    │
    ├── 🏫 โรงเรียนดนตรีไทย 100%
    │   ├── /dcp-admin/dashboard/register100
    │   │   ├── Data Table (Search, Filter, Sort)
    │   │   ├── Actions: View, Edit, Delete
    │   │   └── Export to Excel/PDF
    │   │
    │   └── /dcp-admin/dashboard/register100/[id]
    │       ├── View Details (All 8 Steps)
    │       ├── Show Scores
    │       ├── Edit Form
    │       └── Delete Button
    │
    ├── 🎵 โรงเรียนสนับสนุนและส่งเสริม
    │   ├── /dcp-admin/dashboard/register-support
    │   │   ├── Data Table (Search, Filter, Sort)
    │   │   ├── Actions: View, Edit, Delete
    │   │   └── Export to Excel/PDF
    │   │
    │   └── /dcp-admin/dashboard/register-support/[id]
    │       ├── View Details (All 8 Steps)
    │       ├── Show Scores
    │       ├── Edit Form
    │       └── Delete Button
    │
    ├── 👥 User Management
    │   ├── /dcp-admin/dashboard/users
    │   │   ├── Tab: เจ้าหน้าที่ Admin
    │   │   │   ├── Data Table (Search, Filter)
    │   │   │   ├── Columns: ชื่อ, Email, เบอร์โทร, Role, Status
    │   │   │   └── Actions: View, Edit, Delete, Reset Password
    │   │   │
    │   │   └── Tab: ครูผู้สอน (Teachers)
    │   │       ├── Data Table (Search by School)
    │   │       ├── Columns: ชื่อ, Email, โรงเรียน, School ID
    │   │       └── Actions: View, Edit, Reset Password
    │   │
    │   ├── /dcp-admin/dashboard/users/create ⭐ (Root Only)
    │   │   └── Create New Admin/Teacher
    │   │       ├── ชื่อ-นามสกุล
    │   │       ├── เบอร์โทร
    │   │       ├── Email
    │   │       ├── Upload Profile Image
    │   │       ├── Role Selection (Admin/Teacher)
    │   │       ├── School ID (if Teacher)
    │   │       └── Generate Password
    │   │
    │   └── /dcp-admin/dashboard/users/[id]
    │       ├── View User Details
    │       ├── Edit User Info
    │       ├── Reset Password
    │       └── Deactivate/Activate
    │
    ├── 🎓 e-Certificate Management
    │   ├── /dcp-admin/dashboard/certificates
    │   │   ├── Data Table (Search, Filter by Type)
    │   │   ├── Columns: โรงเรียน, ประเภท, วันที่ออก, Status
    │   │   ├── Actions: View, Download PDF, Delete
    │   │   └── Button: สร้างใบประกาศใหม่
    │   │
    │   ├── /dcp-admin/dashboard/certificates/create
    │   │   └── Create Certificate
    │   │       ├── เลือกโรงเรียน (Dropdown)
    │   │       ├── เลือกประเภท (100% / Support)
    │   │       ├── เลือก Template
    │   │       ├── Preview Certificate
    │   │       └── Generate PDF
    │   │
    │   └── /dcp-admin/dashboard/certificates/[id]
    │       ├── View Certificate
    │       ├── Download PDF
    │       └── Delete
    │
    └── 🚪 Logout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👨‍🏫 TEACHER PORTAL (Teacher Level)
│
├── /teacher-login ⭐ (Already Created)
│   └── Teacher Login Page
│
└── /teacher/dashboard ⭐ NEW (Protected)
    │
    ├── 📋 Dashboard (School Details)
    │   └── /teacher/dashboard
    │       ├── View All 8 Steps Data
    │       ├── ❌ NO SCORES SHOWN
    │       ├── Edit Button (Each Section)
    │       └── Save Changes
    │
    ├── 🎓 My Certificate
    │   └── /teacher/certificate
    │       ├── View Certificate (if issued)
    │       ├── Download PDF
    │       └── Share Certificate
    │
    └── 🚪 Logout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔌 API ENDPOINTS

Authentication:
├── POST /api/auth/admin-login ⭐ NEW
├── POST /api/auth/teacher-login ⭐ NEW
├── POST /api/auth/request-password ⭐ NEW
└── POST /api/auth/logout

Users Management:
├── GET    /api/users (List all users)
├── POST   /api/users (Create new user)
├── GET    /api/users/[id] (Get user details)
├── PUT    /api/users/[id] (Update user)
├── DELETE /api/users/[id] (Delete user)
└── POST   /api/users/[id]/reset-password (Reset password)

Certificates:
├── GET    /api/certificates (List all certificates)
├── POST   /api/certificates (Create certificate)
├── GET    /api/certificates/[id] (Get certificate)
├── DELETE /api/certificates/[id] (Delete certificate)
└── GET    /api/certificates/[id]/pdf (Download PDF)

Dashboard Stats:
├── GET /api/dashboard/stats (Admin overview stats)
└── GET /api/dashboard/teacher/[schoolId] (Teacher school data)

Schools (Existing):
├── POST   /api/register100
├── GET    /api/register100/list
├── GET    /api/register100/[id]
├── PUT    /api/register100/[id]
├── DELETE /api/register100/[id]
├── POST   /api/register-support
├── GET    /api/register-support/list
├── GET    /api/register-support/[id]
├── PUT    /api/register-support/[id]
└── DELETE /api/register-support/[id]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🎨 UI Components ที่ต้องสร้าง

### Admin Dashboard Components:
```
components/admin/
├── DashboardStats.tsx (Overview cards)
├── SchoolDataTable.tsx (Reusable table)
├── UserDataTable.tsx (User management table)
├── CertificateDataTable.tsx (Certificate table)
├── CreateUserForm.tsx (Create admin/teacher form)
├── CertificatePreview.tsx (Certificate preview)
└── Sidebar.tsx (Admin navigation)
```

### Teacher Dashboard Components:
```
components/teacher/
├── SchoolDetailsView.tsx (View 8 steps without scores)
├── EditableSection.tsx (Editable form sections)
├── CertificateView.tsx (View certificate)
└── TeacherSidebar.tsx (Teacher navigation)
```

## 🔐 Access Control Matrix

| Route | Root | Admin | Teacher | Public |
|-------|------|-------|---------|--------|
| `/` | ✅ | ✅ | ✅ | ✅ |
| `/regist100` | ✅ | ✅ | ✅ | ✅ |
| `/regist-support` | ✅ | ✅ | ✅ | ✅ |
| `/teacher-login` | ❌ | ❌ | ✅ | ✅ |
| `/dcp-admin` | ✅ | ✅ | ❌ | ❌ |
| `/dcp-admin/dashboard/*` | ✅ | ✅ | ❌ | ❌ |
| `/dcp-admin/users/create` | ✅ | ❌ | ❌ | ❌ |
| `/teacher/dashboard` | ❌ | ❌ | ✅ | ❌ |
| `/teacher/certificate` | ❌ | ❌ | ✅ | ❌ |

## 📊 Database Collections

```javascript
// users
{
  _id: ObjectId,
  email: String,
  password: String, // hashed
  role: 'root' | 'admin' | 'teacher',
  firstName: String,
  lastName: String,
  phone: String,
  profileImage: String,
  schoolId: String, // For teachers
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}

// certificates
{
  _id: ObjectId,
  schoolId: String, // Reference to submission
  schoolName: String,
  certificateType: 'register100' | 'register-support',
  templateId: String,
  certificateNumber: String,
  issueDate: Date,
  pdfUrl: String,
  imageUrl: String,
  isActive: Boolean,
  createdBy: String, // Admin user ID
  createdAt: Date,
  updatedAt: Date
}

// register100_submissions (Existing)
// register_support_submissions (Existing)
```

## 🎯 Key Features Summary

### Admin Features:
1. ✅ Login with email/password
2. 📊 Dashboard overview with stats
3. 🏫 Manage schools (CRUD)
4. 👥 Manage users (CRUD, Root only for create)
5. 🎓 Create & manage certificates
6. 📤 Export data to Excel/PDF
7. 🔍 Search & filter all tables

### Teacher Features:
1. ✅ Login with email/password/schoolId
2. 📋 View school details (no scores)
3. ✏️ Edit school information
4. 🎓 View & download certificate
5. 🔑 Request password via email

### Security Features:
1. 🔐 JWT-based authentication
2. 🔒 Role-based access control
3. 🍪 HttpOnly cookies
4. 🔑 Password hashing (bcrypt)
5. 📧 Email verification for password reset
6. 🚪 Auto-logout on token expiry

---

## 📝 Next Steps (Phase 2)

1. Create Admin Dashboard pages
2. Create Teacher Dashboard pages
3. Implement User Management CRUD
4. Implement Certificate Management
5. Create Dashboard Statistics API
6. Add Export functionality
7. Create Email templates
8. Add file upload for profile images
9. Implement PDF generation for certificates
10. Add audit logs

