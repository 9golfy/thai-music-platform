import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth/session';

export async function POST() {
  try {
    await deleteSession();
    
    const response = NextResponse.json({
      success: true,
      message: 'ออกจากระบบสำเร็จ'
    });

    // Clear auth-token cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      /* secure: process.env.NODE_ENV === 'production',*/
      secure: process.env.COOKIE_SECURE === 'true', // ให้เหมือนกัน
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการออกจากระบบ' },
      { status: 500 }
    );
  }
}
