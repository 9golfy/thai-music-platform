#!/usr/bin/env node

/**
 * Test MongoDB Connections Script
 * 
 * This script tests different MongoDB connection strings to find the working one
 */

const { MongoClient } = require('mongodb');

console.log('🔍 Testing MongoDB Connection Strings');
console.log('=====================================');

// Different connection strings to test
const connectionStrings = [
  {
    name: 'No Auth - mongodb container',
    uri: 'mongodb://mongodb:27017/thai_music_school'
  },
  {
    name: 'No Auth - thai-music-mongo container',
    uri: 'mongodb://thai-music-mongo:27017/thai_music_school'
  },
  {
    name: 'With Auth - mongodb container',
    uri: 'mongodb://root:rootpass@mongodb:27017/thai_music_school?authSource=admin'
  },
  {
    name: 'With Auth - thai-music-mongo container',
    uri: 'mongodb://root:rootpass@thai-music-mongo:27017/thai_music_school?authSource=admin'
  },
  {
    name: 'Default database - mongodb',
    uri: 'mongodb://mongodb:27017/test'
  },
  {
    name: 'Default database - thai-music-mongo',
    uri: 'mongodb://thai-music-mongo:27017/test'
  }
];

// Test each connection string
async function testConnection(config) {
  console.log(`\n🔗 Testing: ${config.name}`);
  console.log(`📡 URI: ${config.uri}`);
  
  const client = new MongoClient(config.uri);
  
  try {
    await client.connect();
    console.log('✅ Connection successful!');
    
    // Get database name from URI
    const dbName = config.uri.split('/').pop().split('?')[0];
    const database = client.db(dbName);
    
    // List collections
    const collections = await database.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    // Test specific collections
    if (collections.some(c => c.name === 'register100_submissions')) {
      const register100Collection = database.collection('register100_submissions');
      const count = await register100Collection.countDocuments();
      console.log(`📊 register100_submissions count: ${count}`);
    }
    
    if (collections.some(c => c.name === 'register_support_submissions')) {
      const registerSupportCollection = database.collection('register_support_submissions');
      const count = await registerSupportCollection.countDocuments();
      console.log(`📊 register_support_submissions count: ${count}`);
    }
    
    await client.close();
    return { success: true, config };
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    await client.close().catch(() => {});
    return { success: false, config, error: error.message };
  }
}

// Test API with different connection strings
async function testAPIWithConnection(connectionString) {
  console.log(`\n🧪 Testing API with connection: ${connectionString}`);
  
  // This would require modifying the API temporarily, so we'll just note it
  console.log('💡 To test this connection in API:');
  console.log(`   Update MONGODB_URI in docker-compose.prod.yml to: ${connectionString}`);
  console.log('   Then restart containers');
}

// Main function
async function main() {
  console.log('🎯 Testing different MongoDB connection strings...');
  
  const results = [];
  
  for (const config of connectionStrings) {
    const result = await testConnection(config);
    results.push(result);
  }
  
  console.log('\n📋 Summary of Results:');
  console.log('======================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    console.log('\n✅ Working connections:');
    successful.forEach(r => {
      console.log(`   - ${r.config.name}: ${r.config.uri}`);
    });
    
    console.log('\n🔧 Recommended action:');
    console.log('   Update docker-compose.prod.yml MONGODB_URI to one of the working connections above');
    
  } else {
    console.log('\n❌ No working connections found!');
    console.log('🔧 This suggests:');
    console.log('   1. MongoDB container is not running');
    console.log('   2. Network connectivity issues');
    console.log('   3. Database/collection names are different');
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed connections:');
    failed.forEach(r => {
      console.log(`   - ${r.config.name}: ${r.error}`);
    });
  }
  
  console.log('\n✨ Connection testing completed!');
}

// Note: This script needs to run from within the production environment
// to test the actual container network connections
console.log('⚠️  Note: This script should be run from within the production environment');
console.log('   to test actual container network connections.');
console.log('   Running from local machine will test local connections only.');

main().catch(console.error);