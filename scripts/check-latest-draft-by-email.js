#!/usr/bin/env node

/**
 * Check latest draft by email
 */

const { MongoClient } = require('mongodb');

async function checkLatestDraft() {
  const email = '9golfy@gmail.com';
  console.log('🔍 Checking latest drafts for email:', email);
  
  const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const draftsCollection = db.collection('draft_submissions');
    
    // Find all drafts for this email, sorted by last modified (newest first)
    const drafts = await draftsCollection
      .find({ email })
      .sort({ lastModified: -1 })
      .toArray();
    
    console.log('📋 Found drafts for email:', drafts.length);
    
    drafts.forEach((draft, i) => {
      console.log(`\n📊 Draft ${i + 1} (${i === 0 ? 'LATEST' : 'OLDER'}):`);
      console.log('=====================================');
      console.log('🎫 Token:', draft.draftToken);
      console.log('📧 Email:', draft.email);
      console.log('📋 Submission Type:', draft.submissionType);
      console.log('📍 Current Step:', draft.currentStep);
      console.log('📅 Created At:', draft.createdAt);
      console.log('📅 Last Modified:', draft.lastModified);
      console.log('🔄 Status:', draft.status);
      console.log('💾 Save Count:', draft.saveCount);
      
      if (draft.formData) {
        console.log('\n📊 Form Data:');
        console.log('🏫 School Name:', `"${draft.formData.schoolName}"`);
        console.log('📍 School Province:', `"${draft.formData.schoolProvince}"`);
        console.log('🎓 School Level:', `"${draft.formData.schoolLevel}"`);
        console.log('🏢 Support Type:', `"${draft.formData.supportType}"`);
        console.log('📝 Support Type Name:', `"${draft.formData.supportTypeName}"`);
        
        // Show all non-empty string fields
        const nonEmptyFields = {};
        Object.entries(draft.formData).forEach(([key, value]) => {
          if (typeof value === 'string' && value.trim() !== '') {
            nonEmptyFields[key] = value;
          }
        });
        
        console.log('\n🔑 Non-empty string fields:');
        console.log(nonEmptyFields);
        
        // Show form data size
        const formDataStr = JSON.stringify(draft.formData);
        console.log('\n📏 Form Data Size:', formDataStr.length, 'characters');
      }
    });
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkLatestDraft();