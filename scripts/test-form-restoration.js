/**
 * Test Form Data Restoration
 * 
 * This script helps debug form restoration issues by checking:
 * 1. What data exists in localStorage
 * 2. The structure of the saved data
 * 3. Whether the data matches expected form field names
 */

// Simulate localStorage data structure
const testLocalStorageData = {
  draftToken: "test-token-123",
  email: "test@example.com", 
  phone: "0899297983",
  submissionType: "register100",
  formData: {
    schoolName: "โรงเรียนทดสอบ",
    schoolProvince: "กรุงเทพมหานคร",
    schoolLevel: "มัธยมศึกษา",
    affiliation: "รัฐบาล",
    // ... other fields
  },
  currentStep: 1,
  savedAt: Date.now(),
  syncedAt: Date.now()
};

console.log('🔍 Testing Form Data Restoration');
console.log('================================');

console.log('📋 Sample localStorage data structure:');
console.log(JSON.stringify(testLocalStorageData, null, 2));

console.log('\n🎯 Key form fields to check:');
const keyFields = ['schoolName', 'schoolProvince', 'schoolLevel', 'affiliation'];
keyFields.forEach(field => {
  const value = testLocalStorageData.formData[field];
  console.log(`  ${field}: ${value || '(empty)'}`);
});

console.log('\n💡 Debugging steps:');
console.log('1. Check browser localStorage: draft_register100');
console.log('2. Verify form.reset() is called with correct data');
console.log('3. Check if useForm defaultValues conflict with reset()');
console.log('4. Ensure form fields have correct name attributes');

console.log('\n🔧 To test in browser console:');
console.log('localStorage.getItem("draft_register100")');
console.log('JSON.parse(localStorage.getItem("draft_register100"))');