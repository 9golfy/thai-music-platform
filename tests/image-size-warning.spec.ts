import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Image Size Warning Modal - regist100', () => {
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
          await page.screenshot({ path: 'test-results/image-size-warning-modal.png', fullPage: true });
          console.log('📸 Screenshot saved: test-results/image-size-warning-modal.png');
          
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

test.describe('Image Size Warning Modal - regist-support', () => {
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
          await page.screenshot({ path: 'test-results/image-size-warning-modal-support.png', fullPage: true });
          console.log('📸 Screenshot saved: test-results/image-size-warning-modal-support.png');
          
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
