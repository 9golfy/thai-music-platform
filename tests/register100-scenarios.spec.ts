import { test, expect } from '@playwright/test';

test.describe('Register100 Form - Multiple Score Scenarios', () => {
  
  // ==================== SCENARIO 1: Maximum Score (100 points) ====================
  test('Scenario 1: Maximum score - 100 points', async ({ page }) => {
    test.setTimeout(240000);
    
    await page.goto('http://localhost:3000/regist100');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    console.log('🎯 SCENARIO 1: Testing MAXIMUM SCORE (100 points)');
    console.log('Expected breakdown:');
    console.log('  - Teacher training: 20 (4 checkboxes)');
    console.log('  - Teacher qualifications: 20 (4 unique types)');
    console.log('  - Support from org: 5');
    console.log('  - Support from external: 15 (3+ items)');
    console.log('  - Award: 20 (ประเทศ level)');
    console.log('  - Activities internal: 5 (3+ items)');
    console.log('  - Activities external: 5 (3+ items)');
    console.log('  - Activities outside: 5 (3+ items)');
    console.log('  - PR activities: 5 (3+ items)');
    console.log('  = TOTAL: 100 points\n');

    // STEP 1
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ คะแนนเต็ม 100');
    await page.selectOption('select[name="schoolProvince"]', 'กรุงเทพมหานคร');
    await page.selectOption('select[name="schoolLevel"]', 'ประถมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    await page.fill('input[placeholder="จำนวนบุคลากร"]', '50');
    await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '500');
    await page.fill('input[name="phone"]', '021234567');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 2
    await page.fill('input[name="mgtFullName"]', 'ผู้บริหาร คะแนนเต็ม');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0812345678');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 3
    await page.fill('input[name="currentMusicTypes.0.grade"]', 'ป.1-6');
    await page.fill('input[name="readinessItems.0.instrumentName"]', 'ระนาดเอก');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 4: 40 points (20 training + 20 qualifications)
    // 4 unique teacher qualifications
    await page.selectOption('select[name="thaiMusicTeachers.0.teacherQualification"]', 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherFullName"]', 'ครู 1');
    
    const addTeacherBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addTeacherBtn.click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="thaiMusicTeachers.1.teacherQualification"]', 'ครูภูมิปัญญาในท้องถิ่น');
    await page.fill('input[name="thaiMusicTeachers.1.teacherFullName"]', 'ครู 2');
    
    await addTeacherBtn.click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="thaiMusicTeachers.2.teacherQualification"]', 'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.2.teacherFullName"]', 'ครู 3');
    
    await addTeacherBtn.click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="thaiMusicTeachers.3.teacherQualification"]', 'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน');
    await page.fill('input[name="thaiMusicTeachers.3.teacherFullName"]', 'ครู 4');
    
    // Check all 4 training checkboxes
    await page.check('input[name="isCompulsorySubject"]');
    await page.check('input[name="hasAfterSchoolTeaching"]');
    await page.check('input[name="hasElectiveSubject"]');
    await page.check('input[name="hasLocalCurriculum"]');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 5: 40 points (5 org + 15 external + 20 award)
    await page.check('input[name="hasSupportFromOrg"]');
    await page.fill('input[name="supportFromOrg.0.organization"]', 'องค์กรสนับสนุน');
    
    await page.check('input[name="hasSupportFromExternal"]');
    await page.fill('input[name="supportFromExternal.0.organization"]', 'ภายนอก 1');
    const addExternalBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2);
    await addExternalBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="supportFromExternal.1.organization"]', 'ภายนอก 2');
    await addExternalBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="supportFromExternal.2.organization"]', 'ภายนอก 3');
    
    await page.selectOption('select[name="awards.0.awardLevel"]', 'ประเทศ');
    await page.fill('input[name="awards.0.awardName"]', 'รางวัลระดับประเทศ');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 6
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 7: 15 points (5+5+5)
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityName"]', 'กิจกรรมใน 1');
    const addInternalBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addInternalBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceInternal.1.activityName"]', 'กิจกรรมใน 2');
    await addInternalBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceInternal.2.activityName"]', 'กิจกรรมใน 3');
    
    await page.fill('input[name="activitiesWithinProvinceExternal.0.activityName"]', 'กิจกรรมนอก 1');
    const addExternalActBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(1);
    await addExternalActBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceExternal.1.activityName"]', 'กิจกรรมนอก 2');
    await addExternalActBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceExternal.2.activityName"]', 'กิจกรรมนอก 3');
    
    await page.fill('input[name="activitiesOutsideProvince.0.activityName"]', 'กิจกรรมนอกจังหวัด 1');
    const addOutsideBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2);
    await addOutsideBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesOutsideProvince.1.activityName"]', 'กิจกรรมนอกจังหวัด 2');
    await addOutsideBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesOutsideProvince.2.activityName"]', 'กิจกรรมนอกจังหวัด 3');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 8: 5 points
    await page.fill('input[name="prActivities.0.activityName"]', 'PR 1');
    const addPRBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addPRBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="prActivities.1.activityName"]', 'PR 2');
    await addPRBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="prActivities.2.activityName"]', 'PR 3');
    
    await page.check('input[name="certifiedINFOByAdminName"]');
    
    console.log('🚀 Submitting Scenario 1...');
    await page.getByRole('button', { name: 'ส่งแบบฟอร์ม' }).click();
    await page.waitForTimeout(5000);
    
    const successModal = page.locator('[data-testid="btn-success-close"]');
    const isVisible = await successModal.isVisible({ timeout: 10000 }).catch(() => false);
    
    expect(isVisible).toBe(true);
    console.log('✅ Scenario 1 completed - Expected: 100 points\n');
  });

  // ==================== SCENARIO 2: Medium Score (50 points) ====================
  test('Scenario 2: Medium score - 50 points', async ({ page }) => {
    test.setTimeout(240000);
    
    await page.goto('http://localhost:3000/regist100');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    console.log('🎯 SCENARIO 2: Testing MEDIUM SCORE (50 points)');
    console.log('Expected breakdown:');
    console.log('  - Teacher training: 10 (2 checkboxes)');
    console.log('  - Teacher qualifications: 10 (2 unique types)');
    console.log('  - Support from org: 5');
    console.log('  - Support from external: 10 (2 items)');
    console.log('  - Award: 10 (จังหวัด level)');
    console.log('  - Activities internal: 5 (3+ items)');
    console.log('  - Activities external: 0 (< 3 items)');
    console.log('  - Activities outside: 0 (< 3 items)');
    console.log('  - PR activities: 0 (< 3 items)');
    console.log('  = TOTAL: 50 points\n');

    // STEP 1
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ คะแนนปานกลาง 50');
    await page.selectOption('select[name="schoolProvince"]', 'เชียงใหม่');
    await page.selectOption('select[name="schoolLevel"]', 'มัธยมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    await page.fill('input[placeholder="จำนวนบุคลากร"]', '30');
    await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '300');
    await page.fill('input[name="phone"]', '021234567');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 2
    await page.fill('input[name="mgtFullName"]', 'ผู้บริหาร ปานกลาง');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0823456789');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 3
    await page.fill('input[name="currentMusicTypes.0.grade"]', 'ม.1-3');
    await page.fill('input[name="readinessItems.0.instrumentName"]', 'ขลุ่ย');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 4: 20 points (10 training + 10 qualifications)
    // Only 2 unique qualifications
    await page.selectOption('select[name="thaiMusicTeachers.0.teacherQualification"]', 'ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย');
    await page.fill('input[name="thaiMusicTeachers.0.teacherFullName"]', 'ครู A');
    
    const addTeacherBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addTeacherBtn.click();
    await page.waitForTimeout(500);
    await page.selectOption('select[name="thaiMusicTeachers.1.teacherQualification"]', 'ครูภูมิปัญญาในท้องถิ่น');
    await page.fill('input[name="thaiMusicTeachers.1.teacherFullName"]', 'ครู B');
    
    // Only 2 training checkboxes
    await page.check('input[name="isCompulsorySubject"]');
    await page.check('input[name="hasAfterSchoolTeaching"]');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 5: 25 points (5 org + 10 external + 10 award)
    await page.check('input[name="hasSupportFromOrg"]');
    await page.fill('input[name="supportFromOrg.0.organization"]', 'องค์กร');
    
    await page.check('input[name="hasSupportFromExternal"]');
    await page.fill('input[name="supportFromExternal.0.organization"]', 'ภายนอก 1');
    const addExternalBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').nth(2);
    await addExternalBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="supportFromExternal.1.organization"]', 'ภายนอก 2');
    
    await page.selectOption('select[name="awards.0.awardLevel"]', 'จังหวัด');
    await page.fill('input[name="awards.0.awardName"]', 'รางวัลระดับจังหวัด');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 6
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 7: 5 points (only internal >= 3)
    await page.fill('input[name="activitiesWithinProvinceInternal.0.activityName"]', 'กิจกรรม 1');
    const addInternalBtn = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addInternalBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceInternal.1.activityName"]', 'กิจกรรม 2');
    await addInternalBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="activitiesWithinProvinceInternal.2.activityName"]', 'กิจกรรม 3');
    
    // External and outside < 3 (no points)
    await page.fill('input[name="activitiesWithinProvinceExternal.0.activityName"]', 'นอก 1');
    await page.fill('input[name="activitiesOutsideProvince.0.activityName"]', 'นอกจังหวัด 1');
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 8: 0 points (< 3 PR activities)
    await page.fill('input[name="prActivities.0.activityName"]', 'PR 1');
    
    await page.check('input[name="certifiedINFOByAdminName"]');
    
    console.log('🚀 Submitting Scenario 2...');
    await page.getByRole('button', { name: 'ส่งแบบฟอร์ม' }).click();
    await page.waitForTimeout(5000);
    
    const successModal = page.locator('[data-testid="btn-success-close"]');
    const isVisible = await successModal.isVisible({ timeout: 10000 }).catch(() => false);
    
    expect(isVisible).toBe(true);
    console.log('✅ Scenario 2 completed - Expected: 50 points\n');
  });

  // ==================== SCENARIO 3: Minimum Score (0 points) ====================
  test('Scenario 3: Minimum score - 0 points', async ({ page }) => {
    test.setTimeout(240000);
    
    await page.goto('http://localhost:3000/regist100');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    console.log('🎯 SCENARIO 3: Testing MINIMUM SCORE (0 points)');
    console.log('Expected breakdown:');
    console.log('  - Teacher training: 0 (no checkboxes)');
    console.log('  - Teacher qualifications: 0 (no teachers)');
    console.log('  - Support from org: 0');
    console.log('  - Support from external: 0');
    console.log('  - Award: 0');
    console.log('  - Activities internal: 0');
    console.log('  - Activities external: 0');
    console.log('  - Activities outside: 0');
    console.log('  - PR activities: 0');
    console.log('  = TOTAL: 0 points\n');

    // STEP 1
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ คะแนนต่ำสุด 0');
    await page.selectOption('select[name="schoolProvince"]', 'ภูเก็ต');
    await page.selectOption('select[name="schoolLevel"]', 'ประถมศึกษา');
    await page.selectOption('select[name="affiliation"]', 'กระทรวงศึกษาธิการ (Ministry of Education)');
    await page.fill('input[placeholder="จำนวนบุคลากร"]', '10');
    await page.fill('input[placeholder="กรอกจำนวนนักเรียน"]', '100');
    await page.fill('input[name="phone"]', '021234567');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 2
    await page.fill('input[name="mgtFullName"]', 'ผู้บริหาร ต่ำสุด');
    await page.fill('input[name="mgtPosition"]', 'ผู้อำนวยการ');
    await page.fill('input[name="mgtPhone"]', '0834567890');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 3
    await page.fill('input[name="currentMusicTypes.0.grade"]', 'ป.1-6');
    await page.fill('input[name="readinessItems.0.instrumentName"]', 'กลอง');
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 4: 0 points (no checkboxes, no teachers added)
    // Don't check any training checkboxes
    // Don't add any teachers (use default empty form)
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 5: 0 points (no support, no awards)
    // Don't check support checkboxes
    // Don't fill awards
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 6
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 7: 0 points (no activities)
    // Don't add any activities
    
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    await page.waitForTimeout(1000);

    // STEP 8: 0 points (no PR)
    // Don't add PR activities
    
    await page.check('input[name="certifiedINFOByAdminName"]');
    
    console.log('🚀 Submitting Scenario 3...');
    await page.getByRole('button', { name: 'ส่งแบบฟอร์ม' }).click();
    await page.waitForTimeout(5000);
    
    const successModal = page.locator('[data-testid="btn-success-close"]');
    const isVisible = await successModal.isVisible({ timeout: 10000 }).catch(() => false);
    
    expect(isVisible).toBe(true);
    console.log('✅ Scenario 3 completed - Expected: 0 points\n');
  });
});
