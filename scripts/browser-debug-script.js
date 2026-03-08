// Copy and paste this script into browser console when testing the form

console.log('🔍 === FORM DEBUG SCRIPT ===');

// Check if debug functions are available
if (typeof window.debugForm !== 'undefined') {
  console.log('✅ debugForm is available');
} else {
  console.log('❌ debugForm is not available - make sure you\'re on the regist-support page');
}

if (typeof window.debugGetCompleteFormData !== 'undefined') {
  console.log('✅ debugGetCompleteFormData is available');
} else {
  console.log('❌ debugGetCompleteFormData is not available');
}

console.log('\n🔍 === DOM ELEMENTS CHECK ===');

// Check support type selection
const supportTypeInput = document.querySelector('input[name="supportType"]:checked');
console.log('Support type selected:', supportTypeInput?.value || 'None selected');

// Check member count input
const memberCountInput = document.querySelector('input[name="supportTypeMemberCount"]');
console.log('Member count input found:', !!memberCountInput);
console.log('Member count input type:', memberCountInput?.type);
console.log('Member count input value:', `"${memberCountInput?.value}"`);
console.log('Member count input disabled:', memberCountInput?.disabled);

// Check all support type name fields
console.log('\n🔍 === SUPPORT TYPE NAME FIELDS ===');
const supportTypeFields = [
  'supportTypeSchoolName',
  'supportTypeClubName', 
  'supportTypeAssociationName',
  'supportTypeGroupName',
  'supportTypeBandName'
];

supportTypeFields.forEach(fieldName => {
  const input = document.querySelector(`input[name="${fieldName}"]`);
  if (input) {
    console.log(`${fieldName}:`, {
      value: `"${input.value}"`,
      disabled: input.disabled,
      type: input.type
    });
  } else {
    console.log(`${fieldName}: NOT FOUND`);
  }
});

// Check React Hook Form values
if (typeof window.debugForm !== 'undefined') {
  console.log('\n🔍 === REACT HOOK FORM VALUES ===');
  const formValues = window.debugForm.getValues();
  console.log('supportType:', `"${formValues.supportType}"`);
  console.log('supportTypeMemberCount:', `"${formValues.supportTypeMemberCount}"`, '(type:', typeof formValues.supportTypeMemberCount, ')');
  console.log('supportTypeTitle:', `"${formValues.supportTypeTitle}"`);
  
  // Check specific support type fields
  supportTypeFields.forEach(fieldName => {
    const value = formValues[fieldName];
    if (value) {
      console.log(`${fieldName}:`, `"${value}"`);
    }
  });
}

// Check complete form data
if (typeof window.debugGetCompleteFormData !== 'undefined') {
  console.log('\n🔍 === COMPLETE FORM DATA ===');
  try {
    const completeData = window.debugGetCompleteFormData();
    console.log('supportType:', `"${completeData.supportType}"`);
    console.log('supportTypeMemberCount:', `"${completeData.supportTypeMemberCount}"`, '(type:', typeof completeData.supportTypeMemberCount, ')');
    console.log('supportTypeTitle:', `"${completeData.supportTypeTitle}"`);
    
    // Check specific support type fields
    supportTypeFields.forEach(fieldName => {
      const value = completeData[fieldName];
      if (value) {
        console.log(`${fieldName}:`, `"${value}"`);
      }
    });
  } catch (error) {
    console.error('Error getting complete form data:', error);
  }
}

console.log('\n🎯 === INSTRUCTIONS ===');
console.log('1. Fill out the form (select support type, enter name and member count)');
console.log('2. Run this script again to see the values');
console.log('3. Click "Save Draft" and check if member count is preserved');
console.log('4. Check localStorage: localStorage.getItem("draft_register_support")');

console.log('\n💡 === QUICK TESTS ===');
console.log('// Test localStorage:');
console.log('JSON.parse(localStorage.getItem("draft_register_support") || "{}")');
console.log('');
console.log('// Test form values:');
console.log('window.debugForm?.getValues()');
console.log('');
console.log('// Test complete data:');
console.log('window.debugGetCompleteFormData?.()');