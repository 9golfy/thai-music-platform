const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testAdminLoginAPI() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🧪 Testing Admin Login API Logic...\n');
    
    const database = client.db(dbName);
    const usersCollection = database.collection('users');
    
    // Test credentials
    const testEmail = 'root@thaimusic.com';
    const testPassword = 'P@sswordAdmin123';
    
    console.log('📋 Testing with credentials:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    
    // Step 1: Find user by email and role (same as API logic)
    console.log('\n🔍 Step 1: Finding user...');
    const user = await usersCollection.findOne({
      email: testEmail.toLowerCase(),
      role: { $in: ['admin', 'root', 'super_admin'] },
      isActive: { $ne: false }, // Allow undefined or true
    });
    
    if (!user) {
      console.log('❌ User not found with API criteria');
      console.log('   Checking what users exist...');
      
      const allUsers = await usersCollection.find({}).toArray();
      console.log(`   Total users: ${allUsers.length}`);
      
      allUsers.forEach(u => {
        console.log(`   - ${u.email} (role: ${u.role}, active: ${u.isActive})`);
      });
      
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   ID: ${user._id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   System Admin: ${user.isSystemAdmin}`);
    
    // Step 2: Verify password (same as API logic)
    console.log('\n🔑 Step 2: Verifying password...');
    const isValidPassword = await bcrypt.compare(testPassword, user.password);
    
    if (!isValidPassword) {
      console.log('❌ Password verification failed');
      console.log('   This would cause API to return 401');
      return;
    }
    
    console.log('✅ Password verification successful');
    
    // Step 3: Check if login would succeed
    console.log('\n🎯 Step 3: Login eligibility check...');
    
    const canLogin = user.isActive !== false; // Same logic as API
    console.log(`   Active check: ${canLogin ? 'PASS' : 'FAIL'}`);
    
    const hasValidRole = ['admin', 'root', 'super_admin'].includes(user.role);
    console.log(`   Role check: ${hasValidRole ? 'PASS' : 'FAIL'}`);
    
    if (canLogin && hasValidRole && isValidPassword) {
      console.log('\n🎉 API LOGIN WOULD SUCCEED!');
      console.log('   ✅ User found with valid role');
      console.log('   ✅ User is active');
      console.log('   ✅ Password is correct');
      console.log('\n📝 Expected API Response:');
      console.log('   Status: 200 OK');
      console.log('   Message: "เข้าสู่ระบบสำเร็จ"');
      console.log('   Session would be created');
    } else {
      console.log('\n❌ API LOGIN WOULD FAIL!');
      console.log(`   User found: ${!!user}`);
      console.log(`   Active: ${canLogin}`);
      console.log(`   Valid role: ${hasValidRole}`);
      console.log(`   Valid password: ${isValidPassword}`);
    }
    
    // Additional debugging
    console.log('\n🔧 Debug Information:');
    console.log(`   Database: ${dbName}`);
    console.log(`   Collection: users`);
    console.log(`   Search email: ${testEmail.toLowerCase()}`);
    console.log(`   Search roles: ['admin', 'root', 'super_admin']`);
    console.log(`   Search active: { $ne: false }`);
    
  } catch (error) {
    console.error('❌ Error testing admin login API:', error);
  } finally {
    await client.close();
  }
}

// Run the test
testAdminLoginAPI();