const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function checkImagePaths() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db(dbName);
    const collection = database.collection('register100_submissions');

    // Get documents with images
    const documents = await collection.find({
      $or: [
        { reg100_mgtImage: { $exists: true, $ne: null } },
        { 'reg100_thaiMusicTeachers.teacherImage': { $exists: true, $ne: null } }
      ]
    }).limit(3).toArray();
    
    console.log(`📊 Found ${documents.length} documents with images`);
    
    documents.forEach((doc, index) => {
      console.log(`\n📋 Document ${index + 1}:`);
      console.log('School:', doc.reg100_schoolName);
      
      if (doc.reg100_mgtImage) {
        console.log('Manager Image:', doc.reg100_mgtImage);
      }
      
      if (doc.reg100_thaiMusicTeachers && doc.reg100_thaiMusicTeachers.length > 0) {
        doc.reg100_thaiMusicTeachers.forEach((teacher, teacherIndex) => {
          if (teacher.teacherImage) {
            console.log(`Teacher ${teacherIndex + 1} Image:`, teacher.teacherImage);
          }
        });
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkImagePaths();