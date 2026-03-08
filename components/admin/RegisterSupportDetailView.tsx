'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateGrade, getGradeColor, getGradeBgColor } from '@/lib/utils/gradeCalculator';

interface Submission {
  _id: string;
  [key: string]: any;
}

export default function RegisterSupportDetailView({ id, hideScores = false, readOnly = false }: { id: string; hideScores?: boolean; readOnly?: boolean }) {
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
      const response = await fetch(`/api/register-support/${id}/export/excel`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `register-support-${displayData?.schoolName || id}.xlsx`;
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

  const displayData = isEditMode ? editedData : createFieldProxy(submission);

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
                <div className="text-sm text-gray-600 mt-1">Total Score</div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-3">
                  <span className={`text-3xl font-bold ${getGradeColor(calculateGrade(submission.total_score || 0))}`}>
                    Grade {calculateGrade(submission.total_score || 0)}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-5xl font-bold text-green-600">{submission.total_score || 0}</span>
                </div>
                <div className="text-lg text-gray-600 font-medium">/ 100 คะแนน</div>
              </div>
            </div>
          </div>

          {/* Score Breakdown by Steps */}
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
                  <div className="text-2xl font-bold text-blue-600">{submission.teacher_training_score || 0}</div>
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
                  <div className="text-2xl font-bold text-purple-600">{submission.teacher_qualification_score || 0}</div>
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
                  <div className="text-2xl font-bold text-teal-600">{submission.support_from_org_score || 0}</div>
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
                  <div className="text-2xl font-bold text-orange-600">{submission.support_from_external_score || 0}</div>
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
                  <div className="text-2xl font-bold text-amber-600">{submission.award_score || 0}</div>
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
                  <div className="text-2xl font-bold text-cyan-600">{submission.activity_within_province_internal_score || 0}</div>
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
                  <div className="text-2xl font-bold text-indigo-600">{submission.activity_within_province_external_score || 0}</div>
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
                  <div className="text-2xl font-bold text-pink-600">{submission.activity_outside_province_score || 0}</div>
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
                  <div className="text-2xl font-bold text-rose-600">{submission.pr_activity_score || 0}</div>
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
                <span className="font-medium">{submission.teacher_training_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 4: คุณลักษณะครู (ประเภทที่ไม่ซ้ำ × 5)</span>
                <span className="font-medium">{submission.teacher_qualification_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 5: สนับสนุนจากต้นสังกัด</span>
                <span className="font-medium">{submission.support_from_org_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 5: สนับสนุนจากภายนอก</span>
                <span className="font-medium">{submission.support_from_external_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 5: รางวัล (ระดับสูงสุด)</span>
                <span className="font-medium">{submission.award_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 7: กิจกรรมภายในสถานศึกษา</span>
                <span className="font-medium">{submission.activity_within_province_internal_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 7: กิจกรรมภายนอกสถานศึกษา</span>
                <span className="font-medium">{submission.activity_within_province_external_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 7: กิจกรรมนอกจังหวัด</span>
                <span className="font-medium">{submission.activity_outside_province_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>Step 8: การประชาสัมพันธ์</span>
                <span className="font-medium">{submission.pr_activity_score || 0} คะแนน</span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t-2 border-gray-300 font-bold text-green-700">
                <span>รวมทั้งหมด</span>
                <span>{submission.total_score || 0} / 100 คะแนน</span>
              </div>
            </div>
          </div>
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
                Export Excel
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
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                DELETE
              </button>
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
        <StepSection title="Step 1: ข้อมูลพื้นฐาน" stepNumber={1}>
          <div className="grid grid-cols-2 gap-6">
            <Field label="ชื่อสถานศึกษา" value={displayData?.schoolName} isEditMode={isEditMode} onChange={(val) => handleFieldChange('schoolName', val)} fieldName="schoolName" />
            <Field label="จังหวัด" value={displayData?.schoolProvince} isEditMode={isEditMode} onChange={(val) => handleFieldChange('schoolProvince', val)} fieldName="schoolProvince" />
            <Field label="ระดับการศึกษา" value={displayData?.schoolLevel} isEditMode={isEditMode} onChange={(val) => handleFieldChange('schoolLevel', val)} fieldName="schoolLevel" />
            <Field label="สังกัด" value={displayData?.affiliation} isEditMode={isEditMode} onChange={(val) => handleFieldChange('affiliation', val)} fieldName="affiliation" />
            <Field label="ขนาดโรงเรียน" value={displayData?.schoolSize} isEditMode={isEditMode} onChange={(val) => handleFieldChange('schoolSize', val)} fieldName="schoolSize" />
            <Field label="จำนวนบุคลากร" value={displayData?.staffCount} isEditMode={isEditMode} onChange={(val) => handleFieldChange('staffCount', val)} fieldName="staffCount" />
            <Field label="จำนวนนักเรียน" value={displayData?.studentCount} isEditMode={isEditMode} onChange={(val) => handleFieldChange('studentCount', val)} fieldName="studentCount" />
            <Field label="จำนวนนักเรียนแต่ละชั้น" value={displayData?.studentCountByGrade} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('studentCountByGrade', val)} fieldName="studentCountByGrade" />
          </div>
          
          <div className="mt-6">
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
        </StepSection>

        {/* Step 2: ผู้บริหาร */}
        <StepSection title="Step 2: ผู้บริหารสถานศึกษา" stepNumber={2}>
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
                    onClick={() => handleImageClick(displayData?.mgtImage)}
                    className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
                  >
                    <img 
                      src={displayData?.mgtImage?.startsWith('http') ? displayData?.mgtImage : displayData?.mgtImage}
                      alt="ผู้บริหาร" 
                      className="rounded-lg border border-gray-300 w-[200px] h-[200px] object-cover"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </StepSection>

        {/* Step 3: แผนการสอน */}
        <StepSection title="Step 3: แผนการสอนดนตรีไทย" stepNumber={3}>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">สภาวการณ์การเรียนการสอน</h4>
              {displayData?.currentMusicTypes && displayData.currentMusicTypes.length > 0 ? (
                displayData.currentMusicTypes.map((item: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="ระดับชั้น" value={item.grade} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('currentMusicTypes', index, 'grade', val)} fieldName="grade" />
                      <Field label="รายละเอียด" value={item.details} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('currentMusicTypes', index, 'details', val)} fieldName="details" />
                    </div>
                    {isEditMode && (
                      <button
                        onClick={() => handleRemoveArrayItem('currentMusicTypes', index)}
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
                  onClick={() => handleAddArrayItem('currentMusicTypes', { grade: '', details: '' })}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  เพิ่มสภาวการณ์
                </button>
              )}
            </div>

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
        <StepSection title="Step 4: ผู้สอนดนตรีไทย" stepNumber={4}>
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
                              onClick={() => handleImageClick(teacher.teacherImage)}
                              className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
                            >
                              <img 
                                src={teacher.teacherImage.startsWith('http') ? teacher.teacherImage : teacher.teacherImage}
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

            <Field label="สถานที่สอน" value={displayData?.teachingLocation} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('teachingLocation', val)} fieldName="teachingLocation" />
          </div>
        </StepSection>

        {/* Step 5: การสนับสนุน */}
        <StepSection title="Step 5: การสนับสนุนและรางวัล" stepNumber={5}>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">การสนับสนุนจากองค์กร</h4>
              <CheckboxField label="มีการสนับสนุนจากองค์กร" value={displayData?.hasSupportFromOrg} />
              {displayData?.supportFromOrg && displayData.supportFromOrg.length > 0 && (
                <div className="mt-3 space-y-3">
                  {displayData.supportFromOrg.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                      <Field label="องค์กร" value={item.organization} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('supportFromOrg', index, 'organization', val)} fieldName="organization" />
                      <Field label="รายละเอียด" value={item.details} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('supportFromOrg', index, 'details', val)} fieldName="details" />
                      <Field label="ลิงก์หลักฐาน" value={item.evidenceLink} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('supportFromOrg', index, 'evidenceLink', val)} fieldName="evidenceLink" />
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
                  เพิ่มการสนับสนุน
                </button>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">การสนับสนุนจากภายนอก</h4>
              <CheckboxField label="มีการสนับสนุนจากภายนอก" value={displayData?.hasSupportFromExternal} />
              {displayData?.supportFromExternal && displayData.supportFromExternal.length > 0 && (
                <div className="mt-3 space-y-3">
                  {displayData.supportFromExternal.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                      <Field label="องค์กร" value={item.organization} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('supportFromExternal', index, 'organization', val)} fieldName="organization" />
                      <Field label="รายละเอียด" value={item.details} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('supportFromExternal', index, 'details', val)} fieldName="details" />
                      <Field label="ลิงก์หลักฐาน" value={item.evidenceLink} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('supportFromExternal', index, 'evidenceLink', val)} fieldName="evidenceLink" />
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
                  เพิ่มการสนับสนุน
                </button>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">รางวัล</h4>
              {displayData?.awards && displayData.awards.length > 0 ? (
                displayData.awards.map((award: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="ระดับรางวัล" value={award.awardLevel} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('awards', index, 'awardLevel', val)} fieldName="awardLevel" />
                      <Field label="ชื่อรางวัล" value={award.awardName} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('awards', index, 'awardName', val)} fieldName="awardName" />
                      <Field label="วันที่ได้รับ" value={award.awardDate} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('awards', index, 'awardDate', val)} fieldName="awardDate" />
                      <Field label="ลิงก์หลักฐาน" value={award.awardEvidenceLink} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('awards', index, 'awardEvidenceLink', val)} fieldName="awardEvidenceLink" />
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

            <Field label="กรอบหลักสูตร" value={displayData?.curriculumFramework} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('curriculumFramework', val)} fieldName="curriculumFramework" />
            <Field label="ผลการเรียนรู้" value={displayData?.learningOutcomes} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('learningOutcomes', val)} fieldName="learningOutcomes" />
            <Field label="บริบทการจัดการ" value={displayData?.managementContext} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('managementContext', val)} fieldName="managementContext" />
          </div>
        </StepSection>

        {/* Step 6: สื่อ */}
        <StepSection title="Step 6: สื่อและวิดีโอ" stepNumber={6}>
          <div className="grid grid-cols-2 gap-6">
            <Field label="ลิงก์แกลเลอรี่รูปภาพ" value={displayData?.photoGalleryLink} isEditMode={isEditMode} onChange={(val) => handleFieldChange('photoGalleryLink', val)} fieldName="photoGalleryLink" />
            <Field label="ลิงก์วิดีโอ" value={displayData?.videoLink} isEditMode={isEditMode} onChange={(val) => handleFieldChange('videoLink', val)} fieldName="videoLink" />
          </div>
        </StepSection>

        {/* Step 7: กิจกรรม */}
        <StepSection title="Step 7: กิจกรรมและการเผยแพร่" stepNumber={7}>
          <div className="space-y-6">
            <ActivityList 
              title="กิจกรรมภายในจังหวัด (ภายใน)" 
              activities={displayData?.activitiesWithinProvinceInternal || []} 
              isEditMode={isEditMode}
              onFieldChange={(index, field, value) => handleArrayFieldChange('activitiesWithinProvinceInternal', index, field, value)}
              arrayFieldName="activitiesWithinProvinceInternal"
              onAdd={() => handleAddArrayItem('activitiesWithinProvinceInternal', { activityName: '', activityDate: '', evidenceLink: '' })}
              onRemove={(index) => handleRemoveArrayItem('activitiesWithinProvinceInternal', index)}
            />
            <ActivityList 
              title="กิจกรรมภายในจังหวัด (ภายนอก)" 
              activities={displayData?.activitiesWithinProvinceExternal || []} 
              isEditMode={isEditMode}
              onFieldChange={(index, field, value) => handleArrayFieldChange('activitiesWithinProvinceExternal', index, field, value)}
              arrayFieldName="activitiesWithinProvinceExternal"
              onAdd={() => handleAddArrayItem('activitiesWithinProvinceExternal', { activityName: '', activityDate: '', evidenceLink: '' })}
              onRemove={(index) => handleRemoveArrayItem('activitiesWithinProvinceExternal', index)}
            />
            <ActivityList 
              title="กิจกรรมนอกจังหวัด" 
              activities={displayData?.activitiesOutsideProvince || []} 
              isEditMode={isEditMode}
              onFieldChange={(index, field, value) => handleArrayFieldChange('activitiesOutsideProvince', index, field, value)}
              arrayFieldName="activitiesOutsideProvince"
              onAdd={() => handleAddArrayItem('activitiesOutsideProvince', { activityName: '', activityDate: '', evidenceLink: '' })}
              onRemove={(index) => handleRemoveArrayItem('activitiesOutsideProvince', index)}
            />
          </div>
        </StepSection>

        {/* Step 8: ประชาสัมพันธ์ */}
        <StepSection title="Step 8: ประชาสัมพันธ์และแหล่งข้อมูล" stepNumber={8}>
          <div className="space-y-6">
            <ActivityList 
              title="กิจกรรมประชาสัมพันธ์" 
              activities={displayData?.prActivities || []} 
            />

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">แหล่งที่มาของข้อมูล</h4>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <CheckboxField label="โรงเรียน" value={displayData?.heardFromSchool} />
                <Field label="ชื่อโรงเรียน" value={displayData?.heardFromSchoolName} />
                <CheckboxField label="Facebook" value={displayData?.DCP_PR_Channel_FACEBOOK} />
                <CheckboxField label="YouTube" value={displayData?.DCP_PR_Channel_YOUTUBE} />
                <CheckboxField label="TikTok" value={displayData?.DCP_PR_Channel_Tiktok} />
                <CheckboxField label="สำนักงานวัฒนธรรม" value={displayData?.heardFromCulturalOffice} />
                <Field label="ชื่อสำนักงาน" value={displayData?.heardFromCulturalOfficeName} />
                <CheckboxField label="สำนักงานเขตพื้นที่" value={displayData?.heardFromEducationArea} />
                <Field label="ชื่อสำนักงาน" value={displayData?.heardFromEducationAreaName} />
                <Field label="จังหวัด" value={displayData?.heardFromEducationAreaProvince} />
                <CheckboxField label="อื่นๆ" value={displayData?.heardFromOther} />
                <Field label="รายละเอียดอื่นๆ" value={displayData?.heardFromOtherDetail} />
              </div>
            </div>

            <Field label="ปัญหาอุปสรรค" value={displayData?.obstacles} fullWidth />
            <Field label="ข้อเสนอแนะ" value={displayData?.suggestions} fullWidth />
            <CheckboxField label="รับรองความถูกต้อง" value={displayData?.certifiedINFOByAdminName} />
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
        <div className="w-10 h-10 bg-[#00B050] text-white rounded-full flex items-center justify-center font-bold">
          {stepNumber}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
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

function CheckboxField({ label, value }: { label: string; value: boolean }) {
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

function ActivityList({ title, activities, isEditMode = false, onFieldChange, arrayFieldName, onAdd, onRemove }: { 
  title: string; 
  activities: any[];
  isEditMode?: boolean;
  onFieldChange?: (index: number, field: string, value: any) => void;
  arrayFieldName?: string;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
}) {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      {activities && activities.length > 0 ? (
        activities.map((activity: any, index: number) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
            <div className="grid grid-cols-3 gap-4">
              <Field 
                label="ชื่อกิจกรรม" 
                value={activity.activityName} 
                isEditMode={isEditMode}
                onChange={(val) => onFieldChange && onFieldChange(index, 'activityName', val)}
                fieldName="activityName"
              />
              <Field 
                label="วันที่" 
                value={activity.activityDate || activity.publishDate} 
                isEditMode={isEditMode}
                onChange={(val) => onFieldChange && onFieldChange(index, activity.activityDate ? 'activityDate' : 'publishDate', val)}
                fieldName="activityDate"
              />
              <Field 
                label="ลิงก์หลักฐาน" 
                value={activity.evidenceLink} 
                isEditMode={isEditMode}
                onChange={(val) => onFieldChange && onFieldChange(index, 'evidenceLink', val)}
                fieldName="evidenceLink"
              />
              {activity.platform && (
                <Field 
                  label="แพลตฟอร์ม" 
                  value={activity.platform} 
                  isEditMode={isEditMode}
                  onChange={(val) => onFieldChange && onFieldChange(index, 'platform', val)}
                  fieldName="platform"
                />
              )}
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
