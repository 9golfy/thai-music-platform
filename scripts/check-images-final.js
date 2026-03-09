const fs = require('fs');
const path = require('path');

async function checkImagesFromAPI() {
  try {
    const submissionId = '69ad7476fcaa2809454bab85';
    const response = await fetch(`http://localhost:3000/api/register-support/${submissionId}`);
    const data = await response.json();
    const submission = data.submission;
    
    console.log('🔍 ตรวจสอบรูปภาพสำหรับ Submission ID:', submissionId);
    console.log('📚 ชื่อสถานศึกษา:', submission.regsup_schoolName);
    console.log('👥 จำนวนครู:', submission.regsup_thaiMusicTeachers?.length || 0);
    
    // ตรวจสอบรูปผู้บริหาร
    console.log('\n📸 รูปผู้บริหาร:');
    if (submission.mgtImage) {
      console.log('✅ มี path ในฐานข้อมูล:', submission.mgtImage);
      console.log('🌐 URL:', `http://localhost:3000${submission.mgtImage}`);
      
      const fullPath = path.join(process.cwd(), 'public', submission.mgtImage);
      const exists = fs.existsSync(fullPath);
      console.log('📁 ไฟล์มีอยู่จริง:', exists ? '✅ ใช่' : '❌ ไม่มี');
      
      if (exists) {
        const stats = fs.statSync(fullPath);
        console.log('📏 ขนาดไฟล์:', Math.round(stats.size / 1024), 'KB');
        console.log('📅 วันที่แก้ไข:', stats.mtime.toISOString());
      }
    } else {
      console.log('❌ ไม่มี path รูปผู้บริหารในฐานข้อมูล');
    }
    
    // ตรวจสอบรูปครู
    console.log('\n👨‍🏫 รูปครู:');
    if (submission.regsup_thaiMusicTeachers && Array.isArray(submission.regsup_thaiMusicTeachers)) {
      let hasAnyTeacherImage = false;
      
      submission.regsup_thaiMusicTeachers.forEach((teacher, index) => {
        console.log(`\n  ครูคนที่ ${index + 1}: ${teacher.teacherFullName}`);
        
        if (teacher.teacherImage) {
          hasAnyTeacherImage = true;
          console.log('  ✅ มี path ในฐานข้อมูล:', teacher.teacherImage);
          console.log('  🌐 URL:', `http://localhost:3000${teacher.teacherImage}`);
          
          const fullPath = path.join(process.cwd(), 'public', teacher.teacherImage);
          const exists = fs.existsSync(fullPath);
          console.log('  📁 ไฟล์มีอยู่จริง:', exists ? '✅ ใช่' : '❌ ไม่มี');
          
          if (exists) {
            const stats = fs.statSync(fullPath);
            console.log('  📏 ขนาดไฟล์:', Math.round(stats.size / 1024), 'KB');
            console.log('  📅 วันที่แก้ไข:', stats.mtime.toISOString());
          }
        } else {
          console.log('  ❌ ไม่มี path รูปในฐานข้อมูล');
        }
      });
      
      if (!hasAnyTeacherImage) {
        console.log('\n🚨 ปัญหา: ไม่มีรูปครูเลยในฐานข้อมูล!');
      }
    } else {
      console.log('❌ ไม่มีข้อมูลครูในฐานข้อมูล');
    }
    
    // ตรวจสอบโฟลเดอร์ uploads
    console.log('\n📁 ตรวจสอบโฟลเดอร์ uploads:');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const teacherFiles = files.filter(f => f.includes('teacher_support_'));
      const mgtFiles = files.filter(f => f.includes('mgt_support_'));
      
      console.log('📊 สถิติไฟล์:');
      console.log('  - ไฟล์ทั้งหมด:', files.length);
      console.log('  - ไฟล์รูปครู:', teacherFiles.length);
      console.log('  - ไฟล์รูปผู้บริหาร:', mgtFiles.length);
      
      // แสดงไฟล์รูปครูล่าสุด
      if (teacherFiles.length > 0) {
        console.log('\n📋 ไฟล์รูปครูล่าสุด:');
        teacherFiles
          .map(file => {
            const filePath = path.join(uploadsDir, file);
            const stats = fs.statSync(filePath);
            return { file, mtime: stats.mtime, size: stats.size };
          })
          .sort((a, b) => b.mtime - a.mtime)
          .slice(0, 10)
          .forEach(({ file, mtime, size }) => {
            console.log(`  - ${file} (${Math.round(size / 1024)} KB, ${mtime.toISOString()})`);
          });
      }
      
      // แสดงไฟล์รูปผู้บริหารล่าสุด
      if (mgtFiles.length > 0) {
        console.log('\n📋 ไฟล์รูปผู้บริหารล่าสุด:');
        mgtFiles
          .map(file => {
            const filePath = path.join(uploadsDir, file);
            const stats = fs.statSync(filePath);
            return { file, mtime: stats.mtime, size: stats.size };
          })
          .sort((a, b) => b.mtime - a.mtime)
          .slice(0, 5)
          .forEach(({ file, mtime, size }) => {
            console.log(`  - ${file} (${Math.round(size / 1024)} KB, ${mtime.toISOString()})`);
          });
      }
    } else {
      console.log('❌ โฟลเดอร์ uploads ไม่มีอยู่');
    }
    
    // สรุปผล
    console.log('\n📋 สรุปผลการตรวจสอบ:');
    const mgtImageExists = submission.mgtImage && fs.existsSync(path.join(process.cwd(), 'public', submission.mgtImage));
    console.log('📸 รูปผู้บริหาร:', mgtImageExists ? '✅ มี' : '❌ ไม่มี');
    
    let teacherImagesCount = 0;
    if (submission.regsup_thaiMusicTeachers) {
      teacherImagesCount = submission.regsup_thaiMusicTeachers.filter(teacher => 
        teacher.teacherImage && fs.existsSync(path.join(process.cwd(), 'public', teacher.teacherImage))
      ).length;
    }
    console.log('👨‍🏫 รูปครู:', `${teacherImagesCount}/${submission.regsup_thaiMusicTeachers?.length || 0} คน`);
    
    if (teacherImagesCount === 0) {
      console.log('\n🚨 ปัญหาที่พบ: ไม่มีรูปครูเลย!');
      console.log('💡 สาเหตุที่เป็นไปได้:');
      console.log('   1. การ upload รูปครูไม่สำเร็จ');
      console.log('   2. ไฟล์ถูกลบหรือย้ายที่');
      console.log('   3. path ในฐานข้อมูลไม่ถูกต้อง');
      console.log('   4. การบันทึกข้อมูลรูปครูมีปัญหา');
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
  }
}

checkImagesFromAPI();