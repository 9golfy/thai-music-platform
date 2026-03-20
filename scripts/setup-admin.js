/**
 * Setup Admin Script (JavaScript version)
 * 
 * Creates the root admin user for DCP Admin dashboard
 * Credentials: root@thaimusic.com / admin123
 * 
 * Usage: node scripts/setup-admin.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Use the same connection string format as the app with authentication
const MONGODB_URI = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const DB_NAME = 'thai_music_school';

async function setupAdmin() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('📍 URI:', MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@'));
    
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');

    // Admin credentials
    const adminEmail = 'root@thaimusic.com';
    const adminPassword = 'admin123';
    
    console.log('\n🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log('✅ Password hashed');

    console.log('\n👤 Creating/Updating admin user...');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);

    // Upsert admin user
    const result = await usersCollection.updateOne(
      { email: adminEmail.toLowerCase() },
      {
        $set: {
          email: adminEmail.toLowerCase(),
          password: hashedPassword,
          firstName: 'Super',
          lastName: 'Admin',
          role: 'admin',
          phone: '0800000000',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: null
        }
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log('✅ Admin user created successfully!');
    } else if (result.modifiedCount > 0) {
      console.log('✅ Admin user updated successfully!');
    } else {
      console.log('ℹ️  Admin user already exists with correct credentials');
    }

    // Verify admin exists
    const admin = await usersCollection.findOne({ email: adminEmail.toLowerCase() });
    if (admin) {
      console.log('\n✅ Admin verification successful:');
      console.log(`   ID: ${admin._id}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive}`);
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log(`   URL: http://localhost:3000/dcp-admin`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run setup
setupAdmin().catch(console.error);
