import { Suspense } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import UsersDataTable from '@/components/admin/UsersDataTable';
import { UserPlus } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

export default async function UsersPage() {
  const session = await getSession();

  // Check if user is logged in
  if (!session) {
    redirect('/dcp-admin');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">จัดการผู้ใช้งานในระบบ</p>
          {/* Debug: Show current role */}
          <p className="text-xs text-gray-400 mt-1">Current role: {session.role}</p>
        </div>
        {(session.role === 'root' || session.role === 'super_admin') && (
          <Link href="/dcp-admin/dashboard/users/create">
            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md flex items-center gap-2 cursor-pointer">
              <UserPlus className="w-4 h-4" />
              เพิ่มผู้ใช้งาน
            </button>
          </Link>
        )}
      </div>

      <Suspense fallback={<Loading message="กำลังโหลดข้อมูลผู้ใช้งาน..." />}>
        <UsersDataTable session={session} />
      </Suspense>
    </div>
  );
}
