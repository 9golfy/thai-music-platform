// CSV Export Template for Thai Music School System
// ใช้สำหรับสร้างไฟล์ CSV ที่เปิดใน Excel ได้

function generateCSV(data) {
  const csvContent = [
    // Header
    ['รายงานข้อมูลโรงเรียนดนตรีไทย'],
    [''],
    
    // Basic Information
    ['ข้อมูลพื้นฐาน'],
    ['ชื่อสถานศึกษา', data.schoolName || 'ไม่ระบุ'],
    ['จังหวัด', data.schoolProvince || 'ไม่ระบุ'],
    ['ระดับการศึกษา', data.schoolLevel || 'ไม่ระบุ'],
    ['School ID', data.schoolId || 'ไม่ระบุ'],
    [''],
    
    // Score Summary
    ['คะแนนรวม', `${data.totalScore || 0} / 100 คะแนน`],
    [''],
    
    // Score Details
    ['รายละเอียดคะแนน'],
    ['หมวด', 'คะแนนที่ได้', 'คะแนนเต็ม'],
    ['การเรียนการสอนดนตรีไทย', data.teacherTrainingScore || 0, 20],
    ['คุณลักษณะครูผู้สอน', data.teacherQualificationScore || 0, 20],
    ['การสนับสนุนจากต้นสังกัด', data.supportFromOrgScore || 0, 5],
    ['การสนับสนุนจากภายนอก', data.supportFromExternalScore || 0, 15],
    ['รางวัลและเกียรติคุณ', data.awardScore || 0, 20],
    ['กิจกรรมภายในสถานศึกษา', data.activityInternalScore || 0, 5],
    ['กิจกรรมภายนอกสถานศึกษา', data.activityExternalScore || 0, 5],
    ['กิจกรรมนอกจังหวัด', data.activityOutsideScore || 0, 5],
    ['การประชาสัมพันธ์', data.prActivityScore || 0, 5],
    ['รวมทั้งหมด', data.totalScore || 0, 100],
    [''],
    
    // Footer
    ['สร้างเมื่อ', new Date().toLocaleDateString('th-TH')],
    ['ระบบบริหารจัดการข้อมูลการจัดการเรียนรู้ดนตรีไทย ๑๐๐ ปี']
  ];

  // Convert to CSV format with proper escaping
  const csv = csvContent.map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');

  // Add UTF-8 BOM for Excel compatibility
  const bom = '\uFEFF';
  return bom + csv;
}

// Usage Example:
/*
const sampleData = {
  schoolName: 'โรงเรียนทดสอบ',
  schoolProvince: 'กรุงเทพมหานคร',
  schoolLevel: 'มัธยมศึกษา',
  schoolId: 'SCH-001',
  totalScore: 85,
  teacherTrainingScore: 18,
  teacherQualificationScore: 17,
  supportFromOrgScore: 4,
  supportFromExternalScore: 12,
  awardScore: 15,
  activityInternalScore: 5,
  activityExternalScore: 4,
  activityOutsideScore: 5,
  prActivityScore: 5
};

const csvContent = generateCSV(sampleData);
console.log(csvContent);
*/

module.exports = { generateCSV };