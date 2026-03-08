const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

// Grade calculation function (should match gradeCalculator.ts)
function calculateGrade(score) {
  if (score >= 90) return 'A';      // 90-100 คะแนน
  if (score >= 70) return 'B';      // 70-89 คะแนน
  if (score >= 50) return 'C';      // 50-69 คะแนน
  return 'F';                       // 0-49 คะแนน
}

function getGradeDescription(grade) {
  switch(grade) {
    case 'A': return '90-100 คะแนน - สีเขียว';
    case 'B': return '70-89 คะแนน - สีน้ำเงิน';
    case 'C': return '50-69 คะแนน - สีส้ม';
    case 'F': return '0-49 คะแนน - สีแดง';
    default: return 'Unknown';
  }
}

async function testDataTableGrades() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    console.log('🔍 Testing Data Table Grade Display');
    console.log('='.repeat(50));
    
    // Test specific IDs mentioned in user query
    const testIds = [
      '69ad330b9e6cdf08af345750', // register100
      '69ad330b9e6cdf08af345754'  // register-support
    ];
    
    console.log('\n📋 Testing Specific Records:');
    console.log('-'.repeat(40));
    
    // Test register100 record
    const register100Collection = database.collection('register100_submissions');
    try {
      const register100Record = await register100Collection.findOne({ 
        _id: new ObjectId(testIds[0])
      });
      
      if (register100Record) {
        const score = register100Record.total_score || 0;
        const grade = calculateGrade(score);
        const schoolName = register100Record.reg100_schoolName || register100Record.schoolName || 'Unknown';
        console.log(`🎯 Register100 (${testIds[0]}):`);
        console.log(`   School: ${schoolName}`);
        console.log(`   Score: ${score} คะแนน`);
        console.log(`   Grade: ${grade} (${getGradeDescription(grade)})`);
      } else {
        console.log(`❌ Register100 record ${testIds[0]} not found`);
      }
    } catch (err) {
      console.log(`❌ Error finding Register100 record: ${err.message}`);
    }
    
    // Test register-support record
    const registerSupportCollection = database.collection('register_support_submissions');
    try {
      const registerSupportRecord = await registerSupportCollection.findOne({ 
        _id: new ObjectId(testIds[1])
      });
      
      if (registerSupportRecord) {
        const score = registerSupportRecord.total_score || 0;
        const grade = calculateGrade(score);
        const schoolName = registerSupportRecord.regsup_schoolName || registerSupportRecord.schoolName || 'Unknown';
        console.log(`\n🎯 Register-Support (${testIds[1]}):`);
        console.log(`   School: ${schoolName}`);
        console.log(`   Score: ${score} คะแนน`);
        console.log(`   Grade: ${grade} (${getGradeDescription(grade)})`);
      } else {
        console.log(`❌ Register-Support record ${testIds[1]} not found`);
      }
    } catch (err) {
      console.log(`❌ Error finding Register-Support record: ${err.message}`);
    }
    
    // Test all records for grade consistency
    console.log('\n📊 All Records Grade Check:');
    console.log('-'.repeat(40));
    
    const allRegister100 = await register100Collection.find({}).toArray();
    const allRegisterSupport = await registerSupportCollection.find({}).toArray();
    
    console.log('\n🎯 Register100 Schools:');
    allRegister100.forEach((school, index) => {
      const score = school.total_score || 0;
      const grade = calculateGrade(score);
      const schoolName = school.reg100_schoolName || school.schoolName || 'Unknown';
      console.log(`${index + 1}. ${schoolName}: ${score} คะแนน = Grade ${grade}`);
    });
    
    console.log('\n🎯 Register-Support Schools:');
    allRegisterSupport.forEach((school, index) => {
      const score = school.total_score || 0;
      const grade = calculateGrade(score);
      const schoolName = school.regsup_schoolName || school.schoolName || 'Unknown';
      console.log(`${index + 1}. ${schoolName}: ${score} คะแนน = Grade ${grade}`);
    });
    
    console.log('\n✅ Data table grade testing completed!');
    console.log('All records should display consistent grades in the UI.');
    
  } catch (error) {
    console.error('❌ Error testing data table grades:', error);
  } finally {
    await client.close();
  }
}

testDataTableGrades();