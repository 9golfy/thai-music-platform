const { MongoClient } = require('mongodb');

async function testFieldSeparation() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/thai-music-platform');
  
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('draft_submissions');
    
    console.log('🔍 Testing field separation in register-support drafts...\n');
    
    // Find recent register-support drafts
    const drafts = await collection.find({
      submissionType: 'register-support'
    }).sort({ createdAt: -1 }).limit(5).toArray();
    
    if (drafts.length === 0) {
      console.log('❌ No register-support drafts found');
      return;
    }
    
    drafts.forEach((draft, index) => {
      console.log(`📋 Draft ${index + 1}:`);
      console.log(`   Token: ${draft.token}`);
      console.log(`   Email: ${draft.email}`);
      console.log(`   Created: ${draft.createdAt}`);
      console.log(`   Support Type: ${draft.formData?.supportType || 'N/A'}`);
      console.log(`   Support Type Name: "${draft.formData?.supportTypeName || 'N/A'}"`);
      console.log(`   School Name: "${draft.formData?.schoolName || 'N/A'}"`);
      console.log(`   ---`);
      
      // Check for field confusion
      if (draft.formData?.supportTypeName === draft.formData?.schoolName) {
        console.log(`   ⚠️  POTENTIAL ISSUE: supportTypeName matches schoolName`);
      }
      
      if (draft.formData?.supportType === 'สถานศึกษา' && 
          draft.formData?.supportTypeName && 
          draft.formData?.schoolName &&
          draft.formData?.supportTypeName !== draft.formData?.schoolName) {
        console.log(`   ✅ GOOD: Fields are properly separated`);
      }
      
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

testFieldSeparation();