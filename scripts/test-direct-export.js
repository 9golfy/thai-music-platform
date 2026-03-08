const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testDirectExport() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    const registerSupportCollection = database.collection('register_support_submissions');
    const submission = await registerSupportCollection.findOne({});
    
    if (submission) {
      console.log(`Testing direct export for submission: ${submission._id}`);
      
      // Wait a moment to ensure server has reloaded
      console.log('Waiting 3 seconds for server to reload...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Test PDF export with cache-busting
      const timestamp = Date.now();
      const pdfResponse = await fetch(`http://localhost:3000/api/register-support/${submission._id}/export/pdf?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      const pdfContent = await pdfResponse.text();
      
      console.log(`\nPDF Export Status: ${pdfResponse.status}`);
      console.log(`PDF Content Length: ${pdfContent.length} characters`);
      
      // Check for specific comprehensive elements
      const checks = [
        { name: 'Comprehensive Title', text: 'ฉบับสมบูรณ์', found: pdfContent.includes('ฉบับสมบูรณ์') },
        { name: 'School Basic Info', text: 'ข้อมูลพื้นฐานสถานศึกษา', found: pdfContent.includes('ข้อมูลพื้นฐานสถานศึกษา') },
        { name: 'Principal Info', text: 'ข้อมูลผู้บริหาร', found: pdfContent.includes('ข้อมูลผู้บริหาร') },
        { name: 'Contact Person', text: 'ข้อมูลผู้ติดต่อ', found: pdfContent.includes('ข้อมูลผู้ติดต่อ') },
        { name: 'New Footer', text: 'ระบบบริหารจัดการข้อมูลกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์', found: pdfContent.includes('ระบบบริหารจัดการข้อมูลกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์') },
        { name: 'Address Field', text: 'ที่อยู่', found: pdfContent.includes('ที่อยู่') },
        { name: 'Phone Field', text: 'โทรศัพท์', found: pdfContent.includes('โทรศัพท์') }
      ];
      
      console.log('\nDetailed Content Check:');
      checks.forEach(check => {
        console.log(`✓ ${check.name}: ${check.found ? '✅ Found' : '❌ Not Found'}`);
      });
      
      const foundCount = checks.filter(check => check.found).length;
      console.log(`\nSummary: ${foundCount}/${checks.length} comprehensive elements found`);
      
      if (foundCount >= 5) {
        console.log('🎉 Register-Support export is now working with comprehensive data!');
      } else {
        console.log('⚠️  Still showing old content - server may need restart');
        
        // Show sample content for debugging
        console.log('\n=== Sample Content (first 1000 chars) ===');
        console.log(pdfContent.substring(0, 1000));
      }
      
    } else {
      console.log('No register-support submissions found');
    }
    
  } catch (error) {
    console.error('Error testing direct export:', error);
  } finally {
    await client.close();
  }
}

testDirectExport();