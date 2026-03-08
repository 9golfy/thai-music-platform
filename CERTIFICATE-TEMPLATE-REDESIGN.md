# Certificate Template System - Redesign

## New Flow

### 1. Template Management (Admin)
```
Admin → เลือก Template Name (Default/Theme1/Theme2/Theme3)
     → Upload รูป Template
     → บันทึก Template
     → ระบบเก็บ mapping: templateName → imageUrl
```

### 2. Create Certificate (Admin)
```
Admin → เลือกโรงเรียน
     → เลือก Template ที่บันทึกไว้
     → Preview
     → สร้างใบประกาศ
```

## Database Schema

### Collection: `certificate_templates`
```javascript
{
  _id: ObjectId,
  name: "default" | "theme1" | "theme2" | "theme3",
  displayName: "Default Template",
  imageUrl: "base64_string_or_url",
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
  schoolId: "SCH-xxx",
  schoolName: "ชื่อโรงเรียน",
  certificateType: "register100" | "register-support",
  templateName: "default" | "theme1" | "theme2" | "theme3",
  certificateNumber: "CERT-2569-0001",
  issueDate: Date,
  isActive: true,
  createdBy: "userId",
  createdAt: Date,
  updatedAt: Date
}
```

## UI Components

### 1. Template Manager Section (in Create Certificate Page)
```
┌─────────────────────────────────────────┐
│ จัดการ Template                         │
├─────────────────────────────────────────┤
│ เลือก Template: [Dropdown ▼]           │
│   - Default Template                    │
│   - Theme 1                             │
│   - Theme 2                             │
│   - Theme 3                             │
│                                         │
│ [📤 Upload รูป Template]               │
│                                         │
│ [💾 บันทึก Template]                   │
└─────────────────────────────────────────┘
```

### 2. Create Certificate Section
```
┌─────────────────────────────────────────┐
│ สร้างใบประกาศ                          │
├─────────────────────────────────────────┤
│ เลือกโรงเรียน: [Dropdown ▼]            │
│ School ID: SCH-xxx                      │
│ ประเภท: โรงเรียน 100%                   │
│ Template: [Dropdown ▼]                  │
│   - Default Template                    │
│   - Theme 1                             │
│   - Theme 2                             │
│   - Theme 3                             │
│                                         │
│ [❌ ยกเลิก] [✅ สร้างใบประกาศ]         │
└─────────────────────────────────────────┘
```

## Implementation Plan

1. ✅ Create API for template management
2. ✅ Update certificate creation to use template names
3. ✅ Update UI to separate template management
4. ✅ Update preview to load template by name
5. ✅ Update teacher view to use template names

## Benefits

- ✅ Centralized template management
- ✅ Reusable templates across certificates
- ✅ Easy to update templates
- ✅ Clear separation of concerns
