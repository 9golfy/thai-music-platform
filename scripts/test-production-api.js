#!/usr/bin/env node

/**
 * Test Production API Script
 * 
 * This script tests the production API endpoints to ensure they work correctly
 */

console.log('🧪 Testing Production API Endpoints');
console.log('===================================');

// Test register100 list endpoint
async function testRegister100List() {
  console.log('\n📋 Testing /api/register100/list...');
  
  try {
    const response = await fetch('http://18.138.63.84:3000/api/register100/list');
    console.log('📡 Status:', response.status);
    console.log('📡 Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success!');
      console.log('📊 Response:', {
        success: data.success,
        count: data.count,
        submissionsLength: data.submissions?.length || 0
      });
      
      if (data.submissions && data.submissions.length > 0) {
        console.log('📄 Sample submission keys:', Object.keys(data.submissions[0]));
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
}

// Test register-support list endpoint
async function testRegisterSupportList() {
  console.log('\n📋 Testing /api/register-support/list...');
  
  try {
    const response = await fetch('http://18.138.63.84:3000/api/register-support/list');
    console.log('📡 Status:', response.status);
    console.log('📡 Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success!');
      console.log('📊 Response:', {
        success: data.success,
        count: data.count,
        submissionsLength: data.submissions?.length || 0
      });
      
      if (data.submissions && data.submissions.length > 0) {
        console.log('📄 Sample submission keys:', Object.keys(data.submissions[0]));
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
}

// Test health endpoint
async function testHealthEndpoint() {
  console.log('\n🏥 Testing /api/health...');
  
  try {
    const response = await fetch('http://18.138.63.84:3000/api/health');
    console.log('📡 Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Health check passed!');
      console.log('📊 Health data:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Health check failed:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Health check request failed:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🎯 Testing production server: http://18.138.63.84:3000');
  
  await testHealthEndpoint();
  await testRegister100List();
  await testRegisterSupportList();
  
  console.log('\n✨ API testing completed!');
  console.log('\n💡 If APIs are failing, check:');
  console.log('1. MongoDB connection in production');
  console.log('2. Environment variables in docker-compose.prod.yml');
  console.log('3. Container networking between web and mongodb');
  console.log('4. Database name and collection names');
}

main().catch(console.error);