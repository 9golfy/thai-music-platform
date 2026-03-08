# แก้ไขปัญหา Dashboard ไม่แสดง Sidebar และข้อมูล

## สถานะปัจจุบัน

✅ ไฟล์ทั้งหมดถูกต้อง  
✅ CoreUI ติดตั้งแล้ว  
✅ CSS import ถูกต้อง  
❌ แต่ browser cache และ Next.js cache ทำให้แสดงหน้าเก่า

## วิธีแก้ไข (ทำตามลำดับ)

### วิธีที่ 1: ใช้ Script อัตโนมัติ (แนะนำ)

เปิด PowerShell และรันคำสั่ง:

```powershell
./restart-dashboard.ps1
```

Script นี้จะ:
1. ปิด Node processes ทั้งหมด
2. ลบ .next folder (cache)
3. เริ่ม dev server ใหม่

หลังจาก server เริ่มแล้ว:
1. เปิด browser ใน **INCOGNITO/PRIVATE mode** (สำคัญมาก!)
2. ไปที่: `http://localhost:3000/login`
3. Login:
   - Username: `root`
   - Password: `admin`
4. ควรเห็น sidebar menu ด้านซ้าย

---

### วิธีที่ 2: ทำเองทีละขั้นตอน

#### ขั้นตอนที่ 1: ปิด Dev Server
กด `Ctrl+C` ใน terminal ที่รัน `npm run dev`

#### ขั้นตอนที่ 2: ปิด Node Processes ทั้งหมด
```powershell
taskkill /F /IM node.exe
```

หรือ

```powershell
Get-Process node | Stop-Process -Force
```

#### ขั้นตอนที่ 3: ลบ Next.js Cache
```powershell
Remove-Item -Recurse -Force .next
```

#### ขั้นตอนที่ 4: เริ่ม Dev Server ใหม่
```powershell
npm run dev
```

รอจนเห็นข้อความ:
```
✓ Ready in 3.2s
○ Local:   http://localhost:3000
```

#### ขั้นตอนที่ 5: เปิด Browser ใน Incognito Mode

**Chrome/Edge:**
- กด `Ctrl+Shift+N`

**Firefox:**
- กด `Ctrl+Shift+P`

#### ขั้นตอนที่ 6: ทดสอบ Login
1. ไปที่: `http://localhost:3000/login`
2. กรอก:
   - Username: `root`
   - Password: `admin`
3. กด "เข้าสู่ระบบ"

---

## ผลลัพธ์ที่ควรเห็น

### หน้า Login
- ✅ Form สีขาว กลางหน้าจอ
- ✅ Logo "ดนตรีไทย" ด้านบน
- ✅ ช่อง Username และ Password
- ✅ ปุ่ม "เข้าสู่ระบบ" สีเขียว

### หน้า Dashboard (หลัง Login)
- ✅ **Sidebar ด้านซ้าย** มี menu:
  - Dashboard
  - โรงเรียนดนตรีไทย 100%
  - โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย
  - Logout
- ✅ **Header ด้านบน** แสดง "Admin"
- ✅ **4 การ์ดสถิติ** (สีน้ำเงิน, ฟ้า, เหลือง, เขียว)
- ✅ **การ์ด "กิจกรรมล่าสุด"**
- ✅ **2 การ์ด Quick Links**

---

## ถ้ายังไม่ได้

### ตรวจสอบ Browser Console

1. กด `F12` เปิด DevTools
2. ไปที่ tab **Console**
3. ดูว่ามี error สีแดงหรือไม่

**Error ที่พบบ่อย:**

#### Error: "Cannot find module '@coreui/react'"
```powershell
npm install @coreui/coreui @coreui/react @coreui/icons @coreui/icons-react
```

#### Error: CSS ไม่โหลด
ตรวจสอบว่า `app/layout.tsx` มีบรรทัดนี้:
```typescript
import '@coreui/coreui/dist/css/coreui.min.css'
```

#### Error: "isAuthenticated is null"
ลบ localStorage และ login ใหม่:
```javascript
// เปิด Console (F12) และรัน:
localStorage.clear()
// แล้ว refresh หน้า
```

---

## ทดสอบว่า CoreUI ทำงาน

เปิดไฟล์ `test-coreui.html` ใน browser:

```powershell
# Windows
start test-coreui.html

# หรือเปิดด้วย browser โดยตรง
```

ถ้าเห็น sidebar และ cards แสดงว่า CoreUI ทำงานปกติ  
ปัญหาอยู่ที่ Next.js cache

---

## ตรวจสอบระบบ

รัน diagnostic script:

```powershell
./check-dashboard.ps1
```

จะแสดงสถานะของ:
- ✅ CoreUI packages
- ✅ ไฟล์ทั้งหมด
- ✅ CSS imports
- ✅ Dev server
- ✅ Port 3000

---

## ยังไม่ได้อีก?

### ลองใช้ Browser อื่น
- Chrome
- Edge
- Firefox

### ปิด Browser Extensions
บาง extensions อาจบล็อก CSS หรือ JavaScript

### ตรวจสอบ Firewall/Antivirus
อาจบล็อก localhost:3000

### ลบ node_modules และติดตั้งใหม่
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run dev
```

---

## ส่งข้อมูลเพื่อช่วยแก้ไข

ถ้าทำทุกอย่างแล้วยังไม่ได้ ส่งข้อมูลเหล่านี้:

1. **Screenshot หน้าจอ:**
   - หน้า login
   - หน้า dashboard (ที่เห็นอยู่)
   - Browser console (F12 → Console)

2. **รัน commands และส่ง output:**
```powershell
# 1. Check CoreUI
npm list @coreui/react

# 2. Check files
Get-Content app/(admin)/dashboard/layout.tsx | Select-Object -First 30

# 3. Check root layout
Get-Content app/layout.tsx | Select-Object -First 20

# 4. Check diagnostic
./check-dashboard.ps1
```

3. **ข้อมูล Browser:**
   - Browser name และ version
   - Operating System

---

## สรุป Quick Steps

```powershell
# 1. Stop everything
taskkill /F /IM node.exe

# 2. Clean cache
Remove-Item -Recurse -Force .next

# 3. Start fresh
npm run dev

# 4. Test in incognito
# Ctrl+Shift+N (Chrome/Edge)
# Go to: http://localhost:3000/login
# Login: root / admin
```

---

**อัพเดทล่าสุด:** 24 ก.พ. 2569 เวลา 22:17 น.  
**สถานะ:** พร้อมแก้ไข ✅
