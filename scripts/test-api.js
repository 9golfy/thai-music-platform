async function testAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/register-support/69abcc45bdfd421b3126102f');
    const data = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('API Response Success:', data.success);
    
    if (data.success && data.submission) {
      console.log('\n📋 Key Fields:');
      console.log('School Name (regsup_):', data.submission.regsup_schoolName);
      console.log('School Name (no prefix):', data.submission.schoolName);
      console.log('School Province (regsup_):', data.submission.regsup_schoolProvince);
      console.log('School Province (no prefix):', data.submission.schoolProvince);
      console.log('Teachers (regsup_):', data.submission.regsup_thaiMusicTeachers?.length || 0);
      console.log('Teachers (no prefix):', data.submission.thaiMusicTeachers?.length || 0);
      console.log('Total Score:', data.submission.total_score);
    } else {
      console.log('Error:', data.message);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();