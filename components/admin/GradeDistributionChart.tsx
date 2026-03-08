'use client';

import { useEffect, useState } from 'react';
import { calculateGrade } from '@/lib/utils/gradeCalculator';

interface GradeData {
  grade: string;
  count: number;
  color: string;
}

interface GradeDistributionChartProps {
  title: string;
  data: GradeData[];
  loading?: boolean;
}

export function GradeDistributionChart({ title, data, loading = false }: GradeDistributionChartProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{title}</h3>
        {/* Grade Legend */}
        <div className="flex justify-center items-center gap-4 mb-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>90-100 คะแนน</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>70-89 คะแนน</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>50-69 คะแนน</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>0-49 คะแนน</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{title}</h3>
      
      {/* Grade Legend */}
      <div className="flex justify-center items-center gap-4 mb-6 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>90-100 คะแนน</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>70-89 คะแนน</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>50-69 คะแนน</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>0-49 คะแนน</span>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="relative h-64 flex items-end justify-center gap-6 px-4">
        {data.map((item) => (
          <div key={item.grade} className="flex flex-col items-center">
            {/* Bar or Zero Label */}
            <div className="relative flex flex-col justify-end h-48">
              {item.count > 0 ? (
                // Show bar for non-zero values
                <div
                  className={`w-16 rounded-t-lg transition-all duration-700 ease-out ${item.color} shadow-lg`}
                  style={{
                    height: `${(item.count / maxCount) * 100}%`,
                    minHeight: '12px'
                  }}
                >
                  {/* Count Label on top of bar */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <span className="text-lg font-bold text-gray-800 bg-white px-2 py-1 rounded-lg shadow-md border">
                      {item.count}
                    </span>
                  </div>
                </div>
              ) : (
                // Show number at the same level as other numbers (top of chart area)
                <div className="w-16 h-48 relative">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <span className="text-lg font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg border border-gray-300">
                      0
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Grade Label */}
            <div className="mt-3 text-center">
              <span className="text-xl font-bold text-gray-800">{item.grade}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>รวมทั้งหมด</span>
          <span className="font-semibold">{data.reduce((sum, item) => sum + item.count, 0)} โรงเรียน</span>
        </div>
      </div>
    </div>
  );
}

export function useGradeDistribution() {
  const [register100Grades, setRegister100Grades] = useState<GradeData[]>([]);
  const [registerSupportGrades, setRegisterSupportGrades] = useState<GradeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGradeDistribution();
  }, []);

  const fetchGradeDistribution = async () => {
    try {
      // Fetch Register 100 data
      const res100 = await fetch('/api/register100/list');
      const data100 = await res100.json();
      
      // Fetch Register Support data
      const resSupport = await fetch('/api/register-support/list');
      const dataSupport = await resSupport.json();
      
      // Process Register 100 grades
      const register100Data = data100.success ? data100.submissions : [];
      const register100GradeCounts = processGradeData(register100Data);
      setRegister100Grades(register100GradeCounts);
      
      // Process Register Support grades
      const registerSupportData = dataSupport.success ? dataSupport.submissions : [];
      const registerSupportGradeCounts = processGradeData(registerSupportData);
      setRegisterSupportGrades(registerSupportGradeCounts);
      
    } catch (error) {
      console.error('Error fetching grade distribution:', error);
    } finally {
      setLoading(false);
    }
  };

  const processGradeData = (submissions: any[]): GradeData[] => {
    const gradeCounts = { A: 0, B: 0, C: 0, F: 0 };
    
    submissions.forEach(submission => {
      const score = submission.total_score || 0;
      
      // New grade ranges based on score ranges
      if (score >= 90) gradeCounts.A++;        // 90-100 คะแนน
      else if (score >= 70) gradeCounts.B++;   // 70-89 คะแนน  
      else if (score >= 50) gradeCounts.C++;   // 50-69 คะแนน
      else gradeCounts.F++;                    // 0-49 คะแนน
    });

    return [
      { grade: 'A', count: gradeCounts.A, color: 'bg-green-500' },
      { grade: 'B', count: gradeCounts.B, color: 'bg-blue-500' },
      { grade: 'C', count: gradeCounts.C, color: 'bg-orange-500' },
      { grade: 'F', count: gradeCounts.F, color: 'bg-red-500' },
    ];
  };

  return {
    register100Grades,
    registerSupportGrades,
    loading
  };
}