import Register100Wizard from '@/components-regist100/forms/Register100Wizard';
import RegistrationClosedNotice from '@/components/forms/RegistrationClosedNotice';
import { getRegistrationSettings, isRegistrationOpen } from '@/lib/registration-settings';

export const dynamic = 'force-dynamic';

export default async function Regist100Page() {
  const settings = await getRegistrationSettings();

  if (!isRegistrationOpen(settings, 'register100')) {
    return (
      <RegistrationClosedNotice
        title="โรงเรียนดนตรีไทย 100%"
        detail="ขออภัย ขณะนี้ปิดรับการลงทะเบียนสำหรับโรงเรียนดนตรีไทย 100% แล้ว"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <Register100Wizard />
    </div>
  );
}
