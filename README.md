# Thai Music Platform

โครงการคัดเลือกกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์

## 🎯 ภาพรวมระบบ

ระบบลงทะเบียนและจัดการโรงเรียนดนตรีไทย พร้อมระบบ Authentication แบบ Role-based และ Certificate Management

### Features หลัก
- ✅ ระบบ Login แยกตาม Role (Admin/Teacher)
- ✅ Admin Dashboard พร้อม Statistics
- ✅ จัดการโรงเรียน (Register100 & Register-Support)
- ✅ User Management (CRUD)
- ✅ Teacher Portal (ดูข้อมูลโรงเรียนโดยไม่เห็นคะแนน)
- ✅ Certificate Management System
- ✅ Email Service สำหรับ Password Recovery

## โครงสร้างโปรเจค

```
app/
├── (front)/                    # Frontend pages (Public)
│   ├── page.tsx               # Home
│   ├── about/                 # เกี่ยวกับโครงการ
│   ├── certificate/           # ใบรับรอง
│   ├── download/              # ดาวน์โหลดเอกสาร
│   ├── contract/              # สัญญา
│   ├── regist100/             # ลงทะเบียนโรงเรียนดนตรีไทย 100%
│   ├── regist-support/        # ลงทะเบียนโรงเรียนสนับสนุนฯ
│   ├── teacher-login/         # Login สำหรับครู
│   └── request-password/      # ขอรหัสผ่าน
│
├── (admin)/                   # Admin Portal
│   ├── dcp-admin/             # Admin Login
│   └── dcp-admin/dashboard/   # Admin Dashboard
│       ├── page.tsx           # Overview & Statistics
│       ├── register100/       # จัดการโรงเรียน 100%
│       ├── register-support/  # จัดการโรงเรียนสนับสนุน
│       ├── users/             # User Management
│       └── certificates/      # Certificate Management
│
├── (teacher)/                 # Teacher Portal
│   └── teacher/dashboard/     # Teacher Dashboard
│       ├── page.tsx           # ดูข้อมูลโรงเรียน (ไม่มีคะแนน)
│       └── certificate/       # ดูใบประกาศ
│
├── api/                       # API Routes
│   ├── auth/                  # Authentication APIs
│   │   ├── admin-login/       # Admin login
│   │   ├── teacher-login/     # Teacher login
│   │   ├── request-password/  # Request password
│   │   └── logout/            # Logout
│   ├── users/                 # User Management APIs
│   ├── certificates/          # Certificate APIs
│   ├── register100/           # Schools 100% APIs
│   └── register-support/      # Schools Support APIs
│
├── components/                # Shared components
│   ├── admin/                 # Admin components
│   └── teacher/               # Teacher components
│
└── lib/                       # Utilities
    ├── auth/                  # Authentication utilities
    │   ├── password.ts        # Password hashing
    │   └── session.ts         # JWT session management
    ├── email/                 # Email service
    │   └── mailer.ts          # NodeMailer setup
    └── types/                 # TypeScript types
```

## 🚀 การติดตั้ง

### 1. Clone Repository
```bash
git clone <repository-url>
cd registerForm-platform
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
```bash
# Copy .env.example to .env
cp .env.example .env

# แก้ไขค่าใน .env
# - MONGO_ROOT_PASSWORD: รหัสผ่าน MongoDB
# - JWT_SECRET: Secret key สำหรับ JWT
# - GMAIL_USER: Email สำหรับส่ง password recovery
# - GMAIL_APP_PASSWORD: Gmail App Password
# - NEXT_PUBLIC_APP_URL: URL ของแอพ
```

### 4. เริ่ม MongoDB (Docker)
```bash
docker-compose up -d
```

### 5. Setup Database
```bash
node scripts/setup-database.js
```

### 6. เริ่ม Development Server
```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ http://localhost:3000

## 📝 Scripts

```bash
# Development
npm run dev              # เริ่ม development server (http://localhost:3000)

# Production
npm run build            # Build สำหรับ production
npm start                # เริ่ม production server

# Code Quality
npm run lint             # ตรวจสอบ code

# Database
node scripts/setup-database.js  # Setup database และสร้าง Root user

# Testing
npm run test:selenium    # Run Selenium tests
```

## 🔐 User Roles & Access

### Root (System Administrator)
- เข้าสู่ระบบที่: `/dcp-admin`
- สิทธิ์: Full access ทุกอย่าง
- สามารถ: สร้าง/แก้ไข/ลบ users, จัดการโรงเรียน, จัดการใบประกาศ
- ไม่สามารถ: ถูกลบออกจากระบบ

### Admin
- เข้าสู่ระบบที่: `/dcp-admin`
- สิทธิ์: จัดการโรงเรียนและใบประกาศ
- สามารถ: ดู dashboard, จัดการโรงเรียน, จัดการใบประกาศ, ดูรายชื่อ users
- ไม่สามารถ: สร้าง users, ลบ Root users

### Teacher
- เข้าสู่ระบบที่: `/teacher-login` (ต้องใส่ Email + Password + School ID)
- สิทธิ์: ดูข้อมูลโรงเรียนของตัวเอง
- สามารถ: ดูข้อมูลโรงเรียน (ไม่มีคะแนน), ดูใบประกาศ
- ไม่สามารถ: เข้า Admin Dashboard, เห็นคะแนน

## 🎓 การใช้งาน

### Admin Login
1. เปิด `http://localhost:3000/dcp-admin`
2. Login ด้วย:
   - Email: `root@thaimusic.com`
   - Password: `admin123`
3. เข้าสู่ Dashboard

### Teacher Login
1. เปิด `http://localhost:3000/teacher-login`
2. Login ด้วย:
   - Email: อีเมลครู
   - Password: รหัสผ่าน 6 หลัก
   - School ID: รหัสโรงเรียน (SCH-YYYYMMDD-XXXX)
3. เข้าสู่ Teacher Dashboard

### Request Password
1. เปิด `http://localhost:3000/request-password`
2. กรอก Email และเบอร์โทรศัพท์
3. ระบบจะส่ง Email พร้อม Password และ School ID

### สร้าง User ใหม่ (Root only)
1. Login เป็น Root
2. ไปที่ User Management → เพิ่มผู้ใช้งาน
3. กรอกข้อมูล:
   - ชื่อ-นามสกุล
   - เบอร์โทร
   - Email
   - Role (Admin/Teacher)
   - School ID (สำหรับ Teacher)
4. คลิก "สร้างรหัสผ่านอัตโนมัติ"
5. บันทึก

### สร้างใบประกาศ
1. Login เป็น Admin/Root
2. ไปที่ Certificate Management → สร้างใบประกาศ
3. เลือกโรงเรียน
4. เลือก Template
5. ดู Preview
6. บันทึก

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI Components
- React Hook Form
- Zod (Validation)
- Lucide React (Icons)

### Backend
- Next.js API Routes
- MongoDB (Database)
- JWT (Authentication)
- bcryptjs (Password Hashing)
- NodeMailer (Email Service)

### DevOps
- Docker & Docker Compose
- Playwright (E2E Testing)
- Selenium (Testing)

## 📚 API Endpoints

### Authentication
```
POST /api/auth/admin-login          # Admin login
POST /api/auth/teacher-login        # Teacher login (with School ID)
POST /api/auth/request-password     # Request password via email
POST /api/auth/logout               # Logout
```

### Users
```
GET    /api/users                   # List all users
POST   /api/users                   # Create user (Root only)
GET    /api/users/[id]              # Get user by ID
PUT    /api/users/[id]              # Update user
DELETE /api/users/[id]              # Delete user (Root only)
POST   /api/users/[id]/reset-password  # Reset password
```

### Certificates
```
GET    /api/certificates            # List certificates
POST   /api/certificates            # Create certificate
GET    /api/certificates/[id]       # Get certificate
DELETE /api/certificates/[id]       # Delete certificate
```

### Schools (Register100)
```
GET    /api/register100/list        # List schools
POST   /api/register100             # Create school
GET    /api/register100/[id]        # Get school
PUT    /api/register100/[id]        # Update school
DELETE /api/register100/[id]        # Delete school
```

### Schools (Register-Support)
```
GET    /api/register-support/list   # List schools
POST   /api/register-support        # Create school
GET    /api/register-support/[id]   # Get school
PUT    /api/register-support/[id]   # Update school
DELETE /api/register-support/[id]   # Delete school
```

## 🗄️ Database Schema

### users Collection
```javascript
{
  _id: ObjectId,
  email: String,              // unique
  password: String,           // bcrypt hashed
  role: "root" | "admin" | "teacher",
  firstName: String,
  lastName: String,
  phone: String,
  profileImage: String,       // optional
  schoolId: String,           // required for teachers
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### certificates Collection
```javascript
{
  _id: ObjectId,
  schoolId: String,
  schoolName: String,
  certificateType: "register100" | "register-support",
  templateId: String,
  certificateNumber: String,  // CERT-YYYY-XXXX
  issueDate: Date,
  isActive: Boolean,
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### register100_submissions Collection
```javascript
{
  _id: ObjectId,
  schoolId: String,           // SCH-YYYYMMDD-XXXX
  schoolName: String,
  // ... 8 steps data
  totalScore: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- ✅ Password Hashing (bcrypt)
- ✅ JWT Session Management
- ✅ httpOnly Cookies
- ✅ Role-based Access Control
- ✅ Protected API Routes
- ✅ Middleware Authentication
- ✅ CSRF Protection
- ✅ Input Validation (Zod)

## 📦 Environment Variables

สร้างไฟล์ `.env` จาก `.env.example`:

```env
# MongoDB
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=your_secure_password
MONGO_DB=thai_music_school
MONGO_URI=mongodb://root:your_secure_password@mongo:27017/thai_music_school?authSource=admin
MONGODB_URI=mongodb://root:your_secure_password@mongo:27017/thai_music_school?authSource=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Gmail App Password Setup
1. ไปที่ Google Account Settings
2. Security → 2-Step Verification (เปิดใช้งาน)
3. App passwords → สร้าง App password ใหม่
4. Copy password มาใส่ใน `GMAIL_APP_PASSWORD`

## 🐳 Docker Deployment

### Start Services
```bash
docker-compose up -d --build
```

### Check Logs
```bash
docker logs thai-music-web
docker logs thai-music-mongo
```

### Stop Services
```bash
docker-compose down
```

### Access MongoDB
```bash
docker exec -it thai-music-mongo mongosh -u root -p rootpass
```


## 🧪 Testing

### Run Tests
```bash
# Selenium tests
npm run test:selenium

# Playwright tests (if configured)
npx playwright test
```

### Manual Testing Checklist

#### Admin Portal
- [ ] Login ที่ `/dcp-admin`
- [ ] ดู Dashboard statistics
- [ ] ดูรายการโรงเรียน Register100
- [ ] ดูรายการโรงเรียน Register-Support
- [ ] ดูรายละเอียดโรงเรียน
- [ ] ลบโรงเรียน
- [ ] ดูรายชื่อ Users
- [ ] สร้าง User ใหม่ (Root only)
- [ ] Reset password
- [ ] ดูรายการใบประกาศ
- [ ] สร้างใบประกาศ
- [ ] ลบใบประกาศ
- [ ] Logout

#### Teacher Portal
- [ ] Login ที่ `/teacher-login`
- [ ] ดู Dashboard (ไม่มีคะแนน)
- [ ] ดูใบประกาศ
- [ ] Logout

#### Password Recovery
- [ ] Request password ที่ `/request-password`
- [ ] ตรวจสอบ Email ที่ได้รับ

## 📁 โครงสร้างไฟล์สำคัญ

```
registerForm-platform/
├── app/
│   ├── (admin)/dcp-admin/          # Admin portal
│   ├── (teacher)/teacher/          # Teacher portal
│   ├── (front)/                    # Public pages
│   └── api/                        # API routes
├── components/
│   ├── admin/                      # Admin components
│   └── teacher/                    # Teacher components
├── lib/
│   ├── auth/                       # Authentication
│   ├── email/                      # Email service
│   └── types/                      # TypeScript types
├── scripts/
│   └── setup-database.js           # Database setup script
├── tests/                          # Test files
├── docker-compose.yml              # Docker configuration
├── .env.example                    # Environment template
├── DEPLOYMENT-GUIDE.md             # Deployment guide
├── FINAL-SUMMARY.md                # Project summary
└── README.md                       # This file
```

## 🚨 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
docker ps

# Restart MongoDB
docker-compose restart mongo

# Check logs
docker logs thai-music-mongo
```

### JWT Token Error
```bash
# Make sure JWT_SECRET is set in .env
echo $JWT_SECRET

# Generate new secret
openssl rand -base64 32
```

### Email Not Sending
```bash
# Check Gmail credentials in .env
# Make sure 2-Step Verification is enabled
# Make sure App Password is correct (not regular password)
```

### Build Error
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Port Already in Use
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

## 📖 เอกสารเพิ่มเติม

- [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) - คู่มือการ Deploy
- [FINAL-SUMMARY.md](./FINAL-SUMMARY.md) - สรุปโปรเจค
- [AUTHENTICATION-SYSTEM-PHASE1.md](./AUTHENTICATION-SYSTEM-PHASE1.md) - ระบบ Authentication
- [PHASE2-COMPLETE.md](./PHASE2-COMPLETE.md) - Admin Dashboard
- [PHASE3-COMPLETE.md](./PHASE3-COMPLETE.md) - User Management & Teacher Portal

## 🎯 Roadmap

### Phase 1: Authentication ✅
- [x] Admin Login
- [x] Teacher Login
- [x] Password Recovery
- [x] JWT Session
- [x] Role-based Access

### Phase 2: Admin Dashboard ✅
- [x] Dashboard Overview
- [x] Schools Management
- [x] Statistics Cards
- [x] Recent Submissions

### Phase 3: User Management ✅
- [x] User CRUD
- [x] Teacher Portal
- [x] Reset Password
- [x] Role-based UI

### Phase 4: Certificate Management ✅
- [x] Certificate CRUD
- [x] Auto Certificate Number
- [x] Template Selection
- [x] Preview

### Phase 5: Future Features 🔜
- [ ] Edit School Info
- [ ] PDF Generation
- [ ] File Upload
- [ ] Search & Filter
- [ ] Pagination
- [ ] Export to Excel
- [ ] Email Notifications
- [ ] Audit Logs
- [ ] Dashboard Charts

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 👥 Team

- Developer: [Your Name]
- Project: Thai Music Platform
- Organization: กรมส่งเสริมวัฒนธรรม

## 📞 Support

หากพบปัญหาหรือมีคำถาม:
1. ตรวจสอบ logs: `docker logs thai-music-web`
2. ตรวจสอบ MongoDB: `docker exec -it thai-music-mongo mongosh`
3. ตรวจสอบ environment variables ใน `.env`
4. อ่าน [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

---

## 🎉 หมายเหตุ

โปรเจคนี้รวม 2 โปรเจคเดิม:
- `/landing` → `app/(front)/` (home page และ components)
- `/regist` → `app/(front)/regist100/` และ `app/api/register100/` (โรงเรียนดนตรีไทย 100%)
- New: `app/(front)/regist-support/` และ `app/api/register-support/` (โรงเรียนสนับสนุนฯ)

พัฒนาด้วย ❤️ สำหรับโครงการโรงเรียนดนตรีไทย 100%
"# CI/CD Test" 
"# CI/CD Working!" 
