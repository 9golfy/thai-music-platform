async function testStep8Data() {
  try {
    const response = await fetch('http://localhost:3000/dcp-admin/dashboard/register-support/69abcc45bdfd421b3126102f');
    
    console.log('Page Response Status:', response.status);
    console.log('Page Response OK:', response.ok);
    
    if (response.ok) {
      const html = await response.text();
      
      // Check Step 8 specific content
      console.log('\n🔍 Step 8 Content Check:');
      
      // Check for PR Activities section
      const hasPRSection = html.includes('กิจกรรมประชาสัมพันธ์');
      console.log('Has PR Activities Section:', hasPRSection);
      
      // Check for Information Sources section
      const hasInfoSources = html.includes('แหล่งที่มาของข้อมูล');
      console.log('Has Information Sources Section:', hasInfoSources);
      
      // Check for specific data
      const hasSchoolInfo = html.includes('โรงเรียนต้นแบบดนตรีไทยแห่งชาติ');
      console.log('Has School Information:', hasSchoolInfo);
      
      const hasCulturalOffice = html.includes('สำนักงานวัฒนธรรมจังหวัดกรุงเทพมหานคร');
      console.log('Has Cultural Office Info:', hasCulturalOffice);
      
      const hasEducationArea = html.includes('สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 1');
      console.log('Has Education Area Info:', hasEducationArea);
      
      // Check for certification
      const hasCertification = html.includes('รับรองความถูกต้อง');
      console.log('Has Certification Field:', hasCertification);
      
      // Check for obstacles and suggestions
      const hasObstacles = html.includes('ปัญหาอุปสรรค');
      console.log('Has Obstacles Field:', hasObstacles);
      
      const hasSuggestions = html.includes('ข้อเสนอแนะ');
      console.log('Has Suggestions Field:', hasSuggestions);
      
      // Check for PR activity data
      const hasPRActivity = html.includes('เผยแพร่ดนตรีไทยในชุมชน');
      console.log('Has PR Activity Data:', hasPRActivity);
      
      console.log('\n✅ Step 8 data check completed');
    } else {
      console.log('❌ Page failed to load');
    }
  } catch (error) {
    console.error('❌ Error testing Step 8 data:', error.message);
  }
}

testStep8Data();