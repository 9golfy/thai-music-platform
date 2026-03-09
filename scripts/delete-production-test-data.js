const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@thai-music-mongo:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function deleteTestData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(dbName);

    // Delete test schools from register100_submissions
    const register100Collection = database.collection('register100_submissions');
    const register100Result = await register100Collection.deleteMany({
      $or: [
        { reg100_schoolName: { $regex: /ทดสอบ|Test|test/i } },
        { reg100_schoolName: { $regex: /Production Server/i } },
        { reg100_schoolName: { $regex: /Full Fields Complete/i } }
      ]
    });
    console.log(`Deleted ${register100Result.deletedCount} register100 test submissions`);

    // Delete test schools from register_support_submissions
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportResult = await registerSupportCollection.deleteMany({
      $or: [
        { regsup_schoolName: { $regex: /ทดสอบ|Test|test/i } },
        { regsup_schoolName: { $regex: /Production Server/i } },
        { regsup_schoolName: { $regex: /Full Fields Complete/i } }
      ]
    });
    console.log(`Deleted ${registerSupportResult.deletedCount} register-support test submissions`);

    // Delete test users
    const usersCollection = database.collection('users');
    const usersResult = await usersCollection.deleteMany({
      $or: [
        { email: { $regex: /test|ทดสอบ|kaibandon2021@gmail.com|9golfy@gmail.com/i } },
        { phone: '0899297983' }
      ]
    });
    console.log(`Deleted ${usersResult.deletedCount} test users`);

    // Delete test draft submissions
    const draftCollection = database.collection('draft_submissions');
    const draftResult = await draftCollection.deleteMany({
      $or: [
        { schoolName: { $regex: /ทดสอบ|Test|test/i } },
        { teacherEmail: { $regex: /test|ทดสอบ|kaibandon2021@gmail.com|9golfy@gmail.com/i } }
      ]
    });
    console.log(`Deleted ${draftResult.deletedCount} test draft submissions`);

    // Delete test user consents
    const consentCollection = database.collection('user_consents');
    const consentResult = await consentCollection.deleteMany({
      email: { $regex: /test|ทดสอบ|kaibandon2021@gmail.com|9golfy@gmail.com/i }
    });
    console.log(`Deleted ${consentResult.deletedCount} test user consents`);

    console.log('\n✅ All test data deleted successfully!');
    
    // Show remaining data count
    const remainingRegister100 = await register100Collection.countDocuments();
    const remainingRegisterSupport = await registerSupportCollection.countDocuments();
    const remainingUsers = await usersCollection.countDocuments();
    
    console.log('\n📊 Remaining data:');
    console.log(`- Register100 submissions: ${remainingRegister100}`);
    console.log(`- Register-support submissions: ${remainingRegisterSupport}`);
    console.log(`- Users: ${remainingUsers}`);

  } catch (error) {
    console.error('Error deleting test data:', error);
  } finally {
    await client.close();
  }
}

deleteTestData();