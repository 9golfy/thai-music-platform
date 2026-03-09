# ระบบบริหารจัดการข้อมูลการจัดการเรียนรู้ดนตรีไทย ๑๐๐ ปี - System Title Locations

## ตำแหน่งที่แสดงชื่อระบบ (System Title Locations)

ชื่อระบบ **"ระบบบริหารจัดการข้อมูลการจัดการเรียนรู้ดนตรีไทย ๑๐๐ ปี"** ปรากฏในไฟล์ต่อไปนี้:

### 1. PDF Export Routes (การส่งออก PDF)
- `app/api/register100/[id]/export/pdf/route.ts` - บรรทัด 163
- `app/api/register-support/[id]/export/pdf/route.ts` - บรรทัด 152

### 2. Excel/CSV Export Routes (การส่งออก Excel/CSV)
- `app/api/register100/[id]/export/excel/route.ts` - บรรทัด 61
- `app/api/register-support/[id]/export/excel/route.ts` - บรรทัด 61

### 3. Template Files (ไฟล์เทมเพลต)
- `templates/export-pdf-template.html` - บรรทัด 194
- `templates/export-csv-template.js` - บรรทัด 40

### 4. Layout Files (ไฟล์เลย์เอาต์หลัก)
- `app/(admin)/dashboard/layout.tsx` - บรรทัด 151
- `app/(admin)/dcp-admin/dashboard/layout.tsx` - บรรทัด 176  
- `app/(teacher)/teacher/layout.tsx` - บรรทัด 161

## การแก้ไขที่ทำแล้ว (Completed Fixes)

✅ **PDF Export Routes**: แก้ไขชื่อระบบให้ถูกต้องแล้ว
✅ **Excel/CSV Export Routes**: แก้ไขชื่อระบบให้ถูกต้องแล้ว  
✅ **Template Files**: แก้ไขชื่อระบบให้ถูกต้องแล้ว
✅ **Build Errors**: แก้ไข HTML comments ที่ทำให้เกิด build error แล้ว

## หมายเหตุ (Notes)

- ชื่อระบบในไฟล์ Layout หลัก (dashboard layouts) ยังคงใช้ชื่อเดิม "ระบบบริหารจัดการข้อมูลกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์" 
- การแก้ไขครั้งนี้เน้นที่ไฟล์ export เท่านั้น เพื่อให้ PDF และ CSV ที่ส่งออกมีชื่อระบบที่ถูกต้อง
- หากต้องการแก้ไขชื่อระบบในหน้าเว็บหลัก ต้องแก้ไขในไฟล์ Layout ด้วย

## วิธีการตรวจสอบ (How to Verify)

1. เปิดหน้า Register 100 Detail View และคลิก "Export PDF"
2. เปิดหน้า Register Support Detail View และคลิก "Export CSV"  
3. ตรวจสอบว่าชื่อระบบในไฟล์ที่ส่งออกเป็น "ระบบบริหารจัดการข้อมูลการจัดการเรียนรู้ดนตรีไทย ๑๐๐ ปี"

## Template Usage (การใช้งานเทมเพลต)

ไฟล์เทมเพลตที่สร้างขึ้น:
- `templates/export-pdf-template.html` - เทมเพลต HTML สำหรับ PDF
- `templates/export-csv-template.js` - ฟังก์ชันสำหรับสร้าง CSV
- `templates/pdf-template-usage.js` - ตัวอย่างการใช้งาน
- `templates/README.md` - คู่มือการใช้งาน

เทมเพลตเหล่านี้ใช้ placeholder system เช่น `{{SCHOOL_NAME}}`, `{{TOTAL_SCORE}}` สำหรับข้อมูลแบบไดนามิก