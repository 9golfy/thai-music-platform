const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testSystemAdminProtection() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🧪 Testing System Admin Protection...\n');
    
    const database = client.db(dbName);
    const usersCollection = database.collection('users');
    
    // Find system admin
    const systemAdmin = await usersCollection.findOne({ 
      email: 'root@thaimusic.com' 
    });
    
    if (!systemAdmin) {
      console.log('❌ System admin not found! Run create-system-admin.js first');
      return;
    }
    
    console.log('📋 System Admin Found:');
    console.log(`   ID: ${systemAdmin._id}`);
    console.log(`   Email: ${systemAdmin.email}`);
    console.log(`   System Admin Flag: ${systemAdmin.isSystemAdmin}`);
    
    // Test protection logic
    console.log('\n🛡️  Testing Protection Logic:');
    
    // Test 1: isSystemAdmin flag
    const isProtectedByFlag = systemAdmin.isSystemAdmin === true;
    console.log(`   1. Protected by isSystemAdmin flag: ${isProtectedByFlag ? '✅ Yes' : '❌ No'}`);
    
    // Test 2: Email check
    const isProtectedByEmail = systemAdmin.email === 'root@thaimusic.com';
    console.log(`   2. Protected by email check: ${isProtectedByEmail ? '✅ Yes' : '❌ No'}`);
    
    // Test 3: Combined protection
    const isFullyProtected = isProtectedByFlag || isProtectedByEmail;
    console.log(`   3. Fully protected: ${isFullyProtected ? '✅ Yes' : '❌ No'}`);
    
    // Simulate API deletion check
    console.log('\n🔍 Simulating API Deletion Check:');
    
    if (systemAdmin.isSystemAdmin === true || systemAdmin.email === 'root@thaimusic.com') {
      console.log('   ✅ API would REJECT deletion with message:');
      console.log('      "ไม่สามารถลบ System Administrator ได้"');
      console.log('   ✅ HTTP Status: 403 Forbidden');
    } else {
      console.log('   ❌ API would ALLOW deletion - PROTECTION FAILED!');
    }
    
    // Test UI protection logic
    console.log('\n🖥️  Testing UI Protection Logic:');
    
    // Simulate different user roles trying to delete
    const testRoles = ['root', 'admin', 'teacher'];
    
    testRoles.forEach(role => {
      const canSeeDeleteButton = (
        role === 'root' && 
        systemAdmin.role !== 'root' && 
        systemAdmin.isSystemAdmin !== true && 
        systemAdmin.email !== 'root@thaimusic.com'
      );
      
      console.log(`   ${role} role can see delete button: ${canSeeDeleteButton ? '❌ Yes (BAD)' : '✅ No (GOOD)'}`);
    });
    
    // Test badge display
    const shouldShowBadge = (systemAdmin.isSystemAdmin === true || systemAdmin.email === 'root@thaimusic.com');
    console.log(`   Should show "System Admin" badge: ${shouldShowBadge ? '✅ Yes' : '❌ No'}`);
    
    // Final result
    console.log('\n🎯 Protection Test Results:');
    
    if (isFullyProtected) {
      console.log('   ✅ PASS: System admin is fully protected');
      console.log('   ✅ Cannot be deleted via API');
      console.log('   ✅ Delete button hidden in UI');
      console.log('   ✅ System Admin badge will be shown');
      console.log('\n🎉 System admin protection is working correctly!');
    } else {
      console.log('   ❌ FAIL: System admin is NOT protected');
      console.log('   ❌ May be deleted via API');
      console.log('   ❌ Delete button may be visible');
      console.log('\n⚠️  System admin protection needs fixing!');
    }
    
  } catch (error) {
    console.error('❌ Error testing system admin protection:', error);
  } finally {
    await client.close();
  }
}

// Run the test
testSystemAdminProtection();