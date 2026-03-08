/**
 * Check the latest draft in MongoDB
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function checkLatestDraft() {
  console.log('🔍 Checking latest draft in MongoDB...\n');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();
    const draftsCollection = db.collection('draft_submissions');

    // Find the most recent draft
    const latestDraft = await draftsCollection.findOne(
      {},
      { sort: { lastModified: -1 } }
    );

    if (!latestDraft) {
      console.log('❌ No drafts found in database');
      return;
    }

    console.log('✅ Latest draft found!');
    console.log('📧 Email:', latestDraft.email);
    console.log('🎫 Token:', latestDraft.draftToken);
    console.log('📝 Type:', latestDraft.submissionType);
    console.log('📍 Step:', latestDraft.currentStep);
    console.log('📅 Modified:', latestDraft.lastModified);
    console.log('🔒 Status:', latestDraft.status);

    console.log('\n📋 Form Data:');
    if (latestDraft.formData) {
      console.log('   School Name:', latestDraft.formData.schoolName || '(empty)');
      console.log('   School Province:', latestDraft.formData.schoolProvince || '(empty)');
      console.log('   School Level:', latestDraft.formData.schoolLevel || '(empty)');
      console.log('   Affiliation:', latestDraft.formData.affiliation || '(empty)');
      
      // Count non-empty fields
      const nonEmptyFields = Object.keys(latestDraft.formData).filter(key => {
        const value = latestDraft.formData[key];
        return value !== '' && value !== null && value !== undefined && 
               !(Array.isArray(value) && value.length === 0) &&
               value !== false && value !== 0;
      });
      
      console.log('\n📊 Non-empty fields:', nonEmptyFields.length);
      if (nonEmptyFields.length > 0) {
        console.log('   Fields:', nonEmptyFields.slice(0, 10).join(', '));
        if (nonEmptyFields.length > 10) {
          console.log('   ... and', nonEmptyFields.length - 10, 'more');
        }
      }
    } else {
      console.log('   No form data found');
    }

    console.log('\n🔗 Test URL:');
    console.log(`   http://localhost:3000/draft/${latestDraft.draftToken}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkLatestDraft();