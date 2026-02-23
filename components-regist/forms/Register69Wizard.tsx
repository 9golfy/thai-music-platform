'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register69Schema, Register69FormData } from '@/lib/validators/register69.schema';
import { STEP_FIELDS, STEP_TITLES } from '@/lib/constants/register69.steps';
import ConsentModal from '@/components-regist/ui/ConsentModal';
import RestoreDraftModal from '@/components-regist/ui/RestoreDraftModal';
import SuccessModal from '@/components-regist/ui/SuccessModal';
import RegisterHeader from '@/components-regist/ui/RegisterHeader';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import Step6 from './steps/Step6';
import Step7 from './steps/Step7';

const DRAFT_KEY = 'register69_draft';
const STEPS = STEP_TITLES;

export default function Register69Wizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Store files in component state (not in react-hook-form)
  const [mgtImageFile, setMgtImageFile] = useState<File | null>(null);
  const [teacherImageFiles, setTeacherImageFiles] = useState<{ [key: number]: File }>({});

  const form = useForm<Register69FormData>({
    resolver: zodResolver(register69Schema),
    mode: 'onBlur', // Validate on blur to show errors immediately
    reValidateMode: 'onChange', // Re-validate on change after first blur
    defaultValues: {
      thaiMusicTeachers: [
        {
          teacherFullName: '',
          teacherPosition: '',
          teacherEducation: '',
          teacherPhone: '',
          teacherEmail: '',
        }
      ],
      currentTeachingPlans: [],
      availableInstruments: [],
      externalInstructors: [],
      inClassInstructionDurations: [],
      outOfClassInstructionDurations: [],
      supportFactors: [
        {
          sup_supportByAdmin: '',
          sup_supportBySchoolBoard: '',
          sup_supportByOthers: '',
          sup_supportByDescription: '',
          sup_supportByDate: '',
          sup_supportByDriveLink: '',
        }
      ],
      awards: [],
      classroomVideos: [],
      performanceVideos: [],
      instrumentSufficiency: false,
      instrumentINSufficiency: false,
      DCP_PR_Channel_FACEBOOK: false,
      DCP_PR_Channel_YOUTUBE: false,
      DCP_PR_Channel_Tiktok: false,
      heardFromOther: false,
      certifiedINFOByAdminName: false,
    },
  });

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      setShowRestoreModal(true);
    }
  }, []);

  const handleRestoreDraft = () => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const data = JSON.parse(draft);
      form.reset(data);
    }
    setShowRestoreModal(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowRestoreModal(false);
  };

  const saveDraft = () => {
    const data = form.getValues();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    alert('บันทึกร่างเรียบร้อยแล้ว');
  };

  // Single source of truth navigation function
  const goToStep = (targetStep: number) => {
    // Clamp step range to 1..7
    const clampedStep = Math.max(1, Math.min(7, targetStep));
    setCurrentStep(clampedStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation: Next button
  const handleNext = async () => {
    if (currentStep === 7) {
      // Step 7: trigger final submit
      form.handleSubmit(onSubmit)();
      return;
    }

    // Validate required fields for current step before navigation
    let requiredFields: any[] = [];
    
    if (currentStep === 1) {
      // Step 1 required fields: schoolName, schoolProvince, schoolLevel
      requiredFields = ['schoolName', 'schoolProvince', 'schoolLevel'];
    } else if (currentStep === 2) {
      // Step 2 required fields: mgtFullName, mgtPosition, mgtPhone
      requiredFields = ['mgtFullName', 'mgtPosition', 'mgtPhone'];
      
      // Also validate email if it's filled (to check format)
      const emailValue = form.getValues('mgtEmail');
      if (emailValue && emailValue.trim() !== '') {
        requiredFields.push('mgtEmail');
      }
    }
    // Steps 3-6: No required fields, allow navigation
    
    // Validate required fields
    if (requiredFields.length > 0) {
      const isValid = await form.trigger(requiredFields);
      if (!isValid) {
        // Show errors and remain on current step
        console.log('❌ Validation failed for step', currentStep);
        return;
      }
    }

    // Valid or no required fields: advance to next step
    goToStep(currentStep + 1);
  };

  // Navigation: Back button
  const handleBack = () => {
    // No validation on back
    goToStep(currentStep - 1);
  };

  // Navigation: Stepper click
  const handleStepClick = (step: number) => {
    goToStep(step);
  };

  const onSubmit = async (data: Register69FormData) => {
    console.log('🚀 onSubmit called with data:', data);
    console.log('📋 certifiedINFOByAdminName value:', data.certifiedINFOByAdminName);
    
    // Final submit validation: certifiedINFOByAdminName must be checked
    if (!data.certifiedINFOByAdminName) {
      console.error('❌ Certification checkbox not checked!');
      // Don't show alert - the error will be displayed under the checkbox
      // Trigger validation to show the error message
      await form.trigger('certifiedINFOByAdminName');
      return;
    }

    // Calculate teacher score before submission
    let teacherScore = 0;
    if (data.thaiMusicTeachers && Array.isArray(data.thaiMusicTeachers)) {
      data.thaiMusicTeachers.forEach((teacher) => {
        if (teacher?.teacherQualification && teacher.teacherQualification !== '') {
          teacherScore += 5;
        }
      });
    }
    console.log('🔢 Calculated teacher_score:', teacherScore);
    data.teacher_score = teacherScore;

    console.log('✅ Validation passed, proceeding with submission...');
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      console.log('📁 Checking files from state:');
      console.log('  - mgtImageFile:', mgtImageFile?.name || 'null');
      console.log('  - teacherImageFiles:', Object.keys(teacherImageFiles).length);
      
      // Append all fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'mediaPhotos') {
          // Handle multiple file uploads (mediaPhotos)
          if (value && value.length > 0) {
            Array.from(value as FileList).forEach((file) => {
              formData.append('mediaPhotos', file);
              console.log('  ✅ Added mediaPhoto:', file.name);
            });
          }
        } else if (key === 'mgtImage') {
          // Skip - will be handled from state
        } else if (key === 'thaiMusicTeachers' && Array.isArray(value)) {
          // Append the teacher data without images
          formData.append(key, JSON.stringify(value.map((t: any) => {
            const { teacherImage, ...rest } = t;
            return rest;
          })));
        } else if (Array.isArray(value)) {
          // Handle other arrays
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'boolean') {
          // Handle booleans
          formData.append(key, String(value));
        } else if (value !== undefined && value !== null) {
          // Handle other values - ensure postalCode is string
          formData.append(key, String(value));
        }
      });
      
      // Append files from state
      if (mgtImageFile) {
        formData.append('mgtImage', mgtImageFile);
        console.log('  ✅ Added mgtImage:', mgtImageFile.name, mgtImageFile.size);
      }
      
      Object.entries(teacherImageFiles).forEach(([index, file]) => {
        formData.append(`teacherImage_${index}`, file);
        console.log(`  ✅ Added teacherImage_${index}:`, file.name, file.size);
      });

      // Log FormData contents for debugging
      console.log('📦 FormData contents:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  - ${key}: FILE - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`  - ${key}: ${typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value}`);
        }
      }

      const response = await fetch('/api/register-100', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Form submitted successfully! ID:', result.id);
        // Clear draft and show success modal
        localStorage.removeItem(DRAFT_KEY);
        setShowSuccessModal(true);
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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
        return <Step3 form={form} teacherImageFiles={teacherImageFiles} setTeacherImageFiles={setTeacherImageFiles} />;
      case 4:
        return <Step4 form={form} />;
      case 5:
        return <Step5 form={form} />;
      case 6:
        return <Step6 form={form} />;
      case 7:
        return <Step7 form={form} onNavigateToStep={handleStepClick} />;
      default:
        return null;
    }
  };

  return (
    <>
      <ConsentModal />
      <RestoreDraftModal
        isOpen={showRestoreModal}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
      />

      <div className="min-h-screen bg-background-light">
        {/* Progress Header */}
        <div className="bg-white border-b border-neutral-border">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Logo + Title */}
              <div className="flex items-center gap-4">
                {/* Logo Icon */}
                <div className="w-12 h-12 bg-[#00B050] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-white text-[28px]">
                    app_registration
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-base font-normal text-gray-600 leading-tight">
                    แบบฟอร์มลงทะเบียน
                  </h2>
                  <p className="text-base font-normal text-gray-600 leading-tight">
                    ประเภทโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์
                  </p>
                </div>
              </div>

              {/* Right: Progress */}
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  ความคืบหน้า (PROGRESS)
                </p>
                <p className="text-2xl font-bold text-[#00B050]">
                  {currentStep} / 7
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
                        {step.number}
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
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
            // Validation errors are displayed under each field
            if (Object.keys(errors).length > 0) {
              console.log('⚠️ Please check form fields for errors');
            }
          })}>
            {renderStep()}

            {/* Navigation Buttons (Non-fixed) */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                data-testid="btn-back"
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ย้อนกลับ
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={saveDraft}
                  data-testid="btn-save-draft"
                  className="px-6 py-2 border-2 border-[#00B050] text-[#00B050] bg-white rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  บันทึกร่าง
                </button>

                {currentStep < 7 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    data-testid="btn-next"
                    className="px-6 py-2 bg-[#00B050] text-white rounded-lg hover:bg-[#009040] transition-colors font-medium"
                  >
                    ถัดไป
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="btn-submit"
                    onClick={() => console.log('🖱️ Submit button clicked!')}
                    className="px-6 py-2 bg-[#00B050] text-white rounded-lg hover:bg-[#009040] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isSubmitting ? 'กำลังส่ง...' : 'ส่งแบบฟอร์ม'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
