'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Register100FormData } from '@/lib/validators/register100.schema';
import { useEffect, useRef } from 'react';

interface Step6Props {
  form: UseFormReturn<Register100FormData>;
}

export default function Step6({ form }: Step6Props) {
  const { register, control } = form;
  const isInitialized = useRef(false);

  // Field arrays
  const { fields: supportFactorFields, append: appendSupportFactor, remove: removeSupportFactor } = useFieldArray({
    control,
    name: 'reg100_supportFactors',
  });

  const { fields: supportFromOrgFields, append: appendSupportFromOrg, remove: removeSupportFromOrg } = useFieldArray({
    control,
    name: 'reg100_supportFromOrg',
  });

  const { fields: supportFromExternalFields, append: appendSupportFromExternal, remove: removeSupportFromExternal } = useFieldArray({
    control,
    name: 'reg100_supportFromExternal',
  });

  const MAX_ITEMS = 5;

  // Initialize with first item for each section
  useEffect(() => {
    if (!isInitialized.current) {
      if (supportFactorFields.length === 0) {
        appendSupportFactor({
          sup_supportByAdmin: '',
          sup_supportByDescription: '',
          sup_supportByDate: '',
          sup_supportByDriveLink: '',
        });
      }
      if (supportFromOrgFields.length === 0) {
        appendSupportFromOrg({ organization: '', details: '', evidenceLink: '' });
      }
      if (supportFromExternalFields.length === 0) {
        appendSupportFromExternal({ organization: '', details: '', evidenceLink: '' });
      }
      isInitialized.current = true;
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* ปัจจัยที่เกี่ยวข้อง */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา</h3>
          <p className="text-sm text-gray-600 mt-1">ผู้ที่มีส่วนส่งเสริม สนับสนุนการจัดการเรียนการสอนดนตรีไทยในสถานศึกษา (ระบุนโยบายการจัดการเรียนการสอนดนตรีไทยของโรงเรียน วิธีการให้ความสนับสนุน)</p>
        </div>
        <div className="p-6 space-y-4">
          {supportFactorFields.map((field, idx) => (
            <div key={field.id} className={idx === 0 ? "space-y-3" : "border border-neutral-border rounded-lg p-4 space-y-3"}>
              {idx > 0 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeSupportFactor(idx)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    ลบ
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  องค์กร/หน่วยงาน/บุคคลที่ทำให้การส่งเสริม สนับสนุน
                </label>
                <select
                  {...register(`reg100_supportFactors.${idx}.sup_supportByAdmin`)}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">เลือกองค์กร/หน่วยงาน</option>
                  <option value="ผู้บริหารสถานศึกษา">ผู้บริหารสถานศึกษา</option>
                  <option value="กรรมการสถานศึกษา">กรรมการสถานศึกษา</option>
                  <option value="อื่นๆ">อื่นๆ โปรดระบุ (เช่น วัด สมาคม มูลนิธิ)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  บรรยาย และอธิบายรายละเอียดการสนับสนุน
                </label>
                <input
                  {...register(`reg100_supportFactors.${idx}.sup_supportByDescription`)}
                  type="text"
                  placeholder="รายละเอียดการสนับสนุน"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          ))}

          {supportFactorFields.length < MAX_ITEMS && (
            <button
              type="button"
              onClick={() => appendSupportFactor({
                sup_supportByAdmin: '',
                sup_supportByDescription: '',
                sup_supportByDate: '',
                sup_supportByDriveLink: '',
              })}
              className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
            >
              + เพิ่มข้อมูล ({supportFactorFields.length}/{MAX_ITEMS})
            </button>
          )}
          {supportFactorFields.length >= MAX_ITEMS && (
            <p className="text-sm text-gray-600 text-center py-2">
              เพิ่มข้อมูลได้สูงสุด 5 รายการ
            </p>
          )}
        </div>
      </div>

      {/* ปัจจัยที่เกี่ยวข้องโดยตรงต่อการเข้าร่วมกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">การสนับสนุนวัสดุ อุปกรณ์ หรืองบประมาณ จากทั้งภายในและภายนอกสถานศึกษา</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* การสนับสนุนจากหน่วยงานในสังกัด */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('reg100_hasSupportFromOrg')}
                type="checkbox"
                className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">ได้รับการสนับสนุนจากต้นสังกัด (บุคคล/หน่วยงานภายใน)</span>
               
              </div>
            </label>

            <div className="ml-7 space-y-4">
              {supportFromOrgFields.length === 0 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      บุคคล/หน่วยงาน
                    </label>
                    <input
                      {...register(`reg100_supportFromOrg.0.organization`)}
                      type="text"
                      placeholder="ชื่อบุคคล/หน่วยงาน"
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      รายละเอียด
                    </label>
                    <textarea
                      {...register(`reg100_supportFromOrg.0.details`)}
                      rows={2}
                      placeholder="รายละเอียดการสนับสนุน"
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                    </label>
                    <input
                      {...register(`reg100_supportFromOrg.0.evidenceLink`)}
                      type="url"
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              )}

              {supportFromOrgFields.map((field, idx) => (
                <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">รายการที่ {idx + 1}</h4>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => removeSupportFromOrg(idx)}
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
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      บุคคล/หน่วยงาน
                    </label>
                    <input
                      {...register(`reg100_supportFromOrg.${idx}.organization`)}
                      type="text"
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      รายละเอียด
                    </label>
                    <textarea
                      {...register(`reg100_supportFromOrg.${idx}.details`)}
                      rows={2}
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                    </label>
                    <input
                      {...register(`reg100_supportFromOrg.${idx}.evidenceLink`)}
                      type="url"
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              ))}

              {(() => {
                const displayedCount = supportFromOrgFields.length === 0 ? 1 : supportFromOrgFields.length;
                if (displayedCount < MAX_ITEMS) {
                  return (
                    <button
                      type="button"
                      onClick={() => appendSupportFromOrg({ organization: '', details: '', evidenceLink: '' })}
                      className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
                    >
                      + เพิ่มข้อมูล ({displayedCount}/{MAX_ITEMS})
                    </button>
                  );
                }
                return (
                  <p className="text-sm text-gray-600 text-center py-2">
                    เพิ่มข้อมูลได้สูงสุด 5 รายการ
                  </p>
                );
              })()}
            </div>
          </div>

          {/* การสนับสนุนจากหน่วยงานภายนอก */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('reg100_hasSupportFromExternal')}
                type="checkbox"
                className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก</span>
               
              </div>
            </label>

            <div className="ml-7 space-y-4">
              {supportFromExternalFields.length === 0 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      บุคคล/หน่วยงาน
                    </label>
                    <input
                      {...register(`reg100_supportFromExternal.0.organization`)}
                      type="text"
                      placeholder="ชื่อบุคคล/หน่วยงาน"
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      รายละเอียด
                    </label>
                    <textarea
                      {...register(`reg100_supportFromExternal.0.details`)}
                      rows={2}
                      placeholder="รายละเอียดการสนับสนุน"
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                    </label>
                    <input
                      {...register(`reg100_supportFromExternal.0.evidenceLink`)}
                      type="url"
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              )}

              {supportFromExternalFields.map((field, idx) => (
                <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">รายการที่ {idx + 1}</h4>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => removeSupportFromExternal(idx)}
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
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      บุคคล/หน่วยงาน
                    </label>
                    <input
                      {...register(`reg100_supportFromExternal.${idx}.organization`)}
                      type="text"
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      รายละเอียด
                    </label>
                    <textarea
                      {...register(`reg100_supportFromExternal.${idx}.details`)}
                      rows={2}
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                    </label>
                    <input
                      {...register(`reg100_supportFromExternal.${idx}.evidenceLink`)}
                      type="url"
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              ))}

              {(() => {
                const displayedCount = supportFromExternalFields.length === 0 ? 1 : supportFromExternalFields.length;
                if (displayedCount < MAX_ITEMS) {
                  return (
                    <button
                      type="button"
                      onClick={() => appendSupportFromExternal({ organization: '', details: '', evidenceLink: '' })}
                      className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
                    >
                      + เพิ่มข้อมูล ({displayedCount}/{MAX_ITEMS})
                    </button>
                  );
                }
                return (
                  <p className="text-sm text-gray-600 text-center py-2">
                    เพิ่มข้อมูลได้สูงสุด 5 รายการ
                  </p>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* ความพร้อมของเครื่องดนตรีกับนักเรียน */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ความพร้อมของเครื่องดนตรีกับนักเรียน</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('reg100_hasEnoughInstruments')}
                type="radio"
                value="เพียงพอ"
                className="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-900">เพียงพอ</span>
            </label>

            <div className="ml-7">

              <textarea
                {...register('reg100_enoughInstrumentsReason')}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="กรอกเหตุผล"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('reg100_hasEnoughInstruments')}
                type="radio"
                value="ไม่เพียงพอ"
                className="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-900">ไม่เพียงพอ</span>
            </label>

            <div className="ml-7">
   
              <textarea
                {...register('reg100_notEnoughInstrumentsReason')}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="กรอกเหตุผล"
              />
            </div>
          </div>
        </div>
      </div>

      {/* กรอบการเรียนการสอน */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">กรอบการเรียนการสอน</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              สถานศึกษามีกรอบการเรียนการสอนดนตรีไทย หรือสาระวิชาที่มุ่งให้นักเรียนสามารถปฏิบัติได้
 (เช่น วิชาพื้นฐาน/วิชาเลือก/เพิ่มเติม ที่ส่งเสริมให้นักเรียนปฏิบัติได้)
            </label>
            <textarea
              {...register('reg100_curriculumFramework')}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
               ผลสัมฤทธิ์ในการเรียนการสอนด้านดนตรีไทย
            </label>
            <textarea
              {...register('reg100_learningOutcomes')}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              การบริหารจัดการสอนดนตรีไทยของสถานศึกษา บริหารการบริหารดนตรีไทยด้านอื่น ๆ โดยให้ระบุแต่ละระดับชั้นเรียน เช่น ดนตรีไทย/เพลงที่สามารถสอนให้นักเรียนปฏิบัติได้
            </label>
            <textarea
              {...register('reg100_managementContext')}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
