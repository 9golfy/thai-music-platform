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

    const schoolName = getFieldValue('schoolName') || 'N/A';
    const schoolProvince = getFieldValue('schoolProvince') || 'N/A';
    const schoolLevel = getFieldValue('schoolLevel') || 'N/A';
    const totalScore = submission.total_score || 0;

    // Get all data
    const teachers = getFieldValue('thaiMusicTeachers') || [];
    const awards = getFieldValue('awards') || [];
    const supportFactors = getFieldValue('supportFactors') || [];
    const supportFromOrg = getFieldValue('supportFromOrg') || [];
    const supportFromExternal = getFieldValue('supportFromExternal') || [];
    const activitiesInternal = getFieldValue('activitiesWithinProvinceInternal') || [];
    const activitiesExternal = getFieldValue('activitiesWithinProvinceExternal') || [];
    const activitiesOutside = getFieldValue('activitiesOutsideProvince') || [];
    const prActivities = getFieldValue('prActivities') || [];
    const readinessItems = getFieldValue('readinessItems') || [];

    // Create simple HTML content for PDF with proper UTF-8 encoding
    const htmlContent = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>รายงานข้อมูลโรงเรียนสนับสนุนและส่งเสริม</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
        body { 
            font-family: 'Sarabun', 'Tahoma', 'Arial', sans-serif; 
            margin: 20px; 
            line-height: 1.6;
            color: #333;
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
        .info-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
            font-size: 14px;
        }
        .info-table th, .info-table td { 
            border: 1px solid #ddd; 
            padding: 12px 8px; 
            text-align: left; 
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
        @media print {
            body { margin: 0; }
            .score-summary { break-inside: avoid; }
            .info-table { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <h1>รายงานข้อมูลโรงเรียนสนับสนุนและส่งเสริม</h1>
    
    <h2>ข้อมูลพื้นฐาน</h2>
    <table class="info-table">
        <tr><th style="width: 30%;">ชื่อสถานศึกษา</th><td>${schoolName}</td></tr>
        <tr><th>จังหวัด</th><td>${schoolProvince}</td></tr>
        <tr><th>ระดับการศึกษา</th><td>${schoolLevel}</td></tr>
    </table>
    
    <div class="score-summary">
        <div class="total-score">คะแนนรวม: ${totalScore} / 100 คะแนน</div>
    </div>
    
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
    
    <div class="footer">
        <p>สร้างเมื่อ: ${new Date().toLocaleDateString('th-TH', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p>ระบบบริหารจัดการข้อมูลการจัดการเรียนรู้ดนตรีไทย ๑๐๐ ปี เปิดเซิ่นกี</p>
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