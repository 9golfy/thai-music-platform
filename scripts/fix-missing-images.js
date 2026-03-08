// Fix missing image paths in database
// Run: node scripts/fix-missing-images.js

require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = process.env.MONGODB_URI?.replace('mongo:', 'localhost:') || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function fixMissingImages() {
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const database = client.db(dbName);

    // Get available images
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const availableImages = fs.readdirSync(uploadsDir);
    console.log(`📁 Found ${availableImages.length} images in uploads folder\n`);

    // Fix Register100
    console.log('📝 Fixing Register100 submissions...');
    const register100Collection = database.collection('register100_submissions');
    const register100Records = await register100Collection.find({}).toArray();
    
    let fixedCount = 0;
    
    for (const record of register100Records) {
      let needsUpdate = false;
      const updates = {};
      
      // Check mgtImage
      if (record.mgtImage) {
        const filename = record.mgtImage.replace('/uploads/', '');
        if (!availableImages.includes(filename)) {
          console.log(`  ❌ Missing: ${filename} in record ${record._id}`);
          updates.mgtImage = null;
          needsUpdate = true;
        }
      }
      
      // Check teacher images
      if (record.thaiMusicTeachers && record.thaiMusicTeachers.length > 0) {
        const updatedTeachers = record.thaiMusicTeachers.map(teacher => {
          if (teacher.teacherImage) {
            const filename = teacher.teacherImage.replace('/uploads/', '');
            if (!availableImages.includes(filename)) {
              console.log(`  ❌ Missing: ${filename} for teacher ${teacher.teacherFullName}`);
              return { ...teacher, teacherImage: null };
            }
          }
          return teacher;
        });
        
        if (JSON.stringify(updatedTeachers) !== JSON.stringify(record.thaiMusicTeachers)) {
          updates.thaiMusicTeachers = updatedTeachers;
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        await register100Collection.updateOne(
          { _id: record._id },
          { $set: updates }
        );
        fixedCount++;
        console.log(`  ✅ Fixed record ${record._id}`);
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} Register100 records`);

    // Fix Register Support
    console.log('\n📝 Fixing Register Support submissions...');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportRecords = await registerSupportCollection.find({}).toArray();
    
    let fixedSupportCount = 0;
    
    for (const record of registerSupportRecords) {
      let needsUpdate = false;
      const updates = {};
      
      // Check mgtImage
      if (record.mgtImage) {
        const filename = record.mgtImage.replace('/uploads/', '');
        if (!availableImages.includes(filename)) {
          console.log(`  ❌ Missing: ${filename} in record ${record._id}`);
          updates.mgtImage = null;
          needsUpdate = true;
        }
      }
      
      // Check teacher images
      if (record.thaiMusicTeachers && record.thaiMusicTeachers.length > 0) {
        const updatedTeachers = record.thaiMusicTeachers.map(teacher => {
          if (teacher.teacherImage) {
            const filename = teacher.teacherImage.replace('/uploads/', '');
            if (!availableImages.includes(filename)) {
              console.log(`  ❌ Missing: ${filename} for teacher ${teacher.teacherFullName}`);
              return { ...teacher, teacherImage: null };
            }
          }
          return teacher;
        });
        
        if (JSON.stringify(updatedTeachers) !== JSON.stringify(record.thaiMusicTeachers)) {
          updates.thaiMusicTeachers = updatedTeachers;
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        await registerSupportCollection.updateOne(
          { _id: record._id },
          { $set: updates }
        );
        fixedSupportCount++;
        console.log(`  ✅ Fixed record ${record._id}`);
      }
    }
    
    console.log(`\n✅ Fixed ${fixedSupportCount} Register Support records`);
    console.log(`\n📊 Total fixed: ${fixedCount + fixedSupportCount} records`);

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

fixMissingImages();
