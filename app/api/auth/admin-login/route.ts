// Admin Login API
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyPassword } from '@/lib/auth/password';
import { setSessionCookie } from '@/lib/auth/session';
import { User } from '@/lib/types/user.types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 Admin login attempt:', { email });

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอก Email และ Password' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const usersCollection = db.collection<User>('users');

    // Find user by email and role (admin, root, or super_admin only)
    const user = await usersCollection.findOne({
      email: email.toLowerCase(),
      role: { $in: ['admin', 'root', 'super_admin'] },
      isActive: { $ne: false }, // Allow undefined or true
    });

    console.log('👤 User found:', user ? { email: user.email, role: user.role } : 'Not found');

    if (!user) {
      console.log('❌ User not found or not active');
      return NextResponse.json(
        { success: false, message: 'Email หรือ Password ไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    console.log('🔑 Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Invalid password');
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

    console.log('✅ Login successful');

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
    console.error('❌ Admin login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
