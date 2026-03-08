// Script to check actual scores in database
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function checkScores() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    
    // Check register100
    console.log('\n=== Register100 Schools ===');
    const register100Collection = database.collection('register100_submissions');
    const register100Schools = await register100Collection.find({}).limit(5).toArray();
    
    register100Schools.forEach(school => {
      console.log(`School ID: ${school.schoolId}`);
      console.log(`School Name: ${school.schoolName}`);
      console.log(`Total Score: ${school.totalScore}`);
      console.log(`Grade: ${school.grade}`);
      console.log('---');
    });
    
    // Check register-support
    console.log('\n=== Register-Support Schools ===');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportSchools = await registerSupportCollection.find({}).limit(5).toArray();
    
    registerSupportSchools.forEach(school => {
      console.log(`School ID: ${school.schoolId}`);
      console.log(`School Name: ${school.schoolName}`);
      console.log(`Total Score: ${school.totalScore}`);
      console.log(`Grade: ${school.grade}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkScores();
