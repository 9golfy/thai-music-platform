'use client';

import { useEffect, useState } from 'react';
import { getDraftFromLocal } from '@/lib/utils/draftStorage';

const CONSENT_KEY = 'regsup_consent_accepted';

export default function ConsentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let recheckCount = 0;
    const maxRechecks = 3;

    const performCheck = async () => {
      if (!mounted) return;
      
      await checkConsentStatus();
      
      // If still loading and haven't reached max rechecks, try again
      if (mounted && isLoading && recheckCount < maxRechecks) {
        recheckCount++;
        console.log(`🔄 Recheck attempt ${recheckCount}/${maxRechecks} (register-support)`);
        setTimeout(performCheck, 1000);
      }
    };

    // Initial check with small delay
    const initialTimeout = setTimeout(performCheck, 300);

    return () => {
      mounted = false;
      clearTimeout(initialTimeout);
    };
  }, [isLoading]);

  const checkConsentStatus = async () => {
    console.log('🔍 ConsentModal (register-support): Checking consent status...');
    
    try {
      // First check localStorage (for same browser)
      const localConsent = localStorage.getItem(CONSENT_KEY);
      console.log('📱 LocalStorage consent:', localConsent);
      
      if (localConsent === 'true') {
        console.log('✅ Found local consent, hiding modal');
        setIsOpen(false);
        setIsLoading(false);
        return;
      }

      // Wait a bit for OTP verification to complete if needed
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if we have draft data (from OTP verification)
      const draftData = getDraftFromLocal('register-support');
      console.log('📋 Draft data:', draftData ? 'Found' : 'Not found');
      
      if (draftData && draftData.email) {
        console.log('📧 Draft email:', draftData.email);
        console.log('🔍 Checking database consent...');
        
        // Check database for consent status
        const response = await fetch('/api/consent/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: draftData.email,
            submissionType: 'register-support'
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log('🌐 API response:', result);
        
        if (result.success && result.hasConsented) {
          console.log('✅ User has consented before, hiding modal');
          // User has consented before, save to localStorage and don't show modal
          localStorage.setItem(CONSENT_KEY, 'true');
          setIsOpen(false);
        } else {
          console.log('❌ User has not consented, showing modal');
          // User hasn't consented, show modal
          setIsOpen(true);
        }
      } else {
        console.log('❌ No draft data, showing modal for new users');
        // No draft data, show modal for new users
        setIsOpen(true);
      }
    } catch (error) {
      console.error('❌ Error checking consent status:', error);
      // On error, show modal to be safe
      console.log('❌ Error occurred, showing modal as fallback');
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      // Save to localStorage
      localStorage.setItem(CONSENT_KEY, 'true');
      
      // Save to database if we have user info
      const draftData = getDraftFromLocal('register-support');
      if (draftData && draftData.email) {
        await fetch('/api/consent/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: draftData.email,
            submissionType: 'register-support'
          }),
        });
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving consent:', error);
      // Still close modal even if DB save fails
      setIsOpen(false);
    }
  };

  // Prevent closing by ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen]);

  // Show loading state
  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!isOpen) return null;

  return (
    <div
      data-testid="consent-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
      onClick={(e) => {
        // Prevent closing by clicking overlay
        e.stopPropagation();
      }}
    >
      <div
        className="relative max-w-3xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Outer frame - light blue */}
        <div className="bg-blue-50 rounded-lg p-6 shadow-lg border border-blue-200">
          {/* Inner container - pale green */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            
            {/* Content Box 1: คำชี้แจง */}
            <div className="bg-white rounded-lg p-5 mb-4 border border-gray-200">
              <h2 id="consent-title" className="text-lg font-bold text-black mb-3">
                คำชี้แจง :
              </h2>
              <p className="text-black leading-relaxed">
                แบบเสนอผลงานนี้เป็นส่วนหนึ่งของ
                <strong> "กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์" </strong>
                โดยกรมส่งเสริมวัฒนธรรม กระทรวงวัฒนธรรม 
                มีวัตถุประสงค์เพื่อส่งเสริม สนับสนุน และกิจกรรมถ่ายทอดดนตรีไทยให้กับครู และเยาวชน
              </p>
            </div>

            {/* Content Box 2: คำนิยาม */}
            <div className="bg-white rounded-lg p-5 mb-6 border border-gray-200">
              <h2 className="text-lg font-bold text-black mb-3">
                คำนิยาม :
              </h2>
              <p className="text-black leading-relaxed">
                <strong>ดนตรีไทย</strong> หมายถึง ดนตรีไทยแบบแผน ดนตรีพื้นบ้าน 
                การขับร้องเพลงไทยแบบแผน การขับร้องเพลงพื้นบ้าน
              </p>
            </div>

            {/* Accept Button - Centered */}
            <div className="flex justify-center">
              <button
                onClick={handleAccept}
                data-testid="btn-consent-accept"
                autoFocus
                className="bg-[#00B050] hover:bg-[#009040] text-white font-semibold px-8 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#00B050] focus:ring-offset-2"
              >
                ยอมรับ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
