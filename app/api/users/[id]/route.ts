// Users API - Get, Update, Delete by ID
import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getSession } from '@/lib/auth/session';
import { hashPassword } from '@/lib/auth/password';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

// GET - Get user by ID
export async function GET(
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
    const usersCollection = database.collection('users');

    const user = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบผู้ใช้งาน' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        _id: user._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// PUT - Update user
export async function PUT(
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
    const body = await request.json();
    const { firstName, lastName, phone, email, role, isActive, profileImage, schoolId } = body;

    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection('users');

    // Check if user exists
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบผู้ใช้งาน' },
        { status: 404 }
      );
    }

    // Only root can change role or update root users
    if (session.role !== 'root' && (role || user.role === 'root')) {
      return NextResponse.json(
        { success: false, message: 'ไม่มีสิทธิ์แก้ไขข้อมูลนี้' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email.toLowerCase();
    if (role && session.role === 'root') updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (profileImage) updateData.profileImage = profileImage;
    if (schoolId !== undefined) updateData.schoolId = schoolId; // Allow empty string to clear schoolId

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบผู้ใช้งาน' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'อัปเดตข้อมูลสำเร็จ',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// DELETE - Delete user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  // Only root can delete users
  if (!session || session.role !== 'root') {
    return NextResponse.json(
      { success: false, message: 'Only root can delete users' },
      { status: 403 }
    );
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection('users');

    // Check if user is root
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบผู้ใช้งาน' },
        { status: 404 }
      );
    }

    if (user.role === 'root') {
      return NextResponse.json(
        { success: false, message: 'ไม่สามารถลบ Root user ได้' },
        { status: 403 }
      );
    }

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบผู้ใช้งาน' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบผู้ใช้งานสำเร็จ',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
