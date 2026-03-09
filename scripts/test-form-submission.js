// Test form submission directly to API
require('dotenv').config();

async function testFormSubmission() {
  console.log('🧪 Testing form submission to API...\n');

  const testData = {
    // Basic required fields
    reg100_schoolName: 'โรงเรียนทดสอบ API',
    reg100_schoolProvince: 'กรุงเทพมหานคร',
    reg100_schoolLevel: 'มัธยมศึกษา',
    reg100_affiliation: 'กระทรวงศึกษาธิการ (Ministry of Education)',
    reg100_staffCount: '50',
    reg100_studentCount: '500',
    
    // Manager info
    reg100_mgtFullName: 'ผู้อำนวยการทดสอบ',
    reg100_mgtPosition: 'ผู้อำนวยการ',
    reg100_mgtPhone: '0812345678',
    reg100_mgtEmail: 'test@example.com',
    
    // Teacher info (required for email)
    teacherEmail: 'test-' + Date.now() + '@gmail.com',
    teacherPhone: '0899297983',
    
    // Required certification
    reg100_certifiedINFOByAdminName: 'true',
    
    // Minimal scores to pass validation
    teacher_training_score: 0,
    teacher_qualification_score: 0,
    support_from_org_score: 0,
    support_from_external_score: 0,
    award_score: 0,
    activity_within_province_internal_score: 0,
    activity_within_province_external_score: 0,
    activity_outside_province_score: 0,
    pr_activity_score: 0,
    total_score: 0
  };

  try {
    console.log('📤 Sending POST request to /api/register100...');
    
    const formData = new FormData();
    
    // Add all data to FormData
    Object.entries(testData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const response = await fetch('http://localhost:3000/api/register100', {
      method: 'POST',
      body: formData,
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('📊 Response body:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('\n✅ Form submission successful!');
      console.log('🆔 Submission ID:', result.id);
      console.log('🏫 School ID:', result.schoolId);
      console.log('📧 Email sent:', result.emailSent);
      
      if (result.emailSent) {
        console.log('✅ Email was sent successfully');
      } else {
        console.log('⚠️ Email was not sent (check server logs)');
      }
    } else {
      console.log('\n❌ Form submission failed');
      console.log('Error:', result.message);
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testFormSubmission();