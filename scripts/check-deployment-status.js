#!/usr/bin/env node

/**
 * Check Deployment Status Script
 * 
 * This script checks if the production deployment has completed
 * and containers are running with updated configuration.
 */

console.log('🔍 Checking Deployment Status');
console.log('=============================');

// Check if deployment is in progress by monitoring GitHub Actions
async function checkGitHubActions() {
  console.log('\n📡 Checking GitHub Actions status...');
  
  try {
    // This would require GitHub API token, so we'll just check the application response
    console.log('💡 To check GitHub Actions status manually:');
    console.log('   Visit: https://github.com/9golfy/thai-music-platform/actions');
    
  } catch (error) {
    console.log('❌ Could not check GitHub Actions:', error.message);
  }
}

// Test if containers have been restarted with new config
async function testContainerRestart() {
  console.log('\n🐳 Testing if containers restarted with new config...');
  
  // Test multiple times to see if there's any change
  const testRounds = 3;
  const results = [];
  
  for (let i = 1; i <= testRounds; i++) {
    console.log(`\n🔄 Test round ${i}/${testRounds}...`);
    
    try {
      const response = await fetch('http://18.138.63.84:3000/api/register100/list');
      const result = {
        round: i,
        status: response.status,
        timestamp: new Date().toISOString()
      };
      
      if (response.ok) {
        const data = await response.json();
        result.success = data.success;
        result.error = data.error;
      } else {
        const errorText = await response.text();
        result.errorText = errorText;
      }
      
      results.push(result);
      console.log(`📊 Round ${i} result:`, result);
      
    } catch (error) {
      results.push({
        round: i,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    // Wait 5 seconds between tests
    if (i < testRounds) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  return results;
}

// Check if MongoDB connection is working
async function testMongoConnection() {
  console.log('\n🗄️ Testing MongoDB connection indirectly...');
  
  // Test health endpoint which might give us more info
  try {
    const response = await fetch('http://18.138.63.84:3000/api/health');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Health endpoint working:', data);
      
      // The health endpoint doesn't test MongoDB, so let's try a simple endpoint
      console.log('\n🧪 Testing a simple API endpoint...');
      
      const testResponse = await fetch('http://18.138.63.84:3000/api/register100/list');
      console.log('📡 API Status:', testResponse.status);
      
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        console.log('❌ API Error:', errorText);
        
        // Parse the error to understand the issue
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error === 'Authentication failed.') {
            console.log('🔍 Issue: MongoDB authentication is still failing');
            console.log('💡 This means either:');
            console.log('   1. Containers haven\'t restarted yet');
            console.log('   2. Environment variables not updated');
            console.log('   3. MongoDB container still has authentication enabled');
          }
        } catch (e) {
          console.log('🔍 Could not parse error details');
        }
      }
      
    } else {
      console.log('❌ Health endpoint failed');
    }
    
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
}

// Main function
async function main() {
  console.log('🎯 Checking production deployment status...');
  console.log('📍 Production URL: http://18.138.63.84:3000');
  
  await checkGitHubActions();
  
  const testResults = await testContainerRestart();
  
  await testMongoConnection();
  
  console.log('\n📋 Analysis:');
  console.log('============');
  
  const allFailed = testResults.every(r => r.errorText && r.errorText.includes('Authentication failed'));
  
  if (allFailed) {
    console.log('❌ All tests show Authentication failed');
    console.log('🔧 Recommended actions:');
    console.log('   1. Wait for GitHub Actions deployment to complete');
    console.log('   2. Check if containers are restarting');
    console.log('   3. Verify docker-compose.prod.yml changes are applied');
    console.log('   4. May need to manually restart containers on production server');
  } else {
    console.log('✅ Some improvement detected');
  }
  
  console.log('\n⏰ Current time:', new Date().toISOString());
  console.log('💡 If issue persists, the deployment may still be in progress');
  console.log('   or containers need manual restart on production server.');
  
  console.log('\n✨ Status check completed!');
}

main().catch(console.error);