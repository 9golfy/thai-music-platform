async function testRegisterSupportList() {
  try {
    const response = await fetch('http://localhost:3000/api/register-support/list');
    const data = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('API Response Success:', data.success);
    
    if (data.success && data.submissions) {
      console.log('\n📋 Register Support List:');
      console.log('Total submissions:', data.submissions.length);
      
      data.submissions.forEach((submission, index) => {
        console.log(`\n${index + 1}. ${submission.regsup_schoolName || submission.schoolName || 'No Name'}`);
        console.log('   Province:', submission.regsup_schoolProvince || submission.schoolProvince || 'No Province');
        console.log('   Level:', submission.regsup_schoolLevel || submission.schoolLevel || 'No Level');
        console.log('   Total Score:', submission.total_score || 0);
        console.log('   School ID:', submission.schoolId || 'No ID');
        console.log('   Created:', submission.createdAt || 'No Date');
      });
    } else {
      console.log('Error or no data:', data.message || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Error testing list API:', error.message);
  }
}

testRegisterSupportList();