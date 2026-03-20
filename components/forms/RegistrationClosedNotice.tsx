'use client';

import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RegistrationClosedNoticeProps {
  title: string;
  detail: string;
}

export default function RegistrationClosedNotice({
  title,
  detail,
}: RegistrationClosedNoticeProps) {
  return (
    <div className="min-h-screen bg-white">
      <AlertDialog open>
        <AlertDialogOverlay className="bg-white/80 backdrop-blur-sm" />
        <AlertDialogContent className="border-gray-200 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>ปิดรับการลงทะเบียนแล้ว</AlertDialogTitle>
            <div className="text-xl font-bold text-gray-900">{title}</div>
            <AlertDialogDescription>{detail}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link href="/">กลับหน้าแรก</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
