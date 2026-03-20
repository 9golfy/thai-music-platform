const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testUsersDisplay() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('👥 Testing Users Display Logic...\n');
    
    const database = client.db(dbName);
    const usersCollection = database.collection('users');
    
    // Get all users (same as UsersDataTable)
    const users = await usersCollection
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`📊 Total users found: ${users.length}`);
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    // Display all users
    console.log('\n👤 All Users:');
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email}`);
      console.log(`      Role: ${user.role}`);
      console.log(`      Name: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`);
      console.log(`      Active: ${user.isActive}`);
      console.log(`      System Admin: ${user.isSystemAdmin || false}`);
      console.log('');
    });
    
    // Test filtering logic (same as UsersDataTable)
    const adminUsers = users.filter((u) => ['root', 'admin', 'super_admin'].includes(u.role));
    const teacherUsers = users.filter((u) => u.role === 'teacher');
    
    console.log('🔍 Filtering Results:');
    console.log(`   Admin Users: ${adminUsers.length}`);
    console.log(`   Teacher Users: ${teacherUsers.length}`);
    
    if (adminUsers.length > 0) {
      console.log('\n👑 Admin Users:');
      adminUsers.forEach((user, index) => {
        const isSystemAdmin = user.isSystemAdmin === true || user.email === 'root@thaimusic.com';
        console.log(`   ${index + 1}. ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Role: ${user.role}`);
        console.log(`      System Admin Badge: ${isSystemAdmin ? '✅ Yes' : '❌ No'}`);
        console.log(`      Delete Button: ${isSystemAdmin ? '❌ Hidden' : '✅ Visible'}`);
        console.log('');
      });
    }
    
    // Check specifically for system admin
    const systemAdmin = users.find(u => u.email === 'root@thaimusic.com');
    
    if (systemAdmin) {
      console.log('🎯 System Admin Check:');
      console.log(`   ✅ Found in database`);
      console.log(`   ✅ Role: ${systemAdmin.role}`);
      console.log(`   ✅ Will appear in admin tab: ${['root', 'admin', 'super_admin'].includes(systemAdmin.role)}`);
      console.log(`   ✅ Has firstName: ${systemAdmin.firstName || 'Missing'}`);
      console.log(`   ✅ Has lastName: ${systemAdmin.lastName || 'Missing'}`);
      console.log(`   ✅ System Admin badge: ${systemAdmin.isSystemAdmin === true || systemAdmin.email === 'root@thaimusic.com'}`);
    } else {
      console.log('❌ System admin not found in results');
    }
    
  } catch (error) {
    console.error('❌ Error testing users display:', error);
  } finally {
    await client.close();
  }
}

// Run the test
testUsersDisplay();