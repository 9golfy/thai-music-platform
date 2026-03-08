#!/usr/bin/env node

/**
 * Clear rate limit for specific email
 */

const { MongoClient } = require('mongodb');

async function clearEmailRateLimit() {
  const email = '9golfy@gmail.com';
  console.log('🔄 Clearing rate limit for email:', email);
  
  const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const draftsCollection = db.collection('draft_submissions');
    
    // Find all drafts for this email
    const drafts = await draftsCollection.find({ email }).toArray();
    console.log('📋 Found drafts for email:', drafts.length);
    
    // Clear rate limit fields for this email
    const result = await draftsCollection.updateMany(
      { email },
      {
        $unset: {
          lastOtpRequestAt: 1,
          otpRequestCount: 1,
          otpAttempts: 1,
          lastSaveAt: 1
        }
      }
    );
    
    console.log('✅ Cleared rate limit fields:', result.modifiedCount, 'documents');
    
    // Verify the update
    const updatedDrafts = await draftsCollection.find({ email }).toArray();
    updatedDrafts.forEach((draft, i) => {
      console.log(`📊 Draft ${i + 1}:`, {
        token: draft.draftToken.substring(0, 8) + '...',
        hasLastOtpRequest: !!draft.lastOtpRequestAt,
        hasOtpRequestCount: !!draft.otpRequestCount,
        hasLastSaveAt: !!draft.lastSaveAt
      });
    });
    
    await client.close();
    console.log('✅ Rate limit cleared for email:', email);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

clearEmailRateLimit();