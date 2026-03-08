#!/usr/bin/env node

/**
 * Test complete save draft and restore flow
 */

async function testCompleteFlow() {
  console.log('🧪 Testing complete save draft and restore flow...\n');
  
  // Step 1: Clear all existing drafts
  console.log('🗑️  Step 1: Clearing existing drafts...');
  try {
    const clearResponse = await fetch('http://localhost:3000/api/debug/clear-storage', {
      method: 'POST'
    });
    const clearResult = await clearResponse.json();
    console.log('Clear result:', clearResult.success ? '✅ Success' : '❌ Failed');
  } catch (error) {
    console.log('Clear failed (might not exist):', error.message);
  }
  
  // Step 2: Save a new draft with proper field separation
  console.log('\n📤 Step 2: Saving new draft with separated fields...');
  const testData = {
    email: 'test-flow@example.com',
    phone: '0987654321',
    submissionType: 'register-support',
    currentStep: 1,
    formData: {
      // Support type selection
      supportType: 'ชุมนุม',
      
      // Separated support type fields
      supportTypeSchoolName: '',           // Empty - not selected
      supportTypeClubName: 'ชุมนุมดนตรีไทยโรงเรียนทดสอบ',  // This should be the active one
      supportTypeAssociationName: '',      // Empty - not selected
      supportTypeGroupName: '',            // Empty - not selected
      supportTypeBandName: '',             // Empty - not selected
      
      // Legacy field for backward compatibility
      supportTypeTitle: 'ชุมนุมดนตรีไทยโรงเรียนทดสอบ',
      
      // Member count
      supportTypeMemberCount: '35',
      
      // Basic info
      schoolName: 'โรงเรียนทดสอบการไหล',
      schoolProvince: 'กรุงเทพมหานคร',
      schoolLevel: 'มัธยมศึกษา',
      affiliation: 'โรงเรียนสาธิต'
    }
  };
  
  const saveResponse = await fetch('http://localhost:3000/api/draft/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData)
  });
  
  const saveResult = await saveResponse.json();
  
  console.log('Save Response:');
  console.log('Status:', saveResponse.status);
  console.log('Success:', saveResult.success);
  console.log('Token:', saveResult.draftToken);
  console.log('Email Sent:', saveResult.emailSent);
  
  if (!saveResult.success || !saveResult.draftToken) {
    console.log('❌ FAILED: Could not save draft');
    return;
  }
  
  const token = saveResult.draftToken;
  console.log('\n✅ SUCCESS: Draft saved with token:', token);
  
  // Step 3: Test token retrieval
  console.log('\n🔍 Step 3: Testing token retrieval...');
  const tokenResponse = await fetch(`http://localhost:3000/api/draft/${token}`);
  const tokenResult = await tokenResponse.json();
  
  console.log('Token Retrieval Response:');
  console.log('Status:', tokenResponse.status);
  console.log('Success:', tokenResult.success);
  console.log('Email:', tokenResult.email);
  console.log('Support Type:', tokenResult.formData?.supportType);
  console.log('Support Type Title:', tokenResult.formData?.supportTypeTitle);
  console.log('Support Type Club Name:', tokenResult.formData?.supportTypeClubName);
  console.log('School Name:', tokenResult.formData?.schoolName);
  
  if (!tokenResult.success) {
    console.log('❌ FAILED: Could not retrieve draft');
    return;
  }
  
  console.log('\n✅ SUCCESS: Token retrieval working');
  
  // Step 4: Request OTP
  console.log('\n📧 Step 4: Requesting OTP...');
  const otpResponse = await fetch(`http://localhost:3000/api/draft/${token}/request-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  const otpResult = await otpResponse.json();
  
  console.log('OTP Request Response:');
  console.log('Status:', otpResponse.status);
  console.log('Success:', otpResult.success);
  console.log('Message:', otpResult.message);
  
  if (!otpResult.success) {
    console.log('❌ FAILED: Could not request OTP');
    return;
  }
  
  console.log('\n✅ SUCCESS: OTP requested successfully');
  
  // Step 5: Verify field mapping is correct
  console.log('\n🎯 Step 5: Verifying field mapping...');
  
  const expectedMappings = {
    supportType: 'ชุมนุม',
    supportTypeTitle: 'ชุมนุมดนตรีไทยโรงเรียนทดสอบ',
    supportTypeClubName: 'ชุมนุมดนตรีไทยโรงเรียนทดสอบ',
    supportTypeSchoolName: '',
    supportTypeAssociationName: '',
    supportTypeGroupName: '',
    supportTypeBandName: '',
    supportTypeMemberCount: '35',
    schoolName: 'โรงเรียนทดสอบการไหล'
  };
  
  let allCorrect = true;
  
  for (const [field, expectedValue] of Object.entries(expectedMappings)) {
    const actualValue = tokenResult.formData?.[field];
    const isCorrect = actualValue === expectedValue;
    
    console.log(`   ${field}: ${isCorrect ? '✅' : '❌'} Expected: "${expectedValue}", Got: "${actualValue}"`);
    
    if (!isCorrect) {
      allCorrect = false;
    }
  }
  
  if (allCorrect) {
    console.log('\n🎉 SUCCESS: All field mappings are correct!');
    console.log('\n📋 Summary:');
    console.log('✅ Draft save: Working');
    console.log('✅ Token generation: Working');
    console.log('✅ Token retrieval: Working');
    console.log('✅ OTP request: Working');
    console.log('✅ Field separation: Working');
    console.log('✅ Data integrity: Working');
    console.log('\n🚀 The save draft feature is fully functional!');
  } else {
    console.log('\n❌ FAILED: Some field mappings are incorrect');
  }
}

testCompleteFlow().catch(console.error);