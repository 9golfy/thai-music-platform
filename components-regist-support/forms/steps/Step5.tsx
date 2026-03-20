'use client';

import { UseFormReturn } from 'react-hook-form';
import { RegisterSupportFormData } from '@/lib/validators/registerSupport.schema';

interface Step5Props {
  form: UseFormReturn<RegisterSupportFormData>;
}

export default function Step5({ form }: Step5Props) {
  const { register } = form;

  return (
    <div className="space-y-6">
      {/* สถานที่ทำการเรียนการสอนในภาพรวมของสถานศึกษา */}
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
              {...register('regsup_teachingLocation')}
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
