'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Register100FormData } from '@/lib/validators/register100.schema';

interface Step3Props {
  form: UseFormReturn<Register100FormData>;
}

export default function Step3({ form }: Step3Props) {
  const { register, control } = form;

  const { fields: musicFields, append: appendMusic, remove: removeMusic } = useFieldArray({
    control,
    name: 'currentMusicTypes',
  });

  const { fields: readinessFields, append: appendReadiness, remove: removeReadiness } = useFieldArray({
    control,
    name: 'readinessItems',
  });

  return (
    <div className="space-y-6">
      {/* สภาวการณ์การเรียนการสอนดนตรีไทย */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">สภาวการณ์การเรียนการสอนดนตรีไทยของสถานศึกษาในปัจจุบันเล่นดนตรีได้ 1 ชนิด</h3>
        </div>
        <div className="p-6 space-y-4">
          {musicFields.length === 0 && (
            <div className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 text-sm">ข้อมูลชุดที่ 1</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ระดับชั้น
                </label>
                <input
                  {...register(`currentMusicTypes.0.grade`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="เช่น ป.1-6, ม.1-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  รายละเอียดแผน
                </label>
                <textarea
                  {...register(`currentMusicTypes.0.details`)}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="กรอกรายละเอียด"
                />
              </div>
            </div>
          )}

          {musicFields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 text-sm">ข้อมูลชุดที่ {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeMusic(index)}
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
                  {...register(`currentMusicTypes.${index}.grade`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="เช่น ป.1-6, ม.1-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  รายละเอียดแผน
                </label>
                <textarea
                  {...register(`currentMusicTypes.${index}.details`)}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="กรอกรายละเอียด"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendMusic({ grade: '', details: '' })}
            className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
        </div>
      </div>

      {/* ความพร้อมในการส่งเสริม */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ความพร้อมในการส่งเสริมการเรียนการสอนดนตรีไทย ให้กับเด็กนักเรียนทุกคนในสถานศึกษา</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700 mb-4">
            เครื่องดนตรีไทยที่มีอยู่และใช้งานได้จริงในปัจจุบัน (กรุณาระบุชื่อเครื่องดนตรี พร้อมจำนวน)
          </p>

          {readinessFields.length === 0 && (
            <div className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ชื่อเครื่องดนตรี
                </label>
                <input
                  {...register(`readinessItems.0.instrumentName`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="ชื่อเครื่องดนตรี"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  จำนวน
                </label>
                <input
                  {...register(`readinessItems.0.quantity`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="จำนวน"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  หมายเหตุ
                </label>
                <input
                  {...register(`readinessItems.0.note`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="หมายเหตุ"
                />
              </div>
            </div>
          )}

          {readinessFields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">รายการที่ {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeReadiness(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ลบ
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ชื่อเครื่องดนตรี
                </label>
                <input
                  {...register(`readinessItems.${index}.instrumentName`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="ชื่อเครื่องดนตรี"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  จำนวน
                </label>
                <input
                  {...register(`readinessItems.${index}.quantity`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="จำนวน"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  หมายเหตุ
                </label>
                <input
                  {...register(`readinessItems.${index}.note`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="หมายเหตุ"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendReadiness({ instrumentName: '', quantity: '', note: '' })}
            className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}
