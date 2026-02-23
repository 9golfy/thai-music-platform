'use client';

import { UseFormReturn } from 'react-hook-form';
import { Register69FormData } from '@/lib/validators/register69.schema';
import { useState, useEffect, useRef } from 'react';

interface Step7Props {
  form: UseFormReturn<Register69FormData>;
  onNavigateToStep: (step: number) => void;
}

export default function Step7({ form, onNavigateToStep }: Step7Props) {
  const { register, setValue, formState: { errors }, watch } = form;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const formData = watch();
  const thailandInitialized = useRef(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 1024 * 1024; // 1MB
      return isValidType && isValidSize;
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Initialize jquery.Thailand.js for address autocomplete
  useEffect(() => {
    if (thailandInitialized.current) return;

    const initThailand = () => {
      if (
        typeof window !== 'undefined' &&
        typeof (window as any).jQuery !== 'undefined' &&
        typeof (window as any).jQuery.Thailand === 'function'
      ) {
        const $ = (window as any).jQuery;
        
        const districtEl = document.getElementById('step7-district');
        const provinceEl = document.getElementById('step7-province');
        
        if (!districtEl || !provinceEl) {
          return;
        }
        
        try {
          $.Thailand({
            database: 'https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/database/db.json',
            $amphoe: $(districtEl),
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
            onLoad: function() {
              console.log('✅ jquery.Thailand.js loaded for Step7');
            }
          });

          thailandInitialized.current = true;
          console.log('✅ jquery.Thailand.js initialized for Step7');
        } catch (error) {
          console.error('❌ Error initializing jquery.Thailand.js:', error);
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
      {/* การประชาสัมพันธ์ผลงานของสถานศึกษา */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">การประชาสัมพันธ์ผลงานของสถานศึกษา</h3>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            การประชาสัมพันธ์ผลงานของสถานศึกษา โดยใช้การแสดงผลงานในสื่อออนไลน์ เช่น เฟซบุ๊ก (Facebook), ยูทูบ (YouTube), ติ๊กต็อก (TikTok) (ระบุลิงก์ให้ชัดเจน)
          </label>
      
          <input
            {...register('publicityLinks')}
            type="text"
            className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="ระบุลิงก์การประชาสัมพันธ์ "
          />
        </div>
      </div>

      {/* แหล่งที่มาของข้อมูล */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-neutral-border">
          <h3 className="font-semibold text-gray-900">แหล่งที่มาของข้อมูล</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              ทราบข้อมูลจากโรงเรียน
            </label>
            <input
              {...register('heardFromSchoolName')}
              type="text"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="ชื่อโรงเรียน"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                อำเภอ
              </label>
              <input
                id="step7-district"
                type="text"
                name="heardFromSchoolDistrict"
                ref={register('heardFromSchoolDistrict').ref}
                onChange={register('heardFromSchoolDistrict').onChange}
                onBlur={register('heardFromSchoolDistrict').onBlur}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="กรอกอำเภอ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                จังหวัด
              </label>
              <input
                id="step7-province"
                type="text"
                name="heardFromSchoolProvince"
                ref={register('heardFromSchoolProvince').ref}
                onChange={register('heardFromSchoolProvince').onChange}
                onBlur={register('heardFromSchoolProvince').onBlur}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="กรอกจังหวัด"
              />
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-sm text-gray-900 bg-[#f0f9f5] p-3 rounded-lg border border-[#c3e9d7]">
            💡 พิมพ์ อำเภอ/จังหวัด เพื่อให้ระบบแนะนำอัตโนมัติ
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ช่องทางการประชาสัมพันธ์
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  {...register('DCP_PR_Channel_FACEBOOK')}
                  type="checkbox"
                />
                <span className="text-sm text-gray-900">Facebook</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  {...register('DCP_PR_Channel_YOUTUBE')}
                  type="checkbox"
                />
                <span className="text-sm text-gray-900">YouTube</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  {...register('DCP_PR_Channel_Tiktok')}
                  type="checkbox"
                />
                <span className="text-sm text-gray-900">TikTok</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  {...register('heardFromOther')}
                  type="checkbox"
                />
                <span className="text-sm text-gray-900">อื่นๆ</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              สำนักงานวัฒนธรรมจังหวัด
            </label>
            <input
              {...register('heardFromCulturalOffice')}
              type="text"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="ระบุสำนักงานวัฒนธรรมจังหวัด"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              สำนักงานเขตพื้นที่การศึกษา
            </label>
            <input
              {...register('heardFromEducationArea')}
              type="text"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 mb-2"
              placeholder="ระบุสำนักงานเขตพื้นที่การศึกษา"
            />
            <label className="block text-sm font-medium text-gray-900 mb-1">
              จังหวัด
            </label>
            <select
              {...register('heardFromEducationAreaProvince')}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">เลือกจังหวัด</option>
              <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
              <option value="กระบี่">กระบี่</option>
              <option value="กาญจนบุรี">กาญจนบุรี</option>
              <option value="กาฬสินธุ์">กาฬสินธุ์</option>
              <option value="กำแพงเพชร">กำแพงเพชร</option>
              <option value="ขอนแก่น">ขอนแก่น</option>
              <option value="จันทบุรี">จันทบุรี</option>
              <option value="ฉะเชิงเทรา">ฉะเชิงเทรา</option>
              <option value="ชลบุรี">ชลบุรี</option>
              <option value="ชัยนาท">ชัยนาท</option>
              <option value="ชัยภูมิ">ชัยภูมิ</option>
              <option value="ชุมพร">ชุมพร</option>
              <option value="เชียงราย">เชียงราย</option>
              <option value="เชียงใหม่">เชียงใหม่</option>
              <option value="ตรัง">ตรัง</option>
              <option value="ตราด">ตราด</option>
              <option value="ตาก">ตาก</option>
              <option value="นครนายก">นครนายก</option>
              <option value="นครปฐม">นครปฐม</option>
              <option value="นครพนม">นครพนม</option>
              <option value="นครราชสีมา">นครราชสีมา</option>
              <option value="นครศรีธรรมราช">นครศรีธรรมราช</option>
              <option value="นครสวรรค์">นครสวรรค์</option>
              <option value="นนทบุรี">นนทบุรี</option>
              <option value="นราธิวาส">นราธิวาส</option>
              <option value="น่าน">น่าน</option>
              <option value="บึงกาฬ">บึงกาฬ</option>
              <option value="บุรีรัมย์">บุรีรัมย์</option>
              <option value="ปทุมธานี">ปทุมธานี</option>
              <option value="ประจวบคีรีขันธ์">ประจวบคีรีขันธ์</option>
              <option value="ปราจีนบุรี">ปราจีนบุรี</option>
              <option value="ปัตตานี">ปัตตานี</option>
              <option value="พระนครศรีอยุธยา">พระนครศรีอยุธยา</option>
              <option value="พังงา">พังงา</option>
              <option value="พัทลุง">พัทลุง</option>
              <option value="พิจิตร">พิจิตร</option>
              <option value="พิษณุโลก">พิษณุโลก</option>
              <option value="เพชรบุรี">เพชรบุรี</option>
              <option value="เพชรบูรณ์">เพชรบูรณ์</option>
              <option value="แพร่">แพร่</option>
              <option value="พะเยา">พะเยา</option>
              <option value="ภูเก็ต">ภูเก็ต</option>
              <option value="มหาสารคาม">มหาสารคาม</option>
              <option value="มุกดาหาร">มุกดาหาร</option>
              <option value="แม่ฮ่องสอน">แม่ฮ่องสอน</option>
              <option value="ยโสธร">ยโสธร</option>
              <option value="ยะลา">ยะลา</option>
              <option value="ร้อยเอ็ด">ร้อยเอ็ด</option>
              <option value="ระนอง">ระนอง</option>
              <option value="ระยอง">ระยอง</option>
              <option value="ราชบุรี">ราชบุรี</option>
              <option value="ลพบุรี">ลพบุรี</option>
              <option value="ลำปาง">ลำปาง</option>
              <option value="ลำพูน">ลำพูน</option>
              <option value="เลย">เลย</option>
              <option value="ศรีสะเกษ">ศรีสะเกษ</option>
              <option value="สกลนคร">สกลนคร</option>
              <option value="สงขลา">สงขลา</option>
              <option value="สตูล">สตูล</option>
              <option value="สมุทรปราการ">สมุทรปราการ</option>
              <option value="สมุทรสงคราม">สมุทรสงคราม</option>
              <option value="สมุทรสาคร">สมุทรสาคร</option>
              <option value="สระแก้ว">สระแก้ว</option>
              <option value="สระบุรี">สระบุรี</option>
              <option value="สิงห์บุรี">สิงห์บุรี</option>
              <option value="สุโขทัย">สุโขทัย</option>
              <option value="สุพรรณบุรี">สุพรรณบุรี</option>
              <option value="สุราษฎร์ธานี">สุราษฎร์ธานี</option>
              <option value="สุรินทร์">สุรินทร์</option>
              <option value="หนองคาย">หนองคาย</option>
              <option value="หนองบัวลำภู">หนองบัวลำภู</option>
              <option value="อ่างทอง">อ่างทอง</option>
              <option value="อำนาจเจริญ">อำนาจเจริญ</option>
              <option value="อุดรธานี">อุดรธานี</option>
              <option value="อุตรดิตถ์">อุตรดิตถ์</option>
              <option value="อุทัยธานี">อุทัยธานี</option>
              <option value="อุบลราชธานี">อุบลราชธานี</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              ระบุช่องทางอื่นๆ
            </label>
            <input
              {...register('heardFromOtherDetail')}
              type="text"
              className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="ระบุช่องทางอื่นๆ"
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
          <label className="flex items-start gap-2">
            <input
              {...register('certifiedINFOByAdminName')}
              type="checkbox"
              className="mt-1"
              data-testid="certification-checkbox"
            />
            <span className="text-sm text-gray-900">
              ข้าพเจ้ารับรองว่าข้อมูลที่กรอกทั้งหมดเป็นความจริง <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.certifiedINFOByAdminName && (
            <p className="text-red-500 text-sm mt-1">{errors.certifiedINFOByAdminName.message}</p>
          )}
        </div>
      </div>

     
    </div>
  );
}
