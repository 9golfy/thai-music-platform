'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Register69FormData } from '@/lib/validators/register69.schema';
import { useState } from 'react';

interface Step3Props {
  form: UseFormReturn<Register69FormData>;
}

export default function Step3({ form }: Step3Props) {
  const { register, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'thaiMusicTeachers',
  });
  const [teacherImages, setTeacherImages] = useState<{ [key: number]: File }>({});

  const handleTeacherImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 1024 * 1024; // 1MB
      if (isValidType && isValidSize) {
        setTeacherImages(prev => ({ ...prev, [index]: file }));
      } else {
        alert('กรุณาเลือกไฟล์รูปภาพ jpg/jpeg/png ขนาดไม่เกิน 1MB');
        e.target.value = '';
      }
    }
  };

  const removeTeacherImage = (index: number) => {
    setTeacherImages(prev => {
      const newImages = { ...prev };
      delete newImages[index];
      return newImages;
    });
    const fileInput = document.querySelector(`input[name="thaiMusicTeachers.${index}.teacherImage"]`) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-6">
      {/* ผู้สอนดนตรีไทย / ผู้รับผิดชอบ */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-primary/5 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-neutral-dark">ผู้สอนดนตรีไทย / ผู้รับผิดชอบ</h3>
        </div>
        <div className="p-6 space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-neutral-dark">ครูคนที่ {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ลบ
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  ชื่อ-นามสกุล
                </label>
                <input
                  {...register(`thaiMusicTeachers.${index}.teacherFullName`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  ตำแหน่ง
                </label>
                <input
                  {...register(`thaiMusicTeachers.${index}.teacherPosition`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  วุฒิการศึกษา
                </label>
                <input
                  {...register(`thaiMusicTeachers.${index}.teacherEducation`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  โทรศัพท์
                </label>
                <input
                  {...register(`thaiMusicTeachers.${index}.teacherPhone`)}
                  type="number"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  อีเมล
                </label>
                <input
                  {...register(`thaiMusicTeachers.${index}.teacherEmail`)}
                  type="email"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.thaiMusicTeachers?.[index]?.teacherEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.thaiMusicTeachers[index]?.teacherEmail?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  รูปภาพครู (สูงสุด 1MB, รองรับ jpg/jpeg/png)
                </label>
                <input
                  {...register(`thaiMusicTeachers.${index}.teacherImage`)}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleTeacherImageChange(index, e)}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {teacherImages[index] && (
                  <div className="mt-2 flex items-center justify-between bg-neutral-light p-2 rounded">
                    <span className="text-sm text-neutral-dark">
                      {teacherImages[index].name} ({(teacherImages[index].size / 1024).toFixed(2)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTeacherImage(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ลบ
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({
              teacherFullName: '',
              teacherPosition: '',
              teacherEducation: '',
              teacherPhone: '',
              teacherEmail: '',
            })}
            className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary hover:bg-primary/5 rounded-lg font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}
