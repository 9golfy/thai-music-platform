const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thai_music_school';

async function checkTeacherImages() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const collection = db.collection('register_support_submissions');
    
    // Find the specific submission
    const submissionId = '69ad7476fcaa2809454bab85';
    const { ObjectId } = require('mongodb');
    
    const submission = await collection.findOne({ _id: new ObjectId(submissionId) });
    
    if (!submission) {
      console.log('❌ Submission not found with ID:', submissionId);
      return;
    }
    
    console.log('✅ Found submission:');
    console.log('- School Name:', submission.regsup_schoolName);
    console.log('- School ID:', submission.schoolId);
    console.log('- Created At:', submission.createdAt);
    console.log('- Teachers Count:', submission.regsup_thaiMusicTeachers?.length || 0);
    
    // Check manager image
    console.log('\n📸 Manager Image:');
    if (submission.mgtImage) {
      console.log('- Path:', submission.mgtImage);
      const fullPath = path.join(process.cwd(), 'public', submission.mgtImage);
      const exists = fs.existsSync(fullPath);
      console.log('- File exists:', exists ? '✅' : '❌');
      if (exists) {
        const stats = fs.statSync(fullPath);
        console.log('- File size:', Math.round(stats.size / 1024), 'KB');
      }
    } else {
      console.log('- No manager image path found ❌');
    }
    
    // Check teacher images
    console.log('\n👨‍🏫 Teacher Images:');
    if (submission.regsup_thaiMusicTeachers && Array.isArray(submission.regsup_thaiMusicTeachers)) {
      submission.regsup_thaiMusicTeachers.forEach((teacher, index) => {
        console.log(`\n  Teacher ${index + 1}: ${teacher.teacherFullName}`);
        if (teacher.teacherImage) {
          console.log('  - Image Path:', teacher.teacherImage);
          const fullPath = path.join(process.cwd(), 'public', teacher.teacherImage);
          const exists = fs.existsSync(fullPath);
          console.log('  - File exists:', exists ? '✅' : '❌');
          if (exists) {
            const stats = fs.statSync(fullPath);
            console.log('  - File size:', Math.round(stats.size / 1024), 'KB');
          }
        } else {
          console.log('  - No image path found ❌');
        }
      });
    } else {
      console.log('- No teachers data found');
    }
    
    // Check uploads directory
    console.log('\n📁 Uploads Directory Check:');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const teacherFiles = files.filter(f => f.includes('teacher_support_'));
      const mgtFiles = files.filter(f => f.includes('mgt_support_'));
      
      console.log('- Total files in uploads:', files.length);
      console.log('- Teacher image files:', teacherFiles.length);
      console.log('- Manager image files:', mgtFiles.length);
      
      if (teacherFiles.length > 0) {
        console.log('\n📋 Recent teacher image files:');
        teacherFiles.slice(-10).forEach(file => {
          const filePath = path.join(uploadsDir, file);
          const stats = fs.statSync(filePath);
          console.log(`  - ${file} (${Math.round(stats.size / 1024)} KB, ${stats.mtime.toISOString()})`);
        });
      }
    } else {
      console.log('- Uploads directory does not exist ❌');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkTeacherImages();