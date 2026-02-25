# คู่มือการย้ายโปรเจค

## สิ่งที่ทำแล้ว

### 1. โครงสร้างโปรเจคใหม่
- ✅ รวม `/landing` และ `/regist` เข้าเป็นโปรเจคเดียวที่ `/app`
- ✅ ใช้ Next.js App Router กับ Route Groups
- ✅ แยก Frontend `(front)` และ Admin `(admin)` routes

### 2. Frontend Routes (front)
- ✅ `/` - Home page (จาก landing)
- ✅ `/about` - เกี่ยวกับโครงการ
- ✅ `/certificate` - ใบรับรอง
- ✅ `/download` - ดาวน์โหลดเอกสาร
- ✅ `/contract` - สัญญา
- ✅ `/regist100` - ลงทะเบียนโรงเรียนดนตรีไทย 100%
- ✅ `/regist-support` - ลงทะเบียนโรงเรียนสนับสนุนฯ

### 3. Admin Routes (admin)
- ✅ `/login` - เข้าสู่ระบบ
- ✅ `/forgetpassword` - ลืมรหัสผ่าน
- ✅ `/dashboard` - แดชบอร์ด
- ✅ `/dashboard/members` - จัดการสมาชิก
- ✅ `/dashboard/allschools` - โรงเรียนทั้งหมด
- ✅ `/dashboard/schools/[id]` - รายละเอียดโรงเรียน

### 4. API Routes
- ✅ `/api/register100` - API สำหรับลงทะเบียนโรงเรียนดนตรีไทย 100%
- ✅ `/api/register-support` - API สำหรับลงทะเบียนโรงเรียนสนับสนุนฯ

### 5. Components & Assets
- ✅ คัดลอก components จาก landing → `app/components/`
- ✅ คัดลอก components จาก regist → `app/components-regist/`
- ✅ คัดลอก public assets จาก landing → `public/`
- ✅ คัดลอก lib และ hooks

### 6. Configuration Files
- ✅ อัพเดท `package.json` รวม dependencies ทั้งหมด
- ✅ สร้าง `tsconfig.json` ใหม่
- ✅ สร้าง `next.config.ts`
- ✅ รวม `globals.css` จาก landing
- ✅ สร้าง `.env.local.example`

## สิ่งที่ต้องทำต่อ

### 1. Environment Variables
```bash
cp .env.local.example .env.local
# แก้ไข MONGODB_URI ให้ตรงกับ database ของคุณ
```

### 2. ตรวจสอบ Import Paths
- ตรวจสอบ imports ใน `app/components-regist/` ให้ชี้ไปที่ path ที่ถูกต้อง
- อาจต้องแก้ `@/components` → `@/app/components`
- อาจต้องแก้ `@/lib` → `@/app/lib`

### 3. ทดสอบการทำงาน
```bash
npm run dev
```

เปิดเบราว์เซอร์:
- http://localhost:3000 - Home page
- http://localhost:3000/regist100 - Registration form (โรงเรียนดนตรีไทย 100%)
- http://localhost:3000/regist-support - Registration form (โรงเรียนสนับสนุนฯ)
- http://localhost:3000/login - Admin login

### 4. Implement Admin Features
หน้า Admin ยังเป็น placeholder ต้องพัฒนาต่อ:
- Authentication system
- Dashboard analytics
- Members management
- Schools data table
- School details view

### 5. Database
- ตรวจสอบ MongoDB connection
- Collection ใหม่: `register100_submissions` (เปลี่ยนจาก register69_submissions)

### 6. ลบโฟลเดอร์เก่า (ถ้าต้องการ)
```bash
# สำรองข้อมูลก่อน!
# rm -rf landing/
# rm -rf regist/
```

## หมายเหตุ

- Route Groups `(front)` และ `(admin)` ไม่แสดงใน URL
- ตัวอย่าง: `app/(front)/about/page.tsx` → URL: `/about`
- ตัวอย่าง: `app/(admin)/login/page.tsx` → URL: `/login`
- Components ของ regist อยู่ที่ `app/components-regist/` เพื่อไม่ให้ชนกับ components ของ landing

## ปัญหาที่อาจพบ

1. **Import errors**: แก้ path ใน components ให้ถูกต้อง
2. **MongoDB connection**: ตรวจสอบ `.env.local`
3. **Missing dependencies**: รัน `npm install` อีกครั้ง
4. **File upload path**: ตรวจสอบ `public/uploads/` directory permissions
