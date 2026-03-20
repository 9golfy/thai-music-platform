const puppeteer = require('puppeteer');

async function testProductionRegist100() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });
    
    console.log('🚀 Testing production regist100 page...');
    console.log('URL: http://18.138.63.84:3000/regist100');
    
    // Navigate to the page
    const response = await page.goto('http://18.138.63.84:3000/regist100', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log(`✅ Page loaded with status: ${response.status()}`);
    
    // Check if page title is correct
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Check for main form elements
    const formExists = await page.$('form') !== null;
    console.log(`📝 Form exists: ${formExists}`);
    
    // Check for wizard steps
    const wizardSteps = await page.$$eval('[data-testid*="step"], .step, .wizard-step', 
      elements => elements.length
    ).catch(() => 0);
    console.log(`🔢 Wizard steps found: ${wizardSteps}`);
    
    // Check for input fields
    const inputFields = await page.$$eval('input', elements => elements.length);
    console.log(`📋 Input fields found: ${inputFields}`);
    
    // Check for any error messages
    const errorMessages = await page.$$eval('.error, .alert-error, [class*="error"]', 
      elements => elements.map(el => el.textContent?.trim()).filter(text => text)
    ).catch(() => []);
    
    if (errorMessages.length > 0) {
      console.log('❌ Error messages found:');
      errorMessages.forEach(msg => console.log(`   - ${msg}`));
    } else {
      console.log('✅ No error messages found');
    }
    
    // Check console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait a bit to catch any console errors
    await page.waitForTimeout(2000);
    
    if (consoleErrors.length > 0) {
      console.log('🔍 Console errors found:');
      consoleErrors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('✅ No console errors found');
    }
    
    // Check if the page is responsive
    await page.setViewport({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    console.log('📱 Mobile viewport test completed');
    
    // Take a screenshot for visual verification
    await page.screenshot({ 
      path: 'production-regist100-test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved as production-regist100-test.png');
    
    // Test basic navigation elements
    const navElements = await page.$$eval('nav, .navbar, [role="navigation"]', 
      elements => elements.length
    ).catch(() => 0);
    console.log(`🧭 Navigation elements found: ${navElements}`);
    
    // Check for loading states
    const loadingElements = await page.$$eval('.loading, .spinner, [class*="loading"]', 
      elements => elements.length
    ).catch(() => 0);
    console.log(`⏳ Loading elements found: ${loadingElements}`);
    
    console.log('\n✅ Production regist100 test completed successfully!');
    
    return {
      status: response.status(),
      title,
      formExists,
      wizardSteps,
      inputFields,
      errorMessages,
      consoleErrors,
      navElements,
      loadingElements
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testProductionRegist100()
  .then(results => {
    console.log('\n📊 Test Results Summary:');
    console.log(JSON.stringify(results, null, 2));
  })
  .catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  });