/**
 * Script to fix activity_logs that have schoolId but missing schoolName
 * อิงชื่อโรงเรียนจาก register100_submissions หรือ register_support_submissions
 * โดยใช้ schoolId เป็น key
 */
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function fixMissingSchoolNames() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db(dbName);
    const activityLogs   = db.collection('activity_logs');
    const reg100         = db.collection('register100_submissions');
    const regSupport     = db.collection('register_support_submissions');

    // 1. หา logs ที่มี schoolId แต่ไม่มี schoolName
    const broken = await activityLogs.find({
      schoolId: { $exists: true, $ne: null, $ne: '' },
      $or: [
        { schoolName: { $exists: false } },
        { schoolName: null },
        { schoolName: '' },
      ],
    }).toArray();

    console.log(`📋 พบ activity logs ที่ต้องซ่อม: ${broken.length} รายการ\n`);

    if (broken.length === 0) {
      console.log('✨ ไม่มีข้อมูลที่ต้องซ่อม');
      return;
    }

    // 2. สร้าง cache map ของ schoolId → schoolName เพื่อลด DB queries
    const schoolNameCache = new Map();

    // โหลด schoolId ทั้งหมดที่ต้องการ
    const uniqueSchoolIds = [...new Set(broken.map(log => log.schoolId))];
    console.log(`🔍 ค้นหาชื่อโรงเรียนสำหรับ ${uniqueSchoolIds.length} School IDs...\n`);

    for (const schoolId of uniqueSchoolIds) {
      // ลองหาจาก register100 ก่อน
      const r100 = await reg100.findOne(
        { schoolId },
        { projection: { schoolName: 1, reg100_schoolName: 1 } }
      );

      if (r100) {
        const name = r100.schoolName || r100.reg100_schoolName;
        if (name) {
          schoolNameCache.set(schoolId, name);
          continue;
        }
      }

      // ถ้าไม่เจอ ลองหาจาก register_support
      const rSup = await regSupport.findOne(
        { schoolId },
        { projection: { schoolName: 1, regsup_schoolName: 1 } }
      );

      if (rSup) {
        const name = rSup.schoolName || rSup.regsup_schoolName;
        if (name) {
          schoolNameCache.set(schoolId, name);
        }
      }
    }

    console.log(`✅ พบชื่อโรงเรียนได้ ${schoolNameCache.size} / ${uniqueSchoolIds.length} School IDs\n`);

    // 3. อัพเดท activity logs
    let updated = 0;
    let notFound = 0;

    for (const log of broken) {
      const schoolName = schoolNameCache.get(log.schoolId);

      if (schoolName) {
        await activityLogs.updateOne(
          { _id: log._id },
          { $set: { schoolName } }
        );
        updated++;
        console.log(`  ✅ แก้ไข: ${log.schoolId} → "${schoolName}" [${log.activityType}]`);
      } else {
        notFound++;
        console.log(`  ⚠️  ไม่พบชื่อ: ${log.schoolId} [${log.activityType}]`);
      }
    }

    console.log(`\n========================================`);
    console.log(`📊 สรุปการซ่อมข้อมูล:`);
    console.log(`   ✅ แก้ไขสำเร็จ : ${updated} รายการ`);
    console.log(`   ⚠️  ไม่พบชื่อ  : ${notFound} รายการ`);
    console.log(`   📋 รวมทั้งหมด  : ${broken.length} รายการ`);
    console.log(`========================================\n`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

fixMissingSchoolNames();
