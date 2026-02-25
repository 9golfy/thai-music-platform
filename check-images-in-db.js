const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = 'mongodb://mongodb:27017';
const DB_NAME = 'thai_music_school';

async function checkImages() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Check register-support (get latest)
    console.log('\n=== REGISTER-SUPPORT SUBMISSIONS ===');
    const supportCollection = db.collection('register_support_submissions');
    const supportSubmission = await supportCollection.findOne(
      {},
      { sort: { createdAt: -1 } }
    );
    
    if (supportSubmission) {
      console.log('\nSchool:', supportSubmission.schoolName);
      console.log('ID:', supportSubmission._id.toString());
      
      console.log('\nManagement Image (mgtImage):');
      if (supportSubmission.mgtImage) {
        console.log('  - Exists: YES');
        console.log('  - Type:', typeof supportSubmission.mgtImage);
        console.log('  - Length:', supportSubmission.mgtImage.length);
        console.log('  - First 100 chars:', supportSubmission.mgtImage.substring(0, 100));
        console.log('  - Is data URL:', supportSubmission.mgtImage.startsWith('data:image/'));
        console.log('  - Is /api/uploads:', supportSubmission.mgtImage.startsWith('/api/uploads/'));
      } else {
        console.log('  - Exists: NO');
      }
      
      console.log('\nTeacher Images:');
      if (supportSubmission.thaiMusicTeachers && supportSubmission.thaiMusicTeachers.length > 0) {
        supportSubmission.thaiMusicTeachers.forEach((teacher, index) => {
          console.log(`\n  Teacher ${index + 1}: ${teacher.teacherFullName}`);
          if (teacher.teacherImage) {
            console.log('    - Image exists: YES');
            console.log('    - Type:', typeof teacher.teacherImage);
            console.log('    - Length:', teacher.teacherImage.length);
            console.log('    - First 100 chars:', teacher.teacherImage.substring(0, 100));
            console.log('    - Is data URL:', teacher.teacherImage.startsWith('data:image/'));
            console.log('    - Is /api/uploads:', teacher.teacherImage.startsWith('/api/uploads/'));
          } else {
            console.log('    - Image exists: NO');
          }
        });
      } else {
        console.log('  - No teachers found');
      }
    } else {
      console.log('Submission not found');
    }
    
    // Check register100 for comparison
    console.log('\n\n=== REGISTER100 SUBMISSIONS (for comparison) ===');
    const register100Collection = db.collection('register100_submissions');
    const register100Submission = await register100Collection.findOne(
      { _id: new ObjectId('699dc7475c828c3034fe2b0a') }
    );
    
    if (register100Submission) {
      console.log('\nSchool:', register100Submission.schoolName);
      console.log('ID:', register100Submission._id.toString());
      
      console.log('\nManagement Image (mgtImage):');
      if (register100Submission.mgtImage) {
        console.log('  - Exists: YES');
        console.log('  - Type:', typeof register100Submission.mgtImage);
        console.log('  - Length:', register100Submission.mgtImage.length);
        console.log('  - First 100 chars:', register100Submission.mgtImage.substring(0, 100));
        console.log('  - Is data URL:', register100Submission.mgtImage.startsWith('data:image/'));
        console.log('  - Is /api/uploads:', register100Submission.mgtImage.startsWith('/api/uploads/'));
      } else {
        console.log('  - Exists: NO');
      }
      
      console.log('\nTeacher Images:');
      if (register100Submission.thaiMusicTeachers && register100Submission.thaiMusicTeachers.length > 0) {
        register100Submission.thaiMusicTeachers.forEach((teacher, index) => {
          console.log(`\n  Teacher ${index + 1}: ${teacher.teacherFullName}`);
          if (teacher.teacherImage) {
            console.log('    - Image exists: YES');
            console.log('    - Type:', typeof teacher.teacherImage);
            console.log('    - Length:', teacher.teacherImage.length);
            console.log('    - First 100 chars:', teacher.teacherImage.substring(0, 100));
            console.log('    - Is data URL:', teacher.teacherImage.startsWith('data:image/'));
            console.log('    - Is /api/uploads:', teacher.teacherImage.startsWith('/api/uploads/'));
          } else {
            console.log('    - Image exists: NO');
          }
        });
      } else {
        console.log('  - No teachers found');
      }
    } else {
      console.log('Submission not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkImages();
