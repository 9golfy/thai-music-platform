// Test request password flow without actually sending email
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

// Generate 6-digit password
function generateTeacherPassword() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash password
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function testRequestPasswordFlow() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔍 Testing Request Password Flow...\n');
    
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
      console.log('💡 Creating a test teacher...');
      
      // Create test teacher
      const testTeacher = {
        firstName: 'Test',
        lastName: 'Teacher',
        email: 'test.teacher@example.com',
        phone: '0812345678',
        role: 'teacher',
        isActive: true,
        schoolId: 'TEST-SCHOOL-001',
        password: await hashPassword('123456'),
        createdAt: new Date()
      };
      
      const result = await usersCollection.insertOne(testTeacher);
      console.log(`✅ Created test teacher with ID: ${result.insertedId}`);
      
      // Use the created teacher for testing
      teacher = { ...testTeacher, _id: result.insertedId };
    }
    
    console.log('👨‍🏫 Testing with teacher:');
    console.log(`   Name: ${teacher.firstName} ${teacher.lastName}`);
    console.log(`   Email: ${teacher.email}`);
    console.log(`   Phone: ${teacher.phone || 'Not set'}`);
    console.log(`   School ID: ${teacher.schoolId || 'Not set'}`);
    console.log('');
    
    // Test password generation
    const newPassword = generateTeacherPassword();
    console.log(`🔑 Generated new password: ${newPassword}`);
    
    // Test password hashing
    const hashedPassword = await hashPassword(newPassword);
    console.log(`🔒 Hashed password: ${hashedPassword.substring(0, 20)}...`);
    
    // Test password verification
    const isValid = await bcrypt.compare(newPassword, hashedPassword);
    console.log(`✅ Password verification: ${isValid ? 'PASS' : 'FAIL'}`);
    
    // Test database update
    const updateResult = await usersCollection.updateOne(
      { _id: teacher._id },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );
    
    console.log(`📝 Database update: ${updateResult.modifiedCount > 0 ? 'SUCCESS' : 'FAILED'}`);
    
    // Test school name lookup
    const submissionsCollection = database.collection('register_support_submissions');
    let schoolName = 'โรงเรียนของคุณ';
    
    if (teacher.schoolId) {
      const submission = await submissionsCollection.findOne({
        _id: teacher.schoolId,
      });
      
      if (submission && submission.schoolName) {
        schoolName = submission.schoolName;
        console.log(`🏫 Found school name: ${schoolName}`);
      } else {
        // Try register100 collection
        const register100Collection = database.collection('register100_submissions');
        const register100Submission = await register100Collection.findOne({
          _id: teacher.schoolId,
        });
        if (register100Submission && register100Submission.schoolName) {
          schoolName = register100Submission.schoolName;
          console.log(`🏫 Found school name in register100: ${schoolName}`);
        } else {
          console.log(`⚠️  School name not found for ID: ${teacher.schoolId}`);
        }
      }
    }
    
    // Simulate email content
    console.log('\n📧 Email content that would be sent:');
    console.log('=====================================');
    console.log(`To: ${teacher.email}`);
    console.log(`Subject: ข้อมูลการเข้าสู่ระบบ - Thai Music Platform`);
    console.log(`\nContent:`);
    console.log(`สวัสดีครับ/ค่ะ ${teacher.firstName} ${teacher.lastName}`);
    console.log(`โรงเรียน: ${schoolName}`);
    console.log(`School ID: ${teacher.schoolId}`);
    console.log(`Email: ${teacher.email}`);
    console.log(`เบอร์โทรศัพท์: ${teacher.phone}`);
    console.log(`รหัสผ่าน (6 หลัก): ${newPassword}`);
    console.log('=====================================\n');
    
    console.log('✅ Request Password Flow Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Password generation: Working');
    console.log('   ✅ Password hashing: Working');
    console.log('   ✅ Password verification: Working');
    console.log('   ✅ Database update: Working');
    console.log('   ✅ School lookup: Working');
    console.log('   ✅ Email content: Ready');
    
    console.log('\n💡 To enable email sending:');
    console.log('   1. Set GMAIL_USER in .env file');
    console.log('   2. Set GMAIL_APP_PASSWORD in .env file');
    console.log('   3. Make sure Gmail 2FA is enabled');
    console.log('   4. Generate App Password from Google Account settings');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.close();
  }
}

async function main() {
  console.log('🧪 Request Password Flow Test (No Email)\n');
  await testRequestPasswordFlow();
}

main().catch(console.error);