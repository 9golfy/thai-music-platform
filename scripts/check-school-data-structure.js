// Script to check the actual data structure of a school
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function checkDataStructure() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    const register100Collection = database.collection('register100_submissions');
    
    // Get one record
    const sample = await register100Collection.findOne({});
    
    if (sample) {
      console.log('\n=== Sample Register100 Record ===');
      console.log(JSON.stringify(sample, null, 2));
    } else {
      console.log('No records found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkDataStructure();
