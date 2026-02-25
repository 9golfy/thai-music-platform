import { NextRequest, NextResponse } from 'next/server';

// Hardcoded credentials (for demo only - use proper auth in production)
const VALID_CREDENTIALS = {
  username: 'root',
  password: 'admin',
  displayName: 'Admin',
  role: 'admin'
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate credentials
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      // Create session token (simple implementation)
      const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');

      const response = NextResponse.json({
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ',
        user: {
          username: VALID_CREDENTIALS.username,
          displayName: VALID_CREDENTIALS.displayName,
          role: VALID_CREDENTIALS.role
        }
      });

      // Set session cookie
      response.cookies.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
      },
      { status: 500 }
    );
  }
}
