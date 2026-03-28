'use client';

import { useEffect, useRef } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Register100FormData } from '@/lib/validators/register100.schema';
import { devLog } from '@/lib/utils/devLogger';

interface Step9Props {
  form: UseFormReturn<Register100FormData>;
}

export default function Step9({ form }: Step9Props) {
  const { register, control, formState: { errors }, setValue } = form;
  const thailandInitialized = useRef(false);

  const { fields: prFields, append: appendPR, remove: removePR } = useFieldArray({
    control,
    name: 'reg100_prActivities',
  });

  const isInitializedPR = useRef(false);

  // Initialize with first item for PR activities
  useEffect(() => {
    if (!isInitializedPR.current) {
      if (prFields.length === 0) {
        appendPR({ activityName: '', platform: '', publishDate: '', evidenceLink: '' });
      }
      isInitializedPR.current = true;
    }
  }, []);

  // 77 provinces in Thailand
  const provinces = [
    'กระบี่', 'กรุงเทพมหานคร', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น', 'จันทบุรี', 'ฉะเชิงเทรา',
    'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง', 'ตราด', 'ตาก', 'นครนายก',
    'นครปฐม', 'นครพนม', 'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 'น่าน',
    'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์', 'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา',
    'พะเยา', 'พังงา', 'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่', 'ภูเก็ต',
    'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 'ราชบุรี',
    'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ',
    'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี', 'สุราษฎร์ธานี',
    'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อ่างทอง', 'อุดรธานี', 'อุทัยธานี', 'อุตรดิตถ์', 'อุบลราชธานี', 'อำนาจเจริญ'
  ];

  // Initialize jquery.Thailand.js for Step9 autocomplete
  useEffect(() => {
    if (thailandInitialized.current) return;

    const initThailand = () => {
      if (
        typeof window !== 'undefined' &&
        typeof (window as any).jQuery !== 'undefined' &&
        typeof (window as any).jQuery.Thailand === 'function'
      ) {
        const $ = (window as any).jQuery;
        
        const amphoeEl = document.getElementById('step8-amphoe');
        const provinceEl = document.getElementById('step8-province');
        
        if (!amphoeEl || !provinceEl) {
          return;
        }
        
        try {
          $.Thailand({
            database: '/data/thailand-db.json',
            $amphoe: $(amphoeEl),
            $province: $(provinceEl),
            onDataFill: function (data: any) {
              setValue('reg100_heardFromSchoolDistrict', data.amphoe, {
                shouldValidate: true,
                shouldDirty: true,
              });
              setValue('reg100_heardFromSchoolProvince', data.province, {
                shouldValidate: true,
                shouldDirty: true,
              });
              
              setTimeout(() => {
                const escapeEvent = new KeyboardEvent('keydown', {
                  key: 'Escape',
                  code: 'Escape',
                  keyCode: 27,
                  which: 27,
                  bubbles: true,
                  cancelable: true
                });
                document.dispatchEvent(escapeEvent);
              }, 100);
            },
          });

          thailandInitialized.current = true;
        } catch (error) {
          devLog.error('Error initializing jquery.Thailand.js for Step9:', error);
        }
      }
    };

    let attempts = 0;
    const maxAttempts = 50;

    const interval = setInterval(() => {
      attempts++;
      
      if (thailandInitialized.current) {
        clearInterval(interval);
        return;
      }

      initThailand();

      if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [setValue]);

  return (
    <div className="space-y-6">
      {/* การประชาสัมพันธ์ */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">การประชาสัมพันธ์ผลงานของสถานศึกษา</h3>
          
        </div>
        <div className="p-6 space-y-4">
          {prFields.map((field, index) => (
            <div key={field.id} className={index === 0 ? "space-y-3" : "border border-neutral-border rounded-lg p-4 space-y-3"}>
              {index > 0 && (
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900 text-sm">กิจกรรมที่ {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removePR(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    ลบ
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ชื่อกิจกรรม/งาน
                </label>
                <input
                  {...register(`reg100_prActivities.${index}.activityName`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  แหล่งเผยแพร่/ประชาสัมพันธ์ในสื่อสังคมออนไลน์
                </label>
                <input
                  {...register(`reg100_prActivities.${index}.platform`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="เช่น Facebook, YouTube, TikTok"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  วันที่เผยแพร่
                </label>
                <input
                  {...register(`reg100_prActivities.${index}.publishDate`)}
                  type="text"
                  placeholder="เช่น 15/05/2568"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  หลักฐานการเผยแพร่ (Link/URL)
                </label>
                <input
                  {...register(`reg100_prActivities.${index}.evidenceLink`)}
                  type="url"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"</p>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendPR({ activityName: '', platform: '', publishDate: '', evidenceLink: '' })}
            className="w-full py-2 px-4 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-green-50 cursor-pointer font-medium transition-colors"
          >
            + เพิ่มข้อมูล
          </button>
        </div>
      </div>

      {/* แหล่งที่มาของข้อมูล */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ได้รับข้อมูลการสมัครโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์จาก</h3>
        </div>
        <div className="p-6 space-y-4">
          {/* โรงเรียน */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('reg100_heardFromSchool')}
                type="checkbox"
                className="w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <span className="text-sm font-medium text-gray-900">โรงเรียน</span>
            </label>

            <div className="ml-6 space-y-2">
              <input
                {...register('reg100_heardFromSchoolName')}
                type="text"
                placeholder="ชื่อโรงเรียน"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                id="step8-amphoe"
                type="text"
                name="reg100_heardFromSchoolDistrict"
                ref={register('reg100_heardFromSchoolDistrict').ref}
                onChange={register('reg100_heardFromSchoolDistrict').onChange}
                onBlur={register('reg100_heardFromSchoolDistrict').onBlur}
                placeholder="อำเภอ"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                id="step8-province"
                type="text"
                name="reg100_heardFromSchoolProvince"
                ref={register('reg100_heardFromSchoolProvince').ref}
                onChange={register('reg100_heardFromSchoolProvince').onChange}
                onBlur={register('reg100_heardFromSchoolProvince').onBlur}
                placeholder="จังหวัด"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* ช่องทางประชาสัมพันธ์ของกรมส่งเสริมวัฒนธรรม */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              ช่องทางการประชาสัมพันธ์ของกรมส่งเสริมวัฒนธรรม
            </p>
            <div className="ml-6 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('reg100_DCP_PR_Channel_FACEBOOK')}
                  type="checkbox"
                  className="w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
                />
                <span className="text-sm text-gray-900">เฟซบุ๊ก (Facebook)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('reg100_DCP_PR_Channel_YOUTUBE')}
                  type="checkbox"
                  className="w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
                />
                <span className="text-sm text-gray-900">ยูทูบ (YouTube)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('reg100_DCP_PR_Channel_Tiktok')}
                  type="checkbox"
                  className="w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
                />
                <span className="text-sm text-gray-900">ติ๊กต๊อก (TikTok)</span>
              </label>
            </div>
          </div>

          {/* สำนักงานวัฒนธรรมจังหวัด */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('reg100_heardFromCulturalOffice')}
                type="checkbox"
                className="w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <span className="text-sm font-medium text-gray-900">สำนักงานวัฒนธรรมจังหวัด</span>
            </label>

            <div className="ml-6">
              <input
                {...register('reg100_heardFromCulturalOfficeName')}
                type="text"
                placeholder="ระบุสำนักงานวัฒนธรรมจังหวัด"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* สำนักงานเขตพื้นที่การศึกษา */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('reg100_heardFromEducationArea')}
                type="checkbox"
                className="w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <span className="text-sm font-medium text-gray-900">สำนักงานเขตพื้นที่การศึกษา</span>
            </label>

            <div className="ml-6">
              <input
                {...register('reg100_heardFromEducationAreaName')}
                type="text"
                placeholder="ระบุสำนักงานเขตพื้นที่การศึกษา"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* อื่นๆ */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('reg100_heardFromOther')}
                type="checkbox"
                className="w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <span className="text-sm font-medium text-gray-900">อื่น ๆ ระบุ</span>
            </label>

            <div className="ml-6">
              <input
                {...register('reg100_heardFromOtherDetail')}
                type="text"
                placeholder="ระบุ"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ข้อมูลด้านอื่นๆ */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">ข้อมูลด้านอื่นๆ</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              ปัญหาและอุปสรรคที่มีผลกระทบต่อการเรียนการสอนดนตรีไทย
            </label>
            <textarea
              {...register('reg100_obstacles')}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="กรอกรายละเอียด"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              ข้อเสนอแนะในการส่งเสริมดนตรีไทยในสถานศึกษา
            </label>
            <textarea
              {...register('reg100_suggestions')}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="กรอกรายละเอียด"
            />
          </div>
        </div>
      </div>

      {/* การรับรองข้อมูล */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">การรับรองข้อมูล</h3>
        </div>
        <div className="p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register('reg100_certifiedByAdmin')}
              type="checkbox"
              className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
            />
            <div>
              <span className="text-sm text-gray-900">
                ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในแบบฟอร์มนี้เป็นความจริงทุกประการ <span className="text-red-500">*</span>
              </span>
              {errors.reg100_certifiedByAdmin && (
                <p className="text-red-500 text-sm mt-1">{errors.reg100_certifiedByAdmin.message}</p>
              )}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
