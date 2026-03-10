#!/usr/bin/env node

/**
 * Test Production Images
 * 
 * This script tests if images are being served correctly in production
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://18.138.63.84:3000';

// Test image URLs (using API route with confirmed existing files)
const testImages = [
  '/api/uploads/mgt_1772812576615_manager.jpg',
  '/api/uploads/teacher_0_1772812576621_teacher1.jpg',
  '/api/uploads/teacher_support_0_1772976020446_teacher1.jpg'
];

console.log('🧪 Testing Production Image Serving...\n');

async function testImageUrl(imagePath) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${imagePath}`;
    console.log(`🔍 Testing: ${url}`);
    
    const request = http.get(url, (response) => {
      const { statusCode, headers } = response;
      
      if (statusCode === 200) {
        console.log(`✅ SUCCESS: ${imagePath} (${headers['content-type']})`);
        resolve(true);
      } else {
        console.log(`❌ FAILED: ${imagePath} (Status: ${statusCode})`);
        resolve(false);
      }
      
      // Consume response data to free up memory
      response.resume();
    });
    
    request.on('error', (error) => {
      console.log(`❌ ERROR: ${imagePath} (${error.message})`);
      resolve(false);
    });
    
    request.setTimeout(5000, () => {
      console.log(`⏰ TIMEOUT: ${imagePath}`);
      request.destroy();
      resolve(false);
    });
  });
}

async function runTests() {
  console.log(`Testing image serving from: ${BASE_URL}\n`);
  
  let successCount = 0;
  
  for (const imagePath of testImages) {
    const success = await testImageUrl(imagePath);
    if (success) successCount++;
    console.log(''); // Empty line for readability
  }
  
  console.log('📊 Test Results:');
  console.log(`✅ Successful: ${successCount}/${testImages.length}`);
  console.log(`❌ Failed: ${testImages.length - successCount}/${testImages.length}`);
  
  if (successCount === testImages.length) {
    console.log('\n🎉 All images are serving correctly!');
  } else if (successCount > 0) {
    console.log('\n⚠️ Some images are working, but there may be issues with others.');
  } else {
    console.log('\n🚨 No images are serving correctly. Check the Docker configuration.');
  }
  
  console.log('\n💡 Tips:');
  console.log('- Make sure Docker containers are running: docker-compose -f docker-compose.prod.yml ps');
  console.log('- Check container logs: docker-compose -f docker-compose.prod.yml logs web');
  console.log('- Verify uploads directory exists in container: docker exec thai-music-web-prod ls -la public/uploads');
}

runTests().catch(console.error);