const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testRegisterSupportAPI() {
  console.log('=== Testing Register Support API Logic ===\n');
  
  const client = new MongoClient(uri);
  const recordId = '69acf29f5d451baf6766d1ff';
  
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');
    
    console.log(`Testing ObjectId conversion for: ${recordId}`);
    
    // Test ObjectId creation
    try {
      const objectId = new ObjectId(recordId);
      console.log(`✅ ObjectId created: ${objectId}`);
      
      // Test database query
      const submission = await collection.findOne({ _id: objectId });
      
      if (submission) {
        console.log('✅ Record found in database');
        console.log(`School Name: ${submission.regsup_schoolName || submission.schoolName}`);
        console.log(`Total Score: ${submission.total_score}`);
        
        // Test the response format that API would return
        const apiResponse = {
          success: true,
          submission: {
            ...submission,
            _id: submission._id.toString(),
          },
        };
        
        console.log('✅ API response format would be valid');
        console.log(`Response submission._id: ${apiResponse.submission._id}`);
        
      } else {
        console.log('❌ Record not found in database');
      }
      
    } catch (objectIdError) {
      console.log('❌ ObjectId creation failed:', objectIdError.message);
    }
    
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await client.close();
  }
}

testRegisterSupportAPI().catch(console.error);