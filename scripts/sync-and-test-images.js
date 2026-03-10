#!/usr/bin/env node

/**
 * Sync and Test Images
 * 
 * This script syncs all images from local to container and tests them
 */

const { execSync } = require('child_process');
const http = require('http');

console.log('🔄 Syncing and Testing Images...\n');

// Step 1: Copy all local uploads to container
console.log('1️⃣ Copying all uploads to container...');
try {
  execSync('docker cp public/uploads/. thai-music-web-prod:/app/public/uploads/', { stdio: 'inherit' });
  console.log('✅ Files copied successfully\n');
} catch (error) {
  console.error('❌ Error copying files:', error.message);
}

// Step 2: Check if specific file exists in container
console.log('2️⃣ Checking if specific file exists in container...');
try {
  const result = execSync('docker exec thai-music-web-prod find public/uploads -name "*1773153278547*"', { encoding: 'utf8' });
  if (result.trim()) {
    console.log('✅ File found in container:', result.trim());
  } else {
    console.log('❌ File not found in container');
    
    // List recent files
    console.log('📋 Recent files in container:');
    const recentFiles = execSync('docker exec thai-music-web-prod sh -c "ls -lt public/uploads/mgt_* | head -10"', { encoding: 'utf8' });
    console.log(recentFiles);
  }
} catch (error) {
  console.error('❌ Error checking files:', error.message);
}

// Step 3: Test API access
console.log('\n3️⃣ Testing API access...');

async function testImageAPI(imagePath) {
  return new Promise((resolve) => {
    const url = `http://18.138.63.84:3000${imagePath}`;
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
  // Test the specific image that was mentioned
  const specificImage = '/api/uploads/mgt_1773153278547_manager.jpg';
  await testImageAPI(specificImage);
  
  // Test some other recent images
  const otherImages = [
    '/api/uploads/mgt_1773072711344_manager.jpg',
    '/api/uploads/teacher_0_1773072711370_teacher1.jpg'
  ];
  
  console.log('\n📋 Testing other recent images:');
  for (const imagePath of otherImages) {
    await testImageAPI(imagePath);
  }
  
  console.log('\n💡 If images are still not showing:');
  console.log('1. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)');
  console.log('2. Try opening the image URL directly in browser');
  console.log('3. Check if the image was uploaded after the last container restart');
  console.log('4. Verify the database contains the correct image path');
}

// Run tests after a short delay
setTimeout(runTests, 2000);