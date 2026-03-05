import { test, expect } from '@playwright/test';
import path from 'path';

const AWS_URL = 'http://13.212.254.184:3000';

test.describe('AWS Production - Partial Score Test (40-50 points)', () => {
  test('should submit form with 3 teachers and minimal fields for partial score', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes
    
    console.log('🚀 Starting PARTIAL SCORE test on AWS with 3 teachers...');
    console.log('📊 Expected: Manager (0.51 MB) + 3 Teachers (1.53 MB) = 2.04 MB total');
    console.log('🎯 Target: 40-50 points');
    
    await page.goto(`${AWS_URL}/regist-support`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Accept consent
    const consentButton = page.getByTestId('btn-consent-accept');
    if (await consentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await consentButton.click();
      await page.waitForTimeout(500);
      console.log('✅ Consent accepted');
    }

    // ==================== STEP 1 ====================
    console.log('\n📝 STEP 1: Support Type & Basic Information');
    
    await page.locator('input[type="radio"][id="type-club"]').click();
    await page.waitForTimeout(1000);
    
    await page.waitForSelector('input[name="supportTypeName"]:not([disabled])');
    await page.fill('input[name="supportTypeName"]:not([disabled])', 'ชุมนุมดนตรีไทยทดสอบ AWS Partial');
    await page.fill('input[name="supportTypeMemberCount"]:not([disabled])', '30');
    
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ AWS Partial Score');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'มัธยมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    await page.fill('input[placeholder="จำนวนบุคลากร"]', '40');
    await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '400');
    
    await page.fill('input[name="addressNo"]', '50');
    await page.fill('input[name="subDistrict"]', 'คลองเตย');
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    await page.fill('input[name="phone"]', '025555555');
    
    console.log('✅ Step 1 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 2 ====================
    console.log('\n📝 STEP 2: Administrator');
    
    await page.fill('input[name="mgtFullName"]', 'นายผู้บริหาร AWS Partial');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0855555555');
    await page.fill('input[name="mgtEmail"]', 'admin-partial@school.ac.th');
    
    const managerImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'manager.jpg');
    await page.locator('input[name="mgtImage"]').setInputFiles(managerImagePath);
    await page.waitForTimeout(500);
    console.log('✅ Manager image uploaded (0.51 MB)');
    
    console.log('✅ Step 2 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 3 ====================
    console.log('\n📝 STEP 3: Readiness Items (Instruments)');
    
    await page.fill('input[name="readinessItems.0.instrumentName"]', 'ระนาดเอก');
    await page.fill('input[name="readinessItems.0.quantity"]', '2');
    
    console.log('✅ Step 3 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 4 ====================
    console.log('\n📝 STEP 4: Thai Music Teachers (3 teachers)');
    
    // Check 2 training checkboxes (10 points)
    await page.check('input[name="isCompulsorySubject"]');
    await page.check('input[name="hasAfterSchoolTeaching"]');
    await page.waitForTimeout(500);
    console.log('✅ 2 training checkboxes checked (10 points)');
    
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
        await page.waitForSelector(`select[name="thaiMusicTeachers.${i}.teacherQualification"]`);
      }
      
      await page.selectOption(`select[name="thaiMusicTeachers.${i}.teacherQualification"]`, teacherQualifications[i]);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherFullName"]`, `นายครู Partial ${i + 1}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPosition"]`, `ครูดนตรี ${i + 1}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherEducation"]`, 'ปริญญาตรี');
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPhone"]`, `085${String(i + 1).padStart(7, '0')}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherEmail"]`, `teacher-partial-${i + 1}@school.ac.th`);
      
      const teacherImagePath = path.join(process.cwd(), 'regist', 'test-assets', `teacher${i + 1}.jpg`);
      await page.locator(`input[name="thaiMusicTeachers.${i}.teacherImage"]`).setInputFiles(teacherImagePath);
      await page.waitForTimeout(800);
      
      console.log(`  ✅ Teacher ${i + 1} added with image (0.51 MB)`);
    }
    
    console.log('✅ All 3 teachers added (Total: 0.51 + 1.53 = 2.04 MB)');
    
    // In-Class Instruction
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="inClassInstructionDurations.0.inClassGradeLevel"]', 'ม.1-3');
    await page.fill('input[name="inClassInstructionDurations.0.inClassStudentCount"]', '100');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerSemester"]', '30');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerYear"]', '60');
    
    await page.fill('textarea[name="teachingLocation"]', 'ห้องดนตรีไทย');
    
    console.log('✅ Step 4 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 5 ====================
    console.log('\n📝 STEP 5: Support Factors & Awards');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.selectOption('select', 'ผู้บริหารสถานศึกษา');
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
    
    // Support from external - 1 item (5 points)
    await page.check('input[name="hasSupportFromExternal"]');
    await page.waitForTimeout(1000);
    await page.fill('input[name="supportFromExternal.0.organization"]', 'มูลนิธิส่งเสริมดนตรีไทย');
    await page.fill('textarea[name="supportFromExternal.0.details"]', 'สนับสนุนครูผู้สอน');
    await page.fill('input[name="supportFromExternal.0.evidenceLink"]', 'https://drive.google.com/partial-ext');
    console.log('✅ Support from external: 1 item (5 points)');
    
    await page.fill('textarea[name="curriculumFramework"]', 'มีหลักสูตรดนตรีไทย');
    await page.fill('textarea[name="learningOutcomes"]', 'นักเรียนสามารถบรรเลงได้');
    await page.fill('textarea[name="managementContext"]', 'จัดการสอนเป็นระบบ');
    
    // Awards - 1 item (5 points)
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').last().click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="awards.0.awardLevel"]', 'จังหวัด');
    await page.fill('input[name="awards.0.awardName"]', 'รางวัลระดับจังหวัด');
    await page.fill('input[name="awards.0.awardDate"]', '15/03/2026');
    await page.fill('input[name="awards.0.awardEvidenceLink"]', 'https://drive.google.com/partial-award');
    console.log('✅ Awards: 1 item (5 points)');
    
    console.log('✅ Step 5 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 6 ====================
    console.log('\n📝 STEP 6: Photo Gallery & Videos');
    
    await page.fill('input[name="photoGalleryLink"]', 'https://drive.google.com/partial-photos');
    await page.fill('input[name="videoLink"]', 'https://youtube.com/watch?v=partial-video');
    
    console.log('✅ Step 6 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 7 ====================
    console.log('\n📝 STEP 7: Activities (1 each for 5 points)');
    
    // Internal activity - 1 item (5 points)
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityName"]', 'กิจกรรมภายในโรงเรียน');
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityDate"]', '10/01/2026');
    await page.fill('input[name="activitiesWithinProvinceInternal.0.evidenceLink"]', 'https://drive.google.com/partial-internal');
    console.log('✅ Internal activities: 1 item (5 points)');
    
    console.log('✅ Step 7 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 8 ====================
    console.log('\n📝 STEP 8: PR Activities & Certification');
    
    // PR activity - 1 item (5 points)
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
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
    console.log('\n🎯 Expected Score: ~45 points (10+5+5+5+5+5+5+5)');
    console.log('🚀 Submitting form to AWS...');
    
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/register-support') && response.request().method() === 'POST',
      { timeout: 120000 }
    );
    
    const startTime = Date.now();
    await page.getByTestId('btn-submit').click({ force: true });
    console.log('⏳ Waiting for API response (up to 2 minutes for 2.04 MB upload)...');
    
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
          console.log(`🔗 View at: ${AWS_URL}/dashboard/register-support/${data.id}`);
        }
      }
    } catch (error) {
      console.log('⚠️ API response error:', error);
    }
    
    if (apiSuccess) {
      const successModal = page.getByTestId('success-modal');
      const isSuccess = await successModal.isVisible({ timeout: 15000 }).catch(() => false);
      
      if (isSuccess) {
        console.log('✅ Success modal appeared');
        await page.screenshot({ path: 'test-results/aws-partial-score-success.png', fullPage: true });
      }
      
      expect(isSuccess).toBe(true);
    } else {
      await page.screenshot({ path: 'test-results/aws-partial-score-error.png', fullPage: true });
      throw new Error('API request failed or timeout');
    }
    
    console.log('\n✅✅✅ AWS Partial Score test completed successfully!');
  });
});
