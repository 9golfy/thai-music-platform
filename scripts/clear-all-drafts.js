const { MongoClient } = require('mongodb');

async function clearAllDrafts() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/thai-music-platform');
  
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('draft_submissions');
    
    console.log('🗑️  Clearing all draft submissions...\n');
    
    // Count existing drafts first
    const count = await collection.countDocuments();
    console.log(`📊 Found ${count} draft submissions`);
    
    if (count === 0) {
      console.log('✅ No drafts to delete');
      return;
    }
    
    // Show some examples before deleting
    const samples = await collection.find({}).limit(3).toArray();
    console.log('\n📋 Sample drafts to be deleted:');
    samples.forEach((draft, index) => {
      console.log(`   ${index + 1}. Token: ${draft.token}`);
      console.log(`      Email: ${draft.email}`);
      console.log(`      Type: ${draft.submissionType}`);
      console.log(`      Created: ${draft.createdAt}`);
    });
    
    // Delete all drafts
    const result = await collection.deleteMany({});
    
    console.log(`\n✅ Successfully deleted ${result.deletedCount} draft submissions`);
    console.log('🎉 All drafts cleared! Ready for fresh testing.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

clearAllDrafts();