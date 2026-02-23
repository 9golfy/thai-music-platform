# แบบเสนอผลงาน 69 - โรงเรียนดนตรีไทย 100%

Multi-step registration form for Thai Music School 100% Program (Budget Year 2569)

## 🎯 Implementation Summary

### ✅ FINAL OUTPUT CHECKLIST

#### Sections Implemented
- **Total Sections: 14**
  1. ข้อมูลพื้นฐาน (Basic Information)
  2. สถานที่ตั้ง (Location)
  3. ผู้บริหารสถานศึกษา (School Administrator)
  4. ผู้สอนดนตรีไทย / ผู้รับผิดชอบ (Thai Music Teachers)
  5. แผนการจัดการเรียนการสอนปัจจุบัน (Current Teaching Plans)
  6. เครื่องดนตรีไทย (Thai Musical Instruments)
  7. วิทยากร/ครูภูมิปัญญาไทย (External Instructors)
  8. ระยะเวลาการเรียนการสอน (Instruction Duration)
  9. การสนับสนุน (Support)
  10. ความสามารถผู้สอน (Teacher Skills)
  11. ความเพียงพอของเครื่องดนตรี (Instrument Sufficiency)
  12. หลักสูตรและผลลัพธ์ (Curriculum and Outcomes)
  13. ภาพและสื่อ (Media and Photos)
  14. แหล่งที่มาของข้อมูล (Information Source)
  15. ปัญหาและข้อเสนอแนะ (Problems and Suggestions)
  16. การรับรองข้อมูล (Certification)

#### Fields Implemented
- **Total Fields: 60+**
- All fields from specification implemented with exact variable names
- No fields renamed, merged, or added beyond specification

#### Array Sections (useFieldArray)
- **Total: 3 array sections**
  1. `thaiMusicTeachers` - Thai music teachers/coordinators
  2. `currentTeachingPlans` - Current teaching plans
  3. `externalInstructors` - External instructors/wisdom teachers

#### Validation
- ✅ Required fields marked with red asterisk (*)
- ✅ Zod schema validation
- ✅ Step-by-step validation (validates current step on "ถัดไป")
- ✅ Full validation on final submit (Step 7)
- ✅ Certification checkbox required before submission
- ✅ Thai error messages

#### UI/UX Features
- ✅ Thai-only labels (no variable names shown)
- ✅ Sticky header with clickable stepper (1-7)
- ✅ Non-fixed navigation buttons at bottom of content
- ✅ Theme colors match specification:
  - primary: #17cf17
  - background-light: #f6f8f6
  - neutral-border: #e1e8e1
- ✅ Public Sans + Sarabun fonts
- ✅ Section cards with bg-primary/5 header strip

#### Special Behaviors
1. ✅ **First-time consent modal**
   - Shows once on first visit
   - Stored in localStorage
   - Single "ยอมรับ" button

2. ✅ **Auto schoolSize calculation**
   - Auto-calculates from studentCount
   - User can override manually
   - Helper hint text showing thresholds

3. ✅ **File upload constraints**
   - Multiple file upload for mediaPhotos
   - Max 1MB per file
   - jpg/jpeg/png only
   - File list with individual remove buttons

4. ✅ **Draft save/restore**
   - "บันทึกร่าง" button saves to localStorage
   - Restore modal on page load if draft exists
   - Persists across all steps

#### Multi-Step Flow
- ✅ 7 steps with clickable stepper
- ✅ Can navigate to any step directly
- ✅ Step 7 includes review summary with "แก้ไข" links
- ✅ Smooth scroll to top on step change

#### API Integration
- ✅ POST to /api/register-69
- ✅ Multipart/form-data handling
- ✅ File uploads appended to FormData
- ✅ Arrays sent as JSON strings
- ✅ Booleans sent as string values
- ✅ Success/error response handling

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000/register-69](http://localhost:3000/register-69)

### Build

```bash
npm run build
npm start
```

## 📁 File Structure

```
├── app/
│   ├── api/
│   │   └── register-69/
│   │       └── route.ts              # API endpoint
│   ├── register-69/
│   │   └── page.tsx                  # Main page
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
├── components/
│   ├── forms/
│   │   ├── Register69Wizard.tsx      # Main wizard controller
│   │   └── steps/
│   │       ├── Step1.tsx             # Basic info + Location
│   │       ├── Step2.tsx             # Administrator
│   │       ├── Step3.tsx             # Thai music teachers
│   │       ├── Step4.tsx             # Teaching plans + Duration
│   │       ├── Step5.tsx             # Instruments + Instructors
│   │       ├── Step6.tsx             # Support + Skills + Curriculum
│   │       └── Step7.tsx             # Media + Source + Review
│   └── ui/
│       ├── ConsentModal.tsx          # First-time consent
│       └── RestoreDraftModal.tsx     # Draft restore prompt
├── lib/
│   ├── constants/
│   │   └── register69.options.ts    # Dropdown options
│   ├── utils/
│   │   └── schoolSize.ts            # School size calculator
│   └── validators/
│       └── register69.schema.ts     # Zod validation schema
├── tailwind.config.ts               # Tailwind config with theme
├── tsconfig.json                    # TypeScript config
├── package.json                     # Dependencies
└── README.md                        # This file
```

## 🎨 Theme Colors

```css
primary: #17cf17
background-light: #f6f8f6
background-dark: #112111
neutral-light: #f0f4f0
neutral-dark: #1a2a1a
neutral-border: #e1e8e1
```

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Fonts**: Public Sans + Sarabun

## ✨ Key Features

1. **Multi-step wizard** with 7 steps
2. **Clickable stepper** for easy navigation
3. **Draft save/restore** functionality
4. **Auto-calculation** of school size
5. **File upload** with validation
6. **Review summary** before submission
7. **Thai language** throughout
8. **Responsive design**
9. **Form persistence** across steps
10. **Validation** per step and on submit

## 📝 Notes

- All field variable names match specification exactly
- UI labels are Thai-only (no variable names shown)
- Navigation buttons are non-fixed (scroll with content)
- Stepper allows direct navigation to any step
- Draft is saved to localStorage
- Files are validated for type and size
- Certification checkbox is required for submission

## 🔧 Customization

To modify dropdown options, edit:
- `lib/constants/register69.options.ts`

To adjust validation rules, edit:
- `lib/validators/register69.schema.ts`

To change theme colors, edit:
- `tailwind.config.ts`

## 📄 License

This project is for the Thai Music School 100% Program.
