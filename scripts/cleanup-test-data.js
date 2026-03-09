const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function cleanupTestData() {
  let client;
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('thai_music_school');
    const register100Collection = db.collection('register100_submissions');
    const registerSupportCollection = db.collection('register_support_submissions');
    const usersCollection = db.collection('users');
    
    console.log('🗑️ Cleaning up test data...');
    
    // Delete test submissions (those with test emails)
    const register100Result = await register100Collection.deleteMany({
      teacherEmail: { $regex: /^test.*@testschool\.com$/ }
    });
    
    const registerSupportResult = await registerSupportCollection.deleteMany({
      teacherEmail: { $regex: /^test.*@testschool\.com$/ }
    });
    
    // Delete test user accounts
    const usersResult = await usersCollection.deleteMany({
      email: { $regex: /^test.*@testschool\.com$/ }
    });
    
    console.log('\n📊 Cleanup Summary:');
    console.log('='.repeat(40));
    console.log(`Register100 records deleted: ${register100Result.deletedCount}`);
    console.log(`Register-Support records deleted: ${registerSupportResult.deletedCount}`);
    console.log(`User accounts deleted: ${usersResult.deletedCount}`);
    console.log(`Total records deleted: ${register100Result.deletedCount + registerSupportResult.deletedCount + usersResult.deletedCount}`);
    
    console.log('\n✅ Test data cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
if (require.main === module) {
  cleanupTestData()
    .then(() => {
      console.log('✅ Cleanup script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Cleanup script failed:', error);
      process.exit(1);
    });
}

module.exports = { cleanupTestData };