const https = require('https');
const http = require('http');

async function testProductionRegist100() {
  console.log('🚀 Testing production regist100 page...');
  console.log('URL: http://18.138.63.84:3000/regist100');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '18.138.63.84',
      port: 3000,
      path: '/regist100',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    };

    const req = http.request(options, (res) => {
      console.log(`✅ Response status: ${res.statusCode}`);
      console.log(`📋 Response headers:`, res.headers);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📄 Response size: ${data.length} bytes`);
        
        // Basic HTML content checks
        const hasHtml = data.includes('<html') || data.includes('<!DOCTYPE');
        const hasForm = data.includes('<form');
        const hasTitle = data.match(/<title[^>]*>([^<]*)<\/title>/i);
        const hasErrors = data.includes('error') || data.includes('Error');
        const hasRegist100 = data.includes('regist100') || data.includes('Register100');
        
        console.log(`🏷️  Has HTML structure: ${hasHtml}`);
        console.log(`📝 Has form elements: ${hasForm}`);
        console.log(`📄 Page title: ${hasTitle ? hasTitle[1].trim() : 'Not found'}`);
        console.log(`❌ Contains errors: ${hasErrors}`);
        console.log(`🎯 Contains regist100 content: ${hasRegist100}`);
        
        // Check for specific content
        const hasWizard = data.includes('wizard') || data.includes('step');
        const hasInputs = data.includes('<input');
        const hasButtons = data.includes('<button');
        
        console.log(`🔮 Has wizard/step content: ${hasWizard}`);
        console.log(`📋 Has input fields: ${hasInputs}`);
        console.log(`🔘 Has buttons: ${hasButtons}`);
        
        // Look for Next.js specific content
        const hasNextJs = data.includes('_next') || data.includes('__NEXT_DATA__');
        console.log(`⚛️  Next.js app detected: ${hasNextJs}`);
        
        const results = {
          statusCode: res.statusCode,
          contentLength: data.length,
          hasHtml,
          hasForm,
          title: hasTitle ? hasTitle[1].trim() : null,
          hasErrors,
          hasRegist100,
          hasWizard,
          hasInputs,
          hasButtons,
          hasNextJs,
          headers: res.headers
        };
        
        if (res.statusCode === 200 && hasHtml) {
          console.log('\n✅ Production regist100 page is accessible and working!');
        } else {
          console.log('\n⚠️  Issues detected with the page');
        }
        
        resolve(results);
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('❌ Request timed out');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Also test the API endpoint
async function testRegist100API() {
  console.log('\n🔌 Testing regist100 API endpoint...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '18.138.63.84',
      port: 3000,
      path: '/api/register100',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 15000
    };

    const req = http.request(options, (res) => {
      console.log(`✅ API Response status: ${res.statusCode}`);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📄 API Response size: ${data.length} bytes`);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('📊 API returned valid JSON');
          console.log('🔍 Response preview:', JSON.stringify(jsonData, null, 2).substring(0, 200) + '...');
        } catch (e) {
          console.log('📄 API returned non-JSON response');
          console.log('🔍 Response preview:', data.substring(0, 200) + '...');
        }
        
        resolve({
          statusCode: res.statusCode,
          contentLength: data.length,
          isJson: data.startsWith('{') || data.startsWith('['),
          response: data.substring(0, 500)
        });
      });
    });

    req.on('error', (error) => {
      console.error('❌ API Request failed:', error.message);
      resolve({ error: error.message });
    });

    req.on('timeout', () => {
      console.error('❌ API Request timed out');
      req.destroy();
      resolve({ error: 'Request timeout' });
    });

    req.end();
  });
}

// Run both tests
async function runAllTests() {
  try {
    const pageResults = await testProductionRegist100();
    const apiResults = await testRegist100API();
    
    console.log('\n📊 Complete Test Results:');
    console.log('='.repeat(50));
    console.log('Page Test Results:', JSON.stringify(pageResults, null, 2));
    console.log('API Test Results:', JSON.stringify(apiResults, null, 2));
    
  } catch (error) {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  }
}

runAllTests();