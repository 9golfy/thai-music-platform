import { test, expect } from '@playwright/test';
import path from 'path';

const AWS_URL = 'http://13.228.225.47:3000';

test.describe('AWS Production - Register Support Test', () => {
  test('should fill and submit register-support form on AWS', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes timeout
    
    console.log('🚀 Starting Register Support test on AWS Production...');
    console.log(`🌐 URL: ${AWS_URL}/regist-support`);
    
    // Navigate to form
    await page.goto(`${AWS_URL}/regist-support`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Accept consent modal
    const consentButton = page.getByTestId('btn-consent-accept');
    if (await consentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await consentButton.click();
      await page.waitForTimeout(500);
      console.log('✅ Consent accepted');
    }

    // ==================== STEP 1: Support Type & Basic Info ====================
    console.log('\n📝 STEP 1: Support Type & Basic Information');
    
    await page.locator('input[type="radio"][id="type-club"]').click();
    await page.waitForTimeout(1000);
    
    await page.waitForSelector('input[name="supportTypeName"]:not([disabled])', { state: 'visible', timeout: 5000 });
    await page.fill('input[name="supportTypeName"]:not([disabled])', 'ชุมนุมดนตรีไทย AWS Test');
    await page.fill('input[name="supportTypeMemberCount"]:not([disabled])', '30');
    
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ AWS Production');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'มัธยมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    await page.fill('input[placeholder="จำนวนบุคลากร"]', '50');
    await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '500');
    
    await page.fill('input[name="addressNo"]', '123');
    await page.fill('input[name="moo"]', '5');
    await page.fill('input[name="road"]', 'ถนนพระราม 4');
    
    await page.fill('input[name="subDistrict"]', 'คลองเตย');
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    await page.fill('input[name="phone"]', '021234567');
    await page.fill('input[name="fax"]', '021234568');
    
    console.log('✅ Step 1 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 2: Administrator ====================
    console.log('\n📝 STEP 2: Administrator');
    
    await page.fill('input[name="mgtFullName"]', 'นายผู้บริหาร AWS Test');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0812345678');
    await page.fill('input[name="mgtEmail"]', 'admin@aws-test.ac.th');
    
    const managerImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'manager.jpg');
    await page.locator('input[name="mgtImage"]').setInputFiles(managerImagePath);
    await page.waitForTimeout(500);
    console.log('✅ Manager image uploaded');
    
    console.log('✅ Step 2 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 3: Readiness Items ====================
    console.log('\n📝 STEP 3: Readiness Items');
    
    await page.fill('input[name="readinessItems.0.instrumentName"]', 'ระนาดเอก');
    await page.fill('input[name="readinessItems.0.quantity"]', '2');
    await page.fill('input[name="readinessItems.0.note"]', 'สภาพดี');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').click();
    await page.waitForTimeout(500);
    await page.fill('input[name="readinessItems.1.instrumentName"]', 'ซอด้วง');
    await page.fill('input[name="readinessItems.1.quantity"]', '3');
    await page.fill('input[name="readinessItems.1.note"]', 'พร้อมใช้');
    
    console.log('✅ Step 3 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 4: Teachers ====================
    console.log('\n📝 STEP 4: Thai Music Teachers');
    
    await page.check('input[name="isCompulsorySubject"]');
    await page.check('input[name="hasAfterSchoolTeaching"]');
    await page.waitForTimeout(500);
    
    // Add 3 teachers
    for (let i = 0; i < 3; i++) {
      console.log(`  Adding teacher ${i + 1}/3...`);
      
      if (i > 0) {
        await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
        await page.waitForTimeout(1000);
      }
      
      await page.selectOption(`select[name="thaiMusicTeachers.${i}.teacherQualification"]`, 
        'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย');
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherFullName"]`, `นายครู AWS ${i + 1}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPosition"]`, `ครูดนตรี ${i + 1}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherEducation"]`, 'ปริญญาตรี');
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPhone"]`, `081000000${i}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherEmail"]`, `teacher${i + 1}@aws-test.ac.th`);
      
      const teacherImagePath = path.join(process.cwd(), 'regist', 'test-assets', `teacher${i + 1}.jpg`);
      await page.locator(`input[name="thaiMusicTeachers.${i}.teacherImage"]`).setInputFiles(teacherImagePath);
      await page.waitForTimeout(800);
      
      console.log(`  ✅ Teacher ${i + 1} added`);
    }
    
    // In-Class Instruction
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="inClassInstructionDurations.0.inClassGradeLevel"]', 'ม.1-3');
    await page.fill('input[name="inClassInstructionDurations.0.inClassStudentCount"]', '100');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerSemester"]', '40');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerYear"]', '80');
    
    // Out-of-Class Instruction
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2).click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="outOfClassInstructionDurations.0.outDay"]', 'เสาร์');
    await page.fill('input[name="outOfClassInstructionDurations.0.outTimeFrom"]', '09:00');
    await page.fill('input[name="outOfClassInstructionDurations.0.outTimeTo"]', '12:00');
    await page.fill('input[name="outOfClassInstructionDurations.0.outLocation"]', 'ห้องดนตรี');
    
    await page.fill('textarea[name="teachingLocation"]', 'ห้องดนตรีไทย ชั้น 2');
    
    console.log('✅ Step 4 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 5: Support & Awards ====================
    console.log('\n📝 STEP 5: Support & Awards');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.selectOption('select', 'ผู้บริหารสถานศึกษา');
    await page.fill('input[name="supportFactors.0.sup_supportByDescription"]', 'สนับสนุนงบประมาณ');
    await page.fill('input[name="supportFactors.0.sup_supportByDate"]', '01/01/2026');
    await page.fill('input[name="supportFactors.0.sup_supportByDriveLink"]', 'https://drive.google.com/test');
    
    await page.check('input[name="hasSupportFromOrg"]');
    await page.waitForTimeout(1000);
    await page.fill('input[name="supportFromOrg.0.organization"]', 'สำนักงานวัฒนธรรม');
    await page.fill('textarea[name="supportFromOrg.0.details"]', 'สนับสนุนเครื่องดนตรี');
    await page.fill('input[name="supportFromOrg.0.evidenceLink"]', 'https://drive.google.com/org');
    
    await page.fill('textarea[name="curriculumFramework"]', 'มีหลักสูตรที่ชัดเจน');
    await page.fill('textarea[name="learningOutcomes"]', 'นักเรียนมีทักษะดนตรีไทย');
    await page.fill('textarea[name="managementContext"]', 'จัดการเป็นระบบ');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').last().click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="awards.0.awardLevel"]', 'จังหวัด');
    await page.fill('input[name="awards.0.awardName"]', 'รางวัลระดับจังหวัด');
    await page.fill('input[name="awards.0.awardDate"]', '15/03/2026');
    await page.fill('input[name="awards.0.awardEvidenceLink"]', 'https://drive.google.com/award');
    
    console.log('✅ Step 5 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 6: Media ====================
    console.log('\n📝 STEP 6: Media');
    
    await page.fill('input[name="photoGalleryLink"]', 'https://drive.google.com/photos');
    await page.fill('input[name="videoLink"]', 'https://youtube.com/watch?v=test');
    
    console.log('✅ Step 6 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 7: Activities ====================
    console.log('\n📝 STEP 7: Activities');
    
    // Internal activities
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityName"]', 'กิจกรรมภายใน');
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityDate"]', '10/01/2026');
    await page.fill('input[name="activitiesWithinProvinceInternal.0.evidenceLink"]', 'https://drive.google.com/internal');
    
    // External activities
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceExternal.0.activityName"]', 'กิจกรรมภายนอก');
    await page.fill('input[name="activitiesWithinProvinceExternal.0.activityDate"]', '15/02/2026');
    await page.fill('input[name="activitiesWithinProvinceExternal.0.evidenceLink"]', 'https://drive.google.com/external');
    
    console.log('✅ Step 7 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 8: PR & Certification ====================
    console.log('\n📝 STEP 8: PR & Certification');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.fill('input[name="prActivities.0.activityName"]', 'โพสต์ Facebook');
    await page.fill('input[name="prActivities.0.platform"]', 'Facebook');
    await page.fill('input[name="prActivities.0.publishDate"]', '01/01/2026');
    await page.fill('input[name="prActivities.0.evidenceLink"]', 'https://facebook.com/post');
    
    await page.check('input[name="DCP_PR_Channel_FACEBOOK"]');
    
    await page.fill('textarea[name="obstacles"]', 'ขาดงบประมาณ');
    await page.fill('textarea[name="suggestions"]', 'ควรมีการสนับสนุนเพิ่มเติม');
    
    await page.locator('input[name="certifiedINFOByAdminName"]').click({ force: true });
    await page.waitForTimeout(1000);
    
    console.log('✅ Step 8 completed');
    console.log('\n🚀 Submitting form to AWS...');
    
    // Listen for API response with longer timeout
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/register-support') && response.request().method() === 'POST',
      { timeout: 120000 } // Increase to 2 minutes for AWS
    );
    
    await page.getByTestId('btn-submit').click({ force: true });
    console.log('⏳ Waiting for API response (up to 2 minutes)...');
    
    let apiSuccess = false;
    try {
      const response = await responsePromise;
      const status = response.status();
      console.log(`✅ API responded with status: ${status}`);
      
      if (status === 200) {
        const data = await response.json();
        console.log(`✅ Response:`, data);
        apiSuccess = true;
        
        if (data.submissionId) {
          console.log(`\n🎉 Form submitted successfully!`);
          console.log(`📝 Submission ID: ${data.submissionId}`);
          console.log(`🔗 View at: ${AWS_URL}/dashboard/register-support/${data.submissionId}`);
        }
      }
    } catch (error) {
      console.log('⚠️ API response timeout or error:', error);
      console.log('⚠️ This may be due to slow network or large file uploads');
    }
    
    // Wait for success modal (only if API succeeded)
    if (apiSuccess) {
      const successModal = page.getByTestId('success-modal');
      const isSuccess = await successModal.isVisible({ timeout: 15000 }).catch(() => false);
      
      if (isSuccess) {
        console.log('✅ Success modal appeared');
        await page.screenshot({ path: 'test-results/aws-regist-support-success.png', fullPage: true });
      }
      
      expect(isSuccess).toBe(true);
    } else {
      // Take screenshot of error state
      await page.screenshot({ path: 'test-results/aws-regist-support-error.png', fullPage: true });
      console.log('❌ Test failed - API did not respond in time');
      console.log('📸 Screenshot saved to test-results/aws-regist-support-error.png');
      
      // Don't fail the test immediately - check if button is still loading
      const submitButton = page.getByTestId('btn-submit');
      const buttonText = await submitButton.textContent();
      console.log(`🔍 Submit button state: "${buttonText}"`);
      
      throw new Error('API request timeout - form submission did not complete');
    }
    
    console.log('\n✅✅✅ AWS Production test completed successfully!');
  });
});
