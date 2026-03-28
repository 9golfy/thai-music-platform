# คู่มือการติดตั้ง Thai Music Platform บน Windows Server

## สารบัญ

1. [ข้อมูลเบื้องต้น](#ข้อมูลเบื้องต้น)
2. [System Requirements](#system-requirements)
3. [Software ที่ต้องติดตั้ง](#software-ที่ต้องติดตั้ง)
4. [Pre-Installation Checklist](#pre-installation-checklist)
5. [ขั้นตอนการติดตั้ง](#ขั้นตอนการติดตั้ง)
6. [การตั้งค่าหลังติดตั้ง](#การตั้งค่าหลังติดตั้ง)
7. [การทดสอบระบบ](#การทดสอบระบบ)
8. [Troubleshooting](#troubleshooting)
9. [Backup และ Recovery](#backup-และ-recovery)
10. [Maintenance](#maintenance)

---

## ข้อมูลเบื้องต้น

เอกสารนี้เป็นคู่มือการติดตั้ง Thai Music Platform บน Windows Server สำหรับ System Administrator โดยจะครอบคลุมการติดตั้ง software ทั้งหมดที่จำเป็น การกำหนดค่าระบบ และการทดสอบ

### เกี่ยวกับ Thai Music Platform

- **Application**: Next.js 16.1.6 (React 19.2.3)
- **Runtime**: Node.js 22.x
- **Database**: MongoDB 7.x
- **Port**: 3000 (HTTP)

### ระยะเวลาการติดตั้ง

- การติดตั้งครั้งแรก: ประมาณ 2-3 ชั่วโมง
- รวมการทดสอบ: ประมาณ 3-4 ชั่วโมง

---

## System Requirements

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4 cores หรือมากกว่า |
| RAM | 4 GB | 8 GB หรือมากกว่า |
| Disk Space | 30 GB ว่าง | 50 GB ว่างหรือมากกว่า |
| Network | 10 Mbps | 100 Mbps หรือมากกว่า |


### Software Requirements

| Software | Version | Required |
|----------|---------|----------|
| Windows Server | 2019 หรือสูงกว่า | ✓ |
| Node.js | 22.x LTS | ✓ |
| MongoDB | 7.x | ✓ |
| NSSM | Latest | ✓ |
| Mongo Express | Latest | Optional |

### Network Requirements

| Port | Protocol | Purpose | Access |
|------|----------|---------|--------|
| 3000 | TCP | Next.js Application | Public |
| 27017 | TCP | MongoDB | Localhost only |
| 8081 | TCP | Mongo Express (Optional) | Internal network |
| 587/465 | TCP | Gmail SMTP | Outbound |

---

## Software ที่ต้องติดตั้ง

### 1. Node.js 22.x LTS

**Download Link**: https://nodejs.org/en/download/

**ขั้นตอนการติดตั้ง**:
1. ดาวน์โหลด Windows Installer (.msi) สำหรับ version 22.x LTS
2. รัน installer
3. เลือก "Automatically install the necessary tools" (ถ้ามี)
4. ติดตั้งตาม default settings
5. ตรวจสอบการติดตั้ง:
   ```powershell
   node --version
   npm --version
   ```

### 2. MongoDB 7.x Community Server

**Download Link**: https://www.mongodb.com/try/download/community

**ขั้นตอนการติดตั้ง**:
1. ดาวน์โหลด Windows MSI Installer
2. เลือก "Complete" installation
3. เลือก "Install MongoDB as a Service"
4. ตั้งค่า Data Directory: `C:\data\mongodb\data`
5. ตั้งค่า Log Directory: `C:\data\mongodb\logs`
6. (Optional) ติดตั้ง MongoDB Compass
7. ตรวจสอบการติดตั้ง:
   ```powershell
   mongosh --version
   ```


### 3. NSSM (Non-Sucking Service Manager)

**Download Link**: https://nssm.cc/download

**ขั้นตอนการติดตั้ง**:
1. ดาวน์โหลด NSSM (เลือก version ที่เหมาะสมกับ Windows)
2. แตกไฟล์ ZIP
3. คัดลอก `nssm.exe` จากโฟลเดอร์ `win64` หรือ `win32` ไปยัง `C:\Windows\System32`
4. ตรวจสอบการติดตั้ง:
   ```powershell
   nssm --version
   ```

### 4. Git for Windows (Optional - สำหรับ clone repository)

**Download Link**: https://git-scm.com/download/win

---

## Pre-Installation Checklist

### ข้อมูลที่ต้องเตรียม

- [ ] **MongoDB Root Password**: สร้าง strong password (16+ characters)
  ```powershell
  # สร้าง random password
  -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 20 | % {[char]$_})
  ```

- [ ] **JWT Secret**: สร้าง secret key (32+ characters)
  ```powershell
  # สร้าง JWT secret
  $bytes = New-Object byte[] 32
  [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
  [Convert]::ToBase64String($bytes)
  ```

- [ ] **Gmail Credentials**:
  - Gmail address: `_______________@gmail.com`
  - Gmail App Password: `________________` (สร้างจาก https://myaccount.google.com/apppasswords)

- [ ] **Server Information**:
  - Server IP Address: `_______________`
  - Server Hostname: `_______________`

### Software Downloads

- [ ] Node.js 22.x LTS Installer
- [ ] MongoDB 7.x Community Server Installer
- [ ] NSSM (nssm.exe)
- [ ] Application Source Code (ZIP หรือ Git repository)


---

## ขั้นตอนการติดตั้ง

### STEP 1: เตรียม Windows Server

#### 1.1 ตรวจสอบ System Requirements

```powershell
# ตรวจสอบ Windows version
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"

# ตรวจสอบ RAM
systeminfo | findstr /C:"Total Physical Memory"

# ตรวจสอบ CPU
wmic cpu get NumberOfCores,NumberOfLogicalProcessors

# ตรวจสอบ Disk Space
wmic logicaldisk get size,freespace,caption
```

#### 1.2 Update Windows

```powershell
# เปิด Windows Update
Start-Process ms-settings:windowsupdate
```

รอให้ Windows Update เสร็จสมบูรณ์และ restart server ถ้าจำเป็น

#### 1.3 สร้าง Directory Structure

```powershell
# สร้างโฟลเดอร์สำหรับ application
New-Item -ItemType Directory -Path "C:\inetpub\thai-music-platform" -Force

# สร้างโฟลเดอร์สำหรับ uploads
New-Item -ItemType Directory -Path "C:\inetpub\thai-music-platform\public\uploads\certificates" -Force
New-Item -ItemType Directory -Path "C:\inetpub\thai-music-platform\public\uploads\documents" -Force
New-Item -ItemType Directory -Path "C:\inetpub\thai-music-platform\public\uploads\images" -Force

# สร้างโฟลเดอร์สำหรับ MongoDB
New-Item -ItemType Directory -Path "C:\data\mongodb\data" -Force
New-Item -ItemType Directory -Path "C:\data\mongodb\logs" -Force

# สร้างโฟลเดอร์สำหรับ logs
New-Item -ItemType Directory -Path "C:\logs\thai-music-platform" -Force

# สร้างโฟลเดอร์สำหรับ backups
New-Item -ItemType Directory -Path "C:\backups\thai-music-platform\mongodb" -Force
New-Item -ItemType Directory -Path "C:\backups\thai-music-platform\uploads" -Force

# สร้างโฟลเดอร์สำหรับ scripts
New-Item -ItemType Directory -Path "C:\scripts" -Force
```


### STEP 2: ติดตั้ง Node.js

#### 2.1 ติดตั้ง Node.js 22.x LTS

1. รัน Node.js installer ที่ดาวน์โหลดมา
2. คลิก "Next" และยอมรับ License Agreement
3. เลือก installation path (default: `C:\Program Files\nodejs`)
4. เลือก "Automatically install the necessary tools" (ถ้ามี checkbox นี้)
5. คลิก "Install"
6. รอจนการติดตั้งเสร็จสมบูรณ์

#### 2.2 ตรวจสอบการติดตั้ง

```powershell
# ตรวจสอบ Node.js version
node --version
# ควรแสดง: v22.x.x

# ตรวจสอบ npm version
npm --version
# ควรแสดง: 10.x.x หรือสูงกว่า

# ตรวจสอบ PATH
$env:Path -split ';' | Select-String nodejs
```

---

### STEP 3: ติดตั้งและกำหนดค่า MongoDB

#### 3.1 ติดตั้ง MongoDB 7.x

1. รัน MongoDB installer
2. เลือก "Complete" installation type
3. ใน "Service Configuration":
   - เลือก "Install MongoDB as a Service"
   - Service Name: `MongoDB`
   - Data Directory: `C:\data\mongodb\data`
   - Log Directory: `C:\data\mongodb\logs`
4. (Optional) เลือกติดตั้ง MongoDB Compass
5. คลิก "Install"

#### 3.2 แก้ไข MongoDB Configuration

แก้ไขไฟล์ `C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg`:

```yaml
# mongod.cfg
systemLog:
  destination: file
  path: C:\data\mongodb\logs\mongod.log
  logAppend: true

storage:
  dbPath: C:\data\mongodb\data

net:
  port: 27017
  bindIp: 127.0.0.1  # localhost only for security

security:
  authorization: enabled
```


#### 3.3 Restart MongoDB Service

```powershell
# Restart MongoDB service
Restart-Service MongoDB

# ตรวจสอบ service status
Get-Service MongoDB
```

#### 3.4 สร้าง MongoDB Root User

```powershell
# เชื่อมต่อ MongoDB (ยังไม่มี authentication)
mongosh

# ใน mongosh shell:
```

```javascript
// สลับไปยัง admin database
use admin

// สร้าง root user (แทนที่ <YOUR_STRONG_PASSWORD> ด้วย password ที่เตรียมไว้)
db.createUser({
  user: "root",
  pwd: "<YOUR_STRONG_PASSWORD>",
  roles: [ { role: "root", db: "admin" } ]
})

// ทดสอบ authentication
db.auth("root", "<YOUR_STRONG_PASSWORD>")
// ควรแสดง: { ok: 1 }

// ออกจาก mongosh
exit
```

#### 3.5 ทดสอบการเชื่อมต่อด้วย Authentication

```powershell
# ทดสอบเชื่อมต่อด้วย credentials
mongosh -u root -p <YOUR_STRONG_PASSWORD> --authenticationDatabase admin

# ถ้าเชื่อมต่อสำเร็จ ให้ออกจาก shell
exit
```

#### 3.6 สร้าง Database และ Collections

```powershell
# เชื่อมต่อ MongoDB
mongosh -u root -p <YOUR_STRONG_PASSWORD> --authenticationDatabase admin
```

```javascript
// สร้างและใช้ database
use thai_music_school

// สร้าง collections
db.createCollection("users")
db.createCollection("register100")
db.createCollection("registerSupport")
db.createCollection("certificates")
db.createCollection("certificateTemplates")
db.createCollection("registrationSettings")

// สร้าง indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

db.register100.createIndex({ schoolId: 1 })
db.register100.createIndex({ createdAt: -1 })
db.register100.createIndex({ teacherEmail: 1 })

db.registerSupport.createIndex({ schoolId: 1 })
db.registerSupport.createIndex({ createdAt: -1 })
db.registerSupport.createIndex({ teacherEmail: 1 })

db.certificates.createIndex({ schoolId: 1 })
db.certificates.createIndex({ certificateNumber: 1 }, { unique: true })

// ตรวจสอบ collections
show collections

// ออกจาก mongosh
exit
```


---

### STEP 4: ตั้งค่า Environment Variables

#### 4.1 เตรียม Values

ใช้ค่าที่เตรียมไว้จาก Pre-Installation Checklist:
- MongoDB Password
- JWT Secret
- Gmail User และ App Password
- Server IP

#### 4.2 ตั้งค่า System Environment Variables

เปิด PowerShell as Administrator และรันคำสั่งต่อไปนี้:

```powershell
# MongoDB Configuration
[System.Environment]::SetEnvironmentVariable('MONGODB_URI', 'mongodb://root:<YOUR_MONGO_PASSWORD>@localhost:27017/thai_music_school?authSource=admin', 'Machine')

# JWT Configuration
[System.Environment]::SetEnvironmentVariable('JWT_SECRET', '<YOUR_JWT_SECRET>', 'Machine')

# Email Configuration
[System.Environment]::SetEnvironmentVariable('GMAIL_USER', '<YOUR_GMAIL_ADDRESS>', 'Machine')
[System.Environment]::SetEnvironmentVariable('GMAIL_APP_PASSWORD', '<YOUR_GMAIL_APP_PASSWORD>', 'Machine')

# Application Configuration
[System.Environment]::SetEnvironmentVariable('NODE_ENV', 'production', 'Machine')
[System.Environment]::SetEnvironmentVariable('PORT', '3000', 'Machine')
[System.Environment]::SetEnvironmentVariable('NEXT_PUBLIC_APP_URL', 'http://<YOUR_SERVER_IP>:3000', 'Machine')
```

#### 4.3 ตรวจสอบ Environment Variables

```powershell
# ตรวจสอบแต่ละตัวแปร
[System.Environment]::GetEnvironmentVariable('MONGODB_URI', 'Machine')
[System.Environment]::GetEnvironmentVariable('JWT_SECRET', 'Machine')
[System.Environment]::GetEnvironmentVariable('GMAIL_USER', 'Machine')
[System.Environment]::GetEnvironmentVariable('NODE_ENV', 'Machine')
[System.Environment]::GetEnvironmentVariable('PORT', 'Machine')
[System.Environment]::GetEnvironmentVariable('NEXT_PUBLIC_APP_URL', 'Machine')
```

**หมายเหตุ**: หลังจากตั้งค่า environment variables แล้ว ต้อง restart PowerShell หรือ Command Prompt เพื่อให้ค่าใหม่มีผล


---

### STEP 5: Deploy Application

#### 5.1 คัดลอก Application Files

คัดลอกไฟล์ทั้งหมดจาก deployment package ไปยัง `C:\inetpub\thai-music-platform`

ไฟล์ที่ต้องมี:
- `app/` - Application code
- `components/` - React components
- `lib/` - Library code
- `public/` - Static files
- `package.json` - Dependencies
- `package-lock.json` - Lock file
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

#### 5.2 ติดตั้ง Dependencies

```powershell
# ไปยัง application directory
cd C:\inetpub\thai-music-platform

# ติดตั้ง dependencies
npm ci

# รอจนกว่าการติดตั้งเสร็จสมบูรณ์ (อาจใช้เวลา 5-10 นาที)
```

#### 5.3 Build Application

```powershell
# Build Next.js application
npm run build

# ตรวจสอบว่าโฟลเดอร์ .next ถูกสร้างขึ้น
dir .next
```

#### 5.4 ทดสอบรัน Application (Manual Test)

```powershell
# ทดสอบรัน application
npm start

# เปิด browser และเข้า http://localhost:3000
# ตรวจสอบว่าหน้า home page แสดงถูกต้อง

# กด Ctrl+C เพื่อหยุด application
```


---

### STEP 6: สร้าง Windows Service ด้วย NSSM

#### 6.1 ติดตั้ง NSSM

ตรวจสอบว่า `nssm.exe` อยู่ใน `C:\Windows\System32` แล้ว

#### 6.2 สร้าง Service สำหรับ Application

เปิด Command Prompt as Administrator:

```batch
REM สร้าง service
nssm install ThaiMusicPlatform "C:\Program Files\nodejs\npm.cmd" start

REM ตั้งค่า working directory
nssm set ThaiMusicPlatform AppDirectory "C:\inetpub\thai-music-platform"

REM ตั้งค่า environment variables
nssm set ThaiMusicPlatform AppEnvironmentExtra NODE_ENV=production

REM ตั้งค่า stdout log
nssm set ThaiMusicPlatform AppStdout "C:\logs\thai-music-platform\service-output.log"

REM ตั้งค่า stderr log
nssm set ThaiMusicPlatform AppStderr "C:\logs\thai-music-platform\service-error.log"

REM ตั้งค่า log rotation (10 MB)
nssm set ThaiMusicPlatform AppStdoutCreationDisposition 4
nssm set ThaiMusicPlatform AppStderrCreationDisposition 4

REM ตั้งค่า auto-restart on failure
nssm set ThaiMusicPlatform AppExit Default Restart
nssm set ThaiMusicPlatform AppRestartDelay 5000

REM ตั้งค่า startup type เป็น automatic
nssm set ThaiMusicPlatform Start SERVICE_AUTO_START

REM Start service
nssm start ThaiMusicPlatform
```

#### 6.3 ตรวจสอบ Service Status

```powershell
# ตรวจสอบ service status
nssm status ThaiMusicPlatform

# หรือใช้ PowerShell
Get-Service ThaiMusicPlatform

# ดู logs
Get-Content C:\logs\thai-music-platform\service-output.log -Tail 50
```

#### 6.4 เปิด Services Manager

```powershell
# เปิด services.msc
services.msc
```

ตรวจสอบว่า "ThaiMusicPlatform" service:
- Status: Running
- Startup Type: Automatic


---

### STEP 7: กำหนดค่า Windows Firewall

#### 7.1 เปิด Port 3000 สำหรับ HTTP

```powershell
# สร้าง inbound rule สำหรับ port 3000
New-NetFirewallRule -DisplayName "Thai Music Platform HTTP" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# ตรวจสอบ rule
Get-NetFirewallRule -DisplayName "Thai Music Platform HTTP"
```

#### 7.2 ตรวจสอบ Outbound Rules สำหรับ Email

```powershell
# ตรวจสอบว่า outbound connections ไม่ถูก block
Get-NetFirewallRule -Direction Outbound | Where-Object {$_.Enabled -eq $true}
```

โดยปกติ Windows จะอนุญาต outbound connections ทั้งหมด

#### 7.3 ตรวจสอบ MongoDB Port

```powershell
# ตรวจสอบว่าไม่มี inbound rule สำหรับ port 27017
Get-NetFirewallRule | Where-Object {$_.LocalPort -eq 27017}
```

ต้องไม่มี inbound rule สำหรับ port 27017 เพื่อความปลอดภัย (MongoDB ควร bind เฉพาะ localhost)

---

### STEP 8: ตั้งค่า Backup Scripts

#### 8.1 สร้าง MongoDB Backup Script

สร้างไฟล์ `C:\scripts\backup-mongodb.bat`:

```batch
@echo off
REM MongoDB Backup Script

set BACKUP_DIR=C:\backups\thai-music-platform\mongodb
set MONGO_PASSWORD=<YOUR_MONGO_PASSWORD>
set DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set DATE=%DATE: =0%

echo Starting MongoDB backup at %date% %time%

"C:\Program Files\MongoDB\Server\7.0\bin\mongodump.exe" --uri="mongodb://root:%MONGO_PASSWORD%@localhost:27017/thai_music_school?authSource=admin" --out="%BACKUP_DIR%\backup_%DATE%"

if %ERRORLEVEL% EQU 0 (
    echo MongoDB backup completed successfully
    echo Backup location: %BACKUP_DIR%\backup_%DATE%
) else (
    echo MongoDB backup failed with error code %ERRORLEVEL%
)

REM Delete backups older than 7 days
forfiles /p "%BACKUP_DIR%" /s /m backup_* /d -7 /c "cmd /c if @isdir==TRUE rmdir /s /q @path"

echo Backup script finished at %date% %time%
```


#### 8.2 สร้าง Uploads Backup Script

สร้างไฟล์ `C:\scripts\backup-uploads.bat`:

```batch
@echo off
REM Uploads Backup Script

set SOURCE=C:\inetpub\thai-music-platform\public\uploads
set BACKUP_DIR=C:\backups\thai-music-platform\uploads
set DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set DATE=%DATE: =0%

echo Starting uploads backup at %date% %time%

xcopy "%SOURCE%" "%BACKUP_DIR%\uploads_%DATE%\" /E /I /Y /Q

if %ERRORLEVEL% EQU 0 (
    echo Uploads backup completed successfully
    echo Backup location: %BACKUP_DIR%\uploads_%DATE%
) else (
    echo Uploads backup failed with error code %ERRORLEVEL%
)

REM Delete backups older than 7 days
forfiles /p "%BACKUP_DIR%" /s /m uploads_* /d -7 /c "cmd /c if @isdir==TRUE rmdir /s /q @path"

echo Backup script finished at %date% %time%
```

#### 8.3 ทดสอบ Backup Scripts

```powershell
# ทดสอบ MongoDB backup
C:\scripts\backup-mongodb.bat

# ทดสอบ Uploads backup
C:\scripts\backup-uploads.bat

# ตรวจสอบว่า backup files ถูกสร้างขึ้น
dir C:\backups\thai-music-platform\mongodb
dir C:\backups\thai-music-platform\uploads
```

#### 8.4 ตั้งค่า Task Scheduler สำหรับ Daily Backups

```powershell
# สร้าง scheduled task สำหรับ MongoDB backup (ทุกวันเวลา 02:00)
$action = New-ScheduledTaskAction -Execute "C:\scripts\backup-mongodb.bat"
$trigger = New-ScheduledTaskTrigger -Daily -At 2:00AM
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName "Thai Music Platform - MongoDB Backup" -Action $action -Trigger $trigger -Principal $principal -Description "Daily MongoDB backup for Thai Music Platform"

# สร้าง scheduled task สำหรับ Uploads backup (ทุกวันเวลา 03:00)
$action = New-ScheduledTaskAction -Execute "C:\scripts\backup-uploads.bat"
$trigger = New-ScheduledTaskTrigger -Daily -At 3:00AM
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName "Thai Music Platform - Uploads Backup" -Action $action -Trigger $trigger -Principal $principal -Description "Daily uploads backup for Thai Music Platform"

# ตรวจสอบ scheduled tasks
Get-ScheduledTask | Where-Object {$_.TaskName -like "*Thai Music*"}
```


---

## การตั้งค่าหลังติดตั้ง

### ตั้งค่า File Permissions

```powershell
# ตั้งค่า permissions สำหรับ uploads directory
icacls "C:\inetpub\thai-music-platform\public\uploads" /grant "NETWORK SERVICE:(OI)(CI)M"

# ตั้งค่า permissions สำหรับ logs directory
icacls "C:\logs\thai-music-platform" /grant "NETWORK SERVICE:(OI)(CI)M"
```

### ตรวจสอบ Windows Defender

```powershell
# ตรวจสอบ Windows Defender status
Get-MpComputerStatus

# เพิ่ม exclusions สำหรับ application directory (ถ้าจำเป็น)
Add-MpPreference -ExclusionPath "C:\inetpub\thai-music-platform"
Add-MpPreference -ExclusionPath "C:\data\mongodb"
```

---

## การทดสอบระบบ

### Test 1: ทดสอบการเข้าถึง Application

```powershell
# ทดสอบจาก localhost
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing

# ทดสอบจาก IP address
Invoke-WebRequest -Uri "http://<YOUR_SERVER_IP>:3000" -UseBasicParsing
```

เปิด browser และเข้า:
- `http://localhost:3000` (จาก server)
- `http://<YOUR_SERVER_IP>:3000` (จาก client machine)

ตรวจสอบว่าหน้า home page แสดงถูกต้อง

### Test 2: ทดสอบ MongoDB Connection

```powershell
# เชื่อมต่อ MongoDB
mongosh -u root -p <YOUR_MONGO_PASSWORD> --authenticationDatabase admin

# ใน mongosh:
```

```javascript
// ตรวจสอบ database
use thai_music_school
show collections

// ตรวจสอบ indexes
db.users.getIndexes()

exit
```


### Test 3: ทดสอบ Windows Service

```powershell
# Restart service
Restart-Service ThaiMusicPlatform

# รอ 10 วินาที
Start-Sleep -Seconds 10

# ตรวจสอบ service status
Get-Service ThaiMusicPlatform

# ทดสอบเข้าถึง application อีกครั้ง
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
```

### Test 4: ทดสอบ Server Restart

```powershell
# Restart server
Restart-Computer -Force

# หลังจาก server restart แล้ว:
# 1. ตรวจสอบว่า MongoDB service เริ่มทำงานอัตโนมัติ
Get-Service MongoDB

# 2. ตรวจสอบว่า Application service เริ่มทำงานอัตโนมัติ
Get-Service ThaiMusicPlatform

# 3. ทดสอบเข้าถึง application
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
```

### Test 5: ทดสอบ Backup และ Restore

```powershell
# รัน backup scripts
C:\scripts\backup-mongodb.bat
C:\scripts\backup-uploads.bat

# ตรวจสอบ backup files
dir C:\backups\thai-music-platform\mongodb
dir C:\backups\thai-music-platform\uploads
```

**ทดสอบ Restore MongoDB**:

```powershell
# หา backup directory ล่าสุด
$latestBackup = Get-ChildItem "C:\backups\thai-music-platform\mongodb" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

# Restore (ระวัง: จะลบข้อมูลเดิม)
& "C:\Program Files\MongoDB\Server\7.0\bin\mongorestore.exe" --uri="mongodb://root:<YOUR_MONGO_PASSWORD>@localhost:27017" --drop $latestBackup.FullName
```

---

## Troubleshooting

### ปัญหา: Application Service ไม่ start

**อาการ**: Service status เป็น "Stopped" หรือ "Failed"

**วิธีแก้**:

```powershell
# ดู error logs
Get-Content C:\logs\thai-music-platform\service-error.log -Tail 50

# ตรวจสอบ environment variables
[System.Environment]::GetEnvironmentVariable('MONGODB_URI', 'Machine')
[System.Environment]::GetEnvironmentVariable('NODE_ENV', 'Machine')

# ทดสอบรัน application แบบ manual
cd C:\inetpub\thai-music-platform
npm start
```


### ปัญหา: MongoDB Connection Error

**อาการ**: Application แสดง error "MongoServerError: Authentication failed"

**วิธีแก้**:

```powershell
# ตรวจสอบ MongoDB service
Get-Service MongoDB

# ทดสอบ connection string
mongosh "mongodb://root:<YOUR_MONGO_PASSWORD>@localhost:27017/thai_music_school?authSource=admin"

# ตรวจสอบ MONGODB_URI environment variable
[System.Environment]::GetEnvironmentVariable('MONGODB_URI', 'Machine')

# ตรวจสอบ MongoDB logs
Get-Content C:\data\mongodb\logs\mongod.log -Tail 50
```

### ปัญหา: Port 3000 ไม่สามารถเข้าถึงได้จาก external

**อาการ**: เข้าถึง application จาก localhost ได้ แต่จาก IP address ไม่ได้

**วิธีแก้**:

```powershell
# ตรวจสอบ firewall rule
Get-NetFirewallRule -DisplayName "Thai Music Platform HTTP"

# ตรวจสอบว่า application listen บน 0.0.0.0 หรือ localhost
netstat -an | findstr :3000

# ทดสอบ connection จาก external
Test-NetConnection -ComputerName <YOUR_SERVER_IP> -Port 3000
```

### ปัญหา: File Upload ไม่ทำงาน

**อาการ**: ไม่สามารถอัปโหลดไฟล์ได้

**วิธีแก้**:

```powershell
# ตรวจสอบ permissions
icacls "C:\inetpub\thai-music-platform\public\uploads"

# ตั้งค่า permissions ใหม่
icacls "C:\inetpub\thai-music-platform\public\uploads" /grant "NETWORK SERVICE:(OI)(CI)M"

# ตรวจสอบ disk space
wmic logicaldisk get size,freespace,caption
```

### ปัญหา: Email ไม่ส่ง

**อาการ**: Email notifications ไม่ถูกส่ง

**วิธีแก้**:

```powershell
# ตรวจสอบ Gmail credentials
[System.Environment]::GetEnvironmentVariable('GMAIL_USER', 'Machine')
[System.Environment]::GetEnvironmentVariable('GMAIL_APP_PASSWORD', 'Machine')

# ตรวจสอบ application logs
Get-Content C:\logs\thai-music-platform\service-output.log | Select-String -Pattern "email"

# ทดสอบ SMTP connection
Test-NetConnection -ComputerName smtp.gmail.com -Port 587
```


---

## Backup และ Recovery

### Backup Strategy

- **MongoDB**: Daily backup เวลา 02:00 AM
- **Uploads**: Daily backup เวลา 03:00 AM
- **Retention**: เก็บ backup ไว้ 7 วัน

### Manual Backup

```powershell
# Backup MongoDB
C:\scripts\backup-mongodb.bat

# Backup Uploads
C:\scripts\backup-uploads.bat
```

### Restore MongoDB

```powershell
# หา backup directory ที่ต้องการ restore
dir C:\backups\thai-music-platform\mongodb

# Restore (แทนที่ YYYYMMDD_HHMMSS ด้วย timestamp ที่ต้องการ)
& "C:\Program Files\MongoDB\Server\7.0\bin\mongorestore.exe" --uri="mongodb://root:<YOUR_MONGO_PASSWORD>@localhost:27017" --drop "C:\backups\thai-music-platform\mongodb\backup_YYYYMMDD_HHMMSS"
```

### Restore Uploads

```powershell
# หา backup directory ที่ต้องการ restore
dir C:\backups\thai-music-platform\uploads

# Restore (แทนที่ YYYYMMDD_HHMMSS ด้วย timestamp ที่ต้องการ)
xcopy "C:\backups\thai-music-platform\uploads\uploads_YYYYMMDD_HHMMSS\*" "C:\inetpub\thai-music-platform\public\uploads\" /E /I /Y
```

---

## Maintenance

### การ Update Node.js

```powershell
# 1. ดาวน์โหลด Node.js version ใหม่
# 2. Stop application service
Stop-Service ThaiMusicPlatform

# 3. รัน Node.js installer
# 4. ตรวจสอบ version
node --version

# 5. Rebuild application
cd C:\inetpub\thai-music-platform
npm ci
npm run build

# 6. Start application service
Start-Service ThaiMusicPlatform
```

### การ Update MongoDB

```powershell
# 1. Backup database ก่อน
C:\scripts\backup-mongodb.bat

# 2. Stop MongoDB service
Stop-Service MongoDB

# 3. รัน MongoDB installer (version ใหม่)
# 4. Start MongoDB service
Start-Service MongoDB

# 5. ตรวจสอบ version
mongosh --version
```


### การ Update Application

```powershell
# 1. Backup ทั้งหมดก่อน
C:\scripts\backup-mongodb.bat
C:\scripts\backup-uploads.bat

# 2. Stop application service
Stop-Service ThaiMusicPlatform

# 3. Backup application directory เดิม
Copy-Item "C:\inetpub\thai-music-platform" "C:\backups\thai-music-platform\app-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')" -Recurse

# 4. คัดลอกไฟล์ใหม่ทับของเดิม (ยกเว้น node_modules, .next, public/uploads)

# 5. ติดตั้ง dependencies ใหม่
cd C:\inetpub\thai-music-platform
npm ci

# 6. Build application ใหม่
npm run build

# 7. Start application service
Start-Service ThaiMusicPlatform

# 8. ตรวจสอบ logs
Get-Content C:\logs\thai-music-platform\service-output.log -Tail 50

# 9. ทดสอบ application
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
```

### Monitoring

#### ตรวจสอบ Service Status

```powershell
# ตรวจสอบ services
Get-Service MongoDB, ThaiMusicPlatform

# ตรวจสอบ uptime
Get-Process | Where-Object {$_.Name -like "*node*"} | Select-Object Name, StartTime, CPU, WorkingSet
```

#### ตรวจสอบ Disk Space

```powershell
# ตรวจสอบ disk space
Get-PSDrive C | Select-Object Used, Free

# ตรวจสอบขนาดของ directories
Get-ChildItem C:\inetpub\thai-music-platform -Recurse | Measure-Object -Property Length -Sum
Get-ChildItem C:\data\mongodb -Recurse | Measure-Object -Property Length -Sum
Get-ChildItem C:\backups\thai-music-platform -Recurse | Measure-Object -Property Length -Sum
```

#### ตรวจสอบ Logs

```powershell
# Application logs
Get-Content C:\logs\thai-music-platform\service-output.log -Tail 100
Get-Content C:\logs\thai-music-platform\service-error.log -Tail 100

# MongoDB logs
Get-Content C:\data\mongodb\logs\mongod.log -Tail 100

# Windows Event Logs
Get-EventLog -LogName Application -Source "ThaiMusicPlatform" -Newest 50
```


---

## Post-Installation Checklist

หลังจากติดตั้งเสร็จสมบูรณ์ ให้ตรวจสอบรายการต่อไปนี้:

- [ ] Node.js 22.x ติดตั้งและทำงานถูกต้อง (`node --version`)
- [ ] MongoDB 7.x ติดตั้งและทำงานถูกต้อง (`mongosh --version`)
- [ ] MongoDB Service รันอัตโนมัติเมื่อ server boot
- [ ] MongoDB root user ถูกสร้างและทดสอบ authentication แล้ว
- [ ] Database และ collections ถูกสร้างพร้อม indexes
- [ ] Environment variables ถูกตั้งค่าครบถ้วน
- [ ] Application files ถูกคัดลอกและ build สำเร็จ
- [ ] Application Service (ThaiMusicPlatform) รันอัตโนมัติเมื่อ server boot
- [ ] Firewall rule สำหรับ port 3000 ถูกสร้างแล้ว
- [ ] Backup scripts ถูกสร้างและทดสอบแล้ว
- [ ] Task Scheduler สำหรับ daily backups ถูกตั้งค่าแล้ว
- [ ] Application เข้าถึงได้จาก browser (localhost และ IP address)
- [ ] MongoDB connection ทำงานถูกต้อง
- [ ] File upload ทำงานถูกต้อง
- [ ] Email notification ทำงานถูกต้อง (ถ้ามี)
- [ ] Server restart และ services เริ่มทำงานอัตโนมัติ
- [ ] Logs ถูกบันทึกและดูได้
- [ ] Backup และ restore ทดสอบแล้ว

---

## คำสั่งที่ใช้บ่อย

### Service Management

```powershell
# Start services
Start-Service MongoDB
Start-Service ThaiMusicPlatform

# Stop services
Stop-Service MongoDB
Stop-Service ThaiMusicPlatform

# Restart services
Restart-Service MongoDB
Restart-Service ThaiMusicPlatform

# Check service status
Get-Service MongoDB, ThaiMusicPlatform

# View service details
Get-Service ThaiMusicPlatform | Format-List *
```

### Application Management

```powershell
# View application logs
Get-Content C:\logs\thai-music-platform\service-output.log -Tail 50 -Wait

# View error logs
Get-Content C:\logs\thai-music-platform\service-error.log -Tail 50 -Wait

# Test application
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing

# Check application process
Get-Process | Where-Object {$_.Name -like "*node*"}
```


### MongoDB Management

```powershell
# Connect to MongoDB
mongosh -u root -p <YOUR_MONGO_PASSWORD> --authenticationDatabase admin

# Check MongoDB status
Get-Service MongoDB

# View MongoDB logs
Get-Content C:\data\mongodb\logs\mongod.log -Tail 50

# Backup MongoDB
C:\scripts\backup-mongodb.bat

# Restore MongoDB
& "C:\Program Files\MongoDB\Server\7.0\bin\mongorestore.exe" --uri="mongodb://root:<YOUR_MONGO_PASSWORD>@localhost:27017" --drop "C:\backups\thai-music-platform\mongodb\backup_YYYYMMDD_HHMMSS"
```

### Backup Management

```powershell
# Run backups manually
C:\scripts\backup-mongodb.bat
C:\scripts\backup-uploads.bat

# List backups
dir C:\backups\thai-music-platform\mongodb
dir C:\backups\thai-music-platform\uploads

# Check backup tasks
Get-ScheduledTask | Where-Object {$_.TaskName -like "*Thai Music*"}

# Run backup task manually
Start-ScheduledTask -TaskName "Thai Music Platform - MongoDB Backup"
Start-ScheduledTask -TaskName "Thai Music Platform - Uploads Backup"
```

---

## ข้อมูลการติดต่อ

หากพบปัญหาหรือต้องการความช่วยเหลือ กรุณาติดต่อ:

- **Technical Support**: [ระบุข้อมูลการติดต่อ]
- **Email**: [ระบุ email]
- **Phone**: [ระบุเบอร์โทร]

---

## เอกสารอ้างอิง

- Node.js Documentation: https://nodejs.org/docs/
- MongoDB Documentation: https://www.mongodb.com/docs/
- NSSM Documentation: https://nssm.cc/usage
- Next.js Documentation: https://nextjs.org/docs

---

**เอกสารนี้จัดทำขึ้นเมื่อ**: [วันที่]  
**Version**: 1.0  
**ผู้จัดทำ**: [ชื่อผู้จัดทำ]

---

## Appendix A: Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | `mongodb://root:password@localhost:27017/thai_music_school?authSource=admin` |
| JWT_SECRET | Secret key สำหรับ JWT tokens | `base64-encoded-32-byte-string` |
| GMAIL_USER | Gmail address สำหรับส่ง email | `example@gmail.com` |
| GMAIL_APP_PASSWORD | Gmail App Password | `16-character-app-password` |
| NODE_ENV | Environment mode | `production` |
| PORT | Application port | `3000` |
| NEXT_PUBLIC_APP_URL | Public URL ของ application | `http://192.168.1.100:3000` |


## Appendix B: Directory Structure Reference

```
C:\
├── inetpub\
│   └── thai-music-platform\              # Application root
│       ├── .next\                        # Built application
│       ├── node_modules\                 # Dependencies
│       ├── app\                          # Application code
│       ├── components\                   # React components
│       ├── lib\                          # Library code
│       ├── public\
│       │   └── uploads\                  # User uploaded files
│       │       ├── certificates\
│       │       ├── documents\
│       │       └── images\
│       ├── package.json
│       └── next.config.ts
│
├── data\
│   └── mongodb\                          # MongoDB data
│       ├── data\                         # Database files
│       └── logs\                         # MongoDB logs
│
├── logs\
│   └── thai-music-platform\             # Application logs
│       ├── service-output.log
│       └── service-error.log
│
├── backups\
│   └── thai-music-platform\             # Backup files
│       ├── mongodb\                      # Database backups
│       └── uploads\                      # Upload files backups
│
└── scripts\                              # Backup scripts
    ├── backup-mongodb.bat
    └── backup-uploads.bat
```

## Appendix C: Port Reference

| Port | Service | Protocol | Access Level | Purpose |
|------|---------|----------|--------------|---------|
| 3000 | Next.js App | TCP | Public | HTTP web application |
| 27017 | MongoDB | TCP | Localhost | Database server |
| 8081 | Mongo Express | TCP | Internal | Database admin UI (optional) |
| 587 | Gmail SMTP | TCP | Outbound | Email sending (TLS) |
| 465 | Gmail SMTP | TCP | Outbound | Email sending (SSL) |

## Appendix D: Service Reference

| Service Name | Display Name | Startup Type | Description |
|--------------|--------------|--------------|-------------|
| MongoDB | MongoDB | Automatic | MongoDB Database Server |
| ThaiMusicPlatform | Thai Music Platform | Automatic | Next.js Application Service |

---

**หมายเหตุสำคัญ**:
- เอกสารนี้มีข้อมูล passwords และ credentials ห้าม commit ขึ้น Git หรือแชร์ในที่สาธารณะ
- เก็บเอกสารนี้ไว้ในที่ปลอดภัย
- เปลี่ยน passwords ทุก 90 วัน
- ทำ backup เป็นประจำ
- Monitor logs และ system resources เป็นประจำ

