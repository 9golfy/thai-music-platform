import { Builder, By, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3000';

// Test image paths
const managerImagePath = path.resolve(__dirname, '../regist/test-assets/manager.jpg');
const teacher1ImagePath = path.resolve(__dirname, '../regist/test-assets/teacher1.jpg');

async function runTest() {
  let driver: WebDriver | null = null;
  
  try {
    console.log('🚀 Starting registration form test...');
    console.log('📁 Manager image path:', managerImagePath);
    console.log('📁 Teacher image path:', teacher1ImagePath);
    
    // Setup Chrome driver
    const options = new chrome.Options();
    // options.addArguments('--headless'); // Comment out for debugging
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');
    
    console.log('🌐 Initializing Chrome driver...');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    console.log('✅ Chrome driver initialized');
    await driver.manage().setTimeouts({ implicit: 10000 });
    
    // Navigate to registration page
    console.log(`🔗 Navigating to ${BASE_URL}/regist100...`);
    await driver.get(`${BASE_URL}/regist100`);
    await driver.sleep(2000);
    
    console.log('📝 Step 1: Basic Information');
    
    // Step 1: Basic Information
    await driver.findElement(By.name('schoolName')).sendKeys('โรงเรียนทดสอบดนตรีไทย');
    
    // Select province
    const provinceSelect = await driver.findElement(By.name('schoolProvince'));
    await provinceSelect.sendKeys('กรุงเทพมหานคร');
    
    // Select school level
    const levelSelect = await driver.findElement(By.name('schoolLevel'));
    await levelSelect.sendKeys('ประถมศึกษา');
    
    // Select affiliation
    const affiliationSelect = await driver.findElement(By.name('affiliation'));
    await affiliationSelect.sendKeys('สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน');
    
    // Staff count
    await driver.findElement(By.name('staffCount')).sendKeys('50');
    
    // Student count
    await driver.findElement(By.name('studentCount')).sendKeys('500');
    
    // Address
    await driver.findElement(By.name('addressNo')).sendKeys('123');
    await driver.findElement(By.name('moo')).sendKeys('5');
    await driver.findElement(By.name('road')).sendKeys('ถนนทดสอบ');
    await driver.findElement(By.name('subDistrict')).sendKeys('บางกะปิ');
    await driver.findElement(By.name('district')).sendKeys('ห้วยขวาง');
    await driver.findElement(By.name('provinceAddress')).sendKeys('กรุงเทพมหานคร');
    await driver.findElement(By.name('postalCode')).sendKeys('10310');
    await driver.findElement(By.name('phone')).sendKeys('021234567');
    await driver.findElement(By.name('fax')).sendKeys('021234568');
    
    // Click Next
    const nextBtn1 = await driver.findElement(By.css('[data-testid="btn-next"]'));
    await nextBtn1.click();
    await driver.sleep(1000);
    
    console.log('📝 Step 2: Management Information');
    
    // Step 2: Management Information
    await driver.findElement(By.name('mgtFullName')).sendKeys('นายทดสอบ ผู้บริหาร');
    await driver.findElement(By.name('mgtPosition')).sendKeys('ผู้อำนวยการ');
    await driver.findElement(By.name('mgtPhone')).sendKeys('0812345678');
    await driver.findElement(By.name('mgtEmail')).sendKeys('test@school.ac.th');
    
    // Upload manager image
    const mgtImageInput = await driver.findElement(By.name('mgtImage'));
    await mgtImageInput.sendKeys(managerImagePath);
    await driver.sleep(500);
    
    // Click Next
    const nextBtn2 = await driver.findElement(By.css('[data-testid="btn-next"]'));
    await nextBtn2.click();
    await driver.sleep(1000);
    
    console.log('📝 Step 3: Teachers Information');
    
    // Step 3: Teachers (already has 1 teacher by default)
    await driver.findElement(By.name('thaiMusicTeachers.0.teacherFullName')).sendKeys('นายครู ทดสอบ');
    await driver.findElement(By.name('thaiMusicTeachers.0.teacherPosition')).sendKeys('ครูดนตรีไทย');
    await driver.findElement(By.name('thaiMusicTeachers.0.teacherEducation')).sendKeys('ปริญญาตรี ดนตรีไทย');
    await driver.findElement(By.name('thaiMusicTeachers.0.teacherPhone')).sendKeys('0823456789');
    await driver.findElement(By.name('thaiMusicTeachers.0.teacherEmail')).sendKeys('teacher@school.ac.th');
    
    // Upload teacher image
    const teacherImageInput = await driver.findElement(By.name('thaiMusicTeachers.0.teacherImage'));
    await teacherImageInput.sendKeys(teacher1ImagePath);
    await driver.sleep(500);
    
    // Click Next
    const nextBtn3 = await driver.findElement(By.css('[data-testid="btn-next"]'));
    await nextBtn3.click();
    await driver.sleep(1000);
    
    console.log('📝 Step 4: Teaching Plans and Resources');
    
    // Step 4: Add teaching plan
    const addPlanBtn = await driver.findElement(By.xpath('//button[contains(text(), "+ เพิ่มข้อมูล")]'));
    await addPlanBtn.click();
    await driver.sleep(500);
    
    await driver.findElement(By.name('currentTeachingPlans.0.gradeLevel')).sendKeys('ป.1-ป.6');
    await driver.findElement(By.name('currentTeachingPlans.0.planDetails')).sendKeys('สอนดนตรีไทยพื้นฐาน');
    
    // Instrument sufficiency
    const instrumentYes = await driver.findElement(By.css('input[name="instrumentSufficiency"][value="true"]'));
    await instrumentYes.click();
    
    // Click Next
    const nextBtn4 = await driver.findElement(By.css('[data-testid="btn-next"]'));
    await nextBtn4.click();
    await driver.sleep(1000);
    
    console.log('📝 Step 5: Support Factors');
    
    // Step 5: Support factors (already has 1 by default)
    await driver.findElement(By.name('supportFactors.0.sup_supportByAdmin')).sendKeys('ผู้บริหารสนับสนุนเต็มที่');
    await driver.findElement(By.name('supportFactors.0.sup_supportBySchoolBoard')).sendKeys('คณะกรรมการสนับสนุน');
    
    // Teacher skill
    await driver.findElement(By.name('teacherSkillThaiMusicMajor')).sendKeys('ครูมีความเชี่ยวชาญด้านดนตรีไทย');
    
    // Instrument sufficiency
    const instrumentSuffYes = await driver.findElement(By.css('input[name="instrumentSufficiency"][value="true"]'));
    await instrumentSuffYes.click();
    
    // Curriculum framework
    await driver.findElement(By.name('curriculumFramework')).sendKeys('มีหลักสูตรดนตรีไทยที่ชัดเจน');
    
    // Click Next
    const nextBtn5 = await driver.findElement(By.css('[data-testid="btn-next"]'));
    await nextBtn5.click();
    await driver.sleep(1000);
    
    console.log('📝 Step 6: Media and Videos');
    
    // Step 6: Photo gallery link
    await driver.findElement(By.name('photoGalleryLink')).sendKeys('https://drive.google.com/test-photos');
    
    // Add classroom video
    const addClassroomVideoBtn = await driver.findElement(By.xpath('//button[contains(text(), "+ เพิ่มข้อมูล")]'));
    await addClassroomVideoBtn.click();
    await driver.sleep(500);
    
    await driver.findElement(By.name('classroomVideos.0.classroomVideoLink')).sendKeys('https://youtube.com/watch?v=test1');
    
    // Click Next
    const nextBtn6 = await driver.findElement(By.css('[data-testid="btn-next"]'));
    await nextBtn6.click();
    await driver.sleep(1000);
    
    console.log('📝 Step 7: PR Channels and Certification');
    
    // Step 7: PR Channels
    const facebookCheckbox = await driver.findElement(By.name('DCP_PR_Channel_FACEBOOK'));
    await facebookCheckbox.click();
    
    const youtubeCheckbox = await driver.findElement(By.name('DCP_PR_Channel_YOUTUBE'));
    await youtubeCheckbox.click();
    
    // Certification checkbox
    const certCheckbox = await driver.findElement(By.name('certifiedINFOByAdminName'));
    await certCheckbox.click();
    await driver.sleep(500);
    
    console.log('✅ Submitting form...');
    
    // Submit form
    const submitBtn = await driver.findElement(By.css('[data-testid="btn-submit"]'));
    await submitBtn.click();
    
    // Wait for success modal or response
    await driver.sleep(3000);
    
    console.log('✅ Form submission completed!');
    
    // Check if success modal appears
    const pageSource = await driver.getPageSource();
    const isSuccess = pageSource.includes('สำเร็จ') || pageSource.includes('ส่งแบบฟอร์มสำเร็จ');
    
    if (isSuccess) {
      console.log('✅ TEST PASSED: Form submitted successfully!');
    } else {
      console.log('❌ TEST FAILED: Success message not found');
      throw new Error('Form submission failed - success message not found');
    }
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    throw error;
  } finally {
    if (driver) {
      await driver.quit();
      console.log('🔚 Browser closed');
    }
  }
}

// Run the test
runTest()
  .then(() => {
    console.log('✅ All tests completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
