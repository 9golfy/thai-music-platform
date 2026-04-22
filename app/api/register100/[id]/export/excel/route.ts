import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getSchoolSizeDisplayText } from '@/lib/utils/schoolSize';

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db(dbName);
    const collection = database.collection('register100_submissions');
    
    const submission = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!submission) {
      await client.close();
      return NextResponse.json({ success: false, message: 'ไม่พบข้อมูล' }, { status: 404 });
    }

    // Helper function to get field value with fallback
    const getFieldValue = (fieldName: string) => {
      return submission[`reg100_${fieldName}`] ?? submission[fieldName] ?? '';
    };

    const getDisplayValue = (fieldName: string) => {
      const value = getFieldValue(fieldName);
      if (fieldName === 'schoolSize') {
        return getSchoolSizeDisplayText(value) || value;
      }
      return value;
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
        teacherRows.push(['ชื่อ-นามสกุล', teacher.teacherFullName || teacher.teacherName || '-']);
        teacherRows.push(['ตำแหน่ง *', teacher.teacherPosition || '-']);
        teacherRows.push(['อีเมล *', teacher.teacherEmail || '-']);
        teacherRows.push(['เบอร์โทรศัพท์ *', teacher.teacherPhone || '-']);
        teacherRows.push(['ทักษะ ความรู้ ความสามารถ ในการสอนภาคปฏิบัติดนตรีไทย *', teacher.teacherAbility || '-']);
        teacherRows.push(['=== สำเร็จการศึกษาด้านดนตรีไทย * ===']);
        if (teacher.musicInstituteEducation?.length > 0) {
          teacher.musicInstituteEducation.forEach((edu: any) => {
            teacherRows.push(['วุฒิการศึกษา/ประกาศนียบัตร *', edu.graduationYear || '-']);
            teacherRows.push(['สาขา/หลักสูตร *', edu.major || '-']);
            teacherRows.push(['ปีที่สำเร็จการศึกษา / ได้รับประกาศนียบัตร *', edu.completionYear || '-']);
          });
        } else {
          teacherRows.push(['ไม่มีข้อมูลการศึกษาด้านดนตรีไทย']);
        }
        teacherRows.push(['=== สำเร็จการศึกษาด้านอื่น * ===']);
        if (teacher.otherEducation?.length > 0) {
          teacher.otherEducation.forEach((edu: any) => {
            teacherRows.push(['วุฒิการศึกษา/ประกาศนียบัตร *', edu.graduationYear || '-']);
            teacherRows.push(['สาขา/หลักสูตร *', edu.major || '-']);
            teacherRows.push(['ปีที่สำเร็จการศึกษา / ได้รับประกาศนียบัตร *', edu.completionYear || '-']);
          });
        } else {
          teacherRows.push(['ไม่มีข้อมูลการศึกษาด้านอื่น']);
        }
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
      ['รายงานข้อมูลโรงเรียนดนตรีไทย 100%'],
      ['ชื่อสถานศึกษา:', getFieldValue('schoolName')],
      [''],
      
      // 1. ข้อมูลพื้นฐาน
      ['=== 1. ข้อมูลพื้นฐาน ==='],
      ['ชื่อสถานศึกษา', getFieldValue('schoolName')],
      ['จังหวัด', getFieldValue('schoolProvince')],
      ['ระดับการศึกษา', getFieldValue('schoolLevel')],
      ['สังกัด', getFieldValue('affiliation')],
      ['ระบุ', getFieldValue('affiliationDetail')],
      ['ขนาดโรงเรียน', getDisplayValue('schoolSize')],
      ['จำนวนบุคลากร', getFieldValue('staffCount')],
      ['จำนวนนักเรียน', getFieldValue('studentCount')],
      ['จำนวนนักเรียนแต่ละชั้น', getFieldValue('studentCountByGrade')],
      ['ที่อยู่', `เลขที่ ${getFieldValue('mgtAddress')} หมู่ ${getFieldValue('mgtVillage')} ถนน ${getFieldValue('mgtRoad')} ตำบล/แขวง ${getFieldValue('mgtSubdistrict')} อำเภอ/เขต ${getFieldValue('mgtDistrict')} จังหวัด ${getFieldValue('mgtProvince')} รหัสไปรษณีย์ ${getFieldValue('mgtPostalCode')}`],
      ['โทรศัพท์', getFieldValue('mgtPhone')],
      ['โทรสาร', getFieldValue('mgtFax')],
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
      ...formatCurrentMusicTypesData(submission.reg100_currentMusicTypes || submission.currentMusicTypes),
      [''],
      
      // 4. ผู้สอนดนตรีไทย
      ['=== 4. ผู้สอนดนตรีไทย ==='],
      ['รายชื่อครู'],
      ...formatTeachersData(submission.reg100_thaiMusicTeachers || submission.thaiMusicTeachers),
      [''],
      ['ระยะเวลาการเรียนการสอนในเวลาราชการ'],
      ...(submission.reg100_compulsoryCurriculum || []).length > 0 
        ? [
            ['ระดับชั้น', 'เรียนดนตรีไทยจำนวน (คน)', 'ชั่วโมง/ภาคการศึกษา', 'ชั่วโมง/ปีการศึกษา'],
            ...submission.reg100_compulsoryCurriculum.map((item: any) => [
              item.gradeLevel || '-',
              item.studentCount || '-',
              item.hoursPerSemester || '-',
              item.hoursPerYear || '-'
            ])
          ]
        : [['ไม่มีข้อมูล']],
      [''],
      ['ระยะเวลาการเรียนการสอนนอกเวลาราชการ'],
      ...(submission.reg100_afterSchoolSchedule || []).length > 0
        ? [
            ['วัน', 'เวลา', 'ถึง', 'สถานที่'],
            ...submission.reg100_afterSchoolSchedule.map((item: any) => [
              item.day || '-',
              item.timeFrom || '-',
              item.timeTo || '-',
              item.location || '-'
            ])
          ]
        : [['ไม่มีข้อมูล']],
      [''],
      
      // 5. หลักสูตร
      ['=== 5. หลักสูตร ==='],
      ['เป็นวิชาบังคับในชั้นเรียน', getFieldValue('isCompulsorySubject') ? 'มี' : 'ไม่มี'],
      ...(submission.reg100_compulsoryCurriculum || []).length > 0 
        ? [
            ['รายละเอียดวิชาบังคับ'],
            ['ระดับชั้น', 'จำนวนนักเรียน (คน)', 'ชั่วโมง/ภาคการศึกษา', 'ชั่วโมง/ปีการศึกษา'],
            ...submission.reg100_compulsoryCurriculum.map((item: any) => [
              item.gradeLevel || '-',
              item.studentCount || '-',
              item.hoursPerSemester || '-',
              item.hoursPerYear || '-'
            ])
          ]
        : [],
      [''],
      ['มีวิชาเลือก/วิชาเรียนเพิ่มเติม/ชุมนุม', getFieldValue('hasElectiveSubject') ? 'มี' : 'ไม่มี'],
      ...(submission.reg100_electiveCurriculum || []).length > 0
        ? [
            ['รายละเอียดวิชาเลือก'],
            ['ระดับชั้น', 'จำนวนนักเรียน (คน)', 'ชั่วโมง/ภาคการศึกษา', 'ชั่วโมง/ปีการศึกษา'],
            ...submission.reg100_electiveCurriculum.map((item: any) => [
              item.gradeLevel || '-',
              item.studentCount || '-',
              item.hoursPerSemester || '-',
              item.hoursPerYear || '-'
            ])
          ]
        : [],
      [''],
      ['มีหลักสูตรวิชาของท้องถิ่น', getFieldValue('hasLocalCurriculum') ? 'มี' : 'ไม่มี'],
      ...(submission.reg100_localCurriculum || []).length > 0
        ? [
            ['รายละเอียดหลักสูตรท้องถิ่น'],
            ['ระดับชั้น', 'จำนวนนักเรียน (คน)', 'ชั่วโมง/ภาคการศึกษา', 'ชั่วโมง/ปีการศึกษา'],
            ...submission.reg100_localCurriculum.map((item: any) => [
              item.gradeLevel || '-',
              item.studentCount || '-',
              item.hoursPerSemester || '-',
              item.hoursPerYear || '-'
            ])
          ]
        : [],
      [''],
      ['นอกเวลาราชการ', getFieldValue('hasAfterSchoolTeaching') ? 'มี' : 'ไม่มี'],
      ...(submission.reg100_afterSchoolSchedule || []).length > 0
        ? [
            ['ตารางเรียนนอกเวลา'],
            ['วัน', 'เวลาเริ่ม', 'เวลาสิ้นสุด', 'สถานที่'],
            ...submission.reg100_afterSchoolSchedule.map((item: any) => [
              item.day || '-',
              item.timeFrom || '-',
              item.timeTo || '-',
              item.location || '-'
            ])
          ]
        : [],
      [''],
      ['สถานที่สอน', getFieldValue('teachingLocation')],
      [''],
      
      // 6. การสนับสนุน
      ['=== 6. การสนับสนุน ==='],
      ['1. นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา'],
      ...(submission.reg100_supportFactors || []).length > 0
        ? [
            ['องค์กร/หน่วยงาน/บุคคลที่ให้การส่งเสริม สนับสนุน', 'บรรยาย และอธิบายสนับสนุน'],
            ...submission.reg100_supportFactors.map((item: any) => [
              item.sup_supportByAdmin || '-',
              item.sup_supportByDescription || '-'
            ])
          ]
        : [['ไม่มีข้อมูล']],
      [''],
      ['2. การสนับสนุนวัสดุ อุปกรณ์ หรืองบประมาณ'],
      ['การสนับสนุนจากต้นสังกัด', getFieldValue('hasSupportFromOrg') ? 'มี' : 'ไม่มี'],
      ...getFieldValue('hasSupportFromOrg') && (submission.reg100_supportFromOrg || []).length > 0
        ? [
            ['บุคคล/หน่วยงาน', 'รายละเอียด', 'ลิงก์หลักฐาน'],
            ...submission.reg100_supportFromOrg.map((support: any) => [
              support.organization || '-',
              support.details || '-',
              support.evidenceLink || '-'
            ])
          ]
        : [],
      [''],
      ['การสนับสนุนจากภายนอก', getFieldValue('hasSupportFromExternal') ? 'มี' : 'ไม่มี'],
      ...getFieldValue('hasSupportFromExternal') && (submission.reg100_supportFromExternal || []).length > 0
        ? [
            ['บุคคล/หน่วยงาน', 'รายละเอียด', 'ลิงก์หลักฐาน'],
            ...submission.reg100_supportFromExternal.map((support: any) => [
              support.organization || '-',
              support.details || '-',
              support.evidenceLink || '-'
            ])
          ]
        : [],
      [''],
      ['3. ความพร้อมของเครื่องดนตรีกับนักเรียน'],
      ['เพียงพอ', getFieldValue('instrumentReadiness_sufficient')],
      ['ไม่เพียงพอ', getFieldValue('instrumentReadiness_insufficient')],
      [''],
      ['4. กรอบการเรียนการสอน'],
      ['สถานศึกษามีกรอบการเรียนการสอนดนตรีไทย', getFieldValue('curriculumFramework')],
      ['ผลลัพธ์ในการเรียนการสอนด้านดนตรีไทย', getFieldValue('learningOutcomes')],
      ['การบริหารจัดการสอนดนตรีไทยของสถานศึกษา', getFieldValue('managementContext')],
      [''],
      
      // 7. ผลงาน
      ['=== 7. ผลงาน ==='],
      ['รางวัลและเกียรติคุณที่ได้รับในระยะเวลา ๑ ปี ย้อนหลัง'],
      ...formatAwardsData(submission.reg100_awards || submission.awards),
      [''],
      ['ภาพถ่ายผลงาน และคลิปวิดีโอที่มีความชัดเจน และสื่อให้เห็นถึงความเป็นโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์'],
      [''],
      ['ภาพถ่ายผลงาน หรือกิจกรรมเด่น ตั้งแต่ปีการศึกษา 2567 - พฤษภาคม 2568 จำนวน 10 - 20 ภาพ เท่านั้น!!!'],
      ['Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)'],
      ['ลิงก์แกลเลอรี่รูปภาพ', getFieldValue('photoGalleryLink')],
      ['กรุณาเปลี่ยนที่สามารถเข้าถึงได้ "ทุกคนในอินเทอร์เน็ต จะดูได้ทั้งหมดโดยไม่ต้องลงชื่อเข้าใช้"'],
      [''],
      ['วิดีโอ/คลิป'],
      ['กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"'],
      [''],
      ['1. บรรยากาศการเรียนการสอนในชั้นเรียน (ทุกระดับชั้น)'],
      ['Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)'],
      ['ลิงก์วิดีโอ 1', getFieldValue('videoLink')],
      [''],
      ['2. การแสดงผลงานด้านดนตรีไทยของนักเรียนทั้งโรงเรียน'],
      ['Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)'],
      ['ลิงก์วิดีโอ 2', getFieldValue('videoLink2')],
      [''],
      
      // 8. การเผยแพร่
      ['=== 8. การเผยแพร่ ==='],
      ...formatActivitiesData(submission.reg100_activitiesWithinProvinceInternal || submission.activitiesWithinProvinceInternal, 'กิจกรรมภายในจังหวัด (ภายใน)'),
      [''],
      ...formatActivitiesData(submission.reg100_activitiesWithinProvinceExternal || submission.activitiesWithinProvinceExternal, 'กิจกรรมภายในจังหวัด (ภายนอก)'),
      [''],
      ...formatActivitiesData(submission.reg100_activitiesOutsideProvince || submission.activitiesOutsideProvince, 'กิจกรรมนอกจังหวัด'),
      [''],
      
      // 9. การประชาสัมพันธ์
      ['=== 9. การประชาสัมพันธ์ ==='],
      ['การประชาสัมพันธ์ผลงานของสถานศึกษา'],
      ...(submission.reg100_prActivities && submission.reg100_prActivities.length > 0 
        ? [
            ['ชื่อกิจกรรม', 'วันที่เผยแพร่', 'ลิงก์หลักฐาน', 'แพลตฟอร์ม'],
            ...submission.reg100_prActivities.map((activity: any) => [
              activity.activityName || '-',
              activity.publishDate || '-',
              activity.evidenceLink || '-',
              activity.platform || '-'
            ])
          ]
        : [['ไม่มีข้อมูลกิจกรรมประชาสัมพันธ์']]),
      [''],
      ['ได้รับข้อมูลการสมัครโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์จาก'],
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
      ['ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในแบบฟอร์มนี้เป็นความจริงทุกประการ', (getFieldValue('certifiedByAdmin') || getFieldValue('reg100_certifiedByAdmin')) ? 'ยอมรับ' : 'ไม่ยอมรับ'],
      [''],
      
      // Score Summary
      ['=== สรุปคะแนน ==='],
      ['หมวด', 'คะแนนที่ได้', 'คะแนนเต็ม'],
      ['การเรียนการสอนดนตรีไทย', submission.teacher_training_score || 0, 20],
      ['คุณลักษณะครูผู้สอน', submission.teacher_qualification_score || 0, 20],
      ['การสนับสนุนจากต้นสังกัด', submission.support_from_org_score || 0, 5],
      ['การสนับสนุนจากภายนอก', submission.support_from_external_score || 0, 15],
      ['รางวัลและเกียรติคุณ', submission.award_score || 0, 20],
      ['กิจกรรมภายในสถานศึกษา', submission.activity_within_province_internal_score || 0, 5],
      ['กิจกรรมภายนอกสถานศึกษา', submission.activity_within_province_external_score || 0, 5],
      ['กิจกรรมนอกจังหวัด', submission.activity_outside_province_score || 0, 5],
      ['การประชาสัมพันธ์', submission.pr_activity_score || 0, 5],
      ['รวมทั้งหมด', totalScore, 100],
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
        'Content-Disposition': `attachment; filename="register100-${encodeURIComponent(schoolName)}-${timestamp}.csv"`,
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
