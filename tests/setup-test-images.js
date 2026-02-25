const fs = require('fs');
const path = require('path');

/**
 * Setup Test Images
 * 
 * This script checks if test images exist and provides instructions
 * for creating them if they don't.
 */

const TEST_ASSETS_DIR = path.join(__dirname, '../test-assets');
const REQUIRED_IMAGES = [
  'manager-photo.jpg',
  'teacher1-photo.jpg',
  'teacher2-photo.jpg',
  'teacher3-photo.jpg',
  'teacher4-photo.jpg'
];

console.log('🔍 Checking test images...\n');

// Create test-assets directory if it doesn't exist
if (!fs.existsSync(TEST_ASSETS_DIR)) {
  fs.mkdirSync(TEST_ASSETS_DIR, { recursive: true });
  console.log('✅ Created test-assets directory\n');
}

let allImagesExist = true;
const missingImages = [];

// Check each required image
REQUIRED_IMAGES.forEach(imageName => {
  const imagePath = path.join(TEST_ASSETS_DIR, imageName);
  if (fs.existsSync(imagePath)) {
    const stats = fs.statSync(imagePath);
    console.log(`✅ ${imageName} - ${(stats.size / 1024).toFixed(2)} KB`);
  } else {
    console.log(`❌ ${imageName} - NOT FOUND`);
    allImagesExist = false;
    missingImages.push(imageName);
  }
});

console.log('\n' + '='.repeat(80));

if (allImagesExist) {
  console.log('✅ ALL TEST IMAGES FOUND!');
  console.log('✅ You can run the full fields test now.');
} else {
  console.log('⚠️  MISSING TEST IMAGES');
  console.log('\nMissing images:');
  missingImages.forEach(img => console.log(`  - ${img}`));
  
  console.log('\n📝 HOW TO FIX:');
  console.log('\nOption 1: Add Real Images');
  console.log('  1. Place your test images in the test-assets/ folder');
  console.log('  2. Make sure they are named exactly as shown above');
  console.log('  3. Images should be JPG format, max 1MB each');
  
  console.log('\nOption 2: Create Dummy Images (for testing only)');
  console.log('  You can create small dummy images using any image editor');
  console.log('  or download free stock photos from:');
  console.log('  - https://unsplash.com/');
  console.log('  - https://pexels.com/');
  console.log('  - https://pixabay.com/');
  
  console.log('\nOption 3: Use ImageMagick (if installed)');
  console.log('  Run these commands to create dummy images:');
  console.log('');
  missingImages.forEach(img => {
    const imgPath = path.join(TEST_ASSETS_DIR, img);
    console.log(`  convert -size 400x400 xc:lightblue -pointsize 30 -draw "text 100,200 '${img}'" "${imgPath}"`);
  });
  
  console.log('\nAfter adding images, run this script again to verify:');
  console.log('  node tests/setup-test-images.js');
}

console.log('='.repeat(80) + '\n');

