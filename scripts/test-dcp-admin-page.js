#!/usr/bin/env node

const https = require('https');
const http = require('http');

const url = 'http://18.138.63.84:3000/dcp-admin/dashboard';

console.log(`🔍 Testing DCP Admin Dashboard: ${url}\n`);

http.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`\nResponse Length: ${data.length} bytes`);
    
    if (res.statusCode === 200) {
      console.log('✅ Page loaded successfully');
      
      // Check for common elements
      if (data.includes('User Management')) {
        console.log('✅ Found "User Management" text');
      } else {
        console.log('❌ "User Management" text not found');
      }
      
      if (data.includes('e-Certificate')) {
        console.log('✅ Found "e-Certificate" text');
      } else {
        console.log('❌ "e-Certificate" text not found');
      }
      
      // Check for errors
      if (data.includes('Error') || data.includes('error')) {
        console.log('⚠️ Page contains error messages');
        const errorMatch = data.match(/Error[^<]*/i);
        if (errorMatch) {
          console.log('Error:', errorMatch[0]);
        }
      }
      
    } else if (res.statusCode === 302 || res.statusCode === 301) {
      console.log(`🔄 Redirect to: ${res.headers.location}`);
    } else {
      console.log('❌ Page failed to load');
    }
  });
  
}).on('error', (err) => {
  console.error('❌ Request failed:', err.message);
});
