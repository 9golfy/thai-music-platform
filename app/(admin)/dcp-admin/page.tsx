'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Login attempt:', { email, password: '***' });

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📄 Response data:', data);

      if (response.ok && data.success) {
        console.log('✅ Login successful, redirecting...');
        router.push('/dcp-admin/dashboard');
        router.refresh();
      } else {
        console.log('❌ Login failed:', data.message || data.error);
        setError(data.message || data.error || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h1>
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
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B050] focus:border-transparent"
                    placeholder="กรอก username"
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
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B050] focus:border-transparent"
                    placeholder="กรอก password"
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#00B050] text-white rounded-lg hover:bg-[#009040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B050] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  suppressHydrationWarning
                >
                  {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/forgetpassword')}
                  className="text-sm text-[#00B050] hover:text-[#009040] font-medium"
                  suppressHydrationWarning
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
            </form>
          </div>

          {/* Info Panel */}
          <div className="bg-gradient-to-br from-[#00B050] to-[#009944] p-8 text-white flex flex-col justify-center">
            <div className="text-center">
              <div className="mb-6">
                <img src="/Logo.png" alt="Logo" className="h-20 w-20 mx-auto mb-4" />
              </div>
              <h2 className="text-2xl font-bold mb-4">ระบบจัดการ</h2>
              <p className="text-white/90 mb-8">
                ระบบจัดการข้อมูลโรงเรียนดนตรีไทย
                <br />
                สำหรับผู้ดูแลระบบเท่านั้น
              </p>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-sm text-white/75 mb-2">
                  <strong className="text-white">System Admin:</strong>
                </div>
                <div className="text-sm space-y-1 mb-3">
                  <div>Email: <span className="font-mono font-semibold">root@thaimusic.com</span></div>
                  <div>Password: <span className="font-mono font-semibold">P@sswordAdmin123</span></div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('root@thaimusic.com');
                    setPassword('P@sswordAdmin123');
                  }}
                  className="w-full py-2 px-3 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors font-medium"
                >
                  กรอกข้อมูลอัตโนมัติ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
