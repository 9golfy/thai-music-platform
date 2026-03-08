// Add School ID to existing records
// Run: node scripts/add-school-id-to-existing.js

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

function generateSchoolId(sequenceNumber) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const sequence = String(sequenceNumber).padStart(4, '0');
  
  return `SCH-${year}${month}${day}-${sequence}`;
}

async function addSchoolIdToExisting() {
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db(dbName);

    // Process Register100
    console.log('\n📝 Processing Register100 submissions...');
    const register100Collection = database.collection('register100_submissions');
    const register100Records = await register100Collection.find({ schoolId: { $exists: false } }).toArray();
    
    console.log(`Found ${register100Records.length} records without School ID`);
    
    let sequence = 1;
    for (const record of register100Records) {
      const schoolId = generateSchoolId(sequence);
      await register100Collection.updateOne(
        { _id: record._id },
        { $set: { schoolId: schoolId } }
      );
      console.log(`✅ Added School ID ${schoolId} to record ${record._id}`);
      sequence++;
    }

    // Process Register Support
    console.log('\n📝 Processing Register Support submissions...');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportRecords = await registerSupportCollection.find({ schoolId: { $exists: false } }).toArray();
    
    console.log(`Found ${registerSupportRecords.length} records without School ID`);
    
    for (const record of registerSupportRecords) {
      const schoolId = generateSchoolId(sequence);
      await registerSupportCollection.updateOne(
        { _id: record._id },
        { $set: { schoolId: schoolId } }
      );
      console.log(`✅ Added School ID ${schoolId} to record ${record._id}`);
      sequence++;
    }

    console.log('\n✅ All existing records updated with School IDs!');
    console.log(`📊 Total records updated: ${register100Records.length + registerSupportRecords.length}`);

  } catch (error) {
    console.error('\n❌ Error updating records:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run update
addSchoolIdToExisting();
