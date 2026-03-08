import { MongoClient } from 'mongodb';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

async function getRecentSubmissions() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);

    // Get recent register100 submissions
    const register100 = await database
      .collection('register100_submissions')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Get recent register-support submissions
    const registerSupport = await database
      .collection('register_support_submissions')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Combine and sort by date
    const combined = [
      ...register100.map((doc) => ({
        ...doc,
        type: 'register100' as const,
        typeName: 'โรงเรียน 100%',
      })),
      ...registerSupport.map((doc) => ({
        ...doc,
        type: 'register-support' as const,
        typeName: 'โรงเรียนสนับสนุนฯ',
      })),
    ]
      .sort((a, b) => {
        const dateA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
        const dateB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 10);

    return combined;
  } catch (error) {
    console.error('Error fetching recent submissions:', error);
    return [];
  } finally {
    await client.close();
  }
}

export default async function RecentSubmissions() {
  const submissions = await getRecentSubmissions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>รายการล่าสุด</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  โรงเรียน
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  ประเภท
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  จังหวัด
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  วันที่
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  คะแนน
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    ยังไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr
                    key={submission._id.toString()}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {(submission as any).schoolName || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          submission.type === 'register100'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {submission.typeName}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {(submission as any).province || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {(submission as any).createdAt
                        ? new Date((submission as any).createdAt).toLocaleDateString('th-TH', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          })
                        : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {(submission as any).totalScore || 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/dcp-admin/dashboard/${submission.type}/${submission._id}`}
                      >
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
