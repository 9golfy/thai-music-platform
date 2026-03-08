/**
 * Draft Storage Utilities
 * 
 * Provides LocalStorage operations for the hybrid draft storage approach.
 * Handles saving, retrieving, and clearing draft data with proper error handling.
 * 
 * Requirements: US-1.2, US-2.1, FR-1
 */

export interface LocalDraftData {
  draftToken: string | null;
  email: string;
  phone: string;
  submissionType: 'register100' | 'register-support';
  formData: Record<string, any>;
  currentStep: number;
  savedAt: number; // timestamp
  syncedAt: number | null; // last DB sync timestamp
}

/**
 * Check if LocalStorage is available in the current environment
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get the LocalStorage key for a specific submission type
 */
function getDraftKey(submissionType: string): string {
  const prefixMap = {
    'register100': 'draft_reg100',
    'register-support': 'draft_regsup'
  };
  return prefixMap[submissionType as keyof typeof prefixMap] || `draft_${submissionType}`;
}

/**
 * Save draft data to LocalStorage
 * 
 * @param data - The draft data to save
 * @throws Error if LocalStorage is unavailable or quota exceeded
 * 
 * Requirements: US-1.2, FR-1
 */
export function saveDraftToLocal(data: LocalDraftData): void {
  if (!isLocalStorageAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  const key = getDraftKey(data.submissionType);
  
  try {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
  } catch (e: any) {
    if (e.name === 'QuotaExceededError') {
      throw new Error('LocalStorage quota exceeded. Please clear some space or use database-only mode.');
    }
    throw new Error(`Failed to save draft to LocalStorage: ${e.message}`);
  }
}

/**
 * Retrieve draft data from LocalStorage
 * 
 * @param submissionType - The type of submission ('register100' or 'register-support')
 * @returns The draft data if found, null otherwise
 * 
 * Requirements: US-2.1
 */
export function getDraftFromLocal(submissionType: string): LocalDraftData | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  const key = getDraftKey(submissionType);
  
  try {
    const jsonData = localStorage.getItem(key);
    
    if (!jsonData) {
      return null;
    }
    
    const data = JSON.parse(jsonData) as LocalDraftData;
    
    // Validate the data structure
    if (!data.email || !data.submissionType || !data.formData || typeof data.currentStep !== 'number') {
      console.warn('Invalid draft data structure found in LocalStorage');
      return null;
    }
    
    return data;
  } catch (e: any) {
    console.error('Failed to retrieve draft from LocalStorage:', e);
    return null;
  }
}

/**
 * Clear draft data from LocalStorage
 * 
 * @param submissionType - The type of submission to clear
 * 
 * Requirements: US-5.5
 */
export function clearDraftFromLocal(submissionType: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  const key = getDraftKey(submissionType);
  
  try {
    localStorage.removeItem(key);
  } catch (e: any) {
    console.error('Failed to clear draft from LocalStorage:', e);
  }
}

/**
 * Get the age of a draft in milliseconds
 * 
 * @param draft - The draft data
 * @returns The age in milliseconds
 */
export function getDraftAge(draft: LocalDraftData): number {
  const now = Date.now();
  return now - draft.savedAt;
}
