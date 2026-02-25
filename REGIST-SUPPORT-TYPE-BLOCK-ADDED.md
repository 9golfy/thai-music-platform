# เพิ่ม Block ประเภทโรงเรียนสนับสนุนฯ ใน Step 1 ✅

## สรุปการเปลี่ยนแปลง

เพิ่ม block "ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย" ที่ด้านบนสุดของ Step 1 ในฟอร์ม regist-support

## ฟิลด์ที่เพิ่มใน Schema

ไฟล์: `lib/validators/registerSupport.schema.ts`

```typescript
// Step 1: ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย
supportType: z.enum(['สถานศึกษา', 'ชุมนุม', 'ชมรม', 'กลุ่ม', 'วงดนตรีไทย']).optional(),
supportTypeName: z.string().optional(),
supportTypeMemberCount: z.coerce.number().optional(),
```

## UI Components ที่เพิ่ม

ไฟล์: `components-regist-support/forms/steps/Step1.tsx`

### 1. Block Header
- **Title**: ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย
- **Subtitle**: ** เลือกได้ประเภทเพียงประเภทเดียว **

### 2. Radio Options (5 ประเภท)

#### ประเภทที่ 1: สถานศึกษา
- Radio button
- Input field: ชื่อสถานศึกษา

#### ประเภทที่ 2: ชุมนุม
- Radio button
- Input field: ชื่อชุมนุม
- Input field: จำนวน (คน)

#### ประเภทที่ 3: ชมรม
- Radio button
- Input field: ชื่อชมรม
- Input field: จำนวน (คน)

#### ประเภทที่ 4: กลุ่ม
- Radio button
- Input field: ชื่อกลุ่ม
- Input field: จำนวน (คน)

#### ประเภทที่ 5: วงดนตรีไทย
- Radio button
- Input field: ชื่อวงดนตรีไทย
- Input field: จำนวน (คน)

## Features

### 1. Radio Selection
- เลือกได้เพียง 1 ประเภท
- Default: ไม่มีการเลือก (no radio checked)

### 2. Conditional Input Fields
- Input fields จะ disabled เมื่อไม่ได้เลือก radio นั้น
- เมื่อเลือก radio ใหม่ จะ clear ค่าเดิมอัตโนมัติ

### 3. Auto-clear Logic
```typescript
// Clear supportTypeName and supportTypeMemberCount when supportType changes
useEffect(() => {
  if (supportType) {
    setValue('supportTypeName', '', { shouldValidate: false });
    setValue('supportTypeMemberCount', undefined, { shouldValidate: false });
  }
}, [supportType, setValue]);
```

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย                │
│ ** เลือกได้ประเภทเพียงประเภทเดียว **                    │
│                                                         │
│ ( ) สถานศึกษา [_________________]                       │
│                                                         │
│ ( ) ชุมนุม [_________________] จำนวน (คน) [_______]    │
│                                                         │
│ ( ) ชมรม [_________________] จำนวน (คน) [_______]      │
│                                                         │
│ ( ) กลุ่ม [_________________] จำนวน (คน) [_______]      │
│                                                         │
│ ( ) วงดนตรีไทย [_________________] จำนวน (คน) [_______]│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ข้อมูลพื้นฐาน                                           │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘
```

## Styling

- **Border**: `border border-neutral-border`
- **Background**: `bg-white`
- **Padding**: `p-6`
- **Border Radius**: `rounded-lg`
- **Title Color**: `text-primary`
- **Subtitle Color**: `text-gray-600`
- **Disabled State**: `disabled:bg-gray-100 disabled:cursor-not-allowed`

## Responsive Design

- Desktop (md+): 2 columns grid สำหรับ input fields ที่มีจำนวนสมาชิก
- Mobile: 1 column stack

```css
grid-cols-1 md:grid-cols-2 gap-4
```

## Build Status

✅ **Build Successful**

```
Route (app)
├ ○ /regist-support
└ ƒ /api/register-support
```

## Testing Checklist

- [ ] เปิดหน้า http://localhost:3000/regist-support
- [ ] ทดสอบเลือก radio แต่ละประเภท
- [ ] ตรวจสอบว่า input fields enable/disable ถูกต้อง
- [ ] ทดสอบกรอกข้อมูลและ submit form
- [ ] ตรวจสอบข้อมูลใน MongoDB collection `register_support_submissions`

## Database Fields

เมื่อ submit form ข้อมูลจะถูกบันทึกใน MongoDB:

```json
{
  "supportType": "ชุมนุม",
  "supportTypeName": "ชุมนุมดนตรีไทยโรงเรียนXXX",
  "supportTypeMemberCount": 25,
  ...
}
```

## Notes

- Block นี้อยู่เหนือ block "ข้อมูลพื้นฐาน"
- ฟิลด์ทั้งหมดเป็น optional (ไม่บังคับกรอก)
- เมื่อเปลี่ยน radio จะ clear ค่าเดิมอัตโนมัติ
- Input fields จะ disabled เมื่อไม่ได้เลือก radio นั้น
