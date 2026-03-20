async function testProductionAPI() {
  console.log('🔍 Testing Production API directly...\n');
  
  const baseUrl = 'http://18.138.63.84:3000';
  
  try {
    // Test 1: Check if API endpoint is accessible
    console.log('1. Testing API endpoint accessibility...');
    const healthResponse = await fetch(`${baseUrl}/api/register100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`   Status: ${healthResponse.status}`);
    
    // Test 2: Try a simple POST request to see what happens
    console.log('\n2. Testing POST request to register100 API...');
    
    const testData = new URLSearchParams({
      teacherEmail: 'test-api@example.com',
      teacherPhone: '0899999999',
      reg100_schoolName: 'API Test School',
      reg100_schoolProvince: 'กรุงเทพมหานคร',
      reg100_schoolLevel: 'มัธยมศึกษา',
      reg100_affiliation: 'กระทรวงศึกษาธิการ (Ministry of Education)',
      reg100_staffCount: '100',
      reg100_studentCount: '1000'
    });
    
    const postResponse = await fetch(`${baseUrl}/api/register100`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: testData
    });
    
    console.log(`   POST Status: ${postResponse.status}`);
    
    const responseText = await postResponse.text();
    console.log(`   Response: ${responseText}`);
    
  } catch (error) {
    console.error('❌ Error testing production API:', error.message);
  }
}

// Also test if we can reach the production server at all
async function testProductionServer() {
  console.log('\n🌐 Testing Production Server connectivity...\n');
  
  try {
    const response = await fetch('http://18.138.63.84:3000/', {
      method: 'GET',
      timeout: 10000
    });
    
    console.log(`Server Status: ${response.status}`);
    console.log(`Server Headers: ${JSON.stringify(Object.fromEntries(response.headers))}`);
    
    if (response.ok) {
      console.log('✅ Production server is accessible');
    } else {
      console.log('⚠️ Production server returned non-200 status');
    }
    
  } catch (error) {
    console.error('❌ Cannot reach production server:', error.message);
  }
}

async function main() {
  await testProductionServer();
  await testProductionAPI();
}

main();