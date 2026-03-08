#!/usr/bin/env node

/**
 * Test OTP email sending
 */

async function testOTPEmailSending() {
  const token = '6dd31052-6114-473d-a50e-2128a4933a52';
  
  console.log('📧 Testing OTP email sending...');
  console.log('Token:', token);
  
  try {
    // Request OTP (this should now send actual email)
    const otpResponse = await fetch(`http://localhost:3000/api/draft/${token}/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    const otpResult = await otpResponse.json();
    
    console.log('\n🔐 OTP Request Result:');
    console.log('=====================================');
    console.log('Status:', otpResponse.status);
    console.log('Success:', otpResult.success);
    console.log('Message:', otpResult.message);
    
    if (otpResult.success) {
      console.log('Expires at:', otpResult.expiresAt);
      console.log('Remaining requests:', otpResult.remainingRequests);
      
      console.log('\n✅ OTP Request Successful!');
      console.log('📧 Email should be sent to: 9golfy@gmail.com');
      console.log('🔍 Check server logs for email sending details');
      console.log('📬 Check email inbox (including spam folder)');
      
      // Wait a moment and check server logs
      console.log('\n⏳ Waiting 3 seconds to check server response...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } else {
      console.log('\n❌ OTP Request Failed');
      console.log('Error:', otpResult.message);
      
      if (otpResponse.status === 429) {
        console.log('🚫 Rate limited - need to clear rate limit first');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOTPEmailSending();