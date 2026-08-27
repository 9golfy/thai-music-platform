import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const { schoolId } = await params;
    
    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: 'School ID is required' },
        { status: 400 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db(dbName);
    
    // Try to find in register100 first
    const register100Collection = database.collection('register100_submissions');
    let submission = await register100Collection.findOne({ schoolId: schoolId });
    let type: 'register100' | 'register-support' | null = submission ? 'register100' : null;
    
    // If not found, try register-support (correct collection name with underscore)
    if (!submission) {
      const registerSupportCollection = database.collection('register_support_submissions');
      submission = await registerSupportCollection.findOne({ schoolId: schoolId });
      type = submission ? 'register-support' : null;
    }
    
    await client.close();
    
    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลโรงเรียน' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      submission,
      type,
    });
  } catch (error) {
    console.error('Error fetching school data:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}
