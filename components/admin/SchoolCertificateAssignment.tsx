'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { calculateGrade, getGradeColor } from '@/lib/utils/gradeCalculator';

const TEMPLATE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'theme1', label: 'Theme 1' },
  { value: 'theme2', label: 'Theme 2' },
  { value: 'theme3', label: 'Theme 3' },
];

interface School {
  _id: string;
  schoolId: string;
  schoolName: string;
  total_score?: number;  // Changed from totalScore to total_score to match database
  grade?: string;
  type: 'register100' | 'register-support';
  typeName: string;
  hasCertificate?: boolean;
  certificateTemplate?: string;
  certificateId?: string; // Add certificate ID
}

export default function SchoolCertificateAssignment() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolType, setSchoolType] = useState<'all' | 'register100' | 'register-support'>('all');
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set());
  const [bulkTemplate, setBulkTemplate] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const [schoolTemplates, setSchoolTemplates] = useState<Map<string, string>>(new Map());
  const [processing, setProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [certificatesToCreate, setCertificatesToCreate] = useState<number>(0);
  const [showTemplateConfirmModal, setShowTemplateConfirmModal] = useState(false);
  const [pendingTemplateChange, setPendingTemplateChange] = useState<{schoolId: string, templateName: string, schoolName: string} | null>(null);
  const [deletingCertId, setDeletingCertId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [schoolType]);

  useEffect(() => {
    filterSchools();
  }, [schools, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch templates and certificates first
      const [templatesResponse, certificatesResponse] = await Promise.all([
        fetch('/api/certificate-templates'),
        fetch('/api/certificates'),
      ]);

      const templatesData = await templatesResponse.json();
      const certificatesData = await certificatesResponse.json();

      // Create a map of existing certificates
      const certificateMap = new Map();
      if (certificatesData.success && certificatesData.certificates) {
        certificatesData.certificates.forEach((cert: any) => {
          certificateMap.set(cert.schoolId, {
            hasCertificate: true,
            templateName: cert.templateName,
            certificateId: cert._id,
          });
        });
      }

      let allSchools: School[] = [];

      // Fetch schools based on selected type
      if (schoolType === 'all') {
        // Fetch both types
        const [register100Response, registerSupportResponse] = await Promise.all([
          fetch('/api/register100/list'),
          fetch('/api/register-support/list'),
        ]);

        const register100Data = await register100Response.json();
        const registerSupportData = await registerSupportResponse.json();

        // Map register100 schools
        const register100Schools = (register100Data.submissions || []).map((school: any) => {
          const certInfo = certificateMap.get(school.schoolId);
          const totalScore = school.total_score || 0;
          const grade = calculateGrade(totalScore);
          
          return {
            ...school,
            schoolName: school.reg100_schoolName || school.schoolName, // Fix field mapping
            total_score: totalScore,
            grade: grade,
            type: 'register100' as const,
            typeName: 'โรงเรียน 100%',
            hasCertificate: certInfo?.hasCertificate || false,
            certificateTemplate: certInfo?.templateName || '',
            certificateId: certInfo?.certificateId || '',
          };
        });

        // Map register-support schools
        const registerSupportSchools = (registerSupportData.submissions || []).map((school: any) => {
          const certInfo = certificateMap.get(school.schoolId);
          const totalScore = school.total_score || 0;
          const grade = calculateGrade(totalScore);
          
          return {
            ...school,
            schoolName: school.regsup_schoolName || school.schoolName, // Fix field mapping
            total_score: totalScore,
            grade: grade,
            type: 'register-support' as const,
            typeName: 'โรงเรียนสนับสนุนฯ',
            hasCertificate: certInfo?.hasCertificate || false,
            certificateTemplate: certInfo?.templateName || '',
            certificateId: certInfo?.certificateId || '',
          };
        });

        // Combine both arrays
        allSchools = [...register100Schools, ...registerSupportSchools];
      } else {
        // Fetch single type
        const schoolsResponse = await fetch(`/api/${schoolType}/list`);
        const schoolsData = await schoolsResponse.json();

        allSchools = (schoolsData.submissions || []).map((school: any) => {
          const certInfo = certificateMap.get(school.schoolId);
          const totalScore = school.total_score || 0;
          const grade = calculateGrade(totalScore);
          
          return {
            ...school,
            schoolName: schoolType === 'register100' 
              ? (school.reg100_schoolName || school.schoolName)
              : (school.regsup_schoolName || school.schoolName), // Fix field mapping
            total_score: totalScore,
            grade: grade,
            type: schoolType,
            typeName: schoolType === 'register100' ? 'โรงเรียน 100%' : 'โรงเรียนสนับสนุนฯ',
            hasCertificate: certInfo?.hasCertificate || false,
            certificateTemplate: certInfo?.templateName || '',
            certificateId: certInfo?.certificateId || '',
          };
        });
      }

      setSchools(allSchools);
      setFilteredSchools(allSchools);
      
      if (templatesData.success) {
        setSavedTemplates(templatesData.templates || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSchools = () => {
    let filtered = schools;

    if (searchTerm) {
      filtered = filtered.filter((school) =>
        school.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSchools(filtered);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredSchools.map((s) => s.schoolId));
      setSelectedSchools(allIds);
    } else {
      setSelectedSchools(new Set());
    }
  };

  const handleSelectSchool = (schoolId: string, checked: boolean) => {
    const newSelected = new Set(selectedSchools);
    if (checked) {
      newSelected.add(schoolId);
    } else {
      newSelected.delete(schoolId);
    }
    setSelectedSchools(newSelected);
  };

  const handleTemplateChange = (schoolId: string, templateName: string, schoolName: string) => {
    // If selecting "none", clear immediately without confirmation
    if (templateName === '' || templateName === 'none') {
      const newTemplates = new Map(schoolTemplates);
      newTemplates.delete(schoolId);
      setSchoolTemplates(newTemplates);
      return;
    }

    // Show confirmation modal for template selection
    setPendingTemplateChange({ schoolId, templateName, schoolName });
    setShowTemplateConfirmModal(true);
  };

  const confirmTemplateChange = () => {
    if (pendingTemplateChange) {
      const newTemplates = new Map(schoolTemplates);
      newTemplates.set(pendingTemplateChange.schoolId, pendingTemplateChange.templateName);
      setSchoolTemplates(newTemplates);
    }
    setShowTemplateConfirmModal(false);
    setPendingTemplateChange(null);
  };

  const cancelTemplateChange = () => {
    setShowTemplateConfirmModal(false);
    setPendingTemplateChange(null);
  };

  const handleDeleteCertificate = async (certificateId: string, schoolName: string) => {
    if (!confirm(`ต้องการยกเลิกใบประกาศของ "${schoolName}" ใช่หรือไม่?`)) {
      return;
    }

    setDeletingCertId(certificateId);
    try {
      const response = await fetch(`/api/certificates/${certificateId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        alert('ยกเลิกใบประกาศเรียบร้อยแล้ว');
        // Reload data
        await fetchData();
      } else {
        alert(`เกิดข้อผิดพลาด: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('เกิดข้อผิดพลาดในการยกเลิกใบประกาศ');
    } finally {
      setDeletingCertId(null);
    }
  };

  const handleBulkTemplateChange = (templateName: string) => {
    if (selectedSchools.size === 0) {
      alert('กรุณาเลือกโรงเรียนก่อน');
      return;
    }

    setBulkTemplate(templateName);

    const newTemplates = new Map(schoolTemplates);
    
    if (templateName === 'none') {
      // Clear template for selected schools
      selectedSchools.forEach((schoolId) => {
        newTemplates.delete(schoolId);
      });
    } else {
      // Set template for selected schools
      selectedSchools.forEach((schoolId) => {
        newTemplates.set(schoolId, templateName);
      });
    }
    
    setSchoolTemplates(newTemplates);
  };

  const handleCreateCertificates = async () => {
    const schoolsToCreate = Array.from(schoolTemplates.entries())
      .filter(([schoolId, templateName]) => {
        const school = schools.find((s) => s.schoolId === schoolId);
        return school && !school.hasCertificate && templateName;
      });

    if (schoolsToCreate.length === 0) {
      alert('ไม่มีโรงเรียนที่ต้องสร้างใบประกาศ (กรุณาเลือก Template และโรงเรียนที่ยังไม่มีใบประกาศ)');
      return;
    }

    // Show confirmation modal
    setCertificatesToCreate(schoolsToCreate.length);
    setShowConfirmModal(true);
  };

  const confirmCreateCertificates = async () => {
    setShowConfirmModal(false);
    setProcessing(true);

    const schoolsToCreate = Array.from(schoolTemplates.entries())
      .filter(([schoolId, templateName]) => {
        const school = schools.find((s) => s.schoolId === schoolId);
        return school && !school.hasCertificate && templateName;
      });

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const [schoolId, templateName] of schoolsToCreate) {
        const school = schools.find((s) => s.schoolId === schoolId);
        if (!school) continue;

        try {
          const response = await fetch('/api/certificates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              schoolId: school.schoolId,
              certificateType: school.type,
              templateName: templateName,
            }),
          });

          const data = await response.json();
          if (data.success) {
            successCount++;
          } else {
            errorCount++;
            console.error(`Failed to create certificate for ${school.schoolName}:`, data.message);
          }
        } catch (error) {
          errorCount++;
          console.error(`Error creating certificate for ${school.schoolName}:`, error);
        }
      }

      alert(`สร้างใบประกาศเสร็จสิ้น\nสำเร็จ: ${successCount}\nล้มเหลว: ${errorCount}`);
      
      // Force full page refresh to reset all states
      router.refresh();
      
      // Clear all states
      setSchoolTemplates(new Map());
      setSelectedSchools(new Set());
      setBulkTemplate('');
      
      // Reload data
      await fetchData();
    } catch (error) {
      console.error('Error creating certificates:', error);
      alert('เกิดข้อผิดพลาดในการสร้างใบประกาศ');
    } finally {
      setProcessing(false);
    }
  };

  const getGradeBgClass = (grade?: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100';
      case 'B':
        return 'bg-blue-100';
      case 'C':
        return 'bg-orange-100';
      case 'F':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Template Change Confirmation Modal (for individual dropdown) */}
      {showTemplateConfirmModal && pendingTemplateChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                กำหนด Template แบบกลุ่ม
              </h3>
              <p className="text-center text-gray-600 mb-2">
                ต้องการกำหนด Template <span className="font-bold text-blue-600">{TEMPLATE_OPTIONS.find(t => t.value === pendingTemplateChange.templateName)?.label}</span>
              </p>
              <p className="text-center text-gray-600 mb-6">
                ให้กับ <span className="font-bold text-gray-900">{pendingTemplateChange.schoolName}</span> ใช่หรือไม่?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelTemplateChange}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmTemplateChange}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-lg transition-all cursor-pointer"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                ยืนยันการสร้างใบประกาศ
              </h3>
              <p className="text-center text-gray-600 mb-6">
                ต้องการสร้างใบประกาศสำหรับ <span className="font-bold text-green-600">{certificatesToCreate}</span> โรงเรียน<br/>
                ใช่หรือไม่?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmCreateCertificates}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium shadow-lg transition-all cursor-pointer"
                >
                  ยืนยันสร้างใบประกาศ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    <div className="space-y-6">
      {/* Single Card containing Filters, Summary, and Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 space-y-4">
          {/* Filters Section */}
          <div className="grid grid-cols-12 gap-4 items-end">
            {/* 30% - School Type (Left) */}
            <div className="col-span-4 space-y-2">
              <Label className="text-sm font-semibold text-gray-700">ประเภทโรงเรียน</Label>
              <Select
                value={schoolType}
                onValueChange={(value: any) => setSchoolType(value)}
              >
                <SelectTrigger className="w-full h-10 border-2 hover:border-primary transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏫</span>
                      <span className="font-semibold">ทั้งหมด</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="register100">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎵</span>
                      <span>โรงเรียน 100%</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="register-support">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎼</span>
                      <span>โรงเรียนสนับสนุนฯ</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 40% - Template Dropdown (Center) */}
            <div className="col-span-4 space-y-2">
              <Label className="text-sm font-semibold text-gray-700">กำหนด Template แบบกลุ่ม</Label>
              <Select
                value={bulkTemplate}
                onValueChange={handleBulkTemplateChange}
                disabled={savedTemplates.length === 0 || selectedSchools.size === 0}
              >
                <SelectTrigger className="w-full h-10 border-2 hover:border-primary transition-colors">
                  <SelectValue placeholder={selectedSchools.size === 0 ? "เลือกโรงเรียนก่อน" : "เลือก Template"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚪</span>
                      <span className="text-gray-500">ยังไม่กำหนด</span>
                    </div>
                  </SelectItem>
                  {savedTemplates.map((template) => (
                    <SelectItem key={template._id} value={template.name}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📜</span>
                        <span>{TEMPLATE_OPTIONS.find((t) => t.value === template.name)?.label || template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 30% - Search (Right) */}
            <div className="col-span-4 space-y-2">
              <Label className="text-sm font-semibold text-gray-700">ค้นหาชื่อโรงเรียน</Label>
              <div className="relative">
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  type="text"
                  placeholder="ค้นหา..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 border-2 hover:border-primary transition-colors w-full"
                />
              </div>
            </div>
          </div>

          {/* Info Bar */}
          {savedTemplates.length === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">ยังไม่มี Template</p>
                <p className="text-xs text-amber-700 mt-1">กรุณาไปที่หน้า "จัดการ Template" เพื่อออัพโหลด Template ก่อนสร้างใบประกาศ</p>
              </div>
            </div>
          )}

          {/* Selection Summary - Always visible */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    เลือกแล้ว <span className="font-semibold text-blue-600">{selectedSchools.size}</span> โรงเรียน
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    กำหนด Template แล้ว <span className="font-semibold text-green-600">{schoolTemplates.size}</span> โรงเรียน
                  </span>
                </div>
              </div>
              {schoolTemplates.size > 0 && (
                <Button
                  onClick={handleCreateCertificates}
                  disabled={processing}
                  className="h-10 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>กำลังสร้าง...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>สร้างใบประกาศ</span>
                    </div>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200">
                  <TableHead className="w-12 pl-6">
                    <Checkbox
                      checked={selectedSchools.size === filteredSchools.length && filteredSchools.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="border-2"
                    />
                  </TableHead>
                  <TableHead className="w-16 font-semibold text-gray-700">#</TableHead>
                  <TableHead className="font-semibold text-gray-700">ชื่อโรงเรียน</TableHead>
                  <TableHead className="text-center w-48 font-semibold text-gray-700">ประเภทโรงเรียน</TableHead>
                  <TableHead className="text-center w-32 font-semibold text-gray-700">คะแนนรวม</TableHead>
                  <TableHead className="text-center w-24 font-semibold text-gray-700">Grade</TableHead>
                  <TableHead className="w-64 font-semibold text-gray-700">การดำเนินการ</TableHead>
                  <TableHead className="text-center w-40 font-semibold text-gray-700">สถานะ</TableHead>
                  <TableHead className="w-32 text-center font-semibold text-gray-700">ดูใบประกาศ</TableHead>
                  <TableHead className="w-32 text-center font-semibold text-gray-700">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">ไม่พบข้อมูลโรงเรียน</p>
                          <p className="text-sm text-gray-500 mt-1">ลองเปลี่ยนประเภทโรงเรียนหรือคำค้นหา</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchools.map((school, index) => (
                    <TableRow 
                      key={school._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <Checkbox
                          checked={selectedSchools.has(school.schoolId)}
                          onCheckedChange={(checked) =>
                            handleSelectSchool(school.schoolId, checked as boolean)
                          }
                          disabled={school.hasCertificate}
                          className="border-2"
                        />
                      </TableCell>
                      <TableCell className="font-semibold text-gray-600">{index + 1}</TableCell>
                      <TableCell>
                        <div className="py-1">
                          <div 
                            className={`font-semibold text-gray-900 ${school.hasCertificate ? 'cursor-pointer hover:text-primary hover:underline' : ''}`}
                            onClick={() => {
                              if (school.hasCertificate && school.certificateId) {
                                window.location.href = `/dcp-admin/dashboard/certificates/${school.certificateId}`;
                              }
                            }}
                          >
                            {school.schoolName}
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {school.schoolId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm text-gray-700">
                          {school.typeName}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                          {school.total_score !== undefined ? school.total_score : '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold ${getGradeColor(school.grade || 'F')} ${getGradeBgClass(school.grade || 'F')}`}>
                          {school.grade || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={(school.hasCertificate && school.certificateTemplate) ? String(school.certificateTemplate) : (schoolTemplates.get(school.schoolId) || 'none')}
                          onValueChange={(value) => {
                            if (value === 'none') {
                              handleTemplateChange(school.schoolId, '', school.schoolName);
                            } else {
                              handleTemplateChange(school.schoolId, value, school.schoolName);
                            }
                          }}
                          disabled={savedTemplates.length === 0}
                        >
                          <SelectTrigger className={`w-full h-10 border-2 hover:bg-sky-50 hover:border-sky-300 transition-colors ${
                            (school.hasCertificate && school.certificateTemplate) || schoolTemplates.get(school.schoolId) 
                              ? 'bg-sky-50 border-sky-200' 
                              : ''
                          }`}>
                            <SelectValue placeholder="ยังไม่กำหนด" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              <div className="flex items-center gap-2">
                                <span className="text-base">⚪</span>
                                <span className="text-gray-500">ยังไม่กำหนด</span>
                              </div>
                            </SelectItem>
                            {savedTemplates.map((template) => (
                              <SelectItem key={template._id} value={template.name}>
                                <div className="flex items-center gap-2">
                                  <span className="text-base">📜</span>
                                  <span>{TEMPLATE_OPTIONS.find((t) => t.value === template.name)?.label || template.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        {(() => {
                          // Get current dropdown value
                          const currentTemplate = (school.hasCertificate && school.certificateTemplate) 
                            ? String(school.certificateTemplate) 
                            : (schoolTemplates.get(school.schoolId) || 'none');
                          
                          // If dropdown is "none" or empty, show "-"
                          if (currentTemplate === 'none' || currentTemplate === '') {
                            return <span className="text-gray-400 text-sm">-</span>;
                          }
                          
                          // If dropdown has a template selected, show "มีใบประกาศแล้ว"
                          return (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              มีใบประกาศแล้ว
                            </span>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="text-center">
                        {school.hasCertificate && school.certificateId ? (
                          <Button
                            onClick={() => window.location.href = `/dcp-admin/dashboard/certificates/${school.certificateId}`}
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 border-2 hover:bg-primary hover:text-white hover:border-primary transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {school.hasCertificate && school.certificateId ? (
                          <Button
                            onClick={() => handleDeleteCertificate(school.certificateId!, school.schoolName)}
                            disabled={deletingCertId === school.certificateId}
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer"
                          >
                            {deletingCertId === school.certificateId ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                <span>กำลังลบ...</span>
                              </div>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                ยกเลิกใบประกาศ
                              </>
                            )}
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>แสดง <span className="font-semibold text-gray-900">{filteredSchools.length}</span> จาก <span className="font-semibold text-gray-900">{schools.length}</span> โรงเรียน</span>
            </div>
            {selectedSchools.size > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                  เลือกแล้ว {selectedSchools.size} โรงเรียน
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
