#!/usr/bin/env node

/**
 * Test Specific Page
 * 
 * This script tests the specific teacher dashboard page to see what's happening
 */

const http = require('http');

console.log('🧪 Testing Specific Teacher Dashboard Page...\n');

const pageUrl = 'http://18.138.63.84:3000/teacher/dashboard/register100/69b02bfe9436e8186f6e41a8';
console.log('Testing page:', pageUrl);

// Test the page
const request = http.get(pageUrl, (response) => {
  const { statusCode, headers } = response;
  
  console.log('Page Status:', statusCode);
  console.log('Content-Type:', headers['content-type']);
  
  let data = '';
  response.on('data', (chunk) => {
    data += chunk;
  });
  
  response.on('end', () => {
    // Look for image references in the HTML
    const imageMatches = data.match(/src="[^"]*uploads[^"]*"/g);
    if (imageMatches) {
      console.log('\n📸 Found image references:');
      imageMatches.forEach(match => {
        console.log(match);
      });
    } else {
      console.log('\n❌ No image references found in HTML');
    }
    
    // Look for the specific image
    if (data.includes('mgt_1773153278547_manager.jpg')) {
      console.log('\n✅ Specific image reference found in HTML');
      
      // Extract the full src attribute
      const specificMatch = data.match(/src="[^"]*mgt_1773153278547_manager\.jpg[^"]*"/);
      if (specificMatch) {
        console.log('Full image src:', specificMatch[0]);
      }
    } else {
      console.log('\n❌ Specific image NOT found in HTML');
    }
    
    // Test the image directly
    console.log('\n🔍 Testing image URLs directly:');
    testImageUrl('/uploads/mgt_1773153278547_manager.jpg');
    testImageUrl('/api/uploads/mgt_1773153278547_manager.jpg');
  });
});

request.on('error', (error) => {
  console.error('❌ Error fetching page:', error.message);
});

function testImageUrl(imagePath) {
  const imageUrl = `http://18.138.63.84:3000${imagePath}`;
  console.log(`Testing: ${imageUrl}`);
  
  const imageRequest = http.get(imageUrl, (response) => {
    const { statusCode } = response;
    console.log(`  Status: ${statusCode} ${statusCode === 200 ? '✅' : '❌'}`);
    response.resume();
  });
  
  imageRequest.on('error', (error) => {
    console.log(`  Error: ${error.message} ❌`);
  });
}