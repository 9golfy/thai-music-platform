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
  type: 'register100' | 'register-support'; // Add type to determine which legend to show
}

export function GradeDistributionChart({ title, data, loading = false, type }: GradeDistributionChartProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  // Define legends based on type
  const legends = type === 'register100' ? [
    { color: 'bg-green-500', label: 'ระดับดีเด่น: 160 ขึ้นไป' },
    { color: 'bg-blue-500', label: 'ระดับดีมาก: 140-159 คะแนน' },
    { color: 'bg-orange-500', label: 'ระดับดี: 120-139 คะแนน' },
    { color: 'bg-yellow-500', label: 'ระดับชมเชย: 100-119 คะแนน' },
    { color: 'bg-red-500', label: 'ต่ำกว่าเกณฑ์: 0-99 คะแนน' },
  ] : [
    { color: 'bg-green-500', label: 'ระดับดีเด่น: 144 ขึ้นไป' },
    { color: 'bg-blue-500', label: 'ระดับดีมาก: 126-143 คะแนน' },
    { color: 'bg-orange-500', label: 'ระดับดี: 108-125 คะแนน' },
    { color: 'bg-yellow-500', label: 'ระดับชมเชย: 90-107 คะแนน' },
    { color: 'bg-red-500', label: 'ต่ำกว่าเกณฑ์: 0-89 คะแนน' },
  ];
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{title}</h3>
        {/* Grade Legend */}
        <div className="flex justify-center items-center gap-4 mb-4 text-xs flex-wrap">
          {legends.map((legend, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className={`w-3 h-3 ${legend.color} rounded-full`}></div>
              <span>{legend.label}</span>
            </div>
          ))}
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
      <div className="flex justify-center items-center gap-4 mb-6 text-xs flex-wrap">
        {legends.map((legend, index) => (
          <div key={index} className="flex items-center gap-1">
            <div className={`w-3 h-3 ${legend.color} rounded-full`}></div>
            <span>{legend.label}</span>
          </div>
        ))}
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
      // Fetch Register 100 data - load all for grade distribution
      const res100 = await fetch('/api/register100/list?loadAll=true');
      const data100 = await res100.json();
      
      console.log('📊 Register100 API Response:', data100);
      
      // Fetch Register Support data - load all for grade distribution
      const resSupport = await fetch('/api/register-support/list?loadAll=true');
      const dataSupport = await resSupport.json();
      
      console.log('📊 Register-Support API Response:', dataSupport);
      
      // Process Register 100 grades
      const register100Data = data100.success ? data100.submissions : [];
      console.log('📝 Register100 Submissions Count:', register100Data.length);
      const register100GradeCounts = processGradeData(register100Data, 'register100');
      setRegister100Grades(register100GradeCounts);
      
      // Process Register Support grades
      const registerSupportData = dataSupport.success ? dataSupport.submissions : [];
      console.log('📝 Register-Support Submissions Count:', registerSupportData.length);
      const registerSupportGradeCounts = processGradeData(registerSupportData, 'register-support');
      setRegisterSupportGrades(registerSupportGradeCounts);
      
    } catch (error) {
      console.error('❌ Error fetching grade distribution:', error);
    } finally {
      setLoading(false);
    }
  };

  const processGradeData = (submissions: any[], type: 'register100' | 'register-support'): GradeData[] => {
    const gradeCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    console.log(`Processing ${type} grades for ${submissions.length} submissions`);
    
    submissions.forEach(submission => {
      // Calculate actual total score from all parts
      let score = 0;
      
      if (type === 'register100') {
        // Part 1 scores (max 100)
        const part1 = (submission.teaching_curriculum_score || 0) +
                      (submission.teacher_qualification_score || 0) +
                      (submission.support_from_org_score || 0) +
                      (submission.support_from_external_score || 0) +
                      (submission.award_score || 0) +
                      (submission.activity_within_province_internal_score || 0) +
                      (submission.activity_within_province_external_score || 0) +
                      (submission.activity_outside_province_score || 0) +
                      (submission.pr_activity_score || 0);
        
        // Part 2 scores (max 100)
        const part2 = (submission.video1_score || 0) + (submission.video2_score || 0);
        
        score = part1 + part2;
        
        console.log(`Register100 - School: ${submission.schoolId}, Part1: ${part1}, Part2: ${part2}, Total: ${score}, Grade: ${score >= 160 ? 'A' : score >= 140 ? 'B' : score >= 120 ? 'C' : score >= 100 ? 'D' : 'F'}`);
        
        // Grade calculation
        if (score >= 160) gradeCounts.A++;           // ระดับดีเด่น: 160 ขึ้นไป (80%+)
        else if (score >= 140) gradeCounts.B++;      // ระดับดีมาก: 140-159 คะแนน (70-79%)
        else if (score >= 120) gradeCounts.C++;      // ระดับดี: 120-139 คะแนน (60-69%)
        else if (score >= 100) gradeCounts.D++;      // ระดับชมเชย: 100-119 คะแนน (50-59%)
        else gradeCounts.F++;                        // ต่ำกว่าเกณฑ์: 0-99 คะแนน (<50%)
      } else {
        // Part 1 scores (max 80) - excluding teacher_training_score to match DataTable calculation
        const part1 = (submission.teacher_qualification_score || 0) +
                      (submission.support_from_org_score || 0) +
                      (submission.support_from_external_score || 0) +
                      (submission.award_score || 0) +
                      (submission.activity_within_province_internal_score || 0) +
                      (submission.activity_within_province_external_score || 0) +
                      (submission.activity_outside_province_score || 0) +
                      (submission.pr_activity_score || 0);
        
        // Part 2 scores (max 80)
        const part2 = (submission.video1_score || 0) + (submission.video2_score || 0);
        
        score = part1 + part2;
        
        console.log(`Register-Support - School: ${submission.schoolId}, Part1: ${part1}, Part2: ${part2}, Total: ${score}, Grade: ${score >= 144 ? 'A' : score >= 126 ? 'B' : score >= 108 ? 'C' : score >= 90 ? 'D' : 'F'}`);
        
        // Grade calculation (same criteria, max 160 instead of 180)
        if (score >= 144) gradeCounts.A++;           // ระดับดีเด่น: 144 ขึ้นไป (90%+ of 160)
        else if (score >= 126) gradeCounts.B++;      // ระดับดีมาก: 126-143 คะแนน (78-89%)
        else if (score >= 108) gradeCounts.C++;      // ระดับดี: 108-125 คะแนน (67-77%)
        else if (score >= 90) gradeCounts.D++;       // ระดับชมเชย: 90-107 คะแนน (56-66%)
        else gradeCounts.F++;                        // ต่ำกว่าเกณฑ์: 0-89 คะแนน (<56%)
      }
    });
    
    console.log(`Grade counts for ${type}:`, gradeCounts);

    return [
      { grade: 'A', count: gradeCounts.A, color: 'bg-green-500' },
      { grade: 'B', count: gradeCounts.B, color: 'bg-blue-500' },
      { grade: 'C', count: gradeCounts.C, color: 'bg-orange-500' },
      { grade: 'D', count: gradeCounts.D, color: 'bg-yellow-500' },
      { grade: 'F', count: gradeCounts.F, color: 'bg-red-500' },
    ];
  };

  return {
    register100Grades,
    registerSupportGrades,
    loading
  };
}