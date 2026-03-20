const http = require('http');

async function testFormSubmission() {
  console.log('🚀 Testing regist100 form submission...');
  
  // Test POST to register100 API
  return new Promise((resolve, reject) => {
    const testData = JSON.stringify({
      schoolName: "Test School Production",
      schoolType: "primary",
      province: "Bangkok",
      district: "Test District",
      subDistrict: "Test SubDistrict",
      postalCode: "10100",
      phone: "0123456789",
      email: "test@example.com",
      principalName: "Test Principal",
      teacherName: "Test Teacher",
      teacherPhone: "0987654321",
      teacherEmail: "teacher@example.com"
    });

    const options = {
      hostname: '18.138.63.84',
      port: 3000,
      path: '/api/register100',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    };

    const req = http.request(options, (res) => {
      console.log(`✅ Form submission status: ${res.statusCode}`);
      console.log(`📋 Response headers:`, res.headers);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📄 Response size: ${data.length} bytes`);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('📊 API returned valid JSON response');
          console.log('🔍 Response data:', JSON.stringify(jsonData, null, 2));
        } catch (e) {
          console.log('📄 API returned non-JSON response');
          console.log('🔍 Response content:', data);
        }
        
        resolve({
          statusCode: res.statusCode,
          contentLength: data.length,
          response: data,
          headers: res.headers
        });
      });
    });

    req.on('error', (error) => {
      console.error('❌ Form submission failed:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('❌ Form submission timed out');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(testData);
    req.end();
  });
}

async function testHealthCheck() {
  console.log('\n🏥 Testing application health...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '18.138.63.84',
      port: 3000,
      path: '/',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    };

    const req = http.request(options, (res) => {
      console.log(`✅ Health check status: ${res.statusCode}`);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const isHealthy = res.statusCode === 200 && data.length > 0;
        console.log(`🏥 Application health: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);
        console.log(`📄 Home page size: ${data.length} bytes`);
        
        resolve({
          statusCode: res.statusCode,
          isHealthy,
          contentLength: data.length
        });
      });
    });

    req.on('error', (error) => {
      console.error('❌ Health check failed:', error.message);
      resolve({ error: error.message, isHealthy: false });
    });

    req.on('timeout', () => {
      console.error('❌ Health check timed out');
      req.destroy();
      resolve({ error: 'Request timeout', isHealthy: false });
    });

    req.end();
  });
}

async function runFormTests() {
  try {
    const healthResults = await testHealthCheck();
    const formResults = await testFormSubmission();
    
    console.log('\n📊 Form Test Results Summary:');
    console.log('='.repeat(50));
    console.log('Health Check:', JSON.stringify(healthResults, null, 2));
    console.log('Form Submission:', JSON.stringify(formResults, null, 2));
    
    // Summary
    console.log('\n🎯 Test Summary:');
    console.log(`- Application Health: ${healthResults.isHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
    console.log(`- Form Endpoint: ${formResults.statusCode === 200 ? '✅ WORKING' : formResults.statusCode === 405 ? '⚠️  METHOD NOT ALLOWED' : '❌ ERROR'}`);
    
  } catch (error) {
    console.error('💥 Form test execution failed:', error);
    process.exit(1);
  }
}

runFormTests();