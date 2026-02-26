import { test, expect } from '@playwright/test';

const AWS_URL = 'http://13.212.254.184:3000';

test.describe('AWS Quick Test - No Images', () => {
  test('should submit form without images to test API speed', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes
    
    console.log('🚀 Quick test on AWS (no images)...');
    
    await page.goto(`${AWS_URL}/regist-support`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Accept consent
    const consentButton = page.getByTestId('btn-consent-accept');
    if (await consentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await consentButton.click();
      await page.waitForTimeout(500);
    }

    // STEP 1
    await page.locator('input[type="radio"][id="type-club"]').click();
    await page.waitForTimeout(1000);
    await page.waitForSelector('input[name="supportTypeName"]:not([disabled])');
    await page.fill('input[name="supportTypeName"]:not([disabled])', 'Quick Test');
    await page.fill('input[name="supportTypeMemberCount"]:not([disabled])', '20');
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบเร็ว');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'มัธยมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    await page.fill('input[placeholder="จำนวนบุคลากร"]', '30');
    await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '300');
    await page.fill('input[name="addressNo"]', '1');
    await page.fill('input[name="subDistrict"]', 'คลองเตย');
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await page.fill('input[name="phone"]', '021111111');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 2 - NO IMAGE
    await page.fill('input[name="mgtFullName"]', 'ผู้บริหาร');
    await page.fill('input[name="mgtPosition"]', 'ผอ.');
    await page.fill('input[name="mgtPhone"]', '0811111111');
    await page.fill('input[name="mgtEmail"]', 'test@test.com');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 3
    await page.fill('input[name="readinessItems.0.instrumentName"]', 'ระนาด');
    await page.fill('input[name="readinessItems.0.quantity"]', '1');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 4 - NO IMAGES
    await page.check('input[name="isCompulsorySubject"]');
    await page.selectOption('select[name="thaiMusicTeachers.0.teacherQualification"]', 
      'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherFullName"]', 'ครู 1');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPosition"]', 'ครู');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEducation"]', 'ป.ตรี');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPhone"]', '0811111111');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEmail"]', 't1@test.com');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="inClassInstructionDurations.0.inClassGradeLevel"]', 'ม.1');
    await page.fill('input[name="inClassInstructionDurations.0.inClassStudentCount"]', '50');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerSemester"]', '20');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerYear"]', '40');
    await page.fill('textarea[name="teachingLocation"]', 'ห้องดนตรี');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 5
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.selectOption('select', 'ผู้บริหารสถานศึกษา');
    await page.fill('input[name="supportFactors.0.sup_supportByDescription"]', 'สนับสนุน');
    await page.fill('input[name="supportFactors.0.sup_supportByDate"]', '01/01/2026');
    await page.fill('input[name="supportFactors.0.sup_supportByDriveLink"]', 'https://drive.google.com/test');
    await page.fill('textarea[name="curriculumFramework"]', 'มีหลักสูตร');
    await page.fill('textarea[name="learningOutcomes"]', 'มีผลลัพธ์');
    await page.fill('textarea[name="managementContext"]', 'มีการจัดการ');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 6
    await page.fill('input[name="photoGalleryLink"]', 'https://drive.google.com/photos');
    await page.fill('input[name="videoLink"]', 'https://youtube.com/test');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 7 - Skip
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // STEP 8
    await page.fill('textarea[name="obstacles"]', 'ไม่มี');
    await page.fill('textarea[name="suggestions"]', 'ไม่มี');
    await page.locator('input[name="certifiedINFOByAdminName"]').click({ force: true });
    await page.waitForTimeout(1000);

    console.log('🚀 Submitting (no images)...');
    
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/register-support') && response.request().method() === 'POST',
      { timeout: 120000 }
    );
    
    const startTime = Date.now();
    await page.getByTestId('btn-submit').click({ force: true });
    
    try {
      const response = await responsePromise;
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(`✅ API responded in ${duration} seconds`);
      console.log(`✅ Status: ${response.status()}`);
      
      if (response.status() === 200) {
        const data = await response.json();
        console.log(`✅ Success! ID: ${data.submissionId}`);
        console.log(`🔗 ${AWS_URL}/dashboard/register-support/${data.submissionId}`);
      }
      
      expect(response.status()).toBe(200);
    } catch (error) {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`❌ Timeout after ${duration} seconds`);
      throw error;
    }
  });
});
