const { MongoClient } = require('mongodb');

async function checkLatestDrafts() {
  const client = new MongoClient('mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin');
  
  try {
    await client.connect();
    const db = client.db('thai_music_school');
    const draftsCollection = db.collection('draft_submissions');
    
    console.log('🔍 Checking latest draft submissions...\n');
    
    // Get latest drafts
    const latestDrafts = await draftsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    if (latestDrafts.length === 0) {
      console.log('❌ No draft submissions found');
      return;
    }
    
    console.log(`📊 Found ${latestDrafts.length} recent draft(s):\n`);
    
    latestDrafts.forEach((draft, index) => {
      console.log(`${index + 1}. Draft ID: ${draft._id}`);
      console.log(`   📧 Email: ${draft.email}`);
      console.log(`   📱 Phone: ${draft.phone}`);
      console.log(`   📝 Type: ${draft.submissionType}`);
      console.log(`   📍 Step: ${draft.currentStep}`);
      console.log(`   🔗 Token: ${draft.draftToken || draft.token}`);
      console.log(`   ⏰ Created: ${draft.createdAt?.toLocaleString('th-TH') || 'Unknown'}`);
      console.log(`   📤 Status: ${draft.status}`);
      
      // Show draft link that would be in email
      const token = draft.draftToken || draft.token;
      if (token) {
        console.log(`   🌐 Draft Link: http://localhost:3000/draft/${token}`);
      }
      
      console.log('');
    });
    
    // Check if any have recent OTP requests
    const recentOtpDrafts = latestDrafts.filter(draft => 
      draft.lastOtpRequestAt && 
      (Date.now() - new Date(draft.lastOtpRequestAt).getTime()) < 30 * 60 * 1000 // 30 minutes
    );
    
    if (recentOtpDrafts.length > 0) {
      console.log('🔐 Recent OTP requests (last 30 minutes):');
      recentOtpDrafts.forEach(draft => {
        console.log(`   📧 ${draft.email} - ${new Date(draft.lastOtpRequestAt).toLocaleString('th-TH')}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking drafts:', error);
  } finally {
    await client.close();
  }
}

checkLatestDrafts();