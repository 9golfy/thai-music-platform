#!/usr/bin/env node

/**
 * Simple API test
 */

async function testAPI() {
  console.log('🧪 Testing API...');
  
  try {
    // Test a simple GET request first
    const healthResponse = await fetch('http://localhost:3000/api/auth/check');
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.status === 200) {
      const healthResult = await healthResponse.json();
      console.log('Health check result:', healthResult);
    }
    
    // Now test draft save
    const draftResponse = await fetch('http://localhost:3000/api/draft/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        phone: '0812345678',
        submissionType: 'register-support',
        formData: { schoolName: 'Test School' },
        currentStep: 1,
      }),
    });
    
    console.log('Draft save status:', draftResponse.status);
    
    if (draftResponse.ok) {
      const draftResult = await draftResponse.json();
      console.log('Draft save result:', draftResult);
    } else {
      const errorText = await draftResponse.text();
      console.log('Draft save error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();