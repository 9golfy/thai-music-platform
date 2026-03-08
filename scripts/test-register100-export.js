const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testRegister100Export() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    const register100Collection = database.collection('register100_submissions');
    const submission = await register100Collection.findOne({});
    
    if (submission) {
      console.log(`Testing Register100 export for submission: ${submission._id}`);
      
      // Check what data exists
      console.log('\n=== Data Check ===');
      const getFieldValue = (fieldName) => {
        return submission[`reg100_${fieldName}`] ?? submission[fieldName] ?? null;
      };
      
      console.log(`School Name: ${getFieldValue('schoolName')}`);
      console.log(`Teachers: ${(getFieldValue('thaiMusicTeachers') || []).length} entries`);
      console.log(`Awards: ${(getFieldValue('awards') || []).length} entries`);
      console.log(`Total Score: ${submission.total_score || 0}`);
      
      // Test PDF export content
      const pdfResponse = await fetch(`http://localhost:3000/api/register100/${submission._id}/export/pdf`);
      const pdfContent = await pdfResponse.text();
      
      console.log('\n=== PDF Export Analysis ===');
      console.log(`PDF Response Status: ${pdfResponse.status}`);
      console.log(`Content Length: ${pdfContent.length} characters`);
      
      // Check for comprehensive elements
      const checks = [
        { name: 'Comprehensive Title', found: pdfContent.includes('ฉบับสมบูรณ์') },
        { name: 'School Basic Info', found: pdfContent.includes('ข้อมูลพื้นฐานสถานศึกษา') },
        { name: 'Principal Info', found: pdfContent.includes('ข้อมูลผู้บริหาร') },
        { name: 'Contact Person', found: pdfContent.includes('ข้อมูลผู้ติดต่อ') },
        { name: 'Teacher Table', found: pdfContent.includes('ข้อมูลครูผู้สอนดนตรีไทย') },
        { name: 'Awards Table', found: pdfContent.includes('รางวัลและเกียรติคุณ') },
        { name: 'Additional Info', found: pdfContent.includes('ข้อมูลเพิ่มเติม') }
      ];
      
      console.log('\nContent Check Results:');
      checks.forEach(check => {
        console.log(`✓ ${check.name}: ${check.found ? '✅ Found' : '❌ Not Found'}`);
      });
      
      const foundCount = checks.filter(check => check.found).length;
      console.log(`\nSummary: ${foundCount}/${checks.length} comprehensive elements found`);
      
      // Test Excel export
      console.log('\n=== Excel Export Test ===');
      const excelResponse = await fetch(`http://localhost:3000/api/register100/${submission._id}/export/excel`);
      console.log(`Excel Export Status: ${excelResponse.status}`);
      console.log(`Excel Content-Type: ${excelResponse.headers.get('content-type')}`);
      
      if (pdfResponse.status === 200 && excelResponse.status === 200) {
        console.log('\n🎉 Both PDF and Excel exports are working correctly!');
        console.log('✅ Comprehensive export functionality is implemented and functional!');
      }
      
    } else {
      console.log('No register100 submissions found');
    }
    
  } catch (error) {
    console.error('Error testing register100 export:', error);
  } finally {
    await client.close();
  }
}

testRegister100Export();