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

    const schoolName = getFieldValue('schoolName') || 'N/A';
    const totalScore = submission.total_score || 0;

    // Helper function to render teachers data
    const renderTeachersData = (teachers: any[]) => {
      if (!teachers || teachers.length === 0) return '<tr><td colspan="100%">ไม่มีข้อมูลครู</td></tr>';
      
      return teachers.map((teacher, index) => `
        <tr><th colspan="2" style="background-color: #e9ecef; text-align: center;">ครูคนที่ ${index + 1}</th></tr>
        <tr><th>บทบาท/หน้าที่ผู้สอน *</th><td>${teacher.teacherQualification || '-'}</td></tr>
        <tr><th>ชื่อ-นามสกุล</th><td>${teacher.teacherFullName || '-'}</td></tr>
        <tr><th>ตำแหน่ง *</th><td>${teacher.teacherPosition || '-'}</td></tr>
        <tr><th>อีเมล *</th><td>${teacher.teacherEmail || '-'}</td></tr>
        <tr><th>เบอร์โทรศัพท์ *</th><td>${teacher.teacherMobilePhone || teacher.teacherPhone || '-'}</td></tr>
        <tr><th>ทักษะ ความรู้ ความสามารถ ในการสอนภาคปฏิบัติดนตรีไทย *</th><td>${teacher.teacherExpertise || '-'}</td></tr>
        <tr><th colspan="2" style="background-color: #d1ecf1; padding: 8px;"><strong>สำเร็จการศึกษาด้านดนตรีไทย *</strong></th></tr>
        <tr><th>วุฒิการศึกษา/ประกาศนียบัตร *</th><td>${teacher.teacherEducation || '-'}</td></tr>
        <tr><th>สาขา/หลักสูตร *</th><td>${teacher.teacherMajor || '-'}</td></tr>
        <tr><th>ปีที่สำเร็จการศึกษา / ได้รับประกาศนียบัตร *</th><td>${teacher.teacherGraduationYear || '-'}</td></tr>
        <tr><th colspan="2" style="background-color: #d4edda; padding: 8px;"><strong>สำเร็จการศึกษาด้านอื่น (แต่สามารถสอนดนตรีไทยได้ เนื่องจากผ่านการเรียน/อบรมด้านดนตรีไทย) *</strong></th></tr>
        <tr><th>วุฒิการศึกษา/ประกาศนียบัตร *</th><td>${teacher.teacherOtherEducation || '-'}</td></tr>
        <tr><th>สาขา/หลักสูตร *</th><td>${teacher.teacherOtherMajor || '-'}</td></tr>
        <tr><th>ปีที่สำเร็จการศึกษา / ได้รับประกาศนียบัตร *</th><td>${teacher.teacherOtherGraduationYear || '-'}</td></tr>
        ${teacher.teacherImage ? `<tr><th>รูปภาพครู</th><td><img src="${teacher.teacherImage}" alt="ครูคนที่ ${index + 1}" style="max-width: 200px; max-height: 200px; object-fit: cover; border-radius: 8px;" /></td></tr>` : ''}
        ${index < teachers.length - 1 ? '<tr><td colspan="2" style="border: none; padding: 10px;"></td></tr>' : ''}
      `).join('');
    };

    // Helper function to render instruments
    const renderInstruments = (instruments: any[]) => {
      if (!instruments || instruments.length === 0) return '<tr><td colspan="3">ไม่มีข้อมูลเครื่องดนตรี</td></tr>';
      
      return instruments.map(instrument => `
        <tr>
          <td>${instrument.instrumentName || '-'}</td>
          <td>${instrument.quantity || '-'}</td>
          <td>${instrument.note || '-'}</td>
        </tr>
      `).join('');
    };

    const renderCurrentMusicTypes = (items: any[]) => {
      if (!items || items.length === 0) return '<tr><td colspan="2">ไม่มีข้อมูลสภาวการณ์การเรียนการสอน</td></tr>';

      return items.map((item) => `
        <tr>
          <th>${item.grade || '-'}</th>
          <td>${item.details || '-'}</td>
        </tr>
      `).join('');
    };

    // Helper function to render activities
    const renderActivities = (activities: any[], title: string) => {
      if (!activities || activities.length === 0) return `<p><strong>${title}:</strong> ไม่มีข้อมูล</p>`;
      
      return `
        <p><strong>${title}:</strong></p>
        <table class="info-table">
          <tr><th>ชื่อกิจกรรม</th><th>วันที่</th><th>ลิงก์หลักฐาน</th></tr>
          ${activities.map(activity => `
            <tr>
              <td>${activity.activityName || '-'}</td>
              <td>${activity.activityDate || activity.publishDate || '-'}</td>
              <td>${activity.evidenceLink || '-'}</td>
            </tr>
          `).join('')}
        </table>
      `;
    };

    // Helper function to render support factors
    const renderSupportFactors = (supportFactors: any[]) => {
      if (!supportFactors || supportFactors.length === 0) return '<tr><td colspan="4">ไม่มีข้อมูลปัจจัยสนับสนุน</td></tr>';
      
      return supportFactors.map((factor, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${factor.sup_supportByAdmin || factor.sup_supportBySchoolBoard || factor.sup_supportByOthers || '-'}</td>
          <td>${factor.sup_supportByDescription || '-'}</td>
          <td>${factor.sup_supportByDate || '-'}</td>
        </tr>
      `).join('');
    };

    // Helper function to render support organizations
    const renderSupportOrgs = (orgs: any[], title: string) => {
      if (!orgs || orgs.length === 0) return `<p><strong>${title}:</strong> ไม่มีข้อมูล</p>`;
      
      return `
        <p><strong>${title}:</strong></p>
        <table class="info-table">
          <tr><th>องค์กร/หน่วยงาน</th><th>รายละเอียด</th><th>ลิงก์หลักฐาน</th></tr>
          ${orgs.map(org => `
            <tr>
              <td>${org.organization || '-'}</td>
              <td>${org.details || '-'}</td>
              <td>${org.evidenceLink || '-'}</td>
            </tr>
          `).join('')}
        </table>
      `;
    };

    // Helper function to render awards
    const renderAwards = (awards: any[]) => {
      if (!awards || awards.length === 0) return '<tr><td colspan="4">ไม่มีข้อมูลรางวัล</td></tr>';
      
      return awards.map(award => `
        <tr>
          <td>${award.awardLevel || '-'}</td>
          <td>${award.awardName || '-'}</td>
          <td>${award.awardDate || '-'}</td>
          <td>${award.awardEvidenceLink || '-'}</td>
        </tr>
      `).join('');
    };

    // Create comprehensive HTML content for PDF with all step data
    const htmlContent = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>รายงานข้อมูลโรงเรียนสนับสนุนและส่งเสริม - ${schoolName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
        body { 
            font-family: 'Sarabun', 'Tahoma', 'Arial', sans-serif; 
            margin: 20px; 
            line-height: 1.6;
            color: #333;
            font-size: 14px;
        }
        h1 { 
            color: #2c5aa0; 
            text-align: center; 
            margin-bottom: 30px;
            font-size: 24px;
            font-weight: 600;
        }
        h2 { 
            color: #666; 
            border-bottom: 2px solid #ccc; 
            padding-bottom: 5px; 
            margin-top: 30px;
            font-size: 18px;
            font-weight: 500;
        }
        h3 {
            color: #555;
            margin-top: 20px;
            font-size: 16px;
            font-weight: 500;
        }
        .info-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0; 
            font-size: 13px;
        }
        .info-table th, .info-table td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
            vertical-align: top;
        }
        .info-table th { 
            background-color: #f8f9fa; 
            font-weight: 500;
            color: #495057;
            width: 30%;
        }
        .score-summary { 
            background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border: 1px solid #c3e6cb;
        }
        .total-score { 
            font-size: 28px; 
            font-weight: 700; 
            color: #155724; 
            text-align: center; 
        }
        .footer { 
            text-align: center; 
            margin-top: 40px; 
            color: #6c757d; 
            font-size: 12px;
            border-top: 1px solid #dee2e6;
            padding-top: 20px;
        }
        .section {
            margin: 25px 0;
            page-break-inside: avoid;
        }
        .checkbox-list {
            margin: 10px 0;
        }
        .checkbox-item {
            margin: 5px 0;
        }
        @media print {
            body { margin: 0; font-size: 12px; }
            .section { break-inside: avoid; }
            h2 { page-break-after: avoid; }
        }
    </style>
</head>
<body>
    <h1>รายงานข้อมูล ${getFieldValue('schoolName')}</h1>

    <!-- Step 1: ข้อมูลพื้นฐาน -->
    <div class="section">
        <h2>1. ข้อมูลพื้นฐาน</h2>
        <table class="info-table">
            <tr><th>ประเภทการสนับสนุน</th><td>${getFieldValue('supportType')}</td></tr>
            <tr><th>ชื่อกลุ่ม/องค์กร</th><td>${getSupportTypeName()}</td></tr>
            <tr><th>จำนวนสมาชิก</th><td>${getSupportTypeMemberCount()}</td></tr>
            <tr><th>ชื่อสถานศึกษา</th><td>${getFieldValue('schoolName')}</td></tr>
            <tr><th>จังหวัด</th><td>${getFieldValue('schoolProvince')}</td></tr>
            <tr><th>ระดับการศึกษา</th><td>${getFieldValue('schoolLevel')}</td></tr>
            <tr><th>สังกัด</th><td>${getFieldValue('affiliation')}</td></tr>
            <tr><th>ระบุ</th><td>${getFieldValue('affiliationDetail')}</td></tr>
            <tr><th>จำนวนบุคลากร</th><td>${getFieldValue('staffCount')}</td></tr>
            <tr><th>จำนวนนักเรียน</th><td>${getFieldValue('studentCount')}</td></tr>
            <tr><th>จำนวนนักเรียนแต่ละชั้น</th><td>${getFieldValue('studentCountByGrade')}</td></tr>
            <tr><th>สถานที่ตั้ง</th><td>เลขที่ ${getFieldValue('addressNo')} หมู่ ${getFieldValue('moo')} ถนน ${getFieldValue('road')} ตำบล/แขวง ${getFieldValue('subDistrict')} อำเภอ/เขต ${getFieldValue('district')} จังหวัด ${getFieldValue('provinceAddress')} รหัสไปรษณีย์ ${getFieldValue('postalCode')}</td></tr>
            <tr><th>โทรศัพท์</th><td>${getFieldValue('phone')}</td></tr>
            <tr><th>โทรสาร</th><td>${getFieldValue('fax')}</td></tr>
        </table>
    </div>

    <!-- Step 2: ผู้บริหาร -->
    <div class="section">
        <h2>2. ผู้บริหาร</h2>
        <table class="info-table">
            ${getFieldValue('mgtImage') ? `<tr><th>รูปภาพ</th><td><img src="${getFieldValue('mgtImage')}" alt="ผู้บริหาร" style="max-width: 200px; max-height: 200px; object-fit: cover; border-radius: 8px;" /></td></tr>` : ''}
            <tr><th>ชื่อ-นามสกุล</th><td>${getFieldValue('mgtFullName')}</td></tr>
            <tr><th>ตำแหน่ง</th><td>${getFieldValue('mgtPosition')}</td></tr>
            <tr><th>ที่อยู่</th><td>${getFieldValue('mgtAddress')}</td></tr>
            <tr><th>โทรศัพท์</th><td>${getFieldValue('mgtPhone')}</td></tr>
            <tr><th>อีเมล</th><td>${getFieldValue('mgtEmail')}</td></tr>
        </table>
    </div>

    <!-- Step 3: สภาวการณ์ -->
    <div class="section">
        <h2>3. สภาวการณ์</h2>
        <h3>สภาวการณ์การเรียนการสอน</h3>
        <table class="info-table">
            ${renderCurrentMusicTypes(submission.regsup_currentMusicTypes || submission.currentMusicTypes)}
        </table>

        <h3>ความพร้อมเครื่องดนตรี</h3>
        <table class="info-table">
            <tr><th>ชื่อเครื่องดนตรี</th><th>จำนวน</th><th>หมายเหตุ</th></tr>
            ${renderInstruments(submission.regsup_readinessItems || submission.readinessItems)}
        </table>
    </div>

    <!-- Step 4: ผู้สอนดนตรีไทย -->
    <div class="section">
        <h2>4. ผู้สอนดนตรีไทย</h2>

        <h3>รายชื่อครู</h3>
        <table class="info-table">
            ${renderTeachersData(submission.regsup_thaiMusicTeachers || submission.thaiMusicTeachers)}
        </table>

        <h3>ระยะเวลาการเรียนการสอนในเวลาราชการ</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 10px;">(ระบุช่วงระยะเวลาสำหรับการเรียนการสอนดนตรีไทยของแต่ละระดับชั้นในแต่ละภาคการศึกษา มีกี่ชั่วโมงในเสาร์นี้)</p>
        ${(submission.regsup_teachingScheduleRegular || submission.teachingScheduleRegular)?.length > 0 ? `
        <table class="info-table">
            <tr><th>ระดับชั้น</th><th>เรียนดนตรีไทยจำนวน (คน)</th><th>ชั่วโมง/ภาคการศึกษา</th><th>ชั่วโมง/ปีการศึกษา</th></tr>
            ${(submission.regsup_teachingScheduleRegular || submission.teachingScheduleRegular).map((item: any) => `
                <tr>
                    <td>${item.gradeLevel || '-'}</td>
                    <td>${item.studentCount || '-'}</td>
                    <td>${item.hoursPerSemester || '-'}</td>
                    <td>${item.hoursPerYear || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}

        <h3>ระยะเวลาการเรียนการสอนนอกเวลาราชการ</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 10px;">(ระบุช่วงเวลาสำหรับการเรียนการสอนดนตรีไทยของนอกเวลาราชการว่ามีในช่วงใดบ้างและใช้สถานที่ใดในการสอน)</p>
        ${(submission.regsup_teachingScheduleAfterHours || submission.teachingScheduleAfterHours)?.length > 0 ? `
        <table class="info-table">
            <tr><th>วัน</th><th>เวลา</th><th>ถึง</th><th>สถานที่</th></tr>
            ${(submission.regsup_teachingScheduleAfterHours || submission.teachingScheduleAfterHours).map((item: any) => `
                <tr>
                    <td>${item.day || '-'}</td>
                    <td>${item.time || '-'}</td>
                    <td>${item.endTime || '-'}</td>
                    <td>${item.location || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}
    </div>

    <!-- Step 5: สถานที่ -->
    <div class="section">
        <h2>5. สถานที่</h2>
        
        <h3>สถานที่สอน</h3>
        <p>${getFieldValue('teachingLocation') || '-'}</p>
    </div>

    <!-- Step 6: การสนับสนุน -->
    <div class="section">
        <h2>6. การสนับสนุน</h2>
        
        <h3>นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 10px;">ผู้มีส่วนส่งเสริม สนับสนุนการเรียนการสอนดนตรีไทย (ระบุนโยบายการจัดการเรียนการสอนดนตรีไทยของโรงเรียน วิธีการใช้ความสนับสนุน)</p>
        ${(submission.regsup_supportFactors || submission.supportFactors)?.length > 0 ? `
        <table class="info-table">
            <tr><th>ลำดับ</th><th>องค์กร/หน่วยงาน/บุคคลที่ให้การส่งเสริม สนับสนุน</th><th>บรรยาย และอธิบายสนับสนุน</th></tr>
            ${(submission.regsup_supportFactors || submission.supportFactors).map((factor: any, index: number) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${factor.sup_supportByAdmin || factor.sup_supportBySchoolBoard || factor.sup_supportByOthers || '-'}</td>
                    <td>${factor.sup_supportByDescription || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}

        <h3>ได้รับการสนับสนุนจากต้นสังกัด (บุคคล/หน่วยงานภายใน)</h3>
        ${(submission.regsup_supportFromOrg || submission.supportFromOrg)?.length > 0 ? `
        <table class="info-table">
            <tr><th>บุคคล/หน่วยงาน</th><th>รายละเอียด</th><th>หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)</th></tr>
            ${(submission.regsup_supportFromOrg || submission.supportFromOrg).map((org: any) => `
                <tr>
                    <td>${org.organization || '-'}</td>
                    <td>${org.details || '-'}</td>
                    <td>${org.evidenceLink || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}

        <h3>ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก</h3>
        ${(submission.regsup_supportFromExternal || submission.supportFromExternal)?.length > 0 ? `
        <table class="info-table">
            <tr><th>บุคคล/หน่วยงาน</th><th>รายละเอียด</th><th>หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)</th></tr>
            ${(submission.regsup_supportFromExternal || submission.supportFromExternal).map((org: any) => `
                <tr>
                    <td>${org.organization || '-'}</td>
                    <td>${org.details || '-'}</td>
                    <td>${org.evidenceLink || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}
    </div>

    <!-- Step 7: ผลงาน -->
    <div class="section">
        <h2>7. ผลงาน</h2>

        <h3>รางวัล</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 10px;">อำเภอ 5 คะแนน / จังหวัด 10 คะแนน / ภาค 15 คะแนน / ประเทศ 20 คะแนน</p>
        ${(submission.regsup_awards || submission.awards)?.length > 0 ? `
        <table class="info-table">
            <tr><th>ระดับรางวัล</th><th>ชื่อรางวัล</th><th>วันที่ได้รับรางวัล</th><th>ลิงก์หลักฐาน</th></tr>
            ${(submission.regsup_awards || submission.awards).map((award: any) => `
                <tr>
                    <td>${award.awardLevel || '-'}</td>
                    <td>${award.awardName || '-'}</td>
                    <td>${award.awardDate || '-'}</td>
                    <td>${award.awardEvidenceLink || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูลรางวัล</p>'}

        <h3>ภาพถ่ายผลงาน และคลิปวิดีโอที่มีความชัดเจน และสื่อให้เห็นถึงความเป็นโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย ๑๐๐ เปอร์เซ็นต์</h3>
        
        <h4 style="background-color: #d4edda; padding: 10px; border-radius: 5px; margin-top: 15px;">ภาพถ่ายผลงาน หรือกิจกรรมเด่น ตั้งแต่ปีการศึกษา 2567 - พฤษภาคม 2568 จำนวน 10 - 20 ภาพ เท่านั้น!!!</h4>
        <p style="font-size: 12px; color: #666; margin-bottom: 5px;">Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)</p>
        <p style="margin-bottom: 10px;">${getFieldValue('photoGalleryLink') || '-'}</p>
        <p style="font-size: 11px; color: #999; margin-bottom: 15px;">กรุณาเปลี่ยนที่สามารถเข้าถึงได้ "ทุกคนในอินเทอร์เน็ต จะดูได้ทั้งหมดโดยไม่ต้องลงชื่อเข้าใช้"</p>

        <h4 style="background-color: #cfe2ff; padding: 10px; border-radius: 5px; margin-top: 15px;">วิดีโอ/คลิป</h4>
        <p style="font-size: 12px; color: #dc3545; font-weight: 500; margin-bottom: 10px;">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"</p>
        
        <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
            <p style="font-weight: 500; margin-bottom: 5px;">1 บรรยากาศการเรียนการสอนในชั้นเรียน และในสถานศึกษา ความยาวไม่เกิน 3 นาที</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 5px;">Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)</p>
            <p>${getFieldValue('videoLink') || '-'}</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
            <p style="font-weight: 500; margin-bottom: 5px;">2 การแสดงผลงานด้านดนตรีของนักเรียน ความยาวไม่เกิน 3 นาที</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 5px;">Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)</p>
            <p>${getFieldValue('videoLink2') || '-'}</p>
        </div>
    </div>

    <!-- Step 8: การเผยแพร่ -->
    <div class="section">
        <h2>8. การเผยแพร่</h2>
        
        ${renderActivities(submission.regsup_activitiesWithinProvinceInternal || submission.activitiesWithinProvinceInternal, 'กิจกรรมภายในจังหวัด (ภายใน)')}
        
        ${renderActivities(submission.regsup_activitiesWithinProvinceExternal || submission.activitiesWithinProvinceExternal, 'กิจกรรมภายในจังหวัด (ภายนอก)')}
        
        ${renderActivities(submission.regsup_activitiesOutsideProvince || submission.activitiesOutsideProvince, 'กิจกรรมนอกจังหวัด')}
    </div>

    <!-- Step 9: การประชาสัมพันธ์ -->
    <div class="section">
        <h2>9. การประชาสัมพันธ์</h2>

        <h3>การประชาสัมพันธ์ผลงานของสถานศึกษา</h3>
        ${(submission.regsup_prActivities || submission.prActivities)?.length > 0 ? `
        <table class="info-table">
            <tr><th>ชื่อกิจกรรม/งาน</th><th>วันที่เผยแพร่</th><th>หลักฐานการเผยแพร่ (Link/URL)</th><th>แหล่งเผยแพร่/ประชาสัมพันธ์ในสื่อสังคมออนไลน์</th></tr>
            ${(submission.regsup_prActivities || submission.prActivities).map((activity: any) => `
                <tr>
                    <td>${activity.activityName || '-'}</td>
                    <td>${activity.publishDate || '-'}</td>
                    <td>${activity.evidenceLink || '-'}</td>
                    <td>${activity.platform || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูลกิจกรรมประชาสัมพันธ์</p>'}

        <h3>ได้รับข้อมูลการสมัครโรงเรียนสนับสนุนและส่งเสริมจาก</h3>
        <div class="checkbox-list">
            <div class="checkbox-item">
                ${getFieldValue('heardFromSchool') ? '☑' : '☐'} โรงเรียน: ${getFieldValue('heardFromSchool') ? `${getFieldValue('heardFromSchoolName')} อำเภอ ${getFieldValue('heardFromSchoolDistrict')} จังหวัด ${getFieldValue('heardFromSchoolProvince')}` : 'ไม่ได้เลือก'}
            </div>
            <div class="checkbox-item">
                ${getFieldValue('heardFromCulturalOffice') ? '☑' : '☐'} สำนักงานวัฒนธรรมจังหวัด: ${getFieldValue('heardFromCulturalOffice') ? getFieldValue('heardFromCulturalOfficeName') : 'ไม่ได้เลือก'}
            </div>
            <div class="checkbox-item">
                ${getFieldValue('heardFromEducationArea') ? '☑' : '☐'} สำนักงานเขตพื้นที่การศึกษา: ${getFieldValue('heardFromEducationArea') ? `${getFieldValue('heardFromEducationAreaName')} จังหวัด ${getFieldValue('heardFromEducationAreaProvince')}` : 'ไม่ได้เลือก'}
            </div>
            <div class="checkbox-item">
                ${getFieldValue('heardFromOther') ? '☑' : '☐'} อื่น ๆ ระบุ: ${getFieldValue('heardFromOther') ? getFieldValue('heardFromOtherDetail') : 'ไม่ได้เลือก'}
            </div>
        </div>

        <h3>ช่องทางการประชาสัมพันธ์ของกรมส่งเสริมวัฒนธรรม</h3>
        <div class="checkbox-list">
            <div class="checkbox-item">${getFieldValue('DCP_PR_Channel_FACEBOOK') ? '☑' : '☐'} เฟซบุ๊ก (Facebook)</div>
            <div class="checkbox-item">${getFieldValue('DCP_PR_Channel_YOUTUBE') ? '☑' : '☐'} ยูทูบ (YouTube)</div>
            <div class="checkbox-item">${getFieldValue('DCP_PR_Channel_Tiktok') ? '☑' : '☐'} ติ๊กต๊อก (TikTok)</div>
        </div>

        <h3>ปัญหาและอุปสรรคที่มีผลกระทบต่อการเรียนการสอนดนตรีไทย:</h3>
        <p>${getFieldValue('obstacles') || '-'}</p>

        <h3>ข้อเสนอแนะในการส่งเสริมดนตรีไทยในสถานศึกษา:</h3>
        <p>${getFieldValue('suggestions') || '-'}</p>

        <h3>รับรองความถูกต้อง</h3>
        <p>${(getFieldValue('certifiedByAdmin') || getFieldValue('regsup_certifiedByAdmin')) ? '☑ ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในแบบฟอร์มนี้เป็นความจริงทุกประการ' : '☐ ยังไม่ได้รับรอง'}</p>
    </div>
    
    <div class="footer">
        <p>สร้างเมื่อ: ${new Date().toLocaleDateString('th-TH', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p>กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ ประจำปีงบประมาณ พ.ศ. 2569</p>
    </div>
</body>
</html>`;

    await client.close();
    
    // Return HTML content with proper UTF-8 encoding
    const encoder = new TextEncoder();
    const htmlBuffer = encoder.encode(htmlContent);
    
    return new NextResponse(htmlBuffer, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="register-support-${encodeURIComponent(schoolName)}.html"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการสร้าง PDF', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
