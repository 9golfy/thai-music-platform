import { test, expect } from '@playwright/test';
import path from 'path';

const AWS_URL = 'http://13.212.254.184:3000';

test.describe('AWS Production - Register100 Partial Score Test', () => {
  test('should submit with partial data (not 100 points)', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes
    
    console.log('🚀 Starting PARTIAL Register100 test on AWS...');
    console.log('📊 Expected: ~40-60 points (partial data, 3 teachers)');
    
    await page.goto(`${AWS_URL}/regist100`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Close consent modal
    const consentModal = page.locator('[data-testid="consent-modal"]');
    const isConsentVisible = await consentModal.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isConsentVisible) {
      const acceptButton = page.locator('[data-testid="btn-consent-accept"]');
      await acceptButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Consent accepted');
    }

    // ==================== STEP 1 ====================
    console.log('\n📝 STEP 1: Basic Information');
    
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบคะแนนบางส่วน 100%');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'มัธยมศึกษา');
    
    await page.fill('input[name="addressNo"]', '123');
    await page.fill('input[name="road"]', 'ถนนทดสอบ');
    
    await page.fill('input[id="th-district"]', 'คันนายาว');
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    await page.fill('input[name="phone"]', '0812345678');
    
    console.log('✅ Step 1 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 2 ====================
    console.log('\n📝 STEP 2: School Administrator');
    
    await page.fill('input[name="mgtFullName"]', 'นายทดสอบ คะแนนบางส่วน');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0898765432');
    
    const mgtImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'manager.jpg');
    await page.setInputFiles('input[name="mgtImage"]', mgtImagePath);
    await page.waitForTimeout(500);
    console.log('✅ Manager image uploaded (0.51 MB)');
    
    console.log('✅ Step 2 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 3 - Minimal ====================
    console.log('\n📝 STEP 3: Teaching Plan (MINIMAL)');
    
    // Only 1 music type
    await page.fill('input[name="currentMusicTypes.0.grade"]', 'ม.1-3');
    await page.fill('textarea[name="currentMusicTypes.0.details"]', 'สอนดนตรีไทยพื้นฐาน');
    
    // Only 1 instrument
    await page.fill('input[name="readinessItems.0.instrumentName"]', 'ระนาดเอก');
    await page.fill('input[name="readinessItems.0.quantity"]', '2');
    
    console.log('✅ Step 3 completed (minimal)');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 4 - Only 3 teachers ====================
    console.log('\n📝 STEP 4: Thai Music Teachers (3 teachers only)');
    
    const teacherQualifications = [
      'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย',
      'ครูภูมิปัญญาในท้องถิ่น',
      'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย'
    ];
    
    for (let i = 0; i < 3; i++) {
      console.log(`  Adding teacher ${i + 1}/3...`);
      
      if (i > 0) {
        await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
        await page.waitForTimeout(1000);
      }
      
      await page.selectOption(`select[name="thaiMusicTeachers.${i}.teacherQualification"]`, teacherQualifications[i]);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherFullName"]`, `นายครูทดสอบ ${i + 1}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPosition"]`, `ครูดนตรีไทย ${i + 1}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPhone"]`, `089${String(i + 1).padStart(7, '0')}`);
      
      const teacherImagePath = path.join(process.cwd(), 'regist', 'test-assets', `teacher${i + 1}.jpg`);
      await page.setInputFiles(`input[id="teacherImage-${i}"]`, teacherImagePath);
      await page.waitForTimeout(800);
      
      console.log(`  ✅ Teacher ${i + 1} added with image (0.51 MB)`);
    }
    
    console.log('✅ Only 3 teachers added (Total: 2.04 MB)');
    
    // Check only 2 training checkboxes (10 points instead of 20)
    await page.check('input[name="isCompulsorySubject"]');
    await page.check('input[name="hasAfterSchoolTeaching"]');
    console.log('✅ Only 2 training checkboxes checked (10 points)');
    
    console.log('✅ Step 4 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 5 - Partial ====================
    console.log('\n📝 STEP 5: Support Factors & Awards (PARTIAL)');
    
    await page.selectOption('select:has-text("เลือกองค์กร/หน่วยงาน")', 'ผู้บริหารสถานศึกษา');
    await page.fill('input[name="supportFactors.0.sup_supportByDescription"]', 'สนับสนุนงบประมาณ');
    await page.fill('input[name="supportFactors.0.sup_supportByDate"]', '01/01/2026');
    await page.fill('input[name="supportFactors.0.sup_supportByDriveLink"]', 'https://drive.google.com/partial-support');
    
    // Support from org (5 points)
    await page.check('input[name="hasSupportFromOrg"]');
    await page.waitForTimeout(1000);
    await page.fill('input[name="supportFromOrg.0.organization"]', 'สำนักงานวัฒนธรรม');
    await page.fill('textarea[name="supportFromOrg.0.details"]', 'สนับสนุนเครื่องดนตรี');
    await page.fill('input[name="supportFromOrg.0.evidenceLink"]', 'https://drive.google.com/partial-org');
    console.log('✅ Support from org (5 points)');
    
    // Only 1 external support (5 points instead of 15)
    await page.check('input[name="hasSupportFromExternal"]');
    await page.waitForTimeout(1000);
    await page.fill('input[name="supportFromExternal.0.organization"]', 'หน่วยงานภายนอก');
    await page.fill('textarea[name="supportFromExternal.0.details"]', 'รายละเอียดการสนับสนุน');
    await page.fill('input[name="supportFromExternal.0.evidenceLink"]', 'https://drive.google.com/partial-ext');
    console.log('✅ Support from external: 1 item (5 points)');
    
    await page.fill('textarea[name="curriculumFramework"]', 'มีหลักสูตร');
    await page.fill('textarea[name="learningOutcomes"]', 'มีผลลัพธ์');
    await page.fill('textarea[name="managementContext"]', 'มีการจัดการ');
    
    // Only 1 award (5 points instead of 20)
    const addAwardBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').last();
    await addAwardBtn.click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="awards.0.awardLevel"]', 'จังหวัด');
    await page.fill('input[name="awards.0.awardName"]', 'รางวัลทดสอบ');
    await page.fill('input[name="awards.0.awardDate"]', '15/03/2026');
    await page.fill('input[name="awards.0.awardEvidenceLink"]', 'https://drive.google.com/partial-award');
    console.log('✅ Awards: 1 item (5 points)');
    
    console.log('✅ Step 5 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 6 ====================
    console.log('\n📝 STEP 6: Photo Gallery & Videos');
    await page.fill('input[name="photoGalleryLink"]', 'https://drive.google.com/partial-photos');
    await page.fill('input[name="videoLink"]', 'https://youtube.com/partial-video');
    console.log('✅ Step 6 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 7 - Minimal ====================
    console.log('\n📝 STEP 7: Activities (MINIMAL)');
    
    // Only 1 internal activity (5 points)
    const addInternalBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addInternalBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityName"]', 'กิจกรรมภายใน');
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityDate"]', '15/01/2026');
    await page.fill('input[name="activitiesWithinProvinceInternal.0.evidenceLink"]', 'https://drive.google.com/partial-internal');
    console.log('✅ Internal activities: 1 item (5 points)');
    
    console.log('✅ Step 7 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 8 ====================
    console.log('\n📝 STEP 8: PR Activities & Certification');
    
    // Only 1 PR activity (5 points)
    const addPRBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addPRBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="prActivities.0.activityName"]', 'โพสต์ Facebook');
    await page.fill('input[name="prActivities.0.platform"]', 'Facebook');
    await page.fill('input[name="prActivities.0.publishDate"]', '01/01/2026');
    await page.fill('input[name="prActivities.0.evidenceLink"]', 'https://facebook.com/partial-post');
    console.log('✅ PR activities: 1 item (5 points)');
    
    await page.check('input[name="DCP_PR_Channel_FACEBOOK"]');
    
    await page.fill('textarea[name="obstacles"]', 'ขาดงบประมาณ');
    await page.fill('textarea[name="suggestions"]', 'ควรมีการสนับสนุนเพิ่มเติม');
    
    await page.locator('input[name="certifiedINFOByAdminName"]').click({ force: true });
    await page.waitForTimeout(1000);
    console.log('✅ Step 8 completed');

    // Submit
    console.log('\n🚀 Submitting form to AWS...');
    
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/register100') && response.request().method() === 'POST',
      { timeout: 120000 }
    );
    
    const startTime = Date.now();
    await page.getByRole('button', { name: 'ส่งแบบฟอร์ม' }).click({ force: true });
    console.log('⏳ Waiting for API response (up to 2 minutes for 2 MB upload)...');
    
    let apiSuccess = false;
    try {
      const response = await responsePromise;
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(`✅ API responded in ${duration} seconds`);
      console.log(`✅ Status: ${response.status()}`);
      
      if (response.status() === 200) {
        const data = await response.json();
        console.log(`✅ Response:`, data);
        apiSuccess = true;
        
        if (data.id) {
          console.log(`\n🎉 Form submitted successfully!`);
          console.log(`📝 Submission ID: ${data.id}`);
          console.log(`🔗 View at: ${AWS_URL}/dashboard/register100/${data.id}`);
        }
      }
    } catch (error) {
      console.log('⚠️ API response error:', error);
    }
    
    if (apiSuccess) {
      const successModal = page.locator('text=สำเร็จ!').or(page.getByTestId('success-modal'));
      const isSuccess = await successModal.isVisible({ timeout: 15000 }).catch(() => false);
      
      if (isSuccess) {
        console.log('✅ Success modal appeared');
      }
      
      await page.screenshot({ path: 'test-results/aws-regist100-partial-success.png', fullPage: true });
      expect(apiSuccess).toBe(true);
    } else {
      await page.screenshot({ path: 'test-results/aws-regist100-partial-error.png', fullPage: true });
      throw new Error('API request failed or timeout');
    }
    console.log(`📊 Expected score: ~40-50 points (partial data)`);
    
    // Wait for success modal
    const successModal = page.locator('text=สำเร็จ!');
    await expect(successModal).toBeVisible({ timeout: 10000 });
    console.log('✅ Success modal appeared');
    
    console.log('\n✅✅✅ AWS Register100 partial score test completed!');
  });
});
