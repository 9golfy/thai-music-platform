'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveDraftToLocal } from '@/lib/utils/draftStorage';

interface DraftMetadata {
  email: string;
  submissionType: 'register100' | 'register-support';
  currentStep: number;
  lastModified: string;
  expiresAt: string;
}

export default function OTPVerificationPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [token, setToken] = useState<string>('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [metadata, setMetadata] = useState<DraftMetadata | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Unwrap params
  useEffect(() => {
    Promise.resolve(params).then((p) => {
      setToken(p.token);
    });
  }, [params]);

  useEffect(() => {
    if (!token) return;
    
    // Fetch draft metadata only (don't auto-request OTP since it's already in email)
    fetchMetadata();
  }, [token]);

  useEffect(() => {
    // Update countdown timer
    if (otpExpiry) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(otpExpiry).getTime();
        const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [otpExpiry]);

  const fetchMetadata = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`/api/draft/${token}`);
      const result = await response.json();

      if (result.success && result.exists) {
        setMetadata({
          email: result.email,
          submissionType: result.submissionType,
          currentStep: result.currentStep,
          lastModified: result.lastModified,
          expiresAt: result.expiresAt,
        });
      } else {
        setError(result.message || 'ไม่พบแบบฟอร์มที่บันทึกไว้');
      }
    } catch (err) {
      console.error('Error fetching metadata:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
  };

  const requestOTP = async () => {
    if (!token) return;
    
    setIsRequestingOtp(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`/api/draft/${token}/request-otp`, {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        setOtpExpiry(new Date(result.expiresAt));
        setRemainingAttempts(result.remainingRequests || 3);
        
        // Clear current OTP input
        setOtp('');
        
        // Show success message
        setSuccessMessage('ส่งรหัส OTP ใหม่เรียบร้อยแล้ว กรุณาตรวจสอบอีเมล');
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
        
        console.log('✅ New OTP sent successfully');
        
      } else {
        setError(result.message || 'ไม่สามารถส่ง OTP ได้');
      }
    } catch (err) {
      console.error('Error requesting OTP:', err);
      setError('เกิดข้อผิดพลาดในการส่ง OTP');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Token ไม่ถูกต้อง');
      return;
    }

    if (otp.length !== 6) {
      setError('กรุณากรอก OTP 6 หลัก');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/draft/${token}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      const result = await response.json();

      if (result.success) {
        // Save draft to LocalStorage (as backup)
        saveDraftToLocal({
          draftToken: token,
          email: metadata?.email || '',
          phone: '', // Not available from metadata
          submissionType: result.submissionType,
          formData: result.formData,
          currentStep: result.currentStep,
          savedAt: Date.now(),
          syncedAt: Date.now(),
        });

        // Redirect to appropriate form with token parameter
        const formPath = result.submissionType === 'register100' 
          ? `/regist100?token=${token}` 
          : `/regist-support?token=${token}`;
        
        console.log('🔄 Redirecting to:', formPath);
        router.push(formPath);
      } else {
        setError(result.message || 'OTP ไม่ถูกต้อง');
        
        // Update remaining attempts if provided
        if (result.remainingAttempts !== undefined) {
          setRemainingAttempts(result.remainingAttempts);
        }
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('เกิดข้อผิดพลาดในการยืนยัน OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    // Only allow numbers and max 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(numericValue);
    setError('');
    setSuccessMessage('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!metadata && !error && !token) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-blue-600 text-[32px]">
                lock
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ยืนยันตัวตน
            </h1>
            <p className="text-sm text-gray-600">
              กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมล
            </p>
            {metadata && (
              <p className="text-sm font-medium text-gray-900 mt-2">
                {metadata.email}
              </p>
            )}
          </div>

          {/* Info Message */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2 text-blue-800">
              <span className="material-symbols-outlined text-[20px]">info</span>
              <div className="text-sm">
                <p className="font-medium mb-1">รหัส OTP ถูกส่งไปยังอีเมลของคุณแล้ว</p>
                <p>กรุณาตรวจสอบอีเมลและกรอกรหัส OTP 6 หลักด้านล่าง</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <p className="text-sm">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                รหัส OTP (6 หลัก)
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="000000"
                maxLength={6}
                autoComplete="off"
              />
              
              {/* Timer */}
              {timeRemaining > 0 && (
                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span className="material-symbols-outlined text-[18px]">timer</span>
                  <span>รหัสหมดอายุใน {formatTime(timeRemaining)}</span>
                </div>
              )}
              
              {/* Expired */}
              {timeRemaining === 0 && otpExpiry && (
                <p className="mt-2 text-sm text-red-600 text-center">
                  รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่
                </p>
              )}
              
              {/* Remaining Attempts */}
              {remainingAttempts < 5 && remainingAttempts > 0 && (
                <p className="mt-2 text-sm text-orange-600 text-center">
                  เหลือโอกาสในการลองอีก {remainingAttempts} ครั้ง
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    progress_activity
                  </span>
                  กำลังตรวจสอบ...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  ยืนยัน OTP
                </>
              )}
            </button>

            {/* Request New OTP */}
            <div className="text-center">
              <button
                type="button"
                onClick={requestOTP}
                disabled={isRequestingOtp || timeRemaining > 540} // Disable if recently sent (within 1 minute)
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors cursor-pointer"
              >
                {isRequestingOtp ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[16px]">
                      progress_activity
                    </span>
                    กำลังส่ง...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    ขอรหัส OTP ใหม่
                  </>
                )}
              </button>
              <p className="mt-2 text-xs text-gray-500">
                หากรหัส OTP หมดอายุหรือไม่ได้รับอีเมล
              </p>
              
              {/* Cooldown message */}
              {timeRemaining > 540 && (
                <p className="mt-1 text-xs text-orange-600">
                  สามารถขอรหัสใหม่ได้ในอีก {Math.ceil((timeRemaining - 540) / 60)} นาที
                </p>
              )}
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              ไม่ได้รับอีเมล? ตรวจสอบในโฟลเดอร์ Spam หรือ Junk Mail
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
