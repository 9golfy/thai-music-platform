'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Pencil, Trash2, Download } from 'lucide-react';
import DeleteSchoolButton from './DeleteSchoolButton';
import { calculateGrade, getGradeColor, getGradeBgColor } from '@/lib/utils/gradeCalculator';

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

  const basePath = type === 'register100' ? 'register100' : 'register-support';

  // Function to get grade styling for display
  const getGradeStyle = (score: number) => {
    const grade = calculateGrade(score);
    switch (grade) {
      case 'A':
        return { grade: 'A', color: 'bg-green-100 text-green-800' };
      case 'B':
        return { grade: 'B', color: 'bg-blue-100 text-blue-800' };
      case 'C':
        return { grade: 'C', color: 'bg-orange-100 text-orange-800' };
      case 'F':
        return { grade: 'F', color: 'bg-red-100 text-red-800' };
      default:
        return { grade: 'F', color: 'bg-red-100 text-red-800' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>รายการโรงเรียน ({schools.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              type="search"
              placeholder="ค้นหาโรงเรียน..."
              className="w-64"
            />
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-md">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
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
                  Grade
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody>
              {schools.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <p className="text-lg">ไม่พบข้อมูล</p>
                      <p className="text-sm">ยังไม่มีโรงเรียนลงทะเบียน</p>
                    </div>
                  </td>
                </tr>
              ) : (
                schools.map((school: any, index: number) => {
                  const totalScore = school.total_score || 0;
                  const gradeInfo = getGradeStyle(totalScore);
                  return (
                    <tr
                      key={school._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-center text-sm text-gray-900">
                        {index + 1}
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
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold ${gradeInfo.color}`}>
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

        {schools.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-gray-600">
              แสดง {schools.length} รายการ จากทั้งหมด {schools.length} รายการ
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-gray-600">90-100 คะแนน</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-gray-600">70-89 คะแนน</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="text-gray-600">50-69 คะแนน</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-gray-600">0-49 คะแนน</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
