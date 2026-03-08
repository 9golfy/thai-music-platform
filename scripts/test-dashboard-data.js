const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testDashboardData() {
  console.log('=== Testing Dashboard Data Sources ===\n');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    // Test register100 data
    console.log('1. Register100 Data:');
    const register100Collection = database.collection('register100_submissions');
    const register100Data = await register100Collection.find({}).toArray();
    console.log(`   Count: ${register100Data.length}`);
    
    if (register100Data.length > 0) {
      const totalScore = register100Data.reduce((sum, s) => sum + (s.total_score || 0), 0);
      console.log(`   Total Score: ${totalScore}`);
      console.log(`   Sample record: ${register100Data[0]._id} - ${register100Data[0].reg100_schoolName || register100Data[0].schoolName}`);
    }
    
    // Test register-support data
    console.log('\n2. Register Support Data:');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportData = await registerSupportCollection.find({}).toArray();
    console.log(`   Count: ${registerSupportData.length}`);
    
    if (registerSupportData.length > 0) {
      console.log(`   Sample record: ${registerSupportData[0]._id} - ${registerSupportData[0].regsup_schoolName || registerSupportData[0].schoolName}`);
    }
    
    // Test certificates data
    console.log('\n3. Certificates Data:');
    const certificatesCollection = database.collection('certificates');
    const certificatesData = await certificatesCollection.find({}).toArray();
    console.log(`   Count: ${certificatesData.length}`);
    
    // Test specific record
    console.log('\n4. Specific Record Test:');
    const specificRecord = await register100Collection.findOne({
      _id: new ObjectId('69ace7425d451baf6766d1fb')
    });
    
    if (specificRecord) {
      console.log('   ✅ Record found');
      console.log(`   School Name: ${specificRecord.reg100_schoolName || specificRecord.schoolName}`);
      console.log(`   Total Score: ${specificRecord.total_score}`);
      console.log(`   Has reg100_ prefix fields: ${Object.keys(specificRecord).some(k => k.startsWith('reg100_'))}`);
      console.log(`   Has non-prefix fields: ${Object.keys(specificRecord).some(k => !k.startsWith('reg100_') && !k.startsWith('_') && k !== 'schoolId' && k !== 'createdAt' && k !== 'updatedAt')}`);
    } else {
      console.log('   ❌ Record not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testDashboardData().catch(console.error);