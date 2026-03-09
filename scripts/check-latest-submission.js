require('dotenv').config();
const { MongoClient } = require('mongodb');

// Use localhost instead of docker container name for local scripts
const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function checkLatestSubmission() {
  console.log('🔍 Checking latest submission and email status...\n');

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbName);
    
    // Check latest register100 submission
    const register100Collection = database.collection('register100_submissions');
    const latestSubmission = await register100Collection
      .findOne({}, { sort: { createdAt: -1 } });
    
    if (latestSubmission) {
      console.log('📋 Latest Register100 Submission:');
      console.log('ID:', latestSubmission._id);
      console.log('School:', latestSubmission.reg100_schoolName || latestSubmission.schoolName || 'N/A');
      console.log('School ID:', latestSubmission.schoolId || 'N/A');
      console.log('Created:', latestSubmission.createdAt);
      console.log('Status:', latestSubmission.status || 'N/A');
      console.log('Total Score:', latestSubmission.total_score || 'N/A');
      console.log('');
    } else {
      console.log('❌ No register100 submissions found');
    }

    // Check latest user
    const usersCollection = database.collection('users');
    const latestUser = await usersCollection
      .findOne({ role: 'teacher' }, { sort: { createdAt: -1 } });
    
    if (latestUser) {
      console.log('👨‍🏫 Latest Teacher User:');
      console.log('Email:', latestUser.email);
      console.log('School ID:', latestUser.schoolId || 'N/A');
      console.log('Created:', latestUser.createdAt);
      console.log('Active:', latestUser.isActive);
      console.log('');
    } else {
      console.log('❌ No teacher users found');
    }

    // Check if latest submission and user match
    if (latestSubmission && latestUser) {
      const submissionTime = new Date(latestSubmission.createdAt);
      const userTime = new Date(latestUser.createdAt);
      const timeDiff = Math.abs(submissionTime - userTime);
      
      console.log('🔗 Submission and User Correlation:');
      console.log('Time difference:', timeDiff, 'ms');
      console.log('School ID match:', latestSubmission.schoolId === latestUser.schoolId);
      console.log('');
      
      if (timeDiff < 10000 && latestSubmission.schoolId === latestUser.schoolId) {
        console.log('✅ Latest submission and user appear to be related');
        console.log('📧 Email should have been sent to:', latestUser.email);
        console.log('🔑 Password should have been generated for login');
      } else {
        console.log('⚠️ Latest submission and user do not appear to be related');
      }
    }

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.close();
  }
}

checkLatestSubmission();