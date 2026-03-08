/**
 * Test Consent API
 * 
 * Tests the consent check and save APIs
 */

async function testConsentAPI() {
  console.log('🧪 Testing Consent API...\n');
  
  const baseURL = 'http://localhost:3000';
  const testEmail = '9golfy@gmail.com';
  const submissionType = 'register100';
  
  try {
    // Test consent check API
    console.log('🔍 Testing consent check API...');
    const checkResponse = await fetch(`${baseURL}/api/consent/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: testEmail,
        submissionType: submissionType
      }),
    });
    
    const checkResult = await checkResponse.json();
    console.log('📊 Check API Response:', checkResult);
    
    if (!checkResult.hasConsented) {
      console.log('\n💾 Testing consent save API...');
      const saveResponse = await fetch(`${baseURL}/api/consent/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: testEmail,
          submissionType: submissionType
        }),
      });
      
      const saveResult = await saveResponse.json();
      console.log('📊 Save API Response:', saveResult);
      
      // Test check again
      console.log('\n🔍 Testing consent check API again...');
      const checkResponse2 = await fetch(`${baseURL}/api/consent/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: testEmail,
          submissionType: submissionType
        }),
      });
      
      const checkResult2 = await checkResponse2.json();
      console.log('📊 Check API Response (after save):', checkResult2);
    }
    
    console.log('\n✅ API tests completed');
    
  } catch (error) {
    console.error('❌ Error testing consent API:', error);
  }
}

// Run the test
testConsentAPI().catch(console.error);