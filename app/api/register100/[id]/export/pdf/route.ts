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

    const schoolName = getFieldValue('schoolName') || 'N/A';
    const schoolProvince = getFieldValue('schoolProvince') || 'N/A';
    const schoolLevel = getFieldValue('schoolLevel') || 'N/A';
    const totalScore = submission.total_score || 0;

    // Get comprehensive data from all steps - using correct field names from database
    const schoolAddress = `${getFieldValue('addressNo') || ''} หมู่ ${getFieldValue('moo') || ''} ${getFieldValue('road') || ''} ตำบล${getFieldValue('subDistrict') || ''} อำเภอ${getFieldValue('district') || ''} ${getFieldValue('provinceAddress') || ''} ${getFieldValue('postalCode') || ''}`.trim() || 'N/A';
    const schoolPhone = getFieldValue('phone') || 'N/A';
    const schoolEmail = getFieldValue('email') || 'N/A';
    const schoolWebsite = getFieldValue('website') || 'N/A';
    const principalName = getFieldValue('mgtFullName') || 'N/A';
    const principalPhone = getFieldValue('mgtPhone') || 'N/A';
    const principalEmail = getFieldValue('mgtEmail') || 'N/A';
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
    const obstacles = getFieldValue('obstacles') || 'N/A';
    const suggestions = getFieldValue('suggestions') || 'N/A';
    const certification = getFieldValue('certification') || false;

    // Create comprehensive HTML content for PDF with proper UTF-8 encoding
    const htmlContent = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>รายงานข้อมูลโรงเรียน 100 ปี</title>
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
            margin-top: 25px;
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
        .highlight-row {
            background-color: #f0f8f0 !important; 
            font-weight: 600;
        }
        .list-item {
            margin: 5px 0;
            padding: 5px 0;
        }
        .section {
            margin: 20px 0;
            page-break-inside: avoid;
        }
        @media print {
            body { margin: 0; font-size: 12px; }
            .score-summary { break-inside: avoid; }
            .info-table { break-inside: avoid; }
            .section { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <h1>รายงานข้อมูลโรงเรียน (ฉบับสมบูรณ์)</h1>
    
    <div class="section">
        <h2>ข้อมูลพื้นฐานสถานศึกษา</h2>
        <table class="info-table">
            <tr><th style="width: 25%;">ชื่อสถานศึกษา</th><td>${schoolName}</td></tr>
            <tr><th>ที่อยู่</th><td>${schoolAddress}</td></tr>
            <tr><th>จังหวัด</th><td>${schoolProvince}</td></tr>
            <tr><th>ระดับการศึกษา</th><td>${schoolLevel}</td></tr>
            <tr><th>โทรศัพท์</th><td>${schoolPhone}</td></tr>
            <tr><th>อีเมล</th><td>${schoolEmail}</td></tr>
            <tr><th>เว็บไซต์</th><td>${schoolWebsite}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>ข้อมูลผู้บริหาร</h2>
        <table class="info-table">
            <tr><th style="width: 25%;">ชื่อผู้อำนวยการ</th><td>${principalName}</td></tr>
            <tr><th>โทรศัพท์</th><td>${principalPhone}</td></tr>
            <tr><th>อีเมล</th><td>${principalEmail}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>ข้อมูลผู้ติดต่อ</h2>
        <table class="info-table">
            <tr><th style="width: 25%;">ชื่อผู้ติดต่อ</th><td>${contactPersonName}</td></tr>
            <tr><th>โทรศัพท์</th><td>${contactPersonPhone}</td></tr>
            <tr><th>อีเมล</th><td>${contactPersonEmail}</td></tr>
        </table>
    </div>
    
    <div class="score-summary">
        <div class="total-score">คะแนนรวม: ${totalScore} / 100 คะแนน</div>
    </div>
    
    <div class="section">
        <h2>รายละเอียดคะแนน</h2>
        <table class="info-table">
            <tr><th style="width: 50%;">หมวด</th><th style="width: 20%; text-align: center;">คะแนนที่ได้</th><th style="width: 20%; text-align: center;">คะแนนเต็ม</th></tr>
            <tr><td>การเรียนการสอนดนตรีไทย</td><td style="text-align: center;">${submission.teacher_training_score || 0}</td><td style="text-align: center;">20</td></tr>
            <tr><td>คุณลักษณะครูผู้สอน</td><td style="text-align: center;">${submission.teacher_qualification_score || 0}</td><td style="text-align: center;">20</td></tr>
            <tr><td>การสนับสนุนจากต้นสังกัด</td><td style="text-align: center;">${submission.support_from_org_score || 0}</td><td style="text-align: center;">5</td></tr>
            <tr><td>การสนับสนุนจากภายนอก</td><td style="text-align: center;">${submission.support_from_external_score || 0}</td><td style="text-align: center;">15</td></tr>
            <tr><td>รางวัลและเกียรติคุณ</td><td style="text-align: center;">${submission.award_score || 0}</td><td style="text-align: center;">20</td></tr>
            <tr><td>กิจกรรมภายในสถานศึกษา</td><td style="text-align: center;">${submission.activity_within_province_internal_score || 0}</td><td style="text-align: center;">5</td></tr>
            <tr><td>กิจกรรมภายนอกสถานศึกษา</td><td style="text-align: center;">${submission.activity_within_province_external_score || 0}</td><td style="text-align: center;">5</td></tr>
            <tr><td>กิจกรรมนอกจังหวัด</td><td style="text-align: center;">${submission.activity_outside_province_score || 0}</td><td style="text-align: center;">5</td></tr>
            <tr><td>การประชาสัมพันธ์</td><td style="text-align: center;">${submission.pr_activity_score || 0}</td><td style="text-align: center;">5</td></tr>
            <tr class="highlight-row"><td><strong>รวมทั้งหมด</strong></td><td style="text-align: center;"><strong>${totalScore}</strong></td><td style="text-align: center;"><strong>100</strong></td></tr>
        </table>
    </div>

    ${teachers.length > 0 ? `
    <div class="section">
        <h2>ข้อมูลครูผู้สอนดนตรีไทย</h2>
        <table class="info-table">
            <tr><th style="width: 5%;">ลำดับ</th><th style="width: 30%;">ชื่อ-นามสกุล</th><th style="width: 35%;">คุณลักษณะ</th><th style="width: 30%;">หมายเหตุ</th></tr>
            ${teachers.map((teacher: any, index: number) => `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td>${teacher.teacherName || 'ไม่ระบุ'}</td>
                <td>${teacher.teacherQualification || 'ไม่ระบุ'}</td>
                <td>${teacher.teacherNote || '-'}</td>
            </tr>
            `).join('')}
        </table>
    </div>
    ` : ''}

    ${awards.length > 0 ? `
    <div class="section">
        <h2>รางวัลและเกียรติคุณ</h2>
        <table class="info-table">
            <tr><th style="width: 5%;">ลำดับ</th><th style="width: 40%;">ชื่อรางวัล</th><th style="width: 25%;">ระดับ</th><th style="width: 15%;">ปี</th><th style="width: 15%;">หมายเหตุ</th></tr>
            ${awards.map((award: any, index: number) => `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td>${award.awardName || 'ไม่ระบุ'}</td>
                <td>${award.awardLevel || 'ไม่ระบุ'}</td>
                <td style="text-align: center;">${award.awardYear || 'ไม่ระบุ'}</td>
                <td>${award.awardNote || '-'}</td>
            </tr>
            `).join('')}
        </table>
    </div>
    ` : ''}

    ${supportFromOrg.length > 0 ? `
    <div class="section">
        <h2>การสนับสนุนจากต้นสังกัด</h2>
        <table class="info-table">
            <tr><th style="width: 5%;">ลำดับ</th><th style="width: 45%;">รายการสนับสนุน</th><th style="width: 25%;">ประเภท</th><th style="width: 25%;">หมายเหตุ</th></tr>
            ${supportFromOrg.map((support: any, index: number) => `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td>${support.supportName || 'ไม่ระบุ'}</td>
                <td>${support.supportType || 'ไม่ระบุ'}</td>
                <td>${support.supportNote || '-'}</td>
            </tr>
            `).join('')}
        </table>
    </div>
    ` : ''}

    ${supportFromExternal.length > 0 ? `
    <div class="section">
        <h2>การสนับสนุนจากภายนอก</h2>
        <table class="info-table">
            <tr><th style="width: 5%;">ลำดับ</th><th style="width: 30%;">หน่วยงาน</th><th style="width: 35%;">รายการสนับสนุน</th><th style="width: 30%;">หมายเหตุ</th></tr>
            ${supportFromExternal.map((support: any, index: number) => `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td>${support.organizationName || 'ไม่ระบุ'}</td>
                <td>${support.supportDetails || 'ไม่ระบุ'}</td>
                <td>${support.supportNote || '-'}</td>
            </tr>
            `).join('')}
        </table>
    </div>
    ` : ''}

    ${activitiesInternal.length > 0 ? `
    <div class="section">
        <h2>กิจกรรมภายในสถานศึกษา</h2>
        <table class="info-table">
            <tr><th style="width: 5%;">ลำดับ</th><th style="width: 40%;">ชื่อกิจกรรม</th><th style="width: 25%;">วันที่จัด</th><th style="width: 30%;">หมายเหตุ</th></tr>
            ${activitiesInternal.map((activity: any, index: number) => `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td>${activity.activityName || 'ไม่ระบุ'}</td>
                <td>${activity.activityDate || 'ไม่ระบุ'}</td>
                <td>${activity.activityNote || '-'}</td>
            </tr>
            `).join('')}
        </table>
    </div>
    ` : ''}

    ${activitiesExternal.length > 0 ? `
    <div class="section">
        <h2>กิจกรรมภายนอกสถานศึกษา</h2>
        <table class="info-table">
            <tr><th style="width: 5%;">ลำดับ</th><th style="width: 40%;">ชื่อกิจกรรม</th><th style="width: 25%;">วันที่จัด</th><th style="width: 30%;">หมายเหตุ</th></tr>
            ${activitiesExternal.map((activity: any, index: number) => `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td>${activity.activityName || 'ไม่ระบุ'}</td>
                <td>${activity.activityDate || 'ไม่ระบุ'}</td>
                <td>${activity.activityNote || '-'}</td>
            </tr>
            `).join('')}
        </table>
    </div>
    ` : ''}

    ${activitiesOutside.length > 0 ? `
    <div class="section">
        <h2>กิจกรรมนอกจังหวัด</h2>
        <table class="info-table">
            <tr><th style="width: 5%;">ลำดับ</th><th style="width: 40%;">ชื่อกิจกรรม</th><th style="width: 25%;">วันที่จัด</th><th style="width: 30%;">หมายเหตุ</th></tr>
            ${activitiesOutside.map((activity: any, index: number) => `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td>${activity.activityName || 'ไม่ระบุ'}</td>
                <td>${activity.activityDate || 'ไม่ระบุ'}</td>
                <td>${activity.activityNote || '-'}</td>
            </tr>
            `).join('')}
        </table>
    </div>
    ` : ''}

    ${prActivities.length > 0 ? `
    <div class="section">
        <h2>กิจกรรมประชาสัมพันธ์</h2>
        <table class="info-table">
            <tr><th style="width: 5%;">ลำดับ</th><th style="width: 40%;">ชื่อกิจกรรม</th><th style="width: 25%;">ช่องทาง</th><th style="width: 30%;">หมายเหตุ</th></tr>
            ${prActivities.map((activity: any, index: number) => `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td>${activity.activityName || 'ไม่ระบุ'}</td>
                <td>${activity.prChannel || 'ไม่ระบุ'}</td>
                <td>${activity.activityNote || '-'}</td>
            </tr>
            `).join('')}
        </table>
    </div>
    ` : ''}

    ${readinessItems.length > 0 ? `
    <div class="section">
        <h2>ความพร้อมในการดำเนินงาน</h2>
        <table class="info-table">
            <tr><th style="width: 5%;">ลำดับ</th><th style="width: 50%;">รายการ</th><th style="width: 20%;">สถานะ</th><th style="width: 25%;">หมายเหตุ</th></tr>
            ${readinessItems.map((item: any, index: number) => `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td>${item.itemName || 'ไม่ระบุ'}</td>
                <td style="text-align: center;">${item.readinessStatus || 'ไม่ระบุ'}</td>
                <td>${item.itemNote || '-'}</td>
            </tr>
            `).join('')}
        </table>
    </div>
    ` : ''}

    ${informationSources.length > 0 ? `
    <div class="section">
        <h2>แหล่งข้อมูลที่ใช้ในการสมัคร</h2>
        <ul>
            ${informationSources.map((source: string) => `<li class="list-item">${source}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <div class="section">
        <h2>ข้อมูลเพิ่มเติม</h2>
        <table class="info-table">
            <tr><th style="width: 25%;">อุปสรรคในการดำเนินงาน</th><td>${obstacles}</td></tr>
            <tr><th>ข้อเสนอแนะ</th><td>${suggestions}</td></tr>
            <tr><th>การรับรองความถูกต้อง</th><td>${certification ? 'ได้รับรองความถูกต้องแล้ว' : 'ยังไม่ได้รับรอง'}</td></tr>
        </table>
    </div>
    
    <div class="footer">
        <p>สร้างเมื่อ: ${new Date().toLocaleDateString('th-TH', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p>ระบบบริหารจัดการข้อมูลกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์</p>
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
        'Content-Disposition': `inline; filename="register100-${encodeURIComponent(schoolName)}.html"`,
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
    
    <!-- Step 1: ข้อมูลพื้นฐาน -->
    <div class="step-header">Step 1: ข้อมูลพื้นฐาน</div>
    <div class="step-content">
        <table class="info-table">
            <tr><th>ชื่อสถานศึกษา</th><td>${schoolName}</td></tr>
            <tr><th>จังหวัด</th><td>${schoolProvince}</td></tr>
            <tr><th>ระดับการศึกษา</th><td>${schoolLevel}</td></tr>
            <tr><th>สังกัด</th><td>${getFieldValue('affiliation')}</td></tr>
            <tr><th>ขนาดโรงเรียน</th><td>${getFieldValue('schoolSize')}</td></tr>
            <tr><th>จำนวนบุคลากร</th><td>${getFieldValue('staffCount')}</td></tr>
            <tr><th>จำนวนนักเรียน</th><td>${getFieldValue('studentCount')}</td></tr>
        </table>
        
        <div class="section-title">สถานที่ตั้ง</div>
        <table class="info-table">
            <tr><th>ที่อยู่</th><td>${schoolAddress}</td></tr>
            <tr><th>โทรศัพท์</th><td>${schoolPhone}</td></tr>
            <tr><th>โทรสาร</th><td>${getFieldValue('fax')}</td></tr>
        </table>
    </div>

    <!-- Step 2: ผู้บริหารสถานศึกษา -->
    <div class="step-header">Step 2: ผู้บริหารสถานศึกษา</div>
    <div class="step-content">
        <table class="info-table">
            <tr><th>ชื่อ-นามสกุล</th><td>${principalName}</td></tr>
            <tr><th>ตำแหน่ง</th><td>${getFieldValue('mgtPosition')}</td></tr>
            <tr><th>ที่อยู่</th><td>${getFieldValue('mgtAddress')}</td></tr>
            <tr><th>โทรศัพท์</th><td>${principalPhone}</td></tr>
            <tr><th>อีเมล</th><td>${principalEmail}</td></tr>
        </table>
    </div>

    <!-- Step 3: แผนการสอนดนตรีไทย -->
    <div class="step-header">Step 3: แผนการสอนดนตรีไทย</div>
    <div class="step-content">
        <div class="section-title">สภาวการณ์การเรียนการสอน</div>
        ${getFieldValue('currentMusicTypes') && getFieldValue('currentMusicTypes').length > 0 ? 
            getFieldValue('currentMusicTypes').map((item: any, index: number) => `
            <div class="list-item">
                <strong>ระดับชั้น:</strong> ${item.grade || 'ไม่ระบุ'}<br>
                <strong>รายละเอียด:</strong> ${item.details || 'ไม่ระบุ'}
            </div>
            `).join('') : '<p>ไม่มีข้อมูล</p>'
        }
        
        <div class="section-title">ความพร้อมเครื่องดนตรี</div>
        ${readinessItems.length > 0 ? `
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อเครื่องดนตรี</th><th>จำนวน</th><th>หมายเหตุ</th></tr>
            ${readinessItems.map((item: any, index: number) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.instrumentName || 'ไม่ระบุ'}</td>
                <td>${item.quantity || 'ไม่ระบุ'}</td>
                <td>${item.note || '-'}</td>
            </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}
    </div>

    <!-- Step 4: ข้อมูลครูผู้สอนดนตรีไทย -->
    <div class="step-header">Step 4: ข้อมูลครูผู้สอนดนตรีไทย</div>
    <div class="step-content">
        ${teachers.length > 0 ? `
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อ-นามสกุล</th><th>ตำแหน่ง</th><th>คุณลักษณะ</th><th>การศึกษา</th></tr>
            ${teachers.map((teacher: any, index: number) => `
            <tr>
                <td>${index + 1}</td>
                <td>${teacher.teacherFullName || teacher.teacherName || 'ไม่ระบุ'}</td>
                <td>${teacher.teacherPosition || 'ไม่ระบุ'}</td>
                <td>${teacher.teacherQualification || 'ไม่ระบุ'}</td>
                <td>${teacher.teacherEducation || 'ไม่ระบุ'}</td>
            </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}
    </div>

    <!-- Step 5: การสนับสนุนและรางวัล -->
    <div class="step-header">Step 5: การสนับสนุนและรางวัล</div>
    <div class="step-content">
        <div class="section-title">การสนับสนุนจากต้นสังกัด</div>
        ${supportFromOrg.length > 0 ? `
        <table class="info-table">
            <tr><th>ลำดับ</th><th>รายการสนับสนุน</th><th>ประเภท</th></tr>
            ${supportFromOrg.map((support: any, index: number) => `
            <tr>
                <td>${index + 1}</td>
                <td>${support.supportName || support.supportType || 'ไม่ระบุ'}</td>
                <td>${support.supportCategory || 'ไม่ระบุ'}</td>
            </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}
        
        <div class="section-title">การสนับสนุนจากภายนอก</div>
        ${supportFromExternal.length > 0 ? `
        <table class="info-table">
            <tr><th>ลำดับ</th><th>หน่วยงาน</th><th>รายการสนับสนุน</th></tr>
            ${supportFromExternal.map((support: any, index: number) => `
            <tr>
                <td>${index + 1}</td>
                <td>${support.organizationName || 'ไม่ระบุ'}</td>
                <td>${support.supportDetails || 'ไม่ระบุ'}</td>
            </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}
        
        <div class="section-title">รางวัลและเกียรติคุณ</div>
        ${awards.length > 0 ? `
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อรางวัล</th><th>ระดับ</th><th>ปี</th></tr>
            ${awards.map((award: any, index: number) => `
            <tr>
                <td>${index + 1}</td>
                <td>${award.awardName || 'ไม่ระบุ'}</td>
                <td>${award.awardLevel || 'ไม่ระบุ'}</td>
                <td>${award.awardYear || award.awardDate || 'ไม่ระบุ'}</td>
            </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}
    </div>

    <!-- Step 6: สื่อและเทคโนโลยี -->
    <div class="step-header">Step 6: สื่อและเทคโนโลยี</div>
    <div class="step-content">
        <table class="info-table">
            <tr><th>ลิงก์วิดีโอ</th><td>${getFieldValue('videoLink') || 'ไม่มีข้อมูล'}</td></tr>
            <tr><th>ลิงก์รูปภาพ</th><td>${getFieldValue('photoGalleryLink') || 'ไม่มีข้อมูล'}</td></tr>
        </table>
    </div>

    <!-- Step 7: กิจกรรมดนตรีไทย -->
    <div class="step-header">Step 7: กิจกรรมดนตรีไทย</div>
    <div class="step-content">
        <div class="section-title">กิจกรรมภายในสถานศึกษา</div>
        ${activitiesInternal.length > 0 ? `
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อกิจกรรม</th><th>วันที่จัด</th></tr>
            ${activitiesInternal.map((activity: any, index: number) => `
            <tr>
                <td>${index + 1}</td>
                <td>${activity.activityName || 'ไม่ระบุ'}</td>
                <td>${activity.activityDate || 'ไม่ระบุ'}</td>
            </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}
        
        <div class="section-title">กิจกรรมภายนอกสถานศึกษา</div>
        ${activitiesExternal.length > 0 ? `
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อกิจกรรม</th><th>วันที่จัด</th></tr>
            ${activitiesExternal.map((activity: any, index: number) => `
            <tr>
                <td>${index + 1}</td>
                <td>${activity.activityName || 'ไม่ระบุ'}</td>
                <td>${activity.activityDate || 'ไม่ระบุ'}</td>
            </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}
        
        <div class="section-title">กิจกรรมนอกจังหวัด</div>
        ${activitiesOutside.length > 0 ? `
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อกิจกรรม</th><th>วันที่จัด</th></tr>
            ${activitiesOutside.map((activity: any, index: number) => `
            <tr>
                <td>${index + 1}</td>
                <td>${activity.activityName || 'ไม่ระบุ'}</td>
                <td>${activity.activityDate || 'ไม่ระบุ'}</td>
            </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}
    </div>

    <!-- Step 8: การประชาสัมพันธ์และข้อมูลเพิ่มเติม -->
    <div class="step-header">Step 8: การประชาสัมพันธ์และข้อมูลเพิ่มเติม</div>
    <div class="step-content">
        <div class="section-title">กิจกรรมประชาสัมพันธ์</div>
        ${prActivities.length > 0 ? `
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อกิจกรรม</th><th>ช่องทาง</th></tr>
            ${prActivities.map((activity: any, index: number) => `
            <tr>
                <td>${index + 1}</td>
                <td>${activity.activityName || 'ไม่ระบุ'}</td>
                <td>${activity.prChannel || 'ไม่ระบุ'}</td>
            </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}
        
        <div class="section-title">ข้อมูลเพิ่มเติม</div>
        <table class="info-table">
            <tr><th>อุปสรรคในการดำเนินงาน</th><td>${obstacles}</td></tr>
            <tr><th>ข้อเสนอแนะ</th><td>${suggestions}</td></tr>
            <tr><th>การรับรองความถูกต้อง</th><td>${certification ? 'ได้รับรองความถูกต้องแล้ว' : 'ยังไม่ได้รับรอง'}</td></tr>
        </table>
    </div>
    
    <div class="footer">
        <p>สร้างเมื่อ: ${new Date().toLocaleDateString('th-TH', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p>ระบบบริหารจัดการข้อมูลกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์</p>
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
        'Content-Disposition': `inline; filename="register100-${encodeURIComponent(schoolName)}.html"`,
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