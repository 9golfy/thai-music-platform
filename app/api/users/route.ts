// Users API - List and Create
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getSession } from '@/lib/auth/session';
import { hashPassword, generateSchoolId } from '@/lib/auth/password';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

// GET - List all users
export async function GET() {
  const session = await getSession();

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
    const usersCollection = database.collection('users');

    const users = await usersCollection
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        ...user,
        _id: user._id.toString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST - Create new user
export async function POST(request: Request) {
  const session = await getSession();

  // Only root and super_admin can create users
  if (!session || (session.role !== 'root' && session.role !== 'super_admin')) {
    return NextResponse.json(
      { success: false, message: 'Only root and super_admin can create users' },
      { status: 403 }
    );
  }

  const client = new MongoClient(uri);

  try {
    const body = await request.json();
    const { email, password, role, firstName, lastName, phone, schoolId } = body;

    // Validate required fields
    if (!email || !password || !role || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['root', 'admin', 'teacher'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Role ไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // Teacher must have schoolId
    if (role === 'teacher' && !schoolId) {
      return NextResponse.json(
        { success: false, message: 'ครูต้องระบุ School ID' },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection('users');

    // Check if email already exists
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email นี้ถูกใช้งานแล้ว' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = {
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      firstName,
      lastName,
      phone,
      schoolId: role === 'teacher' ? schoolId : undefined,
      profileImage: body.profileImage || undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json({
      success: true,
      message: 'สร้างผู้ใช้งานสำเร็จ',
      userId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
