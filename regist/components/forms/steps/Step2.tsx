'use client';

import { UseFormReturn } from 'react-hook-form';
import { Register69FormData } from '@/lib/validators/register69.schema';
import { useState } from 'react';

interface Step2Props {
  form: UseFormReturn<Register69FormData>;
}

export default function Step2({ form }: Step2Props) {
  const { register, formState: { errors } } = form;
  const [mgtImageFile, setMgtImageFile] = useState<File | null>(null);

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
        <div className="bg-primary/5 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-neutral-dark">ผู้บริหารสถานศึกษา</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
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
            <label className="block text-sm font-medium text-neutral-dark mb-1">
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
            <label className="block text-sm font-medium text-neutral-dark mb-1">
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
            <label className="block text-sm font-medium text-neutral-dark mb-1">
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
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              รูปภาพผู้บริหาร (สูงสุด 1MB, รองรับ jpg/jpeg/png)
            </label>
            <input
              {...register('mgtImage')}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleMgtImageChange}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {mgtImageFile && (
              <div className="mt-2 flex items-center justify-between bg-neutral-light p-2 rounded">
                <span className="text-sm text-neutral-dark">
                  {mgtImageFile.name} ({(mgtImageFile.size / 1024).toFixed(2)} KB)
                </span>
                <button
                  type="button"
                  onClick={removeMgtImage}
                  className="text-red-500 hover:text-red-700 text-sm"
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
