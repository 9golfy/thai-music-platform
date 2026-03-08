// Check specific record details
// Run: node scripts/check-specific-record.js <record_id>

require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI?.replace('mongo:', 'localhost:') || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

const recordId = process.argv[2] || '69a27901a29d6ad3828c66a3';

async function checkRecord() {
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const database = client.db(dbName);
    const collection = database.collection('register100_submissions');
    
    const record = await collection.findOne({ _id: new ObjectId(recordId) });
    
    if (!record) {
      console.log('❌ Record not found!');
      return;
    }

    console.log('📋 Record Details:');
    console.log('==================');
    console.log(`School: ${record.schoolName}`);
    console.log(`School ID: ${record.schoolId || 'N/A'}`);
    console.log(`\n📊 Score Fields:`);
    console.log(`  total_score: ${record.total_score}`);
    console.log(`  teacher_training_score: ${record.teacher_training_score}`);
    console.log(`  teacher_qualification_score: ${record.teacher_qualification_score}`);
    console.log(`  support_from_org_score: ${record.support_from_org_score}`);
    console.log(`  support_from_external_score: ${record.support_from_external_score}`);
    console.log(`  award_score: ${record.award_score}`);
    console.log(`  activity_within_province_internal_score: ${record.activity_within_province_internal_score}`);
    console.log(`  activity_within_province_external_score: ${record.activity_within_province_external_score}`);
    console.log(`  activity_outside_province_score: ${record.activity_outside_province_score}`);
    console.log(`  pr_activity_score: ${record.pr_activity_score}`);
    
    console.log(`\n📸 Images:`);
    console.log(`  mgtImage: ${record.mgtImage || 'N/A'}`);
    if (record.thaiMusicTeachers) {
      console.log(`  Teachers (${record.thaiMusicTeachers.length}):`);
      record.thaiMusicTeachers.forEach((t, i) => {
        console.log(`    ${i + 1}. ${t.teacherFullName}: ${t.teacherImage || 'N/A'}`);
      });
    }

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkRecord();
