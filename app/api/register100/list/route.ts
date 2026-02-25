import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

export async function GET() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register100_submissions');

    // Get all submissions sorted by createdAt descending (newest first)
    const submissions = await collection
      .find({})
      .sort({ createdAt: -1, _id: -1 })
      .toArray();

    // Convert ObjectId to string
    const formattedSubmissions = submissions.map(sub => ({
      ...sub,
      _id: sub._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      submissions: formattedSubmissions,
      count: formattedSubmissions.length,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
