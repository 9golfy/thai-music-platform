/**
 * Test API Draft Call
 * 
 * Tests the draft API endpoint directly
 */

async function testAPIDraft() {
  console.log('🧪 Testing Draft API...\n');
  
  const testToken = '348fce5a-40fa-4626-9b79-9a7e00960aee'; // Latest token from DB
  const baseURL = 'http://localhost:3000';
  
  try {
    console.log('🔍 Testing metadata API...');
    console.log('Token:', testToken);
    console.log('URL:', `${baseURL}/api/draft/${testToken}`);
    
    const metadataResponse = await fetch(`${baseURL}/api/draft/${testToken}`);
    console.log('📊 Metadata Response status:', metadataResponse.status);
    
    const metadataResult = await metadataResponse.json();
    console.log('📋 Metadata API Response:', JSON.stringify(metadataResult, null, 2));
    
    console.log('\n🔍 Testing data API...');
    console.log('URL:', `${baseURL}/api/draft/${testToken}/data`);
    
    const dataResponse = await fetch(`${baseURL}/api/draft/${testToken}/data`);
    console.log('📊 Data Response status:', dataResponse.status);
    
    const dataResult = await dataResponse.json();
    console.log('📋 Data API Response:', JSON.stringify(dataResult, null, 2));
    
    if (dataResult.success && dataResult.exists) {
      console.log('\n✅ Data API Test Results:');
      console.log('   Email:', dataResult.email);
      console.log('   Type:', dataResult.submissionType);
      console.log('   Step:', dataResult.currentStep);
      console.log('   School Name:', dataResult.formData?.schoolName);
      console.log('   Form Data Keys:', Object.keys(dataResult.formData || {}));
      
      console.log('\n🔗 Test URLs:');
      console.log('   Metadata API:', `${baseURL}/api/draft/${testToken}`);
      console.log('   Data API:', `${baseURL}/api/draft/${testToken}/data`);
      console.log('   Form with token:', `${baseURL}/regist100?token=${testToken}`);
      
    } else {
      console.log('\n❌ Data API Test Failed:');
      console.log('   Success:', dataResult.success);
      console.log('   Exists:', dataResult.exists);
      console.log('   Message:', dataResult.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

// Run the test
testAPIDraft().catch(console.error);