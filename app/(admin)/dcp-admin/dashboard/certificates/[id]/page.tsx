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

    // Debug: Log all certificate fields
    console.log('=== All Certificate Fields ===');
    console.log(JSON.stringify(certificate, null, 2));
    console.log('==============================');

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
    let supportTypeName = null;
    if (certificate.schoolId) {
      if (certificate.certificateType === 'register100') {
        const submission = await register100Collection.findOne(
          { schoolId: certificate.schoolId },
          { projection: { 
            reg100_schoolProvince: 1
          } }
        );
        province = submission?.reg100_schoolProvince || null;
      } else {
        const submission = await registerSupportCollection.findOne(
          { schoolId: certificate.schoolId },
          { projection: { 
            regsup_schoolProvince: 1,
            supportType: 1,
            supportTypeName: 1
          } }
        );
        province = submission?.regsup_schoolProvince || null;
        supportTypeName = submission?.supportTypeName || submission?.supportType || null;
      }
    }

    // Get grade from certificate, or calculate from submission if not stored
    let grade = certificate.grade || null;
    
    // If grade not stored, calculate from submission scores (for old certificates)
    if (!grade && certificate.schoolId) {
      if (certificate.certificateType === 'register100') {
        const submission = await register100Collection.findOne(
          { schoolId: certificate.schoolId },
          { projection: { 
            teaching_curriculum_score: 1,
            teacher_qualification_score: 1,
            support_from_org_score: 1,
            support_from_external_score: 1,
            award_score: 1,
            activity_within_province_internal_score: 1,
            activity_within_province_external_score: 1,
            activity_outside_province_score: 1,
            pr_activity_score: 1,
            video1_score: 1,
            video2_score: 1
          } }
        );
        
        if (submission) {
          const part1Score = 
            (submission.teaching_curriculum_score || 0) +
            (submission.teacher_qualification_score || 0) +
            (submission.support_from_org_score || 0) +
            (submission.support_from_external_score || 0) +
            (submission.award_score || 0) +
            (submission.activity_within_province_internal_score || 0) +
            (submission.activity_within_province_external_score || 0) +
            (submission.activity_outside_province_score || 0) +
            (submission.pr_activity_score || 0);
          const video1Score = submission.video1_score || 0;
          const video2Score = submission.video2_score || 0;
          const totalScore = part1Score + video1Score + video2Score;
          
          const { calculateGradeRegister100, getGradeNameThai } = await import('@/lib/utils/gradeCalculator');
          const gradeLevel = calculateGradeRegister100(totalScore);
          grade = getGradeNameThai(gradeLevel);
        }
      } else {
        const submission = await registerSupportCollection.findOne(
          { schoolId: certificate.schoolId },
          { projection: { 
            teacher_qualification_score: 1,
            support_from_org_score: 1,
            support_from_external_score: 1,
            award_score: 1,
            activity_within_province_internal_score: 1,
            activity_within_province_external_score: 1,
            activity_outside_province_score: 1,
            pr_activity_score: 1,
            video1_score: 1,
            video2_score: 1
          } }
        );
        
        if (submission) {
          const part1Score =
            (submission.teacher_qualification_score || 0) +
            (submission.support_from_org_score || 0) +
            (submission.support_from_external_score || 0) +
            (submission.award_score || 0) +
            (submission.activity_within_province_internal_score || 0) +
            (submission.activity_within_province_external_score || 0) +
            (submission.activity_outside_province_score || 0) +
            (submission.pr_activity_score || 0);
          const video1Score = submission.video1_score || 0;
          const video2Score = submission.video2_score || 0;
          const totalScore = part1Score + video1Score + video2Score;
          
          const { calculateGrade, getGradeNameThai } = await import('@/lib/utils/gradeCalculator');
          const gradeLevel = calculateGrade(totalScore);
          grade = getGradeNameThai(gradeLevel);
        }
      }
    }

    return {
      ...certificate,
      _id: certificate._id.toString(),
      templateImageUrl,
      province,
      supportTypeName,
      grade,
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

  // Debug: Log certificate data
  console.log('=== Certificate Data ===');
  console.log('schoolName:', (certificate as any).schoolName);
  console.log('province:', (certificate as any).province);
  console.log('grade:', (certificate as any).grade);
  console.log('certificateNumber:', (certificate as any).certificateNumber);
  console.log('========================');

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
          {(certificate as any).province && (
            <div>
              <p className="text-sm text-gray-500 mb-1">จังหวัด</p>
              <p className="font-medium text-gray-900">{(certificate as any).province}</p>
            </div>
          )}
          {(certificate as any).grade && (
            <div>
              <p className="text-sm text-gray-500 mb-1">ระดับเกณฑ์</p>
              <p className="font-medium text-gray-900">{(certificate as any).grade}</p>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">ใบประกาศนียบัตร</h2>
        <CertificatePreview
          schoolName={(certificate as any).schoolName}
          province={(certificate as any).province}
          supportTypeName={(certificate as any).supportTypeName}
          grade={(certificate as any).grade}
          certificateNumber={(certificate as any).certificateNumber}
          issueDate={(certificate as any).issueDate}
          templateName={(certificate as any).templateName}
          templateImageUrl={(certificate as any).templateImageUrl}
          certificateType={(certificate as any).certificateType}
          showDownloadButton={true}
        />
      </div>
    </div>
  );
}
