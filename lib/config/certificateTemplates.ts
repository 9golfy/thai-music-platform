// Certificate Template Configurations
// กำหนดตำแหน่งและสไตล์สำหรับแต่ละ template

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  certificateType: 'register100' | 'register-support' | 'both';
  
  // ขนาดของใบประกาศ (pixels)
  width: number;
  height: number;
  
  // ตำแหน่งและสไตล์ของข้อความ
  textPositions: {
    schoolName: {
      top: string;      // CSS position (e.g., "45%")
      left: string;     // CSS position (e.g., "50%")
      fontSize: string; // CSS font size (e.g., "48px")
      fontFamily: string;
      color: string;
      textAlign: 'left' | 'center' | 'right';
      fontWeight: string;
      maxWidth?: string; // สำหรับชื่อยาว
      lineHeight?: string;
    };
    certificateNumber?: {
      top: string;
      left: string;
      fontSize: string;
      fontFamily: string;
      color: string;
      textAlign: 'left' | 'center' | 'right';
      fontWeight: string;
    };
    issueDate?: {
      top: string;
      left: string;
      fontSize: string;
      fontFamily: string;
      color: string;
      textAlign: 'left' | 'center' | 'right';
      fontWeight: string;
    };
  };
}

export const certificateTemplates: CertificateTemplate[] = [
  {
    id: 'default',
    name: 'Default Template',
    description: 'เทมเพลตมาตรฐาน สำหรับทุกประเภท',
    imageUrl: '/certificates/templates/default-template.jpg',
    certificateType: 'both',
    width: 1200,
    height: 800,
    textPositions: {
      schoolName: {
        top: '38.75%',
        left: '50%',
        fontSize: '42px',
        fontFamily: 'Sarabun, sans-serif',
        color: '#1a1a1a',
        textAlign: 'center',
        fontWeight: '600',
        maxWidth: '80%',
        lineHeight: '1.4',
      },
      certificateNumber: {
        top: '75%',
        left: '25%',
        fontSize: '16px',
        fontFamily: 'Sarabun, sans-serif',
        color: '#666666',
        textAlign: 'left',
        fontWeight: '400',
      },
      issueDate: {
        top: '75%',
        left: '75%',
        fontSize: '16px',
        fontFamily: 'Sarabun, sans-serif',
        color: '#666666',
        textAlign: 'right',
        fontWeight: '400',
      },
    },
  },
  {
    id: 'gold',
    name: 'Gold Template',
    description: 'เทมเพลตสีทอง สำหรับโรงเรียน 100%',
    imageUrl: '/certificates/templates/gold-template.jpg',
    certificateType: 'register100',
    width: 1200,
    height: 800,
    textPositions: {
      schoolName: {
        top: '41.75%',
        left: '50%',
        fontSize: '48px',
        fontFamily: 'Sarabun, sans-serif',
        color: '#1a1a1a',
        textAlign: 'center',
        fontWeight: '700',
        maxWidth: '75%',
        lineHeight: '1.3',
      },
      certificateNumber: {
        top: '78%',
        left: '20%',
        fontSize: '14px',
        fontFamily: 'Sarabun, sans-serif',
        color: '#8B7355',
        textAlign: 'left',
        fontWeight: '500',
      },
      issueDate: {
        top: '78%',
        left: '80%',
        fontSize: '14px',
        fontFamily: 'Sarabun, sans-serif',
        color: '#8B7355',
        textAlign: 'right',
        fontWeight: '500',
      },
    },
  },
  {
    id: 'silver',
    name: 'Silver Template',
    description: 'เทมเพลตสีเงิน สำหรับโรงเรียนสนับสนุนฯ',
    imageUrl: '/certificates/templates/silver-template.jpg',
    certificateType: 'register-support',
    width: 1200,
    height: 800,
    textPositions: {
      schoolName: {
        top: '39.75%',
        left: '50%',
        fontSize: '44px',
        fontFamily: 'Sarabun, sans-serif',
        color: '#2c3e50',
        textAlign: 'center',
        fontWeight: '600',
        maxWidth: '78%',
        lineHeight: '1.35',
      },
      certificateNumber: {
        top: '76%',
        left: '22%',
        fontSize: '15px',
        fontFamily: 'Sarabun, sans-serif',
        color: '#7f8c8d',
        textAlign: 'left',
        fontWeight: '500',
      },
      issueDate: {
        top: '76%',
        left: '78%',
        fontSize: '15px',
        fontFamily: 'Sarabun, sans-serif',
        color: '#7f8c8d',
        textAlign: 'right',
        fontWeight: '500',
      },
    },
  },
];

// Helper function to get template by ID
export function getTemplateById(id: string): CertificateTemplate | undefined {
  return certificateTemplates.find((t) => t.id === id);
}

// Helper function to get templates by certificate type
export function getTemplatesByType(
  type: 'register100' | 'register-support'
): CertificateTemplate[] {
  return certificateTemplates.filter(
    (t) => t.certificateType === type || t.certificateType === 'both'
  );
}
