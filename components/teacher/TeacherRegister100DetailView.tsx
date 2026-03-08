'use client';

import Register100DetailView from '@/components/admin/Register100DetailView';

interface TeacherRegister100DetailViewProps {
  id: string;
  initialData: any;
}

export default function TeacherRegister100DetailView({ id }: TeacherRegister100DetailViewProps) {
  // Teachers should have export and edit functionality, but not delete
  // hideScores=true to hide scoring details, readOnly=false to allow editing, hideDelete=true to hide delete button
  return <Register100DetailView id={id} hideScores={true} readOnly={false} hideDelete={true} />;
}
