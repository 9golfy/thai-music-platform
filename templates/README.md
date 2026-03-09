# Export Templates

ไฟล์ template สำหรับการ export ข้อมูลโรงเรียนดนตรีไทย

## ไฟล์ที่มี

### 1. `export-pdf-template.html`
- Template HTML สำหรับสร้าง PDF
- ใช้ placeholders เช่น `{{SCHOOL_NAME}}`, `{{TOTAL_SCORE}}`
- รองรับฟอนต์ไทย (Sarabun)
- มี CSS สำหรับการพิมพ์

### 2. `export-csv-template.js`
- Function สำหรับสร้าง CSV
- รองรับ UTF-8 BOM สำหรับ Excel
- Format ข้อมูลเป็นภาษาไทย

### 3. `pdf-template-usage.js`
- ตัวอย่างการใช้งาน PDF template
- Function `generatePDFFromTemplate(data)`
- สร้างไฟล์ทดสอบ `sample-report.html`

## วิธีใช้งาน

### สำหรับ PDF:
```javascript
const { generatePDFFromTemplate } = require('./pdf-template-usage');

const data = {
  schoolName: 'ชื่อโรงเรียน',
  schoolProvince: 'จังหวัด',
  totalScore: 85,
  // ... ข้อมูลอื่นๆ
};

const htmlContent = generatePDFFromTemplate(data);
// ส่ง htmlContent เป็น response
```

### สำหรับ CSV:
```javascript
const { generateCSV } = require('./export-csv-template');

const data = {
  schoolName: 'ชื่อโรงเรียน',
  totalScore: 85,
  // ... ข้อมูลอื่นๆ
};

const csvContent = generateCSV(data);
// ส่ง csvContent เป็น response
```

## Placeholders ใน PDF Template

- `{{SCHOOL_NAME}}` - ชื่อสถานศึกษา
- `{{SCHOOL_PROVINCE}}` - จังหวัด
- `{{SCHOOL_LEVEL}}` - ระดับการศึกษา
- `{{TOTAL_SCORE}}` - คะแนนรวม
- `{{TEACHER_TRAINING_SCORE}}` - คะแนนการเรียนการสอน
- `{{TEACHER_QUALIFICATION_SCORE}}` - คะแนนคุณลักษณะครู
- `{{SUPPORT_FROM_ORG_SCORE}}` - คะแนนการสนับสนุนจากต้นสังกัด
- `{{SUPPORT_FROM_EXTERNAL_SCORE}}` - คะแนนการสนับสนุนจากภายนอก
- `{{AWARD_SCORE}}` - คะแนนรางวัล
- `{{ACTIVITY_INTERNAL_SCORE}}` - คะแนนกิจกรรมภายใน
- `{{ACTIVITY_EXTERNAL_SCORE}}` - คะแนนกิจกรรมภายนอก
- `{{ACTIVITY_OUTSIDE_SCORE}}` - คะแนนกิจกรรมนอกจังหวัด
- `{{PR_ACTIVITY_SCORE}}` - คะแนนการประชาสัมพันธ์
- `{{CREATED_DATE}}` - วันที่สร้างรายงาน

## การทดสอบ

รัน `node pdf-template-usage.js` เพื่อสร้างไฟล์ทดสอบ `sample-report.html`