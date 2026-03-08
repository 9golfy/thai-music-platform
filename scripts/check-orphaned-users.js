const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function checkOrphanedUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    console.log('🔍 Checking for Orphaned Users');
    console.log('='.repeat(40));
    
    const usersCollection = database.collection('users');
    const register100Collection = database.collection('register100_submissions');
    const registerSupportCollection = database.collection('register_support_submissions');
    
    // Get all users
    const allUsers = await usersCollection.find({}).toArray();
    console.log(`\n👥 Total users in database: ${allUsers.length}`);
    
    if (allUsers.length === 0) {
      console.log('✅ No users found - database is clean');
      return;
    }
    
    // Show all users
    console.log('\n📋 All Users:');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}, Phone: ${user.phone || 'N/A'}, School ID: ${user.schoolId || 'N/A'}`);
    });
    
    // Get all school IDs from submissions
    const register100Schools = await register100Collection.find({}, { schoolId: 1 }).toArray();
    const registerSupportSchools = await registerSupportCollection.find({}, { schoolId: 1 }).toArray();
    
    const existingSchoolIds = new Set([
      ...register100Schools.map(s => s.schoolId).filter(Boolean),
      ...registerSupportSchools.map(s => s.schoolId).filter(Boolean)
    ]);
    
    console.log(`\n🏫 Existing school IDs: ${existingSchoolIds.size}`);
    console.log('School IDs:', Array.from(existingSchoolIds));
    
    // Find orphaned users (users whose schoolId doesn't exist in submissions)
    const orphanedUsers = allUsers.filter(user => {
      return user.schoolId && !existingSchoolIds.has(user.schoolId);
    });
    
    console.log(`\n🚨 Orphaned users found: ${orphanedUsers.length}`);
    
    if (orphanedUsers.length > 0) {
      console.log('\n📋 Orphaned Users (should be deleted):');
      orphanedUsers.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}, Phone: ${user.phone || 'N/A'}, School ID: ${user.schoolId}`);
      });
      
      console.log('\n⚠️  These users have schoolId that no longer exist in submissions');
      console.log('They should be deleted to maintain data consistency.');
      
      console.log('\nTo delete orphaned users, run:');
      console.log('DELETE_ORPHANED=true node scripts/check-orphaned-users.js');
    } else {
      console.log('✅ No orphaned users found - all users have valid school references');
    }
    
    // Check if we should delete orphaned users
    if (process.env.DELETE_ORPHANED === 'true' && orphanedUsers.length > 0) {
      console.log('\n🗑️  Deleting orphaned users...');
      
      const orphanedUserIds = orphanedUsers.map(user => user._id);
      const deleteResult = await usersCollection.deleteMany({
        _id: { $in: orphanedUserIds }
      });
      
      console.log(`✅ Deleted ${deleteResult.deletedCount} orphaned users`);
      
      // Verify deletion
      const remainingUsers = await usersCollection.countDocuments();
      console.log(`📊 Remaining users: ${remainingUsers}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking orphaned users:', error);
  } finally {
    await client.close();
  }
}

checkOrphanedUsers();