import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getSchoolSizeDisplayText } from '@/lib/utils/schoolSize';
import puppeteer from 'puppeteer';
import JSZip from 'jszip';
import { pdfRateLimiter } from '@/middleware/rateLimiter';

// Extend global type for temp storage
declare global {
  var tempZipBuffer: Buffer | undefined;
  var tempZipFilename: string | undefined;
}

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

// Helper function to generate PDF HTML content
function generatePDFHTML(
  submission: any,
  type: 'register100' | 'register-support',
  schoolId: string
) {
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
  const registrationType = type === 'register100' 
    ? 'ประเภท โรงเรียนดนตรีไทย 100 เปอร์เซ็นต์'
    : 'ประเภท โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย';

  return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>รายงานข้อมูล ${schoolName}</title>
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
    
    .title {
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: #1a56db;
      margin: 10px 0 5px 0;
    }
    
    .subtitle {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #1a56db;
      margin: 5px 0 30px 0;
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
  <div class="title">${registrationType}</div>
  <div class="subtitle">รายงานข้อมูล ${schoolName}</div>
  
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
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type'); // 'register100', 'register-support', or 'all'
  const stream = searchParams.get('stream'); // 'true' for SSE progress
  const download = searchParams.get('download'); // 'true' for actual download

  // Rate limiting check
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rateLimitCheck = pdfRateLimiter.checkRateLimit(ip);
  
  if (!rateLimitCheck.allowed) {
    return NextResponse.json(
      { success: false, message: rateLimitCheck.message },
      { status: 429 } // Too Many Requests
    );
  }

  // If download=true, return the stored ZIP
  if (download === 'true') {
    const zipBuffer = (global as any).tempZipBuffer;
    const zipFilename = (global as any).tempZipFilename || `all-schools-${type}-${new Date().toISOString().slice(0, 10)}.zip`;
    
    if (!zipBuffer) {
      return NextResponse.json(
        { success: false, message: 'ZIP file not found or expired' },
        { status: 404 }
      );
    }
    
    // Clear temp storage
    delete (global as any).tempZipBuffer;
    delete (global as any).tempZipFilename;
    
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
      },
    });
  }

  // If stream=true, return SSE for progress
  if (stream === 'true') {
    return handleStreamProgress(type, ip);
  }

  // Otherwise, regular download (for backward compatibility)
  return handleRegularDownload(type);
}

async function handleStreamProgress(type: string | null, ip: string) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      let browser;
      let generationStarted = false;
      
      try {
        // Mark generation as started
        pdfRateLimiter.startGeneration();
        generationStarted = true;
        
        // Send initial message to confirm connection
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));
        
        const client = new MongoClient(uri);
        await client.connect();
        
        const database = client.db(dbName);
        const submissions: Array<{ submission: any; type: 'register100' | 'register-support'; schoolId: string }> = [];
        
        // Fetch submissions
        if (type === 'register100' || type === 'all') {
          const register100Collection = database.collection('register100_submissions');
          const register100Docs = await register100Collection.find({ schoolId: { $exists: true, $ne: null } }).toArray();
          register100Docs.forEach(doc => {
            submissions.push({
              submission: doc,
              type: 'register100',
              schoolId: doc.schoolId as string
            });
          });
        }
        
        if (type === 'register-support' || type === 'all') {
          const registerSupportCollection = database.collection('register_support_submissions');
          const registerSupportDocs = await registerSupportCollection.find({ schoolId: { $exists: true, $ne: null } }).toArray();
          registerSupportDocs.forEach(doc => {
            submissions.push({
              submission: doc,
              type: 'register-support',
              schoolId: doc.schoolId as string
            });
          });
        }
        
        await client.close();
        
        if (submissions.length === 0) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'ไม่พบข้อมูลโรงเรียน' })}\n\n`));
          controller.close();
          return;
        }

        const total = submissions.length;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'total', total })}\n\n`));

        // Launch Puppeteer
        browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ],
          timeout: 60000
        });
        
        const zip = new JSZip();
        
        // Generate PDF for each school
        for (let i = 0; i < submissions.length; i++) {
          const { submission, type: submissionType, schoolId } = submissions[i];
          
          const schoolName = submissionType === 'register100'
            ? (submission.reg100_schoolName || submission.schoolName || schoolId)
            : (submission.regsup_schoolName || submission.schoolName || schoolId);
          
          // Send progress
          const progress = Math.round(((i + 1) / total) * 100);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'progress',
            current: i + 1,
            total,
            progress,
            schoolName,
            schoolId
          })}\n\n`));
          
          const htmlContent = generatePDFHTML(submission, submissionType, schoolId);
          
          const page = await browser.newPage();
          await page.setContent(htmlContent, { waitUntil: 'load' });
          
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
          
          await page.close();
          
          const safeSchoolName = schoolName.replace(/[^a-zA-Z0-9ก-๙\s]/g, '').substring(0, 50);
          const filename = `${i + 1}.${safeSchoolName} ลำดับที่ ${schoolId}.pdf`;
          
          zip.file(filename, pdfBuffer);
        }
        
        await browser.close();
        
        // Generate ZIP
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'zipping' })}\n\n`));
        const zipBuffer = await zip.generateAsync({ 
          type: 'nodebuffer',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 }
        });
        
        const timestamp = new Date().toISOString().slice(0, 10);
        const zipFilename = `all-schools-${type || 'all'}-${timestamp}.zip`;
        
        // Send completion with download instruction (not base64 - too large)
        // Client will make a separate request to download
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'complete',
          filename: zipFilename,
          size: zipBuffer.length,
          downloadUrl: `/api/schools/download-all-pdf?type=${type}&download=true`
        })}\n\n`));
        
        controller.close();
        
        // Store ZIP in memory temporarily (for download endpoint)
        (global as any).tempZipBuffer = zipBuffer;
        (global as any).tempZipFilename = zipFilename;
        
        // Mark generation as ended (success)
        pdfRateLimiter.endGeneration();
        generationStarted = false; // Prevent double cleanup in finally
        
      } catch (error: any) {
        console.error('Error generating ZIP:', error);
        if (browser) {
          try {
            await browser.close();
          } catch (e) {
            console.error('Error closing browser:', e);
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'error',
          message: error?.message || 'เกิดข้อผิดพลาดในการสร้าง ZIP'
        })}\n\n`));
        controller.close();
      } finally {
        // Always clean up rate limiter
        if (generationStarted) {
          pdfRateLimiter.endGeneration();
        }
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

async function handleRegularDownload(type: string | null) {
  let browser;
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db(dbName);
    
    const submissions: Array<{ submission: any; type: 'register100' | 'register-support'; schoolId: string }> = [];
    
    // Fetch submissions based on type
    if (type === 'register100' || type === 'all') {
      const register100Collection = database.collection('register100_submissions');
      const register100Docs = await register100Collection.find({ schoolId: { $exists: true, $ne: null } }).toArray();
      register100Docs.forEach(doc => {
        submissions.push({
          submission: doc,
          type: 'register100',
          schoolId: doc.schoolId as string
        });
      });
    }
    
    if (type === 'register-support' || type === 'all') {
      const registerSupportCollection = database.collection('register_support_submissions');
      const registerSupportDocs = await registerSupportCollection.find({ schoolId: { $exists: true, $ne: null } }).toArray();
      registerSupportDocs.forEach(doc => {
        submissions.push({
          submission: doc,
          type: 'register-support',
          schoolId: doc.schoolId as string
        });
      });
    }
    
    await client.close();
    
    if (submissions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลโรงเรียน' },
        { status: 404 }
      );
    }

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const zip = new JSZip();
    
    // Generate PDF for each school
    for (let i = 0; i < submissions.length; i++) {
      const { submission, type: submissionType, schoolId } = submissions[i];
      
      console.log(`Generating PDF ${i + 1}/${submissions.length}: ${schoolId}`);
      
      const htmlContent = generatePDFHTML(submission, submissionType, schoolId);
      
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'load' });
      
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
      
      await page.close();
      
      // Get school name for filename
      const schoolName = submissionType === 'register100'
        ? (submission.reg100_schoolName || submission.schoolName || schoolId)
        : (submission.regsup_schoolName || submission.schoolName || schoolId);
      
      const safeSchoolName = schoolName.replace(/[^a-zA-Z0-9ก-๙\s]/g, '').substring(0, 50);
      // Format: [ลำดับ].[ชื่อโรงเรียน] ลำดับที่ [SchoolID].pdf
      const filename = `${i + 1}.${safeSchoolName} ลำดับที่ ${schoolId}.pdf`;
      
      zip.file(filename, pdfBuffer);
    }
    
    await browser.close();
    
    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    const timestamp = new Date().toISOString().slice(0, 10);
    const zipFilename = `all-schools-${type || 'all'}-${timestamp}.zip`;
    
    return new NextResponse(Buffer.from(zipBuffer), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating ZIP:', error);
    if (browser) {
      await browser.close();
    }
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้าง ZIP' },
      { status: 500 }
    );
  }
}

