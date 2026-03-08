const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function debugAPIEndpoints() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('=== Debugging API Endpoints ===\n');
    
    const database = client.db(dbName);
    
    // Test direct database queries
    console.log('1. Direct Database Queries:');
    
    // Register100 list
    const register100Collection = database.collection('register100_submissions');
    const register100Records = await register100Collection.find({}).toArray();
    console.log(`   register100_submissions count: ${register100Records.length}`);
    
    // Register Support list  
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportRecords = await registerSupportCollection.find({}).toArray();
    console.log(`   register_support_submissions count: ${registerSupportRecords.length}`);
    
    // Certificates
    const certificatesCollection = database.collection('certificates');
    const certificates = await certificatesCollection.find({}).toArray();
    console.log(`   certificates count: ${certificates.length}`);
    
    // Test specific record
    console.log('\n2. Specific Record Test:');
    const specificRecord = await register100Collection.findOne({ 
      _id: new ObjectId('69ace7425d451baf6766d1fb') 
    });
    
    if (specificRecord) {
      console.log('   ✅ Record 69ace7425d451baf6766d1fb found');
      console.log(`   School Name: ${specificRecord.reg100_schoolName}`);
      console.log(`   Province: ${specificRecord.reg100_schoolProvince}`);
      console.log(`   Total Score: ${specificRecord.total_score}`);
      console.log(`   Created At: ${specificRecord.createdAt}`);
    } else {
      console.log('   ❌ Record 69ace7425d451baf6766d1fb NOT FOUND');
    }
    
    // Test what API endpoints should return
    console.log('\n3. Expected API Responses:');
    
    // /api/register100/list
    console.log('   /api/register100/list should return:');
    const register100Response = {
      success: true,
      submissions: register100Records.map(sub => ({
        ...sub,
        _id: sub._id.toString(),
      })),
      count: register100Records.length,
    };
    console.log(`     success: ${register100Response.success}`);
    console.log(`     count: ${register100Response.count}`);
    console.log(`     submissions length: ${register100Response.submissions.length}`);
    
    // /api/register-support/list
    console.log('   /api/register-support/list should return:');
    const registerSupportResponse = {
      success: true,
      submissions: registerSupportRecords.map(sub => ({
        ...sub,
        _id: sub._id.toString(),
      })),
      count: registerSupportRecords.length,
    };
    console.log(`     success: ${registerSupportResponse.success}`);
    console.log(`     count: ${registerSupportResponse.count}`);
    console.log(`     submissions length: ${registerSupportResponse.submissions.length}`);
    
    // /api/certificates
    console.log('   /api/certificates should return:');
    const certificatesResponse = {
      success: true,
      certificates: certificates,
    };
    console.log(`     success: ${certificatesResponse.success}`);
    console.log(`     certificates length: ${certificatesResponse.certificates.length}`);
    
    // /api/register100/69ace7425d451baf6766d1fb
    console.log('   /api/register100/69ace7425d451baf6766d1fb should return:');
    if (specificRecord) {
      console.log(`     success: true`);
      console.log(`     submission found: true`);
      console.log(`     school name: ${specificRecord.reg100_schoolName}`);
    } else {
      console.log(`     success: false`);
      console.log(`     submission found: false`);
    }
    
    console.log('\n4. Dashboard Calculation Test:');
    const totalScore = register100Records.reduce((sum, s) => sum + (s.total_score || 0), 0);
    console.log(`   Register100 count: ${register100Records.length}`);
    console.log(`   Register Support count: ${registerSupportRecords.length}`);
    console.log(`   Total Score: ${totalScore}`);
    console.log(`   Certificates: ${certificates.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugAPIEndpoints();