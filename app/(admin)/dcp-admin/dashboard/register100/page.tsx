import SchoolsDataTable from '@/components/admin/SchoolsDataTable';

export default function Register100Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">โรงเรียนดนตรีไทย 100%</h1>
        <p className="text-gray-600 mt-1">จัดการข้อมูลโรงเรียนที่สอนดนตรีไทย 100%</p>
      </div>

      <SchoolsDataTable type="register100" />
    </div>
  );
}
