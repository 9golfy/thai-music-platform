const { MongoClient } = require('mongodb');

// Expected scores for each scenario
const EXPECTED_SCORES = {
  'โรงเรียนทดสอบ คะแนนเต็ม 100': {
    teacher_training_score: 20,
    teacher_qualification_score: 20,
    support_from_org_score: 5,
    support_from_external_score: 15,
    award_score: 20,
    activity_within_province_internal_score: 5,
    activity_within_province_external_score: 5,
    activity_outside_province_score: 5,
    pr_activity_score: 5,
    total_score: 100
  },
  'โรงเรียนทดสอบ คะแนนปานกลาง 50': {
    teacher_training_score: 10,
    teacher_qualification_score: 10,
    support_from_org_score: 5,
    support_from_external_score: 10,
    award_score: 10,
    activity_within_province_internal_score: 5,
    activity_within_province_external_score: 0,
    activity_outside_province_score: 0,
    pr_activity_score: 0,
    total_score: 50
  },
  'โรงเรียนทดสอบ คะแนนต่ำสุด 0': {
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
  }
};

async function verifyScores() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const database = client.db('thai_music_school');
    const collection = database.collection('register100_submissions');

    let allPassed = true;

    for (const [schoolName, expectedScores] of Object.entries(EXPECTED_SCORES)) {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`🏫 Verifying: ${schoolName}`);
      console.log('='.repeat(80));

      const submission = await collection.findOne(
        { schoolName },
        { sort: { _id: -1 } }
      );

      if (!submission) {
        console.log(`❌ No submission found for: ${schoolName}\n`);
        allPassed = false;
        continue;
      }

      console.log(`\n📊 Score Comparison:`);
      console.log('-'.repeat(80));
      console.log(`${'Score Type'.padEnd(40)} | ${'Expected'.padEnd(10)} | ${'Actual'.padEnd(10)} | Status`);
      console.log('-'.repeat(80));

      let scenarioPassed = true;

      for (const [scoreType, expectedValue] of Object.entries(expectedScores)) {
        const actualValue = submission[scoreType] || 0;
        const passed = actualValue === expectedValue;
        const status = passed ? '✅ PASS' : '❌ FAIL';

        if (!passed) {
          scenarioPassed = false;
          allPassed = false;
        }

        console.log(
          `${scoreType.padEnd(40)} | ${String(expectedValue).padEnd(10)} | ${String(actualValue).padEnd(10)} | ${status}`
        );
      }

      console.log('-'.repeat(80));
      
      if (scenarioPassed) {
        console.log(`\n✅ ${schoolName}: ALL SCORES MATCH!`);
      } else {
        console.log(`\n❌ ${schoolName}: SOME SCORES DON'T MATCH!`);
      }

      // Show additional info
      console.log(`\n📝 Additional Info:`);
      console.log(`   - Submission ID: ${submission._id}`);
      console.log(`   - Province: ${submission.schoolProvince}`);
      console.log(`   - Level: ${submission.schoolLevel}`);
      console.log(`   - Teachers: ${submission.thaiMusicTeachers?.length || 0}`);
      console.log(`   - Created: ${submission.createdAt || 'N/A'}`);
    }

    console.log(`\n\n${'='.repeat(80)}`);
    console.log('📊 FINAL RESULT');
    console.log('='.repeat(80));
    
    if (allPassed) {
      console.log('✅✅✅ ALL SCENARIOS PASSED! All scores match expected values.');
    } else {
      console.log('❌❌❌ SOME SCENARIOS FAILED! Check the details above.');
    }
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

verifyScores();
