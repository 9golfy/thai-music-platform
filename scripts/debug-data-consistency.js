const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function debugDataConsistency() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('=== Data Consistency Debug ===\n');
    
    const database = client.db(dbName);
    
    // Check specific register100 record
    const register100Collection = database.collection('register100_submissions');
    const specificRecord = await register100Collection.findOne({ 
      _id: new ObjectId('69ace7425d451baf6766d1fb') 
    });
    
    if (specificRecord) {
      console.log('=== Specific Register100 Record (69ace7425d451baf6766d1fb) ===');
      console.log('Raw data from database:');
      console.log('- _id:', specificRecord._id.toString());
      console.log('- reg100_schoolName:', specificRecord.reg100_schoolName);
      console.log('- schoolName:', specificRecord.schoolName);
      console.log('- reg100_schoolProvince:', specificRecord.reg100_schoolProvince);
      console.log('- schoolProvince:', specificRecord.schoolProvince);
      console.log('- reg100_schoolLevel:', specificRecord.reg100_schoolLevel);
      console.log('- schoolLevel:', specificRecord.schoolLevel);
      console.log('- total_score:', specificRecord.total_score);
      console.log('- createdAt:', specificRecord.createdAt);
      console.log('- schoolId:', specificRecord.schoolId);
      
      console.log('\n=== Field Mapping Analysis ===');
      console.log('What SchoolsDataTable would show:');
      console.log('- School Name:', specificRecord.reg100_schoolName || specificRecord.regsup_schoolName || '-');
      console.log('- Province:', specificRecord.reg100_schoolProvince || specificRecord.regsup_schoolProvince || '-');
      console.log('- Level:', specificRecord.reg100_schoolLevel || specificRecord.regsup_schoolLevel || 'ไม่ระบุ');
      console.log('- Score:', specificRecord.total_score || 0);
      
      console.log('\n=== What Register100DetailView would show ===');
      // Simulate the proxy logic from Register100DetailView
      const displayData = new Proxy(specificRecord, {
        get(target, prop) {
          if (typeof prop === 'string') {
            return target[`reg100_${prop}`] ?? target[prop];
          }
          return target[prop];
        }
      });
      
      console.log('- School Name (via proxy):', displayData.schoolName);
      console.log('- Province (via proxy):', displayData.schoolProvince);
      console.log('- Level (via proxy):', displayData.schoolLevel);
      console.log('- Score (direct):', specificRecord.total_score);
      
      console.log('\n=== All reg100_ prefixed fields ===');
      Object.keys(specificRecord).filter(key => key.startsWith('reg100_')).forEach(key => {
        console.log(`- ${key}:`, specificRecord[key]);
      });
      
      console.log('\n=== All non-prefixed fields ===');
      Object.keys(specificRecord).filter(key => !key.startsWith('reg100_') && !key.startsWith('_')).forEach(key => {
        console.log(`- ${key}:`, specificRecord[key]);
      });
      
    } else {
      console.log('❌ Record 69ace7425d451baf6766d1fb not found!');
    }
    
    // Check all register100 records
    console.log('\n=== All Register100 Records Summary ===');
    const allRecords = await register100Collection.find({}).toArray();
    console.log(`Total records: ${allRecords.length}`);
    
    allRecords.forEach((record, index) => {
      console.log(`\n${index + 1}. ID: ${record._id}`);
      console.log(`   reg100_schoolName: ${record.reg100_schoolName || 'N/A'}`);
      console.log(`   schoolName: ${record.schoolName || 'N/A'}`);
      console.log(`   total_score: ${record.total_score || 'N/A'}`);
      console.log(`   createdAt: ${record.createdAt || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugDataConsistency();