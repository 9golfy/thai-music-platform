const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function fixScoreMismatch() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');

    const submissionId = '69ad8250fcaa2809454bab8f';
    console.log(`=== แก้ไขคะแนนที่ไม่ตรงกัน ID: ${submissionId} ===`);
    
    const submission = await collection.findOne({ _id: new ObjectId(submissionId) });
    
    if (!submission) {
      console.log('❌ ไม่พบ submission');
      return;
    }

    // ใช้คะแนนจาก field แบบเก่าที่ถูกต้อง
    const correctTotalScore = submission.total_score || 0;
    
    // คำนวณเกรดใหม่
    let correctGrade;
    if (correctTotalScore >= 80) {
      correctGrade = 'A';
    } else if (correctTotalScore >= 70) {
      correctGrade = 'B';
    } else if (correctTotalScore >= 60) {
      correctGrade = 'C';
    } else if (correctTotalScore >= 50) {
      correctGrade = 'D';
    } else {
      correctGrade = 'F';
    }

    console.log(`คะแนนที่ถูกต้อง: ${correctTotalScore}`);
    console.log(`เกรดที่ถูกต้อง: ${correctGrade}`);

    // อัปเดต totalScore และ grade ให้ตรงกัน
    await collection.updateOne(
      { _id: new ObjectId(submissionId) },
      {
        $set: {
          totalScore: correctTotalScore,
          grade: correctGrade,
          updatedAt: new Date()
        }
      }
    );

    console.log('✅ อัปเดตคะแนนให้ตรงกันแล้ว');

    // ตรวจสอบผลลัพธ์
    const updatedSubmission = await collection.findOne({ _id: new ObjectId(submissionId) });
    
    console.log('\n📊 ผลลัพธ์หลังแก้ไข:');
    console.log(`total_score (แบบเก่า): ${updatedSubmission.total_score}`);
    console.log(`totalScore (แบบใหม่): ${updatedSubmission.totalScore}`);
    console.log(`grade: ${updatedSubmission.grade}`);

    console.log('\n=== การให้คะแนนรายละเอียดที่ถูกต้อง ===');
    console.log(`การฝึกอบรมครู: ${updatedSubmission.teacher_training_score || 0}/20`);
    console.log(`คุณวุฒิครู: ${updatedSubmission.teacher_qualification_score || 0}/20`);
    console.log(`การสนับสนุนจากองค์กร: ${updatedSubmission.support_from_org_score || 0}/5`);
    console.log(`การสนับสนุนจากภายนอก: ${updatedSubmission.support_from_external_score || 0}/15`);
    console.log(`รางวัล: ${updatedSubmission.award_score || 0}/20`);
    console.log(`กิจกรรมภายใน: ${updatedSubmission.activity_within_province_internal_score || 0}/5`);
    console.log(`กิจกรรมภายนอก: ${updatedSubmission.activity_within_province_external_score || 0}/5`);
    console.log(`กิจกรรมต่างจังหวัด: ${updatedSubmission.activity_outside_province_score || 0}/5`);
    console.log(`กิจกรรม PR: ${updatedSubmission.pr_activity_score || 0}/5`);
    console.log(`─────────────────────────`);
    console.log(`รวม: ${updatedSubmission.totalScore}/100 คะแนน`);
    console.log(`เกรด: ${updatedSubmission.grade}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixScoreMismatch();