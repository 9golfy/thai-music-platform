# Step5 Support Factors Block Update

## Summary
Added a new support factors block at the top of Step5 with 5 textarea fields for different support categories. Maintained green theme throughout and ensured all button text is in Thai.

## Changes Made

### 1. New Support Factors Block Added

**Section Title:**
"ปัจจัยที่เกี่ยวข้องโดยตรงต่อการเข้าร่วมกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์"

**Description:**
"ผู้ที่มีส่วนส่งเสริม สนับสนุนการจัดการเรียนการสอนดนตรีไทยในสถานศึกษา (ระบุนโยบายการจัดการเรียนการสอนดนตรีไทยของโรงเรียน วิธีการให้ความสนับสนุน)"

**5 Textarea Fields:**

1. **sup_supportByAdminName**
   - Label: "ผู้บริหารสถานศึกษา"
   - Placeholder: "ระบุนโยบายและวิธีการสนับสนุน"
   - Rows: 3

2. **sup_supportBySchoolBoard**
   - Label: "กรรมการสถานศึกษา"
   - Placeholder: "ระบุนโยบายและวิธีการสนับสนุน"
   - Rows: 3

3. **sup_supportByLocalGov**
   - Label: "องค์กรปกครองส่วนท้องถิ่น"
   - Placeholder: "ระบุนโยบายและวิธีการสนับสนุน"
   - Rows: 3

4. **sup_supportByCommunity**
   - Label: "ชุมชน"
   - Placeholder: "ระบุนโยบายและวิธีการสนับสนุน"
   - Rows: 3

5. **sup_supportByOthers**
   - Label: "อื่น ๆ โปรดระบุ (เช่น วัด สมาคม มูลนิธิ)"
   - Placeholder: "เช่น วัด / สมาคม / มูลนิธิ"
   - Rows: 3

### 2. Layout Pattern

**Table-like Row Layout:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
  <div className="md:col-span-3">
    <label className="block text-sm font-medium text-neutral-dark pt-2">
      {Label Text}
    </label>
  </div>
  <div className="md:col-span-9">
    <textarea {...register('fieldName')} />
  </div>
</div>
```

- **Desktop (md+)**: Label on left (3 columns), textarea on right (9 columns)
- **Mobile**: Stacked layout (label above textarea)
- Labels aligned with top of textarea using `pt-2`

### 3. Schema Updates

**File:** `lib/validators/register69.schema.ts`

Added 5 new optional string fields:
```typescript
// การสนับสนุน (ปัจจัยที่เกี่ยวข้อง)
sup_supportByAdminName: z.string().optional(),
sup_supportBySchoolBoard: z.string().optional(),
sup_supportByLocalGov: z.string().optional(),
sup_supportByCommunity: z.string().optional(),
sup_supportByOthers: z.string().optional(),
```

### 4. Fixed availableInstruments Conflict

**Issue:** 
- Step4 uses `availableInstruments` as an array (for table data)
- Step5 was trying to use it as a textarea string

**Solution:**
Removed the conflicting textarea from Step5 and replaced with informational text:
```tsx
<p className="text-sm text-neutral-dark">
  ข้อมูลเครื่องดนตรีไทยถูกบันทึกไว้ใน Step 4 แล้ว
</p>
```

### 5. Green Theme Verification

**Confirmed Green Theme Throughout:**
- ✅ Section headers: `bg-primary/5`
- ✅ Borders: `border-neutral-border`
- ✅ Focus rings: `focus:ring-2 focus:ring-primary/50`
- ✅ Button: `border-primary text-primary hover:bg-primary/5`
- ✅ No blue colors found

**Button Text:**
- ✅ Already using Thai: "+ เพิ่มข้อมูล"
- ✅ No "Add More" text found

## Block Order in Step5

1. ✅ **NEW**: ปัจจัยที่เกี่ยวข้องโดยตรง (Support Factors)
2. ✅ เครื่องดนตรีไทย (Informational - data in Step4)
3. ✅ ความเพียงพอของเครื่องดนตรี (Instrument Sufficiency)
4. ✅ วิทยากร/ครูภูมิปัญญาไทย (External Instructors)

## Styling Details

### Card Container
```tsx
<div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
```

### Header
```tsx
<div className="bg-primary/5 px-6 py-3 border-b border-neutral-border">
  <h3 className="font-semibold text-neutral-dark">...</h3>
</div>
```

### Content Area
```tsx
<div className="p-6 space-y-4">
  {/* Content */}
</div>
```

### Textarea Styling
```tsx
className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
```

## Responsive Design

### Desktop (md and above)
- 12-column grid layout
- Label: 3 columns (25%)
- Textarea: 9 columns (75%)
- Side-by-side layout

### Mobile
- Single column layout
- Label stacks above textarea
- Full width for both elements

## Data Flow

### Form Registration
All fields registered with React Hook Form:
```tsx
{...register('sup_supportByAdminName')}
{...register('sup_supportBySchoolBoard')}
{...register('sup_supportByLocalGov')}
{...register('sup_supportByCommunity')}
{...register('sup_supportByOthers')}
```

### Default Values
Fields default to empty strings (optional in schema)

### Validation
All fields are optional - no validation errors if left empty

### Submission
Fields will be included in form submission payload as strings

## Verification

### TypeScript
- ✅ No TypeScript errors
- ✅ No diagnostics found
- ✅ All fields properly typed

### UI Consistency
- ✅ Matches existing Step5 styling
- ✅ Green theme throughout
- ✅ Consistent spacing and padding
- ✅ Responsive layout works correctly

### Functionality
- ✅ All textareas editable
- ✅ Placeholders visible
- ✅ Focus states work
- ✅ Form registration correct
- ✅ Data will submit properly

## Benefits

1. **Structured Data Collection**: Organized support information by category
2. **Clear Labels**: Easy to understand what information is needed
3. **Flexible Input**: Textarea allows detailed responses
4. **Responsive Design**: Works on all screen sizes
5. **Consistent UX**: Matches existing form patterns
6. **Green Theme**: Unified visual design
7. **Thai Language**: All text in Thai as required

## Notes

- The new block is positioned at the top of Step5 as requested
- All existing blocks remain intact and functional
- No breaking changes to existing functionality
- Schema properly extended with new fields
- Green theme maintained throughout entire step
- Button text already in Thai (no changes needed)
