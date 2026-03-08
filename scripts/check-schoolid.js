require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

async function checkSchoolId() {
  // Use localhost for scripts running on host machine
  const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('registerForm');
    
    // Get all records
    const records = await db.collection('register100_submissions').find({}).toArray();
    
    console.log(`📊 Total records: ${records.length}\n`);
    
    records.forEach((record, index) => {
      console.log(`Record ${index + 1}:`);
      console.log(`  ID: ${record._id}`);
      console.log(`  School Name: ${record.schoolName}`);
      console.log(`  School ID: ${record.schoolId || '❌ MISSING'}`);
      console.log('');
    });
    
    const missingCount = records.filter(r => !r.schoolId).length;
    console.log(`\n⚠️  Records without School ID: ${missingCount}/${records.length}`);
    
    if (missingCount > 0) {
      console.log('\n💡 Run this to add School IDs:');
      console.log('   node scripts/add-school-id-to-existing.js');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

checkSchoolId();
