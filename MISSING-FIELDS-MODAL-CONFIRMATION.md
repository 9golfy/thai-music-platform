# Missing Fields Modal - Feature Confirmation

## สรุป

ฟีเจอร์ **Missing Fields Modal** ที่แสดงรายการฟิลด์ที่ยังกรอกไม่ครบเมื่อกดปุ่ม "ส่งแบบฟอร์ม" **มีอยู่แล้วและทำงานอย่างสมบูรณ์**

## การทำงาน

### 1. เมื่อผู้ใช้กดปุ่ม "ส่งแบบฟอร์ม" (Step 8)

ระบบจะตรวจสอบฟิลด์ที่จำเป็นทั้งหมดจาก Step 1-5:

#### Step 1: ข้อมูลพื้นฐาน (13 fields)
- ชื่อสถานศึกษา
- จังหวัดสถานศึกษา
- ระดับสถานศึกษา
- สังกัด
- จำนวนครู/บุคลากร
- จำนวนนักเรียน
- เลขที่
- ตำบล/แขวง
- อำเภอ/เขต
- จังหวัด (ที่อยู่)
- รหัสไปรษณีย์
- โทรศัพท์

#### Step 2: ผู้บริหารสถานศึกษา (5 fields)
- ชื่อ-นามสกุล ผู้บริหาร
- ตำแหน่ง ผู้บริหาร
- ที่อยู่ ผู้บริหาร
- โทรศัพท์ ผู้บริหาร
- อีเมล ผู้บริหาร

#### Step 3: แผนการสอน (2 arrays)
- สภาวการณ์การเรียนการสอนดนตรีไทย - กรุณาเพิ่มอย่างน้อย 1 รายการ
- ความพร้อมในการส่งเสริม - กรุณาเพิ่มอย่างน้อย 1 รายการ

#### Step 4: ผู้สอนดนตรีไทย (1 array + qualification)
- ผู้สอนดนตรีไทย - กรุณาเพิ่มอย่างน้อย 1 คน
- คุณลักษณะครูผู้สอน (dropdown)

#### Step 5: รางวัล (1 array + level)
- รางวัล - กรุณาเพิ่มอย่างน้อย 1 รายการและเลือกระดับรางวัล

#### Step 8: การรับรองข้อมูล (1 checkbox)
- การรับรองข้อมูล - กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูลเป็นความจริง

### 2. ถ้ามีฟิลด์ที่ขาด

ระบบจะ:
1. รวบรวมรายการฟิลด์ที่ขาดทั้งหมดใน array `missingFields`
2. แสดง `MissingFieldsModal` พร้อมรายการฟิลด์ที่ขาด
3. ไม่ส่งฟอร์มจนกว่าจะกรอกครบ

### 3. ถ้ากรอกครบทุกฟิลด์และติ๊กถูก checkbox

ระบบจะ:
1. คำนวณคะแนนทั้งหมด
2. ส่งข้อมูลไปยัง API
3. แสดง Success Modal

## UI Components

### MissingFieldsModal Component

**Location**: `components-regist100/ui/MissingFieldsModal.tsx`

**Features**:
- ✅ แสดงไอคอนเตือนสีแดง
- ✅ แสดงหัวข้อ "กรุณากรอกข้อมูลให้ครบถ้วน"
- ✅ แสดงข้อความอธิบาย
- ✅ แสดงรายการฟิลด์ที่ขาดในกล่องสีแดงอ่อน
- ✅ แสดงหมายเลข Step ของแต่ละฟิลด์ เช่น "(Step 1)", "(Step 2)"
- ✅ มีปุ่ม "ตกลง" สีเขียวเพื่อปิด modal
- ✅ Scrollable สำหรับรายการฟิลด์ที่เยอะ
- ✅ Responsive design

**Example Display**:
```
⚠️ กรุณากรอกข้อมูลให้ครบถ้วน

พบช่องข้อมูลที่จำเป็นต้องกรอกยังไม่ครบถ้วน กรุณากรอกข้อมูลในช่องต่อไปนี้:

┌─────────────────────────────────────────────────┐
│ • ชื่อสถานศึกษา (Step 1)                        │
│ • จำนวนครู/บุคลากร (Step 1)                    │
│ • โทรศัพท์ (Step 1)                             │
│ • ชื่อ-นามสกุล ผู้บริหาร (Step 2)              │
│ • รางวัล - กรุณาเพิ่มอย่างน้อย 1 รายการ... │
└─────────────────────────────────────────────────┘

                    [ตกลง]
```

## Code Implementation

### Register100Wizard.tsx

```typescript
const onSubmit = async (data: Register100FormData) => {
  // Collect all missing fields
  const missingFields: string[] = [];
  
  // Step 8 validation - Certification checkbox
  if (!data.certifiedINFOByAdminName) {
    missingFields.push('การรับรองข้อมูล - กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูลเป็นความจริง (Step 8)');
  }
  
  // Step 1-5 validation...
  // (checks all required fields)
  
  // If there are missing fields, show modal
  if (missingFields.length > 0) {
    setMissingFieldsList(missingFields);
    setShowMissingFieldsModal(true);
    return; // Stop submission
  }

  // If all fields are filled, proceed with submission
  calculateAllScores(data);
  setIsSubmitting(true);
  // ... submit to API
};
```

### Modal State Management

```typescript
const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
const [missingFieldsList, setMissingFieldsList] = useState<string[]>([]);
```

### Modal Rendering

```typescript
<MissingFieldsModal
  isOpen={showMissingFieldsModal}
  onClose={() => setShowMissingFieldsModal(false)}
  missingFields={missingFieldsList}
/>
```

## Testing Scenarios

### Test Case 1: ไม่กรอกข้อมูลเลย
1. เปิดฟอร์ม register100
2. ข้ามไปที่ Step 8 โดยตรง (ถ้าเป็นไปได้)
3. ติ๊กถูก checkbox "ข้าพเจ้ายอมรับว่าข้อมูล..."
4. กดปุ่ม "ส่งแบบฟอร์ม"
5. **Expected**: แสดง modal พร้อมรายการฟิลด์ที่ขาดทั้งหมด (มากกว่า 20 รายการ)

### Test Case 2: กรอกข้อมูลบางส่วน
1. เปิดฟอร์ม register100
2. กรอก Step 1 และ Step 2 เท่านั้น
3. ไปที่ Step 8
4. ติ๊กถูก checkbox
5. กดปุ่ม "ส่งแบบฟอร์ม"
6. **Expected**: แสดง modal พร้อมรายการฟิลด์ที่ขาดจาก Step 3, 4, 5

### Test Case 3: กรอกข้อมูลครบถ้วน
1. เปิดฟอร์ม register100
2. กรอกข้อมูลครบทุก step
3. ไปที่ Step 8
4. ติ๊กถูก checkbox
5. กดปุ่ม "ส่งแบบฟอร์ม"
6. **Expected**: ไม่แสดง missing fields modal, แสดง success modal แทน

### Test Case 4: ไม่ติ๊กถูก checkbox ที่ Step 8
1. เปิดฟอร์ม register100
2. กรอกข้อมูลครบทุก step
3. ไปที่ Step 8 แต่ไม่ติ๊กถูก checkbox "ข้าพเจ้าขอรับรองว่าข้อมูล..."
4. กดปุ่ม "ส่งแบบฟอร์ม"
5. **Expected**: แสดง modal พร้อมข้อความ "การรับรองข้อมูล - กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูลเป็นความจริง (Step 8)"

### Test Case 5: กรอกข้อมูลแต่ไม่เลือก dropdown
1. เปิดฟอร์ม register100
2. กรอกข้อมูลครบแต่ไม่เลือก "ระดับรางวัล" ใน Step 5
3. ไปที่ Step 8
4. ติ๊กถูก checkbox
5. กดปุ่ม "ส่งแบบฟอร์ม"
6. **Expected**: แสดง modal พร้อมข้อความ "รางวัล - กรุณาเพิ่มอย่างน้อย 1 รายการและเลือกระดับรางวัล (Step 5)"

## User Experience Flow

```
User clicks "ส่งแบบฟอร์ม"
         ↓
System validates all required fields
         ↓
    ┌────────────┐
    │ All filled?│
    └────────────┘
         ↓
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    │         ↓
    │    Show MissingFieldsModal
    │    with list of missing fields
    │         ↓
    │    User clicks "ตกลง"
    │         ↓
    │    Modal closes
    │    User goes back to fill data
    │
    ↓
Calculate scores
    ↓
Submit to API
    ↓
Show SuccessModal
```

## Related Documentation

- `VALIDATION-ENHANCEMENTS-COMPLETE.md` - Complete validation implementation
- `TEST-UPDATES-VALIDATION-MODALS.md` - Test updates for validation modals
- `MANDATORY-FIELDS-LIST.md` - List of all mandatory fields

## Files Involved

### UI Components:
- ✅ `components-regist100/ui/MissingFieldsModal.tsx` - Modal component
- ✅ `components-regist100/forms/Register100Wizard.tsx` - Main form with validation

### Test Files:
- ✅ `tests/register100-validation-modals.spec.ts` - Validation modal tests
- ✅ `tests/register100.spec.ts` - Main test file
- ✅ `tests/register100-scenarios.spec.ts` - Score scenarios
- ✅ `tests/register100-regression.spec.ts` - Regression tests

## Summary

✅ **ฟีเจอร์นี้มีอยู่แล้วและทำงานอย่างสมบูรณ์**

เมื่อผู้ใช้กดปุ่ม "ส่งแบบฟอร์ม" แต่ยังกรอก mandatory field ไม่ครบ:
1. ระบบจะตรวจสอบฟิลด์ที่จำเป็นทั้งหมด
2. รวบรวมรายการฟิลด์ที่ขาด
3. แสดง `MissingFieldsModal` พร้อมรายการฟิลด์ที่ขาดและหมายเลข Step
4. ผู้ใช้สามารถกดปุ่ม "ตกลง" เพื่อปิด modal และกลับไปกรอกข้อมูล
5. ฟอร์มจะไม่ถูกส่งจนกว่าจะกรอกครบทุกฟิลด์

---

**Date**: March 1, 2026
**Status**: ✅ Feature Already Implemented and Working
**Priority**: N/A (Already Complete)
