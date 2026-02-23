/**
 * Script to check MongoDB submissions
 * Run with: npx ts-node scripts/check-submissions.ts
 */

import { MongoClient } from 'mongodb';

const MONGO_URI = 'mongodb://root:rootpass@localhost:27017/?authSource=admin';
const DB_NAME = 'thai_music_school';
const COLLECTION = 'register69_submissions';

async function checkSubmissions() {
  console.log('🔍 Checking MongoDB submissions...');
  console.log('='.repeat(70));
  
  const client = await MongoClient.connect(MONGO_URI);
  
  try {
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);
    
    // Count total submissions
    const count = await collection.countDocuments();
    console.log(`\n📊 Total submissions: ${count}`);
    
    if (count === 0) {
      console.log('\n⚠️  No submissions found in database');
      return;
    }
    
    // Get all submissions
    const submissions = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    console.log('\n📋 Submissions:');
    console.log('='.repeat(70));
    
    submissions.forEach((sub, index) => {
      console.log(`\n${index + 1}. Submission ID: ${sub._id}`);
      console.log(`   Created: ${sub.createdAt}`);
      console.log(`   School: ${sub.schoolName}`);
      console.log(`   Province: ${sub.schoolProvince}`);
      console.log(`   Level: ${sub.schoolLevel}`);
      console.log(`   Manager: ${sub.mgtFullName} (${sub.mgtPosition})`);
      console.log(`   Phone: ${sub.mgtPhone}`);
      console.log(`   Email: ${sub.mgtEmail || 'N/A'}`);
      console.log(`   Teachers: ${sub.thaiMusicTeachers?.length || 0}`);
      console.log(`   Teaching Plans: ${sub.currentTeachingPlans?.length || 0}`);
      console.log(`   Instruments: ${sub.availableInstruments?.length || 0}`);
      console.log(`   Support Factors: ${sub.supportFactors?.length || 0}`);
      console.log(`   Awards: ${sub.awards?.length || 0}`);
      console.log(`   Classroom Videos: ${sub.classroomVideos?.length || 0}`);
      console.log(`   Performance Videos: ${sub.performanceVideos?.length || 0}`);
      
      // Check for files at root level (new structure)
      if (sub.mgtImage || sub.mediaPhotos) {
        console.log(`   Files (root level):`);
        console.log(`     - Manager Image: ${sub.mgtImage ? `${sub.mgtImage.name} (${sub.mgtImage.path})` : 'N/A'}`);
        console.log(`     - Media Photos: ${sub.mediaPhotos?.length || 0}`);
        if (sub.mediaPhotos && sub.mediaPhotos.length > 0) {
          sub.mediaPhotos.forEach((photo: any, idx: number) => {
            console.log(`       ${idx + 1}. ${photo.name} (${photo.path})`);
          });
        }
      }
      
      // Check for files in nested structure (old structure)
      if (sub.files) {
        console.log(`   Files (nested):`);
        console.log(`     - Manager Image: ${sub.files.mgtImage ? `${sub.files.mgtImage.name} (${sub.files.mgtImage.path})` : 'N/A'}`);
        console.log(`     - Media Photos: ${sub.files.mediaPhotos?.length || 0}`);
        console.log(`     - Teacher Images: ${sub.files.teacherImages?.length || 0}`);
        if (sub.files.teacherImages && sub.files.teacherImages.length > 0) {
          sub.files.teacherImages.forEach((img: any, idx: number) => {
            console.log(`       ${idx + 1}. ${img.key}: ${img.name} (${img.path})`);
          });
        }
      }
      
      // Show full document for latest submission
      if (index === 0) {
        console.log(`\n   📄 Full Document:`);
        console.log(JSON.stringify(sub, null, 2));
      }
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ Check complete!');
    
  } finally {
    await client.close();
  }
}

checkSubmissions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
