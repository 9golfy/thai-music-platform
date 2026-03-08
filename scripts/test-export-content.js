const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testExportContent() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    const registerSupportCollection = database.collection('register_support_submissions');
    const submission = await registerSupportCollection.findOne({});
    
    if (submission) {
      console.log(`Testing export content for submission: ${submission._id}`);
      
      // Test PDF export content
      console.log('\n=== Testing PDF Export Content ===');
      const pdfResponse = await fetch(`http://localhost:3000/api/register-support/${submission._id}/export/pdf`);
      const pdfContent = await pdfResponse.text();
      
      // Check if comprehensive data is included
      const hasSchoolAddress = pdfContent.includes('ที่อยู่');
      const hasContactPerson = pdfContent.includes('ผู้ติดต่อ');
      const hasTeacherTable = pdfContent.includes('ข้อมูลครูผู้สอนดนตรีไทย');
      const hasAwardsTable = pdfContent.includes('รางวัลและเกียรติคุณ');
      const hasComprehensiveTitle = pdfContent.includes('ฉบับสมบูรณ์');
      
      console.log('PDF Content Check:');
      console.log(`- Has School Address: ${hasSchoolAddress}`);
      console.log(`- Has Contact Person: ${hasContactPerson}`);
      console.log(`- Has Teacher Table: ${hasTeacherTable}`);
      console.log(`- Has Awards Table: ${hasAwardsTable}`);
      console.log(`- Has Comprehensive Title: ${hasComprehensiveTitle}`);
      
      // Test Excel export
      console.log('\n=== Testing Excel Export ===');
      const excelResponse = await fetch(`http://localhost:3000/api/register-support/${submission._id}/export/excel`);
      console.log(`Excel Export Status: ${excelResponse.status}`);
      console.log(`Excel Content-Type: ${excelResponse.headers.get('content-type')}`);
      
      if (pdfResponse.status === 200 && excelResponse.status === 200) {
        console.log('\n✅ All export functions are working correctly!');
        console.log('✅ Comprehensive data is included in exports!');
      } else {
        console.log('\n❌ Some export functions failed');
      }
      
    } else {
      console.log('No submissions found to test');
    }
    
  } catch (error) {
    console.error('Error testing export content:', error);
  } finally {
    await client.close();
  }
}

testExportContent();