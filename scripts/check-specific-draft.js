#!/usr/bin/env node

/**
 * Check specific draft in database
 */

const { MongoClient } = require('mongodb');

async function checkDraft() {
  const token = '4023290d-1df5-4141-b341-68fe112d782f';
  console.log('🔍 Checking draft token:', token);
  
  const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const draftsCollection = db.collection('draft_submissions');
    
    // Find draft by token
    const draft = await draftsCollection.findOne({ draftToken: token });
    
    if (draft) {
      console.log('✅ Draft found in database:');
      console.log('=====================================');
      console.log('📧 Email:', draft.email);
      console.log('📱 Phone:', draft.phone);
      console.log('📋 Submission Type:', draft.submissionType);
      console.log('📍 Current Step:', draft.currentStep);
      console.log('📅 Created At:', draft.createdAt);
      console.log('📅 Last Modified:', draft.lastModified);
      console.log('📅 Expires At:', draft.expiresAt);
      console.log('🔄 Status:', draft.status);
      console.log('💾 Save Count:', draft.saveCount);
      
      if (draft.formData) {
        console.log('\n📊 Form Data:');
        console.log('=====================================');
        console.log('🏫 School Name:', draft.formData.schoolName);
        console.log('📍 School Province:', draft.formData.schoolProvince);
        console.log('🎓 School Level:', draft.formData.schoolLevel);
        console.log('👨‍💼 Manager Name:', draft.formData.mgtFullName);
        console.log('💼 Manager Position:', draft.formData.mgtPosition);
        console.log('📧 Manager Email:', draft.formData.mgtEmail);
        console.log('📱 Manager Phone:', draft.formData.mgtPhone);
        
        if (draft.formData.thaiMusicTeachers && draft.formData.thaiMusicTeachers.length > 0) {
          console.log('\n👨‍🏫 Thai Music Teachers:');
          draft.formData.thaiMusicTeachers.forEach((teacher, index) => {
            console.log(`   ${index + 1}. ${teacher.fullName} (${teacher.position})`);
            console.log(`      📧 ${teacher.email}, 📱 ${teacher.phone}`);
          });
        }
        
        // Show all form data keys
        console.log('\n🔑 All Form Data Keys:');
        console.log(Object.keys(draft.formData).sort());
        
        // Show form data size
        const formDataStr = JSON.stringify(draft.formData);
        console.log('\n📏 Form Data Size:', formDataStr.length, 'characters');
        
      } else {
        console.log('❌ No form data found');
      }
      
      // Check OTP info
      if (draft.otp) {
        console.log('\n🔐 OTP Info:');
        console.log('=====================================');
        console.log('🔒 OTP Hash:', draft.otp.substring(0, 20) + '...');
        console.log('⏰ OTP Expires At:', draft.otpExpiresAt);
        console.log('🔢 OTP Attempts:', draft.otpAttempts || 0);
        console.log('📊 OTP Request Count:', draft.otpRequestCount || 0);
      }
      
    } else {
      console.log('❌ Draft not found in database');
      
      // Search for similar tokens
      console.log('\n🔍 Searching for similar tokens...');
      const similarDrafts = await draftsCollection.find({
        draftToken: { $regex: token.substring(0, 8), $options: 'i' }
      }).limit(5).toArray();
      
      if (similarDrafts.length > 0) {
        console.log('📋 Similar drafts found:');
        similarDrafts.forEach((d, i) => {
          console.log(`   ${i + 1}. ${d.draftToken} (${d.email}, ${d.submissionType})`);
        });
      }
    }
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDraft();