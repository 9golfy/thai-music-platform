#!/usr/bin/env node

/**
 * Test field clearing when switching support types
 */

async function testFieldClearing() {
  console.log('🧪 Testing field clearing when switching support types...\n');
  
  // Test Case 1: Switch from ชุมนุม to ชมรม
  console.log('📋 Test Case 1: ชุมนุม → ชมรม');
  
  const testData1 = {
    email: 'test-clearing@example.com',
    phone: '0123456789',
    submissionType: 'register-support',
    currentStep: 1,
    formData: {
      supportType: 'ชมรม', // Changed to ชมรม
      
      // Should be cleared (from previous ชุมนุม selection)
      supportTypeClubName: '',
      
      // Should have value (current selection)
      supportTypeAssociationName: 'ชมรมดนตรีไทยใหม่',
      
      // Should be empty (other types)
      supportTypeSchoolName: '',
      supportTypeGroupName: '',
      supportTypeBandName: '',
      
      // Should have value
      supportTypeMemberCount: '42',
      supportTypeTitle: 'ชมรมดนตรีไทยใหม่',
      
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
    console.log('✅ Saved draft for ชมรม test');
    
    // Retrieve and verify
    const retrieveResponse = await fetch(`http://localhost:3000/api/draft/${result1.draftToken}`);
    const retrieveResult = await retrieveResponse.json();
    
    if (retrieveResult.success) {
      const formData = retrieveResult.formData;
      
      console.log('🔍 Verification Results:');
      console.log('   supportType:', formData.supportType);
      console.log('   supportTypeTitle:', formData.supportTypeTitle);
      console.log('   supportTypeAssociationName:', formData.supportTypeAssociationName);
      console.log('   supportTypeClubName:', formData.supportTypeClubName || '(empty)');
      console.log('   supportTypeSchoolName:', formData.supportTypeSchoolName || '(empty)');
      console.log('   supportTypeGroupName:', formData.supportTypeGroupName || '(empty)');
      console.log('   supportTypeBandName:', formData.supportTypeBandName || '(empty)');
      
      // Check if only the correct field has value
      const hasCorrectValue = formData.supportTypeAssociationName === 'ชมรมดนตรีไทยใหม่';
      const otherFieldsEmpty = !formData.supportTypeClubName && 
                              !formData.supportTypeSchoolName && 
                              !formData.supportTypeGroupName && 
                              !formData.supportTypeBandName;
      
      if (hasCorrectValue && otherFieldsEmpty) {
        console.log('✅ Test Case 1 PASSED: Only ชมรม field has value, others are empty');
      } else {
        console.log('❌ Test Case 1 FAILED: Incorrect field values');
      }
    }
  } else {
    console.log('❌ Failed to save draft for test case 1');
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test Case 2: Switch to สถานศึกษา (should clear member count)
  console.log('📋 Test Case 2: สถานศึกษา (should not have member count)');
  
  const testData2 = {
    email: 'test-school@example.com',
    phone: '0987654321',
    submissionType: 'register-support',
    currentStep: 1,
    formData: {
      supportType: 'สถานศึกษา',
      
      // Should have value (current selection)
      supportTypeSchoolName: 'โรงเรียนสาธิตมหาวิทยาลัย',
      
      // Should be empty (other types)
      supportTypeClubName: '',
      supportTypeAssociationName: '',
      supportTypeGroupName: '',
      supportTypeBandName: '',
      
      // Should be empty for สถานศึกษา
      supportTypeMemberCount: undefined,
      supportTypeTitle: 'โรงเรียนสาธิตมหาวิทยาลัย',
      
      schoolName: 'โรงเรียนผู้สมัคร',
      schoolProvince: 'นครปฐม',
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
    console.log('✅ Saved draft for สถานศึกษา test');
    
    // Retrieve and verify
    const retrieveResponse = await fetch(`http://localhost:3000/api/draft/${result2.draftToken}`);
    const retrieveResult = await retrieveResponse.json();
    
    if (retrieveResult.success) {
      const formData = retrieveResult.formData;
      
      console.log('🔍 Verification Results:');
      console.log('   supportType:', formData.supportType);
      console.log('   supportTypeTitle:', formData.supportTypeTitle);
      console.log('   supportTypeSchoolName:', formData.supportTypeSchoolName);
      console.log('   supportTypeMemberCount:', formData.supportTypeMemberCount || '(empty)');
      
      // Check if school field has value and member count is empty
      const hasCorrectValue = formData.supportTypeSchoolName === 'โรงเรียนสาธิตมหาวิทยาลัย';
      const noMemberCount = !formData.supportTypeMemberCount;
      
      if (hasCorrectValue && noMemberCount) {
        console.log('✅ Test Case 2 PASSED: สถานศึกษา field has value, member count is empty');
      } else {
        console.log('❌ Test Case 2 FAILED: Incorrect field values');
      }
    }
  } else {
    console.log('❌ Failed to save draft for test case 2');
  }
  
  console.log('\n🎯 Field clearing tests completed!');
}

testFieldClearing().catch(console.error);