// Test file upload directly to API
// Run: node scripts/test-upload-api.js

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const http = require('http');

async function testUpload() {
  console.log('🧪 Testing file upload to API...\n');

  // Create a test image file
  const testImagePath = path.join(__dirname, '..', 'public', 'uploads', 'orchid_flower_1.jpg');
  
  if (!fs.existsSync(testImagePath)) {
    console.error('❌ Test image not found:', testImagePath);
    return;
  }

  console.log('✅ Test image found:', testImagePath);
  console.log('📦 Creating FormData...\n');

  const form = new FormData();
  
  // Add basic fields
  form.append('schoolName', 'โรงเรียนทดสอบ Upload API');
  form.append('schoolProvince', 'กรุงเทพมหานคร');
  form.append('schoolLevel', 'ประถมศึกษา');
  form.append('affiliation', 'กระทรวงศึกษาธิการ (Ministry of Education)');
  form.append('schoolSize', 'MEDIUM');
  form.append('staffCount', '50');
  form.append('studentCount', '500');
  form.append('studentCountByGrade', 'ป.1-6 รวม 500 คน');
  
  // Address fields
  form.append('addressNo', '123');
  form.append('moo', '1');
  form.append('road', 'ถนนทดสอบ');
  form.append('subDistrict', 'แขวงทดสอบ');
  form.append('district', 'เขตทดสอบ');
  form.append('provinceAddress', 'กรุงเทพมหานคร');
  form.append('postalCode', '10100');
  form.append('phone', '021234567');
  form.append('fax', '021234568');
  
  // Management fields
  form.append('mgtFullName', 'นายทดสอบ Upload');
  form.append('mgtPosition', 'ผู้อำนวยการ');
  form.append('mgtAddress', '123 ถนนทดสอบ');
  form.append('mgtPhone', '0812345678');
  form.append('mgtEmail', 'test@upload.com');
  
  // Upload manager image
  console.log('📤 Uploading manager image...');
  form.append('mgtImage', fs.createReadStream(testImagePath), {
    filename: 'manager.jpg',
    contentType: 'image/jpeg'
  });
  
  // Teacher data
  const teachers = [
    {
      teacherQualification: 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย',
      teacherFullName: 'นายครูทดสอบ 1',
      teacherPosition: 'ครู',
      teacherEducation: 'ปริญญาตรี',
      teacherPhone: '0823456789',
      teacherEmail: 'teacher1@test.com'
    },
    {
      teacherQualification: 'ครูภูมิปัญญาในท้องถิ่น',
      teacherFullName: 'นายครูทดสอบ 2',
      teacherPosition: 'ครู',
      teacherEducation: 'ปริญญาตรี',
      teacherPhone: '0834567890',
      teacherEmail: 'teacher2@test.com'
    }
  ];
  
  form.append('thaiMusicTeachers', JSON.stringify(teachers));
  
  // Upload teacher images
  console.log('📤 Uploading teacher images...');
  form.append('teacherImage_0', fs.createReadStream(testImagePath), {
    filename: 'teacher1.jpg',
    contentType: 'image/jpeg'
  });
  form.append('teacherImage_1', fs.createReadStream(testImagePath), {
    filename: 'teacher2.jpg',
    contentType: 'image/jpeg'
  });
  
  // Teaching checkboxes
  form.append('isCompulsorySubject', 'true');
  form.append('hasAfterSchoolTeaching', 'true');
  form.append('hasElectiveSubject', 'true');
  form.append('hasLocalCurriculum', 'true');
  form.append('teachingLocation', 'ห้องดนตรี');
  
  // Support
  form.append('hasSupportFromOrg', 'true');
  form.append('hasSupportFromExternal', 'false');
  
  // Scores
  form.append('teacher_training_score', '20');
  form.append('teacher_qualification_score', '10');
  form.append('support_from_org_score', '5');
  form.append('support_from_external_score', '0');
  form.append('award_score', '0');
  form.append('activity_within_province_internal_score', '0');
  form.append('activity_within_province_external_score', '0');
  form.append('activity_outside_province_score', '0');
  form.append('pr_activity_score', '0');
  form.append('total_score', '35');
  
  // Certification
  form.append('certifiedINFOByAdminName', 'true');
  
  console.log('🚀 Sending POST request to API...\n');

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/register100',
    method: 'POST',
    headers: form.getHeaders()
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('📥 Response Status:', res.statusCode);
        console.log('📥 Response Body:', data);
        
        try {
          const json = JSON.parse(data);
          if (json.success) {
            console.log('\n✅ Upload successful!');
            console.log('📝 Record ID:', json.id);
            
            // Check if files were saved
            setTimeout(() => {
              const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
              const files = fs.readdirSync(uploadsDir);
              const newFiles = files.filter(f => {
                const stat = fs.statSync(path.join(uploadsDir, f));
                const now = Date.now();
                const fileTime = stat.mtimeMs;
                return (now - fileTime) < 10000; // Files created in last 10 seconds
              });
              
              console.log('\n📁 New files in uploads folder:');
              if (newFiles.length > 0) {
                newFiles.forEach(f => console.log('  ✅', f));
              } else {
                console.log('  ❌ No new files found!');
              }
              
              resolve(json);
            }, 1000);
          } else {
            console.log('\n❌ Upload failed:', json.message);
            reject(new Error(json.message));
          }
        } catch (e) {
          console.error('\n❌ Error parsing response:', e);
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      console.error('\n❌ Request error:', error);
      reject(error);
    });

    form.pipe(req);
  });
}

testUpload().catch(console.error);
