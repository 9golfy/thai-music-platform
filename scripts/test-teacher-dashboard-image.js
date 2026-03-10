#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://18.138.63.84:3000';
const teacherDashboardPath = '/teacher/dashboard/register100/69b02bfe9436e8186f6e41a8';

console.log(`🔍 Testing teacher dashboard page: ${BASE_URL}${teacherDashboardPath}`);

const request = http.get(`${BASE_URL}${teacherDashboardPath}`, (response) => {
  console.log(`📊 Status: ${response.statusCode}`);
  console.log(`📋 Content-Type: ${response.headers['content-type']}`);
  
  let data = '';
  response.on('data', chunk => data += chunk);
  response.on('end', () => {
    if (response.statusCode === 200) {
      console.log(`✅ Page loaded successfully`);
      
      // Check if the page contains the old /uploads/ path
      const hasOldPath = data.includes('/uploads/mgt_1773153278547_manager.jpg');
      const hasNewPath = data.includes('/api/uploads/mgt_1773153278547_manager.jpg');
      
      console.log(`🔍 Contains old path (/uploads/): ${hasOldPath ? '❌ YES' : '✅ NO'}`);
      console.log(`🔍 Contains new path (/api/uploads/): ${hasNewPath ? '✅ YES' : '❌ NO'}`);
      
      if (hasOldPath) {
        console.log('\n⚠️  The page still contains old image paths. This suggests:');
        console.log('   1. The component changes may not be deployed yet');
        console.log('   2. Browser cache needs to be cleared');
        console.log('   3. The build needs to be refreshed');
      }
      
      if (hasNewPath) {
        console.log('\n✅ The page contains correct API paths!');
      }
      
    } else {
      console.log(`❌ FAILED: Status ${response.statusCode}`);
      if (data.length < 500) {
        console.log(`Response: ${data}`);
      }
    }
  });
});

request.on('error', (error) => {
  console.log(`❌ ERROR: ${error.message}`);
});

request.setTimeout(10000, () => {
  console.log(`⏰ TIMEOUT`);
  request.destroy();
});