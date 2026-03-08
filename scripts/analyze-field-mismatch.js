#!/usr/bin/env node

/**
 * Analyze field name mismatch between form and database
 */

const { MongoClient } = require('mongodb');

async function analyzeFieldMismatch() {
  const token = '662e4f77-067a-488c-9343-50fbb93526b1';
  console.log('🔍 Analyzing field mismatch for token:', token);
  
  const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const draftsCollection = db.collection('draft_submissions');
    
    // Get draft data
    const draft = await draftsCollection.findOne({ draftToken: token });
    
    if (!draft) {
      console.log('❌ Draft not found');
      return;
    }
    
    console.log('\n📊 Database Form Data Analysis:');
    console.log('=====================================');
    
    // Expected field names from form (based on Step1.tsx)
    const expectedFields = {
      // Support type section (ประเภทโรงเรียน)
      supportType: 'ประเภทการสนับสนุน',
      supportTypeName: 'ชื่อประเภทการสนับสนุน',
      supportTypeMemberCount: 'จำนวนสมาชิก',
      
      // School information section (ข้อมูลพื้นฐาน)
      schoolName: 'ชื่อสถานศึกษา',
      schoolProvince: 'จังหวัด',
      schoolLevel: 'ระดับสถานศึกษา'
    };
    
    console.log('🎯 Expected vs Actual Field Values:');
    console.log('=====================================');
    
    Object.entries(expectedFields).forEach(([fieldName, description]) => {
      const value = draft.formData[fieldName];
      const hasValue = value !== undefined && value !== null && value !== '';
      
      console.log(`${hasValue ? '✅' : '❌'} ${fieldName} (${description}):`, 
        hasValue ? `"${value}"` : 'EMPTY/MISSING');
    });
    
    console.log('\n🔑 All Form Data Fields:');
    console.log('=====================================');
    
    // Show all non-empty fields
    const nonEmptyFields = {};
    Object.entries(draft.formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== false && value !== 0) {
        nonEmptyFields[key] = value;
      }
    });
    
    console.log('Non-empty fields:', Object.keys(nonEmptyFields).length);
    Object.entries(nonEmptyFields).forEach(([key, value]) => {
      console.log(`  ${key}: "${value}"`);
    });
    
    console.log('\n🎯 Field Mapping Analysis:');
    console.log('=====================================');
    
    // Check if the issue is field name mismatch
    const criticalFields = ['supportType', 'supportTypeName', 'schoolName', 'schoolProvince', 'schoolLevel'];
    const missingFields = [];
    const presentFields = [];
    
    criticalFields.forEach(field => {
      const value = draft.formData[field];
      if (value !== undefined && value !== null && value !== '') {
        presentFields.push({ field, value });
      } else {
        missingFields.push(field);
      }
    });
    
    console.log('✅ Present fields:', presentFields.length);
    presentFields.forEach(({ field, value }) => {
      console.log(`  ${field}: "${value}"`);
    });
    
    console.log('❌ Missing/empty fields:', missingFields.length);
    missingFields.forEach(field => {
      console.log(`  ${field}`);
    });
    
    console.log('\n🔧 Diagnosis:');
    console.log('=====================================');
    
    if (draft.formData.schoolName && draft.formData.schoolName.trim() !== '') {
      console.log('✅ schoolName field exists and has value');
      console.log('   Problem: Frontend form restoration logic');
    } else {
      console.log('❌ schoolName field is missing or empty');
      console.log('   Problem: Form data not being saved correctly');
    }
    
    if (draft.formData.supportType && draft.formData.supportType.trim() !== '') {
      console.log('✅ supportType field exists and has value');
      if (draft.formData.supportType === 'สถานศึกษา') {
        console.log('   supportType is "สถานศึกษา" - should show school name field');
        if (!draft.formData.supportTypeName || draft.formData.supportTypeName.trim() === '') {
          console.log('❌ supportTypeName is empty - this should contain school name for "สถานศึกษา" type');
        }
      }
    } else {
      console.log('❌ supportType field is missing or empty');
    }
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

analyzeFieldMismatch();