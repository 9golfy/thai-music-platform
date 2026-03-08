import { MongoClient } from 'mongodb';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import CertificatePreview from '@/components/admin/CertificatePreview';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

async function getCertificate(schoolId: string) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const certificatesCollection = database.collection('certificates');
    const templatesCollection = database.collection('certificate_templates');

    const certificate = await certificatesCollection.findOne({
      schoolId: schoolId,
      isActive: true,
    });

    if (!certificate) {
      return null;
    }

    // Get template image URL by template name
    let templateImageUrl = null;
    if (certificate.templateName) {
      const template = await templatesCollection.findOne({
        name: certificate.templateName,
        isActive: true,
      });
      templateImageUrl = template?.imageUrl || null;
    }

    return {
      ...certificate,
      _id: certificate._id.toString(),
      templateImageUrl,
    };
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return null;
  } finally {
    await client.close();
  }
}

export default async function TeacherCertificatePage() {
  const session = await getSession();

  if (!session || !session.schoolId) {
    redirect('/teacher-login');
  }

  const certificate = await getCertificate(session.schoolId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          ใบประกาศนียบัตร
        </h1>
        <p className="text-gray-600 mt-2">
          e-Certificate
        </p>
      </div>

      {!certificate ? (
        /* No Certificate State */
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold text-white">สถานะใบประกาศ</h3>
          </div>
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                ยังไม่มีใบประกาศนียบัตร
              </h2>
              <p className="text-gray-600 mb-4">
                ใบประกาศจะถูกออกให้โดยเจ้าหน้าที่หลังจากการพิจารณาและประเมินผล
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    ขั้นตอนการรับใบประกาศ
                  </p>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>ส่งข้อมูลการสมัครให้ครบถ้วน</li>
                    <li>รอการประเมินจากเจ้าหน้าที่</li>
                    <li>รับใบประกาศผ่านระบบ</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Certificate Available */
        <>
          {/* Certificate Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h3 className="text-lg font-semibold text-white">ใบประกาศนียบัตร</h3>
              </div>
            </div>
            
            <div className="p-8">
              {/* Certificate Preview with actual template */}
              <CertificatePreview
                schoolName={(certificate as any).schoolName}
                certificateNumber={(certificate as any).certificateNumber}
                issueDate={(certificate as any).issueDate}
                templateName={(certificate as any).templateName}
                templateImageUrl={(certificate as any).templateImageUrl}
                showDownloadButton={true}
              />

              {/* Certificate Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">ประเภท</p>
                  <p className="font-medium text-gray-900">
                    {(certificate as any).certificateType === 'register100'
                      ? 'โรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์'
                      : 'โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">สถานะ</p>
                  <p className="font-medium text-green-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Active
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">School ID</p>
                  <p className="font-medium text-gray-900 font-mono text-sm">
                    {session.schoolId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
