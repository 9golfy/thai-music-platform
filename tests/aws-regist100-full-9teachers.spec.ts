import { test, expect } from '@playwright/test';
import path from 'path';

const AWS_URL = 'http://13.212.254.184:3000';

test.describe('AWS Production - Register100 Full Test with 9 Teachers', () => {
  test('should fill ALL fields with 9 teachers and submit successfully', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes
    
    console.log('🚀 Starting FULL Register100 test on AWS with 9 teachers...');
    console.log('📊 Expected: Manager (0.51 MB) + 9 Teachers (4.59 MB) = 5.1 MB total');
    
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
    
    await page.fill('input[name="schoolName"]', 'โรงเรียนดนตรีไทย 100% AWS ทดสอบ 9 ครู');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'มัธยมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    await page.fill('input[placeholder="จำนวนบุคลากร"]', '75');
    await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '850');
    await page.fill('textarea[name="studentCountByGrade"]', 'ม.1 = 140 คน, ม.2 = 145 คน, ม.3 = 150 คน, ม.4 = 135 คน, ม.5 = 140 คน, ม.6 = 140 คน');
    
    await page.fill('input[name="addressNo"]', '99/9');
    await page.fill('input[name="moo"]', '9');
    await page.fill('input[name="road"]', 'ถนนพระราม 9');
    
    await page.fill('input[id="th-district"]', 'คันนายาว');
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    await page.fill('input[name="phone"]', '029999999');
    await page.fill('input[name="fax"]', '029999998');
    
    console.log('✅ Step 1 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 2 ====================
    console.log('\n📝 STEP 2: School Administrator');
    
    await page.fill('input[name="mgtFullName"]', 'นายผู้อำนวยการ AWS 100% ทดสอบ 9 ครู');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการโรงเรียน');
    await page.fill('input[name="mgtPhone"]', '0899999999');
    await page.fill('input[name="mgtAddress"]', '99/9 หมู่ 9 ถนนพระราม 9 แขวงคันนายาว เขตคันนายาว กรุงเทพมหานคร 10230');
    await page.fill('input[name="mgtEmail"]', 'director-aws-100@school.ac.th');
    
    const mgtImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'manager.jpg');
    await page.setInputFiles('input[name="mgtImage"]', mgtImagePath);
    await page.waitForTimeout(500);
    console.log('✅ Manager image uploaded (0.51 MB)');
    
    console.log('✅ Step 2 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 3 ====================
    console.log('\n📝 STEP 3: Teaching Plan');
    
    // Current music types
    await page.fill('input[name="currentMusicTypes.0.grade"]', 'ม.1-3');
    await page.fill('textarea[name="currentMusicTypes.0.details"]', 'สอนดนตรีไทยพื้นฐาน เน้นการเล่นเครื่องดนตรีประเภทเครื่องตี');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.fill('input[name="currentMusicTypes.1.grade"]', 'ม.4-6');
    await page.fill('textarea[name="currentMusicTypes.1.details"]', 'สอนดนตรีไทยขั้นสูง เน้นการเล่นเครื่องดนตรีประเภทเครื่องสี');
    
    // Readiness items
    await page.fill('input[name="readinessItems.0.instrumentName"]', 'ระนาดเอก');
    await page.fill('input[name="readinessItems.0.quantity"]', '5');
    await page.fill('input[name="readinessItems.0.note"]', 'สภาพดีมาก');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="readinessItems.1.instrumentName"]', 'ซอด้วง');
    await page.fill('input[name="readinessItems.1.quantity"]', '6');
    await page.fill('input[name="readinessItems.1.note"]', 'พร้อมใช้');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="readinessItems.2.instrumentName"]', 'ฆ้องวงใหญ่');
    await page.fill('input[name="readinessItems.2.quantity"]', '2');
    await page.fill('input[name="readinessItems.2.note"]', 'ใช้งานได้ดี');
    
    console.log('✅ Step 3 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 4 ====================
    console.log('\n📝 STEP 4: Thai Music Teachers (9 teachers)');
    
    const teacherQualifications = [
      'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย',
      'ครูภูมิปัญญาในท้องถิ่น',
      'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย',
      'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน',
      'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย',
      'ครูภูมิปัญญาในท้องถิ่น',
      'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย',
      'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน',
      'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย'
    ];
    
    for (let i = 0; i < 9; i++) {
      console.log(`  Adding teacher ${i + 1}/9...`);
      
      if (i > 0) {
        await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
        await page.waitForTimeout(1000);
      }
      
      await page.selectOption(`select[name="thaiMusicTeachers.${i}.teacherQualification"]`, teacherQualifications[i]);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherFullName"]`, `นายครู AWS 100% ${i + 1}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPosition"]`, `ครูดนตรีไทย ${i + 1}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherEducation"]`, 'ปริญญาตรี ดนตรีไทย');
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPhone"]`, `089${String(i + 1).padStart(7, '0')}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherEmail"]`, `teacher-aws-100-${i + 1}@school.ac.th`);
      
      const teacherImagePath = path.join(process.cwd(), 'regist', 'test-assets', `teacher${i + 1}.jpg`);
      await page.setInputFiles(`input[id="teacherImage-${i}"]`, teacherImagePath);
      await page.waitForTimeout(800);
      
      console.log(`  ✅ Teacher ${i + 1} added with image (0.51 MB)`);
    }
    
    console.log('✅ All 9 teachers added (Total: 5.1 MB)');
    
    // Check all training checkboxes
    await page.check('input[name="isCompulsorySubject"]');
    await page.check('input[name="hasAfterSchoolTeaching"]');
    await page.check('input[name="hasElectiveSubject"]');
    await page.check('input[name="hasLocalCurriculum"]');
    console.log('✅ All 4 training checkboxes checked (20 points)');
    
    // In-class instruction
    await page.fill('input[name="inClassInstructionDurations.0.inClassGradeLevel"]', 'ม.1-6');
    await page.fill('input[name="inClassInstructionDurations.0.inClassStudentCount"]', '850');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerSemester"]', '60');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerYear"]', '120');
    
    const addInClassBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1);
    await addInClassBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="inClassInstructionDurations.1.inClassGradeLevel"]', 'ม.1-3');
    await page.fill('input[name="inClassInstructionDurations.1.inClassStudentCount"]', '435');
    await page.fill('input[name="inClassInstructionDurations.1.inClassHoursPerSemester"]', '30');
    await page.fill('input[name="inClassInstructionDurations.1.inClassHoursPerYear"]', '60');
    
    // Out-of-class instruction
    await page.selectOption('select[name="outOfClassInstructionDurations.0.outDay"]', 'เสาร์');
    await page.fill('input[name="outOfClassInstructionDurations.0.outTimeFrom"]', '09:00');
    await page.fill('input[name="outOfClassInstructionDurations.0.outTimeTo"]', '12:00');
    await page.fill('input[name="outOfClassInstructionDurations.0.outLocation"]', 'ห้องดนตรีไทยชั้น 3');
    
    const addOutClassBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2);
    await addOutClassBtn.click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="outOfClassInstructionDurations.1.outDay"]', 'อาทิตย์');
    await page.fill('input[name="outOfClassInstructionDurations.1.outTimeFrom"]', '13:00');
    await page.fill('input[name="outOfClassInstructionDurations.1.outTimeTo"]', '16:00');
    await page.fill('input[name="outOfClassInstructionDurations.1.outLocation"]', 'ห้องประชุมใหญ่');
    
    await page.fill('textarea[name="teachingLocation"]', 'ห้องดนตรีไทยขนาด 80 ตารางเมตร มีเครื่องปรับอากาศ และระบบเสียง');
    
    console.log('✅ Step 4 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 5 ====================
    console.log('\n📝 STEP 5: Support Factors & Awards');
    
    await page.selectOption('select:has-text("เลือกองค์กร/หน่วยงาน")', 'ผู้บริหารสถานศึกษา');
    await page.fill('input[name="supportFactors.0.sup_supportByDescription"]', 'สนับสนุนงบประมาณ 100,000 บาท');
    await page.fill('input[name="supportFactors.0.sup_supportByDate"]', '01/01/2026');
    await page.fill('input[name="supportFactors.0.sup_supportByDriveLink"]', 'https://drive.google.com/aws-100-support-001');
    
    await page.check('input[name="hasSupportFromOrg"]');
    await page.waitForTimeout(1000);
    await page.fill('input[name="supportFromOrg.0.organization"]', 'สำนักงานวัฒนธรรมจังหวัดกรุงเทพมหานคร');
    await page.fill('textarea[name="supportFromOrg.0.details"]', 'สนับสนุนเครื่องดนตรีไทย 10 ชิ้น');
    await page.fill('input[name="supportFromOrg.0.evidenceLink"]', 'https://drive.google.com/aws-100-org-001');
    console.log('✅ Support from org (5 points)');
    
    await page.check('input[name="hasSupportFromExternal"]');
    await page.waitForTimeout(1000);
    
    for (let i = 0; i < 3; i++) {
      if (i > 0) {
        const addExtBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2);
        await addExtBtn.click();
        await page.waitForTimeout(500);
      }
      await page.fill(`input[name="supportFromExternal.${i}.organization"]`, `องค์กรภายนอก AWS ${i + 1}`);
      await page.fill(`textarea[name="supportFromExternal.${i}.details"]`, `สนับสนุนกิจกรรม ${i + 1}`);
      await page.fill(`input[name="supportFromExternal.${i}.evidenceLink"]`, `https://drive.google.com/aws-100-ext-${i + 1}`);
    }
    console.log('✅ Support from external: 3 items (15 points)');
    
    await page.fill('textarea[name="curriculumFramework"]', 'มีหลักสูตรดนตรีไทยที่ชัดเจนและเป็นระบบ');
    await page.fill('textarea[name="learningOutcomes"]', 'นักเรียนสามารถบรรเลงเครื่องดนตรีไทยได้อย่างมีคุณภาพ');
    await page.fill('textarea[name="managementContext"]', 'จัดการสอนเป็นระบบ มีการประเมินผลอย่างต่อเนื่อง');
    
    // Awards
    for (let i = 0; i < 3; i++) {
      const addAwardBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').last();
      await addAwardBtn.click();
      await page.waitForTimeout(500);
      const levels = ['จังหวัด', 'ภาค', 'ประเทศ'];
      await page.selectOption(`select[name="awards.${i}.awardLevel"]`, levels[i]);
      await page.fill(`input[name="awards.${i}.awardName"]`, `รางวัลระดับ${levels[i]} AWS`);
      await page.fill(`input[name="awards.${i}.awardDate"]`, `${15 + i * 5}/03/2026`);
      await page.fill(`input[name="awards.${i}.awardEvidenceLink"]`, `https://drive.google.com/aws-100-award-${i + 1}`);
    }
    console.log('✅ Awards: 3 items (20 points)');
    
    console.log('✅ Step 5 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 6 ====================
    console.log('\n📝 STEP 6: Photo Gallery & Videos');
    
    await page.fill('input[name="photoGalleryLink"]', 'https://drive.google.com/aws-100-photos');
    await page.fill('input[name="videoLink"]', 'https://youtube.com/watch?v=aws-100-video');
    
    console.log('✅ Step 6 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 7 ====================
    console.log('\n📝 STEP 7: Activities');
    
    for (let i = 0; i < 3; i++) {
      const addActivityBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
      await addActivityBtn.click();
      await page.waitForTimeout(500);
      await page.fill(`input[name="activitiesWithinProvinceInternal.${i}.activityName"]`, `กิจกรรมภายใน AWS ${i + 1}`);
      await page.fill(`input[name="activitiesWithinProvinceInternal.${i}.activityDate"]`, `${10 + i * 5}/01/2026`);
      await page.fill(`input[name="activitiesWithinProvinceInternal.${i}.evidenceLink"]`, `https://drive.google.com/aws-100-internal-${i + 1}`);
    }
    console.log('✅ Internal activities: 3 items (5 points)');
    
    for (let i = 0; i < 3; i++) {
      const addExtActivityBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1);
      await addExtActivityBtn.click();
      await page.waitForTimeout(500);
      await page.fill(`input[name="activitiesWithinProvinceExternal.${i}.activityName"]`, `กิจกรรมภายนอก AWS ${i + 1}`);
      await page.fill(`input[name="activitiesWithinProvinceExternal.${i}.activityDate"]`, `${5 + i * 5}/02/2026`);
      await page.fill(`input[name="activitiesWithinProvinceExternal.${i}.evidenceLink"]`, `https://drive.google.com/aws-100-external-${i + 1}`);
    }
    console.log('✅ External activities: 3 items (5 points)');
    
    for (let i = 0; i < 3; i++) {
      const addOutsideBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2);
      await addOutsideBtn.click();
      await page.waitForTimeout(500);
      await page.fill(`input[name="activitiesOutsideProvince.${i}.activityName"]`, `กิจกรรมนอกจังหวัด AWS ${i + 1}`);
      await page.fill(`input[name="activitiesOutsideProvince.${i}.activityDate"]`, `${15 + i * 5}/03/2026`);
      await page.fill(`input[name="activitiesOutsideProvince.${i}.evidenceLink"]`, `https://drive.google.com/aws-100-outside-${i + 1}`);
    }
    console.log('✅ Outside province activities: 3 items (5 points)');
    
    console.log('✅ Step 7 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 8 ====================
    console.log('\n📝 STEP 8: PR Activities & Certification');
    
    for (let i = 0; i < 3; i++) {
      const addPRBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
      await addPRBtn.click();
      await page.waitForTimeout(500);
      const platforms = ['Facebook', 'YouTube', 'TikTok'];
      await page.fill(`input[name="prActivities.${i}.activityName"]`, `โพสต์ ${platforms[i]} AWS 100`);
      await page.fill(`input[name="prActivities.${i}.platform"]`, platforms[i]);
      await page.fill(`input[name="prActivities.${i}.publishDate"]`, `${1 + i * 10}/01/2026`);
      await page.fill(`input[name="prActivities.${i}.evidenceLink"]`, `https://${platforms[i].toLowerCase()}.com/aws-100-post-${i + 1}`);
    }
    console.log('✅ PR activities: 3 items (5 points)');
    
    await page.fill('input[name="heardFromSchoolName"]', 'โรงเรียนอื่นในเครือข่าย AWS');
    await page.fill('input[name="heardFromSchoolDistrict"]', 'คันนายาว');
    await page.fill('input[name="heardFromSchoolProvince"]', 'กรุงเทพมหานคร');
    
    await page.check('input[name="DCP_PR_Channel_FACEBOOK"]');
    await page.check('input[name="DCP_PR_Channel_YOUTUBE"]');
    await page.check('input[name="DCP_PR_Channel_Tiktok"]');
    
    await page.fill('input[name="heardFromCulturalOfficeName"]', 'สำนักงานวัฒนธรรมกรุงเทพมหานคร');
    await page.fill('input[name="heardFromEducationAreaName"]', 'สพม. กทม. เขต 1');
    await page.selectOption('select[name="heardFromEducationAreaProvince"]', 'กรุงเทพมหานคร');
    
    await page.check('input[name="heardFromOther"]');
    await page.fill('input[name="heardFromOtherDetail"]', 'งานมหกรรมดนตรีไทยแห่งชาติ 2026 AWS');
    
    await page.fill('textarea[name="obstacles"]', 'ขาดงบประมาณในการซ่อมบำรุงเครื่องดนตรีไทยที่เสียหาย');
    await page.fill('textarea[name="suggestions"]', 'ควรมีการสนับสนุนงบประมาณเพิ่มเติมสำหรับการซ่อมบำรุงและจัดซื้อเครื่องดนตรีใหม่');
    
    await page.locator('input[name="certifiedINFOByAdminName"]').click({ force: true });
    await page.waitForTimeout(1000);
    
    console.log('✅ Step 8 completed');
    console.log('\n🚀 Submitting form to AWS...');
    
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/register100') && response.request().method() === 'POST',
      { timeout: 180000 }
    );
    
    const startTime = Date.now();
    await page.getByRole('button', { name: 'ส่งแบบฟอร์ม' }).click({ force: true });
    console.log('⏳ Waiting for API response (up to 3 minutes for 5.1 MB upload)...');
    
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
      // Try multiple selectors for success modal
      const successModal = page.locator('text=สำเร็จ!').or(page.getByTestId('success-modal')).or(page.locator('h2:has-text("สำเร็จ!")'));
      const isSuccess = await successModal.isVisible({ timeout: 15000 }).catch(() => false);
      
      if (isSuccess) {
        console.log('✅ Success modal appeared');
      } else {
        console.log('⚠️ Success modal not found, but API succeeded (200)');
      }
      
      await page.screenshot({ path: 'test-results/aws-regist100-9teachers-success.png', fullPage: true });
      
      // API succeeded - test passes
      expect(apiSuccess).toBe(true);
    } else {
      await page.screenshot({ path: 'test-results/aws-regist100-9teachers-error.png', fullPage: true });
      throw new Error('API request failed or timeout');
    }
    
    console.log('\n✅✅✅ AWS Register100 full test with 9 teachers completed successfully!');
  });
});
