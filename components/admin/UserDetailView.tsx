'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'root' | 'admin' | 'teacher';
  isActive: boolean;
  profileImage?: string;
  schoolId?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Session {
  userId: string;
  email: string;
  role: string;
}

export default function UserDetailView({ id, session }: { id: string; session: Session }) {
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);

  useEffect(() => {
    fetchUser();
    
    // Check if URL has ?mode=edit parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'edit') {
      setIsEditMode(true);
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        // If edit mode is requested, set editedData
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mode') === 'edit') {
          setEditedData(data.user);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        alert('ลบผู้ใช้งานสำเร็จ');
        router.push('/dcp-admin/dashboard/users');
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบผู้ใช้งาน');
    }
  };

  const handleEdit = () => {
    if (!user) return;
    setIsEditMode(true);
    setEditedData({ ...user });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedData(null);
  };

  const handleResetPassword = async () => {
    setIsResettingPassword(true);
    setPasswordCopied(false);
    
    try {
      const response = await fetch(`/api/users/${id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Auto-generate password
      });
      
      const data = await response.json();
      
      if (data.success && data.password) {
        setGeneratedPassword(data.password);
        setShowResetPasswordModal(true);
      } else {
        alert('เกิดข้อผิดพลาด: ' + (data.message || 'ไม่สามารถรีเซ็ตรหัสผ่านได้'));
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  const handleClosePasswordModal = () => {
    setShowResetPasswordModal(false);
    setGeneratedPassword('');
    setPasswordCopied(false);
  };

  const handleSave = async () => {
    if (!editedData) return;
    
    // Validate required fields
    if (!editedData.firstName || !editedData.lastName || !editedData.email) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });
      const data = await response.json();
      if (data.success) {
        setUser(editedData);
        setIsEditMode(false);
        setEditedData(null);
        alert('บันทึกข้อมูลสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
  };

  const displayData = isEditMode ? editedData : user;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">ไม่พบข้อมูลผู้ใช้งาน</div>
      </div>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'root':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'teacher':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'root':
        return 'Root Admin';
      case 'admin':
        return 'Admin';
      case 'teacher':
        return 'Teacher';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับ
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600 mt-2">{user.email}</p>
              
              <div className="flex items-center gap-3 mt-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800 border-green-300' 
                    : 'bg-red-100 text-red-800 border-red-300'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            {/* Profile Image */}
            {user.profileImage && (
              <div className="flex-shrink-0">
                <img 
                  src={user.profileImage.startsWith('http') ? user.profileImage : `/api${user.profileImage}`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6 justify-end">
          {!isEditMode ? (
            <>
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                EDIT
              </button>
              {session.role === 'root' && user.role !== 'root' && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  DELETE
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                CANCEL
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isSaving ? 'SAVING...' : 'SAVE'}
              </button>
            </>
          )}
        </div>

        {/* User Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">ข้อมูลผู้ใช้งาน</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={displayData?.firstName || ''}
                  onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">{displayData?.firstName}</div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={displayData?.lastName || ''}
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">{displayData?.lastName}</div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              {isEditMode ? (
                <input
                  type="email"
                  value={displayData?.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">{displayData?.email}</div>
              )}
            </div>

            {/* Password - Reset Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">
                  ••••••
                </div>
                {!isEditMode && (session.role === 'root' || (session.role === 'admin' && user.role === 'teacher')) && (
                  <button
                    onClick={handleResetPassword}
                    disabled={isResettingPassword}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 whitespace-nowrap"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isResettingPassword ? 'กำลังรีเซ็ต...' : 'Reset Password'}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                * รหัสผ่านถูก hash ด้วย bcrypt เพื่อความปลอดภัย
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
              {isEditMode ? (
                <input
                  type="tel"
                  value={displayData?.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">{displayData?.phone || '-'}</div>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">บทบาท</label>
              {isEditMode && session.role === 'root' ? (
                <select
                  value={displayData?.role || 'teacher'}
                  onChange={(e) => handleFieldChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                  <option value="root">Root Admin</option>
                </select>
              ) : (
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">{getRoleLabel(displayData?.role || '')}</div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
              {isEditMode ? (
                <select
                  value={displayData?.isActive ? 'active' : 'inactive'}
                  onChange={(e) => handleFieldChange('isActive', e.target.value === 'active')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              ) : (
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {displayData?.isActive ? 'Active' : 'Inactive'}
                </div>
              )}
            </div>

            {/* School ID - Show for all users */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School ID</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={displayData?.schoolId || ''}
                  onChange={(e) => handleFieldChange('schoolId', e.target.value)}
                  placeholder="TH-XXXX-XXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">
                  {displayData?.schoolId || '-'}
                </div>
              )}
            </div>

            {/* Profile Image URL */}
            {isEditMode && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">ลิงก์รูปโปรไฟล์ (URL)</label>
                <input
                  type="text"
                  value={displayData?.profileImage || ''}
                  onChange={(e) => handleFieldChange('profileImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Created At */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สร้าง</label>
              <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {new Date(user.createdAt).toLocaleString('th-TH')}
              </div>
            </div>

            {/* Updated At */}
            {user.updatedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันที่อัปเดตล่าสุด</label>
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {new Date(user.updatedAt).toLocaleString('th-TH')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">ยืนยันการลบ</h3>
            <p className="text-gray-600 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งาน <strong>{user.firstName} {user.lastName}</strong>?
              <br />
              <span className="text-red-600">การดำเนินการนี้ไม่สามารถย้อนกลับได้</span>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all"
              >
                ลบผู้ใช้งาน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">รีเซ็ตรหัสผ่านสำเร็จ</h3>
            </div>
            
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">รหัสผ่านใหม่สำหรับ:</p>
              <p className="font-semibold text-gray-900 mb-3">{user.firstName} {user.lastName}</p>
              
              <div className="bg-white border-2 border-blue-300 rounded-lg p-4 mb-3">
                <p className="text-xs text-gray-500 mb-1">รหัสผ่าน:</p>
                <p className="text-3xl font-bold text-blue-600 text-center tracking-wider font-mono">
                  {generatedPassword}
                </p>
              </div>
              
              <button
                onClick={handleCopyPassword}
                className={`w-full px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  passwordCopied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {passwordCopied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    คัดลอกแล้ว!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    คัดลอกรหัสผ่าน
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ สำคัญ:</strong> กรุณาบันทึกรหัสผ่านนี้ เมื่อปิดหน้าต่างนี้จะไม่สามารถดูรหัสผ่านได้อีก
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleClosePasswordModal}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
