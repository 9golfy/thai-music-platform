'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateTeacherPassword, generateSchoolId } from '@/lib/auth/password';

export default function CreateUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
    firstName: '',
    lastName: '',
    phone: '',
    schoolId: '',
  });

  const handleGeneratePassword = () => {
    const password = generateTeacherPassword();
    setFormData({ ...formData, password });
  };

  const handleGenerateSchoolId = () => {
    const schoolId = generateSchoolId();
    setFormData({ ...formData, schoolId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dcp-admin/dashboard/users');
        router.refresh();
      } else {
        setError(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลผู้ใช้งาน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">ประเภทผู้ใช้งาน *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="root">Root (System Admin)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">ชื่อ *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">นามสกุล *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                disabled={loading}
                maxLength={10}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน *</Label>
            <div className="flex space-x-2">
              <Input
                id="password"
                type="text"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGeneratePassword}
                disabled={loading}
              >
                สุ่มรหัส
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              สำหรับครู: รหัสผ่าน 6 หลัก | สำหรับ Admin: ตั้งรหัสผ่านที่ปลอดภัย
            </p>
          </div>

          {/* School ID (for teachers only) */}
          {formData.role === 'teacher' && (
            <div className="space-y-2">
              <Label htmlFor="schoolId">School ID *</Label>
              <div className="flex space-x-2">
                <Input
                  id="schoolId"
                  value={formData.schoolId}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolId: e.target.value })
                  }
                  required
                  disabled={loading}
                  placeholder="SCH-20260228-0001"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateSchoolId}
                  disabled={loading}
                >
                  สร้าง ID
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                รูปแบบ: SCH-YYYYMMDD-XXXX
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'กำลังสร้าง...' : 'สร้างผู้ใช้งาน'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
