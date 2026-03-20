/**
 * Create Sample Register100 Data
 * 
 * Creates sample register100 submission for testing admin dashboard
 * 
 * Usage: node scripts/create-sample-register100.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function createSampleData() {
  console.log('🚀 Creating Sample Register100 Data...\n');
  
  const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  const dbName = 'thai_music_school';
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    
    console.log('✅ Connected successfully!\n');
    
    const collection = db.collection('register100_submissions');
    
    // Sample data matching the new 9-step form structure
    const sampleData = {
      // Step 1: Basic Information
      reg100_schoolName: 'โรงเรียนทดสอบดนตรีไทย',
      reg100_schoolProvince: 'กรุงเทพมหานคร',
      reg100_schoolLevel: 'มัธยมศึกษา',
      reg100_affiliation: 'กระทรวงศึกษาธิการ (Ministry of Education)',
      reg100_staffCount: 50,
      reg100_studentCount: 800,
      reg100_studentCountByGrade: 'ม.1: 150 คน, ม.2: 140 คน, ม.3: 130 คน, ม.4: 120 คน, ม.5: 110 คน, ม.6: 100 คน',
      reg100_addressNo: '123',
      reg100_moo: '5',
      reg100_road: 'ถนนทดสอบ',
      reg100_subDistrict: 'บางซื่อ',
      reg100_district: 'บางซื่อ',
      reg100_provinceAddress: 'กรุงเทพมหานคร',
      reg100_postalCode: '10800',
      reg100_phone: '0899297983',
      reg100_fax: '0212345678',
      
      // Step 2: Administrator
      reg100_mgtFullName: 'นายผู้อำนวยการทดสอบ',
      reg100_mgtPosition: 'ผู้อำนวยการ',
      reg100_mgtAddress: '123 หมู่ 5 ถนนทดสอบ บางซื่อ บางซื่อ กรุงเทพมหานคร 10800',
      reg100_mgtPhone: '0899297983',
      reg100_mgtEmail: 'kaibandon2021@gmail.com',
      
      // Step 3: Music Types & Readiness
      reg100_currentMusicTypes: [
        {
          grade: 'ม.1-6',
          details: 'การเรียนดนตรีไทยพื้นฐาน'
        }
      ],
      reg100_readinessItems: [
        {
          instrumentName: 'ขิม',
          quantity: '10',
          note: 'สภาพดี'
        }
      ],
      
      // Step 4: Teachers (with all 4 different qualifications and full data)
      reg100_thaiMusicTeachers: [
        {
          teacherQualification: 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย',
          teacherFullName: 'ครูทดสอบ 1',
          teacherPosition: 'ครูดนตรีไทย',
          teacherEmail: 'teacher1@school.ac.th',
          teacherPhone: '0899297981',
          teacherOther: 'ข้อมูลเพิ่มเติมครู 1',
          teacherAbility: 'มีความสามารถในการสอนดนตรีไทยระดับสูง สามารถเล่นเครื่องดนตรีได้หลายชนิด',
          isFromMusicInstitute: true,
          musicInstituteEducation: [
            {
              graduationYear: 'รุ่น 50',
              major: 'ดนตรีไทย',
              completionYear: '2020'
            },
            {
              graduationYear: 'รุ่น 52',
              major: 'ดนตรีไทยขั้นสูง',
              completionYear: '2022'
            }
          ],
          isFromOtherInstitute: true,
          otherInstituteEducation: [
            {
              graduationYear: 'รุ่น 15',
              major: 'ศิลปกรรมไทย',
              completionYear: '2018'
            }
          ]
        },
        {
          teacherQualification: 'ครูภูมิปัญญาในท้องถิ่น',
          teacherFullName: 'ครูทดสอบ 2',
          teacherPosition: 'ครูภูมิปัญญา',
          teacherEmail: 'teacher2@school.ac.th',
          teacherPhone: '0899297982',
          teacherOther: 'ข้อมูลเพิ่มเติมครู 2',
          teacherAbility: 'เป็นครูภูมิปัญญาท้องถิ่น มีประสบการณ์การสอนมากว่า 20 ปี',
          isFromMusicInstitute: false,
          isFromOtherInstitute: true,
          otherInstituteEducation: [
            {
              graduationYear: 'รุ่น 10',
              major: 'ดนตรีพื้นบ้าน',
              completionYear: '2000'
            },
            {
              graduationYear: 'รุ่น 12',
              major: 'ศิลปะการแสดง',
              completionYear: '2002'
            },
            {
              graduationYear: 'รุ่น 14',
              major: 'วัฒนธรรมไทย',
              completionYear: '2004'
            }
          ]
        },
        {
          teacherQualification: 'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย',
          teacherFullName: 'ครูทดสอบ 3',
          teacherPosition: 'ผู้ทรงคุณวุฒิ',
          teacherEmail: 'teacher3@school.ac.th',
          teacherPhone: '0899297983',
          teacherOther: 'ข้อมูลเพิ่มเติมครู 3',
          teacherAbility: 'ผู้ทรงคุณวุฒิด้านดนตรีไทย มีผลงานระดับชาติและนานาชาติ',
          isFromMusicInstitute: true,
          musicInstituteEducation: [
            {
              graduationYear: 'รุ่น 45',
              major: 'ดนตรีไทยศึกษา',
              completionYear: '2015'
            },
            {
              graduationYear: 'รุ่น 47',
              major: 'การสอนดนตรีไทย',
              completionYear: '2017'
            },
            {
              graduationYear: 'รุ่น 49',
              major: 'วิจัยดนตรีไทย',
              completionYear: '2019'
            },
            {
              graduationYear: 'รุ่น 51',
              major: 'ดนตรีไทยร่วมสมัย',
              completionYear: '2021'
            },
            {
              graduationYear: 'รุ่น 53',
              major: 'ปรัชญาดนตรีไทย',
              completionYear: '2023'
            }
          ],
          isFromOtherInstitute: false
        },
        {
          teacherQualification: 'วิทยากร/บุคคลภายนอก',
          teacherFullName: 'ครูทดสอบ 4',
          teacherPosition: 'วิทยากรพิเศษ',
          teacherEmail: 'teacher4@school.ac.th',
          teacherPhone: '0899297984',
          teacherOther: 'ข้อมูลเพิ่มเติมครู 4',
          teacherAbility: 'วิทยากรพิเศษจากภายนอก มีความเชี่ยวชาญเฉพาะด้าน',
          isFromMusicInstitute: false,
          isFromOtherInstitute: true,
          otherInstituteEducation: [
            {
              graduationYear: 'รุ่น 8',
              major: 'ดนตรีสากล',
              completionYear: '1998'
            },
            {
              graduationYear: 'รุ่น 11',
              major: 'ดนตรีผสมผสาน',
              completionYear: '2001'
            },
            {
              graduationYear: 'รุ่น 13',
              major: 'เทคโนโลยีดนตรี',
              completionYear: '2003'
            },
            {
              graduationYear: 'รุ่น 16',
              major: 'การผลิตสื่อดนตรี',
              completionYear: '2006'
            }
          ]
        }
      ],
      
      // Step 5: Curriculum (all 4 types with full 5 items each)
      reg100_isCompulsorySubject: true,
      reg100_hasElectiveSubject: true,
      reg100_hasLocalCurriculum: true,
      reg100_hasAfterSchoolTeaching: true,
      reg100_compulsoryCurriculum: [
        {
          gradeLevel: 'ม.1',
          studentCount: '150',
          hoursPerSemester: '20',
          hoursPerYear: '40'
        },
        {
          gradeLevel: 'ม.2',
          studentCount: '140',
          hoursPerSemester: '20',
          hoursPerYear: '40'
        },
        {
          gradeLevel: 'ม.3',
          studentCount: '130',
          hoursPerSemester: '20',
          hoursPerYear: '40'
        },
        {
          gradeLevel: 'ม.4',
          studentCount: '120',
          hoursPerSemester: '20',
          hoursPerYear: '40'
        },
        {
          gradeLevel: 'ม.5',
          studentCount: '110',
          hoursPerSemester: '20',
          hoursPerYear: '40'
        }
      ],
      reg100_electiveCurriculum: [
        {
          gradeLevel: 'ม.1',
          studentCount: '50',
          hoursPerSemester: '15',
          hoursPerYear: '30'
        },
        {
          gradeLevel: 'ม.2',
          studentCount: '45',
          hoursPerSemester: '15',
          hoursPerYear: '30'
        },
        {
          gradeLevel: 'ม.3',
          studentCount: '40',
          hoursPerSemester: '15',
          hoursPerYear: '30'
        },
        {
          gradeLevel: 'ม.4',
          studentCount: '35',
          hoursPerSemester: '15',
          hoursPerYear: '30'
        },
        {
          gradeLevel: 'ม.5',
          studentCount: '30',
          hoursPerSemester: '15',
          hoursPerYear: '30'
        }
      ],
      reg100_localCurriculum: [
        {
          gradeLevel: 'ม.1-2',
          studentCount: '100',
          hoursPerSemester: '10',
          hoursPerYear: '20'
        },
        {
          gradeLevel: 'ม.3-4',
          studentCount: '90',
          hoursPerSemester: '10',
          hoursPerYear: '20'
        },
        {
          gradeLevel: 'ม.5-6',
          studentCount: '80',
          hoursPerSemester: '10',
          hoursPerYear: '20'
        },
        {
          gradeLevel: 'ป.4-6',
          studentCount: '120',
          hoursPerSemester: '8',
          hoursPerYear: '16'
        },
        {
          gradeLevel: 'ทุกระดับชั้น',
          studentCount: '200',
          hoursPerSemester: '12',
          hoursPerYear: '24'
        }
      ],
      reg100_afterSchoolSchedule: [
        {
          day: 'จันทร์',
          timeFrom: '16:00',
          timeTo: '18:00',
          location: 'ห้องดนตรีไทย 1'
        },
        {
          day: 'อังคาร',
          timeFrom: '16:00',
          timeTo: '18:00',
          location: 'ห้องดนตรีไทย 2'
        },
        {
          day: 'พุธ',
          timeFrom: '16:00',
          timeTo: '18:00',
          location: 'ห้องดนตรีไทย 3'
        },
        {
          day: 'พฤหัสบดี',
          timeFrom: '16:00',
          timeTo: '18:00',
          location: 'หอประชุม'
        },
        {
          day: 'ศุกร์',
          timeFrom: '16:00',
          timeTo: '18:00',
          location: 'สนามกีฬา'
        }
      ],
      reg100_teachingLocation: 'ห้องดนตรีไทย อาคาร 2',
      
      // Step 6: Support & Awards (full 5 items each)
      reg100_supportFactors: [
        {
          sup_supportByAdmin: 'ผู้บริหารสถานศึกษา',
          sup_supportByDescription: 'สนับสนุนงบประมาณสำหรับซื้อเครื่องดนตรี',
          sup_supportByDate: '15/01/2026',
          sup_supportByDriveLink: 'https://drive.google.com/support1'
        },
        {
          sup_supportByAdmin: 'คณะกรรมการสถานศึกษา',
          sup_supportByDescription: 'สนับสนุนการจัดกิจกรรมดนตรีไทย',
          sup_supportByDate: '20/02/2026',
          sup_supportByDriveLink: 'https://drive.google.com/support2'
        },
        {
          sup_supportByAdmin: 'ผู้ปกครอง',
          sup_supportByDescription: 'สนับสนุนค่าใช้จ่ายในการแข่งขัน',
          sup_supportByDate: '10/03/2026',
          sup_supportByDriveLink: 'https://drive.google.com/support3'
        },
        {
          sup_supportByAdmin: 'ชุมชน',
          sup_supportByDescription: 'สนับสนุนสถานที่จัดกิจกรรม',
          sup_supportByDate: '05/04/2026',
          sup_supportByDriveLink: 'https://drive.google.com/support4'
        },
        {
          sup_supportByAdmin: 'องค์กรปกครองส่วนท้องถิ่น',
          sup_supportByDescription: 'สนับสนุนการประชาสัมพันธ์',
          sup_supportByDate: '15/05/2026',
          sup_supportByDriveLink: 'https://drive.google.com/support5'
        }
      ],
      reg100_hasSupportFromOrg: true,
      reg100_supportFromOrg: [
        {
          organization: 'สำนักงานเขตพื้นที่การศึกษา',
          details: 'สนับสนุนงบประมาณและอุปกรณ์การเรียนการสอน',
          evidenceLink: 'https://drive.google.com/org-support1'
        },
        {
          organization: 'กรมส่งเสริมวัฒนธรรม',
          details: 'สนับสนุนวิทยากรและหลักสูตร',
          evidenceLink: 'https://drive.google.com/org-support2'
        },
        {
          organization: 'มหาวิทยาลัยมหิดล',
          details: 'สนับสนุนการวิจัยและพัฒนา',
          evidenceLink: 'https://drive.google.com/org-support3'
        },
        {
          organization: 'สำนักงานศิลปกรรม',
          details: 'สนับสนุนการแสดงและนิทรรศการ',
          evidenceLink: 'https://drive.google.com/org-support4'
        },
        {
          organization: 'กองทุนพัฒนาการศึกษา',
          details: 'สนับสนุนทุนการศึกษาสำหรับนักเรียน',
          evidenceLink: 'https://drive.google.com/org-support5'
        }
      ],
      reg100_hasSupportFromExternal: true,
      reg100_supportFromExternal: [
        {
          organization: 'กรมศิลปากร',
          details: 'สนับสนุนวิทยากรผู้เชี่ยวชาญ',
          evidenceLink: 'https://drive.google.com/external-support1'
        },
        {
          organization: 'สมาคมดนตรีไทย',
          details: 'สนับสนุนการแข่งขันและประกวด',
          evidenceLink: 'https://drive.google.com/external-support2'
        },
        {
          organization: 'มูลนิธิส่งเสริมศิลปกรรม',
          details: 'สนับสนุนทุนการศึกษาและอุปกรณ์',
          evidenceLink: 'https://drive.google.com/external-support3'
        },
        {
          organization: 'บริษัทเครื่องดนตรีไทย จำกัด',
          details: 'สนับสนุนเครื่องดนตรีและอุปกรณ์',
          evidenceLink: 'https://drive.google.com/external-support4'
        },
        {
          organization: 'สถาบันดนตรีกัลยาณิวัฒนา',
          details: 'สนับสนุนการฝึกอบรมครูและนักเรียน',
          evidenceLink: 'https://drive.google.com/external-support5'
        }
      ],
      reg100_curriculumFramework: 'หลักสูตรดนตรีไทยแบบบูรณาการที่ผสมผสานระหว่างภูมิปัญญาท้องถิ่นกับความรู้สมัยใหม่ เน้นการปฏิบัติจริงและการสร้างสรรค์ผลงาน',
      reg100_learningOutcomes: 'นักเรียนสามารถเล่นเครื่องดนตรีไทยได้อย่างน้อย 3 ชนิด มีความเข้าใจในประวัติศาสตร์และวัฒนธรรมดนตรีไทย สามารถประยุกต์ใช้ในชีวิตประจำวัน',
      reg100_managementContext: 'การจัดการเรียนการสอนแบบผสมผสานระหว่างการเรียนในห้องเรียนและการปฏิบัติจริง มีการใช้เทคโนโลยีสมัยใหม่ประกอบการสอน',
      reg100_awards: [
        {
          awardLevel: 'ประเทศ',
          awardName: 'รางวัลโรงเรียนดนตรีไทยดีเด่นระดับประเทศ',
          awardDate: '2023-12-15',
          awardEvidenceLink: 'https://drive.google.com/award1'
        },
        {
          awardLevel: 'ภาค',
          awardName: 'รางวัลชนะเลิศการแข่งขันดนตรีไทยระดับภาค',
          awardDate: '2023-10-20',
          awardEvidenceLink: 'https://drive.google.com/award2'
        },
        {
          awardLevel: 'จังหวัด',
          awardName: 'รางวัลโรงเรียนส่งเสริมศิลปวัฒนธรรมดีเด่น',
          awardDate: '2023-08-10',
          awardEvidenceLink: 'https://drive.google.com/award3'
        },
        {
          awardLevel: 'อำเภอ',
          awardName: 'รางวัลโรงเรียนคุณภาพระดับอำเภอ',
          awardDate: '2023-06-05',
          awardEvidenceLink: 'https://drive.google.com/award4'
        },
        {
          awardLevel: 'จังหวัด',
          awardName: 'รางวัลนวัตกรรมการเรียนการสอน',
          awardDate: '2023-04-15',
          awardEvidenceLink: 'https://drive.google.com/award5'
        }
      ],
      
      // Step 7: Photo Gallery
      reg100_photoGalleryLink: 'https://photos.google.com/gallery',
      reg100_videoLink: 'https://youtube.com/watch?v=test',
      
      // Step 8: Activities (full 5 items each for maximum score)
      reg100_activitiesWithinProvinceInternal: [
        {
          activityName: 'การแสดงดนตรีไทยในงานวันสถาปนาโรงเรียน',
          activityDate: '2023-07-15',
          evidenceLink: 'https://drive.google.com/internal1'
        },
        {
          activityName: 'การประกวดเครื่องดนตรีไทยระหว่างชั้นเรียน',
          activityDate: '2023-08-15',
          evidenceLink: 'https://drive.google.com/internal2'
        },
        {
          activityName: 'การแสดงดนตรีไทยในงานกีฬาสี',
          activityDate: '2023-09-15',
          evidenceLink: 'https://drive.google.com/internal3'
        },
        {
          activityName: 'การจัดนิทรรศการดนตรีไทยในโรงเรียน',
          activityDate: '2023-10-15',
          evidenceLink: 'https://drive.google.com/internal4'
        },
        {
          activityName: 'การแสดงดนตรีไทยในงานปีใหม่',
          activityDate: '2023-12-31',
          evidenceLink: 'https://drive.google.com/internal5'
        }
      ],
      reg100_activitiesWithinProvinceExternal: [
        {
          activityName: 'การแสดงดนตรีไทยในงานเทศกาลดนตรีจังหวัด',
          activityDate: '2023-08-20',
          evidenceLink: 'https://drive.google.com/external1'
        },
        {
          activityName: 'การแข่งขันดนตรีไทยระดับเขตการศึกษา',
          activityDate: '2023-09-20',
          evidenceLink: 'https://drive.google.com/external2'
        },
        {
          activityName: 'การแสดงในงานวันเด็กแห่งชาติ',
          activityDate: '2024-01-13',
          evidenceLink: 'https://drive.google.com/external3'
        },
        {
          activityName: 'การแสดงในงานสงกรานต์จังหวัด',
          activityDate: '2024-04-13',
          evidenceLink: 'https://drive.google.com/external4'
        },
        {
          activityName: 'การแสดงในงานลอยกระทงจังหวัด',
          activityDate: '2023-11-27',
          evidenceLink: 'https://drive.google.com/external5'
        }
      ],
      reg100_activitiesOutsideProvince: [
        {
          activityName: 'การแข่งขันดนตรีไทยระดับภาคกลาง',
          activityDate: '2023-09-10',
          evidenceLink: 'https://drive.google.com/outside1'
        },
        {
          activityName: 'การแสดงในงานเทศกาลดนตรีไทยแห่งชาติ',
          activityDate: '2023-10-10',
          evidenceLink: 'https://drive.google.com/outside2'
        },
        {
          activityName: 'การแข่งขันดนตรีไทยนานาชาติ',
          activityDate: '2023-11-10',
          evidenceLink: 'https://drive.google.com/outside3'
        },
        {
          activityName: 'การแสดงในงานมหกรรมดนตรีไทย',
          activityDate: '2023-12-10',
          evidenceLink: 'https://drive.google.com/outside4'
        },
        {
          activityName: 'การแลกเปลี่ยนวัฒนธรรมกับโรงเรียนต่างจังหวัด',
          activityDate: '2024-01-10',
          evidenceLink: 'https://drive.google.com/outside5'
        }
      ],
      
      // Step 9: PR & Certification (full 5 items for maximum score)
      reg100_prActivities: [
        {
          activityName: 'การประชาสัมพันธ์ผ่าน Facebook Page โรงเรียน',
          platform: 'Facebook',
          publishDate: '2023-07-30',
          evidenceLink: 'https://facebook.com/school/post1'
        },
        {
          activityName: 'การสร้างคลิปวิดีโอแนะนำหลักสูตรดนตรีไทย',
          platform: 'YouTube',
          publishDate: '2023-08-30',
          evidenceLink: 'https://youtube.com/watch?v=school1'
        },
        {
          activityName: 'การทำคลิปสั้นแสดงความสามารถนักเรียน',
          platform: 'TikTok',
          publishDate: '2023-09-30',
          evidenceLink: 'https://tiktok.com/@school/video1'
        },
        {
          activityName: 'การเผยแพร่ข่าวสารผ่านเว็บไซต์โรงเรียน',
          platform: 'Website',
          publishDate: '2023-10-30',
          evidenceLink: 'https://school.ac.th/news/music-program'
        },
        {
          activityName: 'การส่งข่าวให้สื่อมวลชนท้องถิ่น',
          platform: 'สื่อมวลชน',
          publishDate: '2023-11-30',
          evidenceLink: 'https://localnews.com/school-music'
        }
      ],
      reg100_DCP_PR_Channel_FACEBOOK: true,
      reg100_DCP_PR_Channel_YOUTUBE: true,
      reg100_obstacles: 'ขาดแคลนเครื่องดนตรี',
      reg100_suggestions: 'ควรมีการสนับสนุนงบประมาณ',
      reg100_certifiedINFOByAdminName: true,
      
      // Teacher contact info
      teacherEmail: 'kaibandon2021@gmail.com',
      teacherPhone: '0899297983',
      
      // Calculated scores (maximum score scenario with 4 different teacher qualifications)
      teacher_training_score: 20, // 4 checkboxes × 5 (all curriculum types)
      teacher_qualification_score: 20, // 4 unique qualifications × 5 (maximum)
      support_from_org_score: 5, // checkbox checked
      support_from_external_score: 15, // 5 external supports (3+ = 15 points)
      award_score: 20, // ประเทศ level (highest)
      activity_within_province_internal_score: 5, // 5 activities (≥3 = 5 points)
      activity_within_province_external_score: 5, // 5 activities (≥3 = 5 points)
      activity_outside_province_score: 5, // 5 activities (≥3 = 5 points)
      pr_activity_score: 5, // 5 activities (≥3 = 5 points)
      total_score: 100, // Perfect score!
      
      // Metadata
      schoolId: 'SCH-20260313-0001',
      createdAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    console.log('📝 Inserting sample data...');
    const result = await collection.insertOne(sampleData);
    console.log('✅ Sample data inserted with ID:', result.insertedId);
    
    console.log('\n📊 Sample data summary:');
    console.log('  School:', sampleData.reg100_schoolName);
    console.log('  Province:', sampleData.reg100_schoolProvince);
    console.log('  Total Score:', sampleData.total_score);
    console.log('  School ID:', sampleData.schoolId);
    
    await client.close();
    console.log('\n🎉 Sample data created successfully!');
    console.log('🔗 You can now view it at: http://localhost:3000/dcp-admin/dashboard/register100');
    
  } catch (error) {
    console.error('\n❌ Failed to create sample data:', error.message);
    process.exit(1);
  }
}

// Run script
createSampleData().catch(console.error);