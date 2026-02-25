import { test, expect } from '@playwright/test';
import { MongoClient, ObjectId } from 'mongodb';
import path from 'path';

const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'thai_music_school';
const COLLECTION_NAME = 'register_support_submissions';

test.describe('Register Support - Full 100 Points Test', () => {
  let submissionId: string;

  test('should fill form completely and achieve 100 points', async ({ page }) => {
    console.log('🚀 Starting Register Support FULL 100 POINTS test...');
    
    await page.goto('http://localhost:3000/regist-support');
    await page.waitForTimeout(2000);

    // STEP 1 - Basic Info
    console.log('📝 STEP 1 - Basic Info');
    
    // Close consent modal first
    await page.waitForTimeout(1000);
    const acceptButton = page.locator('button:has-text("ยอมรับ")');
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
      await page.waitForTimeout(500);
    }
    
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ 100 คะแนน');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'มัธยมศึกษา');
    
    // Support type
    await page.check('input[value="ชุมนุม"]');
    await page.waitForTimeout(1000); // Wait for field to be enabled
    
    // Fill support type details - use filter to get the enabled field
    await page.locator('input[name="supportTypeName"]:not([disabled])').fill('ชุมนุมดนตรีไทย 100 คะแนน');
    await page.locator('input[name="supportTypeMemberCount"]:not([disabled])').fill('50');
    await page.waitForTimeout(500);
    
    // Location fields - use correct field names
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
    await page.fill('input[name="mgtFullName"]', 'นายผู้บริหาร 100คะแนน');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0812345678');
    await page.fill('input[name="mgtEmail"]', 'manager100@test.com');
    
    const mgtImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'manager.jpg');
    await page.locator('input[name="mgtImage"]').setInputFiles(mgtImagePath);
    await page.waitForTimeout(500);
    
    console.log('✅ Step 2 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 3 - Musical Instruments (skip - not required for points)
    console.log('📝 STEP 3 - Musical Instruments (skipped)');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 4 - Teaching Plan (20 points - all 4 checkboxes)
    console.log('📝 STEP 4 - Teaching Plan (20 points)');
    await page.check('input[name="isCompulsorySubject"]'); // +5
    await page.waitForTimeout(300);
    await page.check('input[name="hasAfterSchoolTeaching"]'); // +5
    await page.waitForTimeout(300);
    await page.check('input[name="hasElectiveSubject"]'); // +5
    await page.waitForTimeout(300);
    await page.check('input[name="hasLocalCurriculum"]'); // +5
    await page.waitForTimeout(500);
    
    console.log('✅ Step 4 completed - 20 points from teaching plan');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 5 - Teachers (20 points - 4 unique qualification types)
    console.log('📝 STEP 5 - Adding 4 teachers with unique qualifications (20 points)');
    
    // Teacher 1 - ครูประจำการ
    console.log('  Adding teacher 1 - ครูประจำการ...');
    await page.selectOption('select[name="thaiMusicTeachers.0.teacherQualification"]', 'ครูประจำการ');
    await page.fill('input[name="thaiMusicTeachers.0.teacherFullName"]', 'นายครู 1');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPosition"]', 'ครู');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPhone"]', '0811111111');
    const teacher1ImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'teacher1.jpg');
    await page.locator('input[name="thaiMusicTeachers.0.teacherImage"]').setInputFiles(teacher1ImagePath);
    await page.waitForTimeout(500);
    console.log('  ✅ Teacher 1 added');
    
    // Teacher 2 - ผู้ทรงคุณวุฒิ
    console.log('  Adding teacher 2 - ผู้ทรงคุณวุฒิ...');
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(1500);
    await page.selectOption('select[name="thaiMusicTeachers.1.teacherQualification"]', 'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.1.teacherFullName"]', 'นายครู 2');
    await page.fill('input[name="thaiMusicTeachers.1.teacherPosition"]', 'ผู้ทรงคุณวุฒิ');
    await page.fill('input[name="thaiMusicTeachers.1.teacherPhone"]', '0822222222');
    const teacher2ImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'teacher2.jpg');
    await page.locator('input[name="thaiMusicTeachers.1.teacherImage"]').setInputFiles(teacher2ImagePath);
    await page.waitForTimeout(500);
    console.log('  ✅ Teacher 2 added');
    
    // Teacher 3 - วิทยากร/บุคคลภายนอก
    console.log('  Adding teacher 3 - วิทยากรภายนอก...');
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(1500);
    await page.selectOption('select[name="thaiMusicTeachers.2.teacherQualification"]', 'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน');
    await page.fill('input[name="thaiMusicTeachers.2.teacherFullName"]', 'นายครู 3');
    await page.fill('input[name="thaiMusicTeachers.2.teacherPosition"]', 'วิทยากร');
    await page.fill('input[name="thaiMusicTeachers.2.teacherPhone"]', '0833333333');
    const teacher3ImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'teacher3.jpg');
    await page.locator('input[name="thaiMusicTeachers.2.teacherImage"]').setInputFiles(teacher3ImagePath);
    await page.waitForTimeout(500);
    console.log('  ✅ Teacher 3 added');
    
    // Teacher 4 - ครูภูมิปัญญาในท้องถิ่น
    console.log('  Adding teacher 4 - ครูภูมิปัญญา...');
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(1500);
    await page.selectOption('select[name="thaiMusicTeachers.3.teacherQualification"]', 'ครูภูมิปัญญาในท้องถิ่น');
    await page.fill('input[name="thaiMusicTeachers.3.teacherFullName"]', 'นายครู 4');
    await page.fill('input[name="thaiMusicTeachers.3.teacherPosition"]', 'ครูภูมิปัญญา');
    await page.fill('input[name="thaiMusicTeachers.3.teacherPhone"]', '0844444444');
    const teacher4ImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'teacher4.jpg');
    await page.locator('input[name="thaiMusicTeachers.3.teacherImage"]').setInputFiles(teacher4ImagePath);
    await page.waitForTimeout(500);
    console.log('  ✅ Teacher 4 added');
    
    console.log('✅ Step 5 completed - 20 points from 4 unique teacher qualifications');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 6 - Support (5 + 15 = 20 points)
    console.log('📝 STEP 6 - Support from org and external (20 points)');
    
    // Support from org (+5)
    await page.check('input[name="hasSupportFromOrg"]');
    await page.waitForTimeout(1000);
    await page.fill('input[name="supportFromOrg.0.organization"]', 'องค์กรต้นสังกัด');
    await page.waitForTimeout(500);
    
    // Support from external (+15 for 3 items)
    await page.check('input[name="hasSupportFromExternal"]');
    await page.waitForTimeout(1000);
    await page.fill('input[name="supportFromExternal.0.organization"]', 'องค์กรภายนอก 1');
    await page.waitForTimeout(500);
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="supportFromExternal.1.organization"]', 'องค์กรภายนอก 2');
    await page.waitForTimeout(500);
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="supportFromExternal.2.organization"]', 'องค์กรภายนอก 3');
    await page.waitForTimeout(500);
    
    await page.fill('textarea[name="curriculumFramework"]', 'หลักสูตรทดสอบ 100 คะแนน');
    
    console.log('✅ Step 5 completed - 5 points from org + 15 points from external = 20 points');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 6 - Awards and Activities (20 + 15 = 35 points)
    console.log('📝 STEP 6 - Awards and Activities (35 points)');
    
    await page.fill('input[name="photoGalleryLink"]', 'https://drive.google.com/test100');
    await page.waitForTimeout(500);
    
    // Award - National level (+20)
    await page.locator('button:has-text("+ เพิ่มรางวัล")').click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="awards.0.awardName"]', 'รางวัลระดับประเทศ');
    await page.selectOption('select[name="awards.0.awardLevel"]', 'ประเทศ');
    await page.fill('input[name="awards.0.awardYear"]', '2568');
    await page.waitForTimeout(500);
    
    // Activity within province internal (+5 for 3 activities)
    await page.locator('button:has-text("+ เพิ่มกิจกรรม")').first().click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityName"]', 'กิจกรรมภายในจังหวัด 1');
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityDate"]', '01/01/2568');
    await page.waitForTimeout(500);
    
    await page.locator('button:has-text("+ เพิ่มกิจกรรม")').first().click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="activitiesWithinProvinceInternal.1.activityName"]', 'กิจกรรมภายในจังหวัด 2');
    await page.fill('input[name="activitiesWithinProvinceInternal.1.activityDate"]', '02/01/2568');
    await page.waitForTimeout(500);
    
    await page.locator('button:has-text("+ เพิ่มกิจกรรม")').first().click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="activitiesWithinProvinceInternal.2.activityName"]', 'กิจกรรมภายในจังหวัด 3');
    await page.fill('input[name="activitiesWithinProvinceInternal.2.activityDate"]', '03/01/2568');
    await page.waitForTimeout(500);
    
    // Activity within province external (+5 for 3 activities)
    await page.locator('button:has-text("+ เพิ่มกิจกรรม")').nth(1).click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="activitiesWithinProvinceExternal.0.activityName"]', 'กิจกรรมภายนอกจังหวัด 1');
    await page.fill('input[name="activitiesWithinProvinceExternal.0.activityDate"]', '04/01/2568');
    await page.waitForTimeout(500);
    
    await page.locator('button:has-text("+ เพิ่มกิจกรรม")').nth(1).click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="activitiesWithinProvinceExternal.1.activityName"]', 'กิจกรรมภายนอกจังหวัด 2');
    await page.fill('input[name="activitiesWithinProvinceExternal.1.activityDate"]', '05/01/2568');
    await page.waitForTimeout(500);
    
    await page.locator('button:has-text("+ เพิ่มกิจกรรม")').nth(1).click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="activitiesWithinProvinceExternal.2.activityName"]', 'กิจกรรมภายนอกจังหวัด 3');
    await page.fill('input[name="activitiesWithinProvinceExternal.2.activityDate"]', '06/01/2568');
    await page.waitForTimeout(500);
    
    // Activity outside province (+5 for 3 activities)
    await page.locator('button:has-text("+ เพิ่มกิจกรรม")').nth(2).click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="activitiesOutsideProvince.0.activityName"]', 'กิจกรรมนอกจังหวัด 1');
    await page.fill('input[name="activitiesOutsideProvince.0.activityDate"]', '07/01/2568');
    await page.waitForTimeout(500);
    
    await page.locator('button:has-text("+ เพิ่มกิจกรรม")').nth(2).click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="activitiesOutsideProvince.1.activityName"]', 'กิจกรรมนอกจังหวัด 2');
    await page.fill('input[name="activitiesOutsideProvince.1.activityDate"]', '08/01/2568');
    await page.waitForTimeout(500);
    
    await page.locator('button:has-text("+ เพิ่มกิจกรรม")').nth(2).click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="activitiesOutsideProvince.2.activityName"]', 'กิจกรรมนอกจังหวัด 3');
    await page.fill('input[name="activitiesOutsideProvince.2.activityDate"]', '09/01/2568');
    await page.waitForTimeout(500);
    
    console.log('✅ Step 6 completed - 20 points from award + 15 points from activities = 35 points');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 7 - Skip (no points needed)
    console.log('📝 STEP 7 - Skipped');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 8 - PR Activities (+5 for 3 activities)
    console.log('📝 STEP 8 - PR Activities (5 points)');
    
    // Add 3 PR activities
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="prActivities.0.activityName"]', 'กิจกรรม PR 1');
    await page.fill('input[name="prActivities.0.prPlatform"]', 'Facebook');
    await page.fill('input[name="prActivities.0.prDate"]', '10/01/2568');
    await page.fill('input[name="prActivities.0.prLink"]', 'https://facebook.com/test1');
    await page.waitForTimeout(500);
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="prActivities.1.activityName"]', 'กิจกรรม PR 2');
    await page.fill('input[name="prActivities.1.prPlatform"]', 'YouTube');
    await page.fill('input[name="prActivities.1.prDate"]', '11/01/2568');
    await page.fill('input[name="prActivities.1.prLink"]', 'https://youtube.com/test2');
    await page.waitForTimeout(500);
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(1000);
    await page.fill('input[name="prActivities.2.activityName"]', 'กิจกรรม PR 3');
    await page.fill('input[name="prActivities.2.prPlatform"]', 'TikTok');
    await page.fill('input[name="prActivities.2.prDate"]', '12/01/2568');
    await page.fill('input[name="prActivities.2.prLink"]', 'https://tiktok.com/test3');
    await page.waitForTimeout(500);
    
    // Certification checkbox
    await page.locator('input[name="certifiedINFOByAdminName"]').click({ force: true });
    await page.waitForTimeout(1000);
    
    console.log('✅ Step 8 completed - 5 points from PR activities');
    console.log('🚀 Submitting form...');
    
    await page.getByTestId('btn-submit').click({ force: true });
    await page.waitForTimeout(5000);
    
    // Check success
    const successModal = page.locator('div[role="dialog"]:has-text("สำเร็จ"), div:has-text("ส่งแบบฟอร์มสำเร็จ")').first();
    const isSuccessVisible = await successModal.isVisible({ timeout: 10000 }).catch(() => false);
    
    await page.screenshot({ path: 'test-results/regist-support-100points.png', fullPage: true });
    
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
        
        expect(submission.schoolName).toBe('โรงเรียนทดสอบ 100 คะแนน');
        console.log('  ✅ School name: ' + submission.schoolName);
        
        expect(submission.thaiMusicTeachers).toBeDefined();
        expect(submission.thaiMusicTeachers.length).toBe(4);
        console.log(`  ✅ Teachers count: ${submission.thaiMusicTeachers.length}`);
        
        console.log('\n📊 Detailed Scores from DB:');
        console.log(`  ├─ Teacher Training: ${submission.teacher_training_score} points (expected: 20)`);
        console.log(`  ├─ Teacher Qualification: ${submission.teacher_qualification_score} points (expected: 20)`);
        console.log(`  ├─ Support from Org: ${submission.support_from_org_score} points (expected: 5)`);
        console.log(`  ├─ Support from External: ${submission.support_from_external_score} points (expected: 15)`);
        console.log(`  ├─ Award: ${submission.award_score} points (expected: 20)`);
        console.log(`  ├─ Activity Within Province Internal: ${submission.activity_within_province_internal_score} points (expected: 5)`);
        console.log(`  ├─ Activity Within Province External: ${submission.activity_within_province_external_score} points (expected: 5)`);
        console.log(`  ├─ Activity Outside Province: ${submission.activity_outside_province_score} points (expected: 5)`);
        console.log(`  ├─ PR Activity: ${submission.pr_activity_score} points (expected: 5)`);
        console.log(`  └─ TOTAL: ${submission.total_score} points (expected: 100)`);
        
        // Verify each score
        expect(submission.teacher_training_score).toBe(20);
        expect(submission.teacher_qualification_score).toBe(20);
        expect(submission.support_from_org_score).toBe(5);
        expect(submission.support_from_external_score).toBe(15);
        expect(submission.award_score).toBe(20);
        expect(submission.activity_within_province_internal_score).toBe(5);
        expect(submission.activity_within_province_external_score).toBe(5);
        expect(submission.activity_outside_province_score).toBe(5);
        expect(submission.pr_activity_score).toBe(5);
        expect(submission.total_score).toBe(100);
        
        console.log('\n🎉🎉🎉 PERFECT SCORE: 100/100 POINTS! 🎉🎉🎉');
        console.log(`\n✅✅✅ ALL DATA VERIFIED IN MONGODB!`);
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
