#!/usr/bin/env node

/**
 * Check new token data
 */

const { MongoClient } = require('mongodb');

async function checkNewToken() {
  const token = '2434dcd5-e303-4c4a-b333-07aebe2b6380';
  console.log('🔍 Checking new token:', token);
  
  const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const draftsCollection = db.collection('draft_submissions');
    
    // Get draft data
    const draft = await draftsCollection.findOne({ draftToken: token });
    
    if (!draft) {
      console.log('❌ Draft not found');
      return;
    }
    
    console.log('\n📊 Draft Data Analysis:');
    console.log('=====================================');
    console.log('📧 Email:', draft.email);
    console.log('📋 Submission Type:', draft.submissionType);
    console.log('📍 Current Step:', draft.currentStep);
    console.log('🔄 Status:', draft.status);
    
    if (draft.formData) {
      console.log('\n🎯 Critical Fields:');
      console.log('=====================================');
      console.log('supportType:', `"${draft.formData.supportType}"`);
      console.log('supportTypeName:', `"${draft.formData.supportTypeName}"`);
      console.log('schoolName:', `"${draft.formData.schoolName}"`);
      console.log('schoolProvince:', `"${draft.formData.schoolProvince}"`);
      console.log('schoolLevel:', `"${draft.formData.schoolLevel}"`);
      
      // Show all non-empty fields
      console.log('\n🔑 All Non-empty Fields:');
      console.log('=====================================');
      Object.entries(draft.formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== false && value !== 0) {
          console.log(`  ${key}: "${value}"`);
        }
      });
      
      console.log('\n🎯 Problem Analysis:');
      console.log('=====================================');
      
      // Check what's happening with the data
      if (draft.formData.supportType === 'สถานศึกษา') {
        console.log('✅ supportType is "สถานศึกษา"');
        
        if (draft.formData.supportTypeName && draft.formData.supportTypeName.trim() !== '') {
          console.log('✅ supportTypeName has value:', draft.formData.supportTypeName);
          console.log('   This should appear in "ระบุชื่อสถานศึกษา" field');
        } else {
          console.log('❌ supportTypeName is empty');
          console.log('   This is why "ระบุชื่อสถานศึกษา" field is empty');
        }
        
        if (draft.formData.schoolName && draft.formData.schoolName.trim() !== '') {
          console.log('✅ schoolName has value:', draft.formData.schoolName);
          console.log('   This should appear in "ชื่อสถานศึกษา" field');
        } else {
          console.log('❌ schoolName is empty');
        }
      }
    }
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkNewToken();