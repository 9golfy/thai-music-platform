/**
 * Clear Register100 Data Script
 * 
 * Clears all register100 submissions and users for fresh testing
 * 
 * Usage: node scripts/clear-register100-data.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function clearData() {
  console.log('🗑️ Clearing Register100 Data...\n');
  
  const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  const dbName = 'thai_music_school';
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    
    console.log('✅ Connected successfully!\n');
    
    // Clear register100_submissions collection
    console.log('🗑️ Clearing register100_submissions...');
    const register100Collection = db.collection('register100_submissions');
    const register100Result = await register100Collection.deleteMany({});
    console.log(`✅ Deleted ${register100Result.deletedCount} register100 submissions`);
    
    // Clear register-support collection
    console.log('🗑️ Clearing register-support...');
    const registerSupportCollection = db.collection('register-support');
    const registerSupportResult = await registerSupportCollection.deleteMany({});
    console.log(`✅ Deleted ${registerSupportResult.deletedCount} register-support submissions`);
    
    // Clear teacher users (keep admin)
    console.log('🗑️ Clearing teacher users...');
    const usersCollection = db.collection('users');
    const usersResult = await usersCollection.deleteMany({ role: 'teacher' });
    console.log(`✅ Deleted ${usersResult.deletedCount} teacher users`);
    
    // Check remaining data
    console.log('\n📊 Remaining data:');
    const remainingUsers = await usersCollection.countDocuments();
    console.log(`  Users: ${remainingUsers} (should be 1 admin)`);
    
    const remainingRegister100 = await register100Collection.countDocuments();
    console.log(`  Register100: ${remainingRegister100} (should be 0)`);
    
    const remainingRegisterSupport = await registerSupportCollection.countDocuments();
    console.log(`  Register-Support: ${remainingRegisterSupport} (should be 0)`);
    
    await client.close();
    console.log('\n🎉 Data cleared successfully!');
    console.log('🧪 Ready for fresh testing with Playwright');
    
  } catch (error) {
    console.error('\n❌ Failed to clear data:', error.message);
    process.exit(1);
  }
}

// Run script
clearData().catch(console.error);