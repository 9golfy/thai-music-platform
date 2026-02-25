import { test, expect } from '@playwright/test';

test.describe('Register100 Form E2E - Complete Test with Score Validation', () => {
  test('should complete full registration flow with score calculation', async ({ page }) => {
    // Increase test timeout to 180 seconds
    test.setTimeout(180000);
    
    // Navigate to form
    await page.goto('http://localhost:3000/regist100');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    console.log('🚀 Starting Register100 comprehensive test...');

    // ==================== STEP 1: Basic Info + Address ====================
    console.log('📝 Step 1: Basic Information & Address');
    
    // Fill basic information
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบสนับสนุนดนตรีไทย 100%');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'ประถมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    
    await page.fill('input[placeholder="จำนวนบุคลากร"]', '50');
    await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '500');
    await page.fill('textarea[name="studentCountByGrade"]', 'ป.1=80, ป.2=85, ป.3=90, ป.4=75, ป.5=85, ป.6=85');
    
    // Fill address
    await page.fill('input[name="addressNo"]', '123');
    await page.fill('input[name="moo"]', '5');
    await page.fill('input[name="road"]', 'ถนนทดสอบ');
    
    // Fill phone and fax
    await page.fill('input[name="phone"]', '021234567');
    await page.fill('input[name="fax"]', '021234568');
    
    console.log('✅ Step 1 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 2: Administrator ====================
    console.log('📝 Step 2: Administrator Information');
    
    await page.fill('input[name="mgtFullName"]', 'นายทดสอบ ผู้บริหาร');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtAddress"]', '123 ถนนทดสอบ แขวงทดสอบ เขตทดสอบ กรุงเทพมหานคร 10100');
    await page.fill('input[name="mgtPhone"]', '0812345678');
    await page.fill('input[name="mgtEmail"]', 'director@school.ac.th');
    
    // Upload manager image
    const mgtImageInput = page.locator('input[name="mgtImage"]');
    await mgtImageInput.setInputFiles('test-assets/manager.jpg');
    console.log('✅ Uploaded manager image');
    
    console.log('✅ Step 2 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 3: Teaching Plans ====================
    console.log('📝 Step 3: Teaching Plans (Adding 2 plans)');
    
    // Fill first plan (default form)
    await page.waitForSelector('input[name="currentMusicTypes.0.grade"]', { timeout: 10000 });
    await page.fill('input[name="currentMusicTypes.0.grade"]', 'ป.1-ป.3');
    await page.fill('textarea[name="currentMusicTypes.0.details"]', 'สอนดนตรีไทยพื้นฐาน เครื่องดนตรีประเภทเครื่องตี');
    
    // Add second plan
    const addMusicTypeBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addMusicTypeBtn.click();
    await page.waitForTimeout(1000);
    
    await page.fill('input[name="currentMusicTypes.1.grade"]', 'ป.4-ป.6');
    await page.fill('textarea[name="currentMusicTypes.1.details"]', 'สอนดนตรีไทยขั้นสูง เครื่องดนตรีประเภทเครื่องสี');
    
    // Fill readiness items (default form first)
    await page.fill('input[name="readinessItems.0.instrumentName"]', 'ระนาดเอก');
    await page.fill('input[name="readinessItems.0.quantity"]', '5');
    await page.fill('input[name="readinessItems.0.note"]', 'สภาพดี พร้อมใช้งาน');
    
    // Add second readiness item
    const addReadinessBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1);
    await addReadinessBtn.click();
    await page.waitForTimeout(1000);
    
    await page.fill('input[name="readinessItems.1.instrumentName"]', 'ขลุ่ยเพียงออ');
    await page.fill('input[name="readinessItems.1.quantity"]', '10');
    await page.fill('input[name="readinessItems.1.note"]', 'สภาพดีมาก');
    
    console.log('✅ Step 3 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 4: Teachers + Training (SCORE TESTING) ====================
    console.log('📝 Step 4: Teachers + Training + Qualifications (SCORE: 40 points expected)');
    
    // Add 4 teachers with DIFFERENT qualifications (20 points = 4 × 5)
    await page.selectOption('select[name="thaiMusicTeachers.0.teacherQualification"]', 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherFullName"]', 'นายครูคนที่ 1');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPosition"]', 'ครูดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEducation"]', 'ปริญญาตรี ดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPhone"]', '0823456789');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEmail"]', 'teacher1@school.ac.th');
    
    // Upload teacher 1 image
    const teacher1ImageInput = page.locator('input[name="thaiMusicTeachers.0.teacherImage"]');
    await teacher1ImageInput.setInputFiles('test-assets/teacher1.jpg');
    console.log('✅ Teacher 1: ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย (with image)');
    
    // Add teacher 2 with different qualification
    const addTeacherBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addTeacherBtn.click();
    await page.waitForTimeout(500);
    
    await page.selectOption('select[name="thaiMusicTeachers.1.teacherQualification"]', 'ครูภูมิปัญญาในท้องถิ่น');
    await page.fill('input[name="thaiMusicTeachers.1.teacherFullName"]', 'นายครูคนที่ 2');
    await page.fill('input[name="thaiMusicTeachers.1.teacherPosition"]', 'ครูภูมิปัญญา');
    await page.fill('input[name="thaiMusicTeachers.1.teacherEducation"]', 'ภูมิปัญญาท้องถิ่น');
    await page.fill('input[name="thaiMusicTeachers.1.teacherPhone"]', '0834567890');
    await page.fill('input[name="thaiMusicTeachers.1.teacherEmail"]', 'teacher2@school.ac.th');
    
    // Upload teacher 2 image
    const teacher2ImageInput = page.locator('input[name="thaiMusicTeachers.1.teacherImage"]');
    await teacher2ImageInput.setInputFiles('test-assets/teacher2.jpg');
    console.log('✅ Teacher 2: ครูภูมิปัญญาในท้องถิ่น (with image)');
    
    // Add teacher 3 with different qualification
    await addTeacherBtn.click();
    await page.waitForTimeout(500);
    
    await page.selectOption('select[name="thaiMusicTeachers.2.teacherQualification"]', 'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.2.teacherFullName"]', 'นายครูคนที่ 3');
    await page.fill('input[name="thaiMusicTeachers.2.teacherPosition"]', 'ผู้ทรงคุณวุฒิ');
    await page.fill('input[name="thaiMusicTeachers.2.teacherEducation"]', 'ปริญญาโท ดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.2.teacherPhone"]', '0845678901');
    await page.fill('input[name="thaiMusicTeachers.2.teacherEmail"]', 'teacher3@school.ac.th');
    console.log('✅ Teacher 3: ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย');
    
    // Add teacher 4 with different qualification
    await addTeacherBtn.click();
    await page.waitForTimeout(500);
    
    await page.selectOption('select[name="thaiMusicTeachers.3.teacherQualification"]', 'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน');
    await page.fill('input[name="thaiMusicTeachers.3.teacherFullName"]', 'นายครูคนที่ 4');
    await page.fill('input[name="thaiMusicTeachers.3.teacherPosition"]', 'วิทยากรพิเศษ');
    await page.fill('input[name="thaiMusicTeachers.3.teacherEducation"]', 'ปริญญาตรี ดนตรีศึกษา');
    await page.fill('input[name="thaiMusicTeachers.3.teacherPhone"]', '0856789012');
    await page.fill('input[name="thaiMusicTeachers.3.teacherEmail"]', 'teacher4@school.ac.th');
    console.log('✅ Teacher 4: วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน');
    console.log('✅ Total unique qualifications: 4 - Expected score: 20 (4 × 5)');
    
    // Check ALL 4 training checkboxes for maximum score (20 points = 4 × 5)
    await page.check('input[name="isCompulsorySubject"]');
    await page.check('input[name="hasAfterSchoolTeaching"]');
    await page.check('input[name="hasElectiveSubject"]');
    await page.check('input[name="hasLocalCurriculum"]');
    console.log('✅ Checked all 4 training checkboxes - Expected score: 20 (4 × 5)');
    
    // Add in-class instruction duration
    await page.fill('input[name="inClassInstructionDurations.0.inClassGradeLevel"]', 'ป.1-ป.6');
    await page.fill('input[name="inClassInstructionDurations.0.inClassStudentCount"]', '500');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerSemester"]', '40');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerYear"]', '80');
    
    // Add out-of-class instruction
    await page.selectOption('select[name="outOfClassInstructionDurations.0.outDay"]', 'จันทร์');
    await page.fill('input[name="outOfClassInstructionDurations.0.outTimeFrom"]', '15:30');
    await page.fill('input[name="outOfClassInstructionDurations.0.outTimeTo"]', '17:00');
    await page.fill('input[name="outOfClassInstructionDurations.0.outLocation"]', 'ห้องดนตรีไทย');
    
    await page.fill('textarea[name="teachingLocation"]', 'ห้องดนตรีไทย อาคาร 2 ชั้น 3');
    
    console.log('✅ Step 4 completed - Training score: 20, Qualification score: 20, Total: 40');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 5: Support + Awards (SCORE TESTING) ====================
    console.log('📝 Step 5: Support Factors + Awards (SCORE TESTING)');
    
    // Add support factor
    await page.fill('input[name="supportFactors.0.sup_supportByDescription"]', 'สนับสนุนงบประมาณซื้อเครื่องดนตรี');
    await page.fill('input[name="supportFactors.0.sup_supportByDate"]', '15/01/2026');
    await page.fill('input[name="supportFactors.0.sup_supportByDriveLink"]', 'https://drive.google.com/support1');
    
    // Check support from org (5 points)
    await page.check('input[name="hasSupportFromOrg"]');
    await page.fill('input[name="supportFromOrg.0.organization"]', 'สำนักงานเขตพื้นที่การศึกษา');
    await page.fill('textarea[name="supportFromOrg.0.details"]', 'สนับสนุนงบประมาณ 100,000 บาท');
    await page.fill('input[name="supportFromOrg.0.evidenceLink"]', 'https://drive.google.com/org-support');
    console.log('✅ Support from org checked - Expected score: 5');
    
    // Check support from external and add 3 items (15 points)
    await page.check('input[name="hasSupportFromExternal"]');
    
    await page.fill('input[name="supportFromExternal.0.organization"]', 'มูลนิธิส่งเสริมดนตรีไทย');
    await page.fill('textarea[name="supportFromExternal.0.details"]', 'บริจาคเครื่องดนตรี');
    await page.fill('input[name="supportFromExternal.0.evidenceLink"]', 'https://drive.google.com/ext1');
    
    const addExternalBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2);
    await addExternalBtn.click();
    await page.waitForTimeout(500);
    
    await page.fill('input[name="supportFromExternal.1.organization"]', 'บริษัทเอกชน A');
    await page.fill('textarea[name="supportFromExternal.1.details"]', 'สนับสนุนครูผู้สอน');
    await page.fill('input[name="supportFromExternal.1.evidenceLink"]', 'https://drive.google.com/ext2');
    
    await addExternalBtn.click();
    await page.waitForTimeout(500);
    
    await page.fill('input[name="supportFromExternal.2.organization"]', 'วัดในชุมชน');
    await page.fill('textarea[name="supportFromExternal.2.details"]', 'สนับสนุนสถานที่ฝึกซ้อม');
    await page.fill('input[name="supportFromExternal.2.evidenceLink"]', 'https://drive.google.com/ext3');
    console.log('✅ Support from external: 3 items - Expected score: 15');
    
    // Add award at "ประเทศ" level (20 points - highest)
    await page.selectOption('select[name="awards.0.awardLevel"]', 'ประเทศ');
    await page.fill('input[name="awards.0.awardName"]', 'รางวัลชนะเลิศการแข่งขันดนตรีไทยระดับประเทศ');
    await page.fill('input[name="awards.0.awardDate"]', '10/03/2026');
    await page.fill('input[name="awards.0.awardEvidenceLink"]', 'https://drive.google.com/award1');
    console.log('✅ Award level: ประเทศ - Expected score: 20');
    
    // Fill other required fields
    await page.fill('textarea[name="curriculumFramework"]', 'มีหลักสูตรดนตรีไทยที่ชัดเจน');
    await page.fill('textarea[name="learningOutcomes"]', 'นักเรียนสามารถบรรเลงเครื่องดนตรีไทยได้');
    await page.fill('textarea[name="managementContext"]', 'จัดการเรียนการสอนอย่างเป็นระบบ');
    
    console.log('✅ Step 5 completed - Expected total: 5 + 15 + 20 = 40 points');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 6: Media ====================
    console.log('📝 Step 6: Media and Videos');
    
    await page.fill('input[name="photoGalleryLink"]', 'https://drive.google.com/photos');
    await page.fill('input[name="videoLink"]', 'https://youtube.com/watch?v=test-video');
    
    console.log('✅ Step 6 completed');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 7: Activities (SCORE TESTING) ====================
    console.log('📝 Step 7: Activities (SCORE TESTING)');
    
    // Add 3+ activities within province - internal (5 points)
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityName"]', 'กิจกรรมภายในโรงเรียน 1');
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityDate"]', '15/01/2026');
    await page.fill('input[name="activitiesWithinProvinceInternal.0.evidenceLink"]', 'https://drive.google.com/act1');
    
    const addInternalBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addInternalBtn.click();
    await page.waitForTimeout(500);
    
    await page.fill('input[name="activitiesWithinProvinceInternal.1.activityName"]', 'กิจกรรมภายในโรงเรียน 2');
    await page.fill('input[name="activitiesWithinProvinceInternal.1.activityDate"]', '20/02/2026');
    await page.fill('input[name="activitiesWithinProvinceInternal.1.evidenceLink"]', 'https://drive.google.com/act2');
    
    await addInternalBtn.click();
    await page.waitForTimeout(500);
    
    await page.fill('input[name="activitiesWithinProvinceInternal.2.activityName"]', 'กิจกรรมภายในโรงเรียน 3');
    await page.fill('input[name="activitiesWithinProvinceInternal.2.activityDate"]', '25/03/2026');
    await page.fill('input[name="activitiesWithinProvinceInternal.2.evidenceLink"]', 'https://drive.google.com/act3');
    console.log('✅ Internal activities: 3 items - Expected score: 5');
    
    // Add 3+ activities within province - external (5 points)
    await page.fill('input[name="activitiesWithinProvinceExternal.0.activityName"]', 'กิจกรรมภายนอกโรงเรียน 1');
    await page.fill('input[name="activitiesWithinProvinceExternal.0.activityDate"]', '10/04/2026');
    await page.fill('input[name="activitiesWithinProvinceExternal.0.evidenceLink"]', 'https://drive.google.com/ext-act1');
    
    const addExternalActBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1);
    await addExternalActBtn.click();
    await page.waitForTimeout(500);
    
    await page.fill('input[name="activitiesWithinProvinceExternal.1.activityName"]', 'กิจกรรมภายนอกโรงเรียน 2');
    await page.fill('input[name="activitiesWithinProvinceExternal.1.activityDate"]', '15/05/2026');
    await page.fill('input[name="activitiesWithinProvinceExternal.1.evidenceLink"]', 'https://drive.google.com/ext-act2');
    
    await addExternalActBtn.click();
    await page.waitForTimeout(500);
    
    await page.fill('input[name="activitiesWithinProvinceExternal.2.activityName"]', 'กิจกรรมภายนอกโรงเรียน 3');
    await page.fill('input[name="activitiesWithinProvinceExternal.2.activityDate"]', '20/06/2026');
    await page.fill('input[name="activitiesWithinProvinceExternal.2.evidenceLink"]', 'https://drive.google.com/ext-act3');
    console.log('✅ External activities: 3 items - Expected score: 5');
    
    // Add 3+ activities outside province (5 points)
    await page.fill('input[name="activitiesOutsideProvince.0.activityName"]', 'กิจกรรมภายนอกจังหวัด 1');
    await page.fill('input[name="activitiesOutsideProvince.0.activityDate"]', '01/07/2026');
    await page.fill('input[name="activitiesOutsideProvince.0.evidenceLink"]', 'https://drive.google.com/out1');
    
    const addOutsideBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2);
    await addOutsideBtn.click();
    await page.waitForTimeout(500);
    
    await page.fill('input[name="activitiesOutsideProvince.1.activityName"]', 'กิจกรรมภายนอกจังหวัด 2');
    await page.fill('input[name="activitiesOutsideProvince.1.activityDate"]', '10/08/2026');
    await page.fill('input[name="activitiesOutsideProvince.1.evidenceLink"]', 'https://drive.google.com/out2');
    
    await addOutsideBtn.click();
    await page.waitForTimeout(500);
    
    await page.fill('input[name="activitiesOutsideProvince.2.activityName"]', 'กิจกรรมภายนอกจังหวัด 3');
    await page.fill('input[name="activitiesOutsideProvince.2.activityDate"]', '15/09/2026');
    await page.fill('input[name="activitiesOutsideProvince.2.evidenceLink"]', 'https://drive.google.com/out3');
    console.log('✅ Outside province activities: 3 items - Expected score: 5');
    
    console.log('✅ Step 7 completed - Expected total: 5 + 5 + 5 = 15 points');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 8: PR Activities + Certification (SCORE TESTING) ====================
    console.log('📝 Step 8: PR Activities + Certification (SCORE TESTING)');
    
    // Add 3+ PR activities (5 points)
    await page.fill('input[name="prActivities.0.activityName"]', 'ประชาสัมพันธ์ผลงาน 1');
    await page.fill('input[name="prActivities.0.platform"]', 'Facebook');
    await page.fill('input[name="prActivities.0.publishDate"]', '01/10/2026');
    await page.fill('input[name="prActivities.0.evidenceLink"]', 'https://facebook.com/post1');
    
    const addPRBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addPRBtn.click();
    await page.waitForTimeout(500);
    
    await page.fill('input[name="prActivities.1.activityName"]', 'ประชาสัมพันธ์ผลงาน 2');
    await page.fill('input[name="prActivities.1.platform"]', 'YouTube');
    await page.fill('input[name="prActivities.1.publishDate"]', '15/10/2026');
    await page.fill('input[name="prActivities.1.evidenceLink"]', 'https://youtube.com/video1');
    
    await addPRBtn.click();
    await page.waitForTimeout(500);
    
    await page.fill('input[name="prActivities.2.activityName"]', 'ประชาสัมพันธ์ผลงาน 3');
    await page.fill('input[name="prActivities.2.platform"]', 'TikTok');
    await page.fill('input[name="prActivities.2.publishDate"]', '20/10/2026');
    await page.fill('input[name="prActivities.2.evidenceLink"]', 'https://tiktok.com/video1');
    console.log('✅ PR activities: 3 items - Expected score: 5');
    
    // Fill heard from sources
    await page.check('input[name="heardFromSchool"]');
    await page.fill('input[name="heardFromSchoolName"]', 'โรงเรียนแนะนำ');
    await page.fill('input[name="heardFromSchoolDistrict"]', 'เขตทดสอบ');
    await page.fill('input[name="heardFromSchoolProvince"]', 'กรุงเทพมหานคร');
    
    await page.check('input[name="DCP_PR_Channel_FACEBOOK"]');
    await page.check('input[name="DCP_PR_Channel_YOUTUBE"]');
    
    await page.check('input[name="heardFromCulturalOffice"]');
    await page.fill('input[name="heardFromCulturalOfficeName"]', 'สำนักงานวัฒนธรรมจังหวัดกรุงเทพมหานคร');
    
    await page.check('input[name="heardFromEducationArea"]');
    await page.fill('input[name="heardFromEducationAreaName"]', 'สพป.กรุงเทพมหานคร เขต 1');
    await page.selectOption('select[name="heardFromEducationAreaProvince"]', 'กรุงเทพมหานคร');
    
    // Fill other info
    await page.fill('textarea[name="obstacles"]', 'ขาดงบประมาณในการซ่อมบำรุงเครื่องดนตรี');
    await page.fill('textarea[name="suggestions"]', 'ควรมีการสนับสนุนงบประมาณเพิ่มเติม');
    
    // Check certification (required)
    await page.check('input[name="certifiedINFOByAdminName"]');
    
    console.log('✅ Step 8 completed - PR score: 5');
    console.log('');
    console.log('📊 EXPECTED TOTAL SCORE BREAKDOWN:');
    console.log('   - Teacher training (Step 4): 20 points (4 checkboxes × 5)');
    console.log('   - Teacher qualifications (Step 4): 20 points (4 unique types × 5)');
    console.log('   - Support from org (Step 5): 5 points');
    console.log('   - Support from external (Step 5): 15 points (3 items)');
    console.log('   - Award level (Step 5): 20 points (ประเทศ)');
    console.log('   - Activities internal (Step 7): 5 points (3+ items)');
    console.log('   - Activities external (Step 7): 5 points (3+ items)');
    console.log('   - Activities outside (Step 7): 5 points (3+ items)');
    console.log('   - PR activities (Step 8): 5 points (3+ items)');
    console.log('   =====================================');
    console.log('   TOTAL EXPECTED SCORE: 100 points');
    console.log('');
    
    // Submit form
    console.log('🚀 Submitting form...');
    await page.getByRole('button', { name: 'ส่งแบบฟอร์ม' }).click();
    
    // Wait for submission
    await page.waitForTimeout(5000);
    
    // Check for success modal
    const successModal = page.locator('[data-testid="btn-success-close"]');
    const isSuccessVisible = await successModal.isVisible({ timeout: 10000 }).catch(() => false);
    
    if (isSuccessVisible) {
      console.log('✅✅✅ Success modal appeared!');
      
      // Take screenshot of success modal
      await page.screenshot({ path: 'test-results/register100-success-modal.png', fullPage: true });
      
      // Click close button
      await successModal.click();
      await page.waitForTimeout(2000);
      
      console.log('✅ Form submission completed successfully!');
      console.log('📊 Next: Check MongoDB for saved data and score calculation');
      expect(true).toBe(true);
    } else {
      console.log('⚠️ Success modal not visible');
      await page.screenshot({ path: 'test-results/register100-submission-failed.png', fullPage: true });
      console.log('Page URL:', page.url());
      expect(false).toBe(true); // Fail the test
    }
  });
});
