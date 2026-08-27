'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteSchoolButton from './DeleteSchoolButton';
import { calculateGrade, calculateGradeRegister100, getGradeNameThai } from '@/lib/utils/gradeCalculator';
import PDFProgressModal from './PDFProgressModal';

interface SchoolsDataTableProps {
  type: 'register100' | 'register-support';
  searchQuery?: string;
}

export default function SchoolsDataTable({
  type,
  searchQuery,
}: SchoolsDataTableProps) {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [isFullDataLoaded, setIsFullDataLoaded] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [showPDFProgress, setShowPDFProgress] = useState(false);
  const [pdfMode, setPdfMode] = useState<'short' | 'full'>('short');

  // Helper function to calculate total score including video scores
  const calculateTotalScore = (school: any) => {
    // For register100, calculate Part 1 score from individual components
    if (type === 'register100') {
      const part1Score = 
        (school.teaching_curriculum_score || 0) +
        (school.teacher_qualification_score || 0) +
        (school.support_from_org_score || 0) +
        (school.support_from_external_score || 0) +
        (school.award_score || 0) +
        (school.activity_within_province_internal_score || 0) +
        (school.activity_within_province_external_score || 0) +
        (school.activity_outside_province_score || 0) +
        (school.pr_activity_score || 0);
      const video1Score = school.video1_score || 0;
      const video2Score = school.video2_score || 0;
      return part1Score + video1Score + video2Score;
    } else {
      // For register-support, calculate Part 1 from individual components (same as register100)
      // so the score always matches the detail view regardless of stale total_score in DB
      const part1Score =
        (school.teacher_qualification_score || 0) +
        (school.support_from_org_score || 0) +
        (school.support_from_external_score || 0) +
        (school.award_score || 0) +
        (school.activity_within_province_internal_score || 0) +
        (school.activity_within_province_external_score || 0) +
        (school.activity_outside_province_score || 0) +
        (school.pr_activity_score || 0);
      const video1Score = school.video1_score || 0;
      const video2Score = school.video2_score || 0;
      return part1Score + video1Score + video2Score;
    }
  };

  useEffect(() => {
    // Reset full data loaded state when changing type
    setIsFullDataLoaded(false);
    fetchSchools();
  }, [type, searchQuery]);

  const fetchSchools = async (loadAll = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = type === 'register100' ? '/api/register100/list' : '/api/register-support/list';
      
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add filters to query (server-side filtering)
      if (provinceFilter) params.set('province', provinceFilter);
      if (levelFilter) params.set('level', levelFilter);
      if (searchTerm) params.set('search', searchTerm);
      
      // Grade filter must be done client-side because it requires score calculation
      // Only add loadAll or pagination params
      if (loadAll || gradeFilter) {
        params.set('loadAll', 'true');
      } else {
        params.set('page', '1');
        params.set('limit', '10');
      }
      
      const url = `${endpoint}?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSchools(data.submissions || []);
        setTotalCount(data.total || data.submissions?.length || 0);
        if (loadAll || gradeFilter) {
          setIsFullDataLoaded(true);
        }
      } else {
        throw new Error(data.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  // Load full data when user interacts with filters or pagination
  useEffect(() => {
    // Refetch when filters change
    // Always load all data when there are filters (search, province, level, grade)
    // This ensures search can find results across all pages
    if (searchTerm || provinceFilter || levelFilter || gradeFilter) {
      fetchSchools(true); // ✅ Load all data for filtering
    }
  }, [searchTerm, provinceFilter, levelFilter, gradeFilter]);

  // Handle pagination separately
  useEffect(() => {
    if (currentPage > 1 && !isFullDataLoaded) {
      fetchSchools(true);
    }
  }, [currentPage]);

  // Load full data when changing items per page (if not already loaded and no filters)
  useEffect(() => {
    if (!isFullDataLoaded && itemsPerPage !== 10 && !searchTerm && !provinceFilter && !levelFilter && !gradeFilter) {
      fetchSchools(true);
    }
  }, [itemsPerPage]);

  // Get unique values for filters
  const uniqueProvinces = [...new Set(schools.map(school => 
    school.reg100_schoolProvince || school.regsup_schoolProvince || ''
  ).filter(Boolean))].sort();

  const uniqueLevels = [...new Set(schools.map(school => 
    school.reg100_schoolLevel || school.regsup_schoolLevel || ''
  ).filter(Boolean))].sort();

  const uniqueGrades = ['A', 'B', 'C', 'D', 'F'];

  // Filter schools based on all criteria
  const filteredSchools = schools.filter(school => {
    // Search term filter
    if (searchTerm) {
      const schoolName = school.reg100_schoolName || school.regsup_schoolName || '';
      const province = school.reg100_schoolProvince || school.regsup_schoolProvince || '';
      const schoolId = school.schoolId || '';
      
      // Normalize search term and schoolId by removing hyphens for comparison
      const normalizedSearchTerm = searchTerm.replace(/-/g, '').toLowerCase();
      const normalizedSchoolId = schoolId.replace(/-/g, '').toLowerCase();
      
      // Check if search matches:
      // 1. School name (case-insensitive)
      // 2. Province (case-insensitive)
      // 3. School ID with hyphens (e.g., "SCH-20260612-0817")
      // 4. School ID without hyphens (normalized - e.g., "SCH202606120817")
      const searchMatch = schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         province.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schoolId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         normalizedSchoolId.includes(normalizedSearchTerm);
      if (!searchMatch) return false;
    }

    // Province filter
    if (provinceFilter) {
      const schoolProvince = school.reg100_schoolProvince || school.regsup_schoolProvince || '';
      if (schoolProvince !== provinceFilter) return false;
    }

    // Level filter
    if (levelFilter) {
      const schoolLevel = school.reg100_schoolLevel || school.regsup_schoolLevel || '';
      if (schoolLevel !== levelFilter) return false;
    }

    // Grade filter
    if (gradeFilter) {
      const totalScore = calculateTotalScore(school);
      // Use different grade calculation based on type
      const grade = type === 'register100' 
        ? calculateGradeRegister100(totalScore)
        : calculateGrade(totalScore, 180);
      if (grade !== gradeFilter) return false;
    }

    return true;
  });

  // Pagination calculations
  // Always use totalCount for total items (original count before filtering)
  // Use filteredSchools.length for filtered count
  const totalItems = totalCount;  // Always show original total count
  const filteredCount = filteredSchools.length;  // Actual filtered results
  const hasActiveFilter = searchTerm || provinceFilter || levelFilter || gradeFilter;
  const totalPages = Math.ceil(filteredCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchools = filteredSchools.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, provinceFilter, levelFilter, gradeFilter]);

  const handleDeleteSuccess = () => {
    fetchSchools(); // Refresh data after successful delete
  };

  const handleDownloadAllPDF = async () => {
    if (schools.length === 0) {
      alert('ไม่มีข้อมูลสำหรับดาวน์โหลด');
      return;
    }

    const confirmed = confirm(`คุณต้องการดาวน์โหลด PDF ของโรงเรียนทั้งหมด (${schools.length} โรงเรียน) เป็น ZIP ไฟล์ใช่หรือไม่?\n\nการดาวน์โหลดจะแสดง progress bar`);
    
    if (!confirmed) return;

    // Set mode to short and open progress modal
    setPdfMode('short');
    setShowPDFProgress(true);
  };

  const handleDownloadFullPDF = async () => {
    if (schools.length === 0) {
      alert('ไม่มีข้อมูลสำหรับดาวน์โหลด');
      return;
    }

    const confirmed = confirm(`คุณต้องการดาวน์โหลด PDF แบบเต็มรูปแบบ (Full Version) ของโรงเรียนทั้งหมด (${schools.length} โรงเรียน) เป็น ZIP ไฟล์ใช่หรือไม่?\n\nแต่ละโรงเรียนจะมีประมาณ 20 หน้า\nการดาวน์โหลดจะแสดง progress bar`);
    
    if (!confirmed) return;

    // Set mode to full and open progress modal
    setPdfMode('full');
    setShowPDFProgress(true);
  };

  const handleDownloadSchoolPDF = async (schoolId: string, schoolMongoId: string) => {
    if (!schoolMongoId) {
      alert('ไม่พบข้อมูลโรงเรียน');
      return;
    }

    try {
      // เปิดหน้า HTML สำหรับ print ใน tab ใหม่ (Full Version ~20 หน้า)
      const apiEndpoint = type === 'register100' 
        ? `/api/register100/${schoolMongoId}/export/pdf`
        : `/api/register-support/${schoolMongoId}/export/pdf`;
      
      const response = await fetch(apiEndpoint);
      if (response.ok) {
        const htmlContent = await response.text();
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          
          // รอให้ content โหลดเสร็จแล้วเปิด print dialog
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
            }, 500);
          };
        }
      } else {
        alert('เกิดข้อผิดพลาดในการสร้าง PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    }
  };

  const handleDownloadSchoolPagePDF = async (schoolId: string, schoolMongoId: string) => {
    if (!schoolId) {
      alert('ไม่พบ School ID');
      return;
    }

    try {
      // เปิดหน้า HTML สำหรับ print ใน tab ใหม่ (School Page - short version 1 หน้า)
      const response = await fetch(`/api/school/${schoolId}/pdf`);
      if (response.ok) {
        const htmlContent = await response.text();
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          
          // รอให้ content โหลดเสร็จแล้วเปิด print dialog
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

  const handleExportExcel = async () => {
    if (filteredSchools.length === 0) {
      alert('ไม่มีข้อมูลสำหรับ Export');
      return;
    }

    try {
      console.log('🔄 Starting Excel export...');
      
      // Create Excel data with all scores in horizontal columns
      const excelData = filteredSchools.map((school, index) => {
        const totalScore = calculateTotalScore(school);
        const grade = type === 'register100'
          ? calculateGradeRegister100(totalScore)
          : calculateGrade(totalScore, 180);
        
        const baseData = {
          'ลำดับ': index + 1,
          'วันที่บันทึก': school.createdAt 
            ? new Date(school.createdAt).toLocaleDateString('th-TH', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '-',
          'ชื่อโรงเรียน': school.reg100_schoolName || school.regsup_schoolName || '-',
          'จังหวัด': school.reg100_schoolProvince || school.regsup_schoolProvince || '-',
          'ระดับการศึกษา': school.reg100_schoolLevel || school.regsup_schoolLevel || 'ไม่ระบุ',
          'เกณฑ์': getGradeNameThai(grade),
          'School ID': school.schoolId || '-',
          'อีเมลครู': school.teacherEmail || '-',
          'เบอร์โทรศัพท์': school.teacherPhone || '-',
        };

        // Add score columns based on type
        if (type === 'register100') {
          return {
            ...baseData,
            'Step 5: นโยบาย (20)': school.teaching_curriculum_score || 0,
            'Step 4: คุณวุฒิครู (20)': school.teacher_qualification_score || 0,
            'Step 6: สนับสนุนต้นสังกัด (5)': school.support_from_org_score || 0,
            'Step 6: สนับสนุนภายนอก (15)': school.support_from_external_score || 0,
            'Step 7: รางวัล (20)': school.award_score || 0,
            'Step 8: กิจกรรมภายใน (5)': school.activity_within_province_internal_score || 0,
            'Step 8: กิจกรรมภายนอก (5)': school.activity_within_province_external_score || 0,
            'Step 8: กิจกรรมนอกจังหวัด (5)': school.activity_outside_province_score || 0,
            'Step 9: ประชาสัมพันธ์ (5)': school.pr_activity_score || 0,
            'รวมส่วนที่ 1 (100)': (school.teaching_curriculum_score || 0) + 
                                  (school.teacher_qualification_score || 0) + 
                                  (school.support_from_org_score || 0) + 
                                  (school.support_from_external_score || 0) + 
                                  (school.award_score || 0) + 
                                  (school.activity_within_province_internal_score || 0) + 
                                  (school.activity_within_province_external_score || 0) + 
                                  (school.activity_outside_province_score || 0) + 
                                  (school.pr_activity_score || 0),
            'วิดีโอ 1 (50)': school.video1_score || 0,
            'วิดีโอ 2 (50)': school.video2_score || 0,
            'รวมส่วนที่ 2 (100)': (school.video1_score || 0) + (school.video2_score || 0),
            'คะแนนรวมทั้งหมด (200)': totalScore,
          };
        } else {
          // register-support
          return {
            ...baseData,
            'Step 4: คุณวุฒิครู (20)': school.teacher_qualification_score || 0,
            'Step 6: สนับสนุนต้นสังกัด (5)': school.support_from_org_score || 0,
            'Step 6: สนับสนุนภายนอก (15)': school.support_from_external_score || 0,
            'Step 7: รางวัล (20)': school.award_score || 0,
            'Step 8: กิจกรรมภายใน (5)': school.activity_within_province_internal_score || 0,
            'Step 8: กิจกรรมภายนอก (5)': school.activity_within_province_external_score || 0,
            'Step 8: กิจกรรมนอกจังหวัด (5)': school.activity_outside_province_score || 0,
            'Step 9: ประชาสัมพันธ์ (5)': school.pr_activity_score || 0,
            'รวมส่วนที่ 1 (80)': (school.teacher_qualification_score || 0) + 
                                  (school.support_from_org_score || 0) + 
                                  (school.support_from_external_score || 0) + 
                                  (school.award_score || 0) + 
                                  (school.activity_within_province_internal_score || 0) + 
                                  (school.activity_within_province_external_score || 0) + 
                                  (school.activity_outside_province_score || 0) + 
                                  (school.pr_activity_score || 0),
            'วิดีโอ 1 (50)': school.video1_score || 0,
            'วิดีโอ 2 (50)': school.video2_score || 0,
            'รวมส่วนที่ 2 (100)': (school.video1_score || 0) + (school.video2_score || 0),
            'คะแนนรวมทั้งหมด (180)': totalScore,
          };
        }
      });

      // Convert to CSV format
      const headers = Object.keys(excelData[0]);
      const csvContent = [
        headers.join(','),
        ...excelData.map(row => 
          headers.map(header => {
            const value = (row as any)[header];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      const fileName = `${type === 'register100' ? 'Register100' : 'RegisterSupport'}_Export_${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Excel export completed:', fileName);
    } catch (error) {
      console.error('❌ Excel export failed:', error);
      alert('เกิดข้อผิดพลาดในการ Export');
    }
  };

  const basePath = type === 'register100' ? 'register100' : 'register-support';

  // Function to get grade styling for display
  const getGradeStyle = (score: number) => {
    const grade = type === 'register100'
      ? calculateGradeRegister100(score)
      : calculateGrade(score, 180);
    const gradeName = getGradeNameThai(grade);
    switch (grade) {
      case 'A':
        return { grade: gradeName, color: 'bg-green-100 text-green-800' };
      case 'B':
        return { grade: gradeName, color: 'bg-blue-100 text-blue-800' };
      case 'C':
        return { grade: gradeName, color: 'bg-orange-100 text-orange-800' };
      case 'D':
        return { grade: gradeName, color: 'bg-yellow-100 text-yellow-800' };
      case 'F':
        return { grade: gradeName, color: 'bg-red-100 text-red-800' };
      default:
        return { grade: gradeName, color: 'bg-red-100 text-red-800' };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>รายการโรงเรียน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>รายการโรงเรียน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-500 mb-2">เกิดข้อผิดพลาด: {error}</p>
              <button 
                onClick={() => fetchSchools(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                ลองใหม่
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle>
              รายการโรงเรียน 
              {hasActiveFilter 
                ? ` (แสดง ${filteredCount} จาก ${totalItems} รายการ)`
                : ` (${totalItems})`
              }
            </CardTitle>
            <div className="flex gap-2">
              {/* All School Page (ZIP) - HIDDEN: No longer needed */}
              {/* 
              <button 
                onClick={handleDownloadAllPDF}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                All School Page (ZIP)
              </button>
              */}
              {/* Full School Page (ZIP) - HIDDEN: Too resource intensive, can cause server crash */}
              {/* 
              <button 
                onClick={handleDownloadFullPDF}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                Full School Page (ZIP)
              </button>
              */}
              <button 
                onClick={handleExportExcel}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </button>
            </div>
          </div>
          
          {/* Grade Legend - New Row */}
          <div className="flex items-center gap-4 flex-wrap">
            {type === 'register100' ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-sm text-gray-600">ระดับดีเด่น: 160 ขึ้นไป</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-sm text-gray-600">ระดับดีมาก: 140-159 คะแนน</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
                  <span className="text-sm text-gray-600">ระดับดี: 120-139 คะแนน</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm text-gray-600">ระดับชมเชย: 100-119 คะแนน</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-sm text-gray-600">ต่ำกว่าเกณฑ์: 0-99 คะแนน</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-sm text-gray-600">ระดับดีเด่น: 144 ขึ้นไป</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-sm text-gray-600">ระดับดีมาก: 126-143 คะแนน</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
                  <span className="text-sm text-gray-600">ระดับดี: 108-125 คะแนน</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm text-gray-600">ระดับชมเชย: 90-107 คะแนน</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-sm text-gray-600">ต่ำกว่าเกณฑ์: 0-89 คะแนน</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <Input
            type="search"
            placeholder="ค้นหาโรงเรียน, รหัสโรงเรียน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select 
            value={provinceFilter} 
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">ทุกจังหวัด</option>
            {uniqueProvinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          <select 
            value={levelFilter} 
            onChange={(e) => setLevelFilter(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">ทุกระดับ</option>
            {uniqueLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          <select 
            value={gradeFilter} 
            onChange={(e) => setGradeFilter(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">ทุกเกณฑ์</option>
            {uniqueGrades.map((grade) => (
              <option key={grade} value={grade}>
                {getGradeNameThai(grade)}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  #
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  วันที่บันทึก
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  ชื่อโรงเรียน
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  จังหวัด
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  ระดับการศึกษา
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  คะแนนรวม
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  เกณฑ์
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody>
              {currentSchools.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <p className="text-lg">ไม่พบข้อมูล</p>
                      <p className="text-sm">
                        {searchTerm || provinceFilter || levelFilter || gradeFilter 
                          ? 'ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา' 
                          : 'ยังไม่มีโรงเรียนลงทะเบียน'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentSchools.map((school: any, index: number) => {
                  const totalScore = calculateTotalScore(school);
                  const gradeInfo = getGradeStyle(totalScore);
                  const globalIndex = startIndex + index + 1;
                  
                  return (
                    <tr
                      key={school._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-center text-sm text-gray-900">
                        {globalIndex}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        <div>
                          {school.createdAt
                            ? new Date(school.createdAt).toLocaleDateString('th-TH', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {school.createdAt
                            ? new Date(school.createdAt).toLocaleTimeString('th-TH', {
                                hour: '2-digit',
                                minute: '2-digit',
                              }) + ' น.'
                            : ''}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium text-gray-900">
                          {school.reg100_schoolName || school.regsup_schoolName || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {school.schoolId || ''}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {school.reg100_schoolProvince || school.regsup_schoolProvince || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {school.reg100_schoolLevel || school.regsup_schoolLevel || 'ไม่ระบุ'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${gradeInfo.color}`}>
                          {totalScore} คะแนน
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-2 rounded-full text-sm font-bold ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/dcp-admin/dashboard/${basePath}/${school._id}`}>
                            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md">
                              View
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDownloadSchoolPDF(school.schoolId, school._id)}
                            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md flex items-center gap-1"
                            title="ดาวน์โหลด PDF ข้อมูลเต็ม (Full Version ~20 หน้า)"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            PDF
                          </button>
                          <button
                            onClick={() => handleDownloadSchoolPagePDF(school.schoolId, school._id)}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all shadow-md flex items-center gap-1"
                            title="ดาวน์โหลด School Page PDF (Short Version 1 หน้า)"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            PDF2
                          </button>
                          <Link href={`/dcp-admin/dashboard/${basePath}/${school._id}?mode=edit`}>
                            <button className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-md">
                              Edit
                            </button>
                          </Link>
                          <DeleteSchoolButton
                            schoolId={school._id}
                            schoolName={school.reg100_schoolName || school.regsup_schoolName || 'ไม่ระบุชื่อ'}
                            type={type}
                            onDeleteSuccess={handleDeleteSuccess}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Controls and Pagination */}
        <div className="mt-6 space-y-4">
          {/* Items per page selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">แสดง</span>
              <select 
                value={itemsPerPage.toString()} 
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-20 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              แสดง {startIndex + 1}-{Math.min(endIndex, totalItems)} จาก {totalItems} รายการ
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  หน้าแรก
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  หน้าสุดท้าย
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* PDF Progress Modal */}
      <PDFProgressModal
        isOpen={showPDFProgress}
        onClose={() => setShowPDFProgress(false)}
        type={type}
        mode={pdfMode}
      />
    </Card>
  );
}