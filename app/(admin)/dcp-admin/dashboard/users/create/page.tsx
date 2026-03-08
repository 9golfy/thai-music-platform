import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import CreateUserForm from '@/components/admin/CreateUserForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function CreateUserPage() {
  const session = await getSession();

  // Only root can create users
  if (!session || session.role !== 'root') {
    redirect('/dcp-admin/dashboard/users');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dcp-admin/dashboard/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับ
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">เพิ่มผู้ใช้งาน</h1>
          <p className="text-gray-600 mt-1">สร้างบัญชีผู้ใช้งานใหม่ในระบบ</p>
        </div>
      </div>

      <CreateUserForm />
    </div>
  );
}
