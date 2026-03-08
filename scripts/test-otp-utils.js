/**
 * Simple test runner for OTP utilities
 * 
 * This script tests the OTP utility functions to ensure they work correctly.
 * Run with: node scripts/test-otp-utils.js
 */

const { generateOTP, hashOTP, verifyOTP, isOTPExpired, getOTPExpiryTime } = require('../lib/utils/otp.ts');

// Simple test framework
let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failCount++;
  }
}

async function runTests() {
  console.log('🧪 Testing OTP Utilities\n');
  console.log('=' .repeat(60));
  
  // Test 1: Generate OTP format
  console.log('\n📝 Test 1: Generate OTP format');
  const otp1 = generateOTP();
  assert(/^\d{6}$/.test(otp1), `Generated OTP should be 6 digits: ${otp1}`);
  assert(otp1.length === 6, `OTP length should be 6: ${otp1.length}`);
  
  // Test 2: Generate unique OTPs
  console.log('\n📝 Test 2: Generate unique OTPs');
  const otps = new Set();
  for (let i = 0; i < 100; i++) {
    otps.add(generateOTP());
  }
  assert(otps.size > 90, `Should generate mostly unique OTPs: ${otps.size}/100`);
  
  // Test 3: Hash OTP
  console.log('\n📝 Test 3: Hash OTP');
  const otp2 = '123456';
  const hash1 = await hashOTP(otp2);
  assert(hash1 !== otp2, 'Hash should be different from original OTP');
  assert(hash1.length > 20, `Hash should be long (bcrypt): ${hash1.length} chars`);
  
  // Test 4: Different hashes for same OTP (salt)
  console.log('\n📝 Test 4: Different hashes for same OTP (salt)');
  const hash2 = await hashOTP(otp2);
  assert(hash1 !== hash2, 'Same OTP should produce different hashes due to salt');
  
  // Test 5: Verify correct OTP
  console.log('\n📝 Test 5: Verify correct OTP');
  const isValid = await verifyOTP(otp2, hash1);
  assert(isValid === true, 'Correct OTP should verify successfully');
  
  // Test 6: Reject incorrect OTP
  console.log('\n📝 Test 6: Reject incorrect OTP');
  const isInvalid = await verifyOTP('654321', hash1);
  assert(isInvalid === false, 'Incorrect OTP should fail verification');
  
  // Test 7: Reject invalid OTP format in hashing
  console.log('\n📝 Test 7: Reject invalid OTP format in hashing');
  try {
    await hashOTP('12345');
    assert(false, 'Should reject 5-digit OTP');
  } catch (error) {
    assert(error.message.includes('Invalid OTP format'), 'Should throw error for invalid format');
  }
  
  // Test 8: Reject invalid OTP format in verification
  console.log('\n📝 Test 8: Reject invalid OTP format in verification');
  const invalidVerify = await verifyOTP('abcdef', hash1);
  assert(invalidVerify === false, 'Should reject non-numeric OTP');
  
  // Test 9: Check future expiry time
  console.log('\n📝 Test 9: Check future expiry time');
  const futureTime = new Date(Date.now() + 10 * 60 * 1000);
  const notExpired = isOTPExpired(futureTime);
  assert(notExpired === false, 'Future time should not be expired');
  
  // Test 10: Check past expiry time
  console.log('\n📝 Test 10: Check past expiry time');
  const pastTime = new Date(Date.now() - 1000);
  const expired = isOTPExpired(pastTime);
  assert(expired === true, 'Past time should be expired');
  
  // Test 11: Get OTP expiry time
  console.log('\n📝 Test 11: Get OTP expiry time');
  const expiryTime = getOTPExpiryTime();
  const timeDiff = expiryTime.getTime() - Date.now();
  const tenMinutes = 10 * 60 * 1000;
  assert(Math.abs(timeDiff - tenMinutes) < 1000, `Expiry should be ~10 minutes: ${Math.round(timeDiff / 1000)}s`);
  
  // Test 12: Full lifecycle
  console.log('\n📝 Test 12: Full OTP lifecycle');
  const otp3 = generateOTP();
  const hash3 = await hashOTP(otp3);
  const verified = await verifyOTP(otp3, hash3);
  assert(verified === true, 'Full lifecycle should work: generate -> hash -> verify');
  
  // Test 13: Leading zeros
  console.log('\n📝 Test 13: Leading zeros handling');
  const otpsWithZeros = [];
  for (let i = 0; i < 1000; i++) {
    otpsWithZeros.push(generateOTP());
  }
  const hasLeadingZero = otpsWithZeros.some(otp => otp.startsWith('0'));
  assert(hasLeadingZero, 'Should generate OTPs with leading zeros');
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Test Summary:`);
  console.log(`   ✅ Passed: ${passCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📈 Total:  ${passCount + failCount}`);
  
  if (failCount === 0) {
    console.log('\n🎉 All tests passed!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed!\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n💥 Test execution failed:', error);
  process.exit(1);
});
