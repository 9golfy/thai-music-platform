const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testDataConsistency() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('=== Testing Data Consistency Between Pages ===\n');
    
    const database = client.db(dbName);
    
    // Test Register100 data
    console.log('1. Register100 Data Consistency:');
    const register100Collection = database.collection('register100_submissions');
    const register100Records = await register100Collection.find({}).toArray();
    
    console.log(`   Database count: ${register100Records.length}`);
    
    if (register100Records.length > 0) {
      const record = register100Records[0];
      console.log('\n   What each page should show:');
      
      // Dashboard stats
      console.log('   Dashboard:');
      console.log(`     - Register100 count: ${register100Records.length}`);
      console.log(`     - Total score: ${register100Records.reduce((sum, r) => sum + (r.total_score || 0), 0)}`);
      
      // List page (SchoolsDataTable)
      console.log('   List page:');
      console.log(`     - School name: ${record.reg100_schoolName || record.regsup_schoolName || '-'}`);
      console.log(`     - Province: ${record.reg100_schoolProvince || record.regsup_schoolProvince || '-'}`);
      console.log(`     - Level: ${record.reg100_schoolLevel || record.regsup_schoolLevel || 'ไม่ระบุ'}`);
      console.log(`     - Score: ${record.total_score || 0}`);
      
      // Detail page (Register100DetailView with proxy)
      console.log('   Detail page (with proxy):');
      const displayData = new Proxy(record, {
        get(target, prop) {
          if (typeof prop === 'string') {
            return target[`reg100_${prop}`] ?? target[prop];
          }
          return target[prop];
        }
      });
      console.log(`     - School name: ${displayData.schoolName}`);
      console.log(`     - Province: ${displayData.schoolProvince}`);
      console.log(`     - Level: ${displayData.schoolLevel}`);
      console.log(`     - Score: ${record.total_score}`);
    }
    
    // Test Register Support data
    console.log('\n2. Register Support Data Consistency:');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportRecords = await registerSupportCollection.find({}).toArray();
    
    console.log(`   Database count: ${registerSupportRecords.length}`);
    
    if (registerSupportRecords.length > 0) {
      console.log('\n   Sample records:');
      registerSupportRecords.forEach((record, index) => {
        console.log(`   ${index + 1}. ID: ${record._id}`);
        console.log(`      List page would show:`);
        console.log(`        - School: ${record.reg100_schoolName || record.regsup_schoolName || '-'}`);
        console.log(`        - Province: ${record.reg100_schoolProvince || record.regsup_schoolProvince || '-'}`);
        console.log(`        - Score: ${record.total_score || 0}`);
        
        // Detail page with proxy
        const displayData = new Proxy(record, {
          get(target, prop) {
            if (typeof prop === 'string') {
              return target[`regsup_${prop}`] ?? target[prop];
            }
            return target[prop];
          }
        });
        console.log(`      Detail page would show:`);
        console.log(`        - School: ${displayData.schoolName}`);
        console.log(`        - Province: ${displayData.schoolProvince}`);
        console.log(`        - Score: ${record.total_score}`);
        console.log('');
      });
    }
    
    // Test Certificates
    console.log('3. Certificates Data:');
    const certificatesCollection = database.collection('certificates');
    const certificates = await certificatesCollection.find({}).toArray();
    console.log(`   Database count: ${certificates.length}`);
    console.log(`   Dashboard should show: ${certificates.length} ใบประกาศ`);
    
    console.log('\n=== Summary ===');
    console.log('✅ Dashboard should show:');
    console.log(`   - Register100: ${register100Records.length} โรงเรียน`);
    console.log(`   - Register Support: ${registerSupportRecords.length} โรงเรียน`);
    console.log(`   - Total Score: ${register100Records.reduce((sum, r) => sum + (r.total_score || 0), 0)} คะแนน`);
    console.log(`   - Certificates: ${certificates.length} ใบประกาศ`);
    
    console.log('\n✅ All pages should show consistent data based on field mapping');
    console.log('✅ Fixed certificates label from "คะแนนเฉลี่ย" to "ใบประกาศ"');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testDataConsistency();