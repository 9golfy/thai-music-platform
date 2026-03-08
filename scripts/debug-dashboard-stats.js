const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function debugDashboardStats() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('=== Dashboard Statistics Debug ===\n');
    
    const database = client.db(dbName);
    
    // Check Register100 submissions
    console.log('1. Register100 Submissions:');
    const register100Collection = database.collection('register100_submissions');
    const register100Submissions = await register100Collection.find({}).toArray();
    
    console.log(`   Total count: ${register100Submissions.length}`);
    
    if (register100Submissions.length > 0) {
      console.log('   Sample data:');
      register100Submissions.forEach((sub, index) => {
        console.log(`   ${index + 1}. ID: ${sub._id}`);
        console.log(`      School: ${sub.reg100_schoolName || sub.schoolName || 'N/A'}`);
        console.log(`      Total Score: ${sub.total_score || 'N/A'}`);
        console.log(`      Created: ${sub.createdAt || 'N/A'}`);
        console.log('');
      });
      
      // Calculate total score
      const totalScore = register100Submissions.reduce((sum, s) => sum + (s.total_score || 0), 0);
      console.log(`   Total Score Sum: ${totalScore}`);
    }
    
    console.log('\n2. Register Support Submissions:');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportSubmissions = await registerSupportCollection.find({}).toArray();
    
    console.log(`   Total count: ${registerSupportSubmissions.length}`);
    
    if (registerSupportSubmissions.length > 0) {
      console.log('   Sample data:');
      registerSupportSubmissions.forEach((sub, index) => {
        console.log(`   ${index + 1}. ID: ${sub._id}`);
        console.log(`      School: ${sub.regsup_schoolName || sub.schoolName || 'N/A'}`);
        console.log(`      Total Score: ${sub.total_score || 'N/A'}`);
        console.log(`      Created: ${sub.createdAt || 'N/A'}`);
        console.log('');
      });
    }
    
    console.log('\n3. Certificates:');
    const certificatesCollection = database.collection('certificates');
    const certificates = await certificatesCollection.find({}).toArray();
    
    console.log(`   Total count: ${certificates.length}`);
    
    if (certificates.length > 0) {
      console.log('   Sample data:');
      certificates.slice(0, 3).forEach((cert, index) => {
        console.log(`   ${index + 1}. ID: ${cert._id}`);
        console.log(`      Name: ${cert.name || 'N/A'}`);
        console.log(`      Created: ${cert.createdAt || 'N/A'}`);
        console.log('');
      });
    }
    
    console.log('\n=== Dashboard Expected Stats ===');
    console.log(`Register100 Schools: ${register100Submissions.length}`);
    console.log(`Register Support Schools: ${registerSupportSubmissions.length}`);
    console.log(`Total Score: ${register100Submissions.reduce((sum, s) => sum + (s.total_score || 0), 0)}`);
    console.log(`Certificates: ${certificates.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugDashboardStats();