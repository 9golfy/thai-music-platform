// Script to clear all test data for fresh testing
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function clearAllTestData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    
    // Get all school IDs before deletion
    console.log('\n=== Getting School IDs ===');
    const register100Collection = database.collection('register100_submissions');
    const registerSupportCollection = database.collection('register_support_submissions');
    
    const register100Schools = await register100Collection.find({}, { projection: { schoolId: 1, schoolName: 1 } }).toArray();
    const registerSupportSchools = await registerSupportCollection.find({}, { projection: { schoolId: 1, schoolName: 1 } }).toArray();
    
    const allSchoolIds = [
      ...register100Schools.map(s => s.schoolId),
      ...registerSupportSchools.map(s => s.schoolId)
    ];
    
    console.log(`Found ${allSchoolIds.length} schools to delete:`, allSchoolIds);
    
    // 1. Delete all register100 submissions
    console.log('\n=== Deleting Register100 Submissions ===');
    const register100Result = await register100Collection.deleteMany({});
    console.log(`Deleted ${register100Result.deletedCount} register100 submissions`);
    
    // 2. Delete all register-support submissions
    console.log('\n=== Deleting Register-Support Submissions ===');
    const registerSupportResult = await registerSupportCollection.deleteMany({});
    console.log(`Deleted ${registerSupportResult.deletedCount} register-support submissions`);
    
    // 3. Delete all certificates
    console.log('\n=== Deleting Certificates ===');
    const certificatesCollection = database.collection('certificates');
    const certificatesResult = await certificatesCollection.deleteMany({});
    console.log(`Deleted ${certificatesResult.deletedCount} certificates`);
    
    // 4. Delete all users (teachers) associated with these schools
    console.log('\n=== Deleting Users (Teachers) ===');
    const usersCollection = database.collection('users');
    
    if (allSchoolIds.length > 0) {
      const usersResult = await usersCollection.deleteMany({
        schoolId: { $in: allSchoolIds }
      });
      console.log(`Deleted ${usersResult.deletedCount} users (teachers)`);
    } else {
      console.log('No school IDs found, skipping user deletion');
    }
    
    // 5. Delete draft submissions
    console.log('\n=== Deleting Draft Submissions ===');
    const draftCollection = database.collection('draft_submissions');
    const draftResult = await draftCollection.deleteMany({});
    console.log(`Deleted ${draftResult.deletedCount} draft submissions`);
    
    // 6. Delete user consents
    console.log('\n=== Deleting User Consents ===');
    const consentsCollection = database.collection('user_consents');
    const consentsResult = await consentsCollection.deleteMany({});
    console.log(`Deleted ${consentsResult.deletedCount} user consents`);
    
    console.log('\n✅ All test data cleared successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Register100 submissions: ${register100Result.deletedCount}`);
    console.log(`- Register-Support submissions: ${registerSupportResult.deletedCount}`);
    console.log(`- Certificates: ${certificatesResult.deletedCount}`);
    console.log(`- Users (Teachers): ${allSchoolIds.length > 0 ? 'Deleted based on school IDs' : '0'}`);
    console.log(`- Draft submissions: ${draftResult.deletedCount}`);
    console.log(`- User consents: ${consentsResult.deletedCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

clearAllTestData();