#!/usr/bin/env node

/**
 * Fix Production Deployment
 * 
 * This script properly cleans up and redeploys the production environment
 */

const { execSync } = require('child_process');

console.log('🔧 Fixing Production Deployment...\n');

// Step 1: Stop and remove ALL containers
console.log('1️⃣ Stopping and removing all containers...');
try {
  execSync('docker-compose -f docker-compose.prod.yml down --remove-orphans', { stdio: 'inherit' });
  console.log('✅ All containers stopped and removed\n');
} catch (error) {
  console.log('⚠️ Error stopping containers:', error.message);
}

// Step 2: Remove any orphaned containers with the same names
console.log('2️⃣ Removing orphaned containers...');
try {
  execSync('docker rm -f thai-music-web-prod thai-music-mongo thai-music-mongo-express 2>/dev/null || true', { stdio: 'inherit' });
  console.log('✅ Orphaned containers removed\n');
} catch (error) {
  console.log('⚠️ No orphaned containers to remove\n');
}

// Step 3: Remove old images to force rebuild
console.log('3️⃣ Removing old Docker images...');
try {
  execSync('docker image rm thai-music-platform-web thai-music-platform_web 2>/dev/null || true', { stdio: 'inherit' });
  console.log('✅ Old images removed\n');
} catch (error) {
  console.log('⚠️ No old images to remove\n');
}

// Step 4: Build and start new containers
console.log('4️⃣ Building and starting new containers...');
try {
  execSync('docker-compose -f docker-compose.prod.yml up -d --build', { stdio: 'inherit' });
  console.log('✅ New containers started\n');
} catch (error) {
  console.error('❌ Error building containers:', error.message);
  process.exit(1);
}

// Step 5: Wait for containers to be ready
console.log('5️⃣ Waiting for containers to be ready...');
setTimeout(() => {
  try {
    console.log('🔍 Checking container status...');
    execSync('docker-compose -f docker-compose.prod.yml ps', { stdio: 'inherit' });
    
    console.log('\n📋 Container logs (last 10 lines):');
    execSync('docker-compose -f docker-compose.prod.yml logs --tail=10 web', { stdio: 'inherit' });
    
  } catch (error) {
    console.error('❌ Error checking containers:', error.message);
  }
}, 10000);

// Step 6: Copy existing uploads if they exist
console.log('6️⃣ Copying existing uploads...');
setTimeout(() => {
  const fs = require('fs');
  const path = require('path');
  
  const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
  
  if (fs.existsSync(uploadsPath)) {
    try {
      console.log('📁 Copying uploads to container...');
      execSync(`docker cp ${uploadsPath}/. thai-music-web-prod:/app/public/uploads/`, { stdio: 'inherit' });
      console.log('✅ Uploads copied to container\n');
      
      // Verify the copy worked
      console.log('🔍 Verifying uploads in container...');
      execSync('docker exec thai-music-web-prod ls -la public/uploads | head -10', { stdio: 'inherit' });
      
    } catch (error) {
      console.error('❌ Error copying uploads:', error.message);
    }
  } else {
    console.log('⚠️ No local uploads directory found\n');
  }
  
  console.log('\n✅ Deployment completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Test image access: node scripts/test-production-images.js');
  console.log('2. Check application: http://18.138.63.84:3000');
  console.log('3. Monitor logs: docker-compose -f docker-compose.prod.yml logs -f web');
  
}, 15000);