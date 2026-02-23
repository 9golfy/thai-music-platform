'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Register69FormData } from '@/lib/validators/register69.schema';

interface Step3Props {
  form: UseFormReturn<Register69FormData>;
  teacherImageFiles: { [key: number]: File };
  setTeacherImageFiles: (files: { [key: number]: File }) => void;
}

export default function Step3({ form, teacherImageFiles, setTeacherImageFiles }: Step3Props) {
  const { register, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'thaiMusicTeachers',
  });

  const handleTeacherImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 1024 * 1024; // 1MB
      if (isValidType && isValidSize) {
        setTeacherImageFiles({ ...teacherImageFiles, [index]: file });
      } else {
        alert('กรุณาเลือกไฟล์รูปภาพ jpg/jpeg/png ขนาดไม่เกิน 1MB');
        e.target.value = '';
      }
    }
  };

  const removeTeacherImage = (index: number) => {
    const newFiles = { ...teacherImageFiles };
    delete newFiles[index];
    setTeacherImageFiles(newFiles);
    const fileInput = document.querySelector(`input[name="thaiMusicTeachers.${index}.teacherImage"]`) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const canAddMore = fields.length < 4;

  return (
    <div className="space-y-6">
      {/* ผู้สอนดนตรีไทย / ผู้รับผิดชอบ */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ผู้สอนดนตรีไทย / ผู้รับผิดชอบ</h3>
        </div>
        <div className="p-6 space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">ครูคนที่ {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ลบ
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  คุณลักษณะครูผู้สอน
                </label>
                <select
                  {...register(`thaiMusicTeachers.${index}.teacherQualification`)}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">เลือกคุณลักษณะ</option>
                  <option value="ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย">
                    ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย
                  </option>
                  <option value="ครูภูมิปัญญาในท้องถิ่น">
                    ครูภูมิปัญญาในท้องถิ่น
                  </option>
                  <option value="ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย">
                    ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย
                  </option>
                  <option value="วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน">
                    วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ชื่อ-นามสกุล
                </label>
                <input
                  {...register(`thaiMusicTeachers.${index}.teacherFullName`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ตำแหน่ง
                </label>
                <input
                  {...register(`thaiMusicTeachers.${index}.teacherPosition`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  วุฒิการศึกษา
                </label>
                <input
                  {...register(`thaiMusicTeachers.${index}.teacherEducation`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  โทรศัพท์
                </label>
                <input
                  {...register(`thaiMusicTeachers.${index}.teacherPhone`)}
                  type="number"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
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
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  รูปภาพครู (สูงสุด 1MB, รองรับ jpg/jpeg/png)
                </label>
                <div className="flex items-center gap-3">
                  <label 
                    htmlFor={`teacherImage-${index}`}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors inline-block"
                  >
                    <span className="text-gray-700 font-medium">Choose File</span>
                  </label>
                  <span className="text-gray-600">
                    {teacherImageFiles[index] ? teacherImageFiles[index].name : 'No file chosen'}
                  </span>
                </div>
                <input
                  id={`teacherImage-${index}`}
                  name={`thaiMusicTeachers.${index}.teacherImage`}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleTeacherImageChange(index, e)}
                  className="hidden"
                />
                {teacherImageFiles[index] && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                    <span className="text-sm text-gray-900">
                      {teacherImageFiles[index].name} ({(teacherImageFiles[index].size / 1024).toFixed(2)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTeacherImage(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      ลบ
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div>
            <button
              type="button"
              onClick={() => append({
                teacherQualification: '',
                teacherFullName: '',
                teacherPosition: '',
                teacherEducation: '',
                teacherPhone: '',
                teacherEmail: '',
              })}
              disabled={!canAddMore}
              className={`w-full py-2 px-4 border-2 border-dashed rounded-lg font-medium transition-colors ${
                canAddMore
                  ? 'border-primary text-primary hover:bg-green-50 cursor-pointer'
                  : 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
              }`}
            >
              + เพิ่มข้อมูล {!canAddMore && '(สูงสุด 4 คน)'}
            </button>
            {!canAddMore && (
              <p className="text-red-500 text-sm mt-2 text-center" data-testid="max-teachers-warning">
                เลือกได้ไม่เกิน 4 คน
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
