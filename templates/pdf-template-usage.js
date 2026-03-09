// วิธีการใช้งาน PDF Template
// How to use PDF Template

const fs = require('fs');
const path = require('path');

function generatePDFFromTemplate(data) {
  // อ่านไฟล์ template
  const templatePath = path.join(__dirname, 'export-pdf-template.html');
  let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
  
  // แทนที่ placeholders ด้วยข้อมูลจริง
  const replacements = {
    '{{SCHOOL_NAME}}': data.schoolName || 'ไม่ระบุ',
    '{{SCHOOL_PROVINCE}}': data.schoolProvince || 'ไม่ระบุ',
    '{{SCHOOL_LEVEL}}': data.schoolLevel || 'ไม่ระบุ',
    '{{TOTAL_SCORE}}': data.totalScore || 0,
    '{{TEACHER_TRAINING_SCORE}}': data.teacherTrainingScore || 0,
    '{{TEACHER_QUALIFICATION_SCORE}}': data.teacherQualificationScore || 0,
    '{{SUPPORT_FROM_ORG_SCORE}}': data.supportFromOrgScore || 0,
    '{{SUPPORT_FROM_EXTERNAL_SCORE}}': data.supportFromExternalScore || 0,
    '{{AWARD_SCORE}}': data.awardScore || 0,
    '{{ACTIVITY_INTERNAL_SCORE}}': data.activityInternalScore || 0,
    '{{ACTIVITY_EXTERNAL_SCORE}}': data.activityExternalScore || 0,
    '{{ACTIVITY_OUTSIDE_SCORE}}': data.activityOutsideScore || 0,
    '{{PR_ACTIVITY_SCORE}}': data.prActivityScore || 0,
    '{{CREATED_DATE}}': new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  // แทนที่ทุก placeholder
  Object.keys(replacements).forEach(placeholder => {
    const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
    htmlTemplate = htmlTemplate.replace(regex, replacements[placeholder]);
  });
  
  return htmlTemplate;
}

// ตัวอย่างการใช้งาน
const sampleData = {
  schoolName: 'โรงเรียนทดสอบ Register100 Full Fields Complete',
  schoolProvince: 'กรุงเทพมหานคร',
  schoolLevel: 'มัธยมศึกษา',
  totalScore: 100,
  teacherTrainingScore: 20,
  teacherQualificationScore: 20,
  supportFromOrgScore: 5,
  supportFromExternalScore: 15,
  awardScore: 20,
  activityInternalScore: 5,
  activityExternalScore: 5,
  activityOutsideScore: 5,
  prActivityScore: 5
};

// สร้าง HTML จาก template
const htmlContent = generatePDFFromTemplate(sampleData);

// บันทึกเป็นไฟล์ (สำหรับทดสอบ)
fs.writeFileSync('sample-report.html', htmlContent, 'utf8');
console.log('✅ สร้างไฟล์ sample-report.html สำเร็จ');

// สำหรับใช้ใน API Route
module.exports = { generatePDFFromTemplate };