'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface DraftSaveSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function DraftSaveSuccessModal({
  isOpen,
  onClose,
  email,
}: DraftSaveSuccessModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 text-[48px]">
                check_circle
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            บันทึกแบบฟอร์มสำเร็จ!
          </h3>

          {/* Message */}
          <div className="text-center space-y-2 mb-6">
            <p className="text-gray-700">
              ระบบได้ส่งข้อมูลบันทึกร่างให้ทางอีเมลของคุณเรียบร้อยแล้ว
            </p>
            <p className="text-sm text-gray-600">
              📧 {email}
            </p>
            <p className="text-sm text-gray-500">
              กรุณาตรวจสอบอีเมลของคุณเพื่อดูลิงก์กลับมากรอกแบบฟอร์มต่อ
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
