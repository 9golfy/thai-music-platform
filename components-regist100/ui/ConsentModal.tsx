'use client';

import { useEffect, useState } from 'react';

const CONSENT_KEY = 'register100_consent_accepted';

export default function ConsentModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem(CONSENT_KEY);
    if (hasConsented !== 'true') {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setIsOpen(false);
  };

  // Prevent closing by ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      data-testid="consent-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
      onClick={(e) => {
        // Prevent closing by clicking overlay
        e.stopPropagation();
      }}
    >
      <div
        className="relative max-w-3xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Outer frame - light blue */}
        <div className="bg-blue-50 rounded-lg p-6 shadow-lg border border-blue-200">
          {/* Inner container - pale green */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            
            {/* Content Box 1: คำชี้แจง */}
            <div className="bg-white rounded-lg p-5 mb-4 border border-gray-200">
              <h2 id="consent-title" className="text-lg font-bold text-black mb-3">
                คำชี้แจง :
              </h2>
              <p className="text-black leading-relaxed">
                แบบเสนอผลงานนี้เป็นส่วนหนึ่งของ
                <strong> "กิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์" </strong>
                โดยกรมส่งเสริมวัฒนธรรม กระทรวงวัฒนธรรม 
                มีวัตถุประสงค์เพื่อส่งเสริม สนับสนุน และกิจกรรมถ่ายทอดดนตรีไทยให้กับครู และเยาวชน
              </p>
            </div>

            {/* Content Box 2: คำนิยาม */}
            <div className="bg-white rounded-lg p-5 mb-6 border border-gray-200">
              <h2 className="text-lg font-bold text-black mb-3">
                คำนิยาม :
              </h2>
              <p className="text-black leading-relaxed">
                <strong>ดนตรีไทย</strong> หมายถึง ดนตรีไทยแบบแผน ดนตรีพื้นบ้าน 
                การขับร้องเพลงไทยแบบแผน การขับร้องเพลงพื้นบ้าน
              </p>
            </div>

            {/* Accept Button - Centered */}
            <div className="flex justify-center">
              <button
                onClick={handleAccept}
                data-testid="btn-consent-accept"
                autoFocus
                className="bg-[#00B050] hover:bg-[#009040] text-white font-semibold px-8 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#00B050] focus:ring-offset-2"
              >
                ยอมรับ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
