// Script to check schoolName fields in submissions
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function checkSchoolNameFields() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const database = client.db(dbName);

    // Check register100_submissions
    console.log('📋 Checking register100_submissions:');
    const register100 = database.collection('register100_submissions');
    const sample100 = await register100.findOne({});
    
    if (sample100) {
      console.log('  Sample document fields related to school name:');
      Object.keys(sample100).forEach(key => {
        if (key.toLowerCase().includes('school')) {
          console.log(`    - ${key}: ${sample100[key]}`);
        }
      });
    } else {
      console.log('  No documents found');
    }

    // Check register_support_submissions
    console.log('\n📋 Checking register_support_submissions:');
    const registerSupport = database.collection('register_support_submissions');
    const sampleSupport = await registerSupport.findOne({});
    
    if (sampleSupport) {
      console.log('  Sample document fields related to school name:');
      Object.keys(sampleSupport).forEach(key => {
        if (key.toLowerCase().includes('school')) {
          console.log(`    - ${key}: ${sampleSupport[key]}`);
        }
      });
    } else {
      console.log('  No documents found');
    }

    // Check activity logs with missing schoolName
    console.log('\n📋 Checking activity_logs with missing schoolName:');
    const activityLogs = database.collection('activity_logs');
    
    const logsWithSchoolId = await activityLogs.countDocuments({ 
      schoolId: { $exists: true, $ne: null },
      schoolName: { $in: [null, undefined, ''] }
    });
    
    const logsWithoutSchoolId = await activityLogs.countDocuments({ 
      schoolId: { $in: [null, undefined, ''] }
    });

    console.log(`  - Logs with schoolId but no schoolName: ${logsWithSchoolId}`);
    console.log(`  - Logs without schoolId (Admin): ${logsWithoutSchoolId}`);

    // Get some examples
    const examples = await activityLogs.find({ 
      schoolId: { $exists: true, $ne: null },
      schoolName: { $in: [null, undefined, ''] }
    }).limit(3).toArray();

    if (examples.length > 0) {
      console.log('\n  Examples:');
      examples.forEach((ex, i) => {
        console.log(`    ${i + 1}. User: ${ex.userName}, SchoolId: ${ex.schoolId}, SchoolName: ${ex.schoolName}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

checkSchoolNameFields();
