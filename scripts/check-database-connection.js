#!/usr/bin/env node
/**
 * Check Database Connection Script
 * 
 * ตรวจสอบว่า application เชื่อมต่อกับ database ไหน
 * และ draft_submissions collection อยู่ใน database ไหน
 * 
 * Usage:
 *   node scripts/check-database-connection.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.production' });

async function checkDatabaseConnection() {
  console.log('=== ตรวจสอบการเชื่อมต่อ Database ===\n');

  // 1. ตรวจสอบ MONGODB_URI
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ ไม่พบ MONGODB_URI ใน environment variables');
    process.exit(1);
  }

  console.log('📋 MONGODB_URI:', mongoUri.replace(/:[^:@]+@/, ':****@')); // Hide password

  // 2. แยก database name จาก URI
  let databaseNameFromUri = 'thai_music_school'; // default
  try {
    const uriMatch = mongoUri.match(/\/([^/?]+)(\?|$)/);
    if (uriMatch && uriMatch[1]) {
      databaseNameFromUri = uriMatch[1];
    }
  } catch (error) {
    console.warn('⚠️  ไม่สามารถแยก database name จาก URI ได้, ใช้ default:', databaseNameFromUri);
  }

  console.log('📦 Database name จาก URI:', databaseNameFromUri);
  console.log('');

  // 3. เชื่อมต่อกับ MongoDB
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('✅ เชื่อมต่อ MongoDB สำเร็จ\n');

    // 4. ดู databases ทั้งหมด
    const adminDb = client.db().admin();
    const { databases } = await adminDb.listDatabases();
    
    console.log('📚 Databases ทั้งหมดในระบบ:');
    databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    console.log('');

    // 5. ตรวจสอบ database ที่ application ใช้
    const appDb = client.db(databaseNameFromUri);
    console.log(`🎯 Database ที่ application ใช้: ${databaseNameFromUri}\n`);

    // 6. ตรวจสอบ collections
    const collections = await appDb.listCollections().toArray();
    console.log('📁 Collections ใน database นี้:');
    
    const collectionNames = collections.map(c => c.name);
    const hasDraftSubmissions = collectionNames.includes('draft_submissions');
    const hasRegister100 = collectionNames.includes('register100_submissions');
    const hasRegisterSupport = collectionNames.includes('register_support_submissions');
    
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    console.log('');

    // 7. ตรวจสอบ draft_submissions collection
    if (hasDraftSubmissions) {
      const draftsCollection = appDb.collection('draft_submissions');
      const draftCount = await draftsCollection.countDocuments();
      const activeDraftCount = await draftsCollection.countDocuments({ status: 'active' });
      
      console.log('✅ พบ draft_submissions collection');
      console.log(`   - จำนวน drafts ทั้งหมด: ${draftCount}`);
      console.log(`   - จำนวน drafts ที่ active: ${activeDraftCount}`);
      
      // ดู draft ล่าสุด
      const latestDraft = await draftsCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();
      
      if (latestDraft.length > 0) {
        console.log(`   - Draft ล่าสุด:`);
        console.log(`     • Email: ${latestDraft[0].email}`);
        console.log(`     • Token: ${latestDraft[0].token || latestDraft[0].draftToken}`);
        console.log(`     • Created: ${latestDraft[0].createdAt}`);
        console.log(`     • Status: ${latestDraft[0].status}`);
      }
    } else {
      console.log('❌ ไม่พบ draft_submissions collection');
    }
    console.log('');

    // 8. ตรวจสอบ submissions collections
    if (hasRegister100) {
      const reg100Count = await appDb.collection('register100_submissions').countDocuments();
      console.log(`✅ พบ register100_submissions: ${reg100Count} records`);
    } else {
      console.log('❌ ไม่พบ register100_submissions');
    }

    if (hasRegisterSupport) {
      const regSupportCount = await appDb.collection('register_support_submissions').countDocuments();
      console.log(`✅ พบ register_support_submissions: ${regSupportCount} records`);
    } else {
      console.log('❌ ไม่พบ register_support_submissions');
    }
    console.log('');

    // 9. ตรวจสอบ database อื่นๆ ที่อาจมี draft_submissions
    console.log('🔍 ตรวจสอบ draft_submissions ใน databases อื่น:');
    for (const dbInfo of databases) {
      if (dbInfo.name === databaseNameFromUri || dbInfo.name === 'admin' || dbInfo.name === 'config' || dbInfo.name === 'local') {
        continue;
      }

      const otherDb = client.db(dbInfo.name);
      const otherCollections = await otherDb.listCollections().toArray();
      const hasDrafts = otherCollections.some(c => c.name === 'draft_submissions');

      if (hasDrafts) {
        const count = await otherDb.collection('draft_submissions').countDocuments();
        console.log(`   ⚠️  พบ draft_submissions ใน ${dbInfo.name}: ${count} records`);
      }
    }
    console.log('');

    // 10. สรุป
    console.log('=== สรุป ===');
    console.log(`✅ Application เชื่อมต่อกับ database: ${databaseNameFromUri}`);
    console.log(`${hasDraftSubmissions ? '✅' : '❌'} draft_submissions collection: ${hasDraftSubmissions ? 'พบ' : 'ไม่พบ'}`);
    console.log(`${hasRegister100 ? '✅' : '❌'} register100_submissions collection: ${hasRegister100 ? 'พบ' : 'ไม่พบ'}`);
    console.log(`${hasRegisterSupport ? '✅' : '❌'} register_support_submissions collection: ${hasRegisterSupport ? 'พบ' : 'ไม่พบ'}`);

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run the check
checkDatabaseConnection().catch(console.error);
