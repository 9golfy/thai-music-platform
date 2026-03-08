#!/usr/bin/env node

/**
 * Test latest token (new)
 */

async function testLatestTokenNew() {
  const token = '6dd31052-6114-473d-a50e-2128a4933a52';
  console.log('🧪 Testing latest token (new):', token);
  
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
      supportType: dataResult.formData?.supportType,
      schoolName: dataResult.formData?.schoolName,
      supportTypeName: dataResult.formData?.supportTypeName,
      formDataKeys: dataResult.formData ? Object.keys(dataResult.formData).length : 0
    });
    
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
    console.log('✅ Support type:', dataResult.formData?.supportType);
    console.log('✅ School name found:', dataResult.formData?.schoolName ? 'YES' : 'NO');
    console.log('✅ School name value:', `"${dataResult.formData?.schoolName}"`);
    console.log('✅ Support type name:', `"${dataResult.formData?.supportTypeName}"`);
    console.log('✅ OTP can be requested:', otpResponse.status === 200 ? 'YES' : 'NO');
    
    if (otpResponse.status === 200) {
      console.log('\n🔗 Test this URL:');
      console.log(`http://localhost:3000/draft/${token}`);
      console.log('📧 Check email for new OTP');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLatestTokenNew();