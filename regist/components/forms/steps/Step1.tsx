'use client';

import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Register69FormData } from '@/lib/validators/register69.schema';
import { calculateSchoolSize, getSchoolSizeDisplayText } from '@/lib/utils/schoolSize';

interface Step1Props {
  form: UseFormReturn<Register69FormData>;
}

export default function Step1({ form }: Step1Props) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const thailandInitialized = useRef(false);
  const studentCount = watch('studentCount');
  const staffCount = watch('staffCount');
  const schoolSize = watch('schoolSize');

  // Display values with comma formatting
  const [staffCountDisplay, setStaffCountDisplay] = useState('');
  const [studentCountDisplay, setStudentCountDisplay] = useState('');

  // Format number with commas
  const formatNumberWithCommas = (value: string): string => {
    const numericValue = value.replace(/,/g, '');
    if (!numericValue || isNaN(Number(numericValue))) return value;
    return Number(numericValue).toLocaleString('en-US');
  };

  // Update display values when form values change
  useEffect(() => {
    if (staffCount !== undefined && staffCount !== null && String(staffCount) !== '') {
      setStaffCountDisplay(formatNumberWithCommas(String(staffCount)));
    } else {
      setStaffCountDisplay('');
    }
  }, [staffCount]);

  useEffect(() => {
    if (studentCount !== undefined && studentCount !== null && String(studentCount) !== '') {
      setStudentCountDisplay(formatNumberWithCommas(String(studentCount)));
    } else {
      setStudentCountDisplay('');
    }
  }, [studentCount]);

  // Auto-calculate school size based on student count
  useEffect(() => {
    if (studentCount !== undefined && studentCount !== null && !isNaN(Number(studentCount))) {
      const numericCount = Number(studentCount);
      if (numericCount > 0) {
        const calculatedSize = calculateSchoolSize(numericCount);
        if (calculatedSize) {
          setValue('schoolSize', calculatedSize, { shouldValidate: true });
        }
      } else {
        // Clear school size when student count is 0 or negative
        setValue('schoolSize', undefined, { shouldValidate: true });
      }
    } else {
      // Clear school size when student count is empty or invalid
      setValue('schoolSize', undefined, { shouldValidate: true });
    }
  }, [studentCount, setValue]);

  // Initialize jquery.Thailand.js
  useEffect(() => {
    if (thailandInitialized.current) return;

    const initThailand = () => {
      // Check if jQuery and $.Thailand are available
      if (
        typeof window !== 'undefined' &&
        typeof (window as any).jQuery !== 'undefined' &&
        typeof (window as any).jQuery.Thailand === 'function'
      ) {
        console.log('✅ Initializing jquery.Thailand.js...');
        
        const $ = (window as any).jQuery;
        
        // Debug: Check actual IDs in DOM
        const districtEl = document.getElementById('th-district');
        const amphoeEl = document.getElementById('th-amphoe');
        const provinceEl = document.getElementById('th-province');
        const zipcodeEl = document.getElementById('th-zipcode');
        
        console.log('🔍 Checking elements by ID:');
        console.log('  document.getElementById("th-district"):', districtEl);
        console.log('  document.getElementById("th-amphoe"):', amphoeEl);
        console.log('  document.getElementById("th-province"):', provinceEl);
        console.log('  document.getElementById("th-zipcode"):', zipcodeEl);
        
        console.log('🔍 Checking elements with jQuery:');
        console.log('  $("#th-district").length:', $('#th-district').length);
        console.log('  $("#th-amphoe").length:', $('#th-amphoe').length);
        console.log('  $("#th-province").length:', $('#th-province').length);
        console.log('  $("#th-zipcode").length:', $('#th-zipcode').length);
        
        // Only initialize if all elements are found
        if (!districtEl || !amphoeEl || !provinceEl || !zipcodeEl) {
          console.warn('⚠️ Not all elements found yet, will retry...');
          return;
        }
        
        try {
          console.log('🚀 Calling $.Thailand()...');
          const result = $.Thailand({
            database: 'https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/database/db.json',
            $district: $(districtEl),
            $amphoe: $(amphoeEl),
            $province: $(provinceEl),
            $zipcode: $(zipcodeEl),
            onDataFill: function (data: any) {
              console.log('📍 Address auto-filled:', data);
              setValue('subDistrict', data.district, {
                shouldValidate: true,
                shouldDirty: true,
              });
              setValue('district', data.amphoe, {
                shouldValidate: true,
                shouldDirty: true,
              });
              setValue('provinceAddress', data.province, {
                shouldValidate: true,
                shouldDirty: true,
              });
              setValue('postalCode', data.zipcode, {
                shouldValidate: true,
                shouldDirty: true,
              });
              
              // Auto-close autocomplete dropdown by pressing Escape
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
                console.log('✅ Autocomplete closed automatically');
              }, 100);
            },
            onLoad: function() {
              console.log('✅ jquery.Thailand.js database loaded and ready!');
            }
          });

          thailandInitialized.current = true;
          console.log('✅ jquery.Thailand.js initialized successfully', result);
        } catch (error) {
          console.error('❌ Error initializing jquery.Thailand.js:', error);
        }
      }
    };

    // Retry mechanism - check every 200ms for up to 10 seconds
    let attempts = 0;
    const maxAttempts = 50; // 50 * 200ms = 10 seconds

    const interval = setInterval(() => {
      attempts++;
      
      if (thailandInitialized.current) {
        clearInterval(interval);
        return;
      }

      initThailand();

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn('⚠️ jquery.Thailand.js could not be initialized after 10 seconds');
        console.warn('Check if scripts loaded:', {
          jQuery: typeof (window as any).jQuery,
          Thailand: typeof (window as any).jQuery?.Thailand
        });
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [setValue]);

  return (
    <div className="space-y-6">
      {/* ข้อมูลพื้นฐาน */}
      <section className="bg-white p-6 rounded-lg border border-neutral-border">
        <h2 className="text-xl font-semibold text-primary mb-4">
          ข้อมูลพื้นฐาน
        </h2>

        <div className="space-y-4">
          {/* ชื่อสถานศึกษา */}
          <div>
            <label className="block text-sm font-medium mb-2">
              ชื่อสถานศึกษา <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('schoolName')}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="กรอกชื่อสถานศึกษา"
            />
            {errors.schoolName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.schoolName.message as string}
              </p>
            )}
          </div>

          {/* จังหวัดสถานศึกษา */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              จังหวัด <span className="text-red-500">*</span>
            </label>
            <select
              {...register('schoolProvince')}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">กรุณาเลือกจังหวัดสถานศึกษา</option>
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
            {errors.schoolProvince && (
              <p className="text-red-500 text-sm mt-1">
                {errors.schoolProvince.message as string}
              </p>
            )}
          </div>

          {/* ระดับการศึกษา */}
          <div>
            <label className="block text-sm font-medium mb-2">
              ระดับสถานศึกษา <span className="text-red-500">*</span>
            </label>
            <select
              {...register('schoolLevel')}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">กรุณาเลือกระดับการศึกษา</option>
              <option value="ประถมศึกษา">ประถมศึกษา</option>
              <option value="มัธยมศึกษา">มัธยมศึกษา</option>
              <option value="ขยายโอกาส">ขยายโอกาส</option>
              <option value="เฉพาะทาง">เฉพาะทาง</option>
            </select>
            {errors.schoolLevel && (
              <p className="text-red-500 text-sm mt-1">
                {errors.schoolLevel.message as string}
              </p>
            )}
          </div>

          {/* สังกัด */}
          <div>
            <label className="block text-sm font-medium mb-2">
              สังกัด
            </label>
            <select
              {...register('affiliation')}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">กรุณาเลือกสังกัด</option>
              <option value="กระทรวงศึกษาธิการ (Ministry of Education)">กระทรวงศึกษาธิการ (Ministry of Education)</option>
              <option value="องค์กรปกครองส่วนท้องถิ่น (อปท.)">องค์กรปกครองส่วนท้องถิ่น (อปท.)</option>
              <option value="สังกัดกระทรวงอื่น ๆ">สังกัดกระทรวงอื่น ๆ</option>
              <option value="โรงเรียนสังกัดรัฐวิสาหกิจ">โรงเรียนสังกัดรัฐวิสาหกิจ</option>
              <option value="โรงเรียนสังกัดกรุงเทพมหานคร">โรงเรียนสังกัดกรุงเทพมหานคร</option>
              <option value="โรงเรียนสาธิต">โรงเรียนสาธิต</option>
              <option value="โรงเรียนในระบบพิเศษ">โรงเรียนในระบบพิเศษ</option>
              <option value="โรงเรียนเอกชนนานาชาติ">โรงเรียนเอกชนนานาชาติ</option>
            </select>
            {errors.affiliation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.affiliation.message as string}
              </p>
            )}
          </div>

          

        {/* จำนวนบุคลากร*/}
          <div>
            <label className="block text-sm font-medium mb-2">
              จำนวนครู/บุคลากร
            </label>
            <input
              type="text"
              value={staffCountDisplay}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                if (value === '' || /^\d+$/.test(value)) {
                  setValue('staffCount', value === '' ? undefined : Number(value), { shouldValidate: true });
                  setStaffCountDisplay(value === '' ? '' : formatNumberWithCommas(value));
                }
              }}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="จำนวนบุคลากร"
            />
          </div>
          

          {/* จำนวนนักเรียน */}
          <div>
            <label className="block text-sm font-medium mb-2">
              จำนวนนักเรียน
            </label>
            <input
              type="text"
              value={studentCountDisplay}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                if (value === '' || /^\d+$/.test(value)) {
                  setValue('studentCount', value === '' ? undefined : Number(value), { shouldValidate: true });
                  setStudentCountDisplay(value === '' ? '' : formatNumberWithCommas(value));
                }
              }}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="กรอกจำนวนนักเรียน"
            />
          </div>

          {/* ขนาดโรงเรียน */}
          <div>
            <label className="block text-sm font-medium mb-2">
              ขนาดโรงเรียน
            </label>
            
            {/* Read-only display box */}
            <div className="w-full px-4 py-2 border border-neutral-border rounded-lg bg-white min-h-[42px] flex items-center">
              {schoolSize && studentCount && Number(studentCount) > 0 ? (
                <span className="text-[#0FA968] font-medium">
                  {getSchoolSizeDisplayText(schoolSize)}
                </span>
              ) : (
                <span className="text-gray-400 text-sm">
                  กรอกจำนวนนักเรียนเพื่อคำนวณขนาดโรงเรียน
                </span>
              )}
            </div>
            
            {/* Size criteria list - always visible */}
            <div className="mt-2 text-xs text-gray-500 space-y-0.5">
              <p>• ขนาดเล็ก: 119 คนลงมา</p>
              <p>• ขนาดกลาง: 120 - 719 คน</p>
              <p>• ขนาดใหญ่: 720 - 1,679 คน</p>
              <p>• ขนาดใหญ่พิเศษ: 1,680 คนขึ้นไป</p>
            </div>
          </div>
        </div>
      </section>

      {/* สถานที่ตั้ง */}
      <section className="bg-white p-6 rounded-lg border border-neutral-border">
        <h2 className="text-xl font-semibold text-primary mb-4">
          สถานที่ตั้ง
        </h2>

        <div className="space-y-4">
          {/* เลขที่ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">เลขที่</label>
              <input
                type="text"
                {...register('addressNo')}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกเลขที่"
              />
            </div>

            {/* หมู่ */}
            <div>
              <label className="block text-sm font-medium mb-2">หมู่</label>
              <input
                type="text"
                {...register('moo')}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกหมู่"
              />
            </div>
          </div>

          {/* ถนน */}
          <div>
            <label className="block text-sm font-medium mb-2">ถนน</label>
            <input
              type="text"
              {...register('road')}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="กรอกชื่อถนน"
            />
          </div>

          {/* ตำบล/แขวง และ อำเภอ/เขต */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                ตำบล/แขวง
              </label>
              <input
                id="th-district"
                type="text"
                name="subDistrict"
                ref={register('subDistrict').ref}
                onChange={register('subDistrict').onChange}
                onBlur={register('subDistrict').onBlur}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกตำบล/แขวง"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                อำเภอ/เขต
              </label>
              <input
                id="th-amphoe"
                type="text"
                name="district"
                ref={register('district').ref}
                onChange={register('district').onChange}
                onBlur={register('district').onBlur}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกอำเภอ/เขต"
              />
            </div>
          </div>

          {/* จังหวัด และ รหัสไปรษณีย์ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">จังหวัด</label>
              <input
                id="th-province"
                type="text"
                name="provinceAddress"
                ref={register('provinceAddress').ref}
                onChange={register('provinceAddress').onChange}
                onBlur={register('provinceAddress').onBlur}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกจังหวัด"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                รหัสไปรษณีย์
              </label>
              <input
                id="th-zipcode"
                type="text"
                name="postalCode"
                ref={register('postalCode').ref}
                onChange={register('postalCode').onChange}
                onBlur={register('postalCode').onBlur}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกรหัสไปรษณีย์"
              />
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-sm text-[#0FA968] bg-[#f0f9f5] p-3 rounded-lg border border-[#c3e9d7]">
            💡 พิมพ์ ตำบล/อำเภอ/จังหวัด เพื่อให้ระบบแนะนำอัตโนมัติ
          </p>

          {/* โทรศัพท์ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                โทรศัพท์
              </label>
              <input
                type="number"
                {...register('phone')}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกเบอร์โทรศัพท์"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">โทรสาร</label>
              <input
                type="number"
                {...register('fax')}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกเบอร์โทรสาร"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
