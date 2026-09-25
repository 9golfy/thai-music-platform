// Script to add more diverse activity logs
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function addMoreActivities() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db(dbName);
    const collection = database.collection('activity_logs');

    const moreActivities = [
      // Password request ซ้ำ (กรณีลืมหลายครั้ง)
      {
        userId: '507f1f77bcf86cd799439018',
        userName: 'สมศรี ดีมาก',
        schoolId: 'SCH007',
        schoolName: 'โรงเรียนดนตรีไทยภูเก็ต',
        activityType: 'PASSWORD_CHANGE',
        description: 'ขอรหัสผ่านใหม่: สมศรี ดีมาก (somsri@example.com)',
        metadata: {
          email: 'somsri@example.com',
          phone: '0823456789',
          method: 'request-password',
        },
        ipAddress: '171.6.45.123',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        userId: '507f1f77bcf86cd799439018',
        userName: 'สมศรี ดีมาก',
        schoolId: 'SCH007',
        schoolName: 'โรงเรียนดนตรีไทยภูเก็ต',
        activityType: 'PASSWORD_CHANGE',
        description: 'ขอรหัสผ่านใหม่: สมศรี ดีมาก (somsri@example.com)',
        metadata: {
          email: 'somsri@example.com',
          phone: '0823456789',
          method: 'request-password',
          note: 'ลืมรหัสผ่านอีกครั้ง',
        },
        ipAddress: '171.6.45.123',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
      // Login หลังได้รหัสผ่านใหม่
      {
        userId: '507f1f77bcf86cd799439018',
        userName: 'สมศรี ดีมาก',
        schoolId: 'SCH007',
        schoolName: 'โรงเรียนดนตรีไทยภูเก็ต',
        activityType: 'LOGIN',
        description: 'ครู สมศรี ดีมาก เข้าสู่ระบบ',
        metadata: {
          email: 'somsri@example.com',
          submissionType: 'register100',
          note: 'Login with new password',
        },
        ipAddress: '171.6.45.123',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      },
      // Certificate download ติดต่อกัน (ดาวน์โหลดหลายครั้ง)
      {
        userId: '507f1f77bcf86cd799439019',
        userName: 'วันชัย ใจกล้า',
        schoolId: 'SCH008',
        schoolName: 'โรงเรียนดนตรีไทยอุบลราชธานี',
        activityType: 'CERTIFICATE_VIEW',
        description: 'เปิดดูใบประกาศ: โรงเรียนดนตรีไทยอุบลราชธานี (CERT-2569-999001)',
        metadata: {
          certificateId: '507f1f77bcf86cd799439030',
          certificateNumber: 'CERT-2569-999001',
          certificateType: 'register100',
        },
        ipAddress: '123.45.67.89',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/120.0',
        createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      },
      {
        userId: '507f1f77bcf86cd799439019',
        userName: 'วันชัย ใจกล้า',
        schoolId: 'SCH008',
        schoolName: 'โรงเรียนดนตรีไทยอุบลราชธานี',
        activityType: 'CERTIFICATE_DOWNLOAD',
        description: 'ดาวน์โหลดใบประกาศ: โรงเรียนดนตรีไทยอุบลราชธานี (CERT-2569-999001)',
        metadata: {
          certificateId: '507f1f77bcf86cd799439030',
          certificateNumber: 'CERT-2569-999001',
          schoolName: 'โรงเรียนดนตรีไทยอุบลราชธานี',
        },
        ipAddress: '123.45.67.89',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/120.0',
        createdAt: new Date(Date.now() - 14 * 60 * 1000), // 14 minutes ago
      },
      {
        userId: '507f1f77bcf86cd799439019',
        userName: 'วันชัย ใจกล้า',
        schoolId: 'SCH008',
        schoolName: 'โรงเรียนดนตรีไทยอุบลราชธานี',
        activityType: 'CERTIFICATE_DOWNLOAD',
        description: 'ดาวน์โหลดใบประกาศ: โรงเรียนดนตรีไทยอุบลราชธานี (CERT-2569-999001)',
        metadata: {
          certificateId: '507f1f77bcf86cd799439030',
          certificateNumber: 'CERT-2569-999001',
          schoolName: 'โรงเรียนดนตรีไทยอุบลราชธานี',
          note: 'Download again',
        },
        ipAddress: '123.45.67.89',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/120.0',
        createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      },
      // Admin login ในเวลาต่างๆ
      {
        userId: '507f1f77bcf86cd799439013',
        userName: 'Admin System',
        schoolId: null,
        schoolName: null,
        activityType: 'LOGIN',
        description: 'Admin Admin System เข้าสู่ระบบ',
        metadata: {
          email: 'admin@dcpschool100.net',
          role: 'admin',
        },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
    ];

    const result = await collection.insertMany(moreActivities);
    console.log(`✅ Inserted ${result.insertedCount} more activity logs`);

    console.log('\n📋 Activities added:');
    moreActivities.forEach((activity, index) => {
      const timeAgo = Math.round((Date.now() - activity.createdAt.getTime()) / (1000 * 60));
      console.log(`  ${index + 1}. [${activity.activityType}] ${activity.userName || 'N/A'} - ${timeAgo} minutes ago`);
    });

    console.log('\n✨ Done! Total activities in database now includes:');
    const total = await collection.countDocuments();
    console.log(`   📊 ${total} activity logs`);

  } catch (error) {
    console.error('❌ Error adding activities:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

// Run the function
addMoreActivities();
