require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thai_music_school';

async function checkTeacherImages() {
  console.log('🔍 Checking Teacher Images in Database...\n');

  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected successfully!\n');
    
    const db = client.db('thai_music_school');
    const collection = db.collection('register100_submissions');
    
    const submissions = await collection.find({}).toArray();
    
    if (submissions.length === 0) {
      console.log('❌ No submissions found');
      return;
    }
    
    const latest = submissions[submissions.length - 1];
    console.log(`📋 Latest submission: ${latest.reg100_schoolName}`);
    console.log(`🆔 School ID: ${latest.schoolId}`);
    console.log(`📅 Created: ${latest.createdAt}\n`);
    
    // Check management image
    console.log('👨‍💼 Management Image:');
    if (latest.reg100_mgtImage) {
      console.log(`  ✅ Found: ${latest.reg100_mgtImage}`);
    } else {
      console.log('  ❌ Not found');
    }
    
    // Check teacher images
    console.log('\n👨‍🏫 Teacher Images:');
    if (latest.reg100_thaiMusicTeachers && Array.isArray(latest.reg100_thaiMusicTeachers)) {
      console.log(`  Total teachers: ${latest.reg100_thaiMusicTeachers.length}`);
      
      latest.reg100_thaiMusicTeachers.forEach((teacher, index) => {
        console.log(`  Teacher ${index + 1}:`);
        console.log(`    Name: ${teacher.teacherFullName || 'N/A'}`);
        console.log(`    Email: ${teacher.teacherEmail || 'N/A'}`);
        console.log(`    Image: ${teacher.teacherImage || 'NOT FOUND'}`);
        console.log('');
      });
    } else {
      console.log('  ❌ No teachers found');
    }
    
    console.log('✅ Check completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

checkTeacherImages();