import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import CreateCertificateForm from '@/components/admin/CreateCertificateForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function CreateCertificatePage() {
  const session = await getSession();

  if (!session || !['root', 'admin'].includes(session.role)) {
    redirect('/dcp-admin/dashboard');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/dcp-admin/dashboard/certificates">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับ
          </Button>
        </Link>
      </div>

      <CreateCertificateForm />
    </div>
  );
}
