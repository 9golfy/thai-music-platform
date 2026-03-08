'use client';

interface MissingFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingFields: string[];
}

export default function MissingFieldsModal({ isOpen, onClose, missingFields }: MissingFieldsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-red-600 text-[28px]">
              warning
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            กรุณากรอกข้อมูลให้ครบถ้วน
          </h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          พบช่องข้อมูลที่จำเป็นต้องกรอกยังไม่ครบถ้วน กรุณากรอกข้อมูลในช่องต่อไปนี้:
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <ul className="space-y-2">
            {missingFields.map((field, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-500 font-semibold mt-0.5">•</span>
                <span>{field}</span>
              </li>
            ))}
          </ul>
        </div>

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
