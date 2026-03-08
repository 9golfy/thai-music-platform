// Email rate limiting service
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class EmailRateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  
  // Gmail limits: 500 emails per day, 100 per hour for free accounts
  // We'll be more conservative: 300 per day, 50 per hour
  private readonly DAILY_LIMIT = 300;
  private readonly HOURLY_LIMIT = 50;
  private readonly MINUTE_LIMIT = 5; // Burst protection
  
  /**
   * Check if we can send an email without exceeding rate limits
   */
  canSendEmail(type: 'daily' | 'hourly' | 'minute' = 'minute'): boolean {
    const now = Date.now();
    const key = this.getKey(type, now);
    const entry = this.limits.get(key);
    
    if (!entry) {
      return true; // No previous sends in this period
    }
    
    // Check if the period has reset
    if (now >= entry.resetTime) {
      this.limits.delete(key);
      return true;
    }
    
    // Check against limit
    const limit = this.getLimit(type);
    return entry.count < limit;
  }
  
  /**
   * Record an email send and update counters
   */
  recordEmailSent(type: 'daily' | 'hourly' | 'minute' = 'minute'): void {
    const now = Date.now();
    const key = this.getKey(type, now);
    const entry = this.limits.get(key);
    
    if (!entry || now >= entry.resetTime) {
      // Create new entry or reset expired one
      this.limits.set(key, {
        count: 1,
        resetTime: this.getResetTime(type, now),
      });
    } else {
      // Increment existing entry
      entry.count++;
    }
  }
  
  /**
   * Get current usage statistics
   */
  getUsageStats(): {
    daily: { used: number; limit: number; resetTime: number };
    hourly: { used: number; limit: number; resetTime: number };
    minute: { used: number; limit: number; resetTime: number };
  } {
    const now = Date.now();
    
    return {
      daily: this.getUsageForPeriod('daily', now),
      hourly: this.getUsageForPeriod('hourly', now),
      minute: this.getUsageForPeriod('minute', now),
    };
  }
  
  /**
   * Check all rate limits before sending
   */
  checkAllLimits(): { canSend: boolean; blockedBy?: string; resetTime?: number } {
    const checks = [
      { type: 'minute' as const, name: 'minute' },
      { type: 'hourly' as const, name: 'hourly' },
      { type: 'daily' as const, name: 'daily' },
    ];
    
    for (const check of checks) {
      if (!this.canSendEmail(check.type)) {
        const key = this.getKey(check.type, Date.now());
        const entry = this.limits.get(key);
        return {
          canSend: false,
          blockedBy: check.name,
          resetTime: entry?.resetTime,
        };
      }
    }
    
    return { canSend: true };
  }
  
  /**
   * Record email send for all periods
   */
  recordEmailSentAll(): void {
    this.recordEmailSent('minute');
    this.recordEmailSent('hourly');
    this.recordEmailSent('daily');
  }
  
  private getKey(type: 'daily' | 'hourly' | 'minute', timestamp: number): string {
    const date = new Date(timestamp);
    
    switch (type) {
      case 'daily':
        return `daily-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      case 'hourly':
        return `hourly-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
      case 'minute':
        return `minute-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
    }
  }
  
  private getLimit(type: 'daily' | 'hourly' | 'minute'): number {
    switch (type) {
      case 'daily': return this.DAILY_LIMIT;
      case 'hourly': return this.HOURLY_LIMIT;
      case 'minute': return this.MINUTE_LIMIT;
    }
  }
  
  private getResetTime(type: 'daily' | 'hourly' | 'minute', timestamp: number): number {
    const date = new Date(timestamp);
    
    switch (type) {
      case 'daily':
        // Reset at midnight
        const tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow.getTime();
        
      case 'hourly':
        // Reset at next hour
        const nextHour = new Date(date);
        nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
        return nextHour.getTime();
        
      case 'minute':
        // Reset at next minute
        const nextMinute = new Date(date);
        nextMinute.setMinutes(nextMinute.getMinutes() + 1, 0, 0);
        return nextMinute.getTime();
    }
  }
  
  private getUsageForPeriod(type: 'daily' | 'hourly' | 'minute', timestamp: number) {
    const key = this.getKey(type, timestamp);
    const entry = this.limits.get(key);
    const limit = this.getLimit(type);
    
    if (!entry || timestamp >= entry.resetTime) {
      return { used: 0, limit, resetTime: this.getResetTime(type, timestamp) };
    }
    
    return { used: entry.count, limit, resetTime: entry.resetTime };
  }
}

// Singleton instance
export const emailRateLimiter = new EmailRateLimiter();

/**
 * Enhanced send email function with rate limiting
 */
export async function sendEmailWithRateLimit(
  emailFunction: () => Promise<boolean>,
  priority: 'high' | 'medium' | 'low' = 'medium'
): Promise<{ success: boolean; error?: string; rateLimited?: boolean }> {
  // Check rate limits
  const limitCheck = emailRateLimiter.checkAllLimits();
  
  if (!limitCheck.canSend) {
    const resetTime = limitCheck.resetTime ? new Date(limitCheck.resetTime) : null;
    const resetTimeStr = resetTime ? resetTime.toLocaleString('th-TH') : 'ไม่ทราบ';
    
    console.warn(`📧 Email rate limited by ${limitCheck.blockedBy}, reset at: ${resetTimeStr}`);
    
    // For high priority emails, we might want to queue them
    if (priority === 'high') {
      console.log('📧 High priority email blocked by rate limit - consider implementing queue');
    }
    
    return {
      success: false,
      error: `Rate limited by ${limitCheck.blockedBy} limit. Reset at: ${resetTimeStr}`,
      rateLimited: true,
    };
  }
  
  try {
    // Send the email
    const success = await emailFunction();
    
    if (success) {
      // Record successful send
      emailRateLimiter.recordEmailSentAll();
      console.log('📧 Email sent successfully, rate limits updated');
    }
    
    return { success };
  } catch (error) {
    console.error('📧 Email send failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get current rate limit status for monitoring
 */
export function getRateLimitStatus() {
  const stats = emailRateLimiter.getUsageStats();
  
  return {
    daily: {
      used: stats.daily.used,
      limit: stats.daily.limit,
      remaining: stats.daily.limit - stats.daily.used,
      resetTime: new Date(stats.daily.resetTime).toLocaleString('th-TH'),
      percentage: Math.round((stats.daily.used / stats.daily.limit) * 100),
    },
    hourly: {
      used: stats.hourly.used,
      limit: stats.hourly.limit,
      remaining: stats.hourly.limit - stats.hourly.used,
      resetTime: new Date(stats.hourly.resetTime).toLocaleString('th-TH'),
      percentage: Math.round((stats.hourly.used / stats.hourly.limit) * 100),
    },
    minute: {
      used: stats.minute.used,
      limit: stats.minute.limit,
      remaining: stats.minute.limit - stats.minute.used,
      resetTime: new Date(stats.minute.resetTime).toLocaleString('th-TH'),
      percentage: Math.round((stats.minute.used / stats.minute.limit) * 100),
    },
  };
}