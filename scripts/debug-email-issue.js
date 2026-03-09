require('dotenv').config();
const { MongoClient } = require('mongodb');

  // Use localhost instead of docker container name for local scripts
  const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function debugEmailIssue() {
  console.log('🔍 Debugging email and popup issues...\n');

  // 1. Check environment variables
  console.log('📧 Email Configuration:');
  console.log('GMAIL_USER:', process.env.GMAIL_USER || 'NOT SET');
  console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'SET (hidden)' : 'NOT SET');
  console.log('');

  // 2. Check recent submissions
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbName);
    
    // Check recent register100 submissions
    const register100Collection = database.collection('register100_submissions');
    const recentSubmissions = await register100Collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    console.log('📋 Recent Register100 Submissions:');
    recentSubmissions.forEach((sub, index) => {
      console.log(`${index + 1}. ID: ${sub._id}`);
      console.log(`   School: ${sub.reg100_schoolName || sub.schoolName || 'N/A'}`);
      console.log(`   Created: ${sub.createdAt}`);
      console.log(`   Status: ${sub.status || 'N/A'}`);
      console.log(`   School ID: ${sub.schoolId || 'N/A'}`);
      console.log('');
    });

    // Check users created
    const usersCollection = database.collection('users');
    const recentUsers = await usersCollection
      .find({ role: 'teacher' })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    console.log('👨‍🏫 Recent Teacher Users:');
    recentUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   School ID: ${user.schoolId || 'N/A'}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   Active: ${user.isActive}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.close();
  }

  // 3. Test email configuration
  console.log('🧪 Testing Email Configuration...');
  
  if (!process.env.GMAIL_USER || process.env.GMAIL_USER === 'your-email@gmail.com') {
    console.log('❌ GMAIL_USER is not configured properly');
    console.log('   Please set GMAIL_USER in .env file to your actual Gmail address');
  }
  
  if (!process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD === 'your-gmail-app-password') {
    console.log('❌ GMAIL_APP_PASSWORD is not configured properly');
    console.log('   Please set GMAIL_APP_PASSWORD in .env file to your Gmail App Password');
    console.log('   Generate App Password at: https://myaccount.google.com/apppasswords');
  }

  // 4. Recommendations
  console.log('\n💡 Recommendations:');
  console.log('1. Configure proper Gmail credentials in .env file');
  console.log('2. Check browser console for JavaScript errors');
  console.log('3. Check network tab for failed API requests');
  console.log('4. Verify form validation is passing');
  console.log('5. Check if popup is being blocked by browser');
}

debugEmailIssue();