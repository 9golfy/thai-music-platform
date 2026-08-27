// Rate Limiter for PDF Generation
// Prevents server overload by limiting concurrent PDF generation

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class PDFRateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequestsPerMinute = 2; // Max 2 PDF generation per minute per IP
  private readonly windowMs = 60 * 1000; // 1 minute
  private activePDFGenerations = 0;
  private readonly maxConcurrentGenerations = 2; // Max 2 concurrent PDF generations globally

  checkRateLimit(ip: string): { allowed: boolean; message?: string } {
    const now = Date.now();
    const entry = this.requests.get(ip);

    // Clean up old entries
    if (entry && now > entry.resetTime) {
      this.requests.delete(ip);
    }

    // Check concurrent generation limit
    if (this.activePDFGenerations >= this.maxConcurrentGenerations) {
      return {
        allowed: false,
        message: `Server กำลังสร้าง PDF อยู่ ${this.activePDFGenerations} รายการ กรุณารอสักครู่`,
      };
    }

    // Get or create entry
    const currentEntry = this.requests.get(ip) || {
      count: 0,
      resetTime: now + this.windowMs,
    };

    // Check if exceeded
    if (currentEntry.count >= this.maxRequestsPerMinute) {
      const waitTime = Math.ceil((currentEntry.resetTime - now) / 1000);
      return {
        allowed: false,
        message: `กรุณารออีก ${waitTime} วินาที ก่อนสร้าง PDF ใหม่`,
      };
    }

    // Increment count
    currentEntry.count++;
    this.requests.set(ip, currentEntry);

    return { allowed: true };
  }

  startGeneration(): void {
    this.activePDFGenerations++;
    console.log(`📊 Active PDF generations: ${this.activePDFGenerations}`);
  }

  endGeneration(): void {
    this.activePDFGenerations--;
    console.log(`📊 Active PDF generations: ${this.activePDFGenerations}`);
  }

  getStats() {
    return {
      activeGenerations: this.activePDFGenerations,
      maxConcurrent: this.maxConcurrentGenerations,
    };
  }
}

export const pdfRateLimiter = new PDFRateLimiter();
