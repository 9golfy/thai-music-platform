const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function clearDatabase() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    
    console.log(`\n📋 Found ${collections.length} collections`);
    
    // Delete all documents from each collection EXCEPT super admin
    for (const collection of collections) {
      const collectionName = collection.name;
      
      if (collectionName === 'users') {
        // Delete all users EXCEPT super admin (root@thaimusic.com)
        const result = await db.collection(collectionName).deleteMany({
          email: { $ne: 'root@thaimusic.com' }
        });
        console.log(`🗑️  Cleared ${collectionName}: ${result.deletedCount} documents deleted (kept super admin)`);
        
        // Check if super admin exists, if not create it
        const superAdmin = await db.collection('users').findOne({ email: 'root@thaimusic.com' });
        if (!superAdmin) {
          const hashedPassword = await bcrypt.hash('P@sswordAdmin123', 10);
          await db.collection('users').insertOne({
            email: 'root@thaimusic.com',
            password: hashedPassword,
            role: 'super_admin',
            name: 'Super Administrator',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log('✅ Super admin created: root@thaimusic.com');
        } else {
          console.log('✅ Super admin already exists: root@thaimusic.com');
        }
      } else {
        // Delete all documents from other collections
        const result = await db.collection(collectionName).deleteMany({});
        console.log(`🗑️  Cleared ${collectionName}: ${result.deletedCount} documents deleted`);
      }
    }
    
    console.log('\n✅ All data cleared successfully!');
    console.log('🔐 Super admin preserved: root@thaimusic.com');
    console.log('🔄 You can now start fresh testing\n');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

clearDatabase();
