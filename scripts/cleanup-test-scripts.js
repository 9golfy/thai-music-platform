const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up test scripts');
console.log('='.repeat(30));

// List of test scripts that can be safely removed
const testScriptsToRemove = [
  'test-grade-consistency.js',
  'test-data-table-grades.js',
  'test-new-grade-ranges.js',
  'test-grade-distribution.js',
  'fix-missing-scores.js',
  'test-certificates-data.js',
  'test-dashboard-data.js',
  'debug-api-endpoints.js',
  'final-data-verification.js',
  'fix-register-support-data.js',
  'test-data-consistency.js',
  'debug-data-consistency.js',
  'debug-dashboard-stats.js',
  'check-score-details.js',
  'delete-test-data-mongo.js',
  'delete-all-test-data.js',
  'verify-grade-logic-final.js',
  'safe-delete-test-data.js',
  'delete-all-test-data-confirmed.js'
];

// Keep these useful scripts
const scriptsToKeep = [
  'verify-clean-database.js',
  'recalculate-register-support-scores.js',
  'recalculate-register100-scores.js',
  'submit-formdata.js'
];

console.log('\n📝 Scripts to remove:');
let removedCount = 0;
let keptCount = 0;

testScriptsToRemove.forEach((scriptName, index) => {
  const scriptPath = path.join(__dirname, scriptName);
  
  if (fs.existsSync(scriptPath)) {
    try {
      fs.unlinkSync(scriptPath);
      console.log(`${index + 1}. ✅ Removed: ${scriptName}`);
      removedCount++;
    } catch (error) {
      console.log(`${index + 1}. ❌ Failed to remove: ${scriptName} (${error.message})`);
    }
  } else {
    console.log(`${index + 1}. ⚪ Not found: ${scriptName}`);
  }
});

console.log('\n📝 Scripts kept for future use:');
scriptsToKeep.forEach((scriptName, index) => {
  const scriptPath = path.join(__dirname, scriptName);
  if (fs.existsSync(scriptPath)) {
    console.log(`${index + 1}. 📁 Kept: ${scriptName}`);
    keptCount++;
  }
});

console.log('\n📊 Cleanup Summary:');
console.log(`🗑️  Removed: ${removedCount} test scripts`);
console.log(`📁 Kept: ${keptCount} useful scripts`);
console.log('\n✅ Workspace is now clean and organized!');