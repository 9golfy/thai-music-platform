require('dotenv').config();
const {MongoClient} = require('mongodb');

const uri = process.env.MONGODB_URI?.replace('mongo:', 'localhost:') || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

(async()=>{
  const c = await MongoClient.connect(uri);
  const db = c.db('thai_music_school');
  const indexes = await db.collection('draft_submissions').indexes();
  console.log('Draft Submissions Indexes:');
  indexes.forEach(idx => {
    console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
  });
  await c.close();
})();
