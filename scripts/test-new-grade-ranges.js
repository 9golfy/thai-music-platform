const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

function processGradeData(submissions) {
  const gradeCounts = { A: 0, B: 0, C: 0, F: 0 };
  
  submissions.forEach(submission => {
    const score = submission.total_score || 0;
    
    // New grade ranges based on score ranges
    if (score >= 90) gradeCounts.A++;        // 90-100 คะแนน
    else if (score >= 70) gradeCounts.B++;   // 70-89 คะแนน  
    else if (score >= 50) gradeCounts.C++;   // 50-69 คะแนน
    else gradeCounts.F++;                    // 0-49 คะแนน
  });

  return [
    { grade: 'A', count: gradeCounts.A, color: 'bg-green-500', range: '90-100 คะแนน' },
    { grade: 'B', count: gradeCounts.B, color: 'bg-blue-500', range: '70-89 คะแนน' },
    { grade: 'C', count: gradeCounts.C, color: 'bg-orange-500', range: '50-69 คะแนน' },
    { grade: 'F', count: gradeCounts.F, color: 'bg-red-500', range: '0-49 คะแนน' },
  ];
}

async function testNewGradeRanges() {
  console.log('=== Testing New Grade Ranges ===\n');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    // Test register100 data
    console.log('1. โรงเรียนดนตรีไทย 100%:');
    const register100Collection = database.collection('register100_submissions');
    const register100Data = await register100Collection.find({}).toArray();
    
    console.log(`   Total schools: ${register100Data.length}`);
    register100Data.forEach((school, index) => {
      const score = school.total_score || 0;
      let gradeRange = '';
      if (score >= 90) gradeRange = 'A (90-100)';
      else if (score >= 70) gradeRange = 'B (70-89)';
      else if (score >= 50) gradeRange = 'C (50-69)';
      else gradeRange = 'F (0-49)';
      
      console.log(`   ${index + 1}. ${school.reg100_schoolName || school.schoolName}: ${score} points → ${gradeRange}`);
    });
    
    const register100Grades = processGradeData(register100Data);
    console.log('\n   Grade Distribution:');
    register100Grades.forEach(g => {
      console.log(`   ${g.range}: ${g.count} schools`);
    });
    
    // Test register-support data
    console.log('\n2. โรงเรียนสนับสนุนและส่งเสริม:');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportData = await registerSupportCollection.find({}).toArray();
    
    console.log(`   Total schools: ${registerSupportData.length}`);
    registerSupportData.forEach((school, index) => {
      const score = school.total_score || 0;
      let gradeRange = '';
      if (score >= 90) gradeRange = 'A (90-100)';
      else if (score >= 70) gradeRange = 'B (70-89)';
      else if (score >= 50) gradeRange = 'C (50-69)';
      else gradeRange = 'F (0-49)';
      
      console.log(`   ${index + 1}. ${school.regsup_schoolName || school.schoolName}: ${score} points → ${gradeRange}`);
    });
    
    const registerSupportGrades = processGradeData(registerSupportData);
    console.log('\n   Grade Distribution:');
    registerSupportGrades.forEach(g => {
      console.log(`   ${g.range}: ${g.count} schools`);
    });
    
    console.log('\n3. Chart Preview:');
    console.log('   โรงเรียนดนตรีไทย 100%:', register100Grades.map(g => `${g.grade}=${g.count}`).join(', '));
    console.log('   โรงเรียนสนับสนุนและส่งเสริม:', registerSupportGrades.map(g => `${g.grade}=${g.count}`).join(', '));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testNewGradeRanges().catch(console.error);