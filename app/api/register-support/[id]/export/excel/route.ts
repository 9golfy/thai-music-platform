import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');
    
    const submission = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!submission) {
      await client.close();
      return NextResponse.json({ success: false, message: 'ไม่พบข้อมูล' }, { status: 404 });
    }

    // Helper function to get field value with fallback
    const getFieldValue = (fieldName: string) => {
      return submission[`regsup_${fieldName}`] ?? submission[fieldName] ?? '';
    };

    const schoolName = getFieldValue('schoolName') || 'ไม่ระบุ';
    const totalScore = submission.total_score || 0;

    // Helper function to format teachers data for CSV
    const formatTeachersData = (teachers: any[]) => {
      if (!teachers || teachers.length === 0) return [['ไม่มีข้อมูลครู']];
      
      const teacherRows: any[][] = [];
      teachers.forEach((teacher, index) => {
        teacherRows.push([`ครูคนที่ ${index + 1}`]);
        teacherRows.push(['คุณลักษณะ', teacher.teacherQualification || '-']);
        teacherRows.push(['ชื่อ-นามสกุล', teacher.teacherFullName || '-']);
        teacherRows.push(['ตำแหน่ง', teacher.teacherPosition || '-']);
        teacherRows.push(['วุฒิการศึกษา', teacher.teacherEducation || '-']);
        teacherRows.push(['โทรศัพท์', teacher.teacherPhone || '-']);
        teacherRows.push(['อีเมล', teacher.teacherEmail || '-']);
        if (index < teachers.length - 1) teacherRows.push(['']);
      });
      return teacherRows;
    };

    // Helper function to format instruments data for CSV
    const formatInstrumentsData = (instruments: any[]) => {
      if (!instruments || instruments.length === 0) return [['ไม่มีข้อมูลเครื่องดนตรี']];
      
      const instrumentRows: any[][] = [['ชื่อเครื่องดนตรี', 'จำนวน', 'หมายเหตุ']];
      instruments.forEach(instrument => {
        instrumentRows.push([
          instrument.instrumentName || '-',
          instrument.quantity || '-',
          instrument.note || '-'
        ]);
      });
      return instrumentRows;
    };

    // Helper function to format activities data for CSV
    const formatActivitiesData = (activities: any[], title: string) => {
      if (!activities || activities.length === 0) return [[title], ['ไม่มีข้อมูล']];
      
      const activityRows: any[][] = [[title], ['ชื่อกิจกรรม', 'วันที่', 'ลิงก์หลักฐาน']];
      activities.forEach(activity => {
        activityRows.push([
          activity.activityName || '-',
          activity.activityDate || activity.publishDate || '-',
          activity.evidenceLink || '-'
        ]);
      });
      return activityRows;
    };

    // Helper function to format support factors data for CSV
    const formatSupportFactorsData = (supportFactors: any[]) => {
      if (!supportFactors || supportFactors.length === 0) return [['ไม่มีข้อมูลปัจจัยสนับสนุน']];
      
      const factorRows: any[][] = [['ลำดับ', 'องค์กร/หน่วยงาน', 'รายละเอียด', 'วันที่']];
      supportFactors.forEach((factor, index) => {
        factorRows.push([
          index + 1,
          factor.sup_supportByAdmin || factor.sup_supportBySchoolBoard || factor.sup_supportByOthers || '-',
          factor.sup_supportByDescription || '-',
          factor.sup_supportByDate || '-'
        ]);
      });
      return factorRows;
    };

    // Helper function to format support organizations data for CSV
    const formatSupportOrgsData = (orgs: any[], title: string) => {
      if (!orgs || orgs.length === 0) return [[title], ['ไม่มีข้อมูล']];
      
      const orgRows: any[][] = [[title], ['องค์กร/หน่วยงาน', 'รายละเอียด', 'ลิงก์หลักฐาน']];
      orgs.forEach(org => {
        orgRows.push([
          org.organization || '-',
          org.details || '-',
          org.evidenceLink || '-'
        ]);
      });
      return orgRows;
    };

    // Helper function to format awards data for CSV
    const formatAwardsData = (awards: any[]) => {
      if (!awards || awards.length === 0) return [['ไม่มีข้อมูลรางวัล']];
      
      const awardRows: any[][] = [['ระดับ', 'ชื่อรางวัล', 'วันที่ได้รับ', 'หลักฐาน']];
      awards.forEach(award => {
        awardRows.push([
          award.awardLevel || '-',
          award.awardName || '-',
          award.awardDate || '-',
          award.awardEvidenceLink || '-'
        ]);
      });
      return awardRows;
    };

    // Create comprehensive CSV content with all step data
    const csvContent: any[][] = [
      ['รายงานข้อมูลโรงเรียนสนับสนุนและส่งเสริม'],
      ['ชื่อสถานศึกษา:', getFieldValue('schoolName')],
      [''],
      
      // Step 1: ข้อมูลพื้นฐาน
      ['=== STEP 1: ข้อมูลพื้นฐาน ==='],
      ['ประเภทการสนับสนุน', getFieldValue('supportType')],
      ['ชื่อกลุ่ม/องค์กร', getFieldValue('supportTypeGroupName') || getFieldValue('supportTypeOrgName') || getFieldValue('supportTypeFoundationName') || getFieldValue('supportTypeTemplateName') || getFieldValue('supportTypeOtherName')],
      ['จำนวนสมาชิก', getFieldValue('memberCount')],
      ['ชื่อสถานศึกษา', getFieldValue('schoolName')],
      ['จังหวัด', getFieldValue('schoolProvince')],
      ['ระดับการศึกษา', getFieldValue('schoolLevel')],
      ['สังกัด', getFieldValue('affiliation')],
      ['จำนวนบุคลากร', getFieldValue('staffCount')],
      ['จำนวนนักเรียน', getFieldValue('studentCount')],
      ['จำนวนนักเรียนแต่ละชั้น', getFieldValue('studentCountByGrade')],
      ['ที่อยู่', `เลขที่ ${getFieldValue('addressNo')} หมู่ ${getFieldValue('moo')} ถนน ${getFieldValue('road')} ตำบล/แขวง ${getFieldValue('subDistrict')} อำเภอ/เขต ${getFieldValue('district')} จังหวัด ${getFieldValue('provinceAddress')} รหัสไปรษณีย์ ${getFieldValue('postalCode')}`],
      ['โทรศัพท์', getFieldValue('phone')],
      ['โทรสาร', getFieldValue('fax')],
      [''],
      
      // Step 2: ผู้บริหารสถานศึกษา
      ['=== STEP 2: ผู้บริหารสถานศึกษา ==='],
      ['ชื่อ-นามสกุล', getFieldValue('mgtFullName')],
      ['ตำแหน่ง', getFieldValue('mgtPosition')],
      ['ที่อยู่', getFieldValue('mgtAddress')],
      ['โทรศัพท์', getFieldValue('mgtPhone')],
      ['อีเมล', getFieldValue('mgtEmail')],
      [''],
      
      // Step 3: ความพร้อมด้านวัสดุอุปกรณ์
      ['=== STEP 3: ความพร้อมด้านวัสดุอุปกรณ์ ==='],
      ...formatInstrumentsData(submission.regsup_readinessItems || submission.readinessItems),
      [''],
      
      // Step 4: ผู้สอนดนตรีไทย
      ['=== STEP 4: ผู้สอนดนตรีไทย ==='],
      ['การเรียนการสอน'],
      ['วิชาบังคับ', getFieldValue('isCompulsorySubject') ? 'มี' : 'ไม่มี'],
      ['สอนหลังเลิกเรียน', getFieldValue('hasAfterSchoolTeaching') ? 'มี' : 'ไม่มี'],
      ['วิชาเลือก', getFieldValue('hasElectiveSubject') ? 'มี' : 'ไม่มี'],
      ['หลักสูตรท้องถิ่น', getFieldValue('hasLocalCurriculum') ? 'มี' : 'ไม่มี'],
      [''],
      ['สถานที่สอน', getFieldValue('teachingLocation')],
      [''],
      ['รายชื่อครู'],
      ...formatTeachersData(submission.regsup_thaiMusicTeachers || submission.thaiMusicTeachers),
      [''],
      
      // Step 5: การสนับสนุนและรางวัล
      ['=== STEP 5: การสนับสนุนและรางวัล ==='],
      ['ปัจจัยที่เกี่ยวข้องโดยตรง'],
      ...formatSupportFactorsData(submission.regsup_supportFactors || submission.supportFactors),
      [''],
      ...formatSupportOrgsData(submission.regsup_supportFromOrg || submission.supportFromOrg, 'การสนับสนุนจากต้นสังกัด'),
      [''],
      ...formatSupportOrgsData(submission.regsup_supportFromExternal || submission.supportFromExternal, 'การสนับสนุนจากภายนอก'),
      [''],
      ['กรอบการเรียนการสอน', getFieldValue('curriculumFramework')],
      ['ผลสัมฤทธิ์ในการเรียนการสอน', getFieldValue('learningOutcomes')],
      ['การบริหารจัดการ', getFieldValue('managementContext')],
      [''],
      ['รางวัลและเกียรติคุณ'],
      ...formatAwardsData(submission.regsup_awards || submission.awards),
      [''],
      
      // Step 6: สื่อและวิดีโอ
      ['=== STEP 6: สื่อและวิดีโอ ==='],
      ['ลิงก์แกลเลอรี่รูปภาพ', getFieldValue('photoGalleryLink')],
      ['ลิงก์วิดีโอ', getFieldValue('videoLink')],
      [''],
      
      // Step 7: กิจกรรมและการเผยแพร่
      ['=== STEP 7: กิจกรรมและการเผยแพร่ ==='],
      ...formatActivitiesData(submission.regsup_activitiesWithinProvinceInternal || submission.activitiesWithinProvinceInternal, 'กิจกรรมภายในจังหวัด (ภายใน)'),
      [''],
      ...formatActivitiesData(submission.regsup_activitiesWithinProvinceExternal || submission.activitiesWithinProvinceExternal, 'กิจกรรมภายในจังหวัด (ภายนอก)'),
      [''],
      ...formatActivitiesData(submission.regsup_activitiesOutsideProvince || submission.activitiesOutsideProvince, 'กิจกรรมนอกจังหวัด'),
      [''],
      
      // Step 8: ประชาสัมพันธ์และแหล่งข้อมูล
      ['=== STEP 8: ประชาสัมพันธ์และแหล่งข้อมูล ==='],
      ...formatActivitiesData(submission.regsup_prActivities || submission.prActivities, 'กิจกรรมประชาสัมพันธ์'),
      [''],
      ['แหล่งที่มาของข้อมูล'],
      ['โรงเรียน', getFieldValue('heardFromSchoolName')],
      ['สำนักงานวัฒนธรรม', getFieldValue('heardFromCulturalOfficeName')],
      ['สำนักงานเขตพื้นที่', getFieldValue('heardFromEducationAreaName')],
      ['อื่นๆ', getFieldValue('heardFromOtherDetail')],
      [''],
      ['ปัญหาอุปสรรค', getFieldValue('obstacles')],
      ['ข้อเสนอแนะ', getFieldValue('suggestions')],
      [''],
      
      // Footer
      ['สร้างเมื่อ', new Date().toLocaleDateString('th-TH', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })],
      ['ระบบบริหารจัดการข้อมูลกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์']
    ];

    // Convert to CSV format
    const csv = csvContent.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    await client.close();
    
    // Add BOM for UTF-8 Excel compatibility
    const bom = '\uFEFF';
    const csvWithBom = bom + csv;
    
    // Add timestamp to filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="register-support-${encodeURIComponent(schoolName)}-${timestamp}.csv"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการสร้าง Excel', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}