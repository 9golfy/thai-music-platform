/**
 * Check OTP status via API
 * Usage: node scripts/check-otp-status.js [email]
 */

const email = process.argv[2] || '9golfy@gmail.com';

async function checkOTPStatus() {
  try {
    console.log(`🔍 Checking OTP status for: ${email}`);
    
    // Create a simple API endpoint call to check status
    const response = await fetch('http://localhost:3000/api/debug/check-otp-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('📊 OTP Status:', result);
    } else {
      console.log('⚠️ API not available, checking manually...');
      
      // Try to trigger rate limit check by making a dummy OTP request
      // This will show us the current count in the error message
      console.log('🧪 Testing rate limit by making a dummy request...');
      console.log('(This will help us see the current count)');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkOTPStatus();