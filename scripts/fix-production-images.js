#!/usr/bin/env node

/**
 * Fix Production Images Issue
 * 
 * This script helps fix the image serving issue in production by:
 * 1. Rebuilding the Docker containers with the fixed configuration
 * 2. Copying existing uploaded images to the new volume
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Production Images Issue...\n');

// Step 1: Stop existing containers
console.log('1️⃣ Stopping existing containers...');
try {
  execSync('docker-compose -f docker-compose.prod.yml down', { stdio: 'inherit' });
  console.log('✅ Containers stopped\n');
} catch (error) {
  console.log('⚠️ No containers to stop or error stopping containers\n');
}

// Step 2: Remove old images to force rebuild
console.log('2️⃣ Removing old Docker images...');
try {
  execSync('docker image rm thai-music-web-prod_web 2>/dev/null || true', { stdio: 'inherit' });
  console.log('✅ Old images removed\n');
} catch (error) {
  console.log('⚠️ No old images to remove\n');
}

// Step 3: Build and start new containers
console.log('3️⃣ Building and starting new containers...');
try {
  execSync('docker-compose -f docker-compose.prod.yml up -d --build', { stdio: 'inherit' });
  console.log('✅ New containers started\n');
} catch (error) {
  console.error('❌ Error building containers:', error.message);
  process.exit(1);
}

// Step 4: Copy existing uploads to the new volume
console.log('4️⃣ Copying existing uploads to Docker volume...');
const uploadsPath = path.join(process.cwd(), 'public', 'uploads');

if (fs.existsSync(uploadsPath)) {
  try {
    // Copy files to the container
    execSync(`docker cp ${uploadsPath}/. thai-music-web-prod:/app/public/uploads/`, { stdio: 'inherit' });
    console.log('✅ Uploads copied to container\n');
  } catch (error) {
    console.error('❌ Error copying uploads:', error.message);
  }
} else {
  console.log('⚠️ No local uploads directory found\n');
}

// Step 5: Verify the fix
console.log('5️⃣ Verifying the fix...');
setTimeout(() => {
  try {
    console.log('🔍 Checking container status...');
    execSync('docker-compose -f docker-compose.prod.yml ps', { stdio: 'inherit' });
    
    console.log('\n🌐 Testing image access...');
    console.log('You can now test image access at: http://18.138.63.84:3000/uploads/[filename]');
    console.log('\n✅ Production image fix completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Test image loading in the application');
    console.log('2. Upload a new image to verify the fix works');
    console.log('3. Check browser console for any remaining errors');
    
  } catch (error) {
    console.error('❌ Error verifying fix:', error.message);
  }
}, 5000);