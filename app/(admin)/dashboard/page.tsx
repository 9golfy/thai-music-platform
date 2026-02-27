'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    register100: 0,
    registerSupport: 0,
    totalSchools: 0,
    avgScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res100 = await fetch('/api/register100/list');
      const data100 = await res100.json();
      
      const resSupport = await fetch('/api/register-support/list');
      const dataSupport = await resSupport.json();
      
      const count100 = data100.success ? data100.submissions.length : 0;
      const countSupport = dataSupport.success ? dataSupport.submissions.length : 0;
      
      const avgScore = data100.success && data100.submissions.length > 0
        ? Math.round(
            data100.submissions.reduce((sum: number, s: any) => sum + (s.total_score || 0), 0) /
            data100.submissions.length
          )
        : 0;

      setStats({
        register100: count100,
        registerSupport: countSupport,
        totalSchools: count100 + countSupport,
        avgScore: avgScore,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Register 100 */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-3xl font-bold">
                {loading ? '...' : stats.register100}
                <span className="text-lg font-normal ml-2">โรงเรียน</span>
              </div>
              <div className="text-white/75 text-sm mt-1">โรงเรียนดนตรีไทย 100%</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1">
            <div className="bg-white/50 h-1 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Register Support */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-3xl font-bold">
                {loading ? '...' : stats.registerSupport}
                <span className="text-lg font-normal ml-2">โรงเรียน</span>
              </div>
              <div className="text-white/75 text-sm mt-1">โรงเรียนสนับสนุนฯ</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1">
            <div className="bg-white/50 h-1 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>

        {/* Total Schools */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-3xl font-bold">
                {loading ? '...' : stats.totalSchools}
                <span className="text-lg font-normal ml-2">โรงเรียน</span>
              </div>
              <div className="text-white/75 text-sm mt-1">รวมทั้งหมด</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1">
            <div className="bg-white/50 h-1 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-3xl font-bold">
                {loading ? '...' : stats.avgScore}
                <span className="text-lg font-normal ml-2">คะแนน</span>
              </div>
              <div className="text-white/75 text-sm mt-1">คะแนนเฉลี่ย</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1">
            <div className="bg-white/50 h-1 rounded-full" style={{ width: `${stats.avgScore}%` }}></div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Register 100 Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-white">โรงเรียนดนตรีไทย 100%</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              จัดการข้อมูลโรงเรียนที่สมัครเข้าร่วมโครงการโรงเรียนดนตรีไทย 100%
            </p>
            <a
              href="/dashboard/register100"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ดูรายการทั้งหมด คลิกที่นี่
            </a>
          </div>
        </div>

        {/* Register Support Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
            <a
              href="/dashboard/register-support"
              className="block w-full text-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
            >
              ดูรายการทั้งหมด คลิกที่นี่
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
