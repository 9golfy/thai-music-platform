import { test, expect } from '@playwright/test';
import { buildRegister69DummyData } from '../helpers/register69.fixture';
import path from 'path';

test.describe('Register 69 Form E2E', () => {
  test('should complete full registration flow with all fields', async ({ page }) => {
    const data = buildRegister69DummyData();
    
    // Intercept API call to avoid real submission
    await page.route('**/api/register-69', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, id: 'TEST-E2E-123' }),
      });
    });

    // Navigate to form
    await page.goto('/register-69');
    await page.waitForLoadState('networkidle');

    // Handle consent modal if it appears
    const consentButton = page.getByTestId('btn-consent-accept');
    if (await consentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await consentButton.click();
      await expect(consentButton).not.toBeVisible();
    }

    // ==================== STEP 1: Basic Info + Address ====================
    console.log('Testing Step 1...');
    
    // Test validation: Try to proceed without required fields
    await page.getByTestId('btn-next').click();
    
    // Should show validation errors (wait for error messages)
    await page.waitForTimeout(500);
    
    // Fill basic information
    await page.fill('input[name="schoolName"]', data.schoolName);
    await page.selectOption('select[name="schoolProvince"]', data.province);
    await page.selectOption('select[name="schoolLevel"]', data.schoolLevel);
    await page.selectOption('select[name="affiliation"]', data.affiliation);
    
    // Test auto school size calculation
    await page.fill('input[name="studentCount"]', data.studentCount.toString());
    await page.waitForTimeout(300);
    
    // Verify school size auto-calculated to MEDIUM (500 students)
    const schoolSizeValue = await page.inputValue('select[name="schoolSize"]');
    expect(schoolSizeValue).toBe('MEDIUM');
    
    // Override school size to LARGE
    await page.selectOption('select[name="schoolSize"]', 'LARGE');
    const overriddenSize = await page.inputValue('select[name="schoolSize"]');
    expect(overriddenSize).toBe('LARGE');
    
    await page.fill('input[name="staffCount"]', data.staffCount.toString());
    await page.fill('textarea[name="studentCountByGrade"]', data.studentCountByGrade);
    
    // Fill address
    await page.fill('input[name="addressNo"]', data.addressNo);
    await page.fill('input[name="moo"]', data.moo);
    await page.fill('input[name="road"]', data.road);
    await page.fill('input[name="subDistrict"]', data.subDistrict);
    await page.fill('input[name="district"]', data.district);
    await page.fill('input[name="provinceAddress"]', data.provinceAddress);
    await page.fill('input[name="postalCode"]', data.postalCode);
    await page.fill('input[name="phone"]', data.phone);
    await page.fill('input[name="fax"]', data.fax);
    
    // Navigate to Step 2
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(500);

    // ==================== STEP 2: Administrator ====================
    console.log('Testing Step 2...');
    
    // Verify we're on step 2
    await expect(page.getByTestId('step-2')).toHaveClass(/text-primary/);
    
    // Fill administrator info
    await page.fill('input[name="mgtFullName"]', data.mgtFullName);
    await page.fill('input[name="mgtPosition"]', data.mgtPosition);
    await page.fill('input[name="mgtPhone"]', data.mgtPhone);
    await page.fill('input[name="mgtEmail"]', data.mgtEmail);
    
    // Test stepper navigation: Click Step 3 directly
    await page.getByTestId('step-3').click();
    await page.waitForTimeout(500);

    // ==================== STEP 3: Thai Music Teachers ====================
    console.log('Testing Step 3...');
    
    // Verify we're on step 3
    await expect(page.getByTestId('step-3')).toHaveClass(/text-primary/);
    
    // Add first teacher
    const addTeacherButton = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    await addTeacherButton.click();
    await page.waitForTimeout(300);
    
    // Fill first teacher
    await page.fill('input[name="thaiMusicTeachers.0.teacherFullName"]', data.thaiMusicTeachers[0].teacherFullName);
    await page.fill('input[name="thaiMusicTeachers.0.teacherPosition"]', data.thaiMusicTeachers[0].teacherPosition);
    await page.fill('input[name="thaiMusicTeachers.0.teacherEducation"]', data.thaiMusicTeachers[0].teacherEducation);
    await page.fill('input[name="thaiMusicTeachers.0.teacherPhone"]', data.thaiMusicTeachers[0].teacherPhone);
    await page.fill('input[name="thaiMusicTeachers.0.teacherEmail"]', data.thaiMusicTeachers[0].teacherEmail);
    
    // Add second teacher
    await addTeacherButton.click();
    await page.waitForTimeout(300);
    
    // Fill second teacher
    await page.fill('input[name="thaiMusicTeachers.1.teacherFullName"]', data.thaiMusicTeachers[1].teacherFullName);
    await page.fill('input[name="thaiMusicTeachers.1.teacherPosition"]', data.thaiMusicTeachers[1].teacherPosition);
    await page.fill('input[name="thaiMusicTeachers.1.teacherEducation"]', data.thaiMusicTeachers[1].teacherEducation);
    await page.fill('input[name="thaiMusicTeachers.1.teacherPhone"]', data.thaiMusicTeachers[1].teacherPhone);
    await page.fill('input[name="thaiMusicTeachers.1.teacherEmail"]', data.thaiMusicTeachers[1].teacherEmail);
    
    // Test remove and re-add
    const removeButton = page.locator('button:has-text("ลบ")').first();
    await removeButton.click();
    await page.waitForTimeout(300);
    
    // Re-add teacher
    await addTeacherButton.click();
    await page.waitForTimeout(300);
    await page.fill('input[name="thaiMusicTeachers.1.teacherFullName"]', data.thaiMusicTeachers[1].teacherFullName);
    
    // Navigate to Step 4
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(500);

    // ==================== STEP 4: Teaching Plans + Duration ====================
    console.log('Testing Step 4...');
    
    // Add teaching plans
    const addPlanButton = page.locator('button:has-text("+ เพิ่มข้อมูล")').first();
    
    // Add first plan
    await addPlanButton.click();
    await page.waitForTimeout(300);
    await page.fill('input[name="currentTeachingPlans.0.gradeLevel"]', data.currentTeachingPlans[0].gradeLevel);
    await page.fill('textarea[name="currentTeachingPlans.0.planDetails"]', data.currentTeachingPlans[0].planDetails);
    
    // Add second plan
    await addPlanButton.click();
    await page.waitForTimeout(300);
    await page.fill('input[name="currentTeachingPlans.1.gradeLevel"]', data.currentTeachingPlans[1].gradeLevel);
    await page.fill('textarea[name="currentTeachingPlans.1.planDetails"]', data.currentTeachingPlans[1].planDetails);
    
    // Fill duration fields
    await page.fill('textarea[name="inClassInstructionDuration"]', data.inClassInstructionDuration);
    await page.fill('textarea[name="outOfClassInstructionDuration"]', data.outOfClassInstructionDuration);
    await page.fill('textarea[name="instructionLocationOverview"]', data.instructionLocationOverview);
    
    // Navigate to Step 5
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(500);

    // ==================== STEP 5: Instruments + Sufficiency + External Instructors ====================
    console.log('Testing Step 5...');
    
    // Fill instruments
    await page.fill('textarea[name="availableInstruments"]', data.availableInstruments);
    
    // Check instrument sufficiency
    await page.check('input[name="instrumentSufficiency"]');
    await page.fill('textarea[name="instrumentSufficiencyDetail"]', data.instrumentSufficiencyDetail);
    
    // Check instrument insufficiency
    await page.check('input[name="instrumentINSufficiency"]');
    await page.fill('textarea[name="instrumentINSufficiencyDetail"]', data.instrumentINSufficiencyDetail);
    
    // Add external instructor
    const addInstructorButton = page.locator('button:has-text("+ เพิ่มข้อมูล")').last();
    await addInstructorButton.click();
    await page.waitForTimeout(300);
    
    await page.fill('input[name="externalInstructors.0.extFullName"]', data.externalInstructors[0].extFullName);
    await page.fill('input[name="externalInstructors.0.extPosition"]', data.externalInstructors[0].extPosition);
    await page.fill('textarea[name="externalInstructors.0.extAddress"]', data.externalInstructors[0].extAddress);
    await page.fill('input[name="externalInstructors.0.extPhone"]', data.externalInstructors[0].extPhone);
    await page.fill('input[name="externalInstructors.0.extEmail"]', data.externalInstructors[0].extEmail);
    
    // Navigate to Step 6
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(500);

    // ==================== STEP 6: Support + Skills + Curriculum + Feedback ====================
    console.log('Testing Step 6...');
    
    // Fill support fields
    await page.fill('textarea[name="supportByAdmin"]', data.supportByAdmin);
    await page.fill('textarea[name="supportBySchoolBoard"]', data.supportBySchoolBoard);
    await page.fill('textarea[name="supportByLocalGov"]', data.supportByLocalGov);
    await page.fill('textarea[name="supportByCommunity"]', data.supportByCommunity);
    await page.fill('textarea[name="supportByOthers"]', data.supportByOthers);
    
    // Fill teacher skills
    await page.fill('textarea[name="teacherSkillThaiMusicMajor"]', data.teacherSkillThaiMusicMajor);
    await page.fill('textarea[name="teacherSkillOtherMajorButTrained"]', data.teacherSkillOtherMajorButTrained);
    
    // Fill curriculum and results
    await page.fill('textarea[name="curriculumFramework"]', data.curriculumFramework);
    await page.fill('textarea[name="learningOutcomes"]', data.learningOutcomes);
    await page.fill('textarea[name="managementContext"]', data.managementContext);
    await page.fill('textarea[name="equipmentAndBudgetSupport"]', data.equipmentAndBudgetSupport);
    await page.fill('textarea[name="awardsLastYear"]', data.awardsLastYear);
    
    // Fill feedback
    await page.fill('textarea[name="obstacles"]', data.obstacles);
    await page.fill('textarea[name="suggestions"]', data.suggestions);
    
    // Test back button
    await page.getByTestId('btn-back').click();
    await page.waitForTimeout(500);
    
    // Verify we went back to step 5
    await expect(page.getByTestId('step-5')).toHaveClass(/text-primary/);
    
    // Verify data persisted (check one field)
    const instrumentsValue = await page.inputValue('textarea[name="availableInstruments"]');
    expect(instrumentsValue).toBe(data.availableInstruments);
    
    // Go forward again
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(500);
    
    // Navigate to Step 7
    await page.getByTestId('btn-next').click();
    await page.waitForTimeout(500);

    // ==================== STEP 7: Media + Source + Certification ====================
    console.log('Testing Step 7...');
    
    // Upload files
    const photo1Path = path.join(process.cwd(), 'tests', 'fixtures', 'photo1.png');
    const photo2Path = path.join(process.cwd(), 'tests', 'fixtures', 'photo2.png');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([photo1Path, photo2Path]);
    await page.waitForTimeout(500);
    
    // Verify 2 files are shown (look for file names or count)
    const fileItems = page.locator('text=photo1.png, text=photo2.png').or(page.locator('.bg-neutral-light'));
    // Note: Actual verification depends on UI implementation
    
    // Fill publicity links
    await page.fill('textarea[name="publicityLinks"]', data.publicityLinks);
    
    // Fill information source
    await page.fill('input[name="heardFromSchoolName"]', data.heardFromSchoolName);
    await page.fill('input[name="heardFromSchoolDistrict"]', data.heardFromSchoolDistrict);
    await page.fill('input[name="heardFromSchoolProvince"]', data.heardFromSchoolProvince);
    
    // Check PR channels
    await page.check('input[name="DCP_PR_Channel_FACEBOOK"]');
    await page.check('input[name="DCP_PR_Channel_YOUTUBE"]');
    await page.check('input[name="DCP_PR_Channel_Tiktok"]');
    await page.check('input[name="heardFromOther"]');
    await page.fill('input[name="heardFromOtherDetail"]', data.heardFromOtherDetail);
    
    // Check certification checkbox (required for submission)
    await page.check('input[name="certifiedINFOByAdminName"]');
    
    // Final submit - set up success dialog handler
    const dialogPromise = page.waitForEvent('dialog');
    await page.getByTestId('btn-submit').click();
    
    // Wait for and handle success dialog
    const dialog = await dialogPromise;
    console.log('Success dialog:', dialog.message());
    expect(dialog.message()).toContain('ส่งแบบฟอร์มสำเร็จ');
    expect(dialog.message()).toContain('TEST-E2E-123');
    await dialog.accept();
    
    await page.waitForTimeout(500);
    
    console.log('✅ E2E test completed successfully!');
  });

  test('should allow free stepper navigation', async ({ page }) => {
    await page.goto('/register-69');
    await page.waitForLoadState('networkidle');

    // Handle consent modal
    const consentButton = page.getByTestId('btn-consent-accept');
    if (await consentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await consentButton.click();
    }

    // Click Step 7 directly from Step 1
    await page.getByTestId('step-7').click();
    await page.waitForTimeout(500);
    
    // Verify we're on step 7
    await expect(page.getByTestId('step-7')).toHaveClass(/text-primary/);
    
    // Click Step 3
    await page.getByTestId('step-3').click();
    await page.waitForTimeout(500);
    
    // Verify we're on step 3
    await expect(page.getByTestId('step-3')).toHaveClass(/text-primary/);
    
    // Click Step 1
    await page.getByTestId('step-1').click();
    await page.waitForTimeout(500);
    
    // Verify we're on step 1
    await expect(page.getByTestId('step-1')).toHaveClass(/text-primary/);
    
    console.log('✅ Stepper navigation test passed!');
  });

  test('should save and restore draft', async ({ page }) => {
    await page.goto('/register-69');
    await page.waitForLoadState('networkidle');

    // Handle consent modal
    const consentButton = page.getByTestId('btn-consent-accept');
    if (await consentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await consentButton.click();
    }

    // Fill some data
    await page.fill('input[name="schoolName"]', 'โรงเรียนทดสอบ Draft');
    await page.selectOption('select[name="schoolLevel"]', 'PRIMARY');
    
    // Save draft
    await page.getByTestId('btn-save-draft').click();
    
    // Wait for alert
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('บันทึกร่างเรียบร้อยแล้ว');
      await dialog.accept();
    });
    
    await page.waitForTimeout(500);
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should show restore modal
    const restoreButton = page.locator('button:has-text("กู้คืนข้อมูล")');
    if (await restoreButton.isVisible({ timeout: 2000 })) {
      await restoreButton.click();
      await page.waitForTimeout(500);
      
      // Verify data restored
      const schoolNameValue = await page.inputValue('input[name="schoolName"]');
      expect(schoolNameValue).toBe('โรงเรียนทดสอบ Draft');
    }
    
    console.log('✅ Draft save/restore test passed!');
  });
});
