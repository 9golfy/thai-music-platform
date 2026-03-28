const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Production MongoDB URI - connects to Docker container
const PRODUCTION_URI = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function clearProductionDatabase() {
  console.log('⚠️  WARNING: This will clear ALL data from PRODUCTION database!');
  console.log('⚠️  Only super admin (root@thaimusic.com) will be preserved.');
  console.log('⚠️  Press Ctrl+C within 5 seconds to cancel...\n');
  
  // Wait 5 seconds before proceeding
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const client = new MongoClient(PRODUCTION_URI);

  try {
    await client.connect();
    console.log('✅ Connected to Production MongoDB');

    const db = client.db('thai_music_school');
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    
    console.log(`\n📋 Found ${collections.length} collections`);
    
    let totalDeleted = 0;
    
    // Delete all documents from each collection EXCEPT super admin
    for (const collection of collections) {
      const collectionName = collection.name;
      
      if (collectionName === 'users') {
        // Delete all users EXCEPT super admin (root@thaimusic.com)
        const result = await db.collection(collectionName).deleteMany({
          email: { $ne: 'root@thaimusic.com' }
        });
        totalDeleted += result.deletedCount;
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
          console.log('✅ Super admin preserved: root@thaimusic.com');
        }
      } else {
        // Delete all documents from other collections
        const result = await db.collection(collectionName).deleteMany({});
        totalDeleted += result.deletedCount;
        console.log(`🗑️  Cleared ${collectionName}: ${result.deletedCount} documents deleted`);
      }
    }
    
    console.log('\n✅ Production database cleared successfully!');
    console.log(`📊 Total documents deleted: ${totalDeleted}`);
    console.log('🔐 Super admin preserved: root@thaimusic.com / P@sswordAdmin123');
    console.log('🔄 Production database is now ready for fresh testing\n');
    
  } catch (error) {
    console.error('❌ Error clearing production database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

clearProductionDatabase();
