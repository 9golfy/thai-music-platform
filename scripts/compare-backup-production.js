/**
 * Compare Backup vs Production
 * 
 * เปรียบเทียบข้อมูลระหว่าง backup และ production เพื่อหาข้อมูลที่หายไป
 * 
 * Usage: 
 * node scripts/compare-backup-production.js [type]
 * 
 * Example:
 * node scripts/compare-backup-production.js register100
 * node scripts/compare-backup-production.js register-support
 * node scripts/compare-backup-production.js  (เช็คทั้งสองแบบ)
 */

const { MongoClient } = require('mongodb');

const BACKUP_URI = process.env.BACKUP_MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school_backup?authSource=admin';
const PRODUCTION_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function compareCollections(collectionName, typeName) {
  const backupClient = new MongoClient(BACKUP_URI);
  const prodClient = new MongoClient(PRODUCTION_URI);
  
  try {
    await backupClient.connect();
    await prodClient.connect();
    
    const backupDb = backupClient.db();
    const prodDb = prodClient.db();
    
    const backupCollection = backupDb.collection(collectionName);
    const prodCollection = prodDb.collection(collectionName);
    
    // Get all school IDs from backup
    const backupSchools = await backupCollection
      .find({}, { projection: { schoolId: 1, createdAt: 1, reg100_schoolName: 1, regsup_schoolName: 1 } })
      .toArray();
    
    // Get all school IDs from production
    const prodSchools = await prodCollection
      .find({}, { projection: { schoolId: 1 } })
      .toArray();
    
    const prodSchoolIds = new Set(prodSchools.map(s => s.schoolId));
    
    // Find missing schools
    const missingSchools = backupSchools.filter(s => !prodSchoolIds.has(s.schoolId));
    
    console.log(`\n📊 ${typeName} Comparison:`);
    console.log(`   Backup: ${backupSchools.length} schools`);
    console.log(`   Production: ${prodSchools.length} schools`);
    console.log(`   Missing: ${missingSchools.length} schools`);
    
    if (missingSchools.length > 0) {
      console.log(`\n❌ Missing schools in production (${typeName}):`);
      missingSchools.forEach((school, i) => {
        const name = school.reg100_schoolName || school.regsup_schoolName || 'N/A';
        const created = school.createdAt ? new Date(school.createdAt).toLocaleString('th-TH') : 'N/A';
        console.log(`   ${i + 1}. ${school.schoolId}`);
        console.log(`      Name: ${name}`);
        console.log(`      Created: ${created}`);
      });
      
      console.log(`\n💡 To restore a school, use:`);
      console.log(`   node scripts/restore-from-backup.js <schoolId> ${typeName}`);
    } else {
      console.log(`   ✅ No missing schools`);
    }
    
    return missingSchools;
    
  } finally {
    await backupClient.close();
    await prodClient.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const type = args[0] || 'all';
  
  console.log('🔍 Comparing backup vs production...\n');
  console.log('⚠️  Make sure BACKUP_MONGODB_URI is set correctly!');
  console.log(`   Backup URI: ${BACKUP_URI.replace(/:[^:]*@/, ':***@')}`);
  console.log(`   Production URI: ${PRODUCTION_URI.replace(/:[^:]*@/, ':***@')}`);
  
  try {
    if (type === 'register100' || type === 'all') {
      await compareCollections('register100_submissions', 'register100');
    }
    
    if (type === 'register-support' || type === 'all') {
      await compareCollections('register_support_submissions', 'register-support');
    }
    
    console.log('\n✅ Comparison completed\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
