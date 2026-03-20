const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function clearTestData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const database = client.db(dbName);
    
    // Collections to clear
    const collections = [
      'register100_submissions',
      'register_support_submissions', 
      'certificates',
      'users'
    ];
    
    console.log('\n🗑️  Clearing test data from all collections...\n');
    
    for (const collectionName of collections) {
      const collection = database.collection(collectionName);
      
      // Count documents before deletion
      const countBefore = await collection.countDocuments();
      
      if (countBefore > 0) {
        if (collectionName === 'users') {
          // For users collection, protect system admin
          const result = await collection.deleteMany({
            $and: [
              { isSystemAdmin: { $ne: true } },
              { email: { $ne: 'root@thaimusic.com' } }
            ]
          });
          
          const remainingCount = await collection.countDocuments();
          const deletedCount = countBefore - remainingCount;
          
          console.log(`✅ ${collectionName}: Deleted ${deletedCount} documents (was ${countBefore}, ${remainingCount} protected)`);
          
          if (remainingCount > 0) {
            const protectedUsers = await collection.find({}, { projection: { email: 1, isSystemAdmin: 1 } }).toArray();
            protectedUsers.forEach(user => {
              const reason = user.isSystemAdmin ? 'System Admin' : 'Protected Email';
              console.log(`   🛡️  Protected: ${user.email} (${reason})`);
            });
          }
        } else {
          // Delete all documents from other collections
          const result = await collection.deleteMany({});
          console.log(`✅ ${collectionName}: Deleted ${result.deletedCount} documents (was ${countBefore})`);
        }
      } else {
        console.log(`ℹ️  ${collectionName}: Already empty (0 documents)`);
      }
    }
    
    console.log('\n🎉 Test data cleared successfully!');
    console.log('\n📝 Summary:');
    console.log('   • All register100 submissions deleted');
    console.log('   • All register-support submissions deleted');
    console.log('   • All certificates deleted');
    console.log('   • Test users deleted (System admin protected)');
    console.log('\n✨ Database is clean and ready for fresh testing');
    console.log('🛡️  System admin remains protected and available');
    
  } catch (error) {
    console.error('❌ Error clearing test data:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the script
clearTestData();