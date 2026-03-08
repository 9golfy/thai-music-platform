require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

async function checkRecord() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('registerForm');
    const id = '69a383e9a29d6ad3828c66aa';
    
    const record = await db.collection('register100_submissions').findOne({ 
      _id: ObjectId.createFromHexString(id) 
    });
    
    if (record) {
      console.log('📋 Record Found!\n');
      
      console.log('🏆 Awards:');
      if (record.awards && record.awards.length > 0) {
        record.awards.forEach((award, i) => {
          console.log(`  Award ${i + 1}:`);
          console.log(`    Level: ${award.awardLevel}`);
          console.log(`    Name: ${award.awardName}`);
        });
      } else {
        console.log('  No awards');
      }
      
      console.log('\n👨‍🏫 Teachers:');
      if (record.thaiMusicTeachers && record.thaiMusicTeachers.length > 0) {
        record.thaiMusicTeachers.forEach((teacher, i) => {
          console.log(`  Teacher ${i + 1}:`);
          console.log(`    Qualification: ${teacher.teacherQualification}`);
          console.log(`    Name: ${teacher.teacherFullName}`);
          console.log(`    Image: ${teacher.teacherImage || 'No image'}`);
        });
      } else {
        console.log('  No teachers');
      }
      
      console.log('\n🖼️  Manager Image:', record.mgtImage || 'No image');
      
    } else {
      console.log('❌ Record not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkRecord();
