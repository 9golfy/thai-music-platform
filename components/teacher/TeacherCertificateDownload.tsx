'use client';

import CertificatePreview from '@/components/admin/CertificatePreview';

interface TeacherCertificateDownloadProps {
  certificate: {
    schoolName: string;
    province?: string | null;
    supportTypeName?: string | null;
    grade?: string | null;
    certificateNumber: string;
    issueDate: string;
    templateName?: string;
    templateImageUrl?: string | null;
    certificateType?: string;
  };
}

export default function TeacherCertificateDownload({ certificate }: TeacherCertificateDownloadProps) {
  const handleDownload = async () => {
    // Log download activity via API
    try {
      await fetch('/api/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType: 'CERTIFICATE_DOWNLOAD',
          description: `ดาวน์โหลดใบประกาศ (พิมพ์/บันทึก PDF): ${certificate.schoolName} (${certificate.certificateNumber || 'N/A'})`,
          schoolName: certificate.schoolName,
          metadata: {
            certificateNumber: certificate.certificateNumber,
            schoolName: certificate.schoolName,
            certificateType: certificate.certificateType,
            method: 'print',
          },
        }),
      });
    } catch (err) {
      console.error('Failed to log download activity:', err);
    }
  };

  return (
    <CertificatePreview
      schoolName={certificate.schoolName}
      province={certificate.province}
      supportTypeName={certificate.supportTypeName}
      grade={certificate.grade}
      certificateNumber={certificate.certificateNumber}
      issueDate={certificate.issueDate}
      templateName={certificate.templateName}
      templateImageUrl={certificate.templateImageUrl}
      certificateType={certificate.certificateType}
      showDownloadButton={true}
      onDownload={handleDownload}
    />
  );
}
