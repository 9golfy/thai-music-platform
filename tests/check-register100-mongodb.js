const { MongoClient } = require('mongodb');

async function checkRegister100Data() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db('thai_music_school');
    const collection = database.collection('register100_submissions');

    // Get the latest submission
    const latestSubmission = await collection
      .findOne({}, { sort: { _id: -1 } });

    if (!latestSubmission) {
      console.log('❌ No submissions found in register100_submissions collection');
      return;
    }

    console.log('\n📊 LATEST REGISTER100 SUBMISSION DATA:');
    console.log('=====================================\n');

    // Basic Info
    console.log('🏫 BASIC INFORMATION:');
    console.log(`   School Name: ${latestSubmission.schoolName}`);
    console.log(`   Province: ${latestSubmission.schoolProvince}`);
    console.log(`   Level: ${latestSubmission.schoolLevel}`);
    console.log(`   Staff Count: ${latestSubmission.staffCount}`);
    console.log(`   Student Count: ${latestSubmission.studentCount}`);
    console.log(`   School Size: ${latestSubmission.schoolSize || 'N/A'}`);

    // Administrator
    console.log('\n👤 ADMINISTRATOR:');
    console.log(`   Name: ${latestSubmission.mgtFullName}`);
    console.log(`   Position: ${latestSubmission.mgtPosition}`);
    console.log(`   Phone: ${latestSubmission.mgtPhone}`);
    console.log(`   Email: ${latestSubmission.mgtEmail}`);

    // Teachers
    console.log('\n👨‍🏫 TEACHERS:');
    console.log(`   Total Teachers: ${latestSubmission.thaiMusicTeachers?.length || 0}`);
    if (latestSubmission.thaiMusicTeachers?.length > 0) {
      const qualifications = new Set();
      latestSubmission.thaiMusicTeachers.forEach((teacher, index) => {
        console.log(`   Teacher ${index + 1}: ${teacher.teacherFullName} (${teacher.teacherPosition})`);
        console.log(`      Qualification: ${teacher.teacherQualification || 'N/A'}`);
        if (teacher.teacherQualification) {
          qualifications.add(teacher.teacherQualification);
        }
      });
      console.log(`   Unique Qualifications: ${qualifications.size}`);
    }

    // Teaching Plans
    console.log('\n📚 TEACHING PLANS:');
    console.log(`   Music Types: ${latestSubmission.currentMusicTypes?.length || 0}`);
    console.log(`   Readiness Items: ${latestSubmission.readinessItems?.length || 0}`);

    // Training Checkboxes (Score calculation)
    console.log('\n✅ TRAINING CHECKBOXES (Score Calculation):');
    console.log(`   Compulsory Subject: ${latestSubmission.isCompulsorySubject ? '✓' : '✗'}`);
    console.log(`   After School Teaching: ${latestSubmission.hasAfterSchoolTeaching ? '✓' : '✗'}`);
    console.log(`   Elective Subject: ${latestSubmission.hasElectiveSubject ? '✓' : '✗'}`);
    console.log(`   Local Curriculum: ${latestSubmission.hasLocalCurriculum ? '✓' : '✗'}`);
    console.log(`   Teacher Training Score: ${latestSubmission.teacher_training_score || 0} points`);
    console.log(`   Teacher Qualification Score: ${latestSubmission.teacher_qualification_score || 0} points`);

    // Support (Score calculation)
    console.log('\n🤝 SUPPORT (Score Calculation):');
    console.log(`   Support from Org: ${latestSubmission.hasSupportFromOrg ? '✓' : '✗'}`);
    console.log(`   Support from Org Score: ${latestSubmission.support_from_org_score || 0} points`);
    console.log(`   Support from External Count: ${latestSubmission.supportFromExternal?.length || 0}`);
    console.log(`   Support from External Score: ${latestSubmission.support_from_external_score || 0} points`);

    // Awards (Score calculation)
    console.log('\n🏆 AWARDS (Score Calculation):');
    console.log(`   Total Awards: ${latestSubmission.awards?.length || 0}`);
    if (latestSubmission.awards?.length > 0) {
      latestSubmission.awards.forEach((award, index) => {
        console.log(`   Award ${index + 1}: ${award.awardLevel} - ${award.awardName}`);
      });
    }
    console.log(`   Award Score: ${latestSubmission.award_score || 0} points`);

    // Activities (Score calculation)
    console.log('\n🎭 ACTIVITIES (Score Calculation):');
    console.log(`   Within Province - Internal: ${latestSubmission.activitiesWithinProvinceInternal?.length || 0} activities`);
    console.log(`   Within Province - Internal Score: ${latestSubmission.activity_within_province_internal_score || 0} points`);
    console.log(`   Within Province - External: ${latestSubmission.activitiesWithinProvinceExternal?.length || 0} activities`);
    console.log(`   Within Province - External Score: ${latestSubmission.activity_within_province_external_score || 0} points`);
    console.log(`   Outside Province: ${latestSubmission.activitiesOutsideProvince?.length || 0} activities`);
    console.log(`   Outside Province Score: ${latestSubmission.activity_outside_province_score || 0} points`);

    // PR Activities (Score calculation)
    console.log('\n📢 PR ACTIVITIES (Score Calculation):');
    console.log(`   Total PR Activities: ${latestSubmission.prActivities?.length || 0}`);
    console.log(`   PR Activity Score: ${latestSubmission.pr_activity_score || 0} points`);

    // Heard From Sources
    console.log('\n📣 HEARD FROM SOURCES:');
    console.log(`   School: ${latestSubmission.heardFromSchool ? '✓' : '✗'} ${latestSubmission.heardFromSchoolName || ''}`);
    console.log(`   Facebook: ${latestSubmission.DCP_PR_Channel_FACEBOOK ? '✓' : '✗'}`);
    console.log(`   YouTube: ${latestSubmission.DCP_PR_Channel_YOUTUBE ? '✓' : '✗'}`);
    console.log(`   TikTok: ${latestSubmission.DCP_PR_Channel_Tiktok ? '✓' : '✗'}`);
    console.log(`   Cultural Office: ${latestSubmission.heardFromCulturalOffice ? '✓' : '✗'}`);
    console.log(`   Education Area: ${latestSubmission.heardFromEducationArea ? '✓' : '✗'}`);

    // Total Score
    console.log('\n🎯 TOTAL SCORE:');
    console.log(`   =====================================`);
    console.log(`   TOTAL SCORE: ${latestSubmission.total_score || 0} points`);
    console.log(`   =====================================`);

    // Certification
    console.log('\n✍️ CERTIFICATION:');
    console.log(`   Certified: ${latestSubmission.certifiedINFOByAdminName ? '✓' : '✗'}`);

    // Submission metadata
    console.log('\n📅 SUBMISSION INFO:');
    console.log(`   Submission ID: ${latestSubmission._id}`);
    console.log(`   Created At: ${latestSubmission.createdAt || 'N/A'}`);

    // Validate score calculation
    console.log('\n🔍 SCORE VALIDATION:');
    const expectedScore = 
      (latestSubmission.teacher_training_score || 0) +
      (latestSubmission.teacher_qualification_score || 0) +
      (latestSubmission.support_from_org_score || 0) +
      (latestSubmission.support_from_external_score || 0) +
      (latestSubmission.award_score || 0) +
      (latestSubmission.activity_within_province_internal_score || 0) +
      (latestSubmission.activity_within_province_external_score || 0) +
      (latestSubmission.activity_outside_province_score || 0) +
      (latestSubmission.pr_activity_score || 0);

    console.log(`   Calculated Total: ${expectedScore} points`);
    console.log(`   Stored Total: ${latestSubmission.total_score || 0} points`);
    
    if (expectedScore === (latestSubmission.total_score || 0)) {
      console.log(`   ✅ Score calculation is CORRECT!`);
    } else {
      console.log(`   ❌ Score mismatch! Expected ${expectedScore} but got ${latestSubmission.total_score || 0}`);
    }

    // Count total submissions
    const totalCount = await collection.countDocuments();
    console.log(`\n📊 Total submissions in database: ${totalCount}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

checkRegister100Data();
