'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Register100FormData } from '@/lib/validators/register100.schema';
import { useEffect, useRef } from 'react';

interface Step5Props {
  form: UseFormReturn<Register100FormData>;
}

export default function Step5({ form }: Step5Props) {
  const { register, control } = form;
  const isInitialized = useRef(false);

  // Field arrays for each section (max 5 items each)
  const { fields: compulsoryFields, append: appendCompulsory, remove: removeCompulsory } = useFieldArray({
    control,
    name: 'reg100_compulsoryCurriculum',
  });

  const { fields: electiveFields, append: appendElective, remove: removeElective } = useFieldArray({
    control,
    name: 'reg100_electiveCurriculum',
  });

  const { fields: localFields, append: appendLocal, remove: removeLocal } = useFieldArray({
    control,
    name: 'reg100_localCurriculum',
  });

  const { fields: afterSchoolFields, append: appendAfterSchool, remove: removeAfterSchool } = useFieldArray({
    control,
    name: 'reg100_afterSchoolSchedule',
  });

  const MAX_ITEMS = 5;

  // Initialize with first item for each section
  useEffect(() => {
    if (!isInitialized.current) {
      if (compulsoryFields.length === 0) {
        appendCompulsory({ gradeLevel: '', studentCount: undefined, hoursPerSemester: '', hoursPerYear: '' });
      }
      if (electiveFields.length === 0) {
        appendElective({ gradeLevel: '', studentCount: undefined, hoursPerSemester: '', hoursPerYear: '' });
      }
      if (localFields.length === 0) {
        appendLocal({ gradeLevel: '', studentCount: undefined, hoursPerSemester: '', hoursPerYear: '' });
      }
      if (afterSchoolFields.length === 0) {
        appendAfterSchool({ day: '', timeFrom: '', timeTo: '', location: '' });
      }
      isInitialized.current = true;
    }
  }, [compulsoryFields.length, electiveFields.length, localFields.length, afterSchoolFields.length, appendCompulsory, appendElective, appendLocal, appendAfterSchool]);

  return (
    <div className="space-y-6">
      {/* การเรียนการสอนดนตรีไทย */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">การเรียนการสอนดนตรีไทย</h3>
        </div>
        <div className="p-6 space-y-6">
          
          {/* 1. เป็นวิชาบังคับในชั้นเรียน */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                {...register('reg100_isCompulsorySubject')}
                type="checkbox"
                className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">เป็นวิชาบังคับในชั้นเรียน</span>
                <p className="text-xs text-gray-600 mt-1">
                  ระบุรายวิชาที่การเรียนดนตรีไทยเป็นวิชาบังคับในระดับชั้นเรียน (ระบุช่วงระยะเวลาสำหรับการเรียนการสอนดนตรีไทยของแต่ละระดับชั้นว่าในแต่ละภาคการศึกษา/ปีการศึกษา มีกี่ชั่วโมงเรียน)
                </p>
              </div>
            </label>

            <div className="ml-7 space-y-4">
              {compulsoryFields.map((field, idx) => (
                <div key={field.id} className={idx === 0 ? "space-y-3" : "border border-neutral-border rounded-lg p-4 space-y-3"}>
                  {idx > 0 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeCompulsory(idx)}
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
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        ระดับชั้น
                      </label>
                      <input
                        {...register(`reg100_compulsoryCurriculum.${idx}.gradeLevel`)}
                        type="text"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        เรียนดนตรีไทยจำนวน (คน)
                      </label>
                      <input
                        {...register(`reg100_compulsoryCurriculum.${idx}.studentCount`)}
                        type="number"
                        min="0"
                        placeholder="จำนวนนักเรียน (คน)"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        ชั่วโมง/ภาคการศึกษา
                      </label>
                      <input
                        {...register(`reg100_compulsoryCurriculum.${idx}.hoursPerSemester`)}
                        type="text"
                        placeholder="จำนวน (ชั่วโมง/ภาคการศึกษา)"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        ชั่วโมง/ปีการศึกษา
                      </label>
                      <input
                        {...register(`reg100_compulsoryCurriculum.${idx}.hoursPerYear`)}
                        type="text"
                        placeholder="จำนวน (ชั่วโมง/ปีการศึกษา)"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {compulsoryFields.length < MAX_ITEMS && (
                <button
                  type="button"
                  onClick={() => appendCompulsory({ gradeLevel: '', studentCount: undefined, hoursPerSemester: '', hoursPerYear: '' })}
                  className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
                >
                  + เพิ่มข้อมูล ({compulsoryFields.length}/{MAX_ITEMS})
                </button>
              )}
              {compulsoryFields.length >= MAX_ITEMS && (
                <p className="text-sm text-gray-600 text-center py-2">
                  เพิ่มข้อมูลได้สูงสุด 5 รายการ
                </p>
              )}
            </div>
          </div>


          {/* 2. มีวิชาเลือก/วิชาเรียนเพิ่มเติม/ชุมนุม */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                {...register('reg100_hasElectiveSubject')}
                type="checkbox"
                className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">มีวิชาเลือก/วิชาเรียนเพิ่มเติม/ชุมนุม</span>
                <p className="text-xs text-gray-600 mt-1">
                  ระบุรายวิชาที่การเรียนดนตรีไทยเป็นวิชาเลือกในระดับชั้นเรียน (ระบุช่วงระยะเวลาสำหรับการเรียนการสอนดนตรีไทยของแต่ละระดับชั้นว่าในแต่ละภาคการศึกษา/ปีการศึกษา มีกี่ชั่วโมงเรียน)
                </p>
              </div>
            </label>

            <div className="ml-7 space-y-4">
              {electiveFields.map((field, idx) => (
                <div key={field.id} className={idx === 0 ? "space-y-3" : "border border-neutral-border rounded-lg p-4 space-y-3"}>
                  {idx > 0 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeElective(idx)}
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
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        ระดับชั้น
                      </label>
                      <input
                        {...register(`reg100_electiveCurriculum.${idx}.gradeLevel`)}
                        type="text"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        เรียนดนตรีไทยจำนวน (คน)
                      </label>
                      <input
                        {...register(`reg100_electiveCurriculum.${idx}.studentCount`)}
                        type="number"
                        min="0"
                        placeholder="จำนวนนักเรียน (คน)"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        ชั่วโมง/ภาคการศึกษา
                      </label>
                      <input
                        {...register(`reg100_electiveCurriculum.${idx}.hoursPerSemester`)}
                        type="text"
                        placeholder="จำนวน (ชั่วโมง/ภาคการศึกษา)"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        ชั่วโมง/ปีการศึกษา
                      </label>
                      <input
                        {...register(`reg100_electiveCurriculum.${idx}.hoursPerYear`)}
                        type="text"
                        placeholder="จำนวน (ชั่วโมง/ปีการศึกษา)"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {electiveFields.length < MAX_ITEMS && (
                <button
                  type="button"
                  onClick={() => appendElective({ gradeLevel: '', studentCount: undefined, hoursPerSemester: '', hoursPerYear: '' })}
                  className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
                >
                  + เพิ่มข้อมูล ({electiveFields.length}/{MAX_ITEMS})
                </button>
              )}
              {electiveFields.length >= MAX_ITEMS && (
                <p className="text-sm text-gray-600 text-center py-2">
                  เพิ่มข้อมูลได้สูงสุด 5 รายการ
                </p>
              )}
            </div>
          </div>

          {/* 3. มีหลักสูตรวิชาของท้องถิ่น */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                {...register('reg100_hasLocalCurriculum')}
                type="checkbox"
                className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">มีหลักสูตรวิชาของท้องถิ่น</span>
                <p className="text-xs text-gray-600 mt-1">
                  ระบุรายวิชาที่การเรียนดนตรีไทยเป็นหลักสูตรวิชาของท้องถิ่น (ระบุช่วงระยะเวลาสำหรับการเรียนการสอนดนตรีไทยของแต่ละระดับชั้นว่าในแต่ละภาคการศึกษา/ปีการศึกษา มีกี่ชั่วโมงเรียน)
                </p>
              </div>
            </label>

            <div className="ml-7 space-y-4">
              {localFields.map((field, idx) => (
                <div key={field.id} className={idx === 0 ? "space-y-3" : "border border-neutral-border rounded-lg p-4 space-y-3"}>
                  {idx > 0 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeLocal(idx)}
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
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        ระดับชั้น
                      </label>
                      <input
                        {...register(`reg100_localCurriculum.${idx}.gradeLevel`)}
                        type="text"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        เรียนดนตรีไทยจำนวน (คน)
                      </label>
                      <input
                        {...register(`reg100_localCurriculum.${idx}.studentCount`)}
                        type="number"
                        min="0"
                        placeholder="จำนวนนักเรียน (คน)"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        ชั่วโมง/ภาคการศึกษา
                      </label>
                      <input
                        {...register(`reg100_localCurriculum.${idx}.hoursPerSemester`)}
                        type="text"
                        placeholder="จำนวน (ชั่วโมง/ภาคการศึกษา)"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        ชั่วโมง/ปีการศึกษา
                      </label>
                      <input
                        {...register(`reg100_localCurriculum.${idx}.hoursPerYear`)}
                        type="text"
                        placeholder="จำนวน (ชั่วโมง/ปีการศึกษา)"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {localFields.length < MAX_ITEMS && (
                <button
                  type="button"
                  onClick={() => appendLocal({ gradeLevel: '', studentCount: undefined, hoursPerSemester: '', hoursPerYear: '' })}
                  className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
                >
                  + เพิ่มข้อมูล ({localFields.length}/{MAX_ITEMS})
                </button>
              )}
              {localFields.length >= MAX_ITEMS && (
                <p className="text-sm text-gray-600 text-center py-2">
                  เพิ่มข้อมูลได้สูงสุด 5 รายการ
                </p>
              )}
            </div>
          </div>

          {/* 4. นอกเวลาราชการ */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                {...register('reg100_hasAfterSchoolTeaching')}
                type="checkbox"
                className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <span className="text-sm font-medium text-gray-900">มีการเรียนการสอนนอกเวลาราชการ</span>
            </label>

            <div className="ml-7 space-y-4">
              {afterSchoolFields.map((field, idx) => (
                <div key={field.id} className={idx === 0 ? "space-y-3" : "border border-neutral-border rounded-lg p-4 space-y-3"}>
                  {idx > 0 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeAfterSchool(idx)}
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
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        วัน
                      </label>
                      <select
                        {...register(`reg100_afterSchoolSchedule.${idx}.day`)}
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
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        เวลา
                      </label>
                      <input
                        {...register(`reg100_afterSchoolSchedule.${idx}.timeFrom`)}
                        type="text"
                        placeholder="เช่น 08:00"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        ถึง
                      </label>
                      <input
                        {...register(`reg100_afterSchoolSchedule.${idx}.timeTo`)}
                        type="text"
                        placeholder="เช่น 16:00"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        สถานที่
                      </label>
                      <input
                        {...register(`reg100_afterSchoolSchedule.${idx}.location`)}
                        type="text"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {afterSchoolFields.length < MAX_ITEMS && (
                <button
                  type="button"
                  onClick={() => appendAfterSchool({ day: '', timeFrom: '', timeTo: '', location: '' })}
                  className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
                >
                  + เพิ่มข้อมูล ({afterSchoolFields.length}/{MAX_ITEMS})
                </button>
              )}
              {afterSchoolFields.length >= MAX_ITEMS && (
                <p className="text-sm text-gray-600 text-center py-2">
                  เพิ่มข้อมูลได้สูงสุด 5 รายการ
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* สถานที่ทำการเรียนการสอนในภาพรวมของสถานศึกษา - Outside checkbox group */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">สถานที่ทำการเรียนการสอนในภาพรวมของสถานศึกษา</h3>
        </div>
        <div className="p-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              (ระบุ เช่น ห้องเรียนรวม ห้องประชุม ห้องดนตรีไทย หรือในแต่ละห้องเรียนตามรายวิชา เป็นต้น)
            </label>
            <textarea
              {...register('reg100_teachingLocation')}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="กรอกรายละเอียด"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
