async function debugLatestDraft() {
  console.log('🔍 Debugging latest draft submission...\n');
  
  try {
    // Get latest draft via API
    const response = await fetch('http://localhost:3000/api/draft/debug/latest');
    const result = await response.json();
    
    if (!result.success) {
      console.log('❌ No drafts found or API error:', result.error);
      return;
    }
    
    const draft = result.draft;
    console.log('📋 Latest Draft Details:');
    console.log(`   Token: ${draft.token}`);
    console.log(`   Email: ${draft.email}`);
    console.log(`   Submission Type: ${draft.submissionType}`);
    console.log(`   Created: ${draft.createdAt}`);
    console.log(`   Current Step: ${draft.currentStep}`);
    
    console.log('\n🔍 Form Data Analysis:');
    console.log(`   supportType: "${draft.formData?.supportType || 'N/A'}"`);
    console.log(`   supportTypeTitle: "${draft.formData?.supportTypeTitle || 'N/A'}"`);
    console.log(`   supportTypeName (legacy): "${draft.formData?.supportTypeName || 'N/A'}"`);
    console.log(`   supportTypeMemberCount: ${draft.formData?.supportTypeMemberCount || 'N/A'}`);
    console.log(`   schoolName: "${draft.formData?.schoolName || 'N/A'}"`);
    
    console.log('\n📊 All Form Fields:');
    if (draft.formData) {
      Object.entries(draft.formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          console.log(`   ${key}: "${value}"`);
        }
      });
    }
    
    // Check for problematic patterns
    console.log('\n⚠️  Issue Analysis:');
    if (draft.formData?.supportTypeTitle && draft.formData?.supportTypeTitle.trim() !== '') {
      console.log('   ✅ GOOD: supportTypeTitle has value');
    } else if (draft.formData?.supportTypeName && draft.formData?.supportTypeName.trim() !== '') {
      console.log('   ⚠️  Using legacy supportTypeName field');
    } else {
      console.log('   🚨 PROBLEM: No support type title found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugLatestDraft();