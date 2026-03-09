'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

interface DeleteSchoolButtonProps {
  schoolId: string;
  schoolName: string;
  type: 'register100' | 'register-support';
  onDeleteSuccess?: () => void;
}

export default function DeleteSchoolButton({
  schoolId,
  schoolName,
  type,
  onDeleteSuccess,
}: DeleteSchoolButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const apiPath = type === 'register100' ? 'register100' : 'register-support';
      const response = await fetch(`/api/${apiPath}/${schoolId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Call the callback to refresh parent component
        if (onDeleteSuccess) {
          onDeleteSuccess();
        } else {
          // Fallback to router refresh if no callback provided
          router.refresh();
        }
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.message);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md">
          Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
          <AlertDialogDescription>
            คุณต้องการลบข้อมูลของ <strong>{schoolName}</strong> ใช่หรือไม่?
            <br />
            <br />
            การดำเนินการนี้ไม่สามารถย้อนกลับได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
          >
            {loading ? 'กำลังลบ...' : 'ลบข้อมูล'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
