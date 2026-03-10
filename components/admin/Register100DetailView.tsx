'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateGrade, getGradeColor, getGradeBgColor } from '@/lib/utils/gradeCalculator';

interface Submission {
  _id: string;
  [key: string]: any;
}

export default function Register100DetailView({ id, hideScores = false, readOnly = false, hideDelete = false }: { id: string; hideScores?: boolean; readOnly?: boolean; hideDelete?: boolean }) {
  const router = useRouter();
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<Submission | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSubmission();
    
    // Check if URL has ?mode=edit parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'edit') {
      // Will set edit mode after data is loaded
      setIsEditMode(true);
    }
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/register100/${id}`);
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
      const response = await fetch(`/api/register100/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        alert('ลบข้อมูลสำเร็จ');
        router.push('/dcp-admin/dashboard/register100');
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
    // Create editedData with both prefixed and non-prefixed field names for compatibility
    const editData = { ...submission! };
    
    // Add non-prefixed versions of reg100_ fields for backward compatibility
    Object.keys(editData).forEach(key => {
      if (key.startsWith('reg100_')) {
        const unprefixedKey = key.replace('reg100_', '');
        if (!editData[unprefixedKey]) {
          editData[unprefixedKey] = editData[key];
        }
      }
    });
    
    setEditedData(editData);
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
    if (editedData.reg100_thaiMusicTeachers && editedData.reg100_thaiMusicTeachers.length > 0) {
      editedData.reg100_thaiMusicTeachers.forEach((teacher: any, index: number) => {
        if (!teacher.teacherQualification || teacher.teacherQualification === '') {
          errors.push(`ครูคนที่ ${index + 1}: กรุณาเลือกคุณลักษณะ`);
        }
      });
    }
    
    // Validate awards' levels
    if (editedData.reg100_awards && editedData.reg100_awards.length > 0) {
      editedData.reg100_awards.forEach((award: any, index: number) => {
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
      const response = await fetch(`/api/register100/${id}`, {
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
      const updatedData = { ...editedData, [field]: value };
      
      // If updating a reg100_ prefixed field, also update the non-prefixed version
      if (field.startsWith('reg100_')) {
        const unprefixedField = field.replace('reg100_', '');
        updatedData[unprefixedField] = value;
      }
      // If updating a non-prefixed field that has a reg100_ equivalent, update both
      else if (editedData[`reg100_${field}`] !== undefined) {
        updatedData[`reg100_${field}`] = value;
      }
      
      setEditedData(updatedData);
    }
  };

  const handleArrayFieldChange = (arrayField: string, index: number, field: string, value: any) => {
    if (editedData) {
      const updatedArray = [...(editedData[arrayField] || [])];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      setEditedData({ ...editedData, [arrayField]: updatedArray });
    }
  };

  const handleAddArrayItem = (arrayField: string, defaultItem: any) => {
    if (editedData) {
      const updatedArray = [...(editedData[arrayField] || []), defaultItem];
      setEditedData({ ...editedData, [arrayField]: updatedArray });
    }
  };

  const handleRemoveArrayItem = (arrayField: string, index: number) => {
    if (editedData) {
      const updatedArray = [...(editedData[arrayField] || [])];
      updatedArray.splice(index, 1);
      setEditedData({ ...editedData, [arrayField]: updatedArray });
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch(`/api/register100/${id}/export/pdf`, {
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
        const timestamp = Date.now();
        const response = await fetch(`/api/register100/${id}/export/excel?t=${timestamp}`, {
          method: 'GET',
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const fileTimestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
          a.download = `register100-${displayData?.reg100_schoolName || id}-${fileTimestamp}.csv`;
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
          // First try with reg100_ prefix, then without prefix
          return target[`reg100_${prop}`] ?? target[prop];
        }
        return target[prop];
      }
    });
  };

  const displayData = isEditMode ? createFieldProxy(editedData) : createFieldProxy(submission);

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
          <div className="mb-6">
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
            <div className="mt-3">
              {submission.schoolId ? (
                <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 font-mono text-sm font-semibold rounded-lg border border-blue-200">
                  {submission.schoolId}
                </span>
              ) : (
                <span className="inline-block px-4 py-2 bg-gray-50 text-gray-500 font-mono text-sm rounded-lg border border-gray-200">
                  School ID: N/A
                </span>
              )}
            </div>

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
          ) : null}
        </div>
        )}

        {/* Floating Save/Cancel Buttons - Only in Edit Mode */}
        {isEditMode && !readOnly && (
          <div className="fixed bottom-8 right-8 z-40 flex gap-3">
            <button
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isSaving ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        )}

        {/* Step 1: ข้อมูลพื้นฐาน */}
        <StepSection title="Step 1: ข้อมูลพื้นฐาน" stepNumber={1}>
          <div className="grid grid-cols-2 gap-6">
            <Field label="ชื่อสถานศึกษา" value={displayData?.schoolName} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_schoolName', val)} fieldName="reg100_schoolName" />
            <Field label="จังหวัด" value={displayData?.schoolProvince} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_schoolProvince', val)} fieldName="reg100_schoolProvince" />
            <Field label="ระดับการศึกษา" value={displayData?.schoolLevel} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_schoolLevel', val)} fieldName="reg100_schoolLevel" />
            <Field label="สังกัด" value={displayData?.affiliation} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_affiliation', val)} fieldName="reg100_affiliation" />
            <Field label="ขนาดโรงเรียน" value={displayData?.schoolSize} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_schoolSize', val)} fieldName="reg100_schoolSize" />
            <Field label="จำนวนบุคลากร" value={displayData?.staffCount} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_staffCount', val)} fieldName="reg100_staffCount" />
            <Field label="จำนวนนักเรียน" value={displayData?.studentCount} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_studentCount', val)} fieldName="reg100_studentCount" />
            <Field label="จำนวนนักเรียนแต่ละชั้น" value={displayData?.studentCountByGrade} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_studentCountByGrade', val)} fieldName="reg100_studentCountByGrade" />
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">สถานที่ตั้ง</h4>
            <div className="grid grid-cols-2 gap-6">
              <Field label="เลขที่" value={displayData?.addressNo} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_addressNo', val)} fieldName="reg100_addressNo" />
              <Field label="หมู่" value={displayData?.moo} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_moo', val)} fieldName="reg100_moo" />
              <Field label="ถนน" value={displayData?.road} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_road', val)} fieldName="reg100_road" />
              <Field label="ตำบล/แขวง" value={displayData?.subDistrict} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_subDistrict', val)} fieldName="reg100_subDistrict" />
              <Field label="อำเภอ/เขต" value={displayData?.district} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_district', val)} fieldName="reg100_district" />
              <Field label="จังหวัด" value={displayData?.provinceAddress} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_provinceAddress', val)} fieldName="reg100_provinceAddress" />
              <Field label="รหัสไปรษณีย์" value={displayData?.postalCode} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_postalCode', val)} fieldName="reg100_postalCode" />
              <Field label="โทรศัพท์" value={displayData?.phone} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_phone', val)} fieldName="reg100_phone" />
              <Field label="โทรสาร" value={displayData?.fax} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_fax', val)} fieldName="reg100_fax" />
            </div>
          </div>
        </StepSection>

        {/* Step 2: ผู้บริหาร */}
        <StepSection title="Step 2: ผู้บริหารสถานศึกษา" stepNumber={2}>
          <div className="grid grid-cols-2 gap-6">
            <Field label="ชื่อ-นามสกุล" value={displayData?.reg100_mgtFullName} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_mgtFullName', val)} fieldName="reg100_mgtFullName" />
            <Field label="ตำแหน่ง" value={displayData?.reg100_mgtPosition} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_mgtPosition', val)} fieldName="reg100_mgtPosition" />
            <Field label="ที่อยู่" value={displayData?.reg100_mgtAddress} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_mgtAddress', val)} fieldName="reg100_mgtAddress" />
            <Field label="โทรศัพท์" value={submission.reg100_mgtPhone} />
            <Field label="อีเมล" value={submission.reg100_mgtEmail} />
          </div>
          
          {/* Manager Image Section */}
          <div className="mt-4">
            {isEditMode ? (
              <Field 
                label="ลิงก์รูปภาพผู้บริหาร (URL)" 
                value={displayData?.reg100_mgtImage || displayData?.mgtImage} 
                fullWidth
                isEditMode={isEditMode}
                onChange={(val) => handleFieldChange('reg100_mgtImage', val)}
                fieldName="reg100_mgtImage"
              />
            ) : (
              (submission.reg100_mgtImage || submission.mgtImage) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพผู้บริหาร</label>
                  <div 
                    onClick={() => handleImageClick(
                      (submission.reg100_mgtImage || submission.mgtImage).startsWith('http') 
                        ? (submission.reg100_mgtImage || submission.mgtImage)
                        : (submission.reg100_mgtImage || submission.mgtImage).startsWith('/uploads/') 
                          ? (submission.reg100_mgtImage || submission.mgtImage).replace('/uploads/', '/api/uploads/')
                          : (submission.reg100_mgtImage || submission.mgtImage)
                    )}
                    className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
                  >
                    <img 
                      src={(submission.reg100_mgtImage || submission.mgtImage).startsWith('http') 
                        ? (submission.reg100_mgtImage || submission.mgtImage) 
                        : (submission.reg100_mgtImage || submission.mgtImage).startsWith('/uploads/') 
                          ? (submission.reg100_mgtImage || submission.mgtImage).replace('/uploads/', '/api/uploads/')
                          : (submission.reg100_mgtImage || submission.mgtImage)
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

        {/* Step 3: แผนการสอน */}
        <StepSection title="Step 3: แผนการสอนดนตรีไทย" stepNumber={3}>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">สภาวการณ์การเรียนการสอน</h4>
              {(isEditMode ? displayData?.reg100_currentMusicTypes : submission.reg100_currentMusicTypes) && (isEditMode ? displayData?.reg100_currentMusicTypes : submission.reg100_currentMusicTypes).length > 0 ? (
                (isEditMode ? displayData?.reg100_currentMusicTypes : submission.reg100_currentMusicTypes).map((item: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                    <div className="grid grid-cols-2 gap-4">
                      <Field 
                        label="ระดับชั้น" 
                        value={item.grade} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_currentMusicTypes', index, 'grade', val)}
                        fieldName="grade"
                      />
                      <Field 
                        label="รายละเอียด" 
                        value={item.details} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_currentMusicTypes', index, 'details', val)}
                        fieldName="details"
                      />
                    </div>
                    {isEditMode && (
                      <button
                        onClick={() => handleRemoveArrayItem('reg100_currentMusicTypes', index)}
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
                  onClick={() => handleAddArrayItem('reg100_currentMusicTypes', { grade: '', details: '' })}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  เพิ่มรายการ
                </button>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">ความพร้อมเครื่องดนตรี</h4>
              {(isEditMode ? displayData?.reg100_readinessItems : submission.reg100_readinessItems) && (isEditMode ? displayData?.reg100_readinessItems : submission.reg100_readinessItems).length > 0 ? (
                (isEditMode ? displayData?.reg100_readinessItems : submission.reg100_readinessItems).map((item: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                    <div className="grid grid-cols-3 gap-4">
                      <Field 
                        label="ชื่อเครื่องดนตรี" 
                        value={item.instrumentName} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_readinessItems', index, 'instrumentName', val)}
                        fieldName="instrumentName"
                      />
                      <Field 
                        label="จำนวน" 
                        value={item.quantity} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_readinessItems', index, 'quantity', val)}
                        fieldName="quantity"
                      />
                      <Field 
                        label="หมายเหตุ" 
                        value={item.note} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_readinessItems', index, 'note', val)}
                        fieldName="note"
                      />
                    </div>
                    {isEditMode && (
                      <button
                        onClick={() => handleRemoveArrayItem('reg100_readinessItems', index)}
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
                  onClick={() => handleAddArrayItem('reg100_readinessItems', { instrumentName: '', quantity: '', note: '' })}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  เพิ่มรายการ
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
              {(isEditMode ? displayData?.reg100_thaiMusicTeachers : submission.reg100_thaiMusicTeachers) && (isEditMode ? displayData?.reg100_thaiMusicTeachers : submission.reg100_thaiMusicTeachers).length > 0 ? (
                (isEditMode ? displayData?.reg100_thaiMusicTeachers : submission.reg100_thaiMusicTeachers).map((teacher: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField 
                        label="คุณลักษณะ" 
                        value={teacher.teacherQualification}
                        options={[
                          'ครูผู้สอนดนตรีไทยในโรงเรียนที่สำเร็จการศึกษาดนตรีไทย',
                          'ครูภูมิปัญญาในท้องถิ่น',
                          'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย',
                          'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในโรงเรียน'
                        ]}
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', index, 'teacherQualification', val)}
                        fieldName="teacherQualification"
                        required={true}
                      />
                      <Field 
                        label="ชื่อ-นามสกุล" 
                        value={teacher.teacherFullName} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', index, 'teacherFullName', val)}
                        fieldName="teacherFullName"
                      />
                      <Field 
                        label="ตำแหน่ง" 
                        value={teacher.teacherPosition} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', index, 'teacherPosition', val)}
                        fieldName="teacherPosition"
                      />
                      <Field 
                        label="วุฒิการศึกษา" 
                        value={teacher.teacherEducation} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', index, 'teacherEducation', val)}
                        fieldName="teacherEducation"
                      />
                      <Field 
                        label="โทรศัพท์" 
                        value={teacher.teacherPhone} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', index, 'teacherPhone', val)}
                        fieldName="teacherPhone"
                      />
                      <Field 
                        label="อีเมล" 
                        value={teacher.teacherEmail} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', index, 'teacherEmail', val)}
                        fieldName="teacherEmail"
                      />
                    </div>
                    
                    {/* Image Section */}
                    <div className="mt-4">
                      {isEditMode ? (
                        <Field 
                          label="ลิงก์รูปภาพครู (URL)" 
                          value={teacher.teacherImage} 
                          fullWidth
                          isEditMode={isEditMode}
                          onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', index, 'teacherImage', val)}
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
                        onClick={() => handleRemoveArrayItem('reg100_thaiMusicTeachers', index)}
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
                  onClick={() => handleAddArrayItem('reg100_thaiMusicTeachers', { 
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
                <CheckboxField 
                  label="วิชาบังคับ" 
                  value={displayData?.reg100_isCompulsorySubject} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_isCompulsorySubject', val)}
                  fieldName="reg100_isCompulsorySubject"
                />
                <CheckboxField 
                  label="สอนหลังเลิกเรียน" 
                  value={displayData?.reg100_hasAfterSchoolTeaching} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_hasAfterSchoolTeaching', val)}
                  fieldName="reg100_hasAfterSchoolTeaching"
                />
                <CheckboxField 
                  label="วิชาเลือก" 
                  value={displayData?.reg100_hasElectiveSubject} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_hasElectiveSubject', val)}
                  fieldName="reg100_hasElectiveSubject"
                />
                <CheckboxField 
                  label="หลักสูตรท้องถิ่น" 
                  value={displayData?.reg100_hasLocalCurriculum} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_hasLocalCurriculum', val)}
                  fieldName="reg100_hasLocalCurriculum"
                />
              </div>
            </div>

            <Field label="สถานที่สอน" value={displayData?.reg100_teachingLocation} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_teachingLocation', val)} fieldName="reg100_teachingLocation" />
          </div>
        </StepSection>

        {/* Step 5: การสนับสนุน */}
        <StepSection title="Step 5: การสนับสนุนและรางวัล" stepNumber={5}>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">การสนับสนุนจากองค์กร</h4>
              <CheckboxField 
                label="มีการสนับสนุนจากองค์กร" 
                value={displayData?.reg100_hasSupportFromOrg} 
                isEditMode={isEditMode}
                onChange={(val) => handleFieldChange('reg100_hasSupportFromOrg', val)}
                fieldName="reg100_hasSupportFromOrg"
              />
              {(isEditMode ? displayData?.reg100_supportFromOrg : submission.reg100_supportFromOrg) && (isEditMode ? displayData?.reg100_supportFromOrg : submission.reg100_supportFromOrg).length > 0 && (
                <div className="mt-3 space-y-3">
                  {(isEditMode ? displayData?.reg100_supportFromOrg : submission.reg100_supportFromOrg).map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                      <Field 
                        label="องค์กร" 
                        value={item.organization} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_supportFromOrg', index, 'organization', val)}
                        fieldName="organization"
                      />
                      <Field 
                        label="รายละเอียด" 
                        value={item.details} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_supportFromOrg', index, 'details', val)}
                        fieldName="details"
                      />
                      <Field 
                        label="ลิงก์หลักฐาน" 
                        value={item.evidenceLink} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_supportFromOrg', index, 'evidenceLink', val)}
                        fieldName="evidenceLink"
                      />
                      {isEditMode && (
                        <button
                          onClick={() => handleRemoveArrayItem('reg100_supportFromOrg', index)}
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
                  onClick={() => handleAddArrayItem('reg100_supportFromOrg', { organization: '', details: '', evidenceLink: '' })}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  เพิ่มรายการ
                </button>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">การสนับสนุนจากภายนอก</h4>
              <CheckboxField 
                label="มีการสนับสนุนจากภายนอก" 
                value={displayData?.reg100_hasSupportFromExternal} 
                isEditMode={isEditMode}
                onChange={(val) => handleFieldChange('reg100_hasSupportFromExternal', val)}
                fieldName="reg100_hasSupportFromExternal"
              />
              {(isEditMode ? displayData?.reg100_supportFromExternal : submission.reg100_supportFromExternal) && (isEditMode ? displayData?.reg100_supportFromExternal : submission.reg100_supportFromExternal).length > 0 && (
                <div className="mt-3 space-y-3">
                  {(isEditMode ? displayData?.reg100_supportFromExternal : submission.reg100_supportFromExternal).map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                      <Field 
                        label="องค์กร" 
                        value={item.organization} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_supportFromExternal', index, 'organization', val)}
                        fieldName="organization"
                      />
                      <Field 
                        label="รายละเอียด" 
                        value={item.details} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_supportFromExternal', index, 'details', val)}
                        fieldName="details"
                      />
                      <Field 
                        label="ลิงก์หลักฐาน" 
                        value={item.evidenceLink} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_supportFromExternal', index, 'evidenceLink', val)}
                        fieldName="evidenceLink"
                      />
                      {isEditMode && (
                        <button
                          onClick={() => handleRemoveArrayItem('reg100_supportFromExternal', index)}
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
                  onClick={() => handleAddArrayItem('reg100_supportFromExternal', { organization: '', details: '', evidenceLink: '' })}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  เพิ่มรายการ
                </button>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">รางวัล</h4>
              {(isEditMode ? displayData?.reg100_awards : submission.reg100_awards) && (isEditMode ? displayData?.reg100_awards : submission.reg100_awards).length > 0 ? (
                (isEditMode ? displayData?.reg100_awards : submission.reg100_awards).map((award: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField 
                        label="ระดับรางวัล" 
                        value={award.awardLevel}
                        options={[
                          'ระดับอำเภอ (5 คะแนน)',
                          'ระดับจังหวัด (10 คะแนน)',
                          'ระดับภาค (15 คะแนน)',
                          'ระดับประเทศ (20 คะแนน)'
                        ]}
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_awards', index, 'awardLevel', val)}
                        fieldName="awardLevel"
                        required={true}
                      />
                      <Field 
                        label="ชื่อรางวัล" 
                        value={award.awardName} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_awards', index, 'awardName', val)}
                        fieldName="awardName"
                      />
                      <Field 
                        label="วันที่ได้รับ" 
                        value={award.awardDate} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_awards', index, 'awardDate', val)}
                        fieldName="awardDate"
                      />
                      <Field 
                        label="ลิงก์หลักฐาน" 
                        value={award.awardEvidenceLink} 
                        isEditMode={isEditMode}
                        onChange={(val) => handleArrayFieldChange('reg100_awards', index, 'awardEvidenceLink', val)}
                        fieldName="awardEvidenceLink"
                      />
                    </div>
                    {isEditMode && (
                      <button
                        onClick={() => handleRemoveArrayItem('reg100_awards', index)}
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
                  onClick={() => handleAddArrayItem('reg100_awards', { awardLevel: '', awardName: '', awardDate: '', awardEvidenceLink: '' })}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  เพิ่มรางวัล
                </button>
              )}
            </div>

            <Field label="กรอบหลักสูตร" value={displayData?.reg100_curriculumFramework} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_curriculumFramework', val)} fieldName="reg100_curriculumFramework" />
            <Field label="ผลการเรียนรู้" value={displayData?.reg100_learningOutcomes} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_learningOutcomes', val)} fieldName="reg100_learningOutcomes" />
            <Field label="บริบทการจัดการ" value={displayData?.reg100_managementContext} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_managementContext', val)} fieldName="reg100_managementContext" />
          </div>
        </StepSection>

        {/* Step 6: สื่อ */}
        <StepSection title="Step 6: สื่อและวิดีโอ" stepNumber={6}>
          <div className="grid grid-cols-2 gap-6">
            <Field label="ลิงก์แกลเลอรี่รูปภาพ" value={displayData?.reg100_photoGalleryLink} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_photoGalleryLink', val)} fieldName="reg100_photoGalleryLink" />
            <Field label="ลิงก์วิดีโอ" value={displayData?.reg100_videoLink} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_videoLink', val)} fieldName="reg100_videoLink" />
          </div>
        </StepSection>

        {/* Step 7: กิจกรรม */}
        <StepSection title="Step 7: กิจกรรมและการเผยแพร่" stepNumber={7}>
          <div className="space-y-6">
            <ActivityList 
              title="กิจกรรมภายในจังหวัด (ภายใน)" 
              activities={isEditMode ? displayData?.reg100_activitiesWithinProvinceInternal : submission.reg100_activitiesWithinProvinceInternal}
              isEditMode={isEditMode}
              arrayField="reg100_activitiesWithinProvinceInternal"
              onFieldChange={handleArrayFieldChange}
              onAdd={() => handleAddArrayItem('reg100_activitiesWithinProvinceInternal', { activityName: '', activityDate: '', evidenceLink: '' })}
              onRemove={(index) => handleRemoveArrayItem('reg100_activitiesWithinProvinceInternal', index)}
            />
            <ActivityList 
              title="กิจกรรมภายในจังหวัด (ภายนอก)" 
              activities={isEditMode ? displayData?.reg100_activitiesWithinProvinceExternal : submission.reg100_activitiesWithinProvinceExternal}
              isEditMode={isEditMode}
              arrayField="reg100_activitiesWithinProvinceExternal"
              onFieldChange={handleArrayFieldChange}
              onAdd={() => handleAddArrayItem('reg100_activitiesWithinProvinceExternal', { activityName: '', activityDate: '', evidenceLink: '' })}
              onRemove={(index) => handleRemoveArrayItem('reg100_activitiesWithinProvinceExternal', index)}
            />
            <ActivityList 
              title="กิจกรรมนอกจังหวัด" 
              activities={isEditMode ? displayData?.reg100_activitiesOutsideProvince : submission.reg100_activitiesOutsideProvince}
              isEditMode={isEditMode}
              arrayField="reg100_activitiesOutsideProvince"
              onFieldChange={handleArrayFieldChange}
              onAdd={() => handleAddArrayItem('reg100_activitiesOutsideProvince', { activityName: '', activityDate: '', evidenceLink: '' })}
              onRemove={(index) => handleRemoveArrayItem('reg100_activitiesOutsideProvince', index)}
            />
          </div>
        </StepSection>

        {/* Step 8: ประชาสัมพันธ์ */}
        <StepSection title="Step 8: ประชาสัมพันธ์และแหล่งข้อมูล" stepNumber={8}>
          <div className="space-y-6">
            <ActivityList 
              title="กิจกรรมประชาสัมพันธ์" 
              activities={isEditMode ? displayData?.reg100_prActivities : submission.reg100_prActivities}
              isEditMode={isEditMode}
              arrayField="reg100_prActivities"
              onFieldChange={handleArrayFieldChange}
              onAdd={() => handleAddArrayItem('reg100_prActivities', { activityName: '', publishDate: '', evidenceLink: '', platform: '' })}
              onRemove={(index) => handleRemoveArrayItem('reg100_prActivities', index)}
              hasPlatform={true}
            />

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">แหล่งที่มาของข้อมูล</h4>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <CheckboxField 
                  label="โรงเรียน" 
                  value={displayData?.reg100_heardFromSchool} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_heardFromSchool', val)}
                  fieldName="reg100_heardFromSchool"
                />
                <Field 
                  label="ชื่อโรงเรียน" 
                  value={displayData?.reg100_heardFromSchoolName} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_heardFromSchoolName', val)}
                  fieldName="reg100_heardFromSchoolName"
                />
                <CheckboxField 
                  label="Facebook" 
                  value={displayData?.reg100_DCP_PR_Channel_FACEBOOK} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_DCP_PR_Channel_FACEBOOK', val)}
                  fieldName="reg100_DCP_PR_Channel_FACEBOOK"
                />
                <CheckboxField 
                  label="YouTube" 
                  value={displayData?.reg100_DCP_PR_Channel_YOUTUBE} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_DCP_PR_Channel_YOUTUBE', val)}
                  fieldName="reg100_DCP_PR_Channel_YOUTUBE"
                />
                <CheckboxField 
                  label="TikTok" 
                  value={displayData?.reg100_DCP_PR_Channel_Tiktok} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_DCP_PR_Channel_Tiktok', val)}
                  fieldName="reg100_DCP_PR_Channel_Tiktok"
                />
                <CheckboxField 
                  label="สำนักงานวัฒนธรรม" 
                  value={displayData?.reg100_heardFromCulturalOffice} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_heardFromCulturalOffice', val)}
                  fieldName="reg100_heardFromCulturalOffice"
                />
                <Field 
                  label="ชื่อสำนักงาน" 
                  value={displayData?.reg100_heardFromCulturalOfficeName} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_heardFromCulturalOfficeName', val)}
                  fieldName="reg100_heardFromCulturalOfficeName"
                />
                <CheckboxField 
                  label="สำนักงานเขตพื้นที่" 
                  value={displayData?.reg100_heardFromEducationArea} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_heardFromEducationArea', val)}
                  fieldName="reg100_heardFromEducationArea"
                />
                <Field 
                  label="ชื่อสำนักงาน" 
                  value={displayData?.reg100_heardFromEducationAreaName} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_heardFromEducationAreaName', val)}
                  fieldName="reg100_heardFromEducationAreaName"
                />
                <Field 
                  label="จังหวัด" 
                  value={displayData?.reg100_heardFromEducationAreaProvince} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_heardFromEducationAreaProvince', val)}
                  fieldName="reg100_heardFromEducationAreaProvince"
                />
                <CheckboxField 
                  label="อื่นๆ" 
                  value={displayData?.reg100_heardFromOther} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_heardFromOther', val)}
                  fieldName="reg100_heardFromOther"
                />
                <Field 
                  label="รายละเอียดอื่นๆ" 
                  value={displayData?.reg100_heardFromOtherDetail} 
                  isEditMode={isEditMode}
                  onChange={(val) => handleFieldChange('reg100_heardFromOtherDetail', val)}
                  fieldName="reg100_heardFromOtherDetail"
                />
              </div>
            </div>

            <Field 
              label="ปัญหาอุปสรรค" 
              value={displayData?.reg100_obstacles} 
              fullWidth 
              isEditMode={isEditMode}
              onChange={(val) => handleFieldChange('reg100_obstacles', val)}
              fieldName="reg100_obstacles"
            />
            <Field 
              label="ข้อเสนอแนะ" 
              value={displayData?.reg100_suggestions} 
              fullWidth 
              isEditMode={isEditMode}
              onChange={(val) => handleFieldChange('reg100_suggestions', val)}
              fieldName="reg100_suggestions"
            />
            <CheckboxField 
              label="รับรองความถูกต้อง" 
              value={displayData?.reg100_certifiedINFOByAdminName} 
              isEditMode={isEditMode}
              onChange={(val) => handleFieldChange('reg100_certifiedINFOByAdminName', val)}
              fieldName="reg100_certifiedINFOByAdminName"
            />
          </div>
        </StepSection>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">ยืนยันการลบ</h3>
            <p className="text-gray-600 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ <strong>{submission.reg100_schoolName}</strong>?
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
    const isLongTextField = ['reg100_obstacles', 'reg100_suggestions', 'reg100_curriculumFramework', 'reg100_learningOutcomes', 'reg100_managementContext', 'reg100_teachingLocation', 'reg100_studentCountByGrade', 'reg100_mgtAddress'].includes(fieldName);
    
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
  label: string; 
  value: any; 
  options: string[];
  fullWidth?: boolean;
  isEditMode?: boolean;
  onChange?: (value: any) => void;
  fieldName?: string;
  required?: boolean;
}) {
  if (isEditMode && onChange && fieldName) {
    return (
      <div className={fullWidth ? 'col-span-2' : ''}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="">เลือก{label}</option>
          {/* Show current value if it's not in options (for backward compatibility) */}
          {value && !options.includes(value) && (
            <option value={value} className="bg-yellow-50">
              {value} (ค่าเดิม)
            </option>
          )}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {required && !value && (
          <p className="mt-1 text-sm text-red-500">กรุณาเลือก{label}</p>
        )}
      </div>
    );
  }

  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[44px]">
        {value || <span className="text-gray-400">-</span>}
      </div>
    </div>
  );
}

function CheckboxField({ label, value, isEditMode = false, onChange, fieldName }: { 
  label: string; 
  value: boolean;
  isEditMode?: boolean;
  onChange?: (value: boolean) => void;
  fieldName?: string;
}) {
  if (isEditMode && onChange && fieldName) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 text-[#00B050] border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
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

function ActivityList({ 
  title, 
  activities, 
  isEditMode = false, 
  arrayField = '', 
  onFieldChange, 
  onAdd, 
  onRemove,
  hasPlatform = false 
}: { 
  title: string; 
  activities: any[];
  isEditMode?: boolean;
  arrayField?: string;
  onFieldChange?: (arrayField: string, index: number, field: string, value: any) => void;
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
            <div className="grid grid-cols-3 gap-4">
              <Field 
                label="ชื่อกิจกรรม" 
                value={activity.activityName} 
                isEditMode={isEditMode}
                onChange={(val) => onFieldChange && onFieldChange(arrayField, index, 'activityName', val)}
                fieldName="activityName"
              />
              <Field 
                label="วันที่" 
                value={activity.activityDate || activity.publishDate} 
                isEditMode={isEditMode}
                onChange={(val) => onFieldChange && onFieldChange(arrayField, index, hasPlatform ? 'publishDate' : 'activityDate', val)}
                fieldName={hasPlatform ? 'publishDate' : 'activityDate'}
              />
              <Field 
                label="ลิงก์หลักฐาน" 
                value={activity.evidenceLink} 
                isEditMode={isEditMode}
                onChange={(val) => onFieldChange && onFieldChange(arrayField, index, 'evidenceLink', val)}
                fieldName="evidenceLink"
              />
              {hasPlatform && (
                <Field 
                  label="แพลตฟอร์ม" 
                  value={activity.platform} 
                  isEditMode={isEditMode}
                  onChange={(val) => onFieldChange && onFieldChange(arrayField, index, 'platform', val)}
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
