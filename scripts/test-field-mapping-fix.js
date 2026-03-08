#!/usr/bin/env node

/**
 * Test field mapping fix
 */

async function testFieldMappingFix() {
  const token = '662e4f77-067a-488c-9343-50fbb93526b1';
  console.log('🧪 Testing field mapping fix for token:', token);
  
  try {
    // Get draft data (simulate what frontend does)
    const dataResponse = await fetch(`http://localhost:3000/api/draft/${token}/data`);
    const dataResult = await dataResponse.json();
    
    console.log('📊 Raw data from API:');
    console.log('=====================================');
    console.log('supportType:', dataResult.formData?.supportType);
    console.log('schoolName:', dataResult.formData?.schoolName);
    console.log('supportTypeName:', dataResult.formData?.supportTypeName);
    
    // Simulate the field mapping logic we added
    console.log('\n🔄 Applying field mapping logic:');
    console.log('=====================================');
    
    const processedData = { ...dataResult.formData };
    
    // Handle supportType and supportTypeName mapping
    if (processedData.supportType === 'สถานศึกษา' && processedData.schoolName) {
      // For "สถานศึกษา" type, the school name should be in supportTypeName field
      processedData.supportTypeName = processedData.schoolName;
      console.log('✅ Mapped schoolName to supportTypeName:', processedData.schoolName);
    }
    
    console.log('\n📊 Processed data for form:');
    console.log('=====================================');
    console.log('supportType:', processedData.supportType);
    console.log('schoolName:', processedData.schoolName);
    console.log('supportTypeName:', processedData.supportTypeName);
    
    console.log('\n🎯 Expected form behavior:');
    console.log('=====================================');
    console.log('1. Radio button "สถานศึกษา" should be selected ✅');
    console.log('2. Text input for "ระบุชื่อสถานศึกษา" should show:', processedData.supportTypeName);
    console.log('3. Text input for "ชื่อสถานศึกษา" should show:', processedData.schoolName);
    
    console.log('\n🔗 Test this URL:');
    console.log(`http://localhost:3000/draft/${token}`);
    console.log('📧 Check email for OTP (expires at 10:04)');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFieldMappingFix();