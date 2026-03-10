#!/usr/bin/env node

/**
 * Check Specific Image Record
 * 
 * This script checks the database record for the specific submission
 * to see what image path is stored
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://18.138.63.84:27017/thai_music_school';
const SUBMISSION_ID = '69b02bfe9436e8186f6e41a8';

async function checkImageRecord() {
  console.log('🔍 Checking specific image record...\n');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const collection = db.collection('register100');
    
    // Find the specific submission
    const submission = await collection.findOne({ _id: SUBMISSION_ID });
    
    if (!submission) {
      console.log('❌ Submission not found');
      return;
    }
    
    console.log('📋 Submission found:');
    console.log('School Name:', submission.reg100_schoolName || submission.schoolName);
    console.log('Manager Image Path:', submission.reg100_mgtImage || submission.mgtImage);
    
    // Check if the path starts with /uploads/
    const imagePath = submission.reg100_mgtImage || submission.mgtImage;
    if (imagePath) {
      console.log('\n🔍 Image Path Analysis:');
      console.log('Original path:', imagePath);
      console.log('Starts with /uploads/:', imagePath.startsWith('/uploads/'));
      console.log('Expected API path:', imagePath.startsWith('/uploads/') ? imagePath.replace('/uploads/', '/api/uploads/') : imagePath);
      
      // Test the actual API endpoint
      console.log('\n🧪 Testing API endpoint...');
      const testUrl = `http://18.138.63.84:3000${imagePath.startsWith('/uploads/') ? imagePath.replace('/uploads/', '/api/uploads/') : imagePath}`;
      console.log('Test URL:', testUrl);
    } else {
      console.log('❌ No image path found in record');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkImageRecord();