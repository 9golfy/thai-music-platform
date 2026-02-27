import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');

    const submission = await collection.findOne({ _id: new ObjectId(id) });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูล' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      submission: {
        ...submission,
        _id: submission._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลที่ต้องการลบ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบข้อมูลสำเร็จ',
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการลบข้อมูล',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = new MongoClient(uri);

  try {
    const body = await request.json();
    console.log('PUT request body:', JSON.stringify(body, null, 2));

    // ลบ _id ออกจาก body ก่อน update เพราะ MongoDB ไม่อนุญาตให้แก้ไข _id
    const { _id, ...updateData } = body;

    // Clean up data - remove any nested ObjectId or invalid MongoDB types
    const cleanData = JSON.parse(JSON.stringify(updateData));

    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');

    console.log('Updating document with ID:', id);
    console.log('Update data:', JSON.stringify(cleanData, null, 2));

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...cleanData,
          updatedAt: new Date(),
        },
      }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลที่ต้องการแก้ไข' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'แก้ไขข้อมูลสำเร็จ',
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}