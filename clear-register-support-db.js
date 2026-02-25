const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://mongodb:27017';
const DB_NAME = 'thai_music_school';
const COLLECTION_NAME = 'register_support_submissions';

async function clearDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Count documents before deletion
    const countBefore = await collection.countDocuments();
    console.log(`\nFound ${countBefore} documents in ${COLLECTION_NAME}`);
    
    if (countBefore === 0) {
      console.log('Collection is already empty. Nothing to delete.');
      return;
    }
    
    // Delete all documents
    const result = await collection.deleteMany({});
    console.log(`\n✅ Deleted ${result.deletedCount} documents from ${COLLECTION_NAME}`);
    
    // Verify deletion
    const countAfter = await collection.countDocuments();
    console.log(`Remaining documents: ${countAfter}`);
    
    if (countAfter === 0) {
      console.log('\n✅ Collection cleared successfully!');
    } else {
      console.log('\n⚠️ Warning: Some documents may still remain');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

clearDatabase();
