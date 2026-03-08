import { MongoClient, ObjectId } from 'mongodb';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import TeacherRegisterSupportDetailView from '@/components/teacher/TeacherRegisterSupportDetailView';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

async function getSubmission(id: string, schoolId: string) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');

    const submission = await collection.findOne({
      _id: new ObjectId(id),
      schoolId: schoolId, // Ensure teacher can only view their own school
    });

    if (!submission) {
      return null;
    }

    return {
      ...submission,
      _id: submission._id.toString(),
    };
  } catch (error) {
    console.error('Error fetching submission:', error);
    return null;
  } finally {
    await client.close();
  }
}

export default async function TeacherRegisterSupportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;

  if (!session || session.role !== 'teacher' || !session.schoolId) {
    redirect('/teacher-login');
  }

  const submission = await getSubmission(id, session.schoolId);

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบข้อมูล</h1>
          <p className="text-gray-600">ไม่พบข้อมูลการสมัครหรือคุณไม่มีสิทธิ์เข้าถึง</p>
        </div>
      </div>
    );
  }

  return <TeacherRegisterSupportDetailView id={id} initialData={submission} />;
}
