'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Register100FormData } from '@/lib/validators/register100.schema';
import { useEffect, useRef } from 'react';

interface Step3Props {
  form: UseFormReturn<Register100FormData>;
}

export default function Step3({ form }: Step3Props) {
  const { register, control } = form;
  const isInitialized = useRef(false);

  const { fields: musicFields, append: appendMusic, remove: removeMusic } = useFieldArray({
    control,
    name: 'reg100_currentMusicTypes',
  });

  const { fields: readinessFields, append: appendReadiness, remove: removeReadiness } = useFieldArray({
    control,
    name: 'reg100_readinessItems',
  });

  // Initialize with first item for each section
  useEffect(() => {
    if (!isInitialized.current) {
      if (musicFields.length === 0) {
        appendMusic({ grade: '', details: '' });
      }
      if (readinessFields.length === 0) {
        appendReadiness({ instrumentName: '', quantity: '', note: '' });
      }
      isInitialized.current = true;
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* สภาวการณ์การเรียนการสอนดนตรีไทย */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">สภาวการณ์การเรียนการสอนดนตรีไทยของสถานศึกษาในปัจจุบันเล่นดนตรีได้ 1 ชนิด</h3>
          <p className="text-sm text-gray-600 mt-1">กรุณาเพิ่มอย่างน้อย 1 รายการ</p>
        </div>
        <div className="p-6 space-y-4">
          {musicFields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 text-sm">ข้อมูลชุดที่ {index + 1}</h4>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeMusic(index)}
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
                  ระดับชั้น
                </label>
                <input
                  {...register(`reg100_currentMusicTypes.${index}.grade`)}
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
                  {...register(`reg100_currentMusicTypes.${index}.details`)}
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
          <p className="text-sm text-gray-600 mt-1">กรุณาเพิ่มอย่างน้อย 1 รายการ</p>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700 mb-4">
            เครื่องดนตรีไทยที่มีอยู่และใช้งานได้จริงในปัจจุบัน (กรุณาระบุชื่อเครื่องดนตรี พร้อมจำนวน)
          </p>

          {readinessFields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">รายการที่ {index + 1}</span>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeReadiness(index)}
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
                  ชื่อเครื่องดนตรี
                </label>
                <input
                  {...register(`reg100_readinessItems.${index}.instrumentName`)}
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
                  {...register(`reg100_readinessItems.${index}.quantity`)}
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
                  {...register(`reg100_readinessItems.${index}.note`)}
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
