require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

async function checkFieldNames() {
  const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('thai_music_school');
    const record = await db.collection('register100_submissions').findOne({ 
      _id: new ObjectId('69a383e9a29d6ad3828c66aa') 
    });
    
    if (record) {
      console.log('📋 Field names related to province and level:\n');
      
      // Check all possible field names
      const fieldsToCheck = [
        'province',
        'schoolProvince',
        'provinceAddress',
        'level',
        'schoolLevel',
        'educationLevel'
      ];
      
      fieldsToCheck.forEach(field => {
        if (record[field] !== undefined) {
          console.log(`✅ ${field}: "${record[field]}"`);
        } else {
          console.log(`❌ ${field}: undefined`);
        }
      });
      
      console.log('\n📝 All fields in record:');
      console.log(Object.keys(record).sort().join(', '));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

checkFieldNames();
