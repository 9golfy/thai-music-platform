'use client';

import { Controller, UseFormReturn, useFieldArray } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { RegisterSupportFormData } from '@/lib/validators/registerSupport.schema';

interface Step6Props {
  form: UseFormReturn<RegisterSupportFormData>;
}

const MAX_SUPPORT_ITEMS = 5;
const MAX_ORG_ITEMS = 5;
const MAX_EXTERNAL_ITEMS = 5;

const ADMIN_OPTION = 'ผู้บริหารสถานศึกษา';
const BOARD_OPTION = 'กรรมการสถานศึกษา';
const OTHER_OPTION = 'อื่นๆ';

const emptySupportFactor = {
  sup_supportByAdmin: '',
  sup_supportBySchoolBoard: '',
  sup_supportByOthers: '',
  sup_supportByDescription: '',
  sup_supportByDate: '',
  sup_supportByDriveLink: '',
};

const emptySupportOrg = {
  organization: '',
  details: '',
  evidenceLink: '',
};

export default function Step6({ form }: Step6Props) {
  const { register, control, setValue, getValues } = form;
  const initializedRef = useRef(false);
  const [otherSelectedIndices, setOtherSelectedIndices] = useState<Set<number>>(new Set());

  const {
    fields: supportFactorFields,
    append: appendSupportFactor,
    remove: removeSupportFactor,
  } = useFieldArray({
    control,
    name: 'regsup_supportFactors',
  });

  const {
    fields: orgFields,
    append: appendOrg,
    remove: removeOrg,
  } = useFieldArray({
    control,
    name: 'regsup_supportFromOrg',
  });

  const {
    fields: externalFields,
    append: appendExternal,
    remove: removeExternal,
  } = useFieldArray({
    control,
    name: 'regsup_supportFromExternal',
  });

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    if (supportFactorFields.length === 0) {
      appendSupportFactor(emptySupportFactor);
    }

    if (orgFields.length === 0) {
      appendOrg(emptySupportOrg);
    }

    if (externalFields.length === 0) {
      appendExternal(emptySupportOrg);
    }

    initializedRef.current = true;
  }, [appendExternal, appendOrg, appendSupportFactor, externalFields.length, orgFields.length, supportFactorFields.length]);

  const handleOrgTypeChange = (index: number, value: string) => {
    setValue(`regsup_supportFactors.${index}.sup_supportByAdmin`, '', { shouldDirty: true });
    setValue(`regsup_supportFactors.${index}.sup_supportBySchoolBoard`, '', { shouldDirty: true });
    setValue(`regsup_supportFactors.${index}.sup_supportByOthers`, '', { shouldDirty: true });

    if (value === ADMIN_OPTION) {
      setValue(`regsup_supportFactors.${index}.sup_supportByAdmin`, value, { shouldDirty: true });
    } else if (value === BOARD_OPTION) {
      setValue(`regsup_supportFactors.${index}.sup_supportBySchoolBoard`, value, { shouldDirty: true });
    }

    setOtherSelectedIndices((prev) => {
      const next = new Set(prev);
      if (value === OTHER_OPTION) {
        next.add(index);
      } else {
        next.delete(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-neutral-border bg-white shadow-sm">
        <div className="border-b border-neutral-border bg-green-50 px-6 py-3">
          <h3 className="font-semibold text-gray-900">นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา</h3>
          <p className="mt-1 text-sm text-gray-600">
            ผู้ที่มีส่วนส่งเสริม สนับสนุนการจัดการเรียนการสอนดนตรีไทยในสถานศึกษา
            (ระบุนโยบายการจัดการเรียนการสอนดนตรีไทยของโรงเรียน วิธีการให้ความสนับสนุน)
          </p>
        </div>
        <div className="space-y-4 p-6">
          {supportFactorFields.map((field, index) => (
            <Controller
              key={field.id}
              control={control}
              name={`regsup_supportFactors.${index}.sup_supportByAdmin`}
              render={({ field: adminField }) => {
                const adminValue = adminField.value || '';
                const schoolBoardValue = getValues(`regsup_supportFactors.${index}.sup_supportBySchoolBoard`) || '';
                const othersValue = getValues(`regsup_supportFactors.${index}.sup_supportByOthers`) || '';
                const isOtherSelected = Boolean(othersValue) || otherSelectedIndices.has(index);
                const currentOrgType = isOtherSelected
                  ? OTHER_OPTION
                  : adminValue || schoolBoardValue || '';

                return (
                  <div className="space-y-4 rounded-lg border border-neutral-border p-4">
                    {index > 0 && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeSupportFactor(index)}
                          className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          ลบ
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-900">
                        องค์กร/หน่วยงาน/บุคคลที่ทำให้การส่งเสริม สนับสนุน
                      </label>
                      <select
                        value={currentOrgType}
                        onChange={(e) => handleOrgTypeChange(index, e.target.value)}
                        className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">เลือกองค์กร/หน่วยงาน</option>
                        <option value={ADMIN_OPTION}>{ADMIN_OPTION}</option>
                        <option value={BOARD_OPTION}>{BOARD_OPTION}</option>
                        <option value={OTHER_OPTION}>อื่นๆ โปรดระบุ (เช่น วัด สมาคม มูลนิธิ)</option>
                      </select>
                    </div>

                    {isOtherSelected && (
                      <div>
                        <input
                          {...register(`regsup_supportFactors.${index}.sup_supportByOthers`)}
                          type="text"
                          placeholder="ระบุชื่อองค์กร เช่น วัด สมาคม มูลนิธิ"
                          className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    )}

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-900">
                        บรรยาย และอธิบายรายละเอียดการสนับสนุน
                      </label>
                      <input
                        {...register(`regsup_supportFactors.${index}.sup_supportByDescription`)}
                        type="text"
                        placeholder="รายละเอียดการสนับสนุน"
                        className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                );
              }}
            />
          ))}

          {supportFactorFields.length < MAX_SUPPORT_ITEMS ? (
            <button
              type="button"
              onClick={() => appendSupportFactor(emptySupportFactor)}
              className="w-full rounded-lg border-2 border-dashed border-primary px-4 py-2 font-medium text-primary transition-colors hover:bg-green-50"
            >
              + เพิ่มข้อมูล ({supportFactorFields.length}/{MAX_SUPPORT_ITEMS})
            </button>
          ) : (
            <p className="py-2 text-center text-sm text-gray-600">เพิ่มข้อมูลได้สูงสุด 5 รายการ</p>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-border bg-white shadow-sm">
        <div className="border-b border-neutral-border bg-green-50 px-6 py-3">
          <h3 className="font-semibold text-gray-900">
            การสนับสนุนวัสดุ อุปกรณ์ หรืองบประมาณ จากทั้งภายในและภายนอกสถานศึกษา
          </h3>
        </div>
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                {...register('regsup_hasSupportFromOrg')}
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#00B050] focus:ring-[#00B050]"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">
                  ได้รับการสนับสนุนจากต้นสังกัด (บุคคล/หน่วยงานภายใน)
                </span>
              </div>
            </label>

            <div className="ml-7 space-y-4">
              {orgFields.map((field, index) => (
                <div key={field.id} className="space-y-3 rounded-lg border border-neutral-border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">รายการที่ {index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeOrg(index)}
                        className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        ลบ
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">บุคคล/หน่วยงาน</label>
                    <input
                      {...register(`regsup_supportFromOrg.${index}.organization`)}
                      type="text"
                      placeholder="ชื่อบุคคล/หน่วยงาน"
                      className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">รายละเอียด</label>
                    <textarea
                      {...register(`regsup_supportFromOrg.${index}.details`)}
                      rows={2}
                      placeholder="รายละเอียดการสนับสนุน"
                      className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                    </label>
                    <input
                      {...register(`regsup_supportFromOrg.${index}.evidenceLink`)}
                      type="url"
                      placeholder="https://drive.google.com/..."
                      className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              ))}

              {orgFields.length < MAX_ORG_ITEMS ? (
                <button
                  type="button"
                  onClick={() => appendOrg(emptySupportOrg)}
                  className="w-full rounded-lg border-2 border-dashed border-primary px-4 py-2 font-medium text-primary transition-colors hover:bg-green-50"
                >
                  + เพิ่มข้อมูล ({orgFields.length}/{MAX_ORG_ITEMS})
                </button>
              ) : (
                <p className="py-2 text-center text-sm text-gray-600">เพิ่มข้อมูลได้สูงสุด 5 รายการ</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                {...register('regsup_hasSupportFromExternal')}
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#00B050] focus:ring-[#00B050]"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">
                  ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก
                </span>
              </div>
            </label>

            <div className="ml-7 space-y-4">
              {externalFields.map((field, index) => (
                <div key={field.id} className="space-y-3 rounded-lg border border-neutral-border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">รายการที่ {index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeExternal(index)}
                        className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        ลบ
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">บุคคล/หน่วยงาน</label>
                    <input
                      {...register(`regsup_supportFromExternal.${index}.organization`)}
                      type="text"
                      placeholder="ชื่อบุคคล/หน่วยงาน"
                      className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">รายละเอียด</label>
                    <textarea
                      {...register(`regsup_supportFromExternal.${index}.details`)}
                      rows={2}
                      placeholder="รายละเอียดการสนับสนุน"
                      className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                    </label>
                    <input
                      {...register(`regsup_supportFromExternal.${index}.evidenceLink`)}
                      type="url"
                      placeholder="https://drive.google.com/..."
                      className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              ))}

              {externalFields.length < MAX_EXTERNAL_ITEMS ? (
                <button
                  type="button"
                  onClick={() => appendExternal(emptySupportOrg)}
                  className="w-full rounded-lg border-2 border-dashed border-primary px-4 py-2 font-medium text-primary transition-colors hover:bg-green-50"
                >
                  + เพิ่มข้อมูล ({externalFields.length}/{MAX_EXTERNAL_ITEMS})
                </button>
              ) : (
                <p className="py-2 text-center text-sm text-gray-600">เพิ่มข้อมูลได้สูงสุด 5 รายการ</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-border bg-white shadow-sm">
        <div className="border-b border-neutral-border bg-green-50 px-6 py-3">
          <h3 className="font-semibold text-gray-900">ความพร้อมของเครื่องดนตรีกับนักเรียน</h3>
        </div>
        <div className="space-y-4 p-6">
          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                {...register('regsup_hasEnoughInstruments')}
                type="radio"
                value="เพียงพอ"
                className="mt-1 h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-900">เพียงพอ</span>
            </label>

            <div className="ml-7">
              <textarea
                {...register('regsup_enoughInstrumentsReason')}
                rows={3}
                className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="กรอกเหตุผล"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                {...register('regsup_hasEnoughInstruments')}
                type="radio"
                value="ไม่เพียงพอ"
                className="mt-1 h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-900">ไม่เพียงพอ</span>
            </label>

            <div className="ml-7">
              <textarea
                {...register('regsup_notEnoughInstrumentsReason')}
                rows={3}
                className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="กรอกเหตุผล"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-border bg-white shadow-sm">
        <div className="border-b border-neutral-border bg-green-50 px-6 py-3">
          <h3 className="font-semibold text-gray-900">กรอบการเรียนการสอน</h3>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              สถานศึกษามีกรอบการเรียนการสอนดนตรีไทย หรือสาระวิชาที่มุ่งให้นักเรียนสามารถปฏิบัติได้
              (เช่น วิชาพื้นฐาน/วิชาเลือก/เพิ่มเติม ที่ส่งเสริมให้นักเรียนปฏิบัติได้)
            </label>
            <textarea
              {...register('regsup_curriculumFramework')}
              rows={3}
              className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              ผลสัมฤทธิ์ในการเรียนการสอนด้านดนตรีไทย
            </label>
            <textarea
              {...register('regsup_learningOutcomes')}
              rows={3}
              className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              การบริหารจัดการสอนดนตรีไทยของสถานศึกษา โดยให้ระบุแต่ละระดับชั้นเรียน
              เช่น ดนตรีไทย/เพลงที่สามารถสอนให้นักเรียนปฏิบัติได้
            </label>
            <textarea
              {...register('regsup_managementContext')}
              rows={3}
              className="w-full rounded-lg border border-neutral-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
