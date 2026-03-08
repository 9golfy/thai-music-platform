// Test basic API functionality
async function testBasicAPI() {
  const testId = '69abcc45bdfd421b3126102f';
  
  console.log('Testing Basic API...\n');
  
  try {
    console.log('1. Testing register-support detail API...');
    const detailResponse = await fetch(`http://localhost:3000/api/register-support/${testId}`);
    console.log(`   Detail Response Status: ${detailResponse.status}`);
    
    if (detailResponse.ok) {
      const data = await detailResponse.json();
      console.log(`   Data found: ${data.success ? 'Yes' : 'No'}`);
      if (data.submission) {
        console.log(`   School Name: ${data.submission.regsup_schoolName || data.submission.schoolName || 'N/A'}`);
        console.log(`   Total Score: ${data.submission.total_score || 0}`);
      }
      console.log('   ✅ Basic API working');
    } else {
      console.log('   ❌ Basic API failed');
      const errorData = await detailResponse.text();
      console.log(`   Error: ${errorData}`);
    }
  } catch (error) {
    console.log(`   ❌ Basic API error: ${error.message}`);
  }
  
  console.log('\nBasic API test completed!');
}

testBasicAPI();