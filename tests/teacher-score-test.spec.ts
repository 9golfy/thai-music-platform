import { test, expect } from '@playwright/test';
import path from 'path';
import { MongoClient } from 'mongodb';

// Helper function to fill basic info (Step 1)
async function fillStep1(page: any) {
  await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบคะแนนครู');
  await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
  await page.selectOption('select[name="schoolLevel"]', 'ประถมศึกษา');
  await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
  await page.fill('input[placeholder="จำนวนบุคลากร"]', '50');
  await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '500');
  await page.fill('input[name="addressNo"]', '123');
  await page.fill('input[name="subDistrict"]', 'สีกัน');
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  await page.fill('input[name="phone"]', '021234567');
  await page.getByTestId('btn-next').click();
  await page.waitForTimeout(1000);
}

// Helper function to fill Step 2 (Administrator)
async function fillStep2(page: any) {
  await page.fill('input[name="mgtFullName"]', 'นายผู้บริหาร ทดสอบ');
  await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
  await page.fill('input[name="mgtPhone"]', '0812345678');
  await page.fill('input[name="mgtEmail"]', 'admin@test.ac.th');
  
  const managerImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'manager.jpg');
  await page.locator('input[name="mgtImage"]').setInputFiles(managerImagePath);
  await page.waitForTimeout(500);
  
  await page.getByTestId('btn-next').click();
  await page.waitForTimeout(1000);
}

// Helper function to skip remaining steps
async function skipRemainingSteps(page: any) {
  // Step 4
  await page.getByTestId('btn-next').click();
  await page.waitForTimeout(1000);
  
  // Step 5
  await page.getByTestId('btn-next').click();
  await page.waitForTimeout(1000);
  
  // Step 6
  await page.getByTestId('btn-next').click();
  await page.waitForTimeout(1000);
  
  // Step 7
  await page.locator('input[name="certifiedINFOByAdminName"]').click({ force: true });
  await page.waitForTimeout(500);
}

test.describe('Teacher Score Calculation Tests', () => {
  
  // Test รอบที่ 1: 1 ครู = 5 คะแนน
  test('Case 1: 1 teacher with option1 should give score = 5', async ({ page }) => {
    test.setTimeout(120000);
    
    console.log('🧪 Test Case 1: 1 Teacher = 5 Points');
    
    // Listen for console messages
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('🚀') || text.includes('❌') || text.includes('✅') || text.includes('📋')) {
        console.log('  📝 Browser:', text);
      }
    });
    
    await page.goto('http://localhost:3000/regist100');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Accept consent
    const consentButton = page.getByTestId('btn-consent-accept');
    if (await consentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await consentButton.click();
      await page.waitForTimeout(500);
    }

    // Step 1
    console.log('  Step 1: Basic Info');
    await fillStep1(page);

    // Step 2
    console.log('  Step 2: Administrator');
    await fillStep2(page);

    // Step 3: Add 1 teacher with option1
    console.log('  Step 3: Adding 1 teacher with option1');
    await page.selectOption('select[name="thaiMusicTeachers.0.teacherQualification"]', 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย');
    await page.waitForTimeout(2000); // Wait longer for score calculation
    
    // Check console logs
    console.log('  Checking browser console for calculation logs...');
    
    await page.fill('input[name="thaiMusicTeachers.0.teacherFullName"]', 'นายครู คนที่หนึ่ง');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPosition"]', 'ครูดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEducation"]', 'ปริญญาตรี ดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPhone"]', '0811111111');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEmail"]', 'teacher1@test.ac.th');
    
    const teacher1ImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'teacher1.jpg');
    await page.locator('input[name="thaiMusicTeachers.0.teacherImage"]').setInputFiles(teacher1ImagePath);
    await page.waitForTimeout(500);
    
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // Skip remaining steps and submit
    console.log('  Skipping to Step 7 and submitting...');
    await skipRemainingSteps(page);
    
    console.log('  Clicking submit button...');
    await page.getByTestId('btn-submit').click({ force: true });
    
    // Wait for success modal to appear
    console.log('  Waiting for success modal...');
    
    // Try multiple selectors to find the modal
    const successHeading = page.locator('h2:has-text("สำเร็จ!")');
    const successText = page.locator('text=ระบบได้รับข้อมูลของท่านเรียบร้อยแล้ว');
    
    try {
      // Wait for either the heading or text to be visible
      await Promise.race([
        successHeading.waitFor({ state: 'visible', timeout: 15000 }),
        successText.waitFor({ state: 'visible', timeout: 15000 })
      ]);
      
      console.log('  ✅ Success modal appeared!');
      
      // Take screenshot while modal is visible
      await page.screenshot({ path: 'test-results/case1-success-modal.png', fullPage: true });
      
      console.log(`  ✅ Case 1 completed - Submitted: true`);
    } catch (error) {
      console.log('  ❌ Success modal did not appear within 15 seconds');
      await page.screenshot({ path: 'test-results/case1-no-modal.png', fullPage: true });
      throw new Error('Success modal not found');
    }
    
    // Verify score in database
    const mongoClient = new MongoClient('mongodb://localhost:27017');
    await mongoClient.connect();
    const db = mongoClient.db('thai_music_school');
    const collection = db.collection('register100_submissions');
    
    const submission = await collection.findOne(
      { schoolName: 'โรงเรียนทดสอบคะแนนครู' },
      { sort: { _id: -1 } }
    );
    
    console.log(`  ✅ Database teacher_score: ${submission?.teacher_score}`);
    expect(submission?.teacher_score).toBe(5);
    
    await mongoClient.close();
  });

  // Test รอบที่ 2: 4 ครู = 20 คะแนน
  test('Case 2: 4 teachers with all options should give score = 20', async ({ page }) => {
    test.setTimeout(120000);
    
    console.log('🧪 Test Case 2: 4 Teachers = 20 Points');
    
    await page.goto('http://localhost:3000/regist100');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Accept consent
    const consentButton = page.getByTestId('btn-consent-accept');
    if (await consentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await consentButton.click();
      await page.waitForTimeout(500);
    }

    // Step 1
    console.log('  Step 1: Basic Info');
    await fillStep1(page);

    // Step 2
    console.log('  Step 2: Administrator');
    await fillStep2(page);

    // Step 3: Add 4 teachers
    console.log('  Step 3: Adding 4 teachers with different options');
    
    // Teacher 1 - Option 1
    await page.selectOption('select[name="thaiMusicTeachers.0.teacherQualification"]', 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherFullName"]', 'นายครู คนที่หนึ่ง');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPosition"]', 'ครูดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEducation"]', 'ปริญญาตรี ดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPhone"]', '0811111111');
    await page.fill('input[name="thaiMusicTeachers.0.teacherEmail"]', 'teacher1@test.ac.th');
    
    const teacher1ImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'teacher1.jpg');
    await page.locator('input[name="thaiMusicTeachers.0.teacherImage"]').setInputFiles(teacher1ImagePath);
    await page.waitForTimeout(500);
    
    // Add Teacher 2 - Option 2
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="thaiMusicTeachers.1.teacherQualification"]', 'ครูภูมิปัญญาในท้องถิ่น');
    await page.fill('input[name="thaiMusicTeachers.1.teacherFullName"]', 'นายครู คนที่สอง');
    await page.fill('input[name="thaiMusicTeachers.1.teacherPosition"]', 'ครูภูมิปัญญา');
    await page.fill('input[name="thaiMusicTeachers.1.teacherEducation"]', 'ประสบการณ์ 20 ปี');
    await page.fill('input[name="thaiMusicTeachers.1.teacherPhone"]', '0822222222');
    await page.fill('input[name="thaiMusicTeachers.1.teacherEmail"]', 'teacher2@test.ac.th');
    
    const teacher2ImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'teacher2.jpg');
    await page.locator('input[name="thaiMusicTeachers.1.teacherImage"]').setInputFiles(teacher2ImagePath);
    await page.waitForTimeout(500);
    
    // Add Teacher 3 - Option 3
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="thaiMusicTeachers.2.teacherQualification"]', 'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.2.teacherFullName"]', 'นายครู คนที่สาม');
    await page.fill('input[name="thaiMusicTeachers.2.teacherPosition"]', 'ผู้ทรงคุณวุฒิ');
    await page.fill('input[name="thaiMusicTeachers.2.teacherEducation"]', 'ปริญญาเอก ดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.2.teacherPhone"]', '0833333333');
    await page.fill('input[name="thaiMusicTeachers.2.teacherEmail"]', 'teacher3@test.ac.th');
    
    await page.locator('input[name="thaiMusicTeachers.2.teacherImage"]').setInputFiles(teacher1ImagePath);
    await page.waitForTimeout(500);
    
    // Add Teacher 4 - Option 4
    await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="thaiMusicTeachers.3.teacherQualification"]', 'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน');
    await page.fill('input[name="thaiMusicTeachers.3.teacherFullName"]', 'นายครู คนที่สี่');
    await page.fill('input[name="thaiMusicTeachers.3.teacherPosition"]', 'วิทยากรพิเศษ');
    await page.fill('input[name="thaiMusicTeachers.3.teacherEducation"]', 'ปริญญาโท ดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.3.teacherPhone"]', '0844444444');
    await page.fill('input[name="thaiMusicTeachers.3.teacherEmail"]', 'teacher4@test.ac.th');
    
    await page.locator('input[name="thaiMusicTeachers.3.teacherImage"]').setInputFiles(teacher2ImagePath);
    await page.waitForTimeout(1000);
    
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // Skip remaining steps and submit
    console.log('  Skipping to Step 7 and submitting...');
    await skipRemainingSteps(page);
    
    console.log('  Clicking submit button...');
    await page.getByTestId('btn-submit').click({ force: true });
    
    // Wait for success modal to appear
    console.log('  Waiting for success modal...');
    
    // Try multiple selectors to find the modal
    const successHeading = page.locator('h2:has-text("สำเร็จ!")');
    const successText = page.locator('text=ระบบได้รับข้อมูลของท่านเรียบร้อยแล้ว');
    
    try {
      // Wait for either the heading or text to be visible
      await Promise.race([
        successHeading.waitFor({ state: 'visible', timeout: 15000 }),
        successText.waitFor({ state: 'visible', timeout: 15000 })
      ]);
      
      console.log('  ✅ Success modal appeared!');
      
      // Take screenshot while modal is visible
      await page.screenshot({ path: 'test-results/case2-success-modal.png', fullPage: true });
      
      console.log(`  ✅ Case 2 completed - Submitted: true`);
    } catch (error) {
      console.log('  ❌ Success modal did not appear within 15 seconds');
      await page.screenshot({ path: 'test-results/case2-no-modal.png', fullPage: true });
      throw new Error('Success modal not found');
    }
    
    // Verify score in database
    const mongoClient = new MongoClient('mongodb://localhost:27017');
    await mongoClient.connect();
    const db = mongoClient.db('thai_music_school');
    const collection = db.collection('register100_submissions');
    
    const submission = await collection.findOne(
      { schoolName: 'โรงเรียนทดสอบคะแนนครู' },
      { sort: { _id: -1 } }
    );
    
    console.log(`  ✅ Database teacher_score: ${submission?.teacher_score}`);
    expect(submission?.teacher_score).toBe(20);
    
    await mongoClient.close();
  });

  // Test รอบที่ 3: 4 ครู + พยายามเพิ่มคนที่ 5 (ควรมีข้อความเตือน)
  test('Case 3: 4 teachers + try to add 5th should show warning', async ({ page }) => {
    test.setTimeout(120000);
    
    console.log('🧪 Test Case 3: 4 Teachers + Try to Add 5th = Warning');
    
    await page.goto('http://localhost:3000/regist100');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Accept consent
    const consentButton = page.getByTestId('btn-consent-accept');
    if (await consentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await consentButton.click();
      await page.waitForTimeout(500);
    }

    // Step 1
    console.log('  Step 1: Basic Info');
    await fillStep1(page);

    // Step 2
    console.log('  Step 2: Administrator');
    await fillStep2(page);

    // Step 3: Add 4 teachers
    console.log('  Step 3: Adding 4 teachers');
    
    // Teacher 1
    await page.selectOption('select[name="thaiMusicTeachers.0.teacherQualification"]', 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherFullName"]', 'นายครู คนที่หนึ่ง');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPosition"]', 'ครูดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherPhone"]', '0811111111');
    
    const teacher1ImagePath = path.join(process.cwd(), 'regist', 'test-assets', 'teacher1.jpg');
    await page.locator('input[name="thaiMusicTeachers.0.teacherImage"]').setInputFiles(teacher1ImagePath);
    await page.waitForTimeout(500);
    
    // Add Teachers 2, 3, 4
    for (let i = 1; i < 4; i++) {
      await page.locator('button:has-text("+ เพิ่มข้อมูล")').first().click();
      await page.waitForTimeout(500);
      await page.selectOption(`select[name="thaiMusicTeachers.${i}.teacherQualification"]`, 'ครูภูมิปัญญาในท้องถิ่น');
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherFullName"]`, `นายครู คนที่${i + 1}`);
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPosition"]`, 'ครู');
      await page.fill(`input[name="thaiMusicTeachers.${i}.teacherPhone"]`, `08${i}${i}${i}${i}${i}${i}${i}${i}`);
      
      const imagePath = i % 2 === 0 ? teacher1ImagePath : path.join(process.cwd(), 'regist', 'test-assets', 'teacher2.jpg');
      await page.locator(`input[name="thaiMusicTeachers.${i}.teacherImage"]`).setInputFiles(imagePath);
      await page.waitForTimeout(500);
    }
    
    await page.waitForTimeout(1000);
    
    // Verify button is disabled
    const addButton = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    const isDisabled = await addButton.isDisabled();
    console.log(`  ✅ Add button disabled: ${isDisabled}`);
    expect(isDisabled).toBe(true);
    
    // Verify warning message is visible
    const warningMessage = page.getByTestId('max-teachers-warning');
    const isWarningVisible = await warningMessage.isVisible();
    const warningText = await warningMessage.textContent();
    console.log(`  ✅ Warning visible: ${isWarningVisible}, Text: "${warningText}"`);
    expect(isWarningVisible).toBe(true);
    expect(warningText).toContain('เลือกได้ไม่เกิน 4 คน');
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/case3-max-teachers-warning.png', fullPage: true });
    
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(1000);

    // Skip remaining steps and submit
    console.log('  Skipping to Step 7 and submitting...');
    await skipRemainingSteps(page);
    
    console.log('  Clicking submit button...');
    await page.getByTestId('btn-submit').click({ force: true });
    
    // Wait for success modal to appear
    console.log('  Waiting for success modal...');
    
    const successHeading = page.locator('h2:has-text("สำเร็จ!")');
    const successText = page.locator('text=ระบบได้รับข้อมูลของท่านเรียบร้อยแล้ว');
    
    try {
      await Promise.race([
        successHeading.waitFor({ state: 'visible', timeout: 15000 }),
        successText.waitFor({ state: 'visible', timeout: 15000 })
      ]);
      
      console.log('  ✅ Success modal appeared!');
      await page.screenshot({ path: 'test-results/case3-success-modal.png', fullPage: true });
      console.log(`  ✅ Case 3 completed - Warning shown, Submitted: true`);
    } catch (error) {
      console.log('  ❌ Success modal did not appear within 15 seconds');
      await page.screenshot({ path: 'test-results/case3-no-modal.png', fullPage: true });
      throw new Error('Success modal not found');
    }
    
    // Verify score in database
    const mongoClient = new MongoClient('mongodb://localhost:27017');
    await mongoClient.connect();
    const db = mongoClient.db('thai_music_school');
    const collection = db.collection('register100_submissions');
    
    const submission = await collection.findOne(
      { schoolName: 'โรงเรียนทดสอบคะแนนครู' },
      { sort: { _id: -1 } }
    );
    
    console.log(`  ✅ Database teacher_score: ${submission?.teacher_score}`);
    expect(submission?.teacher_score).toBe(20);
    
    await mongoClient.close();
  });
});
