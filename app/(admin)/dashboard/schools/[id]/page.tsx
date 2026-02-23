export default function SchoolDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">รายละเอียดโรงเรียน</h1>
      <p className="text-gray-600">School ID: {params.id}</p>
      {/* School details aligned with register form will be implemented here */}
    </div>
  )
}
