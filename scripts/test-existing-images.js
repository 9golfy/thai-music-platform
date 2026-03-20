#!/usr/bin/env node

/**
 * Test Existing Images
 * 
 * This script tests images that actually exist in the container
 */

const http = require('http');

console.log('🧪 Testing Existing Images...\n');

const baseUrl = 'http://18.138.63.84:3000';

// Test images that we know exist
const testImages = [
  'mgt_1772812576615_manager.jpg',
  'mgt_1772855646897_manager.jpg',
  'mgt_1772855946074_manager.jpg'
];

async function testImageAPI(imagePath) {
  return new Promise((resolve) => {
    const url = `${baseUrl}/api/uploads/${imagePath}`;
    console.log(`🔍 Testing: ${url}`);
    
    const request = http.get(url, (response) => {
      const { statusCode, headers } = response;
      
      if (statusCode === 200) {
        console.log(`   ✅ SUCCESS (${headers['content-type']})`);
        resolve(true);
      } else {
        console.log(`   ❌ FAILED (Status: ${statusCode})`);
        resolve(false);
      }
      
      response.resume();
    });
    
    request.on('error', (error) => {
      console.log(`   ❌ ERROR (${error.message})`);
      resolve(false);
    });
    
    request.setTimeout(5000, () => {
      console.log(`   ⏰ TIMEOUT`);
      request.destroy();
      resolve(false);
    });
  });
}

async function runTests() {
  let successCount = 0;
  
  for (const imagePath of testImages) {
    const success = await testImageAPI(imagePath);
    if (success) successCount++;
    console.log('');
  }
  
  console.log(`📊 Results: ${successCount}/${testImages.length} images working`);
  
  if (successCount > 0) {
    console.log('\n✅ API route is working! The image path conversion logic should work.');
    console.log('\n💡 Next steps:');
    console.log('1. เปิดหน้า: http://18.138.63.84:3000/teacher/dashboard/register100/69b02bfe9436e8186f6e41a8');
    console.log('2. กด Ctrl+F5 เพื่อ clear cache');
    console.log('3. ตรวจสอบว่ารูปภาพแสดงได้');
  } else {
    console.log('\n❌ API route not working. Check container logs.');
  }
}

runTests();