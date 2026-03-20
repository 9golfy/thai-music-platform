'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { RegisterSupportFormData } from '@/lib/validators/registerSupport.schema';

interface Step8Props {
  form: UseFormReturn<RegisterSupportFormData>;
}

export default function Step8({ form }: Step8Props) {
  const { register, control } = form;

  const { fields: internalFields, append: appendInternal, remove: removeInternal } = useFieldArray({
    control,
    name: 'regsup_activitiesWithinProvinceInternal',
  });

  const { fields: externalFields, append: appendExternal, remove: removeExternal } = useFieldArray({
    control,
    name: 'regsup_activitiesWithinProvinceExternal',
  });

  const { fields: outsideFields, append: appendOutside, remove: removeOutside } = useFieldArray({
    control,
    name: 'regsup_activitiesOutsideProvince',
  });

  return (
    <div className="space-y-6">
      {/* ภายในจังหวัด */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ภายในจังหวัด</h3>
          
        </div>
        <div className="p-6 space-y-6">
          {/* ภายในสถานศึกษา */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">ภายในสถานศึกษา</h4>
            
            {internalFields.length === 0 && (
              <div className="border border-neutral-border rounded-lg p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    ชื่อกิจกรรม
                  </label>
                  <input
                    {...register(`regsup_activitiesWithinProvinceInternal.0.activityName`)}
                    type="text"
                    placeholder="ชื่อกิจกรรม"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    วันที่
                  </label>
                  <input
                    {...register(`regsup_activitiesWithinProvinceInternal.0.activityDate`)}
                    type="text"
                    placeholder="เช่น 15/05/2568"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                  </label>
                  <input
                    {...register(`regsup_activitiesWithinProvinceInternal.0.evidenceLink`)}
                    type="url"
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"</p>
              </div>
            )}

            {internalFields.map((field, index) => (
              <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium text-gray-900 text-sm">กิจกรรมที่ {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => removeInternal(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    ลบ
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    ชื่อกิจกรรม
                  </label>
                  <input
                    {...register(`regsup_activitiesWithinProvinceInternal.${index}.activityName`)}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    วันที่
                  </label>
                  <input
                    {...register(`regsup_activitiesWithinProvinceInternal.${index}.activityDate`)}
                    type="text"
                    placeholder="เช่น 15/05/2568"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                  </label>
                  <input
                    {...register(`regsup_activitiesWithinProvinceInternal.${index}.evidenceLink`)}
                    type="url"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"</p>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendInternal({ activityName: '', activityDate: '', evidenceLink: '' })}
              className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
            >
              + เพิ่มข้อมูล
            </button>
          </div>

          {/* ภายนอกสถานศึกษา */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">ภายนอกสถานศึกษา</h4>
            
            {externalFields.length === 0 && (
              <div className="border border-neutral-border rounded-lg p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    ชื่อกิจกรรม
                  </label>
                  <input
                    {...register(`regsup_activitiesWithinProvinceExternal.0.activityName`)}
                    type="text"
                    placeholder="ชื่อกิจกรรม"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    วันที่
                  </label>
                  <input
                    {...register(`regsup_activitiesWithinProvinceExternal.0.activityDate`)}
                    type="text"
                    placeholder="เช่น 15/05/2568"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                  </label>
                  <input
                    {...register(`regsup_activitiesWithinProvinceExternal.0.evidenceLink`)}
                    type="url"
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"</p>
              </div>
            )}

            {externalFields.map((field, index) => (
              <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium text-gray-900 text-sm">กิจกรรมที่ {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => removeExternal(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    ลบ
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    ชื่อกิจกรรม
                  </label>
                  <input
                    {...register(`regsup_activitiesWithinProvinceExternal.${index}.activityName`)}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    วันที่
                  </label>
                  <input
                    {...register(`regsup_activitiesWithinProvinceExternal.${index}.activityDate`)}
                    type="text"
                    placeholder="เช่น 15/05/2568"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                  </label>
                  <input
                    {...register(`regsup_activitiesWithinProvinceExternal.${index}.evidenceLink`)}
                    type="url"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"</p>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendExternal({ activityName: '', activityDate: '', evidenceLink: '' })}
              className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
            >
              + เพิ่มข้อมูล
            </button>
          </div>
        </div>
      </div>

      {/* ภายนอกจังหวัด */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ภายนอกจังหวัด</h3>
         
        </div>
        <div className="p-6 space-y-4">
          {outsideFields.length === 0 && (
            <div className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ชื่อกิจกรรม
                </label>
                <input
                  {...register(`regsup_activitiesOutsideProvince.0.activityName`)}
                  type="text"
                  placeholder="ชื่อกิจกรรม"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  วันที่
                </label>
                <input
                  {...register(`regsup_activitiesOutsideProvince.0.activityDate`)}
                  type="text"
                  placeholder="เช่น 15/05/2568"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                </label>
                <input
                  {...register(`regsup_activitiesOutsideProvince.0.evidenceLink`)}
                  type="url"
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"</p>
            </div>
          )}

          {outsideFields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 text-sm">กิจกรรมที่ {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeOutside(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  ลบ
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ชื่อกิจกรรม
                </label>
                <input
                  {...register(`regsup_activitiesOutsideProvince.${index}.activityName`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  วันที่
                </label>
                <input
                  {...register(`regsup_activitiesOutsideProvince.${index}.activityDate`)}
                  type="text"
                  placeholder="เช่น 15/05/2568"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)
                </label>
                <input
                  {...register(`regsup_activitiesOutsideProvince.${index}.evidenceLink`)}
                  type="url"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"</p>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendOutside({ activityName: '', activityDate: '', evidenceLink: '' })}
            className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}
