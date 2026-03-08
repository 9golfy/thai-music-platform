#!/usr/bin/env node

/**
 * Test number input fix - ensure fields can be cleared and typed properly
 */

async function testNumberInputFix() {
  console.log('🧪 Testing number input fix...\n');
  
  // Test Case 1: Clear member count and set new value
  console.log('📋 Test Case 1: Clear and set member count');
  
  const testData1 = {
    email: 'test-number@example.com',
    phone: '0123456789',
    submissionType: 'register-support',
    currentStep: 1,
    formData: {
      supportType: 'ชุมนุม',
      supportTypeClubName: 'ชุมนุมทดสอบ',
      supportTypeMemberCount: '', // Start with empty string
      schoolName: 'โรงเรียนทดสอบ',
      schoolProvince: 'กรุงเทพมหานคร',
      schoolLevel: 'มัธยมศึกษา'
    }
  };
  
  // Save with empty member count
  const response1 = await fetch('http://localhost:3000/api/draft/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData1)
  });
  
  const result1 = await response1.json();
  
  if (result1.success) {
    console.log('✅ Saved draft with empty member count');
    
    // Now update with actual number
    testData1.formData.supportTypeMemberCount = '25';
    
    const response2 = await fetch('http://localhost:3000/api/draft/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData1)
    });
    
    const result2 = await response2.json();
    
    if (result2.success) {
      console.log('✅ Updated draft with member count: 25');
      
      // Retrieve and verify
      const retrieveResponse = await fetch(`http://localhost:3000/api/draft/${result2.draftToken}`);
      const retrieveResult = await retrieveResponse.json();
      
      if (retrieveResult.success) {
        const memberCount = retrieveResult.formData.supportTypeMemberCount;
        console.log('🔍 Retrieved member count:', memberCount, '(type:', typeof memberCount, ')');
        
        if (memberCount === '25' || memberCount === 25) {
          console.log('✅ Test Case 1 PASSED: Member count saved correctly');
        } else {
          console.log('❌ Test Case 1 FAILED: Member count incorrect');
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test Case 2: Switch support types and verify member count handling
  console.log('📋 Test Case 2: Switch to สถานศึกษา (should clear member count)');
  
  const testData2 = {
    email: 'test-switch@example.com',
    phone: '0987654321',
    submissionType: 'register-support',
    currentStep: 1,
    formData: {
      supportType: 'สถานศึกษา',
      supportTypeSchoolName: 'โรงเรียนทดสอบ',
      supportTypeMemberCount: '', // Should be empty for สถานศึกษา
      schoolName: 'โรงเรียนผู้สมัคร',
      schoolProvince: 'นครปฐม',
      schoolLevel: 'มัธยมศึกษา'
    }
  };
  
  const response3 = await fetch('http://localhost:3000/api/draft/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData2)
  });
  
  const result3 = await response3.json();
  
  if (result3.success) {
    console.log('✅ Saved draft for สถานศึกษา');
    
    // Retrieve and verify
    const retrieveResponse = await fetch(`http://localhost:3000/api/draft/${result3.draftToken}`);
    const retrieveResult = await retrieveResponse.json();
    
    if (retrieveResult.success) {
      const memberCount = retrieveResult.formData.supportTypeMemberCount;
      console.log('🔍 Retrieved member count for สถานศึกษา:', memberCount, '(type:', typeof memberCount, ')');
      
      if (memberCount === '' || memberCount === null || memberCount === undefined) {
        console.log('✅ Test Case 2 PASSED: Member count is empty for สถานศึกษา');
      } else {
        console.log('❌ Test Case 2 FAILED: Member count should be empty for สถานศึกษา');
      }
    }
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test Case 3: Test phone number handling
  console.log('📋 Test Case 3: Phone number handling');
  
  const testData3 = {
    email: 'test-phone@example.com',
    phone: '0812345678',
    submissionType: 'register-support',
    currentStep: 1,
    formData: {
      supportType: 'ชุมนุม',
      supportTypeClubName: 'ชุมนุมทดสอบ',
      supportTypeMemberCount: '30',
      phone: '0812345678',
      fax: '021234567',
      schoolName: 'โรงเรียนทดสอบ',
      schoolProvince: 'กรุงเทพมหานคร',
      schoolLevel: 'มัธยมศึกษา'
    }
  };
  
  const response4 = await fetch('http://localhost:3000/api/draft/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData3)
  });
  
  const result4 = await response4.json();
  
  if (result4.success) {
    console.log('✅ Saved draft with phone/fax numbers');
    
    // Retrieve and verify
    const retrieveResponse = await fetch(`http://localhost:3000/api/draft/${result4.draftToken}`);
    const retrieveResult = await retrieveResponse.json();
    
    if (retrieveResult.success) {
      const phone = retrieveResult.formData.phone;
      const fax = retrieveResult.formData.fax;
      
      console.log('🔍 Retrieved phone:', phone, '(type:', typeof phone, ')');
      console.log('🔍 Retrieved fax:', fax, '(type:', typeof fax, ')');
      
      if (phone === '0812345678' && fax === '021234567') {
        console.log('✅ Test Case 3 PASSED: Phone/fax numbers saved correctly');
      } else {
        console.log('❌ Test Case 3 FAILED: Phone/fax numbers incorrect');
      }
    }
  }
  
  console.log('\n🎯 Number input fix tests completed!');
}

testNumberInputFix().catch(console.error);