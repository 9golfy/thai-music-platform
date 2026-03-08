import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth/password';

/**
 * POST /api/admin/setup
 * 
 * Emergency endpoint to create super admin
 * Only works if no admin exists or with special setup key
 */
export async function POST(request: NextRequest) {
  try {
    const { setupKey, email, password, firstName, lastName } = await request.json();

    // Security check - only allow if setup key matches or no admin exists
    const expectedSetupKey = process.env.SETUP_KEY || 'thai-music-setup-2024';
    
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if any admin exists
    const existingAdmin = await usersCollection.findOne({ role: 'admin' });
    
    if (existingAdmin && setupKey !== expectedSetupKey) {
      return NextResponse.json(
        { success: false, error: 'Setup not allowed - admin exists and invalid setup key' },
        { status: 403 }
      );
    }

    // Default admin data
    const adminData = {
      email: email || 'root@thaimusic.com',
      password: password || 'admin123',
      firstName: firstName || 'Super',
      lastName: lastName || 'Admin'
    };

    // Hash password
    const hashedPassword = await hashPassword(adminData.password);

    // Create or update admin
    const result = await usersCollection.updateOne(
      { email: adminData.email.toLowerCase() },
      {
        $set: {
          email: adminData.email.toLowerCase(),
          password: hashedPassword,
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          role: 'admin',
          phone: '0800000000',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Super admin created/updated successfully',
      admin: {
        email: adminData.email,
        name: `${adminData.firstName} ${adminData.lastName}`,
        role: 'admin'
      },
      loginUrl: '/dcp-admin'
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Setup failed'
      },
      { status: 500 }
    );
  }
}