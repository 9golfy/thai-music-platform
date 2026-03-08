const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

function calculateGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 65) return 'D+';
  if (score >= 60) return 'D';
  return 'F';
}

function processGradeData(submissions) {
  const gradeCounts = { A: 0, B: 0, C: 0, F: 0 };
  
  submissions.forEach(submission => {
    const score = submission.total_score || 0;
    const grade = calculateGrade(score);
    
    // Simplify grades to A, B, C, F for the chart
    if (grade === 'A') gradeCounts.A++;
    else if (grade.startsWith('B')) gradeCounts.B++;
    else if (grade.startsWith('C') || grade.startsWith('D')) gradeCounts.C++;
    else gradeCounts.F++;
  });

  return [
    { grade: 'A', count: gradeCounts.A, color: 'bg-green-500' },
    { grade: 'B', count: gradeCounts.B, color: 'bg-blue-500' },
    { grade: 'C', count: gradeCounts.C, color: 'bg-yellow-500' },
    { grade: 'F', count: gradeCounts.F, color: 'bg-red-500' },
  ];
}

async function testGradeDistribution() {
  console.log('=== Testing Grade Distribution Data ===\n');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    // Test register100 data
    console.log('1. Register100 Grade Distribution:');
    const register100Collection = database.collection('register100_submissions');
    const register100Data = await register100Collection.find({}).toArray();
    
    console.log(`   Total schools: ${register100Data.length}`);
    register100Data.forEach((school, index) => {
      const score = school.total_score || 0;
      const grade = calculateGrade(score);
      console.log(`   ${index + 1}. ${school.reg100_schoolName || school.schoolName}: ${score} points → Grade ${grade}`);
    });
    
    const register100Grades = processGradeData(register100Data);
    console.log('\n   Grade Distribution:');
    register100Grades.forEach(g => {
      console.log(`   Grade ${g.grade}: ${g.count} schools`);
    });
    
    // Test register-support data
    console.log('\n2. Register Support Grade Distribution:');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportData = await registerSupportCollection.find({}).toArray();
    
    console.log(`   Total schools: ${registerSupportData.length}`);
    registerSupportData.forEach((school, index) => {
      const score = school.total_score || 0;
      const grade = calculateGrade(score);
      console.log(`   ${index + 1}. ${school.regsup_schoolName || school.schoolName}: ${score} points → Grade ${grade}`);
    });
    
    const registerSupportGrades = processGradeData(registerSupportData);
    console.log('\n   Grade Distribution:');
    registerSupportGrades.forEach(g => {
      console.log(`   Grade ${g.grade}: ${g.count} schools`);
    });
    
    console.log('\n3. Chart Data Preview:');
    console.log('   Register100 Chart Data:', JSON.stringify(register100Grades, null, 2));
    console.log('   Register Support Chart Data:', JSON.stringify(registerSupportGrades, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testGradeDistribution().catch(console.error);