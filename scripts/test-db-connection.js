// Test MongoDB Connection
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function testConnection() {
  console.log('🔍 Testing MongoDB Connection...\n');
  
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB || 'thai-music-platform';
  
  console.log('📋 Configuration:');
  console.log('  URI:', uri ? uri.replace(/\/\/.*@/, '//<credentials>@') : 'NOT SET');
  console.log('  Database:', dbName);
  console.log('');
  
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env.local');
    process.exit(1);
  }
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    
    console.log('✅ Connected successfully!\n');
    
    // Test database access
    console.log('📊 Testing database access...');
    const collections = await db.listCollections().toArray();
    console.log('  Collections found:', collections.length);
    collections.forEach(col => console.log('    -', col.name));
    console.log('');
    
    // Check users collection
    console.log('👥 Checking users collection...');
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log('  Total users:', userCount);
    
    // Find admin users
    const adminUsers = await usersCollection.find({ 
      role: { $in: ['admin', 'root'] } 
    }).toArray();
    
    console.log('  Admin users found:', adminUsers.length);
    adminUsers.forEach(user => {
      console.log('    -', user.email, '(role:', user.role + ', active:', user.isActive + ')');
    });
    
    await client.close();
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error('  Error:', error.message);
    if (error.stack) {
      console.error('\n  Stack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

testConnection();
