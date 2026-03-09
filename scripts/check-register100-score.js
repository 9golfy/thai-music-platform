const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function checkRegister100Score() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register100_submissions');

    const submissionId = '69ad8158fcaa2809454bab8d';
    console.log(`=== ตรวจสอบคะแนน Register100 ID: ${submissionId} ===`);
    
    const submission = await collection.findOne({ _id: new ObjectId(submissionId) });
    
    if (!submission) {
      console.log('❌ ไม่พบ submission');
      return;
    }

    console.log('\n📊 ข้อมูลพื้นฐาน:');
    console.log(`School ID: ${submission.schoolId}`);
    console.log(`ชื่อโรงเรียน: ${submission.reg100_schoolName || submission.schoolName}`);
    console.log(`จังหวัด: ${submission.reg100_schoolProvince || submission.schoolProvince}`);
    console.log(`อีเมลครู: ${submission.reg100_mgtEmail || submission.email}`);

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

    // ตรวจสอบว่าคะแนนตรงกันหรือไม่
    const oldTotalScore = submission.total_score || 0;
    const newTotalScore = submission.totalScore || 0;
    const grade = submission.grade || 'ไม่ระบุ';

    console.log('\n🔍 การเปรียบเทียบคะแนน:');
    console.log(`total_score (แบบเก่า): ${oldTotalScore}`);
    console.log(`totalScore (แบบใหม่): ${newTotalScore}`);
    console.log(`grade: ${grade}`);

    if (oldTotalScore !== newTotalScore) {
      console.log('⚠️ คะแนนไม่ตรงกัน! ต้องแก้ไข');
      
      // คำนวณเกรดที่ถูกต้อง
      let correctGrade;
      if (oldTotalScore >= 80) {
        correctGrade = 'A';
      } else if (oldTotalScore >= 70) {
        correctGrade = 'B';
      } else if (oldTotalScore >= 60) {
        correctGrade = 'C';
      } else if (oldTotalScore >= 50) {
        correctGrade = 'D';
      } else {
        correctGrade = 'F';
      }

      console.log(`เกรดที่ถูกต้องควรเป็น: ${correctGrade}`);
    } else {
      console.log('✅ คะแนนตรงกัน');
    }

    console.log('\n=== การให้คะแนนรายละเอียด ===');
    console.log(`การฝึกอบรมครู: ${submission.teacher_training_score || 0}/20`);
    console.log(`คุณวุฒิครู: ${submission.teacher_qualification_score || 0}/20`);
    console.log(`การสนับสนุนจากองค์กร: ${submission.support_from_org_score || 0}/5`);
    console.log(`การสนับสนุนจากภายนอก: ${submission.support_from_external_score || 0}/15`);
    console.log(`รางวัล: ${submission.award_score || 0}/20`);
    console.log(`กิจกรรมภายใน: ${submission.activity_within_province_internal_score || 0}/5`);
    console.log(`กิจกรรมภายนอก: ${submission.activity_within_province_external_score || 0}/5`);
    console.log(`กิจกรรมต่างจังหวัด: ${submission.activity_outside_province_score || 0}/5`);
    console.log(`กิจกรรม PR: ${submission.pr_activity_score || 0}/5`);
    console.log(`─────────────────────────`);
    console.log(`รวม: ${oldTotalScore}/100 คะแนน`);
    console.log(`เกรด: ${grade}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkRegister100Score();