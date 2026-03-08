const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function checkRemainingUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    console.log('👥 Remaining Users Check');
    console.log('='.repeat(30));
    
    const usersCollection = database.collection('users');
    const allUsers = await usersCollection.find({}).toArray();
    
    console.log(`\n📊 Total users: ${allUsers.length}`);
    
    if (allUsers.length === 0) {
      console.log('✅ No users found');
    } else {
      console.log('\n📋 Remaining Users:');
      allUsers.forEach((user, index) => {
        const role = user.email.includes('admin') || user.email.includes('root') ? '👑 Admin' : '👤 Regular';
        console.log(`${index + 1}. ${role} - ${user.email} (School ID: ${user.schoolId || 'N/A'})`);
      });
    }
    
    console.log('\n✅ User cleanup verification complete!');
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await client.close();
  }
}

checkRemainingUsers();