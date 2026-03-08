#!/usr/bin/env node

/**
 * Test complete register-support draft flow
 */

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Register-Support Draft Flow...');
  
  try {
    // Step 1: Save draft
    console.log('\n📤 Step 1: Saving draft...');
    const saveResponse = await fetch('http://localhost:3000/api/draft/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'complete-test@example.com',
        phone: '0812345678',
        submissionType: 'register-support',
        formData: {
          schoolName: 'โรงเรียนทดสอบ Complete Flow',
          schoolProvince: 'กรุงเทพมหานคร',
          schoolLevel: 'มัธยมศึกษา',
          mgtFullName: 'นายผู้บริหาร Complete Test',
          mgtPosition: 'ผู้อำนวยการ',
          thaiMusicTeachers: [
            {
              fullName: 'นายครู Complete Test',
              position: 'ครูดนตรีไทย',
              phone: '0823456789',
              email: 'teacher-complete@test.com'
            }
          ]
        },
        currentStep: 3,
      }),
    });
    
    const saveResult = await saveResponse.json();
    console.log('✅ Draft saved:', {
      success: saveResult.success,
      token: saveResult.draftToken?.substring(0, 8) + '...',
      emailSent: saveResult.emailSent
    });
    
    if (!saveResult.success) {
      console.error('❌ Draft save failed');
      return;
    }
    
    const draftToken = saveResult.draftToken;
    
    // Step 2: Request OTP
    console.log('\n🔐 Step 2: Requesting OTP...');
    const otpResponse = await fetch(`http://localhost:3000/api/draft/${draftToken}/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    const otpResult = await otpResponse.json();
    console.log('✅ OTP requested:', {
      success: otpResult.success,
      expiresAt: otpResult.expiresAt
    });
    
    // Step 3: Get draft metadata (simulate accessing draft link)
    console.log('\n📋 Step 3: Getting draft metadata...');
    const metadataResponse = await fetch(`http://localhost:3000/api/draft/${draftToken}`);
    const metadataResult = await metadataResponse.json();
    
    console.log('✅ Draft metadata:', {
      exists: metadataResult.exists,
      email: metadataResult.email,
      submissionType: metadataResult.submissionType,
      currentStep: metadataResult.currentStep
    });
    
    // Step 4: Get draft data (simulate form restoration)
    console.log('\n📊 Step 4: Getting draft data for form restoration...');
    const dataResponse = await fetch(`http://localhost:3000/api/draft/${draftToken}/data`);
    const dataResult = await dataResponse.json();
    
    console.log('✅ Draft data retrieved:', {
      success: dataResult.success,
      exists: dataResult.exists,
      schoolName: dataResult.formData?.schoolName,
      mgtFullName: dataResult.formData?.mgtFullName,
      currentStep: dataResult.currentStep,
      teacherCount: dataResult.formData?.thaiMusicTeachers?.length || 0
    });
    
    // Step 5: Verify data integrity
    console.log('\n🔍 Step 5: Verifying data integrity...');
    const originalData = {
      schoolName: 'โรงเรียนทดสอบ Complete Flow',
      mgtFullName: 'นายผู้บริหาร Complete Test',
      currentStep: 3,
      teacherCount: 1
    };
    
    const retrievedData = {
      schoolName: dataResult.formData?.schoolName,
      mgtFullName: dataResult.formData?.mgtFullName,
      currentStep: dataResult.currentStep,
      teacherCount: dataResult.formData?.thaiMusicTeachers?.length || 0
    };
    
    const integrity = {
      schoolName: originalData.schoolName === retrievedData.schoolName,
      mgtFullName: originalData.mgtFullName === retrievedData.mgtFullName,
      currentStep: originalData.currentStep === retrievedData.currentStep,
      teacherCount: originalData.teacherCount === retrievedData.teacherCount
    };
    
    console.log('✅ Data integrity check:', integrity);
    
    const allIntegrityPassed = Object.values(integrity).every(Boolean);
    
    console.log('\n🎯 COMPLETE FLOW TEST RESULTS:');
    console.log('=====================================');
    console.log(`✅ Draft Save: ${saveResult.success ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Email Sent: ${saveResult.emailSent ? 'PASS' : 'FAIL'}`);
    console.log(`✅ OTP Request: ${otpResult.success ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Metadata Retrieval: ${metadataResult.exists ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Data Retrieval: ${dataResult.success ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Data Integrity: ${allIntegrityPassed ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Submission Type: ${metadataResult.submissionType === 'register-support' ? 'PASS' : 'FAIL'}`);
    
    const overallSuccess = saveResult.success && 
                          saveResult.emailSent && 
                          otpResult.success && 
                          metadataResult.exists && 
                          dataResult.success && 
                          allIntegrityPassed &&
                          metadataResult.submissionType === 'register-support';
    
    console.log('\n🏆 OVERALL RESULT:', overallSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
    
    if (overallSuccess) {
      console.log('\n🎉 Register-Support draft functionality is working perfectly!');
      console.log('🔗 Test draft URL: http://localhost:3000/draft/' + draftToken);
      console.log('📧 Check email for OTP code');
    }
    
  } catch (error) {
    console.error('❌ Complete flow test failed:', error.message);
  }
}

testCompleteFlow();