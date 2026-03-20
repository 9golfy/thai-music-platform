require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thai_music_school';

async function checkUsers() {
  console.log('🔍 Checking Users Data...\n');
  
  console.log('📋 Configuration:');
  console.log(`  URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@')}`);
  console.log(`  Database: thai_music_school\n`);

  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected successfully!\n');
    
    const db = client.db('thai_music_school');
    const usersCollection = db.collection('users');
    
    console.log('📋 Checking users collection...');
    const users = await usersCollection.find({}).toArray();
    console.log(`  Total users: ${users.length}\n`);
    
    if (users.length > 0) {
      console.log('👥 Users in database:');
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. Email: ${user.email}, Role: ${user.role}, Created: ${user.createdAt}`);
      });
    }
    
    console.log('\n✅ Check completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

checkUsers();