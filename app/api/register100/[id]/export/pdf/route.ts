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

    // Helper function to render teachers data
    const renderTeachersData = (teachers: any[]) => {
      if (!teachers || teachers.length === 0) return '<tr><td colspan="100%">ไม่มีข้อมูลครู</td></tr>';
      
      return teachers.map((teacher, index) => `
        <tr><th colspan="2" style="background-color: #e9ecef; text-align: center;">ครูคนที่ ${index + 1}</th></tr>
        <tr><th>คุณลักษณะ</th><td>${teacher.teacherQualification || '-'}</td></tr>
        <tr><th>ชื่อ-นามสกุล</th><td>${teacher.teacherName || '-'}</td></tr>
        <tr><th>ตำแหน่ง</th><td>${teacher.teacherPosition || '-'}</td></tr>
        <tr><th>วุฒิการศึกษา</th><td>${teacher.teacherEducation || '-'}</td></tr>
        <tr><th>โทรศัพท์</th><td>${teacher.teacherPhone || '-'}</td></tr>
        <tr><th>อีเมล</th><td>${teacher.teacherEmail || '-'}</td></tr>
        ${index < teachers.length - 1 ? '<tr><td colspan="2" style="border: none; padding: 10px;"></td></tr>' : ''}
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

    // Create comprehensive HTML content for PDF with all step data
    const htmlContent = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>รายงานข้อมูลโรงเรียน 100 ปี - ${schoolName}</title>
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
        <h2>Step 1: ข้อมูลพื้นฐาน</h2>
        <table class="info-table">
            <tr><th>ชื่อสถานศึกษา</th><td>${getFieldValue('schoolName')}</td></tr>
            <tr><th>จังหวัด</th><td>${getFieldValue('schoolProvince')}</td></tr>
            <tr><th>ระดับการศึกษา</th><td>${getFieldValue('schoolLevel')}</td></tr>
            <tr><th>สังกัด</th><td>${getFieldValue('affiliation')}</td></tr>
            <tr><th>ขนาดโรงเรียน</th><td>${getFieldValue('schoolSize')}</td></tr>
            <tr><th>จำนวนบุคลากร</th><td>${getFieldValue('staffCount')}</td></tr>
            <tr><th>จำนวนนักเรียน</th><td>${getFieldValue('studentCount')}</td></tr>
            <tr><th>จำนวนนักเรียนแต่ละชั้น</th><td>${getFieldValue('studentCountByGrade')}</td></tr>
            <tr><th>สถานที่ตั้ง</th><td>เลขที่ ${getFieldValue('mgtAddress')} หมู่ ${getFieldValue('mgtVillage')} ถนน ${getFieldValue('mgtRoad')} ตำบล/แขวง ${getFieldValue('mgtSubdistrict')} อำเภอ/เขต ${getFieldValue('mgtDistrict')} จังหวัด ${getFieldValue('mgtProvince')} รหัสไปรษณีย์ ${getFieldValue('mgtPostalCode')}</td></tr>
            <tr><th>โทรศัพท์</th><td>${getFieldValue('mgtPhone')}</td></tr>
            <tr><th>โทรสาร</th><td>${getFieldValue('mgtFax')}</td></tr>
        </table>
    </div>

    <!-- Step 2: ผู้บริหารสถานศึกษา -->
    <div class="section">
        <h2>Step 2: ผู้บริหารสถานศึกษา</h2>
        <table class="info-table">
            <tr><th>ชื่อ-นามสกุล</th><td>${getFieldValue('mgtFullName')}</td></tr>
            <tr><th>ตำแหน่ง</th><td>${getFieldValue('mgtPosition')}</td></tr>
            <tr><th>ที่อยู่</th><td>${getFieldValue('mgtAddress')}</td></tr>
            <tr><th>โทรศัพท์</th><td>${getFieldValue('mgtPhone')}</td></tr>
            <tr><th>อีเมล</th><td>${getFieldValue('mgtEmail')}</td></tr>
        </table>
    </div>

    <!-- Step 3: แผนการสอนดนตรีไทย -->
    <div class="section">
        <h2>Step 3: แผนการสอนดนตรีไทย</h2>
        
        <h3>สภาวการณ์การเรียนการสอน</h3>
        <table class="info-table">
            <tr><th>ระดับชั้น ม.1-3</th><td>${getFieldValue('teachingStatusM1M3')}</td></tr>
            <tr><th>ระดับชั้น ม.4-6</th><td>${getFieldValue('teachingStatusM4M6')}</td></tr>
        </table>

        <h3>ความพร้อมเครื่องดนตรี</h3>
        ${submission.reg100_instruments && submission.reg100_instruments.length > 0 ? `
        <table class="info-table">
            <tr><th>ชื่อเครื่องดนตรี</th><th>จำนวน</th><th>หมายเหตุ</th></tr>
            ${submission.reg100_instruments.map((instrument: any) => `
                <tr>
                    <td>${instrument.instrumentName || '-'}</td>
                    <td>${instrument.instrumentQuantity || '-'}</td>
                    <td>${instrument.instrumentNote || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูลเครื่องดนตรี</p>'}
    </div>

    <!-- Step 4: ผู้สอนดนตรีไทย -->
    <div class="section">
        <h2>Step 4: ผู้สอนดนตรีไทย</h2>
        
        <h3>รายชื่อครู</h3>
        ${submission.reg100_thaiMusicTeachers && submission.reg100_thaiMusicTeachers.length > 0 ? `
        <table class="info-table">
            ${renderTeachersData(submission.reg100_thaiMusicTeachers)}
        </table>
        ` : '<p>ไม่มีข้อมูลครู</p>'}

        <h3>การเรียนการสอน</h3>
        <div class="checkbox-list">
            <div class="checkbox-item">✓ วิชาบังคับ: ${getFieldValue('teachingCompulsory') ? 'มี' : 'ไม่มี'}</div>
            <div class="checkbox-item">✓ สอนหลังเลิกเรียน: ${getFieldValue('teachingAfterSchool') ? 'มี' : 'ไม่มี'}</div>
            <div class="checkbox-item">✓ วิชาเลือก: ${getFieldValue('teachingElective') ? 'มี' : 'ไม่มี'}</div>
            <div class="checkbox-item">✓ หลักสูตรท้องถิ่น: ${getFieldValue('teachingLocalCurriculum') ? 'มี' : 'ไม่มี'}</div>
        </div>

        <table class="info-table">
            <tr><th>สถานที่สอน</th><td>${getFieldValue('teachingLocation')}</td></tr>
        </table>
    </div>

    <!-- Step 5: การสนับสนุนและรางวัล -->
    <div class="section">
        <h2>Step 5: การสนับสนุนและรางวัล</h2>
        
        <h3>การสนับสนุนจากองค์กร</h3>
        ${getFieldValue('hasSupportFromOrg') ? `
        ${submission.reg100_supportFromOrg && submission.reg100_supportFromOrg.length > 0 ? `
        <table class="info-table">
            <tr><th>องค์กร</th><th>รายละเอียด</th><th>ลิงก์หลักฐาน</th></tr>
            ${submission.reg100_supportFromOrg.map((support: any) => `
                <tr>
                    <td>${support.organization || '-'}</td>
                    <td>${support.details || '-'}</td>
                    <td>${support.evidenceLink || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>มีการสนับสนุนจากองค์กร แต่ไม่มีรายละเอียด</p>'}
        ` : '<p>ไม่มีการสนับสนุนจากองค์กร</p>'}

        <h3>การสนับสนุนจากภายนอก</h3>
        ${getFieldValue('hasSupportFromExternal') ? `
        ${submission.reg100_supportFromExternal && submission.reg100_supportFromExternal.length > 0 ? `
        <table class="info-table">
            <tr><th>องค์กร</th><th>รายละเอียด</th><th>ลิงก์หลักฐาน</th></tr>
            ${submission.reg100_supportFromExternal.map((support: any) => `
                <tr>
                    <td>${support.organization || '-'}</td>
                    <td>${support.details || '-'}</td>
                    <td>${support.evidenceLink || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>มีการสนับสนุนจากภายนอก แต่ไม่มีรายละเอียด</p>'}
        ` : '<p>ไม่มีการสนับสนุนจากภายนอก</p>'}

        <h3>รางวัล</h3>
        ${submission.reg100_awards && submission.reg100_awards.length > 0 ? `
        <table class="info-table">
            <tr><th>ระดับรางวัล</th><th>ชื่อรางวัล</th><th>วันที่ได้รับ</th><th>ลิงก์หลักฐาน</th></tr>
            ${submission.reg100_awards.map((award: any) => `
                <tr>
                    <td>${award.awardLevel || '-'}</td>
                    <td>${award.awardName || '-'}</td>
                    <td>${award.awardDate || '-'}</td>
                    <td>${award.awardEvidenceLink || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูลรางวัล</p>'}

        <table class="info-table">
            <tr><th>กรอบหลักสูตร</th><td>${getFieldValue('curriculumFramework')}</td></tr>
            <tr><th>ผลการเรียนรู้</th><td>${getFieldValue('learningOutcomes')}</td></tr>
            <tr><th>บริบทการจัดการ</th><td>${getFieldValue('managementContext')}</td></tr>
        </table>
    </div>

    <!-- Step 6: สื่อและวิดีโอ -->
    <div class="section">
        <h2>Step 6: สื่อและวิดีโอ</h2>
        <table class="info-table">
            <tr><th>ลิงก์แกลเลอรี่รูปภาพ</th><td>${getFieldValue('photoGalleryLink')}</td></tr>
            <tr><th>ลิงก์วิดีโอ</th><td>${getFieldValue('videoLink')}</td></tr>
        </table>
    </div>

    <!-- Step 7: กิจกรรมและการเผยแพร่ -->
    <div class="section">
        <h2>Step 7: กิจกรรมและการเผยแพร่</h2>
        
        ${renderActivities(submission.reg100_activitiesWithinProvinceInternal, 'กิจกรรมภายในจังหวัด (ภายใน)')}
        ${renderActivities(submission.reg100_activitiesWithinProvinceExternal, 'กิจกรรมภายในจังหวัด (ภายนอก)')}
        ${renderActivities(submission.reg100_activitiesOutsideProvince, 'กิจกรรมนอกจังหวัด')}
    </div>

    <!-- Step 8: ประชาสัมพันธ์และแหล่งข้อมูล -->
    <div class="section">
        <h2>Step 8: ประชาสัมพันธ์และแหล่งข้อมูล</h2>
        
        <h3>กิจกรรมประชาสัมพันธ์</h3>
        ${submission.reg100_prActivities && submission.reg100_prActivities.length > 0 ? `
        <table class="info-table">
            <tr><th>ชื่อกิจกรรม</th><th>วันที่</th><th>ลิงก์หลักฐาน</th><th>แพลตฟอร์ม</th></tr>
            ${submission.reg100_prActivities.map((activity: any) => `
                <tr>
                    <td>${activity.activityName || '-'}</td>
                    <td>${activity.publishDate || '-'}</td>
                    <td>${activity.evidenceLink || '-'}</td>
                    <td>${activity.platform || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูลกิจกรรมประชาสัมพันธ์</p>'}

        <h3>แหล่งที่มาของข้อมูล</h3>
        <div class="checkbox-list">
            <div class="checkbox-item">✓ โรงเรียน: ${getFieldValue('heardFromSchool') ? `มี (${getFieldValue('heardFromSchoolName')})` : 'ไม่มี'}</div>
            <div class="checkbox-item">✓ Facebook: ${getFieldValue('DCP_PR_Channel_FACEBOOK') ? 'มี' : 'ไม่มี'}</div>
            <div class="checkbox-item">✓ YouTube: ${getFieldValue('DCP_PR_Channel_YOUTUBE') ? 'มี' : 'ไม่มี'}</div>
            <div class="checkbox-item">✓ TikTok: ${getFieldValue('DCP_PR_Channel_Tiktok') ? 'มี' : 'ไม่มี'}</div>
            <div class="checkbox-item">✓ สำนักงานวัฒนธรรม: ${getFieldValue('heardFromCulturalOffice') ? `มี (${getFieldValue('heardFromCulturalOfficeName')})` : 'ไม่มี'}</div>
            <div class="checkbox-item">✓ สำนักงานเขตพื้นที่: ${getFieldValue('heardFromEducationArea') ? `มี (${getFieldValue('heardFromEducationAreaName')}, ${getFieldValue('heardFromEducationAreaProvince')})` : 'ไม่มี'}</div>
            <div class="checkbox-item">✓ อื่นๆ: ${getFieldValue('heardFromOther') ? `มี (${getFieldValue('heardFromOtherDetail')})` : 'ไม่มี'}</div>
        </div>

        <table class="info-table">
            <tr><th>ปัญหาอุปสรรค</th><td>${getFieldValue('obstacles')}</td></tr>
            <tr><th>ข้อเสนอแนะ</th><td>${getFieldValue('suggestions')}</td></tr>
            <tr><th>รับรองความถูกต้อง</th><td>${getFieldValue('certifiedINFOByAdminName') ? 'รับรอง' : 'ไม่รับรอง'}</td></tr>
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
        'Content-Disposition': `inline; filename="register100-${encodeURIComponent(schoolName)}-complete.html"`,
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