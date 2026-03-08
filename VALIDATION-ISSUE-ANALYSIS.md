# Validation Issue Analysis

## ปัญหา
Test 4 และ Test 5 ไม่แสดง missing fields modal แม้ว่าจะไม่ติ๊ก certification checkbox

## การวิเคราะห์

### 1. Schema Validation
```typescript
certifiedINFOByAdminName: z.boolean().refine((val) => val === true, {
  message: 'กรุณายืนยันความถูกต้องของข้อมูล',
})
```
✅ Schema มี validation แล้ว - ต้องเป็น `true`

### 2. Default Value
```typescript
defaultValues: {
  certifiedINFOByAdminName: false,
}
```
✅ Default value เป็น `false` ถูกต้อง

### 3. Custom Validation in onSubmit
```typescript
if (!data.certifiedINFOByAdminName) {
  missingFields.push('การรับรองข้อมูล...');
}
```
✅ Custom validation มีแล้ว

### 4. Submit Button
```typescript
<button type="submit" ...>
  ส่งแบบฟอร์ม
</button>
```
⚠️ ปุ่มเป็น `type="submit"` จะเรียก `form.handleSubmit(onSubmit)` โดยตรง

## สมมติฐาน

### สมมติฐาน 1: Schema Validation ไม่ทำงาน
- `react-hook-form` อาจไม่ validate checkbox field
- หรือ validation ถูก bypass ไปแล้ว

### สมมติฐาน 2: Checkbox ถูกติ๊กโดยอัตโนมัติ
- Browser อาจติ๊ก checkbox โดยอัตโนมัติ
- หรือ Playwright ติ๊กโดยไม่ตั้งใจ

### สมมติฐาน 3: Form Submit ไม่ผ่าน onSubmit
- Form อาจถูกส่งโดยตรงไปที่ API
- โดยไม่ผ่าน validation ใน `onSubmit`

## การทดสอบ

### Test 1: ตรวจสอบ Console Log
- เพิ่ม console.log ใน `onSubmit`
- ผลลัพธ์: **ไม่เห็น console.log** ❌
- สรุป: `onSubmit` ไม่ถูกเรียก หรือถูกเรียกแต่ไม่แสดง log

### Test 2: ตรวจสอบ Browser Console
- เพิ่ม console listener ใน test
- ผลลัพธ์: เห็น log จาก jquery.Thailand.js แต่ไม่เห็น log จาก onSubmit
- สรุป: `onSubmit` ไม่ถูกเรียก

## สรุป

ปัญหาคือ **`onSubmit` function ไม่ถูกเรียก** เมื่อกดปุ่ม "ส่งแบบฟอร์ม"

เป็นไปได้ว่า:
1. Form validation ของ `react-hook-form` ผ่านแล้ว (checkbox เป็น true)
2. Form ถูกส่งไปที่ API โดยตรง
3. `onSubmit` ถูก bypass ไป

## แนวทางแก้ไข

### แนวทาง 1: ตรวจสอบว่า checkbox ถูกติ๊กหรือไม่
```typescript
// ใน test เพิ่ม
const isChecked = await page.isChecked('input[name="certifiedINFOByAdminName"]');
console.log('Checkbox checked:', isChecked);
```

### แนวทาง 2: Force uncheck checkbox
```typescript
// ใน test
await page.uncheck('input[name="certifiedINFOByAdminName"]');
await page.waitForTimeout(500);
```

### แนวทาง 3: เปลี่ยนปุ่มเป็น type="button"
```typescript
<button
  type="button"
  onClick={() => form.handleSubmit(onSubmit)()}
  ...
>
  ส่งแบบฟอร์ม
</button>
```

## ขั้นตอนต่อไป
1. ตรวจสอบว่า checkbox ถูกติ๊กหรือไม่ใน test
2. ถ้าถูกติ๊ก ให้ uncheck ก่อนกดส่ง
3. ถ้ายัง ไม่ได้ ให้เปลี่ยนปุ่มเป็น type="button"
