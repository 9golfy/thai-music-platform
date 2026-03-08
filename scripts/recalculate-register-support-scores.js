const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function recalculateScores() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const collection = db.collection('register_support_submissions');
    
    // Get the specific record
    const id = '69abcc45bdfd421b3126102f';
    const submission = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!submission) {
      console.log('❌ No submission found with ID:', id);
      return;
    }
    
    console.log('📊 Recalculating scores for:', submission.regsup_schoolName);
    
    // Teacher training score (5 points per checkbox, max 20)
    let trainingScore = 0;
    if (submission.regsup_isCompulsorySubject) trainingScore += 5;
    if (submission.regsup_hasAfterSchoolTeaching) trainingScore += 5;
    if (submission.regsup_hasElectiveSubject) trainingScore += 5;
    if (submission.regsup_hasLocalCurriculum) trainingScore += 5;
    console.log('🎯 Teacher Training Score:', trainingScore);
    
    // Teacher qualification score (5 points per unique qualification type, max 20)
    const uniqueQualifications = new Set();
    if (submission.regsup_thaiMusicTeachers) {
      submission.regsup_thaiMusicTeachers.forEach((teacher) => {
        if (teacher.teacherQualification && teacher.teacherQualification.trim() !== '') {
          uniqueQualifications.add(teacher.teacherQualification);
        }
      });
    }
    const qualificationScore = uniqueQualifications.size * 5;
    console.log('🎯 Teacher Qualification Score:', qualificationScore, 'from', uniqueQualifications.size, 'unique qualifications');
    console.log('   Qualifications:', Array.from(uniqueQualifications));
    
    // Support from org score (5 if checked)
    const supportOrgScore = submission.regsup_hasSupportFromOrg ? 5 : 0;
    console.log('🎯 Support from Org Score:', supportOrgScore);
    
    // Support from external score (5/10/15 based on count)
    const externalCount = submission.regsup_supportFromExternal?.filter(
      item => item.organization && item.organization.trim() !== ''
    ).length || 0;
    let supportExternalScore = 0;
    if (externalCount >= 3) {
      supportExternalScore = 15;
    } else if (externalCount === 2) {
      supportExternalScore = 10;
    } else if (externalCount === 1) {
      supportExternalScore = 5;
    }
    console.log('🎯 Support from External Score:', supportExternalScore, 'from', externalCount, 'external supporters');
    
    // Award score (highest level only)
    let maxAwardScore = 0;
    if (submission.regsup_awards) {
      submission.regsup_awards.forEach((award) => {
        if (award.awardLevel === 'ประเทศ') maxAwardScore = Math.max(maxAwardScore, 20);
        else if (award.awardLevel === 'ภาค') maxAwardScore = Math.max(maxAwardScore, 15);
        else if (award.awardLevel === 'จังหวัด') maxAwardScore = Math.max(maxAwardScore, 10);
        else if (award.awardLevel === 'อำเภอ') maxAwardScore = Math.max(maxAwardScore, 5);
      });
    }
    console.log('🎯 Award Score:', maxAwardScore);
    
    // Activity scores (5 if >= 3 activities with actual data)
    const internalActivitiesCount = submission.regsup_activitiesWithinProvinceInternal?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    const internalActivityScore = internalActivitiesCount >= 3 ? 5 : 0;
    console.log('🎯 Internal Activity Score:', internalActivityScore, 'from', internalActivitiesCount, 'activities');
    
    const externalActivitiesCount = submission.regsup_activitiesWithinProvinceExternal?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    const externalActivityScore = externalActivitiesCount >= 3 ? 5 : 0;
    console.log('🎯 External Activity Score:', externalActivityScore, 'from', externalActivitiesCount, 'activities');
    
    const outsideActivitiesCount = submission.regsup_activitiesOutsideProvince?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    const outsideActivityScore = outsideActivitiesCount >= 3 ? 5 : 0;
    console.log('🎯 Outside Province Activity Score:', outsideActivityScore, 'from', outsideActivitiesCount, 'activities');
    
    // PR activity score (5 if >= 3 activities with actual data)
    const prActivitiesCount = submission.regsup_prActivities?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    const prActivityScore = prActivitiesCount >= 3 ? 5 : 0;
    console.log('🎯 PR Activity Score:', prActivityScore, 'from', prActivitiesCount, 'activities');
    
    // Calculate total score
    const totalScore = trainingScore + qualificationScore + supportOrgScore + supportExternalScore + 
                      maxAwardScore + internalActivityScore + externalActivityScore + 
                      outsideActivityScore + prActivityScore;
    
    console.log('\n📊 SCORE SUMMARY:');
    console.log('Teacher Training:', trainingScore);
    console.log('Teacher Qualification:', qualificationScore);
    console.log('Support from Org:', supportOrgScore);
    console.log('Support from External:', supportExternalScore);
    console.log('Awards:', maxAwardScore);
    console.log('Internal Activities:', internalActivityScore);
    console.log('External Activities:', externalActivityScore);
    console.log('Outside Province Activities:', outsideActivityScore);
    console.log('PR Activities:', prActivityScore);
    console.log('TOTAL SCORE:', totalScore);
    
    // Update the document with calculated scores
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          teacher_training_score: trainingScore,
          teacher_qualification_score: qualificationScore,
          support_from_org_score: supportOrgScore,
          support_from_external_score: supportExternalScore,
          award_score: maxAwardScore,
          activity_within_province_internal_score: internalActivityScore,
          activity_within_province_external_score: externalActivityScore,
          activity_outside_province_score: outsideActivityScore,
          pr_activity_score: prActivityScore,
          total_score: totalScore,
          updatedAt: new Date()
        }
      }
    );
    
    console.log('\n✅ Updated scores in database:', updateResult.modifiedCount, 'document(s) modified');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Connection closed');
  }
}

recalculateScores();