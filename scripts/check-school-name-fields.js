const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function checkSchoolNameFields() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    
    console.log('=== ตรวจสอบ field ชื่อโรงเรียนใน register_support_submissions ===');
    
    const regSupportCollection = database.collection('register_support_submissions');
    const regSupportData = await regSupportCollection.findOne({}, { sort: { createdAt: -1 } });
    
    if (regSupportData) {
      console.log('\nRegister Support Submission Fields:');
      Object.keys(regSupportData).forEach(key => {
        if (key.toLowerCase().includes('school') || key.toLowerCase().includes('name')) {
          console.log(`  ${key}:`, regSupportData[key]);
        }
      });
    }
    
    console.log('\n=== ตรวจสอบ field ชื่อโรงเรียนใน register100_submissions ===');
    
    const reg100Collection = database.collection('register100_submissions');
    const reg100Data = await reg100Collection.findOne({}, { sort: { createdAt: -1 } });
    
    if (reg100Data) {
      console.log('\nRegister100 Submission Fields:');
      Object.keys(reg100Data).forEach(key => {
        if (key.toLowerCase().includes('school') || key.toLowerCase().includes('name')) {
          console.log(`  ${key}:`, reg100Data[key]);
        }
      });
    }
    
    console.log('\n=== ตรวจสอบ certificates collection ===');
    
    const certificatesCollection = database.collection('certificates');
    const certData = await certificatesCollection.findOne({}, { sort: { createdAt: -1 } });
    
    if (certData) {
      console.log('\nCertificate Fields:');
      Object.keys(certData).forEach(key => {
        console.log(`  ${key}:`, certData[key]);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkSchoolNameFields();