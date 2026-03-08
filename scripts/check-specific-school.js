// Script to check specific school
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function checkSpecificSchool() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    
    // Check in register100
    console.log('\n=== Checking SCH-20260301-0018 in Register100 ===');
    const register100Collection = database.collection('register100_submissions');
    const school100 = await register100Collection.findOne({ schoolId: 'SCH-20260301-0018' });
    
    if (school100) {
      console.log(`Found in Register100:`);
      console.log(`School ID: ${school100.schoolId}`);
      console.log(`School Name: ${school100.schoolName}`);
      console.log(`Total Score: ${school100.totalScore}`);
      console.log(`Grade: ${school100.grade}`);
    } else {
      console.log('Not found in Register100');
    }
    
    // Check in register-support
    console.log('\n=== Checking SCH-20260301-0018 in Register-Support ===');
    const registerSupportCollection = database.collection('register_support_submissions');
    const schoolSupport = await registerSupportCollection.findOne({ schoolId: 'SCH-20260301-0018' });
    
    if (schoolSupport) {
      console.log(`Found in Register-Support:`);
      console.log(`School ID: ${schoolSupport.schoolId}`);
      console.log(`School Name: ${schoolSupport.schoolName}`);
      console.log(`Total Score: ${schoolSupport.totalScore}`);
      console.log(`Grade: ${schoolSupport.grade}`);
    } else {
      console.log('Not found in Register-Support');
    }
    
    // List all schools to find the one with 25 points
    console.log('\n=== Schools with score around 25 ===');
    const allRegister100 = await register100Collection.find({
      totalScore: { $gte: 20, $lte: 30 }
    }).toArray();
    
    const allRegisterSupport = await registerSupportCollection.find({
      totalScore: { $gte: 20, $lte: 30 }
    }).toArray();
    
    console.log('Register100:');
    allRegister100.forEach(s => {
      console.log(`  ${s.schoolId} - ${s.schoolName}: ${s.totalScore} (${s.grade})`);
    });
    
    console.log('Register-Support:');
    allRegisterSupport.forEach(s => {
      console.log(`  ${s.schoolId} - ${s.schoolName}: ${s.totalScore} (${s.grade})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkSpecificSchool();
