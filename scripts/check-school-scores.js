/**
 * Check School Scores
 * 
 * เช็คคะแนนของโรงเรียนใน database
 * 
 * Usage:
 * node scripts/check-school-scores.js <id>
 * 
 * Example:
 * node scripts/check-school-scores.js 6a1d756b1b4650d917db564a
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ Error: Please provide document ID');
    console.log('\nUsage:');
    console.log('  node scripts/check-school-scores.js <id>');
    console.log('\nExample:');
    console.log('  node scripts/check-school-scores.js 6a1d756b1b4650d917db564a');
    process.exit(1);
  }
  
  const id = args[0];
  
  console.log('🔍 Checking scores for ID:', id);
  console.log('📡 Connecting to MongoDB...\n');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('thai_music_school');
    
    // Try register_support_submissions first
    const registerSupport = db.collection('register_support_submissions');
    let doc = await registerSupport.findOne({ _id: new ObjectId(id) });
    
    if (!doc) {
      // Try register100_submissions
      const register100 = db.collection('register100_submissions');
      doc = await register100.findOne({ _id: new ObjectId(id) });
      
      if (!doc) {
        console.error('❌ Document not found in both collections');
        process.exit(1);
      }
      
      console.log('📋 Found in: register100_submissions\n');
    } else {
      console.log('📋 Found in: register_support_submissions\n');
    }
    
    console.log('🏫 School Info:');
    console.log(`   School ID: ${doc.schoolId}`);
    console.log(`   Name: ${doc.reg100_schoolName || doc.regsup_schoolName || 'N/A'}`);
    console.log(`   Email: ${doc.teacherEmail || 'N/A'}`);
    console.log('');
    
    console.log('═══════════════════════════════════════');
    console.log('           PART 1 SCORES');
    console.log('═══════════════════════════════════════\n');
    
    const scores = {
      'Teaching Curriculum': doc.teaching_curriculum_score,
      'Teacher Qualification': doc.teacher_qualification_score,
      'Support from Org': doc.support_from_org_score,
      'Support from External': doc.support_from_external_score,
      'Awards': doc.award_score,
      'Activity (Internal)': doc.activity_within_province_internal_score,
      'Activity (External)': doc.activity_within_province_external_score,
      'Activity (Outside)': doc.activity_outside_province_score,
      'PR Activity': doc.pr_activity_score,
    };
    
    let part1Total = 0;
    
    Object.entries(scores).forEach(([label, value]) => {
      const displayValue = value ?? '❌ undefined';
      const scoreValue = value ?? 0;
      part1Total += scoreValue;
      
      if (value === undefined) {
        console.log(`⚠️  ${label.padEnd(25)}: ${displayValue}`);
      } else if (value === 0) {
        console.log(`   ${label.padEnd(25)}: ${displayValue}`);
      } else {
        console.log(`✅ ${label.padEnd(25)}: ${displayValue}`);
      }
    });
    
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('           PART 2 SCORES');
    console.log('═══════════════════════════════════════\n');
    
    const video1 = doc.video1_score ?? 0;
    const video2 = doc.video2_score ?? 0;
    
    console.log(`Video 1 Score: ${video1}`);
    console.log(`Video 2 Score: ${video2}`);
    
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('           TOTAL SCORES');
    console.log('═══════════════════════════════════════\n');
    
    console.log(`Part 1 Total:  ${part1Total}`);
    console.log(`Part 2 Total:  ${video1 + video2}`);
    console.log(`Grand Total:   ${part1Total + video1 + video2}`);
    console.log(`DB Total:      ${doc.total_score ?? 'N/A'} (stored in database)`);
    
    if (doc.total_score !== undefined && doc.total_score !== part1Total) {
      console.log('');
      console.log('⚠️  WARNING: DB total_score does not match calculated Part 1 total!');
      console.log(`   Expected: ${part1Total}`);
      console.log(`   Got: ${doc.total_score}`);
      console.log(`   Difference: ${doc.total_score - part1Total}`);
    }
    
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('           DATA DETAILS');
    console.log('═══════════════════════════════════════\n');
    
    // Check data that affects scores
    if (doc.regsup_thaiMusicTeachers || doc.thaiMusicTeachers) {
      const teachers = doc.regsup_thaiMusicTeachers || doc.thaiMusicTeachers || [];
      console.log(`👨‍🏫 Teachers: ${teachers.length}`);
      const qualifications = new Set(teachers.map((t) => t.teacherQualification).filter(Boolean));
      console.log(`   Unique Qualifications: ${qualifications.size}`);
      console.log(`   Expected Score: ${Math.min(qualifications.size * 5, 20)}`);
    }
    
    if (doc.supportFromExternal) {
      const external = doc.supportFromExternal || [];
      console.log(`🤝 External Support: ${external.length} person(s)`);
      const expectedScore = external.length >= 3 ? 15 : external.length === 2 ? 10 : external.length === 1 ? 5 : 0;
      console.log(`   Expected Score: ${expectedScore}`);
    }
    
    if (doc.awards) {
      const awards = doc.awards || [];
      console.log(`🏆 Awards: ${awards.length}`);
      let maxAwardScore = 0;
      awards.forEach((award) => {
        if (award.awardLevel === 'ประเทศ') maxAwardScore = Math.max(maxAwardScore, 20);
        else if (award.awardLevel === 'ภาค') maxAwardScore = Math.max(maxAwardScore, 15);
        else if (award.awardLevel === 'จังหวัด') maxAwardScore = Math.max(maxAwardScore, 10);
        else if (award.awardLevel === 'อำเภอ') maxAwardScore = Math.max(maxAwardScore, 5);
      });
      console.log(`   Expected Score: ${maxAwardScore}`);
    }
    
    const internalActivities = doc.activitiesWithinProvinceInternal || [];
    console.log(`🎭 Internal Activities: ${internalActivities.length}`);
    console.log(`   Expected Score: ${internalActivities.length >= 3 ? 5 : 0}`);
    
    const externalActivities = doc.activitiesWithinProvinceExternal || [];
    console.log(`🎪 External Activities: ${externalActivities.length}`);
    console.log(`   Expected Score: ${externalActivities.length >= 3 ? 5 : 0}`);
    
    const outsideActivities = doc.activitiesOutsideProvince || [];
    console.log(`🚌 Outside Activities: ${outsideActivities.length}`);
    console.log(`   Expected Score: ${outsideActivities.length >= 3 ? 5 : 0}`);
    
    const prActivities = doc.prActivities || [];
    console.log(`📢 PR Activities: ${prActivities.length}`);
    console.log(`   Expected Score: ${prActivities.length >= 3 ? 5 : 0}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Connection closed');
  }
}

main();
