'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RequestPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/request-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/teacher-login');
        }, 5000);
      } else {
        setError(data.error || 'ไม่สามารถส่งรหัสผ่านได้');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการขอรหัสผ่าน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Request Password Form */}
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ขอรหัสผ่าน</h1>
              <p className="text-gray-600">กรอกข้อมูลเพื่อรับรหัสผ่านทาง Email</p>
            </div>

            {success ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-lg text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <p className="font-semibold text-lg mb-2">ส่งรหัสผ่านสำเร็จ!</p>
                  <p className="text-sm">
                    กรุณาตรวจสอบอีเมลของคุณ<br />
                    ระบบจะพาคุณกลับไปหน้า Login ใน 5 วินาที
                  </p>
                </div>
                <button
                  onClick={() => router.push('/teacher-login')}
                  className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  กลับไปหน้า Login
                </button>
              </div>
            ) : (
              <>
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

                <div className="mb-6 bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📧 ระบบจะส่ง Password และ School ID ไปยังอีเมลที่คุณระบุ
                  </p>
                </div>

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
                    <p className="mt-1 text-xs text-gray-500">อีเมลที่ใช้ลงทะเบียนในระบบ</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      เบอร์โทรศัพท์
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        pattern="[0-9]{10}"
                        maxLength={10}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0812345678"
                        suppressHydrationWarning
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">เบอร์โทรศัพท์ที่ใช้ลงทะเบียนในระบบ (10 หลัก)</p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      suppressHydrationWarning
                    >
                      {loading ? 'กำลังส่งรหัสผ่าน...' : 'ขอรหัสผ่าน'}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/teacher-login')}
                      disabled={loading}
                      className="w-full px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      suppressHydrationWarning
                    >
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Info Panel */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-8 text-white flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="mb-6">
                <img src="/Logo.png" alt="Logo" className="h-20 w-20 mx-auto mb-4" />
              </div>
              <h2 className="text-2xl font-bold mb-4">ขอรหัสผ่าน</h2>
              <p className="text-white/90">
                ระบบจะส่งรหัสผ่านและ School ID
                <br />
                ไปยังอีเมลของคุณ
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📧</span>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">ตรวจสอบอีเมล</p>
                    <p className="text-sm text-white/80">
                      ระบบจะส่งข้อมูลไปยังอีเมลที่คุณระบุ
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔐</span>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">รหัสผ่าน 6 หลัก</p>
                    <p className="text-sm text-white/80">
                      รหัสผ่านจะเป็นตัวเลข 6 หลัก
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🏫</span>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">School ID</p>
                    <p className="text-sm text-white/80">
                      ระบบจะส่ง School ID มาพร้อมกัน
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-xs text-white/70 text-center">
                หากมีปัญหาในการขอรหัสผ่าน<br />
                กรุณาติดต่อผู้ดูแลระบบ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
