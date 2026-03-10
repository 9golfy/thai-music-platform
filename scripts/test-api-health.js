#!/usr/bin/env node

/**
 * Test API Health
 * 
 * This script tests if the API is responding correctly
 */

const http = require('http');

const BASE_URL = 'http://18.138.63.84:3000';

async function testEndpoint(path) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    console.log(`🔍 Testing: ${url}`);
    
    const request = http.get(url, (response) => {
      const { statusCode, headers } = response;
      
      console.log(`📊 Status: ${statusCode}`);
      console.log(`📋 Content-Type: ${headers['content-type']}`);
      
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        if (data.length < 200) {
          console.log(`📄 Response: ${data}`);
        } else {
          console.log(`📄 Response length: ${data.length} chars`);
        }
        resolve({ statusCode, data });
      });
    });
    
    request.on('error', (error) => {
      console.log(`❌ ERROR: ${error.message}`);
      resolve({ error: error.message });
    });
    
    request.setTimeout(5000, () => {
      console.log(`⏰ TIMEOUT`);
      request.destroy();
      resolve({ error: 'timeout' });
    });
  });
}

async function runTests() {
  console.log('🧪 Testing API Health...\n');
  
  // Test health endpoint
  console.log('1️⃣ Testing health endpoint:');
  await testEndpoint('/api/health');
  console.log('');
  
  // Test a specific image
  console.log('2️⃣ Testing image API:');
  await testEndpoint('/api/uploads/mgt_1773072711344_manager.jpg');
  console.log('');
  
  // Test root
  console.log('3️⃣ Testing root:');
  await testEndpoint('/');
  console.log('');
}

runTests().catch(console.error);