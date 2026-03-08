'use client';

interface RestoreDraftModalProps {
  isOpen: boolean;
  onRestore: () => void;
  onDiscard: () => void;
}

export default function RestoreDraftModal({ isOpen, onRestore, onDiscard }: RestoreDraftModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-xl font-bold text-neutral-dark mb-4">
          พบข้อมูลที่บันทึกไว้
        </h3>
        <p className="text-neutral-dark mb-6">
          คุณมีข้อมูลที่บันทึกไว้ก่อนหน้านี้ ต้องการกู้คืนข้อมูลหรือไม่?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onDiscard}
            className="flex-1 bg-neutral-light hover:bg-neutral-border text-neutral-dark font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            เริ่มใหม่
          </button>
          <button
            onClick={onRestore}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            กู้คืนข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}
