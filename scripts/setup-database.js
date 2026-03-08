// Setup Database Script
// Run: node scripts/setup-database.js

require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Use localhost for running from host machine
const uri = process.env.MONGODB_URI?.replace('mongo:', 'localhost:') || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

console.log('📍 Connecting to:', uri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in log

async function setupDatabase() {
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db(dbName);

    // Create collections
    console.log('\n📦 Creating collections...');
    
    const collections = ['users', 'certificates', 'register100_submissions', 'register_support_submissions', 'draft_submissions'];
    
    for (const collectionName of collections) {
      try {
        await database.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error) {
        if (error.code === 48) {
          console.log(`ℹ️  Collection already exists: ${collectionName}`);
        } else {
          throw error;
        }
      }
    }

    // Create indexes
    console.log('\n🔍 Creating indexes...');
    
    const usersCollection = database.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Created unique index on users.email');

    await usersCollection.createIndex({ role: 1 });
    console.log('✅ Created index on users.role');

    await usersCollection.createIndex({ schoolId: 1 });
    console.log('✅ Created index on users.schoolId');

    const certificatesCollection = database.collection('certificates');
    await certificatesCollection.createIndex({ schoolId: 1 });
    console.log('✅ Created index on certificates.schoolId');

    await certificatesCollection.createIndex({ certificateNumber: 1 }, { unique: true });
    console.log('✅ Created unique index on certificates.certificateNumber');

    // Draft submissions indexes
    const draftsCollection = database.collection('draft_submissions');
    
    await draftsCollection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: 'ttl_expiresAt' }
    );
    console.log('✅ Created TTL index on draft_submissions.expiresAt');

    await draftsCollection.createIndex(
      { draftToken: 1 },
      { unique: true, name: 'unique_draftToken' }
    );
    console.log('✅ Created unique index on draft_submissions.draftToken');

    await draftsCollection.createIndex(
      { email: 1 },
      { name: 'idx_email' }
    );
    console.log('✅ Created index on draft_submissions.email');

    await draftsCollection.createIndex(
      { email: 1, submissionType: 1, status: 1 },
      { name: 'idx_email_type_status' }
    );
    console.log('✅ Created compound index on draft_submissions.email, submissionType, status');

    // Check if root user exists
    console.log('\n👤 Checking for root user...');
    const existingRoot = await usersCollection.findOne({ role: 'root' });

    if (existingRoot) {
      console.log('ℹ️  Root user already exists');
      console.log(`   Email: ${existingRoot.email}`);
    } else {
      // Create root user
      console.log('🔐 Creating root user...');
      const password = 'admin123'; // Change this in production!
      const hashedPassword = await bcrypt.hash(password, 10);

      const rootUser = {
        email: 'root@thaimusic.com',
        password: hashedPassword,
        role: 'root',
        firstName: 'System',
        lastName: 'Administrator',
        phone: '0000000000',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await usersCollection.insertOne(rootUser);
      console.log('✅ Root user created successfully!');
      console.log('\n📧 Root User Credentials:');
      console.log(`   Email: root@thaimusic.com`);
      console.log(`   Password: admin123`);
      console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    }

    // Summary
    console.log('\n📊 Database Summary:');
    const userCount = await usersCollection.countDocuments();
    const certCount = await certificatesCollection.countDocuments();
    const register100Count = await database.collection('register100_submissions').countDocuments();
    const registerSupportCount = await database.collection('register_support_submissions').countDocuments();
    const draftCount = await draftsCollection.countDocuments();

    console.log(`   Users: ${userCount}`);
    console.log(`   Certificates: ${certCount}`);
    console.log(`   Schools (100%): ${register100Count}`);
    console.log(`   Schools (Support): ${registerSupportCount}`);
    console.log(`   Draft Submissions: ${draftCount}`);

    console.log('\n✅ Database setup completed successfully!');
    console.log('\n🚀 You can now start the application:');
    console.log('   npm run dev (development)');
    console.log('   npm run build && npm start (production)');
    console.log('   docker-compose up -d (Docker)');

  } catch (error) {
    console.error('\n❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run setup
setupDatabase();
