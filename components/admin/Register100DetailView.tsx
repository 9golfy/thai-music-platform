'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateGradeRegister100, getGradeColor, getGradeBgColor } from '@/lib/utils/gradeCalculator';

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
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'edit') {
      setIsEditMode(true);
    }
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/register100/${id}`);
      const data = await response.json();
      if (data.success) {
        setSubmission(data.submission);
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
      const response = await fetch(`/api/register100/${id}`, { method: 'DELETE' });
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
    const editData = { ...submission! };
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

    const errors: string[] = [];

    if (editedData.reg100_thaiMusicTeachers?.length > 0) {
      editedData.reg100_thaiMusicTeachers.forEach((teacher: any, index: number) => {
        if (!teacher.teacherQualification || teacher.teacherQualification === '') {
          errors.push(`ครูคนที่ ${index + 1}: กรุณาเลือกคุณลักษณะ`);
        }
      });
    }

    if (editedData.reg100_awards?.length > 0) {
      editedData.reg100_awards.forEach((award: any, index: number) => {
        if (!award.awardLevel || award.awardLevel === '') {
          errors.push(`รางวัลที่ ${index + 1}: กรุณาเลือกระดับรางวัล`);
        }
      });
    }

    if (errors.length > 0) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน:\n\n' + errors.join('\n'));
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/register100/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      if (field.startsWith('reg100_')) {
        const unprefixedField = field.replace('reg100_', '');
        updatedData[unprefixedField] = value;
      } else if (editedData[`reg100_${field}`] !== undefined) {
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
      const response = await fetch(`/api/register100/${id}/export/pdf`);
      if (response.ok) {
        const htmlContent = await response.text();
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.onload = () => {
            setTimeout(() => { printWindow.print(); }, 500);
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

  // FIX #3: use submission directly (displayData is defined later)
  const handleExportExcel = async () => {
    try {
      const timestamp = Date.now();
      const response = await fetch(`/api/register100/${id}/export/excel?t=${timestamp}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileTimestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        // FIX: use submission?.reg100_schoolName instead of displayData (not yet defined here)
        a.download = `register100-${submission?.reg100_schoolName || id}-${fileTimestamp}.csv`;
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

  const createFieldProxy = (data: any) => {
    if (!data) return null;
    return new Proxy(data, {
      get(target, prop) {
        if (typeof prop === 'string') {
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

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
            <h1 className="text-3xl font-bold text-gray-900">{displayData?.schoolName}</h1>
            <p className="text-gray-600 mt-2">{displayData?.schoolProvince} • {displayData?.schoolLevel}</p>
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
            {(submission.teacherEmail || submission.teacherPhone) && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">ผู้ลงทะเบียน:</div>
                <div className="space-y-1">
                  {submission.teacherEmail && (
                    <div className="text-sm text-gray-600"><span className="font-medium">อีเมล:</span> {submission.teacherEmail}</div>
                  )}
                  {submission.teacherPhone && (
                    <div className="text-sm text-gray-600"><span className="font-medium">เบอร์โทรศัพท์:</span> {submission.teacherPhone}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Score Summary */}
        {!hideScores && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-700">คะแนนรวมทั้งหมด</div>
                  <div className="text-sm text-gray-600 mt-1">Total Score (Part 1 + Part 2)</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className={`text-3xl font-bold ${getGradeColor(calculateGradeRegister100(
                      ((editedData?.teaching_curriculum_score ?? submission.teaching_curriculum_score ?? 0) +
                       (editedData?.teacher_qualification_score ?? submission.teacher_qualification_score ?? 0) + 
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
                      Grade {calculateGradeRegister100(
                        ((editedData?.teaching_curriculum_score ?? submission.teaching_curriculum_score ?? 0) +
                         (editedData?.teacher_qualification_score ?? submission.teacher_qualification_score ?? 0) + 
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
                      {(editedData?.teaching_curriculum_score ?? submission.teaching_curriculum_score ?? 0) +
                       (editedData?.teacher_qualification_score ?? submission.teacher_qualification_score ?? 0) + 
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
                  <div className="text-lg text-gray-600 font-medium">/ 200 คะแนน</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ScoreCard step="STEP 5" title="การเรียนการสอนดนตรีไทย" subtitle="วิชาบังคับ, หลักสูตรเรียน, วิชาเลือก, หลักสูตรท้องถิ่น" score={editedData?.teaching_curriculum_score ?? submission.teaching_curriculum_score ?? 0} max={20} color="blue" note="5 คะแนน/ข้อ (สูงสุด 4 ข้อ)" />
              <ScoreCard step="STEP 4" title="คุณลักษณะครูผู้สอน" subtitle="ครูดนตรีไทย, ครูภูมิปัญญา, ผู้ทรงคุณวุฒิ, วิทยากร" score={editedData?.teacher_qualification_score ?? submission.teacher_qualification_score ?? 0} max={20} color="purple" note="5 คะแนน/ประเภท (สูงสุด 4 ประเภท)" />
              <ScoreCard step="STEP 7" title="การสนับสนุนจากหน่วยงาน" subtitle="บุคคล/หน่วยงานภายในสถานศึกษา" score={editedData?.support_from_org_score ?? submission.support_from_org_score ?? 0} max={5} color="teal" note="ติ๊กถูก = 5 คะแนน" />
              <ScoreCard step="STEP 7" title="การสนับสนุนจากภายนอก" subtitle="บุคคล/หน่วยงานภายนอกสถานศึกษา" score={editedData?.support_from_external_score ?? submission.support_from_external_score ?? 0} max={15} color="orange" note="1 คน = 5, 2 คน = 10, 3+ คน = 15 คะแนน" />
              <ScoreCard step="STEP 7" title="รางวัลและเกียรติคุณ" subtitle="อำเภอ, จังหวัด, ภาค, ประเทศ" score={editedData?.award_score ?? submission.award_score ?? 0} max={20} color="amber" note="อำเภอ=5, จังหวัด=10, ภาค=15, ประเทศ=20 คะแนน" />
              <ScoreCard step="STEP 8" title="กิจกรรมภายในสถานศึกษา" subtitle="ภายในจังหวัด - ภายในโรงเรียน" score={editedData?.activity_within_province_internal_score ?? submission.activity_within_province_internal_score ?? 0} max={5} color="cyan" note="≥ 3 กิจกรรม = 5 คะแนน" />
              <ScoreCard step="STEP 8" title="กิจกรรมนอกสถานศึกษา" subtitle="ภายนอกจังหวัด" score={editedData?.activity_within_province_external_score ?? submission.activity_within_province_external_score ?? 0} max={5} color="indigo" note="≥ 3 กิจกรรม = 5 คะแนน" />
              <ScoreCard step="STEP 8" title="กิจกรรมนอกจังหวัด" subtitle="กรอกข้อมูล 3 ครั้งขึ้นไป" score={editedData?.activity_outside_province_score ?? submission.activity_outside_province_score ?? 0} max={5} color="pink" note="≥ 3 กิจกรรม = 5 คะแนน" />
              <ScoreCard step="STEP 9" title="การประชาสัมพันธ์พันธ์" subtitle="Facebook, YouTube, TikTok, Website" score={editedData?.pr_activity_score ?? submission.pr_activity_score ?? 0} max={5} color="rose" note="≥ 3 กิจกรรม = 5 คะแนน" />
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-semibold text-gray-700 mb-2">ส่วนที่ 1: สรุปการคำนวณคะแนน</div>
              <div className="text-xs text-gray-600 space-y-1">
                {[
                  ['Step 5: การเรียนการสอนดนตรีไทย (4 ข้อ × 5)', editedData?.teaching_curriculum_score ?? submission.teaching_curriculum_score ?? 0, 20],
                  ['Step 4: คุณลักษณะครูผู้สอน (ประเภทที่ไม่ซ้ำ × 5)', editedData?.teacher_qualification_score ?? submission.teacher_qualification_score ?? 0, 20],
                  ['Step 7: การสนับสนุนจากหน่วยงาน (ติ๊กถูก)', editedData?.support_from_org_score ?? submission.support_from_org_score ?? 0, 5],
                  ['Step 7: การสนับสนุนจากภายนอก (บุคคล/หน่วยงานภายนอก)', editedData?.support_from_external_score ?? submission.support_from_external_score ?? 0, 15],
                  ['Step 7: รางวัล (ระดับสูงสุด)', editedData?.award_score ?? submission.award_score ?? 0, 20],
                  ['Step 8: กิจกรรมภายในสถานศึกษา (ภายในจังหวัด - ภายในโรงเรียน)', editedData?.activity_within_province_internal_score ?? submission.activity_within_province_internal_score ?? 0, 5],
                  ['Step 8: กิจกรรมนอกสถานศึกษา (ภายในจังหวัด - ภายนอกโรงเรียน)', editedData?.activity_within_province_external_score ?? submission.activity_within_province_external_score ?? 0, 5],
                  ['Step 8: กิจกรรมนอกจังหวัด', editedData?.activity_outside_province_score ?? submission.activity_outside_province_score ?? 0, 5],
                  ['Step 9: การประชาสัมพันธ์พันธ์', editedData?.pr_activity_score ?? submission.pr_activity_score ?? 0, 5],
                ].map(([label, score, max]) => (
                  <div key={label as string} className="flex justify-between">
                    <span>{label}</span>
                    <span className="font-medium">{score}/{max} คะแนน</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 mt-2 border-t-2 border-gray-300 font-bold text-green-700">
                  <span>รวมทั้งหมด</span>
                  <span>{(editedData?.teaching_curriculum_score ?? submission.teaching_curriculum_score ?? 0) +
                         (editedData?.teacher_qualification_score ?? submission.teacher_qualification_score ?? 0) + 
                         (editedData?.support_from_org_score ?? submission.support_from_org_score ?? 0) + 
                         (editedData?.support_from_external_score ?? submission.support_from_external_score ?? 0) + 
                         (editedData?.award_score ?? submission.award_score ?? 0) + 
                         (editedData?.activity_within_province_internal_score ?? submission.activity_within_province_internal_score ?? 0) + 
                         (editedData?.activity_within_province_external_score ?? submission.activity_within_province_external_score ?? 0) + 
                         (editedData?.activity_outside_province_score ?? submission.activity_outside_province_score ?? 0) + 
                         (editedData?.pr_activity_score ?? submission.pr_activity_score ?? 0)} / 100 คะแนน</span>
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
                      <div className="text-xs text-gray-700 font-medium">1 บรรยากาศการเรียนการสอนในชั้นเรียน และในสถานศึกษา ความยาวไม่เกิน 3 นาที</div>
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
                      <div className="text-xs text-gray-700 font-medium">2 การแสดงผลงานด้านดนตรีของนักเรียน ความยาวไม่เกิน 3 นาที</div>
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
          </div>
        )}

        {/* Action Buttons */}
        {!readOnly && (
          <div className="flex gap-3 mb-6 justify-end">
            {!isEditMode && (
              <>
                <button onClick={handleExportPDF} className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2 shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Export PDF
                </button>
                <button onClick={handleExportExcel} className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Export Excel
                </button>
                <button onClick={handleEdit} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2 shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  EDIT
                </button>
                {!hideDelete && (
                  <button onClick={() => setShowDeleteModal(true)} className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    DELETE
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Floating Save/Cancel in Edit Mode */}
        {isEditMode && !readOnly && (
          <div className="fixed bottom-8 right-8 z-40 flex gap-3">
            <button onClick={handleCancelEdit} disabled={isSaving} className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              CANCEL
            </button>
            <button onClick={handleSave} disabled={isSaving} className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {isSaving ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        )}

        {/* ── Step 1 ── */}
        <StepSection title="ข้อมูลพื้นฐาน" stepNumber={1}>
          <div className="grid grid-cols-2 gap-6">
            <Field label="ชื่อสถานศึกษา" value={displayData?.schoolName} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_schoolName', val)} fieldName="reg100_schoolName" />
            <Field label="จังหวัด" value={displayData?.schoolProvince} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_schoolProvince', val)} fieldName="reg100_schoolProvince" />
            <Field label="ระดับการศึกษา" value={displayData?.schoolLevel} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_schoolLevel', val)} fieldName="reg100_schoolLevel" />
            <Field label="สังกัด" value={displayData?.affiliation} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_affiliation', val)} fieldName="reg100_affiliation" />
            <Field label="ระบุ" value={displayData?.affiliationDetail ?? displayData?.reg100_affiliationDetail} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_affiliationDetail', val)} fieldName="reg100_affiliationDetail" />
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

        {/* ── Step 2 ── */}
        <StepSection title="ผู้บริหาร" stepNumber={2}>
          <div className="grid grid-cols-2 gap-6">
            <Field label="ชื่อ-นามสกุล" value={displayData?.reg100_mgtFullName} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_mgtFullName', val)} fieldName="reg100_mgtFullName" />
            <Field label="ตำแหน่ง" value={displayData?.reg100_mgtPosition} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_mgtPosition', val)} fieldName="reg100_mgtPosition" />
            <Field label="ที่อยู่" value={displayData?.reg100_mgtAddress} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_mgtAddress', val)} fieldName="reg100_mgtAddress" />
            <Field label="โทรศัพท์" value={submission.reg100_mgtPhone} />
            <Field label="อีเมล" value={submission.reg100_mgtEmail} />
          </div>
          <div className="mt-4">
            {isEditMode ? (
              <Field label="ลิงก์รูปภาพผู้บริหาร (URL)" value={displayData?.reg100_mgtImage || displayData?.mgtImage} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_mgtImage', val)} fieldName="reg100_mgtImage" />
            ) : (
              (submission.reg100_mgtImage || submission.mgtImage) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพผู้บริหาร</label>
                  <div onClick={() => handleImageClick(resolveImageUrl(submission.reg100_mgtImage || submission.mgtImage))} className="cursor-pointer hover:opacity-80 transition-opacity inline-block">
                    <img src={resolveImageUrl(submission.reg100_mgtImage || submission.mgtImage)} alt="ผู้บริหาร" className="rounded-lg border border-gray-300 w-[200px] h-[200px] object-cover" />
                  </div>
                </div>
              )
            )}
          </div>
        </StepSection>

        {/* ── Step 3 ── */}
        <StepSection title="สภาวการณ์" stepNumber={3}>
          <div className="space-y-6">
            <ArraySection
              title="สภาวการณ์การเรียนการสอน"
              items={isEditMode ? displayData?.reg100_currentMusicTypes : submission.reg100_currentMusicTypes}
              isEditMode={isEditMode}
              onAdd={() => handleAddArrayItem('reg100_currentMusicTypes', { grade: '', details: '' })}
              onRemove={(i) => handleRemoveArrayItem('reg100_currentMusicTypes', i)}
              renderItem={(item, i) => (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="ระดับชั้น" value={item.grade} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_currentMusicTypes', i, 'grade', val)} fieldName="grade" />
                  <Field label="รายละเอียด" value={item.details} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_currentMusicTypes', i, 'details', val)} fieldName="details" />
                </div>
              )}
            />
            <ArraySection
              title="ความพร้อมเครื่องดนตรี"
              items={isEditMode ? displayData?.reg100_readinessItems : submission.reg100_readinessItems}
              isEditMode={isEditMode}
              onAdd={() => handleAddArrayItem('reg100_readinessItems', { instrumentName: '', quantity: '', note: '' })}
              onRemove={(i) => handleRemoveArrayItem('reg100_readinessItems', i)}
              renderItem={(item, i) => (
                <div className="grid grid-cols-3 gap-4">
                  <Field label="ชื่อเครื่องดนตรี" value={item.instrumentName} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_readinessItems', i, 'instrumentName', val)} fieldName="instrumentName" />
                  <Field label="จำนวน" value={item.quantity} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_readinessItems', i, 'quantity', val)} fieldName="quantity" />
                  <Field label="หมายเหตุ" value={item.note} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_readinessItems', i, 'note', val)} fieldName="note" />
                </div>
              )}
            />
          </div>
        </StepSection>

        {/* ── Step 4 ── */}
        <StepSection title="ผู้สอนดนตรีไทย" stepNumber={4}>
          <div className="space-y-6">
            <ArraySection
              title="รายชื่อครู"
              items={isEditMode ? displayData?.reg100_thaiMusicTeachers : submission.reg100_thaiMusicTeachers}
              isEditMode={isEditMode}
              addLabel="เพิ่มครู"
              onAdd={() => handleAddArrayItem('reg100_thaiMusicTeachers', { teacherQualification: '', teacherFullName: '', teacherPosition: '', teacherPhone: '', teacherEmail: '', teacherImage: '' })}
              onRemove={(i) => handleRemoveArrayItem('reg100_thaiMusicTeachers', i)}
              renderItem={(teacher, i) => (
                <>
                  <div className="mb-2"><h5 className="text-lg font-semibold text-gray-800">ครูคนที่ {i + 1}</h5></div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="ชื่อ-นามสกุล" value={teacher.teacherFullName} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', i, 'teacherFullName', val)} fieldName="teacherFullName" />
                    <SelectField
                      label="คุณลักษณะ"
                      value={teacher.teacherQualification}
                      options={['ครูผู้สอนดนตรีไทยในโรงเรียนที่สำเร็จการศึกษาดนตรีไทย', 'ครูภูมิปัญญาในท้องถิ่น', 'ผู้ทรงคุณวุฒิ ด้านการสอนดนตรีไทย', 'วิทยากร/บุคคลภายนอก ที่มาร่วมสอนดนตรีไทยในโรงเรียน']}
                      isEditMode={isEditMode}
                      onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', i, 'teacherQualification', val)}
                      fieldName="teacherQualification"
                      required
                    />
                    <Field label="โทรศัพท์" value={teacher.teacherPhone} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', i, 'teacherPhone', val)} fieldName="teacherPhone" />
                    <Field label="ตำแหน่ง" value={teacher.teacherPosition} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', i, 'teacherPosition', val)} fieldName="teacherPosition" />
                    <Field label="ทักษะ ความรู้ ความสามารถ ในการสอนภาคปฏิบัติดนตรีไทย" value={teacher.teacherAbility} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', i, 'teacherAbility', val)} fieldName="reg100_obstacles" />
                    <Field label="อีเมล" value={teacher.teacherEmail} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', i, 'teacherEmail', val)} fieldName="teacherEmail" />
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">วุฒิการศึกษา</label>
                      <div className="space-y-2">
                        {teacher.musicInstituteEducation?.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-800 mb-1">การศึกษาจากสถาบันดนตรี:</h5>
                            {teacher.musicInstituteEducation.map((edu: any, ei: number) => (
                              <div key={ei} className="text-sm text-gray-600 ml-2">• รุ่นจบ: {edu.graduationYear || '-'} | สาขา: {edu.major || '-'} | ปีที่สำเร็จ: {edu.completionYear || '-'}</div>
                            ))}
                          </div>
                        )}
                        {teacher.otherEducation?.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-800 mb-1">การศึกษาจากแหล่งอื่น:</h5>
                            {teacher.otherEducation.map((edu: any, ei: number) => (
                              <div key={ei} className="text-sm text-gray-600 ml-2">• รุ่นจบ: {edu.graduationYear || '-'} | สาขา: {edu.major || '-'} | ปีที่สำเร็จ: {edu.completionYear || '-'}</div>
                            ))}
                          </div>
                        )}
                        {!teacher.musicInstituteEducation?.length && !teacher.otherEducation?.length && (
                          <div className="text-sm text-gray-500">ไม่มีข้อมูลการศึกษา</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    {isEditMode ? (
                      <Field label="ลิงก์รูปภาพครู (URL)" value={teacher.teacherImage} fullWidth isEditMode onChange={(val) => handleArrayFieldChange('reg100_thaiMusicTeachers', i, 'teacherImage', val)} fieldName="teacherImage" />
                    ) : (
                      teacher.teacherImage && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพครู</label>
                          <div onClick={() => handleImageClick(resolveImageUrl(teacher.teacherImage))} className="cursor-pointer hover:opacity-80 transition-opacity inline-block">
                            <img src={resolveImageUrl(teacher.teacherImage)} alt={`ครู ${i + 1}`} className="rounded-lg border border-gray-300 w-[150px] h-[150px] object-cover" />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            />
          </div>
        </StepSection>

        {/* ── Step 5 ── */}
        <StepSection title="หลักสูตร" stepNumber={5}>
          <div className="space-y-6">
            {[
              { checkField: 'reg100_isCompulsorySubject', label: 'เป็นวิชาบังคับในชั้นเรียน', dataField: 'reg100_compulsoryCurriculum', title: 'รายละเอียดวิชาบังคับ' },
              { checkField: 'reg100_hasElectiveSubject', label: 'มีวิชาเลือก/วิชาเรียนเพิ่มเติม/ชุมนุม', dataField: 'reg100_electiveCurriculum', title: 'รายละเอียดวิชาเลือก' },
              { checkField: 'reg100_hasLocalCurriculum', label: 'มีหลักสูตรวิชาของท้องถิ่น', dataField: 'reg100_localCurriculum', title: 'รายละเอียดหลักสูตรท้องถิ่น' },
            ].map(({ checkField, label, dataField, title }) => (
              <div key={checkField}>
                <CheckboxField label={label} value={displayData?.[checkField]} isEditMode={isEditMode} onChange={(val) => handleFieldChange(checkField, val)} fieldName={checkField} />
                {displayData?.[dataField]?.length > 0 && (
                  <div className="ml-6 mt-2">
                    <h5 className="font-medium text-gray-800 mb-2">{title}</h5>
                    {displayData[dataField].map((c: any, i: number) => (
                      <div key={i} className="bg-gray-50 p-3 rounded border mb-2 grid grid-cols-2 gap-3">
                        <Field label="ระดับชั้น" value={c.gradeLevel} isEditMode={false} />
                        <Field label="จำนวนนักเรียน (คน)" value={c.studentCount} isEditMode={false} />
                        <Field label="ชั่วโมง/ภาคการศึกษา" value={c.hoursPerSemester} isEditMode={false} />
                        <Field label="ชั่วโมง/ปีการศึกษา" value={c.hoursPerYear} isEditMode={false} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div>
              <CheckboxField label="นอกเวลาราชการ" value={displayData?.reg100_hasAfterSchoolTeaching} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_hasAfterSchoolTeaching', val)} fieldName="reg100_hasAfterSchoolTeaching" />
              {displayData?.reg100_afterSchoolSchedule?.length > 0 && (
                <div className="ml-6 mt-2">
                  <h5 className="font-medium text-gray-800 mb-2">ตารางเรียนนอกเวลา</h5>
                  {displayData.reg100_afterSchoolSchedule.map((s: any, i: number) => (
                    <div key={i} className="bg-gray-50 p-3 rounded border mb-2 grid grid-cols-2 gap-3">
                      <Field label="วัน" value={s.day} isEditMode={false} />
                      <Field label="สถานที่" value={s.location} isEditMode={false} />
                      <Field label="เวลาเริ่ม" value={s.timeFrom} isEditMode={false} />
                      <Field label="เวลาสิ้นสุด" value={s.timeTo} isEditMode={false} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
            <Field label="สถานที่สอน" value={displayData?.reg100_teachingLocation} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_teachingLocation', val)} fieldName="reg100_teachingLocation" />
        </StepSection>

        {/* ── Step 6 ── */}
        <StepSection title="การสนับสนุน" stepNumber={6}>
          <div className="space-y-8">

            {/* 1. นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">นโยบาย แนวทางการส่งเสริมดนตรีไทยในสถานศึกษา</h4>
              <p className="text-sm text-gray-600 mb-3">ผู้มีส่วนส่งเสริม สนับสนุนการเรียนการสอนดนตรีไทย (ระบุนโยบายการจัดการเรียนการสอนดนตรีไทยของโรงเรียน วิธีการใช้ความสนับสนุน)</p>
              <ArraySection
                items={isEditMode ? displayData?.reg100_supportFactors : submission.reg100_supportFactors}
                isEditMode={isEditMode}
                onAdd={() => handleAddArrayItem('reg100_supportFactors', { sup_supportByAdmin: '', sup_supportByDescription: '' })}
                onRemove={(i) => handleRemoveArrayItem('reg100_supportFactors', i)}
                renderItem={(item, i) => (
                  <div className="space-y-3">
                    <Field label="องค์กร/หน่วยงาน/บุคคลที่ให้การส่งเสริม สนับสนุน" value={item.sup_supportByAdmin} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_supportFactors', i, 'sup_supportByAdmin', val)} fieldName="sup_supportByAdmin" />
                    <Field label="บรรยาย และอธิบายสนับสนุน" value={item.sup_supportByDescription} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_supportFactors', i, 'sup_supportByDescription', val)} fieldName="sup_supportByDescription" />
                  </div>
                )}
              />
            </div>

            {/* 2. การสนับสนุนวัสดุ อุปกรณ์ หรืองบประมาณ */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-3">การสนับสนุนวัสดุ อุปกรณ์ หรืองบประมาณ จากทั้งภายในและภายนอกสถานศึกษา</h4>

              <div>
                <CheckboxField label="ได้รับการสนับสนุนจากต้นสังกัด (บุคคล/หน่วยงานภายใน)" value={displayData?.reg100_hasSupportFromOrg} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_hasSupportFromOrg', val)} fieldName="reg100_hasSupportFromOrg" />
                {displayData?.reg100_hasSupportFromOrg && (
                  <ArraySection
                    items={isEditMode ? displayData?.reg100_supportFromOrg : submission.reg100_supportFromOrg}
                    isEditMode={isEditMode}
                    onAdd={() => handleAddArrayItem('reg100_supportFromOrg', { organization: '', details: '', evidenceLink: '' })}
                    onRemove={(i) => handleRemoveArrayItem('reg100_supportFromOrg', i)}
                    renderItem={(item, i) => (
                      <div className="space-y-3">
                        <Field label="บุคคล/หน่วยงาน" value={item.organization} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_supportFromOrg', i, 'organization', val)} fieldName="organization" />
                        <Field label="รายละเอียด" value={item.details} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_supportFromOrg', i, 'details', val)} fieldName="details" />
                        <Field label="หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)" value={item.evidenceLink} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_supportFromOrg', i, 'evidenceLink', val)} fieldName="evidenceLink" />
                      </div>
                    )}
                  />
                )}
              </div>

              <div>
                <CheckboxField label="ได้รับการสนับสนุนจากบุคคล/หน่วยงานภายนอก" value={displayData?.reg100_hasSupportFromExternal} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_hasSupportFromExternal', val)} fieldName="reg100_hasSupportFromExternal" />
                {displayData?.reg100_hasSupportFromExternal && (
                  <ArraySection
                    items={isEditMode ? displayData?.reg100_supportFromExternal : submission.reg100_supportFromExternal}
                    isEditMode={isEditMode}
                    onAdd={() => handleAddArrayItem('reg100_supportFromExternal', { organization: '', details: '', evidenceLink: '' })}
                    onRemove={(i) => handleRemoveArrayItem('reg100_supportFromExternal', i)}
                    renderItem={(item, i) => (
                      <div className="space-y-3">
                        <Field label="บุคคล/หน่วยงาน" value={item.organization} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_supportFromExternal', i, 'organization', val)} fieldName="organization" />
                        <Field label="รายละเอียด" value={item.details} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_supportFromExternal', i, 'details', val)} fieldName="details" />
                        <Field label="หลักฐาน/ภาพถ่าย (Link/URL สำหรับ Share Drive)" value={item.evidenceLink} fullWidth isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_supportFromExternal', i, 'evidenceLink', val)} fieldName="evidenceLink" />
                      </div>
                    )}
                  />
                )}
              </div>
            </div>

            {/* 3. ความพร้อมของเครื่องดนตรีกับนักเรียน */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">ความพร้อมของเครื่องดนตรีกับนักเรียน</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เพียงพอ</label>
                  <Field 
                    label="" 
                    value={displayData?.reg100_instrumentReadiness_sufficient} 
                    fullWidth 
                    isEditMode={isEditMode} 
                    onChange={(val) => handleFieldChange('reg100_instrumentReadiness_sufficient', val)} 
                    fieldName="reg100_instrumentReadiness_sufficient" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ไม่เพียงพอ</label>
                  <Field 
                    label="" 
                    value={displayData?.reg100_instrumentReadiness_insufficient} 
                    fullWidth 
                    isEditMode={isEditMode} 
                    onChange={(val) => handleFieldChange('reg100_instrumentReadiness_insufficient', val)} 
                    fieldName="reg100_instrumentReadiness_insufficient" 
                  />
                </div>
              </div>
            </div>

            {/* 4. กรอบการเรียนการสอน */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">กรอบการเรียนการสอน</h4>
              <div className="space-y-4">
                <Field 
                  label="สถานศึกษามีกรอบการเรียนการสอนดนตรีไทย หรือสาระการเรียนรู้ที่มีนักเรียนสามารถปฏิบัติได้ (เช่น วิชาพื้นฐาน/วิชาเลือก/เพิ่มเติม ที่สเสริมให้นักเรียนปฏิบัติได้)" 
                  value={displayData?.reg100_curriculumFramework} 
                  fullWidth 
                  isEditMode={isEditMode} 
                  onChange={(val) => handleFieldChange('reg100_curriculumFramework', val)} 
                  fieldName="reg100_curriculumFramework" 
                />
                <Field 
                  label="ผลลัพธ์ในการเรียนการสอนด้านดนตรีไทย" 
                  value={displayData?.reg100_learningOutcomes} 
                  fullWidth 
                  isEditMode={isEditMode} 
                  onChange={(val) => handleFieldChange('reg100_learningOutcomes', val)} 
                  fieldName="reg100_learningOutcomes" 
                />
                <Field 
                  label="การบริหารจัดการสอนดนตรีไทยของสถานศึกษา โดยให้ระบุผลสะท้อนจากนักเรียน เช่น ดนตรีไทย/เพลงที่สามารถปฏิบัติให้นักเรียนปฏิบัติได้" 
                  value={displayData?.reg100_managementContext} 
                  fullWidth 
                  isEditMode={isEditMode} 
                  onChange={(val) => handleFieldChange('reg100_managementContext', val)} 
                  fieldName="reg100_managementContext" 
                />
              </div>
            </div>

          </div>
        </StepSection>

        {/* ── Step 7 ── */}
        <StepSection title="ผลงาน" stepNumber={7}>
          <div className="space-y-6">
            {/* รางวัลและเกียรติคุณ */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">รางวัลและเกียรติคุณที่ได้รับในระยะเวลา ๑ ปี ย้อนหลัง</h4>
              <p className="text-xs text-gray-500 mb-3">อำเภอ 5 คะแนน / จังหวัด 10 คะแนน / ภาค 15 คะแนน / ประเทศ 20 คะแนน</p>
              <ArraySection
                items={isEditMode ? displayData?.reg100_awards : submission.reg100_awards}
                isEditMode={isEditMode}
                addLabel="เพิ่มรางวัล"
                onAdd={() => handleAddArrayItem('reg100_awards', { awardLevel: '', awardName: '', awardDate: '', awardEvidenceLink: '' })}
                onRemove={(i) => handleRemoveArrayItem('reg100_awards', i)}
                renderItem={(award, i) => (
                  <div className="grid grid-cols-2 gap-4">
                    <SelectField label="ระดับรางวัล:" value={award.awardLevel} options={['อำเภอ', 'จังหวัด', 'ภาค', 'ประเทศ']} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_awards', i, 'awardLevel', val)} fieldName="awardLevel" required />
                    <Field label="ชื่อรางวัล:" value={award.awardName} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_awards', i, 'awardName', val)} fieldName="awardName" />
                    <Field label="วันที่ได้รับรางวัล:" value={award.awardDate} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_awards', i, 'awardDate', val)} fieldName="awardDate" />
                    <Field label="ลิงก์หลักฐาน:" value={award.awardEvidenceLink} isEditMode={isEditMode} onChange={(val) => handleArrayFieldChange('reg100_awards', i, 'awardEvidenceLink', val)} fieldName="awardEvidenceLink" />
                  </div>
                )}
              />
            </div>

            {/* ภาพถ่ายผลงาน และคลิปวิดีโอ */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">ภาพถ่ายผลงาน และคลิปวิดีโอที่มีความชัดเจน และสื่อให้เห็นถึงความเป็นโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์</h4>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-2">ภาพถ่ายผลงาน หรือกิจกรรมเด่น ตั้งแต่ปีการศึกษา 2567 - พฤษภาคม 2568 จำนวน 10 - 20 ภาพ เท่านั้น!!!</h5>
                  <p className="text-sm text-gray-600 mb-3">Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)</p>
                  <Field 
                    label="" 
                    value={displayData?.reg100_photoGalleryLink} 
                    fullWidth 
                    isEditMode={isEditMode} 
                    onChange={(val) => handleFieldChange('reg100_photoGalleryLink', val)} 
                    fieldName="reg100_photoGalleryLink" 
                  />
                  <p className="text-xs text-gray-500 mt-2">กรุณาเปลี่ยนที่สามารถเข้าถึงได้ "ทุกคนในอินเทอร์เน็ต จะดูได้ทั้งหมดโดยไม่ต้องลงชื่อเข้าใช้"</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-gray-900 mb-2">วิดีโอ/คลิป</h5>
                  <p className="text-xs text-red-600 font-medium mb-3">กรุณาแชร์ลิงก์ที่สามารถเข้าถึงได้ "หากไม่สามารถเปิดได้ จะถือว่าสละสิทธิ์รับคะแนนส่วนนี้"</p>
                  
                  <div className="space-y-4">
                    {/* Video 1 */}
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <p className="text-sm font-medium text-gray-900 mb-2">1. บรรยากาศการเรียนการสอนในชั้นเรียน (ทุกระดับชั้น) </p>
                      <p className="text-xs text-gray-600 mb-2">Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)</p>
                      <Field 
                        label="" 
                        value={displayData?.reg100_videoLink} 
                        fullWidth 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleFieldChange('reg100_videoLink', val)} 
                        fieldName="reg100_videoLink" 
                      />
                    </div>

                    {/* Video 2 */}
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <p className="text-sm font-medium text-gray-900 mb-2">2. การแสดงผลงานด้านดนตรีไทยของนักเรียนทั้งโรงเรียน</p>
                      <p className="text-xs text-gray-600 mb-2">Link/URL สำหรับ Share Drive (Google Drive, Dropbox, etc.)</p>
                      <Field 
                        label="" 
                        value={displayData?.reg100_videoLink2} 
                        fullWidth 
                        isEditMode={isEditMode} 
                        onChange={(val) => handleFieldChange('reg100_videoLink2', val)} 
                        fieldName="reg100_videoLink2" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StepSection>

        {/* ๘. การเผยแพร่ */}
        <StepSection title="การเผยแพร่" stepNumber={8}>
          <div className="space-y-6">
            <ActivityList title="กิจกรรมภายในจังหวัด (ภายใน)" activities={isEditMode ? displayData?.reg100_activitiesWithinProvinceInternal : submission.reg100_activitiesWithinProvinceInternal} isEditMode={isEditMode} arrayField="reg100_activitiesWithinProvinceInternal" onFieldChange={handleArrayFieldChange} onAdd={() => handleAddArrayItem('reg100_activitiesWithinProvinceInternal', { activityName: '', activityDate: '', evidenceLink: '' })} onRemove={(i) => handleRemoveArrayItem('reg100_activitiesWithinProvinceInternal', i)} />
            
            <ActivityList title="กิจกรรมภายในจังหวัด (ภายนอก)" activities={isEditMode ? displayData?.reg100_activitiesWithinProvinceExternal : submission.reg100_activitiesWithinProvinceExternal} isEditMode={isEditMode} arrayField="reg100_activitiesWithinProvinceExternal" onFieldChange={handleArrayFieldChange} onAdd={() => handleAddArrayItem('reg100_activitiesWithinProvinceExternal', { activityName: '', activityDate: '', evidenceLink: '' })} onRemove={(i) => handleRemoveArrayItem('reg100_activitiesWithinProvinceExternal', i)} />
            
            <ActivityList title="กิจกรรมนอกจังหวัด" activities={isEditMode ? displayData?.reg100_activitiesOutsideProvince : submission.reg100_activitiesOutsideProvince} isEditMode={isEditMode} arrayField="reg100_activitiesOutsideProvince" onFieldChange={handleArrayFieldChange} onAdd={() => handleAddArrayItem('reg100_activitiesOutsideProvince', { activityName: '', activityDate: '', evidenceLink: '' })} onRemove={(i) => handleRemoveArrayItem('reg100_activitiesOutsideProvince', i)} />
          </div>
        </StepSection>

        {/* ๙. การประชาสัมพันธ์ */}
        <StepSection title="การประชาสัมพันธ์" stepNumber={9}>
          <div className="space-y-6">
            <ActivityList title="การประชาสัมพันธ์ผลงานของสถานศึกษา" activities={isEditMode ? displayData?.reg100_prActivities : submission.reg100_prActivities} isEditMode={isEditMode} arrayField="reg100_prActivities" onFieldChange={handleArrayFieldChange} onAdd={() => handleAddArrayItem('reg100_prActivities', { activityName: '', publishDate: '', evidenceLink: '', platform: '' })} onRemove={(i) => handleRemoveArrayItem('reg100_prActivities', i)} hasPlatform />

            {/* Information Sources */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">ได้รับข้อมูลการสมัครโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์จาก</h4>
              <div className="space-y-4">
                <div>
                  <CheckboxField label="โรงเรียน:" value={displayData?.reg100_heardFromSchool} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_heardFromSchool', val)} fieldName="reg100_heardFromSchool" />
                  {displayData?.reg100_heardFromSchool && (
                    <div className="ml-6 mt-2 space-y-2">
                      <Field label="ชื่อโรงเรียน:" value={displayData?.reg100_heardFromSchoolName} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_heardFromSchoolName', val)} fieldName="reg100_heardFromSchoolName" />
                      
                      <Field label="อำเภอ:" value={displayData?.reg100_heardFromSchoolDistrict} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_heardFromSchoolDistrict', val)} fieldName="reg100_heardFromSchoolDistrict" />
                      
                      <Field label="จังหวัด:" value={displayData?.reg100_heardFromSchoolProvince} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_heardFromSchoolProvince', val)} fieldName="reg100_heardFromSchoolProvince" />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-3">ช่องทางการประชาสัมพันธ์ของกรมส่งเสริมวัฒนธรรม</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <CheckboxField label="เฟซบุ๊ก (Facebook):" value={displayData?.reg100_DCP_PR_Channel_FACEBOOK} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_DCP_PR_Channel_FACEBOOK', val)} fieldName="reg100_DCP_PR_Channel_FACEBOOK" />
                    
                    <CheckboxField label="ยูทูบ (YouTube):" value={displayData?.reg100_DCP_PR_Channel_YOUTUBE} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_DCP_PR_Channel_YOUTUBE', val)} fieldName="reg100_DCP_PR_Channel_YOUTUBE" />
                    
                    <CheckboxField label="ติ๊กต๊อก (TikTok):" value={displayData?.reg100_DCP_PR_Channel_Tiktok} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_DCP_PR_Channel_Tiktok', val)} fieldName="reg100_DCP_PR_Channel_Tiktok" />
                  </div>
                </div>
                <div>
                  <CheckboxField label="สำนักงานวัฒนธรรมจังหวัด:" value={displayData?.reg100_heardFromCulturalOffice} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_heardFromCulturalOffice', val)} fieldName="reg100_heardFromCulturalOffice" />
                  {displayData?.reg100_heardFromCulturalOffice && (
                    <div className="ml-6 mt-2">
                      <Field label="ระบุสำนักงานวัฒนธรรมจังหวัด:" value={displayData?.reg100_heardFromCulturalOfficeName} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_heardFromCulturalOfficeName', val)} fieldName="reg100_heardFromCulturalOfficeName" />
                    </div>
                  )}
                </div>
                <div>
                  <CheckboxField label="สำนักงานเขตพื้นที่การศึกษา:" value={displayData?.reg100_heardFromEducationArea} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_heardFromEducationArea', val)} fieldName="reg100_heardFromEducationArea" />
                  {displayData?.reg100_heardFromEducationArea && (
                    <div className="ml-6 mt-2 space-y-2">
                      <Field label="ระบุสำนักงานเขตพื้นที่การศึกษา:" value={displayData?.reg100_heardFromEducationAreaName} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_heardFromEducationAreaName', val)} fieldName="reg100_heardFromEducationAreaName" />
                      
                      <Field label="จังหวัด:" value={displayData?.reg100_heardFromEducationAreaProvince} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_heardFromEducationAreaProvince', val)} fieldName="reg100_heardFromEducationAreaProvince" />
                    </div>
                  )}
                </div>
                <div>
                  <CheckboxField label="อื่น ๆ ระบุ:" value={displayData?.reg100_heardFromOther} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_heardFromOther', val)} fieldName="reg100_heardFromOther" />
                  {displayData?.reg100_heardFromOther && (
                    <div className="ml-6 mt-2">
                      <Field label="ระบุ:" value={displayData?.reg100_heardFromOtherDetail} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_heardFromOtherDetail', val)} fieldName="reg100_heardFromOtherDetail" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Field label="ปัญหาและอุปสรรคที่มีผลกระทบต่อการเรียนการสอนดนตรีไทย:" value={displayData?.reg100_obstacles} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_obstacles', val)} fieldName="reg100_obstacles" />
            
            <Field label="ข้อเสนอแนะในการส่งเสริมดนตรีไทยในสถานศึกษา:" value={displayData?.reg100_suggestions} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_suggestions', val)} fieldName="reg100_suggestions" />

            <div className="bg-gray-50 p-4 rounded-lg">
              <CheckboxField label="ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในแบบฟอร์มนี้เป็นความจริงทุกประการ:" value={displayData?.reg100_certifiedByAdmin} isEditMode={isEditMode} onChange={(val) => handleFieldChange('reg100_certifiedByAdmin', val)} fieldName="reg100_certifiedByAdmin" />
            </div>
          </div>
        </StepSection>

      </div>{/* end container */}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">ยืนยันการลบ</h3>
            <p className="text-gray-600 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ <strong>{submission.reg100_schoolName}</strong>?<br />
              <span className="text-red-600">การดำเนินการนี้ไม่สามารถย้อนกลับได้</span>
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all">ยกเลิก</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all">ลบข้อมูล</button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-7xl max-h-[90vh]">
            <button onClick={() => setShowImageModal(false)} className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img src={selectedImage} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Utility ───────────────────────────────────────────────────────────────────

function resolveImageUrl(src: string): string {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  if (src.startsWith('/uploads/')) return src.replace('/uploads/', '/api/uploads/');
  return src;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ScoreCard({ step, title, subtitle, score, max, color, note }: { step: string; title: string; subtitle: string; score: number; max: number; color: string; note: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800 text-blue-600 bg-blue-100 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-800 text-purple-600 bg-purple-100 text-purple-700',
    teal: 'bg-teal-50 border-teal-200 text-teal-800 text-teal-600 bg-teal-100 text-teal-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-800 text-orange-600 bg-orange-100 text-orange-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-800 text-amber-600 bg-amber-100 text-amber-700',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-800 text-cyan-600 bg-cyan-100 text-cyan-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800 text-indigo-600 bg-indigo-100 text-indigo-700',
    pink: 'bg-pink-50 border-pink-200 text-pink-800 text-pink-600 bg-pink-100 text-pink-700',
    rose: 'bg-rose-50 border-rose-200 text-rose-800 text-rose-600 bg-rose-100 text-rose-700',
  };
  const [bg, border, stepColor, scoreColor, noteBg, noteText] = colors[color]?.split(' ') ?? Array(6).fill('');
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
      <div className={`text-xs ${noteText} ${noteBg} px-2 py-1 rounded mt-2`}>{note}</div>
    </div>
  );
}

function EditableScoreSection({ 
  title, 
  items, 
  isEditMode, 
  onScoreChange 
}: { 
  title: string; 
  items: Array<{ label: string; score: number; max: number; fieldName: string }>; 
  isEditMode: boolean;
  onScoreChange: (fieldName: string, value: number) => void;
}) {
  const totalScore = items.reduce((sum, item) => sum + item.score, 0);
  const totalMax = items.reduce((sum, item) => sum + item.max, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="bg-green-50 px-6 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-3">สรุปการคำนวณคะแนน:</h4>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.fieldName} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                <span className="text-sm text-gray-700">{item.label}</span>
                <div className="flex items-center gap-2">
                  {isEditMode ? (
                    <>
                      <input
                        type="number"
                        min="0"
                        max={item.max}
                        value={item.score}
                        onChange={(e) => onScoreChange(item.fieldName, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-600">/ {item.max} คะแนน</span>
                    </>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">{item.score}/{item.max} คะแนน</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t-2 border-gray-300">
            <span className="font-bold text-green-700">รวมทั้งหมด</span>
            <span className="text-lg font-bold text-green-700">{totalScore} / {totalMax} คะแนน</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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

function ArraySection({ title, items, isEditMode, addLabel = 'เพิ่มรายการ', onAdd, onRemove, renderItem }: {
  title?: string;
  items: any[];
  isEditMode: boolean;
  addLabel?: string;
  onAdd: () => void;
  onRemove: (i: number) => void;
  renderItem: (item: any, i: number) => React.ReactNode;
}) {
  return (
    <div>
      {title && <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>}
      {items?.length > 0 ? items.map((item, i) => (
        <div key={i} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
          {renderItem(item, i)}
          {isEditMode && (
            <button onClick={() => onRemove(i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      )) : <p className="text-gray-500">ไม่มีข้อมูล</p>}
      {isEditMode && (
        <button onClick={onAdd} className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          {addLabel}
        </button>
      )}
    </div>
  );
}

const SCHOOL_SIZE_MAP: Record<string, string> = {
  SMALL:       'ขนาดเล็ก (119 คนลงมา)',
  MEDIUM:      'ขนาดกลาง (120 - 719 คน)',
  LARGE:       'ขนาดใหญ่ (720 - 1,679 คน)',
  EXTRA_LARGE: 'ขนาดใหญ่พิเศษ (1,680 คนขึ้นไป)',
};

function Field({ label, value, fullWidth = false, isEditMode = false, onChange, fieldName }: {
  label: string; value: any; fullWidth?: boolean; isEditMode?: boolean; onChange?: (v: any) => void; fieldName?: string;
}) {
  const isUrl = (s: string) => typeof s === 'string' && (s.startsWith('http://') || s.startsWith('https://'));
  const longFields = ['reg100_obstacles', 'reg100_suggestions', 'reg100_curriculumFramework', 'reg100_learningOutcomes', 'reg100_managementContext', 'reg100_teachingLocation', 'reg100_studentCountByGrade', 'reg100_mgtAddress'];

  // Map English school size values to Thai display labels
  const displayValue = (v: any) => {
    if (typeof v === 'string' && SCHOOL_SIZE_MAP[v]) return SCHOOL_SIZE_MAP[v];
    return v;
  };

  if (isEditMode && onChange && fieldName) {
    return (
      <div className={fullWidth ? 'col-span-2' : ''}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {longFields.includes(fieldName) ? (
          <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        ) : (
          <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        )}
      </div>
    );
  }
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[44px]">
        {value
          ? (isUrl(value)
              ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline break-all">{value}</a>
              : displayValue(value))
          : <span className="text-gray-400">-</span>}
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
  label: string; value: boolean; isEditMode?: boolean; onChange?: (v: boolean) => void; fieldName?: string;
}) {
  if (isEditMode && onChange && fieldName) {
    return (
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={value || false} onChange={(e) => onChange(e.target.checked)} className="w-5 h-5 text-[#00B050] border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer" />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${value ? 'bg-[#00B050] border-[#00B050]' : 'border-gray-300'}`}>
        {value && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

function ActivityList({ title, activities, isEditMode = false, arrayField = '', onFieldChange, onAdd, onRemove, hasPlatform = false }: {
  title: string; activities: any[]; isEditMode?: boolean; arrayField?: string;
  onFieldChange?: (f: string, i: number, field: string, v: any) => void;
  onAdd?: () => void; onRemove?: (i: number) => void; hasPlatform?: boolean;
}) {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      {activities?.length > 0 ? activities.map((a: any, i: number) => (
        <div key={i} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</div>
            <div className="flex-1 grid grid-cols-3 gap-4">
              <Field label="ชื่อกิจกรรม/งาน" value={a.activityName} isEditMode={isEditMode} onChange={(v) => onFieldChange?.(arrayField, i, 'activityName', v)} fieldName="activityName" />
              <Field label="วันที่เผยแพร่" value={a.activityDate || a.publishDate} isEditMode={isEditMode} onChange={(v) => onFieldChange?.(arrayField, i, hasPlatform ? 'publishDate' : 'activityDate', v)} fieldName={hasPlatform ? 'publishDate' : 'activityDate'} />
              <Field label="หลักฐานการเผยแพร่ (Link/URL)" value={a.evidenceLink} isEditMode={isEditMode} onChange={(v) => onFieldChange?.(arrayField, i, 'evidenceLink', v)} fieldName="evidenceLink" />
              {hasPlatform && <Field label="แหล่งเผยแพร่/ประชาสัมพันธ์ในสื่อสังคมออนไลน์" value={a.platform} isEditMode={isEditMode} onChange={(v) => onFieldChange?.(arrayField, i, 'platform', v)} fieldName="platform" />}
            </div>
          </div>
          {isEditMode && onRemove && (
            <button onClick={() => onRemove(i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      )) : <p className="text-gray-500">ไม่มีข้อมูล</p>}
      {isEditMode && onAdd && (
        <button onClick={onAdd} className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          เพิ่มกิจกรรม
        </button>
      )}
    </div>
  );
}
