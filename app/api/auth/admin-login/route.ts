// Admin Login API
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
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอก Email และ Password' },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection<User>('users');

    // Find user by email and role (admin or root only)
    const user = await usersCollection.findOne({
      email: email.toLowerCase(),
      role: { $in: ['admin', 'root'] },
      isActive: true,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email หรือ Password ไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Email หรือ Password ไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Create session
    await setSessionCookie({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return NextResponse.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
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
