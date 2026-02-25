import RegisterSupportDetailView from '@/components/admin/RegisterSupportDetailView';

export default async function RegisterSupportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RegisterSupportDetailView id={id} />;
}
