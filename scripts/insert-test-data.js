const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

// Sample data arrays
const provinces = [
  'กรุงเทพมหานคร', 'เชียงใหม่', 'เชียงราย', 'ลำปาง', 'ลำพูน', 'แม่ฮ่องสอน', 'น่าน', 'พะเยา', 'แพร่', 'อุตรดิตถ์',
  'นครราชสีมา', 'บุรีรัมย์', 'สุรินทร์', 'ศิลาแลง', 'อุบลราชธานี', 'ยโสธร', 'ชัยภูมิ', 'อำนาจเจริญ', 'หนองบัวลำภู', 'หนองคาย',
  'เลย', 'อุดรธานี', 'สกลนคร', 'มุกดาหาร', 'ร้อยเอ็ด', 'กาฬสินธุ์', 'มหาสารคาม', 'ขอนแก่น', 'บึงกาฬ', 'นครพนม'
];

const schoolLevels = [
  'ประถมศึกษา', 'มัธยมศึกษาตอนต้น', 'มัธยมศึกษาตอนปลาย', 'ประถมและมัธยมศึกษา'
];

const qualifications = [
  'ปริญญาตรี ดนตรีไทย', 'ปริญญาโท ดนตรีไทย', 'ปริญญาเอก ดนตรีไทย', 
  'ประกาศนียบัตร ดนตรีไทย', 'อนุปริญญา ดนตรีไทย', 'ครูผู้ช่วย'
];

const instruments = [
  'ระนาดเอก', 'ระนาดทุ้ม', 'โขน', 'ฆ้องวงใหญ่', 'ฆ้องวงเล็ก', 'ตะโพน', 'กลองทัด', 'ปี่ใน', 'ปี่นอก', 'ซอด้วง', 'ซออู้', 'จะเข้'
];

const awardLevels = ['อำเภอ', 'จังหวัด', 'ภาค', 'ประเทศ'];

// Helper functions
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBoolean() {
  return Math.random() > 0.5;
}

function generateSchoolName(index) {
  const prefixes = ['โรงเรียน', 'โรงเรียนบ้าน', 'โรงเรียนวัด'];
  const names = [
    'ดนตรีไทยสร้างสรรค์', 'วิทยาลัยดนตรี', 'ศิลปกรรมไทย', 'วัฒนธรรมไทย', 'ดนตรีพื้นบ้าน',
    'ศิลปะการแสดง', 'นาฏศิลป์ไทย', 'ดนตรีคลาสสิก', 'ศิลปะแห่งแผ่นดิน', 'วิทยาศาสตร์และศิลปะ',
    'บ้านสวนดนตรี', 'วัดป่าดนตรี', 'ชุมชนศิลปกรรม', 'พัฒนาศิลปะ', 'สร้างสรรค์ดนตรี'
  ];
  return `${randomChoice(prefixes)}${randomChoice(names)}${index}`;
}

function generateTeacher(index) {
  const firstNames = ['สมชาย', 'สมหญิง', 'วิชัย', 'วิภา', 'ประยุทธ', 'ประภา', 'สุรชัย', 'สุภา', 'อนุชา', 'อนุภา'];
  const lastNames = ['ใจดี', 'มั่นคง', 'สุขใส', 'เก่งกาจ', 'ดีเด่น', 'เป็นสุข', 'มีชัย', 'สว่าง', 'ใสใจ', 'รักดี'];
  
  return {
    teacherName: `${randomChoice(firstNames)} ${randomChoice(lastNames)}`,
    teacherQualification: randomChoice(qualifications),
    teacherExperience: randomInt(1, 25),
    teacherInstrument: randomChoice(instruments)
  };
}

function generateEmail(schoolName, index) {
  const cleanName = schoolName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return `test${index}${cleanName}@testschool.com`;
}

function generateRegister100Data(index) {
  const schoolName = generateSchoolName(index);
  const province = randomChoice(provinces);
  const level = randomChoice(schoolLevels);
  const teachers = Array.from({ length: randomInt(2, 8) }, (_, i) => generateTeacher(i));
  
  // Calculate scores based on realistic data
  const teacherTrainingScore = randomInt(0, 4) * 5; // 0-20
  const teacherQualificationScore = Math.min(new Set(teachers.map(t => t.teacherQualification)).size * 5, 20); // 0-20
  const supportFromOrgScore = randomBoolean() ? 5 : 0; // 0 or 5
  const supportFromExternalScore = randomChoice([0, 5, 10, 15]); // 0, 5, 10, or 15
  const awardScore = randomChoice([0, 5, 10, 15, 20]); // 0, 5, 10, 15, or 20
  const activityInternalScore = randomBoolean() ? 5 : 0; // 0 or 5
  const activityExternalScore = randomBoolean() ? 5 : 0; // 0 or 5
  const activityOutsideScore = randomBoolean() ? 5 : 0; // 0 or 5
  const prActivityScore = randomBoolean() ? 5 : 0; // 0 or 5
  
  const totalScore = teacherTrainingScore + teacherQualificationScore + supportFromOrgScore + 
                    supportFromExternalScore + awardScore + activityInternalScore + 
                    activityExternalScore + activityOutsideScore + prActivityScore;

  return {
    // Basic school info
    reg100_schoolName: schoolName,
    reg100_schoolProvince: province,
    reg100_schoolLevel: level,
    reg100_schoolAddress: `123 หมู่ ${randomInt(1, 12)} ตำบลทดสอบ อำเภอทดสอบ จังหวัด${province} ${randomInt(10000, 99999)}`,
    reg100_schoolPhone: `0${randomInt(2, 9)}${randomInt(1000000, 9999999)}`,
    reg100_staffCount: randomInt(10, 100),
    reg100_studentCount: randomInt(100, 1000),
    
    // Management info
    mgtFullName: `ผู้อำนวยการ${randomChoice(['สมชาย', 'สมหญิง', 'วิชัย', 'วิภา'])} ${randomChoice(['ใจดี', 'มั่นคง', 'สุขใส'])}`,
    mgtPosition: 'ผู้อำนวยการโรงเรียน',
    teacherEmail: generateEmail(schoolName, index),
    teacherPhone: `08${randomInt(10000000, 99999999)}`,
    
    // Teachers
    reg100_thaiMusicTeachers: teachers,
    
    // Training and qualifications
    reg100_isCompulsorySubject: randomBoolean(),
    reg100_hasAfterSchoolTeaching: randomBoolean(),
    reg100_hasElectiveSubject: randomBoolean(),
    reg100_hasLocalCurriculum: randomBoolean(),
    
    // Support
    reg100_hasSupportFromOrg: supportFromOrgScore > 0,
    reg100_supportFromExternal: Array.from({ length: supportFromExternalScore / 5 }, (_, i) => `องค์กรสนับสนุน ${i + 1}`),
    
    // Awards
    reg100_awards: awardScore > 0 ? [{
      awardName: `รางวัลดนตรีไทยดีเด่น ปี ${2020 + randomInt(0, 4)}`,
      awardLevel: randomChoice(awardLevels),
      awardYear: 2020 + randomInt(0, 4)
    }] : [],
    
    // Activities
    reg100_activitiesWithinProvinceInternal: Array.from({ length: activityInternalScore > 0 ? randomInt(3, 6) : randomInt(0, 2) }, (_, i) => `กิจกรรมภายในจังหวัด ${i + 1}`),
    reg100_activitiesWithinProvinceExternal: Array.from({ length: activityExternalScore > 0 ? randomInt(3, 6) : randomInt(0, 2) }, (_, i) => `กิจกรรมภายนอกจังหวัด ${i + 1}`),
    reg100_activitiesOutsideProvince: Array.from({ length: activityOutsideScore > 0 ? randomInt(3, 6) : randomInt(0, 2) }, (_, i) => `กิจกรรมนอกจังหวัด ${i + 1}`),
    
    // PR Activities
    reg100_prActivities: Array.from({ length: prActivityScore > 0 ? randomInt(3, 6) : randomInt(0, 2) }, (_, i) => `กิจกรรมประชาสัมพันธ์ ${i + 1}`),
    reg100_DCP_PR_Channel_FACEBOOK: randomBoolean(),
    reg100_DCP_PR_Channel_YOUTUBE: randomBoolean(),
    reg100_DCP_PR_Channel_Tiktok: randomBoolean(),
    
    // Scores
    teacher_training_score: teacherTrainingScore,
    teacher_qualification_score: teacherQualificationScore,
    support_from_org_score: supportFromOrgScore,
    support_from_external_score: supportFromExternalScore,
    award_score: awardScore,
    activity_within_province_internal_score: activityInternalScore,
    activity_within_province_external_score: activityExternalScore,
    activity_outside_province_score: activityOutsideScore,
    pr_activity_score: prActivityScore,
    total_score: totalScore,
    
    // Metadata
    schoolId: `SCH${String(202600000 + index).padStart(9, '0')}`,
    createdAt: new Date(Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000).toISOString(),
    status: randomChoice(['pending', 'approved', 'under_review'])
  };
}

function generateRegisterSupportData(index) {
  const schoolName = generateSchoolName(index + 100); // Different names from register100
  const province = randomChoice(provinces);
  const level = randomChoice(schoolLevels);
  const teachers = Array.from({ length: randomInt(3, 9) }, (_, i) => generateTeacher(i));
  
  // Calculate scores for register-support (different scoring system)
  const teacherTrainingScore = randomInt(0, 4) * 3; // 0-12
  const teacherQualificationScore = Math.min(teachers.length * 2, 18); // 0-18
  const supportFromOrgScore = randomBoolean() ? 4 : 0; // 0 or 4
  const supportFromExternalScore = randomChoice([0, 3, 6, 9]); // 0, 3, 6, or 9
  const awardScore = randomChoice([0, 3, 6, 9, 12]); // 0, 3, 6, 9, or 12
  const activityScore = randomInt(0, 3) * 4; // 0-12
  const prActivityScore = randomBoolean() ? 4 : 0; // 0 or 4
  
  const totalScore = teacherTrainingScore + teacherQualificationScore + supportFromOrgScore + 
                    supportFromExternalScore + awardScore + activityScore + prActivityScore;

  return {
    // Basic school info
    regsup_schoolName: schoolName,
    regsup_schoolProvince: province,
    regsup_schoolLevel: level,
    regsup_schoolAddress: `456 หมู่ ${randomInt(1, 12)} ตำบลสนับสนุน อำเภอส่งเสริม จังหวัด${province} ${randomInt(10000, 99999)}`,
    regsup_schoolPhone: `0${randomInt(2, 9)}${randomInt(1000000, 9999999)}`,
    regsup_staffCount: randomInt(15, 120),
    regsup_studentCount: randomInt(150, 1200),
    
    // Management info
    mgtFullName: `ผู้อำนวยการ${randomChoice(['อนุชา', 'อนุภา', 'สุรชัย', 'สุภา'])} ${randomChoice(['เก่งกาจ', 'ดีเด่น', 'เป็นสุข'])}`,
    mgtPosition: 'ผู้อำนวยการโรงเรียน',
    teacherEmail: generateEmail(schoolName, index + 100),
    teacherPhone: `09${randomInt(10000000, 99999999)}`,
    
    // Teachers
    regsup_thaiMusicTeachers: teachers,
    
    // Training and support activities
    regsup_hasTrainingProgram: randomBoolean(),
    regsup_hasWorkshops: randomBoolean(),
    regsup_hasCommunityProgram: randomBoolean(),
    regsup_hasStudentExchange: randomBoolean(),
    
    // Support from organizations
    regsup_hasSupportFromOrg: supportFromOrgScore > 0,
    regsup_supportFromExternal: Array.from({ length: supportFromExternalScore / 3 }, (_, i) => `หน่วยงานสนับสนุน ${i + 1}`),
    
    // Awards and recognition
    regsup_awards: awardScore > 0 ? [{
      awardName: `รางวัลโรงเรียนส่งเสริมดนตรีไทยดีเด่น ปี ${2020 + randomInt(0, 4)}`,
      awardLevel: randomChoice(awardLevels),
      awardYear: 2020 + randomInt(0, 4)
    }] : [],
    
    // Activities and programs
    regsup_activities: Array.from({ length: activityScore > 0 ? randomInt(3, 8) : randomInt(0, 2) }, (_, i) => `โครงการส่งเสริมดนตรีไทย ${i + 1}`),
    
    // PR and outreach
    regsup_prActivities: Array.from({ length: prActivityScore > 0 ? randomInt(3, 5) : randomInt(0, 2) }, (_, i) => `กิจกรรมประชาสัมพันธ์ ${i + 1}`),
    regsup_DCP_PR_Channel_FACEBOOK: randomBoolean(),
    regsup_DCP_PR_Channel_YOUTUBE: randomBoolean(),
    regsup_DCP_PR_Channel_Tiktok: randomBoolean(),
    
    // Scores
    teacher_training_score: teacherTrainingScore,
    teacher_qualification_score: teacherQualificationScore,
    support_from_org_score: supportFromOrgScore,
    support_from_external_score: supportFromExternalScore,
    award_score: awardScore,
    activity_score: activityScore,
    pr_activity_score: prActivityScore,
    total_score: totalScore,
    
    // Metadata
    schoolId: `SUP${String(202600000 + index).padStart(9, '0')}`,
    createdAt: new Date(Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000).toISOString(),
    status: randomChoice(['pending', 'approved', 'under_review'])
  };
}

async function insertTestData() {
  let client;
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('thai_music_school');
    const register100Collection = db.collection('register100_submissions');
    const registerSupportCollection = db.collection('register_support_submissions');
    const usersCollection = db.collection('users');
    
    console.log('📊 Generating test data...');
    
    // Generate Register100 data
    const register100Data = [];
    const register100Users = [];
    
    for (let i = 1; i <= 30; i++) {
      const data = generateRegister100Data(i);
      register100Data.push(data);
      
      // Create corresponding user
      register100Users.push({
        email: data.teacherEmail,
        password: '$2b$10$dummy.hash.for.testing.purposes.only', // Dummy hash
        role: 'teacher',
        firstName: data.mgtFullName.split(' ')[0] || 'Teacher',
        lastName: data.mgtFullName.split(' ').slice(1).join(' ') || '',
        phone: data.teacherPhone,
        schoolId: data.schoolId,
        isActive: true,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.createdAt)
      });
    }
    
    // Generate Register-Support data
    const registerSupportData = [];
    const registerSupportUsers = [];
    
    for (let i = 1; i <= 30; i++) {
      const data = generateRegisterSupportData(i);
      registerSupportData.push(data);
      
      // Create corresponding user
      registerSupportUsers.push({
        email: data.teacherEmail,
        password: '$2b$10$dummy.hash.for.testing.purposes.only', // Dummy hash
        role: 'teacher',
        firstName: data.mgtFullName.split(' ')[0] || 'Teacher',
        lastName: data.mgtFullName.split(' ').slice(1).join(' ') || '',
        phone: data.teacherPhone,
        schoolId: data.schoolId,
        isActive: true,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.createdAt)
      });
    }
    
    console.log('💾 Inserting Register100 data...');
    const register100Result = await register100Collection.insertMany(register100Data);
    console.log(`✅ Inserted ${register100Result.insertedCount} Register100 records`);
    
    console.log('💾 Inserting Register-Support data...');
    const registerSupportResult = await registerSupportCollection.insertMany(registerSupportData);
    console.log(`✅ Inserted ${registerSupportResult.insertedCount} Register-Support records`);
    
    console.log('👥 Inserting user accounts...');
    const allUsers = [...register100Users, ...registerSupportUsers];
    
    // Insert users one by one to handle duplicates
    let userInsertCount = 0;
    for (const user of allUsers) {
      try {
        const existingUser = await usersCollection.findOne({ email: user.email });
        if (!existingUser) {
          await usersCollection.insertOne(user);
          userInsertCount++;
        }
      } catch (error) {
        console.log(`⚠️ Skipped duplicate user: ${user.email}`);
      }
    }
    console.log(`✅ Inserted ${userInsertCount} user accounts`);
    
    // Display summary
    console.log('\n📈 Test Data Summary:');
    console.log('='.repeat(50));
    console.log(`Register100 submissions: ${register100Result.insertedCount}`);
    console.log(`Register-Support submissions: ${registerSupportResult.insertedCount}`);
    console.log(`User accounts created: ${userInsertCount}`);
    console.log(`Total records: ${register100Result.insertedCount + registerSupportResult.insertedCount}`);
    
    // Display grade distribution
    const register100Grades = register100Data.reduce((acc, item) => {
      const score = item.total_score;
      let grade;
      if (score >= 90) grade = 'A';
      else if (score >= 70) grade = 'B';
      else if (score >= 50) grade = 'C';
      else grade = 'F';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});
    
    const registerSupportGrades = registerSupportData.reduce((acc, item) => {
      const score = item.total_score;
      let grade;
      if (score >= 90) grade = 'A';
      else if (score >= 70) grade = 'B';
      else if (score >= 50) grade = 'C';
      else grade = 'F';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📊 Grade Distribution:');
    console.log('Register100:', register100Grades);
    console.log('Register-Support:', registerSupportGrades);
    
    console.log('\n🎉 Test data insertion completed successfully!');
    console.log('You can now test the filtering and pagination features at:');
    console.log('- http://localhost:3000/dcp-admin/dashboard/register100');
    console.log('- http://localhost:3000/dcp-admin/dashboard/register-support');
    
  } catch (error) {
    console.error('❌ Error inserting test data:', error);
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
  insertTestData()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { insertTestData };