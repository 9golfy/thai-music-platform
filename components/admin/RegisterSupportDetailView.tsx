'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateGrade, getGradeColor, getGradeBgColor } from '@/lib/utils/gradeCalculator';
import { getSchoolSizeDisplayText } from '@/lib/utils/schoolSize';

interface Submission {
  _id: string;
  [key: string]: any;
}

export default function RegisterSupportDetailView({ id, hideScores = false, readOnly = false, hideDelete = false }: { id: string; hideScores?: boolean; readOnly?: boolean; hideDelete?: boolean }) {
  const router = useRouter();
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<Submission | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Helper function to get field value with fallback for both naming conventions
  const getFieldValue = (data: any, fieldName: string) => {
    // Try with regsup_ prefix first, then without prefix
    return data?.[`regsup_${fieldName}`] ?? data?.[fieldName] ?? null;
  };

  useEffect(() => {
    fetchSubmission();
    
    // Check if URL has ?mode=edit parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'edit') {
      setIsEditMode(true);
    }
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/register-support/${id}`);
      const data = await response.json();
      if (data.success) {
        setSubmission(data.submission);
        // If edit mode is requested, set editedData
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mode') === 'edit') {
          setEditedData(data.submission);
        }
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setShowImageModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/register-support/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        alert('ลบข้อมูลสำเร็จ');
        router.push('/dcp-admin/dashboard/register-support');
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handleEdit = () => {
    if (!submission) return;
    setIsEditMode(true);
    setEditedData({ ...submission });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedData(null);
  };

  const handleSave = async () => {
    if (!editedData) return;
    
    // Validate required dropdown fields
    const errors: string[] = [];
    
    // Validate teachers' qualifications
    const teachers = editedData.regsup_thaiMusicTeachers || editedData.thaiMusicTeachers;
    if (teachers && teachers.length > 0) {
      teachers.forEach((teacher: any, index: number) => {
        if (!teacher.teacherQualification || teacher.teacherQualification === '') {
          errors.push(`ครูคนที่ ${index + 1}: กรุณาเลือกคุณลักษณะ`);
        }
      });
    }
    
    // Validate awards' levels
    if (editedData.awards && editedData.awards.length > 0) {
      editedData.awards.forEach((award: any, index: number) => {
        if (!award.awardLevel || award.awardLevel === '') {
          errors.push(`รางวัลที่ ${index + 1}: กรุณาเลือกระดับรางวัล`);
        }
      });
    }
    
    // Show errors if any
    if (errors.length > 0) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน:\n\n' + errors.join('\n'));
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/register-support/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });
      const data = await response.json();
      if (data.success) {
        setSubmission(editedData);
        setIsEditMode(false);
        setEditedData(null);
        alert('บันทึกข้อมูลสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    if (editedData) {
      // Try with regsup_ prefix first, then without prefix
      const actualField = editedData[`regsup_${field}`] !== undefined ? `regsup_${field}` : field;
      setEditedData({ ...editedData, [actualField]: value });
    }
  };

  const handleArrayFieldChange = (arrayField: string, index: number, field: string, value: any) => {
    if (editedData) {
      // Try with regsup_ prefix first, then without prefix
      const actualArrayField = editedData[`regsup_${arrayField}`] ? `regsup_${arrayField}` : arrayField;
      const updatedArray = [...(editedData[actualArrayField] || [])];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      setEditedData({ ...editedData, [actualArrayField]: updatedArray });
    }
  };

  const handleAddArrayItem = (arrayField: string, defaultItem: any) => {
    if (editedData) {
      // Try with regsup_ prefix first, then without prefix
      const actualArrayField = editedData[`regsup_${arrayField}`] ? `regsup_${arrayField}` : arrayField;
      const updatedArray = [...(editedData[actualArrayField] || []), defaultItem];
      setEditedData({ ...editedData, [actualArrayField]: updatedArray });
    }
  };

  const handleRemoveArrayItem = (arrayField: string, index: number) => {
    if (editedData) {
      // Try with regsup_ prefix first, then without prefix
      const actualArrayField = editedData[`regsup_${arrayField}`] ? `regsup_${arrayField}` : arrayField;
      const updatedArray = [...(editedData[actualArrayField] || [])];
      updatedArray.splice(index, 1);
      setEditedData({ ...editedData, [actualArrayField]: updatedArray });
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch(`/api/register-support/${id}/export/pdf`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const htmlContent = await response.text();
        
        // Create a new window with the HTML content
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          
          // Wait for content to load, then trigger print
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
            }, 500);
          };
        }
      } else {
        alert('เกิดข้อผิดพลาดในการส่งออก PDF');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('เกิดข้อผิดพลาดในการส่งออก PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      // Add cache busting parameter
      const timestamp = Date.now();
      const response = await fetch(`/api/register-support/${id}/export/excel?t=${timestamp}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileTimestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        a.download = `register-support-${displayData?.schoolName || id}-${fileTimestamp}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('เกิดข้อผิดพลาดในการส่งออก Excel');
      }
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('เกิดข้อผิดพลาดในการส่งออก Excel');
    }
  };

  // Helper function to create a proxy object that automatically handles field name mapping
  const createFieldProxy = (data: any) => {
    if (!data) return null;
    
    return new Proxy(data, {
      get(target, prop) {
        if (typeof prop === 'string') {
          // First try with regsup_ prefix, then without prefix
          return target[`regsup_${prop}`] ?? target[prop];
        }
        return target[prop];
      }
    });
  };

  const displayData = createFieldProxy(isEditMode ? editedData : submission);
  const schoolSizeDisplayValue = isEditMode
    ? displayData?.schoolSize
    : getSchoolSizeDisplayText(displayData?.schoolSize) || displayData?.schoolSize;
  const supportTypeNameFieldMap: Record<string, string> = {
    'สถานศึกษา': 'supportTypeSchoolName',
    'ชุมนุม': 'supportTypeClubName',
    'ชมรม': 'supportTypeAssociationName',
    'กลุ่ม': 'supportTypeGroupName',
    'วงดนตรีไทย': 'supportTypeBandName',
  };
  const selectedSupportType = displayData?.supportType;
  const selectedSupportTypeNameField = selectedSupportType ? supportTypeNameFieldMap[selectedSupportType] : '';
  const selectedSupportTypeNameValue = selectedSupportTypeNameField ? displayData?.[selectedSupportTypeNameField] : '';
  const displayedRegisterSupportTotal =
    (submission?.teacher_qualification_score || 0) +
    (submission?.support_from_org_score || 0) +
    (submission?.support_from_external_score || 0) +
    (submission?.award_score || 0) +
    (submission?.activity_within_province_internal_score || 0) +
    (submission?.activity_within_province_external_score || 0) +
    (submission?.activity_outside_province_score || 0) +
    (submission?.pr_activity_score || 0);
  const displayedRegisterSupportMax = 80;
  const displayedRegisterSupportGradeScore = (displayedRegisterSupportTotal / displayedRegisterSupportMax) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">ไม่พบข้อมูล</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Back Button + School Name */}
          <div>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              กลับ
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900">
              {displayData?.schoolName}
            </h1>
            <p className="text-gray-600 mt-2">
              {displayData?.schoolProvince} • {displayData?.schoolLevel}
            </p>
            
            {/* School ID */}
            {submission.schoolId && (
              <div className="mt-3">
                <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 font-mono text-sm font-semibold rounded-lg border border-blue-200">
                  {submission.schoolId}
                </span>
              </div>
            )}

            {/* Registrant Information */}
            {(submission.teacherEmail || submission.teacherPhone) && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">ผู้ลงทะเบียน:</div>
                <div className="space-y-1">
                  {submission.teacherEmail && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">อีเมล:</span> {submission.teacherEmail}
                    </div>
                  )}
                  {submission.teacherPhone && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">เบอร์โทรศัพท์:</span> {submission.teacherPhone}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Score Summary Block - Separate */}
        {!hideScores && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Total Score */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-700">คะแนนรวมทั้งหมด</div>
                <div className="text-sm text-gray-600 mt-1">Total Score (Part 1 + Part 2)</div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-3">
                  <span className={`text-3xl font-bold ${getGradeColor(calculateGrade(
                    ((editedData?.teacher_qualification_score ?? submission.teacher_qualification_score ?? 0) + 
                     (editedData?.support_from_org_score ?? submission.support_from_org_score ?? 0) + 
                     (editedData?.support_from_external_score ?? submission.support_from_external_score ?? 0) + 
                     (editedData?.award_score ?? submission.award_score ?? 0) + 
                     (editedData?.activity_within_province_internal_score ?? submission.activity_within_province_internal_score ?? 0) + 
                     (editedData?.activity_within_province_external_score ?? submission.activity_within_province_external_score ?? 0) + 
                     (editedData?.activity_outside_province_score ?? submission.activity_outside_province_score ?? 0) + 
                     (editedData?.pr_activity_score ?? submission.pr_activity_score ?? 0) +
                     (editedData?.video1_score ?? submission.video1_score ?? 0) +
                     (editedData?.video2_score ?? submission.video2_score ?? 0))
                  ))}`}>
                    Grade {calculateGrade(
                      ((editedData?.teacher_qualification_score ?? submission.teacher_qualification_score ?? 0) + 
                       (editedData?.support_from_org_score ?? submission.support_from_org_score ?? 0) + 
                       (editedData?.support_from_external_score ?? submission.support_from_external_score ?? 0) + 
                       (editedData?.award_score ?? submission.award_score ?? 0) + 
                       (editedData?.activity_within_province_internal_score ?? submission.activity_within_province_internal_score ?? 0) + 
                       (editedData?.activity_within_province_external_score ?? submission.activity_within_province_external_score ?? 0) + 
                       (editedData?.activity_outside_province_score ?? submission.activity_outside_province_score ?? 0) + 
                       (editedData?.pr_activity_score ?? submission.pr_activity_score ?? 0) +
                       (editedData?.video1_score ?? submission.video1_score ?? 0) +
                       (editedData?.video2_score ?? submission.video2_score ?? 0))
                    )}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-5xl font-bold text-green-600">
                    {(editedData?.teacher_qualification_score ?? submission.teacher_qualification_score ?? 0) + 
                     (editedData?.support_from_org_score ?? submission.support_from_org_score ?? 0) + 
                     (editedData?.support_from_external_score ?? submission.support_from_external_score ?? 0) + 
                     (editedData?.award_score ?? submission.award_score ?? 0) + 
                     (editedData?.activity_within_province_internal_score ?? submission.activity_within_province_internal_score ?? 0) + 
                     (editedData?.activity_within_province_external_score ?? submission.activity_within_province_external_score ?? 0) + 
                     (editedData?.activity_outside_province_score ?? submission.activity_outside_province_score ?? 0) + 
                     (editedData?.pr_activity_score ?? submission.pr_activity_score ?? 0) +
                     (editedData?.video1_score ?? submission.video1_score ?? 0) +
                     (editedData?.video2_score ?? submission.video2_score ?? 0)}
                  </span>
                </div>
                <div className="text-lg text-gray-600 font-medium">/ 180 คะแนน</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ScoreCard
              step="STEP 4"
              title="คุณลักษณะครูผู้สอน"
              subtitle="ครูแต่ละประเภทคุณลักษณะไม่ซ้ำกัน ประเภทละ 5 คะแนน"
              score={submission.teacher_qualification_score || 0}
              max={20}
              color="purple"
              note="กรอกครู 4 คนที่มีคุณลักษณะไม่ซ้ำประเภท จะได้คะแนนเต็ม 20 คะแนน"
            />
            <ScoreCard
              step="STEP 6"
              title="การสนับสนุนจากต้นสังกัด"
              subtitle="บุคคล/หน่วยงานภายในสถานศึกษา"
              score={submission.support_from_org_score || 0}
              max={5}
              color="teal"
              note="ติ๊กได้รับการสนับสนุนจากต้นสังกัด = 5 คะแนน"
            />
            <ScoreCard
              step="STEP 6"
              title="การสนับสนุนจากภายนอก"
              subtitle="บุคคล/หน่วยงานภายนอกสถานศึกษา"
              score={submission.support_from_external_score || 0}
              max={15}
              color="orange"
              note="1 คน = 5, 2 คน = 10, 3+ คน = 15 คะแนน"
            />
            <ScoreCard
              step="STEP 7"
              title="ผลงาน"
              subtitle="นับเฉพาะรางวัลที่ได้คะแนนสูงสุด"
              score={submission.award_score || 0}
              max={20}
              color="amber"
              note="อำเภอ = 5, จังหวัด = 10, ภาค = 15, ประเทศ = 20 คะแนน"
            />
            <ScoreCard
              step="STEP 8"
              title="กิจกรรมภายในจังหวัด - ภายในสถานศึกษา"
              subtitle="กรอกข้อมูล 3 ครั้งต่อปีขึ้นไป"
              score={submission.activity_within_province_internal_score || 0}
              max={5}
              color="cyan"
              note="ครบ 3 ครั้ง/ปี = 5 คะแนน"
            />
            <ScoreCard
              step="STEP 8"
              title="กิจกรรมภายในจังหวัด - ภายนอกสถานศึกษา"
              subtitle="กรอกข้อมูล 3 ครั้งต่อปีขึ้นไป"
              score={submission.activity_within_province_external_score || 0}
              max={5}
              color="indigo"
              note="ครบ 3 ครั้ง/ปี = 5 คะแนน"
            />
            <ScoreCard
              step="STEP 8"
              title="กิจกรรมภายนอกจังหวัด"
              subtitle="กรอกข้อมูล 3 ครั้งต่อปีขึ้นไป"
              score={submission.activity_outside_province_score || 0}
              max={5}
              color="pink"
              note="ครบ 3 ครั้ง/ปี = 5 คะแนน"
            />
            <ScoreCard
              step="STEP 9"
              title="การประชาสัมพันธ์ผลงาน"
              subtitle="Facebook, YouTube, TikTok, Website"
              score={submission.pr_activity_score || 0}
              max={5}
              color="rose"
              note="กรอกข้อมูล 3 ครั้ง/ปีขึ้นไป = 5 คะแนน"
            />
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-sm font-semibold text-gray-700 mb-2">ส่วนที่ 1: สรุปการคำนวณคะแนน</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Step 4: คุณลักษณะครูผู้สอน</span>
                <span className="font-medium">{submission.teacher_qualification_score || 0}/20 คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 6: การสนับสนุนจากต้นสังกัด</span>
                <span className="font-medium">{submission.support_from_org_score || 0}/5 คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 6: การสนับสนุนจากภายนอก</span>
                <span className="font-medium">{submission.support_from_external_score || 0}/15 คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 7: ผลงาน (นับคะแนนสูงสุด)</span>
                <span className="font-medium">{submission.award_score || 0}/20 คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 8: กิจกรรมภายในจังหวัด - ภายในสถานศึกษา</span>
                <span className="font-medium">{submission.activity_within_province_internal_score || 0}/5 คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 8: กิจกรรมภายในจังหวัด - ภายนอกสถานศึกษา</span>
                <span className="font-medium">{submission.activity_within_province_external_score || 0}/5 คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 8: กิจกรรมภายนอกจังหวัด</span>
                <span className="font-medium">{submission.activity_outside_province_score || 0}/5 คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 9: การประชาสัมพันธ์ผลงาน</span>
                <span className="font-medium">{submission.pr_activity_score || 0}/5 คะแนน</span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t-2 border-gray-300 font-bold text-green-700">
                <span>รวมทั้งหมด</span>
                <span>{displayedRegisterSupportTotal} / 80 คะแนน</span>
              </div>
            </div>

            {/* ส่วนที่ 2: คะแนนจากรายงานที่ส่ง */}
            <div className="mt-6 pt-6 border-t-2 border-gray-300">
              <div className="text-sm font-semibold text-gray-700 mb-3">ส่วนที่ 2: คะแนนจากรายงานที่ส่ง</div>
              <div className="text-xs text-gray-600 mb-1 font-semibold">วิดีโอ/คลิป</div>
              <div className="text-xs text-red-600 font-medium mb-3">
                กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-700 font-medium">1. บรรยากาศการเรียนการสอนในชั้นเรียน และในสถานศึกษา</div>
                    <div className="text-xs text-gray-500 mt-1">Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)</div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {isEditMode ? (
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={editedData?.video1_score ?? submission.video1_score ?? 0}
                        onChange={(e) => {
                          const value = Math.min(50, Math.max(0, parseInt(e.target.value) || 0));
                          handleFieldChange('video1_score', value);
                        }}
                        className="w-16 px-2 py-1 text-center font-semibold border-2 border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      <div className="w-16 px-2 py-1 text-center font-semibold bg-gray-200 border border-gray-300 rounded">
                        {submission.video1_score ?? 0}
                      </div>
                    )}
                    <span className="text-xs text-gray-600 whitespace-nowrap">คะแนนเต็ม 50 คะแนน</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-700 font-medium">2. การแสดงผลงานด้านดนตรีของนักเรียน</div>
                    <div className="text-xs text-gray-500 mt-1">Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)</div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {isEditMode ? (
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={editedData?.video2_score ?? submission.video2_score ?? 0}
                        onChange={(e) => {
                          const value = Math.min(50, Math.max(0, parseInt(e.target.value) || 0));
                          handleFieldChange('video2_score', value);
                        }}
                        className="w-16 px-2 py-1 text-center font-semibold border-2 border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      <div className="w-16 px-2 py-1 text-center font-semibold bg-gray-200 border border-gray-300 rounded">
                        {submission.video2_score ?? 0}
                      </div>
                    )}
                    <span className="text-xs text-gray-600 whitespace-nowrap">คะแนนเต็ม 50 คะแนน</span>
                  </div>
                </div>
              </div>

              {isEditMode && (
                <div className="mt-4 flex gap-2 justify-start">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all disabled:opacity-50 text-sm font-medium"
                  >
                    {isSaving ? 'กำลังบันทึก...' : 'แก้ไขคะแนน'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-all text-sm font-medium"
                  >
                    ยกเลิกคะแนน
                  </button>
                </div>
              )}

              <div className="flex items-center justify-end pt-3 mt-3">
                <span className="text-sm font-bold text-green-700">
                  รวมคะแนนทั้ง 2 ส่วน {' '}
                  <span className="text-2xl">
                    {(editedData?.teacher_qualification_score ?? submission.teacher_qualification_score ?? 0) + 
                     (editedData?.support_from_org_score ?? submission.support_from_org_score ?? 0) + 
                     (editedData?.support_from_external_score ?? submission.support_from_external_score ?? 0) + 
                     (editedData?.award_score ?? submission.award_score ?? 0) + 
                     (editedData?.activity_within_province_internal_score ?? submission.activity_within_province_internal_score ?? 0) + 
                     (editedData?.activity_within_province_external_score ?? submission.activity_within_province_external_score ?? 0) + 
                     (editedData?.activity_outside_province_score ?? submission.activity_outside_province_score ?? 0) + 
                     (editedData?.pr_activity_score ?? submission.pr_activity_score ?? 0) +
                     (editedData?.video1_score ?? submission.video1_score ?? 0) +
                     (editedData?.video2_score ?? submission.video2_score ?? 0)}
                  </span>
                  {' '} คะแนน
                </span>
              </div>
            </div>
          </div>
          {false && (
            <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Step 4: Teacher Training Score */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-blue-800 mb-1">STEP 4</div>
                  <div className="text-sm font-medium text-gray-700">การเรียนการสอนดนตรีไทย</div>
                  <div className="text-xs text-gray-600 mt-1">
                    (วิชาบังคับ, หลังเลิกเรียน, วิชาเลือก, หลักสูตรท้องถิ่น)
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-2xl font-bold text-blue-600">{submission?.teacher_training_score || 0}</div>
                  <div className="text-xs text-gray-500">/ 20</div>
                </div>
              </div>
              <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded mt-2">
                5 คะแนน/ข้อ × 4 ข้อ
              </div>
            </div>

            {/* Step 4: Teacher Qualification Score */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-purple-800 mb-1">STEP 4</div>
                  <div className="text-sm font-medium text-gray-700">คุณลักษณะครูผู้สอน</div>
                  <div className="text-xs text-gray-600 mt-1">
                    (ครูดนตรีไทย, ครูภูมิปัญญา, ผู้ทรงคุณวุฒิ, วิทยากร)
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-2xl font-bold text-purple-600">{submission?.teacher_qualification_score || 0}</div>
                  <div className="text-xs text-gray-500">/ 20</div>
                </div>
              </div>
              <div className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded mt-2">
                5 คะแนน/ประเภท (สูงสุด 4 ประเภท)
              </div>
            </div>

            {/* Step 5: Support from Organization */}
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-teal-800 mb-1">STEP 5</div>
                  <div className="text-sm font-medium text-gray-700">การสนับสนุนจากต้นสังกัด</div>
                  <div className="text-xs text-gray-600 mt-1">
                    (บุคคล/หน่วยงานภายใน)
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-2xl font-bold text-teal-600">{submission?.support_from_org_score || 0}</div>
                  <div className="text-xs text-gray-500">/ 5</div>
                </div>
              </div>
              <div className="text-xs text-teal-700 bg-teal-100 px-2 py-1 rounded mt-2">
                ติ๊กถูก = 5 คะแนน
              </div>
            </div>

            {/* Step 5: Support from External */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-orange-800 mb-1">STEP 5</div>
                  <div className="text-sm font-medium text-gray-700">การสนับสนุนจากภายนอก</div>
                  <div className="text-xs text-gray-600 mt-1">
                    (บุคคล/หน่วยงานภายนอก)
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-2xl font-bold text-orange-600">{submission?.support_from_external_score || 0}</div>
                  <div className="text-xs text-gray-500">/ 15</div>
                </div>
              </div>
              <div className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded mt-2">
                1 คน=5, 2 คน=10, 3+ คน=15
              </div>
            </div>

            {/* Step 5: Award Score */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-amber-800 mb-1">STEP 5</div>
                  <div className="text-sm font-medium text-gray-700">รางวัลและเกียรติคุณ</div>
                  <div className="text-xs text-gray-600 mt-1">
                    (อำเภอ, จังหวัด, ภาค, ประเทศ)
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-2xl font-bold text-amber-600">{submission?.award_score || 0}</div>
                  <div className="text-xs text-gray-500">/ 20</div>
                </div>
              </div>
              <div className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded mt-2">
                อำเภอ=5, จังหวัด=10, ภาค=15, ประเทศ=20
              </div>
            </div>

            {/* Step 7: Internal Activities */}
            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-cyan-800 mb-1">STEP 7</div>
                  <div className="text-sm font-medium text-gray-700">กิจกรรมภายในสถานศึกษา</div>
                  <div className="text-xs text-gray-600 mt-1">
                    (ภายในจังหวัด - ภายในโรงเรียน)
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-2xl font-bold text-cyan-600">{submission?.activity_within_province_internal_score || 0}</div>
                  <div className="text-xs text-gray-500">/ 5</div>
                </div>
              </div>
              <div className="text-xs text-cyan-700 bg-cyan-100 px-2 py-1 rounded mt-2">
                ≥ 3 กิจกรรม = 5 คะแนน
              </div>
            </div>

            {/* Step 7: External Activities */}
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-indigo-800 mb-1">STEP 7</div>
                  <div className="text-sm font-medium text-gray-700">กิจกรรมภายนอกสถานศึกษา</div>
                  <div className="text-xs text-gray-600 mt-1">
                    (ภายในจังหวัด - นอกโรงเรียน)
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-2xl font-bold text-indigo-600">{submission?.activity_within_province_external_score || 0}</div>
                  <div className="text-xs text-gray-500">/ 5</div>
                </div>
              </div>
              <div className="text-xs text-indigo-700 bg-indigo-100 px-2 py-1 rounded mt-2">
                ≥ 3 กิจกรรม = 5 คะแนน
              </div>
            </div>

            {/* Step 7: Outside Province Activities */}
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-pink-800 mb-1">STEP 7</div>
                  <div className="text-sm font-medium text-gray-700">กิจกรรมนอกจังหวัด</div>
                  <div className="text-xs text-gray-600 mt-1">
                    (ภายนอกจังหวัด)
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-2xl font-bold text-pink-600">{submission?.activity_outside_province_score || 0}</div>
                  <div className="text-xs text-gray-500">/ 5</div>
                </div>
              </div>
              <div className="text-xs text-pink-700 bg-pink-100 px-2 py-1 rounded mt-2">
                ≥ 3 กิจกรรม = 5 คะแนน
              </div>
            </div>

            {/* Step 8: PR Activities */}
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-rose-800 mb-1">STEP 8</div>
                  <div className="text-sm font-medium text-gray-700">การประชาสัมพันธ์</div>
                  <div className="text-xs text-gray-600 mt-1">
                    (Facebook, YouTube, TikTok, Website)
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-2xl font-bold text-rose-600">{submission?.pr_activity_score || 0}</div>
                  <div className="text-xs text-gray-500">/ 5</div>
                </div>
              </div>
              <div className="text-xs text-rose-700 bg-rose-100 px-2 py-1 rounded mt-2">
                ≥ 3 กิจกรรม = 5 คะแนน
              </div>
            </div>
          </div>

          {/* Score Calculation Summary */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-sm font-semibold text-gray-700 mb-2">สรุปการคำนวณคะแนน:</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Step 4: การเรียนการสอน (4 ข้อ × 5)</span>
                <span className="font-medium">{submission?.teacher_training_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 4: คุณลักษณะครู (ประเภทที่ไม่ซ้ำ × 5)</span>
                <span className="font-medium">{submission?.teacher_qualification_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 5: สนับสนุนจากต้นสังกัด</span>
                <span className="font-medium">{submission?.support_from_org_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 5: สนับสนุนจากภายนอก</span>
                <span className="font-medium">{submission?.support_from_external_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 5: รางวัล (ระดับสูงสุด)</span>
                <span className="font-medium">{submission?.award_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 7: กิจกรรมภายในสถานศึกษา</span>
                <span className="font-medium">{submission?.activity_within_province_internal_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 7: กิจกรรมภายนอกสถานศึกษา</span>
                <span className="font-medium">{submission?.activity_within_province_external_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 7: กิจกรรมนอกจังหวัด</span>
                <span className="font-medium">{submission?.activity_outside_province_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 8: การประชาสัมพันธ์</span>
                <span className="font-medium">{submission?.pr_activity_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t-2 border-gray-300 font-bold text-green-700">
                <span>รวมทั้งหมด</span>
                <span>{submission?.total_score || 0} / 100 คะแนน</span>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
        )}
        {/* Action Buttons - Above Step 1 */}
        {!readOnly && (
        <div className="flex gap-3 mb-6 justify-end">
          {!isEditMode ? (
            <>
              <button
                onClick={() => handleExportPDF()}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </button>
              <button
                onClick={() => handleExportExcel()}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                EDIT
              </button>
              {!hideDelete && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  DELETE
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                CANCEL
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isSaving ? 'SAVING...' : 'SAVE'}
              </button>
            </>
          )}
        </div>
        )}

        {/* Step 1: ข้อมูลพื้นฐาน */}
        <StepSection title="ข้อมูลพื้นฐาน" stepNumber={1}>
          <div className="space-y-6">
            {/* ประเภทโรงเรียน */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย</h4>
              <div className="grid grid-cols-2 gap-6">
                <Field label="ประเภทที่เลือก" value={selectedSupportType} isEditMode={isEditMode} onChange={(val) => handleFieldChange('supportType', val)} fieldName="supportType" />
                <Field label={selectedSupportType ? `ชื่อ${selectedSupportType}` : 'ชื่อหน่วยที่ต้องการสนับสนุน'} value={selectedSupportTypeNameValue} isEditMode={isEditMode} onChange={(val) => selectedSupportTypeNameField && handleFieldChange(selectedSupportTypeNameField, val)} fieldName={selectedSupportTypeNameField || 'supportTypeName'} />
                <Field label="จำนวน (คน)" value={displayData?.supportTypeMemberCount ?? displayData?.memberCount} isEditMode={isEditMode} onChange={(val) => handleFieldChange('supportTypeMemberCount', val)} fieldName="supportTypeMemberCount" />
              </div>
            </div>

            {/* ข้อมูลโรงเรียน */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">ข้อมูลโรงเรียน</h4>
              <div className="grid grid-cols-2 gap-6">
                <Field label="ชื่อสถานศึกษา" value={displayData?.schoolName} isEditMode={isEditMode} onChange={(val) => handleFieldChange('schoolName', val)} fieldName="schoolName" />
                <Field label="จังหวัด" value={displayData?.schoolProvince} isEditMode={isEditMode} onChange={(val) => handleFieldChange('schoolProvince', val)} fieldName="schoolProvince" />
                <Field label="ระดับการศึกษา" value={displayData?.schoolLevel} isEditMode={isEditMode} onChange={(val) => handleFieldChange('schoolLevel', val)} fieldName="schoolLevel" />
                <Field label="สังกัด" value={displayData?.affiliation} isEditMode={isEditMode} onChange={(val) => handleFieldChange('affiliation', val)} fieldName="affiliation" />
                <Field label="ระบุ" value={displayData?.affiliationDetail} isEditMode={isEditMode} onChange={(val) => handleFieldChange('affiliationDetail', val)} fieldName="affiliationDetail" />
                <Field label="ขนาดโรงเรียน" value={schoolSizeDisplayValue} isEditMode={isEditMode} onChange={(val) => handleFieldChange('schoolSize', val)} fieldName="schoolSize" />
                <Field label="จำนวนบุคลากร" value={displayData?.staffCount} isEditMode={isEditMode} onChange={(val) => handleFieldChange('staffCount', val)} fieldName="staffCount" />
                <Field label="จำนวนนักเรียน" value={displayData?.studentCount} isEditMode={isEditMode} onChange={(val) => handleFieldChange('studentCount', val)} fieldName="studentCount" />
                <Field label="จำนวนนักเรียนแต่ละชั้น" value={displayData?.studentCountByGrade} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('studentCountByGrade', val)} fieldName="studentCountByGrade" />
              </div>
            </div>
          
            {/* สถานที่ตั้ง */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">สถานที่ตั้ง</h4>
              <div className="grid grid-cols-2 gap-6">
                <Field label="เลขที่" value={displayData?.addressNo} isEditMode={isEditMode} onChange={(val) => handleFieldChange('addressNo', val)} fieldName="addressNo" />
                <Field label="หมู่" value={displayData?.moo} isEditMode={isEditMode} onChange={(val) => handleFieldChange('moo', val)} fieldName="moo" />
                <Field label="ถนน" value={displayData?.road} isEditMode={isEditMode} onChange={(val) => handleFieldChange('road', val)} fieldName="road" />
                <Field label="ตำบล/แขวง" value={displayData?.subDistrict} isEditMode={isEditMode} onChange={(val) => handleFieldChange('subDistrict', val)} fieldName="subDistrict" />
                <Field label="อำเภอ/เขต" value={displayData?.district} isEditMode={isEditMode} onChange={(val) => handleFieldChange('district', val)} fieldName="district" />
                <Field label="จังหวัด" value={displayData?.provinceAddress} isEditMode={isEditMode} onChange={(val) => handleFieldChange('provinceAddress', val)} fieldName="provinceAddress" />
                <Field label="รหัสไปรษณีย์" value={displayData?.postalCode} isEditMode={isEditMode} onChange={(val) => handleFieldChange('postalCode', val)} fieldName="postalCode" />
                <Field label="โทรศัพท์" value={displayData?.phone} isEditMode={isEditMode} onChange={(val) => handleFieldChange('phone', val)} fieldName="phone" />
                <Field label="โทรสาร" value={displayData?.fax} isEditMode={isEditMode} onChange={(val) => handleFieldChange('fax', val)} fieldName="fax" />
              </div>
            </div>
          </div>
        </StepSection>

        {/* Step 2: ผู้บริหาร */}
        <StepSection title="ผู้บริหาร" stepNumber={2}>
          <div className="grid grid-cols-2 gap-6">
            <Field label="ชื่อ-นามสกุล" value={displayData?.mgtFullName} isEditMode={isEditMode} onChange={(val) => handleFieldChange('mgtFullName', val)} fieldName="mgtFullName" />
            <Field label="ตำแหน่ง" value={displayData?.mgtPosition} isEditMode={isEditMode} onChange={(val) => handleFieldChange('mgtPosition', val)} fieldName="mgtPosition" />
            <Field label="ที่อยู่" value={displayData?.mgtAddress} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('mgtAddress', val)} fieldName="mgtAddress" />
            <Field label="โทรศัพท์" value={displayData?.mgtPhone} isEditMode={isEditMode} onChange={(val) => handleFieldChange('mgtPhone', val)} fieldName="mgtPhone" />
            <Field label="อีเมล" value={displayData?.mgtEmail} isEditMode={isEditMode} onChange={(val) => handleFieldChange('mgtEmail', val)} fieldName="mgtEmail" />
          </div>
          
          {/* Image Section */}
          <div className="mt-4">
            {isEditMode ? (
              <Field 
                label="ลิงก์รูปภาพผู้บริหาร (URL)" 
                value={displayData?.mgtImage} 
                fullWidth
                isEditMode={isEditMode}
                onChange={(val) => handleFieldChange('mgtImage', val)}
                fieldName="mgtImage"
              />
            ) : (
              displayData?.mgtImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพผู้บริหาร</label>
                  <div 
                    onClick={() => handleImageClick(
                      displayData?.mgtImage?.startsWith('http') 
                        ? displayData?.mgtImage 
                        : displayData?.mgtImage?.startsWith('/uploads/') 
                          ? displayData?.mgtImage.replace('/uploads/', '/api/uploads/')
                          : displayData?.mgtImage
                    )}
                    className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
                  >
                    <img 
                      src={displayData?.mgtImage?.startsWith('http') 
                        ? displayData?.mgtImage 
                        : displayData?.mgtImage?.startsWith('/uploads/') 
                          ? displayData?.mgtImage.replace('/uploads/', '/api/uploads/')
                          : displayData?.mgtImage
                      }
                      alt="ผู้บริหาร" 
                      className="rounded-lg border border-gray-300 w-[200px] h-[200px] object-cover"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </StepSection>

        {/* Step 3: สภาวการณ์ */}
        <StepSection title="สภาวการณ์" stepNumber={3}>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">ความพร้อมเครื่องดนตรี</h4>
              {displayData?.readinessItems && displayData.readinessItems.length > 0 ? (
                displayData.readinessItems.map((item: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                    <div className="grid grid-cols-3 gap-4">
                      <Field label="ชื่อเครื่องดนตรี" value={item.instrumentName} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('readinessItems', index, 'instrumentName', val)} fieldName="instrumentName" />
                      <Field label="จำนวน" value={item.quantity} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('readinessItems', index, 'quantity', val)} fieldName="quantity" />
                      <Field label="หมายเหตุ" value={item.note} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('readinessItems', index, 'note', val)} fieldName="note" />
                    </div>
                    {isEditMode && (
                      <button
                        onClick={() => handleRemoveArrayItem('readinessItems', index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">ไม่มีข้อมูล</p>
              )}
              {isEditMode && (
                <button
                  onClick={() => handleAddArrayItem('readinessItems', { instrumentName: '', quantity: '', note: '' })}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  เพิ่มเครื่องดนตรี
                </button>
              )}
            </div>
          </div>
        </StepSection>

        {/* Step 4: ผู้สอน */}
        <StepSection title="ผู้สอนดนตรีไทย" stepNumber={4}>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">รายชื่อครู</h4>
              {displayData?.thaiMusicTeachers && displayData.thaiMusicTeachers.length > 0 ? (
                displayData.thaiMusicTeachers.map((teacher: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="คุณลักษณะ" value={teacher.teacherQualification} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('thaiMusicTeachers', index, 'teacherQualification', val)} fieldName="teacherQualification" />
                      <Field label="ชื่อ-นามสกุล" value={teacher.teacherFullName} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('thaiMusicTeachers', index, 'teacherFullName', val)} fieldName="teacherFullName" />
                      <Field label="ตำแหน่ง" value={teacher.teacherPosition} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('thaiMusicTeachers', index, 'teacherPosition', val)} fieldName="teacherPosition" />
                      <Field label="วุฒิการศึกษา" value={teacher.teacherEducation} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('thaiMusicTeachers', index, 'teacherEducation', val)} fieldName="teacherEducation" />
                      <Field label="โทรศัพท์" value={teacher.teacherPhone} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('thaiMusicTeachers', index, 'teacherPhone', val)} fieldName="teacherPhone" />
                      <Field label="อีเมล" value={teacher.teacherEmail} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('thaiMusicTeachers', index, 'teacherEmail', val)} fieldName="teacherEmail" />
                    </div>
                    
                    {/* Image Section */}
                    <div className="mt-4">
                      {isEditMode ? (
                        <Field 
                          label="ลิงก์รูปภาพครู (URL)" 
                          value={teacher.teacherImage} 
                          fullWidth
                          isEditMode={isEditMode}
                          onChange={(val) => handleArrayFieldChange('thaiMusicTeachers', index, 'teacherImage', val)}
                          fieldName="teacherImage"
                        />
                      ) : (
                        teacher.teacherImage && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพครู</label>
                            <div 
                              onClick={() => handleImageClick(
                                teacher.teacherImage.startsWith('http') 
                                  ? teacher.teacherImage 
                                  : teacher.teacherImage.startsWith('/uploads/') 
                                    ? teacher.teacherImage.replace('/uploads/', '/api/uploads/')
                                    : teacher.teacherImage
                              )}
                              className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
                            >
                              <img 
                                src={teacher.teacherImage.startsWith('http') 
                                  ? teacher.teacherImage 
                                  : teacher.teacherImage.startsWith('/uploads/') 
                                    ? teacher.teacherImage.replace('/uploads/', '/api/uploads/')
                                    : teacher.teacherImage
                                }
                                alt={`ครู ${index + 1}`}
                                className="rounded-lg border border-gray-300 w-[150px] h-[150px] object-cover"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    
                    {isEditMode && (
                      <button
                        onClick={() => handleRemoveArrayItem('thaiMusicTeachers', index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">ไม่มีข้อมูล</p>
              )}
              {isEditMode && (
                <button
                  onClick={() => handleAddArrayItem('thaiMusicTeachers', { 
                    teacherQualification: '', 
                    teacherFullName: '', 
                    teacherPosition: '', 
                    teacherEducation: '', 
                    teacherPhone: '', 
                    teacherEmail: '',
                    teacherImage: ''
                  })}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  เพิ่มครู
                </button>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">การเรียนการสอน</h4>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <CheckboxField label="วิชาบังคับ" value={displayData?.isCompulsorySubject} />
                <CheckboxField label="สอนหลังเลิกเรียน" value={displayData?.hasAfterSchoolTeaching} />
                <CheckboxField label="วิชาเลือก" value={displayData?.hasElectiveSubject} />
                <CheckboxField label="หลักสูตรท้องถิ่น" value={displayData?.hasLocalCurriculum} />
              </div>
            </div>
          </div>
        </StepSection>

        {/* Step 5: สถานที่ */}
        <StepSection title="สถานที่" stepNumber={5}>
          <Field label="สถานที่สอน" value={displayData?.teachingLocation} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('teachingLocation', val)} fieldName="teachingLocation" />
        </StepSection>

        {/* Step 6: การสนับสนุน */}
        <StepSection title="การสนับสนุน" stepNumber={6}>
          <div className="space-y-6">
            {/* นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา</h4>
              <p className="text-sm text-gray-600 mb-3">ผู้มีส่วนส่งเสริม สนับสนุนการเรียนการสอนดนตรีไทย (ระบุนโยบายการจัดการเรียนการสอนดนตรีไทยของโรงเรียน วิธีการใช้ความสนับสนุน)</p>
              {displayData?.supportFactors && displayData.supportFactors.length > 0 ? (
                displayData.supportFactors.map((item: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                    <div className="space-y-3">
                      <Field 
                        label="องค์กร/หน่วยงาน/บุคคลที่ให้การส่งเสริม สนับสนุน" 
                        value={item.sup_supportByAdmin} 
                        fullWidth 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleArrayFieldChange('supportFactors', index, 'sup_supportByAdmin', val)} 
                        fieldName="sup_supportByAdmin" 
                      />
                      <Field 
                        label="บรรยาย และอธิบายสนับสนุน" 
                        value={item.sup_supportByDescription} 
                        fullWidth 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleArrayFieldChange('supportFactors', index, 'sup_supportByDescription', val)} 
                        fieldName="sup_supportByDescription" 
                      />
                    </div>
                    {isEditMode && (
                      <button
                        onClick={() => handleRemoveArrayItem('supportFactors', index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">ไม่มีข้อมูล</p>
              )}
              {isEditMode && (
                <button
                  onClick={() => handleAddArrayItem('supportFactors', { sup_supportByAdmin: '', sup_supportByDescription: '' })}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  เพิ่มข้อมูล
                </button>
              )}
            </div>

            {/* การสนับสนุนจากต้นสังกัด */}
            <div>
              <CheckboxField label="ได้รับการสนับสนุนจากต้นสังกัด (บุคคล/หน่วยงานภายใน)" value={displayData?.hasSupportFromOrg} />
              {displayData?.supportFromOrg && displayData.supportFromOrg.length > 0 && (
                <div className="mt-3 space-y-3">
                  {displayData.supportFromOrg.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                      <div className="space-y-3">
                        <Field label="บุคคล/หน่วยงาน" value={item.organization} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('supportFromOrg', index, 'organization', val)} fieldName="organization" />
                        <Field label="รายละเอียด" value={item.details} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('supportFromOrg', index, 'details', val)} fieldName="details" />
                        <Field label="หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)" value={item.evidenceLink} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('supportFromOrg', index, 'evidenceLink', val)} fieldName="evidenceLink" />
                      </div>
                      {isEditMode && (
                        <button
                          onClick={() => handleRemoveArrayItem('supportFromOrg', index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {isEditMode && (
                <button
                  onClick={() => handleAddArrayItem('supportFromOrg', { organization: '', details: '', evidenceLink: '' })}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  เพิ่มข้อมูล
                </button>
              )}
            </div>

            {/* การสนับสนุนจากบุคคล/หน่วยงานภายนอก */}
            <div>
              <CheckboxField label="ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก" value={displayData?.hasSupportFromExternal} />
              {displayData?.supportFromExternal && displayData.supportFromExternal.length > 0 && (
                <div className="mt-3 space-y-3">
                  {displayData.supportFromExternal.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                      <div className="space-y-3">
                        <Field label="บุคคล/หน่วยงาน" value={item.organization} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('supportFromExternal', index, 'organization', val)} fieldName="organization" />
                        <Field label="รายละเอียด" value={item.details} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('supportFromExternal', index, 'details', val)} fieldName="details" />
                        <Field label="หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)" value={item.evidenceLink} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('supportFromExternal', index, 'evidenceLink', val)} fieldName="evidenceLink" />
                      </div>
                      {isEditMode && (
                        <button
                          onClick={() => handleRemoveArrayItem('supportFromExternal', index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {isEditMode && (
                <button
                  onClick={() => handleAddArrayItem('supportFromExternal', { organization: '', details: '', evidenceLink: '' })}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  เพิ่มข้อมูล
                </button>
              )}
            </div>
          </div>
        </StepSection>

        {/* Step 7: ผลงาน */}
        <StepSection title="ผลงาน" stepNumber={7}>
          <div className="space-y-6">
            {/* รางวัล */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">รางวัล</h4>
              <p className="text-xs text-gray-500 mb-3">อำเภอ 5 คะแนน / จังหวัด 10 คะแนน / ภาค 15 คะแนน / ประเทศ 20 คะแนน</p>
              {displayData?.awards && displayData.awards.length > 0 ? (
                displayData.awards.map((award: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField 
                        label="ระดับรางวัล:" 
                        value={award.awardLevel} 
                        options={['อำเภอ', 'จังหวัด', 'ภาค', 'ประเทศ']} 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleArrayFieldChange('awards', index, 'awardLevel', val)} 
                        fieldName="awardLevel" 
                        required 
                      />
                      <Field label="ชื่อรางวัล:" value={award.awardName} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('awards', index, 'awardName', val)} fieldName="awardName" />
                      <Field label="วันที่ได้รับรางวัล:" value={award.awardDate} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('awards', index, 'awardDate', val)} fieldName="awardDate" />
                      <Field label="ลิงก์หลักฐาน:" value={award.awardEvidenceLink} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('awards', index, 'awardEvidenceLink', val)} fieldName="awardEvidenceLink" />
                    </div>
                    {isEditMode && (
                      <button
                        onClick={() => handleRemoveArrayItem('awards', index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">ไม่มีข้อมูล</p>
              )}
              {isEditMode && (
                <button
                  onClick={() => handleAddArrayItem('awards', { awardLevel: '', awardName: '', awardDate: '', awardEvidenceLink: '' })}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  เพิ่มรางวัล
                </button>
              )}
            </div>

            {/* ภาพถ่ายผลงาน และคลิปวิดีโอ */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">ภาพถ่ายผลงาน และคลิปวิดีโอที่มีความชัดเจน และสื่อให้เห็นถึงความเป็นโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย ๑๐๐ เปอร์เซ็นต์</h4>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-2">ภาพถ่ายผลงาน หรือกิจกรรมเด่น ตั้งแต่ปีการศึกษา 2567 - พฤษภาคม 2568 จำนวน 10 - 20 ภาพ เท่านั้น!!!</h5>
                  <p className="text-sm text-gray-600 mb-3">Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)</p>
                  <Field 
                    label="" 
                    value={displayData?.photoGalleryLink} 
                    fullWidth 
                    isEditMode={isEditMode} 
                    onChange={(val) => handleFieldChange('photoGalleryLink', val)} 
                    fieldName="photoGalleryLink" 
                  />
                  <p className="text-xs text-gray-500 mt-2">กรุณาเปลี่ยนที่สามารถเข้าถึงได้ "ทุกคนในอินเทอร์เน็ต จะดูได้ทั้งหมดโดยไม่ต้องลงชื่อเข้าใช้"</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-gray-900 mb-2">วิดีโอ/คลิป</h5>
                  <p className="text-xs text-red-600 font-medium mb-3">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"</p>
                  
                  <div className="space-y-4">
                    {/* Video 1 */}
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <p className="text-sm font-medium text-gray-900 mb-2">1 บรรยากาศการเรียนการสอนในชั้นเรียน และในสถานศึกษา ความยาวไม่เกิน 3 นาที</p>
                      <p className="text-xs text-gray-600 mb-2">Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)</p>
                      <Field 
                        label="" 
                        value={displayData?.videoLink} 
                        fullWidth 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleFieldChange('videoLink', val)} 
                        fieldName="videoLink" 
                      />
                    </div>

                    {/* Video 2 */}
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <p className="text-sm font-medium text-gray-900 mb-2">2 การแสดงผลงานด้านดนตรีของนักเรียน ความยาวไม่เกิน 3 นาที</p>
                      <p className="text-xs text-gray-600 mb-2">Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)</p>
                      <Field 
                        label="" 
                        value={displayData?.videoLink2} 
                        fullWidth 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleFieldChange('videoLink2', val)} 
                        fieldName="videoLink2" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StepSection>

        {/* Step 8: การเผยแพร่ */}
        <StepSection title="การเผยแพร่" stepNumber={8}>
          <div className="space-y-6">
            <ActivityList 
              title="กิจกรรมภายในจังหวัด (ภายใน)" 
              activities={isEditMode ? displayData?.activitiesWithinProvinceInternal : submission.regsup_activitiesWithinProvinceInternal || submission.activitiesWithinProvinceInternal} 
              isEditMode={isEditMode}
              onFieldChange={(index, field, value) => handleArrayFieldChange('activitiesWithinProvinceInternal', index, field, value)}
              arrayFieldName="activitiesWithinProvinceInternal"
              onAdd={() => handleAddArrayItem('activitiesWithinProvinceInternal', { activityName: '', activityDate: '', evidenceLink: '' })}
              onRemove={(index) => handleRemoveArrayItem('activitiesWithinProvinceInternal', index)}
            />
            <ActivityList 
              title="กิจกรรมภายในจังหวัด (ภายนอก)" 
              activities={isEditMode ? displayData?.activitiesWithinProvinceExternal : submission.regsup_activitiesWithinProvinceExternal || submission.activitiesWithinProvinceExternal} 
              isEditMode={isEditMode}
              onFieldChange={(index, field, value) => handleArrayFieldChange('activitiesWithinProvinceExternal', index, field, value)}
              arrayFieldName="activitiesWithinProvinceExternal"
              onAdd={() => handleAddArrayItem('activitiesWithinProvinceExternal', { activityName: '', activityDate: '', evidenceLink: '' })}
              onRemove={(index) => handleRemoveArrayItem('activitiesWithinProvinceExternal', index)}
            />
            <ActivityList 
              title="กิจกรรมนอกจังหวัด" 
              activities={isEditMode ? displayData?.activitiesOutsideProvince : submission.regsup_activitiesOutsideProvince || submission.activitiesOutsideProvince} 
              isEditMode={isEditMode}
              onFieldChange={(index, field, value) => handleArrayFieldChange('activitiesOutsideProvince', index, field, value)}
              arrayFieldName="activitiesOutsideProvince"
              onAdd={() => handleAddArrayItem('activitiesOutsideProvince', { activityName: '', activityDate: '', evidenceLink: '' })}
              onRemove={(index) => handleRemoveArrayItem('activitiesOutsideProvince', index)}
            />
          </div>
        </StepSection>

        {/* Step 9: การประชาสัมพันธ์ */}
        <StepSection title="การประชาสัมพันธ์" stepNumber={9}>
          <div className="space-y-6">
            <ActivityList 
              title="การประชาสัมพันธ์ผลงานของสถานศึกษา" 
              activities={isEditMode ? displayData?.prActivities : submission.regsup_prActivities || submission.prActivities} 
              isEditMode={isEditMode}
              onFieldChange={(index, field, value) => handleArrayFieldChange('prActivities', index, field, value)}
              arrayFieldName="prActivities"
              onAdd={() => handleAddArrayItem('prActivities', { activityName: '', publishDate: '', evidenceLink: '', platform: '' })}
              onRemove={(index) => handleRemoveArrayItem('prActivities', index)}
              hasPlatform
            />

            {/* Information Sources */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">ได้รับข้อมูลการสมัครโรงเรียนสนับสนุนและส่งเสริมจาก</h4>
              <div className="space-y-4">
                <div>
                  <CheckboxField 
                    label="โรงเรียน:" 
                    value={displayData?.heardFromSchool} 
                    isEditMode={isEditMode} 
                    onChange={(val) => handleFieldChange('heardFromSchool', val)} 
                    fieldName="heardFromSchool" 
                  />
                  {displayData?.heardFromSchool && (
                    <div className="ml-6 mt-2 space-y-2">
                      <Field 
                        label="ชื่อโรงเรียน:" 
                        value={displayData?.heardFromSchoolName} 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleFieldChange('heardFromSchoolName', val)} 
                        fieldName="heardFromSchoolName" 
                      />
                      <Field 
                        label="อำเภอ:" 
                        value={displayData?.heardFromSchoolDistrict} 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleFieldChange('heardFromSchoolDistrict', val)} 
                        fieldName="heardFromSchoolDistrict" 
                      />
                      <Field 
                        label="จังหวัด:" 
                        value={displayData?.heardFromSchoolProvince} 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleFieldChange('heardFromSchoolProvince', val)} 
                        fieldName="heardFromSchoolProvince" 
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-3">ช่องทางการประชาสัมพันธ์ของกรมส่งเสริมวัฒนธรรม</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <CheckboxField 
                      label="เฟซบุ๊ก (Facebook):" 
                      value={displayData?.DCP_PR_Channel_FACEBOOK} 
                      isEditMode={isEditMode} 
                      onChange={(val) => handleFieldChange('DCP_PR_Channel_FACEBOOK', val)} 
                      fieldName="DCP_PR_Channel_FACEBOOK" 
                    />
                    <CheckboxField 
                      label="ยูทูบ (YouTube):" 
                      value={displayData?.DCP_PR_Channel_YOUTUBE} 
                      isEditMode={isEditMode} 
                      onChange={(val) => handleFieldChange('DCP_PR_Channel_YOUTUBE', val)} 
                      fieldName="DCP_PR_Channel_YOUTUBE" 
                    />
                    <CheckboxField 
                      label="ติ๊กต๊อก (TikTok):" 
                      value={displayData?.DCP_PR_Channel_Tiktok} 
                      isEditMode={isEditMode} 
                      onChange={(val) => handleFieldChange('DCP_PR_Channel_Tiktok', val)} 
                      fieldName="DCP_PR_Channel_Tiktok" 
                    />
                  </div>
                </div>
                <div>
                  <CheckboxField 
                    label="สำนักงานวัฒนธรรมจังหวัด:" 
                    value={displayData?.heardFromCulturalOffice} 
                    isEditMode={isEditMode} 
                    onChange={(val) => handleFieldChange('heardFromCulturalOffice', val)} 
                    fieldName="heardFromCulturalOffice" 
                  />
                  {displayData?.heardFromCulturalOffice && (
                    <div className="ml-6 mt-2">
                      <Field 
                        label="ระบุสำนักงานวัฒนธรรมจังหวัด:" 
                        value={displayData?.heardFromCulturalOfficeName} 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleFieldChange('heardFromCulturalOfficeName', val)} 
                        fieldName="heardFromCulturalOfficeName" 
                      />
                    </div>
                  )}
                </div>
                <div>
                  <CheckboxField 
                    label="สำนักงานเขตพื้นที่การศึกษา:" 
                    value={displayData?.heardFromEducationArea} 
                    isEditMode={isEditMode} 
                    onChange={(val) => handleFieldChange('heardFromEducationArea', val)} 
                    fieldName="heardFromEducationArea" 
                  />
                  {displayData?.heardFromEducationArea && (
                    <div className="ml-6 mt-2 space-y-2">
                      <Field 
                        label="ระบุสำนักงานเขตพื้นที่การศึกษา:" 
                        value={displayData?.heardFromEducationAreaName} 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleFieldChange('heardFromEducationAreaName', val)} 
                        fieldName="heardFromEducationAreaName" 
                      />
                      <Field 
                        label="จังหวัด:" 
                        value={displayData?.heardFromEducationAreaProvince} 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleFieldChange('heardFromEducationAreaProvince', val)} 
                        fieldName="heardFromEducationAreaProvince" 
                      />
                    </div>
                  )}
                </div>
                <div>
                  <CheckboxField 
                    label="อื่น ๆ ระบุ:" 
                    value={displayData?.heardFromOther} 
                    isEditMode={isEditMode} 
                    onChange={(val) => handleFieldChange('heardFromOther', val)} 
                    fieldName="heardFromOther" 
                  />
                  {displayData?.heardFromOther && (
                    <div className="ml-6 mt-2">
                      <Field 
                        label="ระบุ:" 
                        value={displayData?.heardFromOtherDetail} 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleFieldChange('heardFromOtherDetail', val)} 
                        fieldName="heardFromOtherDetail" 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Field 
              label="ปัญหาและอุปสรรคที่มีผลกระทบต่อการเรียนการสอนดนตรีไทย:" 
              value={displayData?.obstacles} 
              fullWidth 
              isEditMode={isEditMode} 
              onChange={(val) => handleFieldChange('obstacles', val)} 
              fieldName="obstacles" 
            />
            
            <Field 
              label="ข้อเสนอแนะในการส่งเสริมดนตรีไทยในสถานศึกษา:" 
              value={displayData?.suggestions} 
              fullWidth 
              isEditMode={isEditMode} 
              onChange={(val) => handleFieldChange('suggestions', val)} 
              fieldName="suggestions" 
            />

            <div className="bg-gray-50 p-4 rounded-lg">
              <CheckboxField 
                label="ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในแบบฟอร์มนี้เป็นความจริงทุกประการ:" 
                value={displayData?.certifiedINFOByAdminName || displayData?.regsup_certifiedByAdmin || displayData?.certifiedByAdmin || false} 
                isEditMode={isEditMode} 
                onChange={(val) => handleFieldChange('certifiedByAdmin', val)} 
                fieldName="certifiedByAdmin" 
              />
            </div>
          </div>
        </StepSection>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">ยืนยันการลบ</h3>
            <p className="text-gray-600 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ <strong>{submission.schoolName}</strong>?
              <br />
              <span className="text-red-600">การดำเนินการนี้ไม่สามารถย้อนกลับได้</span>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all"
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-7xl max-h-[90vh]">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={selectedImage.startsWith('http') ? selectedImage : selectedImage}
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StepSection({ title, stepNumber, children }: { title: string; stepNumber: number; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          {stepNumber}. {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function ScoreCard({ step, title, subtitle, score, max, color, note }: {
  step: string;
  title: string;
  subtitle: string;
  score: number;
  max: number;
  color: 'purple' | 'teal' | 'orange' | 'amber' | 'cyan' | 'indigo' | 'pink' | 'rose';
  note: string;
}) {
  const themes = {
    purple: ['bg-purple-50', 'border-purple-200', 'text-purple-800', 'text-purple-600', 'text-purple-700', 'bg-purple-100'],
    teal: ['bg-teal-50', 'border-teal-200', 'text-teal-800', 'text-teal-600', 'text-teal-700', 'bg-teal-100'],
    orange: ['bg-orange-50', 'border-orange-200', 'text-orange-800', 'text-orange-600', 'text-orange-700', 'bg-orange-100'],
    amber: ['bg-amber-50', 'border-amber-200', 'text-amber-800', 'text-amber-600', 'text-amber-700', 'bg-amber-100'],
    cyan: ['bg-cyan-50', 'border-cyan-200', 'text-cyan-800', 'text-cyan-600', 'text-cyan-700', 'bg-cyan-100'],
    indigo: ['bg-indigo-50', 'border-indigo-200', 'text-indigo-800', 'text-indigo-600', 'text-indigo-700', 'bg-indigo-100'],
    pink: ['bg-pink-50', 'border-pink-200', 'text-pink-800', 'text-pink-600', 'text-pink-700', 'bg-pink-100'],
    rose: ['bg-rose-50', 'border-rose-200', 'text-rose-800', 'text-rose-600', 'text-rose-700', 'bg-rose-100'],
  } as const;

  const [bg, border, stepColor, scoreColor, noteText, noteBg] = themes[color];

  return (
    <div className={`${bg} p-4 rounded-lg border ${border}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className={`text-xs font-semibold ${stepColor} mb-1`}>{step}</div>
          <div className="text-sm font-medium text-gray-700">{title}</div>
          <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
        </div>
        <div className="text-right ml-3">
          <div className={`text-2xl font-bold ${scoreColor}`}>{score}</div>
          <div className="text-xs text-gray-500">/ {max}</div>
        </div>
      </div>
      <div className={`text-xs ${noteText} ${noteBg} px-2 py-1 rounded mt-2`}>
        {note}
      </div>
    </div>
  );
}

function Field({ label, value, fullWidth = false, isEditMode = false, onChange, fieldName }: { 
  label: string; 
  value: any; 
  fullWidth?: boolean;
  isEditMode?: boolean;
  onChange?: (value: any) => void;
  fieldName?: string;
}) {
  const isUrl = (str: string) => {
    if (!str || typeof str !== 'string') return false;
    return str.startsWith('http://') || str.startsWith('https://');
  };

  const renderValue = () => {
    if (!value) return <span className="text-gray-400">-</span>;
    
    if (isUrl(value)) {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline break-all"
        >
          {value}
        </a>
      );
    }
    
    return value;
  };

  if (isEditMode && onChange && fieldName) {
    // Use textarea for long text fields
    const isLongTextField = ['studentCountByGrade', 'mgtAddress', 'teachingLocation'].includes(fieldName);
    
    return (
      <div className={fullWidth ? 'col-span-2' : ''}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {isLongTextField ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        ) : (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      </div>
    );
  }

  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[44px]">
        {renderValue()}
      </div>
    </div>
  );
}

function SelectField({ label, value, options, fullWidth = false, isEditMode = false, onChange, fieldName, required = false }: {
  label: string; value: any; options: string[]; fullWidth?: boolean; isEditMode?: boolean; onChange?: (v: any) => void; fieldName?: string; required?: boolean;
}) {
  if (isEditMode && onChange && fieldName) {
    return (
      <div className={fullWidth ? 'col-span-2' : ''}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
        <select value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
          <option value="">เลือก{label}</option>
          {value && !options.includes(value) && <option value={value} className="bg-yellow-50">{value} (ค่าเดิม)</option>}
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {required && !value && <p className="mt-1 text-sm text-red-500">กรุณาเลือก{label}</p>}
      </div>
    );
  }
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[44px]">{value || <span className="text-gray-400">-</span>}</div>
    </div>
  );
}

function CheckboxField({ label, value, isEditMode = false, onChange, fieldName }: {
  label: string | React.ReactNode; value: boolean; isEditMode?: boolean; onChange?: (v: boolean) => void; fieldName?: string;
}) {
  if (isEditMode && onChange) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 rounded border-2 border-gray-300"
        />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${value ? 'bg-[#00B050] border-[#00B050]' : 'border-gray-300'}`}>
        {value && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

function ActivityList({ title, activities, isEditMode = false, onFieldChange, arrayFieldName, onAdd, onRemove, hasPlatform = false }: { 
  title: string; 
  activities: any[];
  isEditMode?: boolean;
  onFieldChange?: (index: number, field: string, value: any) => void;
  arrayFieldName?: string;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  hasPlatform?: boolean;
}) {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      {activities && activities.length > 0 ? (
        activities.map((activity: any, index: number) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <Field 
                  label="ชื่อกิจกรรม/งาน" 
                  value={activity.activityName} 
                  isEditMode={isEditMode}
                  onChange={(val) => onFieldChange && onFieldChange(index, 'activityName', val)}
                  fieldName="activityName"
                />
                <Field 
                  label="วันที่เผยแพร่" 
                  value={activity.activityDate || activity.publishDate} 
                  isEditMode={isEditMode}
                  onChange={(val) => onFieldChange && onFieldChange(index, hasPlatform ? 'publishDate' : 'activityDate', val)}
                  fieldName={hasPlatform ? 'publishDate' : 'activityDate'}
                />
                <Field 
                  label="หลักฐานการเผยแพร่ (Link/URL)" 
                  value={activity.evidenceLink} 
                  isEditMode={isEditMode}
                  onChange={(val) => onFieldChange && onFieldChange(index, 'evidenceLink', val)}
                  fieldName="evidenceLink"
                />
                {hasPlatform && (
                  <Field 
                    label="แหล่งเผยแพร่/ประชาสัมพันธ์ในสื่อสังคมออนไลน์" 
                    value={activity.platform} 
                    isEditMode={isEditMode}
                    onChange={(val) => onFieldChange && onFieldChange(index, 'platform', val)}
                    fieldName="platform"
                  />
                )}
              </div>
            </div>
            {isEditMode && onRemove && (
              <button
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">ไม่มีข้อมูล</p>
      )}
      {isEditMode && onAdd && (
        <button
          onClick={onAdd}
          className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          เพิ่มกิจกรรม
        </button>
      )}
    </div>
  );
}
