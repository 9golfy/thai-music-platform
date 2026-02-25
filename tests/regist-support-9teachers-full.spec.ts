import { test, expect } from '@playwright/test';
import { MongoClient } from 'mongodb';
import path from 'path';

const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'thai_music_school';
const COLLECTION_NAME = 'register_support_submissions';

test.describe('Register Support - 9 Teachers Full Test', () => {
  let submissionId: string;

  test('should fill all fields with 9 teachers and verify total size < 10MB', async ({ page }) => {
    console.log('🚀 Starting Register Support test with 9 teachers...');
    
    await page.goto('http://localhost:3000/regist-support');
    await page.waitForTimeout(2000);

    // Close consent modal
    const acceptButton = page.locator('button:has-text("ยอมรับ")');
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
      await page.waitForTimeout(500);
    }

    // STEP 1 - Basic Info
    console.log('📝 STEP 1 - Basic Info');
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ 9 ครู');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'มัธยมศึกษา');
    
    await page.check('input[value="ชุมนุม"]');
    await page.waitForTimeout(1000);
    await page.locator('input[name="supportTypeName"]:not([disabled])').fill('ชุมนุมดนตรีไทย 9 ครู');
    await page.locator('input[name="supportTypeMemberCount"]:not([disabled])').fill('100');
    
    await page.fill('input[name="subDistrict"]', 'แขวงทดสอบ');
    await page.fill('input[name="district"]', 'เขตทดสอบ');
    await page.fill('input[name="provinceAddress"]', 'กรุงเทพมหานคร');
    await page.fill('input[name="postalCode"]', '10100');
    await page.fill('input[name="phone"]', '021234567');
    
    console.log('✅ Step 1 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 2 - Manager Info
    console.log('📝 STEP 2 - Manager Info');
    await page.fill('input[name="mgtFullName"]', 'นายผู้บริหาร 9ครู');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0812345678');
    await page.fill('input[name="mgtEmail"]', 'manager9@test.com');
    
    const mgtImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'manager.jpg');
    await page.locator('input[name="mgtImage"]').setInputFiles(mgtImagePath);
    await page.waitForTimeout(500);
    
    console.log('✅ Step 2 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 3 - Skip instruments
    console.log('📝 STEP 3 - Instruments (skipped)');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 4 - Add 9 teachers FIRST, then teaching plan checkboxes
    console.log('📝 STEP 4 - Adding 9 teachers');
    
    const teacherQualifications = [
      'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย',
      'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย',
      'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน',
      'ครูภูมิปัญญาในท้องถิ่น',
      'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย',
      'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย',
      'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน',
      'ครูภูมิปัญญาในท้องถิ่น',
      'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย'
    ];

    for (let i = 0; i < 9; i++) {
      console.log(`  Adding teacher ${i + 1}...`);
      
      if (i > 0) {
        await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
        await page.waitForTimeout(1500);
      }
      
      await page.selectOption(`select[name="thaiMusicTeachers.${i}.teacherQualification"]`, teacherQualifications[i]);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherFullName"]`, `นายครู ${i + 1}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPosition"]`, 'ครู');
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPhone"]`, `08${String(i + 1).padStart(8, '1')}`);
      
      const teacherImagePath = path.join(process.cwd(), 'regist', 'test-assets', `teacher${(i % 9) + 1}.jpg`);
      await page.locator(`input[name="thaiMusicTeachers.${i}.teacherImage"]`).setInputFiles(teacherImagePath);
      await page.waitForTimeout(500);
      
      console.log(`  ✅ Teacher ${i + 1} added`);
    }
    
    console.log('✅ 9 teachers added');
    
    // Now check teaching plan checkboxes (20 points)
    console.log('📝 Checking teaching plan boxes (20 points)');
    await page.check('input[name="isCompulsorySubject"]');
    await page.waitForTimeout(300);
    await page.check('input[name="hasAfterSchoolTeaching"]');
    await page.waitForTimeout(300);
    await page.check('input[name="hasElectiveSubject"]');
    await page.waitForTimeout(300);
    await page.check('input[name="hasLocalCurriculum"]');
    await page.waitForTimeout(500);
    
    console.log('✅ Step 4 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 5 - Support (5 points from org only, skip external to save time)
    console.log('📝 STEP 5 - Support');
    await page.check('input[name="hasSupportFromOrg"]');
    await page.waitForTimeout(1000);
    await page.fill('input[name="supportFromOrg.0.organization"]', 'องค์กรต้นสังกัด');
    await page.waitForTimeout(500);
    
    await page.fill('textarea[name="curriculumFramework"]', 'หลักสูตรทดสอบ 9 ครู');
    
    console.log('✅ Step 5 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 6 - Awards (skip for now)
    console.log('📝 STEP 6 - Awards (skipped)');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 7 - Skip
    console.log('📝 STEP 7 - Skipped');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 8 - PR
    console.log('📝 STEP 8 - PR');
    await page.locator('input[name="certifiedINFOByAdminName"]').click({ force: true });
    await page.waitForTimeout(1000);
    
    console.log('✅ Step 8 completed');
    console.log('🚀 Submitting form...');
    
    await page.getByTestId('btn-submit').click({ force: true });
    await page.waitForTimeout(5000);
    
    // Check success
    const successModal = page.locator('div[role="dialog"]:has-text("สำเร็จ"), div:has-text("ส่งแบบฟอร์มสำเร็จ")').first();
    const isSuccessVisible = await successModal.isVisible({ timeout: 10000 }).catch(() => false);
    
    await page.screenshot({ path: 'test-results/regist-support-9teachers.png', fullPage: true });
    
    if (isSuccessVisible) {
      console.log('\n✅✅✅ Form submitted successfully!');
      
      await page.waitForTimeout(3000);
      
      // Verify in MongoDB
      console.log('\n🔍 Verifying data in MongoDB...');
      
      const client = new MongoClient(MONGODB_URI);
      
      try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const database = client.db(DB_NAME);
        const collection = database.collection(COLLECTION_NAME);
        
        const submissions = await collection
          .find({})
          .sort({ createdAt: -1 })
          .limit(1)
          .toArray();
        
        if (submissions.length === 0) {
          throw new Error('No submissions found in database!');
        }
        
        const submission = submissions[0];
        submissionId = submission._id.toString();
        
        console.log(`\n✅ Found submission in DB with ID: ${submissionId}`);
        console.log('\n📋 Verifying submission data:');
        
        expect(submission.schoolName).toBe('โรงเรียนทดสอบ 9 ครู');
        console.log('  ✅ School name: ' + submission.schoolName);
        
        expect(submission.thaiMusicTeachers).toBeDefined();
        expect(submission.thaiMusicTeachers.length).toBe(9);
        console.log(`  ✅ Teachers count: ${submission.thaiMusicTeachers.length}`);
        
        // Check images are base64
        let totalImageSize = 0;
        if (submission.mgtImage && submission.mgtImage.startsWith('data:')) {
          const base64Data = submission.mgtImage.split(',')[1];
          totalImageSize += Buffer.from(base64Data, 'base64').length;
          console.log('  ✅ Manager image: base64 encoded');
        }
        
        let teachersWithImages = 0;
        for (const teacher of submission.thaiMusicTeachers) {
          if (teacher.teacherImage && teacher.teacherImage.startsWith('data:')) {
            teachersWithImages++;
            const base64Data = teacher.teacherImage.split(',')[1];
            totalImageSize += Buffer.from(base64Data, 'base64').length;
          }
        }
        console.log(`  ✅ Teachers with images: ${teachersWithImages}/9`);
        
        const totalSizeMB = (totalImageSize / (1024 * 1024)).toFixed(2);
        console.log(`  ✅ Total image size: ${totalSizeMB} MB`);
        
        expect(totalImageSize).toBeLessThan(10 * 1024 * 1024); // Less than 10 MB
        console.log('  ✅ Total size is under 10 MB limit');
        
        console.log('\n📊 Scores from DB:');
        console.log(`  ├─ Teacher Training: ${submission.teacher_training_score} points`);
        console.log(`  ├─ Teacher Qualification: ${submission.teacher_qualification_score} points`);
        console.log(`  ├─ Support from Org: ${submission.support_from_org_score} points`);
        console.log(`  └─ Total: ${submission.total_score} points`);
        
        expect(submission.teacher_training_score).toBe(20);
        expect(submission.teacher_qualification_score).toBeGreaterThanOrEqual(15); // At least 3 unique types
        expect(submission.support_from_org_score).toBe(5);
        
        console.log('\n✅✅✅ ALL DATA VERIFIED IN MONGODB!');
        console.log(`\n🎉 Test completed successfully!`);
        console.log(`📝 Submission ID: ${submissionId}`);
        console.log(`🔗 View at: http://localhost:3000/dashboard/register-support/${submissionId}`);
        
      } catch (error) {
        console.error('❌ MongoDB verification failed:', error);
        throw error;
      } finally {
        await client.close();
        console.log('✅ MongoDB connection closed');
      }
      
      expect(true).toBe(true);
    } else {
      console.log('❌ Form submission may have failed');
      throw new Error('Success modal did not appear');
    }
  });
});
