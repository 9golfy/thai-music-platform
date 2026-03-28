const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function updateRootPassword() {
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
    
    const hashedPassword = await bcrypt.hash('P@sswordAdmin123', 10);
    
    const result = await db.collection('users').updateOne(
      { email: 'root@thaimusic.com' },
      { 
        $set: { 
          password: hashedPassword,
          role: 'super_admin',
          name: 'Super Administrator',
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );
    
    if (result.upsertedCount > 0) {
      console.log('✅ Super admin created: root@thaimusic.com');
    } else {
      console.log('✅ Super admin password updated: root@thaimusic.com');
    }
    
    console.log('📧 Email: root@thaimusic.com');
    console.log('🔑 Password: P@sswordAdmin123');
    console.log('🔐 Role: super_admin (root privileges)\n');
    
  } catch (error) {
    console.error('❌ Error updating password:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

updateRootPassword();
