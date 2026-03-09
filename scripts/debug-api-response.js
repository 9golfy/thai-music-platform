async function debugAPIResponse() {
  try {
    const submissionId = '69ad7476fcaa2809454bab85';
    const response = await fetch(`http://localhost:3000/api/register-support/${submissionId}`);
    
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('📡 Raw Response:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('📡 Parsed JSON:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.log('❌ JSON Parse Error:', parseError.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugAPIResponse();