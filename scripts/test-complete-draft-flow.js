/**
 * Complete Draft Flow Test Script
 * 
 * This script helps test the complete draft save and restore flow
 */

console.log('🧪 Complete Draft Flow Test');
console.log('===========================');

// Test data
const testData = {
  schoolName: "โรงเรียนทดสอบ 2026",
  schoolProvince: "กรุงเทพมหานคร", 
  schoolLevel: "มัธยมศึกษา",
  affiliation: "รัฐบาล"
};

console.log('📋 Test data:', testData);

// Function to simulate saving draft to localStorage
function simulateDraftSave() {
  const draftData = {
    draftToken: "test-token-" + Date.now(),
    email: "test@example.com",
    phone: "0899297983", 
    submissionType: "register100",
    formData: testData,
    currentStep: 1,
    savedAt: Date.now(),
    syncedAt: Date.now()
  };
  
  localStorage.setItem('draft_register100', JSON.stringify(draftData));
  console.log('✅ Simulated draft saved to localStorage');
  return draftData;
}

// Function to check localStorage
function checkLocalStorage() {
  const data = localStorage.getItem('draft_register100');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      console.log('✅ Draft found in localStorage:', parsed);
      return parsed;
    } catch (e) {
      console.log('❌ Error parsing localStorage data:', e);
      return null;
    }
  } else {
    console.log('❌ No draft found in localStorage');
    return null;
  }
}

// Function to check form fields
function checkFormFields() {
  console.log('\n🔍 Checking form fields...');
  
  const schoolNameInput = document.querySelector('input[name="schoolName"]');
  const schoolProvinceSelect = document.querySelector('select[name="schoolProvince"]');
  const schoolLevelSelect = document.querySelector('select[name="schoolLevel"]');
  const affiliationSelect = document.querySelector('select[name="affiliation"]');
  
  const results = {
    schoolName: schoolNameInput ? schoolNameInput.value : 'NOT FOUND',
    schoolProvince: schoolProvinceSelect ? schoolProvinceSelect.value : 'NOT FOUND',
    schoolLevel: schoolLevelSelect ? schoolLevelSelect.value : 'NOT FOUND',
    affiliation: affiliationSelect ? affiliationSelect.value : 'NOT FOUND'
  };
  
  console.log('📊 Form field values:', results);
  
  // Check if any fields are populated
  const populatedFields = Object.entries(results).filter(([k, v]) => v && v !== 'NOT FOUND' && v !== '');
  console.log(`✅ Populated fields: ${populatedFields.length}/4`);
  
  return results;
}

// Main test function
function runCompleteTest() {
  console.log('\n🚀 Running complete test...');
  
  // Step 1: Check current localStorage
  console.log('\n1️⃣ Checking current localStorage:');
  checkLocalStorage();
  
  // Step 2: Simulate draft save
  console.log('\n2️⃣ Simulating draft save:');
  simulateDraftSave();
  
  // Step 3: Check form fields
  console.log('\n3️⃣ Checking form fields:');
  checkFormFields();
  
  console.log('\n📝 Instructions:');
  console.log('1. Refresh the page to trigger form restoration');
  console.log('2. Check browser console for restoration logs');
  console.log('3. Run checkFormFields() again to see if data was restored');
  console.log('4. If fields are still empty, check the console logs for errors');
}

// Export functions to global scope
window.simulateDraftSave = simulateDraftSave;
window.checkLocalStorage = checkLocalStorage;
window.checkFormFields = checkFormFields;
window.runCompleteTest = runCompleteTest;

console.log('\n💡 Available functions:');
console.log('- runCompleteTest() - Run complete test');
console.log('- simulateDraftSave() - Save test data to localStorage');
console.log('- checkLocalStorage() - Check localStorage content');
console.log('- checkFormFields() - Check current form field values');

// Auto-run if on the correct page
if (window.location.pathname.includes('/regist100')) {
  console.log('\n🎯 Detected register100 page, running auto-check...');
  setTimeout(() => {
    checkLocalStorage();
    checkFormFields();
  }, 1000);
}