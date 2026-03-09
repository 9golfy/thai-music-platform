const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function checkFieldNamesInDB() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');

    const submissionId = '69ad8250fcaa2809454bab8f';
    console.log(`=== ตรวจสอบ field names ใน DB สำหรับ ID: ${submissionId} ===`);
    
    const submission = await collection.findOne({ _id: new ObjectId(submissionId) });
    
    if (!submission) {
      console.log('❌ ไม่พบ submission');
      return;
    }

    console.log('\n📊 Score-related fields ที่มีในฐานข้อมูล:');
    
    // ตรวจสอบ field names ที่เกี่ยวกับคะแนน
    const scoreFields = [
      'total_score',
      'totalScore', 
      'teacher_training_score',
      'teacher_qualification_score',
      'support_from_org_score',
      'support_from_external_score',
      'award_score',
      'activity_within_province_internal_score',
      'activity_within_province_external_score',
      'activity_outside_province_score',
      'pr_activity_score',
      'scores',
      'grade'
    ];

    scoreFields.forEach(field => {
      if (submission.hasOwnProperty(field)) {
        console.log(`✅ ${field}: ${JSON.stringify(submission[field])}`);
      } else {
        console.log(`❌ ${field}: ไม่มี`);
      }
    });

    console.log('\n📋 ข้อมูลทั้งหมดที่เกี่ยวกับคะแนน:');
    Object.keys(submission).forEach(key => {
      if (key.toLowerCase().includes('score') || key.toLowerCase().includes('grade') || key === 'scores') {
        console.log(`${key}: ${JSON.stringify(submission[key])}`);
      }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkFieldNamesInDB();