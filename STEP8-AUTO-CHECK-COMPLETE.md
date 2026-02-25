# Step 8 Auto-Check Checkbox Feature ✅

## สรุปการเปลี่ยนแปลง

เพิ่ม logic ใน Step 8 ของฟอร์ม `/regist-support` เพื่อ auto-check checkbox อัตโนมัติเมื่อผู้ใช้กรอกข้อมูลใน input field ใดๆ ที่เกี่ยวข้อง

## ไฟล์ที่แก้ไข

`components-regist-support/forms/steps/Step8.tsx`

## Features ที่เพิ่ม

### 1. Auto-Check Checkbox เมื่อกรอก Input ใดๆ

เมื่อผู้ใช้กรอกข้อมูลใน input field ใดๆ ระบบจะ auto-check checkbox ที่เกี่ยวข้องอัตโนมัติ

#### Checkboxes ที่ได้รับการ Auto-Check:

1. **โรงเรียน** (`heardFromSchool`)
   - Auto-check เมื่อกรอก ANY ของ:
     - `heardFromSchoolName` (ชื่อโรงเรียน)
     - `heardFromSchoolDistrict` (อำเภอ)
     - `heardFromSchoolProvince` (จังหวัด)

2. **สำนักงานวัฒนธรรมจังหวัด** (`heardFromCulturalOffice`)
   - Auto-check เมื่อกรอก:
     - `heardFromCulturalOfficeName` (ชื่อสำนักงาน)

3. **สำนักงานเขตพื้นที่การศึกษา** (`heardFromEducationArea`)
   - Auto-check เมื่อกรอก ANY ของ:
     - `heardFromEducationAreaName` (ชื่อสำนักงาน)
     - `heardFromEducationAreaProvince` (จังหวัด)

4. **อื่น ๆ** (`heardFromOther`)
   - Auto-check เมื่อกรอก:
     - `heardFromOtherDetail` (รายละเอียด)

## Implementation

### Code Added

```typescript
// Watch ALL input fields to auto-check checkboxes
const heardFromSchoolName = watch('heardFromSchoolName');
const heardFromSchoolDistrict = watch('heardFromSchoolDistrict');
const heardFromSchoolProvince = watch('heardFromSchoolProvince');
const heardFromCulturalOfficeName = watch('heardFromCulturalOfficeName');
const heardFromEducationAreaName = watch('heardFromEducationAreaName');
const heardFromEducationAreaProvince = watch('heardFromEducationAreaProvince');
const heardFromOtherDetail = watch('heardFromOtherDetail');

// Auto-check "โรงเรียน" checkbox when user fills ANY of the school fields
useEffect(() => {
  if (
    (heardFromSchoolName && heardFromSchoolName.trim() !== '') ||
    (heardFromSchoolDistrict && heardFromSchoolDistrict.trim() !== '') ||
    (heardFromSchoolProvince && heardFromSchoolProvince.trim() !== '')
  ) {
    setValue('heardFromSchool', true, { shouldValidate: true });
  }
}, [heardFromSchoolName, heardFromSchoolDistrict, heardFromSchoolProvince, setValue]);

// Auto-check "สำนักงานวัฒนธรรมจังหวัด" checkbox
useEffect(() => {
  if (heardFromCulturalOfficeName && heardFromCulturalOfficeName.trim() !== '') {
    setValue('heardFromCulturalOffice', true, { shouldValidate: true });
  }
}, [heardFromCulturalOfficeName, setValue]);

// Auto-check "สำนักงานเขตพื้นที่การศึกษา" checkbox when user fills ANY of the education area fields
useEffect(() => {
  if (
    (heardFromEducationAreaName && heardFromEducationAreaName.trim() !== '') ||
    (heardFromEducationAreaProvince && heardFromEducationAreaProvince.trim() !== '')
  ) {
    setValue('heardFromEducationArea', true, { shouldValidate: true });
  }
}, [heardFromEducationAreaName, heardFromEducationAreaProvince, setValue]);

// Auto-check "อื่น ๆ" checkbox
useEffect(() => {
  if (heardFromOtherDetail && heardFromOtherDetail.trim() !== '') {
    setValue('heardFromOther', true, { shouldValidate: true });
  }
}, [heardFromOtherDetail, setValue]);
```

### Key Features

1. **Multiple Field Monitoring**: ตรวจสอบทุก input field ไม่ใช่แค่ field แรก
2. **OR Logic**: ใช้ OR condition (||) เพื่อ check ว่ามี field ใดๆ ที่มีข้อมูล
3. **Trim Validation**: ตรวจสอบว่าไม่ใช่ whitespace เปล่า
4. **Real-time**: ทำงานทันทีที่มีการเปลี่ยนแปลง

## User Experience

### Before (ก่อนแก้ไข)
1. ผู้ใช้กรอกข้อมูลใน input field
2. ลืมติ๊ก checkbox
3. ❌ ข้อมูลไม่ถูกบันทึก หรือเกิด error

### After (หลังแก้ไข)
1. ผู้ใช้กรอกข้อมูลใน input field
2. ✅ Checkbox ถูกติ๊กอัตโนมัติ
3. ✅ ข้อมูลถูกบันทึกถูกต้อง

## Benefits

1. **ลด User Error**: ผู้ใช้ไม่ต้องจำว่าต้องติ๊ก checkbox
2. **UX ที่ดีขึ้น**: Form ทำงานอัตโนมัติตามพฤติกรรมผู้ใช้
3. **ลด Validation Errors**: ลดโอกาสที่ form จะ submit ไม่ผ่าน
4. **Intuitive**: ระบบเข้าใจเจตนาของผู้ใช้

## Logic Flow

```
User Action → Watch Field → Detect Change → Auto-Check Checkbox
     ↓             ↓              ↓                  ↓
  กรอก input → useEffect → trim() !== '' → setValue(true)
```

## Validation

- ตรวจสอบว่า input ไม่ใช่ string ว่าง (`trim() !== ''`)
- ใช้ `shouldValidate: true` เพื่อ trigger validation
- Checkbox จะถูก check เฉพาะเมื่อมีข้อมูลจริง

## Testing

### Manual Test Steps

1. เปิดฟอร์ม: http://localhost:3000/regist-support
2. ไปที่ Step 8
3. กรอกข้อมูลใน input field (เช่น "ชื่อโรงเรียน")
4. ✅ ตรวจสอบว่า checkbox ถูกติ๊กอัตโนมัติ

### Test Cases

#### Test Case 1: โรงเรียน - ชื่อโรงเรียน
- กรอก "โรงเรียนทดสอบ" ใน `heardFromSchoolName`
- Expected: `heardFromSchool` checkbox ถูก check

#### Test Case 2: โรงเรียน - อำเภอ
- กรอก "เมือง" ใน `heardFromSchoolDistrict`
- Expected: `heardFromSchool` checkbox ถูก check

#### Test Case 3: โรงเรียน - จังหวัด
- กรอก "กรุงเทพมหานคร" ใน `heardFromSchoolProvince`
- Expected: `heardFromSchool` checkbox ถูก check

#### Test Case 4: สำนักงานวัฒนธรรม
- กรอก "สำนักงานวัฒนธรรมกรุงเทพฯ" ใน `heardFromCulturalOfficeName`
- Expected: `heardFromCulturalOffice` checkbox ถูก check

#### Test Case 5: สำนักงานเขตพื้นที่การศึกษา - ชื่อ
- กรอก "สพป.กทม." ใน `heardFromEducationAreaName`
- Expected: `heardFromEducationArea` checkbox ถูก check

#### Test Case 6: สำนักงานเขตพื้นที่การศึกษา - จังหวัด
- เลือก "กรุงเทพมหานคร" ใน `heardFromEducationAreaProvince`
- Expected: `heardFromEducationArea` checkbox ถูก check

#### Test Case 7: อื่น ๆ
- กรอก "งานมหกรรม" ใน `heardFromOtherDetail`
- Expected: `heardFromOther` checkbox ถูก check

#### Test Case 8: Multiple Fields
- กรอกทั้ง "ชื่อโรงเรียน" และ "อำเภอ"
- Expected: `heardFromSchool` checkbox ถูก check (ไม่ check ซ้ำ)

#### Test Case 9: Empty Input
- กรอก input แล้วลบออกหมด (empty string)
- Expected: Checkbox ยังคง checked (ไม่ uncheck อัตโนมัติ)

## Build Status

✅ **Build Successful**

```
Route (app)
└ ○ /regist-support
```

## Notes

- Feature นี้ใช้ `react-hook-form` watch และ setValue
- ไม่มีการ uncheck อัตโนมัติเมื่อลบข้อมูล (ป้องกัน accidental uncheck)
- ผู้ใช้ยังสามารถ uncheck checkbox ด้วยตนเองได้
- Logic ทำงานแบบ real-time (ไม่ต้องรอ blur หรือ submit)

## Future Enhancements

อาจเพิ่ม features เหล่านี้ในอนาคต:
1. Auto-uncheck เมื่อลบข้อมูลทั้งหมด
2. Visual feedback เมื่อ auto-check (animation)
3. Tooltip แจ้งผู้ใช้ว่า checkbox ถูก check อัตโนมัติ
4. Apply pattern เดียวกันกับ Step อื่นๆ ที่มี checkbox + input

## Comparison with /regist100

| Feature | /regist100 | /regist-support |
|---------|-----------|-----------------|
| Auto-Check Checkbox | ❌ No | ✅ Yes (Step 8) |
| Manual Check Required | ✅ Yes | ❌ No (Auto) |
| User Error Risk | ⚠️ Higher | ✅ Lower |

## Related Files

- `components-regist-support/forms/steps/Step8.tsx` - Main implementation
- `lib/validators/registerSupport.schema.ts` - Schema validation
- `tests/regist-support-full.spec.ts` - Test cases

## Summary

เพิ่ม UX feature ที่ช่วยให้ผู้ใช้ไม่ต้องจำว่าต้องติ๊ก checkbox เมื่อกรอกข้อมูล ระบบจะทำอัตโนมัติให้ ลดโอกาสเกิด error และทำให้ form ใช้งานง่ายขึ้น
