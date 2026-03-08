# Data Dictionary - Register Support Step 1 Fields

## ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย

| Field Name | Label/Description | Type | Required | Input Type |
|------------|-------------------|------|----------|------------|
| `supportType` | ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย | string | Yes | Radio buttons |
| `supportTypeSchoolName` | ระบุชื่อสถานศึกษาที่ต้องการสนับสนุน | string | Conditional | Text input |
| `supportTypeClubName` | ระบุชื่อชุมนุมที่ต้องการสนับสนุน | string | Conditional | Text input |
| `supportTypeAssociationName` | ระบุชื่อชมรมที่ต้องการสนับสนุน | string | Conditional | Text input |
| `supportTypeGroupName` | ระบุชื่อกลุ่มที่ต้องการสนับสนุน | string | Conditional | Text input |
| `supportTypeBandName` | ระบุชื่อวงดนตรีไทยที่ต้องการสนับสนุน | string | Conditional | Text input |
| `supportTypeMemberCount` | จำนวน (คน) | number | Conditional | Number input |

### Support Type Radio Options:
- `สถานศึกษา` → Enables: `supportTypeSchoolName`
- `ชุมนุม` → Enables: `supportTypeClubName` + `supportTypeMemberCount`
- `ชมรม` → Enables: `supportTypeAssociationName` + `supportTypeMemberCount`
- `กลุ่ม` → Enables: `supportTypeGroupName` + `supportTypeMemberCount`
- `วงดนตรีไทย` → Enables: `supportTypeBandName` + `supportTypeMemberCount`

## ข้อมูลพื้นฐาน (Basic Information)

| Field Name | Label/Description | Type | Required | Input Type |
|------------|-------------------|------|----------|------------|
| `schoolName` | ชื่อสถานศึกษาของผู้สมัคร | string | Yes | Text input |
| `schoolProvince` | จังหวัด | string | Yes | Select dropdown |
| `schoolLevel` | ระดับสถานศึกษา | string | Yes | Select dropdown |
| `affiliation` | สังกัด | string | No | Select dropdown |
| `staffCount` | จำนวนครู/บุคลากร | number | No | Text input (formatted with commas) |
| `studentCount` | จำนวนนักเรียน | number | No | Text input (formatted with commas) |
| `schoolSize` | ขนาดโรงเรียน | string | No | Auto-calculated display |
| `studentCountByGrade` | จำนวนนักเรียนแต่ละระดับชั้น | string | No | Textarea |

### School Level Options:
- `ประถมศึกษา`
- `มัธยมศึกษา`
- `ขยายโอกาส`
- `เฉพาะทาง`

### Affiliation Options:
- `กระทรวงศึกษาธิการ (Ministry of Education)`
- `องค์กรปกครองส่วนท้องถิ่น (อปท.)`
- `สังกัดกระทรวงอื่น ๆ`
- `โรงเรียนสังกัดรัฐวิสาหกิจ`
- `โรงเรียนสังกัดกรุงเทพมหานคร`
- `โรงเรียนสาธิต`
- `โรงเรียนในระบบพิเศษ`
- `โรงเรียนเอกชนนานาชาติ`

### School Size (Auto-calculated from studentCount):
- `ขนาดเล็ก`: 119 คนลงมา
- `ขนาดกลาง`: 120 - 719 คน
- `ขนาดใหญ่`: 720 - 1,679 คน
- `ขนาดใหญ่พิเศษ`: 1,680 คนขึ้นไป

## สถานที่ตั้ง (Address Information)

| Field Name | Label/Description | Type | Required | Input Type |
|------------|-------------------|------|----------|------------|
| `addressNo` | เลขที่ | string | Yes | Text input |
| `moo` | หมู่ | string | No | Text input |
| `road` | ถนน | string | No | Text input |
| `subDistrict` | ตำบล/แขวง | string | Yes | Text input (with autocomplete) |
| `district` | อำเภอ/เขต | string | Yes | Text input (with autocomplete) |
| `provinceAddress` | จังหวัด | string | Yes | Text input (with autocomplete) |
| `postalCode` | รหัสไปรษณีย์ | string | Yes | Text input (with autocomplete) |
| `phone` | โทรศัพท์ | string | Yes | Text input (numeric only) |
| `fax` | โทรสาร | string | No | Text input (numeric only) |

### Address Autocomplete:
- Uses jquery.Thailand.js for auto-completion
- HTML IDs: `th-district`, `th-amphoe`, `th-province`, `th-zipcode`
- Auto-fills related fields when user types in any address field

## CRITICAL FIELD MAPPING ISSUE

### Frontend Implementation:
The form uses **specific field names** for each support type:
```javascript
const SUPPORT_TYPE_FIELD_MAP = {
  'สถานศึกษา': 'supportTypeSchoolName',
  'ชุมนุม': 'supportTypeClubName', 
  'ชมรม': 'supportTypeAssociationName',
  'กลุ่ม': 'supportTypeGroupName',
  'วงดนตรีไทย': 'supportTypeBandName'
};
```

### Backend/Database Expectation:
May be expecting a generic `supportTypeName` field instead of specific field names.

### Field Separation:
- **`supportTypeSchoolName`** = ชื่อสถานศึกษา**ที่ต้องการสนับสนุน** (different from applicant's school)
- **`schoolName`** = ชื่อสถานศึกษา**ของผู้สมัคร** (applicant's own school)

### Example Data:
```json
{
  "supportType": "สถานศึกษา",
  "supportTypeSchoolName": "โรงเรียนวัดใหม่",  // School to support
  "schoolName": "โรงเรียนบ้านนา",              // Applicant's school
  "supportTypeMemberCount": null              // Only for non-school types
}
```

### Current Problem:
1. **useEffect Clearing**: Step1 component clears inactive fields when supportType changes
2. **Restoration Timing**: Draft restoration happens before useEffect completes
3. **Field Name Mismatch**: Backend may expect `supportTypeName` instead of specific field names
4. **DOM vs Form State**: Some logic reads from DOM instead of React Hook Form state

### Solution Needed:
Either map specific fields to generic `supportTypeName` before saving/restoring, or update backend to handle specific field names.