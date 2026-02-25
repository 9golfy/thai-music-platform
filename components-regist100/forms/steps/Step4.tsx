'use client';

import { useState, useEffect } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Register100FormData } from '@/lib/validators/register100.schema';
import ImageSizeWarningModal from '@/components-regist100/ui/ImageSizeWarningModal';

interface Step4Props {
  form: UseFormReturn<Register100FormData>;
  teacherImageFiles: { [key: number]: File };
  setTeacherImageFiles: (files: { [key: number]: File }) => void;
  mgtImageFile: File | null;
}

export default function Step4({ form, teacherImageFiles, setTeacherImageFiles, mgtImageFile }: Step4Props) {
  const { register, control, formState: { errors }, watch } = form;
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [totalImageSize, setTotalImageSize] = useState(0);
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'thaiMusicTeachers',
  });

  const { 
    fields: inClassFields, 
    append: appendInClass, 
    remove: removeInClass 
  } = useFieldArray({
    control,
    name: 'inClassInstructionDurations',
  });

  const { 
    fields: outClassFields, 
    append: appendOutClass, 
    remove: removeOutClass 
  } = useFieldArray({
    control,
    name: 'outOfClassInstructionDurations',
  });

  // Calculate total image size whenever images change
  useEffect(() => {
    let total = 0;
    
    // Add manager image from Step 2
    if (mgtImageFile) {
      total += mgtImageFile.size;
    }
    
    // Add all teacher images from Step 4
    Object.values(teacherImageFiles).forEach(file => {
      total += file.size;
    });
    
    setTotalImageSize(total);
    
    // Show warning if total exceeds 10MB
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (total > maxSize) {
      setShowSizeWarning(true);
    }
  }, [mgtImageFile, teacherImageFiles]);

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

  return (
    <div className="space-y-6">
      {/* Image Size Warning Modal */}
      <ImageSizeWarningModal
        isOpen={showSizeWarning}
        onClose={() => setShowSizeWarning(false)}
        totalSize={totalImageSize}
      />

      {/* ผู้สอนดนตรีไทย / ผู้รับผิดชอบ */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ผู้สอนดนตรีไทย / ผู้รับผิดชอบ</h3>
        </div>
        <div className="p-6 space-y-6">
          {fields.length === 0 && (
            <div className="border border-neutral-border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">ครูคนที่ 1</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  คุณลักษณะครูผู้สอน
                </label>
                <select
                  {...register(`thaiMusicTeachers.0.teacherQualification`)}
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
                  {...register(`thaiMusicTeachers.0.teacherFullName`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ตำแหน่ง
                </label>
                <input
                  {...register(`thaiMusicTeachers.0.teacherPosition`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  วุฒิการศึกษา
                </label>
                <input
                  {...register(`thaiMusicTeachers.0.teacherEducation`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  โทรศัพท์
                </label>
                <input
                  {...register(`thaiMusicTeachers.0.teacherPhone`)}
                  type="tel"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  อีเมล
                </label>
                <input
                  {...register(`thaiMusicTeachers.0.teacherEmail`)}
                  type="email"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  รูปภาพครู (สูงสุด 1MB, รองรับ jpg/jpeg/png)
                </label>
                <div className="flex items-center gap-3">
                  <label 
                    htmlFor={`teacherImage-0`}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors inline-block"
                  >
                    <span className="text-gray-700 font-medium">Choose File</span>
                  </label>
                  <span className="text-gray-600">
                    {teacherImageFiles[0] ? teacherImageFiles[0].name : 'No file chosen'}
                  </span>
                </div>
                <input
                  id={`teacherImage-0`}
                  name={`thaiMusicTeachers.0.teacherImage`}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleTeacherImageChange(0, e)}
                  className="hidden"
                />
                {teacherImageFiles[0] && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                    <span className="text-sm text-gray-900">
                      {teacherImageFiles[0].name} ({(teacherImageFiles[0].size / 1024).toFixed(2)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTeacherImage(0)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      ลบ
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">ครูคนที่ {index + 1}</h4>
                {fields.length > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    ลบ
                  </button>
                )}
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
                  type="tel"
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
            className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
        </div>
      </div>

      {/* Checkboxes for teacher training score */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">การเรียนการสอนดนตรีไทย</h3>
          <p className="text-sm text-gray-600 mt-1">แต่ละข้อที่เลือกจะได้ 1 คะแนน</p>
        </div>
        <div className="p-6 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register('isCompulsorySubject')}
              type="checkbox"
              className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
            />
            <span className="text-sm text-gray-900">เป็นวิชาบังคับในชั้นเรียน (ระบุรายละเอียดในหัวข้อถัดไป)</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register('hasAfterSchoolTeaching')}
              type="checkbox"
              className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
            />
            <span className="text-sm text-gray-900">มีการเรียนการสอนนอกเวลาราชการ (ระบุรายละเอียดในหัวข้อถัดไป)</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register('hasElectiveSubject')}
              type="checkbox"
              className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
            />
            <span className="text-sm text-gray-900">มีวิชาเลือก/วิชาเรียนเพิ่มเติม/ชุมนุม (ระบุรายละเอียดในหัวข้อถัดไป)</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register('hasLocalCurriculum')}
              type="checkbox"
              className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
            />
            <span className="text-sm text-gray-900">มีหลักสูตรวิชาของท้องถิ่น (ระบุรายละเอียดในหัวข้อถัดไป)</span>
          </label>
        </div>
      </div>

      {/* ระยะเวลาทำการเรียนการสอน */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ระยะเวลาทำการเรียนการสอนในเวลาราชการ</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700 mb-4">
            (ระบุช่วงระยะเวลาสำหรับการเรียนการสอนดนตรีไทยของแต่ละระดับชั้นว่าในแต่ละภาคการศึกษา/ปีการศึกษา มีกี่ชั่วโมงเรียน)
          </p>

          {inClassFields.length === 0 && (
            <div className="border border-neutral-border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">ระดับชั้น</label>
                  <input
                    {...register(`inClassInstructionDurations.0.inClassGradeLevel`)}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">เรียนดนตรีไทยจำนวน (คน)</label>
                  <input
                    {...register(`inClassInstructionDurations.0.inClassStudentCount`)}
                    type="number"
                    min="0"
                    placeholder='จำนวนนักเรียน (คน)'
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">ชั่วโมง/ภาคการศึกษา</label>
                  <input
                    {...register(`inClassInstructionDurations.0.inClassHoursPerSemester`)}
                    type="number"
                    min="0"
                    placeholder='จำนวน (ชั่วโมง/ภาคการศึกษา)'
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">ชั่วโมง/ปีการศึกษา</label>
                  <input
                    {...register(`inClassInstructionDurations.0.inClassHoursPerYear`)}
                    type="number"
                    min="0"
                    placeholder='จำนวน (ชั่วโมง/ปีการศึกษา)'
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
          )}

          {inClassFields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeInClass(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ลบ
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">ระดับชั้น</label>
                  <input
                    {...register(`inClassInstructionDurations.${index}.inClassGradeLevel`)}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">เรียนดนตรีไทยจำนวน (คน)</label>
                  <input
                    {...register(`inClassInstructionDurations.${index}.inClassStudentCount`)}
                    type="number"
                    min="0"
                    placeholder='จำนวนนักเรียน (คน)'
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">ชั่วโมง/ภาคการศึกษา</label>
                  <input
                    {...register(`inClassInstructionDurations.${index}.inClassHoursPerSemester`)}
                    type="number"
                    min="0"
                    placeholder='จำนวน (ชั่วโมง/ภาคการศึกษา)'
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">ชั่วโมง/ปีการศึกษา</label>
                  <input
                    {...register(`inClassInstructionDurations.${index}.inClassHoursPerYear`)}
                    type="number"
                    min="0"
                    placeholder='จำนวน (ชั่วโมง/ปีการศึกษา)'
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendInClass({ 
              inClassGradeLevel: '', 
              inClassStudentCount: undefined, 
              inClassHoursPerSemester: undefined, 
              inClassHoursPerYear: undefined 
            })}
            className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ระยะเวลาทำการเรียนการสอนนอกเวลาราชการ</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700 mb-4">
            (ระบุช่วงเวลาสำหรับการเรียนการสอนดนตรีไทยนอกเวลาราชการว่าอยู่ในช่วงเวลาใดบ้างและใช้สถานที่ใดทำการสอน)
          </p>

          {outClassFields.length === 0 && (
            <div className="border border-neutral-border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">วัน</label>
                  <select
                    {...register(`outOfClassInstructionDurations.0.outDay`)}
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">เลือกวัน</option>
                    <option value="จันทร์">จันทร์</option>
                    <option value="อังคาร">อังคาร</option>
                    <option value="พุธ">พุธ</option>
                    <option value="พฤหัสบดี">พฤหัสบดี</option>
                    <option value="ศุกร์">ศุกร์</option>
                    <option value="เสาร์">เสาร์</option>
                    <option value="อาทิตย์">อาทิตย์</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">เวลา</label>
                  <input
                    {...register(`outOfClassInstructionDurations.0.outTimeFrom`)}
                    type="text"
                    placeholder="เช่น 08:00"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">ถึง</label>
                  <input
                    {...register(`outOfClassInstructionDurations.0.outTimeTo`)}
                    type="text"
                    placeholder="เช่น 16:00"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">สถานที่</label>
                  <input
                    {...register(`outOfClassInstructionDurations.0.outLocation`)}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
          )}

          {outClassFields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeOutClass(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ลบ
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">วัน</label>
                  <select
                    {...register(`outOfClassInstructionDurations.${index}.outDay`)}
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">เลือกวัน</option>
                    <option value="จันทร์">จันทร์</option>
                    <option value="อังคาร">อังคาร</option>
                    <option value="พุธ">พุธ</option>
                    <option value="พฤหัสบดี">พฤหัสบดี</option>
                    <option value="ศุกร์">ศุกร์</option>
                    <option value="เสาร์">เสาร์</option>
                    <option value="อาทิตย์">อาทิตย์</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">เวลา</label>
                  <input
                    {...register(`outOfClassInstructionDurations.${index}.outTimeFrom`)}
                    type="text"
                    placeholder="เช่น 08:00"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">ถึง</label>
                  <input
                    {...register(`outOfClassInstructionDurations.${index}.outTimeTo`)}
                    type="text"
                    placeholder="เช่น 16:00"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">สถานที่</label>
                  <input
                    {...register(`outOfClassInstructionDurations.${index}.outLocation`)}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendOutClass({ 
              outDay: '', 
              outTimeFrom: '', 
              outTimeTo: '', 
              outLocation: '' 
            })}
            className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">สถานที่ทำการเรียนการสอนในภาพรวมของสถานศึกษา</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              (ระบุ เช่น ห้องเรียนรวม ห้องประชุม ห้องดนตรีไทย หรือในแต่ละห้องเรียนตามรายวิชา เป็นต้น)
            </label>
            <textarea
              {...register('teachingLocation')}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="กรอกรายละเอียด"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
