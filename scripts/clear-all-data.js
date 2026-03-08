// Script to clear all data from database for testing
const { MongoClient } = require('mongodb');
const readline = require('readline');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function clearAllData() {
  const client = new MongoClient(uri);

  try {
    console.log('\n⚠️  WARNING: This will DELETE ALL DATA from the database!');
    console.log('Collections to be cleared:');
    console.log('  - register100_submissions');
    console.log('  - register_support_submissions');
    console.log('  - certificates');
    console.log('  - certificate_templates');
    console.log('  - users (except root admin)');
    console.log('  - All uploaded files will remain\n');

    const answer = await askQuestion('Are you sure you want to continue? (yes/no): ');
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled');
      rl.close();
      return;
    }

    await client.connect();
    console.log('\n✅ Connected to MongoDB');
    
    const database = client.db(dbName);
    
    // Clear register100 submissions
    console.log('\n🗑️  Clearing register100_submissions...');
    const register100Result = await database.collection('register100_submissions').deleteMany({});
    console.log(`   Deleted ${register100Result.deletedCount} documents`);
    
    // Clear register-support submissions
    console.log('🗑️  Clearing register_support_submissions...');
    const registerSupportResult = await database.collection('register_support_submissions').deleteMany({});
    console.log(`   Deleted ${registerSupportResult.deletedCount} documents`);
    
    // Clear certificates
    console.log('🗑️  Clearing certificates...');
    const certificatesResult = await database.collection('certificates').deleteMany({});
    console.log(`   Deleted ${certificatesResult.deletedCount} documents`);
    
    // Clear certificate templates
    console.log('🗑️  Clearing certificate_templates...');
    const templatesResult = await database.collection('certificate_templates').deleteMany({});
    console.log(`   Deleted ${templatesResult.deletedCount} documents`);
    
    // Clear users (except root admin)
    console.log('🗑️  Clearing users (keeping root admin)...');
    const usersResult = await database.collection('users').deleteMany({ 
      role: { $ne: 'root' } 
    });
    console.log(`   Deleted ${usersResult.deletedCount} documents`);
    
    console.log('\n✅ All data cleared successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Register100: ${register100Result.deletedCount} deleted`);
    console.log(`   Register-Support: ${registerSupportResult.deletedCount} deleted`);
    console.log(`   Certificates: ${certificatesResult.deletedCount} deleted`);
    console.log(`   Certificate Templates: ${templatesResult.deletedCount} deleted`);
    console.log(`   Users: ${usersResult.deletedCount} deleted`);
    console.log('\n✨ Database is ready for testing!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    rl.close();
  }
}

clearAllData();
