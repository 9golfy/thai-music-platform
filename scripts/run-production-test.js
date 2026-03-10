#!/usr/bin/env node

/**
 * Production Test Runner for Register100
 * Tests the production server at http://18.138.63.84:3000/regist100
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Register100 Production Test...');
console.log('🌐 Target: http://18.138.63.84:3000/regist100');
console.log('📧 Test Email: 9golfy@gmail.com');
console.log('📱 Test Phone: 0899297983');
console.log('⏰ Estimated Duration: 2-3 minutes');
console.log('=' .repeat(60));

try {
  // Check if Playwright is installed
  console.log('🔍 Checking Playwright installation...');
  try {
    execSync('npx playwright --version', { stdio: 'pipe' });
    console.log('✅ Playwright is available');
  } catch (error) {
    console.log('⚠️ Installing Playwright...');
    execSync('npm install -D @playwright/test', { stdio: 'inherit' });
    execSync('npx playwright install', { stdio: 'inherit' });
  }

  // Run the production test
  console.log('\n🎭 Running Playwright test...');
  const testCommand = 'npx playwright test tests/register100-production-test.spec.ts --headed --timeout=120000';
  
  console.log(`📝 Command: ${testCommand}`);
  console.log('🔄 Executing test...\n');
  
  execSync(testCommand, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('\n🎉 Production test completed successfully!');
  console.log('📊 Check the browser output for detailed results');
  
} catch (error) {
  console.error('\n❌ Test execution failed:');
  console.error(error.message);
  
  if (error.message.includes('ENOENT')) {
    console.log('\n💡 Suggestions:');
    console.log('1. Make sure Node.js and npm are installed');
    console.log('2. Run: npm install');
    console.log('3. Install Playwright: npx playwright install');
  }
  
  process.exit(1);
}