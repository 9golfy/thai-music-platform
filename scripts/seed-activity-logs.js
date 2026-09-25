// Script to seed activity logs with sample data
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function seedActivityLogs() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db(dbName);
    const collection = database.collection('activity_logs');

    // ตัวอย่างข้อมูล Activities
    const sampleActivities = [
      {
        userId: '507f1f77bcf86cd799439011',
        userName: 'สมชาย ใจดี',
        schoolId: 'SCH001',
        schoolName: 'โรงเรียนดนตรีไทยสมุทรปราการ',
        activityType: 'LOGIN',
        description: 'ครู สมชาย ใจดี เข้าสู่ระบบ',
        metadata: {
          email: 'somchai@example.com',
          submissionType: 'register100',
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date('2026-09-25T08:30:00Z'),
      },
      {
        userId: '507f1f77bcf86cd799439012',
        userName: 'สมหญิง รักเรียน',
        schoolId: 'SCH002',
        schoolName: 'โรงเรียนดนตรีไทยนครปฐม',
        activityType: 'CERTIFICATE_VIEW',
        description: 'เปิดดูใบประกาศ: โรงเรียนดนตรีไทยนครปฐม (CERT-2569-123456)',
        metadata: {
          certificateId: '507f1f77bcf86cd799439020',
          certificateNumber: 'CERT-2569-123456',
          certificateType: 'register100',
        },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date('2026-09-25T09:15:00Z'),
      },
      {
        userId: '507f1f77bcf86cd799439012',
        userName: 'สมหญิง รักเรียน',
        schoolId: 'SCH002',
        schoolName: 'โรงเรียนดนตรีไทยนครปฐม',
        activityType: 'CERTIFICATE_DOWNLOAD',
        description: 'ดาวน์โหลดใบประกาศ: โรงเรียนดนตรีไทยนครปฐม (CERT-2569-123456)',
        metadata: {
          certificateId: '507f1f77bcf86cd799439020',
          certificateNumber: 'CERT-2569-123456',
          schoolName: 'โรงเรียนดนตรีไทยนครปฐม',
        },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date('2026-09-25T09:16:00Z'),
      },
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
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        createdAt: new Date('2026-09-25T07:00:00Z'),
      },
      {
        userId: '507f1f77bcf86cd799439011',
        userName: 'สมชาย ใจดี',
        schoolId: 'SCH001',
        schoolName: 'โรงเรียนดนตรีไทยสมุทรปราการ',
        activityType: 'PROFILE_UPDATE',
        description: 'แก้ไขข้อมูลโปรไฟล์',
        metadata: {
          updatedFields: ['phone', 'profileImage'],
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date('2026-09-25T10:30:00Z'),
      },
      {
        userId: '507f1f77bcf86cd799439014',
        userName: 'วิไล สุขสันต์',
        schoolId: 'SCH003',
        schoolName: 'โรงเรียนดนตรีไทยพระนครศรีอยุธยา',
        activityType: 'LOGIN',
        description: 'ครู วิไล สุขสันต์ เข้าสู่ระบบ',
        metadata: {
          email: 'wilai@example.com',
          submissionType: 'register-support',
        },
        ipAddress: '192.168.1.150',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) Safari/604.1',
        createdAt: new Date('2026-09-25T11:00:00Z'),
      },
      {
        userId: '507f1f77bcf86cd799439014',
        userName: 'วิไล สุขสันต์',
        schoolId: 'SCH003',
        schoolName: 'โรงเรียนดนตรีไทยพระนครศรีอยุธยา',
        activityType: 'CERTIFICATE_VIEW',
        description: 'เปิดดูใบประกาศ: โรงเรียนดนตรีไทยพระนครศรีอยุธยา (CERT-2569-789012)',
        metadata: {
          certificateId: '507f1f77bcf86cd799439021',
          certificateNumber: 'CERT-2569-789012',
          certificateType: 'register-support',
        },
        ipAddress: '192.168.1.150',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) Safari/604.1',
        createdAt: new Date('2026-09-25T11:05:00Z'),
      },
      {
        userId: '507f1f77bcf86cd799439015',
        userName: 'มานะ ขยัน',
        schoolId: 'SCH004',
        schoolName: 'โรงเรียนดนตรีไทยเชียงใหม่',
        activityType: 'LOGIN',
        description: 'ครู มานะ ขยัน เข้าสู่ระบบ',
        metadata: {
          email: 'mana@example.com',
          submissionType: 'register100',
        },
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0.0',
        createdAt: new Date('2026-09-25T13:20:00Z'),
      },
      {
        userId: '507f1f77bcf86cd799439013',
        userName: 'Admin System',
        schoolId: null,
        schoolName: null,
        activityType: 'CERTIFICATE_DOWNLOAD',
        description: 'ดาวน์โหลดใบประกาศ: โรงเรียนดนตรีไทยสมุทรปราการ (CERT-2569-555555)',
        metadata: {
          certificateId: '507f1f77bcf86cd799439022',
          certificateNumber: 'CERT-2569-555555',
          schoolName: 'โรงเรียนดนตรีไทยสมุทรปราการ',
        },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        createdAt: new Date('2026-09-25T14:00:00Z'),
      },
      {
        userId: '507f1f77bcf86cd799439016',
        userName: 'สุดา เพียร',
        schoolId: 'SCH005',
        schoolName: 'โรงเรียนดนตรีไทยขอนแก่น',
        activityType: 'PASSWORD_CHANGE',
        description: 'เปลี่ยนรหัสผ่าน',
        metadata: {
          method: 'self-service',
        },
        ipAddress: '192.168.1.210',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0',
        createdAt: new Date('2026-09-25T15:45:00Z'),
      },
    ];

    // Insert ข้อมูล
    const result = await collection.insertMany(sampleActivities);
    console.log(`✅ Inserted ${result.insertedCount} activity logs`);

    // แสดงตัวอย่างข้อมูลที่ insert
    console.log('\n📋 Sample activities created:');
    sampleActivities.forEach((activity, index) => {
      console.log(`  ${index + 1}. [${activity.activityType}] ${activity.userName || 'N/A'} - ${activity.description}`);
    });

    console.log('\n✨ Done! You can now view the activities at:');
    console.log('   http://localhost:3000/dcp-admin/dashboard/activities');

  } catch (error) {
    console.error('❌ Error seeding activity logs:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

// Run the seeding function
seedActivityLogs();
