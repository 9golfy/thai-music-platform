# Step 8 Validation Message Feature ✅

## สรุปการเปลี่ยนแปลง

เพิ่ม validation message แบบ real-time ใน Step 8 เพื่อแจ้งเตือนผู้ใช้เมื่อ checkbox ถูกติ๊กแต่ไม่มีข้อมูลใน input fields

## ไฟล์ที่แก้ไข

`components-regist-support/forms/steps/Step8.tsx`

## Features ที่เพิ่ม

### 1. Real-time Validation Message

แสดงข้อความ **"กรุณากรอกข้อมูลให้ครบถ้วน"** สีแดงเมื่อ:
- Checkbox ถูกติ๊ก (checked = true)
- แต่ไม่มีข้อมูลใน input fields ที่เกี่ยวข้อง

### 2. Validation Logic สำหรับแต่ละ Section

#### โรงเรียน
```typescript
const isSchoolFieldsEmpty = heardFromSchool && 
  (!heardFromSchoolName || heardFromSchoolName.trim() === '') &&
  (!heardFromSchoolDistrict || heardFromSchoolDistrict.trim() === '') &&
  (!heardFromSchoolProvince || heardFromSchoolProvince.trim() === '');
```
- แสดง error เมื่อ: checkbox ติ๊ก แต่ทั้ง 3 fields ว่างหมด

#### สำนักงานวัฒนธรรมจังหวัด
```typescript
const isCulturalOfficeFieldEmpty = heardFromCulturalOffice && 
  (!heardFromCulturalOfficeName || heardFromCulturalOfficeName.trim() === '');
```
- แสดง error เมื่อ: checkbox ติ๊ก แต่ field ว่าง

#### สำนักงานเขตพื้นที่การศึกษา
```typescript
const isEducationAreaFieldsEmpty = heardFromEducationArea && 
  (!heardFromEducationAreaName || heardFromEducationAreaName.trim() === '') &&
  (!heardFromEducationAreaProvince || heardFromEducationAreaProvince.trim() === '');
```
- แสดง error เมื่อ: checkbox ติ๊ก แต่ทั้ง 2 fields ว่างหมด

#### อื่น ๆ
```typescript
const isOtherFieldEmpty = heardFromOther && 
  (!heardFromOtherDetail || heardFromOtherDetail.trim() === '');
```
- แสดง error เมื่อ: checkbox ติ๊ก แต่ field ว่าง

## UI Implementation

### Error Message Display

```tsx
{isSchoolFieldsEmpty && (
  <p className="text-red-500 text-sm">กรุณากรอกข้อมูลให้ครบถ้วน</p>
)}
```

**Styling**:
- `text-red-500` - สีแดง
- `text-sm` - ขนาดตัวอักษรเล็ก
- `mt-1` - margin-top 0.25rem (บางส่วน)

## User Experience Flow

### Scenario 1: User ติ๊ก checkbox แล้วลบข้อมูล

1. User กรอก "ชื่อโรงเรียน"
2. ✅ Checkbox "โรงเรียน" ถูก check อัตโนมัติ
3. User ลบข้อมูลที่กรอก (ทั้ง 3 fields ว่างหมด)
4. ❌ แสดงข้อความ "กรุณากรอกข้อมูลให้ครบถ้วน" สีแดง

### Scenario 2: User กรอกข้อมูลบางส่วน

1. User ติ๊ก checkbox "โรงเรียน"
2. User กรอกแค่ "อำเภอ" (ไม่กรอก "ชื่อโรงเรียน" และ "จังหวัด")
3. ✅ ไม่แสดง error (เพราะมีข้อมูลอย่างน้อย 1 field)

### Scenario 3: User ติ๊ก checkbox โดยไม่กรอกข้อมูล

1. User ติ๊ก checkbox "สำนักงานวัฒนธรรมจังหวัด"
2. ไม่กรอกข้อมูลใน input field
3. ❌ แสดงข้อความ "กรุณากรอกข้อมูลให้ครบถ้วน" สีแดง

### Scenario 4: User กรอกข้อมูลหลังเห็น error

1. แสดง error message
2. User กรอกข้อมูลใน input field
3. ✅ Error message หายไปทันที (real-time)

## Logic Details

### AND Condition (&&)
ใช้ AND เพื่อตรวจสอบว่า **ทุก field** ว่างหรือไม่:
```typescript
field1.trim() === '' && field2.trim() === '' && field3.trim() === ''
```
- ถ้ามี field ใดมีข้อมูล → ไม่แสดง error
- ถ้าทุก field ว่าง → แสดง error

### Trim Validation
ใช้ `.trim()` เพื่อตรวจสอบว่าไม่ใช่ whitespace เปล่า:
```typescript
value.trim() === ''
```

### Real-time Update
ใช้ `watch()` จาก react-hook-form:
- ตรวจสอบ real-time ทุกครั้งที่มีการเปลี่ยนแปลง
- ไม่ต้องรอ blur หรือ submit

## Benefits

1. **Immediate Feedback**: ผู้ใช้เห็น error ทันทีที่เกิดปัญหา
2. **Clear Guidance**: บอกชัดเจนว่าต้องกรอกข้อมูล
3. **Prevent Submission Errors**: ลดโอกาสที่ form จะ submit ไม่ผ่าน
4. **Better UX**: ผู้ใช้รู้ว่าต้องทำอะไรต่อ

## Testing

### Test Case 1: โรงเรียน - ลบข้อมูลทั้งหมด
1. กรอก "ชื่อโรงเรียน"
2. Checkbox ถูก check อัตโนมัติ
3. ลบข้อมูลทั้งหมด
4. Expected: แสดง "กรุณากรอกข้อมูลให้ครบถ้วน"

### Test Case 2: โรงเรียน - กรอกบางส่วน
1. ติ๊ก checkbox "โรงเรียน"
2. กรอกแค่ "อำเภอ"
3. Expected: ไม่แสดง error

### Test Case 3: สำนักงานวัฒนธรรม - ติ๊กแล้วไม่กรอก
1. ติ๊ก checkbox "สำนักงานวัฒนธรรมจังหวัด"
2. ไม่กรอกข้อมูล
3. Expected: แสดง "กรุณากรอกข้อมูลให้ครบถ้วน"

### Test Case 4: กรอกข้อมูลหลังเห็น error
1. แสดง error message
2. กรอกข้อมูล
3. Expected: error หายไปทันที

### Test Case 5: Uncheck checkbox
1. แสดง error message
2. Uncheck checkbox
3. Expected: error หายไป

## Visual Example

```
☑ โรงเรียน
  [                    ] ชื่อโรงเรียน
  [                    ] อำเภอ
  [                    ] จังหวัด
  ❌ กรุณากรอกข้อมูลให้ครบถ้วน  ← แสดงเมื่อ checkbox ติ๊กแต่ไม่มีข้อมูล
```

```
☑ โรงเรียน
  [ โรงเรียนทดสอบ      ] ชื่อโรงเรียน
  [                    ] อำเภอ
  [                    ] จังหวัด
  ✅ ไม่แสดง error (มีข้อมูลอย่างน้อย 1 field)
```

## Code Structure

```typescript
// 1. Watch checkboxes
const heardFromSchool = watch('heardFromSchool');

// 2. Watch input fields
const heardFromSchoolName = watch('heardFromSchoolName');

// 3. Check if empty
const isSchoolFieldsEmpty = heardFromSchool && 
  (!heardFromSchoolName || heardFromSchoolName.trim() === '');

// 4. Display error
{isSchoolFieldsEmpty && (
  <p className="text-red-500 text-sm">กรุณากรอกข้อมูลให้ครบถ้วน</p>
)}
```

## Build Status

✅ **Build Successful**

```
Route (app)
└ ○ /regist-support
```

## Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| Error Detection | ❌ Only on submit | ✅ Real-time |
| User Feedback | ❌ No warning | ✅ Clear message |
| Error Prevention | ⚠️ Low | ✅ High |
| UX | ⚠️ Confusing | ✅ Clear |

## Related Features

1. **Auto-Check Checkbox** - ติ๊ก checkbox อัตโนมัติเมื่อกรอกข้อมูล
2. **Validation Message** - แสดง error เมื่อ checkbox ติ๊กแต่ไม่มีข้อมูล
3. **Real-time Validation** - ตรวจสอบทันทีที่มีการเปลี่ยนแปลง

## Summary

เพิ่ม validation message แบบ real-time เพื่อแจ้งเตือนผู้ใช้เมื่อ checkbox ถูกติ๊กแต่ไม่มีข้อมูล ช่วยให้ผู้ใช้รู้ว่าต้องกรอกข้อมูลก่อน submit form ลดโอกาสเกิด error และปรับปรุง UX ให้ดีขึ้น
