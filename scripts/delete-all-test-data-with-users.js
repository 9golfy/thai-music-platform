const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function deleteAllTestDataWithUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    console.log('🗑️  Delete All Test Data + Related Users');
    console.log('='.repeat(50));
    
    const register100Collection = database.collection('register100_submissions');
    const registerSupportCollection = database.collection('register_support_submissions');
    const certificatesCollection = database.collection('certificates');
    const usersCollection = database.collection('users');
    
    // Get current counts
    const register100Count = await register100Collection.countDocuments();
    const registerSupportCount = await registerSupportCollection.countDocuments();
    const certificatesCount = await certificatesCollection.countDocuments();
    const usersCount = await usersCollection.countDocuments();
    
    console.log('\n📊 Current Data Counts:');
    console.log(`📋 Register100 submissions: ${register100Count}`);
    console.log(`📋 Register-Support submissions: ${registerSupportCount}`);
    console.log(`📜 Certificates: ${certificatesCount}`);
    console.log(`👥 Users: ${usersCount}`);
    
    // Get all school IDs that will be deleted
    const register100Records = await register100Collection.find({}).toArray();
    const registerSupportRecords = await registerSupportCollection.find({}).toArray();
    
    const schoolIdsToDelete = new Set([
      ...register100Records.map(r => r.schoolId).filter(Boolean),
      ...registerSupportRecords.map(r => r.schoolId).filter(Boolean)
    ]);
    
    console.log(`\n🏫 School IDs to be deleted: ${schoolIdsToDelete.size}`);
    console.log('School IDs:', Array.from(schoolIdsToDelete));
    
    // Find users related to these schools
    const relatedUsers = await usersCollection.find({
      schoolId: { $in: Array.from(schoolIdsToDelete) }
    }).toArray();
    
    // Find admin users (keep these)
    const adminUsers = await usersCollection.find({
      $or: [
        { schoolId: { $exists: false } },
        { schoolId: null },
        { schoolId: '' },
        { email: /admin|root/i }
      ]
    }).toArray();
    
    console.log('\n👥 Users Analysis:');
    console.log(`🗑️  Users to delete: ${relatedUsers.length}`);
    console.log(`👑 Admin users to keep: ${adminUsers.length}`);
    
    if (relatedUsers.length > 0) {
      console.log('\n📋 Users to be deleted:');
      relatedUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (School ID: ${user.schoolId})`);
      });
    }
    
    if (adminUsers.length > 0) {
      console.log('\n👑 Admin users to keep:');
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.schoolId || 'No school ID'})`);
      });
    }
    
    const totalRecords = register100Count + registerSupportCount + certificatesCount;
    const totalToDelete = totalRecords + relatedUsers.length;
    
    console.log('\n📊 DELETION SUMMARY:');
    console.log('-'.repeat(30));
    console.log(`🗑️  Register100 submissions: ${register100Count}`);
    console.log(`🗑️  Register-Support submissions: ${registerSupportCount}`);
    console.log(`🗑️  Certificates: ${certificatesCount}`);
    console.log(`🗑️  Related users: ${relatedUsers.length}`);
    console.log(`📊 Total records to delete: ${totalToDelete}`);
    
    if (totalToDelete === 0) {
      console.log('\n✅ Database is already clean - no records to delete!');
      return;
    }
    
    console.log('\n⚠️  WARNING: This will delete ALL test data and related users!');
    console.log('Admin users will be preserved.');
    console.log('This action is irreversible.');
    console.log('\nTo proceed with deletion, run:');
    console.log('CONFIRM_DELETE=true node scripts/delete-all-test-data-with-users.js');
    
    // Check if we should actually execute the deletion
    if (process.env.CONFIRM_DELETE === 'true') {
      console.log('\n🚀 EXECUTING COMPLETE DELETION...');
      console.log('-'.repeat(40));
      
      let deletedCount = 0;
      
      // Delete certificates first
      if (certificatesCount > 0) {
        const certDeleteResult = await certificatesCollection.deleteMany({});
        console.log(`✅ Deleted ${certDeleteResult.deletedCount} certificates`);
        deletedCount += certDeleteResult.deletedCount;
      }
      
      // Delete register100 submissions
      if (register100Count > 0) {
        const reg100DeleteResult = await register100Collection.deleteMany({});
        console.log(`✅ Deleted ${reg100DeleteResult.deletedCount} register100 submissions`);
        deletedCount += reg100DeleteResult.deletedCount;
      }
      
      // Delete register-support submissions
      if (registerSupportCount > 0) {
        const regSupportDeleteResult = await registerSupportCollection.deleteMany({});
        console.log(`✅ Deleted ${regSupportDeleteResult.deletedCount} register-support submissions`);
        deletedCount += regSupportDeleteResult.deletedCount;
      }
      
      // Delete related users (but keep admin users)
      if (relatedUsers.length > 0) {
        const userDeleteResult = await usersCollection.deleteMany({
          schoolId: { $in: Array.from(schoolIdsToDelete) }
        });
        console.log(`✅ Deleted ${userDeleteResult.deletedCount} related users`);
        deletedCount += userDeleteResult.deletedCount;
      }
      
      console.log('\n🎉 DELETION COMPLETED SUCCESSFULLY!');
      console.log(`📊 Total records deleted: ${deletedCount}`);
      console.log('Database is now completely clean and ready for fresh testing.');
      console.log('Admin users have been preserved.');
      
      // Verify deletion
      const finalRegister100Count = await register100Collection.countDocuments();
      const finalRegisterSupportCount = await registerSupportCollection.countDocuments();
      const finalCertificatesCount = await certificatesCollection.countDocuments();
      const finalUsersCount = await usersCollection.countDocuments();
      
      console.log('\n✅ VERIFICATION - Final Counts:');
      console.log(`📋 Register100 submissions: ${finalRegister100Count}`);
      console.log(`📋 Register-Support submissions: ${finalRegisterSupportCount}`);
      console.log(`📜 Certificates: ${finalCertificatesCount}`);
      console.log(`👥 Users: ${finalUsersCount}`);
      
      if (finalRegister100Count === 0 && finalRegisterSupportCount === 0 && finalCertificatesCount === 0) {
        console.log('\n🎯 SUCCESS: All test data deleted!');
        console.log(`👑 ${finalUsersCount} admin user(s) preserved`);
        console.log('Ready for fresh test data creation.');
      } else {
        console.log('\n⚠️  WARNING: Some records may still remain.');
      }
    }
    
  } catch (error) {
    console.error('❌ Error during deletion process:', error);
  } finally {
    await client.close();
  }
}

deleteAllTestDataWithUsers();