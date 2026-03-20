const { MongoClient } = require('mongodb');

const uri = 'mongodb://thai-music-mongo:27017/thai_music_school';
const dbName = 'thai_music_school';

async function debugApiSubmission() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔍 Debugging API submission...\n');
    
    const database = client.db(dbName);
    
    // Check register100_submissions with timestamps
    const reg100Collection = database.collection('register100_submissions');
    
    console.log('📊 Register100 submissions:');
    const submissions = await reg100Collection.find({}).sort({ createdAt: -1 }).toArray();
    
    submissions.forEach((sub, index) => {
      console.log(`${index + 1}. ID: ${sub._id}`);
      console.log(`   School: ${sub.reg100_schoolName || sub.schoolName || 'N/A'}`);
      console.log(`   Email: ${sub.teacherEmail || 'N/A'}`);
      console.log(`   Created: ${sub.createdAt || sub.submittedAt || 'N/A'}`);
      console.log(`   Status: ${sub.status || 'N/A'}`);
      console.log(`   School ID: ${sub.schoolId || 'N/A'}`);
      console.log('');
    });
    
    // Check users collection
    const usersCollection = database.collection('users');
    const users = await usersCollection.find({}).toArray();
    
    console.log('👥 Users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   School ID: ${user.schoolId || 'N/A'}`);
      console.log(`   Created: ${user.createdAt || 'N/A'}`);
      console.log('');
    });
    
    // Check for recent activity (last hour)
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const recentSubmissions = await reg100Collection.find({
      $or: [
        { createdAt: { $gte: oneHourAgo.toISOString() } },
        { submittedAt: { $gte: oneHourAgo.toISOString() } }
      ]
    }).toArray();
    
    console.log(`🕐 Recent submissions (last hour): ${recentSubmissions.length}`);
    recentSubmissions.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.reg100_schoolName || sub.schoolName} - ${sub.createdAt || sub.submittedAt}`);
    });
    
    console.log('\n✅ Debug completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

debugApiSubmission();