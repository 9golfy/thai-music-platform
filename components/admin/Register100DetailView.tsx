'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Submission {
  _id: string;
  [key: string]: any;
}

export default function Register100DetailView({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [editData, setEditData] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/register100/${id}`);
      const data = await response.json();
      if (data.success) {
        setSubmission(data.submission);
        setEditData(data.submission);
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editData) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/register100/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      const data = await response.json();
      
      if (data.success) {
        setSubmission(editData);
        setSuccessMessage('บันทึกข้อมูลสำเร็จ');
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push(`/dashboard/register100/${id}`);
        }, 2000);
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(submission);
    router.push(`/dashboard/register100/${id}`);
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!editData) return;
    setEditData({ ...editData, [field]: value });
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
        router.push('/dashboard/register100');
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

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
          <div className="flex justify-between items-start">
            <div>
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                กลับ
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {submission.schoolName}
              </h1>
              <p className="text-gray-600 mt-2">
                {submission.schoolProvince} • {submission.schoolLevel}
              </p>
            </div>
            <div className="flex gap-3">
              {!isEditMode ? (
                <>
                  <button
                    onClick={() => router.push(`/dashboard/register100/${id}?mode=edit`)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    EDIT
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
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
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-[#00B050] text-white rounded-lg hover:bg-[#009040] transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {saving ? 'กำลังบันทึก...' : 'SAVE'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    CANCEL
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Score Summary */}
          <div className="mt-6">
            {/* Total Score - Large Display */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg mb-4 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-700">คะแนนรวมทั้งหมด</div>
                  <div className="text-sm text-gray-600 mt-1">Total Score</div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-green-600">{submission.total_score || 0}</div>
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
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-indigo-800 mb-1">STEP 5</div>
                    <div className="text-sm font-medium text-gray-700">การสนับสนุนจากภายนอก</div>
                    <div className="text-xs text-gray-600 mt-1">
                      (บุคคล/หน่วยงานภายนอก)
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-2xl font-bold text-indigo-600">{submission.support_from_external_score || 0}</div>
                    <div className="text-xs text-gray-500">/ 15</div>
                  </div>
                </div>
                <div className="text-xs text-indigo-700 bg-indigo-100 px-2 py-1 rounded mt-2">
                  1 คน=5, 2 คน=10, 3+ คน=15
                </div>
              </div>

              {/* Step 5: Award Score */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-orange-800 mb-1">STEP 5</div>
                    <div className="text-sm font-medium text-gray-700">รางวัลและเกียรติคุณ</div>
                    <div className="text-xs text-gray-600 mt-1">
                      (อำเภอ, จังหวัด, ภาค, ประเทศ)
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-2xl font-bold text-orange-600">{submission.award_score || 0}</div>
                    <div className="text-xs text-gray-500">/ 20</div>
                  </div>
                </div>
                <div className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded mt-2">
                  อำเภอ=5, จังหวัด=10, ภาค=15, ประเทศ=20
                </div>
              </div>

              {/* Step 7: Internal Activities */}
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-pink-800 mb-1">STEP 7</div>
                    <div className="text-sm font-medium text-gray-700">กิจกรรมภายในสถานศึกษา</div>
                    <div className="text-xs text-gray-600 mt-1">
                      (ภายในจังหวัด - ภายในโรงเรียน)
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-2xl font-bold text-pink-600">{submission.activity_within_province_internal_score || 0}</div>
                    <div className="text-xs text-gray-500">/ 5</div>
                  </div>
                </div>
                <div className="text-xs text-pink-700 bg-pink-100 px-2 py-1 rounded mt-2">
                  ≥ 3 กิจกรรม = 5 คะแนน
                </div>
              </div>

              {/* Step 7: External Activities */}
              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-cyan-800 mb-1">STEP 7</div>
                    <div className="text-sm font-medium text-gray-700">กิจกรรมภายนอกสถานศึกษา</div>
                    <div className="text-xs text-gray-600 mt-1">
                      (ภายในจังหวัด - นอกโรงเรียน)
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-2xl font-bold text-cyan-600">{submission.activity_within_province_external_score || 0}</div>
                    <div className="text-xs text-gray-500">/ 5</div>
                  </div>
                </div>
                <div className="text-xs text-cyan-700 bg-cyan-100 px-2 py-1 rounded mt-2">
                  ≥ 3 กิจกรรม = 5 คะแนน
                </div>
              </div>

              {/* Step 7: Outside Province Activities */}
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-amber-800 mb-1">STEP 7</div>
                    <div className="text-sm font-medium text-gray-700">กิจกรรมนอกจังหวัด</div>
                    <div className="text-xs text-gray-600 mt-1">
                      (ภายนอกจังหวัด)
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-2xl font-bold text-amber-600">{submission.activity_outside_province_score || 0}</div>
                    <div className="text-xs text-gray-500">/ 5</div>
                  </div>
                </div>
                <div className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded mt-2">
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
            <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
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
        </div>

        {/* Step 1: ข้อมูลพื้นฐาน */}
        <StepSection title="Step 1: ข้อมูลพื้นฐาน" stepNumber={1}>
          <div className="grid grid-cols-2 gap-6">
            <Field label="ชื่อสถานศึกษา" value={isEditMode ? editData?.schoolName : submission.schoolName} isEditMode={isEditMode} field="schoolName" onChange={handleFieldChange} />
            <Field label="จังหวัด" value={isEditMode ? editData?.schoolProvince : submission.schoolProvince} isEditMode={isEditMode} field="schoolProvince" onChange={handleFieldChange} />
            <Field label="ระดับการศึกษา" value={isEditMode ? editData?.schoolLevel : submission.schoolLevel} isEditMode={isEditMode} field="schoolLevel" onChange={handleFieldChange} />
            <Field label="สังกัด" value={isEditMode ? editData?.affiliation : submission.affiliation} isEditMode={isEditMode} field="affiliation" onChange={handleFieldChange} />
            <Field label="ขนาดโรงเรียน" value={isEditMode ? editData?.schoolSize : submission.schoolSize} isEditMode={isEditMode} field="schoolSize" onChange={handleFieldChange} />
            <Field label="จำนวนบุคลากร" value={isEditMode ? editData?.staffCount : submission.staffCount} isEditMode={isEditMode} field="staffCount" onChange={handleFieldChange} />
            <Field label="จำนวนนักเรียน" value={isEditMode ? editData?.studentCount : submission.studentCount} isEditMode={isEditMode} field="studentCount" onChange={handleFieldChange} />
            <Field label="จำนวนนักเรียนแต่ละชั้น" value={isEditMode ? editData?.studentCountByGrade : submission.studentCountByGrade} fullWidth isEditMode={isEditMode} field="studentCountByGrade" onChange={handleFieldChange} />
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">สถานที่ตั้ง</h4>
            <div className="grid grid-cols-2 gap-6">
              <Field label="เลขที่" value={isEditMode ? editData?.addressNo : submission.addressNo} isEditMode={isEditMode} field="addressNo" onChange={handleFieldChange} />
              <Field label="หมู่" value={isEditMode ? editData?.moo : submission.moo} isEditMode={isEditMode} field="moo" onChange={handleFieldChange} />
              <Field label="ถนน" value={isEditMode ? editData?.road : submission.road} isEditMode={isEditMode} field="road" onChange={handleFieldChange} />
              <Field label="ตำบล/แขวง" value={isEditMode ? editData?.subDistrict : submission.subDistrict} isEditMode={isEditMode} field="subDistrict" onChange={handleFieldChange} />
              <Field label="อำเภอ/เขต" value={isEditMode ? editData?.district : submission.district} isEditMode={isEditMode} field="district" onChange={handleFieldChange} />
              <Field label="จังหวัด" value={isEditMode ? editData?.provinceAddress : submission.provinceAddress} isEditMode={isEditMode} field="provinceAddress" onChange={handleFieldChange} />
              <Field label="รหัสไปรษณีย์" value={isEditMode ? editData?.postalCode : submission.postalCode} isEditMode={isEditMode} field="postalCode" onChange={handleFieldChange} />
              <Field label="โทรศัพท์" value={isEditMode ? editData?.phone : submission.phone} isEditMode={isEditMode} field="phone" onChange={handleFieldChange} />
              <Field label="โทรสาร" value={isEditMode ? editData?.fax : submission.fax} isEditMode={isEditMode} field="fax" onChange={handleFieldChange} />
            </div>
          </div>
        </StepSection>

        {/* Step 2: ผู้บริหาร */}
        <StepSection title="Step 2: ผู้บริหารสถานศึกษา" stepNumber={2}>
          <div className="grid grid-cols-2 gap-6">
            <Field label="ชื่อ-นามสกุล" value={isEditMode ? editData?.mgtFullName : submission.mgtFullName} isEditMode={isEditMode} field="mgtFullName" onChange={handleFieldChange} />
            <Field label="ตำแหน่ง" value={isEditMode ? editData?.mgtPosition : submission.mgtPosition} isEditMode={isEditMode} field="mgtPosition" onChange={handleFieldChange} />
            <Field label="ที่อยู่" value={isEditMode ? editData?.mgtAddress : submission.mgtAddress} fullWidth isEditMode={isEditMode} field="mgtAddress" onChange={handleFieldChange} />
            <Field label="โทรศัพท์" value={isEditMode ? editData?.mgtPhone : submission.mgtPhone} isEditMode={isEditMode} field="mgtPhone" onChange={handleFieldChange} />
            <Field label="อีเมล" value={isEditMode ? editData?.mgtEmail : submission.mgtEmail} isEditMode={isEditMode} field="mgtEmail" onChange={handleFieldChange} />
          </div>
          {submission.mgtImage && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพผู้บริหาร</label>
              <div 
                onClick={() => handleImageClick(submission.mgtImage)}
                className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
              >
                <img 
                  src={submission.mgtImage} 
                  alt="ผู้บริหาร" 
                  className="rounded-lg border border-gray-300 w-[200px] h-[200px] object-cover"
                />
              </div>
            </div>
          )}
        </StepSection>

        {/* Step 3: แผนการสอน */}
        <StepSection title="Step 3: แผนการสอนดนตรีไทย" stepNumber={3}>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">สภาวการณ์การเรียนการสอน</h4>
              {submission.currentMusicTypes && submission.currentMusicTypes.length > 0 ? (
                submission.currentMusicTypes.map((item: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="ระดับชั้น" value={item.grade} />
                      <Field label="รายละเอียด" value={item.details} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">ไม่มีข้อมูล</p>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">ความพร้อมเครื่องดนตรี</h4>
              {submission.readinessItems && submission.readinessItems.length > 0 ? (
                submission.readinessItems.map((item: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                    <div className="grid grid-cols-3 gap-4">
                      <Field label="ชื่อเครื่องดนตรี" value={item.instrumentName} />
                      <Field label="จำนวน" value={item.quantity} />
                      <Field label="หมายเหตุ" value={item.note} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">ไม่มีข้อมูล</p>
              )}
            </div>
          </div>
        </StepSection>

        {/* Step 4: ผู้สอน */}
        <StepSection title="Step 4: ผู้สอนดนตรีไทย" stepNumber={4}>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">รายชื่อครู</h4>
              {submission.thaiMusicTeachers && submission.thaiMusicTeachers.length > 0 ? (
                submission.thaiMusicTeachers.map((teacher: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="คุณลักษณะ" value={teacher.teacherQualification} />
                      <Field label="ชื่อ-นามสกุล" value={teacher.teacherFullName} />
                      <Field label="ตำแหน่ง" value={teacher.teacherPosition} />
                      <Field label="วุฒิการศึกษา" value={teacher.teacherEducation} />
                      <Field label="โทรศัพท์" value={teacher.teacherPhone} />
                      <Field label="อีเมล" value={teacher.teacherEmail} />
                    </div>
                    {teacher.teacherImage && (
                      <div className="mt-3">
                        <div 
                          onClick={() => handleImageClick(teacher.teacherImage)}
                          className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
                        >
                          <img 
                            src={teacher.teacherImage} 
                            alt={`ครู ${index + 1}`}
                            className="rounded-lg border border-gray-300 w-[150px] h-[150px] object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">ไม่มีข้อมูล</p>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">การเรียนการสอน</h4>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <CheckboxField label="วิชาบังคับ" value={submission.isCompulsorySubject} />
                <CheckboxField label="สอนหลังเลิกเรียน" value={submission.hasAfterSchoolTeaching} />
                <CheckboxField label="วิชาเลือก" value={submission.hasElectiveSubject} />
                <CheckboxField label="หลักสูตรท้องถิ่น" value={submission.hasLocalCurriculum} />
              </div>
            </div>

            <Field label="สถานที่สอน" value={submission.teachingLocation} fullWidth />
          </div>
        </StepSection>

        {/* Step 5: การสนับสนุน */}
        <StepSection title="Step 5: การสนับสนุนและรางวัล" stepNumber={5}>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">การสนับสนุนจากองค์กร</h4>
              <CheckboxField label="มีการสนับสนุนจากองค์กร" value={submission.hasSupportFromOrg} />
              {submission.supportFromOrg && submission.supportFromOrg.length > 0 && (
                <div className="mt-3 space-y-3">
                  {submission.supportFromOrg.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <Field label="องค์กร" value={item.organization} />
                      <Field label="รายละเอียด" value={item.details} />
                      <Field label="ลิงก์หลักฐาน" value={item.evidenceLink} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">การสนับสนุนจากภายนอก</h4>
              <CheckboxField label="มีการสนับสนุนจากภายนอก" value={submission.hasSupportFromExternal} />
              {submission.supportFromExternal && submission.supportFromExternal.length > 0 && (
                <div className="mt-3 space-y-3">
                  {submission.supportFromExternal.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <Field label="องค์กร" value={item.organization} />
                      <Field label="รายละเอียด" value={item.details} />
                      <Field label="ลิงก์หลักฐาน" value={item.evidenceLink} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">รางวัล</h4>
              {submission.awards && submission.awards.length > 0 ? (
                submission.awards.map((award: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="ระดับรางวัล" value={award.awardLevel} />
                      <Field label="ชื่อรางวัล" value={award.awardName} />
                      <Field label="วันที่ได้รับ" value={award.awardDate} />
                      <Field label="ลิงก์หลักฐาน" value={award.awardEvidenceLink} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">ไม่มีข้อมูล</p>
              )}
            </div>

            <Field label="กรอบหลักสูตร" value={submission.curriculumFramework} fullWidth />
            <Field label="ผลการเรียนรู้" value={submission.learningOutcomes} fullWidth />
            <Field label="บริบทการจัดการ" value={submission.managementContext} fullWidth />
          </div>
        </StepSection>

        {/* Step 6: สื่อ */}
        <StepSection title="Step 6: สื่อและวิดีโอ" stepNumber={6}>
          <div className="grid grid-cols-2 gap-6">
            <Field label="ลิงก์แกลเลอรี่รูปภาพ" value={submission.photoGalleryLink} />
            <Field label="ลิงก์วิดีโอ" value={submission.videoLink} />
          </div>
        </StepSection>

        {/* Step 7: กิจกรรม */}
        <StepSection title="Step 7: กิจกรรมและการเผยแพร่" stepNumber={7}>
          <div className="space-y-6">
            <ActivityList 
              title="กิจกรรมภายในจังหวัด (ภายใน)" 
              activities={submission.activitiesWithinProvinceInternal} 
            />
            <ActivityList 
              title="กิจกรรมภายในจังหวัด (ภายนอก)" 
              activities={submission.activitiesWithinProvinceExternal} 
            />
            <ActivityList 
              title="กิจกรรมนอกจังหวัด" 
              activities={submission.activitiesOutsideProvince} 
            />
          </div>
        </StepSection>

        {/* Step 8: ประชาสัมพันธ์ */}
        <StepSection title="Step 8: ประชาสัมพันธ์และแหล่งข้อมูล" stepNumber={8}>
          <div className="space-y-6">
            <ActivityList 
              title="กิจกรรมประชาสัมพันธ์" 
              activities={submission.prActivities} 
            />

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">แหล่งที่มาของข้อมูล</h4>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <CheckboxField label="โรงเรียน" value={submission.heardFromSchool} />
                <Field label="ชื่อโรงเรียน" value={submission.heardFromSchoolName} />
                <CheckboxField label="Facebook" value={submission.DCP_PR_Channel_FACEBOOK} />
                <CheckboxField label="YouTube" value={submission.DCP_PR_Channel_YOUTUBE} />
                <CheckboxField label="TikTok" value={submission.DCP_PR_Channel_Tiktok} />
                <CheckboxField label="สำนักงานวัฒนธรรม" value={submission.heardFromCulturalOffice} />
                <Field label="ชื่อสำนักงาน" value={submission.heardFromCulturalOfficeName} />
                <CheckboxField label="สำนักงานเขตพื้นที่" value={submission.heardFromEducationArea} />
                <Field label="ชื่อสำนักงาน" value={submission.heardFromEducationAreaName} />
                <Field label="จังหวัด" value={submission.heardFromEducationAreaProvince} />
                <CheckboxField label="อื่นๆ" value={submission.heardFromOther} />
                <Field label="รายละเอียดอื่นๆ" value={submission.heardFromOtherDetail} />
              </div>
            </div>

            <Field label="ปัญหาอุปสรรค" value={submission.obstacles} fullWidth />
            <Field label="ข้อเสนอแนะ" value={submission.suggestions} fullWidth />
            <CheckboxField label="รับรองความถูกต้อง" value={submission.certifiedINFOByAdminName} />
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
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">สำเร็จ</h3>
            <p className="text-gray-600 text-center">
              {successMessage}
            </p>
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
              src={selectedImage} 
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

function Field({ label, value, fullWidth = false, isEditMode = false, field, onChange }: { 
  label: string; 
  value: any; 
  fullWidth?: boolean;
  isEditMode?: boolean;
  field?: string;
  onChange?: (field: string, value: any) => void;
}) {
  // Check if value is a URL
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

  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditMode && field && onChange ? (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full text-gray-900 bg-white border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B050]"
        />
      ) : (
        <div className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[44px]">
          {renderValue()}
        </div>
      )}
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

function ActivityList({ title, activities }: { title: string; activities: any[] }) {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      {activities && activities.length > 0 ? (
        activities.map((activity: any, index: number) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
            <div className="grid grid-cols-3 gap-4">
              <Field label="ชื่อกิจกรรม" value={activity.activityName} />
              <Field label="วันที่" value={activity.activityDate || activity.publishDate} />
              <Field label="ลิงก์หลักฐาน" value={activity.evidenceLink} />
              {activity.platform && <Field label="แพลตฟอร์ม" value={activity.platform} />}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">ไม่มีข้อมูล</p>
      )}
    </div>
  );
}
