const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function recalculateRegister100Scores() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const collection = db.collection('register100_submissions');
    
    // Get the specific submission
    const submissionId = '69ace7425d451baf6766d1fb';
    const submission = await collection.findOne({ _id: new ObjectId(submissionId) });
    
    if (!submission) {
      console.log('❌ Submission not found');
      return;
    }
    
    console.log('✅ Found submission:', submission._id);
    console.log('🏫 School:', submission.reg100_schoolName);
    
    // Calculate scores
    const calculateScores = (submissionData) => {
      let scores = {
        teacher_training_score: 0,
        teacher_qualification_score: 0,
        support_from_org_score: 0,
        support_from_external_score: 0,
        award_score: 0,
        activity_within_province_internal_score: 0,
        activity_within_province_external_score: 0,
        activity_outside_province_score: 0,
        pr_activity_score: 0,
        total_score: 0
      };

      // Helper function to get field value with both naming conventions
      const getFieldValue = (fieldName) => {
        return submissionData[`reg100_${fieldName}`] ?? submissionData[fieldName];
      };

      // Step 4: Teacher Training Score (4 checkboxes × 5 points each = 20 max)
      let trainingScore = 0;
      if (getFieldValue('isCompulsorySubject')) trainingScore += 5;
      if (getFieldValue('hasAfterSchoolTeaching')) trainingScore += 5;
      if (getFieldValue('hasElectiveSubject')) trainingScore += 5;
      if (getFieldValue('hasLocalCurriculum')) trainingScore += 5;
      scores.teacher_training_score = trainingScore;

      // Step 4: Teacher Qualification Score (unique qualifications × 5 points each = 20 max)
      const teachers = getFieldValue('thaiMusicTeachers') || [];
      const uniqueQualifications = new Set();
      if (Array.isArray(teachers)) {
        teachers.forEach((teacher) => {
          if (teacher.teacherQualification) {
            uniqueQualifications.add(teacher.teacherQualification);
          }
        });
      }
      scores.teacher_qualification_score = Math.min(uniqueQualifications.size * 5, 20);

      // Step 5: Support from Organization Score (checkbox = 5 points)
      scores.support_from_org_score = getFieldValue('hasSupportFromOrg') ? 5 : 0;

      // Step 5: Support from External Score (1=5, 2=10, 3+=15)
      const externalSupport = getFieldValue('supportFromExternal') || [];
      const externalCount = Array.isArray(externalSupport) ? externalSupport.length : 0;
      if (externalCount >= 3) scores.support_from_external_score = 15;
      else if (externalCount === 2) scores.support_from_external_score = 10;
      else if (externalCount === 1) scores.support_from_external_score = 5;

      // Step 5: Award Score (highest level: อำเภอ=5, จังหวัด=10, ภาค=15, ประเทศ=20)
      const awards = getFieldValue('awards') || [];
      let maxAwardScore = 0;
      if (Array.isArray(awards)) {
        awards.forEach((award) => {
          if (award.awardLevel === 'ประเทศ') maxAwardScore = Math.max(maxAwardScore, 20);
          else if (award.awardLevel === 'ภาค') maxAwardScore = Math.max(maxAwardScore, 15);
          else if (award.awardLevel === 'จังหวัด') maxAwardScore = Math.max(maxAwardScore, 10);
          else if (award.awardLevel === 'อำเภอ') maxAwardScore = Math.max(maxAwardScore, 5);
        });
      }
      scores.award_score = maxAwardScore;

      // Step 7: Activity Scores (≥3 activities = 5 points each)
      const internalActivities = getFieldValue('activitiesWithinProvinceInternal') || [];
      scores.activity_within_province_internal_score = (Array.isArray(internalActivities) && internalActivities.length >= 3) ? 5 : 0;

      const externalActivities = getFieldValue('activitiesWithinProvinceExternal') || [];
      scores.activity_within_province_external_score = (Array.isArray(externalActivities) && externalActivities.length >= 3) ? 5 : 0;

      const outsideActivities = getFieldValue('activitiesOutsideProvince') || [];
      scores.activity_outside_province_score = (Array.isArray(outsideActivities) && outsideActivities.length >= 3) ? 5 : 0;

      // Step 8: PR Activity Score (≥3 activities = 5 points)
      const prActivities = getFieldValue('prActivities') || [];
      scores.pr_activity_score = (Array.isArray(prActivities) && prActivities.length >= 3) ? 5 : 0;

      // Calculate total score
      scores.total_score = scores.teacher_training_score + 
                          scores.teacher_qualification_score + 
                          scores.support_from_org_score + 
                          scores.support_from_external_score + 
                          scores.award_score + 
                          scores.activity_within_province_internal_score + 
                          scores.activity_within_province_external_score + 
                          scores.activity_outside_province_score + 
                          scores.pr_activity_score;

      return scores;
    };
    
    // Calculate new scores
    const newScores = calculateScores(submission);
    
    console.log('\n📊 Calculated Scores:');
    console.log('  - Teacher Training:', newScores.teacher_training_score, '/20');
    console.log('  - Teacher Qualification:', newScores.teacher_qualification_score, '/20');
    console.log('  - Support from Org:', newScores.support_from_org_score, '/5');
    console.log('  - Support from External:', newScores.support_from_external_score, '/15');
    console.log('  - Awards:', newScores.award_score, '/20');
    console.log('  - Internal Activities:', newScores.activity_within_province_internal_score, '/5');
    console.log('  - External Activities:', newScores.activity_within_province_external_score, '/5');
    console.log('  - Outside Activities:', newScores.activity_outside_province_score, '/5');
    console.log('  - PR Activities:', newScores.pr_activity_score, '/5');
    console.log('  - TOTAL:', newScores.total_score, '/100');
    
    // Update the document with new scores
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(submissionId) },
      { $set: newScores }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log('\n✅ Scores updated successfully!');
    } else {
      console.log('\n❌ Failed to update scores');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

recalculateRegister100Scores();