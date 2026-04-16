'use client';

import { useState, useEffect, useRef } from 'react';
import { UseFormReturn, useFieldArray, Control } from 'react-hook-form';
import { RegisterSupportFormData } from '@/lib/validators/registerSupport.schema';
import ImageSizeWarningModal from '@/components-regist-support/ui/ImageSizeWarningModal';
import { devLog } from '@/lib/utils/devLogger';

interface Step4Props {
  form: UseFormReturn<RegisterSupportFormData>;
  teacherImageFiles: { [key: number]: File };
  setTeacherImageFiles: (files: { [key: number]: File }) => void;
  mgtImageFile: File | null;
}

// Component for rendering education fields with max 5 limit (extracted to top-level to avoid Rules of Hooks violation)
function EducationFields({ 
  teacherIndex, 
  type, 
  control, 
  register 
}: { 
  teacherIndex: number; 
  type: 'music' | 'other';
  control: Control<RegisterSupportFormData>;
  register: UseFormReturn<RegisterSupportFormData>['register'];
}) {
  const fieldName = type === 'music' 
    ? `regsup_thaiMusicTeachers.${teacherIndex}.musicInstituteEducation` as const
    : `regsup_thaiMusicTeachers.${teacherIndex}.otherEducation` as const;
  
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: fieldName,
  });

  const MAX_ITEMS = 5;

  return (
    <div className="ml-6 space-y-4">
      {/* Always show first item as default (no border, no delete) */}
      <div className="space-y-2">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            วุฒิการศึกษา/ประกาศนียบัตร <span className="text-red-500">*</span>
          </label>
          <input
            {...register(`${fieldName}.0.graduationYear` as any)}
            type="text"
            className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            สาขา/หลักสูตร <span className="text-red-500">*</span>
          </label>
          <input
            {...register(`${fieldName}.0.major` as any)}
            type="text"
            className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            ปีที่สำเร็จการศึกษา / ได้รับประกาศนียบัตร <span className="text-red-500">*</span>
          </label>
          <input
            {...register(`${fieldName}.0.completionYear` as any)}
            type="text"
            className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Additional items with border and delete button */}
      {eduFields.slice(1).map((field, idx) => {
        const actualIndex = idx + 1; // Adjust index since we're slicing from 1
        return (
          <div key={field.id} className="border border-neutral-border rounded-lg p-3 space-y-2">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeEdu(actualIndex)}
                className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                ลบ
              </button>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                วุฒิการศึกษา/ประกาศนียบัตร <span className="text-red-500">*</span>
              </label>
              <input
                {...register(`${fieldName}.${actualIndex}.graduationYear` as any)}
                type="text"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                สาขา/หลักสูตร <span className="text-red-500">*</span>
              </label>
              <input
                {...register(`${fieldName}.${actualIndex}.major` as any)}
                type="text"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                ปีที่สำเร็จการศึกษา / ได้รับประกาศนียบัตร <span className="text-red-500">*</span>
              </label>
              <input
                {...register(`${fieldName}.${actualIndex}.completionYear` as any)}
                type="text"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        );
      })}

      {eduFields.length < MAX_ITEMS && (
        <button
          type="button"
          onClick={() => appendEdu({ graduationYear: '', major: '', completionYear: '' })}
          className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
        >
          + เพิ่มข้อมูล ({eduFields.length}/{MAX_ITEMS})
        </button>
      )}
      {eduFields.length >= MAX_ITEMS && (
        <p className="text-sm text-gray-500 text-center py-2">เพิ่มข้อมูลได้สูงสุด {MAX_ITEMS} รายการ</p>
      )}
    </div>
  );
}

export default function Step4({ form, teacherImageFiles, setTeacherImageFiles, mgtImageFile }: Step4Props) {
  const { register, control, formState: { errors }, watch } = form;
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [totalImageSize, setTotalImageSize] = useState(0);
  const isInitialized = useRef(false);
  
  // Main teacher array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'regsup_thaiMusicTeachers',
  });

  // Field arrays for time periods
  const { fields: inClassFields, append: appendInClass, remove: removeInClass } = useFieldArray({
    control,
    name: 'regsup_inClassInstructionDurations',
  });

  const { fields: outClassFields, append: appendOutClass, remove: removeOutClass } = useFieldArray({
    control,
    name: 'regsup_outOfClassInstructionDurations',
  });

  // Initialize with at least one teacher (teacher #1 as default)
  useEffect(() => {
    if (isInitialized.current) return; // Prevent multiple runs
    
    devLog.log('Step4 mounted, current teachers count:', fields.length);
    
    // Initialize with one teacher if empty
    if (fields.length === 0) {
      append({
        teacherQualification: '',
        teacherFullName: '',
        teacherPosition: '',
        teacherEducation: '',
        teacherPhone: '',
        teacherEmail: '',
        teacherAbility: '',
        isFromMusicInstitute: '',
        musicInstituteEducation: [],
        otherEducation: [],
      });
    }

    // Initialize time period arrays with first item
    if (inClassFields.length === 0) {
      appendInClass({
        inClassGradeLevel: '',
        inClassStudentCount: undefined,
        inClassHoursPerSemester: undefined,
        inClassHoursPerYear: undefined,
      });
    }

    if (outClassFields.length === 0) {
      appendOutClass({
        outDay: '',
        outTimeFrom: '',
        outTimeTo: '',
        outLocation: '',
      });
    }
    
    isInitialized.current = true;
  }, []);

  // Calculate total image size
  useEffect(() => {
    let total = 0;
    if (mgtImageFile) {
      total += mgtImageFile.size;
    }
    Object.values(teacherImageFiles).forEach(file => {
      total += file.size;
    });
    setTotalImageSize(total);
    const maxSize = 10 * 1024 * 1024;
    if (total > maxSize) {
      setShowSizeWarning(true);
    }
  }, [mgtImageFile, teacherImageFiles]);

  const handleTeacherImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 1024 * 1024;
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
  };

  return (
    <div className="space-y-6">
      <ImageSizeWarningModal
        isOpen={showSizeWarning}
        onClose={() => setShowSizeWarning(false)}
        totalSize={totalImageSize}
      />

      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ผู้สอนดนตรีไทย / ผู้รับผิดชอบ</h3>
          <p className="text-sm text-gray-600 mt-1">กรุณาระบุ</p>
        </div>
        <div className="p-6 space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">บุคลากรด้านการสอนดนตรี คนที่ {index + 1}</h4>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    ลบ
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                   บทบาท/หน้าที่ผู้สอน <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      {...register(`regsup_thaiMusicTeachers.${index}.teacherQualification`)}
                      type="radio"
                      value="ครูผู้สอนดนตรีในโรงเรียนที่สำเร็จการศึกษาสาขาวิชาดนตรีไทย"
                      className="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-900">ครูผู้สอนดนตรีไทยในสถานศึกษา</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      {...register(`regsup_thaiMusicTeachers.${index}.teacherQualification`)}
                      type="radio"
                      value="ครูภูมิปัญญาในท้องถิ่น"
                      className="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-900">ครูภูมิปัญญาในท้องถิ่น</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      {...register(`regsup_thaiMusicTeachers.${index}.teacherQualification`)}
                      type="radio"
                      value="ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย"
                      className="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-900">ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      {...register(`regsup_thaiMusicTeachers.${index}.teacherQualification`)}
                      type="radio"
                      value="วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน"
                      className="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-900">วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในปัจจุบัน</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ชื่อ-นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  {...register(`regsup_thaiMusicTeachers.${index}.teacherFullName`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ตำแหน่ง <span className="text-red-500">*</span>
                </label>
                <input
                  {...register(`regsup_thaiMusicTeachers.${index}.teacherPosition`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  อีเมล <span className="text-red-500">*</span>
                </label>
                <input
                  {...register(`regsup_thaiMusicTeachers.${index}.teacherEmail`)}
                  type="email"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.regsup_thaiMusicTeachers?.[index]?.teacherEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.regsup_thaiMusicTeachers[index]?.teacherEmail?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <input
                  {...register(`regsup_thaiMusicTeachers.${index}.teacherPhone`)}
                  type="tel"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  รูปภาพครู (สูงสุด 1MB, รองรับ jpg/jpeg/png) <span className="text-red-500">*</span>
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
                  name={`regsup_thaiMusicTeachers.${index}.teacherImage`}
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

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ทักษะ ความรู้ ความสามารถ ในการสอนภาคปฏิบัติดนตรีไทย <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register(`regsup_thaiMusicTeachers.${index}.teacherAbility`)}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="ความรู้ ความสามารถ ความเชี่ยวชาญ และทักษะในการสอนภาคปฏิบัติดนตรีไทยดังนี้ (บรรยายพอสังเขป)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <input
                    {...register(`regsup_thaiMusicTeachers.${index}.isFromMusicInstitute`)}
                    type="radio"
                    value="true"
                    className="mr-2"
                  />
                  สำเร็จการศึกษาด้านดนตรีไทย <span className="text-red-500">*</span>
                </label>
                
                {/* ✅ แสดง EducationFields เฉพาะเมื่อเลือก radio button แล้ว */}
                {watch(`regsup_thaiMusicTeachers.${index}.isFromMusicInstitute`) === 'true' && (
                  <EducationFields teacherIndex={index} type="music" control={control} register={register} />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <input
                    {...register(`regsup_thaiMusicTeachers.${index}.isFromMusicInstitute`)}
                    type="radio"
                    value="false"
                    className="mr-2"
                  />
                  สำเร็จการศึกษาด้านอื่น (แต่สามารถสอนดนตรีไทยได้ เนื่องจากผ่านการเรียน/อบรมด้านดนตรีไทย) <span className="text-red-500">*</span>
                </label>
                
                {/* ✅ แสดง EducationFields เฉพาะเมื่อเลือก radio button แล้ว */}
                {watch(`regsup_thaiMusicTeachers.${index}.isFromMusicInstitute`) === 'false' && (
                  <EducationFields teacherIndex={index} type="other" control={control} register={register} />
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
              teacherAbility: '',
              isFromMusicInstitute: '',
              musicInstituteEducation: [],
              otherEducation: [],
            })}
            className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer font-medium transition-colors"
          >
            + เพิ่มครูผู้สอนดนตรีไทยคนต่อไป
          </button>
        </div>
      </div>

      {/* ระยะเวลาการเรียนการสอนในเวลาราชการ */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ระยะเวลาการเรียนการสอนในเวลาราชการ</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700 mb-4">
            (ระบุช่วงระยะเวลาสำหรับการเรียนการสอนดนตรีไทยของแต่ละระดับชั้นว่าในแต่ละภาคการศึกษา/ปีการศึกษา มีกี่ชั่วโมงเรียน)
          </p>

          {inClassFields.map((field, index) => (
            <div key={field.id} className={index === 0 ? "space-y-4" : "border border-neutral-border rounded-lg p-4 space-y-4"}>
              {index > 0 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeInClass(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    ลบ
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">ระดับชั้น</label>
                  <input
                    {...register(`regsup_inClassInstructionDurations.${index}.inClassGradeLevel`)}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">เรียนดนตรีไทยจำนวน (คน)</label>
                  <input
                    {...register(`regsup_inClassInstructionDurations.${index}.inClassStudentCount`)}
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
                    {...register(`regsup_inClassInstructionDurations.${index}.inClassHoursPerSemester`)}
                    type="number"
                    min="0"
                    placeholder='จำนวน (ชั่วโมง/ภาคการศึกษา)'
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">ชั่วโมง/ปีการศึกษา</label>
                  <input
                    {...register(`regsup_inClassInstructionDurations.${index}.inClassHoursPerYear`)}
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
              inClassHoursPerYear: undefined,
            })}
            className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
        </div>
      </div>

      {/* ระยะเวลาการเรียนการสอนนอกเวลาราชการ */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ระยะเวลาการเรียนการสอนนอกเวลาราชการ</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700 mb-4">
            (ระบุช่วงเวลาสำหรับการเรียนการสอนดนตรีไทยนอกเวลาราชการว่าอยู่ในช่วงเวลาใดบ้างและใช้สถานที่ใดทำการสอน)
          </p>

          {outClassFields.map((field, index) => (
            <div key={field.id} className={index === 0 ? "space-y-4" : "border border-neutral-border rounded-lg p-4 space-y-4"}>
              {index > 0 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeOutClass(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    ลบ
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">วัน</label>
                  <select
                    {...register(`regsup_outOfClassInstructionDurations.${index}.outDay`)}
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
                    {...register(`regsup_outOfClassInstructionDurations.${index}.outTimeFrom`)}
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
                    {...register(`regsup_outOfClassInstructionDurations.${index}.outTimeTo`)}
                    type="text"
                    placeholder="เช่น 16:00"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">สถานที่</label>
                  <input
                    {...register(`regsup_outOfClassInstructionDurations.${index}.outLocation`)}
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
              outLocation: '',
            })}
            className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}