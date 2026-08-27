/**
 * Find Register100 submissions with missing scores
 * 
 * หาโรงเรียนที่มี checkbox/data แต่ไม่มีคะแนน
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function main() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('thai_music_school');
    const collection = db.collection('register100_submissions');
    
    // Get all submissions
    const submissions = await collection.find({}).toArray();
    
    console.log(`📊 Total submissions: ${submissions.length}\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    const issuesFound = [];
    
    submissions.forEach((doc, index) => {
      const schoolName = doc.reg100_schoolName || 'N/A';
      const schoolId = doc.schoolId || 'N/A';
      const issues = [];
      
      // Check Step 4: Teacher Qualifications
      const teachers = doc.reg100_thaiMusicTeachers || doc.thaiMusicTeachers || [];
      const uniqueQualifications = new Set(
        teachers.map(t => t.teacherQualification).filter(Boolean)
      );
      const expectedTeacherScore = Math.min(uniqueQualifications.size * 5, 20);
      const actualTeacherScore = doc.teacher_qualification_score ?? 0;
      
      if (teachers.length > 0 && actualTeacherScore === 0) {
        issues.push(`❌ Step 4: มีครู ${teachers.length} คน (${uniqueQualifications.size} คุณลักษณะ) แต่คะแนน = 0 (ควรได้ ${expectedTeacherScore})`);
      } else if (expectedTeacherScore !== actualTeacherScore) {
        issues.push(`⚠️  Step 4: คะแนนไม่ตรง - มี ${uniqueQualifications.size} คุณลักษณะ แต่ได้ ${actualTeacherScore} คะแนน (ควร ${expectedTeacherScore})`);
      }
      
      // Check Step 5: Teaching Curriculum
      const hasCurriculum = doc.reg100_hasCurriculum || false;
      const curriculumTypes = doc.reg100_curriculumTypes || [];
      const expectedCurriculumScore = Math.min(curriculumTypes.length * 5, 20);
      const actualCurriculumScore = doc.teaching_curriculum_score ?? 0;
      
      if (hasCurriculum && curriculumTypes.length > 0 && actualCurriculumScore === 0) {
        issues.push(`❌ Step 5: ติ๊กมีหลักสูตร (${curriculumTypes.length} ประเภท) แต่คะแนน = 0 (ควรได้ ${expectedCurriculumScore})`);
      }
      
      // Check Step 7: Support from org
      const hasSupportFromOrg = doc.reg100_hasSupportFromOrg || doc.hasSupportFromOrg || false;
      const actualOrgScore = doc.support_from_org_score ?? 0;
      
      if (hasSupportFromOrg && actualOrgScore === 0) {
        issues.push(`❌ Step 7: ติ๊กได้รับการสนับสนุนจากต้นสังกัด แต่คะแนน = 0 (ควรได้ 5)`);
      }
      
      // Check Step 7: Support from external
      const externalSupport = doc.supportFromExternal || doc.reg100_supportFromExternal || [];
      const expectedExternalScore = externalSupport.length >= 3 ? 15 : 
                                    externalSupport.length === 2 ? 10 : 
                                    externalSupport.length === 1 ? 5 : 0;
      const actualExternalScore = doc.support_from_external_score ?? 0;
      
      if (externalSupport.length > 0 && actualExternalScore === 0) {
        issues.push(`❌ Step 7: มีการสนับสนุนจากภายนอก ${externalSupport.length} คน แต่คะแนน = 0 (ควรได้ ${expectedExternalScore})`);
      }
      
      // Check Step 7: Awards
      const awards = doc.awards || [];
      let maxAwardScore = 0;
      awards.forEach(award => {
        if (award.awardLevel === 'ประเทศ') maxAwardScore = Math.max(maxAwardScore, 20);
        else if (award.awardLevel === 'ภาค') maxAwardScore = Math.max(maxAwardScore, 15);
        else if (award.awardLevel === 'จังหวัด') maxAwardScore = Math.max(maxAwardScore, 10);
        else if (award.awardLevel === 'อำเภอ') maxAwardScore = Math.max(maxAwardScore, 5);
      });
      const actualAwardScore = doc.award_score ?? 0;
      
      if (awards.length > 0 && actualAwardScore === 0) {
        issues.push(`❌ Step 7: มีรางวัล ${awards.length} รางวัล แต่คะแนน = 0 (ควรได้ ${maxAwardScore})`);
      }
      
      // Check Step 8: Activities
      const internalActivities = doc.activitiesWithinProvinceInternal || [];
      const externalActivities = doc.activitiesWithinProvinceExternal || [];
      const outsideActivities = doc.activitiesOutsideProvince || [];
      
      const actualInternalScore = doc.activity_within_province_internal_score ?? 0;
      const actualExternalActivityScore = doc.activity_within_province_external_score ?? 0;
      const actualOutsideScore = doc.activity_outside_province_score ?? 0;
      
      if (internalActivities.length >= 3 && actualInternalScore === 0) {
        issues.push(`❌ Step 8: กิจกรรมภายในสถานศึกษา ${internalActivities.length} ครั้ง แต่คะแนน = 0 (ควรได้ 5)`);
      }
      if (externalActivities.length >= 3 && actualExternalActivityScore === 0) {
        issues.push(`❌ Step 8: กิจกรรมนอกสถานศึกษา ${externalActivities.length} ครั้ง แต่คะแนน = 0 (ควรได้ 5)`);
      }
      if (outsideActivities.length >= 3 && actualOutsideScore === 0) {
        issues.push(`❌ Step 8: กิจกรรมนอกจังหวัด ${outsideActivities.length} ครั้ง แต่คะแนน = 0 (ควรได้ 5)`);
      }
      
      // Check Step 9: PR Activities
      const prActivities = doc.prActivities || [];
      const actualPrScore = doc.pr_activity_score ?? 0;
      
      if (prActivities.length >= 3 && actualPrScore === 0) {
        issues.push(`❌ Step 9: PR กิจกรรม ${prActivities.length} ครั้ง แต่คะแนน = 0 (ควรได้ 5)`);
      }
      
      if (issues.length > 0) {
        issuesFound.push({
          schoolId,
          schoolName,
          email: doc.teacherEmail || 'N/A',
          _id: doc._id.toString(),
          issues
        });
      }
    });
    
    if (issuesFound.length === 0) {
      console.log('✅ ไม่พบโรงเรียนที่มีคะแนนหาย - ทุกอย่างปกติ!\n');
    } else {
      console.log(`⚠️  พบโรงเรียนที่มีปัญหา: ${issuesFound.length} โรงเรียน\n`);
      
      issuesFound.forEach((school, index) => {
        console.log(`${index + 1}. ${school.schoolName}`);
        console.log(`   School ID: ${school.schoolId}`);
        console.log(`   Email: ${school.email}`);
        console.log(`   MongoDB ID: ${school._id}`);
        console.log(`   URL: http://localhost:3000/dcp-admin/dashboard/register100/${school._id}`);
        console.log(`   ปัญหา:`);
        school.issues.forEach(issue => {
          console.log(`      ${issue}`);
        });
        console.log('');
      });
      
      console.log('═══════════════════════════════════════════════════════════════\n');
      console.log('💡 วิธีแก้ไข:');
      console.log('   1. เปิด URL ของโรงเรียนที่มีปัญหา');
      console.log('   2. กด Edit mode');
      console.log('   3. กด Save (ระบบจะคำนวณคะแนนใหม่อัตโนมัติ)');
      console.log('   4. หรือใช้ script recalculate-scores.js\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.close();
    console.log('✅ Connection closed');
  }
}

main();
