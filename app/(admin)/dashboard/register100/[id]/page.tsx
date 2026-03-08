import Register100DetailView from '@/components/admin/Register100DetailView';

export default async function Register100DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Register100DetailView id={id} />;
}
