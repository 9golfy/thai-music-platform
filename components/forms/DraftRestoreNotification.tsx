'use client';

import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

interface DraftRestoreNotificationProps {
  onAccept: () => void;
  onReject: () => void;
  lastSaved: Date;
}

export default function DraftRestoreNotification({
  onAccept,
  onReject,
  lastSaved,
}: DraftRestoreNotificationProps) {
  const timeAgo = formatDistanceToNow(lastSaved, { 
    addSuffix: true,
    locale: th 
  });

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg shadow-lg p-4 animate-slide-down">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-[24px]">
                restore
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              พบแบบฟอร์มที่บันทึกไว้
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              คุณมีแบบฟอร์มที่บันทึกไว้เมื่อ <span className="font-medium">{timeAgo}</span>
              <br />
              ต้องการกรอกต่อจากที่ค้างไว้หรือไม่?
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onAccept}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                กรอกต่อ
              </button>
              <button
                type="button"
                onClick={onReject}
                className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
                เริ่มใหม่
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onReject}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
