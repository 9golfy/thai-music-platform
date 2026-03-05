import { test, expect } from '@playwright/test';

const AWS_URL = 'http://13.212.254.184:3000';

test.describe('AWS Quick Test - Register100 No Images', () => {
  test('should submit Register100 form without images to test API speed', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes
    
    console.log('🚀 Quick test on AWS Register100 (no images)...');
    
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

    // STEP 1: Basic Information
    console.log('📝 STEP 1: Basic Information');
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบเร็ว 100%');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'มัธยมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    await page.fill('input[placeholder="จำนวนบุคลากร"]', '30');
    await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '300');
    await page.fill('input[name="addressNo"]', '1');
    await page.fill('input[id="th-district"]', 'คลองเตย');
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await page.fill('input[name="phone"]', '021111111');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);
    console.log('✅ Step 1 completed');

    // STEP 2: Administrator - NO IMAGE
    console.log('📝 STEP 2: Administrator (NO IMAGE)');
    await page.fill('input[name="mgtFullName"]', 'ผู้บริหารทดสอบ');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0811111111');
    await page.fill('input[name="mgtEmail"]', 'admin@test.com');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);
    console.log('✅ Step 2 completed (no image)');

    // STEP 3: Teaching Plan
    console.log('📝 STEP 3: Teaching Plan');
    await page.fill('input[name="currentMusicTypes.0.grade"]', 'ม.1');
    await page.fill('textarea[name="currentMusicTypes.0.details"]', 'สอนดนตรีไทย');
    await page.fill('input[name="readinessItems.0.instrumentName"]', 'ระนาด');
    await page.fill('input[name="readinessItems.0.quantity"]', '1');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);
    console.log('✅ Step 3 completed');

    // STEP 4: Teachers - NO IMAGES
    console.log('📝 STEP 4: Teachers (NO IMAGES)');
    await page.selectOption('select[name="thaiMusicTeachers.0.teacherQualification"]', 
      'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherFullName"]', 'ครูทดสอบ 1');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPosition"]', 'ครูดนตรี');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEducation"]', 'ป.ตรี');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPhone"]', '0811111111');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEmail"]', 'teacher@test.com');
    
    // Check training checkboxes
    await page.check('input[name="isCompulsorySubject"]');
    await page.check('input[name="hasAfterSchoolTeaching"]');
    console.log('✅ 2 training checkboxes checked');
    
    // In-class instruction
    await page.fill('input[name="inClassInstructionDurations.0.inClassGradeLevel"]', 'ม.1');
    await page.fill('input[name="inClassInstructionDurations.0.inClassStudentCount"]', '50');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerSemester"]', '20');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerYear"]', '40');
    
    await page.fill('textarea[name="teachingLocation"]', 'ห้องดนตรี');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);
    console.log('✅ Step 4 completed (no images)');

    // STEP 5: Support & Awards
    console.log('📝 STEP 5: Support & Awards');
    
    await page.selectOption('select:has-text("เลือกองค์กร/หน่วยงาน")', 'ผู้บริหารสถานศึกษา');
    await page.fill('input[name="supportFactors.0.sup_supportByDescription"]', 'สนับสนุนงบประมาณ');
    await page.fill('input[name="supportFactors.0.sup_supportByDate"]', '01/01/2026');
    await page.fill('input[name="supportFactors.0.sup_supportByDriveLink"]', 'https://drive.google.com/quick-test');
    
    await page.fill('textarea[name="curriculumFramework"]', 'มีหลักสูตร');
    await page.fill('textarea[name="learningOutcomes"]', 'มีผลลัพธ์');
    await page.fill('textarea[name="managementContext"]', 'มีการจัดการ');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);
    console.log('✅ Step 5 completed');

    // STEP 6: Photo Gallery
    console.log('📝 STEP 6: Photo Gallery');
    await page.fill('input[name="photoGalleryLink"]', 'https://drive.google.com/quick-photos');
    await page.fill('input[name="videoLink"]', 'https://youtube.com/quick-video');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);
    console.log('✅ Step 6 completed');

    // STEP 7: Activities - Skip
    console.log('📝 STEP 7: Activities (SKIPPED)');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);
    console.log('✅ Step 7 skipped');

    // STEP 8: PR & Certification
    console.log('📝 STEP 8: PR & Certification');
    await page.fill('textarea[name="obstacles"]', 'ไม่มี');
    await page.fill('textarea[name="suggestions"]', 'ไม่มี');
    await page.locator('input[name="certifiedINFOByAdminName"]').click({ force: true });
    await page.waitForTimeout(1000);
    console.log('✅ Step 8 completed');

    // Submit
    console.log('\n🚀 Submitting form (no images)...');
    
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/register100') && response.request().method() === 'POST',
      { timeout: 120000 }
    );
    
    const startTime = Date.now();
    await page.getByRole('button', { name: 'ส่งแบบฟอร์ม' }).click();
    
    try {
      const response = await responsePromise;
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(`✅ API responded in ${duration} seconds`);
      console.log(`✅ Status: ${response.status()}`);
      
      if (response.status() === 200) {
        const data = await response.json();
        console.log(`✅ Success! ID: ${data.id}`);
        console.log(`🔗 ${AWS_URL}/dashboard/register100/${data.id}`);
      }
      
      expect(response.status()).toBe(200);
      
      // Wait for success modal
      const successModal = page.locator('text=สำเร็จ!');
      await expect(successModal).toBeVisible({ timeout: 10000 });
      console.log('✅ Success modal appeared');
      
      console.log('\n✅✅✅ AWS Register100 quick test (no images) completed!');
    } catch (error) {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`❌ Timeout after ${duration} seconds`);
      throw error;
    }
  });
});
