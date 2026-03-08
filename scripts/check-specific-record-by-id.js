require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

async function checkRecord() {
  const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('thai_music_school');
    
    // Check the specific record ID from the URL
    const recordId = '69a3965afda2dc80d24f4629';
    
    console.log(`🔍 Looking for record: ${recordId}\n`);
    
    const record = await db.collection('register100_submissions').findOne({ 
      _id: new ObjectId(recordId) 
    });
    
    if (record) {
      console.log('✅ Record found!');
      console.log(`  School Name: ${record.schoolName}`);
      console.log(`  School ID: ${record.schoolId || '❌ MISSING'}`);
      console.log(`  Province: ${record.schoolProvince}`);
      console.log(`  Level: ${record.schoolLevel}`);
      console.log(`  Manager Image: ${record.mgtImage || 'N/A'}`);
      console.log(`  Created At: ${record.createdAt}`);
      
      // Check teachers
      if (record.thaiMusicTeachers && record.thaiMusicTeachers.length > 0) {
        console.log(`\n👨‍🏫 Teachers: ${record.thaiMusicTeachers.length}`);
        record.thaiMusicTeachers.forEach((teacher, index) => {
          console.log(`  Teacher ${index + 1}:`);
          console.log(`    Name: ${teacher.teacherName}`);
          console.log(`    Qualification: ${teacher.teacherQualification || '❌ MISSING'}`);
          console.log(`    Image: ${teacher.teacherImage || 'N/A'}`);
        });
      }
      
      // Check awards
      if (record.awards && record.awards.length > 0) {
        console.log(`\n🏆 Awards: ${record.awards.length}`);
        record.awards.forEach((award, index) => {
          console.log(`  Award ${index + 1}:`);
          console.log(`    Name: ${award.awardName}`);
          console.log(`    Level: ${award.awardLevel || '❌ MISSING'}`);
        });
      }
    } else {
      console.log('❌ Record not found');
      
      // List all records
      const allRecords = await db.collection('register100_submissions').find({}).toArray();
      console.log(`\n📊 Total records in database: ${allRecords.length}`);
      
      if (allRecords.length > 0) {
        console.log('\nAvailable records:');
        allRecords.forEach((r, i) => {
          console.log(`  ${i + 1}. ${r._id} - ${r.schoolName}`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

checkRecord();
