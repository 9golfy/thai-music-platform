const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function verifyCleanDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    console.log('✅ Database Clean Verification');
    console.log('='.repeat(40));
    
    // Check all collections
    const register100Collection = database.collection('register100_submissions');
    const registerSupportCollection = database.collection('register_support_submissions');
    const certificatesCollection = database.collection('certificates');
    
    const register100Count = await register100Collection.countDocuments();
    const registerSupportCount = await registerSupportCollection.countDocuments();
    const certificatesCount = await certificatesCollection.countDocuments();
    
    console.log('\n📊 Current Database State:');
    console.log('-'.repeat(30));
    console.log(`📋 Register100 submissions: ${register100Count}`);
    console.log(`📋 Register-Support submissions: ${registerSupportCount}`);
    console.log(`📜 Certificates: ${certificatesCount}`);
    
    const totalRecords = register100Count + registerSupportCount + certificatesCount;
    
    if (totalRecords === 0) {
      console.log('\n🎉 SUCCESS: Database is completely clean!');
      console.log('✅ Ready for fresh test data creation');
      console.log('✅ Ready for Playwright test execution');
      console.log('✅ Ready for manual testing');
      
      console.log('\n🚀 Next Steps:');
      console.log('1. Run Playwright tests to create fresh test data');
      console.log('2. Test the grade display functionality');
      console.log('3. Verify export functionality');
      console.log('4. Test dashboard charts with new data');
      
      console.log('\n📝 Suggested Test Commands:');
      console.log('npx playwright test tests/register100-full-fields.spec.ts');
      console.log('npx playwright test tests/regist-support-9teachers-full.spec.ts');
      
    } else {
      console.log('\n⚠️  WARNING: Database is not completely clean!');
      console.log(`Found ${totalRecords} remaining records.`);
      
      if (register100Count > 0) {
        console.log('\n📋 Remaining Register100 Records:');
        const remainingReg100 = await register100Collection.find({}).toArray();
        remainingReg100.forEach((record, index) => {
          const schoolName = record.reg100_schoolName || record.schoolName || 'Unknown';
          console.log(`${index + 1}. ${schoolName} (ID: ${record.schoolId})`);
        });
      }
      
      if (registerSupportCount > 0) {
        console.log('\n📋 Remaining Register-Support Records:');
        const remainingRegSupport = await registerSupportCollection.find({}).toArray();
        remainingRegSupport.forEach((record, index) => {
          const schoolName = record.regsup_schoolName || record.schoolName || 'Unknown';
          console.log(`${index + 1}. ${schoolName} (ID: ${record.schoolId})`);
        });
      }
      
      if (certificatesCount > 0) {
        console.log('\n📜 Remaining Certificate Records:');
        const remainingCerts = await certificatesCollection.find({}).toArray();
        remainingCerts.forEach((record, index) => {
          console.log(`${index + 1}. School ID: ${record.schoolId}, Template: ${record.templateName}`);
        });
      }
    }
    
    // Check database connection and collections
    console.log('\n🔧 Database Health Check:');
    console.log('-'.repeat(30));
    
    try {
      await database.admin().ping();
      console.log('✅ Database connection: OK');
    } catch (error) {
      console.log('❌ Database connection: FAILED');
    }
    
    try {
      const collections = await database.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      console.log(`✅ Collections available: ${collectionNames.length}`);
      console.log(`   - ${collectionNames.join(', ')}`);
    } catch (error) {
      console.log('❌ Collections check: FAILED');
    }
    
    console.log('\n📊 Summary:');
    console.log('-'.repeat(20));
    if (totalRecords === 0) {
      console.log('🎯 Status: READY FOR TESTING');
      console.log('🧹 Database: CLEAN');
      console.log('🚀 Action: Proceed with test execution');
    } else {
      console.log('⚠️  Status: NEEDS CLEANUP');
      console.log('🗑️  Database: HAS REMAINING DATA');
      console.log('🔄 Action: Run deletion script again if needed');
    }
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await client.close();
  }
}

verifyCleanDatabase();