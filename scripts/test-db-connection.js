const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully!');
    
    const database = client.db(dbName);
    const collection = database.collection('register100_submissions');
    
    const count = await collection.countDocuments();
    console.log(`Found ${count} register100 submissions`);
    
    // Get one document to test
    const sample = await collection.findOne({});
    if (sample) {
      console.log('Sample document ID:', sample._id);
      console.log('Sample school name:', sample.reg100_schoolName || sample.schoolName);
    }
    
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

testConnection();