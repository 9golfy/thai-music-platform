const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testRegisterSupportRecord() {
  console.log('=== Testing Register Support Record ===\n');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');
    
    // Test specific record
    const recordId = '69acf29f5d451baf6766d1ff';
    console.log(`Testing record: ${recordId}`);
    
    const record = await collection.findOne({
      _id: new ObjectId(recordId)
    });
    
    if (record) {
      console.log('✅ Record found');
      console.log(`School Name: ${record.regsup_schoolName || record.schoolName}`);
      console.log(`Province: ${record.regsup_schoolProvince || record.schoolProvince}`);
      console.log(`Total Score: ${record.total_score}`);
      console.log(`School ID: ${record.schoolId}`);
      console.log(`Created At: ${record.createdAt}`);
      
      // Check field prefixes
      const regSupFields = Object.keys(record).filter(k => k.startsWith('regsup_'));
      const nonPrefixFields = Object.keys(record).filter(k => !k.startsWith('regsup_') && !k.startsWith('_') && !['schoolId', 'createdAt', 'updatedAt', 'total_score'].includes(k));
      
      console.log(`\nField Analysis:`);
      console.log(`  regsup_ prefixed fields: ${regSupFields.length}`);
      console.log(`  non-prefixed fields: ${nonPrefixFields.length}`);
      
      if (regSupFields.length > 0) {
        console.log(`  Sample regsup_ fields: ${regSupFields.slice(0, 5).join(', ')}`);
      }
      if (nonPrefixFields.length > 0) {
        console.log(`  Sample non-prefix fields: ${nonPrefixFields.slice(0, 5).join(', ')}`);
      }
      
    } else {
      console.log('❌ Record not found');
    }
    
    // Also check all register-support records
    console.log('\n=== All Register Support Records ===');
    const allRecords = await collection.find({}).toArray();
    console.log(`Total records: ${allRecords.length}`);
    
    allRecords.forEach((record, index) => {
      console.log(`${index + 1}. ${record._id} - ${record.regsup_schoolName || record.schoolName} (Score: ${record.total_score})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testRegisterSupportRecord().catch(console.error);