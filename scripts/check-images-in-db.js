// Check images in database
// Run: node scripts/check-images-in-db.js

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI?.replace('mongo:', 'localhost:') || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function checkImages() {
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const database = client.db(dbName);

    // Check Register100
    console.log('📋 Register100 Submissions:');
    const register100Collection = database.collection('register100_submissions');
    const register100Records = await register100Collection.find({}).toArray();
    
    console.log(`Found ${register100Records.length} records\n`);
    
    register100Records.forEach((record, index) => {
      console.log(`Record ${index + 1}:`);
      console.log(`  School: ${record.schoolName}`);
      console.log(`  School ID: ${record.schoolId || 'N/A'}`);
      console.log(`  mgtImage: ${record.mgtImage || 'N/A'}`);
      
      if (record.thaiMusicTeachers && record.thaiMusicTeachers.length > 0) {
        console.log(`  Teachers (${record.thaiMusicTeachers.length}):`);
        record.thaiMusicTeachers.forEach((teacher, i) => {
          console.log(`    ${i + 1}. ${teacher.teacherFullName}: ${teacher.teacherImage || 'N/A'}`);
        });
      }
      console.log('');
    });

    // Check Register Support
    console.log('\n📋 Register Support Submissions:');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportRecords = await registerSupportCollection.find({}).toArray();
    
    console.log(`Found ${registerSupportRecords.length} records\n`);
    
    registerSupportRecords.forEach((record, index) => {
      console.log(`Record ${index + 1}:`);
      console.log(`  School: ${record.schoolName}`);
      console.log(`  School ID: ${record.schoolId || 'N/A'}`);
      console.log(`  mgtImage: ${record.mgtImage || 'N/A'}`);
      
      if (record.thaiMusicTeachers && record.thaiMusicTeachers.length > 0) {
        console.log(`  Teachers (${record.thaiMusicTeachers.length}):`);
        record.thaiMusicTeachers.forEach((teacher, i) => {
          console.log(`    ${i + 1}. ${teacher.teacherFullName}: ${teacher.teacherImage || 'N/A'}`);
        });
      }
      console.log('');
    });

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkImages();
