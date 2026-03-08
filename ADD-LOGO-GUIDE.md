# วิธีเพิ่ม Logo กรมส่งเสริมวัฒนธรรม

## ขั้นตอนที่ 1: บันทึกรูป Logo

จากรูปที่คุณส่งมา ให้:

1. บันทึกรูป logo (ตราครุฑสีเหลือง) เป็นไฟล์ PNG
2. ตั้งชื่อไฟล์: `logo-culture.png`
3. วางไฟล์ใน folder: `public/`

**หรือ** ถ้ามี logo อยู่แล้ว:
- ใช้ไฟล์ `public/Logo.png` ที่มีอยู่
- แก้ไขชื่อใน code จาก `logo-culture.png` เป็น `Logo.png`

## ขั้นตอนที่ 2: ตรวจสอบไฟล์

```powershell
# ตรวจสอบว่ามีไฟล์หรือไม่
Test-Path public/logo-culture.png

# หรือ
Test-Path public/Logo.png
```

## ขั้นตอนที่ 3: แก้ไข Code (ถ้าใช้ชื่อไฟล์อื่น)

ถ้าคุณใช้ชื่อไฟล์อื่น เช่น `Logo.png` ให้แก้ไขใน:

**ไฟล์:** `app/(admin)/dashboard/layout.tsx`

```typescript
// เปลี่ยนจาก
<img src="/logo-culture.png" ... />

// เป็น
<img src="/Logo.png" ... />
```

## ตัวอย่าง Logo ที่ควรมี

จากรูปที่คุณส่งมา logo ควรเป็น:
- ตราครุฑสีเหลือง (ตราราชการ)
- พื้นหลังโปร่งใส (PNG)
- ขนาดแนะนำ: 200x200 pixels หรือใหญ่กว่า
- ไฟล์ไม่ควรเกิน 100KB

## สีที่ใช้

จาก navbar ในรูป:
- **สีเขียวหลัก:** #00B050
- **สีเขียวเข้ม:** #009944
- **ข้อความ:** สีขาว

Code ได้ปรับให้ใช้สีเขียวแล้ว ✅

## ตำแหน่ง Logo

Logo จะแสดงที่:
1. **Sidebar (เต็ม):** Logo + ข้อความ
2. **Sidebar (แคบ):** Logo อย่างเดียว
3. ขนาด:
   - Sidebar เต็ม: 50px
   - Sidebar แคบ: 40px

## หลังจากเพิ่ม Logo แล้ว

```powershell
# Restart dev server
npm run dev
```

แล้วเปิด browser ดู:
- http://localhost:3000/login
- Login: root / admin
- ควรเห็น logo ที่ sidebar

## ถ้า Logo ไม่แสดง

### 1. ตรวจสอบชื่อไฟล์
```powershell
ls public/*.png
```

### 2. ตรวจสอบ path ใน code
```typescript
// ใน layout.tsx ควรเป็น
<img src="/logo-culture.png" ... />
// หรือ
<img src="/Logo.png" ... />
```

### 3. Clear cache
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### 4. Hard reload browser
- กด Ctrl+Shift+R
- หรือ F12 → Network → Disable cache

## Alternative: ใช้ Logo ที่มีอยู่

ถ้าต้องการใช้ `public/Logo.png` ที่มีอยู่:

**แก้ไขใน:** `app/(admin)/dashboard/layout.tsx`

```typescript
// หาบรรทัดที่มี
src="/logo-culture.png"

// เปลี่ยนเป็น
src="/Logo.png"
```

## ตัวอย่าง Code ที่แก้แล้ว

```typescript
<CSidebarBrand className="d-none d-md-flex sidebar-brand-green">
  <div className="sidebar-brand-full px-3 py-3 d-flex align-items-center">
    <img 
      src="/Logo.png"  // ← ใช้ไฟล์ที่มีอยู่
      alt="กรมส่งเสริมวัฒนธรรม" 
      style={{ height: '50px', marginRight: '12px' }}
    />
    <div>
      <h6 className="mb-0 text-white fw-bold">โครงการคัดเลือกสถานศึกษา</h6>
      <small className="text-white-75">ตามกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์</small>
    </div>
  </div>
</CSidebarBrand>
```

---

**สรุป:**
1. ✅ Sidebar สีเขียว (#00B050)
2. ⏳ เพิ่มไฟล์ `public/logo-culture.png` หรือใช้ `public/Logo.png`
3. ✅ Code พร้อมแสดง logo แล้ว
4. ⏳ Restart dev server

**หมายเหตุ:** ถ้าคุณมีไฟล์ logo แล้ว แค่วางใน `public/` folder และ restart dev server ก็จะแสดงทันที!
