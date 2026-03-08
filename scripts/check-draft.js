/**
 * Check if a draft exists in MongoDB
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const DRAFT_TOKEN = process.argv[2] || 'bf609466-6616-4e8d-943e-d626d2905a3f';

async function checkDraft() {
  console.log('🔍 Checking draft in MongoDB...\n');
  console.log('Token:', DRAFT_TOKEN);
  console.log('─'.repeat(60));

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();
    const draftsCollection = db.collection('draft_submissions');

    // Find draft
    const draft = await draftsCollection.findOne({
      draftToken: DRAFT_TOKEN.toLowerCase(),
    });

    if (!draft) {
      console.log('❌ Draft not found in database');
      console.log('\nPossible reasons:');
      console.log('1. Draft was never created');
      console.log('2. Draft was deleted');
      console.log('3. Token is incorrect');
      
      // Show all drafts
      const allDrafts = await draftsCollection.find({}).limit(5).toArray();
      console.log(`\n📋 Recent drafts (showing ${allDrafts.length}):`);
      allDrafts.forEach((d, i) => {
        console.log(`\n${i + 1}. Token: ${d.draftToken}`);
        console.log(`   Email: ${d.email}`);
        console.log(`   Type: ${d.submissionType}`);
        console.log(`   Status: ${d.status}`);
        console.log(`   Created: ${d.createdAt}`);
        console.log(`   Expires: ${d.expiresAt}`);
      });
    } else {
      console.log('✅ Draft found!\n');
      console.log('📧 Email:', draft.email);
      console.log('📱 Phone:', draft.phone);
      console.log('📝 Type:', draft.submissionType);
      console.log('📍 Step:', draft.currentStep);
      console.log('📅 Created:', draft.createdAt);
      console.log('📅 Modified:', draft.lastModified);
      console.log('⏰ Expires:', draft.expiresAt);
      console.log('🔒 Status:', draft.status);
      
      // Show formData
      console.log('\n📋 Form Data:');
      console.log(JSON.stringify(draft.formData, null, 2));
      
      // Check if expired
      const now = new Date();
      const expiresAt = new Date(draft.expiresAt);
      const isExpired = expiresAt < now;
      
      console.log('\n⏱️  Expiry Status:', isExpired ? '❌ EXPIRED' : '✅ Valid');
      
      if (!isExpired) {
        const timeLeft = Math.floor((expiresAt - now) / (1000 * 60 * 60));
        console.log(`   Time remaining: ${timeLeft} hours`);
      }
      
      // Check OTP data
      if (draft.otpCode) {
        console.log('\n🔐 OTP Info:');
        console.log('   Code:', draft.otpCode);
        console.log('   Expires:', draft.otpExpiresAt);
        console.log('   Attempts:', draft.otpAttempts || 0);
        console.log('   Request Count:', draft.otpRequestCount || 0);
      }
    }

    console.log('\n' + '─'.repeat(60));
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkDraft();
