# System Administrator Setup

## ข้อมูล System Admin

**Username:** root@thaimusic.com  
**Password:** P@sswordAdmin123  
**Role:** super_admin  
**สถานะ:** Protected (ไม่สามารถลบได้)

## คุณสมบัติ System Admin

### 🛡️ การป้องกัน
- **ไม่สามารถลบได้:** System admin จะไม่สามารถถูกลบผ่าน API หรือ UI
- **ป้องกันอัตโนมัติ:** ระบบจะตรวจสอบทั้ง `isSystemAdmin: true` และ `email: 'root@thaimusic.com'`
- **แสดงสถานะ:** จะแสดง badge "System Admin" สีแดงใน UI

### 🔧 การจัดการ
- **สิทธิ์เต็ม:** มีสิทธิ์ในการจัดการทุกอย่างในระบบ
- **สร้าง/แก้ไข/ลบ:** สามารถจัดการ users อื่นๆ ได้ทั้งหมด
- **เข้าถึงทุกหน้า:** สามารถเข้าถึงทุก dashboard และ admin panel

## สคริปต์ที่เกี่ยวข้อง

### 1. สร้าง System Admin
```bash
node scripts/create-system-admin.js
```
- สร้าง system admin ใหม่
- หากมีอยู่แล้วจะอัปเดตให้มีการป้องกัน
- ตั้งค่า `isSystemAdmin: true` และ `isActive: true`

### 2. ตรวจสอบสถานะ System Admin
```bash
node scripts/check-system-admin.js
```
- แสดงข้อมูล system admin
- ตรวจสอบสถานะการป้องกัน
- แสดงสถิติ users ทั้งหมด

### 3. ตรวจสอบระบบสะอาด
```bash
node scripts/verify-clean-state.js
```
- ตรวจสอบว่าระบบพร้อมสำหรับการทดสอบ
- แสดงจำนวน records ในฐานข้อมูล
- ตรวจสอบไฟล์ที่อัปโหลด

## การป้องกันในโค้ด

### API Protection (app/api/users/[id]/route.ts)
```typescript
// Prevent deletion of system admin
if (user.isSystemAdmin === true || user.email === 'root@thaimusic.com') {
  return NextResponse.json(
    { success: false, message: 'ไม่สามารถลบ System Administrator ได้' },
    { status: 403 }
  );
}
```

### UI Protection (components/admin/UsersDataTable.tsx)
```typescript
// Hide delete button for system admin
{session.role === 'root' && 
 user.role !== 'root' && 
 user.isSystemAdmin !== true && 
 user.email !== 'root@thaimusic.com' && (
  <DeleteUserButton />
)}

// Show system admin badge
{(user.isSystemAdmin === true || user.email === 'root@thaimusic.com') && (
  <Badge variant="destructive" className="text-xs">
    System Admin
  </Badge>
)}
```

## การเข้าสู่ระบบ

1. ไปที่ `/dcp-admin` หรือ `/login`
2. กรอก Email: `root@thaimusic.com`
3. กรอก Password: `P@sswordAdmin123`
4. กดเข้าสู่ระบบ

## หมายเหตุสำคัญ

⚠️ **ความปลอดภัย:**
- เก็บรหัสผ่านไว้อย่างปลอดภัย
- เปลี่ยนรหัสผ่านเป็นระยะ
- ใช้งานเฉพาะเมื่อจำเป็น

✅ **การทดสอบ:**
- System admin จะไม่ถูกลบเมื่อรัน clear-test-data.js
- สามารถใช้เพื่อทดสอบระบบได้ตลอดเวลา
- มีสิทธิ์เข้าถึงทุกฟีเจอร์

🔄 **การบำรุงรักษา:**
- รันสคริปต์ตรวจสอบเป็นระยะ
- ตรวจสอบ logs การเข้าใช้งาน
- อัปเดตข้อมูลเมื่อจำเป็น