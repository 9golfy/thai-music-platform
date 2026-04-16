import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/mongodb';
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

    const { db } = await connectToDatabase();

    // Get user details
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.schoolId) {
      return NextResponse.json(
        { success: false, message: 'User does not have a school ID' },
        { status: 400 }
      );
    }

    // Generate new password
    const { generateTeacherPassword } = await import('@/lib/auth/password');
    const { hashPassword } = await import('@/lib/auth/password');
    
    const newPassword = generateTeacherPassword();
    const hashedPassword = await hashPassword(newPassword);

    // Update user password in database
    await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          password: hashedPassword,
          plainPassword: newPassword,
          updatedAt: new Date()
        } 
      }
    );

    console.log('✅ Password reset successfully for user:', user.email);

    // Try to find school information in register100_submissions or register_support_submissions
    let school = await db.collection('register100_submissions').findOne({ schoolId: user.schoolId });
    let submissionType: 'register100' | 'register_support' = 'register100';

    if (!school) {
      school = await db.collection('register_support_submissions').findOne({ schoolId: user.schoolId });
      submissionType = 'register_support';
    }

    if (!school) {
      return NextResponse.json(
        { success: false, message: 'School information not found' },
        { status: 404 }
      );
    }

    // Get the new password that was just generated
    const password = newPassword;

    // Prepare email data
    const emailData = {
      teacherEmail: user.email,
      teacherPhone: user.phone || school.phone || school.reg100_phone || school.regsup_phone || '',
      schoolName: school.schoolName || school.reg100_schoolName || school.regsup_schoolName || '',
      schoolId: user.schoolId,
      password: password,
      loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/teacher-login`,
      submissionType: submissionType,
      submissionId: school._id.toString()
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
