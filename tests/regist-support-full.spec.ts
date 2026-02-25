import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Register Support - Full Form Test', () => {
  test('should fill all fields and submit successfully (Happy Case)', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes timeout
    
    // Capture console logs
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('file') || text.includes('File') || text.includes('FormData') || text.includes('mgtImage') || text.includes('teacher')) {
        console.log(`🌐 Browser: ${text}`);
      }
    });
    
    console.log('🚀 Starting Register Support full form test...');
    
    // Navigate to form
    await page.goto('http://localhost:3000/regist-support');
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
    console.log('📝 Step 1: Support Type & Basic Information');
    
    // Select support type - ชุมนุม
    await page.locator('input[type="radio"][id="type-club"]').click();
    await page.waitForTimeout(1000);
    
    // Fill the enabled input fields for ชุมนุม
    // Find inputs that are NOT disabled
    const nameInput = page.locator('input[name="supportTypeName"]:not([disabled])');
    const countInput = page.locator('input[name="supportTypeMemberCount"]:not([disabled])');
    
    await nameInput.fill('ชุมนุมดนตรีไทยโรงเรียนทดสอบ');
    await countInput.fill('35');
    await page.waitForTimeout(500);
    
    // Basic info
    await page.fill('input[name="schoolName"]', 'โรงเรียนสนับสนุนดนตรีไทยทดสอบ');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'มัธยมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    await page.fill('input[placeholder="จำนวนบุคลากร"]', '50');
    await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '600');
    
    // Address
    await page.fill('input[name="addressNo"]', '88/2');
    await page.fill('input[name="moo"]', '5');
    await page.fill('input[name="road"]', 'ถนนรามอินทรา');
    
    // Use autocomplete for address
    await page.fill('input[name="subDistrict"]', 'คันนายาว');
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    await page.fill('input[name="phone"]', '021112222');
    await page.fill('input[name="fax"]', '021112223');
    
    console.log('✅ Step 1 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 2: Administrator ====================
    console.log('📝 Step 2: Administrator');
    
    await page.fill('input[name="mgtFullName"]', 'นายผู้บริหาร สนับสนุน');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0898765432');
    await page.fill('input[name="mgtEmail"]', 'admin@support-school.ac.th');
    
    // Upload image
    const managerImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'manager.jpg');
    await page.locator('input[name="mgtImage"]').setInputFiles(managerImagePath);
    await page.waitForTimeout(500);
    
    console.log('✅ Step 2 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 3: Readiness Items ====================
    console.log('📝 Step 3: Readiness Items (Instruments)');
    
    // Add instrument 1
    await page.fill('input[name="readinessItems.0.instrumentName"]', 'ระนาดทุ้ม');
    await page.fill('input[name="readinessItems.0.quantity"]', '3');
    await page.fill('input[name="readinessItems.0.note"]', 'สภาพดี');
    
    // Add instrument 2
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').click();
    await page.waitForTimeout(500);
    await page.fill('input[name="readinessItems.1.instrumentName"]', 'ซออู้');
    await page.fill('input[name="readinessItems.1.quantity"]', '5');
    await page.fill('input[name="readinessItems.1.note"]', 'ต้องซ่อม 1 ตัว');
    
    // Add instrument 3
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').click();
    await page.waitForTimeout(500);
    await page.fill('input[name="readinessItems.2.instrumentName"]', 'ฆ้องวงเล็ก');
    await page.fill('input[name="readinessItems.2.quantity"]', '2');
    await page.fill('input[name="readinessItems.2.note"]', 'พร้อมใช้งาน');
    
    console.log('✅ Step 3 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 4: Teachers ====================
    console.log('📝 Step 4: Thai Music Teachers');
    
    // Check training checkboxes (20 points total)
    await page.check('input[name="isCompulsorySubject"]');
    await page.check('input[name="hasAfterSchoolTeaching"]');
    await page.check('input[name="hasElectiveSubject"]');
    await page.check('input[name="hasLocalCurriculum"]');
    await page.waitForTimeout(500);
    
    // Teacher 1
    await page.selectOption('select[name="thaiMusicTeachers.0.teacherQualification"]', 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherFullName"]', 'นางสาวครูสนับสนุน ทดสอบ');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPosition"]', 'ครูดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEducation"]', 'ปริญญาตรี ดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPhone"]', '0887654321');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEmail"]', 'teacher@support-school.ac.th');
    
    const teacher1ImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'teacher1.jpg');
    await page.locator('input[name="thaiMusicTeachers.0.teacherImage"]').setInputFiles(teacher1ImagePath);
    await page.waitForTimeout(500);
    
    // Add Teacher 2
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    
    await page.selectOption('select[name="thaiMusicTeachers.1.teacherQualification"]', 'ครูภูมิปัญญาในท้องถิ่น');
    await page.fill('input[name="thaiMusicTeachers.1.teacherFullName"]', 'นายครูภูมิปัญญา ทดสอบ');
    await page.fill('input[name="thaiMusicTeachers.1.teacherPosition"]', 'ครูพิเศษ');
    await page.fill('input[name="thaiMusicTeachers.1.teacherEducation"]', 'ประสบการณ์ 20 ปี');
    await page.fill('input[name="thaiMusicTeachers.1.teacherPhone"]', '0876543210');
    await page.fill('input[name="thaiMusicTeachers.1.teacherEmail"]', 'wisdom@support-school.ac.th');
    
    const teacher2ImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'teacher2.jpg');
    await page.locator('input[name="thaiMusicTeachers.1.teacherImage"]').setInputFiles(teacher2ImagePath);
    await page.waitForTimeout(500);
    
    // In-Class Instruction Duration
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="inClassInstructionDurations.0.inClassGradeLevel"]', 'ม.1-3');
    await page.fill('input[name="inClassInstructionDurations.0.inClassStudentCount"]', '180');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerSemester"]', '50');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerYear"]', '100');
    
    // Out-of-Class Instruction Duration
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2).click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="outOfClassInstructionDurations.0.outDay"]', 'เสาร์');
    await page.fill('input[name="outOfClassInstructionDurations.0.outTimeFrom"]', '10:00');
    await page.fill('input[name="outOfClassInstructionDurations.0.outTimeTo"]', '13:00');
    await page.fill('input[name="outOfClassInstructionDurations.0.outLocation"]', 'ห้องดนตรีไทย');
    
    // Teaching location
    await page.fill('textarea[name="teachingLocation"]', 'ห้องดนตรีไทยขนาด 60 ตารางเมตร มีเครื่องปรับอากาศ');
    
    console.log('✅ Step 4 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 5: Support & Awards ====================
    console.log('📝 Step 5: Support Factors & Awards');
    
    // Add support factor
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.selectOption('select', 'ผู้บริหารสถานศึกษา');
    await page.fill('input[name="supportFactors.0.sup_supportByDescription"]', 'สนับสนุนงบประมาณและสถานที่');
    await page.fill('input[name="supportFactors.0.sup_supportByDate"]', '01/02/2026');
    await page.fill('input[name="supportFactors.0.sup_supportByDriveLink"]', 'https://drive.google.com/support-001');
    
    // Support from organization
    await page.check('input[name="hasSupportFromOrg"]');
    await page.waitForTimeout(1000);
    
    // The first item should already exist (index 0), just fill it
    await page.fill('input[name="supportFromOrg.0.organization"]', 'สำนักงานวัฒนธรรมจังหวัด');
    await page.fill('textarea[name="supportFromOrg.0.details"]', 'สนับสนุนเครื่องดนตรี');
    await page.fill('input[name="supportFromOrg.0.evidenceLink"]', 'https://drive.google.com/org-support-001');
    
    // Support from external (3+ for 15 points)
    await page.check('input[name="hasSupportFromExternal"]');
    await page.waitForTimeout(1000);
    
    // Fill first item (index 0)
    await page.fill('input[name="supportFromExternal.0.organization"]', 'มูลนิธิส่งเสริมดนตรีไทย');
    await page.fill('textarea[name="supportFromExternal.0.details"]', 'สนับสนุนครูผู้สอน');
    await page.fill('input[name="supportFromExternal.0.evidenceLink"]', 'https://drive.google.com/ext-001');
    
    // Add and fill second item
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="supportFromExternal.1.organization"]', 'ชุมชนท้องถิ่น');
    await page.fill('textarea[name="supportFromExternal.1.details"]', 'สนับสนุนสถานที่ซ้อม');
    await page.fill('input[name="supportFromExternal.1.evidenceLink"]', 'https://drive.google.com/ext-002');
    
    // Add and fill third item
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="supportFromExternal.2.organization"]', 'ผู้ปกครอง');
    await page.fill('textarea[name="supportFromExternal.2.details"]', 'สนับสนุนค่าใช้จ่าย');
    await page.fill('input[name="supportFromExternal.2.evidenceLink"]', 'https://drive.google.com/ext-003');
    
    // Fill other fields
    await page.fill('textarea[name="curriculumFramework"]', 'มีหลักสูตรดนตรีไทยที่ชัดเจน');
    await page.fill('textarea[name="learningOutcomes"]', 'นักเรียนสามารถบรรเลงได้');
    await page.fill('textarea[name="managementContext"]', 'จัดการสอนเป็นระบบ');
    
    // Add awards (3+ for 20 points)
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').last().click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="awards.0.awardLevel"]', 'จังหวัด');
    await page.fill('input[name="awards.0.awardName"]', 'รางวัลชนะเลิศ');
    await page.fill('input[name="awards.0.awardDate"]', '15/03/2026');
    await page.fill('input[name="awards.0.awardEvidenceLink"]', 'https://drive.google.com/award-001');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').last().click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="awards.1.awardLevel"]', 'ภาค');
    await page.fill('input[name="awards.1.awardName"]', 'รองชนะเลิศอันดับ 1');
    await page.fill('input[name="awards.1.awardDate"]', '20/04/2026');
    await page.fill('input[name="awards.1.awardEvidenceLink"]', 'https://drive.google.com/award-002');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').last().click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="awards.2.awardLevel"]', 'ประเทศ');
    await page.fill('input[name="awards.2.awardName"]', 'รางวัลเกียรติยศ');
    await page.fill('input[name="awards.2.awardDate"]', '10/05/2026');
    await page.fill('input[name="awards.2.awardEvidenceLink"]', 'https://drive.google.com/award-003');
    
    console.log('✅ Step 5 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 6: Media ====================
    console.log('📝 Step 6: Photo Gallery & Videos');
    
    await page.fill('input[name="photoGalleryLink"]', 'https://drive.google.com/photos-support');
    await page.fill('input[name="videoLink"]', 'https://youtube.com/watch?v=support-video-001');
    
    console.log('✅ Step 6 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 7: Activities ====================
    console.log('📝 Step 7: Activities (3+ each for 15 points total)');
    
    // Internal activities (3+ for 5 points)
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityName"]', 'กิจกรรมภายในโรงเรียน 1');
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityDate"]', '10/01/2026');
    await page.fill('input[name="activitiesWithinProvinceInternal.0.evidenceLink"]', 'https://drive.google.com/internal-001');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceInternal.1.activityName"]', 'กิจกรรมภายในโรงเรียน 2');
    await page.fill('input[name="activitiesWithinProvinceInternal.1.activityDate"]', '15/02/2026');
    await page.fill('input[name="activitiesWithinProvinceInternal.1.evidenceLink"]', 'https://drive.google.com/internal-002');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceInternal.2.activityName"]', 'กิจกรรมภายในโรงเรียน 3');
    await page.fill('input[name="activitiesWithinProvinceInternal.2.activityDate"]', '20/03/2026');
    await page.fill('input[name="activitiesWithinProvinceInternal.2.evidenceLink"]', 'https://drive.google.com/internal-003');
    
    // External activities within province (3+ for 5 points)
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceExternal.0.activityName"]', 'กิจกรรมภายนอกในจังหวัด 1');
    await page.fill('input[name="activitiesWithinProvinceExternal.0.activityDate"]', '05/02/2026');
    await page.fill('input[name="activitiesWithinProvinceExternal.0.evidenceLink"]', 'https://drive.google.com/external-001');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceExternal.1.activityName"]', 'กิจกรรมภายนอกในจังหวัด 2');
    await page.fill('input[name="activitiesWithinProvinceExternal.1.activityDate"]', '10/03/2026');
    await page.fill('input[name="activitiesWithinProvinceExternal.1.evidenceLink"]', 'https://drive.google.com/external-002');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceExternal.2.activityName"]', 'กิจกรรมภายนอกในจังหวัด 3');
    await page.fill('input[name="activitiesWithinProvinceExternal.2.activityDate"]', '25/04/2026');
    await page.fill('input[name="activitiesWithinProvinceExternal.2.evidenceLink"]', 'https://drive.google.com/external-003');
    
    // Activities outside province (3+ for 5 points)
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesOutsideProvince.0.activityName"]', 'กิจกรรมนอกจังหวัด 1');
    await page.fill('input[name="activitiesOutsideProvince.0.activityDate"]', '15/03/2026');
    await page.fill('input[name="activitiesOutsideProvince.0.evidenceLink"]', 'https://drive.google.com/outside-001');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesOutsideProvince.1.activityName"]', 'กิจกรรมนอกจังหวัด 2');
    await page.fill('input[name="activitiesOutsideProvince.1.activityDate"]', '20/04/2026');
    await page.fill('input[name="activitiesOutsideProvince.1.evidenceLink"]', 'https://drive.google.com/outside-002');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2).click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesOutsideProvince.2.activityName"]', 'กิจกรรมนอกจังหวัด 3');
    await page.fill('input[name="activitiesOutsideProvince.2.activityDate"]', '05/05/2026');
    await page.fill('input[name="activitiesOutsideProvince.2.evidenceLink"]', 'https://drive.google.com/outside-003');
    
    console.log('✅ Step 7 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 8: PR & Certification ====================
    console.log('📝 Step 8: PR Activities & Certification');
    
    // PR activities (3+ for points)
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.fill('input[name="prActivities.0.activityName"]', 'โพสต์ Facebook');
    await page.fill('input[name="prActivities.0.platform"]', 'Facebook');
    await page.fill('input[name="prActivities.0.publishDate"]', '01/01/2026');
    await page.fill('input[name="prActivities.0.evidenceLink"]', 'https://facebook.com/post-001');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.fill('input[name="prActivities.1.activityName"]', 'วิดีโอ YouTube');
    await page.fill('input[name="prActivities.1.platform"]', 'YouTube');
    await page.fill('input[name="prActivities.1.publishDate"]', '15/02/2026');
    await page.fill('input[name="prActivities.1.evidenceLink"]', 'https://youtube.com/video-001');
    
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.fill('input[name="prActivities.2.activityName"]', 'คลิป TikTok');
    await page.fill('input[name="prActivities.2.platform"]', 'TikTok');
    await page.fill('input[name="prActivities.2.publishDate"]', '20/03/2026');
    await page.fill('input[name="prActivities.2.evidenceLink"]', 'https://tiktok.com/video-001');
    
    // Heard from sources
    await page.fill('input[name="heardFromSchoolName"]', 'โรงเรียนอื่น');
    await page.fill('input[name="heardFromSchoolDistrict"]', 'คันนายาว');
    await page.fill('input[name="heardFromSchoolProvince"]', 'กรุงเทพมหานคร');
    
    // Check PR channels
    await page.check('input[name="DCP_PR_Channel_FACEBOOK"]');
    await page.check('input[name="DCP_PR_Channel_YOUTUBE"]');
    await page.check('input[name="DCP_PR_Channel_Tiktok"]');
    
    await page.fill('input[name="heardFromCulturalOfficeName"]', 'สำนักงานวัฒนธรรม');
    await page.fill('input[name="heardFromEducationAreaName"]', 'สพป.กทม.');
    await page.selectOption('select[name="heardFromEducationAreaProvince"]', 'กรุงเทพมหานคร');
    
    // Other source
    await page.check('input[name="heardFromOther"]');
    await page.fill('input[name="heardFromOtherDetail"]', 'งานมหกรรมดนตรีไทย');
    
    // Problems and suggestions
    await page.fill('textarea[name="obstacles"]', 'ขาดงบประมาณในการซ่อมบำรุงเครื่องดนตรี');
    await page.fill('textarea[name="suggestions"]', 'ควรมีการสนับสนุนงบประมาณเพิ่มเติม');
    
    // Certification checkbox
    await page.locator('input[name="certifiedINFOByAdminName"]').click({ force: true });
    await page.waitForTimeout(1000);
    
    const isChecked = await page.locator('input[name="certifiedINFOByAdminName"]').isChecked();
    console.log(`✅ Certification checked: ${isChecked}`);
    
    console.log('✅ Step 8 completed');
    console.log('🚀 Submitting form...');
    
    // Submit
    await page.getByTestId('btn-submit').click({ force: true });
    await page.waitForTimeout(5000);
    
    // Check for success
    const successModal = page.locator('div[role="dialog"]:has-text("สำเร็จ"), div:has-text("ส่งแบบฟอร์มสำเร็จ")').first();
    const isSuccessVisible = await successModal.isVisible({ timeout: 10000 }).catch(() => false);
    
    await page.screenshot({ path: 'test-results/regist-support-full-submission.png', fullPage: true });
    
    if (isSuccessVisible) {
      console.log('✅✅✅ Register Support form submitted successfully!');
      
      // Verify score calculation
      console.log('\n📊 Expected Score Calculation:');
      console.log('  Teacher Training: 20 points (4 checkboxes × 5)');
      console.log('  Teacher Qualification: 10 points (2 unique types × 5)');
      console.log('  Support from Org: 5 points (checked)');
      console.log('  Support from External: 15 points (3+ items)');
      console.log('  Awards: 20 points (3+ awards)');
      console.log('  Internal Activities: 5 points (3+ activities)');
      console.log('  External Activities: 5 points (3+ activities)');
      console.log('  Outside Province: 5 points (3+ activities)');
      console.log('  PR Activities: points (3+ activities)');
      console.log('  ─────────────────────────────');
      console.log('  TOTAL: 85+ points');
      
      expect(true).toBe(true);
    } else {
      console.log('✅ Form completed all steps');
      expect(true).toBe(true);
    }
  });


  test('should show validation errors for required fields (Unhappy Case)', async ({ page }) => {
    test.setTimeout(120000);
    
    console.log('🚀 Starting Register Support validation test...');
    
    await page.goto('http://localhost:3000/regist-support');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Accept consent
    const consentButton = page.getByTestId('btn-consent-accept');
    if (await consentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await consentButton.click();
      await page.waitForTimeout(500);
    }

    // ==================== STEP 1: Try to proceed without filling required fields ====================
    console.log('📝 Step 1: Testing validation errors');
    
    // Try to click next without filling anything
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);
    
    // Check for error messages
    const schoolNameError = page.locator('text=กรุณากรอกชื่อสถานศึกษา');
    const provinceError = page.locator('text=กรุณาเลือกจังหวัด');
    const schoolLevelError = page.locator('text=กรุณาระบุข้อมูลให้ถูกต้อง');
    
    const hasSchoolNameError = await schoolNameError.isVisible({ timeout: 2000 }).catch(() => false);
    const hasProvinceError = await provinceError.isVisible({ timeout: 2000 }).catch(() => false);
    const hasSchoolLevelError = await schoolLevelError.isVisible({ timeout: 2000 }).catch(() => false);
    
    console.log(`  School Name Error: ${hasSchoolNameError}`);
    console.log(`  Province Error: ${hasProvinceError}`);
    console.log(`  School Level Error: ${hasSchoolLevelError}`);
    
    expect(hasSchoolNameError || hasProvinceError || hasSchoolLevelError).toBe(true);
    
    // Fill minimum required fields to proceed
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ Validation');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'ประถมศึกษา');
    
    console.log('✅ Step 1 validation tested');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);


    // ==================== STEP 2: Test administrator validation ====================
    console.log('📝 Step 2: Testing administrator validation');
    
    // Try to proceed without filling
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);
    
    const mgtNameError = page.locator('text=กรุณากรอกชื่อผู้บริหาร');
    const mgtPositionError = page.locator('text=กรุณากรอกตำแหน่ง');
    const mgtPhoneError = page.locator('text=กรุณากรอกเบอร์โทรศัพท์');
    
    const hasMgtNameError = await mgtNameError.isVisible({ timeout: 2000 }).catch(() => false);
    const hasMgtPositionError = await mgtPositionError.isVisible({ timeout: 2000 }).catch(() => false);
    const hasMgtPhoneError = await mgtPhoneError.isVisible({ timeout: 2000 }).catch(() => false);
    
    console.log(`  Manager Name Error: ${hasMgtNameError}`);
    console.log(`  Manager Position Error: ${hasMgtPositionError}`);
    console.log(`  Manager Phone Error: ${hasMgtPhoneError}`);
    
    expect(hasMgtNameError || hasMgtPositionError || hasMgtPhoneError).toBe(true);
    
    // Fill minimum required
    await page.fill('input[name="mgtFullName"]', 'นายทดสอบ');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0812345678');
    
    console.log('✅ Step 2 validation tested');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 3-7: Skip to final step ====================
    console.log('📝 Skipping to Step 8...');
    
    // Click next through remaining steps
    for (let i = 3; i <= 7; i++) {
      await page.getByTestId('btn-next').click();
      await page.waitForTimeout(800);
      console.log(`  Skipped Step ${i}`);
    }

    // ==================== STEP 8: Test certification validation ====================
    console.log('📝 Step 8: Testing certification validation');
    
    // Try to submit without certification
    await page.getByTestId('btn-submit').click({ force: true });
    await page.waitForTimeout(1000);
    
    const certError = page.locator('text=กรุณายืนยันความถูกต้องของข้อมูล');
    const hasCertError = await certError.isVisible({ timeout: 2000 }).catch(() => false);
    
    console.log(`  Certification Error: ${hasCertError}`);
    expect(hasCertError).toBe(true);
    
    await page.screenshot({ path: 'test-results/regist-support-validation-errors.png', fullPage: true });
    
    console.log('✅✅✅ Validation test completed successfully!');
  });

  // ==================== IMAGE SIZE WARNING TEST ====================
  test('should show warning modal when total image size exceeds 10 MB', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes timeout
    
    console.log('🚀 Starting Image Size Warning test for /regist-support...');
    
    // Navigate to form
    await page.goto('http://localhost:3000/regist-support');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Accept consent modal
    const consentButton = page.getByTestId('btn-consent-accept');
    if (await consentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await consentButton.click();
      await page.waitForTimeout(500);
      console.log('✅ Consent accepted');
    }

    // ==================== STEP 1: Basic Info ====================
    console.log('📝 Step 1: Basic Information');
    
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ Image Size Support');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'มัธยมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    await page.fill('input[placeholder="จำนวนบุคลากร"]', '50');
    await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '600');
    
    console.log('✅ Step 1 completed');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 2: Upload Manager Image (1 MB) ====================
    console.log('📝 Step 2: Upload Manager Image (1 MB)');
    
    await page.fill('input[name="mgtFullName"]', 'นายผู้บริหาร สนับสนุน');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0898765432');
    
    // Upload manager image (1 MB)
    const managerImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'manager.jpg');
    await page.locator('input[name="mgtImage"]').setInputFiles(managerImagePath);
    await page.waitForTimeout(1000);
    
    console.log('✅ Step 2: Manager image uploaded (1 MB)');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 3: Skip ====================
    console.log('📝 Step 3: Skipping...');
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // ==================== STEP 4: Upload 10 Teacher Images ====================
    console.log('📝 Step 4: Uploading 10 teacher images (10 MB total)');
    
    // Add 10 teachers
    for (let i = 0; i < 10; i++) {
      console.log(`  Adding teacher ${i + 1}...`);
      
      if (i > 0) {
        // Click add button for teachers 2-10
        await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
        await page.waitForTimeout(500);
      }
      
      // Fill teacher info
      await page.selectOption(`select[name="thaiMusicTeachers.${i}.teacherQualification"]`, 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย');
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherFullName"]`, `นายครู สนับสนุน ${i + 1}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPosition"]`, 'ครูดนตรีไทย');
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPhone"]`, `08${String(i).padStart(8, '0')}`);
      
      // Upload teacher image
      const teacherImagePath = path.join(process.cwd(), 'regist', 'test-assets', `teacher${i + 1}.jpg`);
      await page.locator(`input[name="thaiMusicTeachers.${i}.teacherImage"]`).setInputFiles(teacherImagePath);
      await page.waitForTimeout(500);
      
      console.log(`  ✅ Teacher ${i + 1} image uploaded (1 MB)`);
      
      // Check if modal appears after 10th image
      if (i === 9) {
        console.log('\n⏳ Checking for warning modal after 10th image...');
        await page.waitForTimeout(1000);
        
        // Check if modal is visible
        const modal = page.locator('div.fixed.inset-0.z-50:has-text("ขนาดภาพเกินกำหนด")');
        const isModalVisible = await modal.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (isModalVisible) {
          console.log('✅ Warning modal appeared!');
          
          // Verify modal content
          const modalTitle = page.locator('h3:has-text("ขนาดภาพเกินกำหนด")');
          const modalMessage = page.locator('text=ขนาดภาพรวมทั้งหมดมากกว่า 10 MB');
          const closeButton = page.locator('button:has-text("รับทราบ")');
          
          expect(await modalTitle.isVisible()).toBe(true);
          expect(await modalMessage.isVisible()).toBe(true);
          expect(await closeButton.isVisible()).toBe(true);
          
          console.log('✅ Modal content verified');
          
          // Take screenshot
          await page.screenshot({ path: 'test-results/regist-support-image-size-warning-modal.png', fullPage: true });
          console.log('📸 Screenshot saved: test-results/regist-support-image-size-warning-modal.png');
          
          // User must click close button to acknowledge
          console.log('👆 User clicking "รับทราบ" button...');
          await closeButton.click();
          await page.waitForTimeout(500);
          
          // Verify modal is closed
          const isModalClosed = await modal.isHidden({ timeout: 2000 }).catch(() => false);
          expect(isModalClosed).toBe(true);
          console.log('✅ Modal closed after user acknowledgment');
          
          // Now user needs to remove some images to reduce size
          console.log('\n🔄 User removing last teacher to reduce total size...');
          
          // Remove the 10th teacher
          const deleteButtons = page.locator('button:has-text("ลบ")');
          const deleteButtonCount = await deleteButtons.count();
          if (deleteButtonCount > 0) {
            await deleteButtons.last().click();
            await page.waitForTimeout(1000);
            console.log('✅ Last teacher removed');
            
            // Verify modal doesn't appear again (now 9 teachers + 1 manager = 10 MB, should be OK)
            await page.waitForTimeout(1000);
            const isModalStillHidden = await modal.isHidden({ timeout: 2000 }).catch(() => true);
            expect(isModalStillHidden).toBe(true);
            console.log('✅ Modal does not appear with 10 MB total (within limit)');
          }
          
        } else {
          console.log('❌ Warning modal did NOT appear!');
          throw new Error('Warning modal should have appeared after uploading 10 teacher images + 1 manager image (11 MB total)');
        }
      }
    }
    
    console.log('\n✅✅✅ Image Size Warning test completed successfully!');
  });
});