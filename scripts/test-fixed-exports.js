const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testFixedExports() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    
    // Test register-support export
    console.log('\n=== Testing Fixed Register-Support Export ===');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportSubmission = await registerSupportCollection.findOne({});
    
    if (registerSupportSubmission) {
      console.log(`Testing register-support submission: ${registerSupportSubmission._id}`);
      
      // Test PDF export
      console.log('Testing PDF export...');
      const pdfResponse = await fetch(`http://localhost:3000/api/register-support/${registerSupportSubmission._id}/export/pdf`);
      const pdfContent = await pdfResponse.text();
      
      console.log(`PDF Export Status: ${pdfResponse.status}`);
      console.log(`PDF Content Length: ${pdfContent.length} characters`);
      
      // Check for comprehensive elements
      const pdfChecks = [
        { name: 'Comprehensive Title', found: pdfContent.includes('ฉบับสมบูรณ์') },
        { name: 'School Basic Info', found: pdfContent.includes('ข้อมูลพื้นฐานสถานศึกษา') },
        { name: 'Principal Info', found: pdfContent.includes('ข้อมูลผู้บริหาร') },
        { name: 'Contact Person', found: pdfContent.includes('ข้อมูลผู้ติดต่อ') },
        { name: 'Teacher Table', found: pdfContent.includes('ข้อมูลครูผู้สอนดนตรีไทย') },
        { name: 'Awards Table', found: pdfContent.includes('รางวัลและเกียรติคุณ') },
        { name: 'Additional Info', found: pdfContent.includes('ข้อมูลเพิ่มเติม') },
        { name: 'New Footer', found: pdfContent.includes('ระบบบริหารจัดการข้อมูลกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์') }
      ];
      
      console.log('\nPDF Content Check Results:');
      pdfChecks.forEach(check => {
        console.log(`✓ ${check.name}: ${check.found ? '✅ Found' : '❌ Not Found'}`);
      });
      
      // Test Excel export
      console.log('\nTesting Excel export...');
      const excelResponse = await fetch(`http://localhost:3000/api/register-support/${registerSupportSubmission._id}/export/excel`);
      console.log(`Excel Export Status: ${excelResponse.status}`);
      
      const foundCount = pdfChecks.filter(check => check.found).length;
      console.log(`\nRegister-Support Summary: ${foundCount}/${pdfChecks.length} elements found`);
    }
    
    // Test register100 export
    console.log('\n=== Testing Fixed Register100 Export ===');
    const register100Collection = database.collection('register100_submissions');
    const register100Submission = await register100Collection.findOne({});
    
    if (register100Submission) {
      console.log(`Testing register100 submission: ${register100Submission._id}`);
      
      // Test PDF export
      console.log('Testing PDF export...');
      const pdfResponse = await fetch(`http://localhost:3000/api/register100/${register100Submission._id}/export/pdf`);
      const pdfContent = await pdfResponse.text();
      
      console.log(`PDF Export Status: ${pdfResponse.status}`);
      console.log(`PDF Content Length: ${pdfContent.length} characters`);
      
      // Check for comprehensive elements
      const pdfChecks = [
        { name: 'Fixed Header', found: pdfContent.includes('รายงานข้อมูลโรงเรียน (ฉบับสมบูรณ์)') && !pdfContent.includes('100 ปี') },
        { name: 'School Basic Info', found: pdfContent.includes('ข้อมูลพื้นฐานสถานศึกษา') },
        { name: 'Principal Info', found: pdfContent.includes('ข้อมูลผู้บริหาร') },
        { name: 'Contact Person', found: pdfContent.includes('ข้อมูลผู้ติดต่อ') },
        { name: 'Teacher Table', found: pdfContent.includes('ข้อมูลครูผู้สอนดนตรีไทย') },
        { name: 'Awards Table', found: pdfContent.includes('รางวัลและเกียรติคุณ') },
        { name: 'New Footer', found: pdfContent.includes('ระบบบริหารจัดการข้อมูลกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์') }
      ];
      
      console.log('\nPDF Content Check Results:');
      pdfChecks.forEach(check => {
        console.log(`✓ ${check.name}: ${check.found ? '✅ Found' : '❌ Not Found'}`);
      });
      
      // Test Excel export
      console.log('\nTesting Excel export...');
      const excelResponse = await fetch(`http://localhost:3000/api/register100/${register100Submission._id}/export/excel`);
      console.log(`Excel Export Status: ${excelResponse.status}`);
      
      const foundCount = pdfChecks.filter(check => check.found).length;
      console.log(`\nRegister100 Summary: ${foundCount}/${pdfChecks.length} elements found`);
    }
    
    console.log('\n🎉 Export testing completed!');
    
  } catch (error) {
    console.error('Error testing fixed exports:', error);
  } finally {
    await client.close();
  }
}

testFixedExports();