import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendEmail } from '@/lib/email/mailer';
import { 
  generateTeacherLoginInfoEmailHTML, 
  generateTeacherLoginInfoEmailText,
  getTeacherLoginInfoEmailSubject 
} from '@/lib/email/templates/teacherLoginInfo';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only system admins (root/super_admin) can resend credentials
    if (session.role !== 'root' && session.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Only system administrators can resend login credentials' },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('thai-music-platform');

    // Get user details
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get school information
    const school = await db.collection('schools').findOne({ schoolId: user.schoolId });

    if (!school) {
      return NextResponse.json(
        { success: false, message: 'School information not found' },
        { status: 404 }
      );
    }

    // Get the plain text password from user record (if stored)
    // Note: In production, you might want to generate a new password instead
    const password = user.plainPassword || '******';

    // Prepare email data
    const emailData = {
      teacherEmail: user.email,
      teacherPhone: user.phone || school.phone || '',
      schoolName: school.schoolName || '',
      schoolId: user.schoolId,
      password: password,
      loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/teacher-login`,
      submissionType: school.submissionType || 'register_support',
      submissionId: school.submissionId || ''
    };

    // Send email
    const emailSent = await sendEmail({
      to: user.email,
      subject: getTeacherLoginInfoEmailSubject(school.schoolName || ''),
      html: generateTeacherLoginInfoEmailHTML(emailData),
      text: generateTeacherLoginInfoEmailText(emailData),
    });

    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login credentials resent successfully',
      email: user.email
    });

  } catch (error) {
    console.error('Error resending credentials:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
