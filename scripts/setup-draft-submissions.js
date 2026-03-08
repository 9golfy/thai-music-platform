// Setup Draft Submissions Collection Script
// Run: node scripts/setup-draft-submissions.js
// Purpose: Create draft_submissions collection with indexes for save-draft-hybrid feature

require('dotenv').config();
const { MongoClient } = require('mongodb');

// Use localhost for running from host machine
const uri = process.env.MONGODB_URI?.replace('mongo:', 'localhost:') || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

console.log('📍 Connecting to:', uri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in log

async function setupDraftSubmissions() {
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db(dbName);

    // Create draft_submissions collection
    console.log('\n📦 Creating draft_submissions collection...');
    try {
      await database.createCollection('draft_submissions');
      console.log('✅ Created collection: draft_submissions');
    } catch (error) {
      if (error.code === 48) {
        console.log('ℹ️  Collection already exists: draft_submissions');
      } else {
        throw error;
      }
    }

    const draftsCollection = database.collection('draft_submissions');

    // Create indexes
    console.log('\n🔍 Creating indexes...');

    // 1. TTL index on expiresAt field (7-day auto-deletion)
    console.log('Creating TTL index on expiresAt...');
    await draftsCollection.createIndex(
      { expiresAt: 1 },
      { 
        expireAfterSeconds: 0,
        name: 'ttl_expiresAt'
      }
    );
    console.log('✅ Created TTL index on expiresAt (auto-deletes after 7 days)');

    // 2. Unique index on draftToken field
    console.log('Creating unique index on draftToken...');
    await draftsCollection.createIndex(
      { draftToken: 1 },
      { 
        unique: true,
        name: 'unique_draftToken'
      }
    );
    console.log('✅ Created unique index on draftToken');

    // 3. Index on email field for lookups
    console.log('Creating index on email...');
    await draftsCollection.createIndex(
      { email: 1 },
      { name: 'idx_email' }
    );
    console.log('✅ Created index on email');

    // 4. Compound index on email, submissionType, status
    console.log('Creating compound index on email, submissionType, status...');
    await draftsCollection.createIndex(
      { email: 1, submissionType: 1, status: 1 },
      { name: 'idx_email_type_status' }
    );
    console.log('✅ Created compound index on email, submissionType, status');

    // Test TTL index behavior with test documents
    console.log('\n🧪 Testing TTL index behavior...');
    
    // Insert a test document that expires in 10 seconds
    const testDraft = {
      draftToken: 'test-token-' + Date.now(),
      email: 'test@example.com',
      phone: '0812345678',
      submissionType: 'register100',
      formData: { test: true },
      currentStep: 1,
      createdAt: new Date(),
      lastModified: new Date(),
      expiresAt: new Date(Date.now() + 10000), // Expires in 10 seconds
      status: 'active',
      saveCount: 1,
      lastSaveAt: new Date(),
      otpAttempts: 0,
      otpRequestCount: 0
    };

    await draftsCollection.insertOne(testDraft);
    console.log('✅ Inserted test document (expires in 10 seconds)');
    console.log(`   Draft Token: ${testDraft.draftToken}`);
    console.log(`   Expires At: ${testDraft.expiresAt.toISOString()}`);

    // Verify the document exists
    const foundDraft = await draftsCollection.findOne({ draftToken: testDraft.draftToken });
    if (foundDraft) {
      console.log('✅ Test document verified in database');
    } else {
      console.log('❌ Test document not found');
    }

    console.log('\nℹ️  The test document will be automatically deleted by MongoDB after 10 seconds.');
    console.log('   You can verify this by running:');
    console.log(`   db.draft_submissions.findOne({ draftToken: "${testDraft.draftToken}" })`);
    console.log('   Wait 10+ seconds and run the query again - it should return null.');

    // List all indexes
    console.log('\n📋 Listing all indexes on draft_submissions:');
    const indexes = await draftsCollection.indexes();
    indexes.forEach((index, i) => {
      console.log(`   ${i + 1}. ${index.name}:`);
      console.log(`      Keys: ${JSON.stringify(index.key)}`);
      if (index.unique) console.log(`      Unique: true`);
      if (index.expireAfterSeconds !== undefined) {
        console.log(`      TTL: ${index.expireAfterSeconds} seconds`);
      }
    });

    // Summary
    console.log('\n📊 Collection Summary:');
    const draftCount = await draftsCollection.countDocuments();
    console.log(`   Total drafts: ${draftCount}`);
    
    const activeDrafts = await draftsCollection.countDocuments({ status: 'active' });
    console.log(`   Active drafts: ${activeDrafts}`);

    console.log('\n✅ Draft submissions collection setup completed successfully!');
    console.log('\n📝 Collection Details:');
    console.log('   Name: draft_submissions');
    console.log('   Indexes: 5 (including _id)');
    console.log('   - TTL index on expiresAt (auto-deletion after 7 days)');
    console.log('   - Unique index on draftToken');
    console.log('   - Index on email');
    console.log('   - Compound index on email, submissionType, status');

    console.log('\n🚀 Next Steps:');
    console.log('   1. Implement draft save API: POST /api/draft/save');
    console.log('   2. Implement OTP verification APIs');
    console.log('   3. Integrate with registration forms');

  } catch (error) {
    console.error('\n❌ Error setting up draft_submissions collection:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run setup
setupDraftSubmissions();
