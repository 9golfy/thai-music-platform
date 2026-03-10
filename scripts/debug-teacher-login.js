#!/usr/bin/env node

/**
 * Debug Teacher Login Issue
 * Checks if the teacher account exists and validates login credentials
 */

const { MongoClient } = require('mongodb');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

// Test credentials from the screenshot
const testCredentials = {
  email: '9golfy@gmail.com',
  schoolId: 'SCH-20260310-0001'
};

async function debugTeacherLogin() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔍 Debugging Teacher Login Issue...');
    console.log('📧 Email:', testCredentials.email);
    console.log('🏫 School ID:', testCredentials.schoolId);
    console.log('=' .repeat(50));
    
    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection('users');
    
    // 1. Check if user exists with this email
    console.log('\n1️⃣ Checking user by email...');
    const userByEmail = await usersCollection.findOne({
      email: testCredentials.email.toLowerCase()
    });
    
    if (userByEmail) {
      console.log('✅ User found by email:');
      console.log('   - Email:', userByEmail.email);
      console.log('   - Role:', userByEmail.role);
      console.log('   - School ID:', userByEmail.schoolId);
      console.log('   - Active:', userByEmail.isActive);
      console.log('   - Has Password:', !!userByEmail.password);
    } else {
      console.log('❌ No user found with this email');
    }
    
    // 2. Check if user exists with this schoolId
    console.log('\n2️⃣ Checking users by school ID...');
    const usersBySchoolId = await usersCollection.find({
      schoolId: testCredentials.schoolId
    }).toArray();
    
    if (usersBySchoolId.length > 0) {
      console.log(`✅ Found ${usersBySchoolId.length} user(s) with this school ID:`);
      usersBySchoolId.forEach((user, index) => {
        console.log(`   User ${index + 1}:`);
        console.log('     - Email:', user.email);
        console.log('     - Role:', user.role);
        console.log('     - Active:', user.isActive);
        console.log('     - Has Password:', !!user.password);
      });
    } else {
      console.log('❌ No users found with this school ID');
    }
    
    // 3. Check for exact match (email + schoolId + role + active)
    console.log('\n3️⃣ Checking exact teacher match...');
    const exactMatch = await usersCollection.findOne({
      email: testCredentials.email.toLowerCase(),
      schoolId: testCredentials.schoolId,
      role: 'teacher',
      isActive: true
    });
    
    if (exactMatch) {
      console.log('✅ Exact teacher match found:');
      console.log('   - This account should be able to login');
      console.log('   - Password hash exists:', !!exactMatch.password);
    } else {
      console.log('❌ No exact teacher match found');
      console.log('   - Either email, schoolId, role, or isActive doesn\'t match');
    }
    
    // 4. Check submissions for this school ID
    console.log('\n4️⃣ Checking submissions for this school...');
    
    const register100Collection = database.collection('register100_submissions');
    const register100Submission = await register100Collection.findOne({ 
      schoolId: testCredentials.schoolId 
    });
    
    if (register100Submission) {
      console.log('✅ Register100 submission found:');
      console.log('   - Submission ID:', register100Submission._id);
      console.log('   - School Name:', register100Submission.reg100_schoolName);
      console.log('   - Teacher Email:', register100Submission.teacherEmail);
      console.log('   - Teacher Phone:', register100Submission.teacherPhone);
    } else {
      console.log('❌ No Register100 submission found');
    }
    
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportSubmission = await registerSupportCollection.findOne({ 
      schoolId: testCredentials.schoolId 
    });
    
    if (registerSupportSubmission) {
      console.log('✅ Register Support submission found:');
      console.log('   - Submission ID:', registerSupportSubmission._id);
      console.log('   - School Name:', registerSupportSubmission.schoolName);
      console.log('   - Teacher Email:', registerSupportSubmission.teacherEmail);
      console.log('   - Teacher Phone:', registerSupportSubmission.teacherPhone);
    } else {
      console.log('❌ No Register Support submission found');
    }
    
    // 5. Recommendations
    console.log('\n💡 Recommendations:');
    
    if (!userByEmail && !usersBySchoolId.length) {
      console.log('❌ ISSUE: No user account exists for this email or school ID');
      console.log('   → Need to create a teacher account first');
      console.log('   → Or check if the school ID is correct');
    } else if (userByEmail && userByEmail.schoolId !== testCredentials.schoolId) {
      console.log('❌ ISSUE: Email exists but with different school ID');
      console.log(`   → User's school ID: ${userByEmail.schoolId}`);
      console.log(`   → Trying to login with: ${testCredentials.schoolId}`);
    } else if (userByEmail && userByEmail.role !== 'teacher') {
      console.log('❌ ISSUE: User exists but not a teacher');
      console.log(`   → User's role: ${userByEmail.role}`);
    } else if (userByEmail && !userByEmail.isActive) {
      console.log('❌ ISSUE: User account is inactive');
      console.log('   → Need to activate the account');
    } else if (userByEmail && !userByEmail.password) {
      console.log('❌ ISSUE: User exists but has no password');
      console.log('   → Need to set a password for this user');
    } else {
      console.log('✅ User account looks correct');
      console.log('   → The issue might be with the password');
      console.log('   → Try using the password reset feature');
    }
    
  } catch (error) {
    console.error('❌ Error debugging teacher login:', error);
  } finally {
    await client.close();
  }
}

// Run the debug
debugTeacherLogin();