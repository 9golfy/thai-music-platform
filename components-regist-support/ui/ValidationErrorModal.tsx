'use client';

interface ValidationErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ValidationErrorModal({ isOpen, onClose }: ValidationErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-red-600 text-[28px]">
              error
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            กรุณากรอกข้อมูลให้ครบถ้วน
          </h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          กรุณากรอกข้อมูลในช่องที่มีเครื่องหมาย <span className="text-red-500 font-semibold">*</span> ให้ครบถ้วนก่อนดำเนินการต่อ
        </p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#00B050] text-white rounded-lg hover:bg-[#009040] transition-colors font-medium"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}
