'use client';

import { UseFormReturn, useFieldArray, Controller } from 'react-hook-form';
import { RegisterSupportFormData } from '@/lib/validators/registerSupport.schema';
import { useState } from 'react';

interface Step5Props {
  form: UseFormReturn<RegisterSupportFormData>;
}

export default function Step5({ form }: Step5Props) {
  const { register, control, watch, setValue } = form;
  const [otherSelectedIndices, setOtherSelectedIndices] = useState<Set<number>>(new Set());
  
  const hasSupportFromOrg = watch('regsup_hasSupportFromOrg');
  const hasSupportFromExternal = watch('regsup_hasSupportFromExternal');

  const { 
    fields: supportFactorFields, 
    append: appendSupportFactor, 
    remove: removeSupportFactor 
  } = useFieldArray({
    control,
    name: 'regsup_supportFactors',
  });

  const { fields: orgFields, append: appendOrg, remove: removeOrg } = useFieldArray({
    control,
    name: 'regsup_supportFromOrg',
  });

  const { fields: externalFields, append: appendExternal, remove: removeExternal } = useFieldArray({
    control,
    name: 'regsup_supportFromExternal',
  });

  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({
    control,
    name: 'regsup_awards',
  });

  // Handle organization type change
  const handleOrgTypeChange = (index: number, value: string) => {
    // Clear all three fields first
    setValue(`regsup_supportFactors.${index}.regsup_supportByAdmin`, '');
    setValue(`regsup_supportFactors.${index}.regsup_supportBySchoolBoard`, '');
    setValue(`regsup_supportFactors.${index}.regsup_supportByOthers`, '');
    
    // Set the selected one
    if (value === 'ผู้บริหารสถานศึกษา') {
      setValue(`regsup_supportFactors.${index}.regsup_supportByAdmin`, value, { shouldDirty: true });
      setOtherSelectedIndices(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    } else if (value === 'กรรมการสถานศึกษา') {
      setValue(`regsup_supportFactors.${index}.regsup_supportBySchoolBoard`, value, { shouldDirty: true });
      setOtherSelectedIndices(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    } else if (value.startsWith('อื่นๆ')) {
      // Mark this index as having "other" selected
      setOtherSelectedIndices(prev => new Set(prev).add(index));
    }
  };

  return (
    <div className="space-y-6">
      {/* ปัจจัยที่เกี่ยวข้องโดยตรง */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ปัจจัยที่เกี่ยวข้องโดยตรงต่อการเข้าร่วมกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-900 mb-4">
            ผู้ที่มีส่วนส่งเสริม สนับสนุนการจัดการเรียนการสอนดนตรีไทยในสถานศึกษา
          </p>

          {supportFactorFields.length === 0 && (
            <Controller
              control={control}
              name={`regsup_supportFactors.0.regsup_supportByAdmin`}
              render={({ field: adminField }) => {
                const adminValue = adminField.value || '';
                const schoolBoardValue = form.getValues(`regsup_supportFactors.0.regsup_supportBySchoolBoard`) || '';
                const othersValue = form.getValues(`regsup_supportFactors.0.regsup_supportByOthers`) || '';
                
                const currentOrgType = adminValue || schoolBoardValue || othersValue;
                const isOtherSelected = otherSelectedIndices.has(0);

                return (
                  <div className="border border-neutral-border rounded-lg p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        องค์กร/หน่วยงาน/บุคคลที่ทำให้การส่งเสริม สนับสนุน
                      </label>
                      <select
                        value={isOtherSelected ? 'อื่นๆ' : currentOrgType}
                        onChange={(e) => handleOrgTypeChange(0, e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">เลือกองค์กร/หน่วยงาน</option>
                        <option value="ผู้บริหารสถานศึกษา">ผู้บริหารสถานศึกษา</option>
                        <option value="กรรมการสถานศึกษา">กรรมการสถานศึกษา</option>
                        <option value="อื่นๆ">อื่นๆ โปรดระบุ (เช่น วัด สมาคม มูลนิธิ)</option>
                      </select>
                    </div>
                    
                    {isOtherSelected && (
                      <div>
                        <input
                          {...register(`regsup_supportFactors.0.regsup_supportByOthers`)}
                          type="text"
                          placeholder="ระบุชื่อองค์กร เช่น วัด สมาคม มูลนิธิ"
                          className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          onChange={(e) => {
                            setValue(`regsup_supportFactors.0.regsup_supportByOthers`, e.target.value, { shouldDirty: true });
                          }}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        รายละเอียด
                      </label>
                      <input
                        {...register(`regsup_supportFactors.0.regsup_supportByDescription`)}
                        type="text"
                        placeholder="รายละเอียดการสนับสนุน"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        วันที่ (ที่ได้รับการสนับสนุน)
                      </label>
                      <input
                        {...register(`regsup_supportFactors.0.regsup_supportByDate`)}
                        type="text"
                        placeholder="กรอกวันที่ (เช่น 15/02/2026)"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        หลักฐาน/ภาพถ่าย/รางวัล
                      </label>
                      <p className="text-xs text-gray-600 mb-2">
                        (Link ในแชร์ drive เพื่อแนบไฟล์ PDF และ JPG)
                      </p>
                      <input
                        {...register(`regsup_supportFactors.0.regsup_supportByDriveLink`)}
                        type="text"
                        placeholder="หรือใส่ลิงก์ Google Drive / Dropbox"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                );
              }}
            />
          )}

          {supportFactorFields.map((field, index) => (
            <Controller
              key={field.id}
              control={control}
              name={`regsup_supportFactors.${index}.regsup_supportByAdmin`}
              render={({ field: adminField }) => {
                const adminValue = adminField.value || '';
                const schoolBoardValue = form.getValues(`regsup_supportFactors.${index}.regsup_supportBySchoolBoard`) || '';
                const othersValue = form.getValues(`regsup_supportFactors.${index}.regsup_supportByOthers`) || '';
                
                const currentOrgType = adminValue || schoolBoardValue || othersValue;
                const isOtherSelected = otherSelectedIndices.has(index);

                return (
                  <div className="border border-neutral-border rounded-lg p-4 space-y-4">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeSupportFactor(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        ลบ
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        องค์กร/หน่วยงาน/บุคคลที่ทำให้การส่งเสริม สนับสนุน
                      </label>
                      <select
                        value={isOtherSelected ? 'อื่นๆ' : currentOrgType}
                        onChange={(e) => handleOrgTypeChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">เลือกองค์กร/หน่วยงาน</option>
                        <option value="ผู้บริหารสถานศึกษา">ผู้บริหารสถานศึกษา</option>
                        <option value="กรรมการสถานศึกษา">กรรมการสถานศึกษา</option>
                        <option value="อื่นๆ">อื่นๆ โปรดระบุ (เช่น วัด สมาคม มูลนิธิ)</option>
                      </select>
                    </div>
                    
                    {isOtherSelected && (
                      <div>
                        <input
                          {...register(`regsup_supportFactors.${index}.regsup_supportByOthers`)}
                          type="text"
                          placeholder="ระบุชื่อองค์กร เช่น วัด สมาคม มูลนิธิ"
                          className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          onChange={(e) => {
                            setValue(`regsup_supportFactors.${index}.regsup_supportByOthers`, e.target.value, { shouldDirty: true });
                          }}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        รายละเอียด
                      </label>
                      <input
                        {...register(`regsup_supportFactors.${index}.regsup_supportByDescription`)}
                        type="text"
                        placeholder="รายละเอียดการสนับสนุน"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        วันที่ (ที่ได้รับการสนับสนุน)
                      </label>
                      <input
                        {...register(`regsup_supportFactors.${index}.regsup_supportByDate`)}
                        type="text"
                        placeholder="กรอกวันที่ (เช่น 15/02/2026)"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        หลักฐาน/ภาพถ่าย/รางวัล
                      </label>
                      <p className="text-xs text-gray-600 mb-2">
                        (Link ในแชร์ drive เพื่อแนบไฟล์ PDF และ JPG)
                      </p>
                      <input
                        {...register(`regsup_supportFactors.${index}.regsup_supportByDriveLink`)}
                        type="text"
                        placeholder="หรือใส่ลิงก์ Google Drive / Dropbox"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                );
              }}
            />
          ))}

          <button
            type="button"
            onClick={() => appendSupportFactor({
              regsup_supportByAdmin: '',
              regsup_supportBySchoolBoard: '',
              regsup_supportByOthers: '',
              regsup_supportByDescription: '',
              regsup_supportByDate: '',
              regsup_supportByDriveLink: '',
            })}
            className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
        </div>
      </div>

      {/* การสนับสนุน */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ปัจจัยที่เกี่ยวข้องโดยตรงต่อการเข้าร่วมกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์</h3>
          <p className="text-sm text-gray-600 mt-1">การสนับสนุนวัสดุ อุปกรณ์ หรืองบประมาณ จากทั้งภายในและภายนอกสถานศึกษา</p>
        </div>
        <div className="p-6 space-y-6">
          {/* Support from Organization */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('regsup_hasSupportFromOrg')}
                type="checkbox"
                className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">ได้รับการสนับสนุนจากต้นสังกัด (บุคคล/หน่วยงานภายใน)</span>
                <p className="text-xs text-gray-600 mt-1">ถ้าติ๊กจะได้ 5 คะแนน</p>
              </div>
            </label>

            <div className="ml-7 space-y-4">
              {orgFields.length === 0 && (
                <div className="border border-neutral-border rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      บุคคล/หน่วยงาน
                    </label>
                    <input
                      {...register(`regsup_supportFromOrg.0.organization`)}
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
                      {...register(`regsup_supportFromOrg.0.details`)}
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
                      {...register(`regsup_supportFromOrg.0.evidenceLink`)}
                      type="url"
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              )}

              {orgFields.map((field, index) => (
                    <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900 text-sm">รายการที่ {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeOrg(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          ลบ
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          บุคคล/หน่วยงาน
                        </label>
                        <input
                          {...register(`regsup_supportFromOrg.${index}.organization`)}
                          type="text"
                          className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          รายละเอียด
                        </label>
                        <textarea
                          {...register(`regsup_supportFromOrg.${index}.details`)}
                          rows={2}
                          className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                        </label>
                        <input
                          {...register(`regsup_supportFromOrg.${index}.evidenceLink`)}
                          type="url"
                          className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  ))}

                <button
                  type="button"
                  onClick={() => appendOrg({ organization: '', details: '', evidenceLink: '' })}
                  className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
                >
                  + เพิ่มข้อมูล
                </button>
              </div>
          </div>

          {/* Support from External */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('regsup_hasSupportFromExternal')}
                type="checkbox"
                className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก</span>
                <p className="text-xs text-gray-600 mt-1">1 คน = 5 คะแนน, 2 คน = 10 คะแนน, 3+ คน = 15 คะแนน (สูงสุด)</p>
              </div>
            </label>

            <div className="ml-7 space-y-4">
              {externalFields.length === 0 && (
                  <div className="border border-neutral-border rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        บุคคล/หน่วยงาน
                      </label>
                      <input
                        {...register(`regsup_supportFromExternal.0.organization`)}
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
                        {...register(`regsup_supportFromExternal.0.details`)}
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
                        {...register(`regsup_supportFromExternal.0.evidenceLink`)}
                        type="url"
                        placeholder="https://drive.google.com/..."
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                )}

                {externalFields.map((field, index) => (
                    <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900 text-sm">รายการที่ {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeExternal(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          ลบ
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          บุคคล/หน่วยงาน
                        </label>
                        <input
                          {...register(`regsup_supportFromExternal.${index}.organization`)}
                          type="text"
                          className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          รายละเอียด
                        </label>
                        <textarea
                          {...register(`regsup_supportFromExternal.${index}.details`)}
                          rows={2}
                          className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                        </label>
                        <input
                          {...register(`regsup_supportFromExternal.${index}.evidenceLink`)}
                          type="url"
                          className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  ))}

                <button
                  type="button"
                  onClick={() => appendExternal({ organization: '', details: '', evidenceLink: '' })}
                  className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
                >
                  + เพิ่มข้อมูล
                </button>
              </div>
          </div>
        </div>
      </div>

      {/* กรอบการเรียนการสอน */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">สถานศึกษามีกรอบการเรียนการสอนดนตรีไทย หรือสาระวิชาที่มุ่งให้นักเรียนสามารถปฏิบัติได้</h3>
        </div>
        <div className="p-6">
          <textarea
            {...register('regsup_curriculumFramework')}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="กรอกรายละเอียด"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ผลสัมฤทธิ์ในการเรียนการสอนด้านดนตรีไทย</h3>
        </div>
        <div className="p-6">
          <textarea
            {...register('regsup_learningOutcomes')}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="กรอกรายละเอียด"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">การบริหารจัดการสอนดนตรีไทยของสถานศึกษา</h3>
        </div>
        <div className="p-6">
          <textarea
            {...register('regsup_managementContext')}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="กรอกรายละเอียด"
          />
        </div>
      </div>

      {/* รางวัล */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">รางวัลและเกียรติคุณที่ได้รับในระยะเวลา ๑ ปี ย้อนหลัง</h3>
          <p className="text-sm text-gray-600 mt-1">(ตั้งแต่พฤษภาคม ๒๕๖๗ – พฤษภาคม ๒๕๖๘)</p>
          <p className="text-sm text-gray-600 mt-1">คะแนนเต็ม 20 คะแนน - เลือกระดับและคะแนนสูงสุดเพียงค่าเดียว</p>
          <p className="text-xs text-gray-600 mt-1">อำเภอ = 5, จังหวัด = 10, ภาค = 15, ประเทศ = 20</p>
        </div>
        <div className="p-6 space-y-4">
          {awardFields.length === 0 && (
            <div className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ระดับรางวัล <span className="text-red-500">*</span>
                </label>
                <select
                  {...register(`regsup_awards.0.awardLevel`)}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">เลือกระดับ</option>
                  <option value="อำเภอ">ระดับอำเภอ (5 คะแนน)</option>
                  <option value="จังหวัด">ระดับจังหวัด (10 คะแนน)</option>
                  <option value="ภาค">ระดับภาค (15 คะแนน)</option>
                  <option value="ประเทศ">ระดับประเทศ (20 คะแนน)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ชื่อรางวัล
                </label>
                <input
                  {...register(`regsup_awards.0.awardName`)}
                  type="text"
                  placeholder="ชื่อรางวัล"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  วันที่ได้รับรางวัล
                </label>
                <input
                  {...register(`regsup_awards.0.awardDate`)}
                  type="text"
                  placeholder="เช่น 15/05/2568"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  หลักฐาน (Link/URL)
                </label>
                <input
                  {...register(`regsup_awards.0.awardEvidenceLink`)}
                  type="url"
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          )}

          {awardFields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 text-sm">รางวัลที่ {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeAward(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ลบ
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ระดับรางวัล <span className="text-red-500">*</span>
                </label>
                <select
                  {...register(`regsup_awards.${index}.awardLevel`)}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">เลือกระดับ</option>
                  <option value="อำเภอ">ระดับอำเภอ (5 คะแนน)</option>
                  <option value="จังหวัด">ระดับจังหวัด (10 คะแนน)</option>
                  <option value="ภาค">ระดับภาค (15 คะแนน)</option>
                  <option value="ประเทศ">ระดับประเทศ (20 คะแนน)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ชื่อรางวัล
                </label>
                <input
                  {...register(`regsup_awards.${index}.awardName`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  วันที่ได้รับรางวัล
                </label>
                <input
                  {...register(`regsup_awards.${index}.awardDate`)}
                  type="text"
                  placeholder="เช่น 15/05/2568"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  หลักฐาน (Link/URL)
                </label>
                <input
                  {...register(`regsup_awards.${index}.awardEvidenceLink`)}
                  type="url"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendAward({ awardLevel: '', awardName: '', awardDate: '', awardEvidenceLink: '' })}
            className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}
