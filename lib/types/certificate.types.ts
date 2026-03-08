// Certificate Types and Interfaces

export type CertificateType = 'register100' | 'register-support';

export interface Certificate {
  _id?: string;
  schoolId: string;
  schoolName: string;
  certificateType: CertificateType;
  templateId: string;
  issueDate: Date;
  certificateNumber: string;
  pdfUrl?: string;
  imageUrl?: string;
  isActive: boolean;
  createdBy: string; // Admin user ID
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCertificateInput {
  schoolId: string;
  certificateType: CertificateType;
  templateId: string;
  issueDate: Date;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  type: CertificateType;
  layout: {
    schoolNameX: number;
    schoolNameY: number;
    dateX: number;
    dateY: number;
    certificateNumberX: number;
    certificateNumberY: number;
  };
  backgroundImage: string;
}
