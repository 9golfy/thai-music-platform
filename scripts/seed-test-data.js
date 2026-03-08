// Seed Test Data Script
// Run: node scripts/seed-test-data.js

require('dotenv').config();
const { MongoClient } = require('mongodb');

// Use localhost for running from host machine
const uri = process.env.MONGODB_URI?.replace('mongo:', 'localhost:') || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

// Sample data for Register100
const register100Data = [
  {
    schoolId: 'SCH-20260228-0001',
    schoolName: 'โรงเรียนดนตรีไทย 100% AWS ทดสอบ 9 ครู',
    province: 'กรุงเทพมหานคร',
    district: 'บางรัก',
    subdistrict: 'สีลม',
    address: '123 ถนนสีลม',
    postalCode: '10500',
    phone: '0899999999',
    email: 'school1@test.com',
    schoolLevel: 'มัธยมศึกษา',
    principalName: 'นายทดสอบ ระบบ',
    principalPhone: '0812345678',
    teachers: Array.from({ length: 9 }, (_, i) => ({
      name: `ครูทดสอบ ${i + 1}`,
      phone: `081234567${i}`,
      email: `teacher${i + 1}@test.com`,
      subject: 'ดนตรีไทย',
    })),
    step1: {
      hasPolicy: true,
      policyDetails: 'มีนโยบายส่งเสริมดนตรีไทย',
      score: 10,
    },
    step2: {
      hasCurriculum: true,
      curriculumDetails: 'มีหลักสูตรดนตรีไทยครบถ้วน',
      score: 15,
    },
    step3: {
      hasTeachers: true,
      teacherCount: 9,
      score: 20,
    },
    step4: {
      hasInstruments: true,
      instrumentList: 'ระนาด, ฆ้อง, ซอ, ขลุ่ย',
      score: 15,
    },
    step5: {
      hasActivities: true,
      activityDetails: 'จัดกิจกรรมดนตรีไทยทุกสัปดาห์',
      score: 10,
    },
    step6: {
      hasPerformance: true,
      performanceDetails: 'แสดงในงานสำคัญของโรงเรียน',
      score: 10,
    },
    step7: {
      hasAwards: true,
      awardDetails: 'ได้รับรางวัลระดับเขต',
      score: 10,
    },
    step8: {
      hasDevelopment: true,
      developmentPlan: 'มีแผนพัฒนาต่อเนื่อง',
      score: 10,
    },
    totalScore: 100,
    status: 'completed',
    createdAt: new Date('2026-02-27T10:00:00Z'),
    updatedAt: new Date('2026-02-27T10:00:00Z'),
  },
  {
    schoolId: 'SCH-20260228-0002',
    schoolName: 'โรงเรียนดนตรีไทย 100% AWS ทดสอบ 9 ครู',
    province: 'เชียงใหม่',
    district: 'เมือง',
    subdistrict: 'ช้างเผือก',
    address: '456 ถนนห้วยแก้ว',
    postalCode: '50300',
    phone: '0899999998',
    email: 'school2@test.com',
    schoolLevel: 'ประถมศึกษา',
    principalName: 'นางสาวทดสอบ ระบบ',
    principalPhone: '0812345679',
    teachers: Array.from({ length: 9 }, (_, i) => ({
      name: `ครูเชียงใหม่ ${i + 1}`,
      phone: `081234568${i}`,
      email: `cmteacher${i + 1}@test.com`,
      subject: 'ดนตรีไทย',
    })),
    step1: { hasPolicy: true, policyDetails: 'นโยบายส่งเสริม', score: 10 },
    step2: { hasCurriculum: true, curriculumDetails: 'หลักสูตรครบ', score: 15 },
    step3: { hasTeachers: true, teacherCount: 9, score: 20 },
    step4: { hasInstruments: true, instrumentList: 'ระนาด, ฆ้อง', score: 15 },
    step5: { hasActivities: true, activityDetails: 'กิจกรรมสม่ำเสมอ', score: 10 },
    step6: { hasPerformance: true, performanceDetails: 'แสดงประจำ', score: 10 },
    step7: { hasAwards: true, awardDetails: 'รางวัลระดับจังหวัด', score: 10 },
    step8: { hasDevelopment: true, developmentPlan: 'แผนพัฒนา', score: 10 },
    totalScore: 100,
    status: 'completed',
    createdAt: new Date('2026-02-26T14:22:37Z'),
    updatedAt: new Date('2026-02-26T14:22:37Z'),
  },
  {
    schoolId: 'SCH-20260228-0003',
    schoolName: 'โรงเรียนทดสอบคะแนนบางส่วน',
    province: 'ภูเก็ต',
    district: 'เมือง',
    subdistrict: 'ตลาดใหญ่',
    address: '789 ถนนภูเก็ต',
    postalCode: '83000',
    phone: '0899999997',
    email: 'school3@test.com',
    schoolLevel: 'มัธยมศึกษา',
    principalName: 'นายภูเก็ต ทดสอบ',
    principalPhone: '0812345680',
    teachers: Array.from({ length: 5 }, (_, i) => ({
      name: `ครูภูเก็ต ${i + 1}`,
      phone: `081234569${i}`,
      email: `pkteacher${i + 1}@test.com`,
      subject: 'ดนตรีไทย',
    })),
    step1: { hasPolicy: true, policyDetails: 'มีนโยบาย', score: 8 },
    step2: { hasCurriculum: true, curriculumDetails: 'หลักสูตรบางส่วน', score: 10 },
    step3: { hasTeachers: true, teacherCount: 5, score: 12 },
    step4: { hasInstruments: true, instrumentList: 'ระนาด', score: 8 },
    step5: { hasActivities: false, activityDetails: '', score: 0 },
    step6: { hasPerformance: true, performanceDetails: 'แสดงบางครั้ง', score: 5 },
    step7: { hasAwards: false, awardDetails: '', score: 0 },
    step8: { hasDevelopment: true, developmentPlan: 'กำลังพัฒนา', score: 2 },
    totalScore: 45,
    status: 'in-progress',
    createdAt: new Date('2026-02-26T14:20:57Z'),
    updatedAt: new Date('2026-02-26T14:20:57Z'),
  },
];

// Sample data for Register Support
const registerSupportData = [
  {
    schoolId: 'SCH-20260228-0004',
    schoolName: 'โรงเรียนสนับสนุนดนตรีไทย AWS ทดสอบ 9 ครู',
    province: 'กรุงเทพมหานคร',
    district: 'ปทุมวัน',
    subdistrict: 'ปทุมวัน',
    address: '321 ถนนพญาไท',
    postalCode: '10330',
    phone: '0899999996',
    email: 'support1@test.com',
    schoolLevel: 'มัธยมศึกษา',
    principalName: 'นายสนับสนุน ทดสอบ',
    principalPhone: '0812345681',
    teachers: Array.from({ length: 9 }, (_, i) => ({
      name: `ครูสนับสนุน ${i + 1}`,
      phone: `081234570${i}`,
      email: `supportteacher${i + 1}@test.com`,
      subject: 'ดนตรีไทย',
    })),
    step1: { hasSupport: true, supportDetails: 'สนับสนุนเต็มที่', score: 10 },
    step2: { hasSpace: true, spaceDetails: 'มีห้องฝึกซ้อม', score: 15 },
    step3: { hasTeachers: true, teacherCount: 9, score: 20 },
    step4: { hasInstruments: true, instrumentList: 'ระนาด, ฆ้อง, ซอ, ขลุ่ย, ปี่', score: 15 },
    step5: { hasActivities: true, activityDetails: 'จัดกิจกรรมทุกเดือน', score: 10 },
    step6: { hasCollaboration: true, collaborationDetails: 'ร่วมมือกับชุมชน', score: 10 },
    step7: { hasPromotion: true, promotionDetails: 'ประชาสัมพันธ์อย่างต่อเนื่อง', score: 10 },
    step8: { hasFuturePlan: true, futurePlan: 'มีแผนระยะยาว', score: 10 },
    totalScore: 100,
    status: 'completed',
    createdAt: new Date('2026-02-27T09:00:00Z'),
    updatedAt: new Date('2026-02-27T09:00:00Z'),
  },
  {
    schoolId: 'SCH-20260228-0005',
    schoolName: 'โรงเรียนสนับสนุนทดสอบเร็ว',
    province: 'นนทบุรี',
    district: 'เมือง',
    subdistrict: 'สวนใหญ่',
    address: '654 ถนนติวานนท์',
    postalCode: '11000',
    phone: '0899999995',
    email: 'support2@test.com',
    schoolLevel: 'ประถมศึกษา',
    principalName: 'นางสาวนนทบุรี ทดสอบ',
    principalPhone: '0812345682',
    teachers: Array.from({ length: 3 }, (_, i) => ({
      name: `ครูนนทบุรี ${i + 1}`,
      phone: `081234571${i}`,
      email: `ntteacher${i + 1}@test.com`,
      subject: 'ดนตรีไทย',
    })),
    step1: { hasSupport: true, supportDetails: 'สนับสนุน', score: 8 },
    step2: { hasSpace: true, spaceDetails: 'มีพื้นที่', score: 12 },
    step3: { hasTeachers: true, teacherCount: 3, score: 10 },
    step4: { hasInstruments: true, instrumentList: 'ระนาด, ฆ้อง', score: 10 },
    step5: { hasActivities: true, activityDetails: 'มีกิจกรรม', score: 8 },
    step6: { hasCollaboration: false, collaborationDetails: '', score: 0 },
    step7: { hasPromotion: true, promotionDetails: 'ประชาสัมพันธ์', score: 5 },
    step8: { hasFuturePlan: true, futurePlan: 'มีแผน', score: 7 },
    totalScore: 60,
    status: 'in-progress',
    createdAt: new Date('2026-02-27T08:00:00Z'),
    updatedAt: new Date('2026-02-27T08:00:00Z'),
  },
  {
    schoolId: 'SCH-20260228-0006',
    schoolName: 'โรงเรียนสนับสนุนคะแนนบางส่วน',
    province: 'ระยอง',
    district: 'เมือง',
    subdistrict: 'ท่าประดู่',
    address: '987 ถนนสุขุมวิท',
    postalCode: '21000',
    phone: '0899999994',
    email: 'support3@test.com',
    schoolLevel: 'มัธยมศึกษา',
    principalName: 'นายระยอง ทดสอบ',
    principalPhone: '0812345683',
    teachers: Array.from({ length: 4 }, (_, i) => ({
      name: `ครูระยอง ${i + 1}`,
      phone: `081234572${i}`,
      email: `ryteacher${i + 1}@test.com`,
      subject: 'ดนตรีไทย',
    })),
    step1: { hasSupport: true, supportDetails: 'สนับสนุนบางส่วน', score: 5 },
    step2: { hasSpace: true, spaceDetails: 'พื้นที่จำกัด', score: 8 },
    step3: { hasTeachers: true, teacherCount: 4, score: 12 },
    step4: { hasInstruments: true, instrumentList: 'ระนาด', score: 6 },
    step5: { hasActivities: false, activityDetails: '', score: 0 },
    step6: { hasCollaboration: false, collaborationDetails: '', score: 0 },
    step7: { hasPromotion: true, promotionDetails: 'ประชาสัมพันธ์น้อย', score: 3 },
    step8: { hasFuturePlan: true, futurePlan: 'กำลังวางแผน', score: 4 },
    totalScore: 38,
    status: 'in-progress',
    createdAt: new Date('2026-02-26T15:00:00Z'),
    updatedAt: new Date('2026-02-26T15:00:00Z'),
  },
];

async function seedData() {
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db(dbName);

    // Seed Register100 data
    console.log('\n📝 Seeding Register100 data...');
    const register100Collection = database.collection('register100_submissions');
    
    // Clear existing data
    await register100Collection.deleteMany({});
    console.log('🗑️  Cleared existing Register100 data');
    
    // Insert new data
    const result100 = await register100Collection.insertMany(register100Data);
    console.log(`✅ Inserted ${result100.insertedCount} Register100 records`);

    // Seed Register Support data
    console.log('\n📝 Seeding Register Support data...');
    const registerSupportCollection = database.collection('register_support_submissions');
    
    // Clear existing data
    await registerSupportCollection.deleteMany({});
    console.log('🗑️  Cleared existing Register Support data');
    
    // Insert new data
    const resultSupport = await registerSupportCollection.insertMany(registerSupportData);
    console.log(`✅ Inserted ${resultSupport.insertedCount} Register Support records`);

    // Summary
    console.log('\n📊 Data Summary:');
    console.log(`   Register100: ${register100Data.length} schools`);
    console.log(`   Register Support: ${registerSupportData.length} schools`);
    console.log(`   Total: ${register100Data.length + registerSupportData.length} schools`);

    console.log('\n✅ Seed data completed successfully!');
    console.log('\n🎯 You can now view the data at:');
    console.log('   Register100: http://localhost:3001/dcp-admin/dashboard/register100');
    console.log('   Register Support: http://localhost:3001/dcp-admin/dashboard/register-support');

  } catch (error) {
    console.error('\n❌ Error seeding data:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run seed
seedData();
