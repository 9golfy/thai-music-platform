/**
 * Restore School Data from Backup
 * 
 * กู้คืนข้อมูลโรงเรียนจาก backup database
 * 
 * Usage: 
 * node scripts/restore-from-backup.js <schoolId> <type>
 * 
 * Example:
 * node scripts/restore-from-backup.js SCH-20260607-0496 register100
 * node scripts/restore-from-backup.js SCH-20260607-0496 register-support
 */

const { MongoClient, ObjectId } = require('mongodb');

// Configuration
const BACKUP_URI = process.env.BACKUP_MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school_backup?authSource=admin';
const PRODUCTION_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Error: Please provide School ID and type');
    console.log('\nUsage:');
    console.log('  node scripts/restore-from-backup.js <schoolId> <type>');
    console.log('\nExamples:');
    console.log('  node scripts/restore-from-backup.js SCH-20260607-0496 register100');
    console.log('  node scripts/restore-from-backup.js SCH-20260607-0496 register-support');
    process.exit(1);
  }
  
  const schoolId = args[0];
  const type = args[1];
  
  if (!['register100', 'register-support'].includes(type)) {
    console.error('❌ Error: Type must be "register100" or "register-support"');
    process.exit(1);
  }
  
  const collectionName = type === 'register100' 
    ? 'register100_submissions' 
    : 'register_support_submissions';
  
  console.log('🔄 Starting restore process...');
  console.log(`   School ID: ${schoolId}`);
  console.log(`   Type: ${type}`);
  console.log(`   Collection: ${collectionName}\n`);
  
  // Connect to backup database
  const backupClient = new MongoClient(BACKUP_URI);
  const prodClient = new MongoClient(PRODUCTION_URI);
  
  try {
    // 1. Connect to backup
    await backupClient.connect();
    console.log('✅ Connected to backup database');
    
    const backupDb = backupClient.db();
    const backupCollection = backupDb.collection(collectionName);
    
    // 2. Find the school in backup
    const schoolData = await backupCollection.findOne({ schoolId });
    
    if (!schoolData) {
      console.error(`❌ School not found in backup: ${schoolId}`);
      process.exit(1);
    }
    
    console.log('✅ Found school in backup:');
    const schoolName = schoolData.reg100_schoolName || schoolData.regsup_schoolName || 'N/A';
    console.log(`   Name: ${schoolName}`);
    console.log(`   Email: ${schoolData.teacherEmail || 'N/A'}`);
    console.log(`   Created: ${schoolData.createdAt || 'N/A'}`);
    console.log(`   Original _id: ${schoolData._id}\n`);
    
    // 3. Connect to production
    await prodClient.connect();
    console.log('✅ Connected to production database');
    
    const prodDb = prodClient.db();
    const prodCollection = prodDb.collection(collectionName);
    
    // 4. Check if already exists in production
    const existingSchool = await prodCollection.findOne({ schoolId });
    
    if (existingSchool) {
      console.log('⚠️  Warning: School already exists in production!');
      console.log(`   Production _id: ${existingSchool._id}`);
      console.log(`   Name: ${existingSchool.reg100_schoolName || existingSchool.regsup_schoolName}`);
      console.log('\n❓ Do you want to:');
      console.log('   1. Skip (keep current production data)');
      console.log('   2. Update (merge backup data with production)');
      console.log('   3. Replace (delete production and insert backup)');
      console.log('\n⚠️  This script will SKIP by default for safety.');
      console.log('   If you want to update/replace, please modify the script.');
      process.exit(0);
    }
    
    // 5. Prepare data for insert
    // Remove _id to let MongoDB generate new one
    const { _id, ...dataToInsert } = schoolData;
    
    // Add restore metadata
    dataToInsert.restoredFromBackup = true;
    dataToInsert.restoredAt = new Date();
    dataToInsert.originalBackupId = _id.toString();
    
    // 6. Insert into production
    console.log('💾 Inserting data into production...');
    const result = await prodCollection.insertOne(dataToInsert);
    
    console.log('\n═══════════════════════════════════════');
    console.log('✅ Restore completed successfully!');
    console.log('═══════════════════════════════════════');
    console.log(`   New Production _id: ${result.insertedId}`);
    console.log(`   School ID: ${schoolId}`);
    console.log(`   School Name: ${schoolName}`);
    console.log('═══════════════════════════════════════\n');
    
    console.log('📝 Next steps:');
    console.log('   1. Verify the data in admin dashboard');
    console.log('   2. Check if certificates need to be restored');
    console.log('   3. Check if teacher user account needs to be restored');
    
  } catch (error) {
    console.error('❌ Error during restore:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await backupClient.close();
    await prodClient.close();
    console.log('\n✅ Connections closed');
  }
}

main();
