'use client';

import RegisterSupportDetailView from '@/components/admin/RegisterSupportDetailView';

interface TeacherRegisterSupportDetailViewProps {
  id: string;
  initialData: any;
}

export default function TeacherRegisterSupportDetailView({ id }: TeacherRegisterSupportDetailViewProps) {
  // Teachers should have export and edit functionality, but not delete
  // hideScores=true to hide scoring details, readOnly=false to allow editing, hideDelete=true to hide delete button
  return <RegisterSupportDetailView id={id} hideScores={true} readOnly={false} hideDelete={true} />;
}
