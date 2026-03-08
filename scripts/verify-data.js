// Verify seeded data
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI?.replace('mongo:', 'localhost:') || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function verifyData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);

    // Check Register100
    const register100 = database.collection('register100_submissions');
    const count100 = await register100.countDocuments();
    const schools100 = await register100.find({}).toArray();

    console.log('\n📊 Register100 Data:');
    console.log(`   Total: ${count100} schools`);
    schools100.forEach(school => {
      console.log(`   - ${school.schoolName} (${school.province}) - Score: ${school.totalScore}, Teachers: ${school.teachers.length}`);
    });

    // Check Register Support
    const registerSupport = database.collection('register_support_submissions');
    const countSupport = await registerSupport.countDocuments();
    const schoolsSupport = await registerSupport.find({}).toArray();

    console.log('\n📊 Register Support Data:');
    console.log(`   Total: ${countSupport} schools`);
    schoolsSupport.forEach(school => {
      console.log(`   - ${school.schoolName} (${school.province}) - Score: ${school.totalScore}, Teachers: ${school.teachers.length}`);
    });

    console.log('\n✅ Data verification complete!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

verifyData();
