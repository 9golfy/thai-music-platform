#!/usr/bin/env node

/**
 * Monitor Production Fix Script
 * 
 * This script monitors the production deployment and tests if the MongoDB
 * authentication issue has been resolved.
 */

console.log('🔍 Monitoring Production Fix');
console.log('============================');

// Wait for deployment to complete
async function waitForDeployment(maxWaitTime = 300000) { // 5 minutes
  console.log('\n⏳ Waiting for deployment to complete...');
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    try {
      const response = await fetch('http://18.138.63.84:3000/api/health');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Application is responding!');
        console.log('📊 Health status:', data);
        return true;
      }
    } catch (error) {
      // Continue waiting
    }
    
    console.log('⏳ Still waiting... (checking every 10 seconds)');
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
  }
  
  console.log('❌ Deployment timeout - application not responding');
  return false;
}

// Test the fixed API endpoints
async function testFixedAPIs() {
  console.log('\n🧪 Testing Fixed API Endpoints...');
  
  const endpoints = [
    { name: 'Register100 List', url: 'http://18.138.63.84:3000/api/register100/list' },
    { name: 'Register Support List', url: 'http://18.138.63.84:3000/api/register-support/list' }
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n📋 Testing ${endpoint.name}...`);
    
    try {
      const response = await fetch(endpoint.url);
      console.log('📡 Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success!');
        console.log('📊 Data:', {
          success: data.success,
          count: data.count,
          hasSubmissions: (data.submissions?.length || 0) > 0
        });
      } else {
        const errorText = await response.text();
        console.log('❌ Still failing:', errorText);
      }
      
    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }
  }
}

// Test the dashboard pages
async function testDashboardPages() {
  console.log('\n🖥️ Testing Dashboard Pages...');
  
  const pages = [
    { name: 'Register100 Dashboard', url: 'http://18.138.63.84:3000/dcp-admin/dashboard/register100' },
    { name: 'Register Support Dashboard', url: 'http://18.138.63.84:3000/dcp-admin/dashboard/register-support' }
  ];
  
  for (const page of pages) {
    console.log(`\n📄 Testing ${page.name}...`);
    
    try {
      const response = await fetch(page.url);
      console.log('📡 Status:', response.status);
      
      if (response.ok) {
        console.log('✅ Page loads successfully!');
      } else {
        console.log('❌ Page load failed');
      }
      
    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }
  }
}

// Main monitoring function
async function main() {
  console.log('🎯 Monitoring production fix deployment...');
  console.log('📍 Production URL: http://18.138.63.84:3000');
  
  // Wait for deployment
  const deploymentReady = await waitForDeployment();
  
  if (!deploymentReady) {
    console.log('\n❌ Deployment failed or timed out');
    return;
  }
  
  // Test APIs
  await testFixedAPIs();
  
  // Test dashboard pages
  await testDashboardPages();
  
  console.log('\n📋 Summary:');
  console.log('- If APIs return success: true → MongoDB connection fixed ✅');
  console.log('- If APIs still return Authentication failed → Need further investigation ❌');
  console.log('- If dashboard pages load without HTTP 500 → Problem resolved ✅');
  
  console.log('\n✨ Monitoring completed!');
}

main().catch(console.error);