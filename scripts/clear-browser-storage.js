// Script to clear browser storage
// Run this in browser console or create a simple HTML page

function clearAllBrowserStorage() {
  console.log('🧹 Clearing all browser storage...');
  
  // Clear localStorage
  const localStorageKeys = Object.keys(localStorage);
  console.log('📦 localStorage keys found:', localStorageKeys);
  
  localStorageKeys.forEach(key => {
    if (key.includes('draft') || key.includes('form') || key.includes('register')) {
      console.log(`   Removing localStorage: ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  // Clear sessionStorage
  const sessionStorageKeys = Object.keys(sessionStorage);
  console.log('📦 sessionStorage keys found:', sessionStorageKeys);
  
  sessionStorageKeys.forEach(key => {
    if (key.includes('draft') || key.includes('form') || key.includes('register')) {
      console.log(`   Removing sessionStorage: ${key}`);
      sessionStorage.removeItem(key);
    }
  });
  
  // Clear all if needed
  console.log('🗑️ Clearing all localStorage and sessionStorage...');
  localStorage.clear();
  sessionStorage.clear();
  
  console.log('✅ Browser storage cleared!');
  console.log('🔄 Please refresh the page to start fresh.');
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  clearAllBrowserStorage();
} else {
  console.log('This script should be run in browser console');
}