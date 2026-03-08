import { Suspense } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import SchoolCertificateAssignment from '@/components/admin/SchoolCertificateAssignment';
import { Settings } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

export default async function CertificatesPage() {
  const session = await getSession();

  // Check if user is logged in
  if (!session) {
    redirect('/dcp-admin');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">e-Certificate Management</h1>
          <p className="text-gray-600 mt-1">กำหนด Template และสร้างใบประกาศโรงเรียน</p>
        </div>
        <Link href="/dcp-admin/dashboard/certificates/create">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center gap-2 cursor-pointer">
            <Settings className="w-4 h-4" />
            จัดการ Template
          </button>
        </Link>
      </div>

      <Suspense fallback={<Loading message="กำลังโหลดข้อมูลโรงเรียน..." />}>
        <SchoolCertificateAssignment />
      </Suspense>
    </div>
  );
}
