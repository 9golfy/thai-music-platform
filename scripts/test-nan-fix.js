#!/usr/bin/env node

/**
 * Test NaN fix - ensure member count is saved correctly
 */

async function testNaNFix() {
  console.log('🧪 Testing NaN fix for member count...\n');
  
  // Test Case 1: Save with valid member count
  console.log('📋 Test Case 1: Valid member count');
  
  const testData1 = {
    email: 'test-nan-fix@example.com',
    phone: '0123456789',
    submissionType: 'register-support',
    currentStep: 1,
    formData: {
      supportType: 'กลุ่ม',
      supportTypeGroupName: 'กลุ่มทดสอบ',
      supportTypeMemberCount: '42', // Valid number as string
      schoolName: 'โรงเรียนทดสอบ',
      schoolProvince: 'กรุงเทพมหานคร',
      schoolLevel: 'มัธยมศึกษา'
    }
  };
  
  const response1 = await fetch('http://localhost:3000/api/draft/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData1)
  });
  
  const result1 = await response1.json();
  
  if (result1.success) {
    console.log('✅ Saved draft with valid member count');
    
    // Retrieve and verify
    const retrieveResponse = await fetch(`http://localhost:3000/api/draft/${result1.draftToken}`);
    const retrieveResult = await retrieveResponse.json();
    
    if (retrieveResult.success) {
      const memberCount = retrieveResult.formData.supportTypeMemberCount;
      console.log('🔍 Retrieved member count:', `"${memberCount}"`, '(type:', typeof memberCount, ')');
      
      if (memberCount === '42' || memberCount === 42) {
        console.log('✅ Test Case 1 PASSED: Valid member count saved correctly');
      } else {
        console.log('❌ Test Case 1 FAILED: Member count incorrect');
        console.log('   Expected: "42" or 42, Got:', memberCount);
      }
    }
  } else {
    console.log('❌ Failed to save draft for test case 1');
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test Case 2: Save with empty member count
  console.log('📋 Test Case 2: Empty member count');
  
  const testData2 = {
    email: 'test-empty@example.com',
    phone: '0987654321',
    submissionType: 'register-support',
    currentStep: 1,
    formData: {
      supportType: 'ชมรม',
      supportTypeAssociationName: 'ชมรมทดสอบ',
      supportTypeMemberCount: '', // Empty string
      schoolName: 'โรงเรียนทดสอบ',
      schoolProvince: 'กรุงเทพมหานคร',
      schoolLevel: 'มัธยมศึกษา'
    }
  };
  
  const response2 = await fetch('http://localhost:3000/api/draft/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData2)
  });
  
  const result2 = await response2.json();
  
  if (result2.success) {
    console.log('✅ Saved draft with empty member count');
    
    // Retrieve and verify
    const retrieveResponse = await fetch(`http://localhost:3000/api/draft/${result2.draftToken}`);
    const retrieveResult = await retrieveResponse.json();
    
    if (retrieveResult.success) {
      const memberCount = retrieveResult.formData.supportTypeMemberCount;
      console.log('🔍 Retrieved member count:', `"${memberCount}"`, '(type:', typeof memberCount, ')');
      
      if (memberCount === '' || memberCount === null || memberCount === undefined) {
        console.log('✅ Test Case 2 PASSED: Empty member count handled correctly');
      } else {
        console.log('❌ Test Case 2 FAILED: Empty member count should be empty string');
        console.log('   Expected: "" or null or undefined, Got:', memberCount);
      }
    }
  } else {
    console.log('❌ Failed to save draft for test case 2');
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test Case 3: Test JSON.stringify behavior with NaN
  console.log('📋 Test Case 3: JSON.stringify behavior test');
  
  const testObject = {
    validNumber: 42,
    nanValue: NaN,
    undefinedValue: undefined,
    nullValue: null,
    emptyString: '',
    validString: 'test'
  };
  
  console.log('🔍 Original object:', testObject);
  console.log('🔍 JSON.stringify result:', JSON.stringify(testObject));
  
  // Show what happens with NaN
  const parsedBack = JSON.parse(JSON.stringify(testObject));
  console.log('🔍 Parsed back:', parsedBack);
  console.log('🔍 NaN became:', parsedBack.nanValue, '(type:', typeof parsedBack.nanValue, ')');
  console.log('🔍 undefined became:', parsedBack.undefinedValue, '(exists:', 'undefinedValue' in parsedBack, ')');
  
  console.log('\n🎯 NaN fix tests completed!');
  console.log('\n📝 Summary:');
  console.log('- NaN values in JSON.stringify become null or disappear');
  console.log('- undefined values disappear completely');
  console.log('- Our sanitization converts both to empty strings');
  console.log('- This prevents data loss during save/restore');
}

testNaNFix().catch(console.error);