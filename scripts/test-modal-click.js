const { chromium } = require('playwright');

async function testModalClick() {
  console.log('🧪 Testing Modal Click Behavior...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to register100 form
    await page.goto('http://localhost:3000/regist100');
    
    // Create a simple test modal
    await page.evaluate(() => {
      // Create modal HTML
      const modalHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" id="test-modal">
          <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 class="text-xl font-bold mb-4">กรุณากรอกข้อมูลติดต่อ</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">อีเมล</label>
                <input type="email" placeholder="teacher@school.ac.th" class="w-full px-3 py-2 border rounded-lg">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">เบอร์โทรศัพท์</label>
                <input type="tel" placeholder="081-234-5678" class="w-full px-3 py-2 border rounded-lg">
              </div>
              <div class="flex gap-3 mt-6">
                <button type="button" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  ยกเลิก
                </button>
                <button type="submit" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" id="submit-btn">
                  ส่ง
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      
      // Add click handler
      document.getElementById('submit-btn').addEventListener('click', () => {
        console.log('✅ Button clicked successfully!');
        alert('Button was clicked!');
        document.getElementById('test-modal').remove();
      });
    });
    
    console.log('📋 Test modal created');
    await page.waitForTimeout(2000);
    
    // Test different click methods
    const button = page.locator('#submit-btn');
    
    console.log('🔍 Testing button visibility and state...');
    const isVisible = await button.isVisible();
    const isEnabled = await button.isEnabled();
    const text = await button.textContent();
    console.log(`   Visible: ${isVisible}, Enabled: ${isEnabled}, Text: "${text}"`);
    
    if (isVisible && isEnabled) {
      console.log('🖱️  Testing click methods...');
      
      try {
        console.log('   Method 1: Regular click...');
        await button.click({ timeout: 5000 });
        console.log('   ✅ Regular click successful');
      } catch (error) {
        console.log('   ❌ Regular click failed:', error.message);
        
        try {
          console.log('   Method 2: Force click...');
          await button.click({ force: true, timeout: 5000 });
          console.log('   ✅ Force click successful');
        } catch (error2) {
          console.log('   ❌ Force click failed:', error2.message);
          
          try {
            console.log('   Method 3: Scroll and click...');
            await button.scrollIntoViewIfNeeded();
            await page.waitForTimeout(500);
            await button.click({ force: true });
            console.log('   ✅ Scroll and click successful');
          } catch (error3) {
            console.log('   ❌ Scroll and click failed:', error3.message);
            
            try {
              console.log('   Method 4: Mouse coordinates...');
              const box = await button.boundingBox();
              if (box) {
                await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
                console.log('   ✅ Mouse coordinates click successful');
              }
            } catch (error4) {
              console.log('   ❌ Mouse coordinates failed:', error4.message);
              
              console.log('   Method 5: JavaScript click...');
              await page.evaluate(() => {
                document.getElementById('submit-btn').click();
              });
              console.log('   ✅ JavaScript click executed');
            }
          }
        }
      }
    } else {
      console.log('❌ Button is not visible or enabled');
    }
    
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testModalClick();