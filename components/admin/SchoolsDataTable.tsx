'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteSchoolButton from './DeleteSchoolButton';
import { calculateGrade, calculateGradeRegister100, getGradeNameThai } from '@/lib/utils/gradeCalculator';

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
      // For register-support, use total_score
      const part1Score = school.total_score || 0;
      const video1Score = school.video1_score || 0;
      const video2Score = school.video2_score || 0;
      return part1Score + video1Score + video2Score;
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [type, searchQuery]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = type === 'register100' ? '/api/register100/list' : '/api/register-support/list';
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSchools(data.submissions || []);
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
      
      const searchMatch = schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         province.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  const totalItems = filteredSchools.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
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

  const handleExportExcel = async () => {
    try {
      console.log('🔄 Starting Excel export...');
      
      // Create Excel data from current filtered schools
      const excelData = filteredSchools.map((school, index) => {
        const totalScore = calculateTotalScore(school);
        const grade = type === 'register100'
          ? calculateGradeRegister100(totalScore)
          : calculateGrade(totalScore, 180);
        
        return {
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
          'คะแนนรวม': totalScore,
          'เกณฑ์': getGradeNameThai(grade),
          'School ID': school.schoolId || '-',
          'อีเมลครู': school.teacherEmail || '-',
          'เบอร์โทรศัพท์': school.teacherPhone || '-'
        };
      });

      if (excelData.length === 0) {
        alert('ไม่มีข้อมูลสำหรับ Export');
        return;
      }

      // Convert to CSV format (simple Excel export)
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
      console.error('❌ Export failed:', error);
      alert('เกิดข้อผิดพลาดในการ Export ข้อมูล');
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
                onClick={fetchSchools}
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
            <CardTitle>รายการโรงเรียน ({totalItems})</CardTitle>
            <button 
              onClick={handleExportExcel}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
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
    </Card>
  );
}