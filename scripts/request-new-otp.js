#!/usr/bin/env node

/**
 * Request new OTP
 */

async function requestNewOTP() {
  const token = '2434dcd5-e303-4c4a-b333-07aebe2b6380';
  
  console.log('🔐 Requesting new OTP for token:', token);
  
  try {
    // Request OTP
    const otpResponse = await fetch(`http://localhost:3000/api/draft/${token}/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    const otpResult = await otpResponse.json();
    
    console.log('\n📧 OTP Request Result:');
    console.log('=====================================');
    console.log('Status:', otpResponse.status);
    console.log('Success:', otpResult.success);
    console.log('Message:', otpResult.message);
    
    if (otpResult.success) {
      console.log('Expires at:', otpResult.expiresAt);
      console.log('Remaining requests:', otpResult.remainingRequests);
      
      console.log('\n✅ New OTP sent to email!');
      console.log('🎯 Next steps:');
      console.log('1. Check email: 9golfy@gmail.com');
      console.log('2. Get the 6-digit OTP code');
      console.log('3. Go to: http://localhost:3000/draft/' + token);
      console.log('4. Enter the OTP');
      console.log('5. Form should auto-populate correctly');
    } else {
      console.log('\n❌ OTP Request Failed');
      if (otpResult.message) {
        console.log('Error:', otpResult.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

requestNewOTP();