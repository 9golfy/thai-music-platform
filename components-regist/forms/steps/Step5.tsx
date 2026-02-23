'use client';

import { UseFormReturn, useFieldArray, Controller } from 'react-hook-form';
import { Register69FormData } from '@/lib/validators/register69.schema';
import { useState } from 'react';

interface Step5Props {
  form: UseFormReturn<Register69FormData>;
}

export default function Step5({ form }: Step5Props) {
  const { register, control, setValue } = form;
  const [otherSelectedIndices, setOtherSelectedIndices] = useState<Set<number>>(new Set());
  const [instrumentChoice, setInstrumentChoice] = useState<string>('');
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'externalInstructors',
  });

  const { 
    fields: supportFields, 
    append: appendSupport, 
    remove: removeSupport 
  } = useFieldArray({
    control,
    name: 'supportFactors',
  });

  // Convert Gregorian date to Thai Buddhist date format
  const formatThaiDate = (dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // Convert to Buddhist Era
    
    return `${day} ${month} ${year}`;
  };

  // Handle file upload validation
  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValidType = ['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB
      
      if (!isValidType) {
        alert('กรุณาเลือกไฟล์ PDF หรือ JPG เท่านั้น');
        e.target.value = '';
        return;
      }
      
      if (!isValidSize) {
        alert('ขนาดไฟล์ต้องไม่เกิน 2 MB');
        e.target.value = '';
        return;
      }
    }
  };

  // Handle organization type change
  const handleOrgTypeChange = (index: number, value: string) => {
    // Clear all three fields first
    setValue(`supportFactors.${index}.sup_supportByAdmin`, '');
    setValue(`supportFactors.${index}.sup_supportBySchoolBoard`, '');
    setValue(`supportFactors.${index}.sup_supportByOthers`, '');
    
    // Set the selected one
    if (value === 'ผู้บริหารสถานศึกษา') {
      setValue(`supportFactors.${index}.sup_supportByAdmin`, value, { shouldDirty: true });
      setOtherSelectedIndices(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    } else if (value === 'กรรมการสถานศึกษา') {
      setValue(`supportFactors.${index}.sup_supportBySchoolBoard`, value, { shouldDirty: true });
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

          {/* Rows - Vertical Stacked Layout */}
          {supportFields.map((field, index) => (
            <Controller
              key={field.id}
              control={control}
              name={`supportFactors.${index}.sup_supportByAdmin`}
              render={({ field: adminField }) => {
                const adminValue = adminField.value || '';
                const schoolBoardValue = form.getValues(`supportFactors.${index}.sup_supportBySchoolBoard`) || '';
                const othersValue = form.getValues(`supportFactors.${index}.sup_supportByOthers`) || '';
                
                const currentOrgType = adminValue || schoolBoardValue || othersValue;
                const isOtherSelected = otherSelectedIndices.has(index);

                return (
              <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-4">
                {/* Remove Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeSupport(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    ลบ
                  </button>
                </div>

                {/* องค์กร/หน่วยงาน/บุคคล */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-900">
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
                
                {/* Show text input if "อื่นๆ" is selected */}
                {isOtherSelected && (
                  <div className="space-y-1">
                    <input
                      {...register(`supportFactors.${index}.sup_supportByOthers`)}
                      type="text"
                      placeholder="ระบุชื่อองค์กร เช่น วัด สมาคม มูลนิธิ"
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      onChange={(e) => {
                        // Update the field value as user types
                        setValue(`supportFactors.${index}.sup_supportByOthers`, e.target.value, { shouldDirty: true });
                      }}
                    />
                  </div>
                )}

                {/* รายละเอียด */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-900">
                    รายละเอียด
                  </label>
                  <input
                    {...register(`supportFactors.${index}.sup_supportByDescription`)}
                    type="text"
                    placeholder="รายละเอียดการสนับสนุน"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* วันที่ */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-900">
                    วันที่ (ที่ได้รับการสนับสนุน)
                  </label>
                  <input
                    {...register(`supportFactors.${index}.sup_supportByDate`)}
                    type="text"
                    placeholder="กรอกวันที่ (เช่น 15/02/2026)"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* หลักฐาน/ภาพถ่าย/รางวัล */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    หลักฐาน/ภาพถ่าย/รางวัล
                  </label>
                  <p className="text-xs text-gray-900/70">
                    (Link ในแชร์ drive เพื่อแนบไฟล์ PDF และ JPG)
                  </p>
                  
                  {/* Drive Link */}
                  <input
                    {...register(`supportFactors.${index}.sup_supportByDriveLink`)}
                    type="text"
                    placeholder="หรือใส่ลิงก์ Google Drive / Dropbox"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                </div>
              </div>
                );
              }}
            />
          ))}

          {/* Add More Button */}
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => appendSupport({
                sup_supportByAdmin: '',
                sup_supportBySchoolBoard: '',
                sup_supportByOthers: '',
                sup_supportByDescription: '',
                sup_supportByDate: '',
                sup_supportByEvidenceFiles: null,
                sup_supportByDriveLink: '',
              })}
              className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary hover:bg-green-50 rounded-lg font-medium transition-colors"
            >
              + เพิ่มข้อมูล
            </button>
          </div>
        </div>
      </div>

      {/* ความสามารถผู้สอน */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ผู้สอนดนตรีไทยมีความรู้ ความสามารถ ความเชี่ยวชาญ และทักษะในการสอนภาคปฏิบัติดนตรีไทยดังนี้ (บรรยายพอสังเขป)</h3>
        </div>
        <div className="p-6 space-y-4">
          {/* ผู้สอนดนตรีไทยจบการศึกษาสาขาวิชาดนตรีไทย */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ผู้สอนดนตรีไทยจบการศึกษาสาขาวิชาดนตรีไทย
            </label>
            <textarea
              {...register('teacherSkillThaiMusicMajor')}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="บรรยายความรู้ ความสามารถ และทักษะของผู้สอนที่จบสาขาดนตรีไทย"
            />
          </div>

          {/* ผู้สอนดนตรีไทยจบการศึกษาสาขาวิชาอื่น แต่ผ่านการอบรมดนตรีไทย */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ผู้สอนดนตรีไทยจบการศึกษาสาขาวิชาอื่น แต่ผ่านการอบรมดนตรีไทย
            </label>
            <textarea
              {...register('teacherSkillOtherMajorButTrained')}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="บรรยายความรู้ ความสามารถ และทักษะของผู้สอนที่จบสาขาอื่นแต่ผ่านการอบรม"
            />
          </div>
        </div>
      </div>

      {/* ความเพียงพอของเครื่องดนตรี */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">สถานศึกษามีเครื่องดนตรีไทยเพียงพอต่อการจัดการเรียนการสอน</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {/* Radio: เพียงพอ */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="sufficient"
                  checked={instrumentChoice === 'sufficient'}
                  onChange={() => {
                    setInstrumentChoice('sufficient');
                    setValue('instrumentSufficiencyChoice', 'sufficient', { shouldValidate: true, shouldDirty: true });
                    setValue('instrumentSufficiency', true, { shouldValidate: true, shouldDirty: true });
                    setValue('instrumentINSufficiency', false, { shouldValidate: true, shouldDirty: true });
                  }}
                  className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-900">เพียงพอ</span>
              </label>
              {instrumentChoice === 'sufficient' && (
                <div className="ml-7 mt-2">
                  <textarea
                    {...register('instrumentSufficiencyDetail')}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="ระบุรายละเอียด"
                  />
                </div>
              )}
            </div>

            {/* Radio: ไม่เพียงพอ */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="insufficient"
                  checked={instrumentChoice === 'insufficient'}
                  onChange={() => {
                    setInstrumentChoice('insufficient');
                    setValue('instrumentSufficiencyChoice', 'insufficient', { shouldValidate: true, shouldDirty: true });
                    setValue('instrumentINSufficiency', true, { shouldValidate: true, shouldDirty: true });
                    setValue('instrumentSufficiency', false, { shouldValidate: true, shouldDirty: true });
                  }}
                  className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-900">ไม่เพียงพอ</span>
              </label>
              {instrumentChoice === 'insufficient' && (
                <div className="ml-7 mt-2">
                  <textarea
                    {...register('instrumentINSufficiencyDetail')}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="ระบุรายละเอียด"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
      {/* สถานศึกษามีกรอบการเรียนการสอนดนตรีไทย */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">สถานศึกษามีกรอบการเรียนการสอนดนตรีไทย หรือสาระวิชาที่มุ่งให้นักเรียนสามารถปฏิบัติได้</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-900/70 mb-2">
            (เช่น วิชาพื้นฐาน/วิชาเลือก/เพิ่มเติม ที่ส่งเสริมให้นักเรียนปฏิบัติได้)
          </p>
          <textarea
            {...register('curriculumFramework')}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="ระบุกรอบการเรียนการสอนดนตรีไทย"
          />
        </div>
      </div>

      {/* ผลสัมฤทธิ์ในการเรียนการสอนด้านดนตรีไทย */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ผลสัมฤทธิ์ในการเรียนการสอนด้านดนตรีไทย</h3>
        </div>
        <div className="p-6">
          <textarea
            {...register('learningOutcomes')}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="ระบุผลสัมฤทธิ์ในการเรียนการสอนด้านดนตรีไทย"
          />
        </div>
      </div>

      {/* การบริหารจัดการสอนดนตรีไทยของสถานศึกษา */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">การบริหารจัดการสอนดนตรีไทยของสถานศึกษา</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-900/70 mb-2">
            บริหารจัดการสอนดนตรีไทยด้านอื่น ๆ โดยให้ระบุแต่ละระดับชั้นเรียน เช่น ดนตรีไทย/เพลงที่สามารถสอนให้นักเรียนปฏิบัติได้
          </p>
          <textarea
            {...register('managementContext')}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="ระบุการบริหารจัดการสอนดนตรีไทย"
          />
        </div>
      </div>

      {/* การได้รับสนับสนุนอุปกรณ์และงบประมาณ */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">การได้รับสนับสนุนอุปกรณ์และงบประมาณทั้งภายในและภายนอกสถานศึกษา</h3>
        </div>
        <div className="p-6">
          <textarea
            {...register('equipmentAndBudgetSupport')}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="ระบุการได้รับสนับสนุนอุปกรณ์และงบประมาณ"
          />
        </div>
      </div>

      {/* รางวัลและเกียรติคุณที่ได้รับในระยะเวลา ๑ ปี ย้อนหลัง */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">รางวัลและเกียรติคุณที่ได้รับในระยะเวลา ๑ ปี ย้อนหลัง (ตั้งแต่พฤษภาคม ๒๕๖๗ – พฤษภาคม ๒๕๖๘)</h3>
        </div>
        <div className="p-6 space-y-4">
          {(() => {
            const { 
              fields: awardFields, 
              append: appendAward, 
              remove: removeAward 
            } = useFieldArray({
              control,
              name: 'awards',
            });

            return (
              <>
                {awardFields.map((field, index) => (
                  <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-4">
                    {/* Remove Button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeAward(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        ลบ
                      </button>
                    </div>

                    {/* รางวัล/เกียรติบัตร */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-900">
                        รางวัล/เกียรติบัตร
                      </label>
                      <select
                        {...register(`awards.${index}.awardType`)}
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">เลือกประเภทรางวัล</option>
                        <option value="ชนะเลิศการแข่งขันดนตรีไทย">ชนะเลิศการแข่งขันดนตรีไทย</option>
                        <option value="รองชนะเลิศการประกวด">รองชนะเลิศการประกวด</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                      </select>
                    </div>

                    {/* ระดับ */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-900">
                        ระดับ
                      </label>
                      <select
                        {...register(`awards.${index}.awardLevel`)}
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">เลือกระดับ</option>
                        <option value="อำเภอ">อำเภอ</option>
                        <option value="จังหวัด">จังหวัด</option>
                        <option value="ภาค">ภาค</option>
                        <option value="ประเทศ">ประเทศ</option>
                      </select>
                    </div>

                    {/* หน่วยงานที่มอบ */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-900">
                        หน่วยงานที่มอบ
                      </label>
                      <input
                        {...register(`awards.${index}.awardOrganization`)}
                        type="text"
                        placeholder="ระบุหน่วยงานที่มอบรางวัล"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    {/* ได้รับเมื่อวันที่ */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-900">
                        ได้รับเมื่อวันที่
                      </label>
                      <input
                        {...register(`awards.${index}.awardDate`)}
                        type="text"
                        placeholder="กรอกวันที่ (เช่น 15/02/2026)"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    {/* หลักฐาน/ภาพถ่ายรางวัล */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-900">
                        หลักฐาน/ภาพถ่ายรางวัล (Link Google Drive ที่มีไฟล์ PDF, JPG)
                      </label>
                      <input
                        {...register(`awards.${index}.awardEvidenceLink`)}
                        type="text"
                        placeholder="ใส่ลิงก์ Google Drive"
                        className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                ))}

                {/* Add More Button */}
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => appendAward({
                      awardType: '',
                      awardLevel: '',
                      awardOrganization: '',
                      awardDate: '',
                      awardEvidenceLink: '',
                    })}
                    className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary hover:bg-green-50 rounded-lg font-medium transition-colors"
                  >
                    + เพิ่มข้อมูล
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
