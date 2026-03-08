#!/usr/bin/env node

/**
 * Test clean fields - ensure supportTypeTitle is removed and no duplicate data
 */

async function testCleanFields() {
  console.log('🧪 Testing clean fields (supportTypeTitle removed)...\n');
  
  // Test data without supportTypeTitle
  const testData = {
    email: 'clean-fields-test@example.com',
    phone: '0123456789',
    submissionType: 'register-support',
    currentStep: 1,
    formData: {
      supportType: 'กลุ่ม',
      supportTypeGroupName: 'กลุ่มทดสอบ clean fields',
      supportTypeMemberCount: '55',
      schoolName: 'โรงเรียนทดสอบ',
      schoolProvince: 'กรุงเทพมหานคร',
      schoolLevel: 'มัธยมศึกษา'
      // Note: supportTypeTitle should NOT be included
    }
  };
  
  console.log('📤 Saving draft without supportTypeTitle...');
  
  const response = await fetch('http://localhost:3000/api/draft/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData)
  });
  
  const result = await response.json();
  
  if (!result.success) {
    console.log('❌ FAILED: Could not save draft');
    console.log('Error:', result.message);
    return;
  }
  
  console.log('✅ Draft saved successfully');
  console.log('   Token:', result.draftToken);
  
  // Retrieve and verify clean data
  console.log('\n🔍 Verifying clean data structure...');
  
  const retrieveResponse = await fetch(`http://localhost:3000/api/draft/${result.draftToken}`);
  const retrieveResult = await retrieveResponse.json();
  
  if (!retrieveResult.success) {
    console.log('❌ FAILED: Could not retrieve draft');
    return;
  }
  
  const savedData = retrieveResult.formData;
  
  console.log('📊 Saved Form Data Structure:');
  console.log('   supportType:', `"${savedData.supportType}"`);
  console.log('   supportTypeGroupName:', `"${savedData.supportTypeGroupName}"`);
  console.log('   supportTypeMemberCount:', `"${savedData.supportTypeMemberCount}"`);
  console.log('   schoolName:', `"${savedData.schoolName}"`);
  
  // Check for removed field
  if ('supportTypeTitle' in savedData) {
    console.log('   supportTypeTitle:', `"${savedData.supportTypeTitle}"`, '← Should be REMOVED');
  } else {
    console.log('   supportTypeTitle: NOT PRESENT ✅');
  }
  
  // Check for other support type fields (should be empty)
  const otherFields = [
    'supportTypeSchoolName',
    'supportTypeClubName', 
    'supportTypeAssociationName',
    'supportTypeBandName'
  ];
  
  console.log('\n🔍 Other Support Type Fields (should be empty):');
  otherFields.forEach(fieldName => {
    const value = savedData[fieldName];
    if (value) {
      console.log(`   ${fieldName}: "${value}" ← Should be empty`);
    } else {
      console.log(`   ${fieldName}: empty ✅`);
    }
  });
  
  // Verification checks
  const checks = [
    {
      name: 'supportTypeTitle removed',
      pass: !('supportTypeTitle' in savedData),
      expected: 'Field not present',
      actual: 'supportTypeTitle' in savedData ? 'Field present' : 'Field not present'
    },
    {
      name: 'supportTypeGroupName has value',
      pass: savedData.supportTypeGroupName === 'กลุ่มทดสอบ clean fields',
      expected: 'กลุ่มทดสอบ clean fields',
      actual: savedData.supportTypeGroupName
    },
    {
      name: 'supportTypeMemberCount preserved',
      pass: savedData.supportTypeMemberCount === '55' || savedData.supportTypeMemberCount === 55,
      expected: '55',
      actual: savedData.supportTypeMemberCount
    },
    {
      name: 'Other support type fields empty',
      pass: !savedData.supportTypeSchoolName && 
            !savedData.supportTypeClubName && 
            !savedData.supportTypeAssociationName && 
            !savedData.supportTypeBandName,
      expected: 'All empty',
      actual: 'Checking...'
    }
  ];
  
  console.log('\n✅ Verification Results:');
  let allPassed = true;
  
  checks.forEach(check => {
    const status = check.pass ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${status} ${check.name}`);
    if (!check.pass) {
      console.log(`      Expected: ${check.expected}`);
      console.log(`      Actual: ${check.actual}`);
      allPassed = false;
    }
  });
  
  if (allPassed) {
    console.log('\n🎉 SUCCESS: Fields cleaned successfully!');
    console.log('\n📋 Benefits:');
    console.log('✅ No duplicate data (supportTypeTitle removed)');
    console.log('✅ Each support type has its own specific field');
    console.log('✅ Cleaner data structure');
    console.log('✅ Less confusion in form handling');
    console.log('✅ Member count preserved correctly');
    
    console.log('\n🎯 Current field structure:');
    console.log('- supportType: "กลุ่ม"');
    console.log('- supportTypeGroupName: "กลุ่มทดสอบ clean fields"');
    console.log('- supportTypeMemberCount: "55"');
    console.log('- Other supportType*Name fields: empty');
  } else {
    console.log('\n❌ FAILED: Some checks failed');
  }
}

testCleanFields().catch(console.error);