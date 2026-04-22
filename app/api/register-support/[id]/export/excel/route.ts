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

    const getSupportTypeName = () => {
      const supportType = getFieldValue('supportType');
      const supportTypeNameFieldMap: Record<string, string> = {
        'สถานศึกษา': 'supportTypeSchoolName',
        'ชุมนุม': 'supportTypeClubName',
        'ชมรม': 'supportTypeAssociationName',
        'กลุ่ม': 'supportTypeGroupName',
        'วงดนตรีไทย': 'supportTypeBandName',
      };

      const selectedField = supportTypeNameFieldMap[supportType];
      return (
        (selectedField ? getFieldValue(selectedField) : '') ||
        getFieldValue('supportTypeSchoolName') ||
        getFieldValue('supportTypeClubName') ||
        getFieldValue('supportTypeAssociationName') ||
        getFieldValue('supportTypeGroupName') ||
        getFieldValue('supportTypeBandName') ||
        getFieldValue('supportTypeName') ||
        getFieldValue('supportTypeOrgName') ||
        getFieldValue('supportTypeFoundationName') ||
        getFieldValue('supportTypeTemplateName') ||
        getFieldValue('supportTypeOtherName')
      );
    };

    const getSupportTypeMemberCount = () => {
      return getFieldValue('supportTypeMemberCount') || getFieldValue('memberCount');
    };

    const schoolName = getFieldValue('schoolName') || 'ไม่ระบุ';
    const totalScore = submission.total_score || 0;

    // Helper function to format teachers data for CSV
    const formatTeachersData = (teachers: any[]) => {
      if (!teachers || teachers.length === 0) return [['ไม่มีข้อมูลครู']];
      
      const teacherRows: any[][] = [];
      teachers.forEach((teacher, index) => {
        teacherRows.push([`ครูคนที่ ${index + 1}`]);
        teacherRows.push(['บทบาท/หน้าที่ผู้สอน *', teacher.teacherQualification || '-']);
        teacherRows.push(['ชื่อ-นามสกุล', teacher.teacherFullName || '-']);
        teacherRows.push(['ตำแหน่ง *', teacher.teacherPosition || '-']);
        teacherRows.push(['อีเมล *', teacher.teacherEmail || '-']);
        teacherRows.push(['เบอร์โทรศัพท์ *', teacher.teacherMobilePhone || teacher.teacherPhone || '-']);
        teacherRows.push(['ทักษะ ความรู้ ความสามารถ ในการสอนภาคปฏิบัติดนตรีไทย *', teacher.teacherExpertise || '-']);
        teacherRows.push(['=== สำเร็จการศึกษาด้านดนตรีไทย * ===']);
        teacherRows.push(['วุฒิการศึกษา/ประกาศนียบัตร *', teacher.teacherEducation || '-']);
        teacherRows.push(['สาขา/หลักสูตร *', teacher.teacherMajor || '-']);
        teacherRows.push(['ปีที่สำเร็จการศึกษา / ได้รับประกาศนียบัตร *', teacher.teacherGraduationYear || '-']);
        teacherRows.push(['=== สำเร็จการศึกษาด้านอื่น * ===']);
        teacherRows.push(['วุฒิการศึกษา/ประกาศนียบัตร *', teacher.teacherOtherEducation || '-']);
        teacherRows.push(['สาขา/หลักสูตร *', teacher.teacherOtherMajor || '-']);
        teacherRows.push(['ปีที่สำเร็จการศึกษา / ได้รับประกาศนียบัตร *', teacher.teacherOtherGraduationYear || '-']);
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

    const formatCurrentMusicTypesData = (items: any[]) => {
      if (!items || items.length === 0) return [['ไม่มีข้อมูลสภาวการณ์การเรียนการสอน']];

      const rows: any[][] = [['ระดับชั้น', 'รายละเอียด']];
      items.forEach((item) => {
        rows.push([item.grade || '-', item.details || '-']);
      });
      return rows;
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
      
      // 1. ข้อมูลพื้นฐาน
      ['=== 1. ข้อมูลพื้นฐาน ==='],
      ['ประเภทการสนับสนุน', getFieldValue('supportType')],
      ['ชื่อกลุ่ม/องค์กร', getSupportTypeName()],
      ['จำนวนสมาชิก', getSupportTypeMemberCount()],
      ['ชื่อสถานศึกษา', getFieldValue('schoolName')],
      ['จังหวัด', getFieldValue('schoolProvince')],
      ['ระดับการศึกษา', getFieldValue('schoolLevel')],
      ['สังกัด', getFieldValue('affiliation')],
      ['ระบุ', getFieldValue('affiliationDetail')],
      ['จำนวนบุคลากร', getFieldValue('staffCount')],
      ['จำนวนนักเรียน', getFieldValue('studentCount')],
      ['จำนวนนักเรียนแต่ละชั้น', getFieldValue('studentCountByGrade')],
      ['ที่อยู่', `เลขที่ ${getFieldValue('addressNo')} หมู่ ${getFieldValue('moo')} ถนน ${getFieldValue('road')} ตำบล/แขวง ${getFieldValue('subDistrict')} อำเภอ/เขต ${getFieldValue('district')} จังหวัด ${getFieldValue('provinceAddress')} รหัสไปรษณีย์ ${getFieldValue('postalCode')}`],
      ['โทรศัพท์', getFieldValue('phone')],
      ['โทรสาร', getFieldValue('fax')],
      [''],
      
      // 2. ผู้บริหาร
      ['=== 2. ผู้บริหาร ==='],
      ['ชื่อ-นามสกุล', getFieldValue('mgtFullName')],
      ['ตำแหน่ง', getFieldValue('mgtPosition')],
      ['ที่อยู่', getFieldValue('mgtAddress')],
      ['โทรศัพท์', getFieldValue('mgtPhone')],
      ['อีเมล', getFieldValue('mgtEmail')],
      [''],
      
      // 3. สภาวการณ์
      ['=== 3. สภาวการณ์ ==='],
      ...formatCurrentMusicTypesData(submission.regsup_currentMusicTypes || submission.currentMusicTypes),
      [''],
      ...formatInstrumentsData(submission.regsup_readinessItems || submission.readinessItems),
      [''],
      
      // 4. ผู้สอนดนตรีไทย
      ['=== 4. ผู้สอนดนตรีไทย ==='],
      ['รายชื่อครู'],
      ...formatTeachersData(submission.regsup_thaiMusicTeachers || submission.thaiMusicTeachers),
      [''],
      ['ระยะเวลาการเรียนการสอนในเวลาราชการ'],
      ...(submission.regsup_teachingScheduleRegular || submission.teachingScheduleRegular || []).length > 0 
        ? [
            ['ระดับชั้น', 'เรียนดนตรีไทยจำนวน (คน)', 'ชั่วโมง/ภาคการศึกษา', 'ชั่วโมง/ปีการศึกษา'],
            ...(submission.regsup_teachingScheduleRegular || submission.teachingScheduleRegular).map((item: any) => [
              item.gradeLevel || '-',
              item.studentCount || '-',
              item.hoursPerSemester || '-',
              item.hoursPerYear || '-'
            ])
          ]
        : [['ไม่มีข้อมูล']],
      [''],
      ['ระยะเวลาการเรียนการสอนนอกเวลาราชการ'],
      ...(submission.regsup_teachingScheduleAfterHours || submission.teachingScheduleAfterHours || []).length > 0
        ? [
            ['วัน', 'เวลา', 'ถึง', 'สถานที่'],
            ...(submission.regsup_teachingScheduleAfterHours || submission.teachingScheduleAfterHours).map((item: any) => [
              item.day || '-',
              item.time || '-',
              item.endTime || '-',
              item.location || '-'
            ])
          ]
        : [['ไม่มีข้อมูล']],
      [''],
      
      // 5. สถานที่
      ['=== 5. สถานที่ ==='],
      ['สถานที่สอน', getFieldValue('teachingLocation')],
      [''],
      
      // 6. การสนับสนุน
      ['=== 6. การสนับสนุน ==='],
      ['นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา'],
      ['ผู้มีส่วนส่งเสริม สนับสนุนการเรียนการสอนดนตรีไทย (ระบุนโยบายการจัดการเรียนการสอนดนตรีไทยของโรงเรียน วิธีการใช้ความสนับสนุน)'],
      ...(submission.regsup_supportFactors || submission.supportFactors || []).length > 0
        ? [
            ['ลำดับ', 'องค์กร/หน่วยงาน/บุคคลที่ให้การส่งเสริม สนับสนุน', 'บรรยาย และอธิบายสนับสนุน'],
            ...(submission.regsup_supportFactors || submission.supportFactors).map((factor: any, index: number) => [
              index + 1,
              factor.sup_supportByAdmin || factor.sup_supportBySchoolBoard || factor.sup_supportByOthers || '-',
              factor.sup_supportByDescription || '-'
            ])
          ]
        : [['ไม่มีข้อมูล']],
      [''],
      ['ได้รับการสนับสนุนจากต้นสังกัด (บุคคล/หน่วยงานภายใน)'],
      ...(submission.regsup_supportFromOrg || submission.supportFromOrg || []).length > 0
        ? [
            ['บุคคล/หน่วยงาน', 'รายละเอียด', 'หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)'],
            ...(submission.regsup_supportFromOrg || submission.supportFromOrg).map((org: any) => [
              org.organization || '-',
              org.details || '-',
              org.evidenceLink || '-'
            ])
          ]
        : [['ไม่มีข้อมูล']],
      [''],
      ['ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก'],
      ...(submission.regsup_supportFromExternal || submission.supportFromExternal || []).length > 0
        ? [
            ['บุคคล/หน่วยงาน', 'รายละเอียด', 'หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)'],
            ...(submission.regsup_supportFromExternal || submission.supportFromExternal).map((org: any) => [
              org.organization || '-',
              org.details || '-',
              org.evidenceLink || '-'
            ])
          ]
        : [['ไม่มีข้อมูล']],
      [''],
      
      // 7. ผลงาน
      ['=== 7. ผลงาน ==='],
      ['รางวัล'],
      ...(submission.regsup_awards || submission.awards || []).length > 0
        ? [
            ['ระดับรางวัล', 'ชื่อรางวัล', 'วันที่ได้รับรางวัล', 'ลิงก์หลักฐาน'],
            ...(submission.regsup_awards || submission.awards).map((award: any) => [
              award.awardLevel || '-',
              award.awardName || '-',
              award.awardDate || '-',
              award.awardEvidenceLink || '-'
            ])
          ]
        : [['ไม่มีข้อมูลรางวัล']],
      [''],
      ['ภาพถ่ายผลงาน และคลิปวิดีโอที่มีความชัดเจน และสื่อให้เห็นถึงความเป็นโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย ๑๐๐ เปอร์เซ็นต์'],
      [''],
      ['ภาพถ่ายผลงาน หรือกิจกรรมเด่น ตั้งแต่ปีการศึกษา 2567 - พฤษภาคม 2568 จำนวน 10 - 20 ภาพ เท่านั้น!!!'],
      ['Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)'],
      ['ลิงก์แกลเลอรี่รูปภาพ', getFieldValue('photoGalleryLink')],
      ['กรุณาเปลี่ยนที่สามารถเข้าถึงได้ "ทุกคนในอินเทอร์เน็ต จะดูได้ทั้งหมดโดยไม่ต้องลงชื่อเข้าใช้"'],
      [''],
      ['วิดีโอ/คลิป'],
      ['กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"'],
      [''],
      ['1 บรรยากาศการเรียนการสอนในชั้นเรียน และในสถานศึกษา ความยาวไม่เกิน 3 นาที'],
      ['Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)'],
      ['ลิงก์วิดีโอ 1', getFieldValue('videoLink')],
      [''],
      ['2 การแสดงผลงานด้านดนตรีของนักเรียน ความยาวไม่เกิน 3 นาที'],
      ['Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)'],
      ['ลิงก์วิดีโอ 2', getFieldValue('videoLink2')],
      [''],
      
      // 8. การเผยแพร่
      ['=== 8. การเผยแพร่ ==='],
      ...formatActivitiesData(submission.regsup_activitiesWithinProvinceInternal || submission.activitiesWithinProvinceInternal, 'กิจกรรมภายในจังหวัด (ภายใน)'),
      [''],
      ...formatActivitiesData(submission.regsup_activitiesWithinProvinceExternal || submission.activitiesWithinProvinceExternal, 'กิจกรรมภายในจังหวัด (ภายนอก)'),
      [''],
      ...formatActivitiesData(submission.regsup_activitiesOutsideProvince || submission.activitiesOutsideProvince, 'กิจกรรมนอกจังหวัด'),
      [''],
      
      // 9. การประชาสัมพันธ์
      ['=== 9. การประชาสัมพันธ์ ==='],
      ['การประชาสัมพันธ์ผลงานของสถานศึกษา'],
      ...(submission.regsup_prActivities || submission.prActivities || []).length > 0
        ? [
            ['ชื่อกิจกรรม/งาน', 'วันที่เผยแพร่', 'หลักฐานการเผยแพร่ (Link/URL)', 'แหล่งเผยแพร่/ประชาสัมพันธ์ในสื่อสังคมออนไลน์'],
            ...(submission.regsup_prActivities || submission.prActivities).map((activity: any) => [
              activity.activityName || '-',
              activity.publishDate || '-',
              activity.evidenceLink || '-',
              activity.platform || '-'
            ])
          ]
        : [['ไม่มีข้อมูลกิจกรรมประชาสัมพันธ์']],
      [''],
      ['ได้รับข้อมูลการสมัครโรงเรียนสนับสนุนและส่งเสริมจาก'],
      ['โรงเรียน', getFieldValue('heardFromSchool') ? `${getFieldValue('heardFromSchoolName')} อำเภอ ${getFieldValue('heardFromSchoolDistrict')} จังหวัด ${getFieldValue('heardFromSchoolProvince')}` : 'ไม่ได้เลือก'],
      ['สำนักงานวัฒนธรรมจังหวัด', getFieldValue('heardFromCulturalOffice') ? getFieldValue('heardFromCulturalOfficeName') : 'ไม่ได้เลือก'],
      ['สำนักงานเขตพื้นที่การศึกษา', getFieldValue('heardFromEducationArea') ? `${getFieldValue('heardFromEducationAreaName')} จังหวัด ${getFieldValue('heardFromEducationAreaProvince')}` : 'ไม่ได้เลือก'],
      ['อื่น ๆ ระบุ', getFieldValue('heardFromOther') ? getFieldValue('heardFromOtherDetail') : 'ไม่ได้เลือก'],
      [''],
      ['ช่องทางการประชาสัมพันธ์ของกรมส่งเสริมวัฒนธรรม'],
      ['เฟซบุ๊ก (Facebook)', getFieldValue('DCP_PR_Channel_FACEBOOK') ? 'ใช้' : 'ไม่ใช้'],
      ['ยูทูบ (YouTube)', getFieldValue('DCP_PR_Channel_YOUTUBE') ? 'ใช้' : 'ไม่ใช้'],
      ['ติ๊กต๊อก (TikTok)', getFieldValue('DCP_PR_Channel_Tiktok') ? 'ใช้' : 'ไม่ใช้'],
      [''],
      ['ปัญหาและอุปสรรคที่มีผลกระทบต่อการเรียนการสอนดนตรีไทย', getFieldValue('obstacles')],
      ['ข้อเสนอแนะในการส่งเสริมดนตรีไทยในสถานศึกษา', getFieldValue('suggestions')],
      [''],
      ['รับรองความถูกต้อง'],
      ['ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในแบบฟอร์มนี้เป็นความจริงทุกประการ', (getFieldValue('certifiedByAdmin') || getFieldValue('regsup_certifiedByAdmin')) ? 'ยอมรับ' : 'ไม่ยอมรับ'],
      [''],
      
      // Footer
      ['สร้างเมื่อ', new Date().toLocaleDateString('th-TH', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })],
      ['กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ ประจำปีงบประมาณ พ.ศ. 2569']
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
