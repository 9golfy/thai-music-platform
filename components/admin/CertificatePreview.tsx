'use client';

import { useRef } from 'react';
import { getTemplateById } from '@/lib/config/certificateTemplates';

interface CertificatePreviewProps {
  schoolName: string;
  certificateNumber: string;
  issueDate: string;
  templateName?: string;
  templateImageUrl?: string | null;
  showDownloadButton?: boolean;
}

export default function CertificatePreview({
  schoolName,
  certificateNumber,
  issueDate,
  templateName,
  templateImageUrl = null,
  showDownloadButton = false,
}: CertificatePreviewProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  // Use provided template image URL
  const hasBackgroundImage = !!templateImageUrl;
  
  // Default dimensions (3:2 ratio)
  const width = 1200;
  const height = 800;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    try {
      // Dynamically import html2pdf
      const html2pdf = (await import('html2pdf.js')).default;

      const element = certificateRef.current;
      const opt = {
        margin: 0,
        filename: `certificate-${certificateNumber}.pdf`,
        image: { type: 'jpeg' as const, quality: 1.0 },
        html2canvas: { 
          scale: 3,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: width,
          height: height,
        },
        jsPDF: { 
          unit: 'px', 
          format: [width, height] as [number, number], 
          orientation: 'landscape' as const,
          compress: false
        },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Format date to Thai format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {/* Certificate Display */}
      <div
        ref={certificateRef}
        id="certificate-preview"
        className="relative mx-auto bg-white shadow-lg"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: '100%',
          aspectRatio: `${width} / ${height}`,
        }}
      >
        {/* Background Image */}
        {hasBackgroundImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${templateImageUrl})`,
            }}
          />
        ) : (
          // Fallback design when no template image
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="absolute inset-0 border-8 border-amber-400 m-4">
              <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-amber-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-amber-500"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-amber-500"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-amber-500"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-6xl opacity-10">
                🏆
              </div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-sm text-gray-400 mb-2">โครงการคัดเลือกสถานศึกษา</div>
                <div className="text-xs text-gray-400">ตามกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์</div>
              </div>
            </div>
          </div>
        )}

        {/* School Name Overlay - Centered */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '32px',
            fontFamily: 'Sarabun, sans-serif',
            color: '#1a1a1a',
            textAlign: 'center',
            fontWeight: '700',
            maxWidth: '85%',
            lineHeight: '1.4',
            width: '100%',
            padding: '12px 16px',
            whiteSpace: 'nowrap',
            overflow: 'visible',
            minHeight: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          {schoolName}
        </div>

        {/* Certificate Number - Bottom Left */}
        <div
          className="absolute"
          style={{
            top: '75%',
            left: '20%', // ลดจาก 25% เป็น 20% (ลด 20%)
            transform: 'none',
            fontSize: '14px', // ลดจาก 16px เป็น 14px
            fontFamily: 'Sarabun, sans-serif',
            color: '#666666',
            textAlign: 'left',
            fontWeight: '400',
          }}
        >
          เลขที่: {certificateNumber}
        </div>

        {/* Issue Date - Bottom Right */}
        <div
          className="absolute"
          style={{
            top: '75%',
            left: '80%', // เพิ่มจาก 75% เป็น 80% (ลด margin-right 20%)
            transform: 'translateX(-100%)',
            fontSize: '14px', // ลดจาก 16px เป็น 14px
            fontFamily: 'Sarabun, sans-serif',
            color: '#666666',
            textAlign: 'right',
            fontWeight: '400',
          }}
        >
          วันที่ออก: {formatDate(issueDate)}
        </div>
      </div>

      {/* Action Buttons */}
      {showDownloadButton && (
        <div className="flex justify-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            ดาวน์โหลด PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            พิมพ์
          </button>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-preview,
          #certificate-preview * {
            visibility: visible !important;
          }
          #certificate-preview {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            transform: none !important;
          }
          
          /* Ensure background images print */
          #certificate-preview * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Hide action buttons when printing */
          button {
            display: none !important;
          }
          
          /* Ensure certificate fills the page */
          @page {
            margin: 0;
            size: landscape;
          }
        }
      `}</style>
    </div>
  );
}
