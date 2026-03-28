import { MongoClient } from 'mongodb';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

async function getSchoolData(schoolId: string) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);

    // Try register100 first
    let collection = database.collection('register100_submissions');
    let school = await collection.findOne({ schoolId: schoolId });
    let type = 'register100';

    // If not found, try register_support
    if (!school) {
      collection = database.collection('register_support_submissions');
      school = await collection.findOne({ schoolId: schoolId });
      type = 'register-support';
    }

    if (!school) {
      return null;
    }

    return {
      ...school,
      _id: school._id.toString(),
      type,
    };
  } catch (error) {
    console.error('Error fetching school data:', error);
    return null;
  } finally {
    await client.close();
  }
}

export default async function TeacherDashboardPage() {
  const session = await getSession();

  if (!session || !session.schoolId) {
    redirect('/teacher-login');
  }

  const school = await getSchoolData(session.schoolId);

  if (!school) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            ระบบจัดการข้อมูลโรงเรียนดนตรีไทย
          </h1>
        </div>

        {/* Error Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">ไม่พบข้อมูลโรงเรียน</h2>
          <p className="text-gray-600 mb-4">
            ไม่พบข้อมูลการสมัครสำหรับ School ID: {session.schoolId}
          </p>
          <p className="text-sm text-gray-500">
            กรุณาติดต่อผู้ดูแลระบบหากคุณคิดว่านี่เป็นข้อผิดพลาด
          </p>
        </div>
      </div>
    );
  }

  const submissionUrl = `/teacher/dashboard/${school.type}/${school._id}`;
  const schoolTypeName = school.type === 'register100' 
    ? 'โรงเรียนดนตรีไทย 100%' 
    : 'โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          ระบบจัดการข้อมูลโรงเรียนดนตรีไทย
        </h1>
        <p className="text-gray-600 mt-2">
          ยินดีต้อนรับ {session.firstName} {session.lastName}
        </p>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">
              {school.type === 'register-support' 
                ? (school as any).regsup_schoolName || (school as any).schoolName
                : (school as any).reg100_schoolName || (school as any).schoolName}
            </h2>
            <p className="text-white/90 text-lg mb-1">{schoolTypeName}</p>
            <p className="text-white/75 text-sm">
              จังหวัด{school.type === 'register-support' 
                ? (school as any).regsup_schoolProvince || (school as any).schoolProvince
                : (school as any).reg100_schoolProvince || (school as any).schoolProvince || '-'}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white/90">School ID: {session.schoolId}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      

      {/* Quick Access Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-white">ข้อมูลการสมัครของโรงเรียน</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            ดูข้อมูลการสมัครและรายละเอียดทั้งหมดของโรงเรียนของคุณ
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs text-gray-500">สถานะ</p>
                <p className="text-sm font-medium text-gray-900">ส่งข้อมูลแล้ว</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-gray-500">วันที่สมัคร</p>
                <p className="text-sm font-medium text-gray-900">
                  {(school as any).createdAt
                    ? new Date((school as any).createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '-'}
                </p>
              </div>
            </div>
          </div>
          <Link
            href={submissionUrl}
            className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-md cursor-pointer"
          >
            ดูข้อมูลโรงเรียน คลิกที่นี่
          </Link>
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">ข้อมูลติดต่อ</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">อีเมล</p>
              <p className="text-sm text-gray-900">
                {school.type === 'register-support' 
                  ? (school as any).regsup_mgtEmail || (school as any).email
                  : (school as any).reg100_mgtEmail || (school as any).email || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">เบอร์โทรศัพท์</p>
              <p className="text-sm text-gray-900">
                {school.type === 'register-support' 
                  ? (school as any).regsup_mgtPhone || (school as any).phone
                  : (school as any).reg100_mgtPhone || (school as any).phone || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Help Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">ต้องการความช่วยเหลือ?</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อผู้ดูแลระบบ
          </p>
          <div className="flex gap-2">
            <a 
              href="#" 
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium text-center cursor-pointer"
            >
              คู่มือการใช้งาน
            </a>
            <a 
              href="#" 
              className="flex-1 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium text-center cursor-pointer"
            >
              ติดต่อเรา
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
