'use client';

import { UseFormReturn } from 'react-hook-form';
import { RegisterSupportFormData } from '@/lib/validators/registerSupport.schema';

interface Step6Props {
  form: UseFormReturn<RegisterSupportFormData>;
}

export default function Step6({ form }: Step6Props) {
  const { register } = form;

  return (
    <div className="space-y-6">
      {/* ภาพถ่ายผลงาน */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ภาพถ่ายผลงานที่มีความชัดเจน และสื่อให้เห็นถึงความเป็นโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์</h3>
        </div>
        <div className="p-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)
            </label>
            <input
              {...register('photoGalleryLink')}
              type="url"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://drive.google.com/..."
            />
            <p className="text-xs text-gray-600 mt-1">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้</p>
          </div>
        </div>
      </div>

      {/* วีดิโอ/คลิป */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">วีดิโอ/คลิป</h3>
          <p className="text-sm text-gray-600 mt-1">ความยาวไม่เกิน 3 นาที</p>
        </div>
        <div className="p-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Link/URL วีดิโอ (YouTube, Google Drive, etc.)
            </label>
            <input
              {...register('videoLink')}
              type="url"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://youtube.com/..."
            />
            <p className="text-xs text-gray-600 mt-1">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้</p>
          </div>
        </div>
      </div>
    </div>
  );
}
