#!/usr/bin/env node

/**
 * Production Server Health Check
 * Verifies the production server is running and accessible
 */

const https = require('https');
const http = require('http');

const PRODUCTION_URL = 'http://18.138.63.84:3000';
const ENDPOINTS_TO_CHECK = [
  '/',
  '/regist100',
  '/api/auth/check',
  '/regist-support'
];

console.log('🏥 Production Server Health Check');
console.log('🌐 Server:', PRODUCTION_URL);
console.log('=' .repeat(50));

async function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${PRODUCTION_URL}${endpoint}`;
    const client = url.startsWith('https') ? https : http;
    
    const startTime = Date.now();
    
    const req = client.get(url, (res) => {
      const responseTime = Date.now() - startTime;
      const status = res.statusCode;
      
      let statusIcon = '✅';
      if (status >= 400) statusIcon = '❌';
      else if (status >= 300) statusIcon = '⚠️';
      
      console.log(`${statusIcon} ${endpoint.padEnd(20)} | ${status} | ${responseTime}ms`);
      resolve({ endpoint, status, responseTime, success: status < 400 });
    });
    
    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${endpoint.padEnd(20)} | ERROR | ${responseTime}ms | ${error.message}`);
      resolve({ endpoint, status: 'ERROR', responseTime, success: false, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`⏰ ${endpoint.padEnd(20)} | TIMEOUT | 10000ms`);
      resolve({ endpoint, status: 'TIMEOUT', responseTime: 10000, success: false });
    });
  });
}

async function runHealthCheck() {
  console.log('Endpoint'.padEnd(20) + ' | Status | Response Time');
  console.log('-'.repeat(50));
  
  const results = [];
  
  for (const endpoint of ENDPOINTS_TO_CHECK) {
    const result = await checkEndpoint(endpoint);
    results.push(result);
  }
  
  console.log('\n📊 Summary:');
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 All endpoints are healthy!');
    console.log('✅ Production server is ready for testing');
  } else {
    console.log('\n⚠️ Some endpoints have issues');
    console.log('🔍 Check the failed endpoints before running tests');
  }
  
  // Show average response time
  const avgResponseTime = results
    .filter(r => typeof r.responseTime === 'number')
    .reduce((sum, r) => sum + r.responseTime, 0) / results.length;
  
  console.log(`⏱️ Average response time: ${Math.round(avgResponseTime)}ms`);
  
  return successful === total;
}

// Run the health check
runHealthCheck()
  .then(allHealthy => {
    process.exit(allHealthy ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  });