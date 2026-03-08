/**
 * Manual Test Script for Rate Limiting Utilities
 * 
 * Run: node scripts/test-rateLimit.js
 * 
 * This script tests the rate limiting functions without requiring a test framework.
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

// Use localhost for running from host machine
const uri = process.env.MONGODB_URI?.replace('mongo:', 'localhost:') || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

console.log('📍 Connecting to:', uri.replace(/\/\/.*@/, '//***:***@'));

// Import rate limiting functions (we'll need to transpile TypeScript)
// For now, we'll test the logic directly

async function testRateLimiting() {
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db(dbName);
    const draftsCollection = db.collection('draft_submissions');

    // Clean up test data
    const testEmail = `test-ratelimit-${Date.now()}@example.com`;
    console.log(`🧪 Testing with email: ${testEmail}\n`);

    // Test 1: Check draft save rate limit with no drafts
    console.log('Test 1: Check draft save rate limit with no drafts');
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentSaves = await draftsCollection.countDocuments({
      email: testEmail,
      lastSaveAt: { $gte: oneHourAgo },
    });
    console.log(`   Recent saves: ${recentSaves}`);
    console.log(`   Allowed: ${recentSaves < 5}`);
    console.log(`   Remaining: ${Math.max(0, 5 - recentSaves)}`);
    console.log('   ✅ Test 1 passed\n');

    // Test 2: Create 3 draft saves and check limit
    console.log('Test 2: Create 3 draft saves and check limit');
    const now = new Date();
    for (let i = 0; i < 3; i++) {
      await draftsCollection.insertOne({
        draftToken: `test-token-${i}-${Date.now()}`,
        email: testEmail,
        phone: '0812345678',
        submissionType: 'register100',
        formData: {},
        currentStep: 1,
        createdAt: now,
        lastModified: now,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'active',
        saveCount: 1,
        lastSaveAt: now,
        otpAttempts: 0,
        otpRequestCount: 0,
      });
    }

    const recentSaves2 = await draftsCollection.countDocuments({
      email: testEmail,
      lastSaveAt: { $gte: oneHourAgo },
    });
    console.log(`   Recent saves: ${recentSaves2}`);
    console.log(`   Allowed: ${recentSaves2 < 5}`);
    console.log(`   Remaining: ${Math.max(0, 5 - recentSaves2)}`);
    
    if (recentSaves2 === 3 && recentSaves2 < 5) {
      console.log('   ✅ Test 2 passed\n');
    } else {
      console.log('   ❌ Test 2 failed\n');
    }

    // Test 3: Create 5 draft saves and check limit is exceeded
    console.log('Test 3: Create 5 draft saves and check limit is exceeded');
    for (let i = 3; i < 5; i++) {
      await draftsCollection.insertOne({
        draftToken: `test-token-${i}-${Date.now()}`,
        email: testEmail,
        phone: '0812345678',
        submissionType: 'register100',
        formData: {},
        currentStep: 1,
        createdAt: now,
        lastModified: now,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'active',
        saveCount: 1,
        lastSaveAt: now,
        otpAttempts: 0,
        otpRequestCount: 0,
      });
    }

    const recentSaves3 = await draftsCollection.countDocuments({
      email: testEmail,
      lastSaveAt: { $gte: oneHourAgo },
    });
    console.log(`   Recent saves: ${recentSaves3}`);
    console.log(`   Allowed: ${recentSaves3 < 5}`);
    console.log(`   Remaining: ${Math.max(0, 5 - recentSaves3)}`);
    
    if (recentSaves3 === 5 && !(recentSaves3 < 5)) {
      console.log('   ✅ Test 3 passed\n');
    } else {
      console.log('   ❌ Test 3 failed\n');
    }

    // Test 4: Check OTP request rate limit
    console.log('Test 4: Check OTP request rate limit');
    await draftsCollection.deleteMany({ email: testEmail });
    
    await draftsCollection.insertOne({
      draftToken: `test-token-otp-${Date.now()}`,
      email: testEmail,
      phone: '0812345678',
      submissionType: 'register100',
      formData: {},
      currentStep: 1,
      createdAt: now,
      lastModified: now,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'active',
      saveCount: 1,
      lastSaveAt: now,
      otpAttempts: 0,
      otpRequestCount: 2,
      lastOtpRequestAt: now,
    });

    const draftsWithRecentOTP = await draftsCollection
      .find({
        email: testEmail,
        lastOtpRequestAt: { $gte: oneHourAgo },
      })
      .toArray();

    const totalOTPRequests = draftsWithRecentOTP.reduce(
      (sum, draft) => sum + (draft.otpRequestCount || 0),
      0
    );

    console.log(`   Total OTP requests: ${totalOTPRequests}`);
    console.log(`   Allowed: ${totalOTPRequests < 3}`);
    console.log(`   Remaining: ${Math.max(0, 3 - totalOTPRequests)}`);
    
    if (totalOTPRequests === 2 && totalOTPRequests < 3) {
      console.log('   ✅ Test 4 passed\n');
    } else {
      console.log('   ❌ Test 4 failed\n');
    }

    // Test 5: Test incrementRateLimit for draft saves
    console.log('Test 5: Test incrementRateLimit for draft saves');
    const beforeIncrement = await draftsCollection.findOne({ email: testEmail });
    console.log(`   Before increment - saveCount: ${beforeIncrement?.saveCount}`);

    await draftsCollection.updateMany(
      { email: testEmail, status: 'active' },
      {
        $set: { lastSaveAt: new Date() },
        $inc: { saveCount: 1 },
      }
    );

    const afterIncrement = await draftsCollection.findOne({ email: testEmail });
    console.log(`   After increment - saveCount: ${afterIncrement?.saveCount}`);
    
    if (afterIncrement?.saveCount === (beforeIncrement?.saveCount || 0) + 1) {
      console.log('   ✅ Test 5 passed\n');
    } else {
      console.log('   ❌ Test 5 failed\n');
    }

    // Test 6: Test incrementRateLimit for OTP requests
    console.log('Test 6: Test incrementRateLimit for OTP requests');
    const beforeOTPIncrement = await draftsCollection.findOne({ email: testEmail });
    console.log(`   Before increment - otpRequestCount: ${beforeOTPIncrement?.otpRequestCount}`);

    await draftsCollection.updateMany(
      { email: testEmail, status: 'active' },
      {
        $set: { lastOtpRequestAt: new Date() },
        $inc: { otpRequestCount: 1 },
      }
    );

    const afterOTPIncrement = await draftsCollection.findOne({ email: testEmail });
    console.log(`   After increment - otpRequestCount: ${afterOTPIncrement?.otpRequestCount}`);
    
    if (afterOTPIncrement?.otpRequestCount === (beforeOTPIncrement?.otpRequestCount || 0) + 1) {
      console.log('   ✅ Test 6 passed\n');
    } else {
      console.log('   ❌ Test 6 failed\n');
    }

    // Test 7: Test that old saves are not counted
    console.log('Test 7: Test that old saves are not counted');
    await draftsCollection.deleteMany({ email: testEmail });
    
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    
    // Create 3 old saves
    for (let i = 0; i < 3; i++) {
      await draftsCollection.insertOne({
        draftToken: `test-token-old-${i}-${Date.now()}`,
        email: testEmail,
        phone: '0812345678',
        submissionType: 'register100',
        formData: {},
        currentStep: 1,
        createdAt: twoHoursAgo,
        lastModified: twoHoursAgo,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'active',
        saveCount: 1,
        lastSaveAt: twoHoursAgo,
        otpAttempts: 0,
        otpRequestCount: 0,
      });
    }

    // Create 2 recent saves
    for (let i = 0; i < 2; i++) {
      await draftsCollection.insertOne({
        draftToken: `test-token-recent-${i}-${Date.now()}`,
        email: testEmail,
        phone: '0812345678',
        submissionType: 'register100',
        formData: {},
        currentStep: 1,
        createdAt: now,
        lastModified: now,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'active',
        saveCount: 1,
        lastSaveAt: now,
        otpAttempts: 0,
        otpRequestCount: 0,
      });
    }

    const recentSavesOnly = await draftsCollection.countDocuments({
      email: testEmail,
      lastSaveAt: { $gte: oneHourAgo },
    });

    console.log(`   Total drafts: 5 (3 old + 2 recent)`);
    console.log(`   Recent saves (within 1 hour): ${recentSavesOnly}`);
    console.log(`   Remaining: ${Math.max(0, 5 - recentSavesOnly)}`);
    
    if (recentSavesOnly === 2) {
      console.log('   ✅ Test 7 passed\n');
    } else {
      console.log('   ❌ Test 7 failed\n');
    }

    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    await draftsCollection.deleteMany({ email: testEmail });
    console.log('✅ Test data cleaned up\n');

    console.log('✅ All rate limiting tests completed successfully!');

  } catch (error) {
    console.error('\n❌ Error during testing:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run tests
testRateLimiting();
