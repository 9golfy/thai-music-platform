const { MongoClient, ObjectId } = require('mongodb');
const MONGODB_URI = 'mongodb://localhost:27017/thai_music_school';

async function checkScoreDetails() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('thai_music_school');
  const collection = db.collection('register100_submissions');
  
  const record = await collection.findOne({ _id: new ObjectId('69aba4e1eb008602fa64a803') });
  
  if (record) {
    console.log('📊 DETAILED SCORE BREAKDOWN:');
    console.log('=====================================');
    
    // Individual scores
    console.log('1. Teacher Training Score:', record.reg100_teacher_training_score || 0, '/ 20');
    console.log('2. Teacher Qualification Score:', record.reg100_teacher_qualification_score || 0, '/ 20');
    console.log('3. Support from Org Score:', record.reg100_support_from_org_score || 0, '/ 5');
    console.log('4. Support from External Score:', record.reg100_support_from_external_score || 0, '/ 15');
    console.log('5. Award Score:', record.reg100_award_score || 0, '/ 20');
    console.log('6. Internal Activities Score:', record.reg100_activity_within_province_internal_score || 0, '/ 5');
    console.log('7. External Activities Score:', record.reg100_activity_within_province_external_score || 0, '/ 5');
    console.log('8. Outside Province Activities Score:', record.reg100_activity_outside_province_score || 0, '/ 5');
    console.log('9. PR Activities Score:', record.reg100_pr_activity_score || 0, '/ 5');
    console.log('=====================================');
    console.log('TOTAL SCORE:', record.reg100_total_score || 0, '/ 100');
    
    console.log('\n📋 ACTIVITY DETAILS:');
    console.log('=====================================');
    
    // Internal Activities
    const internalActivities = record.reg100_activitiesWithinProvinceInternal || [];
    console.log('Internal Activities Count:', internalActivities.length);
    internalActivities.forEach((activity, i) => {
      console.log(`  ${i+1}. "${activity.activityName || 'EMPTY'}" (${activity.activityDate || 'NO DATE'})`);
    });
    
    // External Activities
    const externalActivities = record.reg100_activitiesWithinProvinceExternal || [];
    console.log('\nExternal Activities Count:', externalActivities.length);
    externalActivities.forEach((activity, i) => {
      console.log(`  ${i+1}. "${activity.activityName || 'EMPTY'}" (${activity.activityDate || 'NO DATE'})`);
    });
    
    // Outside Province Activities
    const outsideActivities = record.reg100_activitiesOutsideProvince || [];
    console.log('\nOutside Province Activities Count:', outsideActivities.length);
    outsideActivities.forEach((activity, i) => {
      console.log(`  ${i+1}. "${activity.activityName || 'EMPTY'}" (${activity.activityDate || 'NO DATE'})`);
    });
    
    // PR Activities
    const prActivities = record.reg100_prActivities || [];
    console.log('\nPR Activities Count:', prActivities.length);
    prActivities.forEach((activity, i) => {
      console.log(`  ${i+1}. "${activity.activityName || 'EMPTY'}" (${activity.platform || 'NO PLATFORM'})`);
    });
    
    console.log('\n🏆 AWARDS:');
    console.log('=====================================');
    const awards = record.reg100_awards || [];
    console.log('Awards Count:', awards.length);
    awards.forEach((award, i) => {
      console.log(`  ${i+1}. Level: "${award.awardLevel || 'EMPTY'}" - Name: "${award.awardName || 'EMPTY'}"`);
    });
    
    console.log('\n👥 TEACHERS:');
    console.log('=====================================');
    const teachers = record.reg100_thaiMusicTeachers || [];
    console.log('Teachers Count:', teachers.length);
    const qualifications = teachers.map(t => t.teacherQualification).filter(q => q && q.trim() !== '');
    const uniqueQualifications = [...new Set(qualifications)];
    console.log('Unique Qualifications Count:', uniqueQualifications.length);
    uniqueQualifications.forEach((qual, i) => {
      console.log(`  ${i+1}. ${qual}`);
    });
    
    console.log('\n🔍 CHECKBOXES:');
    console.log('=====================================');
    console.log('Compulsory Subject:', record.reg100_isCompulsorySubject || false);
    console.log('After School Teaching:', record.reg100_hasAfterSchoolTeaching || false);
    console.log('Elective Subject:', record.reg100_hasElectiveSubject || false);
    console.log('Local Curriculum:', record.reg100_hasLocalCurriculum || false);
    console.log('Support from Org:', record.reg100_hasSupportFromOrg || false);
    console.log('Support from External:', record.reg100_hasSupportFromExternal || false);
    
  } else {
    console.log('❌ Record not found');
  }
  
  await client.close();
}

checkScoreDetails().catch(console.error);