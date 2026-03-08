const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function fixRegisterSupportData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('=== Fixing Register Support Data Consistency ===\n');
    
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');
    
    // Check the problematic record
    const problematicRecord = await collection.findOne({ 
      _id: new ObjectId('69acf0085d451baf6766d1fd') 
    });
    
    if (problematicRecord) {
      console.log('Problematic record found:');
      console.log('- regsup_schoolName:', problematicRecord.regsup_schoolName);
      console.log('- schoolName:', problematicRecord.schoolName);
      console.log('- regsup_schoolProvince:', problematicRecord.regsup_schoolProvince);
      console.log('- schoolProvince:', problematicRecord.schoolProvince);
      console.log('- total_score:', problematicRecord.total_score);
      
      // Check if we need to add missing prefixed fields
      const updates = {};
      let needsUpdate = false;
      
      if (!problematicRecord.regsup_schoolName && problematicRecord.schoolName) {
        updates.regsup_schoolName = problematicRecord.schoolName;
        needsUpdate = true;
      }
      
      if (!problematicRecord.regsup_schoolProvince && problematicRecord.schoolProvince) {
        updates.regsup_schoolProvince = problematicRecord.schoolProvince;
        needsUpdate = true;
      }
      
      if (!problematicRecord.regsup_schoolLevel && problematicRecord.schoolLevel) {
        updates.regsup_schoolLevel = problematicRecord.schoolLevel;
        needsUpdate = true;
      }
      
      if (!problematicRecord.total_score) {
        // Calculate total score if missing
        const totalScore = (problematicRecord.teacher_training_score || 0) +
                          (problematicRecord.teacher_qualification_score || 0) +
                          (problematicRecord.support_from_org_score || 0) +
                          (problematicRecord.support_from_external_score || 0) +
                          (problematicRecord.award_score || 0) +
                          (problematicRecord.activity_within_province_internal_score || 0) +
                          (problematicRecord.activity_within_province_external_score || 0) +
                          (problematicRecord.activity_outside_province_score || 0) +
                          (problematicRecord.pr_activity_score || 0);
        
        if (totalScore > 0) {
          updates.total_score = totalScore;
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        console.log('\nUpdating record with:', updates);
        const result = await collection.updateOne(
          { _id: new ObjectId('69acf0085d451baf6766d1fd') },
          { $set: updates }
        );
        console.log('Update result:', result.modifiedCount, 'document(s) modified');
      } else {
        console.log('\nNo updates needed for this record');
      }
    }
    
    // Check all register support records for consistency
    console.log('\n=== Checking All Register Support Records ===');
    const allRecords = await collection.find({}).toArray();
    
    for (const record of allRecords) {
      console.log(`\nRecord ID: ${record._id}`);
      console.log('List page display:');
      console.log(`  - School: ${record.reg100_schoolName || record.regsup_schoolName || '-'}`);
      console.log(`  - Province: ${record.reg100_schoolProvince || record.regsup_schoolProvince || '-'}`);
      console.log(`  - Score: ${record.total_score || 0}`);
      
      console.log('Detail page display (with proxy):');
      const displayData = new Proxy(record, {
        get(target, prop) {
          if (typeof prop === 'string') {
            return target[`regsup_${prop}`] ?? target[prop];
          }
          return target[prop];
        }
      });
      console.log(`  - School: ${displayData.schoolName || 'N/A'}`);
      console.log(`  - Province: ${displayData.schoolProvince || 'N/A'}`);
      console.log(`  - Score: ${record.total_score || 0}`);
      
      // Check if there's inconsistency
      const listSchool = record.reg100_schoolName || record.regsup_schoolName || '-';
      const detailSchool = displayData.schoolName || 'N/A';
      
      if (listSchool === '-' && detailSchool !== 'N/A') {
        console.log('  ⚠️  INCONSISTENCY: List shows "-" but detail shows data');
      } else if (listSchool !== '-' && listSchool === detailSchool) {
        console.log('  ✅ CONSISTENT: Both pages show same data');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixRegisterSupportData();