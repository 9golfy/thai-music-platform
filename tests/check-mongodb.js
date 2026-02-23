const { MongoClient } = require('mongodb');

async function checkMongoDB() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const collection = db.collection('register100_submissions');
    
    // Count all documents
    const count = await collection.countDocuments();
    console.log(`📊 Total documents: ${count}`);
    
    // Find latest submission with schoolName
    const latest = await collection.findOne(
      { schoolName: 'โรงเรียนทดสอบคะแนนครู' },
      { sort: { _id: -1 } }
    );
    
    if (latest) {
      console.log('✅ Found latest submission:');
      console.log('  - ID:', latest._id.toString());
      console.log('  - School:', latest.schoolName);
      console.log('  - Teacher Score:', latest.teacher_score);
      console.log('  - Teachers:', latest.thaiMusicTeachers?.length || 0);
      console.log('  - Created:', latest.createdAt);
      
      console.log('\n📝 Full document structure (first level fields):');
      Object.keys(latest).forEach(key => {
        if (key === 'teacher_score') {
          console.log(`  ✅ ${key}: ${latest[key]} <-- THIS IS THE SCORE FIELD`);
        } else if (key === 'thaiMusicTeachers') {
          console.log(`  - ${key}: [${latest[key].length} teachers]`);
        } else if (typeof latest[key] === 'object' && latest[key] !== null && !Array.isArray(latest[key])) {
          console.log(`  - ${key}: {object}`);
        } else if (Array.isArray(latest[key])) {
          console.log(`  - ${key}: [${latest[key].length} items]`);
        } else {
          const value = String(latest[key]).substring(0, 50);
          console.log(`  - ${key}: ${value}`);
        }
      });
    } else {
      console.log('❌ No submission found with schoolName: โรงเรียนทดสอบคะแนนครู');
    }
    
    // List all submissions
    const all = await collection.find({}).sort({ _id: -1 }).limit(5).toArray();
    console.log(`\n📋 Latest 5 submissions:`);
    all.forEach((doc, i) => {
      console.log(`  ${i + 1}. ${doc._id.toString()} - ${doc.schoolName} (score: ${doc.teacher_score || 0})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkMongoDB();
