#!/usr/bin/env node

/**
 * Fix Teacher Login Issue
 * Creates the missing teacher account for 9golfy@gmail.com
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function fixTeacherLoginIssue() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔧 Fixing Teacher Login Issue...');
    console.log('📧 Creating account for: 9golfy@gmail.com');
    console.log('🏫 School ID: SCH-20260310-0001');
    console.log('=' .repeat(50));
    
    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: '9golfy@gmail.com'
    });
    
    if (existingUser) {
      console.log('✅ User already exists, updating school ID and password...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      // Update the user
      await usersCollection.updateOne(
        { email: '9golfy@gmail.com' },
        {
          $set: {
            schoolId: 'SCH-20260310-0001',
            password: hashedPassword,
            role: 'teacher',
            isActive: true,
            updatedAt: new Date()
          }
        }
      );
      
      console.log('✅ User updated successfully');
    } else {
      console.log('➕ Creating new user account...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      // Create new user
      const newUser = {
        email: '9golfy@gmail.com',
        password: hashedPassword,
        role: 'teacher',
        schoolId: 'SCH-20260310-0001',
        firstName: 'Teacher',
        lastName: 'Test',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await usersCollection.insertOne(newUser);
      console.log('✅ New user created successfully');
    }
    
    // Verify the user can be found
    const verifyUser = await usersCollection.findOne({
      email: '9golfy@gmail.com',
      schoolId: 'SCH-20260310-0001',
      role: 'teacher',
      isActive: true
    });
    
    if (verifyUser) {
      console.log('\n✅ VERIFICATION SUCCESSFUL');
      console.log('📧 Email:', verifyUser.email);
      console.log('🏫 School ID:', verifyUser.schoolId);
      console.log('👤 Role:', verifyUser.role);
      console.log('🔐 Password: 123456 (default)');
      console.log('✅ Active:', verifyUser.isActive);
      
      console.log('\n🎉 You can now login with:');
      console.log('   Email: 9golfy@gmail.com');
      console.log('   Password: 123456');
      console.log('   School ID: SCH-20260310-0001');
      
    } else {
      console.log('\n❌ VERIFICATION FAILED');
      console.log('Something went wrong during user creation');
    }
    
  } catch (error) {
    console.error('❌ Error fixing teacher login:', error);
  } finally {
    await client.close();
  }
}

// Run the fix
fixTeacherLoginIssue();