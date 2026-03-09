const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function calculateSpecificRegisterSupport() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');

    const submissionId = '69ad8250fcaa2809454bab8f';
    console.log(`=== คำนวณคะแนน Register Support ID: ${submissionId} ===`);
    
    const submission = await collection.findOne({ _id: new ObjectId(submissionId) });
    
    if (!submission) {
      console.log('❌ ไม่พบ submission');
      return;
    }

    console.log(`ชื่อโรงเรียน: ${submission.regsup_schoolName}`);
    console.log(`อีเมลครู: ${submission.regsup_mgtEmail}`);

    // คำนวณคะแนน
    let scores = {};
    let totalScore = 0;

    // 1. Teacher Training Score (20 คะแนน)
    let teacherTrainingScore = 0;
    if (submission.regsup_teacherTraining) {
      const trainingTypes = Object.keys(submission.regsup_teacherTraining).filter(
        key => submission.regsup_teacherTraining[key] === true
      );
      teacherTrainingScore = Math.min(trainingTypes.length * 5, 20);
      console.log(`การฝึกอบรมครู: ${trainingTypes.length} ประเภท × 5 = ${teacherTrainingScore} คะแนน`);
    }
    scores.teacherTraining = teacherTrainingScore;
    totalScore += teacherTrainingScore;

    // 2. Teacher Qualification Score (20 คะแนน)
    let teacherQualificationScore = 0;
    if (submission.regsup_thaiMusicTeachers && submission.regsup_thaiMusicTeachers.length > 0) {
      const qualifications = new Set();
      submission.regsup_thaiMusicTeachers.forEach(teacher => {
        if (teacher.qualification) {
          qualifications.add(teacher.qualification);
        }
      });
      teacherQualificationScore = Math.min(qualifications.size * 5, 20);
      console.log(`คุณวุฒิครู: ${qualifications.size} ประเภท × 5 = ${teacherQualificationScore} คะแนน`);
    }
    scores.teacherQualification = teacherQualificationScore;
    totalScore += teacherQualificationScore;

    // 3. Organization Support Score (5 คะแนน)
    let organizationSupportScore = 0;
    if (submission.regsup_supportFromOrganization) {
      organizationSupportScore = 5;
      console.log(`การสนับสนุนจากองค์กร: 5 คะแนน`);
    }
    scores.organizationSupport = organizationSupportScore;
    totalScore += organizationSupportScore;

    // 4. External Support Score (15 คะแนน)
    let externalSupportScore = 0;
    const externalSupportFields = [
      'regsup_supportFromEducationArea',
      'regsup_supportFromCulturalOffice', 
      'regsup_supportFromSchool',
      'regsup_supportFromCommunity',
      'regsup_supportFromOther'
    ];
    
    let externalSupportCount = 0;
    externalSupportFields.forEach(field => {
      if (submission[field]) {
        externalSupportCount++;
      }
    });
    
    if (externalSupportCount >= 3) {
      externalSupportScore = 15;
    } else if (externalSupportCount >= 2) {
      externalSupportScore = 10;
    } else if (externalSupportCount >= 1) {
      externalSupportScore = 5;
    }
    console.log(`การสนับสนุนจากภายนอก: ${externalSupportCount} รายการ = ${externalSupportScore} คะแนน`);
    scores.externalSupport = externalSupportScore;
    totalScore += externalSupportScore;

    // 5. Awards Score (20 คะแนน)
    let awardsScore = 0;
    if (submission.regsup_awards && submission.regsup_awards.length > 0) {
      const nationalAwards = submission.regsup_awards.filter(award => 
        award.level === 'national' || award.level === 'ระดับชาติ'
      );
      const regionalAwards = submission.regsup_awards.filter(award => 
        award.level === 'regional' || award.level === 'ระดับภาค'
      );
      const provinceAwards = submission.regsup_awards.filter(award => 
        award.level === 'province' || award.level === 'ระดับจังหวัด'
      );

      if (nationalAwards.length > 0) {
        awardsScore = 20;
      } else if (regionalAwards.length > 0) {
        awardsScore = 15;
      } else if (provinceAwards.length > 0) {
        awardsScore = 10;
      }
      console.log(`รางวัล: ชาติ ${nationalAwards.length}, ภาค ${regionalAwards.length}, จังหวัด ${provinceAwards.length} = ${awardsScore} คะแนน`);
    }
    scores.awards = awardsScore;
    totalScore += awardsScore;

    // 6. Internal Activities Score (5 คะแนน)
    let internalActivitiesScore = 0;
    if (submission.regsup_internalActivities && submission.regsup_internalActivities.length >= 3) {
      internalActivitiesScore = 5;
      console.log(`กิจกรรมภายใน: ${submission.regsup_internalActivities.length} รายการ = 5 คะแนน`);
    }
    scores.internalActivities = internalActivitiesScore;
    totalScore += internalActivitiesScore;

    // 7. External Activities Score (5 คะแนน)
    let externalActivitiesScore = 0;
    if (submission.regsup_externalActivities && submission.regsup_externalActivities.length >= 3) {
      externalActivitiesScore = 5;
      console.log(`กิจกรรมภายนอก: ${submission.regsup_externalActivities.length} รายการ = 5 คะแนน`);
    }
    scores.externalActivities = externalActivitiesScore;
    totalScore += externalActivitiesScore;

    // 8. Outside Province Activities Score (5 คะแนน)
    let outsideProvinceActivitiesScore = 0;
    if (submission.regsup_outsideProvinceActivities && submission.regsup_outsideProvinceActivities.length >= 3) {
      outsideProvinceActivitiesScore = 5;
      console.log(`กิจกรรมต่างจังหวัด: ${submission.regsup_outsideProvinceActivities.length} รายการ = 5 คะแนน`);
    }
    scores.outsideProvinceActivities = outsideProvinceActivitiesScore;
    totalScore += outsideProvinceActivitiesScore;

    // 9. PR Activities Score (5 คะแนน)
    let prActivitiesScore = 0;
    if (submission.regsup_prActivities && submission.regsup_prActivities.length >= 3) {
      prActivitiesScore = 5;
      console.log(`กิจกรรม PR: ${submission.regsup_prActivities.length} รายการ = 5 คะแนน`);
    }
    scores.prActivities = prActivitiesScore;
    totalScore += prActivitiesScore;

    // คำนวณเกรด
    let grade;
    if (totalScore >= 80) {
      grade = 'A';
    } else if (totalScore >= 70) {
      grade = 'B';
    } else if (totalScore >= 60) {
      grade = 'C';
    } else if (totalScore >= 50) {
      grade = 'D';
    } else {
      grade = 'F';
    }

    console.log(`\n🏆 คะแนนรวม: ${totalScore} คะแนน`);
    console.log(`📊 เกรด: ${grade}`);

    // อัปเดตข้อมูลในฐานข้อมูล
    await collection.updateOne(
      { _id: new ObjectId(submissionId) },
      {
        $set: {
          scores: scores,
          totalScore: totalScore,
          grade: grade,
          updatedAt: new Date()
        }
      }
    );

    console.log('\n✅ อัปเดตคะแนนในฐานข้อมูลเรียบร้อย');

    console.log('\n=== สรุปการให้คะแนนรายละเอียด ===');
    console.log(`การฝึกอบรมครู: ${teacherTrainingScore}/20`);
    console.log(`คุณวุฒิครู: ${teacherQualificationScore}/20`);
    console.log(`การสนับสนุนจากองค์กร: ${organizationSupportScore}/5`);
    console.log(`การสนับสนุนจากภายนอก: ${externalSupportScore}/15`);
    console.log(`รางวัล: ${awardsScore}/20`);
    console.log(`กิจกรรมภายใน: ${internalActivitiesScore}/5`);
    console.log(`กิจกรรมภายนอก: ${externalActivitiesScore}/5`);
    console.log(`กิจกรรมต่างจังหวัด: ${outsideProvinceActivitiesScore}/5`);
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

calculateSpecificRegisterSupport();