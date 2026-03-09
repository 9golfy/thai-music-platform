async function checkLatestSubmission() {
  try {
    // Get list of submissions to find the latest one
    const response = await fetch('http://localhost:3000/api/register-support/list');
    const data = await response.json();
    
    if (!data.success || !data.submissions || data.submissions.length === 0) {
      console.log('❌ No submissions found');
      return;
    }
    
    // Get the latest submission (first in the list)
    const latestSubmission = data.submissions[0];
    console.log('🔍 ตรวจสอบ submission ล่าสุด:');
    console.log('- ID:', latestSubmission._id);
    console.log('- School Name:', latestSubmission.regsup_schoolName);
    console.log('- Created:', latestSubmission.createdAt);
    
    // Now get detailed data for this submission
    const detailResponse = await fetch(`http://localhost:3000/api/register-support/${latestSubmission._id}`);
    const detailData = await detailResponse.json();
    
    if (!detailData.success) {
      console.log('❌ Failed to get submission details');
      return;
    }
    
    const submission = detailData.submission;
    
    console.log('\n📚 ข้อมูลสถานศึกษา:', submission.regsup_schoolName);
    console.log('👥 จำนวนครู:', submission.regsup_thaiMusicTeachers?.length || 0);
    
    // ตรวจสอบรูปผู้บริหาร
    console.log('\n📸 รูปผู้บริหาร:');
    if (submission.mgtImage) {
      console.log('✅ มี path ในฐานข้อมูล:', submission.mgtImage);
      console.log('🌐 URL:', `http://localhost:3000${submission.mgtImage}`);
    } else {
      console.log('❌ ไม่มี path รูปผู้บริหารในฐานข้อมูล');
    }
    
    // ตรวจสอบรูปครู
    console.log('\n👨‍🏫 รูปครู:');
    if (submission.regsup_thaiMusicTeachers && Array.isArray(submission.regsup_thaiMusicTeachers)) {
      let teacherImagesCount = 0;
      
      submission.regsup_thaiMusicTeachers.forEach((teacher, index) => {
        console.log(`\n  ครูคนที่ ${index + 1}: ${teacher.teacherFullName}`);
        
        if (teacher.teacherImage) {
          teacherImagesCount++;
          console.log('  ✅ มี path ในฐานข้อมูล:', teacher.teacherImage);
          console.log('  🌐 URL:', `http://localhost:3000${teacher.teacherImage}`);
        } else {
          console.log('  ❌ ไม่มี path รูปในฐานข้อมูล');
        }
      });
      
      console.log(`\n📊 สรุป: มีรูปครู ${teacherImagesCount}/${submission.regsup_thaiMusicTeachers.length} คน`);
      
      if (teacherImagesCount === submission.regsup_thaiMusicTeachers.length) {
        console.log('🎉 รูปครูครบทุกคน!');
      } else if (teacherImagesCount > 0) {
        console.log('⚠️ รูปครูไม่ครบ');
      } else {
        console.log('🚨 ไม่มีรูปครูเลย');
      }
    } else {
      console.log('❌ ไม่มีข้อมูลครูในฐานข้อมูล');
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
  }
}

checkLatestSubmission();