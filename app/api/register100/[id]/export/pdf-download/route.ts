import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getSchoolSizeDisplayText } from '@/lib/utils/schoolSize';
import puppeteer from 'puppeteer';

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let browser;
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

    // Use the same HTML generation from the export/pdf route
    // Get the HTML first - use localhost for internal API calls to avoid SSL issues with reverse proxy
    const internalApiUrl = process.env.INTERNAL_API_URL || 'http://localhost:3000';
    const response = await fetch(`${internalApiUrl}/api/register100/${id}/export/pdf`);
    let htmlContent = await response.text();
    
    // Convert all image URLs to base64 to ensure they load in PDF
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const matches = Array.from(htmlContent.matchAll(imgRegex));
    
    for (const match of matches) {
      let imgUrl = match[1];
      if (imgUrl && !imgUrl.startsWith('data:')) {
        try {
          // Convert relative URL to absolute URL using localhost for internal requests
          if (imgUrl.startsWith('/')) {
            imgUrl = `${internalApiUrl}${imgUrl}`;
          }
          
          // Fetch image and convert to base64
          const imgResponse = await fetch(imgUrl);
          if (imgResponse.ok) {
            const buffer = await imgResponse.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const contentType = imgResponse.headers.get('content-type') || 'image/jpeg';
            const base64Url = `data:${contentType};base64,${base64}`;
            
            // Replace original URL with base64 (use the original match[1] not the modified imgUrl)
            htmlContent = htmlContent.replace(match[1], base64Url);
          }
        } catch (error) {
          console.error('Error converting image to base64:', imgUrl, error);
        }
      }
    }
    
    await client.close();

    // Generate PDF using Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'load' });
    
    // Additional wait for any remaining resources
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    
    // Get school name for filename
    const getFieldValue = (fieldName: string) => {
      return submission[`reg100_${fieldName}`] ?? submission[fieldName] ?? '';
    };
    
    const schoolName = getFieldValue('schoolName') || 'โรงเรียน';
    const safeSchoolName = schoolName.replace(/[^a-zA-Z0-9ก-๙\s]/g, '').substring(0, 50);
    const filename = `${safeSchoolName}_Full.pdf`;
    
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating PDF download:', error);
    if (browser) {
      await browser.close();
    }
    return NextResponse.json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการสร้าง PDF', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
