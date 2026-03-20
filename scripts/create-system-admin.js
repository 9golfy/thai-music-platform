const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function createSystemAdmin() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔧 Creating System Admin...\n');
    
    const database = client.db(dbName);
    const usersCollection = database.collection('users');
    
    // System admin credentials
    const systemAdmin = {
      email: 'root@thaimusic.com',
      password: 'P@sswordAdmin123',
      role: 'super_admin',
      isSystemAdmin: true, // Special flag to prevent deletion
      name: 'System Administrator',
      firstName: 'System',
      lastName: 'Administrator',
      phone: '000-000-0000',
      isActive: true, // Make sure admin is active
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if system admin already exists
    const existingAdmin = await usersCollection.findOne({ 
      email: systemAdmin.email 
    });
    
    if (existingAdmin) {
      console.log('⚠️  System admin already exists');
      
      // Update existing admin to ensure it has system admin flag
      const updateResult = await usersCollection.updateOne(
        { email: systemAdmin.email },
        { 
          $set: { 
            isSystemAdmin: true,
            role: 'super_admin',
            firstName: 'System',
            lastName: 'Administrator',
            phone: '000-000-0000',
            isActive: true, // Make sure admin is active
            updatedAt: new Date()
          } 
        }
      );
      
      if (updateResult.modifiedCount > 0) {
        console.log('✅ Updated existing admin with system admin protection');
      } else {
        console.log('ℹ️  Admin already has correct settings');
      }
    } else {
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(systemAdmin.password, saltRounds);
      systemAdmin.password = hashedPassword;
      
      // Create new system admin
      const insertResult = await usersCollection.insertOne(systemAdmin);
      
      if (insertResult.insertedId) {
        console.log('✅ System admin created successfully');
        console.log(`   ID: ${insertResult.insertedId}`);
      } else {
        console.log('❌ Failed to create system admin');
      }
    }
    
    // Verify system admin exists and has correct settings
    const verifyAdmin = await usersCollection.findOne({ 
      email: 'root@thaimusic.com' 
    });
    
    if (verifyAdmin) {
      console.log('\n📋 System Admin Details:');
      console.log(`   Email: ${verifyAdmin.email}`);
      console.log(`   Role: ${verifyAdmin.role}`);
      console.log(`   System Admin: ${verifyAdmin.isSystemAdmin ? '✅ Yes' : '❌ No'}`);
      console.log(`   Created: ${verifyAdmin.createdAt}`);
      
      if (verifyAdmin.isSystemAdmin && verifyAdmin.role === 'super_admin') {
        console.log('\n🎉 System admin is properly configured and protected from deletion!');
      } else {
        console.log('\n⚠️  System admin may not be properly configured');
      }
    } else {
      console.log('\n❌ Failed to verify system admin creation');
    }
    
  } catch (error) {
    console.error('❌ Error creating system admin:', error);
  } finally {
    await client.close();
  }
}

// Run the script
createSystemAdmin();