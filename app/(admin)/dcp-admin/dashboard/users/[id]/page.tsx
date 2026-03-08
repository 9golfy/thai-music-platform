import { Suspense } from 'react';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import UserDetailView from '@/components/admin/UserDetailView';
import { Loading } from '@/components/ui/loading';

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();

  // Check if user is logged in
  if (!session) {
    redirect('/dcp-admin');
  }

  const { id } = await params;

  return (
    <Suspense fallback={<Loading message="กำลังโหลดข้อมูลผู้ใช้งาน..." />}>
      <UserDetailView id={id} session={session} />
    </Suspense>
  );
}
