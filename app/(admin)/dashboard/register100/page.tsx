'use client';

import Register100DataTable from '@/components/admin/Register100DataTable';

export default function Register100Page() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8 text-[#00B050]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900">
          โรงเรียนดนตรีไทย 100%
        </h1>
      </div>

      {/* Data Table */}
      <Register100DataTable />
    </div>
  );
}
