// Script to fix duplicate school IDs
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

function generateSchoolId(date, sequence) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const seq = String(sequence).padStart(4, '0');
  return `SCH-${year}${month}${day}-${seq}`;
}

async function fixDuplicateSchoolIds() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    const register100Collection = database.collection('register100_submissions');
    const registerSupportCollection = database.collection('register_support_submissions');
    
    // Get all existing school IDs from register100
    const register100Schools = await register100Collection.find({}).toArray();
    const existingIds = new Set(register100Schools.map(s => s.schoolId));
    
    console.log(`Found ${existingIds.size} existing school IDs in Register100`);
    
    // Find the highest sequence number
    let maxSequence = 0;
    existingIds.forEach(id => {
      const match = id.match(/SCH-\d{8}-(\d{4})/);
      if (match) {
        const seq = parseInt(match[1]);
        if (seq > maxSequence) maxSequence = seq;
      }
    });
    
    console.log(`Highest sequence number: ${maxSequence}`);
    
    // Update register-support schools with new IDs
    console.log('\n=== Updating Register-Support School IDs ===');
    const registerSupportSchools = await registerSupportCollection.find({}).toArray();
    
    let nextSequence = maxSequence + 1;
    const today = new Date();
    
    for (const school of registerSupportSchools) {
      const oldId = school.schoolId;
      const newId = generateSchoolId(today, nextSequence);
      
      await registerSupportCollection.updateOne(
        { _id: school._id },
        { 
          $set: { 
            schoolId: newId,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`${oldId} → ${newId} (${school.schoolName})`);
      nextSequence++;
    }
    
    console.log('\n✅ All duplicate school IDs fixed!');
    console.log(`Next available sequence: ${nextSequence}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixDuplicateSchoolIds();
