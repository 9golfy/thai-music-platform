#!/usr/bin/env node

/**
 * Debug current issue
 */

async function debugCurrentIssue() {
  const token = '2434dcd5-e303-4c4a-b333-07aebe2b6380';
  console.log('🐛 Debugging current issue for token:', token);
  
  try {
    // Get draft data
    const dataResponse = await fetch(`http://localhost:3000/api/draft/${token}/data`);
    const dataResult = await dataResponse.json();
    
    console.log('📊 Current data in database:');
    console.log('=====================================');
    console.log('supportType:', `"${dataResult.formData?.supportType}"`);
    console.log('schoolName:', `"${dataResult.formData?.schoolName}"`);
    console.log('supportTypeName:', `"${dataResult.formData?.supportTypeName}"`);
    
    // Show all fields that contain the problematic value
    const problematicValue = 'VVVVVVVVVVVVVVVVVVVVVVVV';
    console.log('\n🔍 Fields containing "VVVVVVVVVVVVVVVVVVVVVVVV":');
    console.log('=====================================');
    
    Object.entries(dataResult.formData || {}).forEach(([key, value]) => {
      if (typeof value === 'string' && value.includes('V')) {
        console.log(`  ${key}: "${value}"`);
      }
    });
    
    console.log('\n🎯 Problem Analysis:');
    console.log('=====================================');
    
    // The issue is that the form is showing the same value in all fields
    // This suggests that either:
    // 1. The data is being saved incorrectly (all fields have the same value)
    // 2. The form restoration is setting all fields to the same value
    
    console.log('Possible causes:');
    console.log('1. Data is being saved with same value in multiple fields');
    console.log('2. Form restoration logic is copying schoolName to all supportTypeName fields');
    console.log('3. React Hook Form is not handling field updates correctly');
    
    // Let's check what the form restoration logic should do
    console.log('\n🔧 What should happen:');
    console.log('=====================================');
    console.log('1. supportType = "สถานศึกษา" should be selected');
    console.log('2. supportTypeName should get schoolName value ONLY for "สถานศึกษา"');
    console.log('3. Other supportTypeName fields should remain empty');
    console.log('4. schoolName field should show the school name');
    
    console.log('\n🚨 Current problem:');
    console.log('=====================================');
    console.log('ALL supportTypeName fields are showing the same value!');
    console.log('This means the logic is setting ALL supportTypeName fields, not just the one for "สถานศึกษา"');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugCurrentIssue();