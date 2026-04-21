/**
 * Calculate grade based on total score (out of 180)
 * New grading criteria for register-support:
 * 1 = A (ระดับดีเด่น): 144 ขึ้นไป
 * 2 = B (ระดับดีมาก): 126-143 คะแนน
 * 3 = C (ระดับดี): 108-125 คะแนน
 * 4 = D (ระดับชมเชย): 90-107 คะแนน
 * 5 = F (ต่ำกว่าเกณฑ์): 0-89 คะแนน
 * 
 * @param score - Total score (Part 1 + Part 2)
 * @param maxScore - Maximum possible score (default: 180)
 * @returns Grade letter (A, B, C, D, F)
 */
export function calculateGrade(score: number, maxScore: number = 180): string {
  // Use actual score, not percentage
  if (score >= 144) return 'A';      // 144 ขึ้นไป - ระดับดีเด่น
  if (score >= 126) return 'B';      // 126-143 - ระดับดีมาก
  if (score >= 108) return 'C';      // 108-125 - ระดับดี
  if (score >= 90) return 'D';       // 90-107 - ระดับชมเชย
  return 'F';                        // 0-89 - ต่ำกว่าเกณฑ์
}

/**
 * Calculate grade for Register100 (different criteria)
 * 1 = A (ระดับดีเด่น): 160 ขึ้นไป
 * 2 = B (ระดับดีมาก): 140-159 คะแนน
 * 3 = C (ระดับดี): 120-139 คะแนน
 * 4 = D (ระดับชมเชย): 100-119 คะแนน
 * 5 = F (ต่ำกว่าเกณฑ์): 0-99 คะแนน
 * 
 * @param score - Total score (Part 1 + Part 2)
 * @returns Grade letter (A, B, C, D, F)
 */
export function calculateGradeRegister100(score: number): string {
  if (score >= 160) return 'A';      // 160 ขึ้นไป - ระดับดีเด่น
  if (score >= 140) return 'B';      // 140-159 - ระดับดีมาก
  if (score >= 120) return 'C';      // 120-139 - ระดับดี
  if (score >= 100) return 'D';      // 100-119 - ระดับชมเชย
  return 'F';                        // 0-99 - ต่ำกว่าเกณฑ์
}

/**
 * Get grade color for display
 * @param grade - Grade letter
 * @returns Tailwind color class
 */
export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'text-green-600';      // 145-180 - สีเขียว (ระดับดีเด่น)
    case 'B':
      return 'text-blue-600';       // 126-144 - สีน้ำเงิน (ระดับดีมาก)
    case 'C':
      return 'text-orange-600';     // 109-125 - สีส้ม (ระดับดี)
    case 'D':
      return 'text-yellow-600';     // 90-108 - สีเหลือง (ระดับชมเชย)
    case 'F':
      return 'text-red-600';        // 0-89 - สีแดง (ต่ำกว่าเกณฑ์)
    default:
      return 'text-gray-600';
  }
}

/**
 * Get grade background color for display
 * @param grade - Grade letter
 * @returns Tailwind background color class
 */
export function getGradeBgColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'bg-green-50';         // 145-180 - สีเขียว (ระดับดีเด่น)
    case 'B':
      return 'bg-blue-50';          // 126-144 - สีน้ำเงิน (ระดับดีมาก)
    case 'C':
      return 'bg-orange-50';        // 109-125 - สีส้ม (ระดับดี)
    case 'D':
      return 'bg-yellow-50';        // 90-108 - สีเหลือง (ระดับชมเชย)
    case 'F':
      return 'bg-red-50';           // 0-89 - สีแดง (ต่ำกว่าเกณฑ์)
    default:
      return 'bg-gray-50';
  }
}

/**
 * Get full grade name in Thai
 * @param grade - Grade letter
 * @returns Full grade name in Thai
 */
export function getGradeNameThai(grade: string): string {
  switch (grade) {
    case 'A':
      return 'ระดับดีเด่น';
    case 'B':
      return 'ระดับดีมาก';
    case 'C':
      return 'ระดับดี';
    case 'D':
      return 'ระดับชมเชย';
    case 'F':
      return 'ต่ำกว่าเกณฑ์';
    default:
      return 'ไม่ระบุ';
  }
}
