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
        ${teacher.teacherImage ? `<tr><th>รูปภาพ</th><td><img src="${teacher.teacherImage}" alt="ครูคนที่ ${index + 1}" style="max-width: 200px; max-height: 200px; object-fit: cover; border-radius: 8px;" /></td></tr>` : ''}
        <tr><th>คุณลักษณะ</th><td>${teacher.teacherQualification || '-'}</td></tr>
        <tr><th>ชื่อ-นามสกุล</th><td>${teacher.teacherFullName || '-'}</td></tr>
        <tr><th>ตำแหน่ง</th><td>${teacher.teacherPosition || '-'}</td></tr>
        <tr><th>วุฒิการศึกษา</th><td>${teacher.teacherEducation || '-'}</td></tr>
        <tr><th>โทรศัพท์</th><td>${teacher.teacherPhone || '-'}</td></tr>
        <tr><th>อีเมล</th><td>${teacher.teacherEmail || '-'}</td></tr>
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
        
        <h3>การเรียนการสอน</h3>
        <div class="checkbox-list">
            <div class="checkbox-item">✓ วิชาบังคับ: ${getFieldValue('isCompulsorySubject') ? 'มี' : 'ไม่มี'}</div>
            <div class="checkbox-item">✓ สอนหลังเลิกเรียน: ${getFieldValue('hasAfterSchoolTeaching') ? 'มี' : 'ไม่มี'}</div>
            <div class="checkbox-item">✓ วิชาเลือก: ${getFieldValue('hasElectiveSubject') ? 'มี' : 'ไม่มี'}</div>
            <div class="checkbox-item">✓ หลักสูตรท้องถิ่น: ${getFieldValue('hasLocalCurriculum') ? 'มี' : 'ไม่มี'}</div>
        </div>

        <h3>สถานที่สอน</h3>
        <p>${getFieldValue('teachingLocation')}</p>

        <h3>รายชื่อครู</h3>
        <table class="info-table">
            ${renderTeachersData(submission.regsup_thaiMusicTeachers || submission.thaiMusicTeachers)}
        </table>
    </div>

    <!-- Step 5: หลักสูตร -->
    <div class="section">
        <h2>5. หลักสูตร</h2>
        
        <h3>กรอบการเรียนการสอน</h3>
        <p>${getFieldValue('curriculumFramework')}</p>

        <h3>ผลสัมฤทธิ์ในการเรียนการสอน</h3>
        <p>${getFieldValue('learningOutcomes')}</p>

        <h3>การบริหารจัดการ</h3>
        <p>${getFieldValue('managementContext')}</p>
    </div>

    <!-- Step 6: การสนับสนุน -->
    <div class="section">
        <h2>6. การสนับสนุน</h2>
        
        <h3>ปัจจัยที่เกี่ยวข้องโดยตรง</h3>
        <table class="info-table">
            <tr><th>ลำดับ</th><th>องค์กร/หน่วยงาน</th><th>รายละเอียด</th><th>วันที่</th></tr>
            ${renderSupportFactors(submission.regsup_supportFactors || submission.supportFactors)}
        </table>

        ${renderSupportOrgs(submission.regsup_supportFromOrg || submission.supportFromOrg, 'การสนับสนุนจากต้นสังกัด')}
        
        ${renderSupportOrgs(submission.regsup_supportFromExternal || submission.supportFromExternal, 'การสนับสนุนจากภายนอก')}
    </div>

    <!-- Step 7: ผลงาน -->
    <div class="section">
        <h2>7. ผลงาน</h2>

        <h3>รางวัลและเกียรติคุณ</h3>
        <table class="info-table">
            <tr><th>ระดับ</th><th>ชื่อรางวัล</th><th>วันที่ได้รับ</th><th>หลักฐาน</th></tr>
            ${renderAwards(submission.regsup_awards || submission.awards)}
        </table>

        <table class="info-table">
            <tr><th>ลิงก์แกลเลอรี่รูปภาพ</th><td>${getFieldValue('photoGalleryLink')}</td></tr>
            <tr><th>ลิงก์วิดีโอ</th><td>${getFieldValue('videoLink')}</td></tr>
        </table>
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
        
        ${renderActivities(submission.regsup_prActivities || submission.prActivities, 'กิจกรรมประชาสัมพันธ์')}

        <h3>ช่องทางการประชาสัมพันธ์</h3>
        <div class="checkbox-list">
            <div class="checkbox-item">☑ Facebook: ${getFieldValue('DCP_PR_Channel_FACEBOOK') ? 'ใช้' : 'ไม่ใช้'}</div>
            <div class="checkbox-item">☑ YouTube: ${getFieldValue('DCP_PR_Channel_YOUTUBE') ? 'ใช้' : 'ไม่ใช้'}</div>
            <div class="checkbox-item">☑ TikTok: ${getFieldValue('DCP_PR_Channel_Tiktok') ? 'ใช้' : 'ไม่ใช้'}</div>
        </div>

        <h3>แหล่งที่มาของข้อมูล</h3>
        <table class="info-table">
            <tr><th>โรงเรียน</th><td>${getFieldValue('heardFromSchoolName')}</td></tr>
            <tr><th>สำนักงานวัฒนธรรม</th><td>${getFieldValue('heardFromCulturalOfficeName')}</td></tr>
            <tr><th>สำนักงานเขตพื้นที่</th><td>${getFieldValue('heardFromEducationAreaName')}</td></tr>
            <tr><th>อื่นๆ</th><td>${getFieldValue('heardFromOtherDetail')}</td></tr>
        </table>

        <h3>ปัญหาอุปสรรค</h3>
        <p>${getFieldValue('obstacles') || '-'}</p>

        <h3>ข้อเสนอแนะ</h3>
        <p>${getFieldValue('suggestions') || '-'}</p>

        <h3>ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในแบบฟอร์มนี้เป็นความจริงทุกประการ</h3>
        <p>${(getFieldValue('certifiedByAdmin') || getFieldValue('regsup_certifiedByAdmin')) ? '☑ ยอมรับ' : '☐ ไม่ยอมรับ'}</p>
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
