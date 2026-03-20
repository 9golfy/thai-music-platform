# Step 6 Format Update - Complete Display with Correct Labels

## Summary
Updated Step 6 in both RegisterSupportDetailView and Register100DetailView to display all fields completely with correct labels matching the form input structure.

## Changes Made

### 1. Register100DetailView - Step 6 Complete Restructure

**New Sections Added:**
1. ✅ **นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา**
   - ผู้มีส่วนส่งเสริม สนับสนุนการเรียนการสอนดนตรีไทย
   - องค์กร/หน่วยงาน/บุคคลที่ให้การส่งเสริม สนับสนุน
   - บรรยาย และอธิบายสนับสนุน

2. ✅ **การสนับสนุนวัสดุ อุปกรณ์ หรืองบประมาณ**
   - ได้รับการสนับสนุนจากต้นสังกัด (บุคคล/หน่วยงานภายใน)
   - ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก
   - Fields: บุคคล/หน่วยงาน, รายละเอียด, หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)

3. ✅ **ความพร้อมของเครื่องดนตรีกับนักเรียน**
   - เพียงพอ (textarea)
   - ไม่เพียงพอ (textarea)

4. ✅ **กรอบการเรียนการสอน**
   - สถานศึกษามีกรอบการเรียนการสอนดนตรีไทย หรือสาระการเรียนรู้ที่มีนักเรียนสามารถปฏิบัติได้
   - ผลลัพธ์ในการเรียนการสอนด้านดนตรีไทย
   - การบริหารจัดการสอนดนตรีไทยของสถานศึกษา โดยให้ระบุผลสะท้อนจากนักเรียน

**Removed from Step 6:**
- ❌ รางวัล (moved to Step 7)

**Visual Structure:**
```
Step 6: การสนับสนุน
├── นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา
│   └── รายการ (องค์กร/หน่วยงาน/บุคคล + บรรยายและอธิบาย)
├── การสนับสนุนวัสดุ อุปกรณ์ หรืองบประมาณ
│   ├── ☑ จากต้นสังกัด (บุคคล/หน่วยงานภายใน)
│   │   └── รายการ (บุคคล/หน่วยงาน, รายละเอียด, หลักฐาน)
│   └── ☑ จากบุคคล/หน่วยงานภายนอก
│       └── รายการ (บุคคล/หน่วยงาน, รายละเอียด, หลักฐาน)
├── ความพร้อมของเครื่องดนตรีกับนักเรียน
│   ├── เพียงพอ
│   └── ไม่เพียงพอ
└── กรอบการเรียนการสอน
    ├── สถานศึกษามีกรอบการเรียนการสอน...
    ├── ผลลัพธ์ในการเรียนการสอน...
    └── การบริหารจัดการสอนดนตรีไทย...
```

### 2. RegisterSupportDetailView - Step 6 Complete Update

**Added Missing Section:**
1. ✅ **นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา**
   - ผู้มีส่วนส่งเสริม สนับสนุนการเรียนการสอนดนตรีไทย
   - องค์กร/หน่วยงาน/บุคคลที่ให้การส่งเสริม สนับสนุน
   - บรรยาย และอธิบายสนับสนุน

**Updated Labels:**
- ❌ "การสนับสนุนจากองค์กร" → ✅ "ได้รับการสนับสนุนจากต้นสังกัด (บุคคล/หน่วยงานภายใน)"
- ❌ "การสนับสนุนจากภายนอก" → ✅ "ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก"
- ❌ "องค์กร" → ✅ "บุคคล/หน่วยงาน"
- ❌ "ลิงก์หลักฐาน" → ✅ "หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)"
- ❌ "เพิ่มการสนับสนุน" → ✅ "เพิ่มข้อมูล"

**Layout Changes:**
- Changed from grid layout to full-width fields (fullWidth)
- Removed section headers ("การสนับสนุนจากองค์กร", "การสนับสนุนจากภายนอก")
- Checkbox labels now match Register100 format

**Visual Structure:**
```
Step 6: การสนับสนุน
├── นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา
│   └── รายการ (องค์กร/หน่วยงาน/บุคคล + บรรยายและอธิบาย)
├── ☑ ได้รับการสนับสนุนจากต้นสังกัด (บุคคล/หน่วยงานภายใน)
│   └── รายการ (บุคคล/หน่วยงาน, รายละเอียด, หลักฐาน/ภาพถ่าย)
└── ☑ ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก
    └── รายการ (บุคคล/หน่วยงาน, รายละเอียด, หลักฐาน/ภาพถ่าย)
```

## Field Mappings

### Register100 Step 6 Fields

| Section | Field Name | Label | Type |
|---------|-----------|-------|------|
| นโยบาย | `reg100_supportFactors[].sup_supportByAdmin` | องค์กร/หน่วยงาน/บุคคลที่ให้การส่งเสริม สนับสนุน | text (fullWidth) |
| นโยบาย | `reg100_supportFactors[].sup_supportByDescription` | บรรยาย และอธิบายสนับสนุน | textarea (fullWidth) |
| การสนับสนุน | `reg100_hasSupportFromOrg` | ได้รับการสนับสนุนจากต้นสังกัด | checkbox |
| การสนับสนุน | `reg100_supportFromOrg[].organization` | บุคคล/หน่วยงาน | text (fullWidth) |
| การสนับสนุน | `reg100_supportFromOrg[].details` | รายละเอียด | textarea (fullWidth) |
| การสนับสนุน | `reg100_supportFromOrg[].evidenceLink` | หลักฐาน/ภาพถ่าย (Link/URL) | text (fullWidth) |
| การสนับสนุน | `reg100_hasSupportFromExternal` | ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก | checkbox |
| การสนับสนุน | `reg100_supportFromExternal[].organization` | บุคคล/หน่วยงาน | text (fullWidth) |
| การสนับสนุน | `reg100_supportFromExternal[].details` | รายละเอียด | textarea (fullWidth) |
| การสนับสนุน | `reg100_supportFromExternal[].evidenceLink` | หลักฐาน/ภาพถ่าย (Link/URL) | text (fullWidth) |
| ความพร้อม | `reg100_instrumentReadiness_sufficient` | เพียงพอ | textarea (fullWidth) |
| ความพร้อม | `reg100_instrumentReadiness_insufficient` | ไม่เพียงพอ | textarea (fullWidth) |
| กรอบการเรียนการสอน | `reg100_curriculumFramework` | สถานศึกษามีกรอบการเรียนการสอน... | textarea (fullWidth) |
| กรอบการเรียนการสอน | `reg100_learningOutcomes` | ผลลัพธ์ในการเรียนการสอน... | textarea (fullWidth) |
| กรอบการเรียนการสอน | `reg100_managementContext` | การบริหารจัดการสอนดนตรีไทย... | textarea (fullWidth) |

### RegisterSupport Step 6 Fields

| Section | Field Name | Label | Type |
|---------|-----------|-------|------|
| นโยบาย | `supportFactors[].sup_supportByAdmin` | องค์กร/หน่วยงาน/บุคคลที่ให้การส่งเสริม สนับสนุน | text (fullWidth) |
| นโยบาย | `supportFactors[].sup_supportByDescription` | บรรยาย และอธิบายสนับสนุน | textarea (fullWidth) |
| การสนับสนุน | `hasSupportFromOrg` | ได้รับการสนับสนุนจากต้นสังกัด | checkbox |
| การสนับสนุน | `supportFromOrg[].organization` | บุคคล/หน่วยงาน | text (fullWidth) |
| การสนับสนุน | `supportFromOrg[].details` | รายละเอียด | textarea (fullWidth) |
| การสนับสนุน | `supportFromOrg[].evidenceLink` | หลักฐาน/ภาพถ่าย (Link/URL) | text (fullWidth) |
| การสนับสนุน | `hasSupportFromExternal` | ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก | checkbox |
| การสนับสนุน | `supportFromExternal[].organization` | บุคคล/หน่วยงาน | text (fullWidth) |
| การสนับสนุน | `supportFromExternal[].details` | รายละเอียด | textarea (fullWidth) |
| การสนับสนุน | `supportFromExternal[].evidenceLink` | หลักฐาน/ภาพถ่าย (Link/URL) | text (fullWidth) |

## Key Improvements

1. **Consistent Labels**: Both detail views now use the same terminology
2. **Full-Width Fields**: All fields in support sections are now full-width for better readability
3. **Conditional Display**: Support items only show when checkbox is checked
4. **Complete Information**: Register100 now shows all 4 sections as per form input
5. **Proper Grouping**: Related fields are grouped together logically

## Files Modified
- `components/admin/Register100DetailView.tsx`
  - Added 4 complete sections in Step 6
  - Moved awards to Step 7
  - Updated all labels to match form input
- `components/admin/RegisterSupportDetailView.tsx`
  - Updated labels to match Register100 format
  - Changed layout to full-width fields
  - Removed section headers

## Testing
To verify the changes:
1. Navigate to register100 detail: http://localhost:3000/dcp-admin/dashboard/register100/[id]
2. Navigate to register-support detail: http://localhost:3000/dcp-admin/dashboard/register-support/[id]
3. Check Step 6 displays:
   - ✅ All sections visible (Register100: 4 sections, RegisterSupport: 3 sections)
   - ✅ นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา (both pages)
   - ✅ Labels match form input exactly
   - ✅ Full-width fields for better readability
   - ✅ Conditional display works (items show only when checkbox checked)
   - ✅ Edit mode works correctly
   - ✅ Add/remove items works

## Status
✅ Complete - Step 6 now displays all fields with correct labels matching the form input structure. Both detail views now include the "นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา" section.
