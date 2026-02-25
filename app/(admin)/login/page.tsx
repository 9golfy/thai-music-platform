'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('displayName', data.user.displayName);
        
        router.push('/dashboard');
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
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B050] focus:border-transparent"
                    placeholder="กรอก username"
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
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B050] focus:border-transparent"
                    placeholder="กรอก password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#00B050] text-white rounded-lg hover:bg-[#009040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B050] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
                <button
                  type="button"
                  className="text-sm text-[#00B050] hover:text-[#009040] font-medium"
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
                  <strong className="text-white">ข้อมูลทดสอบ:</strong>
                </div>
                <div className="text-sm space-y-1">
                  <div>Username: <span className="font-mono font-semibold">root</span></div>
                  <div>Password: <span className="font-mono font-semibold">admin</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
