# Clone regist100 to regist-support - Complete Guide

## Overview

Clone ทั้งหมดจาก `/regist100` มาสร้างเป็น `/regist-support` โดย:
- เปลี่ยนชื่อตัวแปรทั้งหมดเป็น `registSupport_`
- ใช้ MongoDB collection ใหม่: `register_support_submissions`
- แยก API endpoints ใหม่: `/api/register-support`

## Files to Clone

### 1. Page Files
```
app/(front)/regist100/
├── layout.tsx          → app/(front)/regist-support/layout.tsx
└── page.tsx            → app/(front)/regist-support/page.tsx
```

### 2. Component Files
```
components-regist100/                    → components-regist-support/
├── forms/
│   ├── Register100Wizard.tsx          → RegisterSupportWizard.tsx
│   └── steps/
│       ├── Step1.tsx                   → Step1.tsx
│       ├── Step2.tsx                   → Step2.tsx
│       ├── Step3.tsx                   → Step3.tsx
│       ├── Step4.tsx                   → Step4.tsx
│       ├── Step5.tsx                   → Step5.tsx
│       ├── Step6.tsx                   → Step6.tsx
│       ├── Step7.tsx                   → Step7.tsx
│       └── Step8.tsx                   → Step8.tsx
└── ui/
    ├── ConsentModal.tsx                → ConsentModal.tsx
    └── SuccessModal.tsx                → SuccessModal.tsx
```

### 3. API Files
```
app/api/register-100/
└── route.ts            → app/api/register-support/route.ts
```

## Search & Replace Rules

ใช้ Find & Replace ใน VS Code (Ctrl+Shift+H) หรือ editor ของคุณ:

### Basic Replacements
```
register100          → registerSupport
Register100          → RegisterSupport
REGISTER100          → REGISTER_SUPPORT
register-100         → register-support
regist100            → registSupport
Regist100            → RegistSupport
```

### Path Replacements
```
components-regist100                    → components-regist-support
@/components-regist100                  → @/components-regist-support
/api/register-100                       → /api/register-support
/api/register100                        → /api/register-support
/regist100                              → /regist-support
```

### Database Replacements
```
register100_submissions                 → register_support_submissions
```

### Text Replacements (Thai)
```
โรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์    → โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย
โรงเรียนดนตรีไทย 100%                → โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย
```

## Step-by-Step Instructions

### Step 1: Create Directories

```powershell
# Create all directories
New-Item -ItemType Directory -Force -Path "app/(front)/regist-support"
New-Item -ItemType Directory -Force -Path "components-regist-support/forms/steps"
New-Item -ItemType Directory -Force -Path "components-regist-support/ui"
New-Item -ItemType Directory -Force -Path "app/api/register-support"
```

### Step 2: Clone Files Using VS Code

1. **Open Source Folder:**
   - `app/(front)/regist100/`

2. **Copy Each File:**
   - Right-click → Copy
   - Paste to `app/(front)/regist-support/`

3. **Find & Replace in Each File:**
   - Open file
   - Press `Ctrl+H`
   - Use replacements from above
   - Replace All

4. **Repeat for All Folders:**
   - `components-regist100/` → `components-regist-support/`
   - `app/api/register-100/` → `app/api/register-support/`

### Step 3: Verify Replacements

Check these key files:

**app/(front)/regist-support/page.tsx**
```typescript
import RegisterSupportWizard from '@/components-regist-support/forms/RegisterSupportWizard';

export default function RegistSupportPage() {
  // Should use registSupport_ variables
}
```

**components-regist-support/forms/RegisterSupportWizard.tsx**
```typescript
const [registSupport_formData, setRegistSupport_FormData] = useState({...});
const [registSupport_currentStep, setRegistSupport_CurrentStep] = useState(1);
```

**app/api/register-support/route.ts**
```typescript
const collection = db.collection('register_support_submissions');
```

### Step 4: Update tsconfig.json (if needed)

Add path alias:
```json
{
  "compilerOptions": {
    "paths": {
      "@/components-regist-support/*": ["./components-regist-support/*"]
    }
  }
}
```

### Step 5: Test

```powershell
# Restart dev server
npm run dev
```

Test URLs:
- http://localhost:3000/regist-support
- Submit form and check MongoDB: `register_support_submissions`

## MongoDB Collection

### Collection Name
```
register_support_submissions
```

### Schema (Same as register100)
```javascript
{
  _id: ObjectId,
  // Step 1: School Info
  registSupport_schoolName: String,
  registSupport_schoolType: String,
  // ... all other fields with registSupport_ prefix
  
  // Metadata
  registSupport_createdAt: Date,
  registSupport_updatedAt: Date,
  registSupport_status: String
}
```

## API Endpoints

### POST /api/register-support
Submit new registration

### GET /api/register-support/list
Get all registrations (for dashboard)

### GET /api/register-support/[id]
Get single registration

### PUT /api/register-support/[id]
Update registration

### DELETE /api/register-support/[id]
Delete registration

## Dashboard Integration

Update dashboard to show regist-support data:

**app/(admin)/dashboard/register-support/page.tsx**
```typescript
import RegisterSupportDataTable from '@/components/admin/RegisterSupportDataTable';

export default function RegisterSupportDashboardPage() {
  return <RegisterSupportDataTable />;
}
```

## Variable Naming Convention

All variables should follow this pattern:

### Form Data
```typescript
registSupport_schoolName
registSupport_schoolType
registSupport_address
registSupport_province
// etc...
```

### State Variables
```typescript
const [registSupport_formData, setRegistSupport_FormData] = useState({});
const [registSupport_currentStep, setRegistSupport_CurrentStep] = useState(1);
const [registSupport_errors, setRegistSupport_Errors] = useState({});
```

### Functions
```typescript
const registSupport_handleSubmit = async () => {};
const registSupport_validateStep = () => {};
const registSupport_saveToLocalStorage = () => {};
```

## Testing Checklist

- [ ] Layout loads correctly
- [ ] All 8 steps display
- [ ] Form validation works
- [ ] Autocomplete works (address fields)
- [ ] File upload works
- [ ] Form submission works
- [ ] Data saves to `register_support_submissions`
- [ ] Success modal shows
- [ ] Dashboard shows data
- [ ] Edit/Delete works in dashboard

## Troubleshooting

### Issue: Import errors
**Solution:** Check path aliases in tsconfig.json

### Issue: API not found
**Solution:** Verify API route file exists at `app/api/register-support/route.ts`

### Issue: MongoDB collection not created
**Solution:** Submit one form to auto-create collection

### Issue: Variables not renamed
**Solution:** Use Find & Replace with "Match Whole Word" enabled

## Quick Clone Script (Manual)

If you prefer manual approach:

1. Copy entire `regist100` folder to `regist-support`
2. Copy entire `components-regist100` to `components-regist-support`
3. Copy entire `app/api/register-100` to `app/api/register-support`
4. Use VS Code Find & Replace (Ctrl+Shift+H) with "Files to include": `**/regist-support/**,**/components-regist-support/**,**/register-support/**`
5. Replace all patterns from "Search & Replace Rules" section

---

**Created:** February 24, 2026  
**Status:** Ready to clone  
**Estimated Time:** 30-45 minutes for manual clone
