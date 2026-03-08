#!/usr/bin/env node

/**
 * Test fixed field mapping logic
 */

async function testFixedLogic() {
  const token = '2434dcd5-e303-4c4a-b333-07aebe2b6380';
  console.log('🧪 Testing fixed logic for token:', token);
  
  try {
    // Get draft data
    const dataResponse = await fetch(`http://localhost:3000/api/draft/${token}/data`);
    const dataResult = await dataResponse.json();
    
    console.log('📊 Raw data from API:');
    console.log('=====================================');
    console.log('supportType:', dataResult.formData?.supportType);
    console.log('schoolName:', dataResult.formData?.schoolName);
    console.log('supportTypeName:', `"${dataResult.formData?.supportTypeName}"`);
    
    // Simulate the FIXED field mapping logic
    console.log('\n🔄 Applying FIXED field mapping logic:');
    console.log('=====================================');
    
    const processedData = { ...dataResult.formData };
    
    // Handle supportType and supportTypeName mapping
    // Only map schoolName to supportTypeName if supportType is "สถานศึกษา" 
    // AND supportTypeName is empty AND schoolName has value
    if (processedData.supportType === 'สถานศึกษา' && 
        processedData.schoolName && 
        (!processedData.supportTypeName || processedData.supportTypeName.trim() === '')) {
      // For "สถานศึกษา" type, the school name should be in supportTypeName field
      processedData.supportTypeName = processedData.schoolName;
      console.log('✅ Mapped schoolName to supportTypeName:', processedData.schoolName);
    } else {
      console.log('❌ No mapping needed or conditions not met:');
      console.log('   - supportType === "สถานศึกษา":', processedData.supportType === 'สถานศึกษา');
      console.log('   - schoolName has value:', !!processedData.schoolName);
      console.log('   - supportTypeName is empty:', !processedData.supportTypeName || processedData.supportTypeName.trim() === '');
    }
    
    console.log('\n📊 Processed data for form:');
    console.log('=====================================');
    console.log('supportType:', processedData.supportType);
    console.log('schoolName:', processedData.schoolName);
    console.log('supportTypeName:', `"${processedData.supportTypeName}"`);
    
    console.log('\n🎯 Expected form behavior:');
    console.log('=====================================');
    console.log('1. Radio button "สถานศึกษา" should be selected ✅');
    console.log('2. Text input for "ระบุชื่อสถานศึกษา" should show:', `"${processedData.supportTypeName}"`);
    console.log('3. Text input for "ชื่อสถานศึกษา" should show:', `"${processedData.schoolName}"`);
    console.log('4. Other radio buttons should NOT have any text in their input fields');
    
    // Test what happens with other support types (simulate)
    console.log('\n🧪 Testing other support types (simulation):');
    console.log('=====================================');
    
    const testCases = [
      { supportType: 'ชุมนุม', supportTypeName: 'ชุมนุมทดสอบ', schoolName: 'VVVVVVVVVVVVVVVVVVVVVVVV' },
      { supportType: 'ชมรม', supportTypeName: '', schoolName: 'VVVVVVVVVVVVVVVVVVVVVVVV' },
      { supportType: 'กลุ่ม', supportTypeName: 'กลุ่มทดสอบ', schoolName: 'VVVVVVVVVVVVVVVVVVVVVVVV' }
    ];
    
    testCases.forEach((testCase, i) => {
      const testData = { ...testCase };
      
      if (testData.supportType === 'สถานศึกษา' && 
          testData.schoolName && 
          (!testData.supportTypeName || testData.supportTypeName.trim() === '')) {
        testData.supportTypeName = testData.schoolName;
        console.log(`Test ${i + 1} (${testCase.supportType}): ✅ Would map schoolName to supportTypeName`);
      } else {
        console.log(`Test ${i + 1} (${testCase.supportType}): ❌ No mapping (correct)`);
      }
      
      console.log(`   Result: supportTypeName = "${testData.supportTypeName}"`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFixedLogic();