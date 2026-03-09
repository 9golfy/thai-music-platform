const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

async function checkCertificateSchoolName() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const certificatesCollection = database.collection('certificates');

    console.log('=== ตรวจสอบข้อมูลชื่อโรงเรียนใน certificates ===');
    
    const certificates = await certificatesCollection.find({}).toArray();
    
    console.log(`พบ certificates จำนวน: ${certificates.length}`);
    
    certificates.forEach((cert, index) => {
      console.log(`\n--- Certificate ${index + 1} ---`);
      console.log('ID:', cert._id.toString());
      console.log('schoolId:', cert.schoolId);
      console.log('schoolName:', cert.schoolName);
      console.log('certificateType:', cert.certificateType);
      console.log('certificateNumber:', cert.certificateNumber);
      console.log('isActive:', cert.isActive);
      
      // แสดงทุก field ที่มี
      console.log('\nAll fields:');
      Object.keys(cert).forEach(key => {
        if (key.includes('school') || key.includes('School')) {
          console.log(`  ${key}:`, cert[key]);
        }
      });
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkCertificateSchoolName();