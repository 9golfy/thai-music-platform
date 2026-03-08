# Step 8 Certification Validation - Added to Missing Fields Modal

## สรุปการเปลี่ยนแปลง

เพิ่ม validation สำหรับ certification checkbox ใน Step 8 ให้แสดงใน Missing Fields Modal เมื่อผู้ใช้ไม่ติ๊กถูก checkbox แล้วกดปุ่ม "ส่งแบบฟอร์ม"

## ปัญหาเดิม

**Before**:
- Certification checkbox มี validation อยู่แล้ว แต่ใช้ `form.trigger` แยกต่างหาก
- ไม่แสดงใน Missing Fields Modal
- ผู้ใช้เห็นแค่ error message สีแดงใต้ checkbox แต่ไม่มีใน modal

```typescript
if (!data.certifiedINFOByAdminName) {
  await form.trigger('certifiedINFOByAdminName');
  return;
}
```

## การแก้ไข

**After**:
- เพิ่ม certification checkbox validation เข้าไปใน `missingFields` array
- แสดงใน Missing Fields Modal พร้อมกับฟิลด์อื่นๆ
- ผู้ใช้เห็นข้อความชัดเจนว่าต้องติ๊กถูก checkbox

```typescript
const missingFields: string[] = [];

// Step 8 validation - Certification checkbox
if (!data.certifiedINFOByAdminName) {
  missingFields.push('การรับรองข้อมูล - กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูลเป็นความจริง (Step 8)');
}

// ... other validations

if (missingFields.length > 0) {
  setMissingFieldsList(missingFields);
  setShowMissingFieldsModal(true);
  return;
}
```

## Step 8 Mandatory Field

### Certification Checkbox
**Field Name**: `certifiedINFOByAdminName`

**Label**: 
```
ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในแบบฟอร์มนี้เป็นความจริงทุกประการ *
```

**Validation**:
- ✅ Required - ต้องติ๊กถูกก่อนส่งฟอร์ม
- ✅ แสดงใน Missing Fields Modal ถ้าไม่ติ๊กถูก
- ✅ แสดง error message สีแดงใต้ checkbox ถ้าไม่ติ๊กถูก

**Error Message in Modal**:
```
การรับรองข้อมูล - กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูลเป็นความจริง (Step 8)
```

## ตัวอย่าง Missing Fields Modal

### Scenario 1: กรอกข้อมูลครบแต่ไม่ติ๊กถูก checkbox

```
⚠️ กรุณากรอกข้อมูลให้ครบถ้วน

พบช่องข้อมูลที่จำเป็นต้องกรอกยังไม่ครบถ้วน 
กรุณากรอกข้อมูลในช่องต่อไปนี้:

┌─────────────────────────────────────────────────────────────────┐
│ • การรับรองข้อมูล - กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูล...  │
│   เป็นความจริง (Step 8)                                        │
└─────────────────────────────────────────────────────────────────┘

                         [ตกลง]
```

### Scenario 2: ไม่กรอกข้อมูลหลายฟิลด์และไม่ติ๊กถูก checkbox

```
⚠️ กรุณากรอกข้อมูลให้ครบถ้วน

พบช่องข้อมูลที่จำเป็นต้องกรอกยังไม่ครบถ้วน 
กรุณากรอกข้อมูลในช่องต่อไปนี้:

┌─────────────────────────────────────────────────────────────────┐
│ • ชื่อสถานศึกษา (Step 1)                                        │
│ • จำนวนครู/บุคลากร (Step 1)                                    │
│ • โทรศัพท์ (Step 1)                                             │
│ • ชื่อ-นามสกุล ผู้บริหาร (Step 2)                              │
│ • รางวัล - กรุณาเพิ่มอย่างน้อย 1 รายการและเลือก...           │
│ • การรับรองข้อมูล - กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูล...      │
│   เป็นความจริง (Step 8)                                        │
└─────────────────────────────────────────────────────────────────┘

                         [ตกลง]
```

## Validation Order

การ validate ฟิลด์ทั้งหมดเรียงตาม order:

1. **Step 8** - Certification checkbox (ตรวจสอบก่อน)
2. **Step 1** - Basic information (13 fields)
3. **Step 2** - Administrator (5 fields)
4. **Step 3** - Teaching plans (2 arrays)
5. **Step 4** - Teachers (1 array + qualification)
6. **Step 5** - Awards (1 array + level)

**เหตุผล**: ตรวจสอบ Step 8 ก่อนเพราะเป็นฟิลด์ที่อยู่ในหน้าเดียวกับปุ่ม "ส่งแบบฟอร์ม" ทำให้ผู้ใช้เห็นได้ทันทีว่าต้องติ๊กถูก checkbox

## Testing

### Test Case 1: ไม่ติ๊กถูก checkbox
1. เปิดฟอร์ม register100
2. กรอกข้อมูลครบทุก step (Step 1-7)
3. ไปที่ Step 8
4. **ไม่ติ๊กถูก** checkbox "ข้าพเจ้าขอรับรองว่าข้อมูล..."
5. กดปุ่ม "ส่งแบบฟอร์ม"
6. **Expected**: 
   - แสดง Missing Fields Modal
   - มีข้อความ "การรับรองข้อมูล - กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูลเป็นความจริง (Step 8)"

### Test Case 2: ติ๊กถูก checkbox
1. เปิดฟอร์ม register100
2. กรอกข้อมูลครบทุก step (Step 1-7)
3. ไปที่ Step 8
4. **ติ๊กถูก** checkbox "ข้าพเจ้าขอรับรองว่าข้อมูล..."
5. กดปุ่ม "ส่งแบบฟอร์ม"
6. **Expected**: 
   - ไม่แสดง Missing Fields Modal
   - ส่งฟอร์มสำเร็จ
   - แสดง Success Modal

### Test Case 3: ไม่กรอกข้อมูลหลายฟิลด์และไม่ติ๊กถูก checkbox
1. เปิดฟอร์ม register100
2. กรอกข้อมูลบางส่วนเท่านั้น
3. ไปที่ Step 8
4. **ไม่ติ๊กถูก** checkbox
5. กดปุ่ม "ส่งแบบฟอร์ม"
6. **Expected**: 
   - แสดง Missing Fields Modal
   - มีรายการฟิลด์ที่ขาดจาก Step 1-5
   - มีข้อความ "การรับรองข้อมูล..." จาก Step 8 ด้วย

## Benefits

### Before:
- ❌ Certification checkbox validation แยกจาก Missing Fields Modal
- ❌ ผู้ใช้อาจไม่เห็น error message ใต้ checkbox
- ❌ ไม่สอดคล้องกับ validation ของฟิลด์อื่นๆ

### After:
- ✅ Certification checkbox แสดงใน Missing Fields Modal
- ✅ ผู้ใช้เห็นข้อความชัดเจนใน modal
- ✅ สอดคล้องกับ validation ของฟิลด์อื่นๆ
- ✅ UX ดีขึ้น - รวมทุกอย่างไว้ใน modal เดียว

## Complete Validation Summary

### All Mandatory Fields (Total: 22 fields + 1 checkbox)

| Step | Field Type | Count | Details |
|------|-----------|-------|---------|
| Step 1 | Text/Select | 13 | Basic info + Address |
| Step 2 | Text | 5 | Administrator info |
| Step 3 | Arrays | 2 | Teaching plans (min 1 each) |
| Step 4 | Array + Dropdown | 1+1 | Teachers (min 1) + Qualification |
| Step 5 | Array + Dropdown | 1+1 | Awards (min 1) + Level |
| Step 8 | Checkbox | 1 | Certification |
| **Total** | | **24** | **22 fields + 2 dropdowns + 1 checkbox** |

## Files Modified

### Main Files:
- ✅ `components-regist100/forms/Register100Wizard.tsx`
  - เพิ่ม Step 8 validation ใน `onSubmit` function
  - เพิ่มข้อความใน `missingFields` array

### UI Components (No Changes):
- `components-regist100/forms/steps/Step8.tsx` - ไม่มีการเปลี่ยนแปลง
- `components-regist100/ui/MissingFieldsModal.tsx` - ไม่มีการเปลี่ยนแปลง

### Documentation:
- ✅ `MISSING-FIELDS-MODAL-CONFIRMATION.md` - อัปเดตเพื่อรวม Step 8
- ✅ `STEP8-CERTIFICATION-VALIDATION-ADDED.md` - เอกสารนี้

## Related Documentation

- `VALIDATION-ENHANCEMENTS-COMPLETE.md` - Complete validation implementation
- `MISSING-FIELDS-MODAL-CONFIRMATION.md` - Missing fields modal feature
- `MANDATORY-FIELDS-LIST.md` - List of all mandatory fields

## Summary

✅ **Step 8 certification checkbox ถูกเพิ่มเข้าไปใน Missing Fields Modal แล้ว**

ตอนนี้เมื่อผู้ใช้:
1. กดปุ่ม "ส่งแบบฟอร์ม" โดยไม่ติ๊กถูก checkbox
2. ระบบจะแสดง Missing Fields Modal
3. พร้อมข้อความ "การรับรองข้อมูล - กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูลเป็นความจริง (Step 8)"
4. ผู้ใช้สามารถกดปุ่ม "ตกลง" เพื่อปิด modal และกลับไปติ๊กถูก checkbox

---

**Date**: March 1, 2026
**Status**: ✅ Complete
**Priority**: Medium (Enhancement)
