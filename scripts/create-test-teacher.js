// Create Test Teacher User
// Run: node scripts/create-test-teacher.js

require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Use localhost for running from host machine
const uri = process.env.MONGODB_URI?.replace('mongo:', 'localhost:') || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function createTestTeacher() {
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db(dbName);
    const usersCollection = database.collection('users');

    // Check if test teacher already exists
    const existingTeacher = await usersCollection.findOne({ email: 'teacher@test.com' });

    if (existingTeacher) {
      console.log('ℹ️  Test teacher already exists');
      console.log(`   Email: ${existingTeacher.email}`);
      console.log(`   School ID: ${existingTeacher.schoolId}`);
      return;
    }

    // Create test teacher
    console.log('👨‍🏫 Creating test teacher...');
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10);

    const testTeacher = {
      email: 'teacher@test.com',
      password: hashedPassword,
      role: 'teacher',
      firstName: 'ครู',
      lastName: 'ทดสอบ',
      phone: '0812345678',
      schoolId: 'SCH-20260228-0001',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(testTeacher);
    console.log('✅ Test teacher created successfully!');
    console.log('\n📧 Test Teacher Credentials:');
    console.log(`   Email: teacher@test.com`);
    console.log(`   Password: 123456`);
    console.log(`   School ID: SCH-20260228-0001`);
    console.log('\n🎯 You can now login at: /teacher-login');

  } catch (error) {
    console.error('\n❌ Error creating test teacher:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run
createTestTeacher();
