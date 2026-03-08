const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function checkRegisterSupportFields() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    const registerSupportCollection = database.collection('register_support_submissions');
    const submission = await registerSupportCollection.findOne({});
    
    if (submission) {
      console.log(`Register-Support ID: ${submission._id}`);
      
      console.log('\n--- All Fields with regsup_ prefix ---');
      Object.keys(submission)
        .filter(key => key.startsWith('regsup_'))
        .sort()
        .forEach(key => {
          const value = submission[key];
          if (value !== null && value !== undefined && value !== '') {
            const type = Array.isArray(value) ? `array(${value.length})` : typeof value;
            console.log(`${key}: ${type} - ${Array.isArray(value) ? '[...]' : String(value).substring(0, 50)}`);
          }
        });
        
      // Check for address-related fields
      console.log('\n--- Address-related fields ---');
      const addressFields = ['addressNo', 'moo', 'road', 'subDistrict', 'district', 'provinceAddress', 'postalCode', 'phone', 'email', 'website'];
      addressFields.forEach(field => {
        const value = submission[`regsup_${field}`] ?? submission[field];
        if (value) {
          console.log(`${field}: ${value}`);
        }
      });
      
      // Check for management fields
      console.log('\n--- Management-related fields ---');
      const mgtFields = ['mgtFullName', 'mgtPhone', 'mgtEmail', 'mgtPosition'];
      mgtFields.forEach(field => {
        const value = submission[`regsup_${field}`] ?? submission[field];
        if (value) {
          console.log(`${field}: ${value}`);
        }
      });
      
    } else {
      console.log('No register-support submissions found');
    }
    
  } catch (error) {
    console.error('Error checking register-support fields:', error);
  } finally {
    await client.close();
  }
}

checkRegisterSupportFields();