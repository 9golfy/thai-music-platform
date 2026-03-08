// Verify Draft Submissions TTL Index Script
// Run: node scripts/verify-draft-ttl.js
// Purpose: Verify that the TTL index is working correctly by checking test documents

require('dotenv').config();
const { MongoClient } = require('mongodb');

// Use localhost for running from host machine
const uri = process.env.MONGODB_URI?.replace('mongo:', 'localhost:') || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function verifyTTL() {
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const database = client.db(dbName);
    const draftsCollection = database.collection('draft_submissions');

    // Check for test documents
    console.log('🔍 Checking for test documents...');
    const testDrafts = await draftsCollection.find({ 
      draftToken: { $regex: /^test-token-/ } 
    }).toArray();

    if (testDrafts.length === 0) {
      console.log('✅ No test documents found - TTL index is working correctly!');
      console.log('   All expired test documents have been automatically deleted.\n');
    } else {
      console.log(`ℹ️  Found ${testDrafts.length} test document(s):\n`);
      testDrafts.forEach((draft, i) => {
        const now = new Date();
        const expiresAt = new Date(draft.expiresAt);
        const secondsUntilExpiry = Math.floor((expiresAt - now) / 1000);
        
        console.log(`   ${i + 1}. Token: ${draft.draftToken}`);
        console.log(`      Created: ${draft.createdAt.toISOString()}`);
        console.log(`      Expires: ${expiresAt.toISOString()}`);
        
        if (secondsUntilExpiry > 0) {
          console.log(`      Status: ⏳ Will expire in ${secondsUntilExpiry} seconds`);
        } else {
          console.log(`      Status: ⏰ Expired ${Math.abs(secondsUntilExpiry)} seconds ago (pending deletion)`);
        }
        console.log('');
      });
      
      console.log('ℹ️  Note: MongoDB TTL index runs every 60 seconds.');
      console.log('   Expired documents may take up to 60 seconds to be deleted.\n');
    }

    // Show collection stats
    console.log('📊 Collection Statistics:');
    const totalDrafts = await draftsCollection.countDocuments();
    const activeDrafts = await draftsCollection.countDocuments({ status: 'active' });
    const expiredDrafts = await draftsCollection.countDocuments({ 
      expiresAt: { $lt: new Date() } 
    });

    console.log(`   Total drafts: ${totalDrafts}`);
    console.log(`   Active drafts: ${activeDrafts}`);
    console.log(`   Expired (pending deletion): ${expiredDrafts}`);

    // Show indexes
    console.log('\n📋 Indexes:');
    const indexes = await draftsCollection.indexes();
    indexes.forEach((index) => {
      if (index.name === 'ttl_expiresAt') {
        console.log(`   ✅ TTL Index: ${index.name}`);
        console.log(`      Keys: ${JSON.stringify(index.key)}`);
        console.log(`      Expire After: ${index.expireAfterSeconds} seconds`);
      }
    });

    console.log('\n✅ Verification complete!');

  } catch (error) {
    console.error('\n❌ Error verifying TTL:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run verification
verifyTTL();
