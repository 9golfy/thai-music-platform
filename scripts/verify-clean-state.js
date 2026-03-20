const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function verifyCleanState() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔍 Verifying clean state...\n');
    
    const database = client.db(dbName);
    
    // Check database collections
    const collections = [
      'register100_submissions',
      'register_support_submissions', 
      'certificates',
      'users'
    ];
    
    console.log('📊 Database Status:');
    let totalRecords = 0;
    
    for (const collectionName of collections) {
      const collection = database.collection(collectionName);
      const count = await collection.countDocuments();
      totalRecords += count;
      
      const status = count === 0 ? '✅' : '⚠️';
      console.log(`   ${status} ${collectionName}: ${count} documents`);
    }
    
    // Check uploads directory
    console.log('\n📁 File System Status:');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    try {
      const files = fs.readdirSync(uploadsDir);
      const status = files.length === 0 ? '✅' : '⚠️';
      console.log(`   ${status} public/uploads/: ${files.length} files`);
      
      if (files.length > 0) {
        console.log('   Files found:');
        files.forEach(file => console.log(`     - ${file}`));
      }
    } catch (error) {
      console.log('   ❌ Error reading uploads directory:', error.message);
    }
    
    // Summary
    console.log('\n📋 Summary:');
    if (totalRecords === 0) {
      console.log('   ✅ Database is completely clean');
    } else {
      console.log(`   ⚠️  Database still contains ${totalRecords} records`);
    }
    
    const uploadsEmpty = fs.readdirSync(uploadsDir).length === 0;
    if (uploadsEmpty) {
      console.log('   ✅ Uploads directory is clean');
    } else {
      console.log('   ⚠️  Uploads directory still contains files');
    }
    
    if (totalRecords === 0 && uploadsEmpty) {
      console.log('\n🎉 System is ready for fresh testing!');
      console.log('   • All database records cleared');
      console.log('   • All uploaded files removed');
      console.log('   • Forms will start with clean state');
    } else {
      console.log('\n⚠️  Some cleanup may be needed before testing');
    }
    
  } catch (error) {
    console.error('❌ Error verifying clean state:', error);
  } finally {
    await client.close();
  }
}

// Run the verification
verifyCleanState();