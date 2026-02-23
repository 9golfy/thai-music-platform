# Image Upload Fields Implementation

## Summary
Added image upload fields to Step2 and Step3 of the Register 69 form.

## Changes Made

### 1. Step2 - Management Image (`mgtImage`)
**File**: `components/forms/steps/Step2.tsx`
- Added `mgtImage` file input field after the email field
- Implemented file validation (jpg/jpeg/png, max 1MB)
- Added image preview with file name and size display
- Added remove button for uploaded image
- Uses React state to track uploaded file

### 2. Step3 - Teacher Images (`teacherImage`)
**File**: `components/forms/steps/Step3.tsx`
- Added `teacherImage` file input field for each teacher in the array
- Implemented same file validation as Step2
- Added image preview for each teacher's photo
- Added remove button for each teacher's image
- Uses React state object to track multiple teacher images by index

### 3. Schema Updates
**File**: `lib/validators/register69.schema.ts`
- Added `mgtImage: z.any().optional()` to main schema
- Added `teacherImage: z.any().optional()` to `thaiMusicTeacherSchema`

### 4. API Route Updates
**File**: `app/api/register-69/route.ts`
- Updated FormData parsing to handle `mgtImage` (single file)
- Updated FormData parsing to handle `teacherImage` fields (array of files)
- Added logging for uploaded image counts

### 5. Form Submission Updates
**File**: `components/forms/Register69Wizard.tsx`
- Updated form submission logic to append `mgtImage` to FormData
- Updated logic to extract and append teacher images separately
- Teacher images are appended as `teacherImage_0`, `teacherImage_1`, etc.
- Teacher data is cleaned (images removed) before JSON stringification

## Field Names
- **Step2**: `mgtImage` - Management/administrator photo
- **Step3**: `teacherImage` - Teacher photo (one per teacher in array)

## Validation Rules
- Accepted formats: jpg, jpeg, png
- Maximum file size: 1MB per image
- Client-side validation with user-friendly error messages

## UI Features
- File input with styled border and focus ring
- Image preview showing filename and size in KB
- Remove button to clear selected image
- Consistent styling with existing form theme (#0FA968 primary color)

## Backend Compatibility
- Field names match backend expectations
- Images are sent as multipart/form-data
- All existing fields remain unchanged
- Form payload structure preserved
