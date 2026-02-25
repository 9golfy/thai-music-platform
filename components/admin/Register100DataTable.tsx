'use client';

import { useEffect, useState } from 'react';

interface Submission {
  _id: string;
  schoolName: string;
  schoolProvince: string;
  schoolLevel: string;
  mgtFullName: string;
  mgtPhone: string;
  total_score: number;
  teacher_training_score: number;
  teacher_qualification_score: number;
  support_from_org_score: number;
  support_from_external_score: number;
  award_score: number;
  activity_within_province_internal_score: number;
  activity_within_province_external_score: number;
  activity_outside_province_score: number;
  pr_activity_score: number;
  createdAt?: string;
}

export default function Register100DataTable() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSubmission, setDeletingSubmission] = useState<Submission | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/register100/list');
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(sub =>
    sub.schoolName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.schoolProvince?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.mgtFullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatThaiDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      
      // Format date in Thai locale
      const thaiDate = date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Bangkok'
      });
      
      // Format time in Thai locale
      const thaiTime = date.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Bangkok'
      });
      
      return (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{thaiDate}</div>
          <div className="text-xs text-gray-500">{thaiTime} น.</div>
        </div>
      );
    } catch (error) {
      return '-';
    }
  };

  const handleViewDetail = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (submission: Submission) => {
    setDeletingSubmission(submission);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSubmission) return;

    try {
      const response = await fetch(`/api/register100/${deletingSubmission._id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        // Remove from list
        setSubmissions(submissions.filter(s => s._id !== deletingSubmission._id));
        setShowDeleteModal(false);
        setDeletingSubmission(null);
        
        // Show success modal
        setSuccessMessage(`ลบข้อมูลของ "${deletingSubmission.schoolName}" สำเร็จ`);
        setShowSuccessModal(true);
        
        // Auto close after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      console.error('Error deleting submission:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Header with Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                รายการทั้งหมด ({filteredSubmissions.length})
              </h2>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="ค้นหาโรงเรียน, จังหวัด, ผู้บริหาร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B050] w-80"
              />
              <button
                onClick={fetchSubmissions}
                className="px-4 py-2 bg-[#00B050] text-white rounded-lg hover:bg-[#009040] transition-colors"
              >
                รีเฟรช
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่บันทึก
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อโรงเรียน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จังหวัด
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ระดับ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ผู้บริหาร
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  คะแนนรวม
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission, index) => (
                  <tr key={submission._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatThaiDateTime(submission.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{submission.schoolName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {submission.schoolProvince}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {submission.schoolLevel}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{submission.mgtFullName}</div>
                      <div className="text-xs text-gray-400">{submission.mgtPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getScoreBadgeColor(submission.total_score)}`}>
                        {submission.total_score} คะแนน
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`/dashboard/register100/${submission._id}`}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                          title="ดูรายละเอียด"
                        >
                          View
                        </a>
                        <a
                          href={`/dashboard/register100/${submission._id}?mode=edit`}
                          className="px-3 py-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors font-medium"
                          title="แก้ไข"
                        >
                          Edit
                        </a>
                        <button
                          onClick={() => handleDeleteClick(submission)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
                          title="ลบ"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              แสดง {filteredSubmissions.length} รายการ จากทั้งหมด {submissions.length} รายการ
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span>90-100 คะแนน</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span>70-89 คะแนน</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span>50-69 คะแนน</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span>0-49 คะแนน</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                รายละเอียดการลงทะเบียน
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">ข้อมูลพื้นฐาน</h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-600">ชื่อโรงเรียน:</span>
                    <p className="font-medium">{selectedSubmission.schoolName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">จังหวัด:</span>
                    <p className="font-medium">{selectedSubmission.schoolProvince}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">ระดับ:</span>
                    <p className="font-medium">{selectedSubmission.schoolLevel}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">ผู้บริหาร:</span>
                    <p className="font-medium">{selectedSubmission.mgtFullName}</p>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">รายละเอียดคะแนน</h4>
                <div className="space-y-2">
                  <ScoreRow label="การฝึกอบรมครู" score={selectedSubmission.teacher_training_score} max={20} />
                  <ScoreRow label="คุณสมบัติครู" score={selectedSubmission.teacher_qualification_score} max={20} />
                  <ScoreRow label="การสนับสนุนจากองค์กร" score={selectedSubmission.support_from_org_score} max={5} />
                  <ScoreRow label="การสนับสนุนจากภายนอก" score={selectedSubmission.support_from_external_score} max={15} />
                  <ScoreRow label="รางวัล" score={selectedSubmission.award_score} max={20} />
                  <ScoreRow label="กิจกรรมภายในจังหวัด (ภายใน)" score={selectedSubmission.activity_within_province_internal_score} max={5} />
                  <ScoreRow label="กิจกรรมภายในจังหวัด (ภายนอก)" score={selectedSubmission.activity_within_province_external_score} max={5} />
                  <ScoreRow label="กิจกรรมนอกจังหวัด" score={selectedSubmission.activity_outside_province_score} max={5} />
                  <ScoreRow label="กิจกรรมประชาสัมพันธ์" score={selectedSubmission.pr_activity_score} max={5} />
                  
                  <div className="border-t-2 border-gray-300 pt-2 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">คะแนนรวม</span>
                      <span className={`text-2xl font-bold px-4 py-2 rounded-lg ${getScoreBadgeColor(selectedSubmission.total_score)}`}>
                        {selectedSubmission.total_score} / 100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">ยืนยันการลบ</h3>
            <p className="text-gray-600 text-center mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ
              <br />
              <strong className="text-gray-900">{deletingSubmission.schoolName}</strong>
              <br />
              <span className="text-red-600 text-sm">การดำเนินการนี้ไม่สามารถย้อนกลับได้</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingSubmission(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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
    </>
  );
}

function ScoreRow({ label, score, max }: { label: string; score: number; max: number }) {
  const percentage = (score / max) * 100;
  
  return (
    <div className="flex items-center gap-4">
      <div className="w-64 text-sm text-gray-700">{label}</div>
      <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
        <div
          className="bg-[#00B050] h-6 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
          {score} / {max}
        </span>
      </div>
    </div>
  );
}
