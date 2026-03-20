/**
 * Check Register100 Data Script
 * 
 * Checks if there are any register100 submissions in the database
 * 
 * Usage: node scripts/check-register100-data.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkRegister100Data() {
  console.log('🔍 Checking Register100 Data...\n');
  
  const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  const dbName = 'thai_music_school';
  
  console.log('📋 Configuration:');
  console.log('  URI:', uri.replace(/\/\/.*@/, '//<credentials>@'));
  console.log('  Database:', dbName);
  console.log('');
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    
    console.log('✅ Connected successfully!\n');
    
    // Check all collections
    console.log('📊 All collections:');
    const collections = await db.listCollections().toArray();
    collections.forEach(col => console.log('    -', col.name));
    console.log('');
    
    // Check register100 collection
    console.log('📋 Checking register100_submissions collection...');
    const register100Collection = db.collection('register100_submissions');
    const register100Count = await register100Collection.countDocuments();
    console.log('  Total register100 submissions:', register100Count);
    
    if (register100Count > 0) {
      console.log('\n📝 Sample register100 submissions:');
      const samples = await register100Collection.find({}).limit(3).toArray();
      samples.forEach((submission, index) => {
        console.log(`\n  Submission ${index + 1}:`);
        console.log('    ID:', submission._id);
        console.log('    School:', submission.reg100_schoolName || submission.schoolName || 'N/A');
        console.log('    Province:', submission.reg100_schoolProvince || submission.schoolProvince || 'N/A');
        console.log('    Created:', submission.createdAt ? new Date(submission.createdAt).toLocaleString('th-TH') : 'N/A');
        console.log('    Total Score:', submission.total_score || 'N/A');
        console.log('    School ID:', submission.schoolId || 'N/A');
        
        // Show some key fields to understand structure
        console.log('    Key fields:');
        Object.keys(submission).slice(0, 15).forEach(key => {
          if (!key.startsWith('_') && !key.includes('Date')) {
            const value = submission[key];
            const type = Array.isArray(value) ? `array[${value.length}]` : typeof value;
            console.log(`      - ${key}: ${type}`);
          }
        });
      });
    }
    
    // Check register-support collection too
    console.log('\n📋 Checking register-support collection...');
    const registerSupportCollection = db.collection('register-support');
    const registerSupportCount = await registerSupportCollection.countDocuments();
    console.log('  Total register-support submissions:', registerSupportCount);
    
    await client.close();
    console.log('\n✅ Check completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Check failed:', error.message);
    process.exit(1);
  }
}

// Run check
checkRegister100Data().catch(console.error);