/**
 * Test script for draft save API
 * Tests the complete flow: save draft -> send email
 */

const API_URL = 'http://localhost:3000/api/draft/save';

const testData = {
  email: '9golfy@gmail.com',
  phone: '0899297983',
  submissionType: 'register100',
  currentStep: 1,
  formData: {
    step1: {
      schoolName: 'โรงเรียนทดสอบ',
      province: 'กรุงเทพมหานคร',
      district: 'บางกอกใหญ่',
    },
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    step6: {},
    step7: {},
    step8: {},
  },
};

async function testDraftSave() {
  console.log('🧪 Testing Draft Save API...\n');
  console.log('📧 Email:', testData.email);
  console.log('📱 Phone:', testData.phone);
  console.log('📝 Submission Type:', testData.submissionType);
  console.log('📍 Current Step:', testData.currentStep);
  console.log('\n🚀 Sending request to:', API_URL);
  console.log('─'.repeat(60));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('\n📊 Response Status:', response.status, response.statusText);
    
    const data = await response.json();
    
    console.log('\n📦 Response Data:');
    console.log(JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ SUCCESS!');
      console.log('🎫 Draft Token:', data.draftToken);
      console.log('📧 Email Sent:', data.emailSent ? 'Yes' : 'No');
      console.log('⏰ Expires At:', new Date(data.expiresAt).toLocaleString('th-TH'));
      console.log('🔗 Draft URL:', `http://localhost:3000/draft/${data.draftToken}`);
      
      if (data.emailSent) {
        console.log('\n📬 Check your email at:', testData.email);
      } else {
        console.log('\n⚠️  Email was not sent. Check server logs for errors.');
      }
    } else {
      console.log('\n❌ FAILED!');
      console.log('Error:', data.message);
    }

    console.log('\n' + '─'.repeat(60));
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nMake sure:');
    console.error('1. Next.js dev server is running (npm run dev)');
    console.error('2. MongoDB is running (docker-compose up -d)');
    console.error('3. Environment variables are set in .env.local');
  }
}

// Run the test
testDraftSave();
