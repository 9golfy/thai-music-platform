/**
 * Manual Form Restoration
 * 
 * Copy and paste this into browser console to manually restore form data
 */

console.log('🔧 Manual Form Restoration Tool');

function manualFormRestore() {
  console.log('🔄 Starting manual form restoration...');
  
  // Get draft data
  const draftData = localStorage.getItem('draft_register100');
  if (!draftData) {
    console.log('❌ No draft data found');
    return;
  }
  
  const draft = JSON.parse(draftData);
  const schoolName = draft.formData?.schoolName;
  
  if (!schoolName) {
    console.log('❌ No school name in draft data');
    return;
  }
  
  console.log('🏫 School name to restore:', schoolName);
  
  // Method 1: Direct DOM manipulation
  const schoolNameInput = document.querySelector('input[name="schoolName"]');
  if (schoolNameInput) {
    console.log('✅ Found school name input element');
    schoolNameInput.value = schoolName;
    
    // Trigger React events
    schoolNameInput.dispatchEvent(new Event('input', { bubbles: true }));
    schoolNameInput.dispatchEvent(new Event('change', { bubbles: true }));
    schoolNameInput.dispatchEvent(new Event('blur', { bubbles: true }));
    
    console.log('✅ Set value via DOM manipulation');
  } else {
    console.log('❌ School name input not found');
  }
  
  // Method 2: Try to access React Hook Form instance
  try {
    // Look for React Hook Form in window or global scope
    if (window.React || window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('🔍 React detected, looking for form instance...');
      
      // Try to find form elements and trigger React updates
      const allInputs = document.querySelectorAll('input, select, textarea');
      console.log(`📝 Found ${allInputs.length} form elements`);
      
      // Focus and blur to trigger React Hook Form updates
      if (schoolNameInput) {
        schoolNameInput.focus();
        setTimeout(() => {
          schoolNameInput.blur();
          console.log('🔄 Triggered focus/blur cycle');
        }, 100);
      }
    }
  } catch (e) {
    console.log('⚠️ Could not access React Hook Form directly');
  }
  
  // Method 3: Check if value was set
  setTimeout(() => {
    const currentValue = schoolNameInput?.value;
    console.log('📊 Current input value:', currentValue);
    
    if (currentValue === schoolName) {
      console.log('🎉 Manual restoration successful!');
    } else {
      console.log('❌ Manual restoration failed');
      console.log('Expected:', schoolName);
      console.log('Got:', currentValue);
    }
  }, 500);
}

// Function to check form state
function checkFormState() {
  console.log('📊 Checking form state...');
  
  const schoolNameInput = document.querySelector('input[name="schoolName"]');
  if (schoolNameInput) {
    console.log('Input element:', {
      value: schoolNameInput.value,
      placeholder: schoolNameInput.placeholder,
      disabled: schoolNameInput.disabled,
      readOnly: schoolNameInput.readOnly
    });
  }
  
  // Check localStorage
  const draft = localStorage.getItem('draft_register100');
  if (draft) {
    const data = JSON.parse(draft);
    console.log('LocalStorage school name:', data.formData?.schoolName);
  }
  
  // Check for React Hook Form errors
  const errorElements = document.querySelectorAll('[role="alert"], .error, .text-red-500');
  if (errorElements.length > 0) {
    console.log('⚠️ Found error elements:', errorElements.length);
    errorElements.forEach((el, i) => {
      console.log(`Error ${i + 1}:`, el.textContent);
    });
  }
}

// Function to force page refresh with data
function refreshWithData() {
  console.log('🔄 Refreshing page...');
  window.location.reload();
}

// Make functions available
window.manualFormRestore = manualFormRestore;
window.checkFormState = checkFormState;
window.refreshWithData = refreshWithData;

console.log('💡 Available functions:');
console.log('   manualFormRestore() - Try to restore form manually');
console.log('   checkFormState() - Check current form state');
console.log('   refreshWithData() - Refresh page (data should persist)');

// Auto-run the restoration
console.log('\n🚀 Auto-running manual restoration...');
manualFormRestore();