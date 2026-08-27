/**
 * Check Backup Data
 * 
 * เช็คข้อมูลใน backup database เพื่อหาข้อมูลที่ถูกลบ
 * 
 * Usage: 
 * node scripts/check-backup-data.js
 * 
 * หรือระบุ School ID:
 * node scripts/check-backup-data.js SCH-20260607-0496
 */

const { MongoClient } = require('mongodb');

// Backup Database URI (แก้ไขตามที่เก็บ backup จริง)
const BACKUP_URI = process.env.BACKUP_MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school_backup?authSource=admin';

async function main() {
  const args = process.argv.slice(2);
  const searchSchoolId = args[0] || '';
  
  console.log('🔍 Checking backup database...\n');
  
  const client = new MongoClient(BACKUP_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to backup database\n');
    
    const db = client.db();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    console.log('');
    
    // Check register100_submissions
    const register100 = db.collection('register100_submissions');
    const register100Count = await register100.countDocuments();
    console.log(`📊 register100_submissions: ${register100Count} documents`);
    
    // Check register_support_submissions
    const registerSupport = db.collection('register_support_submissions');
    const registerSupportCount = await registerSupport.countDocuments();
    console.log(`📊 register_support_submissions: ${registerSupportCount} documents`);
    console.log('');
    
    // If school ID provided, search for it
    if (searchSchoolId) {
      console.log(`🔎 Searching for School ID: ${searchSchoolId}\n`);
      
      // Search in register100
      const school100 = await register100.findOne({ schoolId: searchSchoolId });
      if (school100) {
        console.log('✅ Found in register100_submissions:');
        console.log(`   School ID: ${school100.schoolId}`);
        console.log(`   School Name: ${school100.reg100_schoolName || 'N/A'}`);
        console.log(`   Email: ${school100.teacherEmail || 'N/A'}`);
        console.log(`   Created: ${school100.createdAt || 'N/A'}`);
        console.log(`   MongoDB _id: ${school100._id}`);
        console.log('');
      }
      
      // Search in register_support
      const schoolSupport = await registerSupport.findOne({ schoolId: searchSchoolId });
      if (schoolSupport) {
        console.log('✅ Found in register_support_submissions:');
        console.log(`   School ID: ${schoolSupport.schoolId}`);
        console.log(`   School Name: ${schoolSupport.regsup_schoolName || 'N/A'}`);
        console.log(`   Email: ${schoolSupport.teacherEmail || 'N/A'}`);
        console.log(`   Created: ${schoolSupport.createdAt || 'N/A'}`);
        console.log(`   MongoDB _id: ${schoolSupport._id}`);
        console.log('');
      }
      
      if (!school100 && !schoolSupport) {
        console.log('❌ School not found in backup');
      }
    } else {
      // Show latest 10 schools
      console.log('📋 Latest 10 schools in backup:\n');
      
      console.log('Register100:');
      const latest100 = await register100
        .find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();
      
      latest100.forEach((school, i) => {
        console.log(`   ${i + 1}. ${school.schoolId} - ${school.reg100_schoolName}`);
        console.log(`      Created: ${school.createdAt}`);
      });
      
      console.log('\nRegister Support:');
      const latestSupport = await registerSupport
        .find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();
      
      latestSupport.forEach((school, i) => {
        console.log(`   ${i + 1}. ${school.schoolId} - ${school.regsup_schoolName}`);
        console.log(`      Created: ${school.createdAt}`);
      });
    }
    
    console.log('\n💡 To search for specific school:');
    console.log('   node scripts/check-backup-data.js SCH-20260607-0496');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Connection closed');
  }
}

main();
