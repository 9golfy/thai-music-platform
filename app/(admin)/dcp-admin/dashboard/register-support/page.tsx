import SchoolsDataTable from '@/components/admin/SchoolsDataTable';

export default function RegisterSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">โรงเรียนสนับสนุนและส่งเสริม</h1>
        <p className="text-gray-600 mt-1">จัดการข้อมูลโรงเรียนที่สนับสนุนและส่งเสริมดนตรีไทย</p>
      </div>

      <SchoolsDataTable type="register-support" />
    </div>
  );
}
