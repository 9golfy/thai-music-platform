const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testPdfContentDetailed() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    const registerSupportCollection = database.collection('register_support_submissions');
    const submission = await registerSupportCollection.findOne({});
    
    if (submission) {
      console.log(`Testing PDF content for submission: ${submission._id}`);
      
      // Test PDF export content
      const pdfResponse = await fetch(`http://localhost:3000/api/register-support/${submission._id}/export/pdf`);
      const pdfContent = await pdfResponse.text();
      
      console.log('\n=== PDF Content Analysis ===');
      console.log(`PDF Response Status: ${pdfResponse.status}`);
      console.log(`Content Length: ${pdfContent.length} characters`);
      
      // Check for key comprehensive elements
      const checks = [
        { name: 'Comprehensive Title', text: 'ฉบับสมบูรณ์', found: pdfContent.includes('ฉบับสมบูรณ์') },
        { name: 'School Basic Info Section', text: 'ข้อมูลพื้นฐานสถานศึกษา', found: pdfContent.includes('ข้อมูลพื้นฐานสถานศึกษา') },
        { name: 'Principal Info Section', text: 'ข้อมูลผู้บริหาร', found: pdfContent.includes('ข้อมูลผู้บริหาร') },
        { name: 'Contact Person Section', text: 'ข้อมูลผู้ติดต่อ', found: pdfContent.includes('ข้อมูลผู้ติดต่อ') },
        { name: 'Teacher Table', text: 'ข้อมูลครูผู้สอนดนตรีไทย', found: pdfContent.includes('ข้อมูลครูผู้สอนดนตรีไทย') },
        { name: 'Awards Table', text: 'รางวัลและเกียรติคุณ', found: pdfContent.includes('รางวัลและเกียรติคุณ') },
        { name: 'Support from Org', text: 'การสนับสนุนจากต้นสังกัด', found: pdfContent.includes('การสนับสนุนจากต้นสังกัด') },
        { name: 'Support from External', text: 'การสนับสนุนจากภายนอก', found: pdfContent.includes('การสนับสนุนจากภายนอก') },
        { name: 'Additional Info', text: 'ข้อมูลเพิ่มเติม', found: pdfContent.includes('ข้อมูลเพิ่มเติม') },
        { name: 'Obstacles Field', text: 'อุปสรรคในการดำเนินงาน', found: pdfContent.includes('อุปสรรคในการดำเนินงาน') },
        { name: 'Suggestions Field', text: 'ข้อเสนอแนะ', found: pdfContent.includes('ข้อเสนอแนะ') }
      ];
      
      console.log('\nContent Check Results:');
      checks.forEach(check => {
        console.log(`✓ ${check.name}: ${check.found ? '✅ Found' : '❌ Not Found'}`);
      });
      
      const foundCount = checks.filter(check => check.found).length;
      console.log(`\nSummary: ${foundCount}/${checks.length} comprehensive elements found`);
      
      if (foundCount >= 8) {
        console.log('🎉 Comprehensive export is working correctly!');
      } else {
        console.log('⚠️  Some comprehensive elements are missing');
      }
      
      // Show a sample of the content
      console.log('\n=== Sample PDF Content (first 500 chars) ===');
      console.log(pdfContent.substring(0, 500) + '...');
      
    } else {
      console.log('No submissions found to test');
    }
    
  } catch (error) {
    console.error('Error testing PDF content:', error);
  } finally {
    await client.close();
  }
}

testPdfContentDetailed();