'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { RegisterSupportFormData } from '@/lib/validators/registerSupport.schema';
import { useEffect, useRef } from 'react';

interface Step7Props {
  form: UseFormReturn<RegisterSupportFormData>;
}

export default function Step7({ form }: Step7Props) {
  const { register, control } = form;
  const isInitialized = useRef(false);

  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({
    control,
    name: 'regsup_awards',
  });

  const MAX_ITEMS = 5;

  // Initialize with first item
  useEffect(() => {
    if (!isInitialized.current) {
      if (awardFields.length === 0) {
        appendAward({ awardLevel: '', awardName: '', awardDate: '', awardEvidenceLink: '' });
      }
      isInitialized.current = true;
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* รางวัล */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">รางวัลและเกียรติคุณที่ได้รับในระยะเวลา ๑ ปี ย้อนหลัง</h3>

        </div>
        <div className="p-6 space-y-4">
          {awardFields.map((field, idx) => (
            <div key={field.id} className={idx === 0 ? "space-y-3" : "border border-neutral-border rounded-lg p-4 space-y-3"}>
              {idx > 0 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeAward(idx)}
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
                    ระดับรางวัล <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register(`regsup_awards.${idx}.awardLevel`)}
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">เลือกระดับรางวัล</option>
                    <option value="อำเภอ">อำเภอ (5 คะแนน)</option>
                    <option value="จังหวัด">จังหวัด (10 คะแนน)</option>
                    <option value="ภาค">ภาค (15 คะแนน)</option>
                    <option value="ประเทศ">ประเทศ (20 คะแนน)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    ชื่อรางวัล
                  </label>
                  <input
                    {...register(`regsup_awards.${idx}.awardName`)}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    วันที่ได้รับรางวัล
                  </label>
                  <input
                    {...register(`regsup_awards.${idx}.awardDate`)}
                    type="date"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Link/URL หลักฐาน
                  </label>
                  <input
                    {...register(`regsup_awards.${idx}.awardEvidenceLink`)}
                    type="url"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          ))}

          {awardFields.length < MAX_ITEMS && (
            <button
              type="button"
              onClick={() => appendAward({ awardLevel: '', awardName: '', awardDate: '', awardEvidenceLink: '' })}
              className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
            >
              + เพิ่มข้อมูล ({awardFields.length}/{MAX_ITEMS})
            </button>
          )}
          {awardFields.length >= MAX_ITEMS && (
            <p className="text-sm text-gray-600 text-center py-2">
              เพิ่มข้อมูลได้สูงสุด 5 รายการ
            </p>
          )}
        </div>
      </div>

      {/* ภาพถ่ายผลงาน */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ภาพถ่ายผลงาน และคลิปวิดีโอที่มีความชัดเจน และสื่อให้เห็นถึงความเป็นโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์</h3>
        </div>
        <div className="p-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              <p>ภาพถ่ายผลงาน หรือกิจกรรมเด่น ตั้งแต่พฤษภาคม 2567 - พฤษภาคม 2568
                จำนวน 10 - 20 ภาพ เท่านั้น!!</p><p>  Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)</p>
            </label>
            <input
              {...register('regsup_photoGalleryLink')}
              type="url"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://drive.google.com/..."
            />
            <p className="text-xs text-gray-600 mt-1">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"</p>
          </div>
        </div>
      </div>

      {/* วีดิโอ/คลิป */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">วีดิโอ/คลิป</h3>
          <p className="text-sm text-gray-600 mt-1">1 บรรยากาศการเรียนการสอนในชั้นเรียน และในสถานศึกษา  ความยาวไม่เกิน 3 นาที</p>
          <p className="text-sm text-gray-600 mt-1">2 การแสดงผลงานด้านดนตรีของนักเรียน ความยาวไม่เกิน 3 นาที</p>
        </div>
        <div className="p-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              <p>  Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)</p>
            </label>
            <input
              {...register('regsup_videoLink')}
              type="url"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://youtube.com/..."
            />
            <p className="text-xs text-gray-600 mt-1">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"</p>
          </div>
        </div>
      </div>

    </div>
  );
}
