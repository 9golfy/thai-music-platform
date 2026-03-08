const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function deleteAllTestData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    console.log('🗑️  Delete All Test Data (Confirmed)');
    console.log('='.repeat(50));
    
    const register100Collection = database.collection('register100_submissions');
    const registerSupportCollection = database.collection('register_support_submissions');
    const certificatesCollection = database.collection('certificates');
    
    // Get current counts
    const register100Count = await register100Collection.countDocuments();
    const registerSupportCount = await registerSupportCollection.countDocuments();
    const certificatesCount = await certificatesCollection.countDocuments();
    
    console.log('\n📊 Current Data Counts:');
    console.log(`📋 Register100 submissions: ${register100Count}`);
    console.log(`📋 Register-Support submissions: ${registerSupportCount}`);
    console.log(`📜 Certificates: ${certificatesCount}`);
    
    // Show all records that will be deleted
    console.log('\n🔍 All Records to be Deleted:');
    console.log('-'.repeat(40));
    
    console.log('\n📋 Register100 Records:');
    const register100Records = await register100Collection.find({}).toArray();
    register100Records.forEach((record, index) => {
      const schoolName = record.reg100_schoolName || record.schoolName || 'Unknown';
      const schoolId = record.schoolId || 'No ID';
      console.log(`${index + 1}. ${schoolName} (ID: ${schoolId})`);
    });
    
    console.log('\n📋 Register-Support Records:');
    const registerSupportRecords = await registerSupportCollection.find({}).toArray();
    registerSupportRecords.forEach((record, index) => {
      const schoolName = record.regsup_schoolName || record.schoolName || 'Unknown';
      const schoolId = record.schoolId || 'No ID';
      console.log(`${index + 1}. ${schoolName} (ID: ${schoolId})`);
    });
    
    console.log('\n📜 Certificate Records:');
    const certificateRecords = await certificatesCollection.find({}).toArray();
    if (certificateRecords.length === 0) {
      console.log('No certificates found.');
    } else {
      certificateRecords.forEach((record, index) => {
        console.log(`${index + 1}. School ID: ${record.schoolId}, Template: ${record.templateName || 'No template'}`);
      });
    }
    
    const totalRecords = register100Count + registerSupportCount + certificatesCount;
    
    console.log('\n📊 DELETION SUMMARY:');
    console.log('-'.repeat(30));
    console.log(`🗑️  Total records to delete: ${totalRecords}`);
    console.log(`📋 Register100: ${register100Count} records`);
    console.log(`📋 Register-Support: ${registerSupportCount} records`);
    console.log(`📜 Certificates: ${certificatesCount} records`);
    
    if (totalRecords === 0) {
      console.log('\n✅ Database is already clean - no records to delete!');
      return;
    }
    
    console.log('\n⚠️  WARNING: This will delete ALL data in the collections!');
    console.log('This action is irreversible.');
    console.log('\nTo proceed with deletion, run:');
    console.log('CONFIRM_DELETE=true node scripts/delete-all-test-data-confirmed.js');
    
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
      
      console.log('\n🎉 DELETION COMPLETED SUCCESSFULLY!');
      console.log(`📊 Total records deleted: ${deletedCount}`);
      console.log('Database is now completely clean and ready for fresh testing.');
      
      // Verify deletion
      const finalRegister100Count = await register100Collection.countDocuments();
      const finalRegisterSupportCount = await registerSupportCollection.countDocuments();
      const finalCertificatesCount = await certificatesCollection.countDocuments();
      
      console.log('\n✅ VERIFICATION - Final Counts:');
      console.log(`📋 Register100 submissions: ${finalRegister100Count}`);
      console.log(`📋 Register-Support submissions: ${finalRegisterSupportCount}`);
      console.log(`📜 Certificates: ${finalCertificatesCount}`);
      
      if (finalRegister100Count === 0 && finalRegisterSupportCount === 0 && finalCertificatesCount === 0) {
        console.log('\n🎯 SUCCESS: Database is completely clean!');
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

deleteAllTestData();