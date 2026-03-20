const { execSync } = require('child_process');

console.log('🚀 Running Register100 Test with Enhanced Modal Handling...\n');

try {
  // Run the test with specific timeout and retries
  const result = execSync('npx playwright test tests/register100-full-fields.spec.ts --headed --timeout=180000 --retries=1', {
    stdio: 'inherit',
    timeout: 200000
  });
  
  console.log('\n✅ Test completed successfully!');
} catch (error) {
  console.log('\n⚠️ Test encountered issues. Error details:');
  console.log(error.message);
  
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. Make sure dev server is running on port 3000');
  console.log('2. Check if modal appears but button is not clickable');
  console.log('3. Try running test manually to see modal behavior');
  console.log('4. Check browser console for JavaScript errors');
}

console.log('\n📋 Test Summary:');
console.log('- Email: kaibandon2021@gmail.com');
console.log('- Phone: 0899297983');
console.log('- Expected Score: 100 points');
console.log('- Enhanced modal clicking with multiple fallback methods');