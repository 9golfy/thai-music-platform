const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function fixCertificateSchoolName() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    
    const certificatesCollection = database.collection('certificates');
    const regSupportCollection = database.collection('register_support_submissions');
    const reg100Collection = database.collection('register100_submissions');
    
    console.log('=== แก้ไขชื่อโรงเรียนใน certificates ===');
    
    const certificates = await certificatesCollection.find({}).toArray();
    
    for (const cert of certificates) {
      console.log(`\nProcessing certificate: ${cert._id}`);
      console.log(`Current schoolName: ${cert.schoolName}`);
      console.log(`Certificate type: ${cert.certificateType}`);
      console.log(`School ID: ${cert.schoolId}`);
      
      let schoolName = null;
      
      if (cert.certificateType === 'register-support') {
        const school = await regSupportCollection.findOne({ schoolId: cert.schoolId });
        if (school && school.regsup_schoolName) {
          schoolName = school.regsup_schoolName;
        }
      } else if (cert.certificateType === 'register100') {
        const school = await reg100Collection.findOne({ schoolId: cert.schoolId });
        if (school && school.reg100_schoolName) {
          schoolName = school.reg100_schoolName;
        } else if (school && school.schoolName) {
          schoolName = school.schoolName;
        }
      }
      
      if (schoolName && schoolName !== cert.schoolName) {
        console.log(`Updating schoolName to: ${schoolName}`);
        
        await certificatesCollection.updateOne(
          { _id: cert._id },
          { 
            $set: { 
              schoolName: schoolName,
              updatedAt: new Date()
            } 
          }
        );
        
        console.log('✅ Updated successfully');
      } else {
        console.log('❌ No update needed or school data not found');
      }
    }
    
    console.log('\n=== ตรวจสอบผลลัพธ์ ===');
    const updatedCerts = await certificatesCollection.find({}).toArray();
    updatedCerts.forEach(cert => {
      console.log(`Certificate ${cert._id}: schoolName = "${cert.schoolName}"`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixCertificateSchoolName();