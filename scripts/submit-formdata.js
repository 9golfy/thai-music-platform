async function submitFormData() {
  try {
    console.log('🚀 Submitting register-support data via FormData...');
    
    const formData = new FormData();
    
    // Basic information
    formData.append('submissionType', 'register-support');
    formData.append('regsup_supportType', 'กลุ่ม');
    formData.append('regsup_supportTypeGroupName', 'กลุ่มดนตรีไทยสนับสนุน 9 ครู');
    formData.append('regsup_supportTypeGroupMemberCount', '25');
    formData.append('regsup_schoolName', 'กลุ่มดนตรีไทยสนับสนุน 9 ครู - สถานศึกษา');
    formData.append('regsup_schoolProvince', 'กรุงเทพมหานคร');
    formData.append('regsup_schoolLevel', 'มัธยมศึกษา');
    formData.append('regsup_affiliation', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    formData.append('regsup_staffCount', '60');
    formData.append('regsup_studentCount', '800');
    formData.append('regsup_studentCountByGrade', 'ม.1 = 120 คน, ม.2 = 115 คน, ม.3 = 110 คน, ม.4 = 105 คน, ม.5 = 100 คน, ม.6 = 95 คน');
    formData.append('regsup_addressNo', '789');
    formData.append('regsup_moo', '5');
    formData.append('regsup_road', 'ถนนสนับสนุน');
    formData.append('regsup_subDistrict', 'บางซื่อ');
    formData.append('regsup_district', 'บางซื่อ');
    formData.append('regsup_provinceAddress', 'กรุงเทพมหานคร');
    formData.append('regsup_postalCode', '10300');
    formData.append('regsup_phone', '0834567890');
    formData.append('regsup_fax', '0234567890');
    
    // Administrator
    formData.append('regsup_mgtFullName', 'ผู้จัดการโครงการ');
    formData.append('regsup_mgtPosition', 'หัวหน้าฝ่ายดนตรี');
    formData.append('regsup_mgtAddress', '789 ถนนสนับสนุน กรุงเทพฯ 10300');
    formData.append('regsup_mgtPhone', '0845678901');
    formData.append('regsup_mgtEmail', 'thaimusicplatform2@gmail.com');
    
    // Readiness Items
    const readinessItems = [
      { instrumentName: 'ขิม', quantity: '15', note: 'สภาพดี' },
      { instrumentName: 'ระนาด', quantity: '12', note: 'สภาพดี' },
      { instrumentName: 'โขน', quantity: '10', note: 'สภาพดี' },
      { instrumentName: 'กลอง', quantity: '8', note: 'สภาพดี' },
      { instrumentName: 'ซอ', quantity: '6', note: 'สภาพดี' }
    ];
    formData.append('regsup_readinessItems', JSON.stringify(readinessItems));
    
    // Training checkboxes
    formData.append('regsup_isCompulsorySubject', 'true');
    formData.append('regsup_hasAfterSchoolTeaching', 'true');
    formData.append('regsup_hasElectiveSubject', 'true');
    formData.append('regsup_hasLocalCurriculum', 'true');
    
    // Teaching durations
    const inClassDurations = [{
      inClassGradeLevel: 'ม.1-ม.6',
      inClassStudentCount: '645',
      inClassHoursPerSemester: '40',
      inClassHoursPerYear: '80'
    }];
    formData.append('regsup_inClassInstructionDurations', JSON.stringify(inClassDurations));
    
    formData.append('regsup_teachingLocation', 'ห้องดนตรีไทยพิเศษ ห้องประชุมใหญ่ และลานกิจกรรมกลางแจ้ง สำหรับการแสดงและการฝึกซ้อมขนาดใหญ่');
    
    // 9 Teachers
    const teachers = [
      { teacherQualification: 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย', teacherFullName: 'ครูสนับสนุน 1', teacherPosition: 'หัวหน้าแผนกดนตรีไทย', teacherEducation: 'ปริญญาโท ดนตรีไทยศึกษา', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform2@gmail.com' },
      { teacherQualification: 'ครูภูมิปัญญาในท้องถิ่น', teacherFullName: 'ครูสนับสนุน 2', teacherPosition: 'ครูดนตรีไทย', teacherEducation: 'ปริญญาตรี ดนตรีไทย', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform2@gmail.com' },
      { teacherQualification: 'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย', teacherFullName: 'ครูสนับสนุน 3', teacherPosition: 'ครูพิเศษ', teacherEducation: 'ปริญญาโท การศึกษา', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform2@gmail.com' },
      { teacherQualification: 'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน', teacherFullName: 'ครูสนับสนุน 4', teacherPosition: 'วิทยากรพิเศษ', teacherEducation: 'ปริญญาตรี ดนตรีศาสตร์', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform2@gmail.com' },
      { teacherQualification: 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย', teacherFullName: 'ครูสนับสนุน 5', teacherPosition: 'ครูดนตรีไทย', teacherEducation: 'ปริญญาตรี ดนตรีไทย', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform2@gmail.com' },
      { teacherQualification: 'ครูภูมิปัญญาในท้องถิ่น', teacherFullName: 'ครูสนับสนุน 6', teacherPosition: 'ครูภูมิปัญญา', teacherEducation: 'มัธยมศึกษาตอนปลาย', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform2@gmail.com' },
      { teacherQualification: 'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย', teacherFullName: 'ครูสนับสนุน 7', teacherPosition: 'ที่ปรึกษา', teacherEducation: 'ปริญญาเอก ดนตรีไทยศึกษา', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform2@gmail.com' },
      { teacherQualification: 'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน', teacherFullName: 'ครูสนับสนุน 8', teacherPosition: 'วิทยากร', teacherEducation: 'ปริญญาโท ศิลปกรรมศาสตร์', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform2@gmail.com' },
      { teacherQualification: 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย', teacherFullName: 'ครูสนับสนุน 9', teacherPosition: 'รองหัวหน้าแผนก', teacherEducation: 'ปริญญาโท ดนตรีไทย', teacherPhone: '0899297983', teacherEmail: 'thaimusicplatform2@gmail.com' }
    ];
    formData.append('regsup_thaiMusicTeachers', JSON.stringify(teachers));
    
    // Support factors
    const supportFactors = [{
      supportByType: 'ผู้บริหารสถานศึกษา',
      supportByDescription: 'ผู้อำนวยการให้การสนับสนุนงบประมาณและสถานที่',
      supportByDate: '15/01/2568',
      supportByDriveLink: 'https://drive.google.com/support-admin'
    }];
    formData.append('regsup_supportFactors', JSON.stringify(supportFactors));
    
    formData.append('regsup_hasSupportFromOrg', 'true');
    const supportFromOrg = [{
      organization: 'กรมศิลปากร',
      details: 'สนับสนุนงบประมาณและอุปกรณ์',
      evidenceLink: 'https://drive.google.com/support1'
    }];
    formData.append('regsup_supportFromOrg', JSON.stringify(supportFromOrg));
    
    formData.append('regsup_hasSupportFromExternal', 'true');
    const supportFromExternal = [{
      organization: 'มูลนิธิส่งเสริมดนตรีไทย',
      details: 'สนับสนุนอุปกรณ์และวิทยากร',
      evidenceLink: 'https://drive.google.com/external1'
    }];
    formData.append('regsup_supportFromExternal', JSON.stringify(supportFromExternal));
    
    formData.append('regsup_curriculumFramework', 'มีกรอบการเรียนการสอนดนตรีไทยที่ครอบคลุมทั้งทฤษฎีและปฏิบัติ');
    formData.append('regsup_learningOutcomes', 'นักเรียนสามารถเล่นเครื่องดนตรีไทยพื้นฐานได้อย่างน้อย 3 ชิ้น');
    formData.append('regsup_managementContext', 'มีการบริหารจัดการที่เป็นระบบและมีการประเมินผลอย่างต่อเนื่อง');
    
    const awards = [{
      awardLevel: 'ประเทศ',
      awardName: 'รางวัลดีเด่นดนตรีไทยระดับชาติ',
      awardDate: '15/03/2568',
      awardEvidenceLink: 'https://drive.google.com/award1'
    }];
    formData.append('regsup_awards', JSON.stringify(awards));
    
    // Photo & Video
    formData.append('regsup_photoGalleryLink', 'https://drive.google.com/photos-gallery');
    formData.append('regsup_videoLink', 'https://youtube.com/watch?v=example');
    
    // Activities
    const activitiesInternal = [{
      activityName: 'การแสดงดนตรีไทยประจำปี',
      activityDate: '15/12/2567',
      evidenceLink: 'https://drive.google.com/internal1'
    }];
    formData.append('regsup_activitiesWithinProvinceInternal', JSON.stringify(activitiesInternal));
    
    const activitiesExternal = [{
      activityName: 'การแข่งขันดนตรีไทยระดับจังหวัด',
      activityDate: '20/01/2568',
      evidenceLink: 'https://drive.google.com/external1'
    }];
    formData.append('regsup_activitiesWithinProvinceExternal', JSON.stringify(activitiesExternal));
    
    const activitiesOutside = [{
      activityName: 'เทศกาลดนตรีไทยแห่งชาติ',
      activityDate: '10/02/2568',
      evidenceLink: 'https://drive.google.com/outside1'
    }];
    formData.append('regsup_activitiesOutsideProvince', JSON.stringify(activitiesOutside));
    
    // PR Activities
    const prActivities = [{
      activityName: 'เผยแพร่ดนตรีไทยในชุมชน',
      platform: 'Facebook',
      publishDate: '01/03/2568',
      evidenceLink: 'https://facebook.com/pr-activity-1'
    }];
    formData.append('regsup_prActivities', JSON.stringify(prActivities));
    
    // Information sources
    formData.append('regsup_heardFromSchool', 'true');
    formData.append('regsup_heardFromSchoolName', 'โรงเรียนต้นแบบดนตรีไทยแห่งชาติ');
    formData.append('regsup_heardFromSchoolDistrict', 'บางซื่อ');
    formData.append('regsup_heardFromSchoolProvince', 'กรุงเทพมหานคร');
    
    formData.append('regsup_DCP_PR_Channel_FACEBOOK', 'true');
    formData.append('regsup_DCP_PR_Channel_YOUTUBE', 'true');
    formData.append('regsup_DCP_PR_Channel_Tiktok', 'true');
    
    formData.append('regsup_heardFromCulturalOffice', 'true');
    formData.append('regsup_heardFromCulturalOfficeName', 'สำนักงานวัฒนธรรมจังหวัดกรุงเทพมหานคร');
    
    formData.append('regsup_heardFromEducationArea', 'true');
    formData.append('regsup_heardFromEducationAreaName', 'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 1');
    formData.append('regsup_heardFromEducationAreaProvince', 'กรุงเทพมหานคร');
    
    formData.append('regsup_heardFromOther', 'true');
    formData.append('regsup_heardFromOtherDetail', 'ได้รับข้อมูลจากสมาคมครูดนตรีไทยและเครือข่ายโรงเรียนดนตรีไทย');
    
    // Problems and suggestions
    formData.append('regsup_obstacles', 'ปัญหาหลักคือการขาดแคลนเครื่องดนตรีไทยที่มีคุณภาพสูง ครูผู้สอนที่มีความเชี่ยวชาญเฉพาะด้าน งบประมาณสำหรับการบำรุงรักษาเครื่องดนตรี และพื้นที่สำหรับการฝึกซ้อมที่เพียงพอ');
    formData.append('regsup_suggestions', 'ควรมีการสนับสนุนงบประมาณสำหรับจัดซื้อเครื่องดนตรีและการฝึกอบรมครูอย่างต่อเนื่อง จัดตั้งศูนย์ทรัพยากรดนตรีไทยระดับภาค และสร้างเครือข่ายการแลกเปลี่ยนเรียนรู้ระหว่างโรงเรียน');
    
    // Certification
    formData.append('regsup_certifiedINFOByAdminName', 'true');
    
    // Teacher contact info
    formData.append('teacherEmail', 'thaimusicplatform2@gmail.com');
    formData.append('teacherPhone', '0899297983');
    
    // Submit via API
    const response = await fetch('http://localhost:3000/api/register-support', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.text();
    console.log('📊 Response status:', response.status);
    console.log('📄 Response:', result);
    
    if (response.ok) {
      const jsonResult = JSON.parse(result);
      console.log('✅ Data submitted successfully!');
      console.log('🆔 Submission ID:', jsonResult.id);
      console.log('🏫 School ID:', jsonResult.schoolId);
      console.log('📧 Email sent:', jsonResult.emailSent);
      console.log('🏫 School Name: กลุ่มดนตรีไทยสนับสนุน 9 ครู - สถานศึกษา');
      console.log('📧 Contact Email: thaimusicplatform2@gmail.com');
      console.log('📱 Contact Phone: 0899297983');
    } else {
      console.log('❌ Submission failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

submitFormData();