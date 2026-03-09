const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function findLatestRegisterSupport() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');

    console.log('=== หา Register Support Submission ล่าสุด ===');
    
    const submissions = await collection.find({}).sort({ createdAt: -1 }).limit(3).toArray();
    
    submissions.forEach((submission, index) => {
      console.log(`\n--- Submission ${index + 1} ---`);
      console.log(`ID: ${submission._id}`);
      console.log(`School ID: ${submission.schoolId}`);
      console.log(`ชื่อโรงเรียน: ${submission.regsup_schoolName}`);
      console.log(`อีเมลครู: ${submission.regsup_mgtEmail}`);
      console.log(`เบอร์โทรครู: ${submission.regsup_mgtPhone}`);
      console.log(`วันที่สร้าง: ${submission.createdAt}`);
      console.log(`คะแนนรวม: ${submission.totalScore || 'ยังไม่คำนวณ'}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

findLatestRegisterSupport();