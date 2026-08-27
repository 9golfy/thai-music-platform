import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getSchoolSizeDisplayText } from '@/lib/utils/schoolSize';
import puppeteer from 'puppeteer';
import JSZip from 'jszip';
import { pdfRateLimiter } from '@/middleware/rateLimiter';

// Extend global type for temp storage
declare global {
  var tempFullZipBuffer: Buffer | undefined;
  var tempFullZipFilename: string | undefined;
}

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

// Configuration
const MAX_BATCH_SIZE = 50; // Process max 50 schools at a time to prevent memory overflow
const BROWSER_POOL_SIZE = 1; // Use only 1 browser instance

// Helper function to generate FULL PDF HTML content (all sections)
function generateFullPDFHTML(
  submission: any,
  type: 'register100' | 'register-support',
  schoolId: string
) {
  const getFieldValue = (fieldName: string) => {
    if (type === 'register100') {
      return submission[`reg100_${fieldName}`] ?? submission[fieldName] ?? '';
    } else {
      return submission[`regsup_${fieldName}`] ?? submission[fieldName] ?? '';
    }
  };

  const getDisplayValue = (fieldName: string) => {
    const value = getFieldValue(fieldName);
    if (fieldName === 'schoolSize') {
      return getSchoolSizeDisplayText(value) || value;
    }
    return value;
  };
  
  // Helper to check if image URL is valid
  const getImageSrc = (imageUrl: string) => {
    if (!imageUrl) return '';
    // If it's already a data URL (base64), return as is
    if (imageUrl.startsWith('data:')) return imageUrl;
    // If it's a full URL (http/https), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    // Otherwise, assume it's a relative path and prepend domain
    return imageUrl.startsWith('/') ? `https://dcpschool100.net${imageUrl}` : imageUrl;
  };

  const schoolName = getFieldValue('schoolName') || 'N/A';
  const pageTitle = type === 'register100'
    ? 'รายงานข้อมูล โรงเรียนทดสอบ Register100 Full Fields Complete'
    : 'รายงานข้อมูล โรงเรียนสนับสนุนและส่งเสริม';

  // Helper function to render teachers data
  const renderTeachersData = (teachers: any[]) => {
    if (!teachers || teachers.length === 0) return '<tr><td colspan="100%">ไม่มีข้อมูลครู</td></tr>';
    
    return teachers.map((teacher, index) => `
      <tr><th colspan="2" style="background-color: #e9ecef; text-align: center;">ครูคนที่ ${index + 1}</th></tr>
      <tr><th>บทบาท/หน้าที่ผู้สอน *</th><td>${teacher.teacherQualification || '-'}</td></tr>
      <tr><th>ชื่อ-นามสกุล</th><td>${teacher.teacherFullName || teacher.teacherName || '-'}</td></tr>
      <tr><th>ตำแหน่ง *</th><td>${teacher.teacherPosition || '-'}</td></tr>
      <tr><th>อีเมล *</th><td>${teacher.teacherEmail || '-'}</td></tr>
      <tr><th>เบอร์โทรศัพท์ *</th><td>${teacher.teacherPhone || '-'}</td></tr>
      <tr><th>ทักษะ ความรู้ ความสามารถ ในการสอนภาคปฏิบัติดนตรีไทย *</th><td>${teacher.teacherAbility || '-'}</td></tr>
      <tr><th colspan="2" style="background-color: #d1ecf1; padding: 8px;"><strong>สำเร็จการศึกษาด้านดนตรีไทย *</strong></th></tr>
      ${teacher.musicInstituteEducation?.length > 0 ? teacher.musicInstituteEducation.map((edu: any) => `
        <tr><th>วุฒิการศึกษา/ประกาศนียบัตร *</th><td>${edu.graduationYear || '-'}</td></tr>
        <tr><th>สาขา/หลักสูตร *</th><td>${edu.major || '-'}</td></tr>
        <tr><th>ปีที่สำเร็จการศึกษา / ได้รับประกาศนียบัตร *</th><td>${edu.completionYear || '-'}</td></tr>
      `).join('') : '<tr><td colspan="2">ไม่มีข้อมูลการศึกษาด้านดนตรีไทย</td></tr>'}
      <tr><th colspan="2" style="background-color: #d4edda; padding: 8px;"><strong>สำเร็จการศึกษาด้านอื่น (แต่สามารถสอนดนตรีไทยได้ เนื่องจากผ่านการเรียน/อบรมด้านดนตรีไทย) *</strong></th></tr>
      ${teacher.otherEducation?.length > 0 ? teacher.otherEducation.map((edu: any) => `
        <tr><th>วุฒิการศึกษา/ประกาศนียบัตร *</th><td>${edu.graduationYear || '-'}</td></tr>
        <tr><th>สาขา/หลักสูตร *</th><td>${edu.major || '-'}</td></tr>
        <tr><th>ปีที่สำเร็จการศึกษา / ได้รับประกาศนียบัตร *</th><td>${edu.completionYear || '-'}</td></tr>
      `).join('') : '<tr><td colspan="2">ไม่มีข้อมูลการศึกษาด้านอื่น</td></tr>'}
      ${teacher.teacherImage ? `<tr><th>รูปภาพครู</th><td><img src="${getImageSrc(teacher.teacherImage)}" alt="ครูคนที่ ${index + 1}" class="teacher-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" /><span style="display:none; color: #999;">รูปภาพไม่สามารถโหลดได้</span></td></tr>` : ''}
      ${index < teachers.length - 1 ? '<tr><td colspan="2" style="border: none; padding: 10px;"></td></tr>' : ''}
    `).join('');
  };

  const renderCurrentMusicTypes = (items: any[]) => {
    if (!items || items.length === 0) return '<tr><td colspan="2">ไม่มีข้อมูลสภาวการณ์การเรียนการสอน</td></tr>';

    return items.map((item: any) => `
      <tr>
        <th>${item.grade || '-'}</th>
        <td>${item.details || '-'}</td>
      </tr>
    `).join('');
  };

  const renderReadinessItems = (items: any[]) => {
    if (!items || items.length === 0) return '<p>ไม่มีข้อมูลเครื่องดนตรี</p>';

    return `
      <table class="info-table">
          <tr><th>ชื่อเครื่องดนตรี</th><th>จำนวน</th><th>หมายเหตุ</th></tr>
          ${items.map((item: any) => `
              <tr>
                  <td>${item.instrumentName || '-'}</td>
                  <td>${item.quantity || '-'}</td>
                  <td>${item.note || '-'}</td>
              </tr>
          `).join('')}
      </table>
    `;
  };
  
  const renderActivities = (activities: any[], title: string) => {
    if (!activities || activities.length === 0) return `<p><strong>${title}:</strong> ไม่มีข้อมูล</p>`;
    
    return `
      <p><strong>${title}:</strong></p>
      <table class="info-table">
        <tr><th>ชื่อกิจกรรม</th><th>วันที่</th><th>ลิงก์หลักฐาน</th></tr>
        ${activities.map(activity => `
          <tr>
            <td>${activity.activityName || '-'}</td>
            <td>${activity.activityDate || activity.publishDate || '-'}</td>
            <td>${activity.evidenceLink || '-'}</td>
          </tr>
        `).join('')}
      </table>
    `;
  };

  // Generate comprehensive HTML with all sections
  return `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
        body { 
            font-family: 'Sarabun', 'Tahoma', 'Arial', sans-serif; 
            margin: 20px; 
            line-height: 1.6;
            color: #333;
            font-size: 14px;
        }
        h1 { 
            color: #2c5aa0; 
            text-align: center; 
            margin-bottom: 30px;
            font-size: 24px;
            font-weight: 600;
        }
        h2 { 
            color: #666; 
            border-bottom: 2px solid #ccc; 
            padding-bottom: 5px; 
            margin-top: 30px;
            font-size: 18px;
            font-weight: 500;
        }
        h3 {
            color: #555;
            margin-top: 20px;
            font-size: 16px;
            font-weight: 500;
        }
        h4 {
            color: #555;
            margin-top: 15px;
            font-size: 14px;
            font-weight: 500;
        }
        .info-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0; 
            font-size: 13px;
        }
        .info-table th, .info-table td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
            vertical-align: top;
        }
        .info-table th { 
            background-color: #f8f9fa; 
            font-weight: 500;
            color: #495057;
            width: 30%;
        }
        img {
            max-width: 100%;
            height: auto;
            display: block;
        }
        .teacher-image, .mgt-image {
            max-width: 200px;
            max-height: 200px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
        .section {
            margin: 25px 0;
            page-break-inside: avoid;
        }
        .checkbox-list {
            margin: 10px 0;
        }
        .checkbox-item {
            margin: 5px 0;
        }
        .footer { 
            text-align: center; 
            margin-top: 40px; 
            color: #6c757d; 
            font-size: 12px;
            border-top: 1px solid #dee2e6;
            padding-top: 20px;
        }
        @media print {
            body { margin: 0; font-size: 12px; }
            .section { break-inside: avoid; }
            h2 { page-break-after: avoid; }
        }
    </style>
</head>
<body>
    <h1>${pageTitle}</h1>
    <h2 style="text-align: center; color: #1a56db;">${schoolName}</h2>

    <!-- Step 1: ข้อมูลพื้นฐาน -->
    <div class="section">
        <h2>1. ข้อมูลพื้นฐาน</h2>
        <table class="info-table">
            <tr><th>ชื่อสถานศึกษา</th><td>${getFieldValue('schoolName')}</td></tr>
            <tr><th>จังหวัด</th><td>${getFieldValue('schoolProvince')}</td></tr>
            <tr><th>ระดับการศึกษา</th><td>${getFieldValue('schoolLevel')}</td></tr>
            <tr><th>สังกัด</th><td>${getFieldValue('affiliation') || getFieldValue('schoolAffiliation')}</td></tr>
            <tr><th>ระบุ</th><td>${getFieldValue('affiliationDetail') || getFieldValue('schoolDistrict')}</td></tr>
            <tr><th>ขนาดโรงเรียน</th><td>${getDisplayValue('schoolSize')}</td></tr>
            <tr><th>จำนวนบุคลากร</th><td>${getFieldValue('staffCount')}</td></tr>
            <tr><th>จำนวนนักเรียน</th><td>${getFieldValue('studentCount') || getFieldValue('studentTotal')}</td></tr>
            <tr><th>จำนวนนักเรียนแต่ละชั้น</th><td>${getFieldValue('studentCountByGrade') || getFieldValue('studentPerGrade')}</td></tr>
            <tr><th>สถานที่ตั้ง</th><td>${getFieldValue('schoolAddress') || `เลขที่ ${getFieldValue('addressNo')} หมู่ ${getFieldValue('moo')} ถนน ${getFieldValue('road')} ตำบล/แขวง ${getFieldValue('subDistrict')} อำเภอ/เขต ${getFieldValue('district')} จังหวัด ${getFieldValue('provinceAddress')} รหัสไปรษณีย์ ${getFieldValue('postalCode')}`}</td></tr>
            <tr><th>โทรศัพท์</th><td>${getFieldValue('phone') || getFieldValue('schoolPhone')}</td></tr>
            <tr><th>โทรสาร</th><td>${getFieldValue('fax') || getFieldValue('schoolFax')}</td></tr>
        </table>
    </div>

    <!-- Step 2: ผู้บริหาร -->
    <div class="section">
        <h2>2. ผู้บริหาร</h2>
        <table class="info-table">
            ${getFieldValue('mgtImage') ? `<tr><th>รูปภาพ</th><td><img src="${getImageSrc(getFieldValue('mgtImage'))}" alt="ผู้บริหาร" class="mgt-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" /><span style="display:none; color: #999;">รูปภาพไม่สามารถโหลดได้</span></td></tr>` : ''}
            <tr><th>ชื่อ-นามสกุล</th><td>${getFieldValue('mgtFullName')}</td></tr>
            <tr><th>ตำแหน่ง</th><td>${getFieldValue('mgtPosition')}</td></tr>
            <tr><th>ที่อยู่</th><td>${getFieldValue('mgtAddress')}</td></tr>
            <tr><th>โทรศัพท์</th><td>${getFieldValue('mgtPhone')}</td></tr>
            <tr><th>อีเมล</th><td>${getFieldValue('mgtEmail')}</td></tr>
        </table>
    </div>

    <!-- Step 3: สภาวการณ์ -->
    <div class="section">
        <h2>3. สภาวการณ์</h2>
        
        <h3>สภาวการณ์การเรียนการสอน</h3>
        <table class="info-table">
            ${renderCurrentMusicTypes(submission[`${type === 'register100' ? 'reg100' : 'regsup'}_currentMusicTypes`] || submission.currentMusicTypes)}
        </table>

        <h3>ความพร้อมเครื่องดนตรี</h3>
        ${renderReadinessItems(submission[`${type === 'register100' ? 'reg100' : 'regsup'}_readinessItems`] || submission.readinessItems)}
    </div>

    <!-- Step 4: ผู้สอนดนตรีไทย -->
    <div class="section">
        <h2>4. ผู้สอนดนตรีไทย</h2>
        
        <h3>รายชื่อครู</h3>
        ${submission[`${type === 'register100' ? 'reg100' : 'regsup'}_thaiMusicTeachers`] && submission[`${type === 'register100' ? 'reg100' : 'regsup'}_thaiMusicTeachers`].length > 0 ? `
        <table class="info-table">
            ${renderTeachersData(submission[`${type === 'register100' ? 'reg100' : 'regsup'}_thaiMusicTeachers`])}
        </table>
        ` : '<p>ไม่มีข้อมูลครู</p>'}

        <h3>ระยะเวลาการเรียนการสอนในเวลาราชการ</h3>
        ${(submission[`${type === 'register100' ? 'reg100' : 'regsup'}_compulsoryCurriculum`] || []).length > 0 ? `
        <table class="info-table">
            <tr><th>ระดับชั้น</th><th>เรียนดนตรีไทยจำนวน (คน)</th><th>ชั่วโมง/ภาคการศึกษา</th><th>ชั่วโมง/ปีการศึกษา</th></tr>
            ${submission[`${type === 'register100' ? 'reg100' : 'regsup'}_compulsoryCurriculum`].map((item: any) => `
                <tr>
                    <td>${item.gradeLevel || '-'}</td>
                    <td>${item.studentCount || '-'}</td>
                    <td>${item.hoursPerSemester || '-'}</td>
                    <td>${item.hoursPerYear || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}

        <h3>ระยะเวลาการเรียนการสอนนอกเวลาราชการ</h3>
        ${(submission[`${type === 'register100' ? 'reg100' : 'regsup'}_afterSchoolSchedule`] || []).length > 0 ? `
        <table class="info-table">
            <tr><th>วัน</th><th>เวลา</th><th>ถึง</th><th>สถานที่</th></tr>
            ${submission[`${type === 'register100' ? 'reg100' : 'regsup'}_afterSchoolSchedule`].map((item: any) => `
                <tr>
                    <td>${item.day || '-'}</td>
                    <td>${item.timeFrom || '-'}</td>
                    <td>${item.timeTo || '-'}</td>
                    <td>${item.location || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}
    </div>

    ${type === 'register100' ? `
    <!-- Step 5: หลักสูตร (Register100 only) -->
    <div class="section">
        <h2>5. หลักสูตร</h2>
        
        <h3>เป็นวิชาบังคับในชั้นเรียน</h3>
        <p>${getFieldValue('isCompulsorySubject') ? 'มี' : 'ไม่มี'}</p>

        <h3>มีวิชาเลือก/วิชาเรียนเพิ่มเติม/ชุมนุม</h3>
        <p>${getFieldValue('hasElectiveSubject') ? 'มี' : 'ไม่มี'}</p>

        <h3>มีหลักสูตรวิชาของท้องถิ่น</h3>
        <p>${getFieldValue('hasLocalCurriculum') ? 'มี' : 'ไม่มี'}</p>

        <h3>นอกเวลาราชการ</h3>
        <p>${getFieldValue('hasAfterSchoolTeaching') ? 'มี' : 'ไม่มี'}</p>

        <h3>สถานที่สอน</h3>
        <p>${getFieldValue('teachingLocation') || '-'}</p>
    </div>
    ` : ''}

    <!-- Step 6: การสนับสนุน -->
    <div class="section">
        <h2>6. การสนับสนุน</h2>
        
        <h3>นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา</h3>
        ${(submission[`${type === 'register100' ? 'reg100' : 'regsup'}_supportFactors`] || []).length > 0 ? `
        <table class="info-table">
            <tr><th>ลำดับ</th><th>องค์กร/หน่วยงาน</th><th>รายละเอียด</th></tr>
            ${submission[`${type === 'register100' ? 'reg100' : 'regsup'}_supportFactors`].map((item: any, index: number) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.sup_supportByAdmin || '-'}</td>
                    <td>${item.sup_supportByDescription || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูล</p>'}

        <h3>การสนับสนุนวัสดุ อุปกรณ์ หรืองบประมาณ</h3>
        
        <h4>ได้รับการสนับสนุนจากต้นสังกัด (บุคคล/หน่วยงานภายใน)</h4>
        <p>${getFieldValue('hasSupportFromOrg') ? 'มี' : 'ไม่มี'}</p>
        ${getFieldValue('hasSupportFromOrg') && (submission[`${type === 'register100' ? 'reg100' : 'regsup'}_supportFromOrg`] || []).length > 0 ? `
        <table class="info-table">
            <tr><th>บุคคล/หน่วยงาน</th><th>รายละเอียด</th><th>ลิงก์หลักฐาน</th></tr>
            ${submission[`${type === 'register100' ? 'reg100' : 'regsup'}_supportFromOrg`].map((support: any) => `
                <tr>
                    <td>${support.organization || '-'}</td>
                    <td>${support.details || '-'}</td>
                    <td>${support.evidenceLink || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : ''}

        <h4>ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก</h4>
        <p>${getFieldValue('hasSupportFromExternal') ? 'มี' : 'ไม่มี'}</p>
        ${getFieldValue('hasSupportFromExternal') && (submission[`${type === 'register100' ? 'reg100' : 'regsup'}_supportFromExternal`] || []).length > 0 ? `
        <table class="info-table">
            <tr><th>บุคคล/หน่วยงาน</th><th>รายละเอียด</th><th>ลิงก์หลักฐาน</th></tr>
            ${submission[`${type === 'register100' ? 'reg100' : 'regsup'}_supportFromExternal`].map((support: any) => `
                <tr>
                    <td>${support.organization || '-'}</td>
                    <td>${support.details || '-'}</td>
                    <td>${support.evidenceLink || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : ''}
    </div>

    <!-- Step 7: ผลงาน -->
    <div class="section">
        <h2>7. ผลงาน</h2>
        
        <h3>รางวัลและเกียรติคุณที่ได้รับในระยะเวลา ๑ ปี ย้อนหลัง</h3>
        ${submission[`${type === 'register100' ? 'reg100' : 'regsup'}_awards`] && submission[`${type === 'register100' ? 'reg100' : 'regsup'}_awards`].length > 0 ? `
        <table class="info-table">
            <tr><th>ระดับรางวัล</th><th>ชื่อรางวัล</th><th>วันที่ได้รับ</th><th>ลิงก์หลักฐาน</th></tr>
            ${submission[`${type === 'register100' ? 'reg100' : 'regsup'}_awards`].map((award: any) => `
                <tr>
                    <td>${award.awardLevel || '-'}</td>
                    <td>${award.awardName || '-'}</td>
                    <td>${award.awardDate || '-'}</td>
                    <td>${award.awardEvidenceLink || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูลรางวัล</p>'}

        <h3>ภาพถ่ายผลงาน และคลิปวิดีโอ</h3>
        <p><strong>Link ภาพถ่าย:</strong> ${getFieldValue('photoGalleryLink') || '-'}</p>
        <p><strong>Link วิดีโอ 1:</strong> ${getFieldValue('videoLink') || '-'}</p>
        <p><strong>Link วิดีโอ 2:</strong> ${getFieldValue('videoLink2') || '-'}</p>
    </div>

    <!-- Step 8: การเผยแพร่ -->
    <div class="section">
        <h2>8. การเผยแพร่</h2>
        
        ${renderActivities(submission[`${type === 'register100' ? 'reg100' : 'regsup'}_activitiesWithinProvinceInternal`], 'กิจกรรมภายในจังหวัด (ภายใน)')}
        ${renderActivities(submission[`${type === 'register100' ? 'reg100' : 'regsup'}_activitiesWithinProvinceExternal`], 'กิจกรรมภายในจังหวัด (ภายนอก)')}
        ${renderActivities(submission[`${type === 'register100' ? 'reg100' : 'regsup'}_activitiesOutsideProvince`], 'กิจกรรมนอกจังหวัด')}
    </div>

    <!-- Step 9: การประชาสัมพันธ์ -->
    <div class="section">
        <h2>9. การประชาสัมพันธ์</h2>

        <h3>การประชาสัมพันธ์ผลงานของสถานศึกษา</h3>
        ${submission[`${type === 'register100' ? 'reg100' : 'regsup'}_prActivities`] && submission[`${type === 'register100' ? 'reg100' : 'regsup'}_prActivities`].length > 0 ? `
        <table class="info-table">
            <tr><th>ชื่อกิจกรรม</th><th>วันที่เผยแพร่</th><th>ลิงก์หลักฐาน</th><th>แพลตฟอร์ม</th></tr>
            ${submission[`${type === 'register100' ? 'reg100' : 'regsup'}_prActivities`].map((activity: any) => `
                <tr>
                    <td>${activity.activityName || '-'}</td>
                    <td>${activity.publishDate || '-'}</td>
                    <td>${activity.evidenceLink || '-'}</td>
                    <td>${activity.platform || '-'}</td>
                </tr>
            `).join('')}
        </table>
        ` : '<p>ไม่มีข้อมูลกิจกรรมประชาสัมพันธ์</p>'}

        <h3>ปัญหาและอุปสรรค</h3>
        <p>${getFieldValue('obstacles') || '-'}</p>

        <h3>ข้อเสนอแนะ</h3>
        <p>${getFieldValue('suggestions') || '-'}</p>

        <h3>รับรองความถูกต้อง</h3>
        <p>${getFieldValue('certifiedByAdmin') ? '☑ ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในแบบฟอร์มนี้เป็นความจริงทุกประการ' : '☐ ยังไม่ได้รับรอง'}</p>
    </div>
    
    <div class="footer">
        <p>สร้างเมื่อ: ${new Date().toLocaleDateString('th-TH', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p>กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ ประจำปีงบประมาณ พ.ศ. 2569</p>
    </div>
</body>
</html>
  `;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type'); // 'register100', 'register-support', or 'all'
  const stream = searchParams.get('stream'); // 'true' for SSE progress
  const download = searchParams.get('download'); // 'true' for actual download

  // Rate limiting check
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rateLimitCheck = pdfRateLimiter.checkRateLimit(ip);
  
  if (!rateLimitCheck.allowed) {
    return NextResponse.json(
      { success: false, message: rateLimitCheck.message },
      { status: 429 } // Too Many Requests
    );
  }

  // If download=true, return the stored ZIP
  if (download === 'true') {
    const zipBuffer = (global as any).tempFullZipBuffer;
    const zipFilename = (global as any).tempFullZipFilename || `all-schools-full-${type}-${new Date().toISOString().slice(0, 10)}.zip`;
    
    if (!zipBuffer) {
      return NextResponse.json(
        { success: false, message: 'ZIP file not found or expired' },
        { status: 404 }
      );
    }
    
    // Clear temp storage
    delete (global as any).tempFullZipBuffer;
    delete (global as any).tempFullZipFilename;
    
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
      },
    });
  }

  // If stream=true, return SSE for progress
  if (stream === 'true') {
    return handleStreamProgress(type, ip);
  }

  // Otherwise, regular download (for backward compatibility)
  return handleRegularDownload(type, ip);
}

async function handleStreamProgress(type: string | null, ip: string) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      let browser;
      let generationStarted = false;
      
      try {
        // Mark generation as started
        pdfRateLimiter.startGeneration();
        generationStarted = true;
        
        // Send initial message to confirm connection
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));
        
        const client = new MongoClient(uri);
        await client.connect();
        
        const database = client.db(dbName);
        const submissions: Array<{ submission: any; type: 'register100' | 'register-support'; schoolId: string }> = [];
        
        // Fetch submissions
        if (type === 'register100' || type === 'all') {
          const register100Collection = database.collection('register100_submissions');
          const register100Docs = await register100Collection.find({ schoolId: { $exists: true, $ne: null } }).toArray();
          register100Docs.forEach(doc => {
            submissions.push({
              submission: doc,
              type: 'register100',
              schoolId: doc.schoolId as string
            });
          });
        }
        
        if (type === 'register-support' || type === 'all') {
          const registerSupportCollection = database.collection('register_support_submissions');
          const registerSupportDocs = await registerSupportCollection.find({ schoolId: { $exists: true, $ne: null } }).toArray();
          registerSupportDocs.forEach(doc => {
            submissions.push({
              submission: doc,
              type: 'register-support',
              schoolId: doc.schoolId as string
            });
          });
        }
        
        await client.close();
        
        if (submissions.length === 0) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'ไม่พบข้อมูลโรงเรียน' })}\n\n`));
          controller.close();
          return;
        }

        const total = submissions.length;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'total', total })}\n\n`));

        // Launch Puppeteer
        browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ],
          timeout: 60000
        });
        
        const zip = new JSZip();
        
        // Generate FULL PDF for each school
        for (let i = 0; i < submissions.length; i++) {
          const { submission, type: submissionType, schoolId } = submissions[i];
          
          const schoolName = submissionType === 'register100'
            ? (submission.reg100_schoolName || submission.schoolName || schoolId)
            : (submission.regsup_schoolName || submission.schoolName || schoolId);
          
          // Send progress
          const progress = Math.round(((i + 1) / total) * 100);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'progress',
            current: i + 1,
            total,
            progress,
            schoolName,
            schoolId
          })}\n\n`));
          
          const htmlContent = generateFullPDFHTML(submission, submissionType, schoolId);
          
          const page = await browser.newPage();
          
          // Set longer timeout for images
          await page.setDefaultNavigationTimeout(60000);
          await page.setDefaultTimeout(60000);
          
          // Enable request interception to handle external images
          await page.setRequestInterception(false);
          
          await page.setContent(htmlContent, { waitUntil: 'load' });
          
          // Wait for images to load
          await page.evaluate(() => {
            return Promise.all(
              Array.from(document.images)
                .filter(img => !img.complete)
                .map(img => new Promise(resolve => {
                  img.onload = img.onerror = resolve;
                }))
            );
          });
          
          // Additional wait to ensure all resources are loaded
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
              top: '15mm',
              right: '15mm',
              bottom: '15mm',
              left: '15mm'
            }
          });
          
          await page.close();
          
          const safeSchoolName = schoolName.replace(/[^a-zA-Z0-9ก-๙\s]/g, '').substring(0, 50);
          const filename = `${i + 1}.${safeSchoolName} ลำดับที่ ${schoolId}.pdf`;
          
          zip.file(filename, pdfBuffer);
        }
        
        await browser.close();
        
        // Generate ZIP
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'zipping' })}\n\n`));
        const zipBuffer = await zip.generateAsync({ 
          type: 'nodebuffer',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 }
        });
        
        const timestamp = new Date().toISOString().slice(0, 10);
        const zipFilename = `all-schools-full-${type || 'all'}-${timestamp}.zip`;
        
        // Send completion with download instruction
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'complete',
          filename: zipFilename,
          size: zipBuffer.length,
          downloadUrl: `/api/schools/download-full-pdf?type=${type}&download=true`
        })}\n\n`));
        
        controller.close();
        
        // Store ZIP in memory temporarily (for download endpoint)
        (global as any).tempFullZipBuffer = zipBuffer;
        (global as any).tempFullZipFilename = zipFilename;
        
        // Mark generation as ended (success)
        pdfRateLimiter.endGeneration();
        generationStarted = false; // Prevent double cleanup in finally
        
      } catch (error: any) {
        console.error('Error generating full ZIP:', error);
        if (browser) {
          try {
            await browser.close();
          } catch (e) {
            console.error('Error closing browser:', e);
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'error',
          message: error?.message || 'เกิดข้อผิดพลาดในการสร้าง ZIP'
        })}\n\n`));
        controller.close();
      } finally {
        // Always clean up rate limiter
        if (generationStarted) {
          pdfRateLimiter.endGeneration();
        }
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

async function handleRegularDownload(type: string | null, ip: string) {
  let browser;
  
  // Mark generation as started
  pdfRateLimiter.startGeneration();
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db(dbName);
    
    const submissions: Array<{ submission: any; type: 'register100' | 'register-support'; schoolId: string }> = [];
    
    // Fetch submissions based on type
    if (type === 'register100' || type === 'all') {
      const register100Collection = database.collection('register100_submissions');
      const register100Docs = await register100Collection.find({ schoolId: { $exists: true, $ne: null } }).toArray();
      register100Docs.forEach(doc => {
        submissions.push({
          submission: doc,
          type: 'register100',
          schoolId: doc.schoolId as string
        });
      });
    }
    
    if (type === 'register-support' || type === 'all') {
      const registerSupportCollection = database.collection('register_support_submissions');
      const registerSupportDocs = await registerSupportCollection.find({ schoolId: { $exists: true, $ne: null } }).toArray();
      registerSupportDocs.forEach(doc => {
        submissions.push({
          submission: doc,
          type: 'register-support',
          schoolId: doc.schoolId as string
        });
      });
    }
    
    await client.close();
    
    if (submissions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลโรงเรียน' },
        { status: 404 }
      );
    }

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const zip = new JSZip();
    
    // Generate FULL PDF for each school
    for (let i = 0; i < submissions.length; i++) {
      const { submission, type: submissionType, schoolId } = submissions[i];
      
      console.log(`Generating FULL PDF ${i + 1}/${submissions.length}: ${schoolId}`);
      
      const htmlContent = generateFullPDFHTML(submission, submissionType, schoolId);
      
      const page = await browser.newPage();
      
      // Set longer timeout for images
      await page.setDefaultNavigationTimeout(60000);
      await page.setDefaultTimeout(60000);
      
      await page.setContent(htmlContent, { waitUntil: 'load' });
      
      // Wait for images to load
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.onload = img.onerror = resolve;
            }))
        );
      });
      
      // Additional wait to ensure all resources are loaded
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '15mm',
          right: '15mm',
          bottom: '15mm',
          left: '15mm'
        }
      });
      
      await page.close();
      
      // Get school name for filename
      const schoolName = submissionType === 'register100'
        ? (submission.reg100_schoolName || submission.schoolName || schoolId)
        : (submission.regsup_schoolName || submission.schoolName || schoolId);
      
      const safeSchoolName = schoolName.replace(/[^a-zA-Z0-9ก-๙\s]/g, '').substring(0, 50);
      // Format: [ลำดับ].[ชื่อโรงเรียน] ลำดับที่ [SchoolID].pdf
      const filename = `${i + 1}.${safeSchoolName} ลำดับที่ ${schoolId}.pdf`;
      
      zip.file(filename, pdfBuffer);
    }
    
    await browser.close();
    
    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    const timestamp = new Date().toISOString().slice(0, 10);
    const zipFilename = `all-schools-full-${type || 'all'}-${timestamp}.zip`;
    
    return new NextResponse(Buffer.from(zipBuffer), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating full ZIP:', error);
    if (browser) {
      await browser.close();
    }
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้าง ZIP' },
      { status: 500 }
    );
  } finally {
    // Mark generation as ended
    pdfRateLimiter.endGeneration();
  }
}
