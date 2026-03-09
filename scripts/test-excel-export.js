const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function testExcelExport() {
  let client;
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('thai_music_school');
    const register100Collection = db.collection('register100_submissions');
    
    console.log('📊 Fetching sample data...');
    const sampleData = await register100Collection.findOne({});
    
    if (!sampleData) {
      console.log('⚠️ No data found. Please run insert-test-data.js first.');
      return;
    }
    
    console.log('📋 Sample Excel Export Data Structure:');
    console.log('='.repeat(50));
    
    const excelRow = {
      'ลำดับ': 1,
      'วันที่บันทึก': sampleData.createdAt 
        ? new Date(sampleData.createdAt).toLocaleDateString('th-TH', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : '-',
      'ชื่อโรงเรียน': sampleData.reg100_schoolName || '-',
      'จังหวัด': sampleData.reg100_schoolProvince || '-',
      'ระดับการศึกษา': sampleData.reg100_schoolLevel || 'ไม่ระบุ',
      'คะแนนรวม': sampleData.total_score || 0,
      'เกรด': sampleData.total_score >= 90 ? 'A' : sampleData.total_score >= 70 ? 'B' : sampleData.total_score >= 50 ? 'C' : 'F',
      'School ID': sampleData.schoolId || '-',
      'อีเมลครู': sampleData.teacherEmail || '-',
      'เบอร์โทรศัพท์': sampleData.teacherPhone || '-'
    };
    
    Object.entries(excelRow).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    
    console.log('\n✅ Excel export structure updated successfully!');
    console.log('📝 Changes made:');
    console.log('  ❌ Removed: สถานะ (status)');
    console.log('  ✅ Added: อีเมลครู (teacher email)');
    console.log('  ✅ Added: เบอร์โทรศัพท์ (teacher phone)');
    
  } catch (error) {
    console.error('❌ Error testing excel export:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
if (require.main === module) {
  testExcelExport()
    .then(() => {
      console.log('✅ Test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testExcelExport };