/**
 * Quick Fix Modal Script
 * 
 * Copy and paste this into browser console to fix modal and restore data
 */

console.log('🔧 Quick Fix: Closing modal and restoring data...');

// Function to close consent modal
function closeConsentModal() {
  console.log('🚪 Attempting to close consent modal...');
  
  // Try to find and click the accept button
  const acceptButton = document.querySelector('[data-testid="btn-consent-accept"]');
  if (acceptButton) {
    console.log('✅ Found accept button, clicking...');
    acceptButton.click();
    return true;
  }
  
  // Try to find modal and remove it
  const modal = document.querySelector('[data-testid="consent-modal"]');
  if (modal) {
    console.log('✅ Found modal, removing...');
    modal.remove();
    return true;
  }
  
  // Try to find any modal-like element
  const modalElements = document.querySelectorAll('.fixed.inset-0, [role="dialog"]');
  if (modalElements.length > 0) {
    console.log(`✅ Found ${modalElements.length} modal elements, removing...`);
    modalElements.forEach(el => el.remove());
    return true;
  }
  
  console.log('❌ No modal found to close');
  return false;
}

// Function to restore form data
function restoreFormData() {
  console.log('📋 Restoring form data...');
  
  // Get draft data
  const draftData = localStorage.getItem('draft_register100');
  if (!draftData) {
    console.log('❌ No draft data found');
    return false;
  }
  
  const draft = JSON.parse(draftData);
  const schoolName = draft.formData?.schoolName;
  
  if (!schoolName) {
    console.log('❌ No school name in draft data');
    return false;
  }
  
  console.log('🏫 Restoring school name:', schoolName);
  
  // Find school name input
  const schoolNameInput = document.querySelector('input[name="schoolName"]');
  if (schoolNameInput) {
    // Set value
    schoolNameInput.value = schoolName;
    
    // Trigger events
    schoolNameInput.dispatchEvent(new Event('input', { bubbles: true }));
    schoolNameInput.dispatchEvent(new Event('change', { bubbles: true }));
    schoolNameInput.dispatchEvent(new Event('blur', { bubbles: true }));
    
    console.log('✅ School name restored successfully');
    
    // Focus and blur to ensure React updates
    schoolNameInput.focus();
    setTimeout(() => {
      schoolNameInput.blur();
    }, 100);
    
    return true;
  } else {
    console.log('❌ School name input not found');
    return false;
  }
}

// Function to set consent status
function setConsentStatus() {
  console.log('🔒 Setting consent status...');
  localStorage.setItem('register100_consent_accepted', 'true');
  console.log('✅ Consent status set');
}

// Main fix function
function quickFix() {
  console.log('🚀 Starting quick fix...');
  
  // Step 1: Set consent status
  setConsentStatus();
  
  // Step 2: Close modal
  const modalClosed = closeConsentModal();
  
  // Step 3: Restore form data
  setTimeout(() => {
    const dataRestored = restoreFormData();
    
    // Step 4: Report results
    setTimeout(() => {
      console.log('📊 Quick fix results:');
      console.log('   Modal closed:', modalClosed ? '✅' : '❌');
      console.log('   Data restored:', dataRestored ? '✅' : '❌');
      console.log('   Consent set: ✅');
      
      if (modalClosed && dataRestored) {
        console.log('🎉 Quick fix successful!');
      } else {
        console.log('⚠️ Quick fix partially successful');
        console.log('💡 Try refreshing the page - data should persist');
      }
    }, 500);
  }, 200);
}

// Run the quick fix
quickFix();

// Make functions available for manual use
window.closeConsentModal = closeConsentModal;
window.restoreFormData = restoreFormData;
window.setConsentStatus = setConsentStatus;
window.quickFix = quickFix;

console.log('💡 Available functions:');
console.log('   quickFix() - Run complete fix');
console.log('   closeConsentModal() - Close modal only');
console.log('   restoreFormData() - Restore data only');
console.log('   setConsentStatus() - Set consent only');