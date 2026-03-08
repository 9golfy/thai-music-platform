async function testRegisterSupportPage() {
  try {
    const response = await fetch('http://localhost:3000/dcp-admin/dashboard/register-support');
    
    console.log('Page Response Status:', response.status);
    console.log('Page Response OK:', response.ok);
    
    if (response.ok) {
      const html = await response.text();
      
      // Check if the page contains the school name
      const hasSchoolName = html.includes('กลุ่มดนตรีไทยสนับสนุน 9 ครู');
      console.log('Contains School Name:', hasSchoolName);
      
      // Check if the page contains score information
      const hasScore = html.includes('70') && html.includes('คะแนน');
      console.log('Contains Score (70 points):', hasScore);
      
      // Check if the page contains province
      const hasProvince = html.includes('กรุงเทพมหานคร');
      console.log('Contains Province:', hasProvince);
      
      // Check if the page contains level
      const hasLevel = html.includes('มัธยมศึกษา');
      console.log('Contains Level:', hasLevel);
      
      // Check if there are any obvious errors
      const hasError = html.includes('ไม่พบข้อมูล') || html.includes('error') || html.includes('Error');
      console.log('Contains Error:', hasError);
      
      // Check if the table has data
      const hasTableData = html.includes('<tbody>') && !html.includes('ยังไม่มีโรงเรียนลงทะเบียน');
      console.log('Has Table Data:', hasTableData);
      
      console.log('✅ Page loaded successfully');
    } else {
      console.log('❌ Page failed to load');
    }
  } catch (error) {
    console.error('❌ Error testing page:', error.message);
  }
}

testRegisterSupportPage();