import RegisterSupportWizard from '@/components-regist-support/forms/RegisterSupportWizard';
import RegistrationClosedNotice from '@/components/forms/RegistrationClosedNotice';
import { getRegistrationSettings, isRegistrationOpen } from '@/lib/registration-settings';

export const dynamic = 'force-dynamic';

export default async function RegistSupportPage() {
  const settings = await getRegistrationSettings();

  if (!isRegistrationOpen(settings, 'register-support')) {
    return (
      <RegistrationClosedNotice
        title="โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย"
        detail="ขออภัย ขณะนี้ปิดรับการลงทะเบียนสำหรับประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <RegisterSupportWizard />
    </div>
  );
}
