// Certificates API - Get and Delete by ID
import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getSession } from '@/lib/auth/session';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

// GET - Get certificate by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const certificatesCollection = database.collection('certificates');

    const certificate = await certificatesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!certificate) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบใบประกาศ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate: {
        ...certificate,
        _id: certificate._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch certificate' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// DELETE - Delete certificate
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  if (!session || !['root', 'admin'].includes(session.role)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const certificatesCollection = database.collection('certificates');

    const result = await certificatesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบใบประกาศ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบใบประกาศสำเร็จ',
    });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบใบประกาศ' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
