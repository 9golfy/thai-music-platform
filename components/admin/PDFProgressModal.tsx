'use client';

import { useEffect, useState } from 'react';

interface PDFProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'register100' | 'register-support';
  mode?: 'short' | 'full'; // short = basic info only, full = complete PDF with all sections
}

export default function PDFProgressModal({ isOpen, onClose, type, mode = 'short' }: PDFProgressModalProps) {
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentSchool, setCurrentSchool] = useState('');
  const [status, setStatus] = useState<'preparing' | 'generating' | 'zipping' | 'complete' | 'error'>('preparing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setProgress(0);
      setCurrent(0);
      setTotal(0);
      setCurrentSchool('');
      setStatus('preparing');
      setErrorMessage('');
      return;
    }

    // Start SSE connection based on mode
    const apiEndpoint = mode === 'full' 
      ? `/api/schools/download-full-pdf?type=${type}&stream=true`
      : `/api/schools/download-all-pdf?type=${type}&stream=true`;
    
    const eventSource = new EventSource(apiEndpoint);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'connected') {
        console.log('✅ SSE Connected');
        setStatus('preparing');
      } else if (data.type === 'total') {
        setTotal(data.total);
        setStatus('generating');
      } else if (data.type === 'progress') {
        setCurrent(data.current);
        setProgress(data.progress);
        setCurrentSchool(data.schoolName);
      } else if (data.type === 'zipping') {
        setStatus('zipping');
        setCurrentSchool('กำลังรวมไฟล์เป็น ZIP...');
      } else if (data.type === 'complete') {
        setStatus('complete');
        setProgress(100);
        
        // Download the file from URL
        const downloadUrl = data.downloadUrl;
        const filename = data.filename;
        
        // Trigger download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        eventSource.close();
        
        // Auto close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else if (data.type === 'error' || data.error) {
        setStatus('error');
        setErrorMessage(data.message || data.error);
        eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ SSE Error:', error);
      setStatus('error');
      setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isOpen, type, mode, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {status === 'complete' ? '✅ สำเร็จ!' : status === 'error' ? '❌ เกิดข้อผิดพลาด' : mode === 'full' ? '📄 กำลังสร้าง Full PDF' : '📄 กำลังสร้าง PDF'}
        </h2>

        {status === 'error' ? (
          <div className="text-center">
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              ปิด
            </button>
          </div>
        ) : status === 'complete' ? (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-green-600 font-semibold mb-2">ดาวน์โหลดสำเร็จ!</p>
            <p className="text-gray-600 text-sm">สร้าง PDF {total} ไฟล์เรียบร้อย</p>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  {status === 'preparing' && 'กำลังเตรียมข้อมูล...'}
                  {status === 'generating' && `กำลังสร้าง PDF (${current}/${total})`}
                  {status === 'zipping' && 'กำลังรวมไฟล์...'}
                </span>
                <span className="font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300 ease-out flex items-center justify-end px-2"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 10 && (
                    <span className="text-xs text-white font-bold">{progress}%</span>
                  )}
                </div>
              </div>
            </div>

            {/* Current School Info */}
            {currentSchool && status === 'generating' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">กำลังสร้าง:</p>
                <p className="text-blue-800 font-medium truncate">{currentSchool}</p>
              </div>
            )}

            {status === 'zipping' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <p className="text-purple-800 font-medium text-center">
                  กำลังรวมไฟล์เป็น ZIP... 📦
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-gray-600 text-xs mb-1">สร้างแล้ว</p>
                <p className="text-2xl font-bold text-green-600">{current}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-gray-600 text-xs mb-1">ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-800">{total || '-'}</p>
              </div>
            </div>

            {/* Loading Animation */}
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-4">
              กรุณารอสักครู่... อย่าปิดหน้านี้
            </p>
          </>
        )}
      </div>
    </div>
  );
}
