import { connectToDatabase } from './mongodb';
import { ActivityLog, ActivityLogFilter, ActivityLogResponse } from './types/activityLog';

const COLLECTION_NAME = 'activity_logs';

/**
 * บันทึก activity log
 */
export async function createActivityLog(
  log: Omit<ActivityLog, '_id' | 'createdAt'>
): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ActivityLog>(COLLECTION_NAME);

    await collection.insertOne({
      ...log,
      createdAt: new Date(),
    } as ActivityLog);

    console.log('✅ Activity log created:', log.activityType, log.userId);
  } catch (error) {
    console.error('❌ Error creating activity log:', error);
    // ไม่ throw error เพื่อไม่ให้กระทบต่อ flow หลัก
  }
}

/**
 * ดึง activity logs พร้อม filtering และ pagination
 */
export async function getActivityLogs(
  filter: ActivityLogFilter = {}
): Promise<ActivityLogResponse> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ActivityLog>(COLLECTION_NAME);

    // สร้าง query filter
    const query: any = {};

    if (filter.userId) {
      query.userId = filter.userId;
    }

    if (filter.schoolId) {
      query.schoolId = filter.schoolId;
    }

    if (filter.activityType) {
      query.activityType = filter.activityType;
    }

    if (filter.startDate || filter.endDate) {
      query.createdAt = {};
      if (filter.startDate) {
        query.createdAt.$gte = filter.startDate;
      }
      if (filter.endDate) {
        query.createdAt.$lte = filter.endDate;
      }
    }

    // Pagination
    const page = filter.page || 1;
    const limit = filter.limit || 50;
    const skip = (page - 1) * limit;

    // นับจำนวนทั้งหมด
    const total = await collection.countDocuments(query);

    // ดึงข้อมูล
    const logs = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('❌ Error getting activity logs:', error);
    throw error;
  }
}

/**
 * นับจำนวน activities แยกตาม type
 */
export async function getActivityStats(filter: {
  startDate?: Date;
  endDate?: Date;
  schoolId?: string;
}) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ActivityLog>(COLLECTION_NAME);

    const matchStage: any = {};

    if (filter.startDate || filter.endDate) {
      matchStage.createdAt = {};
      if (filter.startDate) {
        matchStage.createdAt.$gte = filter.startDate;
      }
      if (filter.endDate) {
        matchStage.createdAt.$lte = filter.endDate;
      }
    }

    if (filter.schoolId) {
      matchStage.schoolId = filter.schoolId;
    }

    const stats = await collection
      .aggregate([
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
        {
          $group: {
            _id: '$activityType',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            activityType: '$_id',
            count: 1,
          },
        },
      ])
      .toArray();

    return stats;
  } catch (error) {
    console.error('❌ Error getting activity stats:', error);
    throw error;
  }
}

/**
 * ดึง recent activities ของ user
 */
export async function getUserRecentActivities(
  userId: string,
  limit: number = 10
): Promise<ActivityLog[]> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ActivityLog>(COLLECTION_NAME);

    const logs = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return logs;
  } catch (error) {
    console.error('❌ Error getting user recent activities:', error);
    throw error;
  }
}
