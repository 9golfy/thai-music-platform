export interface ActivityLog {
  _id?: string;
  userId: string;
  userName?: string;
  schoolId?: string;
  schoolName?: string;
  activityType: 'LOGIN' | 'LOGOUT' | 'CERTIFICATE_VIEW' | 'CERTIFICATE_DOWNLOAD' | 'PROFILE_UPDATE' | 'PASSWORD_CHANGE' | 'OTHER';
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface ActivityLogFilter {
  userId?: string;
  schoolId?: string;
  activityType?: ActivityLog['activityType'];
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface ActivityLogResponse {
  logs: ActivityLog[];
  total: number;
  page: number;
  totalPages: number;
}
