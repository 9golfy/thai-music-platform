#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://18.138.63.84:3000';
const imagePath = '/api/uploads/mgt_1773153278547_manager.jpg';

console.log(`🔍 Testing specific image: ${BASE_URL}${imagePath}`);

const request = http.get(`${BASE_URL}${imagePath}`, (response) => {
  console.log(`📊 Status: ${response.statusCode}`);
  console.log(`📋 Headers:`, response.headers);
  
  let data = '';
  response.on('data', chunk => data += chunk);
  response.on('end', () => {
    if (response.statusCode === 200) {
      console.log(`✅ SUCCESS: Image found, size: ${data.length} bytes`);
    } else {
      console.log(`❌ FAILED: ${data}`);
      console.log('\n🔍 Let me check what files are available in container...');
    }
  });
});

request.on('error', (error) => {
  console.log(`❌ ERROR: ${error.message}`);
});

request.setTimeout(5000, () => {
  console.log(`⏰ TIMEOUT`);
  request.destroy();
});