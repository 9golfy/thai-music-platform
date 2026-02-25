import { test, expect } from '@playwright/test';
import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'thai_music_school';
const COLLECTION_NAME = 'register_support_submissions';

test.describe('Register Support - Small Image Upload Test', () => {
  let submissionId: string;

  test('should upload small images and verify in database', async ({ page }) => {
    // Navigate to registration page
    await page.goto('http://localhost:3000/regist-support');
    await page.waitForLoadState('networkidle');

    // Step 1: Basic Information
    await page.selectOption('select[name="supportType"]', 'วงดนตรีไทย');
    await page.waitForTimeout(500);
    
    // Fill support type details
    await page.fill('input[name="supportTypeName"]', 'วงดนตรีไทยทดสอบ');
    await page.fill('input[name="supportTypeMemberCount"]', '10');
    
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบรูปเล็ก');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'ประถมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'สพฐ.');
    await page.selectOption('select[name="schoolSize"]', 'เล็ก');
    await page.fill('input[name="staffCount"]', '20');
    await page.fill('input[name="studentCount"]', '200');
    await page.fill('textarea[name="studentCountByGrade"]', 'ป.1-30, ป.2-30, ป.3-30');
    
    // Address
    await page.fill('input[name="addressNo"]', '123');
    await page.fill('input[name="moo"]', '1');
    await page.fill('input[name="road"]', 'ถนนทดสอบ');
    await page.fill('input[name="subDistrict"]', 'บางรัก');
    await page.fill('input[name="district"]', 'บางรัก');
    await page.fill('input[name="provinceAddress"]', 'กรุงเทพมหานคร');
    await page.fill('input[name="postalCode"]', '10500');
    await page.fill('input[name="phone"]', '021234567');
    await page.fill('input[name="fax"]', '021234568');
    
    await page.click('button:has-text("ถัดไป")');
    await page.waitForTimeout(1000);

    // Step 2: Management Info with SMALL IMAGE
    await page.fill('input[name="mgtFullName"]', 'ผอ.ทดสอบรูปเล็ก');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('textarea[name="mgtAddress"]', '123 ถนนทดสอบ');
    await page.fill('input[name="mgtPhone"]', '0812345678');
    await page.fill('input[name="mgtEmail"]', 'test@school.ac.th');
    
    // Create a small test image (1KB)
    const smallImagePath = path.join(__dirname, 'test-small-image.png');
    const fs = require('fs');
    
    // Create a minimal PNG (1x1 pixel, ~100 bytes)
    const minimalPNG = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
      0x54, 0x08, 0xD7, 0x63, 0xF8, 0xFF, 0xFF, 0x3F,
      0x00, 0x05, 0xFE, 0x02, 0xFE, 0xDC, 0xCC, 0x59,
      0xE7, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, // IEND chunk
      0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    fs.writeFileSync(smallImagePath, minimalPNG);
    
    console.log('Small image size:', fs.statSync(smallImagePath).size, 'bytes');
    
    // Upload the small image
    const mgtImageInput = page.locator('input[type="file"][accept*="image"]').first();
    await mgtImageInput.setInputFiles(smallImagePath);
    await page.waitForTimeout(2000);
    
    await page.click('button:has-text("ถัดไป")');
    await page.waitForTimeout(1000);

    // Step 3: Skip (no data needed)
    await page.click('button:has-text("ถัดไป")');
    await page.waitForTimeout(1000);

    // Step 4: Add one teacher with SMALL IMAGE
    await page.click('button:has-text("เพิ่มครู")');
    await page.waitForTimeout(500);
    
    await page.selectOption('select[name="thaiMusicTeachers[0].teacherQualification"]', 'ครูดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers[0].teacherFullName"]', 'ครูทดสอบรูปเล็ก');
    await page.fill('input[name="thaiMusicTeachers[0].teacherPosition"]', 'ครู');
    await page.fill('input[name="thaiMusicTeachers[0].teacherEducation"]', 'ป.ตรี');
    await page.fill('input[name="thaiMusicTeachers[0].teacherPhone"]', '0823456789');
    await page.fill('input[name="thaiMusicTeachers[0].teacherEmail"]', 'teacher@school.ac.th');
    
    // Upload small image for teacher
    const teacherImageInput = page.locator('input[type="file"][accept*="image"]').nth(1);
    await teacherImageInput.setInputFiles(smallImagePath);
    await page.waitForTimeout(2000);
    
    // Check teaching types
    await page.check('input[name="teachingTypes"][value="วิชาบังคับ"]');
    
    await page.click('button:has-text("ถัดไป")');
    await page.waitForTimeout(1000);

    // Step 5: Skip support info
    await page.click('button:has-text("ถัดไป")');
    await page.waitForTimeout(1000);

    // Step 6: Skip
    await page.click('button:has-text("ถัดไป")');
    await page.waitForTimeout(1000);

    // Step 7: Skip
    await page.click('button:has-text("ถัดไป")');
    await page.waitForTimeout(1000);

    // Step 8: Skip
    await page.click('button:has-text("ถัดไป")');
    await page.waitForTimeout(1000);

    // Accept consent
    await page.click('button:has-text("ยอมรับ")');
    await page.waitForTimeout(500);

    // Submit
    await page.click('button:has-text("ส่งข้อมูล")');
    
    // Wait for success modal
    await page.waitForSelector('text=ส่งข้อมูลสำเร็จ', { timeout: 30000 });
    console.log('✓ Form submitted successfully');
    
    // Clean up test image
    fs.unlinkSync(smallImagePath);
  });

  test('verify images in database', async () => {
    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);
      
      // Find the most recent submission
      const submission = await collection.findOne(
        { schoolName: 'โรงเรียนทดสอบรูปเล็ก' },
        { sort: { createdAt: -1 } }
      );
      
      expect(submission).toBeTruthy();
      console.log('\n=== IMAGE DATA IN DATABASE ===');
      
      // Check management image
      console.log('\nManagement Image:');
      if (submission.mgtImage) {
        console.log('  - Field exists: YES');
        console.log('  - Type:', typeof submission.mgtImage);
        console.log('  - Length:', submission.mgtImage.length);
        console.log('  - Starts with:', submission.mgtImage.substring(0, 50));
        console.log('  - Is data URL:', submission.mgtImage.startsWith('data:image/'));
        console.log('  - Is /api/uploads URL:', submission.mgtImage.startsWith('/api/uploads/'));
      } else {
        console.log('  - Field exists: NO');
      }
      
      // Check teacher image
      console.log('\nTeacher Image:');
      if (submission.thaiMusicTeachers && submission.thaiMusicTeachers[0]) {
        const teacher = submission.thaiMusicTeachers[0];
        if (teacher.teacherImage) {
          console.log('  - Field exists: YES');
          console.log('  - Type:', typeof teacher.teacherImage);
          console.log('  - Length:', teacher.teacherImage.length);
          console.log('  - Starts with:', teacher.teacherImage.substring(0, 50));
          console.log('  - Is data URL:', teacher.teacherImage.startsWith('data:image/'));
          console.log('  - Is /api/uploads URL:', teacher.teacherImage.startsWith('/api/uploads/'));
        } else {
          console.log('  - Field exists: NO');
        }
      }
      
      submissionId = submission._id.toString();
      console.log('\nSubmission ID:', submissionId);
      console.log('Dashboard URL: http://localhost:3000/dashboard/register-support/' + submissionId);
      
    } finally {
      await client.close();
    }
  });
});
