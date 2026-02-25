# Thai Music Platform

โครงการคัดเลือกกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์

## โครงสร้างโปรเจค

```
app/
├── (front)/              # Frontend pages
│   ├── page.tsx         # Home (from landing)
│   ├── about/           # เกี่ยวกับโครงการ
│   ├── certificate/     # ใบรับรอง
│   ├── download/        # ดาวน์โหลดเอกสาร
│   ├── contract/        # สัญญา
│   ├── regist100/       # ลงทะเบียนโรงเรียนดนตรีไทย 100%
│   └── regist-support/  # ลงทะเบียนโรงเรียนสนับสนุนฯ
├── (admin)/             # Admin pages
│   ├── login/           # เข้าสู่ระบบ
│   ├── forgetpassword/  # ลืมรหัสผ่าน
│   └── dashboard/       # แดชบอร์ด
│       ├── members/     # จัดการสมาชิก
│       ├── allschools/  # โรงเรียนทั้งหมด
│       └── schools/[id]/ # รายละเอียดโรงเรียน
├── api/                 # API routes
├── components/          # Shared components (from landing)
├── components-regist/   # Registration components (from regist)
├── hooks/               # Custom hooks
├── lib/                 # Utilities
└── globals.css          # Global styles
```

## การติดตั้ง

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Run development server
npm run dev
```

## Scripts

- `npm run dev` - เริ่ม development server
- `npm run build` - Build สำหรับ production
- `npm start` - เริ่ม production server
- `npm run lint` - ตรวจสอบ code

## เทคโนโลยีที่ใช้

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- MongoDB
- Radix UI
- React Hook Form
- Zod

## หมายเหตุ

โปรเจคนี้รวม 2 โปรเจคเดิม:
- `/landing` → `app/(front)/` (home page และ components)
- `/regist` → `app/(front)/regist100/` และ `app/api/register100/` (โรงเรียนดนตรีไทย 100%)
- New: `app/(front)/regist-support/` และ `app/api/register-support/` (โรงเรียนสนับสนุนฯ)
