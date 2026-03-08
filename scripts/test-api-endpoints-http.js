const fetch = require('node-fetch');

async function testAPIEndpoints() {
  console.log('=== Testing HTTP API Endpoints ===\n');
  
  const baseUrl = 'http://localhost:3000';
  
  const endpoints = [
    '/api/register100/list',
    '/api/register-support/list', 
    '/api/certificates',
    '/api/register100/69ace7425d451baf6766d1fb'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await fetch(`${baseUrl}${endpoint}`);
      const status = response.status;
      const data = await response.json();
      
      console.log(`  Status: ${status}`);
      console.log(`  Success: ${data.success}`);
      
      if (endpoint.includes('/list')) {
        console.log(`  Count: ${data.count || 0}`);
        console.log(`  Submissions: ${data.submissions?.length || 0}`);
      } else if (endpoint.includes('/certificates')) {
        console.log(`  Certificates: ${data.certificates?.length || 0}`);
      } else if (endpoint.includes('/69ace7425d451baf6766d1fb')) {
        console.log(`  Found: ${!!data.submission}`);
        console.log(`  School: ${data.submission?.reg100_schoolName || data.submission?.schoolName || 'N/A'}`);
      }
      
      console.log('');
    } catch (error) {
      console.log(`  ERROR: ${error.message}\n`);
    }
  }
}

testAPIEndpoints().catch(console.error);