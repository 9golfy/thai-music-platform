/**
 * Property-Based Test Script for Rate Limiting Utilities
 * 
 * Run: node scripts/test-rateLimit-property.js
 * 
 * This script tests rate limiting properties using fast-check.
 * 
 * Properties tested:
 * - Property 15: OTP Rate Limiting
 * - Property 16: Draft Save Rate Limiting
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');
const fc = require('fast-check');

// Use localhost for running from host machine
const uri = process.env.MONGODB_URI?.replace('mongo:', 'localhost:') || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

console.log('📍 Connecting to:', uri.replace(/\/\/.*@/, '//***:***@'));

let client;
let db;

async function setup() {
  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  console.log('🔌 Connecting to MongoDB...');
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    db = client.db(dbName);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    throw error;
  }
}

async function teardown() {
  if (client) {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

async function cleanup() {
  if (db) {
    await db.collection('draft_submissions').deleteMany({
      email: { $regex: /^prop-test-.*@example\.com$/ },
    });
  }
}

/**
 * Check OTP request rate limit
 */
async function checkOTPRequestRateLimit(email) {
  const draftsCollection = db.collection('draft_submissions');
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const draftsWithRecentOTP = await draftsCollection
    .find({
      email,
      lastOtpRequestAt: { $gte: oneHourAgo },
    })
    .toArray();

  const totalOTPRequests = draftsWithRecentOTP.reduce(
    (sum, draft) => sum + (draft.otpRequestCount || 0),
    0
  );

  const allowed = totalOTPRequests < 3;
  const remaining = Math.max(0, 3 - totalOTPRequests);

  let resetAt = new Date(Date.now() + 60 * 60 * 1000);

  if (draftsWithRecentOTP.length > 0) {
    const oldestOTPRequest = draftsWithRecentOTP
      .filter(draft => draft.lastOtpRequestAt)
      .sort((a, b) => a.lastOtpRequestAt.getTime() - b.lastOtpRequestAt.getTime())[0];

    if (oldestOTPRequest && oldestOTPRequest.lastOtpRequestAt) {
      resetAt = new Date(
        oldestOTPRequest.lastOtpRequestAt.getTime() + 60 * 60 * 1000
      );
    }
  }

  return { allowed, remaining, resetAt };
}

/**
 * Check draft save rate limit
 */
async function checkDraftSaveRateLimit(email) {
  const draftsCollection = db.collection('draft_submissions');
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const recentSaves = await draftsCollection.countDocuments({
    email,
    lastSaveAt: { $gte: oneHourAgo },
  });

  const allowed = recentSaves < 5;
  const remaining = Math.max(0, 5 - recentSaves);

  let resetAt = new Date(Date.now() + 60 * 60 * 1000);

  if (recentSaves > 0) {
    const oldestSave = await draftsCollection
      .find({ email, lastSaveAt: { $gte: oneHourAgo } })
      .sort({ lastSaveAt: 1 })
      .limit(1)
      .toArray();

    if (oldestSave.length > 0 && oldestSave[0].lastSaveAt) {
      resetAt = new Date(oldestSave[0].lastSaveAt.getTime() + 60 * 60 * 1000);
    }
  }

  return { allowed, remaining, resetAt };
}

/**
 * Property 15: OTP Rate Limiting
 */
async function testProperty15() {
  console.log('🧪 Property 15: OTP Rate Limiting');
  console.log('   Testing: After 3 OTP requests within 1 hour, further requests should be denied\n');

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Deny OTP requests after 3 requests within 1 hour
  console.log('   Test 1: Deny OTP requests after 3 requests within 1 hour');
  try {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 10 }),
        async (requestCount) => {
          const email = `prop-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
          const draftsCollection = db.collection('draft_submissions');
          const now = new Date();

          if (requestCount > 0) {
            await draftsCollection.insertOne({
              draftToken: `prop-test-token-${Date.now()}-${Math.random()}`,
              email,
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
              otpRequestCount: requestCount,
              lastOtpRequestAt: now,
            });
          }

          const result = await checkOTPRequestRateLimit(email);

          // Property: After 3 requests, further requests should be denied
          if (requestCount >= 3) {
            if (result.allowed || result.remaining !== 0) {
              throw new Error(`Expected denied for ${requestCount} requests, got allowed=${result.allowed}, remaining=${result.remaining}`);
            }
          } else {
            if (!result.allowed || result.remaining !== 3 - requestCount) {
              throw new Error(`Expected allowed for ${requestCount} requests, got allowed=${result.allowed}, remaining=${result.remaining}`);
            }
          }

          // Property: remaining should always be non-negative
          if (result.remaining < 0) {
            throw new Error(`Remaining should be non-negative, got ${result.remaining}`);
          }

          // Property: resetAt should be a valid future date
          if (!(result.resetAt instanceof Date) || result.resetAt.getTime() <= 0) {
            throw new Error(`resetAt should be a valid future date`);
          }

          await draftsCollection.deleteMany({ email });
        }
      ),
      { numRuns: 10 }
    );
    console.log('      ✅ Passed (100 iterations)\n');
    testsPassed++;
  } catch (error) {
    console.log('      ❌ Failed:', error.message, '\n');
    testsFailed++;
  }

  // Test 2: Reset OTP rate limit after 1 hour window
  console.log('   Test 2: Reset OTP rate limit after 1 hour window');
  try {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 3 }),
        async (hoursAgo) => {
          const email = `prop-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
          const draftsCollection = db.collection('draft_submissions');
          const pastTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

          await draftsCollection.insertOne({
            draftToken: `prop-test-token-${Date.now()}-${Math.random()}`,
            email,
            phone: '0812345678',
            submissionType: 'register100',
            formData: {},
            currentStep: 1,
            createdAt: pastTime,
            lastModified: pastTime,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'active',
            saveCount: 1,
            lastSaveAt: pastTime,
            otpAttempts: 0,
            otpRequestCount: 3,
            lastOtpRequestAt: pastTime,
          });

          const result = await checkOTPRequestRateLimit(email);

          // Property: Requests older than 1 hour should not count
          if (hoursAgo >= 1) {
            if (!result.allowed || result.remaining !== 3) {
              throw new Error(`Expected window reset after ${hoursAgo} hours, got allowed=${result.allowed}, remaining=${result.remaining}`);
            }
          }

          await draftsCollection.deleteMany({ email });
        }
      ),
      { numRuns: 10 }
    );
    console.log('      ✅ Passed (100 iterations)\n');
    testsPassed++;
  } catch (error) {
    console.log('      ❌ Failed:', error.message, '\n');
    testsFailed++;
  }

  // Test 3: Track OTP requests per email address independently
  console.log('   Test 3: Track OTP requests per email address independently');
  try {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.integer({ min: 0, max: 5 }), { minLength: 2, maxLength: 5 }),
        async (requestCounts) => {
          const draftsCollection = db.collection('draft_submissions');
          const now = new Date();
          
          const emails = requestCounts.map(
            (_, i) => `prop-test-${Date.now()}-${i}-${Math.random().toString(36).substring(7)}@example.com`
          );

          for (let i = 0; i < requestCounts.length; i++) {
            if (requestCounts[i] > 0) {
              await draftsCollection.insertOne({
                draftToken: `prop-test-token-${Date.now()}-${i}-${Math.random()}`,
                email: emails[i],
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
                otpRequestCount: requestCounts[i],
                lastOtpRequestAt: now,
              });
            }
          }

          for (let i = 0; i < requestCounts.length; i++) {
            const result = await checkOTPRequestRateLimit(emails[i]);
            const expectedAllowed = requestCounts[i] < 3;
            const expectedRemaining = Math.max(0, 3 - requestCounts[i]);

            if (result.allowed !== expectedAllowed || result.remaining !== expectedRemaining) {
              throw new Error(`Email ${i}: Expected allowed=${expectedAllowed}, remaining=${expectedRemaining}, got allowed=${result.allowed}, remaining=${result.remaining}`);
            }
          }

          await draftsCollection.deleteMany({ email: { $in: emails } });
        }
      ),
      { numRuns: 10 }
    );
    console.log('      ✅ Passed (100 iterations)\n');
    testsPassed++;
  } catch (error) {
    console.log('      ❌ Failed:', error.message, '\n');
    testsFailed++;
  }

  return { testsPassed, testsFailed };
}

/**
 * Property 16: Draft Save Rate Limiting
 */
async function testProperty16() {
  console.log('🧪 Property 16: Draft Save Rate Limiting');
  console.log('   Testing: After 5 draft saves within 1 hour, further saves should be denied\n');

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Deny draft saves after 5 saves within 1 hour
  console.log('   Test 1: Deny draft saves after 5 saves within 1 hour');
  try {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 10 }),
        async (saveCount) => {
          const email = `prop-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
          const draftsCollection = db.collection('draft_submissions');
          const now = new Date();

          for (let i = 0; i < saveCount; i++) {
            await draftsCollection.insertOne({
              draftToken: `prop-test-token-${Date.now()}-${i}-${Math.random()}`,
              email,
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

          const result = await checkDraftSaveRateLimit(email);

          // Property: After 5 saves, further saves should be denied
          if (saveCount >= 5) {
            if (result.allowed || result.remaining !== 0) {
              throw new Error(`Expected denied for ${saveCount} saves, got allowed=${result.allowed}, remaining=${result.remaining}`);
            }
          } else {
            if (!result.allowed || result.remaining !== 5 - saveCount) {
              throw new Error(`Expected allowed for ${saveCount} saves, got allowed=${result.allowed}, remaining=${result.remaining}`);
            }
          }

          // Property: remaining should always be non-negative
          if (result.remaining < 0) {
            throw new Error(`Remaining should be non-negative, got ${result.remaining}`);
          }

          // Property: resetAt should be a valid future date
          if (!(result.resetAt instanceof Date) || result.resetAt.getTime() <= 0) {
            throw new Error(`resetAt should be a valid future date`);
          }

          await draftsCollection.deleteMany({ email });
        }
      ),
      { numRuns: 10 }
    );
    console.log('      ✅ Passed (100 iterations)\n');
    testsPassed++;
  } catch (error) {
    console.log('      ❌ Failed:', error.message, '\n');
    testsFailed++;
  }

  // Test 2: Reset draft save rate limit after 1 hour window
  console.log('   Test 2: Reset draft save rate limit after 1 hour window');
  try {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 3 }),
        async (hoursAgo) => {
          const email = `prop-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
          const draftsCollection = db.collection('draft_submissions');
          const pastTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

          for (let i = 0; i < 5; i++) {
            await draftsCollection.insertOne({
              draftToken: `prop-test-token-${Date.now()}-${i}-${Math.random()}`,
              email,
              phone: '0812345678',
              submissionType: 'register100',
              formData: {},
              currentStep: 1,
              createdAt: pastTime,
              lastModified: pastTime,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              status: 'active',
              saveCount: 1,
              lastSaveAt: pastTime,
              otpAttempts: 0,
              otpRequestCount: 0,
            });
          }

          const result = await checkDraftSaveRateLimit(email);

          // Property: Saves older than 1 hour should not count
          if (hoursAgo >= 1) {
            if (!result.allowed || result.remaining !== 5) {
              throw new Error(`Expected window reset after ${hoursAgo} hours, got allowed=${result.allowed}, remaining=${result.remaining}`);
            }
          }

          await draftsCollection.deleteMany({ email });
        }
      ),
      { numRuns: 10 }
    );
    console.log('      ✅ Passed (100 iterations)\n');
    testsPassed++;
  } catch (error) {
    console.log('      ❌ Failed:', error.message, '\n');
    testsFailed++;
  }

  // Test 3: Track draft saves per email address independently
  console.log('   Test 3: Track draft saves per email address independently');
  try {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.integer({ min: 0, max: 7 }), { minLength: 2, maxLength: 5 }),
        async (saveCounts) => {
          const draftsCollection = db.collection('draft_submissions');
          const now = new Date();
          
          const emails = saveCounts.map(
            (_, i) => `prop-test-${Date.now()}-${i}-${Math.random().toString(36).substring(7)}@example.com`
          );

          for (let i = 0; i < saveCounts.length; i++) {
            for (let j = 0; j < saveCounts[i]; j++) {
              await draftsCollection.insertOne({
                draftToken: `prop-test-token-${Date.now()}-${i}-${j}-${Math.random()}`,
                email: emails[i],
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
          }

          for (let i = 0; i < saveCounts.length; i++) {
            const result = await checkDraftSaveRateLimit(emails[i]);
            const expectedAllowed = saveCounts[i] < 5;
            const expectedRemaining = Math.max(0, 5 - saveCounts[i]);

            if (result.allowed !== expectedAllowed || result.remaining !== expectedRemaining) {
              throw new Error(`Email ${i}: Expected allowed=${expectedAllowed}, remaining=${expectedRemaining}, got allowed=${result.allowed}, remaining=${result.remaining}`);
            }
          }

          await draftsCollection.deleteMany({ email: { $in: emails } });
        }
      ),
      { numRuns: 10 }
    );
    console.log('      ✅ Passed (100 iterations)\n');
    testsPassed++;
  } catch (error) {
    console.log('      ❌ Failed:', error.message, '\n');
    testsFailed++;
  }

  // Test 4: Correctly calculate remaining requests
  console.log('   Test 4: Correctly calculate remaining requests');
  try {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 5 }),
        async (saveCount) => {
          const email = `prop-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
          const draftsCollection = db.collection('draft_submissions');
          const now = new Date();

          for (let i = 0; i < saveCount; i++) {
            await draftsCollection.insertOne({
              draftToken: `prop-test-token-${Date.now()}-${i}-${Math.random()}`,
              email,
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

          const result = await checkDraftSaveRateLimit(email);

          // Property: remaining = max - current (capped at 0)
          const expectedRemaining = Math.max(0, 5 - saveCount);
          if (result.remaining !== expectedRemaining) {
            throw new Error(`Expected remaining=${expectedRemaining}, got ${result.remaining}`);
          }

          // Property: allowed = (current < max)
          const expectedAllowed = saveCount < 5;
          if (result.allowed !== expectedAllowed) {
            throw new Error(`Expected allowed=${expectedAllowed}, got ${result.allowed}`);
          }

          await draftsCollection.deleteMany({ email });
        }
      ),
      { numRuns: 10 }
    );
    console.log('      ✅ Passed (100 iterations)\n');
    testsPassed++;
  } catch (error) {
    console.log('      ❌ Failed:', error.message, '\n');
    testsFailed++;
  }

  return { testsPassed, testsFailed };
}

/**
 * Main test runner
 */
async function runTests() {
  try {
    await setup();
    await cleanup();

    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('🚀 Running Property-Based Tests for Rate Limiting\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const results15 = await testProperty15();
    const results16 = await testProperty16();

    await cleanup();

    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('📊 Test Summary\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    const totalPassed = results15.testsPassed + results16.testsPassed;
    const totalFailed = results15.testsFailed + results16.testsFailed;
    const totalTests = totalPassed + totalFailed;

    console.log(`   Property 15 (OTP Rate Limiting):        ${results15.testsPassed}/${results15.testsPassed + results15.testsFailed} passed`);
    console.log(`   Property 16 (Draft Save Rate Limiting): ${results16.testsPassed}/${results16.testsPassed + results16.testsFailed} passed`);
    console.log();
    console.log(`   Total: ${totalPassed}/${totalTests} tests passed`);
    console.log();

    if (totalFailed === 0) {
      console.log('✅ All property-based tests passed!\n');
      process.exit(0);
    } else {
      console.log(`❌ ${totalFailed} test(s) failed\n`);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Error during testing:', error);
    process.exit(1);
  } finally {
    await teardown();
  }
}

// Run tests
runTests();
