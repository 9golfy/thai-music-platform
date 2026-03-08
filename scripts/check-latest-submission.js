const { MongoClient } = require('mongodb');

async function checkLatestSubmission() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/thai_music_school');
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const collection = db.collection('register_support_submissions');
    
    // Find the latest submission
    const latestSubmission = await collection.findOne(
      {},
      { sort: { createdAt: -1 } }
    );
    
    if (latestSubmission) {
      console.log('✅ Latest submission found:');
      console.log('🆔 ID:', latestSubmission._id);
      console.log('🏫 School ID:', latestSubmission.schoolId);
      console.log('🏫 School Name:', latestSubmission.schoolName);
      console.log('📧 Manager Email:', latestSubmission.mgtEmail);
      console.log('📱 Manager Phone:', latestSubmission.mgtPhone);
      console.log('👥 Teachers Count:', latestSubmission.thaiMusicTeachers?.length || 0);
      console.log('📅 Created At:', latestSubmission.createdAt);
      console.log('📊 Status:', latestSubmission.status);
      
      // Check if it has all required fields
      const requiredFields = [
        'schoolName', 'mgtEmail', 'mgtPhone', 'thaiMusicTeachers',
        'schoolProvince', 'supportType'
      ];
      
      const missingFields = requiredFields.filter(field => !latestSubmission[field]);
      
      if (missingFields.length === 0) {
        console.log('✅ All required fields are present');
      } else {
        console.log('⚠️ Missing fields:', missingFields);
      }
      
    } else {
      console.log('❌ No submissions found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Connection closed');
  }
}

checkLatestSubmission();