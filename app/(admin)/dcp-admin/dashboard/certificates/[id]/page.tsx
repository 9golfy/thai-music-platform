import { MongoClient, ObjectId } from 'mongodb';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import CertificatePreview from '@/components/admin/CertificatePreview';
import Link from 'next/link';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

async function getCertificate(id: string) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const certificatesCollection = database.collection('certificates');
    const templatesCollection = database.collection('certificate_templates');
    const register100Collection = database.collection('register100_submissions');
    const registerSupportCollection = database.collection('register_support_submissions');

    const certificate = await certificatesCollection.findOne({
      _id: new ObjectId(id),
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

    // Get province from submission
    let province = null;
    if (certificate.schoolId) {
      if (certificate.certificateType === 'register100') {
        const submission = await register100Collection.findOne(
          { schoolId: certificate.schoolId },
          { projection: { reg100_schoolProvince: 1 } }
        );
        province = submission?.reg100_schoolProvince || null;
      } else {
        const submission = await registerSupportCollection.findOne(
          { schoolId: certificate.schoolId },
          { projection: { regsup_schoolProvince: 1 } }
        );
        province = submission?.regsup_schoolProvince || null;
      }
    }

    return {
      ...certificate,
      _id: certificate._id.toString(),
      templateImageUrl,
      province,
    };
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return null;
  } finally {
    await client.close();
  }
}

export default async function CertificateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;

  if (!session || !['root', 'admin', 'super_admin'].includes(session.role)) {
    redirect('/login');
  }

  const certificate = await getCertificate(id);

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบข้อมูล</h1>
          <p className="text-gray-600 mb-4">ไม่พบใบประกาศที่ต้องการ</p>
          <Link
            href="/dcp-admin/dashboard/certificates"
            className="text-primary hover:underline"
          >
            กลับไปหน้ารายการ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">รายละเอียดใบประกาศ</h1>
          <p className="text-gray-600 mt-1">
            เลขที่: {(certificate as any).certificateNumber}
          </p>
        </div>
        <Link
          href="/dcp-admin/dashboard/certificates"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ← กลับ
        </Link>
      </div>

      {/* Certificate Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">ชื่อโรงเรียน</p>
            <p className="font-medium text-gray-900">{(certificate as any).schoolName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">School ID</p>
            <p className="font-mono font-semibold text-blue-900 text-sm">
              {(certificate as any).schoolId}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">ประเภท</p>
            <p className="font-medium text-gray-900">
              {(certificate as any).certificateType === 'register100'
                ? 'โรงเรียนดนตรีไทย 100%'
                : 'โรงเรียนสนับสนุนและส่งเสริม'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Template</p>
            <p className="font-medium text-gray-900">{(certificate as any).templateName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">วันที่ออก</p>
            <p className="font-medium text-gray-900">
              {new Date((certificate as any).issueDate).toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">สถานะ</p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                (certificate as any).isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {(certificate as any).isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">ใบประกาศนียบัตร</h2>
        <CertificatePreview
          schoolName={(certificate as any).schoolName}
          province={(certificate as any).province}
          certificateNumber={(certificate as any).certificateNumber}
          issueDate={(certificate as any).issueDate}
          templateName={(certificate as any).templateName}
          templateImageUrl={(certificate as any).templateImageUrl}
          showDownloadButton={true}
        />
      </div>
    </div>
  );
}
