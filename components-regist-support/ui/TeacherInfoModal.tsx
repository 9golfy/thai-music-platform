'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

interface TeacherInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teacherInfo: { email: string; phone: string }) => void;
  isSubmitting?: boolean;
}

export default function TeacherInfoModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting = false 
}: TeacherInfoModalProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const checkEmailExists = async (emailToCheck: string) => {
    if (!emailToCheck.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToCheck)) {
      return false;
    }

    setIsCheckingEmail(true);
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToCheck.trim() }),
      });

      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleEmailBlur = async () => {
    if (email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const exists = await checkEmailExists(email);
      setEmailExists(exists);
      
      if (exists) {
        setErrors(prev => ({ 
          ...prev, 
          email: 'มี email นี้ในระบบแล้ว' 
        }));
      } else {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; phone?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    } else if (emailExists) {
      newErrors.email = 'มี email นี้ในระบบแล้ว';
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!/^[0-9]{10}$/.test(phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final email check before submit
    if (email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const exists = await checkEmailExists(email);
      if (exists) {
        setEmailExists(true);
        setErrors(prev => ({ 
          ...prev, 
          email: 'มี email นี้ในระบบแล้ว' 
        }));
        return;
      }
    }
    
    if (validateForm()) {
      onSubmit({
        email: email.trim(),
        phone: phone.replace(/[-\s]/g, '') // Remove spaces and dashes
      });
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setEmail('');
      setPhone('');
      setErrors({});
      setEmailExists(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            กรุณากรอกข้อมูลคุณครู
          </h2>
          {!isSubmitting && (
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="ปิด"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="teacher-email" className="block text-sm font-medium text-gray-700 mb-2">
                ระบุ Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="teacher-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailExists(false);
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: undefined }));
                    }
                  }}
                  onBlur={handleEmailBlur}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email 
                      ? 'border-red-300 bg-red-50' 
                      : emailExists
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="teacher@school.ac.th"
                />
                {isCheckingEmail && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {errors.email && (
                <div className="mt-2">
                  <p className="text-sm text-red-600">{errors.email}</p>
                  {emailExists && (
                    <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800">
                        มี email นี้ในระบบแล้ว{' '}
                        <Link 
                          href="/teacher-login" 
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                          target="_blank"
                        >
                          กรุณาทำการล็อคอินเข้าระบบ
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="teacher-phone" className="block text-sm font-medium text-gray-700 mb-2">
                ระบุ เบอร์โทรศัพท์ <span className="text-red-500">*</span>
              </label>
              <input
                id="teacher-phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  // Allow only numbers, spaces, and dashes
                  const value = e.target.value.replace(/[^0-9\s-]/g, '');
                  setPhone(value);
                  if (errors.phone) {
                    setErrors(prev => ({ ...prev, phone: undefined }));
                  }
                }}
                disabled={isSubmitting}
                maxLength={13} // Allow for formatting like 081-234-5678
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.phone 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="081-234-5678"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                กรอกเบอร์โทรศัพท์ 10 หลัก (เช่น 0812345678)
              </p>
            </div>

            {/* Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">หมายเหตุ</h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p>ระบบจะส่งอีเมลรายละเอียดการเข้าระบบของโรงเรียนทาง Email ที่ระบุ</p>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li>URL สำหรับล็อคอินดูข้อมูลโรงเรียน</li>
                      <li>อีเมลและเบอร์โทรศัพท์สำหรับล็อคอิน</li>
                      <li>รหัสผ่าน 6 หลัก</li>
                      <li>School ID ของโรงเรียน</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {emailExists ? 'ปิด' : 'ยกเลิก'}
            </button>
            
            {/* Only show submit button if email doesn't exist */}
            {!emailExists && (
              <button
                type="submit"
                disabled={isSubmitting || isCheckingEmail}
                className="flex-1 px-6 py-3 bg-[#00B050] text-white rounded-lg hover:bg-[#009040] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    กำลังบันทึก...
                  </div>
                ) : isCheckingEmail ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    กำลังตรวจสอบ...
                  </div>
                ) : (
                  'บันทึกข้อมูล'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}