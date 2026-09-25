import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { createActivityLog, getActivityLogs, getActivityStats } from '@/lib/activityLog';
import { ActivityLog } from '@/lib/types/activityLog';

/**
 * GET /api/activity-logs
 * ดึงรายการ activity logs พร้อม filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    // ต้อง login และเป็น admin role เท่านั้น
    if (!session || !['root', 'admin', 'super_admin'].includes(session.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const userId = searchParams.get('userId') || undefined;
    const schoolId = searchParams.get('schoolId') || undefined;
    const activityType = searchParams.get('activityType') as ActivityLog['activityType'] | undefined;
    const startDate = searchParams.get('startDate') 
      ? new Date(searchParams.get('startDate')!) 
      : undefined;
    const endDate = searchParams.get('endDate') 
      ? new Date(searchParams.get('endDate')!) 
      : undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const stats = searchParams.get('stats') === 'true';

    // ถ้าขอ stats
    if (stats) {
      const statistics = await getActivityStats({
        startDate,
        endDate,
        schoolId,
      });

      return NextResponse.json({
        success: true,
        data: statistics,
      });
    }

    // ดึงข้อมูล logs
    const result = await getActivityLogs({
      userId,
      schoolId,
      activityType,
      startDate,
      endDate,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in GET /api/activity-logs:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch activity logs',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/activity-logs
 * บันทึก activity log (ใช้สำหรับ manual logging จาก client side)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { activityType, description, metadata } = body;

    if (!activityType || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: activityType, description' },
        { status: 400 }
      );
    }

    // ดึง IP และ User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // บันทึก log
    await createActivityLog({
      userId: session.userId,
      userName: `${session.firstName} ${session.lastName}`,
      schoolId: session.schoolId,
      schoolName: session.schoolName,
      activityType,
      description,
      metadata,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: 'Activity logged successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/activity-logs:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create activity log',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
