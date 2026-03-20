'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register100Schema, Register100FormData } from '@/lib/validators/register100.schema';
import { STEP_TITLES } from '@/lib/constants/register100.steps';
import { getDraftFromLocal } from '@/lib/utils/draftStorage';
import SuccessModal from '@/components-regist100/ui/SuccessModal';
import ValidationErrorModal from '@/components-regist100/ui/ValidationErrorModal';
import MissingFieldsModal from '@/components-regist100/ui/MissingFieldsModal';
import ConsentModal from '@/components-regist100/ui/ConsentModal';
import TeacherInfoModal from '@/components-regist-support/ui/TeacherInfoModal'; // Reuse the same modal
import SaveDraftButton from '@/components/forms/SaveDraftButton';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import Step6 from './steps/Step6';
import Step7 from './steps/Step7';
import Step8 from './steps/Step8';
import Step9 from './steps/Step9';

const STEPS = STEP_TITLES;

// Convert Arabic numerals to Thai numerals
const toThaiNumeral = (num: number): string => {
  const thaiNumerals = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  return num.toString().split('').map(digit => thaiNumerals[parseInt(digit)]).join('');
};

export default function Register100Wizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showValidationErrorModal, setShowValidationErrorModal] = useState(false);
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
  const [showTeacherInfoModal, setShowTeacherInfoModal] = useState(false);
  const [missingFieldsList, setMissingFieldsList] = useState<string[]>([]);
  const [draftSaveMessage, setDraftSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [teacherInfo, setTeacherInfo] = useState<{ email: string; phone: string } | null>(null);
  
  // Store files in component state
  const [mgtImageFile, setMgtImageFile] = useState<File | null>(null);
  const [teacherImageFiles, setTeacherImageFiles] = useState<{ [key: number]: File }>({});

  // Expose state setters globally for testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).setMgtImageFile = setMgtImageFile;
      (window as any).setTeacherImageFiles = setTeacherImageFiles;
      (window as any).getMgtImageFile = () => mgtImageFile;
      (window as any).getTeacherImageFiles = () => teacherImageFiles;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).setMgtImageFile;
        delete (window as any).setTeacherImageFiles;
        delete (window as any).getMgtImageFile;
        delete (window as any).getTeacherImageFiles;
      }
    };
  }, [mgtImageFile, teacherImageFiles]);

  const form = useForm<Register100FormData>({
    resolver: zodResolver(register100Schema),
    mode: 'onBlur',
    defaultValues: {
      reg100_thaiMusicTeachers: [],
      reg100_currentMusicTypes: [],
      reg100_readinessItems: [],
      reg100_compulsoryCurriculum: [],
      reg100_electiveCurriculum: [],
      reg100_localCurriculum: [],
      reg100_afterSchoolSchedule: [],
      reg100_supportFactors: [],
      reg100_supportFromOrg: [],
      reg100_supportFromExternal: [],
      reg100_awards: [],
      reg100_activitiesWithinProvinceInternal: [],
      reg100_activitiesWithinProvinceExternal: [],
      reg100_activitiesOutsideProvince: [],
      reg100_prActivities: [],
      reg100_isCompulsorySubject: false,
      reg100_hasAfterSchoolTeaching: false,
      reg100_hasElectiveSubject: false,
      reg100_hasLocalCurriculum: false,
      reg100_hasSupportFromOrg: false,
      reg100_hasSupportFromExternal: false,
      reg100_DCP_PR_Channel_FACEBOOK: false,
      reg100_DCP_PR_Channel_YOUTUBE: false,
      reg100_DCP_PR_Channel_Tiktok: false,
      reg100_heardFromOther: false,
      reg100_certifiedByAdmin: false,
      reg100_affiliationDetail: '',
      reg100_teacher_training_score: 0,
      reg100_teacher_qualification_score: 0,
      reg100_support_from_org_score: 0,
      reg100_support_from_external_score: 0,
      reg100_award_score: 0,
      reg100_activity_within_province_internal_score: 0,
      reg100_activity_within_province_external_score: 0,
      reg100_activity_outside_province_score: 0,
      reg100_pr_activity_score: 0,
      reg100_total_score: 0,
    },
  });

  // Load draft from URL token or localStorage
  useEffect(() => {
    const loadDraftData = async () => {
      console.log('🔄 Register100Wizard: Loading draft data...');
      
      try {
        // Check if we have a token in URL (from draft link)
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        
        if (urlToken) {
          console.log('🎫 Found token in URL:', urlToken);
          
          // Fetch draft data from API using token
          try {
            const response = await fetch(`/api/draft/${urlToken}/data`);
            const result = await response.json();
            
            if (result.success && result.exists) {
              console.log('✅ Draft data loaded from API:', {
                email: result.email,
                submissionType: result.submissionType,
                currentStep: result.currentStep,
                schoolName: result.formData?.schoolName
              });
              
              // Restore form data from API
              if (result.formData) {
                console.log('🚀 Restoring form data from API...');
                
                // Method 1: Set critical fields first
                if (result.formData.reg100_schoolName) {
                  form.setValue('reg100_schoolName', result.formData.reg100_schoolName, { 
                    shouldValidate: false,
                    shouldDirty: true,
                    shouldTouch: true
                  });
                  console.log('✅ School name set from API:', result.formData.reg100_schoolName);
                }
                
                // Method 2: Reset with all data
                const mergedData = {
                  ...form.formState.defaultValues,
                  ...result.formData
                };
                
                form.reset(mergedData);
                
                // Method 3: Set all fields individually
                Object.entries(result.formData).forEach(([key, value]) => {
                  if (value !== undefined && value !== null && value !== '') {
                    try {
                      form.setValue(key as any, value, { 
                        shouldValidate: false,
                        shouldDirty: true,
                        shouldTouch: true
                      });
                    } catch (e) {
                      console.warn(`Failed to set field ${key}:`, e);
                    }
                  }
                });
                
                // Force trigger
                form.trigger();
                
                // Restore current step
                if (result.currentStep) {
                  console.log('📍 Restoring step from API:', result.currentStep);
                  setCurrentStep(result.currentStep);
                }
                
                // Show success message
                setDraftSaveMessage({
                  type: 'success',
                  text: 'โหลดข้อมูลที่บันทึกไว้เรียบร้อยแล้ว',
                });
                
                setTimeout(() => {
                  setDraftSaveMessage(null);
                }, 5000);
                
                // Verify restoration
                setTimeout(() => {
                  const finalValues = form.getValues();
                  console.log('✅ Form restoration completed from API:', {
                    schoolName: finalValues.reg100_schoolName,
                    success: finalValues.reg100_schoolName === result.formData.reg100_schoolName
                  });
                  
                  // DOM fallback if needed
                  if (!finalValues.reg100_schoolName && result.formData.reg100_schoolName) {
                    console.log('🔧 Applying DOM fallback...');
                    const schoolNameInput = document.querySelector('input[name="reg100_schoolName"]') as HTMLInputElement;
                    if (schoolNameInput) {
                      schoolNameInput.value = result.formData.reg100_schoolName;
                      schoolNameInput.dispatchEvent(new Event('input', { bubbles: true }));
                      schoolNameInput.dispatchEvent(new Event('change', { bubbles: true }));
                      console.log('✅ DOM fallback applied');
                    }
                  }
                }, 200);
                
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
                
                return; // Exit early, we got data from API
              }
            } else {
              console.log('❌ No draft found for token:', urlToken);
            }
          } catch (apiError) {
            console.error('❌ Error fetching draft from API:', apiError);
          }
        }
        
        // Fallback: Check localStorage if no URL token or API failed
        console.log('🔄 Checking localStorage as fallback...');
        const draft = getDraftFromLocal('register100');
        
        if (draft && draft.formData) {
          console.log('✅ Draft data found in localStorage:', {
            email: draft.email,
            token: draft.draftToken,
            schoolName: draft.formData.schoolName,
            keys: Object.keys(draft.formData).length
          });
          
          // Restore form data from localStorage
          console.log('🚀 Restoring form data from localStorage...');
          
          // Method 1: Set critical fields first
          if (draft.formData.reg100_schoolName) {
            form.setValue('reg100_schoolName', draft.formData.reg100_schoolName, { 
              shouldValidate: false,
              shouldDirty: true,
              shouldTouch: true
            });
            console.log('✅ School name set from localStorage:', draft.formData.reg100_schoolName);
          }
          
          // Method 2: Reset with all data
          const mergedData = {
            ...form.formState.defaultValues,
            ...draft.formData
          };
          
          form.reset(mergedData);
          
          // Method 3: Set all fields individually
          Object.entries(draft.formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              try {
                form.setValue(key as any, value, { 
                  shouldValidate: false,
                  shouldDirty: true,
                  shouldTouch: true
                });
              } catch (e) {
                console.warn(`Failed to set field ${key}:`, e);
              }
            }
          });
          
          // Force trigger
          form.trigger();
          
          // Restore current step
          if (draft.currentStep) {
            console.log('📍 Restoring step from localStorage:', draft.currentStep);
            setCurrentStep(draft.currentStep);
          }
          
          // Show success message
          setDraftSaveMessage({
            type: 'success',
            text: 'โหลดข้อมูลที่บันทึกไว้เรียบร้อยแล้ว',
          });
          
          setTimeout(() => {
            setDraftSaveMessage(null);
          }, 5000);
          
          // Verify restoration
          setTimeout(() => {
            const finalValues = form.getValues();
            console.log('✅ Form restoration completed from localStorage:', {
              schoolName: finalValues.reg100_schoolName,
              success: finalValues.reg100_schoolName === draft.formData.reg100_schoolName
            });
            
            // DOM fallback if needed
            if (!finalValues.reg100_schoolName && draft.formData.reg100_schoolName) {
              console.log('🔧 Applying DOM fallback...');
              const schoolNameInput = document.querySelector('input[name="reg100_schoolName"]') as HTMLInputElement;
              if (schoolNameInput) {
                schoolNameInput.value = draft.formData.reg100_schoolName;
                schoolNameInput.dispatchEvent(new Event('input', { bubbles: true }));
                schoolNameInput.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('✅ DOM fallback applied');
              }
            }
          }, 200);
          
        } else {
          console.log('❌ No draft data found in localStorage');
        }
        
      } catch (error) {
        console.error('❌ Error loading draft data:', error);
      }
    };

    // Load draft data immediately
    loadDraftData();
  }, []);

  const goToStep = (targetStep: number) => {
    const clampedStep = Math.max(1, Math.min(9, targetStep));
    setCurrentStep(clampedStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = async () => {
    if (currentStep === 9) {
      form.handleSubmit(onSubmit)();
      return;
    }

    // Validate required fields for current step
    let requiredFields: any[] = [];
    
    if (currentStep === 1) {
      requiredFields = [
        'reg100_schoolName', 'reg100_schoolProvince', 'reg100_schoolLevel', 'reg100_affiliation',
        'reg100_staffCount', 'reg100_studentCount',
        // 'reg100_schoolSize' removed - auto-calculated field
        'reg100_addressNo', 'reg100_subDistrict', 'reg100_district', 'reg100_provinceAddress', 'reg100_postalCode', 'reg100_phone'
      ];
    } else if (currentStep === 2) {
      requiredFields = ['reg100_mgtFullName', 'reg100_mgtPosition', 'reg100_mgtAddress', 'reg100_mgtPhone', 'reg100_mgtEmail'];
    } else if (currentStep === 3) {
      // Check if arrays have at least 1 item
      const currentMusicTypes = form.getValues('reg100_currentMusicTypes') || [];
      const readinessItems = form.getValues('reg100_readinessItems') || [];
      
      if (currentMusicTypes.length === 0 || readinessItems.length === 0) {
        setShowValidationErrorModal(true);
        return;
      }
    } else if (currentStep === 4) {
      // Check if at least 1 teacher exists
      const teachers = form.getValues('reg100_thaiMusicTeachers') || [];
      if (teachers.length === 0) {
        setShowValidationErrorModal(true);
        return;
      }
      
      // Check if first teacher has qualification selected
      if (teachers[0] && !teachers[0].teacherQualification) {
        setShowValidationErrorModal(true);
        return;
      }
    } else if (currentStep === 6) {
      // Step 6: No specific validation required - all fields are optional
      // Just proceed to next step
    } else if (currentStep === 7) {
      // Check if at least 1 award exists with awardLevel selected
      const awards = form.getValues('reg100_awards') || [];
      if (awards.length === 0 || !awards[0]?.awardLevel) {
        setShowValidationErrorModal(true);
        return;
      }
    }
    
    if (requiredFields.length > 0) {
      const isValid = await form.trigger(requiredFields);
      if (!isValid) {
        setShowValidationErrorModal(true);
        return;
      }
    }

    goToStep(currentStep + 1);
  };

  const handleBack = () => {
    goToStep(currentStep - 1);
  };

  const handleStepClick = (step: number) => {
    goToStep(step);
  };

  const handleSaveDraftSuccess = (token: string) => {
    setDraftSaveMessage({
      type: 'success',
      text: `บันทึกแบบฟอร์มสำเร็จ! คุณจะได้รับอีเมลพร้อมลิงก์สำหรับกลับมากรอกต่อ`,
    });
    setTimeout(() => setDraftSaveMessage(null), 5000);
  };

  const handleSaveDraftError = (error: string) => {
    setDraftSaveMessage({
      type: 'error',
      text: error,
    });
    setTimeout(() => setDraftSaveMessage(null), 5000);
  };

  const onSubmit = async (data: Register100FormData) => {
    console.log('🚀 Submitting form:', data);
    console.log('📋 Certification checkbox value:', data.reg100_certifiedByAdmin);
    
    // Validate all required fields before submission
    const missingFields: string[] = [];
    
    // Step 1 validation
    if (!data.reg100_schoolName) missingFields.push('ชื่อสถานศึกษา (Step 1)');
    if (!data.reg100_schoolProvince) missingFields.push('จังหวัดสถานศึกษา (Step 1)');
    if (!data.reg100_schoolLevel) missingFields.push('ระดับสถานศึกษา (Step 1)');
    if (!data.reg100_affiliation) missingFields.push('สังกัด (Step 1)');
    if (!data.reg100_staffCount) missingFields.push('จำนวนครู/บุคลากร (Step 1)');
    if (!data.reg100_studentCount) missingFields.push('จำนวนนักเรียน (Step 1)');
    // reg100_schoolSize is auto-calculated, not required for validation
    if (!data.reg100_addressNo) missingFields.push('เลขที่ (Step 1)');
    if (!data.reg100_subDistrict) missingFields.push('ตำบล/แขวง (Step 1)');
    if (!data.reg100_district) missingFields.push('อำเภอ/เขต (Step 1)');
    if (!data.reg100_provinceAddress) missingFields.push('จังหวัด (ที่อยู่) (Step 1)');
    if (!data.reg100_postalCode) missingFields.push('รหัสไปรษณีย์ (Step 1)');
    if (!data.reg100_phone) missingFields.push('โทรศัพท์ (Step 1)');
    
    // Step 2 validation
    if (!data.reg100_mgtFullName) missingFields.push('ชื่อ-นามสกุล ผู้บริหาร (Step 2)');
    if (!data.reg100_mgtPosition) missingFields.push('ตำแหน่ง ผู้บริหาร (Step 2)');
    if (!data.reg100_mgtAddress) missingFields.push('ที่อยู่ ผู้บริหาร (Step 2)');
    if (!data.reg100_mgtPhone) missingFields.push('โทรศัพท์ ผู้บริหาร (Step 2)');
    if (!data.reg100_mgtEmail) missingFields.push('อีเมล ผู้บริหาร (Step 2)');
    
    // Step 3 validation
    if (!data.reg100_currentMusicTypes || data.reg100_currentMusicTypes.length === 0) {
      missingFields.push('สภาวการณ์การเรียนการสอนดนตรีไทย - กรุณาเพิ่มอย่างน้อย 1 รายการ (Step 3)');
    }
    if (!data.reg100_readinessItems || data.reg100_readinessItems.length === 0) {
      missingFields.push('ความพร้อมในการส่งเสริม - กรุณาเพิ่มอย่างน้อย 1 รายการ (Step 3)');
    }
    
    // Step 4 validation
    if (!data.reg100_thaiMusicTeachers || data.reg100_thaiMusicTeachers.length === 0) {
      missingFields.push('ผู้สอนดนตรีไทย - กรุณาเพิ่มอย่างน้อย 1 คน (Step 4)');
    } else if (data.reg100_thaiMusicTeachers[0] && !data.reg100_thaiMusicTeachers[0].teacherQualification) {
      missingFields.push('คุณลักษณะครูผู้สอน (Step 4)');
    }
    
    // Step 6 validation - At least 1 award is required
    if (!data.reg100_awards || data.reg100_awards.length === 0 || !data.reg100_awards[0]?.awardLevel) {
      missingFields.push('รางวัล - กรุณาเพิ่มอย่างน้อย 1 รายการและเลือกระดับรางวัล (Step 6)');
    } else {
      // Award level is required if awards exist
      data.reg100_awards.forEach((award, index) => {
        if (award.awardName && !award.awardLevel) {
          missingFields.push(`ระดับรางวัล - รางวัลที่ ${index + 1} (Step 6)`);
        }
      });
    }

    // If there are missing fields, show modal
    if (missingFields.length > 0) {
      setMissingFieldsList(missingFields);
      setShowMissingFieldsModal(true);
      return;
    }

    // Show teacher info modal instead of submitting directly
    console.log('📝 Showing teacher info modal...');
    setShowTeacherInfoModal(true);
  };

  // New function to handle actual submission after teacher info is provided
  const handleFinalSubmit = async (data: Register100FormData, teacherData: { email: string; phone: string }) => {
    console.log('🚀 Final submission with teacher info:', { teacherData });

    setIsSubmitting(true);
    
    // Calculate all scores before submission
    calculateAllScores(data);

    try {
      const formData = new FormData();
      
      // Add teacher info to form data
      formData.append('teacherEmail', teacherData.email);
      formData.append('teacherPhone', teacherData.phone);
      
      // Append all fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'reg100_mgtImage') {
          // Skip - will be handled from state
        } else if (key === 'reg100_thaiMusicTeachers' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value.map((t: any) => {
            const { teacherImage, ...rest } = t;
            return rest;
          })));
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'boolean') {
          formData.append(key, String(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      // Append files from state
      console.log('📁 Checking files to upload...');
      console.log('📁 mgtImageFile:', mgtImageFile ? `${mgtImageFile.name} (${mgtImageFile.size} bytes)` : 'null');
      console.log('📁 teacherImageFiles:', Object.keys(teacherImageFiles).length, 'files');
      Object.entries(teacherImageFiles).forEach(([index, file]) => {
        console.log(`📁 teacherImageFiles[${index}]:`, file ? `${file.name} (${file.size} bytes)` : 'null');
      });
      
      if (mgtImageFile) {
        formData.append('mgtImage', mgtImageFile);
        console.log('✅ Appended mgtImage to FormData');
      } else {
        console.log('⚠️ No mgtImageFile to append');
      }
      
      Object.entries(teacherImageFiles).forEach(([index, file]) => {
        if (file) {
          formData.append(`teacherImage_${index}`, file);
          console.log(`✅ Appended teacherImage_${index} to FormData`);
        } else {
          console.log(`⚠️ No file for teacherImage_${index}`);
        }
      });

      const response = await fetch('/api/register100', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Form submitted successfully! ID:', result.id);
        setIsSubmitting(false);
        setShowTeacherInfoModal(false); // Close teacher info modal
        setShowSuccessModal(true);
        
        // Log email status
        if (result.emailSent) {
          console.log('📧 Teacher login email sent successfully');
        } else {
          console.warn('⚠️ Form submitted but email failed to send');
          // Still show success modal since submission was successful
        }
      } else {
        setIsSubmitting(false);
        console.error('❌ Form submission failed:', result.message);
        alert('เกิดข้อผิดพลาด: ' + result.message);
      }
    } catch (error) {
      setIsSubmitting(false);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
      console.error(error);
    }
  };

  // Handle teacher info submission
  const handleTeacherInfoSubmit = (teacherData: { email: string; phone: string }) => {
    console.log('👨‍🏫 Teacher info submitted:', teacherData);
    setTeacherInfo(teacherData);
    
    // Get current form data and submit
    const formData = form.getValues();
    handleFinalSubmit(formData, teacherData);
  };

  const calculateAllScores = (data: Register100FormData) => {
    // Teacher training score (5 points per checkbox, max 20)
    let trainingScore = 0;
    if (data.reg100_isCompulsorySubject) trainingScore += 5;
    if (data.reg100_hasAfterSchoolTeaching) trainingScore += 5;
    if (data.reg100_hasElectiveSubject) trainingScore += 5;
    if (data.reg100_hasLocalCurriculum) trainingScore += 5;
    data.reg100_teacher_training_score = trainingScore;

    // Teacher qualification score (5 points per unique qualification type, max 20)
    const uniqueQualifications = new Set<string>();
    data.reg100_thaiMusicTeachers?.forEach((teacher) => {
      if (teacher.teacherQualification && teacher.teacherQualification.trim() !== '') {
        uniqueQualifications.add(teacher.teacherQualification);
      }
    });
    data.reg100_teacher_qualification_score = uniqueQualifications.size * 5;

    // Support from org score (5 if checked)
    data.reg100_support_from_org_score = data.reg100_hasSupportFromOrg ? 5 : 0;

    // Support from external score (5/10/15 based on count)
    // Only count items that have organization filled
    const externalCount = data.reg100_supportFromExternal?.filter(
      item => item.organization && item.organization.trim() !== ''
    ).length || 0;
    if (externalCount >= 3) {
      data.reg100_support_from_external_score = 15;
    } else if (externalCount === 2) {
      data.reg100_support_from_external_score = 10;
    } else if (externalCount === 1) {
      data.reg100_support_from_external_score = 5;
    } else {
      data.reg100_support_from_external_score = 0;
    }

    // Award score (highest level only)
    let maxAwardScore = 0;
    data.reg100_awards?.forEach((award) => {
      if (award.awardLevel === 'ประเทศ') maxAwardScore = Math.max(maxAwardScore, 20);
      else if (award.awardLevel === 'ภาค') maxAwardScore = Math.max(maxAwardScore, 15);
      else if (award.awardLevel === 'จังหวัด') maxAwardScore = Math.max(maxAwardScore, 10);
      else if (award.awardLevel === 'อำเภอ') maxAwardScore = Math.max(maxAwardScore, 5);
    });
    data.reg100_award_score = maxAwardScore;

    // Activity scores (5 if >= 3 activities with actual data)
    const internalActivitiesCount = data.reg100_activitiesWithinProvinceInternal?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    data.reg100_activity_within_province_internal_score = internalActivitiesCount >= 3 ? 5 : 0;
    
    const externalActivitiesCount = data.reg100_activitiesWithinProvinceExternal?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    data.reg100_activity_within_province_external_score = externalActivitiesCount >= 3 ? 5 : 0;
    
    const outsideActivitiesCount = data.reg100_activitiesOutsideProvince?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    data.reg100_activity_outside_province_score = outsideActivitiesCount >= 3 ? 5 : 0;

    // PR activity score (5 if >= 3 activities with actual data)
    const prActivitiesCount = data.reg100_prActivities?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    data.reg100_pr_activity_score = prActivitiesCount >= 3 ? 5 : 0;

    // Calculate total score
    data.reg100_total_score = 
      data.reg100_teacher_training_score +
      data.reg100_teacher_qualification_score +
      data.reg100_support_from_org_score +
      data.reg100_support_from_external_score +
      data.reg100_award_score +
      data.reg100_activity_within_province_internal_score +
      data.reg100_activity_within_province_external_score +
      data.reg100_activity_outside_province_score +
      data.reg100_pr_activity_score;

    console.log('📊 Calculated scores:', {
      reg100_teacher_training_score: data.reg100_teacher_training_score,
      reg100_teacher_qualification_score: data.reg100_teacher_qualification_score,
      reg100_support_from_org_score: data.reg100_support_from_org_score,
      reg100_support_from_external_score: data.reg100_support_from_external_score,
      reg100_award_score: data.reg100_award_score,
      reg100_activity_within_province_internal_score: data.reg100_activity_within_province_internal_score,
      reg100_activity_within_province_external_score: data.reg100_activity_within_province_external_score,
      reg100_activity_outside_province_score: data.reg100_activity_outside_province_score,
      reg100_pr_activity_score: data.reg100_pr_activity_score,
      reg100_total_score: data.reg100_total_score,
    });
  };

  // Handle success modal close - redirect to home page
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Redirect to home page
    window.location.href = '/';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 form={form} />;
      case 2:
        return <Step2 form={form} mgtImageFile={mgtImageFile} setMgtImageFile={setMgtImageFile} />;
      case 3:
        return <Step3 form={form} />;
      case 4:
        return <Step4 form={form} teacherImageFiles={teacherImageFiles} setTeacherImageFiles={setTeacherImageFiles} mgtImageFile={mgtImageFile} />;
      case 5:
        return <Step5 form={form} />;
      case 6:
        return <Step6 form={form} />;
      case 7:
        return <Step7 form={form} />;
      case 8:
        return <Step8 form={form} />;
      case 9:
        return <Step9 form={form} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background-light">
      {/* Progress Header */}
      <div className="bg-white border-b border-neutral-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00B050] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white text-[28px]">
                  app_registration
                </span>
              </div>
              <div>
                <h2 className="text-base font-normal text-gray-600 leading-tight">
                  แบบฟอร์มลงทะเบียน
                </h2>
                <p className="text-base font-normal text-gray-600 leading-tight">
                  ประเภทโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                ความคืบหน้า (PROGRESS)
              </p>
              <p className="text-2xl font-bold text-[#00B050]">
                {toThaiNumeral(currentStep)} / {toThaiNumeral(9)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="sticky top-16 z-40 bg-white shadow-sm border-b border-neutral-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => handleStepClick(step.number)}
                  data-testid={`step-${step.number}`}
                  className={`flex flex-col items-center ${
                    currentStep === step.number
                      ? 'text-[#00B050]'
                      : currentStep > step.number
                      ? 'text-[#00B050]/70'
                      : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      currentStep === step.number
                        ? 'bg-[#00B050] text-white'
                        : currentStep > step.number
                        ? 'bg-[#00B050]/70 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {toThaiNumeral(step.number)}
                  </div>
                  <span className="text-xs mt-1 text-center leading-tight hidden md:block">{step.title}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-1.5 ${
                      currentStep > step.number ? 'bg-[#00B050]/70' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Draft Save Message */}
        {draftSaveMessage && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              draftSaveMessage.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                {draftSaveMessage.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <p className="text-sm">{draftSaveMessage.text}</p>
            </div>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              data-testid="btn-back"
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ย้อนกลับ
            </button>

            <div className="flex gap-3">
              <SaveDraftButton
                formData={form.getValues()}
                currentStep={currentStep}
                submissionType="register100"
                onSaveSuccess={handleSaveDraftSuccess}
                onSaveError={handleSaveDraftError}
                getFormData={() => form.getValues()}
              />
              
              {currentStep < 9 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  data-testid="btn-next"
                  className="px-6 py-2 bg-[#00B050] text-white rounded-lg hover:bg-[#009040] transition-colors font-medium cursor-pointer"
                >
                  ถัดไป
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="btn-submit"
                  className="px-6 py-2 bg-[#00B050] text-white rounded-lg hover:bg-[#009040] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
                >
                  {isSubmitting ? 'กำลังส่ง...' : 'ส่งแบบฟอร์ม'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      
      {/* Consent Modal */}
      <ConsentModal />
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
      />
      
      {/* Validation Error Modal */}
      <ValidationErrorModal
        isOpen={showValidationErrorModal}
        onClose={() => setShowValidationErrorModal(false)}
      />
      
      {/* Missing Fields Modal */}
      <MissingFieldsModal
        isOpen={showMissingFieldsModal}
        onClose={() => setShowMissingFieldsModal(false)}
        missingFields={missingFieldsList}
      />

      {/* Teacher Info Modal */}
      <TeacherInfoModal
        isOpen={showTeacherInfoModal}
        onClose={() => setShowTeacherInfoModal(false)}
        onSubmit={handleTeacherInfoSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
    </>
  );
}
