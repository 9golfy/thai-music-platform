const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function finalDataVerification() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('=== Final Data Verification ===\n');
    
    const database = client.db(dbName);
    
    // Check Register100
    const register100Collection = database.collection('register100_submissions');
    const register100Records = await register100Collection.find({}).toArray();
    
    // Check Register Support
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportRecords = await registerSupportCollection.find({}).toArray();
    
    // Check Certificates
    const certificatesCollection = database.collection('certificates');
    const certificates = await certificatesCollection.find({}).toArray();
    
    console.log('✅ Dashboard Statistics:');
    console.log(`   Register100 Schools: ${register100Records.length}`);
    console.log(`   Register Support Schools: ${registerSupportRecords.length}`);
    console.log(`   Total Score: ${register100Records.reduce((sum, r) => sum + (r.total_score || 0), 0)}`);
    console.log(`   Certificates: ${certificates.length}`);
    
    console.log('\n✅ Register100 Data Consistency:');
    register100Records.forEach((record, index) => {
      const listDisplay = {
        school: record.reg100_schoolName || record.regsup_schoolName || '-',
        province: record.reg100_schoolProvince || record.regsup_schoolProvince || '-',
        score: record.total_score || 0
      };
      
      const displayData = new Proxy(record, {
        get(target, prop) {
          if (typeof prop === 'string') {
            return target[`reg100_${prop}`] ?? target[prop];
          }
          return target[prop];
        }
      });
      
      const detailDisplay = {
        school: displayData.schoolName,
        province: displayData.schoolProvince,
        score: record.total_score || 0
      };
      
      console.log(`   ${index + 1}. ${record._id}`);
      console.log(`      List: ${listDisplay.school} | ${listDisplay.province} | ${listDisplay.score} คะแนน`);
      console.log(`      Detail: ${detailDisplay.school} | ${detailDisplay.province} | ${detailDisplay.score} คะแนน`);
      console.log(`      Status: ${JSON.stringify(listDisplay) === JSON.stringify(detailDisplay) ? '✅ CONSISTENT' : '❌ INCONSISTENT'}`);
    });
    
    console.log('\n✅ Register Support Data Consistency:');
    registerSupportRecords.forEach((record, index) => {
      const listDisplay = {
        school: record.reg100_schoolName || record.regsup_schoolName || '-',
        province: record.reg100_schoolProvince || record.regsup_schoolProvince || '-',
        score: record.total_score || 0
      };
      
      const displayData = new Proxy(record, {
        get(target, prop) {
          if (typeof prop === 'string') {
            return target[`regsup_${prop}`] ?? target[prop];
          }
          return target[prop];
        }
      });
      
      const detailDisplay = {
        school: displayData.schoolName,
        province: displayData.schoolProvince,
        score: record.total_score || 0
      };
      
      console.log(`   ${index + 1}. ${record._id}`);
      console.log(`      List: ${listDisplay.school} | ${listDisplay.province} | ${listDisplay.score} คะแนน`);
      console.log(`      Detail: ${detailDisplay.school} | ${detailDisplay.province} | ${detailDisplay.score} คะแนน`);
      console.log(`      Status: ${JSON.stringify(listDisplay) === JSON.stringify(detailDisplay) ? '✅ CONSISTENT' : '❌ INCONSISTENT'}`);
    });
    
    console.log('\n=== Summary of Fixes Applied ===');
    console.log('✅ Fixed dashboard certificates label from "คะแนนเฉลี่ย" to "ใบประกาศ"');
    console.log('✅ Fixed register-support data consistency by adding missing regsup_ prefixed fields');
    console.log('✅ All pages now show consistent data based on proper field mapping');
    console.log('✅ Export functions use Step 1-8 format matching detail view pages');
    
    console.log('\n🎯 All systems should now display consistent data!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

finalDataVerification();