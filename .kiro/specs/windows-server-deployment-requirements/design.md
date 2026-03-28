# เอกสารออกแบบ: การติดตั้ง Software บน Windows Server สำหรับ Thai Music Platform

## Overview

เอกสารนี้ออกแบบสถาปัตยกรรมและขั้นตอนการติดตั้ง Thai Music Platform บน Windows Server โดยจะแปลงจากระบบเดิมที่ใช้ Docker บน AWS Linux มาเป็นการติดตั้งแบบ native บน Windows Server

### วัตถุประสงค์

1. ติดตั้ง Next.js application (Thai Music Platform) บน Windows Server
2. ติดตั้งและกำหนดค่า MongoDB 7.x สำหรับเก็บข้อมูล
3. ตั้งค่า Windows Services เพื่อให้ระบบทำงานอัตโนมัติ
4. กำหนดค่า security และ network ให้เหมาะสม
5. จัดทำระบบ backup และ monitoring

### ขอบเขตของระบบ

**In Scope:**
- การติดตั้ง Node.js 22.x runtime
- การติดตั้ง MongoDB 7.x database server
- การ build และ deploy Next.js application
- การตั้งค่า Windows Services สำหรับ auto-start
- การกำหนดค่า firewall และ network
- การตั้งค่า environment variables
- การจัดการ file uploads
- การตั้งค่า backup และ monitoring (optional: Mongo Express)

**Out of Scope:**
- การติดตั้ง SSL certificate (ใช้ HTTP หรือให้ลูกค้าจัดการเอง)
- การตั้งค่า domain name และ DNS
- การ migrate ข้อมูลจาก production เดิม
- การตั้งค่า load balancing หรือ clustering
- การตั้งค่ง CDN สำหรับ static files

### สถาปัตยกรรมระดับสูง

```
┌─────────────────────────────────────────────────────────────┐
│                    Windows Server 2019+                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Network Layer (Firewall)               │    │
│  │  Port 3000 (HTTP) │ Port 27017 (MongoDB-Internal)  │    │
│  │  Port 8081 (Mongo Express - Optional)              │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌────────────────────────┴───────────────────────────┐    │
│  │         Windows Service Manager (NSSM)             │    │
│  └────────────────────────┬───────────────────────────┘    │
│                           │                                  │
│  ┌────────────────────────┴───────────────────────────┐    │
│  │  Thai Music Platform Service (Node.js Process)     │    │
│  │  - Next.js 16.1.6 Application                      │    │
│  │  - Running on Port 3000                            │    │
│  │  - Environment Variables from System               │    │
│  └────────────────────────┬───────────────────────────┘    │
│                           │                                  │
│                           │ MongoDB Connection               │
│                           │ (localhost:27017)                │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MongoDB 7.x Service (Windows Service)              │  │
│  │  - Database: thai_music_school                      │  │
│  │  - Authentication: Enabled                          │  │
│  │  - Data Directory: C:\data\mongodb                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  File System                                         │  │
│  │  - Application: C:\inetpub\thai-music-platform       │  │
│  │  - Uploads: C:\inetpub\thai-music-platform\public\  │  │
│  │             uploads                                  │  │
│  │  - Logs: C:\logs\thai-music-platform                │  │
│  │  - Backups: C:\backups\thai-music-platform          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Optional: Mongo Express Service                     │  │
│  │  - Web UI for MongoDB Management                     │  │
│  │  - Running on Port 8081                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Internet Connection
                           ↓
                  ┌─────────────────┐
                  │  Gmail SMTP     │
                  │  (Port 587/465) │
                  └─────────────────┘
```



## Architecture

### System Components

ระบบประกอบด้วย components หลัก 4 ส่วน:

#### 1. Application Layer (Next.js Application)
- **Technology**: Next.js 16.1.6 (React 19.2.3)
- **Runtime**: Node.js 22.x
- **Port**: 3000 (HTTP)
- **Process Management**: Windows Service ผ่าน NSSM
- **Dependencies**: 
  - MongoDB driver (mongodb ^7.1.0)
  - Authentication (jose, bcryptjs)
  - Email (nodemailer)
  - File handling (file-type, xlsx)

#### 2. Database Layer (MongoDB)
- **Version**: MongoDB 7.x
- **Port**: 27017 (localhost only)
- **Authentication**: Username/Password (authSource=admin)
- **Database Name**: thai_music_school
- **Collections**:
  - `register100` - ข้อมูลการลงทะเบียนโครงการ 100 ปี
  - `registerSupport` - ข้อมูลการลงทะเบียนสนับสนุน
  - `users` - ข้อมูลผู้ใช้ (admin, teachers)
  - `certificates` - ข้อมูลใบรับรอง
  - `certificateTemplates` - template ใบรับรอง
  - `registrationSettings` - การตั้งค่าระบบลงทะเบียน

#### 3. File Storage Layer
- **Upload Directory**: `C:\inetpub\thai-music-platform\public\uploads`
- **File Types**: รูปภาพ, เอกสาร PDF, ไฟล์ Excel
- **Max File Size**: 10 MB (configurable)
- **Permissions**: Read/Write สำหรับ service account

#### 4. Management Layer (Optional)
- **Mongo Express**: Web-based MongoDB admin interface
- **Port**: 8081
- **Access**: Internal network only

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Deployment Package                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Source Files (from Git Repository)                  │  │
│  │  - app/                                              │  │
│  │  - components/                                       │  │
│  │  - lib/                                              │  │
│  │  - public/                                           │  │
│  │  - package.json, next.config.ts                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Build Process (on Windows Server)                   │  │
│  │  1. npm ci (install dependencies)                    │  │
│  │  2. npm run build (create .next folder)             │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Production Files                                     │  │
│  │  - .next/ (built application)                        │  │
│  │  - node_modules/ (dependencies)                      │  │
│  │  - public/ (static files + uploads)                 │  │
│  │  - package.json                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Windows Service (NSSM)                              │  │
│  │  Command: npm start                                  │  │
│  │  Working Directory: C:\inetpub\thai-music-platform   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Network Architecture

```
                    Internet
                       │
                       │ Port 80/443 (Optional Reverse Proxy)
                       ↓
              ┌─────────────────┐
              │ Windows Firewall │
              └─────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ↓              ↓              ↓
   Port 3000      Port 8081     Port 27017
   (Public)       (Internal)    (Localhost)
        │              │              │
        ↓              ↓              ↓
   Next.js App   Mongo Express   MongoDB
```

**Network Rules:**
- Port 3000: เปิดให้ external access (HTTP)
- Port 8081: เปิดเฉพาะ internal network (Mongo Express)
- Port 27017: bind เฉพาะ localhost (MongoDB)
- Port 587/465: outbound สำหรับ Gmail SMTP

### Data Flow

#### 1. User Request Flow
```
User Browser → Windows Firewall (Port 3000) → Next.js App → 
MongoDB (localhost:27017) → Response → User Browser
```

#### 2. File Upload Flow
```
User Upload → Next.js API Route → Validation → 
Save to C:\inetpub\thai-music-platform\public\uploads → 
Store path in MongoDB → Return URL to User
```

#### 3. Email Notification Flow
```
Application Event → Nodemailer → Gmail SMTP (Port 587) → 
Gmail Server → Recipient Email
```

#### 4. Authentication Flow
```
User Login → Next.js API → MongoDB (users collection) → 
bcrypt password verification → JWT token generation → 
Set cookie → Return to client
```



## Components and Interfaces

### 1. Node.js Runtime Component

**Purpose**: รัน Next.js application

**Installation Method**:
- ดาวน์โหลด Node.js 22.x LTS installer จาก https://nodejs.org
- ติดตั้งแบบ default (รวม npm และ PATH configuration)

**Configuration**:
- เพิ่ม Node.js และ npm เข้า System PATH
- ตรวจสอบด้วย: `node --version` และ `npm --version`

**Interface**:
- Command Line: `node`, `npm`
- Environment: System PATH

### 2. MongoDB Database Component

**Purpose**: เก็บข้อมูล application

**Installation Method**:
- ดาวน์โหลด MongoDB Community Server 7.x จาก https://www.mongodb.com/try/download/community
- เลือก Windows MSI installer
- ติดตั้งแบบ Complete พร้อม MongoDB Compass (optional)
- ตั้งค่าให้รันเป็น Windows Service

**Configuration**:
```yaml
# mongod.cfg (C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg)
systemLog:
  destination: file
  path: C:\data\mongodb\logs\mongod.log
  logAppend: true

storage:
  dbPath: C:\data\mongodb\data

net:
  port: 27017
  bindIp: 127.0.0.1  # localhost only

security:
  authorization: enabled
```

**Interface**:
- Connection String: `mongodb://username:password@localhost:27017/thai_music_school?authSource=admin`
- MongoDB Shell: `mongosh`
- Windows Service: `MongoDB`

## Database Design

### Database Overview

**Database Name**: `thai_music_school`

**Purpose**: เก็บข้อมูลระบบลงทะเบียนโรงเรียนดนตรีไทย รวมถึงข้อมูลผู้ใช้ การลงทะเบียน ใบรับรอง และการตั้งค่าระบบ

**Collections**: 6 collections หลัก

### Collections Schema

```javascript
// users collection
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String, // "system_admin", "dcp_admin", "school_admin", "teacher"
  schoolId: String (optional),
  createdAt: Date,
  updatedAt: Date
}

// register100 collection
{
  _id: ObjectId,
  schoolId: String,
  schoolName: String,
  teacherName: String,
  teacherEmail: String,
  teacherPhone: String,
  studentCount: Number,
  instruments: Array,
  status: String, // "draft", "submitted", "approved", "rejected"
  createdAt: Date,
  updatedAt: Date
}

// registerSupport collection
{
  _id: ObjectId,
  schoolId: String,
  schoolName: String,
  teacherName: String,
  teacherEmail: String,
  supportType: String,
  requestDetails: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}

// certificates collection
{
  _id: ObjectId,
  certificateNumber: String (unique),
  schoolId: String,
  schoolName: String,
  teacherName: String,
  issueDate: Date,
  templateId: ObjectId,
  pdfPath: String,
  createdAt: Date
}
```

### 3. Next.js Application Component

**Purpose**: Web application server

**Build Process**:
```bash
# 1. Install dependencies
npm ci

# 2. Build application
npm run build

# Output: .next folder with optimized production build
```

**Runtime Command**:
```bash
npm start
# หรือ
node .next/standalone/server.js  # ถ้าใช้ standalone output
```

**Configuration Files**:

**package.json** (scripts section):
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

**next.config.ts**:
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // สำหรับ production deployment
  
  // File upload configuration
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
};

export default nextConfig;
```

**Interface**:
- HTTP Server: Port 3000
- API Routes: `/api/*`
- Static Files: `/public/*`
- Uploads: `/public/uploads/*`

### 4. Windows Service Component (NSSM)

**Purpose**: จัดการ application process ให้รันเป็น Windows Service

**Installation Method**:
- ดาวน์โหลด NSSM จาก https://nssm.cc/download
- แตกไฟล์และคัดลอก nssm.exe ไปยัง `C:\Windows\System32`

**Service Configuration**:
```batch
# สร้าง service
nssm install ThaiMusicPlatform "C:\Program Files\nodejs\npm.cmd" start

# ตั้งค่า working directory
nssm set ThaiMusicPlatform AppDirectory "C:\inetpub\thai-music-platform"

# ตั้งค่า environment variables
nssm set ThaiMusicPlatform AppEnvironmentExtra NODE_ENV=production

# ตั้งค่า stdout/stderr logs
nssm set ThaiMusicPlatform AppStdout "C:\logs\thai-music-platform\service-output.log"
nssm set ThaiMusicPlatform AppStderr "C:\logs\thai-music-platform\service-error.log"

# ตั้งค่า auto-restart
nssm set ThaiMusicPlatform AppExit Default Restart
nssm set ThaiMusicPlatform AppRestartDelay 5000

# Start service
nssm start ThaiMusicPlatform
```

**Interface**:
- Windows Services Manager: `services.msc`
- Command Line: `nssm start/stop/restart ThaiMusicPlatform`
- Service Name: `ThaiMusicPlatform`

### 5. Mongo Express Component (Optional)

**Purpose**: Web-based MongoDB management interface

**Installation Method**:
```bash
# Global installation
npm install -g mongo-express

# หรือ local installation
npm install mongo-express
```

**Configuration**:
```javascript
// config.js
module.exports = {
  mongodb: {
    server: 'localhost',
    port: 27017,
    admin: true,
    auth: [
      {
        database: 'thai_music_school',
        username: 'root',
        password: process.env.MONGO_ROOT_PASSWORD
      }
    ]
  },
  site: {
    baseUrl: '/',
    port: 8081,
    host: '0.0.0.0'
  },
  basicAuth: {
    username: 'admin',
    password: process.env.MONGO_EXPRESS_PASSWORD
  }
};
```

**Service Setup** (ใช้ NSSM):
```batch
nssm install MongoExpress "C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\mongo-express\app.js"
nssm set MongoExpress AppDirectory "C:\Program Files\nodejs\node_modules\mongo-express"
nssm set MongoExpress AppEnvironmentExtra MONGO_ROOT_PASSWORD=<password>
nssm start MongoExpress
```

**Interface**:
- Web UI: http://localhost:8081
- Basic Auth: username/password

### Component Dependencies

```
┌─────────────────────────────────────────────────────────┐
│                    Windows Server OS                     │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ↓                  ↓                  ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Node.js    │  │   MongoDB    │  │     NSSM     │
│   Runtime    │  │   Service    │  │   Service    │
│              │  │              │  │   Manager    │
└──────────────┘  └──────────────┘  └──────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                           ↓
                ┌──────────────────┐
                │  Thai Music      │
                │  Platform        │
                │  Application     │
                └──────────────────┘
```



## Data Models

### Environment Variables Model

Application ต้องการ environment variables ดังนี้:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://root:<password>@localhost:27017/thai_music_school?authSource=admin
MONGO_DB=thai_music_school

# JWT Configuration
JWT_SECRET=<generated-secret-32-chars-minimum>

# Email Configuration (Gmail SMTP)
GMAIL_USER=<gmail-address>
GMAIL_APP_PASSWORD=<gmail-app-password>

# Application Configuration
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=http://<server-ip>:3000

# File Upload Configuration (optional)
MAX_FILE_SIZE=10485760
UPLOAD_DIR=public/uploads
```

**การตั้งค่า System Environment Variables บน Windows**:

```powershell
# เปิด PowerShell as Administrator
[System.Environment]::SetEnvironmentVariable('MONGODB_URI', 'mongodb://root:password@localhost:27017/thai_music_school?authSource=admin', 'Machine')
[System.Environment]::SetEnvironmentVariable('JWT_SECRET', '<generated-secret>', 'Machine')
[System.Environment]::SetEnvironmentVariable('GMAIL_USER', '<email>', 'Machine')
[System.Environment]::SetEnvironmentVariable('GMAIL_APP_PASSWORD', '<app-password>', 'Machine')
[System.Environment]::SetEnvironmentVariable('NODE_ENV', 'production', 'Machine')
[System.Environment]::SetEnvironmentVariable('PORT', '3000', 'Machine')
[System.Environment]::SetEnvironmentVariable('NEXT_PUBLIC_APP_URL', 'http://<server-ip>:3000', 'Machine')
```

หรือตั้งค่าผ่าน GUI:
1. เปิด System Properties → Advanced → Environment Variables
2. ใน System variables คลิก New
3. เพิ่มแต่ละตัวแปรตามรายการข้างต้น

### File System Structure Model

```
C:\
├── inetpub\
│   └── thai-music-platform\              # Application root
│       ├── .next\                        # Built application
│       │   ├── server\
│       │   ├── static\
│       │   └── standalone\               # Standalone server (optional)
│       ├── node_modules\                 # Dependencies
│       ├── public\
│       │   ├── uploads\                  # User uploaded files
│       │   │   ├── certificates\
│       │   │   ├── documents\
│       │   │   └── images\
│       │   └── static\                   # Static assets
│       ├── package.json
│       ├── next.config.ts
│       └── .env.production               # Environment file (backup)
│
├── data\
│   └── mongodb\                          # MongoDB data
│       ├── data\                         # Database files
│       └── logs\                         # MongoDB logs
│
├── logs\
│   └── thai-music-platform\             # Application logs
│       ├── service-output.log
│       ├── service-error.log
│       └── application.log
│
└── backups\
    └── thai-music-platform\             # Backup files
        ├── mongodb\                      # Database backups
        │   └── backup_YYYYMMDD_HHMMSS\
        └── uploads\                      # Upload files backups
            └── uploads_YYYYMMDD_HHMMSS\
```

### MongoDB Connection Model

**Connection String Format**:
```
mongodb://[username:password@]host[:port]/[database][?options]
```

**Production Connection String**:
```
mongodb://root:<password>@localhost:27017/thai_music_school?authSource=admin
```

**Connection Options**:
- `authSource=admin`: ใช้ admin database สำหรับ authentication
- `retryWrites=true`: retry write operations automatically
- `w=majority`: write concern (wait for majority acknowledgment)

**Connection Pool Settings** (ใน application code):
```javascript
// lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'production') {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
} else {
  // Development mode: use global variable to preserve connection
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

export default clientPromise;
```

### Security Model

#### 1. MongoDB Security

**User Roles**:
```javascript
// Root user (admin database)
{
  user: "root",
  pwd: "<strong-password>",
  roles: [
    { role: "root", db: "admin" }
  ]
}

// Application user (optional, more secure)
{
  user: "thai_music_app",
  pwd: "<app-password>",
  roles: [
    { role: "readWrite", db: "thai_music_school" }
  ]
}
```

**Password Requirements**:
- ความยาวอย่างน้อย 16 characters
- ประกอบด้วย uppercase, lowercase, numbers, special characters
- ไม่ใช้คำที่เดาง่าย
- สร้างด้วย: `openssl rand -base64 24`

#### 2. JWT Security

**JWT Secret Generation**:
```bash
# Windows PowerShell
$bytes = New-Object byte[] 32
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

**JWT Token Structure**:
```javascript
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    userId: "...",
    email: "...",
    role: "...",
    iat: 1234567890,
    exp: 1234567890
  },
  signature: "..."
}
```

#### 3. File Upload Security

**Allowed File Types**:
```javascript
const ALLOWED_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif'],
  documents: ['application/pdf'],
  spreadsheets: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
};
```

**File Validation**:
```javascript
// Validate file type
import { fileTypeFromBuffer } from 'file-type';

async function validateFile(buffer: Buffer, allowedTypes: string[]) {
  const type = await fileTypeFromBuffer(buffer);
  if (!type || !allowedTypes.includes(type.mime)) {
    throw new Error('Invalid file type');
  }
  return type;
}
```

**File Naming**:
```javascript
// Generate safe filename
import crypto from 'crypto';

function generateSafeFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const hash = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  return `${timestamp}-${hash}${ext}`;
}
```

### Backup Model

**Backup Strategy**:

1. **MongoDB Backup** (Daily):
```batch
@echo off
set BACKUP_DIR=C:\backups\thai-music-platform\mongodb
set DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set DATE=%DATE: =0%

"C:\Program Files\MongoDB\Server\7.0\bin\mongodump.exe" ^
  --uri="mongodb://root:<password>@localhost:27017/thai_music_school?authSource=admin" ^
  --out="%BACKUP_DIR%\backup_%DATE%"

echo Backup completed: %BACKUP_DIR%\backup_%DATE%
```

2. **Uploads Backup** (Daily):
```batch
@echo off
set SOURCE=C:\inetpub\thai-music-platform\public\uploads
set BACKUP_DIR=C:\backups\thai-music-platform\uploads
set DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set DATE=%DATE: =0%

xcopy "%SOURCE%" "%BACKUP_DIR%\uploads_%DATE%\" /E /I /Y

echo Backup completed: %BACKUP_DIR%\uploads_%DATE%
```

3. **Backup Retention**:
- เก็บ daily backups ไว้ 7 วัน
- เก็บ weekly backups ไว้ 4 สัปดาห์
- เก็บ monthly backups ไว้ 12 เดือน

**Restore Process**:

1. **Restore MongoDB**:
```batch
"C:\Program Files\MongoDB\Server\7.0\bin\mongorestore.exe" ^
  --uri="mongodb://root:<password>@localhost:27017" ^
  --drop ^
  "C:\backups\thai-music-platform\mongodb\backup_YYYYMMDD_HHMMSS"
```

2. **Restore Uploads**:
```batch
xcopy "C:\backups\thai-music-platform\uploads\uploads_YYYYMMDD_HHMMSS\*" ^
  "C:\inetpub\thai-music-platform\public\uploads\" /E /I /Y
```



### Collection 1: users

**Purpose**: เก็บข้อมูลผู้ใช้ระบบทั้งหมด รวมถึง admin และครู

**Indexes**:
- `email` (unique): สำหรับ login และป้องกัน duplicate
- `role`: สำหรับ filter ตาม role

#### Data Dictionary

| Field Name | Data Type | Required | Unique | Description | Example | Validation Rules |
|------------|-----------|----------|--------|-------------|---------|------------------|
| _id | ObjectId | Yes | Yes | Primary key ที่ MongoDB สร้างอัตโนมัติ | `ObjectId("507f1f77bcf86cd799439011")` | Auto-generated |
| email | String | Yes | Yes | Email address สำหรับ login | `"admin@thaimusic.com"` | Valid email format, lowercase |
| password | String | Yes | No | Password ที่ hash ด้วย bcrypt | `"$2a$10$..."` | Hashed with bcrypt (salt rounds: 10) |
| name | String | Yes | No | ชื่อ-นามสกุล ของผู้ใช้ | `"นายสมชาย ใจดี"` | Min length: 2, Max length: 100 |
| role | String | Yes | No | บทบาทของผู้ใช้ในระบบ | `"system_admin"` | Enum: `"system_admin"`, `"dcp_admin"`, `"school_admin"`, `"teacher"` |
| schoolId | String | No | No | รหัสโรงเรียน (สำหรับ school_admin และ teacher) | `"1234567890"` | 10 digits, required if role is school_admin or teacher |
| schoolName | String | No | No | ชื่อโรงเรียน | `"โรงเรียนดนตรีไทยกรุงเทพ"` | Max length: 200 |
| createdAt | Date | Yes | No | วันที่สร้าง record | `ISODate("2024-01-15T10:30:00Z")` | Auto-generated on insert |
| updatedAt | Date | Yes | No | วันที่แก้ไข record ล่าสุด | `ISODate("2024-01-20T14:45:00Z")` | Auto-updated on modification |

**Role Descriptions**:
- `system_admin`: ผู้ดูแลระบบระดับสูงสุด มีสิทธิ์เข้าถึงทุกอย่าง
- `dcp_admin`: ผู้ดูแลจาก DCP (กรมส่งเสริมวัฒนธรรม) จัดการข้อมูลทั้งระบบ
- `school_admin`: ผู้ดูแลระดับโรงเรียน จัดการข้อมูลของโรงเรียนตนเอง
- `teacher`: ครูผู้สอน สามารถลงทะเบียนและดูข้อมูลของตนเอง



### Collection 2: register100

**Purpose**: เก็บข้อมูลการลงทะเบียนโครงการ "100 ปี ดนตรีไทย"

**Indexes**:
- `schoolId`: สำหรับค้นหาตามโรงเรียน
- `createdAt`: สำหรับเรียงลำดับตามวันที่
- `teacherEmail`: สำหรับค้นหาตามครู

#### Data Dictionary

| Field Name | Data Type | Required | Unique | Description | Example | Validation Rules |
|------------|-----------|----------|--------|-------------|---------|------------------|
| _id | ObjectId | Yes | Yes | Primary key | `ObjectId("507f1f77bcf86cd799439011")` | Auto-generated |
| schoolId | String | Yes | No | รหัสโรงเรียน 10 หลัก | `"1234567890"` | 10 digits |
| schoolName | String | Yes | No | ชื่อโรงเรียน | `"โรงเรียนดนตรีไทยกรุงเทพ"` | Max length: 200 |
| schoolAddress | String | Yes | No | ที่อยู่โรงเรียน | `"123 ถนนพระราม 4 กรุงเทพฯ"` | Max length: 500 |
| schoolProvince | String | Yes | No | จังหวัด | `"กรุงเทพมหานคร"` | Max length: 100 |
| schoolDistrict | String | Yes | No | อำเภอ/เขต | `"ปทุมวัน"` | Max length: 100 |
| schoolSubDistrict | String | Yes | No | ตำบล/แขวง | `"ปทุมวัน"` | Max length: 100 |
| schoolPostalCode | String | Yes | No | รหัสไปรษณีย์ | `"10330"` | 5 digits |
| schoolPhone | String | Yes | No | เบอร์โทรศัพท์โรงเรียน | `"02-123-4567"` | Phone format |
| teacherName | String | Yes | No | ชื่อ-นามสกุล ครูผู้สอน | `"นายสมชาย ใจดี"` | Max length: 100 |
| teacherEmail | String | Yes | No | Email ครูผู้สอน | `"somchai@school.ac.th"` | Valid email format |
| teacherPhone | String | Yes | No | เบอร์โทรศัพท์ครู | `"081-234-5678"` | Mobile phone format (10 digits) |
| teacherIdCard | String | Yes | No | เลขบัตรประชาชนครู | `"1234567890123"` | 13 digits |
| studentCount | Number | Yes | No | จำนวนนักเรียนที่เข้าร่วม | `50` | Integer, min: 1, max: 1000 |
| instruments | Array | Yes | No | รายการเครื่องดนตรีที่สอน | `["ระนาดเอก", "ฆ้องวงใหญ่"]` | Array of strings, min length: 1 |
| teacherCount | Number | No | No | จำนวนครูผู้สอน | `3` | Integer, min: 1 |
| status | String | Yes | No | สถานะการลงทะเบียน | `"submitted"` | Enum: `"draft"`, `"submitted"`, `"approved"`, `"rejected"` |
| submittedAt | Date | No | No | วันที่ส่งลงทะเบียน | `ISODate("2024-01-15T10:30:00Z")` | Set when status changes to submitted |
| approvedAt | Date | No | No | วันที่อนุมัติ | `ISODate("2024-01-20T14:45:00Z")` | Set when status changes to approved |
| approvedBy | ObjectId | No | No | ผู้อนุมัติ (reference to users._id) | `ObjectId("507f1f77bcf86cd799439011")` | Reference to users collection |
| rejectedAt | Date | No | No | วันที่ปฏิเสธ | `ISODate("2024-01-18T09:15:00Z")` | Set when status changes to rejected |
| rejectedBy | ObjectId | No | No | ผู้ปฏิเสธ (reference to users._id) | `ObjectId("507f1f77bcf86cd799439011")` | Reference to users collection |
| rejectionReason | String | No | No | เหตุผลที่ปฏิเสธ | `"ข้อมูลไม่ครบถ้วน"` | Max length: 500 |
| notes | String | No | No | หมายเหตุเพิ่มเติม | `"โรงเรียนมีความพร้อมสูง"` | Max length: 1000 |
| attachments | Array | No | No | ไฟล์แนบ (URLs) | `["/uploads/documents/file1.pdf"]` | Array of strings (file paths) |
| createdAt | Date | Yes | No | วันที่สร้าง record | `ISODate("2024-01-15T10:30:00Z")` | Auto-generated |
| updatedAt | Date | Yes | No | วันที่แก้ไข record ล่าสุด | `ISODate("2024-01-20T14:45:00Z")` | Auto-updated |

**Status Flow**:
1. `draft` → `submitted` → `approved` หรือ `rejected`
2. ไม่สามารถย้อนกลับจาก `approved` หรือ `rejected` ได้



### Collection 3: registerSupport

**Purpose**: เก็บข้อมูลการลงทะเบียนขอรับการสนับสนุนจากโครงการ

**Indexes**:
- `schoolId`: สำหรับค้นหาตามโรงเรียน
- `createdAt`: สำหรับเรียงลำดับตามวันที่
- `teacherEmail`: สำหรับค้นหาตามครู

#### Data Dictionary

| Field Name | Data Type | Required | Unique | Description | Example | Validation Rules |
|------------|-----------|----------|--------|-------------|---------|------------------|
| _id | ObjectId | Yes | Yes | Primary key | `ObjectId("507f1f77bcf86cd799439011")` | Auto-generated |
| schoolId | String | Yes | No | รหัสโรงเรียน 10 หลัก | `"1234567890"` | 10 digits |
| schoolName | String | Yes | No | ชื่อโรงเรียน | `"โรงเรียนดนตรีไทยกรุงเทพ"` | Max length: 200 |
| schoolAddress | String | Yes | No | ที่อยู่โรงเรียน | `"123 ถนนพระราม 4 กรุงเทพฯ"` | Max length: 500 |
| schoolProvince | String | Yes | No | จังหวัด | `"กรุงเทพมหานคร"` | Max length: 100 |
| schoolDistrict | String | Yes | No | อำเภอ/เขต | `"ปทุมวัน"` | Max length: 100 |
| schoolSubDistrict | String | Yes | No | ตำบล/แขวง | `"ปทุมวัน"` | Max length: 100 |
| schoolPostalCode | String | Yes | No | รหัสไปรษณีย์ | `"10330"` | 5 digits |
| schoolPhone | String | Yes | No | เบอร์โทรศัพท์โรงเรียน | `"02-123-4567"` | Phone format |
| teacherName | String | Yes | No | ชื่อ-นามสกุล ครูผู้สอน | `"นายสมชาย ใจดี"` | Max length: 100 |
| teacherEmail | String | Yes | No | Email ครูผู้สอน | `"somchai@school.ac.th"` | Valid email format |
| teacherPhone | String | Yes | No | เบอร์โทรศัพท์ครู | `"081-234-5678"` | Mobile phone format (10 digits) |
| teacherIdCard | String | Yes | No | เลขบัตรประชาชนครู | `"1234567890123"` | 13 digits |
| teacherCount | Number | Yes | No | จำนวนครูผู้สอนทั้งหมด | `5` | Integer, min: 1, max: 50 |
| teachers | Array | Yes | No | รายชื่อครูผู้สอนทั้งหมด | `[{name: "นายสมชาย", subject: "ระนาดเอก"}]` | Array of objects with name and subject |
| supportType | String | Yes | No | ประเภทการสนับสนุนที่ขอ | `"instruments"` | Enum: `"instruments"`, `"training"`, `"budget"`, `"other"` |
| requestDetails | String | Yes | No | รายละเอียดการขอรับการสนับสนุน | `"ขอรับเครื่องดนตรี..."` | Max length: 2000 |
| requestedInstruments | Array | No | No | รายการเครื่องดนตรีที่ขอ | `["ระนาดเอก", "ฆ้องวงใหญ่"]` | Array of strings |
| requestedBudget | Number | No | No | งบประมาณที่ขอ (บาท) | `50000` | Number, min: 0 |
| currentSituation | String | No | No | สถานการณ์ปัจจุบันของโรงเรียน | `"มีเครื่องดนตรีเก่า..."` | Max length: 1000 |
| expectedOutcome | String | No | No | ผลที่คาดหวังจากการได้รับการสนับสนุน | `"นักเรียนได้เรียนรู้..."` | Max length: 1000 |
| status | String | Yes | No | สถานะการลงทะเบียน | `"submitted"` | Enum: `"draft"`, `"submitted"`, `"under_review"`, `"approved"`, `"rejected"` |
| submittedAt | Date | No | No | วันที่ส่งลงทะเบียน | `ISODate("2024-01-15T10:30:00Z")` | Set when status changes to submitted |
| reviewedAt | Date | No | No | วันที่เริ่มพิจารณา | `ISODate("2024-01-16T09:00:00Z")` | Set when status changes to under_review |
| approvedAt | Date | No | No | วันที่อนุมัติ | `ISODate("2024-01-20T14:45:00Z")` | Set when status changes to approved |
| approvedBy | ObjectId | No | No | ผู้อนุมัติ (reference to users._id) | `ObjectId("507f1f77bcf86cd799439011")` | Reference to users collection |
| approvedAmount | Number | No | No | งบประมาณที่อนุมัติ (บาท) | `40000` | Number, min: 0 |
| rejectedAt | Date | No | No | วันที่ปฏิเสธ | `ISODate("2024-01-18T09:15:00Z")` | Set when status changes to rejected |
| rejectedBy | ObjectId | No | No | ผู้ปฏิเสธ (reference to users._id) | `ObjectId("507f1f77bcf86cd799439011")` | Reference to users collection |
| rejectionReason | String | No | No | เหตุผลที่ปฏิเสธ | `"งบประมาณไม่เพียงพอ"` | Max length: 500 |
| notes | String | No | No | หมายเหตุเพิ่มเติม | `"ควรพิจารณาในรอบถัดไป"` | Max length: 1000 |
| attachments | Array | No | No | ไฟล์แนบ (URLs) | `["/uploads/documents/proposal.pdf"]` | Array of strings (file paths) |
| createdAt | Date | Yes | No | วันที่สร้าง record | `ISODate("2024-01-15T10:30:00Z")` | Auto-generated |
| updatedAt | Date | Yes | No | วันที่แก้ไข record ล่าสุด | `ISODate("2024-01-20T14:45:00Z")` | Auto-updated |

**Support Types**:
- `instruments`: ขอรับเครื่องดนตรี
- `training`: ขอรับการอบรม
- `budget`: ขอรับงบประมาณ
- `other`: อื่นๆ

**Status Flow**:
1. `draft` → `submitted` → `under_review` → `approved` หรือ `rejected`



### Collection 4: certificates

**Purpose**: เก็บข้อมูลใบรับรองที่ออกให้กับโรงเรียนหรือครู

**Indexes**:
- `schoolId`: สำหรับค้นหาตามโรงเรียน
- `certificateNumber` (unique): สำหรับค้นหาและป้องกัน duplicate

#### Data Dictionary

| Field Name | Data Type | Required | Unique | Description | Example | Validation Rules |
|------------|-----------|----------|--------|-------------|---------|------------------|
| _id | ObjectId | Yes | Yes | Primary key | `ObjectId("507f1f77bcf86cd799439011")` | Auto-generated |
| certificateNumber | String | Yes | Yes | เลขที่ใบรับรอง (unique) | `"CERT-2024-001234"` | Format: CERT-YYYY-NNNNNN |
| certificateType | String | Yes | No | ประเภทใบรับรอง | `"participation"` | Enum: `"participation"`, `"achievement"`, `"completion"` |
| schoolId | String | Yes | No | รหัสโรงเรียน | `"1234567890"` | 10 digits |
| schoolName | String | Yes | No | ชื่อโรงเรียน | `"โรงเรียนดนตรีไทยกรุงเทพ"` | Max length: 200 |
| recipientType | String | Yes | No | ประเภทผู้รับใบรับรอง | `"school"` | Enum: `"school"`, `"teacher"`, `"student"` |
| recipientName | String | Yes | No | ชื่อผู้รับใบรับรอง | `"นายสมชาย ใจดี"` | Max length: 100 |
| teacherName | String | No | No | ชื่อครูผู้รับผิดชอบ | `"นายสมชาย ใจดี"` | Max length: 100 |
| teacherEmail | String | No | No | Email ครู | `"somchai@school.ac.th"` | Valid email format |
| programName | String | Yes | No | ชื่อโครงการ | `"โครงการ 100 ปี ดนตรีไทย"` | Max length: 200 |
| programYear | Number | Yes | No | ปีของโครงการ | `2024` | Integer, YYYY format |
| issueDate | Date | Yes | No | วันที่ออกใบรับรอง | `ISODate("2024-01-20T00:00:00Z")` | Date only (no time) |
| expiryDate | Date | No | No | วันที่หมดอายุ (ถ้ามี) | `ISODate("2025-01-20T00:00:00Z")` | Date only, must be after issueDate |
| templateId | ObjectId | Yes | No | Template ที่ใช้ (reference to certificateTemplates._id) | `ObjectId("507f1f77bcf86cd799439011")` | Reference to certificateTemplates |
| pdfPath | String | Yes | No | Path ของไฟล์ PDF | `"/uploads/certificates/cert-001234.pdf"` | File path |
| pdfUrl | String | No | No | Public URL ของ PDF | `"http://server/uploads/certificates/cert-001234.pdf"` | Full URL |
| qrCode | String | No | No | QR Code สำหรับตรวจสอบความถูกต้อง | `"data:image/png;base64,..."` | Base64 encoded image |
| verificationCode | String | No | No | รหัสตรวจสอบความถูกต้อง | `"VER-2024-ABC123"` | Alphanumeric, 16 characters |
| issuedBy | ObjectId | Yes | No | ผู้ออกใบรับรอง (reference to users._id) | `ObjectId("507f1f77bcf86cd799439011")` | Reference to users collection |
| issuedByName | String | Yes | No | ชื่อผู้ออกใบรับรอง | `"นายผู้อำนวยการ"` | Max length: 100 |
| issuedByPosition | String | Yes | No | ตำแหน่งผู้ออกใบรับรอง | `"ผู้อำนวยการกรม"` | Max length: 100 |
| status | String | Yes | No | สถานะใบรับรอง | `"active"` | Enum: `"active"`, `"revoked"`, `"expired"` |
| revokedAt | Date | No | No | วันที่เพิกถอน | `ISODate("2024-06-15T10:00:00Z")` | Set when status changes to revoked |
| revokedBy | ObjectId | No | No | ผู้เพิกถอน (reference to users._id) | `ObjectId("507f1f77bcf86cd799439011")` | Reference to users collection |
| revocationReason | String | No | No | เหตุผลที่เพิกถอน | `"ข้อมูลไม่ถูกต้อง"` | Max length: 500 |
| metadata | Object | No | No | ข้อมูลเพิ่มเติม (flexible) | `{achievement: "รางวัลชนะเลิศ"}` | JSON object |
| createdAt | Date | Yes | No | วันที่สร้าง record | `ISODate("2024-01-20T10:30:00Z")` | Auto-generated |
| updatedAt | Date | Yes | No | วันที่แก้ไข record ล่าสุด | `ISODate("2024-01-20T14:45:00Z")` | Auto-updated |

**Certificate Types**:
- `participation`: ใบรับรองการเข้าร่วมโครงการ
- `achievement`: ใบรับรองความสำเร็จ/รางวัล
- `completion`: ใบรับรองการผ่านหลักสูตร

**Recipient Types**:
- `school`: ใบรับรองสำหรับโรงเรียน
- `teacher`: ใบรับรองสำหรับครู
- `student`: ใบรับรองสำหรับนักเรียน



### Collection 5: certificateTemplates

**Purpose**: เก็บ template สำหรับสร้างใบรับรอง

**Indexes**:
- `templateCode` (unique): สำหรับค้นหาและป้องกัน duplicate
- `isActive`: สำหรับ filter template ที่ใช้งานอยู่

#### Data Dictionary

| Field Name | Data Type | Required | Unique | Description | Example | Validation Rules |
|------------|-----------|----------|--------|-------------|---------|------------------|
| _id | ObjectId | Yes | Yes | Primary key | `ObjectId("507f1f77bcf86cd799439011")` | Auto-generated |
| templateCode | String | Yes | Yes | รหัส template (unique) | `"TMPL-PART-001"` | Alphanumeric with dash |
| templateName | String | Yes | No | ชื่อ template | `"ใบรับรองการเข้าร่วมโครงการ"` | Max length: 200 |
| templateType | String | Yes | No | ประเภท template | `"participation"` | Enum: `"participation"`, `"achievement"`, `"completion"` |
| description | String | No | No | คำอธิบาย template | `"ใช้สำหรับโครงการ 100 ปี"` | Max length: 500 |
| layout | String | Yes | No | รูปแบบ layout | `"portrait"` | Enum: `"portrait"`, `"landscape"` |
| pageSize | String | Yes | No | ขนาดกระดาษ | `"A4"` | Enum: `"A4"`, `"A5"`, `"Letter"` |
| backgroundImage | String | No | No | รูปภาพพื้นหลัง (path) | `"/uploads/templates/bg-001.jpg"` | File path |
| logoImage | String | No | No | รูปภาพโลโก้ (path) | `"/uploads/templates/logo-dcp.png"` | File path |
| headerText | String | No | No | ข้อความส่วนหัว | `"กรมส่งเสริมวัฒนธรรม"` | Max length: 200 |
| footerText | String | No | No | ข้อความส่วนท้าย | `"ออกโดยกรมส่งเสริมวัฒนธรรม"` | Max length: 200 |
| bodyTemplate | String | Yes | No | Template HTML สำหรับเนื้อหา | `"<div>{{recipientName}}</div>"` | HTML with placeholders |
| placeholders | Array | Yes | No | รายการ placeholders ที่ใช้ได้ | `["recipientName", "schoolName"]` | Array of strings |
| styles | Object | No | No | CSS styles | `{fontSize: "16px", color: "#000"}` | JSON object with CSS properties |
| fonts | Array | No | No | Fonts ที่ใช้ | `["THSarabunNew", "Angsana"]` | Array of font names |
| isActive | Boolean | Yes | No | สถานะการใช้งาน | `true` | Boolean |
| isDefault | Boolean | Yes | No | เป็น template default หรือไม่ | `false` | Boolean |
| version | Number | Yes | No | เวอร์ชันของ template | `1` | Integer, starts from 1 |
| previousVersion | ObjectId | No | No | Template เวอร์ชันก่อนหน้า | `ObjectId("507f1f77bcf86cd799439011")` | Reference to self |
| createdBy | ObjectId | Yes | No | ผู้สร้าง template (reference to users._id) | `ObjectId("507f1f77bcf86cd799439011")` | Reference to users collection |
| createdAt | Date | Yes | No | วันที่สร้าง record | `ISODate("2024-01-15T10:30:00Z")` | Auto-generated |
| updatedAt | Date | Yes | No | วันที่แก้ไข record ล่าสุด | `ISODate("2024-01-20T14:45:00Z")` | Auto-updated |

**Placeholder Examples**:
- `{{recipientName}}`: ชื่อผู้รับใบรับรอง
- `{{schoolName}}`: ชื่อโรงเรียน
- `{{certificateNumber}}`: เลขที่ใบรับรอง
- `{{issueDate}}`: วันที่ออกใบรับรอง
- `{{programName}}`: ชื่อโครงการ
- `{{issuedByName}}`: ชื่อผู้ออกใบรับรอง



### Collection 6: registrationSettings

**Purpose**: เก็บการตั้งค่าระบบลงทะเบียน เช่น เปิด/ปิดการลงทะเบียน กำหนดวันที่

**Indexes**:
- `settingKey` (unique): สำหรับค้นหาการตั้งค่าแต่ละประเภท

#### Data Dictionary

| Field Name | Data Type | Required | Unique | Description | Example | Validation Rules |
|------------|-----------|----------|--------|-------------|---------|------------------|
| _id | ObjectId | Yes | Yes | Primary key | `ObjectId("507f1f77bcf86cd799439011")` | Auto-generated |
| settingKey | String | Yes | Yes | Key สำหรับระบุการตั้งค่า | `"register100_enabled"` | Alphanumeric with underscore |
| settingName | String | Yes | No | ชื่อการตั้งค่า | `"เปิด/ปิดการลงทะเบียนโครงการ 100 ปี"` | Max length: 200 |
| settingType | String | Yes | No | ประเภทของค่า | `"boolean"` | Enum: `"boolean"`, `"string"`, `"number"`, `"date"`, `"array"`, `"object"` |
| settingValue | Mixed | Yes | No | ค่าของการตั้งค่า | `true` | Type depends on settingType |
| description | String | No | No | คำอธิบายการตั้งค่า | `"เปิดให้ลงทะเบียนได้"` | Max length: 500 |
| category | String | Yes | No | หมวดหมู่การตั้งค่า | `"registration"` | Enum: `"registration"`, `"system"`, `"notification"`, `"display"` |
| isPublic | Boolean | Yes | No | แสดงให้ผู้ใช้ทั่วไปเห็นหรือไม่ | `true` | Boolean |
| isEditable | Boolean | Yes | No | แก้ไขได้หรือไม่ | `true` | Boolean |
| validationRules | Object | No | No | กฎการ validate ค่า | `{min: 0, max: 100}` | JSON object |
| defaultValue | Mixed | No | No | ค่า default | `false` | Type depends on settingType |
| lastModifiedBy | ObjectId | No | No | ผู้แก้ไขล่าสุด (reference to users._id) | `ObjectId("507f1f77bcf86cd799439011")` | Reference to users collection |
| createdAt | Date | Yes | No | วันที่สร้าง record | `ISODate("2024-01-15T10:30:00Z")` | Auto-generated |
| updatedAt | Date | Yes | No | วันที่แก้ไข record ล่าสุด | `ISODate("2024-01-20T14:45:00Z")` | Auto-updated |

**Common Setting Keys**:

| Setting Key | Type | Description | Example Value |
|-------------|------|-------------|---------------|
| `register100_enabled` | boolean | เปิด/ปิดการลงทะเบียนโครงการ 100 ปี | `true` |
| `register100_start_date` | date | วันที่เริ่มเปิดลงทะเบียน | `ISODate("2024-01-01")` |
| `register100_end_date` | date | วันที่ปิดลงทะเบียน | `ISODate("2024-12-31")` |
| `register_support_enabled` | boolean | เปิด/ปิดการลงทะเบียนขอรับการสนับสนุน | `true` |
| `register_support_start_date` | date | วันที่เริ่มเปิดลงทะเบียน | `ISODate("2024-01-01")` |
| `register_support_end_date` | date | วันที่ปิดลงทะเบียน | `ISODate("2024-12-31")` |
| `max_students_per_school` | number | จำนวนนักเรียนสูงสุดต่อโรงเรียน | `1000` |
| `max_teachers_per_school` | number | จำนวนครูสูงสุดต่อโรงเรียน | `50` |
| `email_notifications_enabled` | boolean | เปิด/ปิดการส่ง email แจ้งเตือน | `true` |
| `maintenance_mode` | boolean | โหมดปิดปรับปรุงระบบ | `false` |
| `maintenance_message` | string | ข้อความแจ้งเตือนเมื่อปิดปรับปรุง | `"ระบบปิดปรับปรุง..."` |
| `announcement_message` | string | ข้อความประกาศ | `"ขอแสดงความยินดี..."` |
| `contact_email` | string | Email ติดต่อ | `"support@thaimusic.go.th"` |
| `contact_phone` | string | เบอร์โทรติดต่อ | `"02-123-4567"` |

**Categories**:
- `registration`: การตั้งค่าเกี่ยวกับการลงทะเบียน
- `system`: การตั้งค่าระบบทั่วไป
- `notification`: การตั้งค่าการแจ้งเตือน
- `display`: การตั้งค่าการแสดงผล



### Database Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                     Database Relationships                       │
└─────────────────────────────────────────────────────────────────┘

users (1) ──────────────────> (N) register100
  │                              │ approvedBy, rejectedBy
  │                              │
  ├──────────────────> (N) registerSupport
  │                              │ approvedBy, rejectedBy, reviewedBy
  │                              │
  ├──────────────────> (N) certificates
  │                              │ issuedBy, revokedBy
  │                              │
  └──────────────────> (N) certificateTemplates
                                 │ createdBy

certificateTemplates (1) ────> (N) certificates
                                 │ templateId

certificateTemplates (1) ────> (1) certificateTemplates
                                 │ previousVersion (self-reference)

users (1) ──────────────────> (N) registrationSettings
                                 │ lastModifiedBy
```

### Data Integrity Rules

1. **Referential Integrity**:
   - ทุก ObjectId reference ต้องชี้ไปยัง document ที่มีอยู่จริง
   - ไม่อนุญาตให้ลบ user ที่มี reference จาก collections อื่น

2. **Unique Constraints**:
   - `users.email`: ต้องไม่ซ้ำกัน
   - `certificates.certificateNumber`: ต้องไม่ซ้ำกัน
   - `certificateTemplates.templateCode`: ต้องไม่ซ้ำกัน
   - `registrationSettings.settingKey`: ต้องไม่ซ้ำกัน

3. **Required Fields**:
   - ทุก collection ต้องมี `createdAt` และ `updatedAt`
   - ทุก collection ต้องมี `_id` (auto-generated)

4. **Status Transitions**:
   - `register100.status`: draft → submitted → approved/rejected
   - `registerSupport.status`: draft → submitted → under_review → approved/rejected
   - `certificates.status`: active → revoked/expired

5. **Date Validations**:
   - `expiryDate` ต้องมากกว่า `issueDate`
   - `approvedAt` ต้องมากกว่า `submittedAt`
   - `end_date` ต้องมากกว่า `start_date`

### Indexes Summary

| Collection | Index Fields | Type | Purpose |
|------------|--------------|------|---------|
| users | email | Unique | Login และป้องกัน duplicate |
| users | role | Regular | Filter by role |
| register100 | schoolId | Regular | ค้นหาตามโรงเรียน |
| register100 | createdAt | Regular | เรียงลำดับตามวันที่ |
| register100 | teacherEmail | Regular | ค้นหาตามครู |
| registerSupport | schoolId | Regular | ค้นหาตามโรงเรียน |
| registerSupport | createdAt | Regular | เรียงลำดับตามวันที่ |
| registerSupport | teacherEmail | Regular | ค้นหาตามครู |
| certificates | schoolId | Regular | ค้นหาตามโรงเรียน |
| certificates | certificateNumber | Unique | ค้นหาและป้องกัน duplicate |
| certificateTemplates | templateCode | Unique | ค้นหาและป้องกัน duplicate |
| certificateTemplates | isActive | Regular | Filter template ที่ใช้งาน |
| registrationSettings | settingKey | Unique | ค้นหาการตั้งค่า |

