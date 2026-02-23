# Step4 New Blocks Implementation

## Summary
Added 4 new form blocks to Step4 with table-like layouts, blue headers, and black "Add More" buttons as per reference image requirements.

## Changes Made

### 1. Schema Updates (`lib/validators/register69.schema.ts`)

Added 4 new schemas:

#### Available Instruments Schema
```typescript
const availableInstrumentSchema = z.object({
  availableInstrumentsName: z.string().optional(),
  availableInstrumentsAmount: z.coerce.number().optional(),
  availableInstrumentsRemark: z.string().optional(),
});
```

#### External Instructor Schema (Updated)
```typescript
const externalInstructorSchema = z.object({
  extFullName: z.string().optional(),
  extPosition: z.string().optional(),
  extRole: z.string().optional(), // NEW FIELD
  extAddress: z.string().optional(),
  extPhone: z.string().optional(),
  extEmail: z.string().optional(),
});
```

#### In-Class Instruction Duration Schema
```typescript
const inClassInstructionDurationSchema = z.object({
  inClassGradeLevel: z.string().optional(),
  inClassStudentCount: z.coerce.number().optional(),
  inClassHoursPerSemester: z.coerce.number().optional(),
  inClassHoursPerYear: z.coerce.number().optional(),
});
```

#### Out-of-Class Instruction Duration Schema
```typescript
const outOfClassInstructionDurationSchema = z.object({
  outDay: z.string().optional(),
  outTimeFrom: z.string().optional(),
  outTimeTo: z.string().optional(),
  outLocation: z.string().optional(),
});
```

### 2. Main Schema Updates
- Changed `availableInstruments` from `z.string().optional()` to `z.array(availableInstrumentSchema).optional().default([])`
- Added `inClassInstructionDurations: z.array(inClassInstructionDurationSchema).optional().default([])`
- Added `outOfClassInstructionDurations: z.array(outOfClassInstructionDurationSchema).optional().default([])`
- Kept legacy text fields for backward compatibility

### 3. Step4 Component Updates (`components/forms/steps/Step4.tsx`)

Added 4 new `useFieldArray` hooks:
- `availableInstruments`
- `externalInstructors` (updated)
- `inClassInstructionDurations`
- `outOfClassInstructionDurations`

### 4. Block Implementations

#### Block 1: เครื่องดนตรีไทยที่มีอยู่และใช้งานได้จริงในปัจจุบัน
- Blue header: `bg-[#2F5DA8]`
- 3-column layout: ชื่อเครื่องดนตรี, จำนวน, หมายเหตุ
- Table header with blue text: `text-[#1D4ED8]`
- Black "Add More" button centered
- Fields: `availableInstrumentsName`, `availableInstrumentsAmount`, `availableInstrumentsRemark`

#### Block 2: วิทยากร/ครูภูมิปัญญาไทย/บุคลากรภายนอก
- Blue header: `bg-[#2F5DA8]`
- Fields layout:
  - Row 1: ชื่อ-สกุล, ตำแหน่ง (2 columns)
  - Row 2: บทบาท/หน้าที่ (dropdown with 4 options)
  - Row 3: ที่อยู่
  - Row 4: โทรศัพท์, อีเมล (2 columns)
- Dropdown options: วิทยากร, ครูภูมิปัญญาไทย, บุคลากรภายนอก, อื่น ๆ
- Fields: `extFullName`, `extPosition`, `extRole`, `extAddress`, `extPhone`, `extEmail`

#### Block 3: ระยะเวลาทำการเรียนการสอนในเวลาราชการ
- Blue header: `bg-[#2F5DA8]`
- Fields layout (2x2 grid):
  - ระดับชั้น, เรียนดนตรีไทยจำนวน (คน)
  - ชั่วโมง/ภาคการศึกษา, ชั่วโมง/ปีการศึกษา
- All number inputs with min="0"
- Fields: `inClassGradeLevel`, `inClassStudentCount`, `inClassHoursPerSemester`, `inClassHoursPerYear`

#### Block 4: ระยะเวลาทำการเรียนการสอนนอกเวลาราชการ
- Blue header: `bg-[#2F5DA8]`
- Fields layout (2x2 grid):
  - วัน (dropdown), เวลา
  - ถึง, สถานที่
- Day dropdown with 7 Thai weekday options
- Fields: `outDay`, `outTimeFrom`, `outTimeTo`, `outLocation`

### 5. Wizard Default Values (`components/forms/Register69Wizard.tsx`)

Added to defaultValues:
```typescript
availableInstruments: [],
inClassInstructionDurations: [],
outOfClassInstructionDurations: [],
```

## Styling Details

### Blue Header
- Background: `bg-[#2F5DA8]`
- Text: `text-white`
- Matches reference image header style

### Table Headers
- Text color: `text-[#1D4ED8]`
- Centered alignment
- Blue color matching reference

### Add More Buttons
- Background: `bg-black`
- Text: `text-white font-semibold`
- Centered with max-width: `w-full max-w-md mx-auto`
- Hover effect: `hover:bg-black/90`
- Label: "+ Add More"

### Input Fields
- Standard styling: `border border-neutral-border rounded-lg`
- Focus ring: `focus:ring-2 focus:ring-primary/50`
- Responsive grid layouts

## Placement
All 4 blocks are inserted BEFORE the existing section:
```tsx
{/* ระยะเวลาการเรียนการสอน */}
```

## Form Submission
All new array fields will be automatically included in the form submission payload via the existing FormData handling in Register69Wizard.

## Validation
- All fields are optional (`.optional()`)
- Number fields use `z.coerce.number()` for automatic type conversion
- Arrays default to empty arrays `[]`

## Responsive Design
- Mobile: Single column layout
- Desktop (md+): Multi-column grid layouts
- Consistent spacing and padding throughout

## Testing Checklist
- ✅ No TypeScript errors
- ✅ Schema validation passes
- ✅ All useFieldArray hooks initialized
- ✅ Add More buttons functional
- ✅ Remove buttons functional
- ✅ Default values set correctly
- ✅ Responsive layouts work on mobile and desktop
- ✅ Form submission includes new array data
