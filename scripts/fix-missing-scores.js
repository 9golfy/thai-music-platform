const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

// Score calculation functions
function calculateTeacherTrainingScore(submission) {
  let score = 0;
  if (submission.regsup_isCompulsorySubject || submission.isCompulsorySubject) score += 5;
  if (submission.regsup_hasAfterSchoolTeaching || submission.hasAfterSchoolTeaching) score += 5;
  if (submission.regsup_hasElectiveSubject || submission.hasElectiveSubject) score += 5;
  if (submission.regsup_hasLocalCurriculum || submission.hasLocalCurriculum) score += 5;
  return score;
}

function calculateTeacherQualificationScore(submission) {
  const teachers = submission.regsup_thaiMusicTeachers || submission.thaiMusicTeachers || [];
  const qualificationTypes = new Set();
  
  teachers.forEach(teacher => {
    if (teacher.teacherQualification) {
      qualificationTypes.add(teacher.teacherQualification);
    }
  });
  
  return Math.min(qualificationTypes.size * 5, 20);
}

function calculateSupportFromOrgScore(submission) {
  return (submission.regsup_hasSupportFromOrg || submission.hasSupportFromOrg) ? 5 : 0;
}

function calculateSupportFromExternalScore(submission) {
  const supportList = submission.regsup_supportFromExternal || submission.supportFromExternal || [];
  const count = supportList.length;
  
  if (count >= 3) return 15;
  if (count === 2) return 10;
  if (count === 1) return 5;
  return 0;
}

function calculateAwardScore(submission) {
  const awards = submission.regsup_awards || submission.awards || [];
  let maxScore = 0;
  
  awards.forEach(award => {
    const level = award.awardLevel;
    if (level && level.includes('ประเทศ')) maxScore = Math.max(maxScore, 20);
    else if (level && level.includes('ภาค')) maxScore = Math.max(maxScore, 15);
    else if (level && level.includes('จังหวัด')) maxScore = Math.max(maxScore, 10);
    else if (level && level.includes('อำเภอ')) maxScore = Math.max(maxScore, 5);
  });
  
  return maxScore;
}

function calculateActivityScore(activities) {
  return (activities && activities.length >= 3) ? 5 : 0;
}

function calculatePRActivityScore(submission) {
  const prActivities = submission.regsup_prActivities || submission.prActivities || [];
  return (prActivities.length >= 3) ? 5 : 0;
}

async function fixMissingScores() {
  console.log('=== Fixing Missing Scores ===\n');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    // Fix register-support scores
    console.log('1. Fixing Register Support Scores:');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportData = await registerSupportCollection.find({
      total_score: { $exists: false }
    }).toArray();
    
    for (const submission of registerSupportData) {
      console.log(`   Processing: ${submission.regsup_schoolName || submission.schoolName}`);
      
      // Calculate all scores
      const teacher_training_score = calculateTeacherTrainingScore(submission);
      const teacher_qualification_score = calculateTeacherQualificationScore(submission);
      const support_from_org_score = calculateSupportFromOrgScore(submission);
      const support_from_external_score = calculateSupportFromExternalScore(submission);
      const award_score = calculateAwardScore(submission);
      
      const activity_within_province_internal_score = calculateActivityScore(
        submission.regsup_activitiesWithinProvinceInternal || submission.activitiesWithinProvinceInternal
      );
      const activity_within_province_external_score = calculateActivityScore(
        submission.regsup_activitiesWithinProvinceExternal || submission.activitiesWithinProvinceExternal
      );
      const activity_outside_province_score = calculateActivityScore(
        submission.regsup_activitiesOutsideProvince || submission.activitiesOutsideProvince
      );
      
      const pr_activity_score = calculatePRActivityScore(submission);
      
      const total_score = teacher_training_score + teacher_qualification_score + 
                         support_from_org_score + support_from_external_score + award_score +
                         activity_within_province_internal_score + activity_within_province_external_score +
                         activity_outside_province_score + pr_activity_score;
      
      // Update the submission
      await registerSupportCollection.updateOne(
        { _id: submission._id },
        {
          $set: {
            teacher_training_score,
            teacher_qualification_score,
            support_from_org_score,
            support_from_external_score,
            award_score,
            activity_within_province_internal_score,
            activity_within_province_external_score,
            activity_outside_province_score,
            pr_activity_score,
            total_score,
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`     ✅ Updated with total score: ${total_score}`);
    }
    
    // Check register100 scores (should be fine but let's verify)
    console.log('\n2. Checking Register100 Scores:');
    const register100Collection = database.collection('register100_submissions');
    const register100Data = await register100Collection.find({
      total_score: { $exists: false }
    }).toArray();
    
    if (register100Data.length === 0) {
      console.log('   ✅ All register100 schools have scores');
    } else {
      console.log(`   ⚠️  Found ${register100Data.length} register100 schools without scores`);
    }
    
    console.log('\n✅ Score fixing completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixMissingScores().catch(console.error);