'use client';

import { useEffect, useRef } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const hasShown = useRef(false);

  useEffect(() => {
    if (isOpen && !hasShown.current) {
      hasShown.current = true;
      console.log('✅ SuccessModal is now OPEN (first time only)');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" data-testid="success-modal">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
          สำเร็จ!
        </h2>
        <p className="text-center text-gray-900 mb-6">
          ระบบได้รับข้อมูลของท่านเรียบร้อยแล้ว
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          data-testid="btn-success-close"
          className="w-full px-6 py-3 bg-[#00B050] text-white rounded-lg hover:bg-[#009040] transition-colors"
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
