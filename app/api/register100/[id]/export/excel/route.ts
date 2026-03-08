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

    const schoolName = getFieldValue('schoolName') || 'ไม่ระบุ';
    const totalScore = submission.total_score || 0;

    // Helper function to format teachers data for CSV
    const formatTeachersData = (teachers: any[]) => {
      if (!teachers || teachers.length === 0) return [['ไม่มีข้อมูลครู']];
      
      const teacherRows: any[][] = [];
      teachers.forEach((teacher, index) => {
        teacherRows.push([`ครูคนที่ ${index + 1}`]);
        teacherRows.push(['คุณลักษณะ', teacher.teacherQualification || '-']);
        teacherRows.push(['ชื่อ-นามสกุล', teacher.teacherName || '-']);
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
      
      // Step 1: ข้อมูลพื้นฐาน
      ['=== STEP 1: ข้อมูลพื้นฐาน ==='],
      ['ชื่อสถานศึกษา', getFieldValue('schoolName')],
      ['จังหวัด', getFieldValue('schoolProvince')],
      ['ระดับการศึกษา', getFieldValue('schoolLevel')],
      ['สังกัด', getFieldValue('affiliation')],
      ['ขนาดโรงเรียน', getFieldValue('schoolSize')],
      ['จำนวนบุคลากร', getFieldValue('staffCount')],
      ['จำนวนนักเรียน', getFieldValue('studentCount')],
      ['จำนวนนักเรียนแต่ละชั้น', getFieldValue('studentCountByGrade')],
      ['ที่อยู่', `เลขที่ ${getFieldValue('mgtAddress')} หมู่ ${getFieldValue('mgtVillage')} ถนน ${getFieldValue('mgtRoad')} ตำบล/แขวง ${getFieldValue('mgtSubdistrict')} อำเภอ/เขต ${getFieldValue('mgtDistrict')} จังหวัด ${getFieldValue('mgtProvince')} รหัสไปรษณีย์ ${getFieldValue('mgtPostalCode')}`],
      ['โทรศัพท์', getFieldValue('mgtPhone')],
      ['โทรสาร', getFieldValue('mgtFax')],
      [''],
      
      // Step 2: ผู้บริหารสถานศึกษา
      ['=== STEP 2: ผู้บริหารสถานศึกษา ==='],
      ['ชื่อ-นามสกุล', getFieldValue('mgtFullName')],
      ['ตำแหน่ง', getFieldValue('mgtPosition')],
      ['ที่อยู่', getFieldValue('mgtAddress')],
      ['โทรศัพท์', getFieldValue('mgtPhone')],
      ['อีเมล', getFieldValue('mgtEmail')],
      [''],
      
      // Step 3: แผนการสอนดนตรีไทย
      ['=== STEP 3: แผนการสอนดนตรีไทย ==='],
      ['สภาวการณ์การเรียนการสอน ม.1-3', getFieldValue('teachingSituation_M1_M3')],
      ['สภาวการณ์การเรียนการสอน ม.4-6', getFieldValue('teachingSituation_M4_M6')],
      [''],
      ['ความพร้อมเครื่องดนตรี'],
      ...formatInstrumentsData(submission.reg100_readinessItems || submission.readinessItems),
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
      ...formatTeachersData(submission.reg100_thaiMusicTeachers || submission.thaiMusicTeachers),
      [''],
      
      // Step 5: การสนับสนุนและรางวัล
      ['=== STEP 5: การสนับสนุนและรางวัล ==='],
      ...formatSupportOrgsData(submission.reg100_supportFromOrg || submission.supportFromOrg, 'การสนับสนุนจากต้นสังกัด'),
      [''],
      ...formatSupportOrgsData(submission.reg100_supportFromExternal || submission.supportFromExternal, 'การสนับสนุนจากภายนอก'),
      [''],
      ['กรอบหลักสูตร', getFieldValue('curriculumFramework')],
      ['ผลการเรียนรู้', getFieldValue('learningOutcomes')],
      ['บริบทการจัดการ', getFieldValue('managementContext')],
      [''],
      ['รางวัลและเกียรติคุณ'],
      ...formatAwardsData(submission.reg100_awards || submission.awards),
      [''],
      
      // Step 6: สื่อและวิดีโอ
      ['=== STEP 6: สื่อและวิดีโอ ==='],
      ['ลิงก์แกลเลอรี่รูปภาพ', getFieldValue('photoGalleryLink')],
      ['ลิงก์วิดีโอ', getFieldValue('videoLink')],
      [''],
      
      // Step 7: กิจกรรมและการเผยแพร่
      ['=== STEP 7: กิจกรรมและการเผยแพร่ ==='],
      ...formatActivitiesData(submission.reg100_activitiesWithinProvinceInternal || submission.activitiesWithinProvinceInternal, 'กิจกรรมภายในจังหวัด (ภายใน)'),
      [''],
      ...formatActivitiesData(submission.reg100_activitiesWithinProvinceExternal || submission.activitiesWithinProvinceExternal, 'กิจกรรมภายในจังหวัด (ภายนอก)'),
      [''],
      ...formatActivitiesData(submission.reg100_activitiesOutsideProvince || submission.activitiesOutsideProvince, 'กิจกรรมนอกจังหวัด'),
      [''],
      
      // Step 8: ประชาสัมพันธ์และแหล่งข้อมูล
      ['=== STEP 8: ประชาสัมพันธ์และแหล่งข้อมูล ==='],
      ...formatActivitiesData(submission.reg100_prActivities || submission.prActivities, 'กิจกรรมประชาสัมพันธ์'),
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