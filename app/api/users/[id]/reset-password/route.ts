// Reset Password API
import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getSession } from '@/lib/auth/session';
import { hashPassword, generateTeacherPassword } from '@/lib/auth/password';
import { sendTeacherPasswordEmail } from '@/lib/email/mailer';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  if (!session || !['root', 'admin'].includes(session.role)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const client = new MongoClient(uri);

  try {
    const body = await request.json();
    const { newPassword, sendEmail } = body;

    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection('users');

    // Get user
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบผู้ใช้งาน' },
        { status: 404 }
      );
    }

    // Only root can reset root password
    if (user.role === 'root' && session.role !== 'root') {
      return NextResponse.json(
        { success: false, message: 'ไม่มีสิทธิ์รีเซ็ตรหัสผ่าน Root' },
        { status: 403 }
      );
    }

    // Generate or use provided password
    const password = newPassword || generateTeacherPassword();
    const hashedPassword = await hashPassword(password);

    // Update password
    await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    // Send email if requested and user is teacher
    if (sendEmail && user.role === 'teacher' && user.schoolId) {
      // Get school name
      let schoolName = 'โรงเรียนของคุณ';
      
      try {
        const submissionsCollection = database.collection('register_support_submissions');
        const submission = await submissionsCollection.findOne({
          _id: new ObjectId(user.schoolId),
        });

        if (submission && submission.schoolName) {
          schoolName = submission.schoolName;
        }
      } catch (e) {
        console.error('Error fetching school name:', e);
      }

      await sendTeacherPasswordEmail(
        user.email,
        password,
        user.schoolId,
        schoolName
      );
    }

    return NextResponse.json({
      success: true,
      message: 'รีเซ็ตรหัสผ่านสำเร็จ',
      password: newPassword ? undefined : password, // Return password only if auto-generated
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
