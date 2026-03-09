const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function testExport() {
  try {
    console.log('🔍 Testing export functionality...');
    
    const client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db(dbName);
    const collection = database.collection('register100_submissions');
    
    // Find the latest submission
    const submission = await collection.findOne({}, { sort: { _id: -1 } });
    
    if (!submission) {
      console.log('❌ No submissions found');
      await client.close();
      return;
    }
    
    console.log('✅ Found submission:', submission._id);
    console.log('📋 School Name:', submission.reg100_schoolName || submission.schoolName || 'ไม่ระบุ');
    console.log('📊 Total Score:', submission.total_score || 0);
    
    // Test CSV generation logic
    const schoolName = submission.reg100_schoolName || submission.schoolName || 'ไม่ระบุ';
    const schoolProvince = submission.reg100_schoolProvince || submission.schoolProvince || 'ไม่ระบุ';
    const totalScore = submission.total_score || 0;

    const csvContent = [
      ['รายงานข้อมูลโรงเรียนดนตรีไทย 100%'],
      [''],
      ['ข้อมูลพื้นฐาน'],
      ['ชื่อสถานศึกษา', schoolName],
      ['จังหวัด', schoolProvince],
      ['School ID', submission.schoolId || 'ไม่ระบุ'],
      [''],
      ['คะแนนรวม', `${totalScore} / 100 คะแนน`],
    ];

    const csv = csvContent.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    console.log('📄 CSV Preview (first 200 chars):');
    console.log(csv.substring(0, 200) + '...');
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `register100-${schoolName}-${timestamp}.csv`;
    
    console.log('📁 Generated filename:', filename);
    console.log('✅ Export logic test completed successfully');
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error testing export:', error);
  }
}

testExport();