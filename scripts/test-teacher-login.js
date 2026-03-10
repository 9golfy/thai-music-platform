#!/usr/bin/env node

/**
 * Test Teacher Login with Valid Credentials
 * Tests the teacher login API with existing valid credentials
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testTeacherLogin() {
  console.log('🧪 Testing Teacher Login API...');
  console.log('=' .repeat(50));
  
  // Use valid credentials from the database
  const validCredentials = [
    {
      email: 'test11@testschool.com',
      schoolId: 'SCH202600001',
      password: '123456', // Default password for test accounts
      description: 'Test School 1'
    },
    {
      email: 'thaimusicplatform@gmail.com',
      schoolId: 'SCH-20260309-0003',
      password: '123456',
      description: 'Thai Music Platform Account'
    },
    {
      email: 'kaibandon2021@gmail.com',
      schoolId: 'SCH-20260309-0002',
      password: '123456',
      description: 'Kai Bandon Account'
    }
  ];
  
  for (let i = 0; i < validCredentials.length; i++) {
    const creds = validCredentials[i];
    console.log(`\n${i + 1}️⃣ Testing: ${creds.description}`);
    console.log(`   Email: ${creds.email}`);
    console.log(`   School ID: ${creds.schoolId}`);
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/teacher-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: creds.email,
          password: creds.password,
          schoolId: creds.schoolId
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('   ✅ LOGIN SUCCESSFUL');
        console.log(`   → User: ${data.user.firstName} ${data.user.lastName}`);
        console.log(`   → Role: ${data.user.role}`);
        if (data.submissionId) {
          console.log(`   → Submission: ${data.submissionType} (${data.submissionId})`);
        }
      } else {
        console.log('   ❌ LOGIN FAILED');
        console.log(`   → Status: ${response.status}`);
        console.log(`   → Message: ${data.message}`);
      }
      
    } catch (error) {
      console.log('   ❌ REQUEST ERROR');
      console.log(`   → Error: ${error.message}`);
    }
  }
  
  console.log('\n💡 Recommendations:');
  console.log('1. Use one of the successful credentials above');
  console.log('2. If you need to use 9golfy@gmail.com, create the account first');
  console.log('3. Check that your local development server is running');
  console.log('4. Verify the password is correct (default is usually 123456)');
}

// Run the test
testTeacherLogin();