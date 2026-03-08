// Email rate limit status API for admin monitoring
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getRateLimitStatus } from '@/lib/email/rateLimiter';

export async function GET() {
  try {
    // Check if user is admin
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'root')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get rate limit status
    const status = getRateLimitStatus();
    
    // Calculate overall health
    const maxPercentage = Math.max(
      status.daily.percentage,
      status.hourly.percentage,
      status.minute.percentage
    );
    
    let health: 'good' | 'warning' | 'critical';
    if (maxPercentage < 70) {
      health = 'good';
    } else if (maxPercentage < 90) {
      health = 'warning';
    } else {
      health = 'critical';
    }

    return NextResponse.json({
      success: true,
      status,
      health,
      timestamp: new Date().toISOString(),
      recommendations: getRecommendations(status),
    });
  } catch (error) {
    console.error('Error getting email status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get email status' },
      { status: 500 }
    );
  }
}

function getRecommendations(status: ReturnType<typeof getRateLimitStatus>): string[] {
  const recommendations: string[] = [];
  
  if (status.daily.percentage > 80) {
    recommendations.push('Daily limit nearly reached - consider upgrading email service');
  }
  
  if (status.hourly.percentage > 80) {
    recommendations.push('Hourly limit nearly reached - emails may be delayed');
  }
  
  if (status.minute.percentage > 80) {
    recommendations.push('Minute limit nearly reached - implement email queuing');
  }
  
  if (status.daily.percentage > 50) {
    recommendations.push('Consider implementing email templates to reduce content size');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Email system operating normally');
  }
  
  return recommendations;
}