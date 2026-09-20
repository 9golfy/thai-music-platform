'use client';

import { useRef } from 'react';

interface CertificatePreviewProps {
  schoolName: string;
  province?: string | null;
  supportTypeName?: string | null;
  grade?: string | null;
  certificateNumber: string;
  issueDate: string;
  templateName?: string;
  templateImageUrl?: string | null;
  showDownloadButton?: boolean;
  certificateType?: string; // 'register100' or 'register-support'
}

export default function CertificatePreview({
  schoolName,
  province = null,
  supportTypeName = null,
  grade = null,
  certificateNumber,
  issueDate,
  templateName,
  templateImageUrl = null,
  showDownloadButton = false,
  certificateType = 'register100',
}: CertificatePreviewProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  // Use provided template image URL
  const hasBackgroundImage = !!templateImageUrl;
  
  // Default dimensions (3:2 ratio)
  const width = 1200;
  const height = 800;

  const handlePrint = () => {
    window.print();
  };

  // Function to wrap text if longer than 70 characters
  const wrapSchoolName = (name: string) => {
    // Count and log the character count
    console.log('=== School Name Character Count ===');
    console.log('School Name:', name);
    console.log('Character Count:', name.length);
    console.log('==================================');
    
    // Special case: Force wrap at opening parenthesis for specific school
    if (name.includes('โรงเรียนบ้านหนองเพรางาย (สลากกินแบ่งสงเคราะห์')) {
      const parts = name.split(' (');
      if (parts.length === 2) {
        console.log('Special case: Wrapping at parenthesis');
        console.log('Line 1:', parts[0]);
        console.log('Line 2:', '(' + parts[1]);
        return { 
          line1: parts[0], 
          line2: '(' + parts[1], 
          multiLine: true 
        };
      }
    }
    
    if (name.length <= 70) {
      return name;
    }
    
    // Find the last space before character 70
    const firstPart = name.substring(0, 70);
    const lastSpaceIndex = firstPart.lastIndexOf(' ');
    
    if (lastSpaceIndex > 0) {
      // Split at the last space
      const line1 = name.substring(0, lastSpaceIndex);
      const line2 = name.substring(lastSpaceIndex + 1);
      console.log('Multi-line detected:');
      console.log('Line 1:', line1, `(${line1.length} chars)`);
      console.log('Line 2:', line2, `(${line2.length} chars)`);
      return { line1, line2, multiLine: true };
    }
    
    // If no space found, just return the original name
    return name;
  };

  const wrappedSchoolName = wrapSchoolName(schoolName);
  const isMultiLine = typeof wrappedSchoolName !== 'string' && wrappedSchoolName.multiLine;
  const isRegisterSupport = certificateType === 'register-support';
  
  // Check for Theme2 (Participation Certificate)
  const isParticipationCert = 
    templateName === 'CERT-เข้าร่วมกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์' || 
    templateName === 'Theme2' || 
    templateName === 'theme2' ||
    templateName === 'THEME2' ||
    (templateName && templateName.toLowerCase().includes('theme2')) ||
    (templateName && templateName.includes('เข้าร่วมกิจกรรม'));
  
  // Check for Theme1 (Support Certificate) - check by template name directly
  const isTheme1 = 
    templateName === 'Theme1' || 
    templateName === 'theme1' || 
    templateName === 'THEME1' ||
    (templateName && templateName.toLowerCase().includes('theme1'));
  
  // Debug logging
  console.log('=== Certificate Template Debug ===');
  console.log('Template Name:', templateName);
  console.log('Certificate Type:', certificateType);
  console.log('Is Multi Line:', isMultiLine);
  console.log('Is Participation Cert (Theme2):', isParticipationCert);
  console.log('Is Theme1:', isTheme1);
  console.log('Is Register Support Type:', isRegisterSupport);
  console.log('==================================');
  
  // Adjust positions based on certificate type and whether school name is multi-line
  let schoolNameTop = 286;
  let provinceTop = 328;
  let gradeTop = 428;
  let showGradeAndType = true;
  let schoolNameLineHeight = '1.8';
  
  // ==============================================
  // THEME2: CERT-เข้าร่วมกิจกรรมโรงเรียนดนตรีไทย 100%
  // ==============================================
  if (isParticipationCert) {
    if (isMultiLine) {
      // Theme2 - Multi-line (ชื่อ >70 ตัวอักษร)
      schoolNameTop = 285;
      provinceTop = 375;
      schoolNameLineHeight = '1.2';
    } else {
      // Theme2 - Single line (ชื่อ ≤70 ตัวอักษร)
      schoolNameTop = 305;
      provinceTop = 360;
      schoolNameLineHeight = '1.8';
    }
    showGradeAndType = false; // ไม่แสดงประเภท/ระดับ
  } 
  
  // ==============================================
  // THEME1: ANY certificate with Theme1 template
  // ==============================================
  else if (isTheme1) {
    if (isMultiLine) {
      // Theme1 - Multi-line (ชื่อ >70 ตัวอักษร)
      schoolNameTop = 276;
      provinceTop = 336;
      gradeTop = 428;
      schoolNameLineHeight = '1.3';
    } else {
      // Theme1 - Single line (ชื่อ ≤70 ตัวอักษร)
      schoolNameTop = 286;
      provinceTop = 328;
      gradeTop = 428;
      schoolNameLineHeight = '1.2';
    }
    showGradeAndType = true; // แสดงประเภท/ระดับ
  } 
  
  // ==============================================
  // DEFAULT: CERT-โรงเรียนดนตรีไทย 100 เปอร์เซ็นต์
  // ==============================================
  else {
    if (isMultiLine) {
      // Default - Multi-line (ชื่อ >70 ตัวอักษร) - ใช้ค่าเดียวกับ Theme1
      schoolNameTop = 276;
      provinceTop = 336;
      gradeTop = 428;
      schoolNameLineHeight = '1.3';
    } else {
      // Default - Single line (ชื่อ ≤70 ตัวอักษร)
      schoolNameTop = 286;
      provinceTop = 328;
      gradeTop = 428;
      schoolNameLineHeight = '2.0';
    }
    showGradeAndType = true; // แสดงประเภท/ระดับ
  }

  return (
    <div className="space-y-4">
      {/* Google Fonts - Sarabun */}
      <link
        href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      
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
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
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

        {/* School Name Overlay - On dotted line after "โรงเรียน" */}
        <div
          className="absolute"
          style={{
            top: `${schoolNameTop}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '23px',
            fontFamily: '"Sarabun", sans-serif',
            color: '#1a1a1a',
            textAlign: 'center',
            fontWeight: '700',
            width: 'auto',
            lineHeight: schoolNameLineHeight,
            padding: '0 8px',
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {typeof wrappedSchoolName === 'string' ? (
            <span style={{ whiteSpace: 'nowrap' }}>{wrappedSchoolName}</span>
          ) : (
            <>
              <span style={{ whiteSpace: 'nowrap' }}>{wrappedSchoolName.line1}</span>
              <span style={{ whiteSpace: 'nowrap' }}>{wrappedSchoolName.line2}</span>
            </>
          )}
        </div>

        {/* Province Overlay - On dotted line after "จังหวัด" */}
        {province && (
          <div
            className="absolute"
            style={{
              top: `${provinceTop}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '23px',
              fontFamily: '"Sarabun", sans-serif',
              color: '#1a1a1a',
              textAlign: 'center',
              fontWeight: '700',
              maxWidth: '450px',
              lineHeight: '1.3',
              width: 'auto',
              padding: '0 8px',
              whiteSpace: 'nowrap',
              overflow: 'visible',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {province === 'กรุงเทพมหานคร' ? 'กรุงเทพมหานคร' : `จังหวัด${province}`}
          </div>
        )}

        {/* Support Type and Grade on same line */}
        {showGradeAndType && (supportTypeName || grade) && (
          <div
            className="absolute"
            style={{
              top: `${gradeTop}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '23px',
              fontFamily: '"Sarabun", sans-serif',
              color: '#1a1a1a',
              textAlign: 'center',
              fontWeight: '700',
              maxWidth: '700px',
              lineHeight: '1.3',
              width: 'auto',
              padding: '0 8px',
              whiteSpace: 'nowrap',
              overflow: 'visible',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {supportTypeName && <span>ประเภท{supportTypeName}</span>}
            {grade && <span>{grade}</span>}
          </div>
        )}

        {/* Certificate Number - Bottom Left Corner */}
        <div
          className="absolute"
          style={{
            bottom: '1.125%',
            left: '11.33%',
            transform: 'none',
            fontSize: '11px',
            fontFamily: '"Sarabun", sans-serif',
            color: '#999999',
            textAlign: 'left',
            fontWeight: '400',
          }}
        >
          เลขที่: {certificateNumber}
        </div>
      </div>

      {/* Action Buttons */}
      {showDownloadButton && (
        <div className="flex justify-center gap-3">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            พิมพ์ / บันทึกเป็น PDF
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
            width: 1200px !important;
            height: 800px !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          
          /* Force high quality rendering */
          #certificate-preview,
          #certificate-preview * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* High quality background image - use high-quality rendering */
          #certificate-preview > div:first-child {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-size: cover !important;
            background-position: center !important;
          }
          
          /* Hide buttons */
          button {
            display: none !important;
          }
          
          /* Force single page */
          html, body {
            height: 800px !important;
            overflow: hidden !important;
          }
          
          /* Page setup - high quality */
          @page {
            size: landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
