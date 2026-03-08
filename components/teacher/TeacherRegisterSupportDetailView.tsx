'use client';

import RegisterSupportDetailView from '@/components/admin/RegisterSupportDetailView';

interface TeacherRegisterSupportDetailViewProps {
  id: string;
  initialData: any;
}

export default function TeacherRegisterSupportDetailView({ id }: TeacherRegisterSupportDetailViewProps) {
  return <RegisterSupportDetailView id={id} hideScores={true} readOnly={true} />;
}
