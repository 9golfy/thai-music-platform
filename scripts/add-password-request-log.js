// Script to add password request activity log
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function addPasswordRequestLog() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db(dbName);
    const collection = database.collection('activity_logs');

    // เพิ่มข้อมูล request password
    const passwordRequestActivity = {
      userId: '507f1f77bcf86cd799439017',
      userName: 'ประภาส หลงใหล',
      schoolId: 'SCH006',
      schoolName: 'โรงเรียนดนตรีไทยสงขลา',
      activityType: 'PASSWORD_CHANGE',
      description: 'ขอรหัสผ่านใหม่: ประภาส หลงใหล (prapas@example.com)',
      metadata: {
        email: 'prapas@example.com',
        phone: '0812345678',
        method: 'request-password',
      },
      ipAddress: '203.150.123.45',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      createdAt: new Date(),
    };

    const result = await collection.insertOne(passwordRequestActivity);
    console.log(`✅ Inserted password request activity log`);
    console.log(`\n📋 Activity details:`);
    console.log(`   User: ${passwordRequestActivity.userName}`);
    console.log(`   School: ${passwordRequestActivity.schoolName} (${passwordRequestActivity.schoolId})`);
    console.log(`   Type: ${passwordRequestActivity.activityType}`);
    console.log(`   Description: ${passwordRequestActivity.description}`);
    console.log(`   IP: ${passwordRequestActivity.ipAddress}`);
    console.log(`   Time: ${passwordRequestActivity.createdAt.toLocaleString('th-TH')}`);

    console.log('\n✨ Done! Refresh the Activities Log page to see the new entry.');

  } catch (error) {
    console.error('❌ Error adding activity log:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

// Run the function
addPasswordRequestLog();
