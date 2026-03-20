/**
 * Test Admin Login API
 * 
 * Tests the /api/auth/admin-login endpoint
 * 
 * Usage: node scripts/test-admin-login.js
 */

async function testAdminLogin() {
  console.log('🧪 Testing Admin Login API...\n');
  
  const apiUrl = 'http://localhost:3000/api/auth/admin-login';
  const credentials = {
    email: 'root@thaimusic.com',
    password: 'admin123'
  };
  
  console.log('📍 API URL:', apiUrl);
  console.log('📧 Email:', credentials.email);
  console.log('🔑 Password:', credentials.password);
  console.log('');
  
  try {
    console.log('📤 Sending POST request...');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    console.log('📥 Response status:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('📦 Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Login successful!');
      if (data.user) {
        console.log('👤 User info:');
        console.log('   Email:', data.user.email);
        console.log('   Role:', data.user.role);
        console.log('   Name:', data.user.firstName, data.user.lastName);
      }
    } else {
      console.log('\n❌ Login failed!');
      console.log('   Message:', data.message);
      if (data.error) {
        console.log('   Error:', data.error);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.cause) {
      console.error('   Cause:', error.cause);
    }
  }
}

// Run test
testAdminLogin().catch(console.error);
