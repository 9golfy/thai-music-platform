'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GradeDistributionChart, useGradeDistribution } from '@/components/admin/GradeDistributionChart';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    register100: 0,
    registerSupport: 0,
    totalScore: 0,
    certificates: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Use grade distribution hook
  const { register100Grades, registerSupportGrades, loading: gradesLoading } = useGradeDistribution();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch Register 100
      const res100 = await fetch('/api/register100/list');
      const data100 = await res100.json();
      
      // Fetch Register Support
      const resSupport = await fetch('/api/register-support/list');
      const dataSupport = await resSupport.json();
      
      // Fetch Certificates
      const resCerts = await fetch('/api/certificates');
      const dataCerts = await resCerts.json();
      
      const count100 = data100.success ? data100.submissions.length : 0;
      const countSupport = dataSupport.success ? dataSupport.submissions.length : 0;
      const countCerts = dataCerts.success ? dataCerts.certificates.length : 0;
      
      // Calculate total score
      const totalScore = data100.success && data100.submissions.length > 0
        ? data100.submissions.reduce((sum: number, s: any) => sum + (s.total_score || 0), 0)
        : 0;

      setStats({
        register100: count100,
        registerSupport: countSupport,
        totalScore: totalScore,
        certificates: countCerts,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          ระบบบริหารจัดการข้อมูลกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Register 100 */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-4xl font-bold mb-2">
                {loading ? '...' : stats.register100}
              </div>
              <div className="text-white/90 text-sm">โรงเรียน</div>
              <div className="text-white/75 text-xs mt-1">โรงเรียนดนตรีไทย 100%</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Register Support */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-4xl font-bold mb-2">
                {loading ? '...' : stats.registerSupport}
              </div>
              <div className="text-white/90 text-sm">โรงเรียน</div>
              <div className="text-white/75 text-xs mt-1">โรงเรียนสนับสนุนฯ</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>

        {/* Total Score */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-4xl font-bold mb-2">
                {loading ? '...' : stats.totalScore}
              </div>
              <div className="text-white/90 text-sm">คะแนน</div>
              <div className="text-white/75 text-xs mt-1">รวมทั้งหมด</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-4xl font-bold mb-2">
                {loading ? '...' : stats.certificates}
              </div>
              <div className="text-white/90 text-sm">ใบประกาศ</div>
              <div className="text-white/75 text-xs mt-1">จำนวนทั้งหมด</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>

      {/* Grade Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GradeDistributionChart
          title="โรงเรียนดนตรีไทย 100%"
          data={register100Grades}
          loading={gradesLoading}
        />
        <GradeDistributionChart
          title="โรงเรียนสนับสนุนและส่งเสริม"
          data={registerSupportGrades}
          loading={gradesLoading}
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Register 100 Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <h3 className="text-lg font-semibold text-white">โรงเรียนดนตรีไทย 100%</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              จัดการข้อมูลโรงเรียนที่สมัครเข้าร่วมโครงการโรงเรียนดนตรีไทย 100%
            </p>
            <Link
              href="/dcp-admin/dashboard/register100"
              className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-md cursor-pointer"
            >
              ดูรายการทั้งหมด คลิกที่นี่
            </Link>
          </div>
        </div>

        {/* Register Support Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-semibold text-white">โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              จัดการข้อมูลโรงเรียนที่สนับสนุนและส่งเสริมดนตรีไทย
            </p>
            <Link
              href="/dcp-admin/dashboard/register-support"
              className="block w-full text-center px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium shadow-md cursor-pointer"
            >
              ดูรายการทั้งหมด คลิกที่นี่
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
