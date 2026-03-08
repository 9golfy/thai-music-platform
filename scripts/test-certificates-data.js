const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testCertificatesData() {
  console.log('=== Testing Certificates Page Data ===\n');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    // Test register100 data
    console.log('1. Register100 Data:');
    const register100Collection = database.collection('register100_submissions');
    const register100Data = await register100Collection.find({}).toArray();
    
    if (register100Data.length > 0) {
      const sample = register100Data[0];
      console.log(`   Sample record fields:`);
      console.log(`   - _id: ${sample._id}`);
      console.log(`   - schoolId: ${sample.schoolId}`);
      console.log(`   - schoolName: ${sample.schoolName}`);
      console.log(`   - reg100_schoolName: ${sample.reg100_schoolName}`);
      console.log(`   - total_score: ${sample.total_score}`);
      
      // Check which field has the school name
      const schoolNameField = sample.schoolName || sample.reg100_schoolName;
      console.log(`   - Actual school name: "${schoolNameField}"`);
    }
    
    // Test register-support data
    console.log('\n2. Register Support Data:');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportData = await registerSupportCollection.find({}).toArray();
    
    if (registerSupportData.length > 0) {
      const sample = registerSupportData[0];
      console.log(`   Sample record fields:`);
      console.log(`   - _id: ${sample._id}`);
      console.log(`   - schoolId: ${sample.schoolId}`);
      console.log(`   - schoolName: ${sample.schoolName}`);
      console.log(`   - regsup_schoolName: ${sample.regsup_schoolName}`);
      console.log(`   - total_score: ${sample.total_score}`);
      
      // Check which field has the school name
      const schoolNameField = sample.schoolName || sample.regsup_schoolName;
      console.log(`   - Actual school name: "${schoolNameField}"`);
    }
    
    // Test what the API would return
    console.log('\n3. API Response Simulation:');
    
    // Simulate register100 API response
    const register100Schools = register100Data.map((school) => ({
      ...school,
      _id: school._id.toString(),
      type: 'register100',
      typeName: 'โรงเรียน 100%',
      hasCertificate: false,
      certificateTemplate: '',
      certificateId: '',
    }));
    
    if (register100Schools.length > 0) {
      console.log(`   Register100 API would return:`);
      console.log(`   - schoolName: "${register100Schools[0].schoolName}"`);
      console.log(`   - reg100_schoolName: "${register100Schools[0].reg100_schoolName}"`);
    }
    
    // Simulate register-support API response
    const registerSupportSchools = registerSupportData.map((school) => ({
      ...school,
      _id: school._id.toString(),
      type: 'register-support',
      typeName: 'โรงเรียนสนับสนุนฯ',
      hasCertificate: false,
      certificateTemplate: '',
      certificateId: '',
    }));
    
    if (registerSupportSchools.length > 0) {
      console.log(`   Register Support API would return:`);
      console.log(`   - schoolName: "${registerSupportSchools[0].schoolName}"`);
      console.log(`   - regsup_schoolName: "${registerSupportSchools[0].regsup_schoolName}"`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testCertificatesData().catch(console.error);