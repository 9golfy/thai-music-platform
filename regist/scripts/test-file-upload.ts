/**
 * Test script to verify file upload functionality
 * Run with: npx ts-node scripts/test-file-upload.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testFileUpload() {
  console.log('🧪 Testing File Upload Functionality');
  console.log('='.repeat(70));

  const API_URL = 'http://localhost:3000/api/register-69';
  
  // Prepare test data
  const testData = {
    // Step 1
    schoolName: 'โรงเรียนทดสอบอัพโหลดไฟล์',
    schoolProvince: 'กรุงเทพมหานคร',
    schoolLevel: 'ประถมศึกษา',
    affiliation: 'กระทรวงศึกษาธิการ (Ministry of Education)',
    staffCount: '50',
    studentCount: '500',
    addressNo: '123',
    moo: '1',
    road: 'ถนนทดสอบ',
    subDistrict: 'ทดสอบ',
    district: 'ทดสอบ',
    provinceAddress: 'กรุงเทพมหานคร',
    postalCode: '10100',
    phone: '021234567',
    fax: '021234568',
    
    // Step 2
    mgtFullName: 'นายทดสอบ อัพโหลด',
    mgtPosition: 'ผู้อำนวยการ',
    mgtPhone: '0812345678',
    mgtEmail: 'test@upload.com',
    
    // Step 3
    thaiMusicTeachers: JSON.stringify([
      {
        teacherFullName: 'นางสาวครู หนึ่ง',
        teacherPosition: 'ครูดนตรี',
        teacherEducation: 'ปริญญาตรี',
        teacherPhone: '0823456789',
        teacherEmail: 'teacher1@test.com',
      },
      {
        teacherFullName: 'นายครู สอง',
        teacherPosition: 'ครูพิเศษ',
        teacherEducation: 'ปริญญาโท',
        teacherPhone: '0834567890',
        teacherEmail: 'teacher2@test.com',
      }
    ]),
    
    // Other required fields
    currentTeachingPlans: JSON.stringify([]),
    availableInstruments: JSON.stringify([]),
    externalInstructors: JSON.stringify([]),
    inClassInstructionDurations: JSON.stringify([]),
    outOfClassInstructionDurations: JSON.stringify([]),
    supportFactors: JSON.stringify([{ sup_supportByAdmin: '', sup_supportBySchoolBoard: '', sup_supportByOthers: '', sup_supportByDescription: '', sup_supportByDate: '', sup_supportByDriveLink: '' }]),
    awards: JSON.stringify([]),
    classroomVideos: JSON.stringify([]),
    performanceVideos: JSON.stringify([]),
    
    instrumentSufficiency: 'true',
    instrumentINSufficiency: 'false',
    DCP_PR_Channel_FACEBOOK: 'false',
    DCP_PR_Channel_YOUTUBE: 'false',
    DCP_PR_Channel_Tiktok: 'false',
    heardFromOther: 'false',
    certifiedINFOByAdminName: 'true',
  };

  // Create FormData
  const formData = new FormData();
  
  // Add all text fields
  Object.entries(testData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // Add manager image
  const managerImagePath = path.resolve(__dirname, '../e2e/test-assets/manager.jpg');
  if (fs.existsSync(managerImagePath)) {
    const managerImage = fs.createReadStream(managerImagePath);
    formData.append('mgtImage', managerImage, 'manager.jpg');
    console.log('✅ Added manager image: manager.jpg');
  } else {
    console.log('❌ Manager image not found');
  }

  // Add teacher images
  const teacher1ImagePath = path.resolve(__dirname, '../e2e/test-assets/teacher1.jpg');
  if (fs.existsSync(teacher1ImagePath)) {
    const teacher1Image = fs.createReadStream(teacher1ImagePath);
    formData.append('teacherImage_0', teacher1Image, 'teacher1.jpg');
    console.log('✅ Added teacher 1 image: teacher1.jpg');
  }

  const teacher2ImagePath = path.resolve(__dirname, '../e2e/test-assets/teacher2.jpg');
  if (fs.existsSync(teacher2ImagePath)) {
    const teacher2Image = fs.createReadStream(teacher2ImagePath);
    formData.append('teacherImage_1', teacher2Image, 'teacher2.jpg');
    console.log('✅ Added teacher 2 image: teacher2.jpg');
  }

  console.log('\n📤 Sending request to API...');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData as any,
    });

    const result = await response.json();

    console.log('\n📊 Response:');
    console.log('  Status:', response.status);
    console.log('  Success:', result.success);
    
    if (result.success) {
      console.log('  Submission ID:', result.id);
      console.log('\n✅ File upload test PASSED!');
      console.log('\n🔍 Check the database with:');
      console.log('  npx ts-node scripts/check-submissions.ts');
      console.log('\n📁 Check uploaded files in:');
      console.log('  web/public/uploads/');
    } else {
      console.log('  Error:', result.message);
      console.log('\n❌ File upload test FAILED!');
    }
  } catch (error) {
    console.error('\n❌ Error during test:', error);
  }
}

testFileUpload()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
