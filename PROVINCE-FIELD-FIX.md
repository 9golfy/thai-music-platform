# Province Field Name Fix ✅

## ปัญหา:
จังหวัดไม่แสดงในตาราง Register100 (http://localhost:3001/dcp-admin/dashboard/register100)

## สาเหตุ:
ใช้ field name ผิด - ใช้ `school.province` แต่ใน database เป็น `schoolProvince`

## การตรวจสอบ:
```bash
node scripts/check-field-names.js
```

ผลลัพธ์:
```
❌ province: undefined
✅ schoolProvince: "กรุงเทพมหานคร"
✅ provinceAddress: "กรุงเทพมหานคร"
❌ level: undefined
✅ schoolLevel: "ประถมศึกษา"
```

## Field Names ที่ถูกต้อง:
- `schoolProvince` - จังหวัดของโรงเรียน
- `schoolLevel` - ระดับการศึกษา
- `schoolName` - ชื่อโรงเรียน
- `schoolSize` - ขนาดโรงเรียน
- `schoolId` - รหัสโรงเรียน (SCH-YYYYMMDD-XXXX)

## ไฟล์ที่แก้ไข:

### 1. components/admin/SchoolsDataTable.tsx ✅
**บรรทัด 30:** Search query
```typescript
// เดิม
{ province: { $regex: searchQuery, $options: 'i' } }

// แก้เป็น
{ schoolProvince: { $regex: searchQuery, $options: 'i' } }
```

**บรรทัด 172:** Display column
```typescript
// เดิม
{school.province || '-'}

// แก้เป็น
{school.schoolProvince || '-'}
```

### 2. components/admin/SchoolDetailView.tsx ✅
**บรรทัด 154:**
```typescript
// เดิม
<p className="font-medium">{school.province || '-'}</p>

// แก้เป็น
<p className="font-medium">{school.schoolProvince || '-'}</p>
```

### 3. components/admin/CreateCertificateForm.tsx ✅
**บรรทัด 221:**
```typescript
// เดิม
จังหวัด: {selectedSchool.province}

// แก้เป็น
จังหวัด: {selectedSchool.schoolProvince}
```

### 4. app/(teacher)/teacher/dashboard/page.tsx ✅
**บรรทัด 103:**
```typescript
// เดิม
<p className="font-medium">{school.province || '-'}</p>

// แก้เป็น
<p className="font-medium">{school.schoolProvince || '-'}</p>
```

## ผลลัพธ์:
✅ จังหวัดแสดงในตาราง Register100
✅ Search โดยจังหวัดทำงานได้
✅ จังหวัดแสดงในหน้า Detail View
✅ จังหวัดแสดงในฟอร์มสร้าง Certificate
✅ จังหวัดแสดงใน Teacher Dashboard

## การทดสอบ:
1. เปิด http://localhost:3001/dcp-admin/dashboard/register100
2. ตรวจสอบคอลัมน์ "จังหวัด" - ควรแสดง "กรุงเทพมหานคร" แทน "-"
3. ทดสอบ search โดยพิมพ์ชื่อจังหวัด
4. เปิดหน้า Detail View - ตรวจสอบว่าจังหวัดแสดงถูกต้อง

## Scripts ที่สร้าง:
- `scripts/check-field-names.js` - ตรวจสอบ field names ใน database

## สรุป:
✅ แก้ไขเสร็จสมบูรณ์ - จังหวัดจะแสดงในทุกหน้าที่เกี่ยวข้อง
