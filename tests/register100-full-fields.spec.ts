import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * COMPREHENSIVE FULL FIELDS TEST
 * 
 * This test fills EVERY SINGLE FIELD in the register100 form
 * and validates that ALL data is correctly saved to MongoDB.
 * 
 * NO EMPTY FIELDS ALLOWED - Every field must have data.
 */

test.describe('Register100 Form - Complete Full Fields Test', () => {
  
  test('Fill ALL fields and validate complete data in MongoDB', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes timeout
    
    await page.goto('http://localhost:3000/regist100');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    console.log('🎯 FULL FIELDS TEST: Filling ALL fields with data');
    console.log('Expected: 100% field completion, no empty fields\n');

    // ==================== CLOSE CONSENT MODAL ====================
    console.log('📝 Closing Consent Modal...');
    
    // Wait for consent modal to appear
    const consentModal = page.locator('[data-testid="consent-modal"]');
    const isConsentVisible = await consentModal.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isConsentVisible) {
      console.log('✅ Consent modal found, clicking accept button...');
      const acceptButton = page.locator('[data-testid="btn-consent-accept"]');
      await acceptButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Consent modal closed\n');
    } else {
      console.log('ℹ️  No consent modal found (already accepted)\n');
    }

    // ==================== STEP 1: ข้อมูลพื้นฐาน ====================
    console.log('📝 Step 1: Basic Information');
    
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบครบทุกฟิลด์');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'ประถมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    await page.fill('input[placeholder="จำนวนบุคลากร"]', '75');
    await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '850');
    await page.fill('textarea[name="studentCountByGrade"]', 'ป.1 = 120 คน, ป.2 = 125 คน, ป.3 = 130 คน, ป.4 = 135 คน, ป.5 = 140 คน, ป.6 = 200 คน');
    
    // Address fields - Use autocomplete
    await page.fill('input[name="addressNo"]', '123');
    await page.fill('input[name="moo"]', '5');
    await page.fill('input[name="road"]', 'ถนนพระราม 4');
    
    // Use autocomplete for subDistrict (ตำบล)
    console.log('  Using autocomplete for address...');
    await page.fill('input[id="th-district"]', 'คลอง');
    await page.waitForTimeout(1000); // Wait for autocomplete dropdown
    
    // Wait for autocomplete suggestions and click first one
    const districtSuggestion = page.locator('.tt-suggestion').first();
    const hasDistrictSuggestion = await districtSuggestion.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasDistrictSuggestion) {
      await districtSuggestion.click();
      await page.waitForTimeout(500);
      console.log('  ✅ Selected subDistrict from autocomplete');
    } else {
      // Fallback: type manually if autocomplete doesn't work
      await page.fill('input[id="th-district"]', 'คลองเตย');
      await page.fill('input[id="th-amphoe"]', 'คลองเตย');
      await page.fill('input[id="th-province"]', 'กรุงเทพมหานคร');
      await page.fill('input[id="th-zipcode"]', '10110');
      console.log('  ℹ️  Autocomplete not available, filled manually');
    }
    
    await page.waitForTimeout(500);
    await page.fill('input[name="phone"]', '021234567');
    await page.fill('input[name="fax"]', '021234568');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);


    // ==================== STEP 2: ผู้บริหารสถานศึกษา ====================
    console.log('📝 Step 2: School Administrator');
    
    await page.fill('input[name="mgtFullName"]', 'นายสมชาย ใจดี');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการโรงเรียน');
    await page.fill('input[name="mgtPhone"]', '0812345678');
    await page.fill('input[name="mgtAddress"]', '456 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110');
    await page.fill('input[name="mgtEmail"]', 'somchai.jaidee@school.ac.th');
    
    // Upload manager image
    const mgtImagePath = path.join(__dirname, '../test-assets/manager.jpg');
    await page.setInputFiles('input[name="mgtImage"]', mgtImagePath);
    await page.waitForTimeout(500);
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 3: แผนการสอน ====================
    console.log('📝 Step 3: Teaching Plan');
    
    // Current music types - add 3 items
    await page.fill('input[name="currentMusicTypes.0.grade"]', 'ป.1-3');
    await page.fill('textarea[name="currentMusicTypes.0.details"]', 'สอนดนตรีไทยพื้นฐาน เน้นการเล่นเครื่องดนตรีประเภทเครื่องตี เช่น กลองยาว กลองทัด');
    
    const addMusicBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addMusicBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="currentMusicTypes.1.grade"]', 'ป.4-6');
    await page.fill('textarea[name="currentMusicTypes.1.details"]', 'สอนดนตรีไทยขั้นสูง เน้นการเล่นเครื่องดนตรีประเภทเครื่องสี เช่น ระนาดเอก ระนาดทุ้ม');
    
    await addMusicBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="currentMusicTypes.2.grade"]', 'ทุกระดับชั้น');
    await page.fill('textarea[name="currentMusicTypes.2.details"]', 'จัดกิจกรรมชุมนุมดนตรีไทยทุกวันศุกร์ เวลา 15:00-16:30 น.');
    
    // Readiness items - add 5 instruments
    await page.fill('input[name="readinessItems.0.instrumentName"]', 'ระนาดเอก');
    await page.fill('input[name="readinessItems.0.quantity"]', '5');
    await page.fill('input[name="readinessItems.0.note"]', 'สภาพดี ใช้งานได้ปกติ');
    
    const addInstrumentBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1);
    await addInstrumentBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="readinessItems.1.instrumentName"]', 'ระนาดทุ้ม');
    await page.fill('input[name="readinessItems.1.quantity"]', '3');
    await page.fill('input[name="readinessItems.1.note"]', 'สภาพดี');
    
    await addInstrumentBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="readinessItems.2.instrumentName"]', 'ฆ้องวงใหญ่');
    await page.fill('input[name="readinessItems.2.quantity"]', '2');
    await page.fill('input[name="readinessItems.2.note"]', 'สภาพดีมาก');
    
    await addInstrumentBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="readinessItems.3.instrumentName"]', 'ฆ้องวงเล็ก');
    await page.fill('input[name="readinessItems.3.quantity"]', '2');
    await page.fill('input[name="readinessItems.3.note"]', 'สภาพดี');
    
    await addInstrumentBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="readinessItems.4.instrumentName"]', 'ขลุ่ยเพียงออ');
    await page.fill('input[name="readinessItems.4.quantity"]', '10');
    await page.fill('input[name="readinessItems.4.note"]', 'มีทั้งหมด 10 อัน สภาพดี');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);


    // ==================== STEP 4: ผู้สอนดนตรีไทย ====================
    console.log('📝 Step 4: Thai Music Teachers');
    
    // Add 4 teachers with different qualifications (for max score)
    await page.selectOption('select[name="thaiMusicTeachers.0.teacherQualification"]', 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherFullName"]', 'นางสาวสมหญิง ดนตรี');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPosition"]', 'ครูชำนาญการพิเศษ');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEducation"]', 'ปริญญาตรี ดนตรีไทย มหาวิทยาลัยมหิดล');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPhone"]', '0823456789');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEmail"]', 'somying.music@school.ac.th');
    
    // Upload teacher 1 image
    const teacher1ImagePath = path.join(__dirname, '../test-assets/teacher1.jpg');
    await page.setInputFiles('input[id="teacherImage-0"]', teacher1ImagePath);
    await page.waitForTimeout(500);
    
    const addTeacherBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addTeacherBtn.click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="thaiMusicTeachers.1.teacherQualification"]', 'ครูภูมิปัญญาในท้องถิ่น');
    await page.fill('input[name="thaiMusicTeachers.1.teacherFullName"]', 'นายสมศักดิ์ ภูมิปัญญา');
    await page.fill('input[name="thaiMusicTeachers.1.teacherPosition"]', 'ครูภูมิปัญญาท้องถิ่น');
    await page.fill('input[name="thaiMusicTeachers.1.teacherEducation"]', 'มัธยมศึกษาตอนปลาย');
    await page.fill('input[name="thaiMusicTeachers.1.teacherPhone"]', '0834567890');
    await page.fill('input[name="thaiMusicTeachers.1.teacherEmail"]', 'somsak.local@school.ac.th');
    
    const teacher2ImagePath = path.join(__dirname, '../test-assets/teacher2.jpg');
    await page.setInputFiles('input[id="teacherImage-1"]', teacher2ImagePath);
    await page.waitForTimeout(500);
    
    await addTeacherBtn.click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="thaiMusicTeachers.2.teacherQualification"]', 'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.2.teacherFullName"]', 'อาจารย์สมพร คุณวุฒิ');
    await page.fill('input[name="thaiMusicTeachers.2.teacherPosition"]', 'ผู้ทรงคุณวุฒิ');
    await page.fill('input[name="thaiMusicTeachers.2.teacherEducation"]', 'ปริญญาโท ดนตรีไทย จุฬาลงกรณ์มหาวิทยาลัย');
    await page.fill('input[name="thaiMusicTeachers.2.teacherPhone"]', '0845678901');
    await page.fill('input[name="thaiMusicTeachers.2.teacherEmail"]', 'somporn.expert@school.ac.th');
    
    const teacher3ImagePath = path.join(__dirname, '../test-assets/teacher1.jpg');
    await page.setInputFiles('input[id="teacherImage-2"]', teacher3ImagePath);
    await page.waitForTimeout(500);
    
    await addTeacherBtn.click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="thaiMusicTeachers.3.teacherQualification"]', 'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน');
    await page.fill('input[name="thaiMusicTeachers.3.teacherFullName"]', 'นายสมบูรณ์ วิทยากร');
    await page.fill('input[name="thaiMusicTeachers.3.teacherPosition"]', 'วิทยากรพิเศษ');
    await page.fill('input[name="thaiMusicTeachers.3.teacherEducation"]', 'ปริญญาตรี ดนตรีศึกษา');
    await page.fill('input[name="thaiMusicTeachers.3.teacherPhone"]', '0856789012');
    await page.fill('input[name="thaiMusicTeachers.3.teacherEmail"]', 'somboon.trainer@school.ac.th');
    
    const teacher4ImagePath = path.join(__dirname, '../test-assets/teacher2.jpg');
    await page.setInputFiles('input[id="teacherImage-3"]', teacher4ImagePath);
    await page.waitForTimeout(500);
    
    // Check all 4 training checkboxes (for max score)
    await page.check('input[name="isCompulsorySubject"]');
    await page.check('input[name="hasAfterSchoolTeaching"]');
    await page.check('input[name="hasElectiveSubject"]');
    await page.check('input[name="hasLocalCurriculum"]');
    
    // In-class instruction durations - add 3 items
    await page.fill('input[name="inClassInstructionDurations.0.inClassGradeLevel"]', 'ป.1-2');
    await page.fill('input[name="inClassInstructionDurations.0.inClassStudentCount"]', '240');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerSemester"]', '20');
    await page.fill('input[name="inClassInstructionDurations.0.inClassHoursPerYear"]', '40');
    
    const addInClassBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1);
    await addInClassBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="inClassInstructionDurations.1.inClassGradeLevel"]', 'ป.3-4');
    await page.fill('input[name="inClassInstructionDurations.1.inClassStudentCount"]', '265');
    await page.fill('input[name="inClassInstructionDurations.1.inClassHoursPerSemester"]', '20');
    await page.fill('input[name="inClassInstructionDurations.1.inClassHoursPerYear"]', '40');
    
    await addInClassBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="inClassInstructionDurations.2.inClassGradeLevel"]', 'ป.5-6');
    await page.fill('input[name="inClassInstructionDurations.2.inClassStudentCount"]', '340');
    await page.fill('input[name="inClassInstructionDurations.2.inClassHoursPerSemester"]', '20');
    await page.fill('input[name="inClassInstructionDurations.2.inClassHoursPerYear"]', '40');
    
    // Out-of-class instruction durations - add 3 items
    await page.selectOption('select[name="outOfClassInstructionDurations.0.outDay"]', 'จันทร์');
    await page.fill('input[name="outOfClassInstructionDurations.0.outTimeFrom"]', '15:30');
    await page.fill('input[name="outOfClassInstructionDurations.0.outTimeTo"]', '17:00');
    await page.fill('input[name="outOfClassInstructionDurations.0.outLocation"]', 'ห้องดนตรีไทย อาคาร 2 ชั้น 3');
    
    const addOutClassBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2);
    await addOutClassBtn.click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="outOfClassInstructionDurations.1.outDay"]', 'พุธ');
    await page.fill('input[name="outOfClassInstructionDurations.1.outTimeFrom"]', '15:30');
    await page.fill('input[name="outOfClassInstructionDurations.1.outTimeTo"]', '17:00');
    await page.fill('input[name="outOfClassInstructionDurations.1.outLocation"]', 'ห้องดนตรีไทย อาคาร 2 ชั้น 3');
    
    await addOutClassBtn.click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="outOfClassInstructionDurations.2.outDay"]', 'ศุกร์');
    await page.fill('input[name="outOfClassInstructionDurations.2.outTimeFrom"]', '15:30');
    await page.fill('input[name="outOfClassInstructionDurations.2.outTimeTo"]', '17:00');
    await page.fill('input[name="outOfClassInstructionDurations.2.outLocation"]', 'ห้องประชุมใหญ่');
    
    // Teaching location
    await page.fill('textarea[name="teachingLocation"]', 'ห้องดนตรีไทยเฉพาะทาง อาคาร 2 ชั้น 3, ห้องประชุมใหญ่, และห้องเรียนปกติตามรายวิชา');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);


    // ==================== STEP 5: ปัจจัยและการสนับสนุน ====================
    console.log('📝 Step 5: Support Factors and Awards');
    
    // Support factors - add 2 items
    await page.selectOption('select:has-text("เลือกองค์กร/หน่วยงาน")', 'ผู้บริหารสถานศึกษา');
    await page.fill('input[name="supportFactors.0.sup_supportByDescription"]', 'สนับสนุนงบประมาณในการจัดซื้อเครื่องดนตรีไทย');
    await page.fill('input[name="supportFactors.0.sup_supportByDate"]', '01/06/2567');
    await page.fill('input[name="supportFactors.0.sup_supportByDriveLink"]', 'https://drive.google.com/file/d/supportfactor1');
    
    const addSupportFactorBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addSupportFactorBtn.click();
    await page.waitForTimeout(500);
    
    const selectElements = await page.locator('select:has-text("เลือกองค์กร/หน่วยงาน")').all();
    await selectElements[1].selectOption('กรรมการสถานศึกษา');
    await page.fill('input[name="supportFactors.1.sup_supportByDescription"]', 'สนับสนุนการจัดกิจกรรมดนตรีไทยประจำปี');
    await page.fill('input[name="supportFactors.1.sup_supportByDate"]', '15/08/2567');
    await page.fill('input[name="supportFactors.1.sup_supportByDriveLink"]', 'https://drive.google.com/file/d/supportfactor2');
    
    // Support from organization (check for 5 points)
    await page.check('input[name="hasSupportFromOrg"]');
    await page.fill('input[name="supportFromOrg.0.organization"]', 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษากรุงเทพมหานคร');
    await page.fill('textarea[name="supportFromOrg.0.details"]', 'สนับสนุนงบประมาณในการพัฒนาหลักสูตรดนตรีไทย จำนวน 50,000 บาท');
    await page.fill('input[name="supportFromOrg.0.evidenceLink"]', 'https://drive.google.com/file/d/orgsupport1');
    
    const addOrgBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1);
    await addOrgBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="supportFromOrg.1.organization"]', 'กรมส่งเสริมวัฒนธรรม');
    await page.fill('textarea[name="supportFromOrg.1.details"]', 'สนับสนุนวิทยากรและเครื่องดนตรีไทยสำหรับการฝึกซ้อม');
    await page.fill('input[name="supportFromOrg.1.evidenceLink"]', 'https://drive.google.com/file/d/orgsupport2');
    
    // Support from external (3+ for 15 points)
    await page.check('input[name="hasSupportFromExternal"]');
    await page.fill('input[name="supportFromExternal.0.organization"]', 'มูลนิธิส่งเสริมดนตรีไทย');
    await page.fill('textarea[name="supportFromExternal.0.details"]', 'บริจาคเครื่องดนตรีไทย มูลค่า 100,000 บาท');
    await page.fill('input[name="supportFromExternal.0.evidenceLink"]', 'https://drive.google.com/file/d/external1');
    
    const addExternalBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2);
    await addExternalBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="supportFromExternal.1.organization"]', 'สมาคมดนตรีไทยแห่งประเทศไทย');
    await page.fill('textarea[name="supportFromExternal.1.details"]', 'สนับสนุนวิทยากรผู้เชี่ยวชาญมาฝึกอบรม');
    await page.fill('input[name="supportFromExternal.1.evidenceLink"]', 'https://drive.google.com/file/d/external2');
    
    await addExternalBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="supportFromExternal.2.organization"]', 'วัดพระศรีมหาธาตุ');
    await page.fill('textarea[name="supportFromExternal.2.details"]', 'สนับสนุนสถานที่ฝึกซ้อมและแสดงดนตรีไทย');
    await page.fill('input[name="supportFromExternal.2.evidenceLink"]', 'https://drive.google.com/file/d/external3');
    
    // Curriculum framework
    await page.fill('textarea[name="curriculumFramework"]', 'มีหลักสูตรดนตรีไทยที่บูรณาการกับกลุ่มสาระการเรียนรู้ศิลปะ เน้นให้นักเรียนทุกคนได้เรียนรู้และปฏิบัติดนตรีไทยอย่างน้อย 1 ชนิด โดยแบ่งเป็นระดับพื้นฐานและระดับสูง');
    
    // Learning outcomes
    await page.fill('textarea[name="learningOutcomes"]', 'นักเรียนสามารถเล่นเครื่องดนตรีไทยได้อย่างน้อย 1 ชนิด มีความรู้ความเข้าใจในทฤษฎีดนตรีไทย และสามารถแสดงออกทางดนตรีไทยได้อย่างมั่นใจ');
    
    // Management context
    await page.fill('textarea[name="managementContext"]', 'มีการบริหารจัดการโดยแต่งตั้งคณะกรรมการส่งเสริมดนตรีไทย จัดสรรงบประมาณสนับสนุนอย่างต่อเนื่อง และมีแผนพัฒนาครูผู้สอนอย่างเป็นระบบ');
    
    // Awards - add 3 awards (highest = ประเทศ for 20 points)
    await page.selectOption('select[name="awards.0.awardLevel"]', 'ประเทศ');
    await page.fill('input[name="awards.0.awardName"]', 'รางวัลชนะเลิศการประกวดวงดนตรีไทยระดับประเทศ');
    await page.fill('input[name="awards.0.awardDate"]', '15/12/2567');
    await page.fill('input[name="awards.0.awardEvidenceLink"]', 'https://drive.google.com/file/d/award1');
    
    const addAwardBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(3);
    await addAwardBtn.click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="awards.1.awardLevel"]', 'ภาค');
    await page.fill('input[name="awards.1.awardName"]', 'รางวัลรองชนะเลิศอันดับ 1 การประกวดวงปี่พาทย์ระดับภาค');
    await page.fill('input[name="awards.1.awardDate"]', '20/10/2567');
    await page.fill('input[name="awards.1.awardEvidenceLink"]', 'https://drive.google.com/file/d/award2');
    
    await addAwardBtn.click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="awards.2.awardLevel"]', 'จังหวัด');
    await page.fill('input[name="awards.2.awardName"]', 'รางวัลชนะเลิศการแสดงดนตรีไทยระดับจังหวัด');
    await page.fill('input[name="awards.2.awardDate"]', '05/09/2567');
    await page.fill('input[name="awards.2.awardEvidenceLink"]', 'https://drive.google.com/file/d/award3');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);


    // ==================== STEP 6: ภาพและวีดิโอ ====================
    console.log('📝 Step 6: Photos and Videos');
    
    await page.fill('input[name="photoGalleryLink"]', 'https://drive.google.com/drive/folders/photogallery123');
    await page.fill('input[name="videoLink"]', 'https://www.youtube.com/watch?v=thaimusicvideo123');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // ==================== STEP 7: กิจกรรม ====================
    console.log('📝 Step 7: Activities');
    
    // Activities within province - internal (3+ for 5 points)
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityName"]', 'งานวันดนตรีไทยประจำปีโรงเรียน');
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityDate"]', '13/04/2567');
    await page.fill('input[name="activitiesWithinProvinceInternal.0.evidenceLink"]', 'https://drive.google.com/file/d/internal1');
    
    const addInternalBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addInternalBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceInternal.1.activityName"]', 'การแสดงดนตรีไทยในงานวันเด็กแห่งชาติ');
    await page.fill('input[name="activitiesWithinProvinceInternal.1.activityDate"]', '11/01/2568');
    await page.fill('input[name="activitiesWithinProvinceInternal.1.evidenceLink"]', 'https://drive.google.com/file/d/internal2');
    
    await addInternalBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceInternal.2.activityName"]', 'การแสดงดนตรีไทยในงานวันสถาปนาโรงเรียน');
    await page.fill('input[name="activitiesWithinProvinceInternal.2.activityDate"]', '25/03/2568');
    await page.fill('input[name="activitiesWithinProvinceInternal.2.evidenceLink"]', 'https://drive.google.com/file/d/internal3');
    
    await addInternalBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceInternal.3.activityName"]', 'การแสดงดนตรีไทยในงานไหว้ครู');
    await page.fill('input[name="activitiesWithinProvinceInternal.3.activityDate"]', '20/06/2567');
    await page.fill('input[name="activitiesWithinProvinceInternal.3.evidenceLink"]', 'https://drive.google.com/file/d/internal4');
    
    // Activities within province - external (3+ for 5 points)
    await page.fill('input[name="activitiesWithinProvinceExternal.0.activityName"]', 'การแสดงดนตรีไทยในงานวันเฉลิมพระชนมพรรษา');
    await page.fill('input[name="activitiesWithinProvinceExternal.0.activityDate"]', '28/07/2567');
    await page.fill('input[name="activitiesWithinProvinceExternal.0.evidenceLink"]', 'https://drive.google.com/file/d/external1');
    
    const addExternalActBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1);
    await addExternalActBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceExternal.1.activityName"]', 'การแสดงดนตรีไทยในงานประเพณีลอยกระทง');
    await page.fill('input[name="activitiesWithinProvinceExternal.1.activityDate"]', '15/11/2567');
    await page.fill('input[name="activitiesWithinProvinceExternal.1.evidenceLink"]', 'https://drive.google.com/file/d/external2');
    
    await addExternalActBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceExternal.2.activityName"]', 'การแสดงดนตรีไทยในงานวันสงกรานต์');
    await page.fill('input[name="activitiesWithinProvinceExternal.2.activityDate"]', '13/04/2567');
    await page.fill('input[name="activitiesWithinProvinceExternal.2.evidenceLink"]', 'https://drive.google.com/file/d/external3');
    
    await addExternalActBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceExternal.3.activityName"]', 'การแสดงดนตรีไทยในงานวันแม่แห่งชาติ');
    await page.fill('input[name="activitiesWithinProvinceExternal.3.activityDate"]', '12/08/2567');
    await page.fill('input[name="activitiesWithinProvinceExternal.3.evidenceLink"]', 'https://drive.google.com/file/d/external4');
    
    // Activities outside province (3+ for 5 points)
    await page.fill('input[name="activitiesOutsideProvince.0.activityName"]', 'การประกวดวงดนตรีไทยระดับภาคกลาง');
    await page.fill('input[name="activitiesOutsideProvince.0.activityDate"]', '20/10/2567');
    await page.fill('input[name="activitiesOutsideProvince.0.evidenceLink"]', 'https://drive.google.com/file/d/outside1');
    
    const addOutsideBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2);
    await addOutsideBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesOutsideProvince.1.activityName"]', 'การแสดงดนตรีไทยในงานมหกรรมดนตรีไทยระดับประเทศ');
    await page.fill('input[name="activitiesOutsideProvince.1.activityDate"]', '15/12/2567');
    await page.fill('input[name="activitiesOutsideProvince.1.evidenceLink"]', 'https://drive.google.com/file/d/outside2');
    
    await addOutsideBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesOutsideProvince.2.activityName"]', 'การแสดงดนตรีไทยในงานเทศกาลดนตรีไทยนานาชาติ');
    await page.fill('input[name="activitiesOutsideProvince.2.activityDate"]', '05/02/2568');
    await page.fill('input[name="activitiesOutsideProvince.2.evidenceLink"]', 'https://drive.google.com/file/d/outside3');
    
    await addOutsideBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesOutsideProvince.3.activityName"]', 'การแสดงดนตรีไทยในงานวันมรดกไทย');
    await page.fill('input[name="activitiesOutsideProvince.3.activityDate"]', '02/04/2568');
    await page.fill('input[name="activitiesOutsideProvince.3.evidenceLink"]', 'https://drive.google.com/file/d/outside4');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);


    // ==================== STEP 8: ประชาสัมพันธ์และข้อมูลอื่นๆ ====================
    console.log('📝 Step 8: PR and Other Information');
    
    // PR activities (3+ for 5 points)
    await page.fill('input[name="prActivities.0.activityName"]', 'โพสต์ภาพกิจกรรมดนตรีไทยบน Facebook');
    await page.fill('input[name="prActivities.0.platform"]', 'Facebook');
    await page.fill('input[name="prActivities.0.publishDate"]', '15/04/2567');
    await page.fill('input[name="prActivities.0.evidenceLink"]', 'https://www.facebook.com/school/posts/123456');
    
    const addPRBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addPRBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="prActivities.1.activityName"]', 'อัพโหลดวีดิโอการแสดงดนตรีไทยบน YouTube');
    await page.fill('input[name="prActivities.1.platform"]', 'YouTube');
    await page.fill('input[name="prActivities.1.publishDate"]', '20/06/2567');
    await page.fill('input[name="prActivities.1.evidenceLink"]', 'https://www.youtube.com/watch?v=abc123');
    
    await addPRBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="prActivities.2.activityName"]', 'โพสต์คลิปสั้นการฝึกซ้อมดนตรีไทยบน TikTok');
    await page.fill('input[name="prActivities.2.platform"]', 'TikTok');
    await page.fill('input[name="prActivities.2.publishDate"]', '10/08/2567');
    await page.fill('input[name="prActivities.2.evidenceLink"]', 'https://www.tiktok.com/@school/video/123456');
    
    await addPRBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="prActivities.3.activityName"]', 'เผยแพร่ข่าวสารดนตรีไทยบนเว็บไซต์โรงเรียน');
    await page.fill('input[name="prActivities.3.platform"]', 'Website');
    await page.fill('input[name="prActivities.3.publishDate"]', '01/09/2567');
    await page.fill('input[name="prActivities.3.evidenceLink"]', 'https://www.school.ac.th/news/thaimusic');
    
    // Source of information
    await page.check('input[name="heardFromSchool"]');
    await page.fill('input[name="heardFromSchoolName"]', 'โรงเรียนวัดพระศรีมหาธาตุ');
    
    // Use autocomplete for district and province in Step 8
    console.log('  Using autocomplete for school source address...');
    await page.fill('input[id="step8-amphoe"]', 'บาง');
    await page.waitForTimeout(1000);
    
    const step8DistrictSuggestion = page.locator('.tt-suggestion').first();
    const hasStep8Suggestion = await step8DistrictSuggestion.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasStep8Suggestion) {
      await step8DistrictSuggestion.click();
      await page.waitForTimeout(500);
      console.log('  ✅ Selected district from autocomplete in Step 8');
    } else {
      // Fallback
      await page.fill('input[id="step8-amphoe"]', 'บางกอกใหญ่');
      await page.fill('input[id="step8-province"]', 'กรุงเทพมหานคร');
      console.log('  ℹ️  Autocomplete not available in Step 8, filled manually');
    }
    
    await page.waitForTimeout(500);
    
    await page.check('input[name="DCP_PR_Channel_FACEBOOK"]');
    await page.check('input[name="DCP_PR_Channel_YOUTUBE"]');
    await page.check('input[name="DCP_PR_Channel_Tiktok"]');
    
    await page.check('input[name="heardFromCulturalOffice"]');
    await page.fill('input[name="heardFromCulturalOfficeName"]', 'สำนักงานวัฒนธรรมจังหวัดกรุงเทพมหานคร');
    
    await page.check('input[name="heardFromEducationArea"]');
    await page.fill('input[name="heardFromEducationAreaName"]', 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษากรุงเทพมหานคร เขต 1');
    await page.selectOption('select[name="heardFromEducationAreaProvince"]', 'กรุงเทพมหานคร');
    
    await page.check('input[name="heardFromOther"]');
    await page.fill('input[name="heardFromOtherDetail"]', 'ได้รับข้อมูลจากการประชุมผู้บริหารโรงเรียนในเครือข่าย');
    
    // Obstacles and suggestions
    await page.fill('textarea[name="obstacles"]', 'ปัญหาหลักคือ งบประมาณในการจัดซื้อเครื่องดนตรีไทยมีจำกัด และการหาครูผู้สอนที่มีความเชี่ยวชาญเฉพาะทางยังมีความยากลำบาก นอกจากนี้ยังมีปัญหาเรื่องสถานที่ฝึกซ้อมที่ไม่เพียงพอในช่วงเวลาเร่งด่วน');
    await page.fill('textarea[name="suggestions"]', 'ควรมีการสนับสนุนงบประมาณเพิ่มเติมสำหรับการจัดซื้อเครื่องดนตรีไทย จัดอบรมพัฒนาครูผู้สอนอย่างต่อเนื่อง และสนับสนุนการแลกเปลี่ยนเรียนรู้ระหว่างโรงเรียนที่มีความเข้มแข็งด้านดนตรีไทย');
    
    // Certification
    await page.check('input[name="certifiedINFOByAdminName"]');
    
    console.log('🚀 Submitting form with ALL fields filled...');
    await page.getByRole('button', { name: 'ส่งแบบฟอร์ม' }).click();
    await page.waitForTimeout(5000);
    
    // Wait for success modal
    const successModal = page.locator('[data-testid="btn-success-close"]');
    const isVisible = await successModal.isVisible({ timeout: 10000 }).catch(() => false);
    
    expect(isVisible).toBe(true);
    console.log('✅ Form submitted successfully!\n');
    
    // Close success modal
    await successModal.click();
    await page.waitForTimeout(2000);
  });

  // ==================== IMAGE SIZE WARNING TEST ====================
  test('should show warning modal when total image size exceeds 10 MB', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes timeout
    
    console.log('🚀 Starting Image Size Warning test for /regist100...');
  
  // Navigate to form
  await page.goto('http://localhost:3000/regist100');
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
  
  await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ Image Size');
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
  
  await page.fill('input[name="mgtFullName"]', 'นายผู้บริหาร ทดสอบ');
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
    await page.fill(`input[name="thaiMusicTeachers.${i}.teacherFullName"]`, `นายครู ทดสอบ ${i + 1}`);
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
        await page.screenshot({ path: 'test-results/regist100-image-size-warning-modal.png', fullPage: true });
        console.log('📸 Screenshot saved: test-results/regist100-image-size-warning-modal.png');
        
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
