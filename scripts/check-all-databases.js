require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

async function checkAllDatabases() {
  const uri = 'mongodb://root:rootpass@localhost:27017/?authSource=admin';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    // List all databases
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    
    console.log('📊 Available databases:');
    dbs.databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });
    
    console.log('\n🔍 Checking register100_submissions in each database:\n');
    
    // Check both possible database names
    const dbNames = ['thai_music_school', 'registerForm'];
    
    for (const dbName of dbNames) {
      console.log(`\n📁 Database: ${dbName}`);
      const db = client.db(dbName);
      
      try {
        const collections = await db.listCollections().toArray();
        console.log(`  Collections: ${collections.map(c => c.name).join(', ') || 'none'}`);
        
        const count = await db.collection('register100_submissions').countDocuments();
        console.log(`  register100_submissions count: ${count}`);
        
        if (count > 0) {
          const records = await db.collection('register100_submissions').find({}).limit(5).toArray();
          console.log(`\n  Recent records:`);
          records.forEach((r, i) => {
            console.log(`    ${i + 1}. ${r._id} - ${r.schoolName} - School ID: ${r.schoolId || '❌ MISSING'}`);
          });
        }
      } catch (error) {
        console.log(`  Error: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

checkAllDatabases();
