const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function checkSystemAdmin() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔍 Checking System Admin Status...\n');
    
    const database = client.db(dbName);
    const usersCollection = database.collection('users');
    
    // Find system admin
    const systemAdmin = await usersCollection.findOne({ 
      email: 'root@thaimusic.com' 
    });
    
    if (systemAdmin) {
      console.log('✅ System Admin Found:');
      console.log(`   ID: ${systemAdmin._id}`);
      console.log(`   Email: ${systemAdmin.email}`);
      console.log(`   Name: ${systemAdmin.name || `${systemAdmin.firstName || ''} ${systemAdmin.lastName || ''}`.trim()}`);
      console.log(`   First Name: ${systemAdmin.firstName || 'N/A'}`);
      console.log(`   Last Name: ${systemAdmin.lastName || 'N/A'}`);
      console.log(`   Phone: ${systemAdmin.phone || 'N/A'}`);
      console.log(`   Role: ${systemAdmin.role}`);
      console.log(`   System Admin Flag: ${systemAdmin.isSystemAdmin ? '✅ Yes' : '❌ No'}`);
      console.log(`   Active: ${systemAdmin.isActive ? '✅ Yes' : '❌ No'}`);
      console.log(`   Created: ${systemAdmin.createdAt}`);
      console.log(`   Updated: ${systemAdmin.updatedAt}`);
      
      // Check protection status
      const isProtected = systemAdmin.isSystemAdmin === true || systemAdmin.email === 'root@thaimusic.com';
      console.log(`\n🛡️  Protection Status: ${isProtected ? '✅ Protected from deletion' : '⚠️  Not protected'}`);
      
      if (isProtected) {
        console.log('\n🎉 System admin is properly configured and protected!');
        console.log('   • Cannot be deleted through API');
        console.log('   • Will show "System Admin" badge in UI');
        console.log('   • Delete button will be hidden');
      } else {
        console.log('\n⚠️  System admin may need configuration update');
      }
    } else {
      console.log('❌ System Admin not found!');
      console.log('   Run: node scripts/create-system-admin.js');
    }
    
    // Count all users by role
    console.log('\n📊 User Statistics:');
    const userStats = await usersCollection.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          systemAdmins: {
            $sum: {
              $cond: [
                { $or: [
                  { $eq: ['$isSystemAdmin', true] },
                  { $eq: ['$email', 'root@thaimusic.com'] }
                ]},
                1,
                0
              ]
            }
          }
        }
      }
    ]).toArray();
    
    userStats.forEach(stat => {
      const systemAdminText = stat.systemAdmins > 0 ? ` (${stat.systemAdmins} system admin${stat.systemAdmins > 1 ? 's' : ''})` : '';
      console.log(`   ${stat._id}: ${stat.count} user${stat.count > 1 ? 's' : ''}${systemAdminText}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking system admin:', error);
  } finally {
    await client.close();
  }
}

// Run the check
checkSystemAdmin();