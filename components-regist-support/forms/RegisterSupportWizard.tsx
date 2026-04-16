'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSupportSchema, RegisterSupportFormData } from '@/lib/validators/registerSupport.schema';
import { STEP_TITLES } from '@/lib/constants/registerSupport.steps';
import { getDraftFromLocal } from '@/lib/utils/draftStorage';
import SuccessModal from '@/components-regist-support/ui/SuccessModal';
import ValidationErrorModal from '@/components-regist-support/ui/ValidationErrorModal';
import MissingFieldsModal from '@/components-regist-support/ui/MissingFieldsModal';
import TeacherInfoModal from '@/components-regist-support/ui/TeacherInfoModal';
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

const toThaiNumerals = (value: number | string) =>
  String(value);

export default function RegisterSupportWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
  const [showTeacherInfoModal, setShowTeacherInfoModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isRestoringData, setIsRestoringData] = useState(false);
  const [draftSaveMessage, setDraftSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [teacherInfo, setTeacherInfo] = useState<{ email: string; phone: string } | null>(null);
  const submissionAttempted = useRef(false);
  
  // Custom function to get complete form data
  const getCompleteFormData = () => {
    console.log('🔍 Getting complete form data...');
    
    // Get current form values - React Hook Form now has correct values
    const formValues = form.getValues();
    console.log('📋 Form values from React Hook Form:', {
      supportType: formValues.regsup_supportType,
      supportTypeMemberCount: formValues.regsup_supportTypeMemberCount,
      schoolName: formValues.regsup_schoolName
    });
    
    return formValues;
  };

  // Store files in component state
  const [mgtImageFile, setMgtImageFile] = useState<File | null>(null);
  const [teacherImageFiles, setTeacherImageFiles] = useState<{ [key: number]: File }>({});
  const form = useForm<RegisterSupportFormData>({
    mode: 'onBlur',
    defaultValues: {
      regsup_thaiMusicTeachers: [],
      regsup_readinessItems: [],
      regsup_inClassInstructionDurations: [],
      regsup_outOfClassInstructionDurations: [],
      regsup_supportFactors: [],
      regsup_supportFromOrg: [],
      regsup_supportFromExternal: [],
      regsup_awards: [],
      regsup_activitiesWithinProvinceInternal: [],
      regsup_activitiesWithinProvinceExternal: [],
      regsup_activitiesOutsideProvince: [],
      regsup_prActivities: [],
      regsup_isCompulsorySubject: false,
      regsup_hasAfterSchoolTeaching: false,
      regsup_hasElectiveSubject: false,
      regsup_hasLocalCurriculum: false,
      regsup_hasSupportFromOrg: false,
      regsup_hasSupportFromExternal: false,
      regsup_DCP_PR_Channel_FACEBOOK: false,
      regsup_DCP_PR_Channel_YOUTUBE: false,
      regsup_DCP_PR_Channel_Tiktok: false,
      regsup_heardFromOther: false,
      regsup_certifiedByAdmin: false,
      regsup_affiliationDetail: '',
      regsup_teacher_training_score: 0,
      regsup_teacher_qualification_score: 0,
      regsup_support_from_org_score: 0,
      regsup_support_from_external_score: 0,
      regsup_award_score: 0,
      regsup_activity_within_province_internal_score: 0,
      regsup_activity_within_province_external_score: 0,
      regsup_activity_outside_province_score: 0,
      regsup_pr_activity_score: 0,
      regsup_total_score: 0,
    },
  });

  // Debug: Expose form and getCompleteFormData to window for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).debugForm = form;
      (window as any).debugGetCompleteFormData = getCompleteFormData;
      console.log('🔧 Debug: Form and getCompleteFormData exposed to window');
    }
  }, [form]);

  // Load draft from URL token or localStorage
  useEffect(() => {
    const loadDraftData = async () => {
      console.log('🔄 RegisterSupportWizard: Loading draft data...');
      
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
              
              // Set restoration flag
              setIsRestoringData(true);
                
                // Special handling for register-support field mapping
                const processedData = { ...result.formData };
                
                // NO MAPPING - Keep fields separate
                // schoolName = ชื่อสถานศึกษาในส่วนข้อมูลพื้นฐาน
                // supportTypeName = ชื่อที่กรอกในแต่ละ radio option (แยกจาก schoolName)
                console.log('📋 Form data fields:', {
                  supportType: processedData.supportType,
                  supportTypeName: processedData.supportTypeName, // Keep for backward compatibility
                  schoolName: processedData.schoolName
                });
                
                // Method 1: Set critical fields first
                if (processedData.supportType) {
                  form.setValue('regsup_supportType', processedData.supportType, { 
                    shouldValidate: false,
                    shouldDirty: true,
                    shouldTouch: true
                  });
                  console.log('✅ Support type set from API:', processedData.supportType);
                }
                
                // Note: supportTypeTitle removed - using specific fields instead
                
                if (processedData.schoolName) {
                  form.setValue('regsup_schoolName', processedData.schoolName, { 
                    shouldValidate: false,
                    shouldDirty: true,
                    shouldTouch: true
                  });
                  console.log('✅ School name set from API:', processedData.schoolName);
                }
                
                // Method 2: Reset with all processed data
                const mergedData = {
                  ...form.formState.defaultValues,
                  ...processedData
                };
                
                form.reset(mergedData);
                
                // Method 3: Set all fields individually with processed data
                Object.entries(processedData).forEach(([key, value]) => {
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
                
                // Restore images from URLs
                if (processedData._draftImages) {
                  console.log('🖼️ Restoring images from URLs...');
                  const imageUrls = processedData._draftImages;
                  
                  // Restore manager image
                  if (imageUrls.mgtImage) {
                    try {
                      const response = await fetch(imageUrls.mgtImage);
                      const blob = await response.blob();
                      const fileName = imageUrls.mgtImage.split('/').pop() || 'manager.jpg';
                      const file = new File([blob], fileName, { type: blob.type });
                      setMgtImageFile(file);
                      console.log('✅ Manager image restored');
                    } catch (error) {
                      console.error('Error restoring manager image:', error);
                    }
                  }
                  
                  // Restore teacher images
                  const restoredTeacherImages: { [key: number]: File } = {};
                  for (const [key, url] of Object.entries(imageUrls)) {
                    if (key.startsWith('teacherImage-')) {
                      const index = parseInt(key.replace('teacherImage-', ''));
                      try {
                        const response = await fetch(url as string);
                        const blob = await response.blob();
                        const fileName = (url as string).split('/').pop() || `teacher-${index}.jpg`;
                        const file = new File([blob], fileName, { type: blob.type });
                        restoredTeacherImages[index] = file;
                        console.log(`✅ Teacher ${index} image restored`);
                      } catch (error) {
                        console.error(`Error restoring teacher ${index} image:`, error);
                      }
                    }
                  }
                  if (Object.keys(restoredTeacherImages).length > 0) {
                    setTeacherImageFiles(restoredTeacherImages);
                  }
                }
                
                // Restore current step
                if (result.currentStep) {
                  console.log('📍 Restoring step from API:', result.currentStep);
                  setCurrentStep(result.currentStep);
                }
                
                // IMPORTANT: Re-apply critical fields after form.trigger() to avoid being cleared by Step1 useEffect
                setTimeout(() => {
                  // Note: supportTypeTitle removed - using specific fields instead
                  console.log('🔄 Form restoration completed');
                }, 100);
                
                // Show success message
                setDraftSaveMessage({
                  type: 'success',
                  text: 'โหลดข้อมูลที่บันทึกไว้เรียบร้อยแล้ว',
                });
                
                // Clear restoration flag after a delay
                setTimeout(() => {
                  setIsRestoringData(false);
                }, 500);
                
                setTimeout(() => {
                  setDraftSaveMessage(null);
                }, 5000);
                
                // Verify restoration
                setTimeout(() => {
                  const finalValues = form.getValues();
                  console.log('✅ Form restoration completed from API (register-support):', {
                    schoolName: finalValues.regsup_schoolName,
                    success: finalValues.regsup_schoolName === result.formData.schoolName
                  });
                  
                  // DOM fallback if needed
                  if (!finalValues.regsup_schoolName && result.formData.schoolName) {
                    console.log('🔧 Applying DOM fallback...');
                    const schoolNameInput = document.querySelector('input[name="schoolName"]') as HTMLInputElement;
                    if (schoolNameInput) {
                      schoolNameInput.value = result.formData.schoolName;
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
        const draft = getDraftFromLocal('register-support');
        
        if (draft && draft.formData) {
          console.log('✅ Draft data found in localStorage:', {
            email: draft.email,
            token: draft.draftToken,
            schoolName: draft.formData.schoolName,
            keys: Object.keys(draft.formData).length
          });
          
          // Restore form data from localStorage
          console.log('🚀 Restoring form data from localStorage...');
          
          // Special handling for register-support field mapping
          const processedData = { ...draft.formData };
          
          // Handle supportType and supportTypeName mapping
          // Only map schoolName to supportTypeName if supportType is "สถานศึกษา" 
          // AND supportTypeName is empty AND schoolName has value
          if (processedData.supportType === 'สถานศึกษา' && 
              processedData.schoolName && 
              (!processedData.supportTypeName || processedData.supportTypeName.trim() === '')) {
            // For "สถานศึกษา" type, the school name should be in supportTypeName field
            processedData.supportTypeName = processedData.schoolName;
            console.log('🔄 Mapped schoolName to supportTypeName for สถานศึกษา type:', processedData.schoolName);
          }
          
          // Method 1: Set critical fields first
          if (processedData.supportType) {
            form.setValue('regsup_supportType', processedData.supportType, { 
              shouldValidate: false,
              shouldDirty: true,
              shouldTouch: true
            });
            console.log('✅ Support type set from localStorage:', processedData.supportType);
          }
          
          if (processedData.supportTypeName) {
            form.setValue('regsup_supportTypeName', processedData.supportTypeName, { 
              shouldValidate: false,
              shouldDirty: true,
              shouldTouch: true
            });
            console.log('✅ Support type name set from localStorage:', processedData.supportTypeName);
          }
          
          if (processedData.schoolName) {
            form.setValue('regsup_schoolName', processedData.schoolName, { 
              shouldValidate: false,
              shouldDirty: true,
              shouldTouch: true
            });
            console.log('✅ School name set from localStorage:', processedData.schoolName);
          }
          
          // Method 2: Reset with all processed data
          const mergedData = {
            ...form.formState.defaultValues,
            ...processedData
          };
          
          form.reset(mergedData);
          
          // Method 3: Set all fields individually with processed data
          Object.entries(processedData).forEach(([key, value]) => {
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
          
          // IMPORTANT: Set supportTypeName AFTER form.trigger() to avoid being cleared by Step1 useEffect
          setTimeout(() => {
            if (processedData.supportType === 'สถานศึกษา' && processedData.supportTypeName) {
              form.setValue('regsup_supportTypeName', processedData.supportTypeName, { 
                shouldValidate: false,
                shouldDirty: true,
                shouldTouch: true
              });
              console.log('🔄 Re-applied supportTypeName after useEffect:', processedData.supportTypeName);
            }
          }, 100);
          
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
            console.log('✅ Form restoration completed from localStorage (register-support):', {
              schoolName: finalValues.regsup_schoolName,
              success: finalValues.regsup_schoolName === draft.formData.schoolName
            });
            
            // DOM fallback if needed
            if (!finalValues.regsup_schoolName && draft.formData.schoolName) {
              console.log('🔧 Applying DOM fallback...');
              const schoolNameInput = document.querySelector('input[name="schoolName"]') as HTMLInputElement;
              if (schoolNameInput) {
                schoolNameInput.value = draft.formData.schoolName;
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
    // Prevent multiple submissions
    if (isSubmitting || showSuccessModal || submissionAttempted.current) {
      console.log('⚠️ Submission already in progress or completed');
      return;
    }

    if (currentStep === 9) {
      // Don't call form.handleSubmit here - let the form's onSubmit handle it
      return;
    }

    // Validate required fields for current step - use regsup_ prefix for register-support form
    let requiredFields: any[] = [];
    
    if (currentStep === 1) {
      requiredFields = ['regsup_schoolName', 'regsup_schoolProvince', 'regsup_schoolLevel'];
    } else if (currentStep === 2) {
      requiredFields = ['regsup_mgtFullName', 'regsup_mgtPosition', 'regsup_mgtPhone'];
      const emailValue = form.getValues('regsup_mgtEmail');
      if (emailValue && emailValue.trim() !== '') {
        requiredFields.push('regsup_mgtEmail');
      }
    } else if (currentStep === 7) {
      // Check for required photo and video links
      const photoLink = form.getValues('regsup_photoGalleryLink');
      const videoLink1 = form.getValues('regsup_videoLink');
      const videoLink2 = form.getValues('regsup_videoLink2');
      
      if (!photoLink || !videoLink1 || !videoLink2) {
        alert('กรุณากรอกข้อมูล ภาพถ่ายผลงาน และวีดิโอ/คลิป ให้ครบถ้วน');
        return;
      }
    }
    
    if (requiredFields.length > 0) {
      const isValid = await form.trigger(requiredFields);
      if (!isValid) {
        // Show validation modal
        setShowValidationModal(true);
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
      text: `บันทึกแบบฟอร์มสำเร็จ! กำลังโหลดข้อมูลจาก API...`,
    });
    
    // Load data from API immediately after save
    setTimeout(async () => {
      try {
        console.log('🔄 Loading saved data from API with token:', token);
        const response = await fetch(`/api/draft/${token}/data`);
        const result = await response.json();
        
        if (result.success && result.exists && result.formData) {
          console.log('✅ Reloading form data from API after save:', result.formData);
          
          // Set restoration flag
          setIsRestoringData(true);
          
          // Reset form with API data
          const processedData = { ...result.formData };
          
          // Note: supportTypeTitle removed - using specific fields instead
          console.log('✅ Restored form data from localStorage');
          
          // Reset all form data
          form.reset({
            ...form.formState.defaultValues,
            ...processedData
          });
          
          // Clear restoration flag
          setTimeout(() => {
            setIsRestoringData(false);
          }, 500);
          
          setDraftSaveMessage({
            type: 'success',
            text: 'บันทึกและโหลดข้อมูลสำเร็จ!',
          });
        }
      } catch (error) {
        console.error('❌ Error reloading data from API:', error);
        setDraftSaveMessage({
          type: 'error',
          text: 'บันทึกสำเร็จ แต่ไม่สามารถโหลดข้อมูลกลับมาได้',
        });
      }
    }, 1000);
    
    setTimeout(() => setDraftSaveMessage(null), 5000);
  };

  const handleSaveDraftError = (error: string) => {
    setDraftSaveMessage({
      type: 'error',
      text: error,
    });
    setTimeout(() => setDraftSaveMessage(null), 5000);
  };

  const onSubmit = async (data: RegisterSupportFormData) => {
    console.log('🚀 Submitting form:', data);
    
    // Check certification checkbox first
    if (!data.regsup_certifiedByAdmin) {
      const missing: string[] = [];
      missing.push('การรับรองข้อมูล - กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูลเป็นความจริง (Step 9)');
      setMissingFields(missing);
      setShowMissingFieldsModal(true);
      return;
    }

    // Validate all required fields - use regsup_ prefix for register-support form
    const missing: string[] = [];
    
    // Step 1 validation - use regsup_ prefixed fields
    if (!data.regsup_schoolName || data.regsup_schoolName.trim() === '') {
      missing.push('ชื่อสถานศึกษา (Step 1)');
    }
    if (!data.regsup_schoolProvince || data.regsup_schoolProvince.trim() === '') {
      missing.push('จังหวัด (Step 1)');
    }
    if (!data.regsup_schoolLevel) {
      missing.push('ระดับสถานศึกษา (Step 1)');
    }
    
    // Step 2 validation - use regsup_ prefixed fields
    if (!data.regsup_mgtFullName || data.regsup_mgtFullName.trim() === '') {
      missing.push('ชื่อ-นามสกุล ผู้บริหาร (Step 2)');
    }
    if (!data.regsup_mgtPosition || data.regsup_mgtPosition.trim() === '') {
      missing.push('ตำแหน่ง ผู้บริหาร (Step 2)');
    }
    if (!data.regsup_mgtPhone || data.regsup_mgtPhone.trim() === '') {
      missing.push('เบอร์โทรศัพท์ ผู้บริหาร (Step 2)');
    }
    
    // If there are missing fields, show modal
    if (missing.length > 0) {
      setMissingFields(missing);
      setShowMissingFieldsModal(true);
      return;
    }

    // Prevent double submission - check multiple guards
    if (isSubmitting || showSuccessModal || submissionAttempted.current) {
      console.log('⚠️ Already submitting or success modal shown, ignoring duplicate request');
      return;
    }

    // Show teacher info modal instead of submitting directly
    console.log('📝 Showing teacher info modal...');
    setShowTeacherInfoModal(true);
  };

  // New function to handle actual submission after teacher info is provided
  const handleFinalSubmit = async (data: RegisterSupportFormData, teacherData: { email: string; phone: string }) => {
    console.log('🚀 Final submission with teacher info:', { teacherData });

    // Mark submission as attempted
    submissionAttempted.current = true;

    // Calculate all scores before submission
    calculateAllScores(data);

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Get supportTypeName and supportTypeMemberCount from DOM (bypassing React Hook Form)
      const supportTypeNameInput = document.querySelector('input[name="supportTypeName"]') as HTMLInputElement;
      const supportTypeMemberCountInput = document.querySelector('input[name="supportTypeMemberCount"]') as HTMLInputElement;
      
      const supportTypeName = supportTypeNameInput?.value || '';
      const supportTypeMemberCount = supportTypeMemberCountInput?.value || '';
      
      console.log('📝 Support type fields from DOM:', { supportTypeName, supportTypeMemberCount });
      
      // Add teacher info to form data
      formData.append('teacherEmail', teacherData.email);
      formData.append('teacherPhone', teacherData.phone);
      
      // Append all fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'mgtImage') {
          // Skip - will be handled from state
        } else if (key === 'supportTypeName') {
          // Use value from DOM instead
          if (supportTypeName) {
            formData.append(key, supportTypeName);
          }
        } else if (key === 'supportTypeMemberCount') {
          // Use value from DOM instead
          if (supportTypeMemberCount) {
            formData.append(key, supportTypeMemberCount);
          }
        } else if (key === 'thaiMusicTeachers' && Array.isArray(value)) {
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
      if (mgtImageFile) {
        formData.append('mgtImage', mgtImageFile);
      }
      
      Object.entries(teacherImageFiles).forEach(([index, file]) => {
        formData.append(`teacherImage_${index}`, file);
      });

      const response = await fetch('/api/register-support', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Form submitted successfully! ID:', result.id);
        
        // Reset submission state first
        setIsSubmitting(false);
        
        // Small delay to ensure state update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Close teacher info modal
        setShowTeacherInfoModal(false);
        
        // Show success modal
        console.log('📊 Showing success modal');
        setShowSuccessModal(true);
      } else {
        setIsSubmitting(false);
        alert('เกิดข้อผิดพลาด: ' + result.message);
        submissionAttempted.current = false;
      }
    } catch (error) {
      setIsSubmitting(false);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
      console.error(error);
      submissionAttempted.current = false;
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

  const calculateAllScores = (data: RegisterSupportFormData) => {
    // Teacher training score - For register-support, give full 20 points since there are no checkboxes
    // (register-support focuses on supporting schools, not detailed curriculum structure)
    data.regsup_teacher_training_score = 20;

    // Teacher qualification score (5 points per unique qualification type, max 20)
    const uniqueQualifications = new Set<string>();
    data.regsup_thaiMusicTeachers?.forEach((teacher) => {
      if (teacher.teacherQualification && teacher.teacherQualification.trim() !== '') {
        uniqueQualifications.add(teacher.teacherQualification);
      }
    });
    data.regsup_teacher_qualification_score = uniqueQualifications.size * 5;

    // Support from org score (5 if checked)
    data.regsup_support_from_org_score = data.regsup_hasSupportFromOrg ? 5 : 0;

    // Support from external score (5/10/15 based on count)
    // Only count items that have organization filled
    const externalCount = data.regsup_supportFromExternal?.filter(
      item => item.organization && item.organization.trim() !== ''
    ).length || 0;
    if (externalCount >= 3) {
      data.regsup_support_from_external_score = 15;
    } else if (externalCount === 2) {
      data.regsup_support_from_external_score = 10;
    } else if (externalCount === 1) {
      data.regsup_support_from_external_score = 5;
    } else {
      data.regsup_support_from_external_score = 0;
    }

    // Award score (highest level only)
    let maxAwardScore = 0;
    data.regsup_awards?.forEach((award) => {
      if (award.awardLevel === 'ประเทศ') maxAwardScore = Math.max(maxAwardScore, 20);
      else if (award.awardLevel === 'ภาค') maxAwardScore = Math.max(maxAwardScore, 15);
      else if (award.awardLevel === 'จังหวัด') maxAwardScore = Math.max(maxAwardScore, 10);
      else if (award.awardLevel === 'อำเภอ') maxAwardScore = Math.max(maxAwardScore, 5);
    });
    data.regsup_award_score = maxAwardScore;

    // Activity scores (5 if >= 3 activities with actual data)
    const internalActivitiesCount = data.regsup_activitiesWithinProvinceInternal?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    data.regsup_activity_within_province_internal_score = internalActivitiesCount >= 3 ? 5 : 0;
    
    const externalActivitiesCount = data.regsup_activitiesWithinProvinceExternal?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    data.regsup_activity_within_province_external_score = externalActivitiesCount >= 3 ? 5 : 0;
    
    const outsideActivitiesCount = data.regsup_activitiesOutsideProvince?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    data.regsup_activity_outside_province_score = outsideActivitiesCount >= 3 ? 5 : 0;

    // PR activity score (5 if >= 3 activities with actual data)
    const prActivitiesCount = data.regsup_prActivities?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    data.regsup_pr_activity_score = prActivitiesCount >= 3 ? 5 : 0;

    // Calculate total score
    data.regsup_total_score = 
      data.regsup_teacher_training_score +
      data.regsup_teacher_qualification_score +
      data.regsup_support_from_org_score +
      data.regsup_support_from_external_score +
      data.regsup_award_score +
      data.regsup_activity_within_province_internal_score +
      data.regsup_activity_within_province_external_score +
      data.regsup_activity_outside_province_score +
      data.regsup_pr_activity_score;

    console.log('📊 Calculated scores:', {
      teacher_training_score: data.regsup_teacher_training_score,
      teacher_qualification_score: data.regsup_teacher_qualification_score,
      support_from_org_score: data.regsup_support_from_org_score,
      support_from_external_score: data.regsup_support_from_external_score,
      award_score: data.regsup_award_score,
      activity_within_province_internal_score: data.regsup_activity_within_province_internal_score,
      activity_within_province_external_score: data.regsup_activity_within_province_external_score,
      activity_outside_province_score: data.regsup_activity_outside_province_score,
      pr_activity_score: data.regsup_pr_activity_score,
      total_score: data.regsup_total_score,
    });
  };

  // Handle success modal close - redirect to home page
  const handleSuccessModalClose = () => {
    console.log('🔄 Closing success modal and redirecting to home');
    setShowSuccessModal(false);
    // Redirect to home page
    window.location.href = '/';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 form={form} isRestoringData={isRestoringData} />;
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
                  ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                ความคืบหน้า (PROGRESS)
              </p>
              <p className="text-2xl font-bold text-[#00B050]">
                {toThaiNumerals(currentStep)} / {toThaiNumerals(9)}
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
                    {toThaiNumerals(step.number)}
                  </div>
                  <span className="text-xs mt-1 hidden md:block">{step.title}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
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
                submissionType="register-support"
                onSaveSuccess={handleSaveDraftSuccess}
                onSaveError={handleSaveDraftError}
                getFormData={getCompleteFormData}
                mgtImageFile={mgtImageFile}
                teacherImageFiles={teacherImageFiles}
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
                  type="button"
                  onClick={() => form.handleSubmit(onSubmit)()}
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
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
      />
      
      {/* Validation Error Modal */}
      <ValidationErrorModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
      />
      
      {/* Missing Fields Modal */}
      <MissingFieldsModal
        isOpen={showMissingFieldsModal}
        onClose={() => setShowMissingFieldsModal(false)}
        missingFields={missingFields}
      />

      {/* Teacher Info Modal */}
      <TeacherInfoModal
        isOpen={showTeacherInfoModal}
        onClose={() => {
          setShowTeacherInfoModal(false);
          submissionAttempted.current = false; // Reset submission flag
        }}
        onSubmit={handleTeacherInfoSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
    </>
  );
}
