'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register69Schema, Register69FormData } from '@/lib/validators/register69.schema';
import { STEP_FIELDS, STEP_TITLES } from '@/lib/constants/register69.steps';
import ConsentModal from '@/components/ui/ConsentModal';
import RestoreDraftModal from '@/components/ui/RestoreDraftModal';
import SuccessModal from '@/components/ui/SuccessModal';
import RegisterHeader from '@/components/ui/RegisterHeader';
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

    console.log('✅ Validation passed, proceeding with submission...');
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Get file inputs directly from DOM (for E2E test compatibility)
      const mgtImageInput = document.querySelector('input[name="mgtImage"]') as HTMLInputElement;
      const teacherImageInputs = document.querySelectorAll('input[name^="thaiMusicTeachers"][name$=".teacherImage"]') as NodeListOf<HTMLInputElement>;
      
      console.log('📁 Checking file inputs from DOM:');
      console.log('  - mgtImage input found:', !!mgtImageInput);
      console.log('  - mgtImage files:', mgtImageInput?.files?.length || 0);
      if (mgtImageInput?.files && mgtImageInput.files.length > 0) {
        console.log('  - mgtImage file 0:', mgtImageInput.files[0].name, mgtImageInput.files[0].size);
      } else {
        console.log('  ⚠️  No manager image file selected');
      }
      console.log('  - teacher image inputs found:', teacherImageInputs.length);
      teacherImageInputs.forEach((input, idx) => {
        console.log(`    - teacher ${idx} files:`, input.files?.length || 0);
        if (input.files && input.files.length > 0) {
          console.log(`      - file:`, input.files[0].name, input.files[0].size);
        }
      });
      
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
          // Get mgtImage from DOM instead of form data (for E2E compatibility)
          if (mgtImageInput?.files && mgtImageInput.files.length > 0) {
            formData.append('mgtImage', mgtImageInput.files[0]);
            console.log('  ✅ Added mgtImage from DOM:', mgtImageInput.files[0].name);
          } else if (value && value.length > 0) {
            // Fallback to form data
            formData.append('mgtImage', value[0]);
            console.log('  ✅ Added mgtImage from form data:', value[0].name);
          }
        } else if (key === 'thaiMusicTeachers' && Array.isArray(value)) {
          // Handle teacher array with images from DOM
          teacherImageInputs.forEach((input, index) => {
            if (input.files && input.files.length > 0) {
              formData.append(`teacherImage_${index}`, input.files[0]);
              console.log(`  ✅ Added teacherImage_${index} from DOM:`, input.files[0].name);
            }
          });
          
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

      const response = await fetch('/api/register-69', {
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
        return <Step2 form={form} />;
      case 3:
        return <Step3 form={form} />;
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
        {/* Sticky Header + Stepper */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          {/* Header */}
          <RegisterHeader
            currentStep={currentStep}
            totalSteps={7}
          />
          
          {/* Stepper */}
          <div className="border-b border-neutral-border">
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
                          ? 'text-primary'
                          : currentStep > step.number
                          ? 'text-primary/70'
                          : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                          currentStep === step.number
                            ? 'bg-primary text-white'
                            : currentStep > step.number
                            ? 'bg-primary/70 text-white'
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
                          currentStep > step.number ? 'bg-primary/70' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.error('❌ Form validation errors:', errors);
            // Don't show alert - errors are displayed under each field
          })}>
            {renderStep()}

            {/* Navigation Buttons (Non-fixed) */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                data-testid="btn-back"
                className="px-6 py-2 border border-neutral-border text-neutral-dark rounded-lg hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ย้อนกลับ
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={saveDraft}
                  data-testid="btn-save-draft"
                  className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5"
                >
                  บันทึกร่าง
                </button>

                {currentStep < 7 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    data-testid="btn-next"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    ถัดไป
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="btn-submit"
                    onClick={() => console.log('🖱️ Submit button clicked!')}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
