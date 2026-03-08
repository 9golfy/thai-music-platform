// Request Password API for Teachers
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { sendTeacherPasswordEmail } from '@/lib/email/mailer';
import { notifyAdminPasswordReset } from '@/lib/email/adminNotifications';
import { sendEmailWithRateLimit } from '@/lib/email/rateLimiter';
import { User } from '@/lib/types/user.types';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

// Generate 6-digit password
function generateTeacherPassword(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash password
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function POST(request: Request) {
  const client = new MongoClient(uri);

  try {
    const body = await request.json();
    const { email, phone } = body;

    if (!email || !phone) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอก Email และเบอร์โทรศัพท์' },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection<User>('users');

    // Find teacher by email and phone
    const user = await usersCollection.findOne({
      email: email.toLowerCase(),
      phone: phone,
      role: 'teacher',
      isActive: true,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบข้อมูลที่ตรงกับ Email และเบอร์โทรศัพท์ที่ระบุ' },
        { status: 404 }
      );
    }

    if (!user.schoolId) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบ School ID ในระบบ กรุณาติดต่อผู้ดูแลระบบ' },
        { status: 400 }
      );
    }

    // Get school name from submissions
    const submissionsCollection = database.collection('register_support_submissions');
    let schoolName = 'โรงเรียนของคุณ';
    
    const submission = await submissionsCollection.findOne({
      schoolId: user.schoolId,
    });

    if (submission && submission.schoolName) {
      schoolName = submission.schoolName;
    } else {
      // Try register100 collection
      const register100Collection = database.collection('register100_submissions');
      const register100Submission = await register100Collection.findOne({
        schoolId: user.schoolId,
      });
      if (register100Submission && register100Submission.schoolName) {
        schoolName = register100Submission.schoolName;
      }
    }

    // Generate new 6-digit password
    const newPassword = generateTeacherPassword();
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password in database
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    // Send email with new password and school info
    const userEmailResult = await sendEmailWithRateLimit(
      () => sendTeacherPasswordEmail(
        user.email,
        newPassword,
        user.schoolId!, // We already checked this exists above
        schoolName,
        `${user.firstName} ${user.lastName}`,
        user.phone
      ),
      'high' // High priority for password reset emails
    );

    if (!userEmailResult.success) {
      console.error('⚠️ Failed to send password reset email to:', user.email);
      if (userEmailResult.rateLimited) {
        console.error('📧 Password reset email was rate limited:', userEmailResult.error);
      }
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถส่ง Email ได้ กรุณาลองใหม่อีกครั้ง' },
        { status: 500 }
      );
    }

    // Send admin notification with rate limiting
    const adminEmailResult = await sendEmailWithRateLimit(
      () => notifyAdminPasswordReset(
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.schoolId!, // We already checked this exists above
        schoolName
      ),
      'low' // Low priority for admin notifications about password resets
    );

    if (!adminEmailResult.success) {
      console.error('⚠️ Failed to send admin notification for password reset');
      if (adminEmailResult.rateLimited) {
        console.error('📧 Admin password reset notification was rate limited:', adminEmailResult.error);
      }
      // Don't fail the request - this is just a notification
    }

    return NextResponse.json({
      success: true,
      message: 'ส่งรหัสผ่านไปยัง Email ของคุณเรียบร้อยแล้ว',
      adminNotified: adminEmailResult.success,
    });

  } catch (error) {
    console.error('Request password error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการขอรหัสผ่าน',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
