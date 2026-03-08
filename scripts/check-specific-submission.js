const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function checkSpecificSubmission() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db(dbName);
    const collection = database.collection('register100_submissions');

    // Get the specific submission
    const submissionId = '69aaf6e2dbb8e1f4385d26bf';
    const submission = await collection.findOne({ _id: new ObjectId(submissionId) });
    
    if (!submission) {
      console.log('❌ Submission not found');
      return;
    }
    
    console.log('📋 Submission found:');
    console.log('School Name:', submission.reg100_schoolName);
    console.log('School ID:', submission.schoolId);
    
    // Check manager image
    console.log('\n🖼️ Manager Image:');
    if (submission.reg100_mgtImage) {
      console.log('Field exists:', submission.reg100_mgtImage);
    } else if (submission.mgtImage) {
      console.log('Alternative field exists:', submission.mgtImage);
    } else {
      console.log('❌ No manager image found');
    }
    
    // Check teacher images
    console.log('\n👥 Teacher Images:');
    if (submission.reg100_thaiMusicTeachers && submission.reg100_thaiMusicTeachers.length > 0) {
      submission.reg100_thaiMusicTeachers.forEach((teacher, index) => {
        console.log(`Teacher ${index + 1}:`);
        console.log(`  Name: ${teacher.teacherFullName || 'N/A'}`);
        if (teacher.teacherImage) {
          console.log(`  Image: ${teacher.teacherImage}`);
        } else {
          console.log(`  Image: ❌ Not found`);
        }
      });
    } else {
      console.log('❌ No teachers found');
    }
    
    // Check all image-related fields
    console.log('\n🔍 All image-related fields:');
    Object.keys(submission).forEach(key => {
      if (key.toLowerCase().includes('image') || key.toLowerCase().includes('img')) {
        console.log(`${key}: ${submission[key]}`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkSpecificSubmission();