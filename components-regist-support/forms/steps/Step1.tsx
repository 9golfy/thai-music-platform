'use client';

import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RegisterSupportFormData } from '@/lib/validators/registerSupport.schema';
import { calculateSchoolSize, getSchoolSizeDisplayText } from '@/lib/utils/schoolSize';

interface Step1Props {
  form: UseFormReturn<RegisterSupportFormData>;
  isRestoringData?: boolean; // Flag to indicate data restoration
}

export default function Step1({ form, isRestoringData = false }: Step1Props) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const thailandInitialized = useRef(false);
  const isRestoringDataRef = useRef(false); // Flag to prevent clearing during data restoration
  const supportType = watch('regsup_supportType');
  const studentCount = watch('regsup_studentCount');
  const staffCount = watch('regsup_staffCount');
  const schoolSize = watch('regsup_schoolSize');
  const memberCount = watch('regsup_supportTypeMemberCount'); // Watch member count for controlled inputs

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
          setValue('regsup_schoolSize', calculatedSize, { shouldValidate: true });
        }
      } else {
        // Clear school size when student count is 0 or negative
        setValue('regsup_schoolSize', undefined, { shouldValidate: true });
      }
    } else {
      // Clear school size when student count is empty or invalid
      setValue('regsup_schoolSize', undefined, { shouldValidate: true });
    }
  }, [studentCount, setValue]);

  // Update restoration flag
  useEffect(() => {
    isRestoringDataRef.current = isRestoringData;
  }, [isRestoringData]);

  // Clear other support type fields when support type changes
  useEffect(() => {
    // Skip clearing during data restoration
    if (isRestoringDataRef.current) {
      return;
    }

    // Skip if no support type is selected
    if (!supportType) {
      return;
    }

    console.log('🔄 Support type changed to:', supportType);

    // Define which field should be active for each support type
    const SUPPORT_TYPE_FIELD_MAP = {
      'สถานศึกษา': 'regsup_supportTypeSchoolName',
      'ชุมนุม': 'regsup_supportTypeClubName',
      'ชมรม': 'regsup_supportTypeAssociationName',
      'กลุ่ม': 'regsup_supportTypeGroupName',
      'วงดนตรีไทย': 'regsup_supportTypeBandName'
    };

    // Get the active field for current support type
    const activeField = SUPPORT_TYPE_FIELD_MAP[supportType as keyof typeof SUPPORT_TYPE_FIELD_MAP];

    // Clear all support type name fields except the active one
    Object.entries(SUPPORT_TYPE_FIELD_MAP).forEach(([type, fieldName]) => {
      if (fieldName !== activeField) {
        const currentValue = watch(fieldName as any);
        if (currentValue) {
          console.log(`🧹 Clearing ${fieldName} (was: "${currentValue}")`);
          setValue(fieldName as any, '', { shouldValidate: true });
        }
      }
    });

    // Clear member count when switching between any support types
    // This ensures the number field is always cleared when changing support type
    const currentMemberCount = watch('regsup_supportTypeMemberCount');
    if (currentMemberCount !== undefined && currentMemberCount !== null) {
      console.log(`🧹 Clearing regsup_supportTypeMemberCount (was: ${currentMemberCount}) for new support type: ${supportType}`);
      setValue('regsup_supportTypeMemberCount', undefined, { shouldValidate: true });
    }

    console.log('✅ Support type field cleanup completed');
  }, [supportType, setValue, watch]);

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
              setValue('regsup_subDistrict', data.district, {
                shouldValidate: true,
                shouldDirty: true,
              });
              setValue('regsup_district', data.amphoe, {
                shouldValidate: true,
                shouldDirty: true,
              });
              setValue('regsup_provinceAddress', data.province, {
                shouldValidate: true,
                shouldDirty: true,
              });
              setValue('regsup_postalCode', data.zipcode, {
                shouldValidate: true,
                shouldDirty: true,
              });
            },
            onLoad: function() {
              console.log('✅ jquery.Thailand.js database loaded and ready!');
              
              // Force black text color using MutationObserver
              const forceBlackText = () => {
                // Find all autocomplete elements
                const elements = document.querySelectorAll(
                  '.tt-menu, .tt-menu *, .tt-dataset, .tt-dataset *, .tt-suggestion, .tt-suggestion *, .tt-highlight, .twitter-typeahead span, .twitter-typeahead pre'
                );
                
                elements.forEach((el) => {
                  if (el instanceof HTMLElement) {
                    el.style.setProperty('color', '#000000', 'important');
                    el.style.setProperty('font-weight', '600', 'important');
                    el.style.setProperty('opacity', '1', 'important');
                  }
                });
              };
              
              // Run immediately
              setTimeout(forceBlackText, 100);
              
              // Watch for DOM changes and apply styles
              const observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;
                mutations.forEach((mutation) => {
                  if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                      if (node instanceof HTMLElement) {
                        if (node.classList.contains('tt-menu') || 
                            node.classList.contains('tt-suggestion') ||
                            node.classList.contains('tt-dataset') ||
                            node.closest('.tt-menu')) {
                          shouldUpdate = true;
                        }
                      }
                    });
                  }
                });
                
                if (shouldUpdate) {
                  forceBlackText();
                }
              });
              
              observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
              });
              
              // Also listen to input events
              const inputs = document.querySelectorAll('#th-district, #th-amphoe, #th-province, #th-zipcode');
              inputs.forEach((input) => {
                input.addEventListener('input', () => {
                  setTimeout(forceBlackText, 50);
                });
                input.addEventListener('focus', () => {
                  setTimeout(forceBlackText, 50);
                });
              });
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
      {/* ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย */}
      <section className="bg-white p-6 rounded-lg border border-neutral-border">
        <h2 className="text-xl font-semibold text-primary mb-2">
          ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          ** เลือกได้ประเภทเพียงประเภทเดียว **
        </p>

        <div className="space-y-4">
          {/* Hidden input for React Hook Form - registered only once */}
          <input
            type="hidden"
            {...register('regsup_supportTypeMemberCount')}
          />

          {/* Radio: สถานศึกษา */}
          <div className="flex items-start gap-3">
            <input
              type="radio"
              id="type-school"
              value="สถานศึกษา"
              {...register('regsup_supportType')}
              className="mt-1 w-4 h-4 text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <label htmlFor="type-school" className="block text-sm font-medium text-gray-900 mb-2">
                สถานศึกษา
              </label>
              <input
                type="text"
                {...register('regsup_supportTypeSchoolName')}
                disabled={supportType !== 'สถานศึกษา'}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="ระบุชื่อสถานศึกษา"
              />
            </div>
          </div>

          {/* Radio: ชุมนุม */}
          <div className="flex items-start gap-3">
            <input
              type="radio"
              id="type-club"
              value="ชุมนุม"
              {...register('regsup_supportType')}
              className="mt-1 w-4 h-4 text-primary focus:ring-primary"
            />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type-club" className="block text-sm font-medium text-gray-900 mb-2">
                  ชุมนุม
                </label>
                <input
                  type="text"
                  {...register('regsup_supportTypeClubName')}
                  disabled={supportType !== 'ชุมนุม'}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="ระบุชื่อชุมนุม"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  จำนวน (คน)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={supportType === 'ชุมนุม' ? (memberCount || '') : ''}
                  disabled={supportType !== 'ชุมนุม'}
                  onChange={(e) => {
                    if (supportType === 'ชุมนุม') {
                      const value = e.target.value;
                      setValue('regsup_supportTypeMemberCount', value ? parseInt(value, 10) : undefined, { shouldValidate: true });
                    }
                  }}
                  onKeyDown={(e) => {
                    // Allow only numbers and control keys
                    if (!/[0-9]/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="จำนวนสมาชิก"
                />
              </div>
            </div>
          </div>

          {/* Radio: ชมรม */}
          <div className="flex items-start gap-3">
            <input
              type="radio"
              id="type-association"
              value="ชมรม"
              {...register('regsup_supportType')}
              className="mt-1 w-4 h-4 text-primary focus:ring-primary"
            />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type-association" className="block text-sm font-medium text-gray-900 mb-2">
                  ชมรม
                </label>
                <input
                  type="text"
                  {...register('regsup_supportTypeAssociationName')}
                  disabled={supportType !== 'ชมรม'}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="ระบุชื่อชมรม"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  จำนวน (คน)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={supportType === 'ชมรม' ? (memberCount || '') : ''}
                  disabled={supportType !== 'ชมรม'}
                  onChange={(e) => {
                    if (supportType === 'ชมรม') {
                      const value = e.target.value;
                      setValue('regsup_supportTypeMemberCount', value ? parseInt(value, 10) : undefined, { shouldValidate: true });
                    }
                  }}
                  onKeyDown={(e) => {
                    // Allow only numbers and control keys
                    if (!/[0-9]/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="จำนวนสมาชิก"
                />
              </div>
            </div>
          </div>

          {/* Radio: กลุ่ม */}
          <div className="flex items-start gap-3">
            <input
              type="radio"
              id="type-group"
              value="กลุ่ม"
              {...register('regsup_supportType')}
              className="mt-1 w-4 h-4 text-primary focus:ring-primary"
            />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type-group" className="block text-sm font-medium text-gray-900 mb-2">
                  กลุ่ม
                </label>
                <input
                  type="text"
                  {...register('regsup_supportTypeGroupName')}
                  disabled={supportType !== 'กลุ่ม'}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="ระบุชื่อกลุ่ม"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  จำนวน (คน)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={supportType === 'กลุ่ม' ? (memberCount || '') : ''}
                  disabled={supportType !== 'กลุ่ม'}
                  onChange={(e) => {
                    if (supportType === 'กลุ่ม') {
                      const value = e.target.value;
                      setValue('regsup_supportTypeMemberCount', value ? parseInt(value, 10) : undefined, { shouldValidate: true });
                    }
                  }}
                  onKeyDown={(e) => {
                    // Allow only numbers and control keys
                    if (!/[0-9]/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="จำนวนสมาชิก"
                />
              </div>
            </div>
          </div>

          {/* Radio: วงดนตรีไทย */}
          <div className="flex items-start gap-3">
            <input
              type="radio"
              id="type-band"
              value="วงดนตรีไทย"
              {...register('regsup_supportType')}
              className="mt-1 w-4 h-4 text-primary focus:ring-primary"
            />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type-band" className="block text-sm font-medium text-gray-900 mb-2">
                  วงดนตรีไทย
                </label>
                <input
                  type="text"
                  {...register('regsup_supportTypeBandName')}
                  disabled={supportType !== 'วงดนตรีไทย'}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="ระบุชื่อวงดนตรีไทย"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  จำนวน (คน)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={supportType === 'วงดนตรีไทย' ? (memberCount || '') : ''}
                  disabled={supportType !== 'วงดนตรีไทย'}
                  onChange={(e) => {
                    if (supportType === 'วงดนตรีไทย') {
                      const value = e.target.value;
                      setValue('regsup_supportTypeMemberCount', value ? parseInt(value, 10) : undefined, { shouldValidate: true });
                    }
                  }}
                  onKeyDown={(e) => {
                    // Allow only numbers and control keys
                    if (!/[0-9]/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="จำนวนสมาชิก"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ข้อมูลพื้นฐาน */}
      <section className="bg-white p-6 rounded-lg border border-neutral-border">
        <h2 className="text-xl font-semibold text-primary mb-4">
          ข้อมูลพื้นฐาน
        </h2>

        <div className="space-y-4">
          {/* ชื่อสถานศึกษา */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ชื่อสถานศึกษา<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('regsup_schoolName')}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="กรอกชื่อสถานศึกษาของผู้สมัคร"
            />
            {errors.regsup_schoolName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.regsup_schoolName.message as string}
              </p>
            )}
          </div>

          {/* จังหวัดสถานศึกษา */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              จังหวัด <span className="text-red-500">*</span>
            </label>
            <select
              {...register('regsup_schoolProvince')}
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
            {errors.regsup_schoolProvince && (
              <p className="text-red-500 text-sm mt-1">
                {errors.regsup_schoolProvince.message as string}
              </p>
            )}
          </div>

          {/* ระดับการศึกษา */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ระดับสถานศึกษา <span className="text-red-500">*</span>
            </label>
            <select
              {...register('regsup_schoolLevel')}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">กรุณาเลือกระดับการศึกษา</option>
              <option value="ประถมศึกษา">ประถมศึกษา</option>
              <option value="มัธยมศึกษา">มัธยมศึกษา</option>
              <option value="ขยายโอกาส">ขยายโอกาส</option>
              <option value="เฉพาะทาง">เฉพาะทาง</option>
            </select>
            {errors.regsup_schoolLevel && (
              <p className="text-red-500 text-sm mt-1">
                {errors.regsup_schoolLevel.message as string}
              </p>
            )}
          </div>

          {/* สังกัด */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              สังกัด
            </label>
            <select
              {...register('regsup_affiliation')}
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
            {errors.regsup_affiliation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.regsup_affiliation.message as string}
              </p>
            )}

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                ระบุ
              </label>
              <input
                type="text"
                {...register('regsup_affiliationDetail')}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="กรุณาระบุรายละเอียดสังกัด"
              />
            </div>
          </div>

          

        {/* จำนวนบุคลากร*/}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              จำนวนครู/บุคลากร
            </label>
            <input
              type="text"
              value={staffCountDisplay}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                if (value === '' || /^\d+$/.test(value)) {
                  setValue('regsup_staffCount', value === '' ? undefined : Number(value), { shouldValidate: true });
                  setStaffCountDisplay(value === '' ? '' : formatNumberWithCommas(value));
                }
              }}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="จำนวนบุคลากร"
            />
          </div>
          

          {/* จำนวนนักเรียน */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              จำนวนนักเรียน
            </label>
            <input
              type="text"
              value={studentCountDisplay}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                if (value === '' || /^\d+$/.test(value)) {
                  setValue('regsup_studentCount', value === '' ? undefined : Number(value), { shouldValidate: true });
                  setStudentCountDisplay(value === '' ? '' : formatNumberWithCommas(value));
                }
              }}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="กรอกจำนวนนักเรียน"
            />
          </div>

          {/* ขนาดโรงเรียน */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ขนาดโรงเรียน
            </label>
            
            {/* Dynamic text display - no input box */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                กรอกจำนวนนักเรียนเพื่อคำนวณขนาดโรงเรียน
              </p>
              
              {schoolSize && studentCount && Number(studentCount) > 0 && (
                <p className="text-base font-semibold text-[#0FA968]">
                  {getSchoolSizeDisplayText(schoolSize)}
                </p>
              )}
              
              {/* Size criteria list */}
              <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                <p>• ขนาดเล็ก: 119 คนลงมา</p>
                <p>• ขนาดกลาง: 120 - 719 คน</p>
                <p>• ขนาดใหญ่: 720 - 1,679 คน</p>
                <p>• ขนาดใหญ่พิเศษ: 1,680 คนขึ้นไป</p>
              </div>
            </div>
          </div>

          {/* จำนวนนักเรียนแต่ละระดับชั้น */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              จำนวนนักเรียนแต่ละระดับชั้น
            </label>
            <textarea
              {...register('regsup_studentCountByGrade')}
              rows={4}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="กรอกจำนวนนักเรียนแต่ละระดับชั้น เช่น ป.1 = 50 คน, ป.2 = 45 คน"
            />
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
              <label className="block text-sm font-medium text-gray-900 mb-2">เลขที่ <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('regsup_addressNo')}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกเลขที่"
              />
            </div>

            {/* หมู่ */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">หมู่</label>
              <input
                type="text"
                {...register('regsup_moo')}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกหมู่"
              />
            </div>
          </div>

          {/* ถนน */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">ถนน</label>
            <input
              type="text"
              {...register('regsup_road')}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="กรอกชื่อถนน"
            />
          </div>

          {/* ตำบล/แขวง และ อำเภอ/เขต */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                ตำบล/แขวง <span className="text-red-500">*</span>
              </label>
              <input
                id="th-district"
                type="text"
                name="regsup_subDistrict"
                ref={register('regsup_subDistrict').ref}
                onChange={register('regsup_subDistrict').onChange}
                onBlur={register('regsup_subDistrict').onBlur}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกตำบล/แขวง"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                อำเภอ/เขต <span className="text-red-500">*</span>
              </label>
              <input
                id="th-amphoe"
                type="text"
                name="regsup_district"
                ref={register('regsup_district').ref}
                onChange={register('regsup_district').onChange}
                onBlur={register('regsup_district').onBlur}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกอำเภอ/เขต"
              />
            </div>
          </div>

          {/* จังหวัด และ รหัสไปรษณีย์ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">จังหวัด <span className="text-red-500">*</span></label>
              <input
                id="th-province"
                type="text"
                name="regsup_provinceAddress"
                ref={register('regsup_provinceAddress').ref}
                onChange={register('regsup_provinceAddress').onChange}
                onBlur={register('regsup_provinceAddress').onBlur}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกจังหวัด"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                รหัสไปรษณีย์ <span className="text-red-500">*</span>
              </label>
              <input
                id="th-zipcode"
                type="text"
                name="regsup_postalCode"
                ref={register('regsup_postalCode').ref}
                onChange={register('regsup_postalCode').onChange}
                onBlur={register('regsup_postalCode').onBlur}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกรหัสไปรษณีย์"
              />
            </div>
          </div>

          

          {/* โทรศัพท์ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                โทรศัพท์ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                {...register('regsup_phone', {
                  setValueAs: (v) => {
                    if (v === '' || v === null || v === undefined) return '';
                    // Keep as string for phone numbers
                    return v.toString();
                  }
                })}
                onKeyDown={(e) => {
                  // Allow only numbers and control keys
                  if (!/[0-9]/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="กรอกเบอร์โทรศัพท์"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">โทรสาร</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                {...register('regsup_fax', {
                  setValueAs: (v) => {
                    if (v === '' || v === null || v === undefined) return '';
                    // Keep as string for fax numbers
                    return v.toString();
                  }
                })}
                onKeyDown={(e) => {
                  // Allow only numbers and control keys
                  if (!/[0-9]/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
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
