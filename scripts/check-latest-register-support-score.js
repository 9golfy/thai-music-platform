const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function checkLatestRegisterSupportScore() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');

    console.log('=== ตรวจสอบคะแนนรายละเอียด Register Support ล่าสุด ===');
    
    const submission = await collection.findOne(
      { regsup_mgtEmail: 'thaimusicplatform@gmail.com' },
      { sort: { createdAt: -1 } }
    );

    if (!submission) {
      console.log('❌ ไม่พบข้อมูล submission');
      return;
    }

    console.log('\n📊 ข้อมูลพื้นฐาน:');
    console.log(`School ID: ${submission.schoolId}`);
    console.log(`ชื่อโรงเรียน: ${submission.regsup_schoolName}`);
    console.log(`จังหวัด: ${submission.regsup_schoolProvince}`);
    console.log(`อีเมลครู: ${submission.regsup_mgtEmail}`);
    console.log(`เบอร์โทรครู: ${submission.regsup_mgtPhone}`);

    console.log('\n🎯 การให้คะแนนรายละเอียด:');
    
    // 1. Teacher Training Score (20 คะแนน)
    const trainingScore = submission.scores?.teacherTraining || 0;
    console.log(`\n1. การฝึกอบรมครู: ${trainingScore} คะแนน`);
    if (submission.regsup_teacherTraining) {
      Object.keys(submission.regsup_teacherTraining).forEach(key => {
        if (submission.regsup_teacherTraining[key]) {
          console.log(`   ✅ ${key}: ได้คะแนน`);
        }
      });
    }

    // 2. Teacher Qualification Score (20 คะแนน)
    const qualificationScore = submission.scores?.teacherQualification || 0;
    console.log(`\n2. คุณวุฒิครู: ${qualificationScore} คะแนน`);
    if (submission.regsup_thaiMusicTeachers) {
      const teachers = submission.regsup_thaiMusicTeachers;
      console.log(`   จำนวนครู: ${teachers.length} คน`);
      
      const qualifications = new Set();
      teachers.forEach((teacher, index) => {
        if (teacher.qualification) {
          qualifications.add(teacher.qualification);
          console.log(`   ครูที่ ${index + 1}: ${teacher.name} - ${teacher.qualification}`);
        }
      });
      console.log(`   ประเภทคุณวุฒิที่แตกต่าง: ${qualifications.size} ประเภท`);
    }

    // 3. Organization Support Score (5 คะแนน)
    const orgSupportScore = submission.scores?.organizationSupport || 0;
    console.log(`\n3. การสนับสนุนจากองค์กร: ${orgSupportScore} คะแนน`);

    // 4. External Support Score (15 คะแนน)
    const externalSupportScore = submission.scores?.externalSupport || 0;
    console.log(`\n4. การสนับสนุนจากภายนอก: ${externalSupportScore} คะแนน`);

    // 5. Awards Score (20 คะแนน)
    const awardsScore = submission.scores?.awards || 0;
    console.log(`\n5. รางวัล: ${awardsScore} คะแนน`);

    // 6. Internal Activities Score (5 คะแนน)
    const internalActivitiesScore = submission.scores?.internalActivities || 0;
    console.log(`\n6. กิจกรรมภายใน: ${internalActivitiesScore} คะแนน`);

    // 7. External Activities Score (5 คะแนน)
    const externalActivitiesScore = submission.scores?.externalActivities || 0;
    console.log(`\n7. กิจกรรมภายนอก: ${externalActivitiesScore} คะแนน`);

    // 8. Outside Province Activities Score (5 คะแนน)
    const outsideActivitiesScore = submission.scores?.outsideProvinceActivities || 0;
    console.log(`\n8. กิจกรรมต่างจังหวัด: ${outsideActivitiesScore} คะแนน`);

    // 9. PR Activities Score (5 คะแนน)
    const prActivitiesScore = submission.scores?.prActivities || 0;
    console.log(`\n9. กิจกรรม PR: ${prActivitiesScore} คะแนน`);

    // Total Score
    const totalScore = submission.totalScore || 0;
    console.log(`\n🏆 คะแนนรวม: ${totalScore} คะแนน`);

    // Grade
    const grade = submission.grade || 'ไม่ระบุ';
    console.log(`📊 เกรด: ${grade}`);

    console.log('\n=== สรุปการให้คะแนน ===');
    console.log(`การฝึกอบรมครู: ${trainingScore}/20`);
    console.log(`คุณวุฒิครู: ${qualificationScore}/20`);
    console.log(`การสนับสนุนจากองค์กร: ${orgSupportScore}/5`);
    console.log(`การสนับสนุนจากภายนอก: ${externalSupportScore}/15`);
    console.log(`รางวัล: ${awardsScore}/20`);
    console.log(`กิจกรรมภายใน: ${internalActivitiesScore}/5`);
    console.log(`กิจกรรมภายนอก: ${externalActivitiesScore}/5`);
    console.log(`กิจกรรมต่างจังหวัด: ${outsideActivitiesScore}/5`);
    console.log(`กิจกรรม PR: ${prActivitiesScore}/5`);
    console.log(`─────────────────────────`);
    console.log(`รวม: ${totalScore}/100 คะแนน`);
    console.log(`เกรด: ${grade}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkLatestRegisterSupportScore();