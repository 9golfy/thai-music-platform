const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@thai-music-mongo:27017/thai_music_school?authSource=admin';
  console.log('Testing MongoDB connection with URI:', uri);
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    
    const database = client.db('thai_music_school');
    const collection = database.collection('register100_submissions');
    
    const count = await collection.countDocuments();
    console.log('📊 Total register100_submissions:', count);
    
    if (count > 0) {
      const schools = await collection.find({}).limit(1).toArray();
      console.log('📝 Sample data:', JSON.stringify(schools[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  } finally {
    await client.close();
  }
}

testConnection();