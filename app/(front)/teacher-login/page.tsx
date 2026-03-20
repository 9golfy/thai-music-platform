'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/teacher-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, schoolId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to submission detail view if found
        if (data.submissionId && data.submissionType) {
          router.push(`/teacher/dashboard/${data.submissionType}/${data.submissionId}`);
        } else {
          // Fallback to dashboard if no submission found
          router.push('/teacher/dashboard');
        }
        router.refresh();
      } else {
        setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Login Form */}
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">เข้าสู่ระบบครู</h1>
              <p className="text-gray-600">ระบบจัดการโรงเรียนดนตรีไทย</p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative">
                <span className="block sm:inline">{error}</span>
                <button
                  onClick={() => setError('')}
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                >
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="teacher@school.ac.th"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="รหัสผ่าน 6 หลัก"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* School ID */}
              <div>
                <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-2">
                  School ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input
                    id="schoolId"
                    type="text"
                    required
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="SCH-20260228-0001"
                    suppressHydrationWarning
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">รูปแบบ: SCH-YYYYMMDD-XXXX</p>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  suppressHydrationWarning
                >
                  {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/request-password')}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                  suppressHydrationWarning
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
            </form>
          </div>

          {/* Info Panel - Request Password */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-8 text-white flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="mb-6">
                <img src="/Logo.png" alt="Logo" className="h-20 w-20 mx-auto mb-4" />
              </div>
              <h2 className="text-2xl font-bold mb-2">ลืมรหัสผ่าน?</h2>
              <p className="text-white/90 text-sm">
                ขอรหัสผ่านใหม่ผ่านอีเมล
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <span className="text-3xl">📧</span>
                <div className="flex-1">
                  <p className="font-semibold mb-1">ขอรหัสผ่านทาง Email</p>
                  <p className="text-sm text-white/80">
                    ระบบจะส่ง Password และ School ID ไปยังอีเมลของคุณ
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-3xl">🔐</span>
                <div className="flex-1">
                  <p className="font-semibold mb-1">รหัสผ่าน 6 หลัก</p>
                  <p className="text-sm text-white/80">
                    รหัสผ่านจะเป็นตัวเลข 6 หลัก
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-3xl">⚡</span>
                <div className="flex-1">
                  <p className="font-semibold mb-1">ได้รับทันที</p>
                  <p className="text-sm text-white/80">
                    ตรวจสอบอีเมลของคุณภายใน 1-2 นาที
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/request-password')}
              className="w-full bg-white text-green-600 py-3 px-4 rounded-lg hover:bg-white/90 transition-colors font-medium"
            >
              ขอรหัสผ่านใหม่
            </button>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-xs text-white/70 text-center">
                หากมีปัญหาในการเข้าสู่ระบบ<br />
                กรุณาติดต่อผู้ดูแลระบบ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
