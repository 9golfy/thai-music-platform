'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TEMPLATE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'theme1', label: 'Theme 1' },
  { value: 'theme2', label: 'Theme 2' },
  { value: 'theme3', label: 'Theme 3' },
];

export default function CreateCertificateForm() {
  const router = useRouter();
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [error, setError] = useState('');
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const [uploadedTemplateImage, setUploadedTemplateImage] = useState<string | null>(null);
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState('');

  useEffect(() => {
    fetchSavedTemplates();
  }, []);

  const fetchSavedTemplates = async () => {
    try {
      const response = await fetch('/api/certificate-templates');
      const data = await response.json();
      
      if (data.success) {
        setSavedTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น (JPG, PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('ไฟล์มีขนาดใหญ่เกิน 5MB');
      return;
    }

    setUploadingTemplate(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedTemplateImage(reader.result as string);
        setUploadingTemplate(false);
      };
      reader.onerror = () => {
        setError('เกิดข้อผิดพลาดในการอ่านไฟล์');
        setUploadingTemplate(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการอัพโหลด');
      setUploadingTemplate(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplateName) {
      setError('กรุณาเลือกชื่อ Template');
      return;
    }

    if (!uploadedTemplateImage) {
      setError('กรุณาอัพโหลดรูป Template');
      return;
    }

    setSavingTemplate(true);
    setError('');

    try {
      const response = await fetch('/api/certificate-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedTemplateName,
          imageUrl: uploadedTemplateImage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchSavedTemplates();
        setUploadedTemplateImage(null);
        setSelectedTemplateName('');
        alert('บันทึก Template สำเร็จ');
      } else {
        setError(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการบันทึก Template');
    } finally {
      setSavingTemplate(false);
    }
  };

  const getTemplateImageForPreview = () => {
    if (uploadedTemplateImage) return uploadedTemplateImage;
    if (selectedTemplateName) {
      const template = savedTemplates.find((t) => t.name === selectedTemplateName);
      return template?.imageUrl || null;
    }
    return null;
  };

  const previewImage = getTemplateImageForPreview();

  return (
    <div className="grid grid-cols-20 gap-4">
      {/* Left Column - Preview Section (55%) */}
      <div className="col-span-11">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Preview Certificate Template</CardTitle>
          </CardHeader>
          <CardContent>
            {previewImage ? (
              <div className="flex justify-center">
                <img 
                  src={previewImage} 
                  alt="Certificate Template Preview" 
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '600px' }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">📜</div>
                  <p className="text-gray-500 text-lg">
                    เลือก Template และอัพโหลดรูปเพื่อดูตัวอย่าง
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Template Management Section (45%) */}
      <div className="col-span-9 space-y-4">
        <Card className="h-full">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-gray-900">สร้างใบประกาศสำหรับโรงเรียน</CardTitle>
            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold text-gray-800">จัดการ Template</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
          {/* Select Template Name */}
          <div className="space-y-2">
            <Label htmlFor="templateName">เลือกชื่อ Template</Label>
            <Select
              value={selectedTemplateName}
              onValueChange={setSelectedTemplateName}
              disabled={savingTemplate}
            >
              <SelectTrigger>
                <SelectValue placeholder="--- เลือกชื่อ Template ---" />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload Image */}
          <div className="space-y-2">
            <Label htmlFor="templateUpload">Upload Image</Label>
            <input
              id="templateUpload"
              type="file"
              accept="image/*"
              onChange={handleTemplateUpload}
              disabled={uploadingTemplate || savingTemplate}
              className="hidden"
            />
            <label
              htmlFor="templateUpload"
              className={`block w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors ${
                uploadingTemplate || savingTemplate ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploadingTemplate ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span className="text-gray-500">กำลังอัพโหลด...</span>
                </div>
              ) : uploadedTemplateImage ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-600 font-medium">
                    อัพโหลดสำเร็จ - คลิกเพื่อเปลี่ยนรูป
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">
                    📤 คลิกเพื่ออัพโหลดรูปภาพ Template
                  </p>
                  <p className="text-xs text-gray-500">
                    รองรับ JPG, PNG | ขนาดแนะนำ: 1200x800 pixels (3:2 ratio) | ไฟล์ไม่เกิน 5MB
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="cursor-pointer"
            >
              ❌ ยกเลิก
            </Button>
            <Button
              type="button"
              onClick={handleSaveTemplate}
              disabled={!selectedTemplateName || !uploadedTemplateImage || savingTemplate}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              {savingTemplate ? 'กำลังบันทึก...' : '💾 บันทึก Template'}
            </Button>
          </div>

          {/* Saved Templates List */}
          {savedTemplates.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Template ที่บันทึกไว้:</p>
              <div className="flex flex-wrap gap-2">
                {savedTemplates.map((template) => (
                  <span
                    key={template._id}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    ✓ {TEMPLATE_OPTIONS.find((t) => t.value === template.name)?.label || template.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
