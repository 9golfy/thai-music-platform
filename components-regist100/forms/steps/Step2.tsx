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
    const fileInput = document.querySelector('input[name="reg100_mgtImage"]') as HTMLInputElement;
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
              {...register('reg100_mgtFullName')}
              type="text"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.reg100_mgtFullName && (
              <p className="text-red-500 text-sm mt-1">{errors.reg100_mgtFullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              ตำแหน่ง <span className="text-red-500">*</span>
            </label>
            <input
              {...register('reg100_mgtPosition')}
              type="text"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.reg100_mgtPosition && (
              <p className="text-red-500 text-sm mt-1">{errors.reg100_mgtPosition.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </label>
            <input
              {...register('reg100_mgtPhone')}
              type="tel"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.reg100_mgtPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.reg100_mgtPhone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              ที่อยู่ <span className="text-red-500">*</span>
            </label>
            <input
              {...register('reg100_mgtAddress')}
              type="text"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="กรอกที่อยู่"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              อีเมล <span className="text-red-500">*</span>
            </label>
            <input
              {...register('reg100_mgtEmail')}
              type="email"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.reg100_mgtEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.reg100_mgtEmail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              รูปภาพผู้บริหาร (สูงสุด 1MB, รองรับ jpg/jpeg/png)
            </label>
            <div className="flex items-center gap-3">
              <label 
                htmlFor="reg100_mgtImage" 
                className="px-4 py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors inline-block"
              >
                <span className="text-gray-700 font-medium">Choose File</span>
              </label>
              <span className="text-gray-600">
                {mgtImageFile ? mgtImageFile.name : 'No file chosen'}
              </span>
            </div>
            <input
              id="reg100_mgtImage"
              name="reg100_mgtImage"
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
                  className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
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
