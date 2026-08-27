import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getSchoolSizeDisplayText } from '@/lib/utils/schoolSize';
import puppeteer from 'puppeteer';

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  let browser;
  try {
    const { schoolId } = await params;
    
    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: 'School ID is required' },
        { status: 400 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db(dbName);
    
    // Try to find in register100 first
    const register100Collection = database.collection('register100_submissions');
    let submission = await register100Collection.findOne({ schoolId: schoolId });
    let type: 'register100' | 'register-support' | null = submission ? 'register100' : null;
    
    // If not found, try register-support
    if (!submission) {
      const registerSupportCollection = database.collection('register_support_submissions');
      submission = await registerSupportCollection.findOne({ schoolId: schoolId });
      type = submission ? 'register-support' : null;
    }
    
    await client.close();
    
    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลโรงเรียน' },
        { status: 404 }
      );
    }

    // Helper function to get field value with fallback
    const getFieldValue = (fieldName: string) => {
      if (type === 'register100') {
        return submission[`reg100_${fieldName}`] ?? submission[fieldName] ?? '';
      } else {
        return submission[`regsup_${fieldName}`] ?? submission[fieldName] ?? '';
      }
    };

    const getDisplayValue = (fieldName: string) => {
      const value = getFieldValue(fieldName);
      if (fieldName === 'schoolSize') {
        return getSchoolSizeDisplayText(value) || value;
      }
      return value;
    };

    const schoolName = getFieldValue('schoolName') || 'N/A';
    const schoolProvince = getFieldValue('schoolProvince') || 'N/A';
    const schoolLevel = getFieldValue('schoolLevel') || 'N/A';
    const pageTitle = type === 'register100'
      ? 'รายงานข้อมูล โรงเรียนทดสอบ Register100 Full Fields Complete'
      : 'รายงานข้อมูล โรงเรียนสนับสนุนและส่งเสริม';

    // Format date and time
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear().toString().slice(-2);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const dateStr = `${month}/${day}/${year}`;
    const timeStr = `${hours}:${minutes}`;
    
    // Generate HTML for PDF
    const htmlContent = `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @page {
      size: A4;
      margin: 15mm;
    }
    
    body {
      font-family: 'Sarabun', 'Tahoma', 'Arial', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      background: white;
    }
    
    .header {
      text-align: right;
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .title {
      text-align: center;
      font-size: 22px;
      font-weight: bold;
      color: #1a56db;
      margin: 20px 0 30px 0;
    }
    
    .section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 3px solid #3b82f6;
    }
    
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .info-table th,
    .info-table td {
      padding: 12px;
      text-align: left;
      border: 1px solid #d1d5db;
    }
    
    .info-table th {
      background-color: #f3f4f6;
      font-weight: 600;
      color: #374151;
      width: 35%;
    }
    
    .info-table td {
      background-color: white;
      color: #1f2937;
    }
    
    .info-table tr:nth-child(even) td {
      background-color: #f9fafb;
    }
    
    .document-info {
      margin-top: 30px;
      padding: 20px;
      background: white;
      border-top: 2px solid #e5e7eb;
      page-break-inside: avoid;
    }
    
    .document-info h3 {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 15px;
    }
    
    .document-info p {
      text-align: center;
      font-size: 14px;
      line-height: 1.8;
      color: #374151;
      margin: 8px 0;
    }
    
    .document-info .folder-path {
      font-size: 13px;
      color: #1f2937;
      margin-top: 10px;
    }
    
    .document-info .school-name {
      font-weight: bold;
      color: #000000;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    ${dateStr}, ${timeStr} AM
  </div>
  
  <div class="title">${pageTitle}</div>
  
  <div class="section">
    <h2 class="section-title">1. ข้อมูลพื้นฐาน</h2>
    <table class="info-table">
      <tr>
        <th>ชื่อสถานศึกษา</th>
        <td>${schoolName}</td>
      </tr>
      <tr>
        <th>จังหวัด</th>
        <td>${schoolProvince}</td>
      </tr>
      <tr>
        <th>ระดับการศึกษา</th>
        <td>${schoolLevel}</td>
      </tr>
      <tr>
        <th>สังกัด</th>
        <td>${getFieldValue('schoolAffiliation') || '-'}</td>
      </tr>
      <tr>
        <th>ระบุ</th>
        <td>${getFieldValue('schoolDistrict') || '-'}</td>
      </tr>
      <tr>
        <th>ขนาดโรงเรียน</th>
        <td>${getDisplayValue('schoolSize') || '-'}</td>
      </tr>
      <tr>
        <th>จำนวนนักเรียน</th>
        <td>${getFieldValue('studentCount') || '-'}</td>
      </tr>
      <tr>
        <th>จำนวนนักเรียน</th>
        <td>${getFieldValue('studentTotal') || '-'}</td>
      </tr>
      <tr>
        <th>จำนวนนักเรียนแต่ละชั้น</th>
        <td>${getFieldValue('studentPerGrade') || '-'}</td>
      </tr>
      <tr>
        <th>สถานที่ตั้ง</th>
        <td>${getFieldValue('schoolAddress') || '-'}</td>
      </tr>
      <tr>
        <th>โทรศัพท์</th>
        <td>${getFieldValue('schoolPhone') || '-'}</td>
      </tr>
      <tr>
        <th>โทรสาร</th>
        <td>${getFieldValue('schoolFax') || '-'}</td>
      </tr>
    </table>
  </div>
  
  <div class="document-info">
    <h3>รายละเอียดเอกสารการสมัครเข้าร่วมกิจกรรมตาม</h3>
    
    <p><strong>External Hard Disk</strong> การสรุปผลการรับสมัครเข้าร่วมกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ ประจำปี 2569</p>
    
    <p class="folder-path">
      <strong>Folder</strong> เอกสารการสมัครเข้าร่วมกิจกรรม (TOR ข้อ 4.5.3) 
      ${type === 'register100' ? 'โรงเรียนดนตรีไทย 100 เปอร์เซ็นต์' : 'โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย'}
    </p>
    
    <p>
      <span class="school-name">${schoolName}</span> ลำดับที่ <span class="school-name">${schoolId}</span>
    </p>
  </div>
</body>
</html>
    `;

    // Launch Puppeteer and generate PDF
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      }
    });
    
    await browser.close();
    
    // Create safe filename - format: [SchoolName] ลำดับที่ [SchoolID].pdf
    const safeSchoolName = schoolName.replace(/[^a-zA-Z0-9ก-๙\s]/g, '').substring(0, 50);
    const filename = `${safeSchoolName} ลำดับที่ ${schoolId}.pdf`;
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (browser) {
      await browser.close();
    }
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้าง PDF' },
      { status: 500 }
    );
  }
}
