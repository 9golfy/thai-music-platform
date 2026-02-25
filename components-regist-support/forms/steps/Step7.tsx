'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { RegisterSupportFormData } from '@/lib/validators/registerSupport.schema';

interface Step7Props {
  form: UseFormReturn<RegisterSupportFormData>;
}

export default function Step7({ form }: Step7Props) {
  const { register, control } = form;

  const { fields: internalFields, append: appendInternal, remove: removeInternal } = useFieldArray({
    control,
    name: 'activitiesWithinProvinceInternal',
  });

  const { fields: externalFields, append: appendExternal, remove: removeExternal } = useFieldArray({
    control,
    name: 'activitiesWithinProvinceExternal',
  });

  const { fields: outsideFields, append: appendOutside, remove: removeOutside } = useFieldArray({
    control,
    name: 'activitiesOutsideProvince',
  });

  return (
    <div className="space-y-6">
      {/* ภายในจังหวัด */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ภายในจังหวัด</h3>
          <p className="text-sm text-gray-600 mt-1">ถ้ามีการกรอกข้อมูล 3 ครั้งต่อปี จะได้ 5 คะแนน</p>
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
                    {...register(`activitiesWithinProvinceInternal.0.activityName`)}
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
                    {...register(`activitiesWithinProvinceInternal.0.activityDate`)}
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
                    {...register(`activitiesWithinProvinceInternal.0.evidenceLink`)}
                    type="url"
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            )}

            {internalFields.map((field, index) => (
              <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium text-gray-900 text-sm">กิจกรรมที่ {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => removeInternal(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    ลบ
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    ชื่อกิจกรรม
                  </label>
                  <input
                    {...register(`activitiesWithinProvinceInternal.${index}.activityName`)}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    วันที่
                  </label>
                  <input
                    {...register(`activitiesWithinProvinceInternal.${index}.activityDate`)}
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
                    {...register(`activitiesWithinProvinceInternal.${index}.evidenceLink`)}
                    type="url"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
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
                    {...register(`activitiesWithinProvinceExternal.0.activityName`)}
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
                    {...register(`activitiesWithinProvinceExternal.0.activityDate`)}
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
                    {...register(`activitiesWithinProvinceExternal.0.evidenceLink`)}
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
                  <h5 className="font-medium text-gray-900 text-sm">กิจกรรมที่ {index + 1}</h5>
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
                    ชื่อกิจกรรม
                  </label>
                  <input
                    {...register(`activitiesWithinProvinceExternal.${index}.activityName`)}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    วันที่
                  </label>
                  <input
                    {...register(`activitiesWithinProvinceExternal.${index}.activityDate`)}
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
                    {...register(`activitiesWithinProvinceExternal.${index}.evidenceLink`)}
                    type="url"
                    className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
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
          <h3 className="font-semibold text-gray-900">ภายนอกจังหวัด - ภายนอกสถานศึกษา</h3>
          <p className="text-sm text-gray-600 mt-1">ถ้ามีการกรอกข้อมูล 3 ครั้งต่อปี จะได้ 5 คะแนน</p>
        </div>
        <div className="p-6 space-y-4">
          {outsideFields.length === 0 && (
            <div className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ชื่อกิจกรรม
                </label>
                <input
                  {...register(`activitiesOutsideProvince.0.activityName`)}
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
                  {...register(`activitiesOutsideProvince.0.activityDate`)}
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
                  {...register(`activitiesOutsideProvince.0.evidenceLink`)}
                  type="url"
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          )}

          {outsideFields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 text-sm">กิจกรรมที่ {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeOutside(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ลบ
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ชื่อกิจกรรม
                </label>
                <input
                  {...register(`activitiesOutsideProvince.${index}.activityName`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  วันที่
                </label>
                <input
                  {...register(`activitiesOutsideProvince.${index}.activityDate`)}
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
                  {...register(`activitiesOutsideProvince.${index}.evidenceLink`)}
                  type="url"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
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
