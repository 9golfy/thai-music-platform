import { MongoClient } from 'mongodb';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

async function getSchoolData(schoolId: string) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);

    // Try register100 first
    let collection = database.collection('register100_submissions');
    let school = await collection.findOne({ schoolId: schoolId });
    let type = 'register100';

    // If not found, try register_support
    if (!school) {
      collection = database.collection('register_support_submissions');
      school = await collection.findOne({ schoolId: schoolId });
      type = 'register-support';
    }

    if (!school) {
      return null;
    }

    return {
      _id: school._id.toString(),
      type,
    };
  } catch (error) {
    console.error('Error fetching school data:', error);
    return null;
  } finally {
    await client.close();
  }
}

export default async function SchoolInfoPage() {
  const session = await getSession();

  if (!session || !session.schoolId) {
    redirect('/teacher-login');
  }

  const school = await getSchoolData(session.schoolId);

  if (!school) {
    redirect('/teacher/dashboard');
  }

  // Redirect to the detail view
  redirect(`/teacher/dashboard/${school.type}/${school._id}`);
}
