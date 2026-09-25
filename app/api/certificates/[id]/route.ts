// Certificates API - Get and Delete by ID
import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getSession } from '@/lib/auth/session';
import { createActivityLog } from '@/lib/activityLog';

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

    // Log certificate activity based on intent
    const session = await getSession();
    if (session) {
      const url = new URL(request.url);
      const intent = url.searchParams.get('intent'); // 'download' or null
      
      const ipAddress = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';

      // Determine activity type based on intent
      const activityType = intent === 'download' ? 'CERTIFICATE_DOWNLOAD' : 'CERTIFICATE_VIEW';
      const description = intent === 'download' 
        ? `ดาวน์โหลดใบประกาศ: ${certificate.schoolName} (${certificate.certificateNumber || 'N/A'})`
        : `เปิดดูใบประกาศ: ${certificate.schoolName} (${certificate.certificateNumber || 'N/A'})`;

      await createActivityLog({
        userId: session.userId,
        userName: `${session.firstName} ${session.lastName}`,
        schoolId: session.schoolId,
        schoolName: session.schoolName,
        activityType,
        description,
        metadata: {
          certificateId: certificate._id.toString(),
          certificateNumber: certificate.certificateNumber,
          schoolName: certificate.schoolName,
          certificateType: certificate.certificateType,
          intent: intent || 'view',
        },
        ipAddress,
        userAgent,
      });
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

  if (!session || !['root', 'admin', 'super_admin'].includes(session.role)) {
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
