import { MongoClient } from 'mongodb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { School, Music, TrendingUp, Award } from 'lucide-react';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

async function getStats() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);

    // Count register100 schools
    const register100Count = await database
      .collection('register100_submissions')
      .countDocuments();

    // Count register-support schools
    const registerSupportCount = await database
      .collection('register_support_submissions')
      .countDocuments();

    // Count certificates
    const certificatesCount = await database
      .collection('certificates')
      .countDocuments({ isActive: true });

    // Calculate total score (example - you may want to adjust this)
    const register100Submissions = await database
      .collection('register100_submissions')
      .find({}, { projection: { reg100_total_score: 1 } })
      .toArray();

    const registerSupportSubmissions = await database
      .collection('register_support_submissions')
      .find({}, { projection: { regsup_total_score: 1 } })
      .toArray();

    const totalScore =
      register100Submissions.reduce((sum, doc) => sum + (doc.reg100_total_score || 0), 0) +
      registerSupportSubmissions.reduce((sum, doc) => sum + (doc.regsup_total_score || 0), 0);

    return {
      register100Count,
      registerSupportCount,
      totalScore,
      certificatesCount,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      register100Count: 0,
      registerSupportCount: 0,
      totalScore: 0,
      certificatesCount: 0,
    };
  } finally {
    await client.close();
  }
}

export default async function DashboardStats() {
  const stats = await getStats();

  const cards = [
    {
      title: 'โรงเรียน 100%',
      value: stats.register100Count,
      icon: School,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'โรงเรียนสนับสนุนฯ',
      value: stats.registerSupportCount,
      icon: Music,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'คะแนนรวม',
      value: stats.totalScore.toLocaleString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'ใบประกาศออกแล้ว',
      value: stats.certificatesCount,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
