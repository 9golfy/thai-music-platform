#!/usr/bin/env node

/**
 * Test MongoDB connection
 */

const { MongoClient } = require('mongodb');

async function testConnection() {
  console.log('🔌 Testing MongoDB connection...');
  
  const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const collections = await db.listCollections().toArray();
    
    console.log('📋 Collections:', collections.map(c => c.name));
    
    // Test draft_submissions collection
    const draftsCollection = db.collection('draft_submissions');
    const count = await draftsCollection.countDocuments();
    
    console.log('📊 Draft submissions count:', count);
    
    await client.close();
    console.log('✅ Connection test completed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}

testConnection();