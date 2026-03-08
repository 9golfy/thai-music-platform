/**
 * Test script to verify form data is being saved correctly
 */

const API_URL = 'http://localhost:3000';
const EMAIL = '9golfy@gmail.com';
const PHONE = '0899297983';

// Test data with school name
const testFormData = {
  schoolName: 'โรงเรียนทดสอบ Script',
  schoolProvince: 'กรุงเทพมหานคร',
  schoolLevel: 'มัธยมศึกษา',
  affiliation: 'รัฐบาล',
  // Add other fields as empty to match form structure
  studentCountByGrade: '',
  addressNo: '',
  moo: '',
  road: '',
  subDistrict: '',
  district: '',
  provinceAddress: '',
  postalCode: '',
  phone: '',
  fax: '',
  // Arrays
  thaiMusicTeachers: [],
  currentMusicTypes: [],
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
  // Booleans
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
  // Scores
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

async function testFormDataSave() {
  console.log('🧪 Testing Form Data Save...\n');
  
  try {
    console.log('📝 Sending form data:');
    console.log('   School Name:', testFormData.schoolName);
    console.log('   School Province:', testFormData.schoolProvince);
    console.log('   School Level:', testFormData.schoolLevel);
    
    const response = await fetch(`${API_URL}/api/draft/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: EMAIL,
        phone: PHONE,
        submissionType: 'register100',
        formData: testFormData,
        currentStep: 1,
      }),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      console.error('❌ Failed to save:', result.message);
      return;
    }
    
    console.log('\n✅ Draft saved successfully!');
    console.log('   Token:', result.draftToken);
    
    // Check MongoDB immediately
    console.log('\n🔍 Checking MongoDB...');
    const { MongoClient } = require('mongodb');
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
    const client = new MongoClient(MONGODB_URI);
    
    await client.connect();
    const db = client.db();
    const draft = await db.collection('draft_submissions').findOne({
      draftToken: result.draftToken.toLowerCase(),
    });
    
    if (draft && draft.formData) {
      console.log('✅ Found in MongoDB:');
      console.log('   School Name:', draft.formData.schoolName);
      console.log('   School Province:', draft.formData.schoolProvince);
      console.log('   School Level:', draft.formData.schoolLevel);
      
      if (draft.formData.schoolName === testFormData.schoolName) {
        console.log('\n🎉 SUCCESS! Form data saved correctly!');
      } else {
        console.log('\n❌ FAILED! School name mismatch:');
        console.log('   Expected:', testFormData.schoolName);
        console.log('   Got:', draft.formData.schoolName);
      }
    } else {
      console.log('❌ No form data found in MongoDB');
    }
    
    await client.close();
    
    console.log('\n📋 Next steps:');
    console.log('1. Check email for OTP');
    console.log('2. Open:', `${API_URL}/draft/${result.draftToken}`);
    console.log('3. Enter OTP and verify data restoration');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFormDataSave();