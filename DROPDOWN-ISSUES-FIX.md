# Dropdown Issues - Troubleshooting Guide

## ปัญหาที่พบ:
1. รูปไม่แสดง
2. Dropdown ใน edit mode ไม่แสดงค่าที่ submit มา (แสดงเป็นค่า default)

## สาเหตุที่เป็นไปได้:

### ปัญหาที่ 1: รูปไม่แสดง
**สาเหตุ**: Path รูปภาพอาจจะไม่ถูกต้อง หรือไฟล์ไม่มีอยู่จริง

**วิธีแก้**:
1. ตรวจสอบว่ารูปถูก upload และ save ไว้ที่ไหน
2. ตรวจสอบ path ใน database ว่าเป็น `/uploads/...` หรือ `https://...`
3. ตรวจสอบว่าไฟล์มีอยู่จริงใน folder `public/uploads/`

**การตรวจสอบ**:
```bash
# ตรวจสอบไฟล์ใน uploads folder
ls public/uploads/

# ตรวจสอบข้อมูลใน database
node scripts/check-record-detail.js
```

### ปัญหาที่ 2: Dropdown ไม่แสดงค่าที่ submit มา

**สาเหตุที่เป็นไปได้**:
1. ค่าใน database ไม่ตรงกับ options ที่กำหนดใน dropdown
2. ค่าใน database มีช่องว่างหรือตัวอักษรพิเศษที่ไม่ตรงกัน
3. การ map ข้อมูลจาก submission ไป displayData ไม่ถูกต้อง

**ตัวอย่างค่าที่อาจจะไม่ตรงกัน**:

Database มี:
```
"ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย"
```

แต่ options มี:
```
"ครูผู้สอนดนตรีไทยในโรงเรียนที่สำเร็จการศึกษาดนตรีไทย"
```

**วิธีแก้**:

#### Option 1: แก้ไข options ให้ตรงกับข้อมูลใน database

ใน `Register100DetailView.tsx` line ~714:
```typescript
options={[
  'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย', // เพิ่ม "สาขาวิชา"
  'ครูภูมิปัญญาในท้องถิ่น',
  'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย',
  'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน' // เพิ่ม "ในปัจจุบัน"
]}
```

#### Option 2: เพิ่ม fallback ใน SelectField

แก้ไข SelectField component ให้แสดงค่าที่มีอยู่แม้ว่าจะไม่อยู่ใน options:

```typescript
<select
  value={value || ''}
  onChange={(e) => onChange(e.target.value)}
  required={required}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
>
  <option value="">เลือก{label}</option>
  {/* แสดงค่าปัจจุบันถ้าไม่อยู่ใน options */}
  {value && !options.includes(value) && (
    <option value={value}>{value} (ค่าเดิม)</option>
  )}
  {options.map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
  ))}
</select>
```

#### Option 3: เพิ่ม debug logging

เพิ่ม console.log เพื่อดูค่าที่ได้จริง:

```typescript
// ใน SelectField component
console.log('SelectField Debug:', {
  label,
  value,
  isEditMode,
  valueInOptions: options.includes(value)
});
```

## วิธีตรวจสอบและแก้ไข:

### ขั้นตอนที่ 1: ตรวจสอบข้อมูลใน Database

เปิด browser console (F12) แล้วดูที่ Network tab:
1. คลิกที่ record ที่มีปัญหา
2. ดูที่ API call `/api/register100/[id]`
3. ดู Response data โดยเฉพาะ:
   - `thaiMusicTeachers[].teacherQualification`
   - `awards[].awardLevel`
   - `mgtImage`
   - `thaiMusicTeachers[].teacherImage`

### ขั้นตอนที่ 2: เปรียบเทียบกับ Options

เปรียบเทียบค่าที่ได้จาก API กับ options ใน code:

**Step 4 - Teacher Qualification Options:**
```
1. ครูผู้สอนดนตรีไทยในโรงเรียนที่สำเร็จการศึกษาดนตรีไทย
2. ครูภูมิปัญญาในท้องถิ่น
3. ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย
4. วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในโรงเรียน
```

**Step 5 - Award Level Options:**
```
1. ระดับอำเภอ (5 คะแนน)
2. ระดับจังหวัด (10 คะแนน)
3. ระดับภาค (15 คะแนน)
4. ระดับประเทศ (20 คะแนน)
```

### ขั้นตอนที่ 3: แก้ไขตามที่พบ

ถ้าพบว่าค่าไม่ตรงกัน ให้แก้ไขใน `Register100DetailView.tsx`:
- Line ~714: Teacher qualification options
- Line ~1010: Award level options

## การทดสอบหลังแก้ไข:

1. Refresh หน้า detail view
2. คลิก EDIT
3. ตรวจสอบว่า dropdown แสดงค่าที่ถูกต้อง
4. ลองเปลี่ยนค่าและ SAVE
5. ตรวจสอบว่าค่าใหม่ถูก save ลง database

## หมายเหตุ:

- ถ้ารูปไม่แสดง อาจจะต้องตรวจสอบว่าไฟล์ถูก upload จริงหรือไม่
- ถ้า dropdown ยังไม่แสดงค่า ให้ใช้ Option 2 (fallback) เพื่อแสดงค่าเดิมไว้ก่อน
- ควรทำให้ options ตรงกับที่ใช้ในฟอร์มลงทะเบียนหลัก (regist100 form)
