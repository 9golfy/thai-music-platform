const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

// Grade calculation function (should match gradeCalculator.ts)
function calculateGrade(score) {
  if (score >= 90) return 'A';      // 90-100 คะแนน
  if (score >= 70) return 'B';      // 70-89 คะแนน
  if (score >= 50) return 'C';      // 50-69 คะแนน
  return 'F';                       // 0-49 คะแนน
}

async function testGradeConsistency() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    console.log('🔍 Testing Grade Consistency Across Application');
    console.log('='.repeat(60));
    
    // Test grade ranges
    const testScores = [100, 95, 90, 89, 85, 70, 69, 60, 50, 49, 30, 0];
    
    console.log('\n📊 Grade Range Testing:');
    console.log('Score\tGrade\tRange');
    console.log('-'.repeat(30));
    
    testScores.forEach(score => {
      const grade = calculateGrade(score);
      let range = '';
      switch(grade) {
        case 'A': range = '90-100 คะแนน - สีเขียว'; break;
        case 'B': range = '70-89 คะแนน - สีน้ำเงิน'; break;
        case 'C': range = '50-69 คะแนน - สีส้ม'; break;
        case 'F': range = '0-49 คะแนน - สีแดง'; break;
      }
      console.log(`${score}\t${grade}\t${range}`);
    });
    
    // Test actual data from database
    console.log('\n📋 Database Data Testing:');
    console.log('-'.repeat(40));
    
    // Test register100 data
    const register100Collection = database.collection('register100_submissions');
    const register100Data = await register100Collection.find({}).limit(5).toArray();
    
    console.log('\n🎯 Register100 Schools:');
    register100Data.forEach((school, index) => {
      const score = school.total_score || 0;
      const grade = calculateGrade(score);
      const schoolName = school.reg100_schoolName || school.schoolName || 'Unknown';
      console.log(`${index + 1}. ${schoolName}: ${score} คะแนน = Grade ${grade}`);
    });
    
    // Test register-support data
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportData = await registerSupportCollection.find({}).limit(5).toArray();
    
    console.log('\n🎯 Register-Support Schools:');
    registerSupportData.forEach((school, index) => {
      const score = school.total_score || 0;
      const grade = calculateGrade(score);
      const schoolName = school.regsup_schoolName || school.schoolName || 'Unknown';
      console.log(`${index + 1}. ${schoolName}: ${score} คะแนน = Grade ${grade}`);
    });
    
    // Grade distribution summary
    console.log('\n📈 Grade Distribution Summary:');
    console.log('-'.repeat(40));
    
    const allScores = [
      ...register100Data.map(s => s.total_score || 0),
      ...registerSupportData.map(s => s.total_score || 0)
    ];
    
    const gradeCount = { A: 0, B: 0, C: 0, F: 0 };
    allScores.forEach(score => {
      const grade = calculateGrade(score);
      gradeCount[grade]++;
    });
    
    console.log(`🟢 A (90-100): ${gradeCount.A} schools`);
    console.log(`🔵 B (70-89): ${gradeCount.B} schools`);
    console.log(`🟠 C (50-69): ${gradeCount.C} schools`);
    console.log(`🔴 F (0-49): ${gradeCount.F} schools`);
    
    console.log('\n✅ Grade consistency test completed!');
    console.log('All components should now use the same grade ranges:');
    console.log('- A: 90-100 คะแนน (สีเขียว)');
    console.log('- B: 70-89 คะแนน (สีน้ำเงิน)');
    console.log('- C: 50-69 คะแนน (สีส้ม)');
    console.log('- F: 0-49 คะแนน (สีแดง)');
    
  } catch (error) {
    console.error('❌ Error testing grade consistency:', error);
  } finally {
    await client.close();
  }
}

testGradeConsistency();