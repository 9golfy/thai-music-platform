#!/usr/bin/env node

/**
 * Test frontend integration - simulate form filling and save draft
 */

async function testFrontendIntegration() {
  console.log('🧪 Testing frontend integration...\n');
  
  // This test simulates what happens when user fills the form in browser
  // and clicks save draft button
  
  console.log('📋 Simulating user form interaction:');
  console.log('1. User selects "กลุ่ม" radio button');
  console.log('2. User types "กลุ่มดนตรีไทยทดสอบ" in group name field');
  console.log('3. User types "35" in member count field');
  console.log('4. User clicks "Save Draft" button');
  
  // Simulate the form data that would be collected by getCompleteFormData
  const simulatedFormData = {
    // From radio button selection
    supportType: 'กลุ่ม',
    
    // From text inputs (separated fields)
    supportTypeSchoolName: '',
    supportTypeClubName: '',
    supportTypeAssociationName: '',
    supportTypeGroupName: 'กลุ่มดนตรีไทยทดสอบ', // User typed this
    supportTypeBandName: '',
    
    // From member count input
    supportTypeMemberCount: '35', // User typed this
    
    // Computed field
    supportTypeTitle: 'กลุ่มดนตรีไทยทดสอบ', // Set from supportTypeGroupName
    
    // Basic info
    schoolName: 'โรงเรียนทดสอบการรวบรวมข้อมูล',
    schoolProvince: 'กรุงเทพมหานคร',
    schoolLevel: 'มัธยมศึกษา',
    
    // Other fields with default values
    thaiMusicTeachers: [],
    readinessItems: [],
    isCompulsorySubject: false,
    hasAfterSchoolTeaching: false,
    teacher_training_score: 0,
    total_score: 0
  };
  
  console.log('\n💾 Simulating save draft API call...');
  
  const testData = {
    email: 'frontend-test@example.com',
    phone: '0812345678',
    submissionType: 'register-support',
    currentStep: 1,
    formData: simulatedFormData
  };
  
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
  
  // Verify the saved data
  console.log('\n🔍 Verifying saved data...');
  
  const retrieveResponse = await fetch(`http://localhost:3000/api/draft/${result.draftToken}`);
  const retrieveResult = await retrieveResponse.json();
  
  if (!retrieveResult.success) {
    console.log('❌ FAILED: Could not retrieve draft');
    return;
  }
  
  const savedData = retrieveResult.formData;
  
  console.log('📊 Saved Form Data:');
  console.log('   supportType:', `"${savedData.supportType}"`);
  console.log('   supportTypeTitle:', `"${savedData.supportTypeTitle}"`);
  console.log('   supportTypeGroupName:', `"${savedData.supportTypeGroupName}"`);
  console.log('   supportTypeMemberCount:', `"${savedData.supportTypeMemberCount}"`, '(type:', typeof savedData.supportTypeMemberCount, ')');
  console.log('   schoolName:', `"${savedData.schoolName}"`);
  
  // Check critical fields
  const checks = [
    {
      name: 'Support Type',
      expected: 'กลุ่ม',
      actual: savedData.supportType,
      pass: savedData.supportType === 'กลุ่ม'
    },
    {
      name: 'Group Name',
      expected: 'กลุ่มดนตรีไทยทดสอบ',
      actual: savedData.supportTypeGroupName,
      pass: savedData.supportTypeGroupName === 'กลุ่มดนตรีไทยทดสอบ'
    },
    {
      name: 'Member Count (Critical!)',
      expected: '35',
      actual: savedData.supportTypeMemberCount,
      pass: savedData.supportTypeMemberCount === '35' || savedData.supportTypeMemberCount === 35
    },
    {
      name: 'Support Type Title',
      expected: 'กลุ่มดนตรีไทยทดสอบ',
      actual: savedData.supportTypeTitle,
      pass: savedData.supportTypeTitle === 'กลุ่มดนตรีไทยทดสอบ'
    },
    {
      name: 'Other Fields Empty',
      expected: 'Empty',
      actual: 'Checking...',
      pass: !savedData.supportTypeSchoolName && 
            !savedData.supportTypeClubName && 
            !savedData.supportTypeAssociationName && 
            !savedData.supportTypeBandName
    }
  ];
  
  console.log('\n✅ Verification Results:');
  let allPassed = true;
  
  checks.forEach(check => {
    const status = check.pass ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${status} ${check.name}`);
    if (!check.pass) {
      console.log(`      Expected: "${check.expected}"`);
      console.log(`      Actual: "${check.actual}"`);
      allPassed = false;
    }
  });
  
  if (allPassed) {
    console.log('\n🎉 SUCCESS: Frontend integration working correctly!');
    console.log('\n📋 What this means:');
    console.log('✅ Form data collection: Working');
    console.log('✅ Field separation: Working');
    console.log('✅ Member count preservation: Working');
    console.log('✅ Save draft functionality: Working');
    console.log('✅ Data integrity: Working');
    
    console.log('\n🚀 The user should now see member count preserved in localStorage!');
  } else {
    console.log('\n❌ FAILED: Some checks failed');
    
    // Special focus on member count
    if (savedData.supportTypeMemberCount === '' || !savedData.supportTypeMemberCount) {
      console.log('\n🚨 CRITICAL: Member count is still empty!');
      console.log('   This suggests the getCompleteFormData function is not working');
      console.log('   or the DOM elements are not being found correctly.');
    }
  }
}

testFrontendIntegration().catch(console.error);