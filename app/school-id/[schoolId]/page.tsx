'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Register100DetailView from '@/components/admin/Register100DetailView';
import RegisterSupportDetailView from '@/components/admin/RegisterSupportDetailView';

export default function PublicSchoolPage() {
  const params = useParams();
  const schoolId = params?.schoolId as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [type, setType] = useState<'register100' | 'register-support' | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [schoolData, setSchoolData] = useState<any>(null);

  useEffect(() => {
    // Set current URL
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }

    const fetchSchoolData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/school/${schoolId}`);
        const data = await response.json();
        
        if (data.success) {
          setSubmissionId(data.submission._id);
          setType(data.type);
          setSchoolData(data.submission);
        } else {
          setError(data.message || 'ไม่พบข้อมูลโรงเรียน');
        }
      } catch (err) {
        console.error('Error fetching school:', err);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    if (schoolId) {
      fetchSchoolData();
    }
  }, [schoolId]);

  const handleDownloadPDF = async () => {
    try {
      if (!schoolId) return;
      
      // Use the new public PDF endpoint
      const response = await fetch(`/api/school/${schoolId}/pdf`);
      
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
        alert('เกิดข้อผิดพลาดในการดาวน์โหลด PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('เกิดข้อผิดพลาดในการดาวน์โหลด PDF');
    }
  };

  const copyUrlToClipboard = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        alert('คัดลอก URL แล้ว!');
      }).catch(() => {
        alert('ไม่สามารถคัดลอก URL ได้');
      });
    }
  };

  // Calculate grade from school data
  const calculateGrade = () => {
    if (!schoolData) return { grade: '-', gradeName: '-', color: 'gray' };
    
    // Calculate total score
    let totalScore = 0;
    
    if (type === 'register100') {
      totalScore = 
        (schoolData.teaching_curriculum_score || 0) +
        (schoolData.teacher_qualification_score || 0) +
        (schoolData.support_from_org_score || 0) +
        (schoolData.support_from_external_score || 0) +
        (schoolData.award_score || 0) +
        (schoolData.activity_within_province_internal_score || 0) +
        (schoolData.activity_within_province_external_score || 0) +
        (schoolData.activity_outside_province_score || 0) +
        (schoolData.pr_activity_score || 0) +
        (schoolData.video1_score || 0) +
        (schoolData.video2_score || 0);
      
      // Register100 grading (200 max)
      if (totalScore >= 160) return { grade: 'A', gradeName: 'ระดับดีเด่น', color: 'green' };
      else if (totalScore >= 140) return { grade: 'B', gradeName: 'ระดับดีมาก', color: 'blue' };
      else if (totalScore >= 120) return { grade: 'C', gradeName: 'ระดับดี', color: 'orange' };
      else if (totalScore >= 100) return { grade: 'D', gradeName: 'ระดับชมเชย', color: 'yellow' };
      else return { grade: 'F', gradeName: 'ต่ำกว่าเกณฑ์', color: 'red' };
    } else {
      // Register-Support
      totalScore = 
        (schoolData.teacher_qualification_score || 0) +
        (schoolData.support_from_org_score || 0) +
        (schoolData.support_from_external_score || 0) +
        (schoolData.award_score || 0) +
        (schoolData.activity_within_province_internal_score || 0) +
        (schoolData.activity_within_province_external_score || 0) +
        (schoolData.activity_outside_province_score || 0) +
        (schoolData.pr_activity_score || 0) +
        (schoolData.video1_score || 0) +
        (schoolData.video2_score || 0);
      
      // Register-Support grading (180 max)
      if (totalScore >= 144) return { grade: 'A', gradeName: 'ระดับดีเด่น', color: 'green' };
      else if (totalScore >= 126) return { grade: 'B', gradeName: 'ระดับดีมาก', color: 'blue' };
      else if (totalScore >= 108) return { grade: 'C', gradeName: 'ระดับดี', color: 'orange' };
      else if (totalScore >= 90) return { grade: 'D', gradeName: 'ระดับชมเชย', color: 'yellow' };
      else return { grade: 'F', gradeName: 'ต่ำกว่าเกณฑ์', color: 'red' };
    }
  };

  const gradeInfo = calculateGrade();
  
  const getGradeColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800 border-green-300';
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'red': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const schoolName = schoolData?.reg100_schoolName || schoolData?.regsup_schoolName || schoolData?.schoolName || 'ไม่พบชื่อโรงเรียน';
  const schoolProvince = schoolData?.reg100_schoolProvince || schoolData?.regsup_schoolProvince || schoolData?.schoolProvince || '';
  const schoolLevel = schoolData?.reg100_schoolLevel || schoolData?.regsup_schoolLevel || schoolData?.schoolLevel || '';


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error || !submissionId || !type) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบข้อมูลโรงเรียน</h1>
          <p className="text-gray-600 mb-4">{error || 'School ID ไม่ถูกต้อง'}</p>
          <p className="text-sm text-gray-500">School ID: {schoolId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 mb-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-center">
                {schoolName}
              </h1>
              <p className="text-center mt-2 text-blue-100">
                {schoolProvince} {schoolLevel && `• ${schoolLevel}`}
              </p>
              <p className="text-center mt-1 text-blue-200 text-sm">
                School ID: {schoolId}
              </p>
              
              {/* Grade Badge */}
              <div className="flex justify-center mt-4">
                <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-2xl font-bold border-4 ${getGradeColorClass(gradeInfo.color)} shadow-lg`}>
                  <span className="text-3xl">{gradeInfo.grade}</span>
                  <span className="text-xl">•</span>
                  <span className="text-2xl">{gradeInfo.gradeName}</span>
                </div>
              </div>
            </div>
            
            {/* Download PDF Link - Right side */}
            <div className="ml-4">
              <button
                onClick={handleDownloadPDF}
                className="text-white hover:text-blue-100 underline text-sm flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* School Detail Content */}
      <div className="container mx-auto px-4 pb-12">
        {type === 'register100' && (
          <Register100DetailView 
            id={submissionId} 
            hideScores={true} 
            readOnly={true} 
            hideDelete={true} 
          />
        )}
        
        {type === 'register-support' && (
          <RegisterSupportDetailView 
            id={submissionId} 
            hideScores={true} 
            readOnly={true} 
            hideDelete={true} 
          />
        )}
      </div>

      {/* Page URL Section */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 py-8 border-t-2 border-gray-300">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              URL ของหน้านี้
            </h3>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={currentUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 text-sm font-mono"
              />
              <button
                onClick={copyUrlToClipboard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                คัดลอก
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              คัดลอก URL นี้เพื่อแชร์ข้อมูลโรงเรียนให้ผู้อื่นได้
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            โครงการดนตรีไทย 100% - กระทรวงศึกษาธิการ
          </p>
        </div>
      </div>
    </div>
  );
}
