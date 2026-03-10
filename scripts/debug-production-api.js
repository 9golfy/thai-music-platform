#!/usr/bin/env node

/**
 * Debug Production API Script
 * 
 * This script helps debug API issues in production environment
 */

const { MongoClient } = require('mongodb');

console.log('🔍 Production API Debug');
console.log('======================');

// Test MongoDB connection
async function testMongoConnection() {
  console.log('\n📡 Testing MongoDB Connection...');
  
  // Try different connection strings
  const connectionStrings = [
    'mongodb://root:rootpass@thai-music-mongo:27017/thai_music_school?authSource=admin',
    'mongodb://root:rootpass@mongodb:27017/thai_music_school?authSource=admin',
    'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin',
    'mongodb://thai-music-mongo:27017/thai_music_school',
    'mongodb://mongodb:27017/thai_music_school'
  ];

  for (const uri of connectionStrings) {
    console.log(`\n🔗 Testing: ${uri}`);
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      console.log('✅ Connection successful!');
      
      // Test database access
      const database = client.db('thai_music_school');
      const collections = await database.listCollections().toArray();
      console.log('📁 Available collections:', collections.map(c => c.name));
      
      // Test register100_submissions collection
      const register100Collection = database.collection('register100_submissions');
      const count = await register100Collection.countDocuments();
      console.log(`📊 register100_submissions count: ${count}`);
      
      if (count > 0) {
        const sample = await register100Collection.findOne();
        console.log('📄 Sample document keys:', Object.keys(sample || {}));
      }
      
      await client.close();
      console.log('✅ This connection string works!');
      return uri;
      
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
      await client.close().catch(() => {});
    }
  }
  
  return null;
}

// Test API endpoint
async function testAPIEndpoint() {
  console.log('\n🌐 Testing API Endpoint...');
  
  try {
    const response = await fetch('http://localhost:3000/api/register100/list');
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response successful');
      console.log('📊 Data structure:', {
        success: data.success,
        count: data.count,
        submissionsLength: data.submissions?.length || 0
      });
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
    }
    
  } catch (error) {
    console.log('❌ API Request failed:', error.message);
  }
}

// Check environment variables
function checkEnvironmentVariables() {
  console.log('\n🔧 Environment Variables Check...');
  
  const envVars = [
    'MONGODB_URI',
    'MONGO_DB',
    'NODE_ENV'
  ];
  
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value}`);
    } else {
      console.log(`❌ ${varName}: Not set`);
    }
  });
}

// Main execution
async function main() {
  checkEnvironmentVariables();
  
  const workingConnection = await testMongoConnection();
  
  if (workingConnection) {
    console.log(`\n🎯 Recommended connection string: ${workingConnection}`);
  } else {
    console.log('\n❌ No working MongoDB connection found!');
  }
  
  await testAPIEndpoint();
  
  console.log('\n✨ Debug completed!');
}

main().catch(console.error);