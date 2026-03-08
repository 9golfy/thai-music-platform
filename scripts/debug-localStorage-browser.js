/**
 * Debug LocalStorage in Browser
 * 
 * Copy and paste this code into browser console to debug localStorage
 */

console.log('🔍 Debugging LocalStorage in Browser...\n');

// Function to check localStorage
function debugLocalStorage() {
  console.log('📱 LocalStorage Contents:');
  console.log('─'.repeat(50));
  
  // Check all localStorage keys
  const keys = Object.keys(localStorage);
  console.log('🔑 All keys:', keys);
  
  // Check specific draft keys
  const register100Draft = localStorage.getItem('draft_register100');
  const registerSupportDraft = localStorage.getItem('draft_register-support');
  const consent100 = localStorage.getItem('register100_consent_accepted');
  const consentSupport = localStorage.getItem('REGISTER_SUPPORT_consent_accepted');
  
  console.log('\n📋 Draft Data:');
  if (register100Draft) {
    try {
      const data = JSON.parse(register100Draft);
      console.log('✅ register100 draft found:');
      console.log('   📧 Email:', data.email);
      console.log('   🎫 Token:', data.draftToken);
      console.log('   📝 Type:', data.submissionType);
      console.log('   📍 Step:', data.currentStep);
      console.log('   💾 Saved:', new Date(data.savedAt).toLocaleString());
      console.log('   🔄 Synced:', data.syncedAt ? new Date(data.syncedAt).toLocaleString() : 'Never');
      
      // Check form data
      const formData = data.formData || {};
      const nonEmptyFields = Object.entries(formData)
        .filter(([key, value]) => value && value !== '' && value !== 0 && value !== false)
        .filter(([key, value]) => !Array.isArray(value) || value.length > 0);
      
      console.log('   📊 Form fields with data:', nonEmptyFields.length);
      nonEmptyFields.forEach(([key, value]) => {
        if (key === 'schoolName') {
          console.log(`   🏫 ${key}: "${value}"`);
        } else if (Array.isArray(value)) {
          console.log(`   📝 ${key}: [${value.length} items]`);
        } else {
          const displayValue = String(value).length > 30 
            ? String(value).substring(0, 30) + '...' 
            : String(value);
          console.log(`   📝 ${key}: ${displayValue}`);
        }
      });
    } catch (e) {
      console.log('❌ register100 draft: Invalid JSON');
    }
  } else {
    console.log('❌ No register100 draft found');
  }
  
  if (registerSupportDraft) {
    console.log('✅ register-support draft found');
  } else {
    console.log('❌ No register-support draft found');
  }
  
  console.log('\n🔒 Consent Status:');
  console.log('   register100:', consent100 === 'true' ? '✅ Accepted' : '❌ Not accepted');
  console.log('   register-support:', consentSupport === 'true' ? '✅ Accepted' : '❌ Not accepted');
  
  return {
    register100Draft: register100Draft ? JSON.parse(register100Draft) : null,
    registerSupportDraft: registerSupportDraft ? JSON.parse(registerSupportDraft) : null,
    consent100: consent100 === 'true',
    consentSupport: consentSupport === 'true'
  };
}

// Function to test form restoration
function testFormRestoration() {
  console.log('\n🧪 Testing Form Restoration...');
  console.log('─'.repeat(50));
  
  // Simulate getDraftFromLocal
  function getDraftFromLocal(submissionType) {
    const key = `draft_${submissionType}`;
    const jsonData = localStorage.getItem(key);
    
    if (!jsonData) {
      console.log(`❌ No data found for key: ${key}`);
      return null;
    }
    
    try {
      const data = JSON.parse(jsonData);
      
      // Validate the data structure
      if (!data.email || !data.submissionType || !data.formData || typeof data.currentStep !== 'number') {
        console.log('⚠️ Invalid draft data structure');
        return null;
      }
      
      console.log(`✅ Valid draft data found for: ${submissionType}`);
      return data;
    } catch (e) {
      console.log(`❌ Failed to parse JSON for: ${submissionType}`);
      return null;
    }
  }
  
  const draft = getDraftFromLocal('register100');
  if (draft) {
    console.log('📋 Draft validation passed');
    console.log('🏫 School name:', draft.formData.schoolName);
    console.log('📧 Email:', draft.email);
    console.log('📍 Step:', draft.currentStep);
  } else {
    console.log('❌ Draft validation failed');
  }
  
  return draft;
}

// Function to clear all draft data
function clearAllDraftData() {
  console.log('\n🗑️ Clearing all draft data...');
  localStorage.removeItem('draft_register100');
  localStorage.removeItem('draft_register-support');
  localStorage.removeItem('register100_consent_accepted');
  localStorage.removeItem('REGISTER_SUPPORT_consent_accepted');
  console.log('✅ All draft data cleared');
}

// Run debug
const result = debugLocalStorage();
const draftTest = testFormRestoration();

// Make functions available globally
window.debugLocalStorage = debugLocalStorage;
window.testFormRestoration = testFormRestoration;
window.clearAllDraftData = clearAllDraftData;

console.log('\n💡 Available functions:');
console.log('   debugLocalStorage() - Check localStorage contents');
console.log('   testFormRestoration() - Test draft validation');
console.log('   clearAllDraftData() - Clear all draft data');

console.log('\n🎯 NEXT STEPS:');
if (result.register100Draft && result.register100Draft.formData.schoolName) {
  console.log('✅ Draft data looks good');
  console.log('🔄 If form is not showing data, check React Hook Form state');
  console.log('📝 Expected school name:', result.register100Draft.formData.schoolName);
} else {
  console.log('❌ No valid draft data found');
  console.log('🔄 Try the OTP verification process again');
}