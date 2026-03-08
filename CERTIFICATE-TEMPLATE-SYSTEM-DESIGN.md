# Certificate Template System Design

## Overview
ระบบสร้างใบประกาศนียบัตรที่รองรับการ upload template และกำหนดตำแหน่งข้อความ

## System Flow

### Phase 1: Template Management
```
Admin → Upload Template → Define Positions → Save Template Config
```

### Phase 2: Certificate Generation
```
Admin → Select School → Select Template → Preview → Generate Certificate
```

## Database Schema

### Collection: `certificate_templates`
```javascript
{
  _id: ObjectId,
  name: "Gold Template",
  description: "เทมเพลตสีทอง สำหรับโรงเรียน 100%",
  imageUrl: "/certificates/templates/gold-template.jpg",
  certificateType: "register100", // or "register-support"
  textPositions: {
    schoolName: {
      x: 512,        // pixel position from left
      y: 350,        // pixel position from top
      fontSize: 48,
      fontFamily: "Sarabun",
      color: "#1a1a1a",
      align: "center", // left, center, right
      maxWidth: 800   // for text wrapping
    },
    certificateNumber: {
      x: 200,
      y: 650,
      fontSize: 16,
      fontFamily: "Sarabun",
      color: "#666666",
      align: "left"
    },
    issueDate: {
      x: 200,
      y: 680,
      fontSize: 16,
      fontFamily: "Sarabun",
      color: "#666666",
      align: "left"
    }
  },
  isActive: true,
  createdBy: "userId",
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: `certificates` (Updated)
```javascript
{
  _id: ObjectId,
  schoolId: "SCH-20260301-0001",
  schoolName: "โรงเรียนดนตรีไทยตัวอย่าง",
  certificateType: "register100",
  templateId: ObjectId, // reference to certificate_templates
  certificateNumber: "CERT-2569-0001",
  issueDate: Date,
  generatedImageUrl: "/certificates/generated/CERT-2569-0001.jpg",
  generatedPdfUrl: "/certificates/generated/CERT-2569-0001.pdf",
  isActive: true,
  createdBy: "userId",
  createdAt: Date,
  updatedAt: Date
}
```

## UI Components

### 1. Template Manager Page
**Route:** `/dcp-admin/dashboard/certificates/templates`

Features:
- List all templates
- Upload new template (JPG only, max 5MB)
- Edit template positions
- Delete template
- Set default template

### 2. Template Editor (Position Mapper)
**Route:** `/dcp-admin/dashboard/certificates/templates/[id]/edit`

Features:
- Canvas showing template image
- Click to add text field
- Drag to reposition
- Adjust font size, color, alignment
- Live preview with sample text
- Save configuration

### 3. Create Certificate Form (Enhanced)
**Route:** `/dcp-admin/dashboard/certificates/create`

Current fields:
- ✅ เลือกโรงเรียน (dropdown)
- ✅ ประเภทใบประกาศ (auto-filled)
- ✅ Template (dropdown)

New fields to add:
- ✅ School ID (display only, auto-filled from selected school)
- ✅ Template preview with positioned text
- ✅ Generate button

### 4. Certificate Preview
Shows:
- Template image
- School name overlaid at defined position
- Certificate number
- Issue date
- Download buttons (PDF, JPG)

## API Endpoints

### Template Management
```
GET    /api/certificates/templates          - List all templates
POST   /api/certificates/templates          - Create new template
GET    /api/certificates/templates/[id]     - Get template details
PUT    /api/certificates/templates/[id]     - Update template
DELETE /api/certificates/templates/[id]     - Delete template
POST   /api/certificates/templates/upload   - Upload template image
```

### Certificate Generation
```
POST   /api/certificates/generate           - Generate certificate with template
GET    /api/certificates/[id]/download      - Download certificate
```

## Implementation Steps

### Step 1: Template Upload & Storage
1. Create upload API endpoint
2. Store images in `/public/certificates/templates/`
3. Save metadata to `certificate_templates` collection

### Step 2: Position Mapper UI
1. Create canvas-based editor
2. Allow click-to-place text fields
3. Drag-and-drop repositioning
4. Font customization panel
5. Save coordinates to DB

### Step 3: Enhanced Create Form
1. Add School ID display
2. Show template preview
3. Overlay school name at defined position
4. Real-time preview

### Step 4: Certificate Generation
1. Use Node.js canvas library (node-canvas or sharp)
2. Load template image
3. Overlay text at saved positions
4. Generate JPG and PDF
5. Store in `/public/certificates/generated/`

## Technical Stack

### Frontend
- React Canvas API for position mapper
- Fabric.js or Konva.js for interactive canvas
- React DnD for drag-and-drop

### Backend
- `sharp` - Image processing
- `canvas` - Node canvas for text overlay
- `pdfkit` - PDF generation

### Storage
- Local filesystem: `/public/certificates/`
- MongoDB: Template configs and certificate records

## Security Considerations

1. File upload validation (JPG only, max 5MB)
2. Sanitize filenames
3. Role-based access (root/admin only)
4. Rate limiting on generation
5. Watermark for preview mode

## Future Enhancements

1. Multiple text fields (principal name, date, etc.)
2. QR code generation for verification
3. Batch certificate generation
4. Email delivery
5. Digital signature
6. Template marketplace
7. Multi-language support

## Example Usage Flow

```
1. Admin uploads "Gold Template" JPG
2. Admin clicks on template to set school name position
3. Admin adjusts font size to 48px, center aligned
4. Admin saves template configuration

5. Admin goes to "Create Certificate"
6. Admin selects "โรงเรียนดนตรีไทยตัวอย่าง"
7. System shows School ID: SCH-20260301-0001
8. Admin selects "Gold Template"
9. Preview shows template with school name positioned
10. Admin clicks "Generate"
11. System creates certificate and saves to DB
12. Certificate available for download and viewing
```

## File Structure

```
/public/certificates/
  /templates/
    gold-template.jpg
    silver-template.jpg
  /generated/
    CERT-2569-0001.jpg
    CERT-2569-0001.pdf

/app/api/certificates/
  templates/
    route.ts
    [id]/route.ts
    upload/route.ts
  generate/route.ts

/components/admin/
  TemplateManager.tsx
  TemplateEditor.tsx
  CertificatePreview.tsx
  CreateCertificateForm.tsx (enhanced)
```

## Next Steps

1. ✅ Review and approve design
2. Create template management pages
3. Implement position mapper
4. Enhance create certificate form
5. Implement certificate generation
6. Testing and refinement
