// Teacher Login API
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { verifyPassword } from '@/lib/auth/password';
import { setSessionCookie } from '@/lib/auth/session';
import { User } from '@/lib/types/user.types';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

export async function POST(request: Request) {
  const client = new MongoClient(uri);

  try {
    const body = await request.json();
    const { email, password, schoolId } = body;

    if (!email || !password || !schoolId) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection<User>('users');

    // Find teacher by email, schoolId, and role
    const user = await usersCollection.findOne({
      email: email.toLowerCase(),
      schoolId: schoolId,
      role: 'teacher',
      isActive: true,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบ Email, Password และ School ID' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบ Email, Password และ School ID' },
        { status: 401 }
      );
    }

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Find the submission record by schoolId
    let submissionId = null;
    let submissionType = null;

    // Try register100 first
    const register100Collection = database.collection('register100_submissions');
    const register100Submission = await register100Collection.findOne({ schoolId: schoolId });
    
    if (register100Submission) {
      submissionId = register100Submission._id.toString();
      submissionType = 'register100';
    } else {
      // Try register_support
      const registerSupportCollection = database.collection('register_support_submissions');
      const registerSupportSubmission = await registerSupportCollection.findOne({ schoolId: schoolId });
      
      if (registerSupportSubmission) {
        submissionId = registerSupportSubmission._id.toString();
        submissionType = 'register-support';
      }
    }

    // Create session
    await setSessionCookie({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      schoolId: user.schoolId,
    });

    return NextResponse.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        schoolId: user.schoolId,
      },
      submissionId,
      submissionType,
    });
  } catch (error) {
    console.error('Teacher login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
