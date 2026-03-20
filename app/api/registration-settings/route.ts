import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasRole } from '@/lib/auth/session';
import {
  getRegistrationSettings,
  RegistrationPageKey,
  updateRegistrationStatus,
} from '@/lib/registration-settings';

export async function GET() {
  try {
    const settings = await getRegistrationSettings();

    return NextResponse.json({
      success: true,
      settings: {
        register100Open: settings.register100Open,
        registerSupportOpen: settings.registerSupportOpen,
        updatedAt: settings.updatedAt,
        updatedBy: settings.updatedBy || null,
      },
    });
  } catch (error) {
    console.error('Registration settings GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load registration settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!hasRole(session, ['root', 'admin', 'super_admin'])) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const page = body?.page as RegistrationPageKey;
    const isOpen = body?.isOpen;

    if (!['register100', 'register-support'].includes(page) || typeof isOpen !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Invalid payload' },
        { status: 400 }
      );
    }

    const settings = await updateRegistrationStatus(
      page,
      isOpen,
      session ? `${session.firstName} ${session.lastName}` : undefined
    );

    return NextResponse.json({
      success: true,
      settings: {
        register100Open: settings.register100Open,
        registerSupportOpen: settings.registerSupportOpen,
        updatedAt: settings.updatedAt,
        updatedBy: settings.updatedBy || null,
      },
    });
  } catch (error) {
    console.error('Registration settings PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update registration settings' },
      { status: 500 }
    );
  }
}
