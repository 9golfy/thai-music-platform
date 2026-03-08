'use client';

interface ImageSizeWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalSize: number;
}

export default function ImageSizeWarningModal({ isOpen, onClose, totalSize }: ImageSizeWarningModalProps) {
  if (!isOpen) return null;

  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - Cannot close by clicking outside, user must acknowledge */}
      <div 
        className="absolute inset-0 bg-black/50"
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <span className="material-symbols-outlined text-red-500 text-[40px]">
              warning
            </span>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ขนาดภาพเกินกำหนด
            </h3>
            <p className="text-gray-700 mb-4">
              ขนาดภาพรวมทั้งหมดมากกว่า 10 MB ({totalSizeMB} MB)
              <br />
              กรุณาลดจำนวนหรือน้ำหนักภาพ
            </p>
            
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-[#00B050] text-white rounded-lg hover:bg-[#009040] transition-colors font-medium"
            >
              รับทราบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
