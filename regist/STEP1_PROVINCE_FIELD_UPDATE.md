# Step1 - School Province Field Added

## Summary
Added a new required `schoolProvince` field to Step1 with a dropdown containing all 77 provinces of Thailand.

## Changes Made

### 1. Schema Update

**File:** `lib/validators/register69.schema.ts`

**Added Field:**
```typescript
schoolProvince: z.string().min(1, 'กรุณาเลือกจังหวัด'),
```

**Position:**
- Added after `schoolName`
- Before existing `province` field
- Required field with validation message

### 2. Step1 Component Update

**File:** `components/forms/steps/Step1.tsx`

**Added Dropdown with 77 Provinces:**

```tsx
{/* จังหวัดสถานศึกษา */}
<div>
  <label className="block text-sm font-medium text-neutral-dark mb-2">
    จังหวัด <span className="text-red-500">*</span>
  </label>
  <select
    {...register('schoolProvince')}
    className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
  >
    <option value="">เลือกจังหวัดสถานศึกษา</option>
    {/* 77 provinces */}
  </select>
  {errors.schoolProvince && (
    <p className="text-red-500 text-sm mt-1">
      {errors.schoolProvince.message as string}
    </p>
  )}
</div>
```

### 3. All 77 Provinces Included

**Complete List (Alphabetical Order):**

1. กรุงเทพมหานคร (Bangkok)
2. กระบี่ (Krabi)
3. กาญจนบุรี (Kanchanaburi)
4. กาฬสินธุ์ (Kalasin)
5. กำแพงเพชร (Kamphaeng Phet)
6. ขอนแก่น (Khon Kaen)
7. จันทบุรี (Chanthaburi)
8. ฉะเชิงเทรา (Chachoengsao)
9. ชลบุรี (Chonburi)
10. ชัยนาท (Chai Nat)
11. ชัยภูมิ (Chaiyaphum)
12. ชุมพร (Chumphon)
13. เชียงราย (Chiang Rai)
14. เชียงใหม่ (Chiang Mai)
15. ตรัง (Trang)
16. ตราด (Trat)
17. ตาก (Tak)
18. นครนายก (Nakhon Nayok)
19. นครปฐม (Nakhon Pathom)
20. นครพนม (Nakhon Phanom)
21. นครราชสีมา (Nakhon Ratchasima)
22. นครศรีธรรมราช (Nakhon Si Thammarat)
23. นครสวรรค์ (Nakhon Sawan)
24. นนทบุรี (Nonthaburi)
25. นราธิวาส (Narathiwat)
26. น่าน (Nan)
27. บึงกาฬ (Bueng Kan)
28. บุรีรัมย์ (Buriram)
29. ปทุมธานี (Pathum Thani)
30. ประจวบคีรีขันธ์ (Prachuap Khiri Khan)
31. ปราจีนบุรี (Prachinburi)
32. ปัตตานี (Pattani)
33. พระนครศรีอยุธยา (Phra Nakhon Si Ayutthaya)
34. พังงา (Phang Nga)
35. พัทลุง (Phatthalung)
36. พิจิตร (Phichit)
37. พิษณุโลก (Phitsanulok)
38. เพชรบุรี (Phetchaburi)
39. เพชรบูรณ์ (Phetchabun)
40. แพร่ (Phrae)
41. พะเยา (Phayao)
42. ภูเก็ต (Phuket)
43. มหาสารคาม (Maha Sarakham)
44. มุกดาหาร (Mukdahan)
45. แม่ฮ่องสอน (Mae Hong Son)
46. ยโสธร (Yasothon)
47. ยะลา (Yala)
48. ร้อยเอ็ด (Roi Et)
49. ระนอง (Ranong)
50. ระยอง (Rayong)
51. ราชบุรี (Ratchaburi)
52. ลพบุรี (Lopburi)
53. ลำปาง (Lampang)
54. ลำพูน (Lamphun)
55. เลย (Loei)
56. ศรีสะเกษ (Si Sa Ket)
57. สกลนคร (Sakon Nakhon)
58. สงขลา (Songkhla)
59. สตูล (Satun)
60. สมุทรปราการ (Samut Prakan)
61. สมุทรสงคราม (Samut Songkhram)
62. สมุทรสาคร (Samut Sakhon)
63. สระแก้ว (Sa Kaeo)
64. สระบุรี (Saraburi)
65. สิงห์บุรี (Sing Buri)
66. สุโขทัย (Sukhothai)
67. สุพรรณบุรี (Suphan Buri)
68. สุราษฎร์ธานี (Surat Thani)
69. สุรินทร์ (Surin)
70. หนองคาย (Nong Khai)
71. หนองบัวลำภู (Nong Bua Lam Phu)
72. อ่างทอง (Ang Thong)
73. อำนาจเจริญ (Amnat Charoen)
74. อุดรธานี (Udon Thani)
75. อุตรดิตถ์ (Uttaradit)
76. อุทัยธานี (Uthai Thani)
77. อุบลราชธานี (Ubon Ratchathani)

## Field Details

### Label
- Thai: "จังหวัด"
- Required indicator: Red asterisk (*)

### Validation
- **Required**: Yes
- **Error Message**: "กรุณาเลือกจังหวัด"
- **Validation Type**: `z.string().min(1, ...)`

### Styling
- **Label**: `text-sm font-medium text-neutral-dark mb-2`
- **Select**: `w-full px-4 py-2 border border-neutral-border rounded-lg`
- **Focus**: `focus:outline-none focus:ring-2 focus:ring-primary/50`
- **Error**: `text-red-500 text-sm mt-1`

### Default Option
```tsx
<option value="">เลือกจังหวัดสถานศึกษา</option>
```

## Position in Form

The field is placed in Step1 after the school name field and before the school level field:

1. ชื่อสถานศึกษา (School Name)
2. **จังหวัด (Province)** ← NEW
3. ระดับการศึกษา (School Level)
4. ...

## Integration

### React Hook Form
```tsx
{...register('schoolProvince')}
```

### Error Display
```tsx
{errors.schoolProvince && (
  <p className="text-red-500 text-sm mt-1">
    {errors.schoolProvince.message as string}
  </p>
)}
```

### Form Submission
The `schoolProvince` value will be included in the form data when submitted.

## Differences from Existing `province` Field

### Old Field: `province`
- Optional field
- Used for address province (in location section)
- Not required

### New Field: `schoolProvince`
- Required field
- Used for school's province
- Validation enforced
- Appears in basic information section

## Benefits

1. **Complete Data**: All 77 provinces available
2. **Required Field**: Ensures province is always selected
3. **Validation**: Clear error message if not selected
4. **User-Friendly**: Dropdown prevents typos
5. **Consistent**: Matches other dropdown fields in the form
6. **Green Theme**: Uses primary color for focus ring

## Testing Checklist

- [ ] Dropdown displays all 77 provinces
- [ ] Default option shows "เลือกจังหวัดสถานศึกษา"
- [ ] Required validation works (shows error if not selected)
- [ ] Error message displays correctly
- [ ] Selected value persists when navigating between steps
- [ ] Value included in form submission
- [ ] Styling matches other fields
- [ ] Focus ring appears on interaction
- [ ] Mobile responsive

## Technical Details

### TypeScript Type
```typescript
schoolProvince: string
```

### Zod Schema
```typescript
schoolProvince: z.string().min(1, 'กรุณาเลือกจังหวัด')
```

### HTML Element
```html
<select name="schoolProvince">
  <option value="">เลือกจังหวัดสถานศึกษา</option>
  <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
  <!-- ... 76 more provinces -->
</select>
```

## Server Status

✅ **Running**: http://localhost:3001
✅ **Compiled**: Successfully
✅ **No Errors**: All diagnostics passed

## Notes

- The provinces are listed in Thai alphabetical order
- All province names use official Thai spelling
- The field is required and will prevent form submission if empty
- The existing `province` field (optional) remains for address information
- Green theme maintained with `focus:ring-primary/50`
