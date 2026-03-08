#!/usr/bin/env node

/**
 * Clear all rate limits
 */

const { MongoClient } = require('mongodb');

async function clearRateLimits() {
  console.log('🔄 Clearing all rate limits...');
  
  const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📋 Collections:', collections.map(c => c.name));
    
    // Look for rate limit collections
    const rateLimitCollections = collections.filter(c => 
      c.name.includes('rate') || c.name.includes('limit')
    );
    
    if (rateLimitCollections.length > 0) {
      console.log('🎯 Found rate limit collections:', rateLimitCollections.map(c => c.name));
      
      for (const collection of rateLimitCollections) {
        const result = await db.collection(collection.name).deleteMany({});
        console.log(`✅ Cleared ${collection.name}:`, result.deletedCount, 'documents');
      }
    } else {
      console.log('❌ No rate limit collections found');
    }
    
    // Also check if rate limits are stored in draft_submissions
    const draftsCollection = db.collection('draft_submissions');
    
    // Clear all OTP-related rate limit fields
    const updateResult = await draftsCollection.updateMany(
      {},
      {
        $unset: {
          lastOtpRequestAt: 1,
          otpRequestCount: 1,
          otpAttempts: 1
        }
      }
    );
    
    console.log('✅ Cleared OTP rate limits from drafts:', updateResult.modifiedCount, 'documents');
    
    await client.close();
    console.log('✅ All rate limits cleared!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

clearRateLimits();