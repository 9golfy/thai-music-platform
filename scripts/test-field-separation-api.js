async function testFieldSeparationViaAPI() {
  console.log('🔍 Testing field separation via API...\n');
  
  // Test with a known token (you can replace this with a real token)
  const testTokens = [
    '2434dcd5-e303-4c4a-b333-07aebe2b6380',
    '662e4f77-067a-488c-9343-50fbb93526b1',
    '4023290d-1df5-4141-b341-68fe112d782f'
  ];
  
  for (const token of testTokens) {
    try {
      console.log(`📋 Testing token: ${token}`);
      
      const response = await fetch(`http://localhost:3000/api/draft/${token}/data`);
      const result = await response.json();
      
      if (result.success && result.exists) {
        console.log(`   ✅ Draft found`);
        console.log(`   Email: ${result.email}`);
        console.log(`   Submission Type: ${result.submissionType}`);
        console.log(`   Support Type: ${result.formData?.supportType || 'N/A'}`);
        console.log(`   Support Type Name: "${result.formData?.supportTypeName || 'N/A'}"`);
        console.log(`   School Name: "${result.formData?.schoolName || 'N/A'}"`);
        
        // Check for field confusion
        if (result.formData?.supportTypeName === result.formData?.schoolName) {
          console.log(`   ⚠️  POTENTIAL ISSUE: supportTypeName matches schoolName`);
        } else if (result.formData?.supportTypeName && result.formData?.schoolName) {
          console.log(`   ✅ GOOD: Fields are properly separated`);
        }
        
      } else {
        console.log(`   ❌ Draft not found or expired`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

testFieldSeparationViaAPI();