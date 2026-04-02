import { NextResponse } from 'next/server';
import { generateSubmissionSuccessEmailHTML } from '@/lib/email/templates/submissionSuccess';

export async function GET() {
  const emailHTML = generateSubmissionSuccessEmailHTML({
    email: 'test@example.com',
    schoolId: 'SCH-20260402-0001',
    password: '123456',
    schoolName: 'โรงเรียนทดสอบ',
    submissionType: 'register100',
    loginUrl: 'http://localhost:3000/teacher-login', // This parameter is not used anymore
    submissionId: 'test-submission-id',
  });

  return new NextResponse(emailHTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
