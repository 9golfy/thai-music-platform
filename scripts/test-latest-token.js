#!/usr/bin/env node

/**
 * Test latest token API
 */

async function testLatestToken() {
  const token = '662e4f77-067a-488c-9343-50fbb93526b1';
  console.log('🧪 Testing latest token:', token);
  
  try {
    // Test draft data API
    console.log('\n📊 Testing draft data API...');
    const dataResponse = await fetch(`http://localhost:3000/api/draft/${token}/data`);
    const dataResult = await dataResponse.json();
    
    console.log('Status:', dataResponse.status);
    console.log('Result:', {
      success: dataResult.success,
      exists: dataResult.exists,
      email: dataResult.email,
      submissionType: dataResult.submissionType,
      currentStep: dataResult.currentStep,
      schoolName: dataResult.formData?.schoolName,
      schoolProvince: dataResult.formData?.schoolProvince,
      schoolLevel: dataResult.formData?.schoolLevel,
      supportType: dataResult.formData?.supportType,
      formDataKeys: dataResult.formData ? Object.keys(dataResult.formData).length : 0
    });
    
    // Test if we can access this token via URL
    console.log('\n🔗 Draft URL for testing:');
    console.log(`http://localhost:3000/draft/${token}`);
    
    // Request new OTP for this token
    console.log('\n🔐 Requesting OTP for latest token...');
    const otpResponse = await fetch(`http://localhost:3000/api/draft/${token}/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    const otpResult = await otpResponse.json();
    console.log('OTP Status:', otpResponse.status);
    console.log('OTP Result:', otpResult);
    
    console.log('\n🎯 Summary:');
    console.log('=====================================');
    console.log('✅ Latest token works:', dataResponse.status === 200 ? 'YES' : 'NO');
    console.log('✅ School name found:', dataResult.formData?.schoolName ? 'YES' : 'NO');
    console.log('✅ School name value:', `"${dataResult.formData?.schoolName}"`);
    console.log('✅ OTP can be requested:', otpResponse.status === 200 ? 'YES' : 'NO');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLatestToken();