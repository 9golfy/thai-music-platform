#!/usr/bin/env node

/**
 * Test real user scenario - fill form, save draft, verify data
 */

async function testRealScenario() {
  console.log('🧪 Testing real user scenario...\n');
  
  // Scenario: User fills out form for "กลุ่ม" with member count
  console.log('👤 User Scenario: Fill out form for "กลุ่ม" with member count');
  
  const userFormData = {
    email: 'user-scenario@example.com',
    phone: '0812345678',
    submissionType: 'register-support',
    currentStep: 1,
    formData: {
      // Support type selection
      supportType: 'กลุ่ม',
      
      // Only the relevant field should have value
      supportTypeSchoolName: '',
      supportTypeClubName: '',
      supportTypeAssociationName: '',
      supportTypeGroupName: 'กลุ่มดนตรีไทยโรงเรียนสาธิต', // This should have value
      supportTypeBandName: '',
      
      // Member count as string (from text input)
      supportTypeMemberCount: '28',
      
      // Legacy field for backward compatibility
      supportTypeTitle: 'กลุ่มดนตรีไทยโรงเรียนสาธิต',
      
      // Basic school info
      schoolName: 'โรงเรียนสาธิตมหาวิทยาลัยเกษตรศาสตร์',
      schoolProvince: 'กรุงเทพมหานคร',
      schoolLevel: 'มัธยมศึกษา',
      affiliation: 'โรงเรียนสาธิต',
      
      // Contact info
      phone: '021234567',
      fax: '021234568',
      
      // Address
      addressNo: '123',
      moo: '5',
      road: 'ถนนพหลโยธิน',
      subDistrict: 'ลาดยาว',
      district: 'จตุจักร',
      provinceAddress: 'กรุงเทพมหานคร',
      postalCode: '10900'
    }
  };
  
  console.log('📝 User fills out form with:');
  console.log('   Support Type:', userFormData.formData.supportType);
  console.log('   Group Name:', userFormData.formData.supportTypeGroupName);
  console.log('   Member Count:', userFormData.formData.supportTypeMemberCount);
  console.log('   School Name:', userFormData.formData.schoolName);
  
  // Step 1: Save draft
  console.log('\n💾 Step 1: User clicks "Save Draft"...');
  
  const saveResponse = await fetch('http://localhost:3000/api/draft/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userFormData)
  });
  
  const saveResult = await saveResponse.json();
  
  if (!saveResult.success) {
    console.log('❌ FAILED: Could not save draft');
    console.log('Error:', saveResult.message);
    return;
  }
  
  console.log('✅ Draft saved successfully');
  console.log('   Token:', saveResult.draftToken);
  console.log('   Email sent:', saveResult.emailSent);
  
  // Step 2: Simulate user clicking email link
  console.log('\n📧 Step 2: User clicks link from email...');
  
  const linkResponse = await fetch(`http://localhost:3000/api/draft/${saveResult.draftToken}`);
  const linkResult = await linkResponse.json();
  
  if (!linkResult.success) {
    console.log('❌ FAILED: Could not access draft via link');
    return;
  }
  
  console.log('✅ Draft link accessible');
  console.log('   Email:', linkResult.email);
  console.log('   Submission Type:', linkResult.submissionType);
  console.log('   Current Step:', linkResult.currentStep);
  
  // Step 3: Verify all data is intact
  console.log('\n🔍 Step 3: Verify form data integrity...');
  
  const formData = linkResult.formData;
  
  console.log('📊 Retrieved Form Data:');
  console.log('   supportType:', `"${formData.supportType}"`);
  console.log('   supportTypeTitle:', `"${formData.supportTypeTitle}"`);
  console.log('   supportTypeGroupName:', `"${formData.supportTypeGroupName}"`);
  console.log('   supportTypeMemberCount:', `"${formData.supportTypeMemberCount}"`, '(type:', typeof formData.supportTypeMemberCount, ')');
  console.log('   schoolName:', `"${formData.schoolName}"`);
  console.log('   phone:', `"${formData.phone}"`);
  console.log('   addressNo:', `"${formData.addressNo}"`);
  
  // Verify critical fields
  const checks = [
    {
      name: 'Support Type',
      expected: 'กลุ่ม',
      actual: formData.supportType,
      pass: formData.supportType === 'กลุ่ม'
    },
    {
      name: 'Group Name',
      expected: 'กลุ่มดนตรีไทยโรงเรียนสาธิต',
      actual: formData.supportTypeGroupName,
      pass: formData.supportTypeGroupName === 'กลุ่มดนตรีไทยโรงเรียนสาธิต'
    },
    {
      name: 'Member Count',
      expected: '28',
      actual: formData.supportTypeMemberCount,
      pass: formData.supportTypeMemberCount === '28' || formData.supportTypeMemberCount === 28
    },
    {
      name: 'Support Type Title',
      expected: 'กลุ่มดนตรีไทยโรงเรียนสาธิต',
      actual: formData.supportTypeTitle,
      pass: formData.supportTypeTitle === 'กลุ่มดนตรีไทยโรงเรียนสาธิต'
    },
    {
      name: 'School Name',
      expected: 'โรงเรียนสาธิตมหาวิทยาลัยเกษตรศาสตร์',
      actual: formData.schoolName,
      pass: formData.schoolName === 'โรงเรียนสาธิตมหาวิทยาลัยเกษตรศาสตร์'
    },
    {
      name: 'Other Support Type Fields Empty',
      expected: 'All empty',
      actual: 'Checking...',
      pass: !formData.supportTypeSchoolName && 
            !formData.supportTypeClubName && 
            !formData.supportTypeAssociationName && 
            !formData.supportTypeBandName
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
    console.log('\n🎉 SUCCESS: All data integrity checks passed!');
    console.log('\n📋 Summary:');
    console.log('✅ Draft save: Working');
    console.log('✅ Email link: Working');
    console.log('✅ Data integrity: Working');
    console.log('✅ Field separation: Working');
    console.log('✅ Member count: Working (no NaN issues)');
    console.log('✅ Form restoration: Ready for frontend');
    
    console.log('\n🚀 The register-support save draft feature is fully functional!');
    console.log('   Users can now save drafts and restore them correctly.');
  } else {
    console.log('\n❌ FAILED: Some data integrity checks failed');
  }
}

testRealScenario().catch(console.error);