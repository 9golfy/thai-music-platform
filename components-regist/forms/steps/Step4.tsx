'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Register69FormData } from '@/lib/validators/register69.schema';

interface Step4Props {
  form: UseFormReturn<Register69FormData>;
}

export default function Step4({ form }: Step4Props) {
  const { register, control, formState: { errors } } = form;
  
  // Existing field array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'currentTeachingPlans',
  });

  // Block 1: Available Instruments
  const { 
    fields: instrumentFields, 
    append: appendInstrument, 
    remove: removeInstrument 
  } = useFieldArray({
    control,
    name: 'availableInstruments',
  });

  // Block 2: External Instructors
  const { 
    fields: instructorFields, 
    append: appendInstructor, 
    remove: removeInstructor 
  } = useFieldArray({
    control,
    name: 'externalInstructors',
  });

  // Block 3: In-Class Instruction Durations
  const { 
    fields: inClassFields, 
    append: appendInClass, 
    remove: removeInClass 
  } = useFieldArray({
    control,
    name: 'inClassInstructionDurations',
  });

  // Block 4: Out-of-Class Instruction Durations
  const { 
    fields: outClassFields, 
    append: appendOutClass, 
    remove: removeOutClass 
  } = useFieldArray({
    control,
    name: 'outOfClassInstructionDurations',
  });

  return (
    <div className="space-y-6">
      {/* แผนการจัดการเรียนการสอนปัจจุบัน */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">สภาวการณ์การเรียนการสอนดนตรีไทยของสถานศึกษาในปัจจุบันเล่นดนตรีได้ 1 ชนิด</h3>
        </div>
        <div className="p-6 space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">ข้อมูลชุดที่ {index + 1}</h4>
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
                  ระดับชั้น
                </label>
                <input
                  {...register(`currentTeachingPlans.${index}.gradeLevel`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  รายละเอียดแผน
                </label>
                <textarea
                  {...register(`currentTeachingPlans.${index}.planDetails`)}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ gradeLevel: '', planDetails: '' })}
            className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary hover:bg-green-50 rounded-lg font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
        </div>
      </div>

      {/* BLOCK 1: เครื่องดนตรีไทยที่มีอยู่และใช้งานได้จริงในปัจจุบัน */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ความพร้อมในการส่งเสริมการเรียนการสอนดนตรีไทย ให้กับเด็กนักเรียนทุกคนในสถานศึกษา</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-900 mb-4">
            เครื่องดนตรีไทยที่มีอยู่และใช้งานได้จริงในปัจจุบัน (กรุณาระบุชื่อเครื่องดนตรี พร้อมจำนวน)
          </p>

          {/* Rows */}
          {instrumentFields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => removeInstrument(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ลบ
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <input
                    {...register(`availableInstruments.${index}.availableInstrumentsName`)}
                    type="text"
                    placeholder="ชื่อเครื่องดนตรี"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="md:col-span-3">
                  <input
                    {...register(`availableInstruments.${index}.availableInstrumentsAmount`)}
                    type="number"
                    min="0"
                    placeholder="จำนวน"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="md:col-span-4">
                  <input
                    {...register(`availableInstruments.${index}.availableInstrumentsRemark`)}
                    type="text"
                    placeholder="หมายเหตุ"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => appendInstrument({ 
                availableInstrumentsName: '', 
                availableInstrumentsAmount: undefined, 
                availableInstrumentsRemark: '' 
              })}
              className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary hover:bg-green-50 rounded-lg font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
          </div>
        </div>
      </div>

      {/* BLOCK 2: วิทยากร/ครูภูมิปัญญาไทย/บุคลากรภายนอก */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">วิทยากร/ครูภูมิปัญญาไทย/บุคลากรภายนอก ที่ทำการสอนดนตรีไทยในปัจจุบัน</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-900 mb-4">
            (กรุณาระบุชื่อ-สกุล ตำแหน่งและที่อยู่ปัจจุบัน)
          </p>

          {/* Rows */}
          {instructorFields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeInstructor(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ลบ
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">ชื่อ-สกุล</label>
                  <input
                    {...register(`externalInstructors.${index}.extFullName`)}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">ตำแหน่ง</label>
                  <input
                    {...register(`externalInstructors.${index}.extPosition`)}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">บทบาท/หน้าที่</label>
                <select
                  {...register(`externalInstructors.${index}.extRole`)}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">เลือกบทบาท</option>
                  <option value="ครูผู้สอนดนตรีในโรงเรียน">ครูผู้สอนดนตรีในโรงเรียน</option>
                  <option value="ครูภูมิปัญญาในท้องถิ่น">ครูภูมิปัญญาในท้องถิ่น</option>
                  <option value="ผู้ทรงคุณวุฒิที่มีประสบการณ์ด้านการสอนดนตรีไทย">ผู้ทรงคุณวุฒิที่มีประสบการณ์ด้านการสอนดนตรีไทย</option>
                  <option value="วิทยากรจากภายนอกมาร่วมสอนดนตรีไทยเสริม">วิทยากรจากภายนอกมาร่วมสอนดนตรีไทยเสริม</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">ที่อยู่</label>
                <input
                  {...register(`externalInstructors.${index}.extAddress`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">โทรศัพท์</label>
                  <input
                    {...register(`externalInstructors.${index}.extPhone`)}
                    type="number"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">อีเมล</label>
                  <input
                    {...register(`externalInstructors.${index}.extEmail`)}
                    type="email"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {errors.externalInstructors?.[index]?.extEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.externalInstructors[index]?.extEmail?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => appendInstructor({ 
                extFullName: '', 
                extPosition: '', 
                extRole: '', 
                extAddress: '', 
                extPhone: '', 
                extEmail: '' 
              })}
              className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary hover:bg-green-50 rounded-lg font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
          </div>
        </div>
      </div>

      {/* BLOCK 3: ระยะเวลาทำการเรียนการสอนในเวลาราชการ */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ระยะเวลาทำการเรียนการสอนในเวลาราชการ</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-900 mb-4">
            (ระบุช่วงระยะเวลาสำหรับการเรียนการสอนดนตรีไทยของแต่ละระดับชั้นว่าในแต่ละภาคการศึกษา/ปีการศึกษา มีกี่ชั่วโมงเรียน)
          </p>

          {/* Rows */}
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

          {/* Add More Button */}
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => appendInClass({ 
                inClassGradeLevel: '', 
                inClassStudentCount: undefined, 
                inClassHoursPerSemester: undefined, 
                inClassHoursPerYear: undefined 
              })}
              className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary hover:bg-green-50 rounded-lg font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
          </div>
        </div>
      </div>

      {/* BLOCK 4: ระยะเวลาทำการเรียนการสอนนอกเวลาราชการ */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ระยะเวลาทำการเรียนการสอนนอกเวลาราชการ</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-900 mb-4">
            (ระบุช่วงเวลาสำหรับการเรียนการสอนดนตรีไทยนอกเวลาราชการว่าอยู่ในช่วงเวลาใดบ้างและใช้สถานที่ใดทำการสอน)
          </p>

          {/* Rows */}
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

          {/* Add More Button */}
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => appendOutClass({ 
                outDay: '', 
                outTimeFrom: '', 
                outTimeTo: '', 
                outLocation: '' 
              })}
              className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary hover:bg-green-50 rounded-lg font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
          </div>
        </div>
      </div>

      {/* สถานที่ทำการเรียนการสอนในภาพรวมของสถานศึกษา (ระบุ เช่น ห้องเรียนรวม ห้องประชุม ห้องดนตรีไทย หรือในแต่ละห้องเรียนตามรายวิชา เป็นต้น) */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">สถานที่ทำการเรียนการสอนในภาพรวมของสถานศึกษา </h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              (ระบุ เช่น ห้องเรียนรวม ห้องประชุม ห้องดนตรีไทย หรือในแต่ละห้องเรียนตามรายวิชา เป็นต้น)
            </label>
            <textarea
              {...register('inClassInstructionDuration')}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
