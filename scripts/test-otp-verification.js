#!/usr/bin/env node

/**
 * Test OTP verification
 */

async function testOTPVerification() {
  const token = '2434dcd5-e303-4c4a-b333-07aebe2b6380';
  const otp = '241120';
  
  console.log('🧪 Testing OTP verification...');
  console.log('Token:', token);
  console.log('OTP:', otp);
  
  try {
    // Verify OTP
    const verifyResponse = await fetch(`http://localhost:3000/api/draft/${token}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp }),
    });
    
    const verifyResult = await verifyResponse.json();
    
    console.log('\n🔐 OTP Verification Result:');
    console.log('=====================================');
    console.log('Status:', verifyResponse.status);
    console.log('Success:', verifyResult.success);
    console.log('Message:', verifyResult.message);
    
    if (verifyResult.success) {
      console.log('\n✅ OTP Verification Successful!');
      console.log('🎯 Next steps:');
      console.log('1. Go to: http://localhost:3000/regist-support?token=' + token);
      console.log('2. Form should auto-populate with:');
      console.log('   - Radio "สถานศึกษา" selected');
      console.log('   - "ระบุชื่อสถานศึกษา" field: VVVVVVVVVVVVVVVVVVVVVVVV');
      console.log('   - "ชื่อสถานศึกษา" field: VVVVVVVVVVVVVVVVVVVVVVVV');
      console.log('   - Other radio button fields should be empty');
    } else {
      console.log('\n❌ OTP Verification Failed');
      if (verifyResult.message) {
        console.log('Error:', verifyResult.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOTPVerification();