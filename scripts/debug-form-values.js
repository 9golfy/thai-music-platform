// Debug script to check form values
// Run this in browser console when on the form page

function debugFormValues() {
  console.log('🔍 Debugging form values...\n');
  
  // Check if we're on the right page
  if (!window.location.href.includes('regist-support')) {
    console.log('❌ Please run this on the regist-support page');
    return;
  }
  
  // Try to access React Hook Form instance
  // This is a hack to access the form from browser console
  const formElements = document.querySelectorAll('input[name], select[name], textarea[name]');
  
  console.log('📋 Form Elements Found:');
  const formData = {};
  
  formElements.forEach(element => {
    const name = element.name;
    let value = element.value;
    
    if (element.type === 'radio') {
      if (element.checked) {
        formData[name] = value;
        console.log(`   ${name}: "${value}" (radio - checked)`);
      }
    } else if (element.type === 'checkbox') {
      formData[name] = element.checked;
      console.log(`   ${name}: ${element.checked} (checkbox)`);
    } else {
      if (value) {
        formData[name] = value;
        console.log(`   ${name}: "${value}"`);
      }
    }
  });
  
  console.log('\n📊 Collected Form Data:');
  console.log(JSON.stringify(formData, null, 2));
  
  // Check specific fields
  console.log('\n🎯 Specific Field Check:');
  const supportTypeRadio = document.querySelector('input[name="supportType"]:checked');
  const supportTypeNameInput = document.querySelector('input[name="supportTypeName"]');
  const schoolNameInput = document.querySelector('input[name="schoolName"]');
  
  console.log('supportType (radio):', supportTypeRadio ? supportTypeRadio.value : 'NOT SELECTED');
  console.log('supportTypeName (input):', supportTypeNameInput ? supportTypeNameInput.value : 'NOT FOUND');
  console.log('schoolName (input):', schoolNameInput ? schoolNameInput.value : 'NOT FOUND');
  
  // Check localStorage
  console.log('\n💾 LocalStorage Check:');
  const draftKey = Object.keys(localStorage).find(key => key.includes('draft'));
  if (draftKey) {
    const draftData = JSON.parse(localStorage.getItem(draftKey) || '{}');
    console.log('Draft in localStorage:', draftData);
  } else {
    console.log('No draft found in localStorage');
  }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  debugFormValues();
} else {
  console.log('This script should be run in browser console on the regist-support page');
}