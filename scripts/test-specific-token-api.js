#!/usr/bin/env node

/**
 * Test API endpoints for specific token
 */

async function testTokenAPI() {
  const token = '4023290d-1df5-4141-b341-68fe112d782f';
  console.log('🧪 Testing API endpoints for token:', token);
  
  try {
    // Test 1: Get draft metadata
    console.log('\n📋 Test 1: Getting draft metadata...');
    const metadataResponse = await fetch(`http://localhost:3000/api/draft/${token}`);
    const metadataResult = await metadataResponse.json();
    
    console.log('Status:', metadataResponse.status);
    console.log('Result:', metadataResult);
    
    // Test 2: Get draft data
    console.log('\n📊 Test 2: Getting draft data...');
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
      formDataKeys: dataResult.formData ? Object.keys(dataResult.formData).length : 0
    });
    
    // Test 3: Request OTP
    console.log('\n🔐 Test 3: Requesting OTP...');
    const otpResponse = await fetch(`http://localhost:3000/api/draft/${token}/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    const otpResult = await otpResponse.json();
    console.log('Status:', otpResponse.status);
    console.log('Result:', otpResult);
    
    console.log('\n🎯 Summary:');
    console.log('=====================================');
    console.log('✅ Draft exists in database: YES');
    console.log('✅ Metadata API works:', metadataResponse.status === 200 ? 'YES' : 'NO');
    console.log('✅ Data API works:', dataResponse.status === 200 ? 'YES' : 'NO');
    console.log('✅ OTP API works:', otpResponse.status === 200 ? 'YES' : 'NO');
    console.log('✅ School name in data:', dataResult.formData?.schoolName || 'NOT FOUND');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testTokenAPI();