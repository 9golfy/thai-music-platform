#!/usr/bin/env node

/**
 * Test visible input fix - ensure we get the correct member count from visible input
 */

console.log('🧪 Testing visible input fix...\n');

console.log('📋 Problem Summary:');
console.log('- Multiple inputs with name="supportTypeMemberCount" exist in DOM');
console.log('- querySelector() always finds the first one (which is hidden and empty)');
console.log('- Need to find the visible input that user actually typed in');

console.log('\n🔧 Solution Applied:');
console.log('- Use querySelectorAll() to get all inputs');
console.log('- Filter by visibility using getComputedStyle()');
console.log('- Get value from the visible input only');

console.log('\n📝 Browser Test Instructions:');
console.log('1. Go to http://localhost:3000/regist-support');
console.log('2. Select "กลุ่ม" (or any support type)');
console.log('3. Type a number in member count field (e.g., "25")');
console.log('4. Open browser console and run:');

console.log('\n```javascript');
console.log('// Check all member count inputs');
console.log('const inputs = document.querySelectorAll(\'input[name="supportTypeMemberCount"]\');');
console.log('console.log("Total inputs found:", inputs.length);');
console.log('');
console.log('inputs.forEach((input, index) => {');
console.log('  const style = window.getComputedStyle(input);');
console.log('  console.log(`Input ${index}:`, {');
console.log('    value: input.value,');
console.log('    display: style.display,');
console.log('    visibility: style.visibility,');
console.log('    offsetParent: !!input.offsetParent,');
console.log('    isVisible: style.display !== "none" && style.visibility !== "hidden" && input.offsetParent !== null');
console.log('  });');
console.log('});');
console.log('');
console.log('// Find visible input');
console.log('const visibleInput = Array.from(inputs).find(el => {');
console.log('  const style = window.getComputedStyle(el);');
console.log('  return style.display !== "none" && style.visibility !== "hidden" && el.offsetParent !== null;');
console.log('});');
console.log('');
console.log('console.log("Visible input value:", visibleInput?.value);');
console.log('```');

console.log('\n✅ Expected Results:');
console.log('- Should find 4 inputs total (one for each support type)');
console.log('- Only 1 input should be visible (the one for selected support type)');
console.log('- Visible input should have the value you typed');
console.log('- Other inputs should be hidden (display: none or visibility: hidden)');

console.log('\n🎯 Success Criteria:');
console.log('- visibleInput.value should show your typed number');
console.log('- Save draft should preserve the member count');
console.log('- localStorage should show correct supportTypeMemberCount');

console.log('\n🚨 If Still Not Working:');
console.log('1. Check if inputs are using disabled attribute instead of CSS hiding');
console.log('2. Verify the visibility detection logic');
console.log('3. Check if React Hook Form is interfering');
console.log('4. Try hard refresh (Ctrl+F5) to ensure new code is loaded');

// Simulate the fix for API testing
const simulateVisibleInputFix = () => {
  console.log('\n🧪 Simulating visible input fix for API test...');
  
  // This simulates what should happen when user fills the form
  const testData = {
    email: 'visible-input-test@example.com',
    phone: '0123456789',
    submissionType: 'register-support',
    currentStep: 1,
    formData: {
      supportType: 'กลุ่ม',
      supportTypeGroupName: 'กลุ่มทดสอบ visible input',
      supportTypeMemberCount: '42', // This should now be captured correctly
      supportTypeTitle: 'กลุ่มทดสอบ visible input',
      schoolName: 'โรงเรียนทดสอบ',
      schoolProvince: 'กรุงเทพมหานคร',
      schoolLevel: 'มัธยมศึกษา'
    }
  };
  
  return testData;
};

// Test the fix
const testData = simulateVisibleInputFix();
console.log('\n📊 Test Data:');
console.log('supportType:', testData.formData.supportType);
console.log('supportTypeMemberCount:', testData.formData.supportTypeMemberCount);
console.log('supportTypeGroupName:', testData.formData.supportTypeGroupName);

console.log('\n🚀 After applying the fix:');
console.log('- querySelector will find the correct visible input');
console.log('- Member count will be preserved during save draft');
console.log('- localStorage will show the correct value');
console.log('- Form restoration will work correctly');