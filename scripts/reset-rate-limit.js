/**
 * Reset rate limiting for a specific email
 * Usage: node scripts/reset-rate-limit.js [email]
 */

const email = process.argv[2] || '9golfy@gmail.com';

async function resetRateLimit() {
  try {
    console.log(`🔄 Resetting rate limit for: ${email}`);
    
    const response = await fetch('http://localhost:3000/api/debug/reset-rate-limit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ ${result.message}`);
      console.log(`📊 Modified ${result.modifiedCount} documents`);
    } else {
      console.log(`❌ ${result.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

resetRateLimit();