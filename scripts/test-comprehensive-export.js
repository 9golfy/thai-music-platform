const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testComprehensiveExport() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    
    // Test register-support export
    console.log('\n=== Testing Register-Support Export ===');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportSubmissions = await registerSupportCollection.find({}).limit(1).toArray();
    
    if (registerSupportSubmissions.length > 0) {
      const submission = registerSupportSubmissions[0];
      console.log(`Found register-support submission: ${submission._id}`);
      
      // Test PDF export
      console.log('Testing PDF export...');
      const pdfResponse = await fetch(`http://localhost:3000/api/register-support/${submission._id}/export/pdf`);
      console.log(`PDF Export Status: ${pdfResponse.status}`);
      
      // Test Excel export
      console.log('Testing Excel export...');
      const excelResponse = await fetch(`http://localhost:3000/api/register-support/${submission._id}/export/excel`);
      console.log(`Excel Export Status: ${excelResponse.status}`);
      
      // Check data completeness
      console.log('\nData completeness check:');
      console.log(`- School Name: ${submission.regsup_schoolName || submission.schoolName || 'N/A'}`);
      console.log(`- Teachers: ${(submission.regsup_thaiMusicTeachers || submission.thaiMusicTeachers || []).length} entries`);
      console.log(`- Awards: ${(submission.regsup_awards || submission.awards || []).length} entries`);
      console.log(`- Total Score: ${submission.total_score || 0}`);
    } else {
      console.log('No register-support submissions found');
    }
    
    // Test register100 export
    console.log('\n=== Testing Register100 Export ===');
    const register100Collection = database.collection('register100_submissions');
    const register100Submissions = await register100Collection.find({}).limit(1).toArray();
    
    if (register100Submissions.length > 0) {
      const submission = register100Submissions[0];
      console.log(`Found register100 submission: ${submission._id}`);
      
      // Test PDF export
      console.log('Testing PDF export...');
      const pdfResponse = await fetch(`http://localhost:3000/api/register100/${submission._id}/export/pdf`);
      console.log(`PDF Export Status: ${pdfResponse.status}`);
      
      // Test Excel export
      console.log('Testing Excel export...');
      const excelResponse = await fetch(`http://localhost:3000/api/register100/${submission._id}/export/excel`);
      console.log(`Excel Export Status: ${excelResponse.status}`);
      
      // Check data completeness
      console.log('\nData completeness check:');
      console.log(`- School Name: ${submission.reg100_schoolName || submission.schoolName || 'N/A'}`);
      console.log(`- Teachers: ${(submission.reg100_thaiMusicTeachers || submission.thaiMusicTeachers || []).length} entries`);
      console.log(`- Awards: ${(submission.reg100_awards || submission.awards || []).length} entries`);
      console.log(`- Total Score: ${submission.total_score || 0}`);
    } else {
      console.log('No register100 submissions found');
    }
    
  } catch (error) {
    console.error('Error testing comprehensive export:', error);
  } finally {
    await client.close();
  }
}

testComprehensiveExport();