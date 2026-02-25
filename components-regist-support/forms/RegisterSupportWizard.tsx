'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSupportSchema, RegisterSupportFormData } from '@/lib/validators/registerSupport.schema';
import { STEP_TITLES } from '@/lib/constants/registerSupport.steps';
import ConsentModal from '@/components-regist-support/ui/ConsentModal';
import SuccessModal from '@/components-regist-support/ui/SuccessModal';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import Step6 from './steps/Step6';
import Step7 from './steps/Step7';
import Step8 from './steps/Step8';

const STEPS = STEP_TITLES;

export default function RegisterSupportWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const submissionAttempted = useRef(false);
  
  // Store files in component state
  const [mgtImageFile, setMgtImageFile] = useState<File | null>(null);
  const [teacherImageFiles, setTeacherImageFiles] = useState<{ [key: number]: File }>({});

  const form = useForm<RegisterSupportFormData>({
    resolver: zodResolver(registerSupportSchema),
    mode: 'onBlur',
    defaultValues: {
      thaiMusicTeachers: [],
      readinessItems: [],
      inClassInstructionDurations: [],
      outOfClassInstructionDurations: [],
      supportFactors: [],
      supportFromOrg: [],
      supportFromExternal: [],
      awards: [],
      activitiesWithinProvinceInternal: [],
      activitiesWithinProvinceExternal: [],
      activitiesOutsideProvince: [],
      prActivities: [],
      isCompulsorySubject: false,
      hasAfterSchoolTeaching: false,
      hasElectiveSubject: false,
      hasLocalCurriculum: false,
      hasSupportFromOrg: false,
      hasSupportFromExternal: false,
      DCP_PR_Channel_FACEBOOK: false,
      DCP_PR_Channel_YOUTUBE: false,
      DCP_PR_Channel_Tiktok: false,
      heardFromOther: false,
      certifiedINFOByAdminName: false,
      teacher_training_score: 0,
      teacher_qualification_score: 0,
      support_from_org_score: 0,
      support_from_external_score: 0,
      award_score: 0,
      activity_within_province_internal_score: 0,
      activity_within_province_external_score: 0,
      activity_outside_province_score: 0,
      pr_activity_score: 0,
      total_score: 0,
    },
  });

  const goToStep = (targetStep: number) => {
    const clampedStep = Math.max(1, Math.min(8, targetStep));
    setCurrentStep(clampedStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = async () => {
    // Prevent multiple submissions
    if (isSubmitting || showSuccessModal || submissionAttempted.current) {
      console.log('⚠️ Submission already in progress or completed');
      return;
    }

    if (currentStep === 8) {
      // Don't call form.handleSubmit here - let the form's onSubmit handle it
      return;
    }

    // Validate required fields for current step
    let requiredFields: any[] = [];
    
    if (currentStep === 1) {
      requiredFields = ['schoolName', 'schoolProvince', 'schoolLevel'];
    } else if (currentStep === 2) {
      requiredFields = ['mgtFullName', 'mgtPosition', 'mgtPhone'];
      const emailValue = form.getValues('mgtEmail');
      if (emailValue && emailValue.trim() !== '') {
        requiredFields.push('mgtEmail');
      }
    }
    
    if (requiredFields.length > 0) {
      const isValid = await form.trigger(requiredFields);
      if (!isValid) {
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

  const onSubmit = async (data: RegisterSupportFormData) => {
    console.log('🚀 Submitting form:', data);
    
    if (!data.certifiedINFOByAdminName) {
      await form.trigger('certifiedINFOByAdminName');
      return;
    }

    // Prevent double submission - check multiple guards
    if (isSubmitting || showSuccessModal || submissionAttempted.current) {
      console.log('⚠️ Already submitting or success modal shown, ignoring duplicate request');
      return;
    }

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
        
        setIsSubmitting(false);
        
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

  const calculateAllScores = (data: RegisterSupportFormData) => {
    // Teacher training score (5 points per checkbox, max 20)
    let trainingScore = 0;
    if (data.isCompulsorySubject) trainingScore += 5;
    if (data.hasAfterSchoolTeaching) trainingScore += 5;
    if (data.hasElectiveSubject) trainingScore += 5;
    if (data.hasLocalCurriculum) trainingScore += 5;
    data.teacher_training_score = trainingScore;

    // Teacher qualification score (5 points per unique qualification type, max 20)
    const uniqueQualifications = new Set<string>();
    data.thaiMusicTeachers?.forEach((teacher) => {
      if (teacher.teacherQualification && teacher.teacherQualification.trim() !== '') {
        uniqueQualifications.add(teacher.teacherQualification);
      }
    });
    data.teacher_qualification_score = uniqueQualifications.size * 5;

    // Support from org score (5 if checked)
    data.support_from_org_score = data.hasSupportFromOrg ? 5 : 0;

    // Support from external score (5/10/15 based on count)
    // Only count items that have organization filled
    const externalCount = data.supportFromExternal?.filter(
      item => item.organization && item.organization.trim() !== ''
    ).length || 0;
    if (externalCount >= 3) {
      data.support_from_external_score = 15;
    } else if (externalCount === 2) {
      data.support_from_external_score = 10;
    } else if (externalCount === 1) {
      data.support_from_external_score = 5;
    } else {
      data.support_from_external_score = 0;
    }

    // Award score (highest level only)
    let maxAwardScore = 0;
    data.awards?.forEach((award) => {
      if (award.awardLevel === 'ประเทศ') maxAwardScore = Math.max(maxAwardScore, 20);
      else if (award.awardLevel === 'ภาค') maxAwardScore = Math.max(maxAwardScore, 15);
      else if (award.awardLevel === 'จังหวัด') maxAwardScore = Math.max(maxAwardScore, 10);
      else if (award.awardLevel === 'อำเภอ') maxAwardScore = Math.max(maxAwardScore, 5);
    });
    data.award_score = maxAwardScore;

    // Activity scores (5 if >= 3 activities with actual data)
    const internalActivitiesCount = data.activitiesWithinProvinceInternal?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    data.activity_within_province_internal_score = internalActivitiesCount >= 3 ? 5 : 0;
    
    const externalActivitiesCount = data.activitiesWithinProvinceExternal?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    data.activity_within_province_external_score = externalActivitiesCount >= 3 ? 5 : 0;
    
    const outsideActivitiesCount = data.activitiesOutsideProvince?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    data.activity_outside_province_score = outsideActivitiesCount >= 3 ? 5 : 0;

    // PR activity score (5 if >= 3 activities with actual data)
    const prActivitiesCount = data.prActivities?.filter(
      item => item.activityName && item.activityName.trim() !== ''
    ).length || 0;
    data.pr_activity_score = prActivitiesCount >= 3 ? 5 : 0;

    // Calculate total score
    data.total_score = 
      data.teacher_training_score +
      data.teacher_qualification_score +
      data.support_from_org_score +
      data.support_from_external_score +
      data.award_score +
      data.activity_within_province_internal_score +
      data.activity_within_province_external_score +
      data.activity_outside_province_score +
      data.pr_activity_score;

    console.log('📊 Calculated scores:', {
      teacher_training_score: data.teacher_training_score,
      teacher_qualification_score: data.teacher_qualification_score,
      support_from_org_score: data.support_from_org_score,
      support_from_external_score: data.support_from_external_score,
      award_score: data.award_score,
      activity_within_province_internal_score: data.activity_within_province_internal_score,
      activity_within_province_external_score: data.activity_within_province_external_score,
      activity_outside_province_score: data.activity_outside_province_score,
      pr_activity_score: data.pr_activity_score,
      total_score: data.total_score,
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
      default:
        return null;
    }
  };

  return (
    <>
      <ConsentModal />
      
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
                {currentStep} / 8
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {renderStep()}

          {/* Navigation Buttons */}
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
              {currentStep < 8 ? (
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
                  className="px-6 py-2 bg-[#00B050] text-white rounded-lg hover:bg-[#009040] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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
    </div>
    </>
  );
}
