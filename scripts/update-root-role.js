const { MongoClient } = require('mongodb');

const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function updateRootRole() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db(dbName);
    const usersCollection = database.collection('users');

    // Find the system admin user
    const user = await usersCollection.findOne({
      email: 'root@thaimusic.com'
    });

    if (!user) {
      console.log('❌ User with email root@thaimusic.com not found');
      return;
    }

    console.log('📋 Current user data:');
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   isSystemAdmin:', user.isSystemAdmin);

    // Update role to 'root'
    const result = await usersCollection.updateOne(
      { email: 'root@thaimusic.com' },
      { 
        $set: { 
          role: 'root',
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Successfully updated role to "root"');
      
      // Verify the update
      const updatedUser = await usersCollection.findOne({
        email: 'root@thaimusic.com'
      });
      console.log('📋 Updated user data:');
      console.log('   Email:', updatedUser.email);
      console.log('   Role:', updatedUser.role);
    } else {
      console.log('⚠️ No changes made (role might already be "root")');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updateRootRole();
