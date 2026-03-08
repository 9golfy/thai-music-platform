'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

interface DownloadCertificateButtonProps {
  certificateId: string;
  schoolName: string;
  certificateNumber: string;
}

export default function DownloadCertificateButton({
  certificateId,
  schoolName,
  certificateNumber,
}: DownloadCertificateButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Open certificate view page in new window for printing/saving as PDF
      const url = `/dcp-admin/dashboard/certificates/${certificateId}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('เกิดข้อผิดพลาดในการดาวน์โหลด');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      {downloading ? 'กำลังเปิด...' : 'Download'}
    </button>
  );
}
