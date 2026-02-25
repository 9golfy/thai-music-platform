'use client';

import { UseFormReturn } from 'react-hook-form';
import { Register100FormData } from '@/lib/validators/register100.schema';

interface Step2Props {
  form: UseFormReturn<Register100FormData>;
  mgtImageFile: File | null;
  setMgtImageFile: (file: File | null) => void;
}

export default function Step2({ form, mgtImageFile, setMgtImageFile }: Step2Props) {
  const { register, formState: { errors } } = form;

  const handleMgtImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 1024 * 1024; // 1MB
      if (isValidType && isValidSize) {
        setMgtImageFile(file);
      } else {
        alert('กรุณาเลือกไฟล์รูปภาพ jpg/jpeg/png ขนาดไม่เกิน 1MB');
        e.target.value = '';
      }
    }
  };

  const removeMgtImage = () => {
    setMgtImageFile(null);
    const fileInput = document.querySelector('input[name="mgtImage"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-6">
      {/* ผู้บริหารสถานศึกษา */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ผู้บริหารสถานศึกษา</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              ชื่อ-นามสกุล <span className="text-red-500">*</span>
            </label>
            <input
              {...register('mgtFullName')}
              type="text"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.mgtFullName && (
              <p className="text-red-500 text-sm mt-1">{errors.mgtFullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              ตำแหน่ง <span className="text-red-500">*</span>
            </label>
            <input
              {...register('mgtPosition')}
              type="text"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.mgtPosition && (
              <p className="text-red-500 text-sm mt-1">{errors.mgtPosition.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </label>
            <input
              {...register('mgtPhone')}
              type="tel"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.mgtPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.mgtPhone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              ที่อยู่
            </label>
            <input
              {...register('mgtAddress')}
              type="text"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="กรอกที่อยู่"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              อีเมล
            </label>
            <input
              {...register('mgtEmail')}
              type="email"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.mgtEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.mgtEmail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              รูปภาพผู้บริหาร (สูงสุด 1MB, รองรับ jpg/jpeg/png)
            </label>
            <div className="flex items-center gap-3">
              <label 
                htmlFor="mgtImage" 
                className="px-4 py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors inline-block"
              >
                <span className="text-gray-700 font-medium">Choose File</span>
              </label>
              <span className="text-gray-600">
                {mgtImageFile ? mgtImageFile.name : 'No file chosen'}
              </span>
            </div>
            <input
              id="mgtImage"
              name="mgtImage"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleMgtImageChange}
              className="hidden"
            />
            {mgtImageFile && (
              <div className="mt-2 flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                <span className="text-sm text-gray-900">
                  {mgtImageFile.name} ({(mgtImageFile.size / 1024).toFixed(2)} KB)
                </span>
                <button
                  type="button"
                  onClick={removeMgtImage}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ลบ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
