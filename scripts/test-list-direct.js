async function testListDirect() {
  try {
    console.log('Testing register-support list page...');
    const response = await fetch('http://localhost:3000/dcp-admin/dashboard/register-support');
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const html = await response.text();
      
      // Check if it's a redirect
      if (html.includes('redirect') || response.url !== 'http://localhost:3000/dcp-admin/dashboard/register-support') {
        console.log('❌ Page was redirected');
        console.log('Final URL:', response.url);
        return;
      }
      
      // Check for table content
      const hasTable = html.includes('<table');
      console.log('Has table element:', hasTable);
      
      const hasSchoolData = html.includes('กลุ่มดนตรีไทยสนับสนุน');
      console.log('Has school data:', hasSchoolData);
      
      const hasNoData = html.includes('ไม่พบข้อมูล') || html.includes('ยังไม่มีโรงเรียนลงทะเบียน');
      console.log('Shows no data message:', hasNoData);
      
      // Check for score
      const hasScore = html.includes('70') && html.includes('คะแนน');
      console.log('Has score data:', hasScore);
      
      console.log('✅ List page test completed');
    } else {
      console.log('❌ Failed to load list page');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testListDirect();