/**
 * Test Draft Flow Script
 * 
 * This script tests the complete draft save and restore flow:
 * 1. Check if there's a saved draft in MongoDB
 * 2. Provide instructions for manual testing
 * 3. Verify form restoration works correctly
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function testDraftFlow() {
  console.log('🧪 Testing Draft Save & Restore Flow...\n');
  
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db();
    const collection = db.collection('draft_submissions');
    
    // Find the latest draft
    const latestDraft = await collection.findOne(
      { status: 'active' },
      { sort: { lastModified: -1 } }
    );
    
    if (!latestDraft) {
      console.log('❌ No active drafts found in database');
      console.log('\n📝 To test the draft flow:');
      console.log('1. Go to http://localhost:3000/regist100');
      console.log('2. Fill in some form fields (at least school name)');
      console.log('3. Click "บันทึก Draft" button');
      console.log('4. Enter email: 9golfy@gmail.com and phone: 0899297983');
      console.log('5. Check your email for the OTP and draft link');
      console.log('6. Run this script again after saving a draft\n');
      return;
    }
    
    console.log('✅ Latest draft found!');
    console.log(`📧 Email: ${latestDraft.email}`);
    console.log(`🎫 Token: ${latestDraft.token || latestDraft._id}`);
    console.log(`📝 Type: ${latestDraft.submissionType}`);
    console.log(`📍 Step: ${latestDraft.currentStep}`);
    console.log(`📅 Modified: ${latestDraft.lastModified}`);
    console.log(`🔒 Status: ${latestDraft.status}\n`);
    
    // Show form data summary
    const formData = latestDraft.formData || {};
    const nonEmptyFields = Object.entries(formData)
      .filter(([key, value]) => value && value !== '' && value !== 0 && value !== false)
      .filter(([key, value]) => !Array.isArray(value) || value.length > 0);
    
    console.log('📋 Form Data Summary:');
    if (nonEmptyFields.length === 0) {
      console.log('   (No data saved)');
    } else {
      nonEmptyFields.forEach(([key, value]) => {
        if (Array.isArray(value)) {
          console.log(`   ${key}: [${value.length} items]`);
        } else {
          const displayValue = String(value).length > 50 
            ? String(value).substring(0, 50) + '...' 
            : String(value);
          console.log(`   ${key}: ${displayValue}`);
        }
      });
    }
    
    console.log(`\n📊 Total fields with data: ${nonEmptyFields.length}`);
    
    // Provide test instructions
    console.log('\n🧪 MANUAL TEST INSTRUCTIONS:');
    console.log('─'.repeat(50));
    console.log('1. Open the draft link in a new incognito window:');
    console.log(`   http://localhost:3000/draft/${latestDraft.token || latestDraft._id}`);
    console.log('\n2. The page should show:');
    console.log('   - Email address where OTP was sent');
    console.log('   - Form type and current step');
    console.log('   - OTP input field');
    console.log('\n3. Check your email for the 6-digit OTP code');
    console.log('\n4. Enter the OTP and click "ยืนยัน OTP"');
    console.log('\n5. You should be redirected to the form with:');
    console.log('   - All previously saved data restored');
    console.log('   - Success message showing data was loaded');
    console.log('   - Form fields populated with saved values');
    console.log('\n6. Check browser console for restoration logs:');
    console.log('   - Look for "🔄 Restoring draft data" messages');
    console.log('   - Verify "✅ Final form values" shows correct data');
    console.log('\n7. Verify specific fields are populated:');
    if (formData.schoolName) {
      console.log(`   - School Name should be: "${formData.schoolName}"`);
    }
    if (formData.schoolProvince) {
      console.log(`   - School Province should be: "${formData.schoolProvince}"`);
    }
    if (formData.schoolLevel) {
      console.log(`   - School Level should be: "${formData.schoolLevel}"`);
    }
    if (formData.affiliation) {
      console.log(`   - Affiliation should be: "${formData.affiliation}"`);
    }
    
    console.log('\n✅ EXPECTED RESULTS:');
    console.log('- Form fields should be populated with saved data');
    console.log('- Green success message should appear');
    console.log('- Current step should be restored');
    console.log('- No console errors related to form restoration');
    
    console.log('\n❌ TROUBLESHOOTING:');
    console.log('- If fields are empty: Check browser console for errors');
    console.log('- If OTP fails: Check email spam folder');
    console.log('- If redirect fails: Verify form paths are correct');
    console.log('- If data is wrong: Check MongoDB data integrity');
    
  } catch (error) {
    console.error('❌ Error testing draft flow:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the test
testDraftFlow().catch(console.error);