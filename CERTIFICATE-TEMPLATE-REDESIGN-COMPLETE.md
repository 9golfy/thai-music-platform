# Certificate Template System Redesign - COMPLETE ✅

## Implementation Summary

Successfully redesigned the certificate template management system with a centralized template management approach.

## New Workflow

### 1. Template Management (Admin)
```
Admin → Select Template Name (Default/Theme1/Theme2/Theme3)
     → Upload Image
     → Save Template
     → System stores mapping: templateName → imageUrl
```

### 2. Certificate Creation (Admin)
```
Admin → Select School
     → Select Saved Template
     → Create Certificate
```

## Changes Made

### 1. API Endpoints Created
- **`/api/certificate-templates`** (GET, POST)
  - GET: List all saved templates
  - POST: Save/Update template with name and image mapping

### 2. Database Schema

#### Collection: `certificate_templates`
```javascript
{
  _id: ObjectId,
  name: "default" | "theme1" | "theme2" | "theme3",
  imageUrl: "base64_string",
  isActive: true,
  createdBy: "userId",
  createdAt: Date,
  updatedAt: Date
}
```

#### Collection: `certificates` (Updated)
```javascript
{
  _id: ObjectId,
  schoolId: "SCH-xxx",
  schoolName: "ชื่อโรงเรียน",
  certificateType: "register100" | "register-support",
  templateName: "default" | "theme1" | "theme2" | "theme3", // Changed from templateId
  certificateNumber: "CERT-2569-0001",
  issueDate: Date,
  isActive: true,
  createdBy: "userId",
  createdAt: Date,
  updatedAt: Date
}
```

### 3. UI Components Updated

#### `CreateCertificateForm.tsx`
New layout with 3 sections:
1. **Preview Section** (Top)
   - Shows template image preview
   - Updates when template is selected or uploaded

2. **Template Management Section** (Middle)
   - Dropdown: Select template name (Default, Theme 1, Theme 2, Theme 3)
   - Upload button: Upload template image
   - Save button: Save template mapping to database
   - Shows list of saved templates

3. **Certificate Creation Section** (Bottom)
   - Select school (auto-fills School ID and type)
   - Select saved template from dropdown
   - Cancel and Create buttons

#### `CertificatePreview.tsx`
- Changed from `templateId` + `customTemplateUrl` to `templateName` + `templateImageUrl`
- Simplified props interface
- Loads template image by name from database

### 4. API Routes Updated

#### `app/api/certificates/route.ts`
- POST endpoint now accepts `templateName` instead of `templateId`
- Validates template exists in database before creating certificate
- Stores `templateName` in certificate document

#### `app/api/certificates/[id]/route.ts`
- Fetches template image URL by template name
- Returns `templateImageUrl` with certificate data

### 5. Pages Updated

#### Admin Certificate Detail Page
- `app/(admin)/dcp-admin/dashboard/certificates/[id]/page.tsx`
- Fetches template image by name from `certificate_templates` collection
- Passes `templateImageUrl` to preview component

#### Teacher Certificate Page
- `app/(teacher)/teacher/certificate/page.tsx`
- Fetches template image by name from `certificate_templates` collection
- Displays same template that admin uploaded

## Benefits

✅ **Centralized Management**: All templates stored in one collection
✅ **Reusable Templates**: Save once, use multiple times
✅ **Easy Updates**: Update template image without affecting existing certificates
✅ **Clear Separation**: Template management separate from certificate creation
✅ **Consistent Display**: Teachers see exact same template as admin created

## Usage Flow

1. Admin goes to `/dcp-admin/dashboard/certificates/create`
2. Admin selects template name (e.g., "Theme 1")
3. Admin uploads template image (JPG/PNG, max 5MB)
4. Admin clicks "บันทึก Template" to save mapping
5. Template appears in saved templates list
6. Admin selects school from dropdown
7. Admin selects saved template from dropdown
8. Admin clicks "สร้างใบประกาศ" to create certificate
9. Certificate is created with reference to template name
10. Teacher can view certificate with same template image

## Files Modified

### Created
- `app/api/certificate-templates/route.ts`

### Updated
- `components/admin/CreateCertificateForm.tsx` (complete rewrite)
- `components/admin/CertificatePreview.tsx`
- `app/api/certificates/route.ts`
- `app/(admin)/dcp-admin/dashboard/certificates/[id]/page.tsx`
- `app/(teacher)/teacher/certificate/page.tsx`

## Testing Checklist

- [ ] Upload template image for "Default"
- [ ] Upload template image for "Theme 1"
- [ ] Save templates successfully
- [ ] See saved templates in list
- [ ] Select school and create certificate with saved template
- [ ] View certificate in admin detail page with correct template
- [ ] View certificate in teacher page with correct template
- [ ] Download PDF with template image
- [ ] Update existing template with new image
- [ ] Verify updated template shows in new certificates

## Next Steps

1. Test the complete flow in development
2. Upload actual template images for all 4 template names
3. Create certificates for different schools
4. Verify PDF generation works correctly
5. Deploy to production

---

**Status**: ✅ Implementation Complete
**Date**: 2026-03-02
**Version**: 1.0
