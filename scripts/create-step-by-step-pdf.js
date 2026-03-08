// This script will create the step-by-step PDF export format
const stepByStepHTML = `
    <!-- Step 1: ข้อมูลพื้นฐาน -->
    <div class="step-header">Step 1: ข้อมูลพื้นฐาน</div>
    <div class="step-content">
        <table class="info-table">
            <tr><th>ชื่อสถานศึกษา</th><td>\${schoolName}</td></tr>
            <tr><th>จังหวัด</th><td>\${schoolProvince}</td></tr>
            <tr><th>ระดับการศึกษา</th><td>\${schoolLevel}</td></tr>
            <tr><th>สังกัด</th><td>\${getFieldValue('affiliation')}</td></tr>
            <tr><th>ขนาดโรงเรียน</th><td>\${getFieldValue('schoolSize')}</td></tr>
            <tr><th>จำนวนบุคลากร</th><td>\${getFieldValue('staffCount')}</td></tr>
            <tr><th>จำนวนนักเรียน</th><td>\${getFieldValue('studentCount')}</td></tr>
        </table>
        
        <div class="section-title">สถานที่ตั้ง</div>
        <table class="info-table">
            <tr><th>ที่อยู่</th><td>\${schoolAddress}</td></tr>
            <tr><th>โทรศัพท์</th><td>\${schoolPhone}</td></tr>
            <tr><th>โทรสาร</th><td>\${getFieldValue('fax')}</td></tr>
        </table>
    </div>

    <!-- Step 2: ผู้บริหารสถานศึกษา -->
    <div class="step-header">Step 2: ผู้บริหารสถานศึกษา</div>
    <div class="step-content">
        <table class="info-table">
            <tr><th>ชื่อ-นามสกุล</th><td>\${principalName}</td></tr>
            <tr><th>ตำแหน่ง</th><td>\${getFieldValue('mgtPosition')}</td></tr>
            <tr><th>ที่อยู่</th><td>\${getFieldValue('mgtAddress')}</td></tr>
            <tr><th>โทรศัพท์</th><td>\${principalPhone}</td></tr>
            <tr><th>อีเมล</th><td>\${principalEmail}</td></tr>
        </table>
    </div>

    <!-- Step 3: แผนการสอนดนตรีไทย -->
    <div class="step-header">Step 3: แผนการสอนดนตรีไทย</div>
    <div class="step-content">
        <div class="section-title">สภาวการณ์การเรียนการสอน</div>
        \${getFieldValue('currentMusicTypes') && getFieldValue('currentMusicTypes').length > 0 ? 
            getFieldValue('currentMusicTypes').map((item, index) => \`
            <div class="list-item">
                <strong>ระดับชั้น:</strong> \${item.grade || 'ไม่ระบุ'}<br>
                <strong>รายละเอียด:</strong> \${item.details || 'ไม่ระบุ'}
            </div>
            \`).join('') : '<p>ไม่มีข้อมูล</p>'
        }
        
        <div class="section-title">ความพร้อมเครื่องดนตรี</div>
        \${readinessItems.length > 0 ? \`
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อเครื่องดนตรี</th><th>จำนวน</th><th>หมายเหตุ</th></tr>
            \${readinessItems.map((item, index) => \`
            <tr>
                <td>\${index + 1}</td>
                <td>\${item.instrumentName || 'ไม่ระบุ'}</td>
                <td>\${item.quantity || 'ไม่ระบุ'}</td>
                <td>\${item.note || '-'}</td>
            </tr>
            \`).join('')}
        </table>
        \` : '<p>ไม่มีข้อมูล</p>'}
    </div>

    <!-- Step 4: ข้อมูลครูผู้สอนดนตรีไทย -->
    <div class="step-header">Step 4: ข้อมูลครูผู้สอนดนตรีไทย</div>
    <div class="step-content">
        \${teachers.length > 0 ? \`
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อ-นามสกุล</th><th>ตำแหน่ง</th><th>คุณลักษณะ</th><th>การศึกษา</th></tr>
            \${teachers.map((teacher, index) => \`
            <tr>
                <td>\${index + 1}</td>
                <td>\${teacher.teacherFullName || teacher.teacherName || 'ไม่ระบุ'}</td>
                <td>\${teacher.teacherPosition || 'ไม่ระบุ'}</td>
                <td>\${teacher.teacherQualification || 'ไม่ระบุ'}</td>
                <td>\${teacher.teacherEducation || 'ไม่ระบุ'}</td>
            </tr>
            \`).join('')}
        </table>
        \` : '<p>ไม่มีข้อมูล</p>'}
    </div>

    <!-- Step 5: การสนับสนุนและรางวัล -->
    <div class="step-header">Step 5: การสนับสนุนและรางวัล</div>
    <div class="step-content">
        <div class="section-title">การสนับสนุนจากต้นสังกัด</div>
        \${supportFromOrg.length > 0 ? \`
        <table class="info-table">
            <tr><th>ลำดับ</th><th>รายการสนับสนุน</th><th>ประเภท</th></tr>
            \${supportFromOrg.map((support, index) => \`
            <tr>
                <td>\${index + 1}</td>
                <td>\${support.supportName || support.supportType || 'ไม่ระบุ'}</td>
                <td>\${support.supportCategory || 'ไม่ระบุ'}</td>
            </tr>
            \`).join('')}
        </table>
        \` : '<p>ไม่มีข้อมูล</p>'}
        
        <div class="section-title">การสนับสนุนจากภายนอก</div>
        \${supportFromExternal.length > 0 ? \`
        <table class="info-table">
            <tr><th>ลำดับ</th><th>หน่วยงาน</th><th>รายการสนับสนุน</th></tr>
            \${supportFromExternal.map((support, index) => \`
            <tr>
                <td>\${index + 1}</td>
                <td>\${support.organizationName || 'ไม่ระบุ'}</td>
                <td>\${support.supportDetails || 'ไม่ระบุ'}</td>
            </tr>
            \`).join('')}
        </table>
        \` : '<p>ไม่มีข้อมูล</p>'}
        
        <div class="section-title">รางวัลและเกียรติคุณ</div>
        \${awards.length > 0 ? \`
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อรางวัล</th><th>ระดับ</th><th>ปี</th></tr>
            \${awards.map((award, index) => \`
            <tr>
                <td>\${index + 1}</td>
                <td>\${award.awardName || 'ไม่ระบุ'}</td>
                <td>\${award.awardLevel || 'ไม่ระบุ'}</td>
                <td>\${award.awardYear || award.awardDate || 'ไม่ระบุ'}</td>
            </tr>
            \`).join('')}
        </table>
        \` : '<p>ไม่มีข้อมูล</p>'}
    </div>

    <!-- Step 6: สื่อและเทคโนโลยี -->
    <div class="step-header">Step 6: สื่อและเทคโนโลยี</div>
    <div class="step-content">
        <table class="info-table">
            <tr><th>ลิงก์วิดีโอ</th><td>\${getFieldValue('videoLink') || 'ไม่มีข้อมูล'}</td></tr>
            <tr><th>ลิงก์รูปภาพ</th><td>\${getFieldValue('photoGalleryLink') || 'ไม่มีข้อมูล'}</td></tr>
        </table>
    </div>

    <!-- Step 7: กิจกรรมดนตรีไทย -->
    <div class="step-header">Step 7: กิจกรรมดนตรีไทย</div>
    <div class="step-content">
        <div class="section-title">กิจกรรมภายในสถานศึกษา</div>
        \${activitiesInternal.length > 0 ? \`
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อกิจกรรม</th><th>วันที่จัด</th></tr>
            \${activitiesInternal.map((activity, index) => \`
            <tr>
                <td>\${index + 1}</td>
                <td>\${activity.activityName || 'ไม่ระบุ'}</td>
                <td>\${activity.activityDate || 'ไม่ระบุ'}</td>
            </tr>
            \`).join('')}
        </table>
        \` : '<p>ไม่มีข้อมูล</p>'}
        
        <div class="section-title">กิจกรรมภายนอกสถานศึกษา</div>
        \${activitiesExternal.length > 0 ? \`
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อกิจกรรม</th><th>วันที่จัด</th></tr>
            \${activitiesExternal.map((activity, index) => \`
            <tr>
                <td>\${index + 1}</td>
                <td>\${activity.activityName || 'ไม่ระบุ'}</td>
                <td>\${activity.activityDate || 'ไม่ระบุ'}</td>
            </tr>
            \`).join('')}
        </table>
        \` : '<p>ไม่มีข้อมูล</p>'}
        
        <div class="section-title">กิจกรรมนอกจังหวัด</div>
        \${activitiesOutside.length > 0 ? \`
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อกิจกรรม</th><th>วันที่จัด</th></tr>
            \${activitiesOutside.map((activity, index) => \`
            <tr>
                <td>\${index + 1}</td>
                <td>\${activity.activityName || 'ไม่ระบุ'}</td>
                <td>\${activity.activityDate || 'ไม่ระบุ'}</td>
            </tr>
            \`).join('')}
        </table>
        \` : '<p>ไม่มีข้อมูล</p>'}
    </div>

    <!-- Step 8: การประชาสัมพันธ์และข้อมูลเพิ่มเติม -->
    <div class="step-header">Step 8: การประชาสัมพันธ์และข้อมูลเพิ่มเติม</div>
    <div class="step-content">
        <div class="section-title">กิจกรรมประชาสัมพันธ์</div>
        \${prActivities.length > 0 ? \`
        <table class="info-table">
            <tr><th>ลำดับ</th><th>ชื่อกิจกรรม</th><th>ช่องทาง</th></tr>
            \${prActivities.map((activity, index) => \`
            <tr>
                <td>\${index + 1}</td>
                <td>\${activity.activityName || 'ไม่ระบุ'}</td>
                <td>\${activity.prChannel || 'ไม่ระบุ'}</td>
            </tr>
            \`).join('')}
        </table>
        \` : '<p>ไม่มีข้อมูล</p>'}
        
        <div class="section-title">ข้อมูลเพิ่มเติม</div>
        <table class="info-table">
            <tr><th>อุปสรรคในการดำเนินงาน</th><td>\${obstacles}</td></tr>
            <tr><th>ข้อเสนอแนะ</th><td>\${suggestions}</td></tr>
            <tr><th>การรับรองความถูกต้อง</th><td>\${certification ? 'ได้รับรองความถูกต้องแล้ว' : 'ยังไม่ได้รับรอง'}</td></tr>
        </table>
    </div>
`;

console.log('Step-by-step HTML structure created');
console.log('This structure follows the same format as the detail view page');