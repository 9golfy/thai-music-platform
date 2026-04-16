'use client';

import { useState } from 'react';
import EmailInputModal from './EmailInputModal';
import DraftSaveSuccessModal from './DraftSaveSuccessModal';
import { saveDraftToLocal } from '@/lib/utils/draftStorage';

interface SaveDraftButtonProps {
  formData: Record<string, any>;
  currentStep: number;
  submissionType: 'register100' | 'register-support';
  onSaveSuccess: (token: string) => void;
  onSaveError: (error: string) => void;
  getFormData?: () => Record<string, any>; // Function to get current form data
  mgtImageFile?: File | null; // Manager image file
  teacherImageFiles?: { [key: number]: File }; // Teacher image files
}

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Helper function to convert base64 to File
const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export default function SaveDraftButton({
  formData,
  currentStep,
  submissionType,
  onSaveSuccess,
  onSaveError,
  getFormData,
  mgtImageFile,
  teacherImageFiles,
}: SaveDraftButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedEmail, setSavedEmail] = useState('');

  const handleSaveDraft = async (email: string, phone: string) => {
    setIsLoading(true);

    try {
      // Get current form data (either from getFormData function or fallback to prop)
      const currentFormData = getFormData ? getFormData() : formData;
      
      // Generate temporary token for image uploads
      const tempToken = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      // Upload images if they exist
      const imageUrls: { [key: string]: string } = {};
      
      // Upload manager image
      if (mgtImageFile) {
        try {
          const formData = new FormData();
          formData.append('file', mgtImageFile);
          formData.append('draftToken', tempToken);
          formData.append('imageType', 'manager');
          
          const response = await fetch('/api/draft/upload-image', {
            method: 'POST',
            body: formData,
          });
          
          const result = await response.json();
          if (result.success) {
            imageUrls['mgtImage'] = result.url;
            console.log('✅ Manager image uploaded:', result.url);
          }
        } catch (error) {
          console.error('Error uploading manager image:', error);
        }
      }
      
      // Upload teacher images
      if (teacherImageFiles) {
        for (const [index, file] of Object.entries(teacherImageFiles)) {
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('draftToken', tempToken);
            formData.append('imageType', `teacher-${index}`);
            
            const response = await fetch('/api/draft/upload-image', {
              method: 'POST',
              body: formData,
            });
            
            const result = await response.json();
            if (result.success) {
              imageUrls[`teacherImage-${index}`] = result.url;
              console.log(`✅ Teacher ${index} image uploaded:`, result.url);
            }
          } catch (error) {
            console.error(`Error uploading teacher ${index} image:`, error);
          }
        }
      }
      
      // Add image URLs to form data
      currentFormData._draftImages = imageUrls;
      
      // SPECIAL HANDLING for register-support: Get support type fields from DOM
      if (submissionType === 'register-support') {
        console.log('🔍 Debugging DOM elements for register-support...');
        
        // Get current support type to determine which field to use
        const supportTypeInput = document.querySelector('input[name="supportType"]:checked') as HTMLInputElement;
        const currentSupportType = supportTypeInput?.value || currentFormData.supportType;
        
        console.log('🎯 Current support type:', currentSupportType);
        
        // Define field mapping
        const SUPPORT_TYPE_FIELD_MAP = {
          'สถานศึกษา': 'supportTypeSchoolName',
          'ชุมนุม': 'supportTypeClubName',
          'ชมรม': 'supportTypeAssociationName',
          'กลุ่ม': 'supportTypeGroupName',
          'วงดนตรีไทย': 'supportTypeBandName'
        };
        
        // Get all support type name fields
        const supportTypeSchoolNameInput = document.querySelector('input[name="supportTypeSchoolName"]') as HTMLInputElement;
        const supportTypeClubNameInput = document.querySelector('input[name="supportTypeClubName"]') as HTMLInputElement;
        const supportTypeAssociationNameInput = document.querySelector('input[name="supportTypeAssociationName"]') as HTMLInputElement;
        const supportTypeGroupNameInput = document.querySelector('input[name="supportTypeGroupName"]') as HTMLInputElement;
        const supportTypeBandNameInput = document.querySelector('input[name="supportTypeBandName"]') as HTMLInputElement;
        
        console.log('🎯 Support type fields:');
        console.log('   supportTypeSchoolName:', supportTypeSchoolNameInput?.value || 'empty');
        console.log('   supportTypeClubName:', supportTypeClubNameInput?.value || 'empty');
        console.log('   supportTypeAssociationName:', supportTypeAssociationNameInput?.value || 'empty');
        console.log('   supportTypeGroupName:', supportTypeGroupNameInput?.value || 'empty');
        console.log('   supportTypeBandName:', supportTypeBandNameInput?.value || 'empty');
        
        // Collect values from all fields
        if (supportTypeSchoolNameInput?.value) {
          currentFormData.supportTypeSchoolName = supportTypeSchoolNameInput.value;
          console.log('✅ Got supportTypeSchoolName:', supportTypeSchoolNameInput.value);
        }
        
        if (supportTypeClubNameInput?.value) {
          currentFormData.supportTypeClubName = supportTypeClubNameInput.value;
          console.log('✅ Got supportTypeClubName:', supportTypeClubNameInput.value);
        }
        
        if (supportTypeAssociationNameInput?.value) {
          currentFormData.supportTypeAssociationName = supportTypeAssociationNameInput.value;
          console.log('✅ Got supportTypeAssociationName:', supportTypeAssociationNameInput.value);
        }
        
        if (supportTypeGroupNameInput?.value) {
          currentFormData.supportTypeGroupName = supportTypeGroupNameInput.value;
          console.log('✅ Got supportTypeGroupName:', supportTypeGroupNameInput.value);
        }
        
        if (supportTypeBandNameInput?.value) {
          currentFormData.supportTypeBandName = supportTypeBandNameInput.value;
          console.log('✅ Got supportTypeBandName:', supportTypeBandNameInput.value);
        }
        
        // Member count is now handled by React Hook Form directly
        console.log('✅ Member count from React Hook Form:', currentFormData.supportTypeMemberCount);
        
        // Note: supportTypeTitle removed - use specific fields instead
        // Each support type has its own field: supportTypeGroupName, supportTypeClubName, etc.
      }
      
      console.log('💾 Saving draft with data:', {
        supportType: currentFormData.supportType,
        supportTypeGroupName: currentFormData.supportTypeGroupName,
        supportTypeMemberCount: currentFormData.supportTypeMemberCount,
        schoolName: currentFormData.schoolName
      });

      // Sanitize form data to prevent NaN and undefined values
      const sanitizeFormData = (data: Record<string, any>): Record<string, any> => {
        const sanitized: Record<string, any> = {};
        
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'number' && isNaN(value)) {
            // Convert NaN to empty string
            sanitized[key] = '';
            console.log(`🧹 Sanitized NaN value for ${key}`);
          } else if (value === undefined || value === null) {
            // Convert undefined/null to empty string
            sanitized[key] = '';
            console.log(`🧹 Sanitized undefined/null value for ${key}`);
          } else {
            sanitized[key] = value;
          }
        }
        
        return sanitized;
      };

      // Apply sanitization
      const sanitizedFormData = sanitizeFormData(currentFormData);
      
      console.log('🧼 Sanitized form data:', {
        supportType: sanitizedFormData.supportType,
        supportTypeGroupName: sanitizedFormData.supportTypeGroupName,
        supportTypeMemberCount: sanitizedFormData.supportTypeMemberCount,
        schoolName: sanitizedFormData.schoolName
      });

      // Save to LocalStorage immediately
      saveDraftToLocal({
        draftToken: null,
        email,
        phone,
        submissionType,
        formData: sanitizedFormData,
        currentStep,
        savedAt: Date.now(),
        syncedAt: null,
      });

      // Call API to save to database
      const response = await fetch('/api/draft/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone,
          submissionType,
          formData: sanitizedFormData,
          currentStep,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update LocalStorage with token
        saveDraftToLocal({
          draftToken: result.draftToken,
          email,
          phone,
          submissionType,
          formData: sanitizedFormData,
          currentStep,
          savedAt: Date.now(),
          syncedAt: Date.now(),
        });

        setSavedEmail(email);
        onSaveSuccess(result.draftToken);
        setIsModalOpen(false);
        setShowSuccessModal(true);
        
        // Auto-refresh after showing success modal for register-support
        if (submissionType === 'register-support') {
          setTimeout(() => {
            console.log('🔄 Auto-refreshing to load data from API...');
            window.location.reload();
          }, 2000); // Wait 2 seconds to show success message
        }
      } else {
        onSaveError(result.message || 'ไม่สามารถบันทึกแบบฟอร์มได้');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      onSaveError('เกิดข้อผิดพลาดในการบันทึกแบบฟอร์ม');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[20px]">save</span>
        บันทึกแบบร่าง
      </button>

      <EmailInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveDraft}
        isLoading={isLoading}
      />

      <DraftSaveSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        email={savedEmail}
      />
    </>
  );
}
