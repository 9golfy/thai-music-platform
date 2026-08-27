const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const id = '6a1d756b1b4650d917db564a';

(async () => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  
  const doc = await client.db('thai_music_school')
    .collection('register_support_submissions')
    .findOne({ _id: new ObjectId(id) });
  
  console.log('Activity Scores:');
  console.log('  activity_within_province_internal_score:', doc.activity_within_province_internal_score);
  console.log('  activity_within_province_external_score:', doc.activity_within_province_external_score);
  console.log('  activity_outside_province_score:', doc.activity_outside_province_score);
  console.log('  pr_activity_score:', doc.pr_activity_score);
  
  await client.close();
})();
