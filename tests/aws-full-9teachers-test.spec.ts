import { test, expect } from '@playwright/test';
import path from 'path';

const AWS_URL = 'http://13.228.225.47:3000';

test.describe('AWS Production - Full Test with 9 Teachers', () => {
  test('should fill ALL fields with 9 teachers and submit successfully', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes
    
    console.log('🚀 Starting FULL test on AWS with 9 teachers...');
    console.log('📊 Expected: Manager (0.51 MB) + 9 Teachers (4.59 MB) = 5.1 MB total');
    
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
    await page.fill('input[name="supportTypeName"]:not([disabled])', 'ชุมนุมดนตรีไทยโรงเรียนทดสอบ AWS 9 ครู');
    await page.fill('input[name="supportTypeMemberCount"]:not([disabled])', '45');
    
    await page.fill('input[name="schoolName"]', 'โรงเรียนสนับสนุนดนตรีไทยทดสอบ AWS 9 ครู');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'มัธยมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    await page.fill('input[placeholder="จำนวนบุคลากร"]', '55');
    await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '650');
    
    await page.fill('input[name="addressNo"]', '99/9');
    await page.fill('input[name="moo"]', '9');
    await page.fill('input[name="road"]', 'ถนนพระราม 9');
    
    await page.fill('input[name="subDistrict"]', 'คันนายาว');
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    await page.fill('input[name="phone"]', '029999999');
    await page.fill('input[name="fax"]', '029999998');
    
    console.log('✅ Step 1 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 2 ====================
    console.log('\n📝 STEP 2: Administrator');
    
    await page.fill('input[name="mgtFullName"]', 'นายผู้บริหาร ทดสอบ AWS 9 ครู');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการโรงเรียน');
    await page.fill('input[name="mgtPhone"]', '0899999999');
    await page.fill('input[name="mgtEmail"]', 'admin-aws-9@support-school.ac.th');
    
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
    await page.fill('input[name="readinessItems.0.quantity"]', '4');
    await page.fill('input[name="readinessItems.0.note"]', 'สภาพดีมาก');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').click();
    await page.waitForTimeout(500);
    await page.fill('input[name="readinessItems.1.instrumentName"]', 'ซอด้วง');
    await page.fill('input[name="readinessItems.1.quantity"]', '6');
    await page.fill('input[name="readinessItems.1.note"]', 'พร้อมใช้');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').click();
    await page.waitForTimeout(500);
    await page.fill('input[name="readinessItems.2.instrumentName"]', 'ฆ้องวงใหญ่');
    await page.fill('input[name="readinessItems.2.quantity"]', '2');
    await page.fill('input[name="readinessItems.2.note"]', 'ใช้งานได้ดี');
    
    console.log('✅ Step 3 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 4 ====================
    console.log('\n📝 STEP 4: Thai Music Teachers (9 teachers)');
    
    await page.check('input[name="isCompulsorySubject"]');
    await page.check('input[name="hasAfterSchoolTeaching"]');
    await page.check('input[name="hasElectiveSubject"]');
    await page.check('input[name="hasLocalCurriculum"]');
    await page.waitForTimeout(500);
    console.log('✅ All 4 training checkboxes checked (20 points)');
    
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
        await page.waitForSelector(`select[name="thaiMusicTeachers.${i}.teacherQualification"]`);
      }
      
      await page.selectOption(`select[name="thaiMusicTeachers.${i}.teacherQualification"]`, teacherQualifications[i]);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherFullName"]`, `นายครู AWS ทดสอบ ${i + 1}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPosition"]`, `ครูดนตรีไทย ${i + 1}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherEducation"]`, 'ปริญญาตรี ดนตรีไทย');
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPhone"]`, `089${String(i + 1).padStart(7, '0')}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherEmail"]`, `teacher-aws-${i + 1}@support-school.ac.th`);
      
      const teacherImagePath = path.join(process.cwd(), 'regist', 'test-assets', `teacher${i + 1}.jpg`);
      await page.locator(`input[name="thaiMusicTeachers.${i}.teacherImage"]`).setInputFiles(teacherImagePath);
      await page.waitForTimeout(800);
      
      console.log(`  ✅ Teacher ${i + 1} added with image (0.51 MB)`);
    }
    
    console.log('✅ All 9 teachers added (Total: 0.51 + 4.59 = 5.1 MB)');
    
    // In-Class Instruction
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="inClassInstructionDurations.0.inClassGradeLevel"]', 'ม.1-6');
    await page.fill('input[name="inClassInstructionDurations.0.inClassStudentCount"]', '200');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerSemester"]', '60');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerYear"]', '120');
    
    // Out-of-Class Instruction
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2).click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="outOfClassInstructionDurations.0.outDay"]', 'เสาร์');
    await page.fill('input[name="outOfClassInstructionDurations.0.outTimeFrom"]', '09:00');
    await page.fill('input[name="outOfClassInstructionDurations.0.outTimeTo"]', '12:00');
    await page.fill('input[name="outOfClassInstructionDurations.0.outLocation"]', 'ห้องดนตรีไทยชั้น 3');
    
    await page.fill('textarea[name="teachingLocation"]', 'ห้องดนตรีไทยขนาด 80 ตารางเมตร มีเครื่องปรับอากาศ และระบบเสียง');
    
    console.log('✅ Step 4 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 5 ====================
    console.log('\n📝 STEP 5: Support Factors & Awards');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.selectOption('select', 'ผู้บริหารสถานศึกษา');
    await page.fill('input[name="supportFactors.0.sup_supportByDescription"]', 'สนับสนุนงบประมาณ 100,000 บาท');
    await page.fill('input[name="supportFactors.0.sup_supportByDate"]', '01/01/2026');
    await page.fill('input[name="supportFactors.0.sup_supportByDriveLink"]', 'https://drive.google.com/aws-support-factor-001');
    
    await page.check('input[name="hasSupportFromOrg"]');
    await page.waitForTimeout(1000);
    await page.fill('input[name="supportFromOrg.0.organization"]', 'สำนักงานวัฒนธรรมจังหวัดกรุงเทพมหานคร');
    await page.fill('textarea[name="supportFromOrg.0.details"]', 'สนับสนุนเครื่องดนตรีไทย 10 ชิ้น');
    await page.fill('input[name="supportFromOrg.0.evidenceLink"]', 'https://drive.google.com/aws-org-support-001');
    console.log('✅ Support from org (5 points)');
    
    await page.check('input[name="hasSupportFromExternal"]');
    await page.waitForTimeout(1000);
    
    await page.fill('input[name="supportFromExternal.0.organization"]', 'มูลนิธิส่งเสริมดนตรีไทยแห่งชาติ');
    await page.fill('textarea[name="supportFromExternal.0.details"]', 'สนับสนุนครูผู้สอน 2 คน');
    await page.fill('input[name="supportFromExternal.0.evidenceLink"]', 'https://drive.google.com/aws-ext-001');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="supportFromExternal.1.organization"]', 'ชุมชนท้องถิ่น');
    await page.fill('textarea[name="supportFromExternal.1.details"]', 'สนับสนุนสถานที่ซ้อม');
    await page.fill('input[name="supportFromExternal.1.evidenceLink"]', 'https://drive.google.com/aws-ext-002');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="supportFromExternal.2.organization"]', 'ผู้ปกครองนักเรียน');
    await page.fill('textarea[name="supportFromExternal.2.details"]', 'สนับสนุนค่าใช้จ่ายในการแข่งขัน');
    await page.fill('input[name="supportFromExternal.2.evidenceLink"]', 'https://drive.google.com/aws-ext-003');
    console.log('✅ Support from external: 3 items (15 points)');
    
    await page.fill('textarea[name="curriculumFramework"]', 'มีหลักสูตรดนตรีไทยที่ชัดเจนและเป็นระบบ');
    await page.fill('textarea[name="learningOutcomes"]', 'นักเรียนสามารถบรรเลงเครื่องดนตรีไทยได้อย่างมีคุณภาพ');
    await page.fill('textarea[name="managementContext"]', 'จัดการสอนเป็นระบบ มีการประเมินผลอย่างต่อเนื่อง');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').last().click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="awards.0.awardLevel"]', 'จังหวัด');
    await page.fill('input[name="awards.0.awardName"]', 'รางวัลชนะเลิศระดับจังหวัด');
    await page.fill('input[name="awards.0.awardDate"]', '15/03/2026');
    await page.fill('input[name="awards.0.awardEvidenceLink"]', 'https://drive.google.com/aws-award-001');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').last().click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="awards.1.awardLevel"]', 'ภาค');
    await page.fill('input[name="awards.1.awardName"]', 'รองชนะเลิศอันดับ 1 ระดับภาค');
    await page.fill('input[name="awards.1.awardDate"]', '20/04/2026');
    await page.fill('input[name="awards.1.awardEvidenceLink"]', 'https://drive.google.com/aws-award-002');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').last().click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="awards.2.awardLevel"]', 'ประเทศ');
    await page.fill('input[name="awards.2.awardName"]', 'รางวัลเกียรติยศระดับประเทศ');
    await page.fill('input[name="awards.2.awardDate"]', '10/05/2026');
    await page.fill('input[name="awards.2.awardEvidenceLink"]', 'https://drive.google.com/aws-award-003');
    console.log('✅ Awards: 3 items (20 points)');
    
    console.log('✅ Step 5 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 6 ====================
    console.log('\n📝 STEP 6: Photo Gallery & Videos');
    
    await page.fill('input[name="photoGalleryLink"]', 'https://drive.google.com/aws-photos-9teachers');
    await page.fill('input[name="videoLink"]', 'https://youtube.com/watch?v=aws-9teachers-video');
    
    console.log('✅ Step 6 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 7 ====================
    console.log('\n📝 STEP 7: Activities (3+ each for 15 points)');
    
    for (let i = 0; i < 3; i++) {
      await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
      await page.waitForTimeout(500);
      await page.fill(`input[name="activitiesWithinProvinceInternal.${i}.activityName"]`, `กิจกรรมภายในโรงเรียน AWS ${i + 1}`);
      await page.fill(`input[name="activitiesWithinProvinceInternal.${i}.activityDate"]`, `${10 + i * 5}/01/2026`);
      await page.fill(`input[name="activitiesWithinProvinceInternal.${i}.evidenceLink"]`, `https://drive.google.com/aws-internal-${i + 1}`);
    }
    console.log('✅ Internal activities: 3 items (5 points)');
    
    for (let i = 0; i < 3; i++) {
      await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
      await page.waitForTimeout(500);
      await page.fill(`input[name="activitiesWithinProvinceExternal.${i}.activityName"]`, `กิจกรรมภายนอกในจังหวัด AWS ${i + 1}`);
      await page.fill(`input[name="activitiesWithinProvinceExternal.${i}.activityDate"]`, `${5 + i * 5}/02/2026`);
      await page.fill(`input[name="activitiesWithinProvinceExternal.${i}.evidenceLink"]`, `https://drive.google.com/aws-external-${i + 1}`);
    }
    console.log('✅ External activities: 3 items (5 points)');
    
    for (let i = 0; i < 3; i++) {
      await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2).click();
      await page.waitForTimeout(500);
      await page.fill(`input[name="activitiesOutsideProvince.${i}.activityName"]`, `กิจกรรมนอกจังหวัด AWS ${i + 1}`);
      await page.fill(`input[name="activitiesOutsideProvince.${i}.activityDate"]`, `${15 + i * 5}/03/2026`);
      await page.fill(`input[name="activitiesOutsideProvince.${i}.evidenceLink"]`, `https://drive.google.com/aws-outside-${i + 1}`);
    }
    console.log('✅ Outside province activities: 3 items (5 points)');
    
    console.log('✅ Step 7 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 8 ====================
    console.log('\n📝 STEP 8: PR Activities & Certification');
    
    for (let i = 0; i < 3; i++) {
      await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
      await page.waitForTimeout(500);
      const platforms = ['Facebook', 'YouTube', 'TikTok'];
      await page.fill(`input[name="prActivities.${i}.activityName"]`, `โพสต์ ${platforms[i]} AWS ${i + 1}`);
      await page.fill(`input[name="prActivities.${i}.platform"]`, platforms[i]);
      await page.fill(`input[name="prActivities.${i}.publishDate"]`, `${1 + i * 10}/01/2026`);
      await page.fill(`input[name="prActivities.${i}.evidenceLink"]`, `https://${platforms[i].toLowerCase()}.com/aws-post-${i + 1}`);
    }
    console.log('✅ PR activities: 3 items (5 points)');
    
    await page.fill('input[name="heardFromSchoolName"]', 'โรงเรียนอื่นในเครือข่าย AWS');
    await page.fill('input[name="heardFromSchoolDistrict"]', 'คันนายาว');
    await page.fill('input[name="heardFromSchoolProvince"]', 'กรุงเทพมหานคร');
    
    await page.check('input[name="DCP_PR_Channel_FACEBOOK"]');
    await page.check('input[name="DCP_PR_Channel_YOUTUBE"]');
    await page.check('input[name="DCP_PR_Channel_Tiktok"]');
    
    await page.fill('input[name="heardFromCulturalOfficeName"]', 'สำนักงานวัฒนธรรมกรุงเทพมหานคร');
    await page.fill('input[name="heardFromEducationAreaName"]', 'สพป.กทม. เขต 1');
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
      response => response.url().includes('/api/register-support') && response.request().method() === 'POST',
      { timeout: 180000 } // 3 minutes for 9 teachers
    );
    
    const startTime = Date.now();
    await page.getByTestId('btn-submit').click({ force: true });
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
        await page.screenshot({ path: 'test-results/aws-full-9teachers-success.png', fullPage: true });
      }
      
      expect(isSuccess).toBe(true);
    } else {
      await page.screenshot({ path: 'test-results/aws-full-9teachers-error.png', fullPage: true });
      throw new Error('API request failed or timeout');
    }
    
    console.log('\n✅✅✅ AWS Full test with 9 teachers completed successfully!');
  });
});
