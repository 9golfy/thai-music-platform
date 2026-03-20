const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testSystemAdminLogin() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔐 Testing System Admin Login...\n');
    
    const database = client.db(dbName);
    const usersCollection = database.collection('users');
    
    // Test credentials
    const testEmail = 'root@thaimusic.com';
    const testPassword = 'P@sswordAdmin123';
    
    console.log('📋 Test Credentials:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    
    // Find user by email
    const user = await usersCollection.findOne({ 
      email: testEmail.toLowerCase() 
    });
    
    if (!user) {
      console.log('\n❌ FAIL: User not found');
      console.log('   Run: node scripts/create-system-admin.js');
      return;
    }
    
    console.log('\n✅ User found in database');
    console.log(`   ID: ${user._id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   System Admin: ${user.isSystemAdmin}`);
    
    // Test password
    console.log('\n🔑 Testing Password:');
    
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(testPassword, user.password);
      
      if (isPasswordValid) {
        console.log('   ✅ Password is correct');
      } else {
        console.log('   ❌ Password is incorrect');
        console.log('   💡 Try running: node scripts/create-system-admin.js');
        return;
      }
    } catch (error) {
      console.log('   ❌ Error comparing password:', error.message);
      return;
    }
    
    // Test login eligibility
    console.log('\n🚪 Testing Login Eligibility:');
    
    const canLogin = user.isActive !== false; // Allow undefined or true
    console.log(`   Active status: ${user.isActive} (${canLogin ? 'Can login' : 'Cannot login'})`);
    
    if (!canLogin) {
      console.log('   ❌ User is inactive - login would fail');
      return;
    }
    
    // Test role permissions
    console.log('\n🔐 Testing Role Permissions:');
    
    const hasAdminAccess = ['root', 'admin', 'super_admin'].includes(user.role);
    console.log(`   Role: ${user.role} (${hasAdminAccess ? 'Has admin access' : 'No admin access'})`);
    
    const canAccessDcpAdmin = hasAdminAccess;
    console.log(`   Can access /dcp-admin: ${canAccessDcpAdmin ? '✅ Yes' : '❌ No'}`);
    
    const canManageUsers = user.role === 'root' || user.role === 'super_admin';
    console.log(`   Can manage users: ${canManageUsers ? '✅ Yes' : '❌ No'}`);
    
    const canCreateUsers = user.role === 'root' || user.role === 'super_admin';
    console.log(`   Can create users: ${canCreateUsers ? '✅ Yes' : '❌ No'}`);
    
    // Final result
    console.log('\n🎯 Login Test Results:');
    
    if (isPasswordValid && canLogin && hasAdminAccess) {
      console.log('   ✅ PASS: System admin can login successfully');
      console.log('   ✅ Has full admin access');
      console.log('   ✅ Can access all admin features');
      console.log('\n🎉 System admin login is working correctly!');
      
      console.log('\n📝 Login Instructions:');
      console.log('   1. Go to: http://localhost:3000/dcp-admin');
      console.log('   2. Enter Email: root@thaimusic.com');
      console.log('   3. Enter Password: P@sswordAdmin123');
      console.log('   4. Click "เข้าสู่ระบบ"');
    } else {
      console.log('   ❌ FAIL: System admin cannot login');
      console.log('   ❌ Login would be rejected');
      console.log('\n⚠️  System admin login needs fixing!');
    }
    
  } catch (error) {
    console.error('❌ Error testing system admin login:', error);
  } finally {
    await client.close();
  }
}

// Run the test
testSystemAdminLogin();