require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function fixMissingImages() {
  const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('thai_music_school');
    const collection = db.collection('register100_submissions');
    
    // Get the record
    const recordId = '69a38477a29d6ad3828c66ae';
    const record = await collection.findOne({ _id: new ObjectId(recordId) });
    
    if (!record) {
      console.log('❌ Record not found');
      return;
    }
    
    console.log(`📋 Record: ${record.schoolName}`);
    console.log(`   School ID: ${record.schoolId}\n`);
    
    // Check which images exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const availableImages = fs.readdirSync(uploadsDir);
    
    console.log('🔍 Checking images:\n');
    
    // Find available manager and teacher images
    const managerImages = availableImages.filter(f => f.startsWith('mgt_') && !f.includes('support'));
    const teacherImages = availableImages.filter(f => f.startsWith('teacher_'));
    
    console.log(`Found ${managerImages.length} manager images`);
    console.log(`Found ${teacherImages.length} teacher images\n`);
    
    const updates = {};
    
    // Fix manager image
    if (record.mgtImage) {
      const imagePath = path.join(uploadsDir, path.basename(record.mgtImage));
      if (!fs.existsSync(imagePath)) {
        console.log(`❌ Manager image missing: ${record.mgtImage}`);
        if (managerImages.length > 0) {
          updates.mgtImage = `/uploads/${managerImages[0]}`;
          console.log(`✅ Will use: ${updates.mgtImage}`);
        }
      } else {
        console.log(`✅ Manager image exists: ${record.mgtImage}`);
      }
    }
    
    // Fix teacher images
    if (record.thaiMusicTeachers && record.thaiMusicTeachers.length > 0) {
      const updatedTeachers = record.thaiMusicTeachers.map((teacher, index) => {
        if (teacher.teacherImage) {
          const imagePath = path.join(uploadsDir, path.basename(teacher.teacherImage));
          if (!fs.existsSync(imagePath)) {
            console.log(`❌ Teacher ${index + 1} image missing: ${teacher.teacherImage}`);
            if (teacherImages.length > index) {
              teacher.teacherImage = `/uploads/${teacherImages[index]}`;
              console.log(`✅ Will use: ${teacher.teacherImage}`);
            }
          } else {
            console.log(`✅ Teacher ${index + 1} image exists: ${teacher.teacherImage}`);
          }
        }
        return teacher;
      });
      
      updates.thaiMusicTeachers = updatedTeachers;
    }
    
    // Update database
    if (Object.keys(updates).length > 0) {
      console.log('\n📝 Updating database...');
      await collection.updateOne(
        { _id: new ObjectId(recordId) },
        { $set: updates }
      );
      console.log('✅ Database updated!');
    } else {
      console.log('\n✅ No updates needed - all images exist');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

fixMissingImages();
