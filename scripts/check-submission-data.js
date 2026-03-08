const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function checkSubmissionData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    const registerSupportCollection = database.collection('register_support_submissions');
    const submission = await registerSupportCollection.findOne({});
    
    if (submission) {
      console.log(`Checking data for submission: ${submission._id}`);
      
      // Helper function to get field value with fallback
      const getFieldValue = (fieldName) => {
        return submission[`regsup_${fieldName}`] ?? submission[fieldName] ?? null;
      };
      
      console.log('\n=== Basic School Info ===');
      console.log(`School Name: ${getFieldValue('schoolName')}`);
      console.log(`School Address: ${getFieldValue('schoolAddress')}`);
      console.log(`School Phone: ${getFieldValue('schoolPhone')}`);
      console.log(`School Email: ${getFieldValue('schoolEmail')}`);
      console.log(`Principal Name: ${getFieldValue('principalName')}`);
      console.log(`Contact Person Name: ${getFieldValue('contactPersonName')}`);
      
      console.log('\n=== Array Data ===');
      const teachers = getFieldValue('thaiMusicTeachers') || [];
      const awards = getFieldValue('awards') || [];
      const supportFromOrg = getFieldValue('supportFromOrg') || [];
      const supportFromExternal = getFieldValue('supportFromExternal') || [];
      
      console.log(`Teachers: ${teachers.length} entries`);
      if (teachers.length > 0) {
        console.log(`  First teacher: ${teachers[0].teacherName || 'N/A'}`);
      }
      
      console.log(`Awards: ${awards.length} entries`);
      if (awards.length > 0) {
        console.log(`  First award: ${awards[0].awardName || 'N/A'}`);
      }
      
      console.log(`Support from Org: ${supportFromOrg.length} entries`);
      console.log(`Support from External: ${supportFromExternal.length} entries`);
      
      console.log('\n=== Step 8 Data ===');
      console.log(`Information Sources: ${JSON.stringify(getFieldValue('informationSources'))}`);
      console.log(`Obstacles: ${getFieldValue('obstacles')}`);
      console.log(`Suggestions: ${getFieldValue('suggestions')}`);
      console.log(`Certification: ${getFieldValue('certification')}`);
      
      console.log('\n=== All Field Names ===');
      const fieldNames = Object.keys(submission).filter(key => key.startsWith('regsup_')).sort();
      console.log('Fields with regsup_ prefix:');
      fieldNames.forEach(field => {
        const value = submission[field];
        const type = Array.isArray(value) ? `array(${value.length})` : typeof value;
        console.log(`  ${field}: ${type}`);
      });
      
    } else {
      console.log('No submissions found');
    }
    
  } catch (error) {
    console.error('Error checking submission data:', error);
  } finally {
    await client.close();
  }
}

checkSubmissionData();