/**
 * Debug Form Restoration Script
 * 
 * Run this in browser console to debug form restoration issues
 */

console.log('🔍 Debugging Form Restoration');
console.log('=============================');

// Check localStorage
const draftKey = 'draft_register100';
const draftData = localStorage.getItem(draftKey);

if (!draftData) {
  console.log('❌ No draft data found in localStorage');
  console.log('Key checked:', draftKey);
} else {
  console.log('✅ Draft data found in localStorage');
  
  try {
    const parsed = JSON.parse(draftData);
    console.log('📋 Draft data structure:');
    console.log(parsed);
    
    console.log('\n🎯 Key form fields:');
    const keyFields = ['schoolName', 'schoolProvince', 'schoolLevel', 'affiliation'];
    keyFields.forEach(field => {
      const value = parsed.formData?.[field];
      console.log(`  ${field}: "${value || '(empty)'}"`);
    });
    
    console.log('\n📊 Form data summary:');
    console.log('- Total fields:', Object.keys(parsed.formData || {}).length);
    console.log('- Non-empty fields:', Object.entries(parsed.formData || {}).filter(([k, v]) => v && v !== '').length);
    console.log('- Current step:', parsed.currentStep);
    console.log('- Saved at:', new Date(parsed.savedAt).toLocaleString());
    
  } catch (e) {
    console.log('❌ Error parsing draft data:', e);
    console.log('Raw data:', draftData);
  }
}

console.log('\n🔧 Next steps:');
console.log('1. Refresh the page and check browser console for restoration logs');
console.log('2. Look for "🔄 Restoring draft data" message');
console.log('3. Check if "✅ Form values after reset" shows the correct data');
console.log('4. Verify form fields are actually populated in the UI');

// Helper function to check current form state (if form is available)
window.debugFormState = function() {
  console.log('\n🎯 Current form state check:');
  
  // Try to find form inputs
  const schoolNameInput = document.querySelector('input[name="schoolName"]');
  const schoolProvinceSelect = document.querySelector('select[name="schoolProvince"]');
  
  if (schoolNameInput) {
    console.log('School Name input value:', schoolNameInput.value);
  } else {
    console.log('❌ School Name input not found');
  }
  
  if (schoolProvinceSelect) {
    console.log('School Province select value:', schoolProvinceSelect.value);
  } else {
    console.log('❌ School Province select not found');
  }
  
  // Check all form inputs
  const allInputs = document.querySelectorAll('input, select, textarea');
  const filledInputs = Array.from(allInputs).filter(input => input.value && input.value.trim() !== '');
  console.log(`📊 Total form inputs: ${allInputs.length}, Filled: ${filledInputs.length}`);
};

console.log('\n💡 Run window.debugFormState() after page loads to check form state');