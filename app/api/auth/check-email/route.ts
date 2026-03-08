import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const DB_NAME = 'thai_music_school';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const database = client.db(DB_NAME);
    
    // Check in both collections
    const register100Collection = database.collection('register100_submissions');
    const registerSupportCollection = database.collection('register_support_submissions');

    const [register100User, registerSupportUser] = await Promise.all([
      register100Collection.findOne({ 
        $or: [
          { 'teacherEmail': email },
          { 'thaiMusicTeachers.teacherEmail': email }
        ]
      }),
      registerSupportCollection.findOne({ 
        $or: [
          { 'teacherEmail': email },
          { 'thaiMusicTeachers.teacherEmail': email }
        ]
      })
    ]);

    await client.close();

    const exists = !!(register100User || registerSupportUser);

    return NextResponse.json({
      exists,
      message: exists ? 'Email already exists in system' : 'Email is available'
    });

  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}