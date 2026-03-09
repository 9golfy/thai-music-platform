const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function exportAllScores() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    
    console.log('=== ข้อมูลคะแนนทั้งหมดจากฐานข้อมูล ===\n');

    // ดึงข้อมูล Register100 Submissions
    console.log('📊 REGISTER100 SUBMISSIONS:');
    console.log('=' .repeat(80));
    
    const register100Collection = database.collection('register100_submissions');
    const register100Data = await register100Collection.find({}).sort({ createdAt: -1 }).toArray();
    
    register100Data.forEach((submission, index) => {
      console.log(`\n--- Register100 #${index + 1} ---`);
      console.log(`ID: ${submission._id}`);
      console.log(`School ID: ${submission.schoolId}`);
      console.log(`ชื่อโรงเรียน: ${submission.reg100_schoolName || submission.schoolName || 'ไม่ระบุ'}`);
      console.log(`จังหวัด: ${submission.reg100_schoolProvince || submission.schoolProvince || 'ไม่ระบุ'}`);
      console.log(`อีเมลครู: ${submission.reg100_mgtEmail || submission.email || 'ไม่ระบุ'}`);
      console.log(`วันที่สร้าง: ${submission.createdAt}`);
      
      console.log('\n🎯 คะแนนรายละเอียด:');
      console.log(`  การฝึกอบรมครู: ${submission.teacher_training_score || 0}/20`);
      console.log(`  คุณวุฒิครู: ${submission.teacher_qualification_score || 0}/20`);
      console.log(`  การสนับสนุนจากองค์กร: ${submission.support_from_org_score || 0}/5`);
      console.log(`  การสนับสนุนจากภายนอก: ${submission.support_from_external_score || 0}/15`);
      console.log(`  รางวัล: ${submission.award_score || 0}/20`);
      console.log(`  กิจกรรมภายใน: ${submission.activity_within_province_internal_score || 0}/5`);
      console.log(`  กิจกรรมภายนอก: ${submission.activity_within_province_external_score || 0}/5`);
      console.log(`  กิจกรรมต่างจังหวัด: ${submission.activity_outside_province_score || 0}/5`);
      console.log(`  กิจกรรม PR: ${submission.pr_activity_score || 0}/5`);
      
      console.log('\n📈 คะแนนรวม:');
      console.log(`  total_score (แบบเก่า): ${submission.total_score || 0}`);
      console.log(`  totalScore (แบบใหม่): ${submission.totalScore || 0}`);
      console.log(`  เกรด: ${submission.grade || 'ไม่ระบุ'}`);
      
      if (submission.scores) {
        console.log(`  scores object: ${JSON.stringify(submission.scores)}`);
      }
    });

    // ดึงข้อมูล Register Support Submissions
    console.log('\n\n📊 REGISTER SUPPORT SUBMISSIONS:');
    console.log('=' .repeat(80));
    
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportData = await registerSupportCollection.find({}).sort({ createdAt: -1 }).toArray();
    
    registerSupportData.forEach((submission, index) => {
      console.log(`\n--- Register Support #${index + 1} ---`);
      console.log(`ID: ${submission._id}`);
      console.log(`School ID: ${submission.schoolId}`);
      console.log(`ชื่อโรงเรียน: ${submission.regsup_schoolName || submission.schoolName || 'ไม่ระบุ'}`);
      console.log(`จังหวัด: ${submission.regsup_schoolProvince || submission.schoolProvince || 'ไม่ระบุ'}`);
      console.log(`อีเมลครู: ${submission.regsup_mgtEmail || submission.email || 'ไม่ระบุ'}`);
      console.log(`วันที่สร้าง: ${submission.createdAt}`);
      
      console.log('\n🎯 คะแนนรายละเอียด:');
      console.log(`  การฝึกอบรมครู: ${submission.teacher_training_score || 0}/20`);
      console.log(`  คุณวุฒิครู: ${submission.teacher_qualification_score || 0}/20`);
      console.log(`  การสนับสนุนจากองค์กร: ${submission.support_from_org_score || 0}/5`);
      console.log(`  การสนับสนุนจากภายนอก: ${submission.support_from_external_score || 0}/15`);
      console.log(`  รางวัล: ${submission.award_score || 0}/20`);
      console.log(`  กิจกรรมภายใน: ${submission.activity_within_province_internal_score || 0}/5`);
      console.log(`  กิจกรรมภายนอก: ${submission.activity_within_province_external_score || 0}/5`);
      console.log(`  กิจกรรมต่างจังหวัด: ${submission.activity_outside_province_score || 0}/5`);
      console.log(`  กิจกรรม PR: ${submission.pr_activity_score || 0}/5`);
      
      console.log('\n📈 คะแนนรวม:');
      console.log(`  total_score (แบบเก่า): ${submission.total_score || 0}`);
      console.log(`  totalScore (แบบใหม่): ${submission.totalScore || 0}`);
      console.log(`  เกรด: ${submission.grade || 'ไม่ระบุ'}`);
      
      if (submission.scores) {
        console.log(`  scores object: ${JSON.stringify(submission.scores)}`);
      }
    });

    // สรุปสถิติ
    console.log('\n\n📈 สรุปสถิติ:');
    console.log('=' .repeat(50));
    console.log(`จำนวน Register100 Submissions: ${register100Data.length}`);
    console.log(`จำนวน Register Support Submissions: ${registerSupportData.length}`);
    
    // คะแนนเฉลี่ย Register100
    if (register100Data.length > 0) {
      const avgScore100 = register100Data.reduce((sum, sub) => sum + (sub.total_score || 0), 0) / register100Data.length;
      console.log(`คะแนนเฉลี่ย Register100: ${avgScore100.toFixed(2)}`);
    }
    
    // คะแนนเฉลี่ย Register Support
    if (registerSupportData.length > 0) {
      const avgScoreSupport = registerSupportData.reduce((sum, sub) => sum + (sub.total_score || 0), 0) / registerSupportData.length;
      console.log(`คะแนนเฉลี่ย Register Support: ${avgScoreSupport.toFixed(2)}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

exportAllScores();