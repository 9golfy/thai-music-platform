'use client';

import { useEffect } from 'react';

interface UploadProgressModalProps {
  isOpen: boolean;
  progress: number;
  isComplete: boolean;
}

export default function UploadProgressModal({ isOpen, progress, isComplete }: UploadProgressModalProps) {
  useEffect(() => {
    if (isOpen) {
      console.log(`📊 Upload Progress Modal: ${progress}%`);
    }
  }, [isOpen, progress]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" data-testid="upload-progress-modal">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {!isComplete ? (
          <>
            {/* Upload Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-blue-500 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
            </div>

            {/* Message */}
            <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
              กำลังอัปโหลดข้อมูล
            </h2>
            <p className="text-center text-gray-600 mb-4">
              โปรดรอสักครู่...
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                style={{ width: `${progress}%` }}
              >
                {progress > 10 && (
                  <span className="text-xs text-white font-semibold">
                    {progress}%
                  </span>
                )}
              </div>
            </div>
            
            {/* Progress text with visual indicator */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Upload Progress
              </span>
              <span className="text-sm font-bold text-blue-600">
                ========&gt; {progress}%
              </span>
            </div>
          </>
        ) : (
          <>
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

            {/* Success Message */}
            <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
              สำเร็จ!
            </h2>
            <p className="text-center text-gray-900">
              ระบบทำการบันทึกข้อมูลสำเร็จ
            </p>
          </>
        )}
      </div>
    </div>
  );
}
