'use client';

import { useEffect, useRef } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { RegisterSupportFormData } from '@/lib/validators/registerSupport.schema';

interface Step8Props {
  form: UseFormReturn<RegisterSupportFormData>;
}

export default function Step8({ form }: Step8Props) {
  const { register, control, formState: { errors }, setValue, watch } = form;
  const thailandInitialized = useRef(false);

  const { fields: prFields, append: appendPR, remove: removePR } = useFieldArray({
    control,
    name: 'prActivities',
  });

  // Watch input fields to auto-check checkboxes
  const heardFromSchoolName = watch('heardFromSchoolName');
  const heardFromSchoolDistrict = watch('heardFromSchoolDistrict');
  const heardFromSchoolProvince = watch('heardFromSchoolProvince');
  const heardFromCulturalOfficeName = watch('heardFromCulturalOfficeName');
  const heardFromEducationAreaName = watch('heardFromEducationAreaName');
  const heardFromEducationAreaProvince = watch('heardFromEducationAreaProvince');
  const heardFromOtherDetail = watch('heardFromOtherDetail');
  
  // Watch checkboxes
  const heardFromSchool = watch('heardFromSchool');
  const heardFromCulturalOffice = watch('heardFromCulturalOffice');
  const heardFromEducationArea = watch('heardFromEducationArea');
  const heardFromOther = watch('heardFromOther');

  // Check if fields are empty when checkbox is checked
  const isSchoolFieldsEmpty = heardFromSchool && 
    (!heardFromSchoolName || heardFromSchoolName.trim() === '') &&
    (!heardFromSchoolDistrict || heardFromSchoolDistrict.trim() === '') &&
    (!heardFromSchoolProvince || heardFromSchoolProvince.trim() === '');
    
  const isCulturalOfficeFieldEmpty = heardFromCulturalOffice && 
    (!heardFromCulturalOfficeName || heardFromCulturalOfficeName.trim() === '');
    
  const isEducationAreaFieldsEmpty = heardFromEducationArea && 
    (!heardFromEducationAreaName || heardFromEducationAreaName.trim() === '') &&
    (!heardFromEducationAreaProvince || heardFromEducationAreaProvince.trim() === '');
    
  const isOtherFieldEmpty = heardFromOther && 
    (!heardFromOtherDetail || heardFromOtherDetail.trim() === '');

  // Auto-check "โรงเรียน" checkbox when user fills ANY of the school fields
  useEffect(() => {
    if (
      (heardFromSchoolName && heardFromSchoolName.trim() !== '') ||
      (heardFromSchoolDistrict && heardFromSchoolDistrict.trim() !== '') ||
      (heardFromSchoolProvince && heardFromSchoolProvince.trim() !== '')
    ) {
      setValue('heardFromSchool', true, { shouldValidate: true });
    }
  }, [heardFromSchoolName, heardFromSchoolDistrict, heardFromSchoolProvince, setValue]);

  // Auto-check "สำนักงานวัฒนธรรมจังหวัด" checkbox
  useEffect(() => {
    if (heardFromCulturalOfficeName && heardFromCulturalOfficeName.trim() !== '') {
      setValue('heardFromCulturalOffice', true, { shouldValidate: true });
    }
  }, [heardFromCulturalOfficeName, setValue]);

  // Auto-check "สำนักงานเขตพื้นที่การศึกษา" checkbox when user fills ANY of the education area fields
  useEffect(() => {
    if (
      (heardFromEducationAreaName && heardFromEducationAreaName.trim() !== '') ||
      (heardFromEducationAreaProvince && heardFromEducationAreaProvince.trim() !== '')
    ) {
      setValue('heardFromEducationArea', true, { shouldValidate: true });
    }
  }, [heardFromEducationAreaName, heardFromEducationAreaProvince, setValue]);

  // Auto-check "อื่น ๆ" checkbox
  useEffect(() => {
    if (heardFromOtherDetail && heardFromOtherDetail.trim() !== '') {
      setValue('heardFromOther', true, { shouldValidate: true });
    }
  }, [heardFromOtherDetail, setValue]);

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

  // Initialize jquery.Thailand.js for Step8 autocomplete
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
            database: 'https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/database/db.json',
            $amphoe: $(amphoeEl),
            $province: $(provinceEl),
            onDataFill: function (data: any) {
              setValue('heardFromSchoolDistrict', data.amphoe, {
                shouldValidate: true,
                shouldDirty: true,
              });
              setValue('heardFromSchoolProvince', data.province, {
                shouldValidate: true,
                shouldDirty: true,
              });
            },
          });

          thailandInitialized.current = true;
        } catch (error) {
          console.error('Error initializing jquery.Thailand.js for Step8:', error);
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
          <p className="text-sm text-gray-600 mt-1">ถ้ามีการกรอกข้อมูล 3 ครั้งต่อปี จะได้ 5 คะแนน</p>
        </div>
        <div className="p-6 space-y-4">
          {prFields.length === 0 && (
            <div className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ชื่อกิจกรรม/งาน
                </label>
                <input
                  {...register(`prActivities.0.activityName`)}
                  type="text"
                  placeholder="ชื่อกิจกรรม/งาน"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  แหล่งเผยแพร่/ประชาสัมพันธ์ในสื่อสังคมออนไลน์
                </label>
                <input
                  {...register(`prActivities.0.platform`)}
                  type="text"
                  placeholder="เช่น Facebook, YouTube, TikTok"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  วันที่เผยแพร่
                </label>
                <input
                  {...register(`prActivities.0.publishDate`)}
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
                  {...register(`prActivities.0.evidenceLink`)}
                  type="url"
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          )}

          {prFields.map((field, index) => (
            <div key={field.id} className="border border-neutral-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 text-sm">กิจกรรมที่ {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removePR(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ลบ
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ชื่อกิจกรรม/งาน
                </label>
                <input
                  {...register(`prActivities.${index}.activityName`)}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  แหล่งเผยแพร่/ประชาสัมพันธ์ในสื่อสังคมออนไลน์
                </label>
                <input
                  {...register(`prActivities.${index}.platform`)}
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
                  {...register(`prActivities.${index}.publishDate`)}
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
                  {...register(`prActivities.${index}.evidenceLink`)}
                  type="url"
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
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
          <h3 className="font-semibold text-gray-900">ได้รับข้อมูลการสมัครโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์จาก</h3>
        </div>
        <div className="p-6 space-y-4">
          {/* โรงเรียน */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('heardFromSchool')}
                type="checkbox"
                className="w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <span className="text-sm font-medium text-gray-900">โรงเรียน</span>
            </label>

            <div className="ml-6 space-y-2">
              <input
                {...register('heardFromSchoolName')}
                type="text"
                placeholder="ชื่อโรงเรียน"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                id="step8-amphoe"
                type="text"
                name="heardFromSchoolDistrict"
                ref={register('heardFromSchoolDistrict').ref}
                onChange={register('heardFromSchoolDistrict').onChange}
                onBlur={register('heardFromSchoolDistrict').onBlur}
                placeholder="อำเภอ"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                id="step8-province"
                type="text"
                name="heardFromSchoolProvince"
                ref={register('heardFromSchoolProvince').ref}
                onChange={register('heardFromSchoolProvince').onChange}
                onBlur={register('heardFromSchoolProvince').onBlur}
                placeholder="จังหวัด"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {isSchoolFieldsEmpty && (
                <p className="text-red-500 text-sm">กรุณากรอกข้อมูลให้ครบถ้วน</p>
              )}
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
                  {...register('DCP_PR_Channel_FACEBOOK')}
                  type="checkbox"
                  className="w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
                />
                <span className="text-sm text-gray-900">เฟซบุ๊ก (Facebook)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('DCP_PR_Channel_YOUTUBE')}
                  type="checkbox"
                  className="w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
                />
                <span className="text-sm text-gray-900">ยูทูบ (YouTube)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('DCP_PR_Channel_Tiktok')}
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
                {...register('heardFromCulturalOffice')}
                type="checkbox"
                className="w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <span className="text-sm font-medium text-gray-900">สำนักงานวัฒนธรรมจังหวัด</span>
            </label>

            <div className="ml-6">
              <input
                {...register('heardFromCulturalOfficeName')}
                type="text"
                placeholder="ระบุสำนักงานวัฒนธรรมจังหวัด"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {isCulturalOfficeFieldEmpty && (
                <p className="text-red-500 text-sm mt-1">กรุณากรอกข้อมูลให้ครบถ้วน</p>
              )}
            </div>
          </div>

          {/* สำนักงานเขตพื้นที่การศึกษา */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('heardFromEducationArea')}
                type="checkbox"
                className="w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <span className="text-sm font-medium text-gray-900">สำนักงานเขตพื้นที่การศึกษา</span>
            </label>

            <div className="ml-6 space-y-2">
              <input
                {...register('heardFromEducationAreaName')}
                type="text"
                placeholder="ระบุสำนักงานเขตพื้นที่การศึกษา"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div>
                <label className="block text-sm text-gray-900 mb-1">จังหวัด</label>
                <select
                  {...register('heardFromEducationAreaProvince')}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">เลือกจังหวัด</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
              {isEducationAreaFieldsEmpty && (
                <p className="text-red-500 text-sm">กรุณากรอกข้อมูลให้ครบถ้วน</p>
              )}
            </div>
          </div>

          {/* อื่นๆ */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('heardFromOther')}
                type="checkbox"
                className="w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
              />
              <span className="text-sm font-medium text-gray-900">อื่น ๆ ระบุ</span>
            </label>

            <div className="ml-6">
              <input
                {...register('heardFromOtherDetail')}
                type="text"
                placeholder="ระบุ"
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {isOtherFieldEmpty && (
                <p className="text-red-500 text-sm mt-1">กรุณากรอกข้อมูลให้ครบถ้วน</p>
              )}
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
              {...register('obstacles')}
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
              {...register('suggestions')}
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
              {...register('certifiedINFOByAdminName')}
              type="checkbox"
              className="mt-1 w-4 h-4 text-[#00B050] border-gray-300 rounded focus:ring-[#00B050]"
            />
            <div>
              <span className="text-sm text-gray-900">
                ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในแบบฟอร์มนี้เป็นความจริงทุกประการ <span className="text-red-500">*</span>
              </span>
              {errors.certifiedINFOByAdminName && (
                <p className="text-red-500 text-sm mt-1">{errors.certifiedINFOByAdminName.message}</p>
              )}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
