const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function debugExportData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    
    // Check register100 data
    console.log('\n=== Register100 Data Debug ===');
    const register100Collection = database.collection('register100_submissions');
    const register100Submission = await register100Collection.findOne({});
    
    if (register100Submission) {
      console.log(`Register100 ID: ${register100Submission._id}`);
      
      // Helper function to get field value with fallback
      const getFieldValue = (fieldName) => {
        return register100Submission[`reg100_${fieldName}`] ?? register100Submission[fieldName] ?? null;
      };
      
      console.log('\n--- Basic School Info ---');
      console.log(`School Name: ${getFieldValue('schoolName')}`);
      console.log(`School Address: ${getFieldValue('schoolAddress')}`);
      console.log(`School Phone: ${getFieldValue('schoolPhone')}`);
      console.log(`School Email: ${getFieldValue('schoolEmail')}`);
      console.log(`School Website: ${getFieldValue('schoolWebsite')}`);
      
      console.log('\n--- Principal Info ---');
      console.log(`Principal Name: ${getFieldValue('principalName')}`);
      console.log(`Principal Phone: ${getFieldValue('principalPhone')}`);
      console.log(`Principal Email: ${getFieldValue('principalEmail')}`);
      
      console.log('\n--- Contact Person Info ---');
      console.log(`Contact Person Name: ${getFieldValue('contactPersonName')}`);
      console.log(`Contact Person Phone: ${getFieldValue('contactPersonPhone')}`);
      console.log(`Contact Person Email: ${getFieldValue('contactPersonEmail')}`);
      
      console.log('\n--- Array Data ---');
      const teachers = getFieldValue('thaiMusicTeachers') || [];
      const awards = getFieldValue('awards') || [];
      console.log(`Teachers: ${teachers.length} entries`);
      console.log(`Awards: ${awards.length} entries`);
      
      if (teachers.length > 0) {
        console.log(`First teacher: ${JSON.stringify(teachers[0], null, 2)}`);
      }
      
      if (awards.length > 0) {
        console.log(`First award: ${JSON.stringify(awards[0], null, 2)}`);
      }
      
      console.log('\n--- All Fields with reg100_ prefix ---');
      Object.keys(register100Submission)
        .filter(key => key.startsWith('reg100_'))
        .sort()
        .forEach(key => {
          const value = register100Submission[key];
          if (value !== null && value !== undefined && value !== '') {
            const type = Array.isArray(value) ? `array(${value.length})` : typeof value;
            console.log(`${key}: ${type} - ${Array.isArray(value) ? '[...]' : String(value).substring(0, 50)}`);
          }
        });
    }
    
  } catch (error) {
    console.error('Error debugging export data:', error);
  } finally {
    await client.close();
  }
}

debugExportData();