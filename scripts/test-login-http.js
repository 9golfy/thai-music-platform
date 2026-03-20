const https = require('http');

async function testLoginHTTP() {
  console.log('🌐 Testing Admin Login via HTTP...\n');
  
  const loginData = JSON.stringify({
    email: 'root@thaimusic.com',
    password: 'P@sswordAdmin123'
  });
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/admin-login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };
  
  console.log('📋 Request Details:');
  console.log(`   URL: http://localhost:3000/api/auth/admin-login`);
  console.log(`   Method: POST`);
  console.log(`   Body: ${loginData}`);
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`\n📡 Response Status: ${res.statusCode}`);
      console.log(`📡 Response Headers:`, res.headers);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`\n📄 Response Body:`);
        try {
          const jsonData = JSON.parse(data);
          console.log(JSON.stringify(jsonData, null, 2));
          
          if (res.statusCode === 200 && jsonData.success) {
            console.log('\n🎉 LOGIN SUCCESS!');
            console.log('   ✅ API returned 200 OK');
            console.log('   ✅ Response indicates success');
            console.log('   ✅ Session should be created');
          } else {
            console.log('\n❌ LOGIN FAILED!');
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Success: ${jsonData.success}`);
            console.log(`   Message: ${jsonData.message}`);
            if (jsonData.error) {
              console.log(`   Error: ${jsonData.error}`);
            }
          }
        } catch (error) {
          console.log('Raw response:', data);
          console.log('Parse error:', error.message);
        }
        
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request Error:', error.message);
      console.log('\n💡 Possible issues:');
      console.log('   • Dev server not running on port 3000');
      console.log('   • API endpoint not available');
      console.log('   • Network connectivity issue');
      reject(error);
    });
    
    req.write(loginData);
    req.end();
  });
}

// Run the test
testLoginHTTP().catch(console.error);