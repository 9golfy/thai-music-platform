// Dummy data fixture for Register 69 form E2E tests

export interface Register69DummyData {
  // Basic Information
  schoolName: string;
  province: string;
  schoolLevel: string;
  affiliation: string;
  schoolSize: string;
  staffCount: number;
  studentCount: number;
  studentCountByGrade: string;

  // Address
  addressNo: string;
  moo: string;
  road: string;
  subDistrict: string;
  district: string;
  provinceAddress: string;
  postalCode: string;
  phone: string;
  fax: string;

  // Administrator
  mgtFullName: string;
  mgtPosition: string;
  mgtPhone: string;
  mgtEmail: string;

  // Thai Music Teachers (array)
  thaiMusicTeachers: Array<{
    teacherFullName: string;
    teacherPosition: string;
    teacherEducation: string;
    teacherPhone: string;
    teacherEmail: string;
  }>;

  // Current Teaching Plans (array)
  currentTeachingPlans: Array<{
    gradeLevel: string;
    planDetails: string;
  }>;

  // Instruments
  availableInstruments: string;

  // External Instructors (array)
  externalInstructors: Array<{
    extFullName: string;
    extPosition: string;
    extAddress: string;
    extPhone: string;
    extEmail: string;
  }>;

  // Instruction Duration
  inClassInstructionDuration: string;
  outOfClassInstructionDuration: string;
  instructionLocationOverview: string;

  // Support
  supportByAdmin: string;
  supportBySchoolBoard: string;
  supportByLocalGov: string;
  supportByCommunity: string;
  supportByOthers: string;

  // Teacher Skills
  teacherSkillThaiMusicMajor: string;
  teacherSkillOtherMajorButTrained: string;

  // Instrument Sufficiency
  instrumentSufficiencyDetail: string;
  instrumentINSufficiencyDetail: string;

  // Curriculum and Results
  curriculumFramework: string;
  learningOutcomes: string;
  managementContext: string;
  equipmentAndBudgetSupport: string;
  awardsLastYear: string;

  // Media
  publicityLinks: string;

  // Information Source
  heardFromSchoolName: string;
  heardFromSchoolDistrict: string;
  heardFromSchoolProvince: string;
  heardFromOtherDetail: string;

  // Feedback
  obstacles: string;
  suggestions: string;
}

export function buildRegister69DummyData(): Register69DummyData {
  return {
    // Basic Information
    schoolName: 'โรงเรียนดนตรีไทยตัวอย่าง',
    province: 'กรุงเทพมหานคร',
    schoolLevel: 'PRIMARY',
    affiliation: 'กระทรวงศึกษาธิการ (Ministry of Education)',
    schoolSize: 'MEDIUM',
    staffCount: 12,
    studentCount: 500,
    studentCountByGrade: 'ป.1 80 คน, ป.2 70 คน, ป.3 60 คน, ป.4 75 คน, ป.5 85 คน, ป.6 130 คน',

    // Address
    addressNo: '99/1',
    moo: '5',
    road: 'ถนนตัวอย่าง',
    subDistrict: 'แขวงตัวอย่าง',
    district: 'เขตตัวอย่าง',
    provinceAddress: 'กรุงเทพมหานคร',
    postalCode: '10200',
    phone: '0812345678',
    fax: '021234567',

    // Administrator
    mgtFullName: 'นายสมชาย ใจดี',
    mgtPosition: 'ผู้อำนวยการโรงเรียน',
    mgtPhone: '0899999999',
    mgtEmail: 'director@example.com',

    // Thai Music Teachers
    thaiMusicTeachers: [
      {
        teacherFullName: 'นางสาวสายฝน ดนตรีไทย',
        teacherPosition: 'ครูผู้สอน',
        teacherEducation: 'ศศ.บ.ดนตรี',
        teacherPhone: '0811111111',
        teacherEmail: 'teacher1@example.com',
      },
      {
        teacherFullName: 'นายบุญส่ง ระนาดเอก',
        teacherPosition: 'ครูผู้สอน',
        teacherEducation: 'ค.บ.ดนตรี',
        teacherPhone: '0822222222',
        teacherEmail: 'teacher2@example.com',
      },
    ],

    // Current Teaching Plans
    currentTeachingPlans: [
      {
        gradeLevel: 'ป.4',
        planDetails: 'เน้นทักษะพื้นฐานดนตรีไทย การเล่นเครื่องดนตรีประเภทเครื่องตี และการร้องเพลงไทย',
      },
      {
        gradeLevel: 'ม.1',
        planDetails: 'ฝึกวงปี่พาทย์ การบรรเลงเพลงไทยเดิม และการแต่งทำนองเพลงไทยเบื้องต้น',
      },
    ],

    // Instruments
    availableInstruments: 'ระนาดเอก 2 ตัว, ระนาดทุ้ม 1 ตัว, ฆ้องวงใหญ่ 1 วง, ฆ้องวงเล็ก 1 วง, ขลุ่ย 10 อัน, ซอด้วง 2 อัน, ซออู้ 2 อัน, จะเข้ 2 อัน, กลองทัด 2 ใบ, กลองสองหน้า 2 ใบ',

    // External Instructors
    externalInstructors: [
      {
        extFullName: 'ครูภูมิปัญญา ท่านหนึ่ง',
        extPosition: 'วิทยากรดนตรีไทย',
        extAddress: 'บ้านเลขที่ 1 หมู่ 2 ตำบลตัวอย่าง อำเภอตัวอย่าง จังหวัดกรุงเทพมหานคร 10200',
        extPhone: '0833333333',
        extEmail: 'guru@example.com',
      },
    ],

    // Instruction Duration
    inClassInstructionDuration: 'จัดการเรียนการสอนในชั้นเรียนสัปดาห์ละ 2 ชั่วโมง สำหรับนักเรียนทุกระดับชั้น โดยเน้นทฤษฎีและการฝึกปฏิบัติพื้นฐาน',
    outOfClassInstructionDuration: 'จัดกิจกรรมชุมนุมดนตรีไทยหลังเลิกเรียนวันละ 2 ชั่วโมง สัปดาห์ละ 3 วัน สำหรับนักเรียนที่สนใจเป็นพิเศษ',
    instructionLocationOverview: 'มีห้องดนตรีไทยขนาด 60 ตารางเมตร พร้อมเครื่องปรับอากาศ และห้องซ้อมเล็ก 2 ห้อง สำหรับฝึกซ้อมเป็นกลุ่มย่อย',

    // Support
    supportByAdmin: 'ผู้บริหารสนับสนุนงบประมาณประจำปีสำหรับซื้อและซ่อมแซมเครื่องดนตรี รวมถึงส่งครูเข้ารับการอบรมเพิ่มเติม',
    supportBySchoolBoard: 'คณะกรรมการสถานศึกษาสนับสนุนการจัดงานแสดงดนตรีไทยประจำปี และประชาสัมพันธ์กิจกรรมในชุมชน',
    supportByLocalGov: 'องค์กรปกครองส่วนท้องถิ่นสนับสนุนสถานที่จัดแสดงและงบประมาณบางส่วนสำหรับกิจกรรมพิเศษ',
    supportByCommunity: 'ชุมชนให้การสนับสนุนด้านวิทยากรท้องถิ่น และเป็นผู้ชมในงานแสดงของนักเรียน',
    supportByOthers: 'ได้รับการสนับสนุนจากศิษย์เก่าในการบริจาคเครื่องดนตรีและทุนการศึกษาสำหรับนักเรียนที่มีความสามารถพิเศษ',

    // Teacher Skills
    teacherSkillThaiMusicMajor: 'มีครูที่จบการศึกษาสาขาดนตรีไทยโดยตรง 2 คน มีความเชี่ยวชาญในการสอนและการบรรเลงเครื่องดนตรีหลากหลายชนิด',
    teacherSkillOtherMajorButTrained: 'มีครูที่จบสาขาอื่นแต่ผ่านการอบรมดนตรีไทยจากสถาบันบัณฑิตพัฒนศิลป์ 1 คน สามารถสอนทฤษฎีและปฏิบัติเบื้องต้นได้',

    // Instrument Sufficiency
    instrumentSufficiencyDetail: 'เครื่องดนตรีประเภทเครื่องตีมีเพียงพอสำหรับการเรียนการสอนในชั้นเรียน',
    instrumentINSufficiencyDetail: 'เครื่องดนตรีประเภทเครื่องสีและเครื่องเป่ายังมีไม่เพียงพอ ต้องการเพิ่มเติมอีกประมาณ 5-10 ชิ้น',

    // Curriculum and Results
    curriculumFramework: 'ใช้หลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน พ.ศ. 2551 ผสมผสานกับหลักสูตรท้องถิ่นด้านดนตรีไทย เน้นการปฏิบัติจริง',
    learningOutcomes: 'นักเรียนสามารถเล่นเครื่องดนตรีไทยพื้นฐานได้อย่างน้อย 2 ชนิด และสามารถบรรเลงเพลงไทยเดิมได้อย่างถูกต้อง',
    managementContext: 'บริหารจัดการโดยแบ่งนักเรียนเป็นกลุ่มตามความสามารถ มีการประเมินผลทั้งภาคทฤษฎีและปฏิบัติ',
    equipmentAndBudgetSupport: 'ได้รับงบประมาณสนับสนุนจากโรงเรียนปีละ 100,000 บาท สำหรับซื้อและบำรุงรักษาเครื่องดนตรี',
    awardsLastYear: 'รางวัลชนะเลิศการประกวดวงดนตรีไทยระดับเขต และรางวัลรองชนะเลิศอันดับ 1 ระดับกรุงเทพมหานคร',

    // Media
    publicityLinks: 'https://www.facebook.com/thaimusicschool, https://www.youtube.com/@thaimusicschool',

    // Information Source
    heardFromSchoolName: 'โรงเรียนดนตรีไทยต้นแบบ',
    heardFromSchoolDistrict: 'เขตตัวอย่าง',
    heardFromSchoolProvince: 'กรุงเทพมหานคร',
    heardFromOtherDetail: 'แนะนำโดยครูในเครือข่ายโรงเรียนดนตรีไทย',

    // Feedback
    obstacles: 'ข้อจำกัดด้านเวลาในการฝึกซ้อม งบประมาณที่จำกัดสำหรับการซื้อเครื่องดนตรีใหม่ และการขาดแคลนครูผู้สอนที่มีความเชี่ยวชาญเฉพาะทาง',
    suggestions: 'ขอสนับสนุนงบประมาณเพิ่มเติมสำหรับการจัดซื้อเครื่องดนตรีไทย การจัดอบรมครูผู้สอน และการจัดแสดงแลกเปลี่ยนเรียนรู้ระหว่างโรงเรียน',
  };
}
