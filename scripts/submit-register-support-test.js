const { MongoClient } = require('mongodb');

async function submitRegisterSupportTest() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/thai-music-platform');
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('submissions');
    
    // Create test data for register-support
    const testData = {
      _id: '69abcc45bdfd421b3126102f',
      submissionType: 'register-support',
      regsup_supportType: 'กลุ่ม',
      regsup_supportTypeGroupName: 'กลุ่มดนตรีไทยสนับสนุน 9 ครู',
      regsup_supportTypeGroupMemberCount: 25,
      regsup_schoolName: 'กลุ่มดนตรีไทยสนับสนุน 9 ครู - สถานศึกษา',
      regsup_schoolProvince: 'กรุงเทพมหานคร',
      regsup_schoolLevel: 'มัธยมศึกษา',
      regsup_affiliation: 'กระทรวงศึกษาธิการ (Ministry of Education)',
      regsup_staffCount: 60,
      regsup_studentCount: 800,
      regsup_studentCountByGrade: 'ม.1 = 120 คน, ม.2 = 115 คน, ม.3 = 110 คน, ม.4 = 105 คน, ม.5 = 100 คน, ม.6 = 95 คน',
      regsup_addressNo: '789',
      regsup_moo: '5',
      regsup_road: 'ถนนสนับสนุน',
      regsup_subDistrict: 'บางซื่อ',
      regsup_district: 'บางซื่อ',
      regsup_provinceAddress: 'กรุงเทพมหานคร',
      regsup_postalCode: '10300',
      regsup_phone: '0834567890',
      regsup_fax: '0234567890',
      
      // Administrator
      regsup_mgtFullName: 'ผู้จัดการโครงการ',
      regsup_mgtPosition: 'หัวหน้าฝ่ายดนตรี',
      regsup_mgtAddress: '789 ถนนสนับสนุน กรุงเทพฯ 10300',
      regsup_mgtPhone: '0845678901',
      regsup_mgtEmail: 'thaimusicplatform@gmail.com',
      
      // Readiness Items
      regsup_readinessItems: [
        { instrumentName: 'ขิม', quantity: '15', note: 'สภาพดี' },
        { instrumentName: 'ระนาด', quantity: '12', note: 'สภาพดี' },
        { instrumentName: 'โขน', quantity: '10', note: 'สภาพดี' },
        { instrumentName: 'กลอง', quantity: '8', note: 'สภาพดี' },
        { instrumentName: 'ซอ', quantity: '6', note: 'สภาพดี' }
      ],
      
      // Training checkboxes
      regsup_isCompulsorySubject: true,
      regsup_hasAfterSchoolTeaching: true,
      regsup_hasElectiveSubject: true,
      regsup_hasLocalCurriculum: true,
      
      // Teaching durations
      regsup_inClassInstructionDurations: [{
        inClassGradeLevel: 'ม.1-ม.6',
        inClassStudentCount: '645',
        inClassHoursPerSemester: '40',
        inClassHoursPerYear: '80'
      }],
      
      regsup_teachingLocation: 'ห้องดนตรีไทยพิเศษ ห้องประชุมใหญ่ และลานกิจกรรมกลางแจ้ง สำหรับการแสดงและการฝึกซ้อมขนาดใหญ่',
      
      // 9 Teachers
      regsup_thaiMusicTeachers: [
        { teacherQualification: 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย', teacherFullName: 'ครูสนับสนุน 1', teacherPosition: 'หัวหน้าแผนกดนตรีไทย', teacherEducation: 'ปริญญาโท ดนตรีไทยศึกษา', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform@gmail.com' },
        { teacherQualification: 'ครูภูมิปัญญาในท้องถิ่น', teacherFullName: 'ครูสนับสนุน 2', teacherPosition: 'ครูดนตรีไทย', teacherEducation: 'ปริญญาตรี ดนตรีไทย', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform@gmail.com' },
        { teacherQualification: 'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย', teacherFullName: 'ครูสนับสนุน 3', teacherPosition: 'ครูพิเศษ', teacherEducation: 'ปริญญาโท การศึกษา', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform@gmail.com' },
        { teacherQualification: 'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน', teacherFullName: 'ครูสนับสนุน 4', teacherPosition: 'วิทยากรพิเศษ', teacherEducation: 'ปริญญาตรี ดนตรีศาสตร์', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform@gmail.com' },
        { teacherQualification: 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย', teacherFullName: 'ครูสนับสนุน 5', teacherPosition: 'ครูดนตรีไทย', teacherEducation: 'ปริญญาตรี ดนตรีไทย', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform@gmail.com' },
        { teacherQualification: 'ครูภูมิปัญญาในท้องถิ่น', teacherFullName: 'ครูสนับสนุน 6', teacherPosition: 'ครูภูมิปัญญา', teacherEducation: 'มัธยมศึกษาตอนปลาย', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform@gmail.com' },
        { teacherQualification: 'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย', teacherFullName: 'ครูสนับสนุน 7', teacherPosition: 'ที่ปรึกษา', teacherEducation: 'ปริญญาเอก ดนตรีไทยศึกษา', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform@gmail.com' },
        { teacherQualification: 'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน', teacherFullName: 'ครูสนับสนุน 8', teacherPosition: 'วิทยากร', teacherEducation: 'ปริญญาโท ศิลปกรรมศาสตร์', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform@gmail.com' },
        { teacherQualification: 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย', teacherFullName: 'ครูสนับสนุน 9', teacherPosition: 'รองหัวหน้าแผนก', teacherEducation: 'ปริญญาโท ดนตรีไทย', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform@gmail.com' }
      ],
      
      // Support factors
      regsup_supportFactors: [{
        regsup_supportByType: 'ผู้บริหารสถานศึกษา',
        regsup_supportByDescription: 'ผู้อำนวยการให้การสนับสนุนงบประมาณและสถานที่',
        regsup_supportByDate: '15/01/2568',
        regsup_supportByDriveLink: 'https://drive.google.com/support-admin'
      }],
      
      regsup_hasSupportFromOrg: true,
      regsup_supportFromOrg: [{
        organization: 'กรมศิลปากร',
        details: 'สนับสนุนงบประมาณและอุปกรณ์',
        evidenceLink: 'https://drive.google.com/support1'
      }],
      
      regsup_hasSupportFromExternal: true,
      regsup_supportFromExternal: [{
        organization: 'มูลนิธิส่งเสริมดนตรีไทย',
        details: 'สนับสนุนอุปกรณ์และวิทยากร',
        evidenceLink: 'https://drive.google.com/external1'
      }],
      
      regsup_curriculumFramework: 'มีกรอบการเรียนการสอนดนตรีไทยที่ครอบคลุมทั้งทฤษฎีและปฏิบัติ',
      regsup_learningOutcomes: 'นักเรียนสามารถเล่นเครื่องดนตรีไทยพื้นฐานได้อย่างน้อย 3 ชิ้น',
      regsup_managementContext: 'มีการบริหารจัดการที่เป็นระบบและมีการประเมินผลอย่างต่อเนื่อง',
      
      regsup_awards: [{
        awardLevel: 'ประเทศ',
        awardName: 'รางวัลดีเด่นดนตรีไทยระดับชาติ',
        awardDate: '15/03/2568',
        awardEvidenceLink: 'https://drive.google.com/award1'
      }],
      
      // Photo & Video
      regsup_photoGalleryLink: 'https://drive.google.com/photos-gallery',
      regsup_videoLink: 'https://youtube.com/watch?v=example',
      
      // Activities
      regsup_activitiesWithinProvinceInternal: [{
        activityName: 'การแสดงดนตรีไทยประจำปี',
        activityDate: '15/12/2567',
        evidenceLink: 'https://drive.google.com/internal1'
      }],
      
      regsup_activitiesWithinProvinceExternal: [{
        activityName: 'การแข่งขันดนตรีไทยระดับจังหวัด',
        activityDate: '20/01/2568',
        evidenceLink: 'https://drive.google.com/external1'
      }],
      
      regsup_activitiesOutsideProvince: [{
        activityName: 'เทศกาลดนตรีไทยแห่งชาติ',
        activityDate: '10/02/2568',
        evidenceLink: 'https://drive.google.com/outside1'
      }],
      
      // PR Activities
      regsup_prActivities: [{
        activityName: 'เผยแพร่ดนตรีไทยในชุมชน',
        platform: 'Facebook',
        publishDate: '01/03/2568',
        evidenceLink: 'https://facebook.com/pr-activity-1'
      }],
      
      // Information sources
      regsup_heardFromSchool: true,
      regsup_heardFromSchoolName: 'โรงเรียนต้นแบบดนตรีไทยแห่งชาติ',
      regsup_heardFromSchoolDistrict: 'บางซื่อ',
      regsup_heardFromSchoolProvince: 'กรุงเทพมหานคร',
      
      regsup_DCP_PR_Channel_FACEBOOK: true,
      regsup_DCP_PR_Channel_YOUTUBE: true,
      regsup_DCP_PR_Channel_Tiktok: true,
      
      regsup_heardFromCulturalOffice: true,
      regsup_heardFromCulturalOfficeName: 'สำนักงานวัฒนธรรมจังหวัดกรุงเทพมหานคร',
      
      regsup_heardFromEducationArea: true,
      regsup_heardFromEducationAreaName: 'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 1',
      regsup_heardFromEducationAreaProvince: 'กรุงเทพมหานคร',
      
      regsup_heardFromOther: true,
      regsup_heardFromOtherDetail: 'ได้รับข้อมูลจากสมาคมครูดนตรีไทยและเครือข่ายโรงเรียนดนตรีไทย',
      
      // Problems and suggestions
      regsup_obstacles: 'ปัญหาหลักคือการขาดแคลนเครื่องดนตรีไทยที่มีคุณภาพสูง ครูผู้สอนที่มีความเชี่ยวชาญเฉพาะด้าน งบประมาณสำหรับการบำรุงรักษาเครื่องดนตรี และพื้นที่สำหรับการฝึกซ้อมที่เพียงพอ',
      regsup_suggestions: 'ควรมีการสนับสนุนงบประมาณสำหรับจัดซื้อเครื่องดนตรีและการฝึกอบรมครูอย่างต่อเนื่อง จัดตั้งศูนย์ทรัพยากรดนตรีไทยระดับภาค และสร้างเครือข่ายการแลกเปลี่ยนเรียนรู้ระหว่างโรงเรียน',
      
      // Certification
      regsup_certifiedINFOByAdminName: true,
      
      // Calculated scores
      total_score: 70,
      
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'submitted'
    };
    
    // Insert the test data
    const result = await collection.replaceOne(
      { _id: testData._id },
      testData,
      { upsert: true }
    );
    
    console.log('✅ Test data inserted/updated:', result);
    console.log('📊 Submission ID:', testData._id);
    console.log('🏫 School Name:', testData.regsup_schoolName);
    console.log('📧 Contact Email:', testData.regsup_mgtEmail);
    console.log('📱 Contact Phone:', testData.regsup_mgtPhone);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Connection closed');
  }
}

submitRegisterSupportTest();