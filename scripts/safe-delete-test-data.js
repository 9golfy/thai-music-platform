const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function safeDeleteTestData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    console.log('🗑️  Safe Test Data Deletion');
    console.log('='.repeat(50));
    
    // First, let's see what data we have
    console.log('\n📊 Current Data Overview:');
    console.log('-'.repeat(30));
    
    const register100Collection = database.collection('register100_submissions');
    const registerSupportCollection = database.collection('register_support_submissions');
    const certificatesCollection = database.collection('certificates');
    
    const register100Count = await register100Collection.countDocuments();
    const registerSupportCount = await registerSupportCollection.countDocuments();
    const certificatesCount = await certificatesCollection.countDocuments();
    
    console.log(`📋 Register100 submissions: ${register100Count}`);
    console.log(`📋 Register-Support submissions: ${registerSupportCount}`);
    console.log(`📜 Certificates: ${certificatesCount}`);
    
    // Show sample data to identify test records
    console.log('\n🔍 Sample Register100 Records:');
    const register100Sample = await register100Collection.find({}).limit(10).toArray();
    register100Sample.forEach((record, index) => {
      const schoolName = record.reg100_schoolName || record.schoolName || 'Unknown';
      const schoolId = record.schoolId || 'No ID';
      console.log(`${index + 1}. ${schoolName} (ID: ${schoolId})`);
    });
    
    console.log('\n🔍 Sample Register-Support Records:');
    const registerSupportSample = await registerSupportCollection.find({}).limit(10).toArray();
    registerSupportSample.forEach((record, index) => {
      const schoolName = record.regsup_schoolName || record.schoolName || 'Unknown';
      const schoolId = record.schoolId || 'No ID';
      console.log(`${index + 1}. ${schoolName} (ID: ${schoolId})`);
    });
    
    console.log('\n🔍 Sample Certificate Records:');
    const certificatesSample = await certificatesCollection.find({}).limit(10).toArray();
    certificatesSample.forEach((record, index) => {
      const schoolId = record.schoolId || 'No ID';
      const templateName = record.templateName || 'No template';
      console.log(`${index + 1}. School ID: ${schoolId}, Template: ${templateName}`);
    });
    
    // Define test data patterns to identify and delete
    const testPatterns = [
      // School names that are clearly test data
      /ทดสอบ/i,
      /test/i,
      /ตัวอย่าง/i,
      /example/i,
      /กลุ่มดนตรีไทยสนับสนุน.*ครู.*สถานศึกษา/i,
      /โรงเรียนสนับสนุน [ABC]/i,
      /โรงเรียนตัวอย่าง/i,
    ];
    
    // Test school IDs that start with specific patterns
    const testSchoolIdPatterns = [
      /^SCH-20260308-/i,  // Test school IDs from our test runs
      /^TEST-/i,
      /^SAMPLE-/i,
    ];
    
    // Test email patterns
    const testEmailPatterns = [
      /kaibandon2021@gmail\.com/i,
      /thaimusicplatform@gmail\.com/i,
      /test.*@.*\.com/i,
    ];
    
    console.log('\n⚠️  DELETION PLAN:');
    console.log('-'.repeat(30));
    console.log('Will delete records matching these patterns:');
    console.log('📝 School names containing: ทดสอบ, test, ตัวอย่าง, example, กลุ่มดนตรีไทยสนับสนุน');
    console.log('🏷️  School IDs starting with: SCH-20260308-, TEST-, SAMPLE-');
    console.log('📧 Email addresses: kaibandon2021@gmail.com, thaimusicplatform@gmail.com');
    
    // Ask for confirmation
    console.log('\n❓ Do you want to proceed with deletion? (This will be simulated first)');
    
    // Build deletion queries
    const register100DeleteQuery = {
      $or: [
        // School name patterns
        ...testPatterns.map(pattern => ({ reg100_schoolName: { $regex: pattern } })),
        ...testPatterns.map(pattern => ({ schoolName: { $regex: pattern } })),
        // School ID patterns
        ...testSchoolIdPatterns.map(pattern => ({ schoolId: { $regex: pattern } })),
        // Email patterns
        ...testEmailPatterns.map(pattern => ({ reg100_contactEmail: { $regex: pattern } })),
        ...testEmailPatterns.map(pattern => ({ contactEmail: { $regex: pattern } })),
      ]
    };
    
    const registerSupportDeleteQuery = {
      $or: [
        // School name patterns
        ...testPatterns.map(pattern => ({ regsup_schoolName: { $regex: pattern } })),
        ...testPatterns.map(pattern => ({ schoolName: { $regex: pattern } })),
        // School ID patterns
        ...testSchoolIdPatterns.map(pattern => ({ schoolId: { $regex: pattern } })),
        // Email patterns
        ...testEmailPatterns.map(pattern => ({ regsup_contactEmail: { $regex: pattern } })),
        ...testEmailPatterns.map(pattern => ({ contactEmail: { $regex: pattern } })),
      ]
    };
    
    // Find records that would be deleted (simulation)
    console.log('\n🎯 SIMULATION - Records that would be deleted:');
    console.log('-'.repeat(50));
    
    const register100ToDelete = await register100Collection.find(register100DeleteQuery).toArray();
    const registerSupportToDelete = await registerSupportCollection.find(registerSupportDeleteQuery).toArray();
    
    console.log(`\n📋 Register100 records to delete (${register100ToDelete.length}):`);
    register100ToDelete.forEach((record, index) => {
      const schoolName = record.reg100_schoolName || record.schoolName || 'Unknown';
      const schoolId = record.schoolId || 'No ID';
      const email = record.reg100_contactEmail || record.contactEmail || 'No email';
      console.log(`${index + 1}. ${schoolName} (ID: ${schoolId}, Email: ${email})`);
    });
    
    console.log(`\n📋 Register-Support records to delete (${registerSupportToDelete.length}):`);
    registerSupportToDelete.forEach((record, index) => {
      const schoolName = record.regsup_schoolName || record.schoolName || 'Unknown';
      const schoolId = record.schoolId || 'No ID';
      const email = record.regsup_contactEmail || record.contactEmail || 'No email';
      console.log(`${index + 1}. ${schoolName} (ID: ${schoolId}, Email: ${email})`);
    });
    
    // Find certificates for these schools
    const schoolIdsToDelete = [
      ...register100ToDelete.map(r => r.schoolId),
      ...registerSupportToDelete.map(r => r.schoolId)
    ].filter(Boolean);
    
    const certificatesToDelete = await certificatesCollection.find({
      schoolId: { $in: schoolIdsToDelete }
    }).toArray();
    
    console.log(`\n📜 Certificates to delete (${certificatesToDelete.length}):`);
    certificatesToDelete.forEach((cert, index) => {
      console.log(`${index + 1}. School ID: ${cert.schoolId}, Template: ${cert.templateName || 'No template'}`);
    });
    
    console.log('\n📊 DELETION SUMMARY:');
    console.log('-'.repeat(30));
    console.log(`🗑️  Register100 submissions: ${register100ToDelete.length} records`);
    console.log(`🗑️  Register-Support submissions: ${registerSupportToDelete.length} records`);
    console.log(`🗑️  Certificates: ${certificatesToDelete.length} records`);
    console.log(`📊 Total records to delete: ${register100ToDelete.length + registerSupportToDelete.length + certificatesToDelete.length}`);
    
    // Safety check - don't delete if too many records
    const totalRecords = register100Count + registerSupportCount + certificatesCount;
    const recordsToDelete = register100ToDelete.length + registerSupportToDelete.length + certificatesToDelete.length;
    const deletionPercentage = (recordsToDelete / totalRecords) * 100;
    
    console.log(`\n⚠️  SAFETY CHECK:`);
    console.log(`📊 Total records in database: ${totalRecords}`);
    console.log(`🗑️  Records to delete: ${recordsToDelete}`);
    console.log(`📈 Deletion percentage: ${deletionPercentage.toFixed(1)}%`);
    
    if (deletionPercentage > 80) {
      console.log('\n❌ SAFETY ABORT: Deletion would remove more than 80% of data!');
      console.log('This suggests the deletion criteria might be too broad.');
      console.log('Please review the deletion patterns and try again.');
      return;
    }
    
    console.log('\n✅ READY TO EXECUTE DELETION');
    console.log('Run this script with EXECUTE=true to perform actual deletion:');
    console.log('EXECUTE=true node scripts/safe-delete-test-data.js');
    
    // Check if we should actually execute the deletion
    if (process.env.EXECUTE === 'true') {
      console.log('\n🚀 EXECUTING DELETION...');
      console.log('-'.repeat(30));
      
      // Delete certificates first (to avoid foreign key issues)
      if (certificatesToDelete.length > 0) {
        const certDeleteResult = await certificatesCollection.deleteMany({
          schoolId: { $in: schoolIdsToDelete }
        });
        console.log(`✅ Deleted ${certDeleteResult.deletedCount} certificates`);
      }
      
      // Delete register100 submissions
      if (register100ToDelete.length > 0) {
        const reg100DeleteResult = await register100Collection.deleteMany(register100DeleteQuery);
        console.log(`✅ Deleted ${reg100DeleteResult.deletedCount} register100 submissions`);
      }
      
      // Delete register-support submissions
      if (registerSupportToDelete.length > 0) {
        const regSupportDeleteResult = await registerSupportCollection.deleteMany(registerSupportDeleteQuery);
        console.log(`✅ Deleted ${regSupportDeleteResult.deletedCount} register-support submissions`);
      }
      
      console.log('\n🎉 DELETION COMPLETED SUCCESSFULLY!');
      console.log('Database is now clean and ready for retesting.');
      
      // Show final counts
      const finalRegister100Count = await register100Collection.countDocuments();
      const finalRegisterSupportCount = await registerSupportCollection.countDocuments();
      const finalCertificatesCount = await certificatesCollection.countDocuments();
      
      console.log('\n📊 Final Data Counts:');
      console.log(`📋 Register100 submissions: ${finalRegister100Count} (was ${register100Count})`);
      console.log(`📋 Register-Support submissions: ${finalRegisterSupportCount} (was ${registerSupportCount})`);
      console.log(`📜 Certificates: ${finalCertificatesCount} (was ${certificatesCount})`);
    }
    
  } catch (error) {
    console.error('❌ Error during deletion process:', error);
  } finally {
    await client.close();
  }
}

safeDeleteTestData();