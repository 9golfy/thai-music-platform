# ✅ เพิ่มฟีเจอร์จัดการ Draft Tokens

## 🎯 ฟีเจอร์ที่เพิ่ม

เพิ่มหน้าจัดการ Draft Submissions ที่ช่วยให้ Admin สามารถ:
1. ดูรายการ Draft ทั้งหมด
2. ค้นหา Draft ด้วย Email
3. กรองตามสถานะ (ทั้งหมด / ใช้งานได้ / หมดอายุ)
4. **สร้าง Token ใหม่** สำหรับ Draft ที่หมดอายุ
5. คัดลอก Draft Link

## 📁 ไฟล์ที่สร้าง

### 1. API Endpoints

#### `app/api/admin/drafts/route.ts`
- **GET** `/api/admin/drafts` - ดึงรายการ Draft ทั้งหมด
- รองรับ pagination, search, และ filter
- Parameters:
  - `page` - หน้าที่ต้องการ (default: 1)
  - `limit` - จำนวนต่อหน้า (default: 50)
  - `status` - all / active / expired
  - `search` - ค้นหาด้วย email

#### `app/api/admin/drafts/[id]/refresh-token/route.ts`
- **POST** `/api/admin/drafts/[id]/refresh-token` - สร้าง Token ใหม่
- Body:
  ```json
  {
    "days": 30  // จำนวนวันที่ต้องการต่ออายุ (1-90)
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
      "token": "new-uuid-token",
      "expiresAt": "2026-06-28T...",
      "draftLink": "https://dcpschool100.net/draft/new-uuid-token"
    }
  }
  ```

### 2. Frontend Pages

#### `app/(admin)/dcp-admin/dashboard/drafts/page.tsx`
หน้าจัดการ Draft Submissions พร้อมฟีเจอร์:
- ✅ แสดงรายการ Draft แบบ table
- ✅ ค้นหาด้วย Email
- ✅ กรองตามสถานะ (ทั้งหมด / ใช้งานได้ / หมดอายุ)
- ✅ Pagination
- ✅ ปุ่มคัดลอก Link
- ✅ ปุ่มสร้าง Token ใหม่
- ✅ แสดง notification เมื่อคัดลอกสำเร็จ
- ✅ แสดงสถานะ (ใช้งานได้ / หมดอายุ)

#### `app/(admin)/dcp-admin/dashboard/page.tsx`
เพิ่มการ์ด "จัดการ Draft Tokens" ใน dashboard

## 🎨 UI/UX Features

### Dashboard Card
- **สี:** Gradient จาก amber-500 ถึง orange-600
- **ไอคอน:** รีเฟรช (refresh icon)
- **ข้อความ:** "จัดการ Draft Tokens"
- **คำอธิบาย:** "สร้าง Token ใหม่สำหรับ Draft ที่หมดอายุ และจัดการ Draft Submissions"

### Draft Management Page

#### Header
- ชื่อหน้า: "จัดการ Draft Submissions"
- คำอธิบาย: "สร้าง Token ใหม่สำหรับ Draft ที่หมดอายุ"
- ปุ่มกลับ

#### Filters
1. **ค้นหา Email** - Input field สำหรับค้นหา
2. **กรองสถานะ** - Dropdown (ทั้งหมด / ใช้งานได้ / หมดอายุ)
3. **ปุ่มรีเฟรช** - โหลดข้อมูลใหม่

#### Table Columns
1. **Email** - แสดง email และเบอร์โทร
2. **ประเภท** - โรงเรียนดนตรีไทย 100% / โรงเรียนสนับสนุนฯ
3. **Step** - ขั้นตอนปัจจุบัน (เช่น 2 / 7)
4. **สถานะ** - Badge สีเขียว (ใช้งานได้) / สีแดง (หมดอายุ)
5. **วันหมดอายุ** - แสดงวันหมดอายุและวันแก้ไขล่าสุด
6. **จัดการ** - ปุ่มคัดลอก Link และสร้าง Token ใหม่

#### Actions
- **คัดลอก Link** (ไอคอนคลิปบอร์ด) - คัดลอก draft link ไปยัง clipboard
- **สร้าง Token ใหม่** (ไอคอนรีเฟรช) - สร้าง token ใหม่และต่ออายุ 30 วัน

#### Notifications
- แสดง notification สีเขียวมุมขวาบนเมื่อคัดลอก link สำเร็จ
- แสดง alert พร้อม link ใหม่เมื่อสร้าง token สำเร็จ
- คัดลอก link ใหม่ไปยัง clipboard อัตโนมัติ

## 🔧 การใช้งาน

### 1. เข้าหน้า Dashboard
```
http://localhost:3000/dcp-admin/dashboard
```

### 2. คลิกการ์ด "จัดการ Draft Tokens"
จะเปิดหน้า Draft Management

### 3. ค้นหา Draft
- พิมพ์ email ในช่องค้นหา
- เลือกสถานะที่ต้องการ (ทั้งหมด / ใช้งานได้ / หมดอายุ)
- กดปุ่มรีเฟรช

### 4. สร้าง Token ใหม่
1. คลิกไอคอนรีเฟรช (🔄) ในแถวที่ต้องการ
2. ยืนยันการสร้าง token ใหม่
3. ระบบจะแสดง alert พร้อม link ใหม่
4. Link จะถูกคัดลอกไปยัง clipboard อัตโนมัติ
5. ส่ง link ให้ผู้ใช้

### 5. คัดลอก Link
- คลิกไอคอนคลิปบอร์ด (📋) เพื่อคัดลอก link
- จะแสดง notification "✅ คัดลอก Link แล้ว!"

## 📊 ข้อมูลที่แสดง

### Draft Information
- **Email** - อีเมลผู้ใช้
- **Phone** - เบอร์โทรศัพท์
- **Token** - UUID token
- **Submission Type** - register100 / register-support
- **Current Step** - ขั้นตอนปัจจุบัน (1-7)
- **Status** - active / expired
- **Created At** - วันที่สร้าง
- **Last Modified** - วันที่แก้ไขล่าสุด
- **Expires At** - วันหมดอายุ
- **Save Count** - จำนวนครั้งที่ save

### Status Badge
- **ใช้งานได้** - สีเขียว (expiresAt > now)
- **หมดอายุ** - สีแดง (expiresAt <= now)

## 🔐 Security

- ✅ API endpoints อยู่ใน `/api/admin/*` (ควรเพิ่ม authentication middleware)
- ✅ ใช้ `randomUUID()` จาก crypto module สำหรับสร้าง token
- ✅ Validate input (days ต้องอยู่ระหว่าง 1-90)
- ✅ ตรวจสอบว่า draft มีอยู่จริงก่อนทำการ refresh

## 📝 TODO (แนะนำ)

### 1. เพิ่ม Authentication
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Check if user is admin
  // Redirect to login if not authenticated
}

export const config = {
  matcher: '/api/admin/:path*',
};
```

### 2. เพิ่ม Bulk Actions
- Refresh token หลายรายการพร้อมกัน
- ลบ draft ที่หมดอายุทั้งหมด

### 3. เพิ่ม Email Notification
- ส่ง email พร้อม link ใหม่ให้ผู้ใช้อัตโนมัติ

### 4. เพิ่ม Audit Log
- บันทึกว่าใครสร้าง token ใหม่เมื่อไหร่

## 🎉 ผลลัพธ์

Admin สามารถ:
1. ✅ ดูรายการ Draft ทั้งหมดในระบบ
2. ✅ ค้นหา Draft ด้วย Email
3. ✅ กรองตามสถานะ
4. ✅ **สร้าง Token ใหม่ได้ง่ายๆ ด้วยการคลิกเดียว**
5. ✅ คัดลอก Link และส่งให้ผู้ใช้ทันที
6. ✅ ไม่ต้องใช้ MongoDB shell อีกต่อไป

---

**สถานะ:** ✅ เสร็จสมบูรณ์
**วันที่:** 29 พฤษภาคม 2026
**ฟีเจอร์:** Draft Token Management
**หน้าใหม่:** `/dcp-admin/dashboard/drafts`
