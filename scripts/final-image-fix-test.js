#!/usr/bin/env node

/**
 * Final Image Fix Test
 * 
 * This script performs a comprehensive test to verify image serving
 */

const http = require('http');

console.log('🔧 Final Image Fix Test...\n');

// Test the specific image that was problematic
const testImage = 'mgt_1773153278547_manager.jpg';
const baseUrl = 'http://18.138.63.84:3000';

console.log('Testing image:', testImage);
console.log('Base URL:', baseUrl);
console.log('');

async function testImagePath(path, description) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${path}`;
    console.log(`🔍 ${description}`);
    console.log(`   URL: ${url}`);
    
    const request = http.get(url, (response) => {
      const { statusCode, headers } = response;
      
      if (statusCode === 200) {
        console.log(`   ✅ SUCCESS (${headers['content-type']})`);
        resolve(true);
      } else {
        console.log(`   ❌ FAILED (Status: ${statusCode})`);
        resolve(false);
      }
      
      response.resume();
    });
    
    request.on('error', (error) => {
      console.log(`   ❌ ERROR (${error.message})`);
      resolve(false);
    });
    
    request.setTimeout(5000, () => {
      console.log(`   ⏰ TIMEOUT`);
      request.destroy();
      resolve(false);
    });
  });
}

async function runTests() {
  console.log('📋 Testing different paths:\n');
  
  // Test old path (should fail)
  await testImagePath(`/uploads/${testImage}`, 'Old path (should fail)');
  console.log('');
  
  // Test new API path (should work)
  await testImagePath(`/api/uploads/${testImage}`, 'New API path (should work)');
  console.log('');
  
  console.log('💡 Instructions for user:');
  console.log('1. เปิดหน้า: http://18.138.63.84:3000/teacher/dashboard/register100/69b02bfe9436e8186f6e41a8');
  console.log('2. กด F12 เพื่อเปิด Developer Tools');
  console.log('3. ไปที่ tab Network');
  console.log('4. กด Ctrl+F5 เพื่อ refresh หน้าและลบ cache');
  console.log('5. ดูว่ารูปภาพเรียก URL ไหน ถ้าเรียก /uploads/ แสดงว่ายังมีปัญหา');
  console.log('6. ถ้าเรียก /api/uploads/ แสดงว่าแก้ไขแล้ว');
  console.log('');
  console.log('🚨 หากยังมีปัญหา:');
  console.log('- ลองเปิด URL รูปภาพโดยตรง: http://18.138.63.84:3000/api/uploads/mgt_1773153278547_manager.jpg');
  console.log('- ตรวจสอบว่า login เข้าระบบแล้วหรือยัง');
  console.log('- ลองใช้ browser อื่น (Chrome, Firefox, Edge)');
}

runTests();