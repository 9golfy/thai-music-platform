#!/usr/bin/env node

/**
 * Test script for register-support draft save functionality
 */

const API_BASE = 'http://localhost:3000';

// Test data for register-support form
const testFormData = {
  // Step 1: School Information
  schoolName: 'โรงเรียนทดสอบ register-support',
  schoolProvince: 'กรุงเทพมหานคร',
  schoolLevel: 'มัธยมศึกษา',
  schoolType: 'รัฐบาล',
  
  // Step 2: Management Information
  mgtFullName: 'นายผู้บริหาร ทดสอบ',
  mgtPosition: 'ผู้อำนวยการ',
  mgtPhone: '0812345678',
  mgtEmail: 'manager@test.com',
  
  // Step 3: Thai Music Teachers
  thaiMusicTeachers: [
    {
      fullName: 'นายครู ดนตรีไทย',
      position: 'ครูดนตรีไทย',
      phone: '0823456789',
      email: 'teacher@test.com'
    }
  ],
  
  // Default values for other fields
  readinessItems: [],
  inClassInstructionDurations: [],
  outOfClassInstructionDurations: [],
  supportFactors: [],
  supportFromOrg: [],
  supportFromExternal: [],
  awards: [],
  activitiesWithinProvinceInternal: [],
  activitiesWithinProvinceExternal: [],
  activitiesOutsideProvince: [],
  prActivities: [],
  isCompulsorySubject: false,
  hasAfterSchoolTeaching: false,
  hasElectiveSubject: false,
  hasLocalCurriculum: false,
  hasSupportFromOrg: false,
  hasSupportFromExternal: false,
  DCP_PR_Channel_FACEBOOK: false,
  DCP_PR_Channel_YOUTUBE: false,
  DCP_PR_Channel_Tiktok: false,
  heardFromOther: false,
  certifiedINFOByAdminName: false,
  teacher_training_score: 0,
  teacher_qualification_score: 0,
  support_from_org_score: 0,
  support_from_external_score: 0,
  award_score: 0,
  activity_within_province_internal_score: 0,
  activity_within_province_external_score: 0,
  activity_outside_province_score: 0,
  pr_activity_score: 0,
  total_score: 0,
};

async function testRegisterSupportDraftSave() {
  console.log('🧪 Testing Register-Support Draft Save...');
  
  try {
    // Test draft save
    const saveResponse = await fetch(`${API_BASE}/api/draft/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-regist-support@example.com',
        phone: '0812345678',
        submissionType: 'register-support',
        formData: testFormData,
        currentStep: 2,
      }),
    });
    
    const saveResult = await saveResponse.json();
    console.log('📤 Draft Save Response:', {
      status: saveResponse.status,
      success: saveResult.success,
      message: saveResult.message,
      token: saveResult.draftToken?.substring(0, 8) + '...',
      emailSent: saveResult.emailSent,
    });
    
    if (!saveResult.success) {
      console.error('❌ Draft save failed:', saveResult.message);
      return;
    }
    
    const draftToken = saveResult.draftToken;
    
    // Test draft metadata retrieval
    console.log('\n🔍 Testing draft metadata retrieval...');
    const metadataResponse = await fetch(`${API_BASE}/api/draft/${draftToken}`);
    const metadataResult = await metadataResponse.json();
    
    console.log('📋 Draft Metadata:', {
      status: metadataResponse.status,
      exists: metadataResult.exists,
      email: metadataResult.email,
      submissionType: metadataResult.submissionType,
      currentStep: metadataResult.currentStep,
    });
    
    // Test draft data retrieval
    console.log('\n📊 Testing draft data retrieval...');
    const dataResponse = await fetch(`${API_BASE}/api/draft/${draftToken}/data`);
    const dataResult = await dataResponse.json();
    
    console.log('📊 Draft Data:', {
      status: dataResponse.status,
      success: dataResult.success,
      exists: dataResult.exists,
      schoolName: dataResult.formData?.schoolName,
      mgtFullName: dataResult.formData?.mgtFullName,
      teacherCount: dataResult.formData?.thaiMusicTeachers?.length || 0,
    });
    
    console.log('\n✅ Register-Support draft save test completed successfully!');
    console.log('🎯 Key findings:');
    console.log(`   - Draft token: ${draftToken}`);
    console.log(`   - Email sent: ${saveResult.emailSent}`);
    console.log(`   - School name preserved: ${dataResult.formData?.schoolName === testFormData.schoolName}`);
    console.log(`   - Submission type: ${metadataResult.submissionType}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testRegisterSupportDraftSave();