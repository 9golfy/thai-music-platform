// Test script for request password email functionality
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

async function testRequestPassword() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔍 Testing Request Password functionality...\n');
    
    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection('users');
    
    // Find a teacher user for testing
    const teacher = await usersCollection.findOne({
      role: 'teacher',
      isActive: true
    });
    
    if (!teacher) {
      console.log('❌ No active teacher found in database');
      return;
    }
    
    console.log('👨‍🏫 Found teacher for testing:');
    console.log(`   Name: ${teacher.firstName} ${teacher.lastName}`);
    console.log(`   Email: ${teacher.email}`);
    console.log(`   Phone: ${teacher.phone || 'Not set'}`);
    console.log(`   School ID: ${teacher.schoolId || 'Not set'}`);
    console.log('');
    
    // Test the API endpoint
    const testData = {
      email: teacher.email,
      phone: teacher.phone || '0812345678' // Use existing phone or dummy
    };
    
    console.log('📧 Testing API call with data:');
    console.log(`   Email: ${testData.email}`);
    console.log(`   Phone: ${testData.phone}`);
    console.log('');
    
    // Make API call
    const response = await fetch('http://localhost:3000/api/auth/request-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const result = await response.json();
    
    console.log('📨 API Response:');
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${result.success}`);
    console.log(`   Message: ${result.message || result.error}`);
    
    if (result.success) {
      console.log('✅ Request password API working correctly!');
      
      // Check if password was updated in database
      const updatedUser = await usersCollection.findOne({ _id: teacher._id });
      if (updatedUser.updatedAt > teacher.updatedAt) {
        console.log('✅ Password updated in database');
      }
    } else {
      console.log('❌ Request password failed');
      if (result.details) {
        console.log(`   Details: ${result.details}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await client.close();
  }
}

// Check environment variables
function checkEnvironment() {
  console.log('🔧 Checking environment variables...\n');
  
  const required = [
    'MONGODB_URI',
    'GMAIL_USER', 
    'GMAIL_APP_PASSWORD',
    'NEXT_PUBLIC_APP_URL'
  ];
  
  const missing = [];
  
  required.forEach(key => {
    if (process.env[key]) {
      console.log(`✅ ${key}: Set`);
    } else {
      console.log(`❌ ${key}: Missing`);
      missing.push(key);
    }
  });
  
  console.log('');
  
  if (missing.length > 0) {
    console.log('⚠️  Missing environment variables. Please check your .env file:');
    missing.forEach(key => console.log(`   - ${key}`));
    console.log('');
    return false;
  }
  
  return true;
}

async function main() {
  console.log('🧪 Request Password Email Test\n');
  
  if (!checkEnvironment()) {
    process.exit(1);
  }
  
  await testRequestPassword();
}

main().catch(console.error);