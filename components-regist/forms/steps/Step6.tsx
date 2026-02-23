'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Register69FormData } from '@/lib/validators/register69.schema';

interface Step6Props {
  form: UseFormReturn<Register69FormData>;
}

export default function Step6({ form }: Step6Props) {
  const { register, control } = form;

  const { 
    fields: classroomVideoFields, 
    append: appendClassroomVideo, 
    remove: removeClassroomVideo 
  } = useFieldArray({
    control,
    name: 'classroomVideos',
  });

  const { 
    fields: performanceVideoFields, 
    append: appendPerformanceVideo, 
    remove: removePerformanceVideo 
  } = useFieldArray({
    control,
    name: 'performanceVideos',
  });

  return (
    <div className="space-y-6">
      {/* ภาพถ่ายผลงานและคลิปวิดีโอ */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">
            ภาพถ่ายผลงานที่มีความชัดเจน และสื่อให้เห็นถึงความเป็นโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์
          </h3>
        </div>
        <div className="p-6 space-y-6">
         
          {/* ภาพถ่าย */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              ภาพถ่ายจำนวนไม่น้อยกว่า ๑๐ ภาพ (ภาพถ่ายกิจกรรม/ผลงานเด่นในระยะเวลา ๑ ปี)
            </label>
            <input
              {...register('photoGalleryLink')}
              type="text"
              placeholder="วางลิงก์ Google Drive ที่มีภาพถ่ายทั้งหมด"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      {/* วีดิโอ/คลิป */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">
            วีดิโอ/คลิป (**ความยาวไม่เกิน 3 นาที)
          </h3>
        </div>
        <div className="p-6 space-y-6">
          
          {/* Block 1: บรรยากาศการเรียนการสอนในชั้นเรียน */}
          <div className="border border-neutral-border rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-gray-900">
              บรรยากาศการเรียนการสอนในชั้นเรียน (**ความยาวไม่เกิน 3 นาที)
            </h4>
            
            {classroomVideoFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`classroomVideos.${index}.classroomVideoLink`)}
                  type="text"
                  placeholder="วางลิงค์ Youtube หรือ Google Drive ในช่องนี้"
                  className="flex-1 px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => removeClassroomVideo(index)}
                  className="px-3 py-2 text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ลบ
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendClassroomVideo({ classroomVideoLink: '' })}
              className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary hover:bg-green-50 rounded-lg font-medium transition-colors"
            >
              + เพิ่มข้อมูล
            </button>
          </div>

          {/* Block 2: การแสดงผลงานด้านดนตรีไทยของนักเรียน */}
          <div className="border border-neutral-border rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-gray-900">
              การแสดงผลงานด้านดนตรีไทยของนักเรียน (**ความยาวไม่เกิน 3 นาที)
            </h4>

            {/* ภายในสถานศึกษา */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                ภายในสถานศึกษา
              </label>
              {performanceVideoFields
                .map((field, index) => ({ field, index, type: form.watch(`performanceVideos.${index}.performanceType`) }))
                .filter(({ type }) => type === 'internal')
                .map(({ field, index }) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`performanceVideos.${index}.performanceVideoLink`)}
                      type="text"
                      placeholder="วางลิงค์ Youtube หรือ Google Drive ในช่องนี้"
                      className="flex-1 px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      type="button"
                      onClick={() => removePerformanceVideo(index)}
                      className="px-3 py-2 text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              <button
                type="button"
                onClick={() => appendPerformanceVideo({ performanceType: 'internal', performanceVideoLink: '' })}
                className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary hover:bg-green-50 rounded-lg font-medium transition-colors"
              >
                + เพิ่มข้อมูล
              </button>
            </div>

            {/* ภายนอกสถานศึกษา */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                ภายนอกสถานศึกษา
              </label>
              {performanceVideoFields
                .map((field, index) => ({ field, index, type: form.watch(`performanceVideos.${index}.performanceType`) }))
                .filter(({ type }) => type === 'external')
                .map(({ field, index }) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`performanceVideos.${index}.performanceVideoLink`)}
                      type="text"
                      placeholder="วางลิงค์ Youtube หรือ Google Drive ในช่องนี้"
                      className="flex-1 px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      type="button"
                      onClick={() => removePerformanceVideo(index)}
                      className="px-3 py-2 text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              <button
                type="button"
                onClick={() => appendPerformanceVideo({ performanceType: 'external', performanceVideoLink: '' })}
                className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary hover:bg-green-50 rounded-lg font-medium transition-colors"
              >
                + เพิ่มข้อมูล
              </button>
            </div>

            {/* ออนไลน์ (Online) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                ออนไลน์ (Online)
              </label>
              {performanceVideoFields
                .map((field, index) => ({ field, index, type: form.watch(`performanceVideos.${index}.performanceType`) }))
                .filter(({ type }) => type === 'online')
                .map(({ field, index }) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`performanceVideos.${index}.performanceVideoLink`)}
                      type="text"
                      placeholder="วางลิงค์ Youtube หรือ Google Drive ในช่องนี้"
                      className="flex-1 px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      type="button"
                      onClick={() => removePerformanceVideo(index)}
                      className="px-3 py-2 text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              <button
                type="button"
                onClick={() => appendPerformanceVideo({ performanceType: 'online', performanceVideoLink: '' })}
                className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary hover:bg-green-50 rounded-lg font-medium transition-colors"
              >
                + เพิ่มข้อมูล
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
