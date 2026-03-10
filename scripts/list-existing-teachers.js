#!/usr/bin/env node

/**
 * List Existing Teachers and School IDs
 * Shows what teacher accounts and submissions actually exist
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function listExistingTeachers() {
  const client = new MongoClient(uri);
  
  try {
    console.log('📋 Listing Existing Teachers and School IDs...');
    console.log('=' .repeat(60));
    
    await client.connect();
    const database = client.db(dbName);
    
    // 1. List all users
    console.log('\n1️⃣ All Users in Database:');
    const usersCollection = database.collection('users');
    const allUsers = await usersCollection.find({}).toArray();
    
    if (allUsers.length > 0) {
      console.log(`Found ${allUsers.length} user(s):`);
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. Email: ${user.email}`);
        console.log(`      Role: ${user.role}`);
        console.log(`      School ID: ${user.schoolId || 'N/A'}`);
        console.log(`      Active: ${user.isActive}`);
        console.log(`      Has Password: ${!!user.password}`);
        console.log('');
      });
    } else {
      console.log('❌ No users found in database');
    }
    
    // 2. List all register100 submissions
    console.log('\n2️⃣ Register100 Submissions:');
    const register100Collection = database.collection('register100_submissions');
    const register100Submissions = await register100Collection.find({}).toArray();
    
    if (register100Submissions.length > 0) {
      console.log(`Found ${register100Submissions.length} register100 submission(s):`);
      register100Submissions.forEach((submission, index) => {
        console.log(`   ${index + 1}. School ID: ${submission.schoolId}`);
        console.log(`      School Name: ${submission.reg100_schoolName}`);
        console.log(`      Teacher Email: ${submission.teacherEmail}`);
        console.log(`      Teacher Phone: ${submission.teacherPhone}`);
        console.log(`      Submitted: ${submission.submittedAt}`);
        console.log('');
      });
    } else {
      console.log('❌ No register100 submissions found');
    }
    
    // 3. List all register-support submissions
    console.log('\n3️⃣ Register Support Submissions:');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportSubmissions = await registerSupportCollection.find({}).toArray();
    
    if (registerSupportSubmissions.length > 0) {
      console.log(`Found ${registerSupportSubmissions.length} register-support submission(s):`);
      registerSupportSubmissions.forEach((submission, index) => {
        console.log(`   ${index + 1}. School ID: ${submission.schoolId}`);
        console.log(`      School Name: ${submission.schoolName}`);
        console.log(`      Teacher Email: ${submission.teacherEmail}`);
        console.log(`      Teacher Phone: ${submission.teacherPhone}`);
        console.log(`      Submitted: ${submission.submittedAt}`);
        console.log('');
      });
    } else {
      console.log('❌ No register-support submissions found');
    }
    
    // 4. Show valid login credentials
    console.log('\n4️⃣ Valid Login Credentials:');
    const teacherUsers = allUsers.filter(user => user.role === 'teacher' && user.isActive);
    
    if (teacherUsers.length > 0) {
      console.log('✅ These teacher accounts can login:');
      teacherUsers.forEach((teacher, index) => {
        console.log(`   ${index + 1}. Email: ${teacher.email}`);
        console.log(`      School ID: ${teacher.schoolId}`);
        console.log(`      Password: ${teacher.password ? 'Set' : 'NOT SET'}`);
        console.log('');
      });
    } else {
      console.log('❌ No active teacher accounts found');
    }
    
    // 5. Show test credentials from the page
    console.log('\n5️⃣ Test Credentials from Login Page:');
    console.log('   Email: teacher@test.com');
    console.log('   Password: 123456');
    console.log('   School ID: SCH-20260228-0001');
    
    // Check if these test credentials exist
    const testUser = await usersCollection.findOne({
      email: 'teacher@test.com',
      schoolId: 'SCH-20260228-0001',
      role: 'teacher',
      isActive: true
    });
    
    if (testUser) {
      console.log('   ✅ Test credentials exist in database');
    } else {
      console.log('   ❌ Test credentials do NOT exist in database');
    }
    
  } catch (error) {
    console.error('❌ Error listing teachers:', error);
  } finally {
    await client.close();
  }
}

// Run the listing
listExistingTeachers();