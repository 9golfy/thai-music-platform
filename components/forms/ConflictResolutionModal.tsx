'use client';

import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

interface DraftData {
  draftToken: string | null;
  email: string;
  phone: string;
  submissionType: 'register100' | 'register-support';
  formData: Record<string, any>;
  currentStep: number;
  savedAt: number;
  syncedAt: number | null;
}

interface ConflictResolutionModalProps {
  localDraft: DraftData;
  remoteDraft: DraftData;
  onChoose: (source: 'local' | 'remote') => void;
}

export default function ConflictResolutionModal({
  localDraft,
  remoteDraft,
  onChoose,
}: ConflictResolutionModalProps) {
  const localTime = formatDistanceToNow(new Date(localDraft.savedAt), {
    addSuffix: true,
    locale: th,
  });

  const remoteTime = formatDistanceToNow(new Date(remoteDraft.savedAt), {
    addSuffix: true,
    locale: th,
  });

  const isLocalNewer = localDraft.savedAt > remoteDraft.savedAt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-orange-600 text-[28px]">
                warning
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                พบแบบฟอร์มที่บันทึกไว้หลายเวอร์ชัน
              </h3>
              <p className="text-sm text-gray-600">
                คุณมีแบบฟอร์มที่บันทึกไว้ทั้งในเครื่องและบนเซิร์ฟเวอร์ กรุณาเลือกเวอร์ชันที่ต้องการใช้งาน
              </p>
            </div>
          </div>

          {/* Comparison */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Local Draft */}
            <div
              className={`border-2 rounded-lg p-4 transition-all ${
                isLocalNewer
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-gray-700 text-[24px]">
                  computer
                </span>
                <h4 className="font-semibold text-gray-900">
                  บันทึกในเครื่อง
                </h4>
                {isLocalNewer && (
                  <span className="ml-auto px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                    ใหม่กว่า
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span>บันทึกเมื่อ {localTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="material-symbols-outlined text-[18px]">layers</span>
                  <span>ขั้นตอนที่ {localDraft.currentStep} จาก 8</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="material-symbols-outlined text-[18px]">
                    {localDraft.syncedAt ? 'cloud_done' : 'cloud_off'}
                  </span>
                  <span>
                    {localDraft.syncedAt ? 'ซิงค์แล้ว' : 'ยังไม่ได้ซิงค์'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onChoose('local')}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">check</span>
                ใช้เวอร์ชันนี้
              </button>
            </div>

            {/* Remote Draft */}
            <div
              className={`border-2 rounded-lg p-4 transition-all ${
                !isLocalNewer
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-gray-700 text-[24px]">
                  cloud
                </span>
                <h4 className="font-semibold text-gray-900">
                  บันทึกบนเซิร์ฟเวอร์
                </h4>
                {!isLocalNewer && (
                  <span className="ml-auto px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                    ใหม่กว่า
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span>บันทึกเมื่อ {remoteTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="material-symbols-outlined text-[18px]">layers</span>
                  <span>ขั้นตอนที่ {remoteDraft.currentStep} จาก 8</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="material-symbols-outlined text-[18px]">email</span>
                  <span>{remoteDraft.email}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onChoose('remote')}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">check</span>
                ใช้เวอร์ชันนี้
              </button>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-yellow-600 text-[20px] flex-shrink-0">
                info
              </span>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">คำเตือน:</p>
                <p>
                  เมื่อคุณเลือกเวอร์ชันหนึ่ง เวอร์ชันที่เลือกจะถูกซิงค์ไปยังทั้งในเครื่องและบนเซิร์ฟเวอร์
                  ข้อมูลในเวอร์ชันที่ไม่ได้เลือกจะถูกเขียนทับ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
