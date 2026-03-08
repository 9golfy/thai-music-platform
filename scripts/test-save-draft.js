#!/usr/bin/env node

/**
 * Test save draft functionality
 */

async function testSaveDraft() {
  console.log('🧪 Testing save draft functionality...\n');
  
  const testData = {
    email: 'test@example.com',
    phone: '0123456789',
    submissionType: 'register-support',
    currentStep: 1,
    formData: {
      supportType: 'ชุมนุม',
      supportTypeTitle: 'ชื่อชุมนุมทดสอบ',
      supportTypeClubName: 'ชื่อชุมนุมทดสอบ',
      supportTypeMemberCount: '25',
      schoolName: 'โรงเรียนทดสอบ',
      schoolProvince: 'กรุงเทพมหานคร',
      schoolLevel: 'มัธยมศึกษา'
    }
  };
  
  try {
    console.log('📤 Sending save draft request...');
    const response = await fetch('http://localhost:3000/api/draft/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    console.log('📋 Save Draft Response:');
    console.log('Status:', response.status);
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    console.log('Draft Token:', result.draftToken);
    console.log('Email Sent:', result.emailSent);
    
    if (result.success && result.draftToken) {
      console.log('\n✅ SUCCESS: Draft saved with token:', result.draftToken);
      
      // Test token retrieval
      console.log('\n🔍 Testing token retrieval...');
      const tokenResponse = await fetch(`http://localhost:3000/api/draft/${result.draftToken}`);
      const tokenResult = await tokenResponse.json();
      
      console.log('Token API Response:');
      console.log('Status:', tokenResponse.status);
      console.log('Success:', tokenResult.success);
      console.log('Exists:', tokenResult.exists);
      console.log('Email:', tokenResult.email);
      console.log('Submission Type:', tokenResult.submissionType);
      
      if (tokenResult.success) {
        console.log('\n✅ SUCCESS: Token retrieval working!');
      } else {
        console.log('\n❌ FAILED: Token retrieval failed');
      }
    } else {
      console.log('\n❌ FAILED: Draft save failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSaveDraft();