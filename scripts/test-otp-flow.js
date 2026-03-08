#!/usr/bin/env node

/**
 * Test OTP verification flow
 */

async function testOTPFlow() {
  const token = '0624bee7-d1d7-46e9-8480-66b075717bb2';
  console.log('🧪 Testing OTP flow for token:', token);
  
  try {
    // Step 1: Request OTP
    console.log('\n📤 Step 1: Requesting OTP...');
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
    console.log('Expires At:', otpResult.expiresAt);
    
    if (otpResult.success) {
      console.log('\n✅ SUCCESS: OTP requested successfully');
      console.log('📧 Check email for OTP code');
      
      // Step 2: Test draft access (should work now)
      console.log('\n🔍 Step 2: Testing draft access...');
      const draftResponse = await fetch(`http://localhost:3000/api/draft/${token}`);
      const draftResult = await draftResponse.json();
      
      console.log('Draft Access Response:');
      console.log('Status:', draftResponse.status);
      console.log('Success:', draftResult.success);
      console.log('Email:', draftResult.email);
      console.log('Has Form Data:', !!draftResult.formData);
      
      if (draftResult.success && draftResult.formData) {
        console.log('\n✅ SUCCESS: Draft access working!');
        console.log('Form Data Keys:', Object.keys(draftResult.formData));
        console.log('Support Type:', draftResult.formData.supportType);
        console.log('Support Type Title:', draftResult.formData.supportTypeTitle);
      } else {
        console.log('\n❌ ISSUE: Draft access not returning form data');
      }
      
    } else {
      console.log('\n❌ FAILED: OTP request failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOTPFlow();