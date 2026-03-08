/**
 * Debug LocalStorage Script
 * 
 * This script helps debug localStorage data for draft restoration.
 * Run this in browser console to check localStorage contents.
 */

console.log('🔍 Debugging LocalStorage for Draft Data...\n');

// Check for draft data
const register100Draft = localStorage.getItem('draft_register100');
const registerSupportDraft = localStorage.getItem('draft_register-support');
const consentAccepted = localStorage.getItem('register100_consent_accepted');

console.log('📋 LocalStorage Contents:');
console.log('─'.repeat(50));

if (register100Draft) {
  console.log('✅ Found register100 draft:');
  try {
    const data = JSON.parse(register100Draft);
    console.log('   📧 Email:', data.email);
    console.log('   🎫 Token:', data.draftToken);
    console.log('   📝 Type:', data.submissionType);
    console.log('   📍 Step:', data.currentStep);
    console.log('   💾 Saved At:', new Date(data.savedAt).toLocaleString());
    console.log('   🔄 Synced At:', data.syncedAt ? new Date(data.syncedAt).toLocaleString() : 'Never');
    
    // Check form data
    const formData = data.formData || {};
    const nonEmptyFields = Object.entries(formData)
      .filter(([key, value]) => value && value !== '' && value !== 0 && value !== false)
      .filter(([key, value]) => !Array.isArray(value) || value.length > 0);
    
    console.log('   📊 Form Data Fields:', nonEmptyFields.length);
    nonEmptyFields.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        console.log(`     ${key}: [${value.length} items]`);
      } else {
        const displayValue = String(value).length > 50 
          ? String(value).substring(0, 50) + '...' 
          : String(value);
        console.log(`     ${key}: ${displayValue}`);
      }
    });
  } catch (e) {
    console.log('   ❌ Invalid JSON data');
  }
} else {
  console.log('❌ No register100 draft found');
}

if (registerSupportDraft) {
  console.log('\n✅ Found register-support draft:');
  try {
    const data = JSON.parse(registerSupportDraft);
    console.log('   📧 Email:', data.email);
    console.log('   🎫 Token:', data.draftToken);
    console.log('   📝 Type:', data.submissionType);
    console.log('   📍 Step:', data.currentStep);
    console.log('   💾 Saved At:', new Date(data.savedAt).toLocaleString());
    console.log('   🔄 Synced At:', data.syncedAt ? new Date(data.syncedAt).toLocaleString() : 'Never');
  } catch (e) {
    console.log('   ❌ Invalid JSON data');
  }
} else {
  console.log('❌ No register-support draft found');
}

console.log('\n🔒 Consent Status:');
console.log('   Consent Accepted:', consentAccepted === 'true' ? '✅ Yes' : '❌ No');

console.log('\n🧪 Test Instructions:');
console.log('─'.repeat(50));
console.log('1. If you see draft data above, the OTP verification worked');
console.log('2. If consent is "No", you\'ll see the consent modal first');
console.log('3. After accepting consent, the form should load with saved data');
console.log('4. Check browser console for form restoration logs');

// Helper function to clear all draft data (for testing)
window.clearDraftData = function() {
  localStorage.removeItem('draft_register100');
  localStorage.removeItem('draft_register-support');
  localStorage.removeItem('register100_consent_accepted');
  console.log('🗑️ All draft data cleared');
};

console.log('\n💡 Helper Functions:');
console.log('   clearDraftData() - Clear all draft data for testing');