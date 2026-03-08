import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import * as XLSX from 'xlsx';

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
    const schoolProvince = getFieldValue('schoolProvince') || 'ไม่ระบุ';
    const schoolLevel = getFieldValue('schoolLevel') || 'ไม่ระบุ';
    const totalScore = submission.total_score || 0;

    // Get comprehensive data from all steps - using correct field names from database
    const schoolAddress = `${getFieldValue('addressNo') || ''} หมู่ ${getFieldValue('moo') || ''} ${getFieldValue('road') || ''} ตำบล${getFieldValue('subDistrict') || ''} อำเภอ${getFieldValue('district') || ''} ${getFieldValue('provinceAddress') || ''} ${getFieldValue('postalCode') || ''}`.trim() || 'ไม่ระบุ';
    const schoolPhone = getFieldValue('phone') || 'ไม่ระบุ';
    const schoolEmail = getFieldValue('email') || 'ไม่ระบุ';
    const schoolWebsite = getFieldValue('website') || 'ไม่ระบุ';
    const principalName = getFieldValue('mgtFullName') || 'ไม่ระบุ';
    const principalPhone = getFieldValue('mgtPhone') || 'ไม่ระบุ';
    const principalEmail = getFieldValue('mgtEmail') || 'ไม่ระบุ';
    const contactPersonName = getFieldValue('contactPersonName') || principalName;
    const contactPersonPhone = getFieldValue('contactPersonPhone') || principalPhone;
    const contactPersonEmail = getFieldValue('contactPersonEmail') || principalEmail;
    
    const teachers = getFieldValue('thaiMusicTeachers') || [];
    const awards = getFieldValue('awards') || [];
    const supportFromOrg = getFieldValue('supportFromOrg') || [];
    const supportFromExternal = getFieldValue('supportFromExternal') || [];
    const activitiesInternal = getFieldValue('activitiesWithinProvinceInternal') || [];
    const activitiesExternal = getFieldValue('activitiesWithinProvinceExternal') || [];
    const activitiesOutside = getFieldValue('activitiesOutsideProvince') || [];
    const prActivities = getFieldValue('prActivities') || [];
    const readinessItems = getFieldValue('readinessItems') || [];
    const informationSources = getFieldValue('informationSources') || [];
    const obstacles = getFieldValue('obstacles') || 'ไม่ระบุ';
    const suggestions = getFieldValue('suggestions') || 'ไม่ระบุ';
    const certification = getFieldValue('certification') || false;

    // Create step-by-step Excel data
    const worksheetData = [
      ['รายงานข้อมูลโรงเรียน'],
      [''],
      ['คะแนนรวม', `${totalScore} / 100 คะแนน`],
      [''],
      
      // Step 1: ข้อมูลพื้นฐาน
      ['Step 1: ข้อมูลพื้นฐาน'],
      ['ชื่อสถานศึกษา', schoolName],
      ['จังหวัด', schoolProvince],
      ['ระดับการศึกษา', schoolLevel],
      ['สังกัด', getFieldValue('affiliation')],
      ['ขนาดโรงเรียน', getFieldValue('schoolSize')],
      ['จำนวนบุคลากร', getFieldValue('staffCount')],
      ['จำนวนนักเรียน', getFieldValue('studentCount')],
      [''],
      ['สถานที่ตั้ง'],
      ['เลขที่', getFieldValue('addressNo')],
      ['หมู่', getFieldValue('moo')],
      ['ถนน', getFieldValue('road')],
      ['ตำบล/แขวง', getFieldValue('subDistrict')],
      ['อำเภอ/เขต', getFieldValue('district')],
      ['จังหวัด', getFieldValue('provinceAddress')],
      ['รหัสไปรษณีย์', getFieldValue('postalCode')],
      ['โทรศัพท์', getFieldValue('phone')],
      ['โทรสาร', getFieldValue('fax')],
      [''],
      
      // Step 2: ผู้บริหารสถานศึกษา
      ['Step 2: ผู้บริหารสถานศึกษา'],
      ['ชื่อ-นามสกุล', getFieldValue('mgtFullName')],
      ['ตำแหน่ง', getFieldValue('mgtPosition')],
      ['ที่อยู่', getFieldValue('mgtAddress')],
      ['โทรศัพท์', getFieldValue('mgtPhone')],
      ['อีเมล', getFieldValue('mgtEmail')],
      [''],
      
      // Step 3: ผู้ติดต่อ
      ['Step 3: ผู้ติดต่อ'],
      ['ชื่อผู้ติดต่อ', getFieldValue('contactPersonName')],
      ['โทรศัพท์', getFieldValue('contactPersonPhone')],
      ['อีเมล', getFieldValue('contactPersonEmail')],
      ['']
    ];

    // Step 4: ข้อมูลครูผู้สอนดนตรีไทย
    worksheetData.push(['Step 4: ข้อมูลครูผู้สอนดนตรีไทย']);
    if (teachers.length > 0) {
      worksheetData.push(['ลำดับ', 'ชื่อ-นามสกุล', 'คุณลักษณะ', 'หมายเหตุ']);
      teachers.forEach((teacher: any, index: number) => {
        worksheetData.push([
          index + 1,
          teacher.teacherName || 'ไม่ระบุ',
          teacher.teacherQualification || 'ไม่ระบุ',
          teacher.teacherNote || '-'
        ]);
      });
    } else {
      worksheetData.push(['ไม่มีข้อมูล']);
    }
    worksheetData.push(['']);

    // Step 5: การสนับสนุนและรางวัล
    worksheetData.push(['Step 5: การสนับสนุนและรางวัล']);
    
    // การสนับสนุนจากต้นสังกัด
    worksheetData.push(['การสนับสนุนจากต้นสังกัด']);
    if (supportFromOrg.length > 0) {
      worksheetData.push(['ลำดับ', 'รายการสนับสนุน', 'ประเภท', 'หมายเหตุ']);
      supportFromOrg.forEach((support: any, index: number) => {
        worksheetData.push([
          index + 1,
          support.supportName || 'ไม่ระบุ',
          support.supportType || 'ไม่ระบุ',
          support.supportNote || '-'
        ]);
      });
    } else {
      worksheetData.push(['ไม่มีข้อมูล']);
    }
    worksheetData.push(['']);

    // การสนับสนุนจากภายนอก
    worksheetData.push(['การสนับสนุนจากภายนอก']);
    if (supportFromExternal.length > 0) {
      worksheetData.push(['ลำดับ', 'หน่วยงาน', 'รายการสนับสนุน', 'หมายเหตุ']);
      supportFromExternal.forEach((support: any, index: number) => {
        worksheetData.push([
          index + 1,
          support.organizationName || 'ไม่ระบุ',
          support.supportDetails || 'ไม่ระบุ',
          support.supportNote || '-'
        ]);
      });
    } else {
      worksheetData.push(['ไม่มีข้อมูล']);
    }
    worksheetData.push(['']);

    // รางวัลและเกียรติคุณ
    worksheetData.push(['รางวัลและเกียรติคุณ']);
    if (awards.length > 0) {
      worksheetData.push(['ลำดับ', 'ชื่อรางวัล', 'ระดับ', 'ปี', 'หมายเหตุ']);
      awards.forEach((award: any, index: number) => {
        worksheetData.push([
          index + 1,
          award.awardName || 'ไม่ระบุ',
          award.awardLevel || 'ไม่ระบุ',
          award.awardYear || 'ไม่ระบุ',
          award.awardNote || '-'
        ]);
      });
    } else {
      worksheetData.push(['ไม่มีข้อมูล']);
    }
    worksheetData.push(['']);

    // Step 6: สื่อและเทคโนโลยี
    worksheetData.push(['Step 6: สื่อและเทคโนโลยี']);
    worksheetData.push(['ลิงก์วิดีโอ', getFieldValue('videoLink') || 'ไม่มีข้อมูล']);
    worksheetData.push(['ลิงก์รูปภาพ', getFieldValue('photoGalleryLink') || 'ไม่มีข้อมูล']);
    worksheetData.push(['']);

    // Step 7: กิจกรรมดนตรีไทย
    worksheetData.push(['Step 7: กิจกรรมดนตรีไทย']);
    
    // กิจกรรมภายในสถานศึกษา
    worksheetData.push(['กิจกรรมภายในสถานศึกษา']);
    if (activitiesInternal.length > 0) {
      worksheetData.push(['ลำดับ', 'ชื่อกิจกรรม', 'วันที่จัด', 'หมายเหตุ']);
      activitiesInternal.forEach((activity: any, index: number) => {
        worksheetData.push([
          index + 1,
          activity.activityName || 'ไม่ระบุ',
          activity.activityDate || 'ไม่ระบุ',
          activity.activityNote || '-'
        ]);
      });
    } else {
      worksheetData.push(['ไม่มีข้อมูล']);
    }
    worksheetData.push(['']);

    // กิจกรรมภายนอกสถานศึกษา
    worksheetData.push(['กิจกรรมภายนอกสถานศึกษา']);
    if (activitiesExternal.length > 0) {
      worksheetData.push(['ลำดับ', 'ชื่อกิจกรรม', 'วันที่จัด', 'หมายเหตุ']);
      activitiesExternal.forEach((activity: any, index: number) => {
        worksheetData.push([
          index + 1,
          activity.activityName || 'ไม่ระบุ',
          activity.activityDate || 'ไม่ระบุ',
          activity.activityNote || '-'
        ]);
      });
    } else {
      worksheetData.push(['ไม่มีข้อมูล']);
    }
    worksheetData.push(['']);

    // กิจกรรมนอกจังหวัด
    worksheetData.push(['กิจกรรมนอกจังหวัด']);
    if (activitiesOutside.length > 0) {
      worksheetData.push(['ลำดับ', 'ชื่อกิจกรรม', 'วันที่จัด', 'หมายเหตุ']);
      activitiesOutside.forEach((activity: any, index: number) => {
        worksheetData.push([
          index + 1,
          activity.activityName || 'ไม่ระบุ',
          activity.activityDate || 'ไม่ระบุ',
          activity.activityNote || '-'
        ]);
      });
    } else {
      worksheetData.push(['ไม่มีข้อมูล']);
    }
    worksheetData.push(['']);

    // Step 8: การประชาสัมพันธ์และข้อมูลเพิ่มเติม
    worksheetData.push(['Step 8: การประชาสัมพันธ์และข้อมูลเพิ่มเติม']);
    
    // กิจกรรมประชาสัมพันธ์
    worksheetData.push(['กิจกรรมประชาสัมพันธ์']);
    if (prActivities.length > 0) {
      worksheetData.push(['ลำดับ', 'ชื่อกิจกรรม', 'ช่องทาง', 'หมายเหตุ']);
      prActivities.forEach((activity: any, index: number) => {
        worksheetData.push([
          index + 1,
          activity.activityName || 'ไม่ระบุ',
          activity.prChannel || 'ไม่ระบุ',
          activity.activityNote || '-'
        ]);
      });
    } else {
      worksheetData.push(['ไม่มีข้อมูล']);
    }
    worksheetData.push(['']);

    // แหล่งข้อมูลที่ใช้ในการสมัคร
    worksheetData.push(['แหล่งข้อมูลที่ใช้ในการสมัคร']);
    if (informationSources.length > 0) {
      informationSources.forEach((source: string, index: number) => {
        worksheetData.push([index + 1, source]);
      });
    } else {
      worksheetData.push(['ไม่มีข้อมูล']);
    }
    worksheetData.push(['']);

    // ข้อมูลเพิ่มเติม
    worksheetData.push(['ข้อมูลเพิ่มเติม']);
    worksheetData.push(['อุปสรรคในการดำเนินงาน', obstacles]);
    worksheetData.push(['ข้อเสนอแนะ', suggestions]);
    worksheetData.push(['การรับรองความถูกต้อง', certification ? 'ได้รับรองความถูกต้องแล้ว' : 'ยังไม่ได้รับรอง']);
    worksheetData.push(['']);

    // Footer
    worksheetData.push(['สร้างเมื่อ', new Date().toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })]);
    worksheetData.push(['ระบบบริหารจัดการข้อมูลกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์']);
          index + 1,
          activity.activityName || 'ไม่ระบุ',
          activity.prChannel || 'ไม่ระบุ',
          activity.activityNote || '-'
        ]);
      });
      worksheetData.push(['']);
    }

    if (readinessItems.length > 0) {
      worksheetData.push(['ความพร้อมในการดำเนินงาน'], ['ลำดับ', 'รายการ', 'สถานะ', 'หมายเหตุ']);
      readinessItems.forEach((item: any, index: number) => {
        worksheetData.push([
          index + 1,
          item.itemName || 'ไม่ระบุ',
          item.readinessStatus || 'ไม่ระบุ',
          item.itemNote || '-'
        ]);
      });
      worksheetData.push(['']);
    }

    if (informationSources.length > 0) {
      worksheetData.push(['แหล่งข้อมูลที่ใช้ในการสมัคร']);
      informationSources.forEach((source: string, index: number) => {
        worksheetData.push([`${index + 1}. ${source}`]);
      });
      worksheetData.push(['']);
    }

    worksheetData.push(
      ['ข้อมูลเพิ่มเติม'],
      ['อุปสรรคในการดำเนินงาน', obstacles],
      ['ข้อเสนอแนะ', suggestions],
      ['การรับรองความถูกต้อง', certification ? 'ได้รับรองความถูกต้องแล้ว' : 'ยังไม่ได้รับรอง'],
      [''],
      ['สร้างเมื่อ', new Date().toLocaleDateString('th-TH')]
    );

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 30 },
      { width: 20 },
      { width: 15 },
      { width: 15 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    
    await client.close();
    
    // Generate Excel buffer with proper encoding
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true
    });
    
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="register-support-${encodeURIComponent(schoolName)}.xlsx"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดในการสร้าง Excel' }, { status: 500 });
  }
}