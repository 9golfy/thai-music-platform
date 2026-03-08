require('dotenv').config();
const { MongoClient } = require('mongodb');

// Use localhost for running from host machine
const uri = process.env.MONGODB_URI?.replace('mongo:', 'localhost:') || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

console.log('📍 Connecting to:', uri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in log

async function deleteTestData() {
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db(dbName);

    console.log('🗑️ Starting deletion of test data...');

    // Delete register100 test data
    const register100Collection = database.collection('register100_submissions');
    const register100Result = await register100Collection.deleteMany({
      $or: [
        { 'reg100_schoolName': { $regex: 'ทดสอบ' } },
        { 'reg100_schoolName': { $regex: 'Test' } },
        { 'reg100_schoolName': { $regex: 'โรงเรียนสนับสนุน 9 ครู Full' } },
        { 'reg100_schoolName': { $regex: 'โรงเรียนทดสอบ' } },
        { 'reg100_mgtEmail': 'thaimusicplatform@gmail.com' },
        { 'reg100_mgtEmail': 'fatcatdigitalco@gmail.com' },
        { 'reg100_mgtEmail': 'pacncancercenter@gmail.com' },
        { 'reg100_mgtEmail': 'kaibandon2021@gmail.com' }
      ]
    });
    console.log(`✅ Deleted ${register100Result.deletedCount} register100 test records`);

    // Delete register-support test data
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportResult = await registerSupportCollection.deleteMany({
      $or: [
        { 'regsup_schoolName': { $regex: 'ทดสอบ' } },
        { 'regsup_schoolName': { $regex: 'Test' } },
        { 'regsup_schoolName': { $regex: 'โรงเรียนสนับสนุน 9 ครู Full' } },
        { 'regsup_schoolName': { $regex: 'โรงเรียนทดสอบ' } },
        { 'regsup_mgtEmail': 'thaimusicplatform@gmail.com' },
        { 'regsup_mgtEmail': 'fatcatdigitalco@gmail.com' },
        { 'regsup_mgtEmail': 'pacncancercenter@gmail.com' },
        { 'regsup_mgtEmail': 'kaibandon2021@gmail.com' }
      ]
    });
    console.log(`✅ Deleted ${registerSupportResult.deletedCount} register-support test records`);

    // Delete test users
    const usersCollection = database.collection('users');
    const usersResult = await usersCollection.deleteMany({
      $or: [
        { 'email': 'thaimusicplatform@gmail.com' },
        { 'email': 'fatcatdigitalco@gmail.com' },
        { 'email': 'pacncancercenter@gmail.com' },
        { 'email': 'kaibandon2021@gmail.com' },
        { 'email': { $regex: 'test' } },
        { 'email': { $regex: 'ทดสอบ' } },
        { 'phone': '0899297983' }
      ]
    });
    console.log(`✅ Deleted ${usersResult.deletedCount} test users`);

    // Delete draft submissions with test emails
    const draftsCollection = database.collection('draft_submissions');
    const draftsResult = await draftsCollection.deleteMany({
      $or: [
        { 'email': 'thaimusicplatform@gmail.com' },
        { 'email': 'fatcatdigitalco@gmail.com' },
        { 'email': 'pacncancercenter@gmail.com' },
        { 'email': 'kaibandon2021@gmail.com' },
        { 'email': { $regex: 'test' } },
        { 'email': { $regex: 'ทดสอบ' } }
      ]
    });
    console.log(`✅ Deleted ${draftsResult.deletedCount} test draft submissions`);

    console.log('\n🎉 All test data deleted successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Register100 records: ${register100Result.deletedCount} deleted`);
    console.log(`- Register-Support records: ${registerSupportResult.deletedCount} deleted`);
    console.log(`- Users: ${usersResult.deletedCount} deleted`);
    console.log(`- Draft submissions: ${draftsResult.deletedCount} deleted`);

    // Show remaining counts
    console.log('\n📊 Remaining data:');
    const remainingReg100 = await register100Collection.countDocuments();
    const remainingRegSupport = await registerSupportCollection.countDocuments();
    const remainingUsers = await usersCollection.countDocuments();
    const remainingDrafts = await draftsCollection.countDocuments();

    console.log(`- Register100 records: ${remainingReg100}`);
    console.log(`- Register-Support records: ${remainingRegSupport}`);
    console.log(`- Users: ${remainingUsers}`);
    console.log(`- Draft submissions: ${remainingDrafts}`);

  } catch (error) {
    console.error('❌ Error deleting test data:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the deletion
deleteTestData();