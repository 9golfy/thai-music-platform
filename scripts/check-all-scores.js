const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function checkAllScores() {
  console.log('=== Checking All School Scores ===\n');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    // Check register100 scores
    console.log('1. Register100 Schools:');
    const register100Collection = database.collection('register100_submissions');
    const register100Data = await register100Collection.find({}).toArray();
    
    register100Data.forEach((school, index) => {
      console.log(`   ${index + 1}. ${school.reg100_schoolName || school.schoolName}`);
      console.log(`      School ID: ${school.schoolId}`);
      console.log(`      Total Score: ${school.total_score}`);
      console.log(`      Created: ${school.createdAt}`);
      console.log('');
    });
    
    // Check register-support scores
    console.log('2. Register Support Schools:');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportData = await registerSupportCollection.find({}).toArray();
    
    registerSupportData.forEach((school, index) => {
      console.log(`   ${index + 1}. ${school.regsup_schoolName || school.schoolName}`);
      console.log(`      School ID: ${school.schoolId}`);
      console.log(`      Total Score: ${school.total_score}`);
      console.log(`      Created: ${school.createdAt}`);
      console.log('');
    });
    
    // Summary
    const register100WithScores = register100Data.filter(s => s.total_score !== undefined).length;
    const registerSupportWithScores = registerSupportData.filter(s => s.total_score !== undefined).length;
    
    console.log('3. Summary:');
    console.log(`   Register100: ${register100WithScores}/${register100Data.length} have scores`);
    console.log(`   Register Support: ${registerSupportWithScores}/${registerSupportData.length} have scores`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkAllScores().catch(console.error);