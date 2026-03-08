/**
 * Debug Complete Flow
 * 
 * This script helps debug the complete draft restoration flow
 * by simulating what happens in the browser.
 */

console.log('🔍 Debugging Complete Draft Flow...\n');

// Simulate localStorage operations
const mockLocalStorage = {
  data: {},
  getItem: function(key) {
    return this.data[key] || null;
  },
  setItem: function(key, value) {
    this.data[key] = value;
  },
  removeItem: function(key) {
    delete this.data[key];
  },
  clear: function() {
    this.data = {};
  }
};

// Simulate getDraftFromLocal function
function getDraftFromLocal(submissionType) {
  const key = `draft_${submissionType}`;
  const jsonData = mockLocalStorage.getItem(key);
  
  if (!jsonData) {
    return null;
  }
  
  try {
    const data = JSON.parse(jsonData);
    
    // Validate the data structure
    if (!data.email || !data.submissionType || !data.formData || typeof data.currentStep !== 'number') {
      console.warn('Invalid draft data structure found in LocalStorage');
      return null;
    }
    
    return data;
  } catch (e) {
    console.error('Failed to retrieve draft from LocalStorage:', e);
    return null;
  }
}

// Simulate saveDraftToLocal function
function saveDraftToLocal(data) {
  const key = `draft_${data.submissionType}`;
  
  try {
    const jsonData = JSON.stringify(data);
    mockLocalStorage.setItem(key, jsonData);
  } catch (e) {
    throw new Error(`Failed to save draft to LocalStorage: ${e.message}`);
  }
}

async function debugCompleteFlow() {
  console.log('🧪 STEP 1: Simulate OTP Verification Success');
  console.log('─'.repeat(50));
  
  // Simulate what happens after successful OTP verification
  const mockOTPResponse = {
    success: true,
    message: 'OTP verified successfully.',
    formData: {
      schoolName: 'ssssssss11111111',
      schoolProvince: '',
      schoolLevel: '',
      affiliation: '',
      // ... other fields
    },
    currentStep: 1,
    submissionType: 'register100',
    email: '9golfy@gmail.com',
    phone: '0899297983',
  };
  
  console.log('📧 Mock OTP Response:', {
    success: mockOTPResponse.success,
    email: mockOTPResponse.email,
    submissionType: mockOTPResponse.submissionType,
    schoolName: mockOTPResponse.formData.schoolName
  });
  
  // Save to localStorage (what OTP page does)
  const draftData = {
    draftToken: 'c63bb98c-ee1a-4a03-a1e9-83c267009eb1',
    email: mockOTPResponse.email,
    phone: mockOTPResponse.phone || '',
    submissionType: mockOTPResponse.submissionType,
    formData: mockOTPResponse.formData,
    currentStep: mockOTPResponse.currentStep,
    savedAt: Date.now(),
    syncedAt: Date.now(),
  };
  
  saveDraftToLocal(draftData);
  console.log('✅ Draft saved to localStorage');
  
  console.log('\n🧪 STEP 2: Simulate Form Page Load');
  console.log('─'.repeat(50));
  
  // Simulate what happens when form page loads
  console.log('🔄 Register100Wizard: Checking for draft data...');
  const draft = getDraftFromLocal('register100');
  
  if (draft && draft.formData) {
    console.log('✅ Draft data found:', {
      email: draft.email,
      schoolName: draft.formData.schoolName,
      currentStep: draft.currentStep
    });
  } else {
    console.log('❌ No draft data found');
  }
  
  console.log('\n🧪 STEP 3: Simulate ConsentModal Check');
  console.log('─'.repeat(50));
  
  // Simulate ConsentModal logic
  console.log('🔍 ConsentModal: Checking consent status...');
  
  const CONSENT_KEY = 'register100_consent_accepted';
  const localConsent = mockLocalStorage.getItem(CONSENT_KEY);
  console.log('📱 LocalStorage consent:', localConsent);
  
  if (localConsent === 'true') {
    console.log('✅ Found local consent, would hide modal');
  } else {
    console.log('❌ No local consent found');
    
    if (draft && draft.email) {
      console.log('📧 Draft email found:', draft.email);
      console.log('🔍 Would check database consent...');
      
      // Test actual API call
      try {
        const response = await fetch('http://localhost:3000/api/consent/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: draft.email,
            submissionType: 'register100'
          }),
        });

        const result = await response.json();
        console.log('🌐 API response:', result);
        
        if (result.success && result.hasConsented) {
          console.log('✅ User has consented before, would hide modal');
          mockLocalStorage.setItem(CONSENT_KEY, 'true');
        } else {
          console.log('❌ User has not consented, would show modal');
        }
      } catch (error) {
        console.error('❌ Error checking consent:', error);
      }
    } else {
      console.log('❌ No draft email, would show modal');
    }
  }
  
  console.log('\n🧪 STEP 4: Final State');
  console.log('─'.repeat(50));
  console.log('📱 Final localStorage state:');
  console.log('   Draft data:', getDraftFromLocal('register100') ? 'Present' : 'Missing');
  console.log('   Consent:', mockLocalStorage.getItem(CONSENT_KEY) || 'Not set');
  
  console.log('\n✅ EXPECTED BEHAVIOR:');
  console.log('1. OTP verification saves draft to localStorage ✅');
  console.log('2. Form page loads and finds draft data ✅');
  console.log('3. ConsentModal checks DB and finds consent ✅');
  console.log('4. ConsentModal should NOT show ✅');
  console.log('5. Form should display with restored data ✅');
  
  console.log('\n🔧 TROUBLESHOOTING:');
  console.log('If ConsentModal still shows in browser:');
  console.log('1. Check browser console for ConsentModal debug logs');
  console.log('2. Verify draft data exists in localStorage');
  console.log('3. Check if consent API is being called');
  console.log('4. Verify timing - ConsentModal might load before draft data');
}

// Run the debug
debugCompleteFlow().catch(console.error);