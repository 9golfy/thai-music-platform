'use client';

import Register100DetailView from '@/components/admin/Register100DetailView';

interface TeacherRegister100DetailViewProps {
  id: string;
  initialData: any;
}

export default function TeacherRegister100DetailView({ id }: TeacherRegister100DetailViewProps) {
  return <Register100DetailView id={id} hideScores={true} readOnly={true} />;
}
